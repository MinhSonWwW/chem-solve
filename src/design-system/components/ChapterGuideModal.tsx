import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, AlertTriangle, Lightbulb } from 'lucide-react';
import { Button } from './Button';
import { sound } from '@/lib/audio';
import type { Chapter } from '@/content/curriculum';

export interface ChapterGuideModalProps {
  isOpen: boolean;
  chapter: Chapter | null;
  grade: number;
  onClose: () => void;
}

export const ChapterGuideModal: React.FC<ChapterGuideModalProps> = ({
  isOpen,
  chapter,
  grade,
  onClose,
}) => {
  if (!isOpen || !chapter) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-md bg-slate-900 border-t-2 sm:border-2 border-slate-700/80 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl z-10 space-y-4 max-h-[85dvh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xl">
                📖
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                  Sổ tay Lớp {grade} · Chương {chapter.chapterNumber}
                </span>
                <h2 className="text-base font-black text-slate-100 leading-tight">
                  {chapter.title}
                </h2>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto space-y-3 pr-1 flex-1 text-xs">
            {/* Overview Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="font-black text-slate-200 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Mục tiêu trọng tâm
              </div>
              <p className="text-slate-400 leading-relaxed font-medium">
                {chapter.description}
              </p>
            </div>

            {/* Core Formulas & Concepts */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="font-black text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Kiến thức & Công thức cần nhớ
              </div>
              <div className="space-y-1.5 text-slate-300 font-mono text-[11px]">
                {chapter.guidebook?.formulas && chapter.guidebook.formulas.length > 0 ? (
                  chapter.guidebook.formulas.map((f, i) => (
                    <div key={i} className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-cyan-300 font-bold">{f.label} </span>
                      <span>{f.text}</span>
                    </div>
                  ))
                ) : (
                  chapter.lessons.map((lesson) => (
                    <div key={lesson.id} className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-cyan-300 font-bold">Bài {lesson.lessonNumber}: {lesson.title}</span>
                      <p className="text-slate-400 font-sans text-[11px] mt-0.5">{lesson.subtitle}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Common Traps */}
            <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-1.5 text-rose-200">
              <div className="font-black flex items-center gap-1.5 text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Lưu ý trọng tâm khi giải bài
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] opacity-90 leading-relaxed font-medium">
                {chapter.guidebook?.traps && chapter.guidebook.traps.length > 0 ? (
                  chapter.guidebook.traps.map((trap, i) => <li key={i}>{trap}</li>)
                ) : (
                  <>
                    <li>Đọc kĩ đề bài và xác định chính xác hiện tượng/đại lượng cần tìm.</li>
                    <li>Kiểm tra và quy đổi đồng nhất các đơn vị đo trước khi tiến hành tính toán.</li>
                    <li>Nắm vững bản chất kiến thức trước khi chọn phương án hoặc điền kết quả.</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-1">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => {
                sound.playClick();
                onClose();
              }}
            >
              ĐÃ HIỂU
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
