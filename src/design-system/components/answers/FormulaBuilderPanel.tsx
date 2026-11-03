import React from 'react';
import { Delete, RotateCcw } from 'lucide-react';
import { Formula } from '../Formula';
import { sound } from '@/lib/audio';
import type { Verdict } from '@/engine/checkers/types';

export interface FormulaBuilderPanelProps {
  tiles: string[];
  accepted: string[];
  value?: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  verdict?: Verdict | null;
}

export const FormulaBuilderPanel: React.FC<FormulaBuilderPanelProps> = ({
  tiles,
  value,
  onChange,
  disabled = false,
  verdict,
}) => {
  const safeValue = value || '';

  const handleAddTile = (tile: string) => {
    if (disabled) return;
    sound.playClick();
    onChange(safeValue + tile);
  };

  const handleBackspace = () => {
    if (disabled || !safeValue) return;
    sound.playClick();
    onChange(safeValue.slice(0, -1));
  };

  const handleClear = () => {
    if (disabled || !safeValue) return;
    sound.playClick();
    onChange('');
  };

  return (
    <div className="w-full space-y-4">
      {/* Assembled Formula Display Slot */}
      <div
        className={`p-4 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border transition-all flex items-center justify-between min-h-[70px] ${
          verdict?.status === 'correct'
            ? 'border-2 border-[var(--ok-fill)] bg-[var(--ok-tint)]'
            : verdict?.status === 'incorrect'
            ? 'border-2 border-[var(--err-fill)] bg-[var(--err-tint)]'
            : 'border-[var(--border)]'
        }`}
      >
        <div className="flex-1 text-center font-bold text-2xl tracking-wider text-[var(--subject-fg)]">
          {value ? (
            <Formula formula={value} />
          ) : (
            <span className="text-sm font-normal text-[var(--text-tertiary)] italic">
              Nhấn các mảnh bên dưới để tạo công thức
            </span>
          )}
        </div>

        {/* Action buttons */}
        {!disabled && value && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleBackspace}
              title="Xóa ký tự cuối"
              className="p-2 rounded-xl bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] border border-[var(--border)] transition-colors cursor-pointer"
            >
              <Delete className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleClear}
              title="Xóa hết"
              className="p-2 rounded-xl bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] border border-[var(--border)] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Available Tiles Grid */}
      <div className="p-3 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-2xl">
        <div className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2.5 text-center">
          Các mảnh ghép công thức
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {tiles.map((tile, i) => (
            <button
              key={`${tile}-${i}`}
              type="button"
              disabled={disabled}
              onClick={() => handleAddTile(tile)}
              className="px-4 py-2.5 rounded-xl bg-[var(--bg-surface)] hover:border-[var(--subject-edge)] border border-[var(--border)] font-bold text-base text-[var(--text-primary)] shadow-[0_3px_0_0_var(--edge-neutral)] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer disabled:opacity-50"
            >
              <Formula formula={tile} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
