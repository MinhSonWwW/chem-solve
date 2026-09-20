import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Flame, Heart, Star, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { Mascot } from './Mascot';
import { GAMIFICATION } from '@/config/gamification';
import { sound } from '@/lib/audio';

export interface SessionCompleteScreenProps {
  totalXp: number;
  accuracy: number;
  perfectRun: boolean;
  totalQuestions: number;
  correctCount: number;
  streak: number;
  onContinue: () => void;
}

export const SessionCompleteScreen: React.FC<SessionCompleteScreenProps> = ({
  totalXp,
  accuracy,
  perfectRun,
  totalQuestions,
  correctCount,
  streak,
  onContinue,
}) => {
  const accuracyPercent = Math.round(accuracy * 100);

  const stats = [
    {
      icon: <Star className="w-5 h-5 text-amber-400" />,
      label: 'Kinh nghiệm',
      value: `+${totalXp} XP`,
      highlight: 'text-amber-300',
    },
    {
      icon: <Trophy className="w-5 h-5 text-cyan-400" />,
      label: 'Chính xác',
      value: `${accuracyPercent}%`,
      highlight: accuracyPercent >= 80 ? 'text-emerald-300' : 'text-amber-300',
    },
    {
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      label: 'Kết quả',
      value: `${correctCount}/${totalQuestions}`,
      highlight: 'text-slate-200',
    },
    {
      icon: <Flame className="w-5 h-5 text-orange-400" />,
      label: 'Chuỗi ngày',
      value: `${streak} ngày`,
      highlight: 'text-orange-300',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[85dvh] text-center px-4"
    >
      {/* Celebration mascot */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
      >
        <Mascot state="correct" size="lg" />
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 space-y-1"
      >
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">
          🎉 Hoàn thành chặng!
        </h1>
        <p className="text-sm text-slate-400 font-medium">
          {perfectRun
            ? 'Xuất sắc! Bạn không mất tim nào!'
            : 'Bạn đã hoàn thành tốt lắm, tiếp tục nhé!'}
        </p>
      </motion.div>

      {/* Bonus badges */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-2 mt-4"
      >
        <div className="px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          +{GAMIFICATION.session.completeBonus} XP hoàn thành
        </div>
        {perfectRun && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5" />
            +{GAMIFICATION.session.perfectBonus} XP hoàn hảo
          </div>
        )}
      </motion.div>

      {/* Stats cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 gap-3 mt-6 w-full max-w-sm"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 + i * 0.1 }}
            className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1"
          >
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
              {stat.icon}
              {stat.label}
            </div>
            <div className={`text-xl font-black ${stat.highlight}`}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Continue button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="mt-8 w-full max-w-sm"
      >
        <Button
          variant="success"
          size="lg"
          fullWidth
          onClick={() => {
            sound.playClick();
            onContinue();
          }}
        >
          TIẾP TỤC
          <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      </motion.div>
    </motion.div>
  );
};
