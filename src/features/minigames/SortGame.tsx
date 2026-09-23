import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Sparkles } from 'lucide-react';
import { MinigameShell, Formula } from '@/design-system';
import { sound } from '@/lib/audio';
import { useUserStore } from '@/features/gamification/useUserStore';
import substancesData from '@/content/kb/substances.json';

interface Substance {
  formula: string;
  nameVi: string;
  type: string;
}

export type CategoryKey = 'acid' | 'base' | 'oxide' | 'salt';

interface CategoryConfig {
  key: CategoryKey;
  label: string;
  subtitle: string;
  desc: string;
  theme: {
    text: string;
    border: string;
    borderActive: string;
    bg: string;
    glow: string;
    liquid: string;
    accent: string;
    shadow: string;
  };
}

const CATEGORIES: CategoryConfig[] = [
  {
    key: 'acid',
    label: 'Acid',
    subtitle: 'Axit',
    desc: 'Bắt đầu bằng H...',
    theme: {
      text: 'text-rose-400',
      border: 'border-rose-500/40 hover:border-rose-400',
      borderActive: 'border-rose-400 ring-4 ring-rose-500/30',
      bg: 'from-rose-950/50 via-[#1a1318] to-[#12181f]',
      glow: 'rgba(244,63,94,0.35)',
      liquid: '#f43f5e',
      accent: '#fb7185',
      shadow: '#4c0519',
    },
  },
  {
    key: 'base',
    label: 'Base',
    subtitle: 'Bazơ',
    desc: 'Kim loại + nhóm -OH',
    theme: {
      text: 'text-sky-400',
      border: 'border-sky-500/40 hover:border-sky-400',
      borderActive: 'border-sky-400 ring-4 ring-sky-500/30',
      bg: 'from-sky-950/50 via-[#121c27] to-[#12181f]',
      glow: 'rgba(14,165,233,0.35)',
      liquid: '#0ea5e9',
      accent: '#38bdf8',
      shadow: '#082f49',
    },
  },
  {
    key: 'oxide',
    label: 'Oxide',
    subtitle: 'Oxide kim/phi kim',
    desc: 'Nguyên tố + Oxi',
    theme: {
      text: 'text-amber-400',
      border: 'border-amber-500/40 hover:border-amber-400',
      borderActive: 'border-amber-400 ring-4 ring-amber-500/30',
      bg: 'from-amber-950/50 via-[#211a14] to-[#12181f]',
      glow: 'rgba(245,158,11,0.35)',
      liquid: '#f59e0b',
      accent: '#fbbf24',
      shadow: '#451a03',
    },
  },
  {
    key: 'salt',
    label: 'Muối',
    subtitle: 'Salt',
    desc: 'Kim loại + gốc acid',
    theme: {
      text: 'text-emerald-400',
      border: 'border-emerald-500/40 hover:border-emerald-400',
      borderActive: 'border-emerald-400 ring-4 ring-emerald-500/30',
      bg: 'from-emerald-950/50 via-[#11231f] to-[#12181f]',
      glow: 'rgba(16,185,129,0.35)',
      liquid: '#10b981',
      accent: '#34d399',
      shadow: '#022c22',
    },
  },
];

export const normalizeSubstanceCategory = (rawType: string): CategoryKey | null => {
  if (rawType === 'acid') return 'acid';
  if (rawType === 'base') return 'base';
  if (rawType.startsWith('oxide')) return 'oxide';
  if (rawType === 'salt') return 'salt';
  return null;
};

// Handcrafted SVG Erlenmeyer Flask with liquid level and bubbling VFX
const FlaskGraphic: React.FC<{
  liquidColor: string;
  accentColor: string;
  isCorrect?: boolean;
}> = ({ liquidColor, accentColor, isCorrect }) => {
  return (
    <div className="relative w-14 h-16 sm:w-16 sm:h-20 flex items-center justify-center shrink-0">
      <svg
        viewBox="0 0 64 72"
        className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`liquidGrad-${liquidColor}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.85" />
            <stop offset="100%" stopColor={liquidColor} stopOpacity="0.95" />
          </linearGradient>
          <filter id={`glow-${liquidColor}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Liquid body */}
        <motion.path
          d="M 17 42 Q 32 39 47 42 L 53 58 C 55 63 51 67 46 67 L 18 67 C 13 67 9 63 11 58 Z"
          fill={`url(#liquidGrad-${liquidColor})`}
          animate={
            isCorrect
              ? {
                  d: [
                    'M 17 42 Q 32 39 47 42 L 53 58 C 55 63 51 67 46 67 L 18 67 C 13 67 9 63 11 58 Z',
                    'M 17 38 Q 32 35 47 38 L 53 58 C 55 63 51 67 46 67 L 18 67 C 13 67 9 63 11 58 Z',
                    'M 17 42 Q 32 39 47 42 L 53 58 C 55 63 51 67 46 67 L 18 67 C 13 67 9 63 11 58 Z',
                  ],
                }
              : {}
          }
          transition={{ duration: 0.6, repeat: isCorrect ? 2 : 0 }}
        />

        {/* Liquid meniscus curve highlight */}
        <path
          d="M 17 42 Q 32 40 47 42"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Glass flask outer container */}
        {/* Rim */}
        <rect
          x="24"
          y="6"
          width="16"
          height="4"
          rx="2"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2"
          fill="rgba(255,255,255,0.15)"
        />
        {/* Neck and body */}
        <path
          d="M 26 10 L 26 26 L 11 58 C 9 63 13 68 18 68 L 46 68 C 51 68 55 63 53 58 L 38 26 L 38 10"
          stroke="rgba(255,255,255,0.65)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Glass reflection streak */}
        <path
          d="M 28 14 L 28 24 L 20 42 L 15 54"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Measuring ticks */}
        <line x1="33" y1="48" x2="38" y2="48" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <line x1="32" y1="54" x2="38" y2="54" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <line x1="34" y1="60" x2="38" y2="60" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

        {/* Floating chemical reaction bubbles */}
        <motion.circle
          cx="28"
          cy="52"
          r="2"
          fill="white"
          opacity="0.6"
          animate={{ cy: [56, 42], opacity: [0.2, 0.8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.circle
          cx="38"
          cy="58"
          r="1.5"
          fill="white"
          opacity="0.5"
          animate={{ cy: [60, 44], opacity: [0.2, 0.7, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: 0.6, ease: 'easeOut' }}
        />
        <motion.circle
          cx="32"
          cy="50"
          r="2.5"
          fill={accentColor}
          opacity="0.7"
          animate={{ cy: [55, 43], opacity: [0.3, 0.9, 0] }}
          transition={{ duration: 2.1, repeat: Infinity, delay: 1, ease: 'easeOut' }}
        />
      </svg>
    </div>
  );
};

export const SortGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { addXp } = useUserStore();
  const [timeLeft, setTimeLeft] = useState(50);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<{
    correct: boolean;
    chosen: CategoryKey;
    expected: CategoryKey;
  } | null>(null);

  // Pool of substances filtered to the 4 categories
  const roundSubstances = useMemo(() => {
    const valid = (substancesData as Substance[]).filter((s) =>
      Boolean(normalizeSubstanceCategory(s.type))
    );
    return [...valid].sort(() => 0.5 - Math.random()).slice(0, 15);
  }, []);

  const currentItem = roundSubstances[currentIndex] || roundSubstances[0];
  const expectedCategory = normalizeSubstanceCategory(currentItem?.type || '') as CategoryKey;

  const finishGame = useCallback(
    (finalScore: number) => {
      setIsGameOver(true);
      const xp = Math.min(25, Math.max(5, Math.round(finalScore / 10)));
      setEarnedXp(xp);
      addXp(xp);
      sound.playCorrect();
    },
    [addXp]
  );

  // Timer countdown
  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver, score, finishGame]);

  const handleSelectCategory = (catKey: CategoryKey) => {
    if (lastFeedback || !currentItem) return;

    const isCorrect = catKey === expectedCategory;

    if (isCorrect) {
      sound.playCorrect();
      const newScore = score + 15 + combo * 3;
      setScore(newScore);
      setCombo((c) => c + 1);
      setLastFeedback({ correct: true, chosen: catKey, expected: expectedCategory });
    } else {
      sound.playWrong();
      setCombo(0);
      setLastFeedback({ correct: false, chosen: catKey, expected: expectedCategory });
    }

    setTimeout(
      () => {
        setLastFeedback(null);
        if (currentIndex + 1 >= roundSubstances.length) {
          finishGame(score + (isCorrect ? 15 + combo * 3 : 0));
        } else {
          setCurrentIndex((i) => i + 1);
        }
      },
      isCorrect ? 450 : 1200
    );
  };

  return (
    <MinigameShell
      title="Phân loại hợp chất vô cơ"
      description="Chuyển hóa chất vào đúng bình thí nghiệm"
      skillId="compound-sort"
      timeLeft={timeLeft}
      score={score}
      combo={combo}
      isGameOver={isGameOver}
      earnedXp={earnedXp}
      onExit={onExit}
      onRestart={() => {
        setTimeLeft(50);
        setScore(0);
        setCombo(0);
        setCurrentIndex(0);
        setLastFeedback(null);
        setIsGameOver(false);
      }}
    >
      <div className="space-y-4">
        {/* Progress header */}
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-slate-400">
            Chất <span className="text-cyan-400 font-black">{currentIndex + 1}</span> / {roundSubstances.length}
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Nhấn chọn bình tương ứng
          </span>
        </div>

        {/* Current Substance Display Card - Tactile 3D Chemical Sample Slide */}
        <div className="min-h-[145px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem?.formula || 'empty'}
              initial={{ scale: 0.85, opacity: 0, y: -12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`w-full py-5 px-6 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all ${
                lastFeedback
                  ? lastFeedback.correct
                    ? 'border-[#00cd9c] bg-gradient-to-b from-[#00cd9c]/20 to-[#122b24] shadow-[0_6px_0_0_#007a5d]'
                    : 'border-[#ff4b4b] bg-gradient-to-b from-[#ff4b4b]/20 to-[#2b1414] shadow-[0_6px_0_0_#b32525]'
                  : 'bg-gradient-to-b from-[#1c2c36] to-[#121c22] border-[#2e4756] shadow-[0_6px_0_0_#0c1419]'
              }`}
            >
              <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-1">
                MẪU THỬ HÓA CHẤT
              </div>

              <div className="text-3xl sm:text-4xl font-black text-slate-100 mb-1 tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                <Formula formula={currentItem?.formula || ''} />
              </div>

              <p className="text-sm text-slate-300 font-semibold">{currentItem?.nameVi}</p>

              {/* Instant feedback explanation if wrong */}
              {lastFeedback && !lastFeedback.correct && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2.5 px-3 py-1 rounded-xl bg-rose-950/80 border border-rose-500/60 text-xs font-bold text-rose-300 flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Chính xác là:{' '}
                    <strong className="underline text-white">
                      {CATEGORIES.find((c) => c.key === lastFeedback.expected)?.label}
                    </strong>
                  </span>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 4 Laboratory Erlenmeyer Flask Bins Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {CATEGORIES.map((cat) => {
            const isTargetOfWrong = Boolean(
              lastFeedback && !lastFeedback.correct && lastFeedback.expected === cat.key
            );
            const isChosenWrong = Boolean(
              lastFeedback && !lastFeedback.correct && lastFeedback.chosen === cat.key
            );
            const isChosenCorrect = Boolean(
              lastFeedback && lastFeedback.correct && lastFeedback.chosen === cat.key
            );

            return (
              <motion.button
                key={cat.key}
                whileTap={{ scale: 0.95, y: 3 }}
                whileHover={{ y: -2 }}
                disabled={!!lastFeedback}
                onClick={() => handleSelectCategory(cat.key)}
                className={`p-3.5 sm:p-4 rounded-3xl border-2 bg-gradient-to-b ${cat.theme.bg} ${
                  isChosenCorrect
                    ? 'border-emerald-400 ring-4 ring-emerald-500/40 shadow-[0_6px_20px_rgba(16,185,129,0.5)]'
                    : isTargetOfWrong
                    ? 'border-emerald-400 ring-2 ring-emerald-400 animate-pulse'
                    : isChosenWrong
                    ? 'border-rose-500 opacity-50'
                    : cat.theme.border
                } flex items-center gap-3 text-left shadow-[0_5px_0_0_${cat.theme.shadow}] transition-all cursor-pointer group`}
                style={{
                  boxShadow: isChosenCorrect
                    ? `0 6px 0 0 #007a5d, 0 0 25px ${cat.theme.glow}`
                    : `0 5px 0 0 ${cat.theme.shadow}`,
                }}
              >
                {/* 3D Erlenmeyer Flask Icon with liquid & bubbling reaction */}
                <FlaskGraphic
                  liquidColor={cat.theme.liquid}
                  accentColor={cat.theme.accent}
                  isCorrect={isChosenCorrect}
                />

                {/* Flask Nomenclature Labels */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-base sm:text-lg font-black tracking-wide ${cat.theme.text}`}>
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold truncate">
                      ({cat.subtitle})
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium block mt-0.5 leading-snug line-clamp-1">
                    {cat.desc}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </MinigameShell>
  );
};

