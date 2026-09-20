import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert } from 'lucide-react';
import { MinigameShell, Formula } from '@/design-system';
import { sound } from '@/lib/audio';
import { useUserStore } from '@/features/gamification/useUserStore';
import substancesData from '@/content/kb/substances.json';

interface Substance {
  formula: string;
  nameVi: string;
  type: string;
}

type CategoryKey = 'acid' | 'base' | 'oxide' | 'salt';

interface CategoryConfig {
  key: CategoryKey;
  label: string;
  desc: string;
  color: string;
  borderColor: string;
  bgGradient: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    key: 'acid',
    label: 'Axit (Acid)',
    desc: 'Bắt đầu bằng H...',
    color: 'text-rose-400',
    borderColor: 'border-rose-500/40 hover:border-rose-400',
    bgGradient: 'from-rose-950/40 to-slate-900',
  },
  {
    key: 'base',
    label: 'Bazơ (Base)',
    desc: 'Kim loại + nhóm -OH',
    color: 'text-sky-400',
    borderColor: 'border-sky-500/40 hover:border-sky-400',
    bgGradient: 'from-sky-950/40 to-slate-900',
  },
  {
    key: 'oxide',
    label: 'Oxide',
    desc: 'Nguyên tố + Oxi',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    bgGradient: 'from-amber-950/40 to-slate-900',
  },
  {
    key: 'salt',
    label: 'Muối (Salt)',
    desc: 'Kim loại + gốc axit',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    bgGradient: 'from-emerald-950/40 to-slate-900',
  },
];

export const normalizeSubstanceCategory = (rawType: string): CategoryKey | null => {
  if (rawType === 'acid') return 'acid';
  if (rawType === 'base') return 'base';
  if (rawType.startsWith('oxide')) return 'oxide';
  if (rawType === 'salt') return 'salt';
  return null;
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

    setTimeout(() => {
      setLastFeedback(null);
      if (currentIndex + 1 >= roundSubstances.length) {
        finishGame(score + (isCorrect ? 15 + combo * 3 : 0));
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, isCorrect ? 400 : 1200);
  };

  return (
    <MinigameShell
      title="Phân loại hợp chất"
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
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Chất {currentIndex + 1} / {roundSubstances.length}</span>
          <span className="font-bold text-slate-300">Phân loại nhanh vào đúng bình</span>
        </div>

        {/* Current Substance Display Card */}
        <div className="min-h-[140px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem?.formula || 'empty'}
              initial={{ scale: 0.8, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 10 }}
              className={`w-full py-6 px-4 rounded-3xl bg-slate-900 border-2 flex flex-col items-center justify-center text-center shadow-2xl transition-colors ${
                lastFeedback
                  ? lastFeedback.correct
                    ? 'border-emerald-500 bg-emerald-950/40'
                    : 'border-rose-500 bg-rose-950/40'
                  : 'border-slate-700/80 bg-slate-900'
              }`}
            >
              <div className="text-3xl sm:text-4xl font-black text-slate-100 mb-1 tracking-wider">
                <Formula formula={currentItem?.formula || ''} />
              </div>
              <p className="text-xs text-slate-400 font-semibold">{currentItem?.nameVi}</p>

              {/* Instant feedback explanation if wrong */}
              {lastFeedback && !lastFeedback.correct && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs font-bold text-rose-300 flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Đáp án đúng: {CATEGORIES.find((c) => c.key === lastFeedback.expected)?.label}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 4 Category Bins Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {CATEGORIES.map((cat) => {
            const isTargetOfWrong =
              lastFeedback && !lastFeedback.correct && lastFeedback.expected === cat.key;
            const isChosenWrong =
              lastFeedback && !lastFeedback.correct && lastFeedback.chosen === cat.key;

            return (
              <motion.button
                key={cat.key}
                whileTap={{ scale: 0.96 }}
                disabled={!!lastFeedback}
                onClick={() => handleSelectCategory(cat.key)}
                className={`p-4 rounded-2xl border-2 bg-gradient-to-b ${cat.bgGradient} ${cat.borderColor} flex flex-col items-center justify-center text-center shadow-lg transition-all ${
                  isTargetOfWrong ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950' : ''
                } ${isChosenWrong ? 'opacity-50' : ''}`}
              >
                <span className={`text-base font-black ${cat.color}`}>{cat.label}</span>
                <span className="text-[11px] text-slate-400 mt-1 font-medium">{cat.desc}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </MinigameShell>
  );
};
