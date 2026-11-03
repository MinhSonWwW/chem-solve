import React from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import type { Verdict } from '@/engine/checkers/types';
import { MathText } from '../MathText';

export interface Option {
  id: string;
  label: string;
  note?: string;
}

export interface McqPanelProps {
  options: Option[];
  value: string | string[] | null;
  onChange: (value: string | string[]) => void;
  disabled?: boolean;
  correctId?: string;
  correctIds?: string[];
  isChecked?: boolean;
  verdict?: Verdict | null;
  multi?: boolean;
}

export const McqPanel: React.FC<McqPanelProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  correctId,
  correctIds,
  isChecked = false,
  verdict = null,
  multi = false,
}) => {
  const displayOptions = options;

  const selectedSet = new Set<string>(
    Array.isArray(value)
      ? (value as string[] | null) ?? []
      : value
      ? [value as string]
      : []
  );

  const isCorrectOption = (id: string) => {
    if (correctIds) return correctIds.includes(id);
    return id === correctId;
  };

  const handleSelect = (id: string) => {
    if (disabled) return;
    if (multi) {
      const current = (value as string[] | null) ?? [];
      const next = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id];
      onChange(next);
    } else {
      onChange(id);
    }
  };

  const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="space-y-2.5">
      {displayOptions.map((option, idx) => {
        const isSelected = selectedSet.has(option.id);
        const correct = isCorrectOption(option.id);
        const letter = LETTERS[idx] ?? `${idx + 1}`;

        let classes = '';
        let indicator: React.ReactNode = null;
        const isVerdictCorrect = verdict?.status === 'correct';

        if (isChecked) {
          if (isVerdictCorrect && correct) {
            classes =
              'bg-[var(--ok-tint)] border-2 border-[var(--ok-fill)] text-[var(--ok-fg)]';
            indicator = (
              <div className="w-6 h-6 rounded-full bg-[var(--ok-fill)] text-white flex items-center justify-center font-black shadow-sm">
                <Check className="w-4 h-4 stroke-[3.5]" />
              </div>
            );
          } else if (isSelected && !correct) {
            classes =
              'bg-[var(--err-tint)] border-2 border-[var(--err-fill)] text-[var(--err-fg)]';
            indicator = (
              <div className="w-6 h-6 rounded-full bg-[var(--err-fill)] text-white flex items-center justify-center font-black shadow-sm">
                <X className="w-4 h-4 stroke-[3.5]" />
              </div>
            );
          } else if (isSelected && correct && !isVerdictCorrect) {
            classes =
              'bg-[var(--warn-tint)] border-2 border-[var(--warn-fill)] text-[var(--warn-fg)]';
            indicator = (
              <div className="w-6 h-6 rounded-full bg-[var(--warn-fill)] text-[var(--on-ink)] flex items-center justify-center font-black shadow-sm">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            );
          } else {
            classes = 'opacity-40 border border-[var(--border)] bg-[var(--bg-canvas)] text-[var(--text-tertiary)]';
            indicator = (
              <div className="w-6 h-6 rounded-full border border-[var(--border)] text-[10px] text-[var(--text-tertiary)] flex items-center justify-center font-bold">
                {letter}
              </div>
            );
          }
        } else {
          if (isSelected) {
            classes =
              'bg-[var(--bg-surface)] border-2 border-[var(--subject-fill)] text-[var(--text-primary)] shadow-[0_2px_0_0_var(--subject-edge)]';
            indicator = (
              <div className="w-6 h-6 rounded-full bg-[var(--subject-fill)] text-white flex items-center justify-center font-black shadow-sm">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            );
          } else {
            classes =
              'bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--subject-edge)] text-[var(--text-primary)]';
            indicator = (
              <div className="w-6 h-6 rounded-full border border-[var(--border)] text-[11px] text-[var(--text-secondary)] flex items-center justify-center font-black">
                {letter}
              </div>
            );
          }
        }

        return (
          <motion.div
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`p-3.5 rounded-2xl flex items-center justify-between cursor-pointer select-none transition-all ${classes}`}
            whileTap={!disabled ? { scale: 0.98 } : undefined}
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm text-[var(--text-primary)]">
                <MathText text={option.label} />
              </span>
              {isChecked && isVerdictCorrect && correct && (
                <span className="text-[10px] font-black uppercase tracking-wider bg-[var(--ok-tint)] text-[var(--ok-fg)] px-2 py-0.5 rounded-md border border-[var(--ok-edge)]">
                  Chính xác
                </span>
              )}
              {isChecked && isSelected && !correct && (
                <span className="text-[10px] font-black uppercase tracking-wider bg-[var(--err-tint)] text-[var(--err-fg)] px-2 py-0.5 rounded-md border border-[var(--err-edge)]">
                  Bạn đã chọn
                </span>
              )}
            </div>
            {indicator}
          </motion.div>
        );
      })}
    </div>
  );
};
