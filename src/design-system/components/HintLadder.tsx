import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, BookOpen, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import type { Hint, SolutionStep } from '@/content/schema/exercise';

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
              <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <strong className="text-amber-300">Gợi ý 1</strong>
                </div>
                {hint1.text}
              </div>
            )}
            {hintsUsed >= 2 && hint2 && (
              <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-200">
                <div className="flex items-center gap-1.5 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <strong className="text-amber-300">Gợi ý 2</strong>
                </div>
                {hint2.text}
              </div>
            )}
            {stepsRevealedCount > 0 && (
              <div className="p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-xl text-xs text-indigo-200 space-y-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <strong className="text-indigo-300">
                    Bước giải ({stepsRevealedCount}/{steps.length})
                  </strong>
                </div>
                {steps.slice(0, stepsRevealedCount).map((step, i) => (
                  <div key={i} className="pl-2 border-l-2 border-indigo-700/40">
                    <strong className="text-indigo-300">{step.title}:</strong>{' '}
                    {step.body}
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
            className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
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
          className="p-3 bg-slate-900 border-2 border-slate-800 rounded-2xl text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors shadow-[0_4px_0_0_#1e293b] active:translate-y-1 active:shadow-none cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          aria-label={getLevelLabel()}
        >
          {getLevelIcon()}
          <span className="hidden sm:inline">{getLevelLabel()}</span>
        </button>
      </div>
    </div>
  );
};
