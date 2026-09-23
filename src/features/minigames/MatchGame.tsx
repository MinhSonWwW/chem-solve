import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, Layers } from 'lucide-react';
import { MinigameShell, Formula } from '@/design-system';
import { sound } from '@/lib/audio';
import { useUserStore } from '@/features/gamification/useUserStore';
import substancesData from '@/content/kb/substances.json';

interface Substance {
  formula: string;
  nameVi: string;
  type: string;
}

const TYPE_NAMES: Record<string, string> = {
  acid: 'Acid',
  base: 'Base',
  'oxide-acid': 'Oxide acid',
  'oxide-base': 'Oxide base',
  salt: 'Muối',
  metal: 'Kim loại',
  'non-metal': 'Phi kim',
  alkane: 'Alkane',
  alcohol: 'Alcohol',
};

export const MatchGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { addXp } = useUserStore();
  const [timeLeft, setTimeLeft] = useState(50);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedFormulas, setMatchedFormulas] = useState<Set<string>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<{ left: string; right: string } | null>(null);

  // Pick 5 distinct substances for each round
  const roundSubstances = useMemo(() => {
    const valid = (substancesData as Substance[]).filter(
      (s) => s.formula.length <= 8 && s.nameVi
    );
    const shuffled = [...valid].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, [roundNumber, isGameOver]);

  const leftItems = useMemo(
    () => [...roundSubstances].sort(() => 0.5 - Math.random()),
    [roundSubstances]
  );

  const rightItems = useMemo(
    () => [...roundSubstances].sort(() => 0.5 - Math.random()),
    [roundSubstances]
  );

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

  // Check 1-to-1 match
  const handleCheckMatch = useCallback(
    (leftFormula: string, rightFormula: string) => {
      if (leftFormula === rightFormula) {
        sound.playCorrect();
        const newScore = score + 20 + combo * 5;
        setScore(newScore);
        const newCombo = combo + 1;
        setCombo(newCombo);

        const nextMatched = new Set(matchedFormulas);
        nextMatched.add(leftFormula);
        setMatchedFormulas(nextMatched);

        setSelectedLeft(null);
        setSelectedRight(null);

        // If all 5 matched, advance to next round or finish
        if (nextMatched.size >= roundSubstances.length) {
          sound.playStreak();
          setTimeout(() => {
            setMatchedFormulas(new Set());
            setSelectedLeft(null);
            setSelectedRight(null);
            setRoundNumber((r) => r + 1);
          }, 600);
        }
      } else {
        sound.playWrong();
        setCombo(0);
        setWrongFlash({ left: leftFormula, right: rightFormula });
        setTimeout(() => {
          setWrongFlash(null);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 500);
      }
    },
    [roundSubstances, score, combo, matchedFormulas]
  );

  const handleSelectLeft = (formula: string) => {
    if (matchedFormulas.has(formula)) return;
    sound.playClick();
    if (selectedRight) {
      handleCheckMatch(formula, selectedRight);
    } else {
      setSelectedLeft(formula);
    }
  };

  const handleSelectRight = (formula: string) => {
    if (matchedFormulas.has(formula)) return;
    sound.playClick();
    if (selectedLeft) {
      handleCheckMatch(selectedLeft, formula);
    } else {
      setSelectedRight(formula);
    }
  };

  const handleRestart = () => {
    setTimeLeft(50);
    setScore(0);
    setCombo(0);
    setEarnedXp(0);
    setMatchedFormulas(new Set());
    setSelectedLeft(null);
    setSelectedRight(null);
    setRoundNumber((r) => r + 1);
    setIsGameOver(false);
  };

  return (
    <MinigameShell
      title="Ghép đôi hợp chất & Tên gọi"
      description="Kết nối công thức hóa học với tên gọi chuẩn IUPAC"
      skillId="match-substance"
      timeLeft={timeLeft}
      score={score}
      combo={combo}
      isGameOver={isGameOver}
      earnedXp={earnedXp}
      onExit={onExit}
      onRestart={handleRestart}
    >
      <div className="space-y-4">
        {/* Header indicator */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Ghép Công thức ↔ Tên / Phân loại
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-black text-[11px] flex items-center gap-1">
            <Layers className="w-3 h-3" />
            Vòng {roundNumber}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Left Column: Chemical Formulas */}
          <div className="space-y-2.5">
            <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest text-center py-1 bg-cyan-950/30 rounded-xl border border-cyan-900/40">
              CÔNG THỨC HÓA HỌC
            </div>
            {leftItems.map((sub) => {
              const isMatched = matchedFormulas.has(sub.formula);
              const isSelected = selectedLeft === sub.formula;
              const isWrong = wrongFlash?.left === sub.formula;

              return (
                <motion.button
                  key={`left-${sub.formula}`}
                  disabled={isMatched}
                  whileTap={!isMatched ? { scale: 0.96, y: 2 } : {}}
                  onClick={() => handleSelectLeft(sub.formula)}
                  className={`w-full p-3.5 rounded-2xl border-2 font-bold text-sm flex items-center justify-between transition-all cursor-pointer ${
                    isMatched
                      ? 'bg-gradient-to-r from-emerald-950/60 to-[#122b24] border-emerald-500/60 text-emerald-400 opacity-60 cursor-default shadow-none'
                      : isWrong
                      ? 'bg-gradient-to-r from-rose-950/80 to-[#2b1414] border-rose-500 text-rose-300 shadow-[0_4px_0_0_#9f1239] animate-shake'
                      : isSelected
                      ? 'bg-gradient-to-b from-[#183a48] to-[#112732] border-cyan-400 text-cyan-200 shadow-[0_4px_0_0_#0891b2,0_0_18px_rgba(6,182,212,0.4)]'
                      : 'bg-gradient-to-b from-[#1c2c36] to-[#121c22] border-[#2e4756] text-slate-100 hover:border-slate-500 shadow-[0_4px_0_0_#0c1419]'
                  }`}
                >
                  <Formula code={sub.formula} className="text-sm sm:text-base font-black tracking-wide" />
                  {isMatched && (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Right Column: Names & Types */}
          <div className="space-y-2.5">
            <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest text-center py-1 bg-amber-950/30 rounded-xl border border-amber-900/40">
              TÊN GỌI / PHÂN LOẠI
            </div>
            {rightItems.map((sub) => {
              const isMatched = matchedFormulas.has(sub.formula);
              const isSelected = selectedRight === sub.formula;
              const isWrong = wrongFlash?.right === sub.formula;

              return (
                <motion.button
                  key={`right-${sub.formula}`}
                  disabled={isMatched}
                  whileTap={!isMatched ? { scale: 0.96, y: 2 } : {}}
                  onClick={() => handleSelectRight(sub.formula)}
                  className={`w-full p-3 rounded-2xl border-2 font-bold text-xs text-left transition-all cursor-pointer flex items-center justify-between ${
                    isMatched
                      ? 'bg-gradient-to-r from-emerald-950/60 to-[#122b24] border-emerald-500/60 text-emerald-300 opacity-60 cursor-default shadow-none'
                      : isWrong
                      ? 'bg-gradient-to-r from-rose-950/80 to-[#2b1414] border-rose-500 text-rose-300 shadow-[0_4px_0_0_#9f1239]'
                      : isSelected
                      ? 'bg-gradient-to-b from-[#3a2e1d] to-[#251e12] border-amber-400 text-amber-200 shadow-[0_4px_0_0_#d97706,0_0_18px_rgba(245,158,11,0.4)]'
                      : 'bg-gradient-to-b from-[#1c2c36] to-[#121c22] border-[#2e4756] text-slate-200 hover:border-slate-500 shadow-[0_4px_0_0_#0c1419]'
                  }`}
                >
                  <div className="min-w-0 pr-1.5 flex-1">
                    <div className="font-extrabold truncate text-slate-100 text-xs sm:text-sm">
                      {sub.nameVi}
                    </div>
                    <div className="text-[10px] text-amber-400/90 font-semibold mt-0.5">
                      {TYPE_NAMES[sub.type] || sub.type}
                    </div>
                  </div>
                  {isMatched && (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </MinigameShell>
  );
};

