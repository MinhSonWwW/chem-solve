import React from 'react';
import { motion } from 'motion/react';
import { X, Trophy, Flame, Sparkles, RotateCcw, ArrowLeft, Clock } from 'lucide-react';
import { Button } from './Button';
import { Mascot } from './Mascot';
import { sound } from '@/lib/audio';

export interface MinigameShellProps {
  title: string;
  description?: string;
  icon?: string;
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
      <div className="space-y-3 pb-3 border-b border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onExit();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
            aria-label="Thoát trò chơi"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <div className="text-left">
              <h1 className="text-xs font-black text-slate-200 leading-tight truncate">
                {title}
              </h1>
              <p className="text-[10px] text-slate-500 truncate">{description}</p>
            </div>
          </div>

          {/* Score counter */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black text-slate-100 font-mono">
              {score}
            </span>
          </div>
        </div>

        {/* Timer Bar (if timed) */}
        {timeLeft != null && (
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className={`flex items-center gap-1 ${isTimeCritical ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`}>
                <Clock className="w-3 h-3" />
                Thời gian còn lại:
              </span>
              <span className={`font-mono text-xs ${isTimeCritical ? 'text-rose-400 font-black' : 'text-cyan-400'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isTimeCritical
                    ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]'
                    : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                }`}
                style={{ width: `${timePercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Combo Badge (if combo >= 2) */}
        {combo >= 2 && (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-300" />
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
            className="p-6 rounded-3xl bg-slate-900 border-2 border-slate-700 text-center space-y-4 shadow-2xl"
          >
            <div className="flex justify-center pt-2">
              <Mascot state="celebrating" size="lg" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Hoàn thành vòng chơi!
              </span>
              <h2 className="text-xl font-black text-slate-100">
                Thành tích xuất sắc!
              </h2>
            </div>

            {/* Score & XP Cards */}
            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  Điểm số
                </span>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {score}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  Kinh nghiệm
                </span>
                <div className="text-2xl font-black text-emerald-400 font-mono flex items-center justify-center gap-1">
                  <Sparkles className="w-5 h-5 fill-emerald-400 text-emerald-400" />
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
