import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Pipette,
  Sparkles,
  Droplets,
} from 'lucide-react';
import { MinigameShell, Button, MathText } from '@/design-system';
import { sound } from '@/lib/audio';
import { useUserStore } from '@/features/gamification/useUserStore';

interface TitrationCase {
  id: string;
  analyteName: string; // e.g. Dung dịch HCl
  analyteVolume: number; // mL (e.g. 10 mL)
  titrantName: string; // e.g. Dung dịch chuẩn NaOH 0.1M
  titrantMolarity: number; // M
  actualAnalyteMolarity: number; // M (target concentration)
  equivalentVolume: number; // mL NaOH needed = (C_a * V_a) / C_t
}

const CASES: TitrationCase[] = [
  {
    id: 'case-1',
    analyteName: 'Dung dịch HCl mẫu số 1',
    analyteVolume: 10.0,
    titrantName: 'Dung dịch NaOH 0.10 M',
    titrantMolarity: 0.1,
    actualAnalyteMolarity: 0.1,
    equivalentVolume: 10.0,
  },
  {
    id: 'case-2',
    analyteName: 'Dung dịch HCl mẫu số 2',
    analyteVolume: 10.0,
    titrantName: 'Dung dịch NaOH 0.10 M',
    titrantMolarity: 0.1,
    actualAnalyteMolarity: 0.15,
    equivalentVolume: 15.0,
  },
  {
    id: 'case-3',
    analyteName: 'Dung dịch CH3COOH mẫu giấm ăn',
    analyteVolume: 10.0,
    titrantName: 'Dung dịch NaOH 0.10 M',
    titrantMolarity: 0.1,
    actualAnalyteMolarity: 0.08,
    equivalentVolume: 8.0,
  },
  {
    id: 'case-4',
    analyteName: 'Dung dịch H2SO4 mẫu nước mưa acid',
    analyteVolume: 10.0,
    titrantName: 'Dung dịch NaOH 0.10 M',
    titrantMolarity: 0.1,
    actualAnalyteMolarity: 0.06, // n_H+ = 2 * C * V -> V_t = (2 * 0.06 * 10) / 0.1 = 12 mL
    equivalentVolume: 12.0,
  },
];

export const TitrationLabGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { addXp } = useUserStore();

  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [buretVolume, setBuretVolume] = useState(0.0); // mL NaOH added
  const [isFlowing, setIsFlowing] = useState(false);
  const [flowSpeed, setFlowSpeed] = useState<'slow' | 'fast'>('slow');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(70);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [stage, setStage] = useState<'titrating' | 'calculating' | 'result'>('titrating');
  const [calculatedChoice, setCalculatedChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentCase = CASES[currentCaseIndex % CASES.length];
  const diff = buretVolume - currentCase.equivalentVolume;

  // Determine solution color based on phenolphthalein pH transition
  // < -0.3 mL: completely colorless (pH < 8.2)
  // -0.3 to +0.3 mL: pale pink (perfect endpoint!)
  // > +0.3 mL: deep magenta pink (overshot)
  let flaskColor = 'rgba(240, 249, 255, 0.4)'; // colorless watery
  let colorStatusText = 'Không màu (môi trường acid/trung tính chưa chuyển màu)';
  let isPerfectZone = false;
  let isOvershot = false;

  if (diff >= -0.3 && diff <= 0.3) {
    flaskColor = 'rgba(244, 114, 182, 0.55)'; // light baby pink
    colorStatusText = '🌸 Hồng nhạt bền trong 30s (Điểm tương đương hoàn hảo!)';
    isPerfectZone = true;
  } else if (diff > 0.3) {
    flaskColor = 'rgba(219, 39, 119, 0.9)'; // strong magenta
    colorStatusText = '⚠️ Hồng tím đậm (Quá chuẩn độ do dư thừa base NaOH!)';
    isOvershot = true;
  }

  // Timer loop
  useEffect(() => {
    if (isGameOver || timeLeft <= 0) {
      if (!isGameOver) {
        setIsGameOver(true);
        const xp = Math.min(60, Math.floor(score / 5) + 10);
        setEarnedXp(xp);
        addXp(xp);
        sound.playCompletion();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isGameOver, score, addXp]);

  // Buret flow simulation
  useEffect(() => {
    if (!isFlowing || isGameOver || stage !== 'titrating') return;

    const intervalMs = flowSpeed === 'slow' ? 120 : 60;
    const deltaVolume = flowSpeed === 'slow' ? 0.05 : 0.2;

    const flowInterval = setInterval(() => {
      setBuretVolume((prev) => {
        const next = Math.round((prev + deltaVolume) * 100) / 100;
        if (next >= 25.0) {
          setIsFlowing(false);
          return 25.0;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(flowInterval);
  }, [isFlowing, flowSpeed, isGameOver, stage]);

  const handleAddDrop = () => {
    if (stage !== 'titrating' || isGameOver) return;
    sound.playClick();
    setBuretVolume((prev) => Math.min(25.0, Math.round((prev + 0.05) * 100) / 100));
  };

  const handleLockBuret = () => {
    sound.playClick();
    setIsFlowing(false);
    setStage('calculating');

    if (isPerfectZone) {
      sound.playCorrect();
      setScore((s) => s + 100 + combo * 15);
      setCombo((c) => c + 1);
      setFeedback('Chính xác tuyệt đối! Điểm tương đương đạt màu hồng nhạt bền.');
    } else if (isOvershot) {
      sound.playWrong();
      setCombo(0);
      setScore((s) => Math.max(0, s - 20));
      setFeedback('Bạn đã cho dư NaOH khiến dung dịch chuyển sang màu hồng đậm.');
    } else {
      sound.playWrong();
      setCombo(0);
      setScore((s) => Math.max(0, s - 30));
      setFeedback('Chưa đủ NaOH, dung dịch vẫn chưa chuyển màu chỉ thị phenolphtalein.');
    }
  };

  const handleSelectCalculation = (choice: number) => {
    setCalculatedChoice(choice);
    const isCorrect = Math.abs(choice - currentCase.actualAnalyteMolarity) < 0.005;

    if (isCorrect) {
      sound.playCorrect();
      setScore((s) => s + 80);
      setFeedback(`Chúc mừng! Nồng độ mol chính xác là ${choice} M.`);
    } else {
      sound.playWrong();
      setFeedback(`Chưa chính xác. Nồng độ mol đúng là ${currentCase.actualAnalyteMolarity} M.`);
    }

    setStage('result');
  };

  const handleNextCase = () => {
    sound.playClick();
    setBuretVolume(0.0);
    setIsFlowing(false);
    setCalculatedChoice(null);
    setFeedback(null);
    setStage('titrating');
    setCurrentCaseIndex((i) => i + 1);
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentCaseIndex(0);
    setBuretVolume(0.0);
    setIsFlowing(false);
    setScore(0);
    setCombo(0);
    setTimeLeft(70);
    setIsGameOver(false);
    setEarnedXp(0);
    setStage('titrating');
    setCalculatedChoice(null);
    setFeedback(null);
  };

  // Generate 4 multiple choices for calculation step
  const choices = [
    currentCase.actualAnalyteMolarity,
    Math.round((currentCase.actualAnalyteMolarity + 0.05) * 100) / 100,
    Math.round(Math.max(0.02, currentCase.actualAnalyteMolarity - 0.04) * 100) / 100,
    Math.round((currentCase.actualAnalyteMolarity * 1.5) * 100) / 100,
  ].sort((a, b) => a - b);

  return (
    <MinigameShell
      title="Thí Nghiệm Chuẩn Độ Acid - Base"
      description="Thao tác buret & chỉ thị phenolphtalein chuẩn xác!"
      icon={<Pipette className="w-5 h-5 text-[var(--chem-fg)]" />}
      timeLeft={timeLeft}
      totalTime={70}
      score={score}
      combo={combo}
      isGameOver={isGameOver}
      earnedXp={earnedXp}
      onExit={onExit}
      onRestart={handleRestart}
    >
      <div className="space-y-4 select-none">
        {/* Sample Target Card */}
        <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--chem-fg)]">
              Mẫu thử {currentCaseIndex + 1}
            </span>
            <h2 className="text-sm font-black text-[var(--text-primary)]">
              {currentCase.analyteName} ({currentCase.analyteVolume} mL)
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Dung dịch chuẩn: <span className="font-bold text-[var(--text-primary)]">{currentCase.titrantName}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-[var(--text-tertiary)] block">Thể tích buret</span>
            <span className="text-base font-black font-mono text-[var(--chem-fg)]">
              {buretVolume.toFixed(2)} mL
            </span>
          </div>
        </div>

        {/* Interactive Lab Apparatus */}
        <div className="relative p-5 rounded-3xl bg-[var(--bg-surface-2)] border border-[var(--border)] overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
          {/* Buret apparatus column */}
          <div className="relative flex flex-col items-center w-28">
            <div className="text-[10px] font-black text-[var(--text-tertiary)] mb-1">BURET 25 mL</div>
            {/* Glass tube */}
            <div className="w-6 h-28 border-2 border-[var(--text-secondary)]/40 rounded-t-md bg-white/5 relative overflow-hidden flex flex-col justify-end">
              {/* Liquid inside buret */}
              <motion.div
                className="w-full bg-cyan-400/40"
                style={{ height: `${Math.max(5, ((25 - buretVolume) / 25) * 100)}%` }}
              />
              {/* Tick marks */}
              <div className="absolute inset-0 flex flex-col justify-between py-1 px-0.5 pointer-events-none opacity-30">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-full h-0.5 bg-[var(--text-primary)]" />
                ))}
              </div>
            </div>

            {/* Stopcock valve */}
            <div className="relative my-0.5">
              <div
                className={`w-10 h-3 rounded-full transition-transform duration-200 cursor-pointer ${
                  isFlowing
                    ? 'bg-[var(--chem-fill)] rotate-90 shadow-md'
                    : 'bg-[var(--border-strong)] rotate-0'
                }`}
                onClick={() => setIsFlowing(!isFlowing)}
                title="Khóa van Buret"
              />
            </div>

            {/* Droplet animation */}
            <div className="h-6 flex items-center justify-center relative">
              {isFlowing && (
                <motion.div
                  className="w-2 h-2 rounded-full bg-cyan-300"
                  animate={{ y: [0, 16], opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: flowSpeed === 'slow' ? 0.4 : 0.2 }}
                />
              )}
            </div>
          </div>

          {/* Erlenmeyer Flask */}
          <div className="relative flex flex-col items-center mt-1">
            <div
              className="w-24 h-20 rounded-b-3xl border-2 border-[var(--text-secondary)]/50 relative overflow-hidden flex items-end justify-center transition-colors duration-300 shadow-inner"
              style={{ backgroundColor: flaskColor }}
            >
              <div className="w-full text-center pb-2">
                <span className="text-[10px] font-black text-[var(--text-primary)] opacity-80">
                  {currentCase.analyteVolume + buretVolume > 0
                    ? `${(currentCase.analyteVolume + buretVolume).toFixed(1)} mL`
                    : ''}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[var(--text-tertiary)] mt-1">Bình tam giác + Phenolphtalein</span>
          </div>

          {/* Real-time Indicator status alert */}
          <div className="mt-3 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-center text-xs font-bold text-[var(--text-primary)]">
            {colorStatusText}
          </div>
        </div>

        {/* Phase 1: Titrating Controls */}
        {stage === 'titrating' && (
          <div className="space-y-2.5">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddDrop}
                className="flex items-center justify-center gap-1 text-xs font-bold"
              >
                <Droplets className="w-3.5 h-3.5 text-[var(--chem-fg)]" />
                <span>+1 Giọt</span>
              </Button>

              <Button
                variant={isFlowing && flowSpeed === 'slow' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  sound.playClick();
                  setFlowSpeed('slow');
                  setIsFlowing(true);
                }}
                className="text-xs font-bold"
              >
                Chảy chậm
              </Button>

              <Button
                variant={isFlowing && flowSpeed === 'fast' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  sound.playClick();
                  setFlowSpeed('fast');
                  setIsFlowing(true);
                }}
                className="text-xs font-bold"
              >
                Chảy nhanh
              </Button>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleLockBuret}
              className="font-black bg-[var(--chem-fill)] text-white shadow-md flex items-center justify-center gap-2"
            >
              <span>KHÓA BURET & CHỐT ĐIỂM TƯƠNG ĐƯƠNG</span>
            </Button>
          </div>
        )}

        {/* Phase 2: Calculate Molarity */}
        {stage === 'calculating' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-3"
          >
            <div className="text-xs font-bold text-[var(--text-secondary)] leading-relaxed">
              {feedback}
              {calculatedChoice != null && (
                <div className="text-[11px] text-[var(--text-tertiary)] mt-1 font-mono">
                  Lựa chọn của bạn: {calculatedChoice.toFixed(2)} M
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-xs text-[var(--text-primary)]">
              <div className="font-bold text-[var(--chem-fg)] mb-1">Công thức tính nồng độ:</div>
              <MathText text="$C_{\text{acid}} = \frac{C_{\text{NaOH}} \times V_{\text{NaOH}}}{V_{\text{acid}}}$" />
              <div className="mt-1 text-[11px] text-[var(--text-tertiary)]">
                <MathText text={`Với $V_{\\text{NaOH}} = ${buretVolume.toFixed(2)}\\text{ mL}$, $C_{\\text{NaOH}} = ${currentCase.titrantMolarity}\\text{ M}$, $V_{\\text{acid}} = ${currentCase.analyteVolume}\\text{ mL}$`} />
              </div>
            </div>

            <div className="text-xs font-black text-[var(--text-primary)]">
              Hãy chọn nồng độ mol $C_M$ của dung dịch acid:
            </div>

            <div className="grid grid-cols-2 gap-2">
              {choices.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectCalculation(c)}
                  className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface-2)] hover:border-[var(--chem-fill)] text-xs font-black text-[var(--text-primary)] transition-all cursor-pointer text-center"
                >
                  {c.toFixed(2)} M
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Phase 3: Result & Next Sample */}
        {stage === 'result' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-3 text-center"
          >
            <div className="text-xs font-bold text-[var(--text-secondary)] leading-relaxed">
              {feedback}
              {calculatedChoice != null && (
                <div className="text-[11px] text-[var(--text-tertiary)] mt-1 font-mono">
                  Lựa chọn của bạn: {calculatedChoice.toFixed(2)} M
                </div>
              )}
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleNextCase}
              className="font-black bg-[var(--chem-fill)] text-white shadow-md flex items-center justify-center gap-2"
            >
              <span>CHUYỂN SANG MẪU THỬ TIẾP THEO</span>
              <Sparkles className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </MinigameShell>
  );
};
