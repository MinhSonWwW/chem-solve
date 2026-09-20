import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, Flame } from 'lucide-react';
import { MinigameShell, Formula } from '@/design-system';
import { sound } from '@/lib/audio';
import { useUserStore } from '@/features/gamification/useUserStore';
import reactionsData from '@/content/kb/reactions.json';

interface SubstanceItem {
  formula: string;
  coef: number;
}

interface Reaction {
  id: string;
  equation: string;
  reactants: SubstanceItem[];
  products: SubstanceItem[];
  condition?: string;
  phenomenon?: string;
  grade?: number;
}

export const ReactionBuilderGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { addXp } = useUserStore();
  const [timeLeft, setTimeLeft] = useState(65);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isCorrectSolved, setIsCorrectSolved] = useState(false);

  // Pool of reactions
  const roundReactions = useMemo(() => {
    return [...(reactionsData as Reaction[])].sort(() => 0.5 - Math.random()).slice(0, 8);
  }, []);

  const currentRx = roundReactions[currentIndex] || roundReactions[0];

  // Options: 1 correct products string, 3 distractor products strings
  const options = useMemo(() => {
    if (!currentRx) return [];
    const correctStr = currentRx.products.map((p) => p.formula).sort().join(' + ');

    // Pick distractors from other reactions
    const otherProducts = roundReactions
      .filter((r) => r.id !== currentRx.id)
      .map((r) => r.products.map((p) => p.formula).sort().join(' + '));

    const uniqueDistractors = Array.from(new Set(otherProducts))
      .filter((p) => p !== correctStr)
      .slice(0, 3);

    const all = [correctStr, ...uniqueDistractors];
    return all.sort(() => 0.5 - Math.random());
  }, [currentRx, roundReactions]);

  const finishGame = useCallback(
    (finalScore: number) => {
      setIsGameOver(true);
      const xp = Math.min(25, Math.max(5, Math.round(finalScore / 10)));
      setEarnedXp(xp);
      addXp(xp);
      sound.playLevelUp();
    },
    [addXp]
  );

  // Timer
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

  const handleSelectOption = (option: string) => {
    if (isCorrectSolved) return;
    setSelectedProduct(option);
    sound.playClick();

    const correctStr = currentRx.products.map((p) => p.formula).sort().join(' + ');
    if (option === correctStr) {
      sound.playCorrect();
      if (currentRx.phenomenon?.includes('khí')) {
        setTimeout(() => sound.playGasHiss(), 120);
      } else {
        setTimeout(() => sound.playBubbling(), 120);
      }

      setIsCorrectSolved(true);
      const newScore = score + 25 + combo * 5;
      setScore(newScore);
      setCombo((c) => c + 1);

      setTimeout(() => {
        setIsCorrectSolved(false);
        setSelectedProduct(null);
        if (currentIndex + 1 >= roundReactions.length) {
          finishGame(newScore);
        } else {
          setCurrentIndex((i) => i + 1);
        }
      }, 1500);
    } else {
      sound.playWrong();
      setCombo(0);
      setTimeout(() => setSelectedProduct(null), 400);
    }
  };

  const handleRestart = () => {
    setTimeLeft(65);
    setScore(0);
    setCombo(0);
    setEarnedXp(0);
    setCurrentIndex(0);
    setSelectedProduct(null);
    setIsCorrectSolved(false);
    setIsGameOver(false);
  };

  return (
    <MinigameShell
      title="Ráp phản ứng (Reaction Builder)"
      skillId="reaction-builder"
      timeLeft={timeLeft}
      score={score}
      combo={combo}
      isGameOver={isGameOver}
      earnedXp={earnedXp}
      onExit={onExit}
      onRestart={handleRestart}
    >
      <div className="space-y-4">
        {/* Mission header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-bold">
            Câu {currentIndex + 1}/{roundReactions.length}
          </span>
          {currentRx?.condition && (
            <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-800/40">
              <Flame className="w-3 h-3" /> {currentRx.condition}
            </span>
          )}
        </div>

        {/* Reaction Builder Bench */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 text-center space-y-3">
          <div className="text-xs font-bold text-slate-400">
            Dự đoán sản phẩm tạo thành:
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap text-base font-black text-slate-100 py-2">
            {/* Reactants */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-2 rounded-2xl border border-slate-700/80">
              {currentRx?.reactants.map((r, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="text-slate-500 font-bold">+</span>}
                  <Formula code={r.formula} className="text-cyan-300" />
                </React.Fragment>
              ))}
            </div>

            <ArrowRight className="w-5 h-5 text-amber-400 shrink-0" />

            {/* Products Drop Target */}
            <div
              className={`min-w-[120px] px-3.5 py-2 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all ${
                isCorrectSolved
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'border-slate-700 bg-slate-950/40 text-slate-500'
              }`}
            >
              {selectedProduct ? (
                <div className="flex items-center gap-1.5 text-slate-200">
                  {selectedProduct.split(' + ').map((f, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span className="text-slate-500">+</span>}
                      <Formula code={f} className={isCorrectSolved ? 'text-emerald-300' : 'text-slate-200'} />
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <span className="text-xs font-bold italic">? + ?</span>
              )}
            </div>
          </div>

          {/* Phenomenon note on solve */}
          {isCorrectSolved && currentRx?.phenomenon && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-emerald-400 font-semibold bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-2"
            >
              ✨ Hiện tượng: {currentRx.phenomenon}
            </motion.div>
          )}
        </div>

        {/* Options Selection Tray */}
        <div className="space-y-2">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">
            Chọn sản phẩm chính xác
          </div>
          <div className="grid grid-cols-1 gap-2">
            {options.map((opt) => {
              const isSelected = selectedProduct === opt;
              const isCorrect = isCorrectSolved && opt === currentRx.products.map((p) => p.formula).sort().join(' + ');

              return (
                <motion.button
                  key={opt}
                  whileTap={{ scale: 0.98 }}
                  disabled={isCorrectSolved}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-3.5 rounded-2xl border font-bold text-sm flex items-center justify-between transition-all cursor-pointer ${
                    isCorrect
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : isSelected
                      ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {opt.split(' + ').map((f, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <span className="text-slate-500">+</span>}
                        <Formula code={f} />
                      </React.Fragment>
                    ))}
                  </div>
                  {isCorrect && <Check className="w-5 h-5 text-emerald-400 shrink-0" />}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </MinigameShell>
  );
};
