import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Eye,
  Flame,
  Sparkles,
} from 'lucide-react';
import { MinigameShell, Button, MathText } from '@/design-system';
import { sound } from '@/lib/audio';
import { useUserStore } from '@/features/gamification/useUserStore';

interface OpticsScenario {
  id: string;
  candleDistance: number; // d in cm
  focalLength: number; // f in cm (e.g. 10 cm)
  title: string;
  expectedImageDistance: number; // d' = (d * f) / (d - f)
  expectedNature: 'that-nguoc-nho' | 'that-nguoc-bang' | 'that-nguoc-lon' | 'ao-cung-chieu-lon';
  natureLabel: string;
  explanation: string;
}

const SCENARIOS: OpticsScenario[] = [
  {
    id: 's1',
    candleDistance: 30, // d = 30 cm > 2f (20 cm)
    focalLength: 10,
    title: 'Đặt vật ngoài khoảng 2f (d = 30 cm)',
    expectedImageDistance: 15, // d' = (30 * 10) / (30 - 10) = 300 / 20 = 15 cm
    expectedNature: 'that-nguoc-nho',
    natureLabel: 'Ảnh thật, ngược chiều, nhỏ hơn vật',
    explanation: 'Khi vật ở rất xa ($d > 2f$), thấu kính hội tụ cho ảnh thật, ngược chiều và nhỏ hơn vật, nằm trong khoảng $f < d\' < 2f$ ($10 < 15 < 20\\text{ cm}$).',
  },
  {
    id: 's2',
    candleDistance: 20, // d = 20 cm = 2f
    focalLength: 10,
    title: 'Đặt vật đúng điểm 2f (d = 20 cm)',
    expectedImageDistance: 20, // d' = 20 cm
    expectedNature: 'that-nguoc-bang',
    natureLabel: 'Ảnh thật, ngược chiều, bằng vật',
    explanation: 'Khi $d = 2f = 20\\text{ cm}$, theo tính chất đối xứng qua quang tâm, ảnh thật ngược chiều có độ lớn bằng vật và cách thấu kính đúng $d\' = 2f = 20\\text{ cm}$.',
  },
  {
    id: 's3',
    candleDistance: 15, // f < d < 2f (10 < 15 < 20)
    focalLength: 10,
    title: 'Đặt vật trong khoảng f đến 2f (d = 15 cm)',
    expectedImageDistance: 30, // d' = (15 * 10) / 5 = 30 cm
    expectedNature: 'that-nguoc-lon',
    natureLabel: 'Ảnh thật, ngược chiều, lớn hơn vật (máy chiếu)',
    explanation: 'Khi $f < d < 2f$, ảnh hứng được trên màn là ảnh thật, ngược chiều và lớn hơn vật ($d\' = 30\\text{ cm} > 2f$). Đây là nguyên lý của máy chiếu phim và máy ảnh phóng to.',
  },
];

export const OpticsBenchGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { addXp } = useUserStore();

  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [screenDistance, setScreenDistance] = useState(25); // d' slider in cm (10 to 40)
  const [selectedNature, setSelectedNature] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const scenario = SCENARIOS[scenarioIndex % SCENARIOS.length];
  const distDiff = Math.abs(screenDistance - scenario.expectedImageDistance);

  // Sharpness blur calculation (0px blur when aligned within 1.5 cm)
  const blurPx = Math.min(8, Math.round(distDiff * 0.8 * 10) / 10);
  const isScreenInFocus = distDiff <= 2.0;

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

  const handleCheck = () => {
    if (!selectedNature) {
      sound.playWrong();
      setFeedback('Hãy chọn tính chất của ảnh trước khi chốt kết quả nhé!');
      return;
    }

    setIsSubmitted(true);
    const natureCorrect = selectedNature === scenario.expectedNature;
    const focusCorrect = isScreenInFocus;

    if (focusCorrect && natureCorrect) {
      sound.playCorrect();
      setScore((s) => s + 100 + combo * 20);
      setCombo((c) => c + 1);
      setFeedback('Xuất sắc! Màn hứng ảnh đã lấy nét sắc nét và bạn đã chọn đúng tính chất quang học của ảnh.');
    } else if (focusCorrect && !natureCorrect) {
      sound.playWrong();
      setCombo(0);
      setScore((s) => s + 40);
      setFeedback(`Màn hứng lấy nét rất tốt (${screenDistance} cm), nhưng tính chất ảnh đúng là: "${scenario.natureLabel}".`);
    } else {
      sound.playWrong();
      setCombo(0);
      setFeedback(`Chưa chính xác. Vị trí ảnh sắc nét đúng phải là d' = ${scenario.expectedImageDistance} cm và "${scenario.natureLabel}".`);
    }
  };

  const handleNextScenario = () => {
    sound.playClick();
    setIsSubmitted(false);
    setSelectedNature(null);
    setFeedback(null);
    setScreenDistance(20);
    setScenarioIndex((i) => i + 1);
  };

  const handleRestart = () => {
    sound.playClick();
    setScenarioIndex(0);
    setScreenDistance(20);
    setSelectedNature(null);
    setScore(0);
    setCombo(0);
    setTimeLeft(60);
    setIsGameOver(false);
    setEarnedXp(0);
    setIsSubmitted(false);
    setFeedback(null);
  };

  const natureOptions = [
    { id: 'that-nguoc-nho', label: 'Ảnh thật, ngược chiều, nhỏ hơn vật' },
    { id: 'that-nguoc-bang', label: 'Ảnh thật, ngược chiều, bằng vật' },
    { id: 'that-nguoc-lon', label: 'Ảnh thật, ngược chiều, lớn hơn vật' },
    { id: 'ao-cung-chieu-lon', label: 'Ảnh ảo, cùng chiều, lớn hơn vật' },
  ];

  return (
    <MinigameShell
      title="Bàn Quang Học Thấu Kính Hội Tụ"
      description="Kéo màn hứng ảnh lấy nét & giải mã tính chất thấu kính!"
      icon={<Eye className="w-5 h-5 text-[var(--phy-fg)]" />}
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
        {/* Scenario Card */}
        <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--phy-fg)]">
              Thử thách {scenarioIndex + 1}
            </span>
            <h2 className="text-sm font-black text-[var(--text-primary)]">{scenario.title}</h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Tiêu cự thấu kính: <span className="font-bold text-[var(--text-primary)]">f = {scenario.focalLength} cm</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-[var(--text-tertiary)] block">Vị trí vật d</span>
            <span className="text-base font-black font-mono text-[var(--phy-fg)]">
              {scenario.candleDistance} cm
            </span>
          </div>
        </div>

        {/* Optical Bench Graphic Viewport */}
        <div className="relative p-4 rounded-3xl bg-[var(--bg-surface-2)] border border-[var(--border)] min-h-[200px] flex flex-col justify-between overflow-hidden">
          <div className="text-[10px] font-bold text-[var(--text-tertiary)] text-center">
            TRỤC CHÍNH QUANG HỌC & TIA SÁNG ĐẶC BIỆT
          </div>

          {/* Interactive Bench Visualizer */}
          <div className="relative w-full h-32 flex items-center justify-center my-1">
            {/* Main Axis Line */}
            <div className="absolute w-full h-0.5 bg-[var(--border-strong)]" />

            {/* Candle Object (Left) */}
            <div className="absolute left-6 flex flex-col items-center z-10">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse fill-amber-400" />
              <div className="w-2.5 h-10 bg-amber-200 border border-amber-500 rounded-sm" />
              <span className="text-[9px] font-black text-[var(--text-secondary)] mt-1">
                Vật (d={scenario.candleDistance})
              </span>
            </div>

            {/* Convex Lens (Center) */}
            <div className="relative flex flex-col items-center z-10">
              <div className="w-3.5 h-24 rounded-full border-2 border-cyan-400 bg-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.4)] flex items-center justify-center">
                <span className="text-[8px] font-mono text-cyan-200 font-bold">O</span>
              </div>
              <span className="text-[9px] font-black text-cyan-400 mt-1">TK Hội tụ</span>
            </div>

            {/* Focal point F' on right */}
            <div className="absolute left-[62%] flex flex-col items-center pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
              <span className="text-[8px] font-mono text-cyan-300 font-bold">F'</span>
            </div>

            {/* Screen (Màn Chắn Hứng Ảnh - Right) */}
            <div
              className="absolute flex flex-col items-center transition-all duration-150 z-20"
              style={{
                left: `${Math.min(88, Math.max(55, 50 + (screenDistance / 40) * 40))}%`,
              }}
            >
              <div className="w-5 h-24 rounded-md border-2 border-slate-300 bg-slate-100 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                {/* Projected inverted candle image with blur filter */}
                <motion.div
                  style={{
                    filter: `blur(${blurPx}px)`,
                    transform: 'rotate(180deg)',
                  }}
                  className="flex flex-col items-center"
                >
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <div className="w-2 h-7 bg-amber-300 border border-amber-600 rounded-sm" />
                </motion.div>
              </div>
              <span className="text-[9px] font-black text-[var(--text-primary)] mt-1">
                Màn (d'={screenDistance})
              </span>
            </div>
          </div>

          {/* Focus indicator pill */}
          <div className="flex items-center justify-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black border ${
                isScreenInFocus
                  ? 'bg-[var(--ok-tint)] border-[var(--ok-fill)] text-[var(--ok-fg)]'
                  : 'bg-[var(--warn-tint)] border-[var(--warn-edge)] text-[var(--warn-fg)]'
              }`}
            >
              {isScreenInFocus ? '✨ Ảnh sắc nét (Đúng vị trí ảnh thật!)' : `Độ mờ: ${blurPx.toFixed(1)}px (Chưa lấy nét)`}
            </span>
          </div>
        </div>

        {/* Screen Distance Slider */}
        <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-[var(--text-secondary)]">Kéo màn hứng ảnh để tìm vị trí nét nhất:</span>
            <span className="font-mono text-[var(--phy-fg)] font-black">d' = {screenDistance} cm</span>
          </div>
          <input
            type="range"
            min={10}
            max={40}
            step={1}
            value={screenDistance}
            onChange={(e) => setScreenDistance(Number(e.target.value))}
            className="w-full accent-[var(--phy-fill)] cursor-pointer h-2 bg-[var(--bg-surface-2)] rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-bold text-[var(--text-tertiary)]">
            <span>10 cm (Gần thấu kính)</span>
            <span>40 cm (Xa thấu kính)</span>
          </div>
        </div>

        {/* Nature of Image Selector */}
        <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-2">
          <span className="text-xs font-black text-[var(--text-primary)] block">
            Chọn tính chất của ảnh hứng được:
          </span>
          <div className="space-y-1.5">
            {natureOptions.map((opt) => {
              const isSelected = selectedNature === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedNature(opt.id);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--phy-tint)] border-[var(--phy-fill)] text-[var(--text-primary)] shadow-sm'
                      : 'bg-[var(--bg-surface-2)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit or Next */}
        {!isSubmitted ? (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleCheck}
            className="font-black bg-[var(--phy-fill)] text-white shadow-md flex items-center justify-center gap-2"
          >
            <span>KHÓA NÉT ẢNH & KIỂM TRA</span>
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
              <MathText text={scenario.explanation} />
            </div>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleNextScenario}
              className="font-black bg-[var(--phy-fill)] text-white shadow-md flex items-center justify-center gap-2"
            >
              <span>THỬ THÁCH TIẾP THEO</span>
              <Sparkles className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </MinigameShell>
  );
};
