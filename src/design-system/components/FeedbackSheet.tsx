import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle, AlertTriangle, BookOpen } from 'lucide-react';
import { Button } from './Button';
import { Mascot } from './Mascot';
import { ReactionVisualizer, type ReactionEffectType } from './ReactionVisualizer';
import { sound } from '@/lib/audio';

export interface FeedbackSheetProps {
  status: 'idle' | 'correct' | 'wrong' | 'partial' | 'revealed';
  solutionText?: string;
  explanation?: string;
  diagnosis?: string;
  attemptsLeft?: number;
  reactionEffect?: {
    type: ReactionEffectType;
    color?: string;
    label?: string;
  };
  onContinue: () => void;
  onRetry?: () => void;
}

export const FeedbackSheet: React.FC<FeedbackSheetProps> = ({
  status,
  solutionText,
  explanation,
  diagnosis,
  attemptsLeft,
  reactionEffect,
  onContinue,
  onRetry,
}) => {
  if (status === 'idle') return null;

  const config = {
    correct: {
      bg: 'bg-slate-950/95 border-emerald-500/80 text-emerald-100',
      icon: <Check className="w-6 h-6 stroke-[3]" />,
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      bodyBg: 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200',
      title: 'Tuyệt vời!',
      subtitle: 'Bạn đã nắm chắc kiến thức này',
      mascot: 'correct' as const,
      btnVariant: 'success' as const,
      btnLabel: 'TIẾP TỤC',
    },
    wrong: {
      bg: 'bg-slate-950/95 border-rose-500/80 text-rose-100',
      icon: <AlertCircle className="w-6 h-6 stroke-[3]" />,
      iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      bodyBg: 'bg-rose-950/40 border-rose-800/40 text-rose-200',
      title: 'Chưa đúng rồi!',
      subtitle: attemptsLeft
        ? `Còn ${attemptsLeft} lượt thử`
        : undefined,
      mascot: 'wrong' as const,
      btnVariant: 'danger' as const,
      btnLabel: attemptsLeft && attemptsLeft > 0 ? 'THỬ LẠI' : 'ĐÃ HIỂU',
    },
    partial: {
      bg: 'bg-slate-950/95 border-amber-500/80 text-amber-100',
      icon: <AlertTriangle className="w-6 h-6 stroke-[3]" />,
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      bodyBg: 'bg-amber-950/40 border-amber-800/40 text-amber-200',
      title: 'Gần đúng rồi!',
      subtitle: 'Hãy sửa lại cho chính xác hơn',
      mascot: 'thinking' as const,
      btnVariant: 'warning' as const,
      btnLabel: 'SỬA LẠI',
    },
    revealed: {
      bg: 'bg-slate-950/95 border-indigo-500/80 text-indigo-100',
      icon: <BookOpen className="w-6 h-6 stroke-[3]" />,
      iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
      bodyBg: 'bg-indigo-950/40 border-indigo-800/40 text-indigo-200',
      title: 'Lời giải đầy đủ',
      subtitle: 'Đừng lo, hãy đọc kỹ để hiểu nhé!',
      mascot: 'thinking' as const,
      btnVariant: 'secondary' as const,
      btnLabel: 'TIẾP TỤC',
    },
  }[status];

  const handleAction = () => {
    sound.playClick();
    if (
      (status === 'wrong' && attemptsLeft && attemptsLeft > 0 && onRetry) ||
      (status === 'partial' && onRetry)
    ) {
      onRetry();
    } else {
      onContinue();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 150, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
        className={`fixed bottom-0 left-0 right-0 z-40 p-4 border-t-2 safe-pb backdrop-blur-xl shadow-2xl ${config.bg}`}
      >
        <div className="max-w-md mx-auto space-y-3">
          {/* Header & Mascot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black border ${config.iconBg}`}
              >
                {config.icon}
              </div>
              <div>
                <h3 className="text-base font-black tracking-tight">
                  {config.title}
                </h3>
                {config.subtitle && (
                  <p className="text-xs font-bold opacity-80">{config.subtitle}</p>
                )}
              </div>
            </div>
            <Mascot state={config.mascot} size="sm" />
          </div>

          {/* Diagnosis (from commonMistakes) */}
          {diagnosis && (
            <div
              className={`p-3 rounded-2xl text-xs leading-relaxed border ${config.bodyBg}`}
            >
              <div className="font-black mb-0.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Chẩn đoán lỗi
              </div>
              <div className="opacity-90">{diagnosis}</div>
            </div>
          )}

          {/* Chemical Reaction Visualizer if question tests a reaction phenomenon */}
          {reactionEffect && (
            <ReactionVisualizer
              type={reactionEffect.type}
              color={reactionEffect.color}
              label={reactionEffect.label}
              className="py-1"
            />
          )}

          {/* Solution Body / Explanation */}
          {(solutionText || explanation) && (
            <div
              className={`p-3 rounded-2xl text-xs leading-relaxed border ${config.bodyBg}`}
            >
              {solutionText && (
                <div className="font-bold mb-0.5">{solutionText}</div>
              )}
              {explanation && (
                <div className="opacity-90 whitespace-pre-line mt-1">{explanation}</div>
              )}
            </div>
          )}

          {/* Action Button */}
          <Button
            variant={config.btnVariant}
            fullWidth
            size="lg"
            onClick={handleAction}
          >
            {config.btnLabel}
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
