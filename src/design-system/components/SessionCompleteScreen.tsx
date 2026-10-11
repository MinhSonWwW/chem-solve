import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Award } from 'lucide-react';
import { Button } from './Button';
import { Mascot } from './Mascot';
import { CurrencyIcon } from './CurrencyIcon';
import { SubjectTrophy } from './SubjectTrophy';
import { GAMIFICATION } from '@/config/gamification';
import { sound } from '@/lib/audio';
import { useActiveSubject, type SubjectId } from '@/content/subjects';

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
  subject?: SubjectId;
  onContinue: () => void;
}

const SUBJECT_CONFIG: Record<
  SubjectId,
  {
    name: string;
    auraColor: string;
    badgeText: string;
    badgeClass: string;
    titleGradient: string;
    xpBonusLabel: string;
    xpBorderClass: string;
    btnClass: string;
    floatingOrnaments: React.ReactNode;
    accuracyIcon: React.ReactNode;
    perfectCopy: string;
    successCopy: (correct: number, total: number) => string;
  }
> = {
  bio: {
    name: 'Sinh học',
    auraColor: 'bg-emerald-500/20',
    badgeText: 'Chinh phục thế giới sống thành công',
    badgeClass: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300',
    titleGradient: 'from-emerald-300 via-teal-200 to-lime-300',
    xpBonusLabel: '+20 XP Sinh học hoàn thành',
    xpBorderClass: 'border-emerald-500/40 text-emerald-300',
    btnClass:
      'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_6px_0_0_#047857] active:shadow-[0_1px_0_0_#047857]',
    floatingOrnaments: (
      <>
        <span className="absolute -top-3 left-2 text-base select-none animate-bounce" style={{ animationDuration: '3s' }}>🍃</span>
        <span className="absolute top-2 -right-3 text-base select-none animate-pulse">🌱</span>
        <span className="absolute -bottom-2 -left-2 text-sm select-none text-teal-300 animate-ping" style={{ animationDuration: '4s' }}>✨</span>
        <span className="absolute -bottom-1 -right-1 text-sm select-none text-emerald-300 animate-pulse">✨</span>
      </>
    ),
    accuracyIcon: <SubjectTrophy subject="bio" size={18} animate={false} />,
    perfectCopy: 'Tuyệt đỉnh! Mắt xích sinh thái và kiến thức cơ thể chuẩn xác 100%!',
    successCopy: (c, t) => `Bạn đã trả lời đúng ${c}/${t} câu, mầm tri thức sinh học đang nở rộ!`,
  },
  physics: {
    name: 'Vật lý',
    auraColor: 'bg-amber-500/20',
    badgeText: 'Làm chủ quy luật vật lý thành công',
    badgeClass: 'bg-amber-500/15 border-amber-500/35 text-amber-300',
    titleGradient: 'from-amber-300 via-yellow-200 to-sky-300',
    xpBonusLabel: '+20 XP Vật lý hoàn thành',
    xpBorderClass: 'border-amber-500/40 text-amber-300',
    btnClass:
      'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-[0_6px_0_0_#ca8a04] active:shadow-[0_1px_0_0_#ca8a04]',
    floatingOrnaments: (
      <>
        <span className="absolute -top-3 left-2 text-base select-none animate-bounce" style={{ animationDuration: '2.8s' }}>⚡</span>
        <span className="absolute top-2 -right-3 text-base select-none animate-pulse">⚛️</span>
        <span className="absolute -bottom-2 -left-2 text-sm select-none text-sky-300 animate-ping" style={{ animationDuration: '4s' }}>🌟</span>
        <span className="absolute -bottom-1 -right-1 text-sm select-none text-yellow-300 animate-pulse">⚡</span>
      </>
    ),
    accuracyIcon: <SubjectTrophy subject="physics" size={18} animate={false} />,
    perfectCopy: 'Tuyệt đỉnh! Năng lượng, lực và các định luật nghiệm đúng 100%!',
    successCopy: (c, t) => `Bạn đã trả lời đúng ${c}/${t} câu, năng lượng bứt phá rất ấn tượng!`,
  },
  chem: {
    name: 'Hóa học',
    auraColor: 'bg-cyan-500/15',
    badgeText: 'Chinh phục phản ứng thành công',
    badgeClass: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    titleGradient: 'from-amber-300 via-yellow-200 to-cyan-300',
    xpBonusLabel: '+20 XP Hóa học hoàn thành',
    xpBorderClass: 'border-cyan-500/40 text-cyan-300',
    btnClass:
      'bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-white shadow-[0_6px_0_0_#0284c7] active:shadow-[0_1px_0_0_#0284c7]',
    floatingOrnaments: (
      <>
        <span className="absolute -top-3 left-2 text-base select-none animate-bounce" style={{ animationDuration: '3.2s' }}>🫧</span>
        <span className="absolute top-2 -right-3 text-base select-none animate-pulse">🧪</span>
        <span className="absolute -bottom-2 -left-2 text-sm select-none text-cyan-300 animate-ping" style={{ animationDuration: '4s' }}>✨</span>
        <span className="absolute -bottom-1 -right-1 text-sm select-none text-amber-300 animate-pulse">⚗️</span>
      </>
    ),
    accuracyIcon: <CurrencyIcon type="trophy" size="sm" />,
    perfectCopy: 'Tuyệt đỉnh! Chuỗi phản ứng và tính toán diễn ra hoàn hảo không tì vết!',
    successCopy: (c, t) => `Bạn đã trả lời đúng ${c}/${t} câu, tiếp tục giữ vững phong độ nhé!`,
  },
};

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
  subject,
  onContinue,
}) => {
  const { subject: activeSubject } = useActiveSubject();
  const currentSubject: SubjectId = subject ?? activeSubject ?? 'chem';
  const cfg = SUBJECT_CONFIG[currentSubject] ?? SUBJECT_CONFIG.chem;

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
      icon: cfg.accuracyIcon,
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
      {/* Victory Stage: Ambient Glow & Subject Mascot / Trophy Display */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.2 }}
        className="relative z-10 flex items-center justify-center gap-3 my-2"
      >
        {/* Radial Subject Aura */}
        <div
          className={`absolute w-56 h-56 rounded-full ${cfg.auraColor} blur-3xl pointer-events-none -z-10`}
        />

        {/* Mascot celebrating */}
        <div className="relative">
          <Mascot state="celebrating" size="xl" />
          {cfg.floatingOrnaments}
        </div>

        {/* Dedicated 3D Subject Trophy */}
        <motion.div
          initial={{ y: 20, rotate: 10 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.35 }}
          className="relative -ml-3"
        >
          <SubjectTrophy subject={currentSubject} size={84} />
        </motion.div>
      </motion.div>

      {/* Victory Title & Subtitle */}
      <motion.div
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="space-y-1.5 relative z-10"
      >
        <div
          className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-[11px] font-black tracking-wider uppercase mb-1 shadow-sm ${cfg.badgeClass}`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>{isPractice ? 'Luyện tập xuất sắc' : cfg.badgeText}</span>
        </div>

        <h1
          className={`text-2xl sm:text-3xl font-black bg-gradient-to-r ${cfg.titleGradient} bg-clip-text text-transparent tracking-tight`}
        >
          {isPractice ? 'Hoàn thành phiên luyện tập!' : `Xuất sắc vượt qua chặng!`}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md mx-auto">
          {isPractice
            ? `Bạn đã hoàn thành chính xác (${correctCount}/${totalQuestions} câu) và bổ sung thêm tim năng lượng!`
            : perfectRun
            ? cfg.perfectCopy
            : cfg.successCopy(correctCount, totalQuestions)}
        </p>
      </motion.div>

      {/* Milestone Bonus Badges */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="flex flex-wrap justify-center gap-2 mt-3 relative z-10"
      >
        <div
          className={`px-3.5 py-1.5 rounded-2xl bg-[#18272f] border-2 text-xs font-black flex items-center gap-1.5 shadow-[0_2px_0_0_#131f24] ${cfg.xpBorderClass}`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{cfg.xpBonusLabel}</span>
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
          className={`transition-all font-black text-base tracking-wider active:translate-y-1.5 ${cfg.btnClass}`}
        >
          TIẾP TỤC BÀI HỌC
          <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      </motion.div>
    </motion.div>
  );
};
