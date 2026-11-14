import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MonitorPlay } from 'lucide-react';
import { getPhetSimsForLesson } from '@/content/phet/phetSims';
import { findLesson } from '@/content/curriculum';
import { sound } from '@/lib/audio';
import { PhetPlayer } from './PhetSimLibrary';

export interface PhetLessonSimsProps {
  lessonId: string;
  /**
   * `card`   — full-width card listing every sim of the lesson (theory pages).
   * `button` — one small button that opens the first sim (exercise header);
   *            the player then offers chips to switch between the lesson's sims.
   */
  variant?: 'card' | 'button';
  className?: string;
}

/**
 * Opens the PhET simulations linked to a lesson on top of the current page via `?sim=<id>`,
 * so the lesson/exercise state is kept and the phone's back button closes the player.
 */
export const PhetLessonSims: React.FC<PhetLessonSimsProps> = ({ lessonId, variant = 'card', className = '' }) => {
  const sims = useMemo(() => getPhetSimsForLesson(lessonId), [lessonId]);
  const [searchParams, setSearchParams] = useSearchParams();
  const openSim = sims.find((s) => s.id === searchParams.get('sim')) ?? null;

  if (sims.length === 0) return null;

  const open = (id: string) => {
    sound.playClick();
    const next = new URLSearchParams(searchParams);
    next.set('sim', id);
    setSearchParams(next);
  };

  return (
    <>
      {variant === 'button' ? (
        <button
          onClick={() => open(sims[0].id)}
          className={`shrink-0 inline-flex items-center gap-1.5 h-8 px-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] text-xs font-black text-[var(--subject-fg)] hover:border-[var(--border-strong)] cursor-pointer ${className}`}
          title={`Mô phỏng: ${sims.map((s) => s.titleVi).join(', ')}`}
        >
          <MonitorPlay className="w-4 h-4" />
          <span>Mô phỏng</span>
        </button>
      ) : (
        <div
          className={`p-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] space-y-2 ${className}`}
        >
          <p className="text-xs font-black text-[var(--text-primary)] flex items-center gap-1.5">
            <MonitorPlay className="w-4 h-4 text-[var(--subject-fg)]" />
            Thử với mô phỏng
          </p>
          <div className="flex flex-wrap gap-2">
            {sims.map((s) => (
              <button
                key={s.id}
                onClick={() => open(s.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--subject-edge)] bg-[var(--subject-tint)] text-xs font-black text-[var(--subject-fg)] cursor-pointer active:translate-y-[1px]"
              >
                {s.titleVi}
              </button>
            ))}
          </div>
        </div>
      )}

      {openSim && (
        <PhetPlayer
          sim={openSim}
          siblings={sims}
          contextLabel={findLesson(lessonId) ? `Bài: ${findLesson(lessonId)!.title}` : undefined}
        />
      )}
    </>
  );
};
