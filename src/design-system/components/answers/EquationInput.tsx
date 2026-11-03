import React, { useEffect, useMemo } from 'react';
import { Plus, Minus, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { Formula } from '../Formula';
import { checkBalance } from '@/chem/checkBalance';
import { sound } from '@/lib/audio';
import type { Verdict } from '@/engine/checkers/types';

export interface EquationInputProps {
  mode: 'fill-coefficients' | 'build';
  reactants: string[];
  products: string[];
  coefficients: number[];
  condition?: string;
  value?: number[] | string;
  onChange: (val: number[] | string) => void;
  disabled?: boolean;
  verdict?: Verdict | null;
}

export const EquationInput: React.FC<EquationInputProps> = ({
  mode,
  reactants,
  products,
  coefficients: _coefficients,
  condition,
  value,
  onChange,
  disabled = false,
  verdict,
}) => {
  const totalSubstances = reactants.length + products.length;

  // Initialize coefficients array with default 1s
  const currentCoeffs = useMemo<number[]>(() => {
    if (Array.isArray(value) && value.length === totalSubstances) {
      return value;
    }
    return new Array(totalSubstances).fill(1);
  }, [value, totalSubstances]);

  // Ensure parent has the initial value on mount
  useEffect(() => {
    if (!value && mode === 'fill-coefficients') {
      onChange(new Array(totalSubstances).fill(1));
    }
  }, [value, mode, totalSubstances, onChange]);

  const updateCoeff = (index: number, delta: number) => {
    if (disabled) return;
    sound.playClick();
    const next = [...currentCoeffs];
    const newVal = Math.max(1, Math.min(20, (next[index] || 1) + delta));
    next[index] = newVal;
    onChange(next);
  };

  const setDirectCoeff = (index: number, valStr: string) => {
    if (disabled) return;
    const num = parseInt(valStr, 10);
    const next = [...currentCoeffs];
    if (isNaN(num) || num < 1) {
      next[index] = 1;
    } else {
      next[index] = Math.min(20, num);
    }
    onChange(next);
  };

  // Check balance real-time for atom counter
  const balanceInfo = useMemo(() => {
    try {
      const leftStr = reactants
        .map((r, i) => `${currentCoeffs[i] > 1 ? currentCoeffs[i] : ''}${r}`)
        .join(' + ');
      const rightStr = products
        .map((p, i) => {
          const c = currentCoeffs[reactants.length + i];
          return `${c > 1 ? c : ''}${p}`;
        })
        .join(' + ');
      const eqStr = `${leftStr} -> ${rightStr}`;
      return checkBalance(eqStr);
    } catch {
      return null;
    }
  }, [reactants, products, currentCoeffs]);

  // Merge elements from both sides to display atom balance
  const elements = useMemo(() => {
    if (!balanceInfo) return [];
    const set = new Set([
      ...Object.keys(balanceInfo.leftAtoms),
      ...Object.keys(balanceInfo.rightAtoms),
    ]);
    return Array.from(set).sort();
  }, [balanceInfo]);

  if (mode === 'build') {
    return (
      <div className="w-full space-y-3">
        <label className="block text-xs font-semibold text-[var(--text-secondary)]">
          Nhập toàn bộ phương trình hóa học (Ví dụ: 2H2 + O2 {'->'} 2H2O):
        </label>
        <input
          type="text"
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="A + B -> C + D"
          className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border)] focus:border-[var(--subject-fill)] rounded-xl text-[var(--subject-fg)] font-mono text-base outline-none transition-colors disabled:opacity-60"
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Interactive Equation Card */}
      <div
        className={`p-4 sm:p-6 rounded-2xl border transition-all ${
          verdict?.status === 'correct'
            ? 'border-[var(--ok-edge)] bg-[var(--ok-tint)]'
            : verdict?.status === 'incorrect'
            ? 'border-[var(--err-edge)] bg-[var(--err-tint)]'
            : 'border-[var(--border)] bg-[var(--bg-surface)]'
        }`}
      >
        <div className="text-center text-xs font-semibold text-[var(--text-muted)] mb-4 uppercase tracking-wider">
          Chọn hệ số thích hợp trước mỗi chất để cân bằng
        </div>

        {/* Reaction Equation Flow */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-4 text-[var(--text-primary)]">
          {/* Reactants */}
          {reactants.map((reactant, i) => (
            <React.Fragment key={`r-${i}`}>
              {i > 0 && <span className="text-xl font-black text-[var(--text-muted)] select-none">+</span>}
              <div className="flex items-center gap-2 bg-[var(--bg-surface-2)] px-2.5 py-2 rounded-2xl border border-[var(--border)]">
                {/* Stepper controls */}
                <div className="flex items-center bg-[var(--bg-surface)] rounded-xl p-1 border border-[var(--border)] gap-1">
                  <button
                    type="button"
                    disabled={disabled || currentCoeffs[i] <= 1}
                    onClick={() => updateCoeff(i, -1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--bg-surface-2)] hover:bg-[var(--border)] text-[var(--text-primary)] border border-[var(--border)] active:translate-y-[1px] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    disabled={disabled}
                    value={currentCoeffs[i]}
                    onChange={(e) => setDirectCoeff(i, e.target.value)}
                    className="w-7 text-center bg-transparent font-black text-[var(--warn-fg)] text-base focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    disabled={disabled || currentCoeffs[i] >= 20}
                    onClick={() => updateCoeff(i, 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--bg-surface-2)] hover:bg-[var(--border)] text-[var(--text-primary)] border border-[var(--border)] active:translate-y-[1px] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
                <div className="text-base sm:text-lg font-black px-1 text-[var(--subject-fg)]">
                  <Formula formula={reactant} />
                </div>
              </div>
            </React.Fragment>
          ))}

          {/* Reaction Arrow with condition badge */}
          <div className="flex flex-col items-center px-1 text-[var(--warn-fg)]">
            {condition ? (
              <span className="text-[10px] font-black text-[var(--warn-fg)] tracking-tighter mb-0.5 px-1.5 py-0.5 rounded bg-[var(--warn-tint)] border border-[var(--warn-edge)] shadow-sm">
                {condition}
              </span>
            ) : (
              <span className="text-[10px] font-black text-[var(--warn-fg)] tracking-tighter mb-0.5 opacity-80">
                t°
              </span>
            )}
            <div className="flex items-center">
              <span className="h-0.5 w-6 bg-[var(--warn-fill)] rounded"></span>
              <ArrowRight className="w-5 h-5 -ml-1.5 text-[var(--warn-fg)]" />
            </div>
          </div>

          {/* Products */}
          {products.map((product, j) => {
            const idx = reactants.length + j;
            return (
              <React.Fragment key={`p-${j}`}>
                {j > 0 && <span className="text-xl font-black text-[var(--text-muted)] select-none">+</span>}
                <div className="flex items-center gap-2 bg-[var(--bg-surface-2)] px-2.5 py-2 rounded-2xl border border-[var(--border)]">
                  {/* Stepper controls */}
                  <div className="flex items-center bg-[var(--bg-surface)] rounded-xl p-1 border border-[var(--border)] gap-1">
                    <button
                      type="button"
                      disabled={disabled || currentCoeffs[idx] <= 1}
                      onClick={() => updateCoeff(idx, -1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--bg-surface-2)] hover:bg-[var(--border)] text-[var(--text-primary)] border border-[var(--border)] active:translate-y-[1px] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      disabled={disabled}
                      value={currentCoeffs[idx]}
                      onChange={(e) => setDirectCoeff(idx, e.target.value)}
                      className="w-7 text-center bg-transparent font-black text-[var(--warn-fg)] text-base focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      disabled={disabled || currentCoeffs[idx] >= 20}
                      onClick={() => updateCoeff(idx, 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--bg-surface-2)] hover:bg-[var(--border)] text-[var(--text-primary)] border border-[var(--border)] active:translate-y-[1px] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                  <div className="text-base sm:text-lg font-black px-1 text-[var(--subject-fg)]">
                    <Formula formula={product} />
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Real-time Atom Balance Indicator - Spectrometer Style */}
      {balanceInfo && elements.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 p-3 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-xs">
          <span className="text-[var(--text-muted)] font-bold mr-1 uppercase text-[11px] tracking-wider">
            Cân bằng nguyên tử:
          </span>
          {elements.map((elem) => {
            const left = balanceInfo.leftAtoms[elem] || 0;
            const right = balanceInfo.rightAtoms[elem] || 0;
            const isMatch = left === right;
            return (
              <span
                key={elem}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono font-black transition-all ${
                  isMatch
                    ? 'bg-[var(--ok-tint)] text-[var(--ok-fg)] border border-[var(--ok-edge)]'
                    : 'bg-[var(--warn-tint)] text-[var(--warn-fg)] border border-[var(--warn-edge)]'
                }`}
              >
                <span>{elem}:</span>
                <span>
                  {left} {isMatch ? '=' : '≠'} {right}
                </span>
                {isMatch ? (
                  <Check className="w-3.5 h-3.5 text-[var(--ok-fg)] stroke-[3]" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-[var(--warn-fg)] stroke-[2.5]" />
                )}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
