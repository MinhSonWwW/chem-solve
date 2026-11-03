import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, BookOpen, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import type { Hint, SolutionStep } from '@/content/schema/exercise';
import { MathText } from './MathText';

export interface HintLadderProps {
  hints: Hint[];
  steps: SolutionStep[];
  finalSolution: string;
  hintsUsed: number;
  stepsRevealedCount: number;
  isCompleted: boolean;
  onUseHint: (level: 1 | 2) => void;
  onRevealStep: () => void;
  onRevealSolution: () => void;
}

/**
 * 4-level hint ladder:
 * Gợi ý 1 → Gợi ý 2 → Xem bước → Xem lời giải
 */
export const HintLadder: React.FC<HintLadderProps> = ({
  hints,
  steps,
  finalSolution: _finalSolution,
  hintsUsed,
  stepsRevealedCount,
  isCompleted,
  onUseHint,
  onRevealStep,
  onRevealSolution,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (isCompleted) return null;

  const hint1 = hints.find((h) => h.level === 1);
  const hint2 = hints.find((h) => h.level === 2);

  // Determine current available level
  const currentLevel = hintsUsed === 0 ? 1 : hintsUsed === 1 ? 2 : stepsRevealedCount < steps.length ? 3 : 4;

  const handleHintClick = () => {
    if (currentLevel === 1 && hint1) {
      onUseHint(1);
    } else if (currentLevel === 2 && hint2) {
      onUseHint(2);
    } else if (currentLevel === 3) {
      onRevealStep();
    } else {
      onRevealSolution();
    }
  };

  const getLevelLabel = () => {
    switch (currentLevel) {
      case 1:
        return 'Gợi ý 1';
      case 2:
        return 'Gợi ý 2';
      case 3:
        return 'Xem bước';
      case 4:
        return 'Xem lời giải';
      default:
        return 'Gợi ý';
    }
  };

  const getLevelIcon = () => {
    if (currentLevel <= 2) return <Lightbulb className="w-4 h-4" />;
    if (currentLevel === 3) return <BookOpen className="w-4 h-4" />;
    return <Eye className="w-4 h-4" />;
  };

  return (
    <div className="space-y-2">
      {/* Already revealed hints */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {hintsUsed >= 1 && hint1 && (
              <div className="p-3 bg-[var(--gold-tint)] border border-[var(--gold-edge)] rounded-xl text-xs text-[var(--gold-fg)]">
                <div className="flex items-center gap-1.5 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-[var(--gold-fg)]" />
                  <strong className="text-[var(--gold-fg)]">Gợi ý 1</strong>
                </div>
                <MathText text={hint1.text} />
              </div>
            )}
            {hintsUsed >= 2 && hint2 && (
              <div className="p-3 bg-[var(--gold-tint)] border border-[var(--gold-edge)] rounded-xl text-xs text-[var(--gold-fg)]">
                <div className="flex items-center gap-1.5 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-[var(--gold-fg)]" />
                  <strong className="text-[var(--gold-fg)]">Gợi ý 2</strong>
                </div>
                <MathText text={hint2.text} />
              </div>
            )}
            {stepsRevealedCount > 0 && (
              <div className="p-3 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-xs text-[var(--text-secondary)] space-y-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-[var(--subject-fg)]" />
                  <strong className="text-[var(--subject-fg)]">
                    Bước giải ({stepsRevealedCount}/{steps.length})
                  </strong>
                </div>
                {steps.slice(0, stepsRevealedCount).map((step, i) => (
                  <div key={i} className="pl-2 border-l-2 border-[var(--subject-edge)]">
                    <strong className="text-[var(--subject-fg)]">{step.title}:</strong>{' '}
                    <MathText text={step.body} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle + next hint button */}
      <div className="flex items-center gap-2">
        {(hintsUsed > 0 || stepsRevealedCount > 0) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            aria-label={expanded ? 'Thu gọn gợi ý' : 'Xem gợi ý đã dùng'}
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        )}

        <button
          onClick={handleHintClick}
          className="p-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl text-[var(--gold-fg)] hover:border-[var(--gold-edge)] transition-colors shadow-[0_3px_0_0_var(--border)] active:translate-y-1 active:shadow-none cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          aria-label={getLevelLabel()}
        >
          {getLevelIcon()}
          <span className="hidden sm:inline">{getLevelLabel()}</span>
        </button>
      </div>
    </div>
  );
};
