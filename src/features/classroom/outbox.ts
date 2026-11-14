/**
 * Offline-first queue of session reports for the student's class.
 * Results are stored locally first and sent when the device is online, so lessons done offline
 * still reach the teacher. Each report has a unique id, which makes server-side retries idempotent.
 */
import { ApiError, clearStudentMembership, getStudentMembership, sendReports, type SessionReport } from './api';
import { isSetLessonId } from '@/content/schema/teacherSet';

const OUTBOX_KEY = 'sci_classroom_outbox';
const LESSON_RE = /^(phy-|bio-)?g[6-9]-b\d{2}$/;
const MAX_QUEUE = 300;

function load(): SessionReport[] {
  try {
    return JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]') as SessionReport[];
  } catch {
    return [];
  }
}
function save(items: SessionReport[]) {
  try {
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(items.slice(-MAX_QUEUE)));
  } catch {
    /* storage unavailable */
  }
}

export function pendingReportCount(): number {
  return load().length;
}

/** Minimal shape of a finished question we need from the session state. */
export interface FinishedQuestion {
  exercise: { id: string; skillIds: string[] };
  status: string;
  attemptsCount: number;
  isReview?: boolean;
}

/** Turn a finished session into a report (one entry per distinct exercise, review copies folded in). */
export function buildReport(input: {
  lessonId: string;
  nodeId: string;
  isPractice: boolean;
  accuracy: number;
  xp: number;
  questions: FinishedQuestion[];
  now?: number;
  id?: string;
}): SessionReport | null {
  const lessonId = input.lessonId.replace(/:practice$/, '');
  // Generated drills etc. are neither curriculum lessons nor teacher question sets.
  if (!LESSON_RE.test(lessonId) && !isSetLessonId(lessonId)) return null;
  const byId = new Map<string, { skillIds: string[]; correctFirstTry: boolean; attempts: number }>();
  for (const q of input.questions) {
    const prev = byId.get(q.exercise.id);
    const firstTry = !q.isReview && q.status === 'correct' && q.attemptsCount <= 1;
    if (!prev) {
      byId.set(q.exercise.id, { skillIds: q.exercise.skillIds.slice(0, 10), correctFirstTry: firstTry, attempts: q.attemptsCount });
    } else {
      // A review copy means the first attempt was not right.
      prev.correctFirstTry = prev.correctFirstTry && firstTry;
      prev.attempts += q.attemptsCount;
    }
  }
  const now = input.now ?? Date.now();
  return {
    reportId: input.id ?? `${now.toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
    lessonId,
    nodeId: input.nodeId,
    isPractice: input.isPractice,
    accuracy: Math.max(0, Math.min(1, input.accuracy)),
    xp: Math.max(0, Math.round(input.xp)),
    completedAt: now,
    questions: [...byId.entries()].slice(0, 40).map(([exerciseId, v]) => ({
      exerciseId,
      skillIds: v.skillIds,
      correctFirstTry: v.correctFirstTry,
      attempts: Math.min(20, v.attempts),
    })),
  };
}

let flushing: Promise<void> | null = null;

/** Send queued reports (no-op when not in a class or offline). */
export function flushOutbox(): Promise<void> {
  if (flushing) return flushing;
  // Reset in .finally() on the stored promise: resetting inside the async body would run
  // *before* the assignment when the body finishes without awaiting (empty queue),
  // leaving `flushing` stuck on a settled promise so later reports never get sent.
  flushing = (async () => {
    if (!getStudentMembership()) return;
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
    let queue = load();
    while (queue.length > 0) {
      const batch = queue.slice(0, 50);
      try {
        await sendReports(batch);
      } catch (e) {
        // Removed from the class / class deleted: stop reporting and forget the membership.
        if (e instanceof ApiError && e.status === 401) {
          clearStudentMembership();
          save([]);
          window.dispatchEvent(new Event('classroom-changed'));
        }
        return; // network or server problem: keep the queue for next time
      }
      queue = load().filter((r) => !batch.some((b) => b.reportId === r.reportId));
      save(queue);
    }
  })().finally(() => {
    flushing = null;
  });
  return flushing;
}

/** Queue a report for the student's class (ignored when the student hasn't joined a class). */
export function queueReport(report: SessionReport | null) {
  if (!report || !getStudentMembership()) return;
  save([...load(), report]);
  void flushOutbox();
}

let started = false;
/** Flush on app start and whenever the device comes back online. */
export function startClassroomSync() {
  if (started || typeof window === 'undefined') return;
  started = true;
  window.addEventListener('online', () => void flushOutbox());
  void flushOutbox();
}
