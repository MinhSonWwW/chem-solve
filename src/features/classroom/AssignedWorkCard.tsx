import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ChevronRight } from 'lucide-react';
import { findLesson } from '@/content/curriculum';
import { useUserStore } from '@/features/gamification/useUserStore';
import { getStudentMe, type Assignment } from './api';
import { dueState, formatDue, pendingAssignments, requiredNodeIds } from './analytics';
import { useStudentMembership } from './StudentClassCard';
import { sound } from '@/lib/audio';

const CACHE_KEY = 'sci_classroom_assignments';

/** Home-page card with the work the teacher assigned that the student hasn't finished yet. */
export const AssignedWorkCard: React.FC = () => {
  const membership = useStudentMembership();
  const navigate = useNavigate();
  const completedNodes = useUserStore((s) => s.completedNodes);
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(CACHE_KEY) || '[]') as Assignment[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!membership) return;
    getStudentMe()
      .then((r) => {
        setAssignments(r.assignments);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(r.assignments));
        } catch {
          /* ignore */
        }
      })
      .catch(() => {
        /* offline: keep the cached list */
      });
  }, [membership]);

  if (!membership) return null;
  const pending = pendingAssignments(
    assignments,
    Object.keys(completedNodes).filter((k) => completedNodes[k])
  );

  return (
    <section className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-1.5">
          <ClipboardList className="w-4 h-4 text-[var(--subject-fg)]" />
          Bài được giao · {membership.class.name}
        </h2>
        <span className="text-xs text-[var(--text-tertiary)]">{pending.length} bài</span>
      </div>

      {pending.length === 0 ? (
        <p className="text-xs text-[var(--text-secondary)]">Em đã làm xong mọi bài thầy/cô giao.</p>
      ) : (
        <ul className="space-y-2">
          {pending.map(({ assignment: a, state }) => {
            const lesson = findLesson(a.lessonId);
            const due = dueState(a.dueAt);
            const next =
              requiredNodeIds(a.lessonId).find((id) => !completedNodes[`${a.lessonId}:${id}`]) ??
              lesson?.nodes[0]?.id;
            return (
              <li key={a.id}>
                <button
                  onClick={() => {
                    sound.playClick();
                    if (next) navigate(`/play/${a.lessonId}/${next}`);
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] flex items-center gap-3 cursor-pointer"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black text-[var(--text-primary)] truncate">
                      {lesson?.title ?? a.lessonId}
                    </span>
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
                    </span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
