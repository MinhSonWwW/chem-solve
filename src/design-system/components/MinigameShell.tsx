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
      <div className="space-y-3 pb-3 border-b border-[#2e4756]">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onExit();
            }}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_2px_0_0_#131f24] hover:bg-[#20333d] transition-colors cursor-pointer"
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
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_2px_0_0_#131f24]">
            <Trophy className="w-4 h-4 text-[#ffc800]" />
            <span className="text-xs font-black text-slate-100 font-mono">
              {score}
            </span>
          </div>
        </div>

        {/* Timer Bar (if timed) */}
        {timeLeft != null && (
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className={`flex items-center gap-1 ${isTimeCritical ? 'text-[#ff4b4b] animate-pulse' : 'text-slate-400'}`}>
                <Clock className="w-3 h-3" />
                Thời gian còn lại:
              </span>
              <span className={`font-mono text-xs ${isTimeCritical ? 'text-[#ff4b4b] font-black' : 'text-[#38bdf8]'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="w-full bg-[#131f24] h-2 rounded-full overflow-hidden border border-[#2e4756]">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isTimeCritical
                    ? 'bg-[#ff4b4b] shadow-[0_0_10px_rgba(255,75,75,0.6)]'
                    : 'bg-gradient-to-r from-[#0ea5e9] to-[#00cd9c]'
                }`}
                style={{ width: `${timePercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Combo Badge (if combo >= 2) */}
        {combo >= 2 && (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ff9600]/15 border border-[#ff9600]/40 text-[#ff9600] text-[10px] font-black animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-[#ff9600] text-[#ff9600]" />
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
            className="p-6 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] text-center space-y-4 shadow-[0_6px_0_0_#131f24]"
          >
            <div className="flex justify-center pt-2">
              <Mascot state="celebrating" size="lg" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#00cd9c]">
                Hoàn thành vòng chơi!
              </span>
              <h2 className="text-xl font-black text-slate-100">
                Thành tích xuất sắc!
              </h2>
            </div>

            {/* Score & XP Cards */}
            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="p-3 rounded-2xl bg-[#131f24] border-2 border-[#2e4756] space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  Điểm số
                </span>
                <div className="text-2xl font-black text-[#ffc800] font-mono">
                  {score}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-[#131f24] border-2 border-[#2e4756] space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  Kinh nghiệm
                </span>
                <div className="text-2xl font-black text-[#00cd9c] font-mono flex items-center justify-center gap-1">
                  <Sparkles className="w-5 h-5 fill-[#00cd9c] text-[#00cd9c]" />
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
