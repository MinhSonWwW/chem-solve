import React from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import type { Verdict } from '@/engine/checkers/types';

interface Statement {
  id: string;
  text: string;
  correct: boolean;
}

export interface TrueFalsePanelProps {
  statements: Statement[];
  value: Record<string, boolean>;
  onChange: (v: Record<string, boolean>) => void;
  disabled: boolean;
  verdict?: Verdict;
}

export const TrueFalsePanel: React.FC<TrueFalsePanelProps> = ({
  statements,
  value,
  onChange,
  disabled,
  verdict,
}) => {
  const isChecked = !!verdict;

  // Randomize presentation order so students must read each statement rather than guessing by position
  const displayStatements = React.useMemo(() => {
    return [...statements].sort(() => Math.random() - 0.5);
  }, [statements]);

  const handleToggle = (id: string, answer: boolean) => {
    if (disabled) return;
    onChange({ ...value, [id]: answer });
  };

  return (
    <div className="space-y-3">
      {displayStatements.map((st) => {
        const userAnswer = value[st.id];
        const hasAnswered = userAnswer !== undefined;
        const isVerdictCorrect = verdict?.status === 'correct';
        const isStatementCorrect = hasAnswered && userAnswer === st.correct;
        const isStatementWrong = hasAnswered && userAnswer !== st.correct;

        let borderClass = 'border-[#2e4756]';
        if (isChecked) {
          borderClass = isVerdictCorrect && isStatementCorrect
            ? 'border-[#58cc02]'
            : isStatementWrong
              ? 'border-[#ff4b4b]'
              : 'border-[#2e4756]';
        }

        return (
          <div
            key={st.id}
            className={`p-4 rounded-3xl bg-[#18272f] border-2 ${borderClass} shadow-[0_4px_0_0_#131f24] transition-colors`}
          >
            <p className="text-sm text-slate-200 mb-3 leading-relaxed font-medium">{st.text}</p>
            <div className="flex gap-2.5">
              {[true, false].map((val) => {
                const isSelected = userAnswer === val;
                const label = val ? 'Đúng' : 'Sai';
                const Icon = val ? Check : X;

                let btnClass = '';
                if (isChecked && isSelected) {
                  btnClass = isVerdictCorrect && isStatementCorrect
                    ? 'bg-[#58cc02]/20 border-[#58cc02] text-emerald-300 shadow-[0_3px_0_0_#46a302]'
                    : 'bg-[#ff4b4b]/20 border-[#ff4b4b] text-rose-300 shadow-[0_3px_0_0_#ea2b2b]';
                } else if (isSelected) {
                  btnClass = 'bg-[#0ea5e9]/20 border-[#0ea5e9] text-[#38bdf8] shadow-[0_3px_0_0_#0284c7]';
                } else {
                  btnClass = 'bg-[#20333d] border-[#2e4756] text-slate-300 hover:border-[#38bdf8] shadow-[0_3px_0_0_#131f24] active:translate-y-[2px] active:shadow-none';
                }

                return (
                  <motion.button
                    key={String(val)}
                    onClick={() => handleToggle(st.id, val)}
                    disabled={disabled}
                    className={`flex-1 py-2 px-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none ${btnClass}`}
                    whileTap={!disabled ? { scale: 0.95 } : undefined}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
