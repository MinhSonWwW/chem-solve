import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Compass } from 'lucide-react';
import { SUBJECTS, type SubjectId } from '@/content/subjects';
import { sound } from '@/lib/audio';
import { HandDrawnIcon } from './HandDrawnIcon';
import type { HandDrawnIconName } from './HandDrawnIcon';

/** Map môn học → icon vẽ tay */
const SUBJECT_ICON: Record<string, HandDrawnIconName> = {
  chem: 'flask',
  physics: 'atom',
  bio: 'dna',
};

export interface SubjectSelectorModalProps {
  isOpen: boolean;
  currentSubject: SubjectId;
  currentGrade?: number;
  onSelectSubject: (subjectId: SubjectId) => void;
  onClose: () => void;
}

export const SubjectSelectorModal: React.FC<SubjectSelectorModalProps> = ({
  isOpen,
  currentSubject,
  onSelectSubject,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-lg bg-[var(--bg-surface)] border-t sm:border border-[var(--border)] rounded-t-3xl sm:rounded-3xl p-5 shadow-[var(--shadow-modal)] z-10 space-y-4 max-h-[85dvh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--chem-tint)] border border-[var(--chem-edge)] flex items-center justify-center text-xl">
                <Compass className="w-5 h-5 text-[var(--chem-fg)]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--chem-fg)] block">
                  KHOA HỌC TỰ NHIÊN THCS
                </span>
                <h2 className="text-base sm:text-lg font-black text-[var(--text-primary)] leading-tight">
                  Chọn môn học
                </h2>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subjects List */}
          <div className="space-y-3 overflow-y-auto pr-1 py-1">
            {SUBJECTS.map((sub) => {
              const isActive = currentSubject === sub.id;

              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectSubject(sub.id);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border transition-all duration-150 cursor-pointer relative overflow-hidden active:translate-y-[2px] ${
                    isActive
                      ? 'border-2 shadow-[0_4px_0_0_var(--sub-shadow)]'
                      : 'bg-[var(--bg-surface-2)] border-[var(--border)] hover:border-[var(--border-strong)]'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: `${sub.accentColor}15`,
                          borderColor: sub.accentColor,
                          // @ts-expect-error CSS custom property
                          '--sub-shadow': sub.borderColor,
                        }
                      : {}
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Left: Icon & Info */}
                    <div className="flex items-start gap-3.5">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-[0_3px_0_0_var(--sub-icon-shadow)]"
                        style={{
                          backgroundColor: `${sub.accentColor}18`,
                          borderColor: `${sub.accentColor}60`,
                          // @ts-expect-error CSS custom property
                          '--sub-icon-shadow': sub.borderColor,
                        }}
                      >
                        <HandDrawnIcon
                          name={SUBJECT_ICON[sub.id] ?? 'flask'}
                          size={32}
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-[var(--text-primary)]">
                            {sub.name}
                          </h3>
                          <span
                            className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider border"
                            style={{
                              backgroundColor: `${sub.accentColor}25`,
                              color: sub.accentColor,
                              borderColor: `${sub.accentColor}50`,
                            }}
                          >
                            {sub.badge}
                          </span>
                        </div>

                        <p className="text-xs text-[var(--text-secondary)] font-medium leading-snug">
                          {sub.tagline}
                        </p>

                        {/* Topics tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {sub.topics.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-bold text-[var(--text-tertiary)] bg-[var(--bg-canvas)] px-2 py-0.5 rounded-md border border-[var(--border)]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Status indicator */}
                    <div className="shrink-0 pt-1">
                      {isActive ? (
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-white"
                          style={{
                            backgroundColor: sub.accentColor,
                            boxShadow: `0 2px 0 0 ${sub.borderColor}`,
                          }}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : sub.available ? (
                        <span
                          className="text-xs font-black hover:underline"
                          style={{ color: sub.accentColor }}
                        >
                          Chọn
                        </span>
                      ) : (
                        <span className="text-[10px] font-black text-[var(--text-tertiary)] uppercase">
                          Sắp có
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
