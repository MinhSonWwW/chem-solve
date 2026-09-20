import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap } from 'lucide-react';
import { MinigameShell, Formula } from '@/design-system';
import { sound } from '@/lib/audio';
import { useUserStore } from '@/features/gamification/useUserStore';

interface SpeedQuestion {
  id: string;
  prompt: string;
  formula?: string;
  options: string[];
  correctAnswer: string;
}

const SPEED_QUESTIONS_POOL: SpeedQuestion[] = [
  {
    id: 'sq-1',
    prompt: 'Khối lượng mol của khí Oxi (O2) là:',
    formula: 'O2',
    options: ['16 g/mol', '32 g/mol', '24 g/mol', '48 g/mol'],
    correctAnswer: '32 g/mol',
  },
  {
    id: 'sq-2',
    prompt: 'Khối lượng mol của phân tử nước (H2O) là:',
    formula: 'H2O',
    options: ['16 g/mol', '18 g/mol', '20 g/mol', '17 g/mol'],
    correctAnswer: '18 g/mol',
  },
  {
    id: 'sq-3',
    prompt: 'Khối lượng mol của khí Cacbonic (CO2) là:',
    formula: 'CO2',
    options: ['28 g/mol', '44 g/mol', '32 g/mol', '40 g/mol'],
    correctAnswer: '44 g/mol',
  },
  {
    id: 'sq-4',
    prompt: 'Thể tích của 1 mol khí ở ĐKC (25 °C, 1 bar) là:',
    options: ['22,4 lít', '24,79 lít', '24,4 lít', '22,79 lít'],
    correctAnswer: '24,79 lít',
  },
  {
    id: 'sq-5',
    prompt: 'Thể tích của 2 mol chất khí bất kì ở ĐKC là:',
    options: ['44,8 lít', '49,58 lít', '48,0 lít', '49,2 lít'],
    correctAnswer: '49,58 lít',
  },
  {
    id: 'sq-6',
    prompt: 'Hóa trị của Nhôm (Al) trong hợp chất Al2O3 là:',
    formula: 'Al2O3',
    options: ['I', 'II', 'III', 'IV'],
    correctAnswer: 'III',
  },
  {
    id: 'sq-7',
    prompt: 'Kí hiệu hóa học của nguyên tố Natri là:',
    options: ['N', 'Na', 'Ne', 'Ni'],
    correctAnswer: 'Na',
  },
  {
    id: 'sq-8',
    prompt: 'Kí hiệu hóa học của nguyên tố Sắt là:',
    options: ['Fe', 'F', 'Fr', 'Sn'],
    correctAnswer: 'Fe',
  },
  {
    id: 'sq-9',
    prompt: 'Kí hiệu hóa học của nguyên tố Đồng là:',
    options: ['Co', 'Cu', 'Cr', 'Cd'],
    correctAnswer: 'Cu',
  },
  {
    id: 'sq-10',
    prompt: 'Khối lượng mol của Canxi cacbonat (CaCO3) là:',
    formula: 'CaCO3',
    options: ['100 g/mol', '96 g/mol', '106 g/mol', '84 g/mol'],
    correctAnswer: '100 g/mol',
  },
  {
    id: 'sq-11',
    prompt: 'Khối lượng mol của Natri hiđroxit (NaOH) là:',
    formula: 'NaOH',
    options: ['39 g/mol', '40 g/mol', '56 g/mol', '41 g/mol'],
    correctAnswer: '40 g/mol',
  },
  {
    id: 'sq-12',
    prompt: 'Khí nào sau đây nhẹ hơn không khí (M = 29)?',
    options: ['O2 (32)', 'CO2 (44)', 'CH4 (16)', 'SO2 (64)'],
    correctAnswer: 'CH4 (16)',
  },
  {
    id: 'sq-13',
    prompt: 'Axit sunfuric có công thức hóa học là:',
    options: ['HCl', 'HNO3', 'H2SO4', 'H2SO3'],
    correctAnswer: 'H2SO4',
  },
  {
    id: 'sq-14',
    prompt: 'Hóa trị của Sắt trong hợp chất FeCl2 là:',
    formula: 'FeCl2',
    options: ['I', 'II', 'III', 'IV'],
    correctAnswer: 'II',
  },
  {
    id: 'sq-15',
    prompt: 'Khối lượng của 0,5 mol phân tử Nito (N2, M=28) là:',
    formula: 'N2',
    options: ['7 g', '14 g', '28 g', '56 g'],
    correctAnswer: '14 g',
  },
];

export const SpeedChallengeGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { addXp } = useUserStore();
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Shuffle questions
  const shuffledQuestions = useMemo(() => {
    return [...SPEED_QUESTIONS_POOL].sort(() => 0.5 - Math.random());
  }, []);

  const currentQ = shuffledQuestions[currentIndex % shuffledQuestions.length];

  const finishGame = useCallback(
    (finalScore: number) => {
      setIsGameOver(true);
      const xp = Math.min(25, Math.max(5, Math.round(finalScore / 15)));
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

  const handleSelect = (option: string) => {
    if (selectedOption || !currentQ) return;

    setSelectedOption(option);
    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      sound.playCorrect();
      setScore((s) => s + 20 + combo * 5);
      setCombo((c) => c + 1);
    } else {
      sound.playWrong();
      setCombo(0);
    }

    setTimeout(() => {
      setSelectedOption(null);
      setCurrentIndex((i) => i + 1);
    }, 350);
  };

  return (
    <MinigameShell
      title="Thử thách tốc độ (60s)"
      skillId="speed-challenge"
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
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsGameOver(false);
      }}
    >
      <div className="space-y-4">
        {/* Rapid Question Counter */}
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-slate-400">Câu số: {currentIndex + 1}</span>
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <Zap className="w-3.5 h-3.5" /> Phản xạ nhanh
          </span>
        </div>

        {/* Question Board */}
        <div className="min-h-[120px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ.id + currentIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full p-4 rounded-3xl bg-slate-900 border-2 border-slate-800 flex flex-col items-center justify-center text-center shadow-xl space-y-2"
            >
              <h2 className="text-base sm:text-lg font-black text-slate-100 leading-snug">
                {currentQ.prompt}
              </h2>
              {currentQ.formula && (
                <div className="text-2xl font-black text-cyan-300">
                  <Formula formula={currentQ.formula} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt;
            const isAnswer = opt === currentQ.correctAnswer;

            let btnStyle = 'border-slate-800 bg-slate-900/90 text-slate-200 hover:border-slate-700';
            if (selectedOption) {
              if (isAnswer) {
                btnStyle = 'border-emerald-500 bg-emerald-950/60 text-emerald-300 font-black';
              } else if (isSelected) {
                btnStyle = 'border-rose-500 bg-rose-950/60 text-rose-300 font-black';
              } else {
                btnStyle = 'opacity-40 border-slate-800 bg-slate-900';
              }
            }

            return (
              <motion.button
                key={opt}
                whileTap={{ scale: 0.96 }}
                disabled={!!selectedOption}
                onClick={() => handleSelect(opt)}
                className={`p-3.5 rounded-2xl border-2 font-bold text-sm sm:text-base flex items-center justify-center text-center shadow transition-all ${btnStyle}`}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>
      </div>
    </MinigameShell>
  );
};
