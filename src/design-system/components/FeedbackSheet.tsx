import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Lightbulb } from 'lucide-react';
import { Mascot } from './Mascot';
import { FeedbackBadge } from './FeedbackBadge';
import { ReactionVisualizer, type ReactionEffectType } from './ReactionVisualizer';
import { sound } from '@/lib/audio';

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

// Helper to render markdown **bold** text as styled strong elements
function renderFormattedText(text: string) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-black text-white px-0.5">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
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
      sheetBorder: 'border-t-2 border-[#00cd9c]',
      topGlow: 'bg-gradient-to-r from-transparent via-[#00cd9c]/70 to-transparent shadow-[0_0_20px_rgba(0,205,156,0.6)]',
      badgeType: 'check' as const,
      titleColor: 'text-[#00cd9c]',
      title: 'CHÍNH XÁC!',
      subtitle: 'Bạn đã nắm chắc kiến thức này (+10 XP)',
      mascot: 'celebrating' as const,
      btnStyle: 'bg-[#00cd9c] hover:bg-[#00e6aa] text-[#131f24] border-b-4 border-[#009b76] shadow-[0_4px_16px_rgba(0,205,156,0.35)]',
      btnLabel: 'TIẾP TỤC',
    },
    wrong: {
      sheetBorder: 'border-t-2 border-[#ff4b4b]',
      topGlow: 'bg-gradient-to-r from-transparent via-[#ff4b4b]/70 to-transparent shadow-[0_0_20px_rgba(255,75,75,0.6)]',
      badgeType: 'cross' as const,
      titleColor: 'text-[#ff4b4b]',
      title: 'CHƯA CHÍNH XÁC!',
      subtitle: attemptsLeft
        ? `Còn ${attemptsLeft} lượt thử · Hãy đọc gợi ý bên dưới!`
        : 'Đọc kỹ gợi ý bên dưới để chuẩn bị làm lại ở cuối bài nhé!',
      mascot: 'wrong' as const,
      btnStyle: 'bg-[#ff4b4b] hover:bg-[#ff5964] text-white border-b-4 border-[#c92a2a] shadow-[0_4px_16px_rgba(255,75,75,0.35)]',
      btnLabel: attemptsLeft && attemptsLeft > 0 ? 'THỬ LẠI' : 'ĐÃ HIỂU',
    },
    partial: {
      sheetBorder: 'border-t-2 border-[#ff9600]',
      topGlow: 'bg-gradient-to-r from-transparent via-[#ff9600]/70 to-transparent shadow-[0_0_20px_rgba(255,150,0,0.6)]',
      badgeType: 'warning' as const,
      titleColor: 'text-[#ff9600]',
      title: 'GẦN ĐÚNG RỒI!',
      subtitle: 'Hãy chỉnh sửa lại cho chính xác hơn',
      mascot: 'thinking' as const,
      btnStyle: 'bg-[#ff9600] hover:bg-[#ffa726] text-[#131f24] border-b-4 border-[#cc7800] shadow-[0_4px_16px_rgba(255,150,0,0.35)]',
      btnLabel: 'SỬA LẠI',
    },
    revealed: {
      sheetBorder: 'border-t-2 border-[#ff9600]',
      topGlow: 'bg-gradient-to-r from-transparent via-[#ff9600]/70 to-transparent shadow-[0_0_20px_rgba(255,150,0,0.6)]',
      badgeType: 'hint' as const,
      titleColor: 'text-[#ff9600]',
      title: 'GỢI Ý TƯ DUY',
      subtitle: 'Đọc kỹ gợi ý để chuẩn bị thử sức lại ở cuối bài nhé!',
      mascot: 'thinking' as const,
      btnStyle: 'bg-[#ff9600] hover:bg-[#ffa726] text-[#131f24] border-b-4 border-[#cc7800] shadow-[0_4px_16px_rgba(255,150,0,0.35)]',
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
        initial={{ y: 240, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 240, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        className={`fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-6 safe-pb backdrop-blur-2xl shadow-[0_-12px_45px_rgba(0,0,0,0.85)] bg-[#131f24]/98 relative overflow-hidden ${config.sheetBorder}`}
      >
        {/* Subtle luminous top accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] ${config.topGlow}`} />

        <div className="max-w-md mx-auto space-y-4 relative z-10">
          {/* Header & Atom Mascot */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Dedicated 3D Tactile Feedback Badge */}
              <FeedbackBadge type={config.badgeType} size="lg" />

              <div className="min-w-0">
                <h3 className={`text-xl sm:text-2xl font-black tracking-tight leading-tight ${config.titleColor}`}>
                  {config.title}
                </h3>
                {config.subtitle && (
                  <p className="text-xs sm:text-[13px] font-semibold text-slate-300 mt-0.5 leading-snug">
                    {config.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Mascot Avatar */}
            <div className="shrink-0 -mt-1 drop-shadow-md">
              <Mascot state={config.mascot} size="lg" />
            </div>
          </div>

          {/* Diagnosis (from commonMistakes) */}
          {diagnosis && (
            <div className="p-3.5 rounded-2xl bg-[#18272f] border-2 border-[#ce82ff]/30 shadow-[0_4px_0_0_#131f24] text-xs leading-relaxed space-y-1">
              <div className="font-black text-xs text-[#ce82ff] flex items-center gap-1.5 uppercase tracking-wide">
                <AlertTriangle className="w-3.5 h-3.5" />
                Chẩn đoán lỗi
              </div>
              <p className="text-slate-300 font-medium">{diagnosis}</p>
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
            <div className="p-4 rounded-2xl bg-[#18272f] border-2 border-[#ff9600]/30 shadow-[0_4px_0_0_#131f24] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-[#ff9600] uppercase tracking-wider">
                <div className="w-6 h-6 rounded-lg bg-[#ff9600]/20 border border-[#ff9600]/40 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-3.5 h-3.5 text-[#ff9600]" />
                </div>
                <span>Gợi ý hướng dẫn tư duy:</span>
              </div>
              <div className="space-y-2 pt-0.5">
                {hints.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-[#ff9600]/20 text-[#ff9600] border border-[#ff9600]/40 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      {h.level || i + 1}
                    </span>
                    <p className="text-xs sm:text-[13px] font-medium text-slate-200 leading-relaxed">
                      {renderFormattedText(h.text)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solution Body / Explanation (Only shown if solutionText or explanation is provided) */}
          {(solutionText || explanation) && (
            <div className="p-4 rounded-2xl bg-[#18272f] border-2 border-[#00cd9c]/30 shadow-[0_4px_0_0_#131f24] space-y-2">
              {solutionText && (
                <div className="text-xs sm:text-sm text-slate-100 font-bold leading-relaxed border-b border-[#2e4756] pb-2">
                  {renderFormattedText(solutionText)}
                </div>
              )}
              {explanation && (
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                  {renderFormattedText(explanation)}
                </div>
              )}
            </div>
          )}

          {/* Action Button (Tactile Chunky 3D) */}
          <button
            onClick={handleAction}
            className={`w-full py-3.5 sm:py-4 px-6 rounded-2xl text-sm sm:text-base font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 select-none active:translate-y-1 active:border-b-0 ${config.btnStyle}`}
          >
            <span>{config.btnLabel}</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
