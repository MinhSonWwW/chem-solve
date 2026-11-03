import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import type { Verdict } from '@/engine/checkers/types';
import { MathText } from '../MathText';

export interface MatchGridProps {
  pairs: Array<{ left: string; right: string }>;
  value: Array<{ left: string; right: string }>;
  onChange: (v: Array<{ left: string; right: string }>) => void;
  disabled: boolean;
  verdict?: Verdict;
}

export const MatchGrid: React.FC<MatchGridProps> = ({
  pairs,
  value,
  onChange,
  disabled,
  verdict,
}) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const isChecked = !!verdict;

  const leftItems = pairs.map((p) => p.left);
  const [rightItems] = useState(() =>
    [...pairs.map((p) => p.right)].sort(() => Math.random() - 0.5)
  );

  const safeValue = value ?? [];
  const pairedLeft = new Set(safeValue.map((v) => v.left));
  const pairedRight = new Set(safeValue.map((v) => v.right));

  const getPairForLeft = (left: string) => safeValue.find((v) => v.left === left);
  const getPairForRight = (right: string) => safeValue.find((v) => v.right === right);

  const isCorrectPair = (left: string, right: string) => {
    return pairs.some((p) => p.left === left && p.right === right);
  };

  const handleLeftTap = (left: string) => {
    if (disabled) return;
    if (pairedLeft.has(left)) {
      onChange(safeValue.filter((v) => v.left !== left));
      return;
    }
    setSelectedLeft(left);
  };

  const handleRightTap = (right: string) => {
    if (disabled || !selectedLeft) return;
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
          return 'border-2 border-[var(--ok-fill)] bg-[var(--ok-tint)] text-[var(--ok-fg)] shadow-[0_3px_0_0_var(--ok-edge)]';
        }
        return isCorrectPair(pair.left, pair.right)
          ? 'border-2 border-[var(--subject-fill)] bg-[var(--subject-tint)] text-[var(--subject-fg)] shadow-[0_3px_0_0_var(--subject-edge)]'
          : 'border-2 border-[var(--err-fill)] bg-[var(--err-tint)] text-[var(--err-fg)] shadow-[0_3px_0_0_var(--err-edge)]';
      }
      return 'border border-[var(--border)] bg-[var(--bg-canvas)] opacity-40 text-[var(--text-tertiary)]';
    }
    if (selectedLeft === left)
      return 'border-2 border-[var(--subject-fill)] bg-[var(--subject-tint)] text-[var(--subject-fg)] shadow-[0_4px_0_0_var(--subject-edge)] scale-[1.02]';
    if (pairedLeft.has(left))
      return 'border-2 border-[var(--subject-fill)] bg-[var(--subject-tint)] text-[var(--subject-fg)] shadow-[0_3px_0_0_var(--subject-edge)]';
    return 'border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--subject-edge)] shadow-[0_3px_0_0_var(--edge-neutral)] active:translate-y-[2px] active:shadow-none';
  };

  const getRightStyle = (right: string) => {
    if (isChecked) {
      const pair = getPairForRight(right);
      if (pair) {
        if (isVerdictCorrect && isCorrectPair(pair.left, pair.right)) {
          return 'border-2 border-[var(--ok-fill)] bg-[var(--ok-tint)] text-[var(--ok-fg)] shadow-[0_3px_0_0_var(--ok-edge)]';
        }
        return isCorrectPair(pair.left, pair.right)
          ? 'border-2 border-[var(--subject-fill)] bg-[var(--subject-tint)] text-[var(--subject-fg)] shadow-[0_3px_0_0_var(--subject-edge)]'
          : 'border-2 border-[var(--err-fill)] bg-[var(--err-tint)] text-[var(--err-fg)] shadow-[0_3px_0_0_var(--err-edge)]';
      }
      return 'border border-[var(--border)] bg-[var(--bg-canvas)] opacity-40 text-[var(--text-tertiary)]';
    }
    if (pairedRight.has(right))
      return 'border-2 border-[var(--subject-fill)] bg-[var(--subject-tint)] text-[var(--subject-fg)] shadow-[0_3px_0_0_var(--subject-edge)]';
    if (selectedLeft)
      return 'border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--subject-edge)] shadow-[0_3px_0_0_var(--edge-neutral)] animate-pulse';
    return 'border border-[var(--border)] bg-[var(--bg-canvas)] text-[var(--text-tertiary)]';
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Left column */}
      <div className="space-y-2">
        <div className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1 px-1">
          Cột A
        </div>
        {leftItems.map((left) => (
          <motion.button
            key={left}
            onClick={() => handleLeftTap(left)}
            disabled={disabled}
            className={`w-full p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer select-none ${getLeftStyle(left)}`}
            whileTap={!disabled ? { scale: 0.97 } : undefined}
          >
            <div className="flex items-center justify-between">
              <span>
                <MathText text={left} />
              </span>
              {pairedLeft.has(left) && !isChecked && (
                <Check className="w-3.5 h-3.5 text-[var(--subject-fg)]" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Right column */}
      <div className="space-y-2">
        <div className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1 px-1">
          Cột B
        </div>
        {rightItems.map((right) => (
          <motion.button
            key={right}
            onClick={() => handleRightTap(right)}
            disabled={disabled || !selectedLeft}
            className={`w-full p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer select-none ${getRightStyle(right)}`}
            whileTap={!disabled && selectedLeft ? { scale: 0.97 } : undefined}
          >
            <MathText text={right} />
          </motion.button>
        ))}
      </div>
    </div>
  );
};
