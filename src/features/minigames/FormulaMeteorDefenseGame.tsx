import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Flame, Crosshair, Shield } from 'lucide-react';
import { MinigameShell, Formula, Button } from '@/design-system';
import { sound } from '@/lib/audio';
import { haptic } from '@/lib/haptic';
import { useUserStore } from '@/features/gamification/useUserStore';

interface MeteorTarget {
  id: string;
  name: string;
  formula: string;
  hint: string;
  timeLimit: number;
  threatLevel: 'Bình thường' | 'Nguy hiểm' | 'Cực đại';
}

const METEOR_TARGETS: MeteorTarget[] = [
  {
    id: 'm-1',
    name: 'Khí carbon dioxide',
    formula: 'CO2',
    hint: 'Gồm 1 nguyên tử C và 2 nguyên tử O',
    timeLimit: 14,
    threatLevel: 'Bình thường',
  },
  {
    id: 'm-2',
    name: 'Phân tử Nước',
    formula: 'H2O',
    hint: '2 nguyên tử H liên kết 1 nguyên tử O',
    timeLimit: 12,
    threatLevel: 'Bình thường',
  },
  {
    id: 'm-3',
    name: 'Sulfuric acid (Vua hóa chất)',
    formula: 'H2SO4',
    hint: 'Acid mạnh gồm 2 nguyên tử H và gốc sulfate SO4',
    timeLimit: 12,
    threatLevel: 'Nguy hiểm',
  },
  {
    id: 'm-4',
    name: 'Khí Amoniac',
    formula: 'NH3',
    hint: 'Khí mùi khai xốc gồm 1 nguyên tử N và 3 nguyên tử H',
    timeLimit: 10,
    threatLevel: 'Bình thường',
  },
  {
    id: 'm-5',
    name: 'Muối ăn (Natri Clorua)',
    formula: 'NaCl',
    hint: 'Hợp chất ion giữa kim loại kiềm Na và phi kim Cl',
    timeLimit: 10,
    threatLevel: 'Bình thường',
  },
  {
    id: 'm-6',
    name: 'Nước vôi trong (Calcium hydroxide)',
    formula: 'Ca(OH)2',
    hint: 'Base gồm kim loại Ca hóa trị II và nhóm OH',
    timeLimit: 10,
    threatLevel: 'Nguy hiểm',
  },
  {
    id: 'm-7',
    name: 'Khí Metan (Khí bùn ao)',
    formula: 'CH4',
    hint: 'Hydrocarbon đơn giản nhất gồm 1C và 4H',
    timeLimit: 10,
    threatLevel: 'Bình thường',
  },
  {
    id: 'm-8',
    name: 'Sắt(III) Oxide (Gỉ sắt)',
    formula: 'Fe2O3',
    hint: 'Oxide base gồm Fe hóa trị III và O hóa trị II',
    timeLimit: 10,
    threatLevel: 'Nguy hiểm',
  },
  {
    id: 'm-9',
    name: 'Copper(II) sulfate',
    formula: 'CuSO4',
    hint: 'Muối màu xanh lam gồm Cu và gốc SO4',
    timeLimit: 9,
    threatLevel: 'Nguy hiểm',
  },
  {
    id: 'm-10',
    name: 'Calcium carbonate (Đá vôi)',
    formula: 'CaCO3',
    hint: 'Muối kết tủa trắng tạo nên thạch nhũ hang động',
    timeLimit: 9,
    threatLevel: 'Nguy hiểm',
  },
  {
    id: 'm-11',
    name: 'Nhôm Oxide',
    formula: 'Al2O3',
    hint: 'Lớp màng bảo vệ kim loại nhôm (Al hóa trị III, O hóa trị II)',
    timeLimit: 8,
    threatLevel: 'Nguy hiểm',
  },
  {
    id: 'm-12',
    name: 'Đường Glucose (Thiên thạch boss!)',
    formula: 'C6H12O6',
    hint: 'Monosaccharide cung cấp năng lượng gồm 6C, 12H, 6O',
    timeLimit: 8,
    threatLevel: 'Cực đại',
  },
];

const QUICK_KEYBOARD_TILES = [
  'H', 'C', 'O', 'N', 'S', 'Cl',
  'Na', 'Ca', 'Fe', 'Cu', 'Al', 'Ba',
  '(', ')', '2', '3', '4', '6',
];

export const FormulaMeteorDefenseGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { addXp, addGems } = useUserStore();

  const [waveIndex, setWaveIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [shields, setShields] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  const [laserFiring, setLaserFiring] = useState(false);
  const [exploding, setExploding] = useState(false);
  const [screenShaking, setScreenShaking] = useState(false);

  const currentMeteor = METEOR_TARGETS[waveIndex] || METEOR_TARGETS[0];
  const [timeLeft, setTimeLeft] = useState(currentMeteor.timeLimit);

  // Timer loop for active meteor descent
  useEffect(() => {
    if (isGameOver || isVictory || laserFiring || exploding) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleMeteorImpact();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [waveIndex, isGameOver, isVictory, laserFiring, exploding]);

  // Handle Meteor Crash into Lab
  const handleMeteorImpact = useCallback(() => {
    sound.playWrong();
    haptic.wrong();
    setScreenShaking(true);
    setTimeout(() => setScreenShaking(false), 500);

    setShields((prev) => {
      const nextShields = prev - 1;
      if (nextShields <= 0) {
        // Game Over
        setIsGameOver(true);
        // Cân bằng XP game: thất bại đạt tối đa 10 XP theo chuẩn minigame
        const xp = Math.min(10, Math.max(3, Math.round(score / 25)));
        setEarnedXp(xp);
        addXp(xp);
      } else {
        // Next meteor wave
        advanceToNextWave();
      }
      return nextShields;
    });
    setCombo(0);
  }, [score, addXp]);

  const advanceToNextWave = () => {
    setCurrentInput('');
    if (waveIndex + 1 < METEOR_TARGETS.length) {
      setWaveIndex((prev) => prev + 1);
      setTimeLeft(METEOR_TARGETS[waveIndex + 1].timeLimit);
    } else {
      // Victory! Defended all waves
      setIsVictory(true);
      setIsGameOver(true);
      // Cân bằng XP chuẩn: Hoàn thành xuất sắc toàn bộ đợt bắn thiên thạch nhận 25-30 XP và 5 Đá quý
      const finalXp = Math.min(30, 20 + Math.round(score / 50));
      setEarnedXp(finalXp);
      addXp(finalXp);
      addGems(5);
      sound.playLevelUp();
      haptic.completion();
    }
  };

  const handleTileClick = (tile: string) => {
    sound.playClick();
    haptic.tap();
    setCurrentInput((prev) => prev + tile);
  };

  const handleBackspace = () => {
    sound.playClick();
    haptic.tap();
    setCurrentInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    sound.playClick();
    haptic.tap();
    setCurrentInput('');
  };

  // Fire Defense Laser
  const handleFireCannon = () => {
    if (!currentInput.trim()) return;

    const normalizedInput = currentInput.trim().toUpperCase().replace(/\s+/g, '');
    const normalizedTarget = currentMeteor.formula.toUpperCase().replace(/\s+/g, '');

    if (normalizedInput === normalizedTarget) {
      // Correct formula! Shoot laser and destroy meteor
      sound.playCorrect();
      haptic.correct();
      setLaserFiring(true);

      // Điểm arcade hợp lý: 15-25 điểm/đợt, tổng điểm ~180-250 điểm
      const wavePoints = 15 + Math.min(10, combo * 2) + Math.round(timeLeft);
      setScore((s) => s + wavePoints);
      setCombo((c) => c + 1);

      setTimeout(() => {
        setLaserFiring(false);
        setExploding(true);
      }, 350);

      setTimeout(() => {
        setExploding(false);
        advanceToNextWave();
      }, 850);
    } else {
      // Incorrect formula
      sound.playWrong();
      haptic.wrong();
      setCombo(0);
      setScreenShaking(true);
      setTimeout(() => setScreenShaking(false), 350);
    }
  };

  const restartGame = () => {
    setWaveIndex(0);
    setCurrentInput('');
    setShields(3);
    setScore(0);
    setCombo(0);
    setIsGameOver(false);
    setIsVictory(false);
    setEarnedXp(0);
    setTimeLeft(METEOR_TARGETS[0].timeLimit);
  };

  const timeProgress = (timeLeft / currentMeteor.timeLimit) * 100;
  const isTimeCritical = timeLeft <= 4;

  return (
    <MinigameShell
      title="Bắn phá thiên thạch vũ trụ"
      description="Nhập đúng công thức hóa học để kích hoạt pháo laser tiêu diệt thiên thạch trước khi va chạm!"
      icon={<Shield className="w-5 h-5 text-[var(--chem-fg)]" />}
      score={score}
      combo={combo}
      timeLeft={timeLeft}
      totalTime={currentMeteor.timeLimit}
      isGameOver={isGameOver}
      earnedXp={earnedXp}
      onExit={onExit}
      onRestart={restartGame}
    >
      <div className={`space-y-4 ${screenShaking ? 'animate-bounce' : ''}`}>
        {/* ─── 1. Cosmic Defense Status Bar ─── */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-[var(--text-secondary)] ">
              ĐỢT: {waveIndex + 1}/{METEOR_TARGETS.length}
            </span>
            <span
              className={`text-[11px] font-black px-2 py-0.5 rounded-md border ${
                currentMeteor.threatLevel === 'Cực đại'
                  ? 'bg-rose-500/20 text-rose-500 border-rose-500/40 '
                  : currentMeteor.threatLevel === 'Nguy hiểm'
                  ? 'bg-amber-500/20 text-amber-600 border-amber-500/40'
                  : 'bg-sky-500/20 text-sky-600 border-sky-500/40'
              }`}
            >
              {currentMeteor.threatLevel}
            </span>
          </div>

          {/* Shields Display */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-[var(--text-secondary)] mr-1">Khiên trạm:</span>
            {[0, 1, 2].map((idx) => (
              <span
                key={idx}
                className={`text-sm transition-transform duration-200 ${
                  idx < shields ? 'text-[var(--chem-fg)]' : 'text-[var(--text-tertiary)] opacity-40'
                }`}
              >
                <Shield className="w-4 h-4" fill={idx < shields ? 'currentColor' : 'none'} />
              </span>
            ))}
          </div>
        </div>

        {/* ─── 2. Sky Radar: Fiery Meteor Descent Arena ─── */}
        <div className="relative h-64 sm:h-72 w-full rounded-3xl bg-[var(--bg-canvas)] border-2 border-[var(--border-strong)] overflow-hidden shadow-inner flex flex-col justify-between p-4">
          {/* Cosmic Starry background dots */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-4 left-10 w-1 h-1 bg-white rounded-full animate-ping" />
            <div className="absolute top-16 right-12 w-1.5 h-1.5 bg-cyan-300 rounded-full" />
            <div className="absolute top-28 left-1/3 w-1 h-1 bg-amber-200 rounded-full" />
            <div className="absolute bottom-16 right-20 w-1.5 h-1.5 bg-white rounded-full" />
          </div>

          {/* Laser Cannon Beam upward */}
          <AnimatePresence>
            {laserFiring && (
              <motion.div
                initial={{ height: 0, opacity: 0.9 }}
                animate={{ height: '100%', opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute left-1/2 -translate-x-1/2 bottom-8 w-4 rounded-full z-20 pointer-events-none bg-cyan-400"
              />
            )}
          </AnimatePresence>

          {/* Exploding Dust Burst */}
          <AnimatePresence>
            {exploding && (
              <motion.div
                initial={{ scale: 0.3, opacity: 1 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute left-1/2 -translate-x-1/2 top-14 w-28 h-28 rounded-full flex items-center justify-center z-30 pointer-events-none bg-amber-400/70"
              />
            )}
          </AnimatePresence>

          {/* Descending Fiery Meteor */}
          {!exploding && (
            <motion.div
              animate={{
                y: [0, (1 - timeProgress / 100) * 110],
                rotate: [-4, 4, -4],
              }}
              transition={{
                y: { duration: 0.5, ease: 'easeOut' },
                rotate: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
              }}
              className="relative z-10 flex flex-col items-center mx-auto"
            >
              {/* Fiery meteor rock */}
              <div
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-4 border-amber-300 ${
                  isTimeCritical ? 'bg-[var(--err-fill)]' : 'bg-amber-600'
                }`}
              >
                {/* Fire tail flames */}
                <div className="absolute -top-6 w-10 h-10 rounded-full blur-xs opacity-80 bg-orange-500" />
                <Flame className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-100 drop-shadow-md animate-bounce" />
                <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-slate-950/90 text-amber-300 text-[11px] font-black font-mono border border-amber-400">
                  {timeLeft}s
                </span>
              </div>

              {/* Target Chemical Name Billboard */}
              <div className="mt-2.5 px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-amber-400/80 text-center shadow-lg backdrop-blur-md max-w-[280px]">
                <div className="text-xs sm:text-sm font-black text-[var(--text-primary)] leading-tight">
                  {currentMeteor.name}
                </div>
                <div className="text-[11px] text-[var(--gold-fg)] mt-0.5 font-medium">
                  {currentMeteor.hint}
                </div>
              </div>
            </motion.div>
          )}

          {/* Ground Laser Cannon Base */}
          <div className="relative z-10 flex items-center justify-between border-t border-slate-700/60 pt-2 mt-auto">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Crosshair className="w-4 h-4 text-[var(--chem-fg)]" />
              <span>Pháo laser photon</span>
            </div>
            <div className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40">
              {laserFiring ? 'Đang bắn tia...' : 'Sẵn sàng khai hỏa'}
            </div>
          </div>
        </div>

        {/* ─── 3. Assembled Weapon Chamber (Aiming Reticle) ─── */}
        <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border)] shadow-xs flex items-center justify-between gap-3">
          <div className="flex-1 flex items-center gap-2 min-h-[44px] px-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)]">
            <span className="text-xs font-black text-[var(--text-tertiary)] shrink-0">
              Đạn hóa học:
            </span>
            <div className="flex-1 text-center text-xl sm:text-2xl font-black text-[var(--subject-fg)] font-mono ">
              {currentInput ? (
                <Formula formula={currentInput} />
              ) : (
                <span className="text-xs font-normal text-[var(--text-tertiary)] italic">
                  Nhấn các mảnh bên dưới để ghép công thức...
                </span>
              )}
            </div>
          </div>

          {/* Clear & Backspace */}
          <button
            onClick={handleBackspace}
            className="p-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors cursor-pointer active:scale-95"
            title="Xóa 1 ký tự"
          >
            ⌫
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-xs font-black text-[var(--err-fg)] hover:bg-rose-500/10 transition-colors cursor-pointer active:scale-95"
            title="Xóa trắng"
          >
            XÓA
          </button>
        </div>

        {/* ─── 4. Quick Element & Subscript Keyboard ─── */}
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {QUICK_KEYBOARD_TILES.map((tile) => (
            <button
              key={tile}
              onClick={() => handleTileClick(tile)}
              className="py-2.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-2)] text-[var(--text-primary)] border-2 border-[var(--border-strong)] shadow-[0_3px_0_0_var(--edge-neutral)] active:translate-y-[2px] active:shadow-none font-black text-sm sm:text-base font-mono transition-all cursor-pointer"
            >
              {tile}
            </button>
          ))}
        </div>

        {/* ─── 5. BIG FIRE CANNON BUTTON ─── */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!currentInput.trim() || laserFiring || exploding}
          onClick={handleFireCannon}
          className="text-base font-black py-4 shadow-[0_6px_0_0_var(--subject-edge)] active:translate-y-[4px] active:shadow-none flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5 fill-current" />
          <span>Bắn pháo laser tiêu diệt thiên thạch</span>
        </Button>
      </div>
    </MinigameShell>
  );
};

