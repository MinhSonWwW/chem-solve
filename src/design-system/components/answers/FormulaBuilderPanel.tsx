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
  value = '',
  onChange,
  disabled = false,
  verdict,
}) => {
  const handleAddTile = (tile: string) => {
    if (disabled) return;
    sound.playClick();
    onChange(value + tile);
  };

  const handleBackspace = () => {
    if (disabled || !value) return;
    sound.playClick();
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    if (disabled || !value) return;
    sound.playClick();
    onChange('');
  };

  return (
    <div className="w-full space-y-4">
      {/* Assembled Formula Display Slot */}
      <div
        className={`p-4 sm:p-6 rounded-2xl bg-slate-900 border-2 transition-all flex items-center justify-between min-h-[70px] ${
          verdict?.status === 'correct'
            ? 'border-emerald-500/80 bg-emerald-950/20'
            : verdict?.status === 'incorrect'
            ? 'border-rose-500/80 bg-rose-950/20'
            : 'border-slate-800'
        }`}
      >
        <div className="flex-1 text-center font-bold text-2xl tracking-wider text-cyan-300">
          {value ? (
            <Formula formula={value} />
          ) : (
            <span className="text-sm font-normal text-slate-500 italic">
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
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Delete className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleClear}
              title="Xóa hết"
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Available Tiles Grid */}
      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
          Các mảnh ghép hóa học
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {tiles.map((tile, i) => (
            <button
              key={`${tile}-${i}`}
              type="button"
              disabled={disabled}
              onClick={() => handleAddTile(tile)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-600 hover:text-white border border-slate-700 hover:border-cyan-400 font-bold text-base text-slate-100 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Formula formula={tile} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
