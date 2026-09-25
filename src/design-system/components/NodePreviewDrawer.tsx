import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Star, Lock, BookOpen, Gift, Award } from 'lucide-react';
import { Button } from './Button';
import { Mascot } from './Mascot';
import { sound } from '@/lib/audio';
import type { Lesson, NodeInfo } from '@/content/curriculum';

export interface NodePreviewDrawerProps {
  isOpen: boolean;
  lesson?: Lesson;
  node?: NodeInfo;
  isUnlocked: boolean;
  isCompleted: boolean;
  bestAccuracy?: number;
  prerequisiteTitle?: string;
  hearts?: number;
  onGoToPractice?: () => void;
  onClose: () => void;
  onStart: () => void;
  onOpenChest?: () => void;
}

export const NodePreviewDrawer: React.FC<NodePreviewDrawerProps> = ({
  isOpen,
  lesson,
  node,
  isUnlocked,
  isCompleted,
  bestAccuracy,
  prerequisiteTitle,
  hearts = 5,
  onGoToPractice,
  onClose,
  onStart,
  onOpenChest,
}) => {
  if (!isOpen || !node) return null;

  const isReady = lesson?.ready ?? false;
  const isTheory = node.type === 'theory';
  const isChest = node.type === 'chest';
  const isCheckpoint = node.type === 'checkpoint';

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

        {/* Sheet Content */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-sm bg-[#18272f] border-t-2 sm:border-2 border-[#2e4756] rounded-t-3xl sm:rounded-3xl p-6 shadow-[0_16px_40px_rgba(0,0,0,0.65)] z-10 space-y-4 text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-[#20333d] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {isReady ? (
            <>
              {/* Mascot Avatar */}
              <div className="flex justify-center pt-2">
                <Mascot
                  state={
                    hearts <= 0 && !isTheory && !isChest
                      ? 'out_of_hearts'
                      : isCompleted
                      ? 'happy'
                      : isUnlocked
                      ? 'cheering'
                      : 'thinking'
                  }
                  size="xl"
                />
              </div>

              {/* Title & Info */}
              <div className="space-y-1">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider ${
                    isTheory
                      ? 'text-fuchsia-400'
                      : isChest
                      ? 'text-amber-400'
                      : isCheckpoint
                      ? 'text-rose-400'
                      : 'text-[#0ea5e9]'
                  }`}
                >
                  {isTheory
                    ? '📖 LÝ THUYẾT TRỌNG TÂM'
                    : isChest
                    ? '🎁 RƯƠNG KHO BÁU PHẦN THƯỞNG'
                    : isCheckpoint
                    ? '👑 THỬ THÁCH TRÙM CUỐI (BOSS)'
                    : lesson?.title}
                </span>
                <h2 className="text-lg font-black text-white">
                  {node.title}
                </h2>
                <p className="text-xs text-slate-300">{node.description}</p>
              </div>

              {/* Status info */}
              {isCompleted && (
                <div className="p-2.5 rounded-2xl bg-[#58cc02]/15 border-2 border-[#58cc02]/40 flex items-center justify-center gap-2 text-xs font-bold text-emerald-300">
                  <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                  <span>
                    {isTheory
                      ? 'Đã hoàn thành phần lý thuyết'
                      : isChest
                      ? 'Đã mở rương nhận thưởng (+30 💎 · +50 XP)'
                      : `Đã hoàn thành · Chính xác: ${Math.round((bestAccuracy ?? 1) * 100)}%`}
                  </span>
                </div>
              )}

              {/* Action */}
              <div className="pt-2">
                {hearts <= 0 && !isTheory && !isChest ? (
                  <div className="space-y-2.5">
                    <div className="p-3.5 rounded-2xl bg-[#ff4b4b]/15 border-2 border-[#ff4b4b]/40 flex flex-col items-center justify-center gap-1.5 text-xs text-rose-200">
                      <div className="flex items-center gap-1.5 text-[#ff4b4b] font-bold">
                        <span>⚠️ Bạn đã hết tim (0/5)</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-normal">
                        Hãy giải bài tập trong mục <span className="text-amber-300 font-bold">Luyện tập</span> để hồi phục tim trước khi bắt đầu bài mới nhé!
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      className="flex items-center justify-center gap-2 bg-[#ff9600] hover:bg-[#ffa726] text-white font-black shadow-[0_4px_0_0_#e07a00]"
                      onClick={() => {
                        sound.playClick();
                        if (onGoToPractice) onGoToPractice();
                        else onClose();
                      }}
                    >
                      <span>ĐẾN TRANG BÀI TẬP (+1 TIM)</span>
                    </Button>
                  </div>
                ) : isChest && isUnlocked ? (
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={isCompleted}
                    className={`flex items-center justify-center gap-2 ${
                      isCompleted
                        ? 'opacity-60 bg-slate-700 text-slate-400 border-none'
                        : 'bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-amber-950 font-black shadow-[0_4px_0_0_#b45309]'
                    }`}
                    onClick={() => {
                      if (!isCompleted) {
                        sound.playClick();
                        if (onOpenChest) onOpenChest();
                      }
                    }}
                  >
                    <Gift
                      className={`w-5 h-5 ${
                        isCompleted ? 'text-slate-400' : 'text-amber-950 fill-amber-950'
                      }`}
                    />
                    <span>{isCompleted ? 'ĐÃ NHẬN THƯỞNG' : 'MỞ RƯƠNG (+30 💎 · +50 XP)'}</span>
                  </Button>
                ) : isUnlocked ? (
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    className={`flex items-center justify-center gap-2 ${
                      isTheory
                        ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400 text-white font-black shadow-[0_4px_0_0_#6b21a8]'
                        : isCheckpoint
                        ? 'bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black shadow-[0_4px_0_0_#9f1239]'
                        : ''
                    }`}
                    onClick={() => {
                      sound.playClick();
                      onStart();
                    }}
                  >
                    {isTheory ? (
                      <BookOpen className="w-5 h-5 text-white stroke-[2.5]" />
                    ) : isCheckpoint ? (
                      <Award className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 fill-white" />
                    )}
                    <span>
                      {isTheory
                        ? isCompleted
                          ? 'XEM LẠI LÝ THUYẾT'
                          : 'HỌC LÝ THUYẾT (2 PHÚT)'
                        : isCheckpoint
                        ? isCompleted
                          ? 'KHIÊU CHIẾN LẠI TRÙM'
                          : 'KHIÊU CHIẾN TRÙM CUỐI'
                        : isCompleted
                        ? 'ÔN TẬP LẠI'
                        : 'BẮT ĐẦU CHẶNG'}
                    </span>
                  </Button>
                ) : (
                  <div className="space-y-2.5">
                    <div className="p-3.5 rounded-2xl bg-[#20333d] border-2 border-[#2e4756] flex flex-col items-center justify-center gap-1.5 text-xs text-slate-300 font-bold">
                      <div className="flex items-center gap-1.5 text-amber-400 text-xs">
                        <Lock className="w-4 h-4" />
                        <span>Chưa mở khóa</span>
                      </div>
                      {prerequisiteTitle ? (
                        <p className="text-[11px] text-slate-300 font-normal">
                          Cần hoàn thành: <span className="font-bold text-[#38bdf8]">{prerequisiteTitle}</span>
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400 font-normal">
                          Hoàn thành các chặng trước để mở khóa bài này
                        </p>
                      )}
                    </div>
                    <Button
                      variant="secondary"
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
                )}
              </div>
            </>
          ) : (
            /* Coming soon for other lessons */
            <>
              <div className="flex justify-center pt-2">
                <Mascot state="thinking" size="lg" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  Đang phát triển
                </span>
                <h2 className="text-lg font-black text-slate-100">
                  {lesson?.title}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Nội dung bài học này đang được đội ngũ Chem-Solve biên soạn theo SGK mới. Hãy luyện tập trước với bài học có sẵn nhé!
                </p>
              </div>
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
              >
                ĐÃ HIỂU
              </Button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
