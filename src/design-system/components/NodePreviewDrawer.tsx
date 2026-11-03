import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Star, Lock, BookOpen, Gift, Award } from 'lucide-react';
import { Button } from './Button';
import { Mascot } from './Mascot';
import { MathText } from './MathText';
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
          className="relative w-full max-w-sm bg-[var(--bg-surface)] border-t sm:border border-[var(--border)] rounded-t-3xl sm:rounded-3xl p-6 shadow-[var(--shadow-modal)] z-10 space-y-4 text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-surface-2)] transition-colors cursor-pointer"
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
                      ? 'text-[var(--slate-fg)]'
                      : isChest
                      ? 'text-[var(--gold-fg)]'
                      : isCheckpoint
                      ? 'text-[var(--warn-fg)]'
                      : 'text-[var(--subject-fg)]'
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
                <h2 className="text-lg font-black text-[var(--text-primary)]">
                  <MathText text={node.title} />
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  <MathText text={node.description} />
                </p>
              </div>

              {/* Status info */}
              {isCompleted && (
                <div className="p-2.5 rounded-2xl bg-[var(--subject-tint)] border border-[var(--subject-edge)] flex items-center justify-center gap-2 text-xs font-bold text-[var(--subject-fg)]">
                  <Star className="w-4 h-4 fill-[var(--gold-fill)] text-[var(--gold-fg)]" />
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
                    <div className="p-3.5 rounded-2xl bg-[var(--err-tint)] border border-[var(--err-edge)] flex flex-col items-center justify-center gap-1.5 text-xs text-[var(--err-fg)]">
                      <div className="flex items-center gap-1.5 text-[var(--err-fg)] font-bold">
                        <span>⚠️ Bạn đã hết tim (0/5)</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] font-normal">
                        Hãy giải bài tập trong mục <span className="text-[var(--warn-fg)] font-bold">Luyện tập</span> để hồi phục tim trước khi bắt đầu bài mới nhé!
                      </p>
                    </div>
                    <Button
                      variant="warn"
                      size="lg"
                      fullWidth
                      className="flex items-center justify-center gap-2"
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
                    variant={isCompleted ? 'secondary' : 'gold'}
                    size="lg"
                    fullWidth
                    disabled={isCompleted}
                    className="flex items-center justify-center gap-2"
                    onClick={() => {
                      if (!isCompleted) {
                        sound.playClick();
                        if (onOpenChest) onOpenChest();
                      }
                    }}
                  >
                    <Gift
                      className="w-5 h-5"
                    />
                    <span>{isCompleted ? 'ĐÃ NHẬN THƯỞNG' : 'MỞ RƯƠNG (+30 💎 · +50 XP)'}</span>
                  </Button>
                ) : isUnlocked ? (
                  <Button
                    variant={isTheory ? 'secondary' : isCheckpoint ? 'warn' : 'primary'}
                    size="lg"
                    fullWidth
                    className="flex items-center justify-center gap-2"
                    onClick={() => {
                      sound.playClick();
                      onStart();
                    }}
                  >
                    {isTheory ? (
                      <BookOpen className="w-5 h-5 stroke-[2.5]" />
                    ) : isCheckpoint ? (
                      <Award className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 fill-current" />
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
                    <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] flex flex-col items-center justify-center gap-1.5 text-xs text-[var(--text-secondary)] font-bold">
                      <div className="flex items-center gap-1.5 text-[var(--text-tertiary)] text-xs">
                        <Lock className="w-4 h-4" />
                        <span>Chưa mở khóa</span>
                      </div>
                      {prerequisiteTitle ? (
                        <p className="text-[11px] text-[var(--text-secondary)] font-normal">
                          Cần hoàn thành: <span className="font-bold text-[var(--subject-fg)]">{prerequisiteTitle}</span>
                        </p>
                      ) : (
                        <p className="text-[11px] text-[var(--text-tertiary)] font-normal">
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
