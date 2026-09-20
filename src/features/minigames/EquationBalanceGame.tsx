import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, CheckCircle2, Sparkles, Scale } from 'lucide-react';
import { MinigameShell, Formula, Button } from '@/design-system';
import { checkBalance } from '@/chem';
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

export const EquationBalanceGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { addXp } = useUserStore();
  const [timeLeft, setTimeLeft] = useState(75);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  // User coefficients: key is `r-0`, `p-0`, etc.
  const [userCoeffs, setUserCoeffs] = useState<Record<string, number>>({});
  const [justSolved, setJustSolved] = useState(false);

  // Shuffle reactions pool for this round
  const reactionsList = useMemo(() => {
    return [...(reactionsData as Reaction[])].sort(() => 0.5 - Math.random()).slice(0, 8);
  }, []);

  const currentRx = reactionsList[currentIndex] || reactionsList[0];

  // Initialize coefficients to 1 whenever reaction changes
  useEffect(() => {
    if (!currentRx) return;
    const initial: Record<string, number> = {};
    currentRx.reactants.forEach((_, i) => {
      initial[`r-${i}`] = 1;
    });
    currentRx.products.forEach((_, i) => {
      initial[`p-${i}`] = 1;
    });
    setUserCoeffs(initial);
    setJustSolved(false);
  }, [currentIndex, currentRx]);

  // Construct current equation string with user coefficients
  const currentEquationStr = useMemo(() => {
    if (!currentRx) return '';
    const left = currentRx.reactants
      .map((r, i) => {
        const c = userCoeffs[`r-${i}`] || 1;
        return `${c > 1 ? c : ''}${r.formula}`;
      })
      .join(' + ');

    const right = currentRx.products
      .map((p, i) => {
        const c = userCoeffs[`p-${i}`] || 1;
        return `${c > 1 ? c : ''}${p.formula}`;
      })
      .join(' + ');

    return `${left} -> ${right}`;
  }, [currentRx, userCoeffs]);

  // Check balance using chem engine
  const balanceResult = useMemo(() => {
    if (!currentEquationStr) return null;
    try {
      return checkBalance(currentEquationStr);
    } catch {
      return null;
    }
  }, [currentEquationStr]);

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

  const updateCoeff = (key: string, delta: number) => {
    if (justSolved) return;
    setUserCoeffs((prev) => {
      const cur = prev[key] || 1;
      const next = Math.max(1, Math.min(10, cur + delta));
      return { ...prev, [key]: next };
    });
  };

  const handleCheck = () => {
    if (!balanceResult) return;

    if (balanceResult.isBalanced && balanceResult.isSimplest) {
      sound.playCorrect();
      setJustSolved(true);
      const newScore = score + 30 + combo * 5;
      setScore(newScore);
      setCombo((c) => c + 1);

      setTimeout(() => {
        if (currentIndex + 1 >= reactionsList.length) {
          finishGame(newScore);
        } else {
          setCurrentIndex((idx) => idx + 1);
        }
      }, 1400);
    } else {
      sound.playWrong();
      setCombo(0);
    }
  };

  // Get list of all elements involved in this reaction
  const allElements = useMemo(() => {
    if (!balanceResult) return [];
    const elements = new Set([
      ...Object.keys(balanceResult.leftAtoms),
      ...Object.keys(balanceResult.rightAtoms),
    ]);
    return Array.from(elements);
  }, [balanceResult]);

  return (
    <MinigameShell
      title="Cân bằng PTHH"
      skillId="equation-balance"
      timeLeft={timeLeft}
      score={score}
      combo={combo}
      isGameOver={isGameOver}
      earnedXp={earnedXp}
      onExit={onExit}
      onRestart={() => {
        setTimeLeft(75);
        setScore(0);
        setCombo(0);
        setCurrentIndex(0);
        setIsGameOver(false);
      }}
    >
      <div className="space-y-4">
        {/* Reaction Info Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Phương trình {currentIndex + 1}/{reactionsList.length}
          </span>
          {currentRx.condition && (
            <span className="px-2 py-0.5 rounded-lg bg-amber-950/60 border border-amber-700/50 text-amber-300 font-bold text-[11px]">
              Đk: {currentRx.condition}
            </span>
          )}
        </div>

        {/* Chemical Equation Board with Steppers */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 text-center">
            Điều chỉnh hệ số nguyên tối giản
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {/* Reactants */}
            {currentRx.reactants.map((r, i) => {
              const key = `r-${i}`;
              const c = userCoeffs[key] || 1;
              return (
                <React.Fragment key={key}>
                  {i > 0 && <span className="text-slate-500 font-bold text-lg">+</span>}
                  <div className="flex flex-col items-center bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <button
                        disabled={c <= 1 || justSolved}
                        onClick={() => updateCoeff(key, -1)}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center disabled:opacity-20"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-base font-black text-amber-400 min-w-[20px] text-center">
                        {c}
                      </span>
                      <button
                        disabled={c >= 10 || justSolved}
                        onClick={() => updateCoeff(key, 1)}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center disabled:opacity-20"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-sm font-bold text-cyan-200">
                      <Formula formula={r.formula} />
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

            {/* Reaction Arrow */}
            <div className="flex flex-col items-center px-1 text-cyan-400 font-black">
              <span className="text-lg">→</span>
            </div>

            {/* Products */}
            {currentRx.products.map((p, i) => {
              const key = `p-${i}`;
              const c = userCoeffs[key] || 1;
              return (
                <React.Fragment key={key}>
                  {i > 0 && <span className="text-slate-500 font-bold text-lg">+</span>}
                  <div className="flex flex-col items-center bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <button
                        disabled={c <= 1 || justSolved}
                        onClick={() => updateCoeff(key, -1)}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center disabled:opacity-20"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-base font-black text-amber-400 min-w-[20px] text-center">
                        {c}
                      </span>
                      <button
                        disabled={c >= 10 || justSolved}
                        onClick={() => updateCoeff(key, 1)}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center disabled:opacity-20"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-sm font-bold text-pink-200">
                      <Formula formula={p.formula} />
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Live Atomic Balance Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
              Đếm số nguyên tử mỗi vế:
            </span>
            {balanceResult?.isBalanced && !balanceResult.isSimplest && (
              <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
                Chưa tối giản hệ số
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {allElements.map((elem) => {
              const left = balanceResult?.leftAtoms[elem] || 0;
              const right = balanceResult?.rightAtoms[elem] || 0;
              const isMatch = left === right;

              return (
                <div
                  key={elem}
                  className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                    isMatch
                      ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-700/50 text-rose-300'
                  }`}
                >
                  <span className="font-black text-white">{elem}</span>
                  <span className="font-mono font-bold text-[11px]">
                    {left} ⇄ {right} {isMatch ? '✓' : '✗'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button / Success Banner */}
        <AnimatePresence mode="wait">
          {justSolved ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500 flex items-center justify-center gap-2 text-emerald-300 font-black text-sm shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
              Cân bằng chính xác! (+35 XP)
            </motion.div>
          ) : (
            <Button
              variant="accent"
              size="lg"
              fullWidth
              disabled={!balanceResult?.isBalanced || !balanceResult?.isSimplest}
              onClick={handleCheck}
              className="py-3.5"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Kiểm tra cân bằng
            </Button>
          )}
        </AnimatePresence>
      </div>
    </MinigameShell>
  );
};
