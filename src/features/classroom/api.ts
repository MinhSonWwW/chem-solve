/**
 * Client for the classroom API (server/classroom.ts, served at /api on the same origin).
 * Tokens live in localStorage; every read/write is wrapped so private mode never crashes the app.
 */

export const TEACHER_TOKEN_KEY = 'sci_teacher_session';
export const STUDENT_KEY = 'sci_classroom_student';

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
}
export interface ClassDetail {
  class: Omit<ClassSummary, 'studentCount'>;
  students: { id: string; displayName: string; joinedAt: number; lastSeenAt: number }[];
  completions: { studentId: string; lessonId: string; nodeId: string; bestAccuracy: number; xp: number; completedAt: number; times: number }[];
  practice: { studentId: string; lessonId: string; sessions: number; avgAccuracy: number; completedAt: number }[];
  assignments: Assignment[];
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
  return r.teacher;
}
export async function teacherLogout() {
  try {
    await call('teacher/logout', { method: 'POST', auth: 'teacher' });
  } finally {
    write(TEACHER_TOKEN_KEY, null);
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
export const clearTeacherSession = () => write(TEACHER_TOKEN_KEY, null);

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
  return call<{ student: StudentMembership['student']; class: StudentMembership['class']; assignments: Assignment[] }>(
    'student/me',
    { auth: 'student' }
  );
}

export async function leaveClass() {
  try {
    await call('student/leave', { method: 'POST', auth: 'student' });
  } finally {
    clearStudentMembership();
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
