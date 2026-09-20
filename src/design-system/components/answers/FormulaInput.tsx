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

  let borderClass = 'border-slate-700 focus-within:border-cyan-400';
  if (isChecked) {
    borderClass =
      verdict.status === 'correct'
        ? 'border-emerald-500'
        : verdict.status === 'partial'
          ? 'border-amber-500'
          : 'border-rose-500';
  }

  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-2xl bg-slate-900/90 border-2 transition-colors ${borderClass}`}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-slate-100 text-lg font-bold outline-none placeholder:text-slate-600 font-mono"
        style={{ fontSize: '16px' }}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
      <span className="text-[10px] font-bold text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/60">
        CTHH
      </span>
    </div>
  );
};
