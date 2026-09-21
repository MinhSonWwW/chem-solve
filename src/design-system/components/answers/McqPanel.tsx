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

        if (isChecked) {
          if (correct) {
            classes =
              'bg-emerald-950/60 border-2 border-emerald-500 shadow-[0_4px_0_0_#059669] text-emerald-200 ring-2 ring-emerald-500/20';
            indicator = (
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                <Check className="w-4 h-4 stroke-[3.5]" />
              </div>
            );
          } else if (isSelected && !correct) {
            classes =
              'bg-rose-950/60 border-2 border-rose-500 shadow-[0_4px_0_0_#e11d48] text-rose-200 ring-2 ring-rose-500/20';
            indicator = (
              <div className="w-6 h-6 rounded-full bg-rose-500 text-slate-950 flex items-center justify-center font-black">
                <X className="w-4 h-4 stroke-[3.5]" />
              </div>
            );
          } else {
            classes = 'opacity-40 border-slate-800 bg-slate-950/50';
            indicator = (
              <div className="w-5 h-5 rounded-full border border-slate-700 text-[10px] text-slate-500 flex items-center justify-center font-bold">
                {letter}
              </div>
            );
          }
        } else {
          if (isSelected) {
            classes =
              'bg-cyan-950/50 border-2 border-cyan-400 shadow-[0_4px_0_0_#0891b2] text-cyan-200';
            indicator = (
              <div className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-black">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            );
          } else {
            classes =
              'bg-slate-900/90 border border-slate-800 shadow-[0_4px_0_0_#1e293b] hover:border-slate-700 active:translate-y-1 active:shadow-[0_1px_0_0_#1e293b]';
            indicator = (
              <div className="w-5 h-5 rounded-full border border-slate-700 text-[10px] text-slate-400 flex items-center justify-center font-bold">
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
              {isChecked && correct && (
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
