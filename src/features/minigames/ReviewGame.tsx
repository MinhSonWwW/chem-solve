import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { Check, X, Trophy, Layers } from 'lucide-react';
import { MinigameShell, Button } from '@/design-system';
import { sound } from '@/lib/audio';
import { useUserStore } from '@/features/gamification/useUserStore';
import {
  LeitnerCard,
  loadStoredLeitnerCards,
  saveStoredLeitnerCards,
  updateLeitnerCard,
  getDueReviewCards,
  createLeitnerCard,
} from '@/engine/review/leitner';
import trueFalseData from '@/content/kb/true-false-statements.json';

export const ReviewGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { addXp } = useUserStore();
  const [cards, setCards] = useState<LeitnerCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [selectedAns, setSelectedAns] = useState<boolean | null>(null);

  // Initialize review cards
  useEffect(() => {
    let stored = loadStoredLeitnerCards();
    if (stored.length === 0) {
      // Seed default sample review cards from statements for new users
      stored = trueFalseData.slice(0, 5).map((q, i) => createLeitnerCard(q.id, 'g8-b03', Date.now() - (i + 1) * 86400000));
      saveStoredLeitnerCards(stored);
    }
    setCards(stored);
  }, []);

  const dueCards = useMemo(() => {
    return getDueReviewCards(cards, Date.now(), 10);
  }, [cards]);

  // Questions for this review session
  const reviewQuestions = useMemo(() => {
    return dueCards.map((c) => {
      const match = trueFalseData.find((q) => q.id === c.exerciseId);
      return match || trueFalseData[0];
    });
  }, [dueCards]);

  const currentQ = reviewQuestions[currentIndex] || reviewQuestions[0];
  const currentCard = dueCards[currentIndex];

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

  const handleAnswer = (choice: boolean) => {
    if (selectedAns !== null || !currentQ || !currentCard) return;

    setSelectedAns(choice);
    const isCorrect = choice === currentQ.isTrue;

    // Update Leitner box
    const updatedCard = updateLeitnerCard(currentCard, isCorrect);
    const updatedCards = cards.map((c) => (c.exerciseId === updatedCard.exerciseId ? updatedCard : c));
    setCards(updatedCards);
    saveStoredLeitnerCards(updatedCards);

    if (isCorrect) {
      sound.playCorrect();
      setScore((s) => s + 20 + combo * 4);
      setCombo((c) => c + 1);
    } else {
      sound.playWrong();
      setCombo(0);
    }

    setTimeout(() => {
      setSelectedAns(null);
      if (currentIndex + 1 >= reviewQuestions.length) {
        finishGame(score + (isCorrect ? 20 + combo * 4 : 0));
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, 1200);
  };

  return (
    <MinigameShell
      title="Review Game (Ôn tập Leitner)"
      skillId="leitner-review"
      score={score}
      combo={combo}
      isGameOver={isGameOver}
      earnedXp={earnedXp}
      onExit={onExit}
      onRestart={() => {
        setScore(0);
        setCombo(0);
        setCurrentIndex(0);
        setSelectedAns(null);
        setIsGameOver(false);
      }}
    >
      <div className="space-y-4">
        {reviewQuestions.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-slate-900 border border-slate-800 rounded-3xl p-5">
            <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
            <h2 className="text-base font-black text-slate-100">
              Không có bài tập nào cần ôn hôm nay!
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Bạn đã hoàn thành tất cả các thẻ trong hàng đợi lặp lại ngắt quãng. Hãy tiếp tục học bài mới!
            </p>
            <Button variant="accent" onClick={onExit} className="mt-2">
              Quay lại kho game
            </Button>
          </div>
        ) : (
          <>
            {/* Box Level Header */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-400">
                Câu {currentIndex + 1} / {reviewQuestions.length}
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-violet-950/70 border border-violet-700/60 text-violet-300 font-bold text-xs">
                <Layers className="w-3.5 h-3.5" />
                Hộp Leitner: {currentCard?.box || 1}/5
              </div>
            </div>

            {/* Question Card */}
            <div className="p-5 rounded-3xl bg-slate-900 border-2 border-slate-800 shadow-xl min-h-[160px] flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  {currentQ.topic}
                </span>
                <p className="text-base font-bold text-slate-100 leading-snug">
                  {currentQ.statement}
                </p>
              </div>

              {selectedAns !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-3 p-3 rounded-2xl text-xs font-semibold ${
                    selectedAns === currentQ.isTrue
                      ? 'bg-emerald-950/70 border border-emerald-700 text-emerald-200'
                      : 'bg-rose-950/70 border border-rose-700 text-rose-200'
                  }`}
                >
                  <span className="font-bold">
                    {selectedAns === currentQ.isTrue
                      ? '✓ Chính xác! Thăng lên hộp kế tiếp. '
                      : '✗ Chưa đúng! Thẻ quay về Hộp 1. '}
                  </span>
                  {currentQ.explanation}
                </motion.div>
              )}
            </div>

            {/* Answer Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <motion.button
                whileTap={{ scale: 0.96 }}
                disabled={selectedAns !== null}
                onClick={() => handleAnswer(true)}
                className="py-4 rounded-2xl border-2 border-emerald-500/50 bg-emerald-950/30 text-emerald-400 font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-950/50 transition disabled:opacity-40"
              >
                <Check className="w-5 h-5" /> ĐÚNG
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                disabled={selectedAns !== null}
                onClick={() => handleAnswer(false)}
                className="py-4 rounded-2xl border-2 border-rose-500/50 bg-rose-950/30 text-rose-400 font-bold flex items-center justify-center gap-1.5 hover:bg-rose-950/50 transition disabled:opacity-40"
              >
                <X className="w-5 h-5" /> SAI
              </motion.button>
            </div>
          </>
        )}
      </div>
    </MinigameShell>
  );
};
