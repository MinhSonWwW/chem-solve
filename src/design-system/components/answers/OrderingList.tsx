import React from 'react';
import { Reorder, useDragControls } from 'motion/react';
import { GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import type { Verdict } from '@/engine/checkers/types';
import { sound } from '@/lib/audio';

export interface OrderingListProps {
  items: string[];
  value: string[];
  onChange: (v: string[]) => void;
  disabled: boolean;
  verdict?: Verdict;
  correctOrder?: string[];
}

interface OrderingItemProps {
  item: string;
  idx: number;
  total: number;
  disabled: boolean;
  itemStyle: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const OrderingItem: React.FC<OrderingItemProps> = ({
  item,
  idx,
  total,
  disabled,
  itemStyle,
  onMoveUp,
  onMoveDown,
}) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      id={item}
      dragListener={!disabled}
      dragControls={controls}
      whileDrag={{
        scale: 1.025,
        boxShadow: '0 14px 30px rgba(0, 0, 0, 0.65)',
        borderColor: '#38bdf8',
        backgroundColor: '#1b2f3a',
        zIndex: 50,
      }}
      whileHover={!disabled ? { borderColor: '#38bdf8' } : undefined}
      className={`group flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl select-none transition-colors relative ${itemStyle} ${
        disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing touch-pan-y'
      }`}
    >
      {/* Drag Grip Handle Area */}
      <div
        onPointerDown={(e) => {
          if (!disabled) controls.start(e);
        }}
        className={`p-1.5 -ml-1 rounded-xl flex items-center justify-center transition-colors ${
          disabled
            ? 'text-slate-600'
            : 'text-slate-400 group-hover:text-[#38bdf8] hover:bg-[#20333d] cursor-grab active:cursor-grabbing touch-none'
        }`}
        title="Kéo thả để sắp xếp"
      >
        <GripVertical className="w-5 h-5 stroke-[2.2]" />
      </div>

      {/* Step number badge */}
      <div className="w-7 h-7 rounded-full bg-[#131f24] border-2 border-[#2e4756] group-hover:border-[#38bdf8]/50 flex items-center justify-center text-xs font-black text-[#38bdf8] shrink-0 shadow-inner">
        {idx + 1}
      </div>

      {/* Item text */}
      <span className="flex-1 text-xs sm:text-sm font-bold text-slate-100 leading-relaxed">
        {item}
      </span>

      {/* Move controls (accessible fallback buttons) */}
      {!disabled && (
        <div className="flex flex-col gap-1 shrink-0 ml-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            disabled={idx === 0}
            className="p-1 rounded-lg bg-[#131f24] hover:bg-[#20333d] border border-[#2e4756] hover:border-[#38bdf8]/50 disabled:opacity-20 transition-all cursor-pointer text-slate-400 hover:text-slate-100 active:scale-95"
            aria-label="Di chuyển lên"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            disabled={idx === total - 1}
            className="p-1 rounded-lg bg-[#131f24] hover:bg-[#20333d] border border-[#2e4756] hover:border-[#38bdf8]/50 disabled:opacity-20 transition-all cursor-pointer text-slate-400 hover:text-slate-100 active:scale-95"
            aria-label="Di chuyển xuống"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </Reorder.Item>
  );
};

/**
 * Ordering list with both smooth drag-and-drop (Framer Motion Reorder)
 * and accessible tap-to-move controls.
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

  const handleReorder = (newOrder: string[]) => {
    if (disabled) return;
    sound.playClick();
    onChange(newOrder);
  };

  const moveUp = (idx: number) => {
    if (disabled || idx <= 0) return;
    sound.playClick();
    const next = [...orderedItems];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange(next);
  };

  const moveDown = (idx: number) => {
    if (disabled || idx >= orderedItems.length - 1) return;
    sound.playClick();
    const next = [...orderedItems];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange(next);
  };

  const getItemStyle = () => {
    if (!isChecked) {
      return 'border-2 border-[#2e4756] bg-[#18272f] text-slate-100 shadow-[0_3px_0_0_#131f24]';
    }
    if (verdict?.status === 'correct') {
      return 'border-2 border-[#00cd9c] bg-[#00cd9c]/15 text-emerald-200 shadow-[0_3px_0_0_#007a5d]';
    }
    return 'border-2 border-[#ff4b4b] bg-[#ff4b4b]/15 text-rose-200 shadow-[0_3px_0_0_#b32525]';
  };

  return (
    <div className="space-y-2.5">
      {/* Drag instruction notice */}
      {!disabled && !isChecked && (
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 px-1">
          <GripVertical className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>Giữ và kéo thả các thẻ để sắp xếp theo đúng thứ tự</span>
        </div>
      )}

      {/* Draggable Reorder Group */}
      <Reorder.Group
        axis="y"
        values={orderedItems}
        onReorder={handleReorder}
        className="space-y-2.5"
      >
        {orderedItems.map((item, idx) => (
          <OrderingItem
            key={item}
            item={item}
            idx={idx}
            total={orderedItems.length}
            disabled={disabled}
            itemStyle={getItemStyle()}
            onMoveUp={() => moveUp(idx)}
            onMoveDown={() => moveDown(idx)}
          />
        ))}
      </Reorder.Group>
    </div>
  );
};
