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
import { MathText } from '../MathText';
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
            ? 'opacity-30 border-dashed border-[var(--subject-fill)] bg-[var(--bg-surface-2)]'
            : isSelected
            ? 'bg-[var(--subject-tint)] text-[var(--subject-fg)] border-[var(--subject-fill)] ring-2 ring-[var(--subject-fill)]/40 shadow-sm'
            : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--border-strong)]'
        }`}
      >
        <GripVertical className="w-3 h-3 text-[var(--text-tertiary)] shrink-0" />
        <MathText text={item.label} className="break-words" />
        {!disabled && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Bỏ khỏi nhóm"
            className="hover:text-[var(--err-fg)] text-[var(--text-tertiary)] transition-colors cursor-pointer ml-0.5 shrink-0 p-0.5"
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
          ? 'opacity-30 border-dashed border-[var(--subject-fill)] bg-[var(--bg-surface-2)]'
          : isSelected
          ? 'bg-[var(--subject-fill)] text-white border-2 border-white/40 ring-2 ring-[var(--subject-fill)]/50 scale-105 shadow-[0_4px_0_0_var(--subject-edge)]'
          : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--subject-edge)] shadow-[0_2px_0_0_var(--edge-neutral)]'
      }`}
    >
      <GripVertical className="w-3.5 h-3.5 opacity-50 shrink-0" />
      <MathText text={item.label} />
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
      className={`p-3.5 rounded-2xl border transition-all flex flex-col min-h-[120px] relative ${
        isOver
          ? 'border-2 border-[var(--subject-fill)] bg-[var(--subject-tint)] ring-2 ring-[var(--subject-fill)]/60 scale-[1.02]'
          : isTarget
          ? 'cursor-pointer border-2 border-[var(--subject-fill)] bg-[var(--subject-tint)] hover:border-[var(--subject-edge)]'
          : 'border border-[var(--border)] bg-[var(--bg-surface)]'
      }`}
    >
      {/* Bucket Header */}
      <div className="flex items-center justify-between gap-2 mb-2.5 pb-1.5 border-b border-[var(--border)]">
        <div className="flex items-center gap-1.5 font-bold text-sm text-[var(--subject-fg)]">
          <Folder className="w-4 h-4 text-[var(--subject-fg)] shrink-0" />
          <span><MathText text={bucket.label} /></span>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-surface-2)] text-[var(--text-tertiary)] border border-[var(--border)]">
          {bucketItems.length}
        </span>
      </div>

      {/* Bucket Items */}
      <div className="flex flex-wrap gap-1.5 flex-1 items-start content-start">
        {bucketItems.length === 0 ? (
          <span className="text-xs text-[var(--text-tertiary)] italic py-3 select-none">
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
          ? 'border-2 border-[var(--subject-fill)] bg-[var(--subject-tint)]'
          : 'bg-[var(--bg-surface-2)] border border-[var(--border)]'
      }`}
    >
      <div className="flex items-center justify-between text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 select-none">
        <span>Các chất cần phân loại ({unassignedItems.length})</span>
        <span className="text-[10px] text-[var(--text-tertiary)] font-normal lowercase">kéo hoặc nhấn chọn</span>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[44px] items-center">
        {unassignedItems.length === 0 ? (
          <span className="text-xs text-[var(--subject-fg)] italic py-1">
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
        <div className="text-center text-xs font-semibold text-[var(--text-secondary)]">
          {activeDragId ? (
            <span className="text-[var(--subject-fg)] font-bold animate-pulse">
              🎯 Thả vào nhóm bạn muốn phân loại!
            </span>
          ) : selectedItemId ? (
            <span className="text-[var(--subject-fg)] animate-pulse font-bold">
              Đang chọn một chất — Nhấn vào nhóm bên dưới hoặc kéo thả trực tiếp!
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5 text-[var(--text-secondary)]">
              <span className="text-[var(--subject-fg)] font-bold">Giữ để kéo thả</span> hoặc <span className="text-[var(--subject-fg)] font-bold">nhấn</span> vào chất rồi chọn nhóm
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

        {/* Drag Overlay with elevated card */}
        <DragOverlay dropAnimation={{ duration: 150, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
          {draggedItem ? (
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-black bg-[var(--subject-fill)] text-white border-2 border-white/50 shadow-[var(--shadow-modal)] scale-105 rotate-2 cursor-grabbing pointer-events-none select-none">
              <GripVertical className="w-3.5 h-3.5 opacity-80" />
              <MathText text={draggedItem.label} />
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};
