import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { getPracticeEntries, type PracticeEntry } from '@/content/practice';
import { PRACTICE_ROUND_SIZE } from '@/content/schema/practice';
import { sound } from '@/lib/audio';

/** Short single-topic practice rounds of a lesson ("mục luyện"), shown on its Practice card. */
export const PracticeUnitChips: React.FC<{ lessonId: string }> = ({ lessonId }) => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<PracticeEntry[]>([]);

  useEffect(() => {
    let alive = true;
    getPracticeEntries(lessonId)
      .then((e) => alive && setEntries(e))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [lessonId]);

  if (entries.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 pt-2" onClick={(e) => e.stopPropagation()}>
      {entries.map((e) => (
        <button
          key={e.nodeId}
          type="button"
          onClick={() => {
            sound.playClick();
            navigate(`/play/${lessonId}/${e.nodeId}?mode=practice`);
          }}
          className="inline-flex items-center gap-1.5 min-h-9 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface-2)] text-xs font-bold text-[var(--text-primary)] text-left cursor-pointer"
        >
          <Play className="w-3 h-3 shrink-0 text-[var(--subject-fg)]" />
          <span>{e.title}</span>
          <span className="text-[var(--text-tertiary)] font-medium whitespace-nowrap">· {PRACTICE_ROUND_SIZE} câu</span>
        </button>
      ))}
    </div>
  );
};
