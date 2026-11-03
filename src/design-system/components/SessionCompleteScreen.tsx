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
    badgeText: string;
    xpBonusLabel: string;
    accuracyIcon: React.ReactNode;
    perfectCopy: string;
    successCopy: (correct: number, total: number) => string;
  }
> = {
  bio: {
    name: 'Sinh học',
    badgeText: 'Chinh phục thế giới sống thành công',
    xpBonusLabel: '+20 XP Sinh học hoàn thành',
    accuracyIcon: <SubjectTrophy subject="bio" size={18} animate={false} />,
    perfectCopy: 'Tuyệt đỉnh! Mắt xích sinh thái và kiến thức cơ thể chuẩn xác 100%!',
    successCopy: (c, t) => `Bạn đã trả lời đúng ${c}/${t} câu, mầm tri thức sinh học đang nở rộ!`,
  },
  physics: {
    name: 'Vật lý',
    badgeText: 'Làm chủ quy luật vật lý thành công',
    xpBonusLabel: '+20 XP Vật lý hoàn thành',
    accuracyIcon: <SubjectTrophy subject="physics" size={18} animate={false} />,
    perfectCopy: 'Tuyệt đỉnh! Năng lượng, lực và các định luật nghiệm đúng 100%!',
    successCopy: (c, t) => `Bạn đã trả lời đúng ${c}/${t} câu, năng lượng bứt phá rất ấn tượng!`,
  },
  chem: {
    name: 'Hóa học',
    badgeText: 'Chinh phục phản ứng thành công',
    xpBonusLabel: '+20 XP Hóa học hoàn thành',
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
      highlight: 'text-[var(--gold-fg)]',
    },
    {
      icon: <CurrencyIcon type="gem" size="sm" />,
      label: 'Đá quý thưởng',
      value: `+${earnedGems ?? 0}`,
      highlight: 'text-[var(--gem-fg)]',
    },
    {
      icon: cfg.accuracyIcon,
      label: 'Độ chính xác',
      value: `${accuracyPercent}%`,
      highlight: 'text-[var(--ok-fg)]',
    },
    {
      icon: <CurrencyIcon type="streak" size="sm" />,
      label: 'Chuỗi ngày',
      value: `${streak} ngày`,
      highlight: 'text-[var(--warn-fg)]',
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
        <div className="relative">
          <Mascot state="celebrating" size="xl" />
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
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-[11px] font-black tracking-wider uppercase mb-1 bg-[var(--subject-tint)] border-[var(--subject-edge)] text-[var(--subject-fg)]"
        >
          <Award className="w-3.5 h-3.5" />
          <span>{isPractice ? 'Luyện tập xuất sắc' : cfg.badgeText}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
          {isPractice ? 'Hoàn thành phiên luyện tập!' : 'Xuất sắc vượt qua chặng!'}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium max-w-md mx-auto">
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
          className="px-3.5 py-1.5 rounded-2xl bg-[var(--gold-tint)] border border-[var(--gold-edge)] text-[var(--gold-fg)] text-xs font-black flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>{cfg.xpBonusLabel}</span>
        </div>

        {earnedGems !== undefined && earnedGems > 0 && (
          <div className="px-3.5 py-1.5 rounded-2xl bg-[var(--gem-tint)] border border-[var(--gem-edge)] text-[var(--gem-fg)] text-xs font-black flex items-center gap-1.5">
            <CurrencyIcon type="gem" size="xs" />
            <span>+{earnedGems} Đá quý</span>
          </div>
        )}

        {isPractice && (recoveredHearts ?? 0) > 0 && (
          <div className="px-3.5 py-1.5 rounded-2xl bg-[var(--err-tint)] border border-[var(--err-edge)] text-[var(--err-fg)] text-xs font-black flex items-center gap-1.5">
            <CurrencyIcon type="heart" size="xs" animate />
            <span>+{recoveredHearts} Tim hồi sinh</span>
          </div>
        )}

        {perfectRun && !isPractice && (
          <div className="px-3.5 py-1.5 rounded-2xl bg-[var(--gold-tint)] border border-[var(--gold-edge)] text-[var(--gold-fg)] text-xs font-black flex items-center gap-1.5">
            <CurrencyIcon type="heart" size="xs" />
            <span>+{GAMIFICATION.session.perfectBonus} XP hoàn hảo</span>
          </div>
        )}
      </motion.div>

      {/* 4 Stat Cards */}
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
            className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-1 text-left transition-all"
          >
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] font-bold">
              {stat.icon}
              <span>{stat.label}</span>
            </div>
            <div className={`text-xl font-black ${stat.highlight}`}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.95 }}
        className="mt-7 w-full max-w-sm relative z-10"
      >
        <Button
          variant="ok"
          size="lg"
          fullWidth
          onClick={() => {
            sound.playClick();
            onContinue();
          }}
          className="transition-all font-black text-base tracking-wider"
        >
          TIẾP TỤC BÀI HỌC
          <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      </motion.div>
    </motion.div>
  );
};
