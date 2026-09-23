import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Info, Sparkles, HelpCircle } from 'lucide-react';
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
  const { addXp, addHearts } = useUserStore();
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
      addHearts(1);
      sound.playLevelUp();
    },
    [addXp, addHearts]
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

    setTimeout(
      () => {
        setLastFeedback(null);
        if (currentIndex + 1 >= roundStatements.length) {
          finishGame(score + (isCorrect ? 20 + combo * 4 : 0));
        } else {
          setCurrentIndex((i) => i + 1);
        }
      },
      isCorrect ? 900 : 1600
    );
  };

  return (
    <MinigameShell
      title="Đúng hay Sai — Kiểm định Hóa học"
      description="Đánh giá tính chính xác của các nhận định hóa học"
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
          <span className="font-bold text-slate-400">
            Câu <span className="text-cyan-400 font-black">{currentIndex + 1}</span> / {roundStatements.length}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-violet-950/80 border border-violet-700/60 text-violet-300 font-black text-[11px] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-violet-400" />
            {currentItem?.topic}
          </span>
        </div>

        {/* Statement Display Card */}
        <div className="min-h-[170px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem?.id || 'empty'}
              initial={{ scale: 0.9, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`w-full p-5 rounded-3xl border-2 flex flex-col justify-between transition-all min-h-[180px] ${
                lastFeedback
                  ? lastFeedback.correct
                    ? 'border-[#00cd9c] bg-gradient-to-b from-[#00cd9c]/20 to-[#122b24] shadow-[0_6px_0_0_#007a5d]'
                    : 'border-[#ff4b4b] bg-gradient-to-b from-[#ff4b4b]/20 to-[#2b1414] shadow-[0_6px_0_0_#b32525]'
                  : 'bg-gradient-to-b from-[#1c2c36] to-[#121c22] border-[#2e4756] shadow-[0_6px_0_0_#0c1419]'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-2 text-cyan-400">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    NHẬN ĐỊNH THÍ NGHIỆM
                  </span>
                </div>
                <p className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
                  {currentItem?.statement}
                </p>
              </div>

              {/* Feedback explanation drawer */}
              {lastFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-3 p-3 rounded-2xl border-2 text-xs leading-relaxed flex items-start gap-2 ${
                    lastFeedback.correct
                      ? 'bg-[#00cd9c]/15 border-[#00cd9c]/40 text-[#00cd9c]'
                      : 'bg-[#ff4b4b]/15 border-[#ff4b4b]/40 text-[#ff4b4b]'
                  }`}
                >
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black">
                      {lastFeedback.correct ? 'Chính xác! ' : 'Chưa đúng! '}
                    </span>
                    {lastFeedback.explanation}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Binary Answer Buttons: Chunky 3D Arcade Controls */}
        <div className="grid grid-cols-2 gap-3.5 pt-1">
          {/* Button ĐÚNG - Chunky 3D Emerald Arcade Button */}
          <motion.button
            whileTap={{ scale: 0.96, y: 4 }}
            disabled={!!lastFeedback}
            onClick={() => handleAnswer(true)}
            className="py-4 px-4 rounded-3xl border-2 border-[#00cd9c] bg-gradient-to-b from-[#00cd9c]/30 to-[#00cd9c]/10 text-[#00cd9c] flex flex-col items-center justify-center gap-2 shadow-[0_6px_0_0_#007a5d] active:shadow-none hover:from-[#00cd9c]/40 hover:to-[#00cd9c]/15 transition-all font-black text-lg disabled:opacity-40 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#00cd9c]/25 border border-[#00cd9c]/60 flex items-center justify-center shadow-[0_2px_8px_rgba(0,205,156,0.3)] group-hover:scale-110 transition-transform">
              <Check className="w-6 h-6 text-[#00cd9c] stroke-[3.5]" />
            </div>
            <span className="tracking-wide">ĐÚNG</span>
          </motion.button>

          {/* Button SAI - Chunky 3D Ruby Arcade Button */}
          <motion.button
            whileTap={{ scale: 0.96, y: 4 }}
            disabled={!!lastFeedback}
            onClick={() => handleAnswer(false)}
            className="py-4 px-4 rounded-3xl border-2 border-[#ff4b4b] bg-gradient-to-b from-[#ff4b4b]/30 to-[#ff4b4b]/10 text-[#ff4b4b] flex flex-col items-center justify-center gap-2 shadow-[0_6px_0_0_#b32525] active:shadow-none hover:from-[#ff4b4b]/40 hover:to-[#ff4b4b]/15 transition-all font-black text-lg disabled:opacity-40 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#ff4b4b]/25 border border-[#ff4b4b]/60 flex items-center justify-center shadow-[0_2px_8px_rgba(255,75,75,0.3)] group-hover:scale-110 transition-transform">
              <X className="w-6 h-6 text-[#ff4b4b] stroke-[3.5]" />
            </div>
            <span className="tracking-wide">SAI</span>
          </motion.button>
        </div>
      </div>
    </MinigameShell>
  );
};

