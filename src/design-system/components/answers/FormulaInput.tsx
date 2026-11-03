import React, { useRef, useEffect } from 'react';
import type { Verdict } from '@/engine/checkers/types';

export interface FormulaInputProps {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  verdict?: Verdict;
  placeholder?: string;
}

export const FormulaInput: React.FC<FormulaInputProps> = ({
  value,
  onChange,
  disabled,
  verdict,
  placeholder = 'Nhập công thức…',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isChecked = !!verdict;

  useEffect(() => {
    if (!disabled && inputRef.current && window.innerWidth >= 768) {
      inputRef.current.focus();
    }
  }, [disabled]);

  let borderClass = 'border-[var(--border)] focus-within:border-[var(--subject-fill)]';
  if (isChecked) {
    borderClass =
      verdict.status === 'correct'
        ? 'border-[var(--ok-fill)]'
        : verdict.status === 'partial'
          ? 'border-[var(--warn-fill)]'
          : 'border-[var(--err-fill)]';
  }

  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-2xl bg-[var(--bg-surface-2)] border-2 transition-colors ${borderClass}`}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[var(--text-primary)] text-lg font-bold outline-none placeholder:text-[var(--text-tertiary)] font-mono"
        style={{ fontSize: '16px' }}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
      <span className="text-[10px] font-bold text-[var(--text-tertiary)] bg-[var(--bg-canvas)] px-2 py-0.5 rounded-md border border-[var(--border)]">
        CTHH
      </span>
    </div>
  );
};
