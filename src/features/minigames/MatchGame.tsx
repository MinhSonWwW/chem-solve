import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
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
  acid: 'Axit',
  base: 'Bazơ',
  'oxide-acid': 'Oxide axit',
  'oxide-base': 'Oxide bazơ',
  salt: 'Muối',
  metal: 'Kim loại',
  'non-metal': 'Phi kim',
  alkane: 'Alkane',
  alcohol: 'Rượu',
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
      title="Ghép đôi thuật ngữ (Match Game)"
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
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span>Ghép đúng Công thức ↔ Tên gọi / Loại chất</span>
          <span className="text-cyan-400">Vòng {roundNumber}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Left Column: Chemical Formulas */}
          <div className="space-y-2">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">
              Công thức
            </div>
            {leftItems.map((sub) => {
              const isMatched = matchedFormulas.has(sub.formula);
              const isSelected = selectedLeft === sub.formula;
              const isWrong = wrongFlash?.left === sub.formula;

              return (
                <motion.button
                  key={`left-${sub.formula}`}
                  disabled={isMatched}
                  whileTap={!isMatched ? { scale: 0.96 } : {}}
                  onClick={() => handleSelectLeft(sub.formula)}
                  className={`w-full p-3 rounded-2xl border font-bold text-sm flex items-center justify-between transition-all cursor-pointer ${
                    isMatched
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400 opacity-60 cursor-default shadow-sm'
                      : isWrong
                      ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                      : isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Formula code={sub.formula} className="text-sm font-black" />
                  {isMatched && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </motion.button>
              );
            })}
          </div>

          {/* Right Column: Names & Types */}
          <div className="space-y-2">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">
              Tên gọi / Phân loại
            </div>
            {rightItems.map((sub) => {
              const isMatched = matchedFormulas.has(sub.formula);
              const isSelected = selectedRight === sub.formula;
              const isWrong = wrongFlash?.right === sub.formula;

              return (
                <motion.button
                  key={`right-${sub.formula}`}
                  disabled={isMatched}
                  whileTap={!isMatched ? { scale: 0.96 } : {}}
                  onClick={() => handleSelectRight(sub.formula)}
                  className={`w-full p-3 rounded-2xl border font-bold text-xs text-left transition-all cursor-pointer flex items-center justify-between ${
                    isMatched
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 opacity-60 cursor-default shadow-sm'
                      : isWrong
                      ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                      : isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0 pr-1">
                    <div className="font-extrabold truncate text-slate-200">{sub.nameVi}</div>
                    <div className="text-[10px] text-slate-400">
                      {TYPE_NAMES[sub.type] || sub.type}
                    </div>
                  </div>
                  {isMatched && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </MinigameShell>
  );
};
