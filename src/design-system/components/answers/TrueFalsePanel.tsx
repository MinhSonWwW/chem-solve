import React from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import type { Verdict } from '@/engine/checkers/types';
import { Formula } from '../Formula';

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

function renderStatementText(text: string): React.ReactNode {
  const parts = text.split(/\[\[([^\]]+)\]\]/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <Formula key={i} code={part} className="text-cyan-300 font-bold" />
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

export const TrueFalsePanel: React.FC<TrueFalsePanelProps> = ({
  statements,
  value,
  onChange,
  disabled,
  verdict,
}) => {
  const isChecked = !!verdict;

  const handleToggle = (id: string, answer: boolean) => {
    if (disabled) return;
    onChange({ ...value, [id]: answer });
  };

  return (
    <div className="space-y-3">
      {statements.map((st) => {
        const userAnswer = value[st.id];
        const hasAnswered = userAnswer !== undefined;
        const isStatementCorrect = hasAnswered && userAnswer === st.correct;
        const isStatementWrong = (hasAnswered && userAnswer !== st.correct) || (!hasAnswered && isChecked);

        let borderClass = 'border-[#2e4756] shadow-[0_4px_0_0_#131f24]';
        if (isChecked) {
          if (isStatementCorrect) {
            borderClass = 'border-[#58cc02] shadow-[0_4px_0_0_#1e460d]';
          } else if (isStatementWrong) {
            borderClass = 'border-[#ff4b4b] shadow-[0_4px_0_0_#5c1414]';
          }
        }

        return (
          <div
            key={st.id}
            className={`p-4 rounded-3xl bg-[#18272f] border-2 ${borderClass} transition-colors`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <p className="text-sm text-slate-200 leading-relaxed font-medium flex-1">
                {renderStatementText(st.text)}
              </p>
              {isChecked && (
                <div className="shrink-0 pt-0.5">
                  {isStatementCorrect ? (
                    <div
                      className="w-5 h-5 rounded-full bg-[#58cc02] text-white flex items-center justify-center shadow-sm"
                      title="Chính xác"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                    </div>
                  ) : isStatementWrong ? (
                    <div
                      className="w-5 h-5 rounded-full bg-[#ff4b4b] text-white flex items-center justify-center shadow-sm"
                      title="Chưa chính xác"
                    >
                      <X className="w-3.5 h-3.5 stroke-[3.5]" />
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div className="flex gap-2.5">
              {[true, false].map((val) => {
                const isSelected = userAnswer === val;
                const label = val ? 'Đúng' : 'Sai';
                const Icon = val ? Check : X;

                let btnClass = '';
                if (isChecked) {
                  if (isSelected) {
                    btnClass = isStatementCorrect
                      ? 'bg-[#58cc02]/20 border-[#58cc02] text-emerald-300 shadow-[0_3px_0_0_#46a302]'
                      : 'bg-[#ff4b4b]/20 border-[#ff4b4b] text-rose-300 shadow-[0_3px_0_0_#ea2b2b]';
                  } else {
                    btnClass = 'bg-[#18272f] border-[#20333d] text-slate-500 opacity-50 cursor-default';
                  }
                } else if (isSelected) {
                  btnClass = 'bg-[#0ea5e9]/20 border-[#0ea5e9] text-[#38bdf8] shadow-[0_3px_0_0_#0284c7]';
                } else {
                  btnClass = 'bg-[#20333d] border-[#2e4756] text-slate-300 hover:border-[#38bdf8] shadow-[0_3px_0_0_#131f24] active:translate-y-[2px] active:shadow-none';
                }

                return (
                  <motion.button
                    key={String(val)}
                    type="button"
                    onClick={() => handleToggle(st.id, val)}
                    disabled={disabled}
                    className={`flex-1 py-2 px-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all select-none ${
                      disabled ? 'cursor-default' : 'cursor-pointer'
                    } ${btnClass}`}
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
