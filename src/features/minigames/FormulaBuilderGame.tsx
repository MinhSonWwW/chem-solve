import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Sparkles, Zap } from 'lucide-react';
import { MinigameShell, Formula, Button } from '@/design-system';
import { sound } from '@/lib/audio';
import { useUserStore } from '@/features/gamification/useUserStore';
import ionsData from '@/content/kb/ions.json';

interface Ion {
  symbol: string;
  charge: number;
  type: 'cation' | 'anion';
  nameVi: string;
}

// Strip charge formatting: Al^3+ -> Al, SO4^2- -> SO4
export const cleanIonSymbol = (symbol: string): string => {
  return symbol.replace(/\^[0-9]*[+-]/, '');
};

// Check if group requires parentheses when count > 1
export const needsParens = (cleanSym: string): boolean => {
  // If starts with NH4, or has multiple capital letters (OH, SO4, NO3, CO3, PO4, CH3COO)
  const capitalMatches = cleanSym.match(/[A-Z]/g);
  return (capitalMatches !== null && capitalMatches.length > 1) || cleanSym.length > 2;
};

// Format compound formula: (Al, 2, SO4, 3) -> Al2(SO4)3
export const buildCompoundFormula = (
  cationSym: string,
  cCount: number,
  anionSym: string,
  aCount: number
): string => {
  const cleanCat = cleanIonSymbol(cationSym);
  const cleanAn = cleanIonSymbol(anionSym);

  let catPart = cleanCat;
  if (cCount > 1) {
    catPart = needsParens(cleanCat) ? `(${cleanCat})${cCount}` : `${cleanCat}${cCount}`;
  }

  let anPart = cleanAn;
  if (aCount > 1) {
    anPart = needsParens(cleanAn) ? `(${cleanAn})${aCount}` : `${cleanAn}${aCount}`;
  }

  return `${catPart}${anPart}`;
};

export const FormulaBuilderGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { addXp } = useUserStore();
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  const [pairIndex, setPairIndex] = useState(0);
  const [cationCount, setCationCount] = useState(1);
  const [anionCount, setAnionCount] = useState(1);
  const [successFormula, setSuccessFormula] = useState<string | null>(null);

  // List of pre-shuffled diverse ion pairs
  const ionPairs = useMemo(() => {
    const cations = (ionsData as Ion[]).filter((i) => i.type === 'cation');
    const anions = (ionsData as Ion[]).filter((i) => i.type === 'anion');

    const pairs: Array<{ cation: Ion; anion: Ion }> = [];
    for (const c of cations) {
      for (const a of anions) {
        // Exclude H+ with OH- in formula builder (since HOH is H2O)
        if (c.symbol === 'H^+' && a.symbol === 'OH^-') continue;
        pairs.push({ cation: c, anion: a });
      }
    }
    return pairs.sort(() => 0.5 - Math.random()).slice(0, 10);
  }, []);

  const currentPair = ionPairs[pairIndex] || ionPairs[0];

  // Net charge calculation
  const totalPositive = currentPair.cation.charge * cationCount;
  const totalNegative = Math.abs(currentPair.anion.charge) * anionCount;
  const netCharge = totalPositive - totalNegative;
  const isNeutral = netCharge === 0;

  // Finish game handler
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

  // Handle building compound
  const handleCombine = () => {
    if (!isNeutral) return;

    const formula = buildCompoundFormula(
      currentPair.cation.symbol,
      cationCount,
      currentPair.anion.symbol,
      anionCount
    );

    setSuccessFormula(formula);
    sound.playCorrect();
    const newScore = score + 25 + combo * 5;
    setScore(newScore);
    setCombo((c) => c + 1);

    setTimeout(() => {
      setSuccessFormula(null);
      setCationCount(1);
      setAnionCount(1);
      if (pairIndex + 1 >= ionPairs.length) {
        finishGame(newScore);
      } else {
        setPairIndex((i) => i + 1);
      }
    }, 1400);
  };

  return (
    <MinigameShell
      title="Ghép công thức (Formula Builder)"
      skillId="formula-builder"
      timeLeft={timeLeft}
      score={score}
      combo={combo}
      isGameOver={isGameOver}
      earnedXp={earnedXp}
      onExit={onExit}
      onRestart={() => {
        setTimeLeft(60);
        setScore(0);
        setCombo(0);
        setPairIndex(0);
        setCationCount(1);
        setAnionCount(1);
        setIsGameOver(false);
        setSuccessFormula(null);
      }}
    >
      <div className="space-y-4">
        {/* Mission Banner */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Nhiệm vụ {pairIndex + 1}/{ionPairs.length}:</span>
            <p className="font-bold text-slate-200 mt-0.5">
              Cân bằng điện tích giữa <span className="text-cyan-400">{currentPair.cation.nameVi}</span> và{' '}
              <span className="text-pink-400">{currentPair.anion.nameVi}</span>
            </p>
          </div>
          <div className="px-2.5 py-1 rounded-xl bg-violet-950/60 border border-violet-700/50 text-violet-300 font-black text-xs">
            ∑q = 0
          </div>
        </div>

        {/* Ion adjustment trays */}
        <div className="grid grid-cols-2 gap-3">
          {/* Cation Tray */}
          <div className="bg-slate-900 border-2 border-cyan-500/30 rounded-2xl p-3.5 flex flex-col items-center justify-between shadow-lg">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                Ion Dương (Cation)
              </span>
              <div className="py-2 text-2xl font-black text-cyan-200">
                <Formula formula={currentPair.cation.symbol} />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Điện tích: <span className="text-cyan-300 font-bold">+{currentPair.cation.charge}</span>
              </p>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-center gap-3 mt-3 w-full bg-slate-950/60 p-2 rounded-xl border border-slate-800">
              <button
                disabled={cationCount <= 1 || !!successFormula}
                onClick={() => setCationCount((c) => Math.max(1, c - 1))}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-base font-black text-slate-100 min-w-[20px] text-center">
                {cationCount}
              </span>
              <button
                disabled={cationCount >= 4 || !!successFormula}
                onClick={() => setCationCount((c) => Math.min(4, c + 1))}
                className="w-8 h-8 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="text-[10px] font-bold text-cyan-400 mt-2">
              Tổng điện tích: +{totalPositive}
            </div>
          </div>

          {/* Anion Tray */}
          <div className="bg-slate-900 border-2 border-pink-500/30 rounded-2xl p-3.5 flex flex-col items-center justify-between shadow-lg">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-pink-400">
                Ion Âm (Anion)
              </span>
              <div className="py-2 text-2xl font-black text-pink-200">
                <Formula formula={currentPair.anion.symbol} />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Điện tích: <span className="text-pink-300 font-bold">{currentPair.anion.charge}</span>
              </p>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-center gap-3 mt-3 w-full bg-slate-950/60 p-2 rounded-xl border border-slate-800">
              <button
                disabled={anionCount <= 1 || !!successFormula}
                onClick={() => setAnionCount((a) => Math.max(1, a - 1))}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-base font-black text-slate-100 min-w-[20px] text-center">
                {anionCount}
              </span>
              <button
                disabled={anionCount >= 4 || !!successFormula}
                onClick={() => setAnionCount((a) => Math.min(4, a + 1))}
                className="w-8 h-8 rounded-lg bg-pink-600/30 hover:bg-pink-600/50 text-pink-300 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="text-[10px] font-bold text-pink-400 mt-2">
              Tổng điện tích: -{totalNegative}
            </div>
          </div>
        </div>

        {/* Charge Balance Meter */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Cân bằng điện tích:
            </span>
            <span
              className={`font-black px-2 py-0.5 rounded-lg text-xs ${
                isNeutral
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60'
                  : 'bg-amber-950/80 text-amber-300 border border-amber-700/60'
              }`}
            >
              {isNeutral ? '✓ Đã trung hòa (0)' : `${netCharge > 0 ? `+${netCharge}` : netCharge} điện tích`}
            </span>
          </div>

          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 relative flex">
            {/* Center zero line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-500 z-10" />
            <div
              className={`h-full transition-all duration-300 ${
                isNeutral ? 'w-full bg-emerald-500' : netCharge > 0 ? 'bg-cyan-500' : 'bg-pink-500'
              }`}
              style={{
                width: isNeutral ? '100%' : `${Math.min(100, Math.abs(netCharge) * 25)}%`,
                marginLeft: isNeutral ? '0' : netCharge < 0 ? '50%' : 'auto',
                marginRight: isNeutral ? '0' : netCharge > 0 ? '50%' : 'auto',
              }}
            />
          </div>
        </div>

        {/* Success Popup / Combine Button */}
        <AnimatePresence mode="wait">
          {successFormula ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex flex-col items-center justify-center text-center space-y-1"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                <Sparkles className="w-4 h-4 text-emerald-300 animate-spin" />
                Ghép thành công!
              </div>
              <div className="text-2xl font-black text-white">
                <Formula formula={successFormula} />
              </div>
            </motion.div>
          ) : (
            <Button
              variant="accent"
              size="lg"
              fullWidth
              disabled={!isNeutral}
              onClick={handleCombine}
              className="py-3.5"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Ghép chất ({cationCount} cation + {anionCount} anion)
            </Button>
          )}
        </AnimatePresence>
      </div>
    </MinigameShell>
  );
};
