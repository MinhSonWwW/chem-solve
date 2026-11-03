import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, Layers } from 'lucide-react';
import { MinigameShell, Formula } from '@/design-system';
import { sound } from '@/lib/audio';
import { useUserStore } from '@/features/gamification/useUserStore';
import { useActiveSubject } from '@/content/subjects';
import substancesData from '@/content/kb/substances.json';
import physicsMatchPairs from '@/content/kb/physics/match-pairs.json';
import biologyMatchPairs from '@/content/kb/biology/match-pairs.json';

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
  'Cơ học': 'Cơ học',
  'Năng lượng': 'Năng lượng',
  'Điện học': 'Điện học',
  'Quang học': 'Quang học',
  'Nhiệt học': 'Nhiệt học',
  'Tế bào': 'Tế bào',
  'Cơ thể': 'Cơ thể',
  'Di truyền': 'Di truyền',
  'Tiến hóa': 'Tiến hóa',
};

export const MatchGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { addXp } = useUserStore();
  const { subject: activeSubject } = useActiveSubject();
  const isPhysics = activeSubject === 'physics';
  const isBio = activeSubject === 'bio';

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

  // Pick 5 distinct substances or formulas for each round
  const roundSubstances = useMemo(() => {
    if (isBio) {
      const valid = [...biologyMatchPairs];
      const shuffled = valid.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 5);
    }
    if (isPhysics) {
      const valid = [...physicsMatchPairs];
      const shuffled = valid.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 5);
    }
    const valid = (substancesData as Substance[]).filter(
      (s) => s.formula.length <= 8 && s.nameVi
    );
    const shuffled = [...valid].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, [roundNumber, isGameOver, isPhysics, isBio]);

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
      title={isPhysics ? 'Ghép đôi Công thức & Đơn vị Vật lý' : 'Ghép đôi hợp chất & Tên gọi'}
      description={
        isPhysics
          ? 'Kết nối công thức Vật lý với tên gọi đại lượng và đơn vị đo chuẩn'
          : 'Kết nối công thức hóa học với tên gọi chuẩn IUPAC'
      }
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
            <Sparkles className="w-3.5 h-3.5 text-[var(--chem-fg)]" />
            {isPhysics ? 'Ghép Công thức ↔ Đại lượng & Đơn vị' : 'Ghép Công thức ↔ Tên / Phân loại'}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[var(--chem-tint)] border border-[var(--chem-edge)] text-[var(--chem-fg)] font-black text-[11px] flex items-center gap-1">
            <Layers className="w-3 h-3" />
            Vòng {roundNumber}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Left Column: Formulas / Symbols */}
          <div className="space-y-2.5">
            <div className="text-[10px] font-black text-[var(--chem-fg)] uppercase tracking-widest text-center py-1 bg-cyan-950/30 rounded-xl border border-cyan-900/40">
              {isPhysics ? 'CÔNG THỨC / KÝ HIỆU' : 'CÔNG THỨC HÓA HỌC'}
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
                      ? 'bg-[var(--ok-subtle)] border-[var(--ok)] text-[var(--ok-fg)] opacity-60 cursor-default shadow-none'
                      : isWrong
                      ? 'bg-[var(--err-subtle)] border-[var(--err)] text-[var(--err-fg)] shadow-[0_3px_0_0_var(--err-shade)] animate-shake'
                      : isSelected
                      ? 'bg-[var(--chem-subtle)] border-[var(--chem)] text-[var(--chem-fg)] shadow-[0_3px_0_0_var(--chem-shade)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border)] text-[var(--fg-default)] hover:border-[var(--border-strong)] shadow-[0_3px_0_0_var(--border-strong)]'
                  }`}
                >
                  {isPhysics ? (
                    <span className="text-sm sm:text-base font-black tracking-wide font-mono text-[var(--chem-fg)]">
                      {sub.formula}
                    </span>
                  ) : (
                    <Formula code={sub.formula} className="text-sm sm:text-base font-black tracking-wide" />
                  )}
                  {isMatched && (
                    <div className="w-5 h-5 rounded-full bg-[var(--ok-subtle)] border border-[var(--ok)] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-[var(--ok-fg)] stroke-[3]" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Right Column: Names & Types */}
          <div className="space-y-2.5">
            <div className="text-[10px] font-black text-[var(--warn-fg)] uppercase tracking-widest text-center py-1 bg-[var(--warn-subtle)] rounded-xl border border-[var(--warn)]">
              {isPhysics ? 'ĐẠI LƯỢNG / ĐƠN VỊ' : 'TÊN GỌI / PHÂN LOẠI'}
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
                      ? 'bg-[var(--ok-subtle)] border-[var(--ok)] text-[var(--ok-fg)] opacity-60 cursor-default shadow-none'
                      : isWrong
                      ? 'bg-[var(--err-subtle)] border-[var(--err)] text-[var(--err-fg)] shadow-[0_3px_0_0_var(--err-shade)] animate-shake'
                      : isSelected
                      ? 'bg-[var(--warn-subtle)] border-[var(--warn)] text-[var(--warn-fg)] shadow-[0_3px_0_0_var(--warn-shade)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border)] text-[var(--fg-default)] hover:border-[var(--border-strong)] shadow-[0_3px_0_0_var(--border-strong)]'
                  }`}
                >
                  <div className="min-w-0 pr-1.5 flex-1">
                    <div className="font-extrabold truncate text-[var(--fg-default)] text-xs sm:text-sm">
                      {sub.nameVi}
                    </div>
                    <div className="text-[10px] text-[var(--warn-fg)] font-semibold mt-0.5">
                      {TYPE_NAMES[sub.type] || sub.type}
                    </div>
                  </div>
                  {isMatched && (
                    <div className="w-5 h-5 rounded-full bg-[var(--ok-subtle)] border border-[var(--ok)] flex items-center justify-center shrink-0">
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

