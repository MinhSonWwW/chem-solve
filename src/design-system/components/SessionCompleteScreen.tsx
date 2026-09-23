import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Award } from 'lucide-react';
import { Button } from './Button';
import { Mascot } from './Mascot';
import { CurrencyIcon } from './CurrencyIcon';
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
  isPractice?: boolean;
  recoveredHearts?: number;
  earnedGems?: number;
  onContinue: () => void;
}

export const SessionCompleteScreen: React.FC<SessionCompleteScreenProps> = ({
  totalXp,
  accuracy,
  perfectRun,
  totalQuestions,
  correctCount,
  streak,
  isPractice,
  recoveredHearts,
  earnedGems,
  onContinue,
}) => {
  const accuracyPercent = Math.round(accuracy * 100);

  const stats = [
    {
      icon: <CurrencyIcon type="xp" size="sm" />,
      label: 'Kinh nghiệm',
      value: `+${totalXp} XP`,
      highlight: 'text-amber-300',
    },
    {
      icon: <CurrencyIcon type="gem" size="sm" />,
      label: 'Đá quý thưởng',
      value: `+${earnedGems ?? 0}`,
      highlight: 'text-cyan-300',
    },
    {
      icon: <CurrencyIcon type="trophy" size="sm" />,
      label: 'Độ chính xác',
      value: `${accuracyPercent}%`,
      highlight: 'text-emerald-400',
    },
    {
      icon: <CurrencyIcon type="streak" size="sm" />,
      label: 'Chuỗi ngày',
      value: `${streak} ngày`,
      highlight: 'text-orange-400',
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
          className="w-full h-full object-cover opacity-35 mix-blend-screen pointer-events-none"
        />
      </div>

      {/* Victory Stage: Ambient Glow & 3D Trophy / Mascot Display */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.2 }}
        className="relative z-10 flex items-center justify-center gap-3 my-2"
      >
        {/* Radial Gold Aura */}
        <div className="absolute w-48 h-48 rounded-full bg-amber-500/15 blur-3xl pointer-events-none -z-10" />

        <div className="relative">
          <Mascot state="celebrating" size="xl" />
        </div>

        <motion.div
          initial={{ y: 20, rotate: 10 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.35 }}
          className="relative -ml-4"
        >
          <img
            src={assetUrl('/assets/roadmap/trophy-gold.png')}
            alt="Victory Trophy"
            className="w-20 h-20 object-contain filter drop-shadow-[0_8px_16px_rgba(245,158,11,0.5)] animate-bounce"
            style={{ animationDuration: '2.5s' }}
          />
        </motion.div>
      </motion.div>

      {/* Victory Title & Subtitle */}
      <motion.div
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="space-y-1.5 relative z-10"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-black tracking-wider uppercase mb-1">
          <Award className="w-3.5 h-3.5" />
          <span>{isPractice ? 'Luyện tập xuất sắc' : 'Chinh phục chặng thành công'}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-cyan-300 bg-clip-text text-transparent tracking-tight">
          {isPractice ? 'Hoàn thành phiên luyện tập!' : 'Xuất sắc vượt qua chặng!'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md mx-auto">
          {isPractice
            ? `Bạn đã hoàn thành chính xác (${correctCount}/${totalQuestions} câu) và bổ sung thêm tim năng lượng!`
            : perfectRun
            ? 'Tuyệt đỉnh! Bạn không phạm một lỗi sai nào trong suốt chặng học!'
            : `Bạn đã trả lời đúng ${correctCount}/${totalQuestions} câu, tiếp tục giữ vững phong độ nhé!`}
        </p>
      </motion.div>

      {/* Milestone Bonus Badges */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="flex flex-wrap justify-center gap-2 mt-3 relative z-10"
      >
        <div className="px-3.5 py-1.5 rounded-2xl bg-[#18272f] border-2 border-cyan-500/40 text-cyan-300 text-xs font-black flex items-center gap-1.5 shadow-[0_2px_0_0_#131f24]">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>+{GAMIFICATION.session.completeBonus} XP hoàn thành</span>
        </div>

        {earnedGems !== undefined && earnedGems > 0 && (
          <div className="px-3.5 py-1.5 rounded-2xl bg-[#18272f] border-2 border-cyan-400/50 text-cyan-200 text-xs font-black flex items-center gap-1.5 shadow-[0_2px_0_0_#131f24]">
            <CurrencyIcon type="gem" size="xs" />
            <span>+{earnedGems} Đá quý</span>
          </div>
        )}

        {isPractice && (recoveredHearts ?? 0) > 0 && (
          <div className="px-3.5 py-1.5 rounded-2xl bg-[#18272f] border-2 border-rose-500/40 text-rose-300 text-xs font-black flex items-center gap-1.5 shadow-[0_2px_0_0_#131f24]">
            <CurrencyIcon type="heart" size="xs" animate />
            <span>+{recoveredHearts} Tim hồi sinh</span>
          </div>
        )}

        {perfectRun && !isPractice && (
          <div className="px-3.5 py-1.5 rounded-2xl bg-[#18272f] border-2 border-emerald-500/40 text-emerald-300 text-xs font-black flex items-center gap-1.5 shadow-[0_2px_0_0_#131f24]">
            <CurrencyIcon type="heart" size="xs" />
            <span>+{GAMIFICATION.session.perfectBonus} XP hoàn hảo</span>
          </div>
        )}
      </motion.div>

      {/* 4 Metallic Merit Stat Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="grid grid-cols-2 gap-3 mt-5 w-full max-w-sm relative z-10"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.65 + i * 0.08 }}
            className="p-3.5 rounded-2xl bg-[#18272f] border-2 border-[#2e4756] hover:border-[#38bdf8]/50 space-y-1 shadow-[0_4px_0_0_#131f24] text-left transition-all"
          >
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
              {stat.icon}
              <span>{stat.label}</span>
            </div>
            <div className={`text-xl font-black ${stat.highlight}`}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Continue Button with 3D tactile push */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.95 }}
        className="mt-7 w-full max-w-sm relative z-10"
      >
        <Button
          variant="success"
          size="lg"
          fullWidth
          onClick={() => {
            sound.playClick();
            onContinue();
          }}
          className="shadow-[0_6px_0_0_#15803d] active:translate-y-1.5 active:shadow-[0_1px_0_0_#15803d] transition-all font-black text-base tracking-wider"
        >
          TIẾP TỤC BÀI HỌC
          <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

