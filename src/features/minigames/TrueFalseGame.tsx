import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Info, BookOpen } from 'lucide-react';
import { MinigameShell } from '@/design-system';
import { sound } from '@/lib/audio';
import { useUserStore } from '@/features/gamification/useUserStore';
import statementsData from '@/content/kb/true-false-statements.json';

interface Statement {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
  topic: string;
}

export const TrueFalseGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { addXp } = useUserStore();
  const [timeLeft, setTimeLeft] = useState(50);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<{
    correct: boolean;
    userChoice: boolean;
    explanation: string;
  } | null>(null);

  // Shuffle statements for this round
  const roundStatements = useMemo(() => {
    return [...(statementsData as Statement[])].sort(() => 0.5 - Math.random()).slice(0, 10);
  }, []);

  const currentItem = roundStatements[currentIndex] || roundStatements[0];

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

  const handleAnswer = (choice: boolean) => {
    if (lastFeedback || !currentItem) return;

    const isCorrect = choice === currentItem.isTrue;

    if (isCorrect) {
      sound.playCorrect();
      const newScore = score + 20 + combo * 4;
      setScore(newScore);
      setCombo((c) => c + 1);
      setLastFeedback({
        correct: true,
        userChoice: choice,
        explanation: currentItem.explanation,
      });
    } else {
      sound.playWrong();
      setCombo(0);
      setLastFeedback({
        correct: false,
        userChoice: choice,
        explanation: currentItem.explanation,
      });
    }

    setTimeout(() => {
      setLastFeedback(null);
      if (currentIndex + 1 >= roundStatements.length) {
        finishGame(score + (isCorrect ? 20 + combo * 4 : 0));
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, isCorrect ? 900 : 1600);
  };

  return (
    <MinigameShell
      title="Đúng hay Sai"
      skillId="true-false"
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
        {/* Progress & topic header */}
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-slate-400">
            Câu {currentIndex + 1} / {roundStatements.length}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-violet-950/70 border border-violet-700/60 text-violet-300 font-bold text-[11px]">
            {currentItem?.topic}
          </span>
        </div>

        {/* Statement Display Card */}
        <div className="min-h-[160px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem?.id || 'empty'}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full p-5 rounded-3xl bg-slate-900 border-2 flex flex-col justify-between shadow-2xl transition-colors min-h-[170px] ${
                lastFeedback
                  ? lastFeedback.correct
                    ? 'border-emerald-500 bg-emerald-950/30'
                    : 'border-rose-500 bg-rose-950/30'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <BookOpen className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
                  {currentItem?.statement}
                </p>
              </div>

              {/* Feedback explanation drawer */}
              {lastFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-3 p-3 rounded-2xl border text-xs leading-relaxed flex items-start gap-2 ${
                    lastFeedback.correct
                      ? 'bg-emerald-950/70 border-emerald-700 text-emerald-200'
                      : 'bg-rose-950/70 border-rose-700 text-rose-200'
                  }`}
                >
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">
                      {lastFeedback.correct ? 'Chính xác! ' : 'Chưa đúng! '}
                    </span>
                    {lastFeedback.explanation}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Binary Answer Buttons: ĐÚNG / SAI */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Button ĐÚNG */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            disabled={!!lastFeedback}
            onClick={() => handleAnswer(true)}
            className="py-5 px-4 rounded-2xl border-2 border-emerald-500/60 bg-gradient-to-b from-emerald-900/40 to-slate-900 text-emerald-400 flex flex-col items-center justify-center gap-1.5 shadow-xl hover:border-emerald-400 transition-all font-black text-lg disabled:opacity-40"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-300 stroke-[3]" />
            </div>
            ĐÚNG
          </motion.button>

          {/* Button SAI */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            disabled={!!lastFeedback}
            onClick={() => handleAnswer(false)}
            className="py-5 px-4 rounded-2xl border-2 border-rose-500/60 bg-gradient-to-b from-rose-950/40 to-slate-900 text-rose-400 flex flex-col items-center justify-center gap-1.5 shadow-xl hover:border-rose-400 transition-all font-black text-lg disabled:opacity-40"
          >
            <div className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
              <X className="w-5 h-5 text-rose-300 stroke-[3]" />
            </div>
            SAI
          </motion.button>
        </div>
      </div>
    </MinigameShell>
  );
};
