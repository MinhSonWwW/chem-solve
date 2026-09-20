import React, { useState } from 'react';
import { X, Folder } from 'lucide-react';
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

export const SortPanel: React.FC<SortPanelProps> = ({
  buckets,
  items,
  value = {},
  onChange,
  disabled = false,
  verdict: _verdict,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleSelectItem = (id: string) => {
    if (disabled) return;
    sound.playClick();
    setSelectedItemId((prev) => (prev === id ? null : id));
  };

  const handleAssignToBucket = (bucketId: string) => {
    if (disabled || !selectedItemId) return;
    sound.playClick();
    const next = { ...value, [selectedItemId]: bucketId };
    onChange(next);
    setSelectedItemId(null);
  };

  const handleRemoveFromBucket = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    sound.playClick();
    const next = { ...value };
    delete next[itemId];
    onChange(next);
  };

  const unassignedItems = items.filter((it) => !value[it.id]);

  return (
    <div className="w-full space-y-4">
      {/* Instructions */}
      <div className="text-center text-xs font-semibold text-slate-400">
        {selectedItemId ? (
          <span className="text-cyan-300 animate-pulse">
            Đang chọn một chất — Hãy nhấn vào nhóm bên dưới để phân loại!
          </span>
        ) : (
          <span>Nhấn vào một chất rồi chọn nhóm tương ứng bên dưới</span>
        )}
      </div>

      {/* Unassigned Items Tray */}
      {unassignedItems.length > 0 && (
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Các chất cần phân loại ({unassignedItems.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {unassignedItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelectItem(item.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300 ring-2 ring-cyan-400/50 scale-105 shadow-lg'
                      : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500 hover:bg-slate-750'
                  }`}
                >
                  <Formula formula={item.label} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Buckets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {buckets.map((bucket) => {
          const bucketItems = items.filter((it) => value[it.id] === bucket.id);
          const isTarget = selectedItemId !== null;

          return (
            <div
              key={bucket.id}
              onClick={() => isTarget && handleAssignToBucket(bucket.id)}
              className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col min-h-[110px] ${
                isTarget
                  ? 'cursor-pointer border-cyan-500/80 bg-cyan-950/20 hover:bg-cyan-900/30 hover:border-cyan-400'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              {/* Bucket Header */}
              <div className="flex items-center justify-between gap-2 mb-2.5 pb-1.5 border-b border-slate-800">
                <div className="flex items-center gap-1.5 font-bold text-sm text-cyan-300">
                  <Folder className="w-4 h-4 text-cyan-400" />
                  <span>{bucket.label}</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {bucketItems.length}
                </span>
              </div>

              {/* Bucket Items */}
              <div className="flex flex-wrap gap-1.5 flex-1 items-start">
                {bucketItems.length === 0 ? (
                  <span className="text-xs text-slate-500 italic py-2">
                    {isTarget ? 'Nhấn vào đây để thả chất vào nhóm' : 'Chưa có chất nào'}
                  </span>
                ) : (
                  bucketItems.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200"
                    >
                      <Formula formula={item.label} />
                      {!disabled && (
                        <button
                          type="button"
                          onClick={(e) => handleRemoveFromBucket(item.id, e)}
                          className="hover:text-rose-400 transition-colors cursor-pointer ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
