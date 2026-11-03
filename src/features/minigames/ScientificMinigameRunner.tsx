import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Sparkles, HelpCircle } from 'lucide-react';
import { MinigameShell, MathText } from '@/design-system';
import { sound } from '@/lib/audio';
import { haptic } from '@/lib/haptic';
import { useUserStore } from '@/features/gamification/useUserStore';
import { MINIGAME_CATALOG, type MinigameConfig } from './minigameCatalog';

export interface ScientificMinigameRunnerProps {
  gameId: string;
  onExit: () => void;
}

export const ScientificMinigameRunner: React.FC<ScientificMinigameRunnerProps> = ({
  gameId,
  onExit,
}) => {
  const config: MinigameConfig = useMemo(() => {
    return (
      MINIGAME_CATALOG[gameId] || {
        id: gameId,
        title: 'Trò Chơi Khoa Học',
        subject: 'chem',
        grade: 8,
        desc: 'Thử thách kiến thức khoa học',
        badge: 'Khoa Học',
        colorKey: 'sky',
        timeSeconds: 50,
        questions: [],
      }
    );
  }, [gameId]);

  const { addXp } = useUserStore();

  const [timeLeft, setTimeLeft] = useState(config.timeSeconds);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Current question interaction state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  // Shuffle question pool on start
  const shuffledQuestions = useMemo(() => {
    return [...config.questions].sort(() => 0.5 - Math.random());
  }, [config.questions]);

  const currentQ = shuffledQuestions[currentIndex] || shuffledQuestions[0];

  const finishGame = useCallback(
    (finalScore: number) => {
      setIsGameOver(true);
      const calculatedXp = Math.min(25, Math.max(5, Math.round(finalScore / 10)));
      setEarnedXp(calculatedXp);
      addXp(calculatedXp);
      sound.playCompletion();
      haptic.completion();
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

  const handleSelectOption = (idx: number) => {
    if (isAnswerChecked || isGameOver) return;
    setSelectedOption(idx);
    setIsAnswerChecked(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      sound.playCorrect();
      haptic.correct();
      const newCombo = combo + 1;
      const points = 10 + newCombo * 5;
      setScore((prev) => prev + points);
      setCombo(newCombo);
    } else {
      sound.playWrong();
      haptic.wrong();
      setCombo(0);
    }

    // Auto advance after 1.4s delay so student can see feedback
    setTimeout(() => {
      if (currentIndex + 1 < shuffledQuestions.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswerChecked(false);
      } else {
        finishGame(score + (isCorrect ? 10 : 0));
      }
    }, 1400);
  };

  const handleRestart = () => {
    sound.playClick();
    setTimeLeft(config.timeSeconds);
    setScore(0);
    setCombo(0);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setIsGameOver(false);
    setEarnedXp(0);
  };

  if (!currentQ) {
    return null;
  }

  return (
    <MinigameShell
      title={config.title}
      description={config.desc}
      timeLeft={timeLeft}
      totalTime={config.timeSeconds}
      score={score}
      combo={combo}
      isGameOver={isGameOver}
      earnedXp={earnedXp}
      onExit={onExit}
      onRestart={handleRestart}
    >
      <div className="space-y-4 pt-2">
        {/* Progress & Badge */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[var(--text-secondary)]">
            Câu {currentIndex + 1} / {shuffledQuestions.length}
          </span>
          <span className="px-2.5 py-0.5 rounded-full font-black text-[11px] bg-[var(--subject-tint)] text-[var(--subject-fg)] border border-[var(--subject-edge)]">
            {config.badge}
          </span>
        </div>

        {/* Question Scenario Card */}
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm space-y-2"
        >
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-xl bg-[var(--bg-surface-2)] text-[var(--subject-fg)] shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)] leading-relaxed">
              <MathText text={currentQ.scenario} />
            </h2>
          </div>
        </motion.div>

        {/* Answer Options Grid */}
        <div className="space-y-2.5 pt-1">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let btnStyle =
              'bg-[var(--bg-surface)] border-[var(--border)] hover:border-[var(--subject-edge)] text-[var(--text-primary)]';

            if (isAnswerChecked) {
              if (isCorrect) {
                btnStyle =
                  'bg-[var(--ok-tint)] border-2 border-[var(--ok-fill)] text-[var(--ok-fg)] font-black shadow-sm';
              } else if (isSelected) {
                btnStyle =
                  'bg-[var(--err-tint)] border-2 border-[var(--err-fill)] text-[var(--err-fg)]';
              } else {
                btnStyle = 'opacity-40 border-[var(--border)] text-[var(--text-tertiary)]';
              }
            } else if (isSelected) {
              btnStyle =
                'bg-[var(--subject-tint)] border-2 border-[var(--subject-fill)] text-[var(--text-primary)]';
            }

            return (
              <motion.button
                key={`${currentQ.id}-${idx}`}
                disabled={isAnswerChecked}
                onClick={() => handleSelectOption(idx)}
                whileTap={!isAnswerChecked ? { scale: 0.98 } : undefined}
                className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border border-[var(--border)] bg-[var(--bg-surface-2)] text-[11px] text-[var(--text-secondary)] flex items-center justify-center font-black shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="leading-relaxed">
                    <MathText text={opt} />
                  </span>
                </div>

                {isAnswerChecked && isCorrect && (
                  <Check className="w-4 h-4 text-[var(--ok-fg)] stroke-[3] shrink-0 ml-2" />
                )}
                {isAnswerChecked && isSelected && !isCorrect && (
                  <X className="w-4 h-4 text-[var(--err-fg)] stroke-[3] shrink-0 ml-2" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Instant Pedagogical Explanation on Check */}
        <AnimatePresence>
          {isAnswerChecked && currentQ.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-xs text-[var(--text-secondary)] flex items-start gap-2 leading-relaxed"
            >
              <HelpCircle className="w-4 h-4 text-[var(--subject-fg)] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[var(--text-primary)]">Giải thích: </strong>
                <MathText text={currentQ.explanation} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MinigameShell>
  );
};

