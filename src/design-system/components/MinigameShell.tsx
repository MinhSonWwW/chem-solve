import React from 'react';
import { motion } from 'motion/react';
import { X, RotateCcw, ArrowLeft, Clock } from 'lucide-react';
import { Button } from './Button';
import { Mascot } from './Mascot';
import { CurrencyIcon } from './CurrencyIcon';
import { sound } from '@/lib/audio';

export interface MinigameShellProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  skillId?: string;
  timeLeft?: number; // In seconds
  totalTime?: number;
  score: number;
  combo?: number;
  isGameOver: boolean;
  earnedXp: number;
  onExit: () => void;
  onRestart: () => void;
  children: React.ReactNode;
}

export const MinigameShell: React.FC<MinigameShellProps> = ({
  title,
  description,
  icon,
  timeLeft,
  totalTime = 60,
  score,
  combo = 0,
  isGameOver,
  earnedXp,
  onExit,
  onRestart,
  children,
}) => {
  const timePercent = timeLeft != null ? Math.round((timeLeft / totalTime) * 100) : 100;
  const isTimeCritical = timeLeft != null && timeLeft <= 10;

  return (
    <div className="flex flex-col justify-between min-h-[90dvh] relative max-w-md mx-auto pb-28">
      {/* 1. Header Bar */}
      <div className="space-y-3 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onExit();
            }}
            className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:bg-[var(--bg-surface-2)] transition-colors cursor-pointer"
            aria-label="Thoát trò chơi"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {icon && <span className="text-xl">{icon}</span>}
            <div className="text-left">
              <h1 className="text-xs font-black text-[var(--text-primary)] leading-tight truncate">
                {title}
              </h1>
              <p className="text-[10px] text-[var(--text-secondary)] truncate">{description}</p>
            </div>
          </div>

          {/* Score counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
            <CurrencyIcon type="trophy" size="xs" />
            <span className="text-xs font-black text-[var(--gold-fg)] font-mono">
              {score}
            </span>
          </div>
        </div>

        {/* Timer Bar (if timed) */}
        {timeLeft != null && (
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className={`flex items-center gap-1 ${isTimeCritical ? 'text-[var(--err-fg)] animate-pulse' : 'text-[var(--text-secondary)]'}`}>
                <Clock className="w-3 h-3" />
                Thời gian còn lại:
              </span>
              <span className={`font-mono text-xs ${isTimeCritical ? 'text-[var(--err-fg)] font-black' : 'text-[var(--subject-fg)]'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="w-full bg-[var(--bg-surface-2)] h-2 rounded-full overflow-hidden border border-[var(--border)]">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isTimeCritical
                    ? 'bg-[var(--err-fill)]'
                    : 'bg-[var(--ok-fill)]'
                }`}
                style={{ width: `${timePercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Combo Badge (if combo >= 2) */}
        {combo >= 2 && (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--warn-tint)] border border-[var(--warn-edge)] text-[var(--warn-fg)] text-[11px] font-black">
              <CurrencyIcon type="streak" size="xs" />
              <span>Chuỗi x{combo}!</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Main Game Content */}
      <div className="my-auto py-4 flex-1 flex flex-col justify-center">
        {!isGameOver ? (
          children
        ) : (
          /* Game Over / Victory Screen */
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] text-center space-y-4 shadow-[var(--shadow-modal)]"
          >
            <div className="flex justify-center pt-2">
              <Mascot state="celebrating" size="lg" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--ok-fg)]">
                Hoàn thành vòng chơi!
              </span>
              <h2 className="text-xl font-black text-[var(--text-primary)]">
                Thành tích xuất sắc!
              </h2>
            </div>

            {/* Score & XP Cards */}
            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="p-3 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] space-y-1">
                <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">
                  Điểm số
                </span>
                <div className="text-2xl font-black text-[var(--gold-fg)] font-mono flex items-center justify-center gap-1.5">
                  <CurrencyIcon type="trophy" size="sm" />
                  {score}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] space-y-1">
                <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">
                  Kinh nghiệm
                </span>
                <div className="text-2xl font-black text-[var(--gold-fg)] font-mono flex items-center justify-center gap-1.5">
                  <CurrencyIcon type="xp" size="sm" />
                  +{earnedXp}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="flex items-center justify-center gap-2"
                onClick={() => {
                  sound.playClick();
                  onRestart();
                }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>CHƠI LẠI VÒNG MỚI</span>
              </Button>
              <Button
                variant="ghost"
                size="md"
                fullWidth
                className="text-slate-400 hover:text-slate-200"
                onClick={() => {
                  sound.playClick();
                  onExit();
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                QUAY VỀ KHO TRÒ CHƠI
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
