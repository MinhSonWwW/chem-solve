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
      border: 'border-emerald-500/80',
      bgGradient: 'bg-gradient-to-b from-slate-950/98 via-slate-900/98 to-emerald-950/90',
      badgeBg: 'bg-emerald-500 text-slate-950 border-4 border-white shadow-[0_4px_12px_rgba(16,185,129,0.5)]',
      icon: <Check className="w-6 h-6 stroke-[4]" />,
      titleColor: 'text-emerald-300',
      bodyBg: 'bg-emerald-950/50 border-emerald-500/30 text-emerald-100',
      title: 'CHÍNH XÁC!',
      subtitle: 'Bạn đã nắm chắc kiến thức này',
      mascot: 'correct' as const,
      btnVariant: 'success' as const,
      btnLabel: 'TIẾP TỤC',
      pattern: 'confetti',
    },
    wrong: {
      border: 'border-rose-500/80',
      bgGradient: 'bg-gradient-to-b from-slate-950/98 via-slate-900/98 to-rose-950/90',
      badgeBg: 'bg-rose-500 text-white border-4 border-white shadow-[0_4px_12px_rgba(244,63,94,0.5)]',
      icon: <AlertCircle className="w-6 h-6 stroke-[3.5]" />,
      titleColor: 'text-rose-400',
      bodyBg: 'bg-rose-950/50 border-rose-500/30 text-rose-100',
      title: 'CHƯA CHÍNH XÁC!',
      subtitle: attemptsLeft
        ? `Còn ${attemptsLeft} lượt thử`
        : 'Đừng nản lòng, xem lời giải nhé!',
      mascot: 'wrong' as const,
      btnVariant: 'danger' as const,
      btnLabel: attemptsLeft && attemptsLeft > 0 ? 'THỬ LẠI' : 'ĐÃ HIỂU',
      pattern: 'geometric',
    },
    partial: {
      border: 'border-amber-500/80',
      bgGradient: 'bg-gradient-to-b from-slate-950/98 via-slate-900/98 to-amber-950/90',
      badgeBg: 'bg-amber-500 text-slate-950 border-4 border-white shadow-[0_4px_12px_rgba(245,158,11,0.5)]',
      icon: <AlertTriangle className="w-6 h-6 stroke-[3.5]" />,
      titleColor: 'text-amber-300',
      bodyBg: 'bg-amber-950/50 border-amber-500/30 text-amber-100',
      title: 'GẦN ĐÚNG RỒI!',
      subtitle: 'Hãy chỉnh sửa lại cho chính xác hơn',
      mascot: 'thinking' as const,
      btnVariant: 'warning' as const,
      btnLabel: 'SỬA LẠI',
      pattern: 'geometric',
    },
    revealed: {
      border: 'border-indigo-500/80',
      bgGradient: 'bg-gradient-to-b from-slate-950/98 via-slate-900/98 to-indigo-950/90',
      badgeBg: 'bg-indigo-500 text-white border-4 border-white shadow-[0_4px_12px_rgba(99,102,241,0.5)]',
      icon: <BookOpen className="w-6 h-6 stroke-[3.5]" />,
      titleColor: 'text-indigo-300',
      bodyBg: 'bg-indigo-950/50 border-indigo-500/30 text-indigo-100',
      title: 'LỜI GIẢI CHI TIẾT',
      subtitle: 'Hãy đọc kỹ các bước để hiểu bản chất nhé!',
      mascot: 'thinking' as const,
      btnVariant: 'secondary' as const,
      btnLabel: 'TIẾP TỤC',
      pattern: 'confetti',
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
        initial={{ y: 220, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 220, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        className={`fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-5 border-t-4 safe-pb backdrop-blur-2xl shadow-[0_-12px_40px_rgba(0,0,0,0.8)] relative overflow-hidden ${config.border} ${config.bgGradient}`}
      >
        {/* Background decorative confetti / geometry */}
        <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
          {config.pattern === 'confetti' ? (
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10%" cy="20%" r="6" fill="#fff" />
              <circle cx="85%" cy="30%" r="8" fill="#fff" />
              <circle cx="45%" cy="15%" r="5" fill="#fff" />
              <rect x="25%" y="40%" width="12" height="6" rx="2" fill="#fff" transform="rotate(25)" />
              <rect x="70%" y="25%" width="14" height="6" rx="2" fill="#fff" transform="rotate(-30)" />
            </svg>
          ) : (
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <polygon points="40,20 55,50 25,50" fill="#fff" />
              <polygon points="80,60 95,90 65,90" fill="#fff" />
              <circle cx="15%" cy="70%" r="6" fill="#fff" />
              <circle cx="90%" cy="30%" r="5" fill="#fff" />
            </svg>
          )}
        </div>

        <div className="max-w-md mx-auto space-y-3.5 relative z-10">
          {/* Header & Atom Mascot */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              {/* 3D Round Badge */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${config.badgeBg}`}
              >
                {config.icon}
              </div>

              <div>
                <h3 className={`text-lg sm:text-xl font-black tracking-tight ${config.titleColor}`}>
                  {config.title}
                </h3>
                {config.subtitle && (
                  <p className="text-xs font-bold text-slate-300">{config.subtitle}</p>
                )}
              </div>
            </div>

            {/* Mascot Avatar */}
            <div className="shrink-0 -mt-1">
              <Mascot state={config.mascot} size="lg" />
            </div>
          </div>

          {/* Diagnosis (from commonMistakes) */}
          {diagnosis && (
            <div
              className={`p-3 rounded-2xl text-xs leading-relaxed border ${config.bodyBg}`}
            >
              <div className="font-black mb-0.5 flex items-center gap-1.5 text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5" />
                Chẩn đoán lỗi
              </div>
              <div className="opacity-95">{diagnosis}</div>
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
              className={`p-3.5 rounded-2xl text-xs leading-relaxed border shadow-inner ${config.bodyBg}`}
            >
              {solutionText && (
                <div className="font-black text-sm mb-1 text-white">{solutionText}</div>
              )}
              {explanation && (
                <div className="opacity-95 whitespace-pre-line leading-relaxed font-medium">{explanation}</div>
              )}
            </div>
          )}

          {/* Action Button (Chunky 3D) */}
          <Button
            variant={config.btnVariant}
            fullWidth
            size="lg"
            onClick={handleAction}
            className="text-sm font-black py-3 shadow-[0_5px_0_0_rgba(0,0,0,0.3)] active:translate-y-1"
          >
            {config.btnLabel}
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
