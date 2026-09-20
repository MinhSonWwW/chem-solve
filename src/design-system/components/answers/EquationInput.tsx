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
        <label className="block text-xs font-semibold text-slate-300">
          Nhập toàn bộ phương trình hóa học (Ví dụ: 2H2 + O2 {'->'} 2H2O):
        </label>
        <input
          type="text"
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="A + B -> C + D"
          className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 focus:border-cyan-500 rounded-xl text-cyan-200 font-mono text-base outline-none transition-colors disabled:opacity-60"
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Interactive Equation Card */}
      <div
        className={`p-4 sm:p-6 rounded-2xl bg-slate-900/90 border-2 transition-all ${
          verdict?.status === 'correct'
            ? 'border-emerald-500/80 bg-emerald-950/20 shadow-lg shadow-emerald-950/30'
            : verdict?.status === 'incorrect'
            ? 'border-rose-500/80 bg-rose-950/20'
            : 'border-slate-800 shadow-xl'
        }`}
      >
        <div className="text-center text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">
          Chọn hệ số thích hợp trước mỗi chất để cân bằng
        </div>

        {/* Reaction Equation Flow */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-4 text-slate-100">
          {/* Reactants */}
          {reactants.map((reactant, i) => (
            <React.Fragment key={`r-${i}`}>
              {i > 0 && <span className="text-xl font-bold text-slate-500">+</span>}
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1.5 rounded-xl border border-slate-700/80 shadow-inner">
                {/* Stepper controls */}
                <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-700">
                  <button
                    type="button"
                    disabled={disabled || currentCoeffs[i] <= 1}
                    onClick={() => updateCoeff(i, -1)}
                    className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    disabled={disabled}
                    value={currentCoeffs[i]}
                    onChange={(e) => setDirectCoeff(i, e.target.value)}
                    className="w-8 text-center bg-transparent font-bold text-amber-400 text-base focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    disabled={disabled || currentCoeffs[i] >= 20}
                    onClick={() => updateCoeff(i, 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-lg font-bold px-1 text-cyan-300">
                  <Formula formula={reactant} />
                </div>
              </div>
            </React.Fragment>
          ))}

          {/* Arrow */}
          <div className="flex flex-col items-center px-1 text-amber-400">
            {condition && (
              <span className="text-[10px] font-bold text-amber-300 tracking-tighter mb-0.5">
                {condition}
              </span>
            )}
            <div className="flex items-center gap-0.5">
              <span className="h-0.5 w-5 bg-amber-400"></span>
              <ArrowRight className="w-5 h-5 -ml-1.5" />
            </div>
          </div>

          {/* Products */}
          {products.map((product, j) => {
            const idx = reactants.length + j;
            return (
              <React.Fragment key={`p-${j}`}>
                {j > 0 && <span className="text-xl font-bold text-slate-500">+</span>}
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1.5 rounded-xl border border-slate-700/80 shadow-inner">
                  {/* Stepper controls */}
                  <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-700">
                    <button
                      type="button"
                      disabled={disabled || currentCoeffs[idx] <= 1}
                      onClick={() => updateCoeff(idx, -1)}
                      className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      disabled={disabled}
                      value={currentCoeffs[idx]}
                      onChange={(e) => setDirectCoeff(idx, e.target.value)}
                      className="w-8 text-center bg-transparent font-bold text-amber-400 text-base focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      disabled={disabled || currentCoeffs[idx] >= 20}
                      onClick={() => updateCoeff(idx, 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-lg font-bold px-1 text-emerald-300">
                    <Formula formula={product} />
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Real-time Atom Balance Indicator */}
      {balanceInfo && elements.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Số nguyên tử hai vế:</span>
          {elements.map((elem) => {
            const left = balanceInfo.leftAtoms[elem] || 0;
            const right = balanceInfo.rightAtoms[elem] || 0;
            const isMatch = left === right;
            return (
              <span
                key={elem}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono font-bold transition-all ${
                  isMatch
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                    : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                }`}
              >
                <span>{elem}:</span>
                <span>
                  {left} {isMatch ? '=' : '≠'} {right}
                </span>
                {isMatch ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                )}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
