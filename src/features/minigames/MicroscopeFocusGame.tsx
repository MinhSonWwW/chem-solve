import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Search,
  Crosshair,
} from 'lucide-react';
import { MinigameShell, Button, MathText } from '@/design-system';
import { sound } from '@/lib/audio';
import { useUserStore } from '@/features/gamification/useUserStore';

interface SpecimenCase {
  id: string;
  name: string; // Tên mẫu tiêu bản
  magnification: string; // Độ phóng đại: 100x, 400x
  targetCoarse: number; // Điểm nét thô (0 to 100)
  targetFine: number; // Điểm nét tinh (0 to 100)
  question: string;
  organelles: { id: string; label: string; x: number; y: number }[]; // Tọa độ phần trăm
  correctOrganelleId: string;
  explanation: string;
}

const SPECIMENS: SpecimenCase[] = [
  {
    id: 'onion-cell',
    name: 'Tế bào biểu bì vảy hành tây',
    magnification: '400x (Vật kính 40x × Thị kính 10x)',
    targetCoarse: 60,
    targetFine: 45,
    question: 'Chạm vào vị trí [Nhân tế bào] để xác nhận cấu trúc di truyền!',
    organelles: [
      { id: 'nucleus', label: 'Nhân tế bào (bắt màu iodine đậm)', x: 50, y: 48 },
      { id: 'wall', label: 'Thành tế bào cellulose', x: 20, y: 20 },
      { id: 'cytoplasm', label: 'Tế bào chất & không bào', x: 75, y: 65 },
    ],
    correctOrganelleId: 'nucleus',
    explanation: 'Ở tế bào thực vật vảy hành, nhân tế bào có dạng hình cầu bắt màu thuốc nhuộm tím/nâu sẫm rõ nhất, chứa vật chất di truyền DNA.',
  },
  {
    id: 'elodea-cell',
    name: 'Tế bào lá rong đuôi chó (rong đuôi chồn)',
    magnification: '400x',
    targetCoarse: 40,
    targetFine: 70,
    question: 'Chạm vào [Lục lạp] - bào quan quang hợp màu xanh lục!',
    organelles: [
      { id: 'chloroplast', label: 'Hạt lục lạp (chứa diệp lục tố)', x: 40, y: 35 },
      { id: 'wall', label: 'Thành tế bào', x: 80, y: 20 },
      { id: 'cytoplasm', label: 'Dòng tế bào chất luân chuyển', x: 60, y: 70 },
    ],
    correctOrganelleId: 'chloroplast',
    explanation: 'Lục lạp là bào quan đặc trưng của tế bào thực vật, chứa chất diệp lục hấp thu năng lượng ánh sáng để quang hợp tổng hợp chất hữu cơ.',
  },
  {
    id: 'cheek-cell',
    name: 'Tế bào biểu mô khoang miệng người',
    magnification: '400x',
    targetCoarse: 70,
    targetFine: 50,
    question: 'Chạm vào [Màng sinh chất] bao bọc bảo vệ tế bào động vật!',
    organelles: [
      { id: 'membrane', label: 'Màng sinh chất (không có thành tế bào)', x: 25, y: 40 },
      { id: 'nucleus', label: 'Nhân tế bào', x: 52, y: 50 },
      { id: 'cytoplasm', label: 'Tế bào chất', x: 68, y: 60 },
    ],
    correctOrganelleId: 'membrane',
    explanation: 'Tế bào động vật (như biểu mô niêm mạc miệng) không có thành cellulose vững chắc, chỉ được bao bọc bởi màng sinh chất mềm dẻo có tính bán thấm.',
  },
];

export const MicroscopeFocusGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { addXp } = useUserStore();

  const [specimenIndex, setSpecimenIndex] = useState(0);
  const [coarseVal, setCoarseVal] = useState(20); // ốc sơ cấp (0 to 100)
  const [fineVal, setFineVal] = useState(20); // ốc vi cấp (0 to 100)
  const [selectedOrganelle, setSelectedOrganelle] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(65);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const specimen = SPECIMENS[specimenIndex % SPECIMENS.length];

  // Calculate focus sharpness
  const coarseDiff = Math.abs(coarseVal - specimen.targetCoarse);
  const fineDiff = Math.abs(fineVal - specimen.targetFine);
  const totalDiff = coarseDiff * 0.7 + fineDiff * 0.3;
  const blurAmount = Math.min(12, Math.round(totalDiff * 0.25 * 10) / 10);
  const isSharp = blurAmount <= 1.5;

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

  const handleSelectOrganelle = (id: string) => {
    if (isSubmitted || isGameOver) return;
    sound.playClick();
    setSelectedOrganelle(id);

    if (!isSharp) {
      sound.playWrong();
      setFeedback('Tiêu bản còn quá mờ! Hãy vặn ốc sơ cấp và vi cấp để lấy nét trước khi bấm chọn.');
      return;
    }

    setIsSubmitted(true);
    if (id === specimen.correctOrganelleId) {
      sound.playCorrect();
      setScore((s) => s + 100 + combo * 20);
      setCombo((c) => c + 1);
      setFeedback('Chính xác tuyệt đối! Bạn đã lấy nét chuẩn và nhận diện đúng bào quan mục tiêu.');
    } else {
      sound.playWrong();
      setCombo(0);
      setFeedback('Bạn đã chỉ định chưa đúng bào quan theo yêu cầu.');
    }
  };

  const handleNextSpecimen = () => {
    sound.playClick();
    setIsSubmitted(false);
    setSelectedOrganelle(null);
    setFeedback(null);
    setCoarseVal(25);
    setFineVal(25);
    setSpecimenIndex((i) => i + 1);
  };

  const handleRestart = () => {
    sound.playClick();
    setSpecimenIndex(0);
    setCoarseVal(25);
    setFineVal(25);
    setSelectedOrganelle(null);
    setScore(0);
    setCombo(0);
    setTimeLeft(65);
    setIsGameOver(false);
    setEarnedXp(0);
    setIsSubmitted(false);
    setFeedback(null);
  };

  return (
    <MinigameShell
      title="Thao Tác Kính Hiển Vi Soi Tế Bào"
      description="Vặn ốc sơ cấp, vi cấp lấy nét & giải phẫu bào quan!"
      icon={<Search className="w-5 h-5 text-[var(--bio-fg)]" />}
      timeLeft={timeLeft}
      totalTime={65}
      score={score}
      combo={combo}
      isGameOver={isGameOver}
      earnedXp={earnedXp}
      onExit={onExit}
      onRestart={handleRestart}
    >
      <div className="space-y-4 select-none">
        {/* Specimen Case Header */}
        <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--bio-fg)]">
              Tiêu bản {specimenIndex + 1}
            </span>
            <h2 className="text-sm font-black text-[var(--text-primary)]">{specimen.name}</h2>
            <p className="text-xs text-[var(--text-secondary)]">{specimen.magnification}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-[var(--text-tertiary)] block">Độ nét</span>
            <span
              className={`text-xs font-black px-2 py-0.5 rounded-full ${
                isSharp
                  ? 'bg-[var(--ok-tint)] text-[var(--ok-fg)]'
                  : 'bg-[var(--warn-tint)] text-[var(--warn-fg)]'
              }`}
            >
              {isSharp ? 'RÕ NÉT 100%' : 'MỜ (LẤY NÉT)'}
            </span>
          </div>
        </div>

        {/* Circular Microscope Ocular Lens Viewport */}
        <div className="relative p-4 rounded-3xl bg-[var(--bg-surface-2)] border border-[var(--border)] flex flex-col items-center justify-center min-h-[240px]">
          {/* Eyepiece Circle */}
          <div className="relative w-52 h-52 rounded-full border-4 border-slate-700 bg-emerald-950/40 shadow-inner overflow-hidden flex items-center justify-center">
            {/* Specimen Cellular Graphic under blur */}
            <motion.div
              style={{ filter: `blur(${blurAmount}px)` }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Cellular walls / tissue grid pattern */}
              <div className="w-full h-full opacity-60 grid grid-cols-3 grid-rows-3 gap-1 p-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="border border-emerald-400/50 rounded-lg bg-emerald-500/10" />
                ))}
              </div>
            </motion.div>

            {/* Clickable Organelle Targets inside ocular */}
            {specimen.organelles.map((org) => {
              const isTarget = org.id === specimen.correctOrganelleId;
              const isSelected = selectedOrganelle === org.id;

              return (
                <button
                  key={org.id}
                  onClick={() => handleSelectOrganelle(org.id)}
                  style={{ left: `${org.x}%`, top: `${org.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full border-2 transition-all cursor-pointer z-10 flex items-center justify-center group ${
                    isSelected
                      ? isTarget
                        ? 'bg-[var(--ok-fill)] border-white text-white scale-125'
                        : 'bg-[var(--err-fill)] border-white text-white'
                      : 'bg-emerald-400/40 border-emerald-300 hover:scale-110 hover:bg-emerald-300'
                  }`}
                  title={org.label}
                >
                  <Crosshair className="w-4 h-4 text-white drop-shadow" />
                </button>
              );
            })}

            {/* Crosshair guidelines */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
              <div className="w-full h-0.5 bg-white" />
              <div className="h-full w-0.5 bg-white absolute" />
            </div>
          </div>

          <div className="mt-2 text-[11px] font-black text-center text-[var(--text-primary)]">
            🎯 {specimen.question}
          </div>
        </div>

        {/* Focusing Knobs Controls */}
        <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-3">
          {/* Ốc sơ cấp (Coarse adjustment) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[var(--text-secondary)]">Ốc sơ cấp (chỉnh thô):</span>
              <span className="font-mono text-[var(--bio-fg)] font-black">{coarseVal}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={coarseVal}
              onChange={(e) => setCoarseVal(Number(e.target.value))}
              className="w-full accent-[var(--bio-fill)] cursor-pointer h-2 bg-[var(--bg-surface-2)] rounded-lg"
            />
          </div>

          {/* Ốc vi cấp (Fine adjustment) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[var(--text-secondary)]">Ốc vi cấp (chỉnh nét tinh):</span>
              <span className="font-mono text-[var(--bio-fg)] font-black">{fineVal}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={fineVal}
              onChange={(e) => setFineVal(Number(e.target.value))}
              className="w-full accent-[var(--bio-fill)] cursor-pointer h-2 bg-[var(--bg-surface-2)] rounded-lg"
            />
          </div>
        </div>

        {/* Organelle quick selection list */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-[var(--text-tertiary)]">Hoặc chọn tên bào quan:</span>
          <div className="grid grid-cols-1 gap-1.5">
            {specimen.organelles.map((org) => (
              <button
                key={org.id}
                onClick={() => handleSelectOrganelle(org.id)}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  selectedOrganelle === org.id
                    ? 'bg-[var(--bio-tint)] border-[var(--bio-fill)] text-[var(--text-primary)]'
                    : 'bg-[var(--bg-surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                }`}
              >
                <span>{org.label}</span>
                <Crosshair className="w-3.5 h-3.5 text-[var(--bio-fg)]" />
              </button>
            ))}
          </div>
        </div>

        {/* Result & Explanation Feedback */}
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-3"
          >
            <div className="text-xs font-bold text-[var(--text-secondary)] leading-relaxed">
              {feedback}
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-xs text-[var(--text-primary)]">
              <MathText text={specimen.explanation} />
            </div>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleNextSpecimen}
              className="font-black bg-[var(--bio-fill)] text-white shadow-md flex items-center justify-center gap-2"
            >
              <span>SOI TIÊU BẢN TIẾP THEO</span>
              <Sparkles className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </MinigameShell>
  );
};
