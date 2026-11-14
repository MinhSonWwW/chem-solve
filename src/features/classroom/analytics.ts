/** Pure helpers for the teacher dashboard and the student's assigned-work card. */
import { findLesson } from '@/content/curriculum';
import { SET_NODE_ID, isSetLessonId } from '@/content/schema/teacherSet';
import type { Assignment, ClassDetail } from './api';

/** Exercise nodes a student must finish for a lesson to count as done (theory & chests excluded). */
export function requiredNodeIds(lessonId: string): string[] {
  if (isSetLessonId(lessonId)) return [SET_NODE_ID];
  const lesson = findLesson(lessonId);
  if (!lesson) return [];
  return lesson.nodes.filter((n) => n.type === 'lesson' || n.type === 'checkpoint').map((n) => n.id);
}

export type AssignmentState = 'done' | 'in-progress' | 'not-started';

/** State of one lesson for one student, given the set of node ids they have completed in that lesson. */
export function lessonState(lessonId: string, completedNodeIds: Set<string>): AssignmentState {
  const required = requiredNodeIds(lessonId);
  if (required.length === 0) return completedNodeIds.size > 0 ? 'done' : 'not-started';
  const done = required.filter((id) => completedNodeIds.has(id)).length;
  if (done === required.length) return 'done';
  return done > 0 || completedNodeIds.size > 0 ? 'in-progress' : 'not-started';
}

/** Device clocks drift; work finished up to this long before the assignment still counts. */
export const ASSIGN_CLOCK_SLACK_MS = 10 * 60 * 1000;
/** An assignment is done only with work finished after it was assigned (same rule for teacher and student). */
export const countsFor = (a: { createdAt: number }, completedAt: number) => completedAt >= a.createdAt - ASSIGN_CLOCK_SLACK_MS;

/** Completed node ids per student per lesson, from the teacher's class detail (optionally only since `since`). */
export function completionIndex(completions: ClassDetail['completions'], since = 0): Map<string, Map<string, Set<string>>> {
  const idx = new Map<string, Map<string, Set<string>>>();
  for (const c of completions) {
    if (c.completedAt < since) continue;
    const byLesson = idx.get(c.studentId) ?? new Map<string, Set<string>>();
    const set = byLesson.get(c.lessonId) ?? new Set<string>();
    set.add(c.nodeId);
    byLesson.set(c.lessonId, set);
    idx.set(c.studentId, byLesson);
  }
  return idx;
}

export interface StudentRow {
  id: string;
  displayName: string;
  nodesDone: number;
  avgAccuracy: number | null;
  totalXp: number;
  lastActive: number;
  assignmentsDone: number;
}

export function studentRows(detail: ClassDetail): StudentRow[] {
  return detail.students.map((s) => {
    const mine = detail.completions.filter((c) => c.studentId === s.id);
    const exerciseNodes = mine.filter((c) => !c.nodeId.endsWith('-theory'));
    const avg = exerciseNodes.length ? exerciseNodes.reduce((a, c) => a + c.bestAccuracy, 0) / exerciseNodes.length : null;
    const lastActive = Math.max(s.lastSeenAt, ...mine.map((c) => c.completedAt), 0);
    const assignmentsDone = detail.assignments.filter((a) => {
      const since = completionIndex(mine, a.createdAt - ASSIGN_CLOCK_SLACK_MS);
      return lessonState(a.lessonId, since.get(s.id)?.get(a.lessonId) ?? new Set()) === 'done';
    }).length;
    return {
      id: s.id,
      displayName: s.displayName,
      nodesDone: mine.length,
      avgAccuracy: avg,
      totalXp: mine.reduce((a, c) => a + c.xp, 0),
      lastActive,
      assignmentsDone,
    };
  });
}

export function assignmentProgress(detail: ClassDetail, a: Assignment) {
  const idx = completionIndex(detail.completions, a.createdAt - ASSIGN_CLOCK_SLACK_MS);
  const states = detail.students.map((s) => ({
    student: s,
    state: lessonState(a.lessonId, idx.get(s.id)?.get(a.lessonId) ?? new Set()),
  }));
  return {
    done: states.filter((x) => x.state === 'done').length,
    inProgress: states.filter((x) => x.state === 'in-progress').length,
    total: states.length,
    notDone: states.filter((x) => x.state !== 'done').map((x) => x.student.displayName),
  };
}

export type DueState = 'none' | 'ok' | 'soon' | 'overdue';
/** "soon" = due within 2 days. */
export function dueState(dueAt: number | null, now = Date.now()): DueState {
  if (!dueAt) return 'none';
  if (dueAt < now) return 'overdue';
  if (dueAt - now < 2 * 24 * 60 * 60 * 1000) return 'soon';
  return 'ok';
}

/**
 * For the student: which assignments are still to do. `classDone` maps `${lessonId}:${nodeId}` to when the
 * student last finished it while in the class; only work after the assignment was given counts.
 */
export function pendingAssignments(assignments: Assignment[], classDone: Record<string, number>) {
  return assignments
    .map((a) => {
      const done = new Set(
        Object.entries(classDone)
          .filter(([k, at]) => k.startsWith(`${a.lessonId}:`) && countsFor(a, at))
          .map(([k]) => k.slice(a.lessonId.length + 1))
      );
      return { assignment: a, state: lessonState(a.lessonId, done) };
    })
    .filter((x) => x.state !== 'done');
}

export function formatDue(dueAt: number | null): string {
  if (!dueAt) return 'Không có hạn';
  const d = new Date(dueAt);
  const p = (n: number) => String(n).padStart(2, '0');
  // Built by hand: Intl's vi-VN day/month output differs between engines ("15/11" vs "15-11").
  return `Hạn ${p(d.getHours())}:${p(d.getMinutes())} ngày ${p(d.getDate())}/${p(d.getMonth() + 1)}`;
}

export function formatRelative(ts: number, now = Date.now()): string {
  if (!ts) return 'Chưa hoạt động';
  const diff = Math.max(0, now - ts);
  const min = Math.round(diff / 60000);
  if (min < 1) return 'Vừa xong';
  if (min < 60) return `${min} phút trước`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.round(h / 24);
  return `${d} ngày trước`;
}

/** Title shown for an assignment: the set title, or the curriculum lesson title. */
export function assignmentTitle(a: { lessonId: string; title?: string | null }): string {
  if (a.title) return a.title;
  if (isSetLessonId(a.lessonId)) return 'Bộ câu hỏi đã bị xóa';
  return findLesson(a.lessonId)?.title ?? a.lessonId;
}

/** Where a student continues an assignment. */
export function assignmentPlayPath(lessonId: string, completed: (key: string) => boolean): string | null {
  if (isSetLessonId(lessonId)) return `/play/${lessonId}/${SET_NODE_ID}`;
  const next = requiredNodeIds(lessonId).find((id) => !completed(`${lessonId}:${id}`)) ?? findLesson(lessonId)?.nodes[0]?.id;
  return next ? `/play/${lessonId}/${next}` : null;
}
