import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sparkles, Clock, Compass } from 'lucide-react';
import { SUBJECTS, type SubjectId } from '@/content/subjects';
import { sound } from '@/lib/audio';

export interface SubjectSelectorModalProps {
  isOpen: boolean;
  currentSubject: SubjectId;
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
          className="absolute inset-0 bg-[#0d1519]/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-lg bg-[#18272f] border-t-2 sm:border-2 border-[#2e4756] rounded-t-3xl sm:rounded-3xl p-5 shadow-[0_12px_32px_rgba(0,0,0,0.6)] z-10 space-y-4 max-h-[85dvh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#2e4756]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-xl shadow-inner">
                <Compass className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 block">
                  KHOA HỌC TỰ NHIÊN THCS
                </span>
                <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                  Chọn môn học
                </h2>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#20333d] transition-colors"
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
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'bg-sky-950/40 border-[#0ea5e9] shadow-[0_4px_0_0_#0284c7]'
                      : sub.available
                      ? 'bg-[#131f24] border-[#2e4756] hover:border-slate-500 hover:bg-[#1a2d37]'
                      : 'bg-[#131f24]/80 border-dashed border-slate-700 hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Left: Icon & Info */}
                    <div className="flex items-start gap-3.5">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border shadow-md"
                        style={{
                          backgroundColor: `${sub.accentColor}20`,
                          borderColor: `${sub.accentColor}50`,
                        }}
                      >
                        {sub.icon}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-white">
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

                        <p className="text-xs text-slate-300 font-medium leading-snug">
                          {sub.tagline}
                        </p>

                        {/* Topics tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {sub.topics.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-bold text-slate-400 bg-[#20333d] px-2 py-0.5 rounded-md border border-[#2e4756]"
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
                        <div className="w-7 h-7 rounded-xl bg-[#0ea5e9] flex items-center justify-center text-white shadow-[0_2px_0_0_#0284c7]">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : sub.available ? (
                        <span className="text-xs font-black text-sky-400 hover:underline">
                          Chọn
                        </span>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-800/60">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Sắp ra mắt</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Under construction note */}
                  {!sub.available && sub.statusText && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-2 text-[11px] font-medium text-amber-200/90">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{sub.statusText}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Notice */}
          <div className="pt-2 text-center text-xs text-slate-400 font-medium">
            💡 Chương trình bám sát SGK Kết nối tri thức THCS (Lớp 6, 7, 8, 9).
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
