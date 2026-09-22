import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import type { Verdict } from '@/engine/checkers/types';

interface Option {
  id: string;
  label: string;
  note?: string;
}

export interface McqPanelProps {
  options: Option[];
  correctId?: string;
  correctIds?: string[];
  multi?: boolean;
  value: string | string[] | null;
  onChange: (v: string | string[]) => void;
  disabled: boolean;
  verdict?: Verdict;
}

export const McqPanel: React.FC<McqPanelProps> = ({
  options,
  correctId,
  correctIds,
  multi = false,
  value,
  onChange,
  disabled,
  verdict,
}) => {
  // Randomly shuffle options once per question so correct answer is not always first
  const displayOptions = useMemo(() => {
    const list = [...options];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [options]);

  const isChecked = !!verdict;
  const selectedSet = new Set(
    multi
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
            // Only highlight correct option in green when the user's answer is correct!
            classes =
              'bg-[#58cc02]/20 border-2 border-[#58cc02] shadow-[0_4px_0_0_#46a302] text-emerald-200';
            indicator = (
              <div className="w-6 h-6 rounded-full bg-[#58cc02] text-white flex items-center justify-center font-black shadow-sm">
                <Check className="w-4 h-4 stroke-[3.5]" />
              </div>
            );
          } else if (isSelected && !correct) {
            // When user selected an incorrect option, highlight it in red
            classes =
              'bg-[#ff4b4b]/20 border-2 border-[#ff4b4b] shadow-[0_4px_0_0_#ea2b2b] text-rose-200';
            indicator = (
              <div className="w-6 h-6 rounded-full bg-[#ff4b4b] text-white flex items-center justify-center font-black shadow-sm">
                <X className="w-4 h-4 stroke-[3.5]" />
              </div>
            );
          } else if (isSelected && correct && !isVerdictCorrect) {
            // Selected partially correct in multi-choice, but overall wrong
            classes =
              'bg-[#ff9600]/20 border-2 border-[#ff9600] shadow-[0_4px_0_0_#e07a00] text-amber-200';
            indicator = (
              <div className="w-6 h-6 rounded-full bg-[#ff9600] text-white flex items-center justify-center font-black shadow-sm">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            );
          } else {
            // Unselected options (including the correct answer when user is wrong)
            // DO NOT highlight in green! Keep neutral and unrevealed.
            classes = 'opacity-40 border-2 border-[#20333d] bg-[#131f24]/60 text-slate-400';
            indicator = (
              <div className="w-6 h-6 rounded-full border border-[#2e4756] text-[10px] text-slate-500 flex items-center justify-center font-bold">
                {letter}
              </div>
            );
          }
        } else {
          if (isSelected) {
            classes =
              'bg-[#0ea5e9]/15 border-2 border-[#0ea5e9] shadow-[0_4px_0_0_#0284c7] text-[#38bdf8]';
            indicator = (
              <div className="w-6 h-6 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center font-black shadow-sm">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            );
          } else {
            classes =
              'bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24] hover:border-[#38bdf8] active:translate-y-1 active:shadow-none text-slate-200';
            indicator = (
              <div className="w-6 h-6 rounded-full border-2 border-[#2e4756] text-[11px] text-slate-300 flex items-center justify-center font-black">
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
              <span className="font-bold text-sm text-slate-100">
                {option.label}
              </span>
              {isChecked && isVerdictCorrect && correct && (
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/40">
                  Chính xác
                </span>
              )}
              {isChecked && isSelected && !correct && (
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-md border border-rose-500/40">
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
