import { describe, it, expect, vi } from 'vitest';
import { lessonState, requiredNodeIds, studentRows, assignmentProgress, dueState, pendingAssignments, formatDue } from './analytics';
import { buildReport } from './outbox';
import type { ClassDetail } from './api';

describe('lesson completion rules', () => {
  it('requires every exercise node (theory and chest are optional)', () => {
    expect(requiredNodeIds('g7-b06')).toEqual(['g7-b06-n01', 'g7-b06-n02']);
    expect(lessonState('g7-b06', new Set())).toBe('not-started');
    expect(lessonState('g7-b06', new Set(['g7-b06-theory']))).toBe('in-progress');
    expect(lessonState('g7-b06', new Set(['g7-b06-n01']))).toBe('in-progress');
    expect(lessonState('g7-b06', new Set(['g7-b06-n01', 'g7-b06-n02']))).toBe('done');
  });
});

const detail: ClassDetail = {
  class: { id: 'c1', name: '7A', grade: 7, code: 'ABCDEF', createdAt: 0 },
  students: [
    { id: 's1', displayName: 'An', joinedAt: 1, lastSeenAt: 100 },
    { id: 's2', displayName: 'Bình', joinedAt: 1, lastSeenAt: 50 },
  ],
  completions: [
    { studentId: 's1', lessonId: 'g7-b06', nodeId: 'g7-b06-n01', bestAccuracy: 1, xp: 60, completedAt: 200, times: 1 },
    { studentId: 's1', lessonId: 'g7-b06', nodeId: 'g7-b06-n02', bestAccuracy: 0.5, xp: 30, completedAt: 300, times: 2 },
    { studentId: 's1', lessonId: 'g7-b06', nodeId: 'g7-b06-theory', bestAccuracy: 1, xp: 10, completedAt: 150, times: 1 },
    { studentId: 's2', lessonId: 'g7-b06', nodeId: 'g7-b06-n01', bestAccuracy: 0.5, xp: 20, completedAt: 60, times: 1 },
  ],
  practice: [],
  assignments: [{ id: 'a1', lessonId: 'g7-b06', dueAt: null, createdAt: 0 }],
  sets: [],
  questionStats: [],
  skillStats: [],
};

describe('teacher dashboard', () => {
  it('summarises each student (theory excluded from accuracy)', () => {
    const [an, binh] = studentRows(detail);
    expect(an).toMatchObject({ nodesDone: 3, avgAccuracy: 0.75, totalXp: 100, lastActive: 300, assignmentsDone: 1 });
    expect(binh).toMatchObject({ nodesDone: 1, avgAccuracy: 0.5, assignmentsDone: 0 });
  });

  it('counts who finished an assignment', () => {
    expect(assignmentProgress(detail, detail.assignments[0])).toEqual({ done: 1, inProgress: 1, total: 2, notDone: ['Bình'] });
  });

  it('does not count lessons finished before they were assigned', () => {
    const later = { ...detail.assignments[0], createdAt: 250 + 10 * 60 * 1000 };
    // An finished n01 at 200, before the assignment (minus slack = 250): only n02 counts, so not done.
    expect(assignmentProgress(detail, later).done).toBe(0);
    expect(studentRows({ ...detail, assignments: [later] })[0].assignmentsDone).toBe(0);
  });

  it('flags deadlines', () => {
    const now = 1_000_000_000;
    expect(dueState(null, now)).toBe('none');
    expect(dueState(now - 1, now)).toBe('overdue');
    expect(dueState(now + 3600_000, now)).toBe('soon');
    expect(dueState(now + 5 * 86_400_000, now)).toBe('ok');
  });
});

describe('student side', () => {
  it('lists assignments that are not finished yet from what was done in the class', () => {
    const a = [
      { id: 'a1', lessonId: 'g7-b06', dueAt: null, createdAt: 0 },
      { id: 'a2', lessonId: 'g7-b05', dueAt: null, createdAt: 0 },
    ];
    const pending = pendingAssignments(a, { 'g7-b06:g7-b06-n01': 5, 'g7-b06:g7-b06-n02': 5, 'g7-b05:g7-b05-n01': 5 });
    expect(pending.map((p) => [p.assignment.id, p.state])).toEqual([['a2', 'in-progress']]);
  });

  it('only counts work finished after the lesson was assigned (allowing a little clock drift)', () => {
    const day = 86_400_000;
    const a = [{ id: 'a1', lessonId: 'g9-b18', dueAt: null, createdAt: 10 * day }];
    // Learned the lesson a day before the teacher assigned it: still to do.
    expect(pendingAssignments(a, { 'g9-b18:g9-b18-n01': 9 * day }).map((p) => p.state)).toEqual(['not-started']);
    // Device clock a few minutes behind the server: counts.
    expect(pendingAssignments(a, { 'g9-b18:g9-b18-n01': 10 * day - 5 * 60_000 })).toEqual([]);
    expect(pendingAssignments(a, { 'g9-b18:g9-b18-n01': 10 * day + 1 })).toEqual([]);
  });
});

describe('buildReport', () => {
  const q = (id: string, status: string, attemptsCount: number, isReview = false) => ({
    exercise: { id, skillIds: ['valence'] },
    status,
    attemptsCount,
    isReview,
  });

  it('marks a question wrong when it needed a retry or came back as a review', () => {
    const r = buildReport({
      lessonId: 'g7-b06',
      nodeId: 'g7-b06-n01',
      isPractice: false,
      accuracy: 0.66,
      xp: 40,
      now: 5,
      id: 'rep-1',
      questions: [q('e1', 'correct', 1), q('e2', 'correct', 2), q('e3', 'wrong', 3), q('e3', 'correct', 1, true)],
    })!;
    expect(r.questions).toEqual([
      { exerciseId: 'e1', skillIds: ['valence'], correctFirstTry: true, attempts: 1 },
      { exerciseId: 'e2', skillIds: ['valence'], correctFirstTry: false, attempts: 2 },
      { exerciseId: 'e3', skillIds: ['valence'], correctFirstTry: false, attempts: 4 },
    ]);
  });

  it('strips the practice suffix and ignores generated drills', () => {
    expect(buildReport({ lessonId: 'g8-b03:practice', nodeId: 'p', isPractice: true, accuracy: 1, xp: 0, questions: [] })?.lessonId).toBe('g8-b03');
    expect(buildReport({ lessonId: 'gen-mol', nodeId: 'p', isPractice: true, accuracy: 1, xp: 0, questions: [] })).toBeNull();
  });
});

describe('formatDue', () => {
  it('uses dd/mm regardless of the Intl engine', () => {
    expect(formatDue(new Date(2026, 10, 5, 7, 3).getTime())).toBe('Hạn 07:03 ngày 05/11');
    expect(formatDue(null)).toBe('Không có hạn');
  });
});

describe('outbox flushing', () => {
  it('still sends after an earlier flush found nothing to do', async () => {
    const { flushOutbox, queueReport, pendingReportCount } = await import('./outbox');
    const { STUDENT_KEY } = await import('./api');
    localStorage.clear();
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ ok: true, accepted: 1 }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    try {
      await flushOutbox(); // app start: not in a class yet, returns without awaiting anything
      localStorage.setItem(
        STUDENT_KEY,
        JSON.stringify({ token: 't', student: { id: 's1', displayName: 'An' }, class: { id: 'c1', name: '7A', grade: 7 } })
      );
      queueReport(buildReport({ lessonId: 'g7-b06', nodeId: 'g7-b06-n01', isPractice: false, accuracy: 1, xp: 10, questions: [] }));
      await flushOutbox();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(pendingReportCount()).toBe(0);
    } finally {
      vi.unstubAllGlobals();
      localStorage.clear();
    }
  });
});

describe('teacher question sets in assignments', () => {
  it('treats a set as one node and links straight to it', async () => {
    const { assignmentPlayPath, assignmentTitle } = await import('./analytics');
    expect(requiredNodeIds('set-abcde12345')).toEqual(['set']);
    expect(lessonState('set-abcde12345', new Set(['set']))).toBe('done');
    expect(assignmentPlayPath('set-abcde12345', () => false)).toBe('/play/set-abcde12345/set');
    expect(assignmentPlayPath('g7-b06', (k) => k === 'g7-b06:g7-b06-n01')).toBe('/play/g7-b06/g7-b06-n02');
    expect(assignmentTitle({ lessonId: 'set-abcde12345', title: 'Ôn tập mol' })).toBe('Ôn tập mol');
    expect(assignmentTitle({ lessonId: 'set-abcde12345', title: null })).toBe('Bộ câu hỏi đã bị xóa');
  });

  it('reports set sessions to the class', () => {
    expect(buildReport({ lessonId: 'set-abcde12345', nodeId: 'set', isPractice: false, accuracy: 1, xp: 10, questions: [] })?.lessonId).toBe(
      'set-abcde12345'
    );
  });
});
