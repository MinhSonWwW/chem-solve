import React, { useRef, useEffect } from 'react';
import type { Verdict } from '@/engine/checkers/types';

export interface NumberInputProps {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  unit?: string;
  verdict?: Verdict;
  placeholder?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  disabled,
  unit,
  verdict,
  placeholder = 'Nhập đáp án…',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isChecked = !!verdict;

  // Auto-focus on mount (only on desktop; on mobile the user taps)
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
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-slate-100 text-lg font-bold outline-none placeholder:text-slate-600"
        style={{ fontSize: '16px' }} /* Prevent iOS zoom */
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
      {unit && (
        <span className="text-sm font-bold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
          {unit}
        </span>
      )}
    </div>
  );
};
