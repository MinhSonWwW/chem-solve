import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { Button } from './Button';
import { Mascot } from './Mascot';
import { ReactionVisualizer, type ReactionEffectType } from './ReactionVisualizer';
import { sound } from '@/lib/audio';
import { assetUrl } from '@/lib/utils';

export interface FeedbackSheetProps {
  status: 'idle' | 'correct' | 'wrong' | 'partial' | 'revealed';
  solutionText?: string;
  explanation?: string;
  diagnosis?: string;
  hints?: Array<{ level: 1 | 2; text: string }>;
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
  hints,
  attemptsLeft,
  reactionEffect,
  onContinue,
  onRetry,
}) => {
  if (status === 'idle') return null;

  const config = {
    correct: {
      border: 'border-[#58cc02]',
      bgGradient: 'bg-gradient-to-b from-[#18272f]/98 to-[#16361a]/95',
      badgeImg: assetUrl('/assets/ui/badge-check.png'),
      badgeBg: 'bg-[#58cc02] text-white border-4 border-white shadow-[0_4px_12px_rgba(88,204,2,0.5)]',
      icon: <Check className="w-6 h-6 stroke-[4]" />,
      titleColor: 'text-[#58cc02]',
      bodyBg: 'bg-[#1b3a1d]/60 border-[#58cc02]/30 text-emerald-100',
      title: 'CHÍNH XÁC!',
      subtitle: 'Bạn đã nắm chắc kiến thức này (+10 XP)',
      mascot: 'celebrating' as const,
      btnVariant: 'success' as const,
      btnLabel: 'TIẾP TỤC',
      pattern: 'confetti',
    },
    wrong: {
      border: 'border-[#ff4b4b]',
      bgGradient: 'bg-gradient-to-b from-[#18272f]/98 to-[#3a1a1e]/95',
      badgeImg: assetUrl('/assets/ui/badge-cross.png'),
      badgeBg: 'bg-[#ff4b4b] text-white border-4 border-white shadow-[0_4px_12px_rgba(255,75,75,0.5)]',
      icon: <AlertCircle className="w-6 h-6 stroke-[3.5]" />,
      titleColor: 'text-[#ff4b4b]',
      bodyBg: 'bg-[#3d181b]/60 border-[#ff4b4b]/30 text-rose-100',
      title: 'CHƯA CHÍNH XÁC!',
      subtitle: attemptsLeft
        ? `Còn ${attemptsLeft} lượt thử · Hãy đọc gợi ý bên dưới!`
        : 'Đọc kỹ gợi ý bên dưới để chuẩn bị làm lại ở cuối bài nhé!',
      mascot: 'wrong' as const,
      btnVariant: 'danger' as const,
      btnLabel: attemptsLeft && attemptsLeft > 0 ? 'THỬ LẠI' : 'ĐÃ HIỂU',
      pattern: 'geometric',
    },
    partial: {
      border: 'border-[#ff9600]',
      bgGradient: 'bg-gradient-to-b from-[#18272f]/98 to-[#3a2915]/95',
      badgeImg: undefined,
      badgeBg: 'bg-[#ff9600] text-white border-4 border-white shadow-[0_4px_12px_rgba(255,150,0,0.5)]',
      icon: <AlertTriangle className="w-6 h-6 stroke-[3.5]" />,
      titleColor: 'text-[#ff9600]',
      bodyBg: 'bg-[#3d2a17]/60 border-[#ff9600]/30 text-amber-100',
      title: 'GẦN ĐÚNG RỒI!',
      subtitle: 'Hãy chỉnh sửa lại cho chính xác hơn',
      mascot: 'thinking' as const,
      btnVariant: 'warning' as const,
      btnLabel: 'SỬA LẠI',
      pattern: 'geometric',
    },
    revealed: {
      border: 'border-[#ff9600]',
      bgGradient: 'bg-gradient-to-b from-[#18272f]/98 to-[#3a2915]/95',
      badgeImg: undefined,
      badgeBg: 'bg-[#ff9600] text-white border-4 border-white shadow-[0_4px_12px_rgba(255,150,0,0.5)]',
      icon: <Lightbulb className="w-6 h-6 stroke-[3.5]" />,
      titleColor: 'text-[#ff9600]',
      bodyBg: 'bg-[#3d2a17]/60 border-[#ff9600]/30 text-amber-100',
      title: 'GỢI Ý TƯ DUY',
      subtitle: 'Đọc kỹ gợi ý để chuẩn bị thử sức lại ở cuối bài nhé!',
      mascot: 'thinking' as const,
      btnVariant: 'warning' as const,
      btnLabel: 'TIẾP TỤC',
      pattern: 'geometric',
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
              {config.badgeImg ? (
                <img
                  src={config.badgeImg}
                  alt={config.title}
                  className="w-13 h-13 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] shrink-0"
                />
              ) : (
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${config.badgeBg}`}
                >
                  {config.icon}
                </div>
              )}

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

          {/* Hints display for wrong/revealed answers */}
          {hints && hints.length > 0 && (
            <div className="p-3.5 rounded-2xl text-xs leading-relaxed border bg-amber-950/40 border-amber-500/40 text-amber-100 shadow-inner space-y-2">
              <div className="font-black text-xs text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-400 fill-amber-400/20 shrink-0" />
                <span>Gợi ý hướng dẫn tư duy:</span>
              </div>
              <div className="space-y-1.5 pl-0.5">
                {hints.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-slate-200">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold shrink-0 mt-0.5 border border-amber-500/40">
                      {h.level || i + 1}
                    </span>
                    <span className="font-medium text-slate-300">{h.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solution Body / Explanation (Only shown if solutionText or explanation is provided) */}
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
