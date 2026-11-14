/**
 * Classroom / teacher-mode API (M15), running as a Cloudflare Pages Function backed by D1.
 *
 * Auth model
 *  - Teacher: signs in with Google (GIS access token). We verify the token with Google
 *    (audience must be one of GOOGLE_CLIENT_IDS), then issue our own random session token.
 *  - Student: joins with a class code + display name and receives a random secret token.
 *  Only SHA-256 hashes of tokens are stored. No student email / account data is collected.
 */
import { z } from 'zod';
import {
  ExerciseSetInputSchema,
  SET_LESSON_RE,
  isSetLessonId,
  setIdFromLessonId,
  setLessonId,
} from '../src/content/schema/teacherSet';

// ───────────── Minimal D1 typings (avoids pulling @cloudflare/workers-types) ─────────────
export interface D1Result<T = Record<string, unknown>> {
  results: T[];
  meta: { changes?: number };
}
export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}
export interface D1Database {
  prepare(sql: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
}
export interface Env {
  DB: D1Database;
  GOOGLE_CLIENT_IDS?: string;
}

// ───────────── Helpers ─────────────
const DAY = 24 * 60 * 60 * 1000;
export const SESSION_TTL_MS = 30 * DAY;
export const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no I, L, O, 0, 1
export const LESSON_ID_RE = /^(phy-|bio-)?g[6-9]-b\d{2}$/;

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function randomToken(bytes = 32): string {
  const arr = crypto.getRandomValues(new Uint8Array(bytes));
  return btoa(String.fromCharCode(...arr)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function generateClassCode(random: (n: number) => Uint8Array = (n) => crypto.getRandomValues(new Uint8Array(n))): string {
  const bytes = random(6);
  let out = '';
  for (const b of bytes) out += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return out;
}

/** Normalise what a student types: upper-case, drop spaces and dashes ("abc 23x" -> "ABC23X"). */
const SET_ID_ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789';
export function generateSetId(random: (n: number) => Uint8Array = (n) => crypto.getRandomValues(new Uint8Array(n))): string {
  return Array.from(random(10), (b) => SET_ID_ALPHABET[b % SET_ID_ALPHABET.length]).join('');
}

export function normalizeClassCode(raw: string): string {
  return raw.toUpperCase().replace(/[\s-]/g, '');
}

function bearer(req: Request): string | null {
  const h = req.headers.get('authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

async function body<T>(req: Request, schema: z.ZodType<T>): Promise<T> {
  let data: unknown;
  try {
    data = await req.json();
  } catch {
    throw new HttpError(400, 'Dữ liệu gửi lên không hợp lệ.');
  }
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw new HttpError(400, parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.');
  return parsed.data;
}

// ───────────── Input schemas ─────────────
const displayName = z
  .string()
  .trim()
  .min(1, 'Hãy nhập tên hiển thị.')
  .max(40, 'Tên hiển thị tối đa 40 kí tự.');

export const TeacherLoginSchema = z.object({ accessToken: z.string().min(10).max(4096) });
export const CreateClassSchema = z.object({
  name: z.string().trim().min(1, 'Hãy đặt tên lớp.').max(60),
  grade: z.number({ invalid_type_error: 'Lớp phải là số.' }).int().min(6, 'Chỉ hỗ trợ lớp 6 đến 9.').max(9, 'Chỉ hỗ trợ lớp 6 đến 9.'),
});
/** A curriculum lesson, or a teacher question set ('set-' + id). */
const assignableId = z.string().refine((id) => LESSON_ID_RE.test(id) || SET_LESSON_RE.test(id), 'Mã bài học không hợp lệ.');
export const CreateAssignmentSchema = z.object({
  lessonId: assignableId,
  dueAt: z.number().int().positive().nullable().optional(),
});
export const JoinSchema = z.object({ code: z.string().min(4).max(12), displayName });
export const ReportSchema = z.object({
  sessions: z
    .array(
      z.object({
        reportId: z.string().min(8).max(64),
        lessonId: assignableId,
        nodeId: z.string().min(1).max(80),
        isPractice: z.boolean(),
        accuracy: z.number().min(0).max(1),
        xp: z.number().int().min(0).max(10000),
        completedAt: z.number().int().positive(),
        questions: z
          .array(
            z.object({
              exerciseId: z.string().min(1).max(80),
              skillIds: z.array(z.string().max(60)).max(10),
              correctFirstTry: z.boolean(),
              attempts: z.number().int().min(0).max(20),
            })
          )
          .max(40),
      })
    )
    .min(1)
    .max(50),
});

// ───────────── Google verification ─────────────
export interface GoogleIdentity {
  sub: string;
  email: string;
  name: string;
}

export async function verifyGoogleAccessToken(
  accessToken: string,
  allowedClientIds: string[],
  fetchImpl: typeof fetch = fetch
): Promise<GoogleIdentity> {
  const infoRes = await fetchImpl(
    `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`
  );
  if (!infoRes.ok) throw new HttpError(401, 'Phiên đăng nhập Google không hợp lệ hoặc đã hết hạn.');
  const info = (await infoRes.json()) as Record<string, string>;
  const audience = info.aud || info.azp;
  if (!audience || !allowedClientIds.includes(audience)) {
    throw new HttpError(401, 'Token Google không thuộc ứng dụng này.');
  }
  if (Number(info.expires_in ?? 0) <= 0) throw new HttpError(401, 'Phiên đăng nhập Google đã hết hạn.');
  if (!info.sub || !info.email || String(info.email_verified) !== 'true') {
    throw new HttpError(401, 'Tài khoản Google chưa xác minh email.');
  }
  let name = info.email.split('@')[0];
  try {
    const u = await fetchImpl('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { authorization: `Bearer ${accessToken}` },
    });
    if (u.ok) {
      const p = (await u.json()) as { name?: string };
      if (p.name) name = p.name;
    }
  } catch {
    /* name is optional */
  }
  return { sub: info.sub, email: info.email, name };
}

// ───────────── Auth lookups ─────────────
async function requireTeacher(req: Request, env: Env): Promise<{ id: string; email: string; name: string }> {
  const token = bearer(req);
  if (!token) throw new HttpError(401, 'Bạn cần đăng nhập tài khoản giáo viên.');
  const row = await env.DB.prepare(
    `SELECT t.id, t.email, t.name FROM teacher_sessions s JOIN teachers t ON t.id = s.teacher_id
     WHERE s.token_hash = ? AND s.expires_at > ?`
  )
    .bind(await sha256Hex(token), Date.now())
    .first<{ id: string; email: string; name: string }>();
  if (!row) throw new HttpError(401, 'Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại.');
  return row;
}

async function requireStudent(req: Request, env: Env) {
  const token = req.headers.get('x-student-token');
  if (!token) throw new HttpError(401, 'Bạn chưa vào lớp nào.');
  const row = await env.DB.prepare(
    `SELECT s.id, s.class_id, s.display_name, c.name AS class_name, c.grade
     FROM students s JOIN classes c ON c.id = s.class_id WHERE s.token_hash = ?`
  )
    .bind(await sha256Hex(token))
    .first<{ id: string; class_id: string; display_name: string; class_name: string; grade: number }>();
  if (!row) throw new HttpError(401, 'Lớp không còn tồn tại hoặc em đã được xóa khỏi lớp.');
  return row;
}

async function requireOwnClass(env: Env, teacherId: string, classId: string) {
  const c = await env.DB.prepare('SELECT id, name, grade, code, created_at FROM classes WHERE id = ? AND teacher_id = ?')
    .bind(classId, teacherId)
    .first<{ id: string; name: string; grade: number; code: string; created_at: number }>();
  if (!c) throw new HttpError(404, 'Không tìm thấy lớp.');
  return c;
}

interface SetRow {
  id: string;
  title: string;
  subject: string;
  grade: number;
  questions: string;
  updated_at: number;
}
const setFromRow = (r: SetRow) => ({
  id: r.id,
  title: r.title,
  subject: r.subject,
  grade: r.grade,
  questions: JSON.parse(r.questions),
  updatedAt: r.updated_at,
});

// ───────────── Router ─────────────
export async function handleApi(req: Request, env: Env, fetchImpl: typeof fetch = fetch): Promise<Response> {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);
    const route = `${req.method} /${parts.map((p, i) => (i >= 2 && i % 2 === 0 ? ':id' : p)).join('/')}`;
    const now = Date.now();

    // ── Teacher ──
    if (req.method === 'POST' && parts.join('/') === 'teacher/login') {
      const { accessToken } = await body(req, TeacherLoginSchema);
      const allowed = (env.GOOGLE_CLIENT_IDS || '').split(',').map((s) => s.trim()).filter(Boolean);
      const g = await verifyGoogleAccessToken(accessToken, allowed, fetchImpl);
      const token = randomToken();
      await env.DB.batch([
        env.DB.prepare(
          `INSERT INTO teachers (id, email, name, created_at) VALUES (?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET email = excluded.email, name = excluded.name`
        ).bind(g.sub, g.email, g.name, now),
        env.DB.prepare('DELETE FROM teacher_sessions WHERE teacher_id = ? AND expires_at < ?').bind(g.sub, now),
        env.DB.prepare('INSERT INTO teacher_sessions (token_hash, teacher_id, expires_at) VALUES (?, ?, ?)').bind(
          await sha256Hex(token),
          g.sub,
          now + SESSION_TTL_MS
        ),
      ]);
      return json({ sessionToken: token, teacher: { name: g.name, email: g.email } });
    }

    if (parts[0] === 'teacher') {
      const teacher = await requireTeacher(req, env);

      if (route === 'GET /teacher/me') return json({ teacher: { name: teacher.name, email: teacher.email } });

      if (route === 'POST /teacher/logout') {
        await env.DB.prepare('DELETE FROM teacher_sessions WHERE token_hash = ?').bind(await sha256Hex(bearer(req)!)).run();
        return json({ ok: true });
      }

      if (route === 'GET /teacher/classes') {
        const { results } = await env.DB.prepare(
          `SELECT c.id, c.name, c.grade, c.code, c.created_at AS createdAt,
                  (SELECT COUNT(*) FROM students s WHERE s.class_id = c.id) AS studentCount
           FROM classes c WHERE c.teacher_id = ? ORDER BY c.created_at DESC`
        )
          .bind(teacher.id)
          .all();
        return json({ classes: results });
      }

      if (route === 'POST /teacher/classes') {
        const { name, grade } = await body(req, CreateClassSchema);
        const id = crypto.randomUUID();
        for (let attempt = 0; attempt < 5; attempt++) {
          const code = generateClassCode();
          try {
            await env.DB.prepare('INSERT INTO classes (id, teacher_id, name, grade, code, created_at) VALUES (?, ?, ?, ?, ?, ?)')
              .bind(id, teacher.id, name, grade, code, now)
              .run();
            return json({ class: { id, name, grade, code, createdAt: now, studentCount: 0 } }, 201);
          } catch (e) {
            if (!String(e).includes('UNIQUE')) throw e;
          }
        }
        throw new HttpError(500, 'Không tạo được mã lớp, hãy thử lại.');
      }

      // ── Question sets ──
      if (route === 'GET /teacher/sets') {
        const { results } = await env.DB.prepare(
          `SELECT id, title, subject, grade, json_array_length(questions) AS questionCount, updated_at AS updatedAt
           FROM exercise_sets WHERE teacher_id = ? ORDER BY updated_at DESC`
        )
          .bind(teacher.id)
          .all();
        return json({ sets: results });
      }

      if (route === 'POST /teacher/sets') {
        const input = await body(req, ExerciseSetInputSchema);
        const id = generateSetId();
        await env.DB.prepare(
          `INSERT INTO exercise_sets (id, teacher_id, title, subject, grade, questions, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(id, teacher.id, input.title, input.subject, input.grade, JSON.stringify(input.questions), now, now)
          .run();
        return json({ set: { id, ...input, updatedAt: now } }, 201);
      }

      if (parts[1] === 'sets' && parts[2] && parts.length === 3) {
        const setId = parts[2];
        const row = await env.DB.prepare(
          'SELECT id, title, subject, grade, questions, updated_at FROM exercise_sets WHERE id = ? AND teacher_id = ?'
        )
          .bind(setId, teacher.id)
          .first<SetRow>();
        if (!row) throw new HttpError(404, 'Không tìm thấy bộ câu hỏi.');

        if (req.method === 'GET') return json({ set: setFromRow(row) });
        if (req.method === 'PUT') {
          const input = await body(req, ExerciseSetInputSchema);
          await env.DB.prepare('UPDATE exercise_sets SET title = ?, subject = ?, grade = ?, questions = ?, updated_at = ? WHERE id = ?')
            .bind(input.title, input.subject, input.grade, JSON.stringify(input.questions), now, setId)
            .run();
          return json({ set: { id: setId, ...input, updatedAt: now } });
        }
        if (req.method === 'DELETE') {
          // Assignments of a deleted set disappear; results already recorded stay in the classes.
          await env.DB.batch([
            env.DB.prepare(
              `DELETE FROM assignments WHERE lesson_id = ? AND class_id IN (SELECT id FROM classes WHERE teacher_id = ?)`
            ).bind(setLessonId(setId), teacher.id),
            env.DB.prepare('DELETE FROM exercise_sets WHERE id = ?').bind(setId),
          ]);
          return json({ ok: true });
        }
      }

      const classId = parts[2];
      if (parts[1] === 'classes' && classId) {
        const cls = await requireOwnClass(env, teacher.id, classId);

        if (route === 'GET /teacher/classes/:id') {
          const q = (sql: string) => env.DB.prepare(sql).bind(classId);
          const [students, completions, practice, assignments, sets, questionStats, skillStats] = await env.DB.batch([
            q(`SELECT id, display_name AS displayName, created_at AS joinedAt, last_seen_at AS lastSeenAt
               FROM students WHERE class_id = ? ORDER BY display_name COLLATE NOCASE`),
            q(`SELECT student_id AS studentId, lesson_id AS lessonId, node_id AS nodeId,
                      MAX(accuracy) AS bestAccuracy, MAX(xp) AS xp, MAX(completed_at) AS completedAt, COUNT(*) AS times
               FROM node_results WHERE class_id = ? AND is_practice = 0
               GROUP BY student_id, lesson_id, node_id`),
            q(`SELECT student_id AS studentId, lesson_id AS lessonId, COUNT(*) AS sessions,
                      AVG(accuracy) AS avgAccuracy, MAX(completed_at) AS completedAt
               FROM node_results WHERE class_id = ? AND is_practice = 1 GROUP BY student_id, lesson_id`),
            q(`SELECT a.id, a.lesson_id AS lessonId, a.due_at AS dueAt, a.created_at AS createdAt, es.title AS title
               FROM assignments a LEFT JOIN exercise_sets es ON a.lesson_id = 'set-' || es.id
               WHERE a.class_id = ? ORDER BY COALESCE(a.due_at, a.created_at) ASC`),
            q(`SELECT es.id, es.title, es.questions FROM exercise_sets es
               WHERE 'set-' || es.id IN (SELECT lesson_id FROM assignments WHERE class_id = ?)`),
            q(`SELECT exercise_id AS exerciseId, lesson_id AS lessonId, COUNT(*) AS attempts,
                      SUM(CASE WHEN correct_first_try = 0 THEN 1 ELSE 0 END) AS wrong,
                      COUNT(DISTINCT student_id) AS students
               FROM question_results WHERE class_id = ?
               GROUP BY exercise_id, lesson_id
               ORDER BY (SUM(CASE WHEN correct_first_try = 0 THEN 1 ELSE 0 END) * 1.0 / COUNT(*)) DESC, COUNT(*) DESC
               LIMIT 30`),
            q(`SELECT j.value AS skillId, COUNT(*) AS attempts,
                      SUM(CASE WHEN q.correct_first_try = 0 THEN 1 ELSE 0 END) AS wrong
               FROM question_results q, json_each(q.skill_ids) j WHERE q.class_id = ?
               GROUP BY j.value
               ORDER BY (SUM(CASE WHEN q.correct_first_try = 0 THEN 1 ELSE 0 END) * 1.0 / COUNT(*)) DESC
               LIMIT 20`),
          ]);
          return json({
            class: { id: cls.id, name: cls.name, grade: cls.grade, code: cls.code, createdAt: cls.created_at },
            students: students.results,
            completions: completions.results,
            practice: practice.results,
            assignments: assignments.results,
            sets: (sets.results as Array<{ id: string; title: string; questions: string }>).map((r) => ({
              id: r.id,
              title: r.title,
              questions: JSON.parse(r.questions),
            })),
            questionStats: questionStats.results,
            skillStats: skillStats.results,
          });
        }

        if (route === 'DELETE /teacher/classes/:id') {
          await env.DB.batch(
            ['question_results', 'node_results', 'assignments', 'students'].map((t) =>
              env.DB.prepare(`DELETE FROM ${t} WHERE class_id = ?`).bind(classId)
            ).concat([env.DB.prepare('DELETE FROM classes WHERE id = ?').bind(classId)])
          );
          return json({ ok: true });
        }

        if (route === 'POST /teacher/classes/:id/assignments') {
          const { lessonId, dueAt } = await body(req, CreateAssignmentSchema);
          let title: string | null = null;
          if (isSetLessonId(lessonId)) {
            const set = await env.DB.prepare('SELECT title FROM exercise_sets WHERE id = ? AND teacher_id = ?')
              .bind(setIdFromLessonId(lessonId), teacher.id)
              .first<{ title: string }>();
            if (!set) throw new HttpError(404, 'Không tìm thấy bộ câu hỏi.');
            title = set.title;
          }
          const id = crypto.randomUUID();
          await env.DB.prepare('INSERT INTO assignments (id, class_id, lesson_id, due_at, created_at) VALUES (?, ?, ?, ?, ?)')
            .bind(id, classId, lessonId, dueAt ?? null, now)
            .run();
          return json({ assignment: { id, lessonId, dueAt: dueAt ?? null, createdAt: now, title } }, 201);
        }

        if (route === 'DELETE /teacher/classes/:id/assignments/:id') {
          await env.DB.prepare('DELETE FROM assignments WHERE id = ? AND class_id = ?').bind(parts[4], classId).run();
          return json({ ok: true });
        }

        if (route === 'DELETE /teacher/classes/:id/students/:id') {
          const sid = parts[4];
          await env.DB.batch([
            env.DB.prepare('DELETE FROM question_results WHERE student_id = ? AND class_id = ?').bind(sid, classId),
            env.DB.prepare('DELETE FROM node_results WHERE student_id = ? AND class_id = ?').bind(sid, classId),
            env.DB.prepare('DELETE FROM students WHERE id = ? AND class_id = ?').bind(sid, classId),
          ]);
          return json({ ok: true });
        }
      }
      throw new HttpError(404, 'Không tìm thấy chức năng.');
    }

    // ── Student ──
    if (req.method === 'POST' && parts.join('/') === 'student/join') {
      const { code, displayName: name } = await body(req, JoinSchema);
      const cls = await env.DB.prepare('SELECT id, name, grade FROM classes WHERE code = ?')
        .bind(normalizeClassCode(code))
        .first<{ id: string; name: string; grade: number }>();
      if (!cls) throw new HttpError(404, 'Mã lớp không đúng. Em kiểm tra lại với thầy/cô nhé.');
      const token = randomToken();
      const id = crypto.randomUUID();
      await env.DB.prepare(
        'INSERT INTO students (id, class_id, display_name, token_hash, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?, ?)'
      )
        .bind(id, cls.id, name, await sha256Hex(token), now, now)
        .run();
      return json({ studentToken: token, student: { id, displayName: name }, class: cls }, 201);
    }

    if (parts[0] === 'student') {
      const st = await requireStudent(req, env);

      if (route === 'GET /student/me') {
        const [, assignments] = await env.DB.batch([
          env.DB.prepare('UPDATE students SET last_seen_at = ? WHERE id = ?').bind(now, st.id),
          env.DB.prepare(
            `SELECT a.id, a.lesson_id AS lessonId, a.due_at AS dueAt, a.created_at AS createdAt, es.title AS title
             FROM assignments a LEFT JOIN exercise_sets es ON a.lesson_id = 'set-' || es.id
             WHERE a.class_id = ? ORDER BY COALESCE(a.due_at, a.created_at) ASC`
          ).bind(st.class_id),
        ]);
        return json({
          student: { id: st.id, displayName: st.display_name },
          class: { id: st.class_id, name: st.class_name, grade: st.grade },
          assignments: assignments.results,
        });
      }

      if (route === 'GET /student/sets/:id') {
        // Students can only open a set that is assigned to their class.
        const row = await env.DB.prepare(
          `SELECT es.id, es.title, es.subject, es.grade, es.questions, es.updated_at FROM exercise_sets es
           WHERE es.id = ? AND EXISTS (SELECT 1 FROM assignments a WHERE a.class_id = ? AND a.lesson_id = 'set-' || es.id)`
        )
          .bind(parts[2], st.class_id)
          .first<SetRow>();
        if (!row) throw new HttpError(404, 'Bài này không còn được giao cho lớp em.');
        return json({ set: setFromRow(row) });
      }

      if (route === 'POST /student/report') {
        const { sessions } = await body(req, ReportSchema);
        const stmts: D1PreparedStatement[] = [env.DB.prepare('UPDATE students SET last_seen_at = ? WHERE id = ?').bind(now, st.id)];
        for (const s of sessions) {
          const at = Math.min(s.completedAt, now + DAY);
          stmts.push(
            env.DB.prepare(
              `INSERT OR IGNORE INTO node_results
                 (report_id, student_id, class_id, lesson_id, node_id, is_practice, accuracy, xp, completed_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).bind(s.reportId, st.id, st.class_id, s.lessonId, s.nodeId, s.isPractice ? 1 : 0, s.accuracy, s.xp, at)
          );
          for (const qr of s.questions) {
            // Only insert question rows the first time this report is seen (retries are idempotent).
            stmts.push(
              env.DB.prepare(
                `INSERT INTO question_results
                   (report_id, student_id, class_id, lesson_id, exercise_id, skill_ids, correct_first_try, attempts, created_at)
                 SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?
                 WHERE NOT EXISTS (SELECT 1 FROM question_results WHERE report_id = ? AND exercise_id = ?)`
              ).bind(
                s.reportId, st.id, st.class_id, s.lessonId, qr.exerciseId, JSON.stringify(qr.skillIds),
                qr.correctFirstTry ? 1 : 0, qr.attempts, at, s.reportId, qr.exerciseId
              )
            );
          }
        }
        await env.DB.batch(stmts);
        return json({ ok: true, accepted: sessions.length });
      }

      if (route === 'POST /student/leave') {
        await env.DB.batch([
          env.DB.prepare('DELETE FROM question_results WHERE student_id = ?').bind(st.id),
          env.DB.prepare('DELETE FROM node_results WHERE student_id = ?').bind(st.id),
          env.DB.prepare('DELETE FROM students WHERE id = ?').bind(st.id),
        ]);
        return json({ ok: true });
      }
    }

    throw new HttpError(404, 'Không tìm thấy chức năng.');
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status);
    console.error('classroom api error', e);
    return json({ error: 'Máy chủ gặp lỗi, hãy thử lại sau.' }, 500);
  }
}
