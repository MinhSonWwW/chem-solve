import React, { useState, useEffect, useCallback } from 'react';
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

interface SessionItem {
  card: LeitnerCard;
  question: (typeof trueFalseData)[0];
}

export const ReviewGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { addXp, addHearts } = useUserStore();
  const [sessionQueue, setSessionQueue] = useState<SessionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [selectedAns, setSelectedAns] = useState<boolean | null>(null);

  // Initialize review session with a stable queue
  const initSession = useCallback(() => {
    let stored = loadStoredLeitnerCards();
    if (stored.length === 0) {
      // Seed default sample review cards from statements for new users
      stored = trueFalseData.slice(0, 10).map((q, i) =>
        createLeitnerCard(q.id, 'g8-b03', Date.now() - (i + 1) * 86400000)
      );
      saveStoredLeitnerCards(stored);
    }

    let due = getDueReviewCards(stored, Date.now(), 10);
    // If no cards are due (e.g. reviewed recently), practice with the oldest reviewed cards
    if (due.length === 0 && stored.length > 0) {
      due = [...stored].sort((a, b) => a.lastReviewed - b.lastReviewed).slice(0, 5);
    }

    const queue: SessionItem[] = due.map((c) => {
      const match = trueFalseData.find((q) => q.id === c.exerciseId);
      return {
        card: c,
        question: match || trueFalseData[0],
      };
    });

    setSessionQueue(queue);
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setSelectedAns(null);
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    initSession();
  }, [initSession]);

  const currentItem = sessionQueue[currentIndex];
  const currentQ = currentItem?.question;
  const currentCard = currentItem?.card;

  const finishGame = useCallback(
    (finalScore: number) => {
      setIsGameOver(true);
      const xp = Math.min(25, Math.max(5, Math.round(finalScore / 10)));
      setEarnedXp(xp);
      addXp(xp);
      addHearts(1);
      sound.playLevelUp();
    },
    [addXp, addHearts]
  );

  const handleAnswer = (choice: boolean) => {
    if (selectedAns !== null || !currentItem || !currentQ || !currentCard) return;

    setSelectedAns(choice);
    const isCorrect = choice === currentQ.isTrue;

    // Update persistent Leitner card storage
    const updatedCard = updateLeitnerCard(currentCard, isCorrect);
    const stored = loadStoredLeitnerCards();
    const updatedCards = stored.map((c) =>
      c.exerciseId === updatedCard.exerciseId ? updatedCard : c
    );
    saveStoredLeitnerCards(updatedCards);

    // Keep the current item's card metadata up-to-date in session queue
    setSessionQueue((prev) =>
      prev.map((item, idx) => (idx === currentIndex ? { ...item, card: updatedCard } : item))
    );

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
      if (currentIndex + 1 >= sessionQueue.length) {
        finishGame(score + (isCorrect ? 20 + combo * 4 : 0));
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, 1300);
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
      onRestart={initSession}
    >
      <div className="space-y-4">
        {sessionQueue.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-slate-900 border border-slate-800 rounded-3xl p-5">
            <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
            <h2 className="text-base font-black text-slate-100">
              Không có bài tập nào cần ôn hôm nay!
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Bạn đã hoàn thành tất cả các thẻ trong hàng đợi lặp lại ngắt quãng. Hãy tiếp tục học bài mới!
            </p>
            <Button variant="accent" onClick={onExit} className="mt-2">
              Quay lại luyện tập
            </Button>
          </div>
        ) : (
          <>
            {/* Box Level Header */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-400 font-semibold">
                Câu {currentIndex + 1} / {sessionQueue.length}
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-violet-950/70 border border-violet-700/60 text-violet-300 font-bold text-xs">
                <Layers className="w-3.5 h-3.5" />
                Hộp Leitner: {currentCard?.box || 1}/5
              </div>
            </div>

            {/* Question Card */}
            {currentQ && (
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
                    <div className="font-bold mb-0.5">
                      {selectedAns === currentQ.isTrue
                        ? '✓ Chính xác! Thẻ được thăng lên hộp kế tiếp.'
                        : '✗ Chưa chính xác! Thẻ quay về Hộp 1 để ôn lại.'}
                    </div>
                    <div className="text-slate-300 font-normal">
                      💡 {currentQ.explanation}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Answer Buttons */}
            {currentQ && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  disabled={selectedAns !== null}
                  onClick={() => handleAnswer(true)}
                  className={`py-4 rounded-2xl border-2 font-bold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:cursor-not-allowed ${
                    selectedAns === true
                      ? currentQ.isTrue
                        ? 'border-emerald-400 bg-emerald-500/25 text-emerald-300 ring-2 ring-emerald-400/60 shadow-lg shadow-emerald-500/20'
                        : 'border-rose-400 bg-rose-500/25 text-rose-300 ring-2 ring-rose-400/60 shadow-lg shadow-rose-500/20'
                      : 'border-emerald-500/50 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-950/50'
                  } ${selectedAns !== null && selectedAns !== true ? 'opacity-40' : ''}`}
                >
                  <Check className="w-5 h-5" /> ĐÚNG
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  disabled={selectedAns !== null}
                  onClick={() => handleAnswer(false)}
                  className={`py-4 rounded-2xl border-2 font-bold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:cursor-not-allowed ${
                    selectedAns === false
                      ? !currentQ.isTrue
                        ? 'border-emerald-400 bg-emerald-500/25 text-emerald-300 ring-2 ring-emerald-400/60 shadow-lg shadow-emerald-500/20'
                        : 'border-rose-400 bg-rose-500/25 text-rose-300 ring-2 ring-rose-400/60 shadow-lg shadow-rose-500/20'
                      : 'border-rose-500/50 bg-rose-950/30 text-rose-400 hover:bg-rose-950/50'
                  } ${selectedAns !== null && selectedAns !== false ? 'opacity-40' : ''}`}
                >
                  <X className="w-5 h-5" /> SAI
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>
    </MinigameShell>
  );
};
