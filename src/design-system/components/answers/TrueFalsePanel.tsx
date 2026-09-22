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

        let borderClass = 'border-slate-800';
        if (isChecked) {
          borderClass = isVerdictCorrect && isStatementCorrect
            ? 'border-emerald-500/60'
            : isStatementWrong
              ? 'border-rose-500/60'
              : 'border-slate-800';
        }

        return (
          <div
            key={st.id}
            className={`p-3.5 rounded-2xl bg-slate-900/90 border ${borderClass} transition-colors`}
          >
            <p className="text-sm text-slate-200 mb-3 leading-relaxed">{st.text}</p>
            <div className="flex gap-2">
              {[true, false].map((val) => {
                const isSelected = userAnswer === val;
                const label = val ? 'Đúng' : 'Sai';
                const Icon = val ? Check : X;

                let btnClass = '';
                if (isChecked && isSelected) {
                  btnClass = isVerdictCorrect && isStatementCorrect
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-rose-500/20 border-rose-500 text-rose-300';
                } else if (isSelected) {
                  btnClass = 'bg-cyan-950/50 border-cyan-400 text-cyan-200';
                } else {
                  btnClass = 'bg-slate-950/50 border-slate-700 text-slate-400 hover:border-slate-600';
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
