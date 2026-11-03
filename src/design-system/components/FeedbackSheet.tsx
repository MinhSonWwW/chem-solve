import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Lightbulb, Zap, Sparkles } from 'lucide-react';
import { Mascot } from './Mascot';
import { FeedbackBadge } from './FeedbackBadge';
import { MathText } from './MathText';
import { ReactionVisualizer, type ReactionEffectType } from './ReactionVisualizer';
import { sound } from '@/lib/audio';
import { haptic } from '@/lib/haptic';

export interface PhysicsEffectData {
  type: 'energy-surge' | 'electric-spark' | 'optics-beam' | 'motion-burst';
  color?: string;
  label?: string;
  detail?: string;
}

export interface FeedbackSheetProps {
  status: 'idle' | 'correct' | 'wrong' | 'partial' | 'revealed';
  solutionText?: string;
  explanation?: string;
  diagnosis?: string;
  smartHint?: string;
  hints?: Array<{ level: 1 | 2; text: string }>;
  attemptsLeft?: number;
  reactionEffect?: {
    type: ReactionEffectType;
    color?: string;
    label?: string;
  };
  physicsEffect?: PhysicsEffectData;
  onContinue: () => void;
  onRetry?: () => void;
}

// Helper to render markdown **bold** text as styled strong elements
function renderFormattedText(text: string) {
  if (!text) return null;
  return <MathText text={text} />;
}
export const FeedbackSheet: React.FC<FeedbackSheetProps> = ({
  status,
  solutionText,
  explanation,
  diagnosis,
  smartHint,
  hints,
  attemptsLeft,
  reactionEffect,
  physicsEffect,
  onContinue,
  onRetry,
}) => {
  if (status === 'idle') return null;

  const config = {
    correct: {
      sheetBg: 'bg-[var(--ok-tint)]',
      sheetBorder: 'border-t-2 border-[var(--ok-fill)]',
      topGlow: 'bg-[var(--ok-fill)]',
      badgeType: 'check' as const,
      titleColor: 'text-[var(--ok-fg)]',
      title: 'CHÍNH XÁC!',
      subtitle: 'Bạn đã nắm chắc kiến thức phần này (+10 XP)',
      mascot: 'celebrating' as const,
      btnStyle: 'bg-[var(--ok-fill)] hover:opacity-95 text-white shadow-[0_4px_0_0_var(--ok-edge)] active:translate-y-1 active:shadow-none',
      btnLabel: 'TIẾP TỤC',
    },
    wrong: {
      sheetBg: 'bg-[var(--err-tint)]',
      sheetBorder: 'border-t-2 border-[var(--err-fill)]',
      topGlow: 'bg-[var(--err-fill)]',
      badgeType: 'cross' as const,
      titleColor: 'text-[var(--err-fg)]',
      title: 'CHƯA CHÍNH XÁC!',
      subtitle: attemptsLeft
        ? `Còn ${attemptsLeft} lượt thử · Hãy đọc gợi ý bên dưới!`
        : 'Đọc kỹ gợi ý bên dưới để chuẩn bị làm lại ở cuối bài nhé!',
      mascot: 'wrong' as const,
      btnStyle: 'bg-[var(--err-fill)] hover:opacity-95 text-white shadow-[0_4px_0_0_var(--err-edge)] active:translate-y-1 active:shadow-none',
      btnLabel: attemptsLeft && attemptsLeft > 0 ? 'THỬ LẠI' : 'ĐÃ HIỂU',
    },
    partial: {
      sheetBg: 'bg-[var(--warn-tint)]',
      sheetBorder: 'border-t-2 border-[var(--warn-fill)]',
      topGlow: 'bg-[var(--warn-fill)]',
      badgeType: 'warning' as const,
      titleColor: 'text-[var(--warn-fg)]',
      title: 'GẦN ĐÚNG RỒI!',
      subtitle: 'Hãy điều chỉnh lại để hoàn thiện đáp án',
      mascot: 'thinking' as const,
      btnStyle: 'bg-[var(--warn-fill)] hover:opacity-95 text-[var(--on-ink)] shadow-[0_4px_0_0_var(--warn-edge)] active:translate-y-1 active:shadow-none',
      btnLabel: 'SỬA LẠI',
    },
    revealed: {
      sheetBg: 'bg-[var(--warn-tint)]',
      sheetBorder: 'border-t-2 border-[var(--warn-fill)]',
      topGlow: 'bg-[var(--warn-fill)]',
      badgeType: 'hint' as const,
      titleColor: 'text-[var(--warn-fg)]',
      title: 'GỢI Ý TƯ DUY',
      subtitle: 'Đọc kỹ gợi ý để chuẩn bị thử sức lại ở cuối bài nhé!',
      mascot: 'thinking' as const,
      btnStyle: 'bg-[var(--warn-fill)] hover:opacity-95 text-[var(--on-ink)] shadow-[0_4px_0_0_var(--warn-edge)] active:translate-y-1 active:shadow-none',
      btnLabel: 'TIẾP TỤC',
    },
  }[status];

  const handleAction = () => {
    sound.playClick();
    haptic.tap();
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
        className={`fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-6 safe-pb bg-[var(--bg-surface)] shadow-[var(--shadow-modal)] relative overflow-hidden ${config.sheetBg} ${config.sheetBorder}`}
      >
        {/* Subtle luminous top accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] ${config.topGlow}`} />

        <div className="max-w-md mx-auto space-y-4 relative z-10">
          {/* Header & Atom Mascot */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <FeedbackBadge type={config.badgeType} size="lg" />

              <div className="min-w-0">
                <h3 className={`text-xl sm:text-2xl font-black tracking-tight leading-tight ${config.titleColor}`}>
                  {config.title}
                </h3>
                {config.subtitle && (
                  <p className="text-xs sm:text-[13px] font-semibold text-[var(--text-secondary)] mt-0.5 leading-snug">
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

          {/* AI Smart Step Hint Card */}
          {smartHint && (
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] relative overflow-hidden space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[var(--phy-tint)] border border-[var(--phy-edge)] flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--phy-fg)]" />
                  </div>
                  <span className="font-black text-xs text-[var(--text-primary)] uppercase tracking-wide flex items-center gap-1.5">
                    Gợi ý tư duy sư phạm
                  </span>
                </div>
                {diagnosis && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border border-[var(--border)] truncate max-w-[180px]">
                    {diagnosis}
                  </span>
                )}
              </div>
              <div className="text-xs sm:text-[13px] text-[var(--text-secondary)] font-medium leading-relaxed pl-8">
                {renderFormattedText(smartHint)}
              </div>
            </motion.div>
          )}

          {/* Fallback Diagnosis if no smartHint */}
          {!smartHint && diagnosis && (
            <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] text-xs leading-relaxed space-y-1">
              <div className="font-black text-xs text-[var(--err-fg)] flex items-center gap-1.5 uppercase tracking-wide">
                <AlertTriangle className="w-3.5 h-3.5" />
                Chẩn đoán lỗi
              </div>
              <p className="text-[var(--text-secondary)] font-medium">
                {renderFormattedText(diagnosis)}
              </p>
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

          {/* Physics Interactive Energy Surge Visualizer */}
          {physicsEffect && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] relative overflow-hidden"
            >
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-9 h-9 rounded-xl bg-[var(--phy-tint)] border border-[var(--phy-edge)] flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-[var(--phy-fg)]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-black text-[var(--text-primary)] tracking-tight flex items-center gap-1.5">
                    <span>{physicsEffect.label || 'Hiện tượng vật lý'}</span>
                  </div>
                  {physicsEffect.detail && (
                    <div className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-medium mt-0.5 line-clamp-2">
                      {physicsEffect.detail}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Hints display for wrong/revealed answers */}
          {hints && hints.length > 0 && (
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-[var(--warn-fg)] uppercase tracking-wider">
                <div className="w-6 h-6 rounded-lg bg-[var(--warn-tint)] border border-[var(--warn-edge)] flex items-center justify-center shrink-0">
                  <Lightbulb className="w-3.5 h-3.5 text-[var(--warn-fg)]" />
                </div>
                <span>Gợi ý hướng dẫn tư duy:</span>
              </div>
              <div className="space-y-2 pt-0.5">
                {hints.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-[var(--text-secondary)]">
                    <span className="w-5 h-5 rounded-full bg-[var(--warn-tint)] text-[var(--warn-fg)] border border-[var(--warn-edge)] font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      {h.level || i + 1}
                    </span>
                    <p className="text-xs sm:text-[13px] font-medium text-[var(--text-secondary)] leading-relaxed">
                      {renderFormattedText(h.text)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solution Body / Explanation */}
          {(solutionText || explanation) && (
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-2">
              {solutionText && (
                <div className="text-xs sm:text-sm text-[var(--text-primary)] font-bold leading-relaxed border-b border-[var(--border)] pb-2">
                  {renderFormattedText(solutionText)}
                </div>
              )}
              {explanation && (
                <div className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-line font-normal">
                  {renderFormattedText(explanation)}
                </div>
              )}
            </div>
          )}

          {/* Action Button (Tactile Chunky 3D) */}
          <button
            onClick={handleAction}
            className={`w-full py-3.5 sm:py-4 px-6 rounded-2xl text-sm sm:text-base font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 select-none ${config.btnStyle}`}
          >
            <span>{config.btnLabel}</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
