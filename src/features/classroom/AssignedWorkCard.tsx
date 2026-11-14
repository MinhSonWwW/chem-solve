import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ChevronRight } from 'lucide-react';
import { useUserStore } from '@/features/gamification/useUserStore';
import { getCachedAssignments, getClassDone, getStudentMe, type Assignment } from './api';
import { assignmentPlayPath, assignmentTitle, countsFor, dueState, formatDue, pendingAssignments, requiredNodeIds } from './analytics';
import { useStudentMembership } from './StudentClassCard';
import { sound } from '@/lib/audio';

/** Home-page card with the work the teacher assigned that the student hasn't finished yet. */
export const AssignedWorkCard: React.FC = () => {
  const membership = useStudentMembership();
  const navigate = useNavigate();
  const completedNodes = useUserStore((s) => s.completedNodes);
  const [assignments, setAssignments] = useState<Assignment[]>(getCachedAssignments);

  useEffect(() => {
    if (!membership) return;
    getStudentMe()
      .then((r) => setAssignments(r.assignments))
      .catch(() => {
        /* offline: keep the cached list */
      });
  }, [membership]);

  if (!membership) return null;
  const classDone = getClassDone();
  const pending = pendingAssignments(assignments, classDone);

  return (
    <section className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-1.5 min-w-0">
          <ClipboardList className="w-4 h-4 shrink-0 text-[var(--subject-fg)]" />
          <span className="truncate">Bài được giao · {membership.class.name}</span>
        </h2>
        <span className="shrink-0 text-xs text-[var(--text-tertiary)]">{pending.length} bài</span>
      </div>

      {pending.length === 0 ? (
        <p className="text-xs text-[var(--text-secondary)]">Em đã làm xong mọi bài thầy/cô giao.</p>
      ) : (
        <>
          <p className="text-xs text-[var(--text-tertiary)]">Làm bài được giao không bị trừ tim.</p>
          <ul className="space-y-2">
            {pending.map(({ assignment: a, state }) => {
              const due = dueState(a.dueAt);
              const path = assignmentPlayPath(a.lessonId, (key) => countsFor(a, classDone[key] ?? 0));
              // Learned on this device before it was assigned: needs one more go so the teacher gets the result.
              const learnedBefore =
                state === 'not-started' &&
                requiredNodeIds(a.lessonId).length > 0 &&
                requiredNodeIds(a.lessonId).every((id) => !!completedNodes[`${a.lessonId}:${id}`]);
              return (
                <li key={a.id}>
                  <button
                    onClick={() => {
                      sound.playClick();
                      if (path) navigate(path);
                    }}
                    className="w-full text-left p-3 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] flex items-center gap-3 cursor-pointer"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-black text-[var(--text-primary)] truncate">{assignmentTitle(a)}</span>
                      <span
                        className={`block text-xs mt-0.5 ${
                          due === 'overdue'
                            ? 'text-[var(--err-fg)] font-bold'
                            : due === 'soon'
                              ? 'text-[var(--warn-fg)] font-bold'
                              : 'text-[var(--text-tertiary)]'
                        }`}
                      >
                        {due === 'overdue' ? 'Đã quá hạn · ' : ''}
                        {formatDue(a.dueAt)}
                        {state === 'in-progress' ? ' · Đang làm dở' : ''}
                        {learnedBefore ? ' · Em đã học bài này, làm lại để nộp cho thầy/cô' : ''}
                      </span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
};
