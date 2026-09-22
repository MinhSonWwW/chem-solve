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
  correctOrder: _correctOrder,
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

  const getItemStyle = () => {
    if (!isChecked) {
      return 'border-2 border-[#2e4756] bg-[#18272f] text-slate-200 shadow-[0_3px_0_0_#131f24]';
    }
    if (verdict?.status === 'correct') {
      return 'border-2 border-[#58cc02] bg-[#58cc02]/20 text-emerald-200 shadow-[0_3px_0_0_#46a302]';
    }
    return 'border-2 border-[#ff4b4b] bg-[#ff4b4b]/20 text-rose-200 shadow-[0_3px_0_0_#ea2b2b]';
  };

  return (
    <div className="space-y-2">
      {orderedItems.map((item, idx) => (
        <motion.div
          key={item}
          layout
          className={`flex items-center gap-2.5 p-3.5 rounded-2xl transition-all ${getItemStyle()}`}
        >
          {/* Grip handle visual */}
          <GripVertical className="w-4 h-4 text-slate-500 shrink-0" />

          {/* Step number */}
          <div className="w-6 h-6 rounded-full bg-[#20333d] border-2 border-[#2e4756] flex items-center justify-center text-[10px] font-black text-slate-300 shrink-0 shadow-inner">
            {idx + 1}
          </div>

          {/* Item text */}
          <span className="flex-1 text-xs font-bold leading-relaxed">{item}</span>

          {/* Move controls */}
          {!disabled && (
            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={() => moveUp(idx)}
                disabled={idx === 0}
                className="p-1 rounded-md bg-[#20333d] hover:bg-[#283e4a] border border-[#2e4756] disabled:opacity-20 transition-colors cursor-pointer"
                aria-label="Di chuyển lên"
              >
                <ChevronUp className="w-3.5 h-3.5 text-slate-300" />
              </button>
              <button
                onClick={() => moveDown(idx)}
                disabled={idx === orderedItems.length - 1}
                className="p-1 rounded-md bg-[#20333d] hover:bg-[#283e4a] border border-[#2e4756] disabled:opacity-20 transition-colors cursor-pointer"
                aria-label="Di chuyển xuống"
              >
                <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
              </button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
