import React from 'react';
import { motion } from 'motion/react';
import { GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import type { Verdict } from '@/engine/checkers/types';

export interface OrderingListProps {
  items: string[];
  value: string[];
  onChange: (v: string[]) => void;
  disabled: boolean;
  verdict?: Verdict;
  correctOrder?: string[];
}

/**
 * Ordering list with tap-to-move controls.
 * Items can be moved up/down by tapping arrow buttons.
 */
export const OrderingList: React.FC<OrderingListProps> = ({
  items: _items,
  value,
  onChange,
  disabled,
  verdict,
  correctOrder,
}) => {
  const isChecked = !!verdict;

  // Use value if populated, otherwise use items (initially shuffled)
  const safeValue = value || [];
  const orderedItems = safeValue.length > 0 ? safeValue : _items;

  const moveUp = (idx: number) => {
    if (disabled || idx <= 0) return;
    const next = [...orderedItems];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange(next);
  };

  const moveDown = (idx: number) => {
    if (disabled || idx >= orderedItems.length - 1) return;
    const next = [...orderedItems];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange(next);
  };

  const getItemStyle = (item: string, idx: number) => {
    if (!isChecked) {
      return 'border-slate-700 bg-slate-900/90 text-slate-200';
    }
    // Check if item is in correct position
    if (correctOrder && correctOrder[idx] === item) {
      return 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200';
    }
    return 'border-rose-500/60 bg-rose-950/40 text-rose-200';
  };

  return (
    <div className="space-y-2">
      {orderedItems.map((item, idx) => (
        <motion.div
          key={item}
          layout
          className={`flex items-center gap-2 p-3 rounded-2xl border-2 transition-colors ${getItemStyle(item, idx)}`}
        >
          {/* Grip handle visual */}
          <GripVertical className="w-4 h-4 text-slate-600 shrink-0" />

          {/* Step number */}
          <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">
            {idx + 1}
          </div>

          {/* Item text */}
          <span className="flex-1 text-xs font-bold leading-relaxed">{item}</span>

          {/* Move controls */}
          {!disabled && (
            <div className="flex flex-col gap-0.5 shrink-0">
              <button
                onClick={() => moveUp(idx)}
                disabled={idx === 0}
                className="p-0.5 rounded hover:bg-slate-800 disabled:opacity-20 transition-colors cursor-pointer"
                aria-label="Di chuyển lên"
              >
                <ChevronUp className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => moveDown(idx)}
                disabled={idx === orderedItems.length - 1}
                className="p-0.5 rounded hover:bg-slate-800 disabled:opacity-20 transition-colors cursor-pointer"
                aria-label="Di chuyển xuống"
              >
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
