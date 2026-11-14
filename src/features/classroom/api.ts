/**
 * Client for the classroom API (server/classroom.ts, served at /api on the same origin).
 * Tokens live in localStorage; every read/write is wrapped so private mode never crashes the app.
 */
import type { ExerciseSet, ExerciseSetInput, TeacherQuestion } from '@/content/schema/teacherSet';

export const TEACHER_TOKEN_KEY = 'sci_teacher_session';
export const STUDENT_KEY = 'sci_classroom_student';
export const ASSIGNMENTS_CACHE_KEY = 'sci_classroom_assignments';
const SET_CACHE_PREFIX = 'sci_classroom_set_';

export interface ClassSummary {
  id: string;
  name: string;
  grade: number;
  code: string;
  createdAt: number;
  studentCount: number;
}
export interface Assignment {
  id: string;
  lessonId: string;
  dueAt: number | null;
  createdAt: number;
  /** Title of a teacher question set (null for curriculum lessons). */
  title?: string | null;
}
export interface SetSummary {
  id: string;
  title: string;
  subject: ExerciseSet['subject'];
  grade: number;
  questionCount: number;
  updatedAt: number;
}
export interface ClassDetail {
  class: Omit<ClassSummary, 'studentCount'>;
  students: { id: string; displayName: string; joinedAt: number; lastSeenAt: number }[];
  completions: { studentId: string; lessonId: string; nodeId: string; bestAccuracy: number; xp: number; completedAt: number; times: number }[];
  practice: { studentId: string; lessonId: string; sessions: number; avgAccuracy: number; completedAt: number }[];
  assignments: Assignment[];
  sets: { id: string; title: string; questions: TeacherQuestion[] }[];
  questionStats: { exerciseId: string; lessonId: string; attempts: number; wrong: number; students: number }[];
  skillStats: { skillId: string; attempts: number; wrong: number }[];
}
export interface StudentMembership {
  token: string;
  student: { id: string; displayName: string };
  class: { id: string; name: string; grade: number };
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
}

async function call<T>(path: string, init: RequestInit & { auth?: 'teacher' | 'student' } = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set('content-type', 'application/json');
  if (init.auth === 'teacher') {
    const t = read(TEACHER_TOKEN_KEY);
    if (t) headers.set('authorization', `Bearer ${t}`);
  }
  if (init.auth === 'student') {
    const s = getStudentMembership();
    if (s) headers.set('x-student-token', s.token);
  }
  let res: Response;
  try {
    res = await fetch(`/api/${path}`, { ...init, headers });
  } catch {
    throw new ApiError(0, 'Không kết nối được máy chủ. Hãy kiểm tra mạng.');
  }
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new ApiError(res.status, data.error || 'Có lỗi xảy ra, hãy thử lại.');
  return data as T;
}

// ───────── Teacher ─────────
export const hasTeacherSession = () => !!read(TEACHER_TOKEN_KEY);

export async function teacherLogin(accessToken: string) {
  const r = await call<{ sessionToken: string; teacher: { name: string; email: string } }>('teacher/login', {
    method: 'POST',
    body: JSON.stringify({ accessToken }),
  });
  write(TEACHER_TOKEN_KEY, r.sessionToken);
  window.dispatchEvent(new Event('classroom-changed'));
  return r.teacher;
}
export async function teacherLogout() {
  try {
    await call('teacher/logout', { method: 'POST', auth: 'teacher' });
  } finally {
    write(TEACHER_TOKEN_KEY, null);
    window.dispatchEvent(new Event('classroom-changed'));
  }
}
export const getTeacherMe = () => call<{ teacher: { name: string; email: string } }>('teacher/me', { auth: 'teacher' });
export const listClasses = () => call<{ classes: ClassSummary[] }>('teacher/classes', { auth: 'teacher' });
export const createClass = (name: string, grade: number) =>
  call<{ class: ClassSummary }>('teacher/classes', { method: 'POST', auth: 'teacher', body: JSON.stringify({ name, grade }) });
export const getClassDetail = (id: string) => call<ClassDetail>(`teacher/classes/${id}`, { auth: 'teacher' });
export const deleteClass = (id: string) => call(`teacher/classes/${id}`, { method: 'DELETE', auth: 'teacher' });
export const createAssignment = (classId: string, lessonId: string, dueAt: number | null) =>
  call<{ assignment: Assignment }>(`teacher/classes/${classId}/assignments`, {
    method: 'POST',
    auth: 'teacher',
    body: JSON.stringify({ lessonId, dueAt }),
  });
export const deleteAssignment = (classId: string, id: string) =>
  call(`teacher/classes/${classId}/assignments/${id}`, { method: 'DELETE', auth: 'teacher' });
export const removeStudent = (classId: string, studentId: string) =>
  call(`teacher/classes/${classId}/students/${studentId}`, { method: 'DELETE', auth: 'teacher' });
export const clearTeacherSession = () => {
  write(TEACHER_TOKEN_KEY, null);
  window.dispatchEvent(new Event('classroom-changed'));
};

// Question sets
export const listSets = () => call<{ sets: SetSummary[] }>('teacher/sets', { auth: 'teacher' });
export const getTeacherSet = (id: string) => call<{ set: ExerciseSet }>(`teacher/sets/${id}`, { auth: 'teacher' });
export const createSet = (input: ExerciseSetInput) =>
  call<{ set: ExerciseSet }>('teacher/sets', { method: 'POST', auth: 'teacher', body: JSON.stringify(input) });
export const updateSet = (id: string, input: ExerciseSetInput) =>
  call<{ set: ExerciseSet }>(`teacher/sets/${id}`, { method: 'PUT', auth: 'teacher', body: JSON.stringify(input) });
export const deleteSet = (id: string) => call(`teacher/sets/${id}`, { method: 'DELETE', auth: 'teacher' });

// ───────── Student ─────────
export function getStudentMembership(): StudentMembership | null {
  const raw = read(STUDENT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StudentMembership;
  } catch {
    return null;
  }
}
export function clearStudentMembership() {
  write(STUDENT_KEY, null);
}

export async function joinClass(code: string, displayName: string): Promise<StudentMembership> {
  const r = await call<{ studentToken: string; student: StudentMembership['student']; class: StudentMembership['class'] }>(
    'student/join',
    { method: 'POST', body: JSON.stringify({ code, displayName }) }
  );
  const m: StudentMembership = { token: r.studentToken, student: r.student, class: r.class };
  write(STUDENT_KEY, JSON.stringify(m));
  window.dispatchEvent(new Event('classroom-changed'));
  return m;
}

export async function getStudentMe() {
  const r = await call<{ student: StudentMembership['student']; class: StudentMembership['class']; assignments: Assignment[] }>(
    'student/me',
    { auth: 'student' }
  );
  write(ASSIGNMENTS_CACHE_KEY, JSON.stringify(r.assignments));
  return r;
}

/** Last assignment list seen (works offline). */
export function getCachedAssignments(): Assignment[] {
  if (!getStudentMembership()) return [];
  try {
    return JSON.parse(read(ASSIGNMENTS_CACHE_KEY) || '[]') as Assignment[];
  } catch {
    return [];
  }
}

/** Assigned work never costs hearts. */
export const isAssignedLesson = (lessonId: string) => getCachedAssignments().some((a) => a.lessonId === lessonId);

export function getCachedSet(id: string): ExerciseSet | null {
  try {
    const raw = read(SET_CACHE_PREFIX + id);
    return raw ? (JSON.parse(raw) as ExerciseSet) : null;
  } catch {
    return null;
  }
}

/**
 * A question set to play: assigned to the student's class, or the teacher's own set (to try it out).
 * Falls back to the copy saved on the device when offline.
 */
export async function loadPlayableSet(id: string): Promise<ExerciseSet> {
  try {
    const r = getStudentMembership()
      ? await call<{ set: ExerciseSet }>(`student/sets/${id}`, { auth: 'student' })
      : await getTeacherSet(id);
    write(SET_CACHE_PREFIX + id, JSON.stringify(r.set));
    return r.set;
  } catch (e) {
    const cached = getCachedSet(id);
    if (cached && e instanceof ApiError && e.status === 0) return cached;
    throw e;
  }
}

export async function leaveClass() {
  try {
    await call('student/leave', { method: 'POST', auth: 'student' });
  } finally {
    clearStudentMembership();
    write(ASSIGNMENTS_CACHE_KEY, null);
    window.dispatchEvent(new Event('classroom-changed'));
  }
}

export interface SessionReport {
  reportId: string;
  lessonId: string;
  nodeId: string;
  isPractice: boolean;
  accuracy: number;
  xp: number;
  completedAt: number;
  questions: { exerciseId: string; skillIds: string[]; correctFirstTry: boolean; attempts: number }[];
}
export const sendReports = (sessions: SessionReport[]) =>
  call<{ ok: true; accepted: number }>('student/report', { method: 'POST', auth: 'student', body: JSON.stringify({ sessions }) });
