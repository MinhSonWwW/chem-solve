import React, { useState } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { X, Folder, GripVertical } from 'lucide-react';
import { Formula } from '../Formula';
import { sound } from '@/lib/audio';
import type { Verdict } from '@/engine/checkers/types';

export interface SortPanelProps {
  buckets: Array<{ id: string; label: string }>;
  items: Array<{ id: string; label: string; bucketId: string }>;
  value?: Record<string, string>;
  onChange: (val: Record<string, string>) => void;
  disabled?: boolean;
  verdict?: Verdict | null;
}

interface DraggableItemProps {
  item: { id: string; label: string };
  isSelected: boolean;
  disabled: boolean;
  isBucketItem?: boolean;
  onClick: () => void;
  onRemove?: (e: React.MouseEvent) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  isSelected,
  disabled,
  isBucketItem = false,
  onClick,
  onRemove,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    disabled,
    data: { item, isBucketItem },
  });

  if (isBucketItem) {
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold max-w-full text-left select-none transition-all touch-none cursor-grab active:cursor-grabbing ${
          isDragging
            ? 'opacity-30 border-dashed border-cyan-400 bg-slate-800/40'
            : isSelected
            ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 ring-2 ring-cyan-400/40 shadow-sm'
            : 'bg-slate-800/90 hover:bg-slate-750 text-slate-200 border-slate-700 hover:border-slate-500'
        }`}
      >
        <GripVertical className="w-3 h-3 text-slate-500 shrink-0" />
        <Formula formula={item.label} className="break-words" />
        {!disabled && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Bỏ khỏi nhóm"
            className="hover:text-rose-400 text-slate-400 transition-colors cursor-pointer ml-0.5 shrink-0 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all border text-left max-w-full select-none touch-none cursor-grab active:cursor-grabbing ${
        isDragging
          ? 'opacity-30 border-dashed border-cyan-400 bg-slate-800/40'
          : isSelected
          ? 'bg-cyan-500 text-slate-950 border-cyan-300 ring-2 ring-cyan-400/50 scale-105 shadow-lg'
          : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500 hover:bg-slate-750 shadow-sm'
      }`}
    >
      <GripVertical className="w-3.5 h-3.5 opacity-50 shrink-0" />
      <Formula formula={item.label} />
    </div>
  );
};

interface DroppableBucketProps {
  bucket: { id: string; label: string };
  bucketItems: Array<{ id: string; label: string }>;
  isTarget: boolean;
  disabled: boolean;
  selectedItemId: string | null;
  onBucketClick: () => void;
  onItemClick: (id: string) => void;
  onRemoveItem: (id: string, e: React.MouseEvent) => void;
}

const DroppableBucket: React.FC<DroppableBucketProps> = ({
  bucket,
  bucketItems,
  isTarget,
  disabled,
  selectedItemId,
  onBucketClick,
  onItemClick,
  onRemoveItem,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: bucket.id,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      onClick={onBucketClick}
      className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col min-h-[120px] relative ${
        isOver
          ? 'border-cyan-400 bg-cyan-950/50 ring-2 ring-cyan-400/70 scale-[1.02] shadow-[0_0_25px_rgba(6,182,212,0.3)]'
          : isTarget
          ? 'cursor-pointer border-cyan-500/80 bg-cyan-950/20 hover:bg-cyan-900/30 hover:border-cyan-400'
          : 'border-slate-800 bg-slate-900/60'
      }`}
    >
      {/* Bucket Header */}
      <div className="flex items-center justify-between gap-2 mb-2.5 pb-1.5 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 font-bold text-sm text-cyan-300">
          <Folder className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{bucket.label}</span>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
          {bucketItems.length}
        </span>
      </div>

      {/* Bucket Items */}
      <div className="flex flex-wrap gap-1.5 flex-1 items-start content-start">
        {bucketItems.length === 0 ? (
          <span className="text-xs text-slate-500 italic py-3 select-none">
            {isOver
              ? 'Thả vào đây'
              : isTarget
              ? 'Nhấn vào đây để xếp vào nhóm'
              : 'Kéo hoặc nhấn chất để xếp vào đây'}
          </span>
        ) : (
          bucketItems.map((item) => (
            <DraggableItem
              key={item.id}
              item={item}
              isBucketItem
              isSelected={selectedItemId === item.id}
              disabled={disabled}
              onClick={() => onItemClick(item.id)}
              onRemove={(e) => onRemoveItem(item.id, e)}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface DroppableTrayProps {
  unassignedItems: Array<{ id: string; label: string }>;
  disabled: boolean;
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
}

const DroppableTray: React.FC<DroppableTrayProps> = ({
  unassignedItems,
  disabled,
  selectedItemId,
  onSelectItem,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'unassigned-tray',
    disabled,
  });

  if (unassignedItems.length === 0 && !isOver) return null;

  return (
    <div
      ref={setNodeRef}
      className={`p-3.5 rounded-2xl border transition-all ${
        isOver
          ? 'border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-400/40'
          : 'bg-slate-900/80 border-slate-800'
      }`}
    >
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 select-none">
        <span>Các chất cần phân loại ({unassignedItems.length})</span>
        <span className="text-[10px] text-slate-500 font-normal lowercase">kéo hoặc nhấn chọn</span>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[44px] items-center">
        {unassignedItems.length === 0 ? (
          <span className="text-xs text-cyan-300/80 italic py-1">
            Thả vào đây để đưa chất về khay chưa phân loại
          </span>
        ) : (
          unassignedItems.map((item) => (
            <DraggableItem
              key={item.id}
              item={item}
              isSelected={selectedItemId === item.id}
              disabled={disabled}
              onClick={() => onSelectItem(item.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export const SortPanel: React.FC<SortPanelProps> = ({
  buckets,
  items,
  value,
  onChange,
  disabled = false,
  verdict: _verdict,
}) => {
  const safeValue = value ?? {};
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  // Require small movement before initiating drag so simple tap/click triggers selection seamlessly
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    })
  );

  const handleSelectItem = (id: string) => {
    if (disabled) return;
    sound.playClick();
    setSelectedItemId((prev) => (prev === id ? null : id));
  };

  const handleAssignToBucket = (bucketId: string) => {
    if (disabled || !selectedItemId) return;
    sound.playClick();
    const next = { ...safeValue, [selectedItemId]: bucketId };
    onChange(next);
    setSelectedItemId(null);
  };

  const handleRemoveFromBucket = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    sound.playClick();
    const next = { ...safeValue };
    delete next[itemId];
    onChange(next);
    if (selectedItemId === itemId) setSelectedItemId(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (disabled) return;
    sound.playClick();
    setActiveDragId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);
    if (disabled || !over) return;

    const itemId = String(active.id);
    const targetId = String(over.id);

    if (targetId === 'unassigned-tray') {
      if (safeValue[itemId]) {
        sound.playClick();
        const next = { ...safeValue };
        delete next[itemId];
        onChange(next);
        if (selectedItemId === itemId) setSelectedItemId(null);
      }
    } else if (buckets.some((b) => b.id === targetId)) {
      if (safeValue[itemId] !== targetId) {
        sound.playClick();
        const next = { ...safeValue, [itemId]: targetId };
        onChange(next);
        if (selectedItemId === itemId) setSelectedItemId(null);
      }
    }
  };

  const handleDragCancel = () => {
    setActiveDragId(null);
  };

  const unassignedItems = items.filter((it) => !safeValue[it.id]);
  const draggedItem = activeDragId ? items.find((it) => it.id === activeDragId) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="w-full space-y-4">
        {/* Instructions */}
        <div className="text-center text-xs font-semibold text-slate-400">
          {activeDragId ? (
            <span className="text-cyan-300 font-bold animate-pulse">
              🎯 Thả vào nhóm bạn muốn phân loại!
            </span>
          ) : selectedItemId ? (
            <span className="text-cyan-300 animate-pulse font-bold">
              Đang chọn một chất — Nhấn vào nhóm bên dưới hoặc kéo thả trực tiếp!
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5 text-slate-300">
              <span className="text-cyan-400 font-bold">Giữ để kéo thả</span> hoặc <span className="text-cyan-400 font-bold">nhấn</span> vào chất rồi chọn nhóm
            </span>
          )}
        </div>

        {/* Unassigned Items Tray */}
        <DroppableTray
          unassignedItems={unassignedItems}
          disabled={disabled}
          selectedItemId={selectedItemId}
          onSelectItem={handleSelectItem}
        />

        {/* Buckets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {buckets.map((bucket) => {
            const bucketItems = items.filter((it) => safeValue[it.id] === bucket.id);
            const isTarget = selectedItemId !== null;

            return (
              <DroppableBucket
                key={bucket.id}
                bucket={bucket}
                bucketItems={bucketItems}
                isTarget={isTarget}
                disabled={disabled}
                selectedItemId={selectedItemId}
                onBucketClick={() => isTarget && handleAssignToBucket(bucket.id)}
                onItemClick={handleSelectItem}
                onRemoveItem={handleRemoveFromBucket}
              />
            );
          })}
        </div>

        {/* Drag Overlay with beautiful elevated card */}
        <DragOverlay dropAnimation={{ duration: 150, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
          {draggedItem ? (
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-black bg-cyan-400 text-slate-950 border-2 border-cyan-200 shadow-[0_12px_30px_rgba(6,182,212,0.45)] scale-105 rotate-2 cursor-grabbing pointer-events-none select-none">
              <GripVertical className="w-3.5 h-3.5 text-slate-800" />
              <Formula formula={draggedItem.label} />
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};
