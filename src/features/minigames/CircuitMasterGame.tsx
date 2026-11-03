import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  Lightbulb,
  Gauge,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { MinigameShell, Button, MathText } from '@/design-system';
import { sound } from '@/lib/audio';
import { useUserStore } from '@/features/gamification/useUserStore';

interface CircuitMission {
  id: string;
  title: string;
  description: string;
  voltage: number; // Volts (pin supply)
  lampRatedVoltage: number; // e.g. 6V
  lampResistance: number; // e.g. 10 ohms
  targetCurrentMin: number; // Amperes
  targetCurrentMax: number; // Amperes
  explanation: string;
}

const MISSIONS: CircuitMission[] = [
  {
    id: 'm1',
    title: 'Thắp sáng bóng đèn 6V tiêu chuẩn',
    description: 'Điều chỉnh biến trở con chạy để cường độ dòng điện đạt trong khoảng 0.45 A - 0.55 A!',
    voltage: 9.0, // 9V
    lampRatedVoltage: 6.0,
    lampResistance: 10.0, // 10 ohms -> R_total = 10 + R_rheostat -> I = 9 / (10 + R) -> R needs to be ~8 ohms for 0.5A
    targetCurrentMin: 0.45,
    targetCurrentMax: 0.55,
    explanation: 'Theo định luật Ohm: $I = \\frac{U}{R_{\\text{toàn mạch}}}$. Khi $R_b \\approx 8\\,\\Omega$, $I = \\frac{9}{10 + 8} = 0.5\\text{ A}$, đèn sáng đúng định mức.',
  },
  {
    id: 'm2',
    title: 'Chế độ tiết kiệm năng lượng ban đêm',
    description: 'Tăng điện trở biến trở để dòng điện qua đèn giảm xuống mức 0.25 A - 0.32 A (đèn sáng dịu)!',
    voltage: 9.0,
    lampRatedVoltage: 6.0,
    lampResistance: 10.0,
    targetCurrentMin: 0.25,
    targetCurrentMax: 0.32,
    explanation: 'Khi tăng biến trở lên khoảng $18 - 22\\,\\Omega$, điện trở toàn mạch tăng khiến cường độ dòng điện $I$ giảm xuống $\\sim 0.3\\text{ A}$.',
  },
  {
    id: 'm3',
    title: 'Tối ưu nguồn điện mạnh 12V',
    description: 'Chỉnh biến trở để bảo vệ bóng đèn 6V không bị cháy, duy trì dòng điện 0.38 A - 0.44 A!',
    voltage: 12.0,
    lampRatedVoltage: 6.0,
    lampResistance: 10.0,
    targetCurrentMin: 0.38,
    targetCurrentMax: 0.44,
    explanation: 'Nguồn $12\\text{ V}$ lớn hơn định mức $6\\text{ V}$ của đèn, bắt buộc biến trở phải gánh bớt điện áp: $R_b \\approx 18\\,\\Omega$ để $I \\approx 0.43\\text{ A}$.',
  },
];

export const CircuitMasterGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { addXp } = useUserStore();

  const [missionIndex, setMissionIndex] = useState(0);
  const [switchClosed, setSwitchClosed] = useState(false);
  const [rheostatVal, setRheostatVal] = useState(15); // ohms, 0 to 30
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const mission = MISSIONS[missionIndex % MISSIONS.length];

  // Physics calculation
  const totalResistance = mission.lampResistance + rheostatVal;
  const current = switchClosed ? Math.round((mission.voltage / totalResistance) * 100) / 100 : 0;
  const lampVoltage = switchClosed ? Math.round((current * mission.lampResistance) * 10) / 10 : 0;

  // Lamp brightness status
  let brightness = 0; // 0 to 1
  let lampStatus = 'Đèn tắt (công tắc K mở)';

  if (switchClosed) {
    if (current < 0.2) {
      brightness = 0.2;
      lampStatus = 'Đèn sáng rất mờ (dòng điện quá nhỏ)';
    } else if (current >= mission.targetCurrentMin && current <= mission.targetCurrentMax) {
      brightness = 0.85;
      lampStatus = '✨ Đèn sáng chuẩn định mức!';
    } else if (current > 0.7) {
      brightness = 1.0;
      lampStatus = '⚠️ Đèn quá sáng, nguy cơ đứt dây tóc!';
    } else {
      brightness = 0.5;
      lampStatus = 'Đèn sáng vừa';
    }
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

  const handleToggleSwitch = () => {
    sound.playClick();
    setSwitchClosed((prev) => !prev);
  };

  const handleRheostatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRheostatVal(Number(e.target.value));
  };

  const handleCheckMission = () => {
    if (!switchClosed) {
      sound.playWrong();
      setFeedback('Hãy đóng công tắc K để mạch điện kín trước khi đo đạc nhé!');
      return;
    }

    setIsSubmitted(true);
    const inTarget = current >= mission.targetCurrentMin && current <= mission.targetCurrentMax;

    if (inTarget) {
      sound.playCorrect();
      setScore((s) => s + 100 + combo * 20);
      setCombo((c) => c + 1);
      setFeedback('Chính xác tuyệt đối! Cường độ dòng điện đạt đúng mục tiêu nhiệm vụ.');
    } else {
      sound.playWrong();
      setCombo(0);
      setFeedback(`Chưa đạt. Dòng điện hiện tại là ${current} A, cần nằm trong khoảng ${mission.targetCurrentMin} A - ${mission.targetCurrentMax} A.`);
    }
  };

  const handleNextMission = () => {
    sound.playClick();
    setIsSubmitted(false);
    setFeedback(null);
    setSwitchClosed(false);
    setRheostatVal(15);
    setMissionIndex((i) => i + 1);
  };

  const handleRestart = () => {
    sound.playClick();
    setMissionIndex(0);
    setSwitchClosed(false);
    setRheostatVal(15);
    setScore(0);
    setCombo(0);
    setTimeLeft(60);
    setIsGameOver(false);
    setEarnedXp(0);
    setIsSubmitted(false);
    setFeedback(null);
  };

  return (
    <MinigameShell
      title="Thợ Nối Mạch Điện Thực Hành"
      description="Thao tác đóng khóa K, chỉnh biến trở & đo dòng điện Ohm!"
      icon={<Zap className="w-5 h-5 text-[var(--phy-fg)]" />}
      timeLeft={timeLeft}
      totalTime={60}
      score={score}
      combo={combo}
      isGameOver={isGameOver}
      earnedXp={earnedXp}
      onExit={onExit}
      onRestart={handleRestart}
    >
      <div className="space-y-4 select-none">
        {/* Mission Card */}
        <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--phy-fg)]">
              Nhiệm vụ {missionIndex + 1}
            </span>
            <span className="text-xs font-bold text-[var(--text-tertiary)]">
              Nguồn U = {mission.voltage} V
            </span>
          </div>
          <h2 className="text-sm font-black text-[var(--text-primary)]">{mission.title}</h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{mission.description}</p>
        </div>

        {/* Interactive Circuit Canvas */}
        <div className="relative p-5 rounded-3xl bg-[var(--bg-surface-2)] border border-[var(--border)] flex flex-col items-center justify-between min-h-[220px]">
          {/* Top Branch: Power Supply & Switch K */}
          <div className="w-full flex items-center justify-between px-4">
            {/* Battery */}
            <div className="flex flex-col items-center">
              <div className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] text-xs font-black text-[var(--text-primary)]">
                [+ ||| -] {mission.voltage}V
              </div>
              <span className="text-[10px] font-bold text-[var(--text-tertiary)] mt-0.5">Nguồn Pin</span>
            </div>

            {/* Wire segment with electron animation */}
            <div className="flex-1 mx-2 h-0.5 bg-[var(--border-strong)] relative overflow-hidden">
              {switchClosed && (
                <motion.div
                  className="w-3 h-1 bg-yellow-400 rounded-full"
                  animate={{ x: [0, 80] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                />
              )}
            </div>

            {/* Switch K Button */}
            <button
              onClick={handleToggleSwitch}
              className={`px-3 py-1.5 rounded-xl border-2 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                switchClosed
                  ? 'bg-[var(--ok-tint)] border-[var(--ok-fill)] text-[var(--ok-fg)] shadow-sm'
                  : 'bg-[var(--err-tint)] border-[var(--err-fill)] text-[var(--err-fg)]'
              }`}
            >
              <span>{switchClosed ? 'Khóa K: ĐÓNG' : 'Khóa K: MỞ'}</span>
            </button>
          </div>

          {/* Center Branch: Lamp & Rheostat */}
          <div className="w-full flex items-center justify-around my-4 px-2">
            {/* Lamp Bulb */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  scale: switchClosed ? [1, 1.05, 1] : 1,
                  filter: `drop-shadow(0 0 ${brightness * 16}px rgba(234, 179, 8, ${brightness}))`,
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-colors ${
                  switchClosed && brightness > 0.3
                    ? 'bg-yellow-400 text-slate-900 border-yellow-300'
                    : 'bg-[var(--bg-surface)] text-[var(--text-tertiary)] border-[var(--border)]'
                }`}
              >
                <Lightbulb className="w-7 h-7 stroke-[2.5]" />
              </motion.div>
              <span className="text-[10px] font-bold text-[var(--text-primary)] mt-1">Đèn ({mission.lampRatedVoltage}V)</span>
            </div>

            {/* Rheostat */}
            <div className="flex flex-col items-center">
              <div className="w-24 p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-center">
                <Sliders className="w-4 h-4 mx-auto text-[var(--phy-fg)] mb-1" />
                <span className="text-xs font-black text-[var(--phy-fg)] font-mono">{rheostatVal} Ω</span>
              </div>
              <span className="text-[10px] font-bold text-[var(--text-tertiary)] mt-1">Biến trở $R_b$</span>
            </div>
          </div>

          {/* Bottom Meters: Ammeter & Voltmeter */}
          <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border)]">
            <div className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] block font-bold">Ampe kế ($A$)</span>
                <span className="text-sm font-black font-mono text-[var(--text-primary)]">{current.toFixed(2)} A</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center gap-2">
              <Gauge className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-[var(--text-tertiary)] block font-bold">Vôn kế ($V$)</span>
                <span className="text-sm font-black font-mono text-[var(--text-primary)]">{lampVoltage.toFixed(1)} V</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status text */}
        <div className="text-center text-xs font-bold text-[var(--text-secondary)]">
          {lampStatus}
        </div>

        {/* Rheostat Slider Control */}
        <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-[var(--text-secondary)]">Điều chỉnh con chạy biến trở:</span>
            <span className="font-mono text-[var(--phy-fg)] font-black">{rheostatVal} Ω</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={rheostatVal}
            onChange={handleRheostatChange}
            className="w-full accent-[var(--phy-fill)] cursor-pointer h-2 bg-[var(--bg-surface-2)] rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-bold text-[var(--text-tertiary)]">
            <span>0 Ω (Điện trở nhỏ nhất)</span>
            <span>30 Ω (Điện trở lớn nhất)</span>
          </div>
        </div>

        {/* Submit / Next button */}
        {!isSubmitted ? (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleCheckMission}
            className="font-black bg-[var(--phy-fill)] text-white shadow-md flex items-center justify-center gap-2"
          >
            <span>KIỂM TRA DÒNG ĐIỆN & CHỐT ĐIỂM</span>
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-3"
          >
            <div className="text-xs font-bold text-[var(--text-secondary)] leading-relaxed">
              {feedback}
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-xs text-[var(--text-primary)]">
              <MathText text={mission.explanation} />
            </div>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleNextMission}
              className="font-black bg-[var(--phy-fill)] text-white shadow-md flex items-center justify-center gap-2"
            >
              <span>NHIỆM VỤ TIẾP THEO</span>
              <Sparkles className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </MinigameShell>
  );
};
