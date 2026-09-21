import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { Mascot } from './Mascot';
import { GAMIFICATION } from '@/config/gamification';
import { sound } from '@/lib/audio';
import { assetUrl } from '@/lib/utils';

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
      icon: <img src={assetUrl('/assets/icons/xp-potion.png')} alt="XP" className="w-5 h-5 object-contain" />,
      label: 'Kinh nghiệm',
      value: `+${totalXp} XP`,
      highlight: 'text-amber-300',
    },
    {
      icon: <img src={assetUrl('/assets/roadmap/trophy-gold.png')} alt="Cúp" className="w-5 h-5 object-contain" />,
      label: 'Chính xác',
      value: `${accuracyPercent}%`,
      highlight: accuracyPercent >= 80 ? 'text-emerald-300' : 'text-amber-300',
    },
    {
      icon: <img src={assetUrl('/assets/icons/heart-flask.png')} alt="Tim" className="w-5 h-5 object-contain" />,
      label: 'Kết quả',
      value: `${correctCount}/${totalQuestions}`,
      highlight: 'text-slate-200',
    },
    {
      icon: <img src={assetUrl('/assets/icons/streak-flame.png')} alt="Streak" className="w-5 h-5 object-contain" />,
      label: 'Chuỗi ngày',
      value: `${streak} ngày`,
      highlight: 'text-cyan-300',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[85dvh] text-center px-4 relative overflow-hidden"
    >
      {/* Background Confetti Animation */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <video
          src={assetUrl('/assets/animations/confetti.mp4')}
          autoPlay
          muted
          playsInline
          loop
          className="w-full h-full object-cover opacity-40 mix-blend-screen pointer-events-none"
        />
      </div>

      {/* Celebration mascot with floating stars */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
        className="relative z-10"
      >
        <Mascot state="correct" size="xl" />
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 space-y-1 relative z-10"
      >
        <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-cyan-300 bg-clip-text text-transparent tracking-tight">
          🎉 Hoàn thành chặng!
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-bold">
          {perfectRun
            ? 'Xuất sắc tuyệt đối! Bạn không mất tim nào!'
            : 'Bạn đã hoàn thành rất tốt, tiếp tục phát huy nhé!'}
        </p>
      </motion.div>

      {/* Bonus badges */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap justify-center gap-2 mt-4 relative z-10"
      >
        <div className="px-3.5 py-1.5 rounded-2xl bg-cyan-950/60 border border-cyan-700/60 text-cyan-300 text-xs font-black flex items-center gap-1.5 shadow-md">
          <Sparkles className="w-4 h-4" />
          +{GAMIFICATION.session.completeBonus} XP hoàn thành
        </div>
        {perfectRun && (
          <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-black flex items-center gap-1.5 shadow-md">
            <Heart className="w-4 h-4 fill-emerald-400 text-emerald-400" />
            +{GAMIFICATION.session.perfectBonus} XP hoàn hảo
          </div>
        )}
      </motion.div>

      {/* Stats cards (3D chunky Duolingo style) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 gap-3 mt-6 w-full max-w-sm relative z-10"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 + i * 0.1 }}
            className="p-3.5 rounded-2xl bg-slate-900/90 border-2 border-slate-800 space-y-1.5 shadow-[0_4px_0_0_#1e293b]"
          >
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
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
