import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import type { Verdict } from '@/engine/checkers/types';

interface Pair {
  left: string;
  right: string;
}

export interface MatchGridProps {
  pairs: Pair[];
  value: Array<{ left: string; right: string }>;
  onChange: (v: Array<{ left: string; right: string }>) => void;
  disabled: boolean;
  verdict?: Verdict;
}

/**
 * Tap-to-pair matching grid.
 * User taps a left item, then taps a right item to pair them.
 */
export const MatchGrid: React.FC<MatchGridProps> = ({
  pairs,
  value,
  onChange,
  disabled,
  verdict,
}) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const isChecked = !!verdict;

  // Shuffle right side (but keep stable between renders via memo)
  const leftItems = pairs.map((p) => p.left);
  const rightItems = React.useMemo(() => {
    const items = pairs.map((p) => p.right);
    // Simple deterministic shuffle based on first pair's left text
    return [...items].sort(() => {
      return pairs[0]?.left.charCodeAt(0) % 2 === 0 ? 0.5 : -0.5;
    });
  }, [pairs]);

  const safeValue = value || [];
  const pairedLeft = new Set(safeValue.map((v) => v.left));
  const pairedRight = new Set(safeValue.map((v) => v.right));

  const getPairForLeft = (left: string) => safeValue.find((v) => v.left === left);
  const getPairForRight = (right: string) => safeValue.find((v) => v.right === right);

  const isCorrectPair = (left: string, right: string) => {
    return pairs.some((p) => p.left === left && p.right === right);
  };

  const handleLeftTap = (left: string) => {
    if (disabled) return;
    // If already paired, unpair it
    if (pairedLeft.has(left)) {
      onChange(safeValue.filter((v) => v.left !== left));
      return;
    }
    setSelectedLeft(left);
  };

  const handleRightTap = (right: string) => {
    if (disabled || !selectedLeft) return;
    // If already paired, unpair the right
    const newValue = safeValue.filter((v) => v.right !== right && v.left !== selectedLeft);
    newValue.push({ left: selectedLeft, right });
    onChange(newValue);
    setSelectedLeft(null);
  };

  const isVerdictCorrect = verdict?.status === 'correct';

  const getLeftStyle = (left: string) => {
    if (isChecked) {
      const pair = getPairForLeft(left);
      if (pair) {
        if (isVerdictCorrect && isCorrectPair(pair.left, pair.right)) {
          return 'border-emerald-500 bg-emerald-950/40 text-emerald-200';
        }
        return isCorrectPair(pair.left, pair.right)
          ? 'border-cyan-600/40 bg-cyan-950/30 text-cyan-300'
          : 'border-rose-500 bg-rose-950/40 text-rose-200';
      }
      return 'border-slate-800 opacity-40';
    }
    if (selectedLeft === left)
      return 'border-cyan-400 bg-cyan-950/50 text-cyan-200 shadow-[0_4px_0_0_#0891b2]';
    if (pairedLeft.has(left))
      return 'border-cyan-600/40 bg-cyan-950/30 text-cyan-300';
    return 'border-slate-700 bg-slate-900/90 text-slate-200 hover:border-slate-600';
  };

  const getRightStyle = (right: string) => {
    if (isChecked) {
      const pair = getPairForRight(right);
      if (pair) {
        if (isVerdictCorrect && isCorrectPair(pair.left, pair.right)) {
          return 'border-emerald-500 bg-emerald-950/40 text-emerald-200';
        }
        return isCorrectPair(pair.left, pair.right)
          ? 'border-cyan-600/40 bg-cyan-950/30 text-cyan-300'
          : 'border-rose-500 bg-rose-950/40 text-rose-200';
      }
      return 'border-slate-800 opacity-40';
    }
    if (pairedRight.has(right))
      return 'border-cyan-600/40 bg-cyan-950/30 text-cyan-300';
    if (selectedLeft)
      return 'border-slate-600 bg-slate-900/90 text-slate-200 hover:border-cyan-400 shadow-[0_4px_0_0_#1e293b]';
    return 'border-slate-800 bg-slate-950/50 text-slate-400';
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Left column */}
      <div className="space-y-2">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">
          Đại lượng
        </div>
        {leftItems.map((left) => (
          <motion.button
            key={left}
            onClick={() => handleLeftTap(left)}
            disabled={disabled}
            className={`w-full p-3 rounded-xl border-2 text-xs font-bold text-left transition-all cursor-pointer select-none ${getLeftStyle(left)}`}
            whileTap={!disabled ? { scale: 0.97 } : undefined}
          >
            <div className="flex items-center justify-between">
              <span>{left}</span>
              {pairedLeft.has(left) && !isChecked && (
                <Check className="w-3.5 h-3.5 text-cyan-400" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Right column */}
      <div className="space-y-2">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">
          Công thức
        </div>
        {rightItems.map((right) => (
          <motion.button
            key={right}
            onClick={() => handleRightTap(right)}
            disabled={disabled || !selectedLeft}
            className={`w-full p-3 rounded-xl border-2 text-xs font-bold text-left transition-all cursor-pointer select-none ${getRightStyle(right)}`}
            whileTap={!disabled && selectedLeft ? { scale: 0.97 } : undefined}
          >
            {right}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
