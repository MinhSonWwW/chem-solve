import React from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import type { Verdict } from '@/engine/checkers/types';
import { MathText } from '../MathText';

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
  return <MathText text={text} />;
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

        let borderClass = 'border-[var(--border)]';
        if (isChecked) {
          if (isStatementCorrect) {
            borderClass = 'border-[var(--ok-fill)]';
          } else if (isStatementWrong) {
            borderClass = 'border-[var(--err-fill)]';
          }
        }

        return (
          <div
            key={st.id}
            className={`p-4 rounded-2xl bg-[var(--bg-surface)] border ${borderClass} transition-colors`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <p className="text-sm text-[var(--text-primary)] leading-relaxed font-medium flex-1">
                {renderStatementText(st.text)}
              </p>
              {isChecked && (
                <div className="shrink-0 pt-0.5">
                  {isStatementCorrect ? (
                    <div
                      className="w-5 h-5 rounded-full bg-[var(--ok-fill)] text-white flex items-center justify-center shadow-sm"
                      title="Chính xác"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                    </div>
                  ) : isStatementWrong ? (
                    <div
                      className="w-5 h-5 rounded-full bg-[var(--err-fill)] text-white flex items-center justify-center shadow-sm"
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
                      ? 'bg-[var(--ok-tint)] border-[var(--ok-fill)] text-[var(--ok-fg)] shadow-[0_3px_0_0_var(--ok-edge)]'
                      : 'bg-[var(--err-tint)] border-[var(--err-fill)] text-[var(--err-fg)] shadow-[0_3px_0_0_var(--err-edge)]';
                  } else {
                    btnClass = 'bg-[var(--bg-canvas)] border-[var(--border)] text-[var(--text-tertiary)] opacity-50 cursor-default';
                  }
                } else if (isSelected) {
                  btnClass = 'bg-[var(--subject-tint)] border-2 border-[var(--subject-fill)] text-[var(--subject-fg)] shadow-[0_3px_0_0_var(--subject-edge)]';
                } else {
                  btnClass = 'bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--subject-edge)] shadow-[0_3px_0_0_var(--edge-neutral)] active:translate-y-[2px] active:shadow-none';
                }

                return (
                  <motion.button
                    key={String(val)}
                    type="button"
                    onClick={() => handleToggle(st.id, val)}
                    disabled={disabled}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all select-none ${
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
