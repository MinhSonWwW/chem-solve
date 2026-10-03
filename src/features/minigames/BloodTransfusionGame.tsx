import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Droplets,
  Heart,
  ShieldCheck,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { MinigameShell } from '@/design-system';
import { sound } from '@/lib/audio';
import { useUserStore } from '@/features/gamification/useUserStore';
import { cn } from '@/lib/utils';

type BloodType = 'O' | 'A' | 'B' | 'AB';

interface PatientCase {
  id: string;
  name: string;
  bloodType: BloodType;
  condition: string;
  vitalStatus: string;
}

const BLOOD_RULES: Record<
  BloodType,
  {
    antigens: string;
    antibodies: string;
    compatibleDonors: BloodType[];
    color: string;
    text: string;
    border: string;
    glow: string;
  }
> = {
  O: {
    antigens: 'Không có kháng nguyên A, B',
    antibodies: 'Có kháng thể α và β',
    compatibleDonors: ['O'],
    color: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/50',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
  },
  A: {
    antigens: 'Có kháng nguyên A',
    antibodies: 'Có kháng thể β (chống B)',
    compatibleDonors: ['O', 'A'],
    color: 'bg-sky-500/20',
    text: 'text-sky-400',
    border: 'border-sky-500/50',
    glow: 'shadow-[0_0_15px_rgba(14,165,233,0.3)]',
  },
  B: {
    antigens: 'Có kháng nguyên B',
    antibodies: 'Có kháng thể α (chống A)',
    compatibleDonors: ['O', 'B'],
    color: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/50',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
  },
  AB: {
    antigens: 'Có cả kháng nguyên A và B',
    antibodies: 'Không có kháng thể α, β',
    compatibleDonors: ['O', 'A', 'B', 'AB'],
    color: 'bg-purple-500/20',
    text: 'text-purple-400',
    border: 'border-purple-500/50',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]',
  },
};

const PATIENT_NAMES = [
  'Bệnh nhân Nguyễn Văn A',
  'Bệnh nhân Trần Thị B',
  'Bệnh nhân Lê Hoàng C',
  'Bệnh nhân Phạm Minh D',
  'Bệnh nhân Hoàng Gia E',
  'Bệnh nhân Đặng Thùy F',
];

const EMERGENCY_CONDITIONS = [
  'Mất máu cấp do phẫu thuật',
  'Chấn thương gãy xương diện rộng',
  'Thiếu máu tan huyết cấp tính',
  'Cấp cứu chấn thương lồng ngực',
];

export const BloodTransfusionGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { addXp, addHearts } = useUserStore();

  const [timeLeft, setTimeLeft] = useState(50);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  // Current Patient
  const [currentPatient, setCurrentPatient] = useState<PatientCase>(() => generateRandomPatient());
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    chosen: BloodType;
    message: string;
  } | null>(null);

  function generateRandomPatient(): PatientCase {
    const types: BloodType[] = ['O', 'A', 'B', 'AB'];
    const bType = types[Math.floor(Math.random() * types.length)];
    const name = PATIENT_NAMES[Math.floor(Math.random() * PATIENT_NAMES.length)];
    const cond = EMERGENCY_CONDITIONS[Math.floor(Math.random() * EMERGENCY_CONDITIONS.length)];
    return {
      id: Math.random().toString(),
      name,
      bloodType: bType,
      condition: cond,
      vitalStatus: 'Huyết áp 85/50 mmHg — Cần truyền gấp',
    };
  }

  const finishGame = useCallback(
    (finalScore: number) => {
      setIsGameOver(true);
      const xp = Math.min(30, Math.max(8, Math.round(finalScore / 10)));
      setEarnedXp(xp);
      addXp(xp);
      if (finalScore >= 150) {
        addHearts(1);
      }
      sound.playLevelUp();
    },
    [addXp, addHearts]
  );

  // 50s Countdown Timer
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

  const handleSelectBloodBag = (donorType: BloodType) => {
    if (feedback || isGameOver) return;

    const patientRules = BLOOD_RULES[currentPatient.bloodType];
    const isCompatible = patientRules.compatibleDonors.includes(donorType);

    if (isCompatible) {
      sound.playCorrect();
      const points = 25 + combo * 5;
      const newScore = score + points;
      setScore(newScore);
      setCombo((c) => c + 1);
      setRoundsCompleted((r) => r + 1);

      setFeedback({
        correct: true,
        chosen: donorType,
        message: `An toàn tuyệt đối! Người nhận ${currentPatient.bloodType} nhận được túi máu ${donorType} (hồng cầu không bị ngưng kết).`,
      });

      setTimeout(() => {
        setFeedback(null);
        setCurrentPatient(generateRandomPatient());
      }, 1000);
    } else {
      sound.playWrong();
      setCombo(0);
      setTimeLeft((t) => Math.max(0, t - 3)); // 3 second penalty for dangerous transfusion!

      setFeedback({
        correct: false,
        chosen: donorType,
        message: `NGUY HIỂM! Huyết tương bệnh nhân (${patientRules.antibodies}) làm NGƯNG KẾT hồng cầu túi máu ${donorType}!`,
      });

      setTimeout(() => {
        setFeedback(null);
        setCurrentPatient(generateRandomPatient());
      }, 1700);
    }
  };

  const patientRule = BLOOD_RULES[currentPatient.bloodType];

  return (
    <MinigameShell
      title="Bác Sĩ Cấp Cứu — Truyền Máu ABO"
      description="Chọn túi máu an toàn tiếp ứng cho bệnh nhân trước khi cạn thời gian!"
      skillId="bio-truyen-mau"
      timeLeft={timeLeft}
      score={score}
      combo={combo}
      isGameOver={isGameOver}
      earnedXp={earnedXp}
      onExit={onExit}
      onRestart={() => {
        setTimeLeft(50);
        setScore(0);
        setCombo(0);
        setRoundsCompleted(0);
        setFeedback(null);
        setIsGameOver(false);
        setCurrentPatient(generateRandomPatient());
      }}
    >
      <div className="space-y-4 max-w-lg mx-auto">
        {/* Top Case Progress Bar */}
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-slate-400">
            Ca cấp cứu đã cứu sống: <span className="text-emerald-400 font-black">{roundsCompleted}</span>
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-700/60 text-rose-300 font-black text-[11px] flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            Phòng Hồi Sức Cấp Cứu
          </span>
        </div>

        {/* Patient Card (Bệnh nhân cần máu) */}
        <motion.div
          key={currentPatient.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'p-4 rounded-3xl border-2 transition-all relative overflow-hidden space-y-3 shadow-[0_6px_0_0_#131f24]',
            feedback?.correct === false
              ? 'bg-rose-950/60 border-rose-500 animate-shake'
              : 'bg-[#18272f] border-[#2e4756]'
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border-2 border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0">
                <Heart className="w-6 h-6 fill-rose-500 text-rose-500 animate-pulse" />
              </div>

              <div>
                <h3 className="text-sm font-black text-white">{currentPatient.name}</h3>
                <p className="text-[11px] text-slate-400">{currentPatient.condition}</p>
                <span className="text-[10px] text-rose-400 font-bold block mt-0.5">
                  ⚠️ {currentPatient.vitalStatus}
                </span>
              </div>
            </div>

            {/* Patient Blood Group Badge */}
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">
                Nhóm máu BN
              </span>
              <span
                className={cn(
                  'text-2xl font-black px-3 py-1 rounded-2xl border-2 inline-block shadow-md',
                  patientRule.color,
                  patientRule.text,
                  patientRule.border,
                  patientRule.glow
                )}
              >
                {currentPatient.bloodType}
              </span>
            </div>
          </div>

          {/* Biological details of patient's blood */}
          <div className="grid grid-cols-2 gap-2 text-left bg-[#131f24] p-2.5 rounded-2xl border border-slate-700/60 text-[11px]">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Kháng thể huyết tương:
              </span>
              <strong className="text-rose-300 font-semibold">{patientRule.antibodies}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Kháng nguyên hồng cầu:
              </span>
              <strong className="text-sky-300 font-semibold">{patientRule.antigens}</strong>
            </div>
          </div>
        </motion.div>

        {/* Feedback Sheet Banner */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                'p-3 rounded-2xl border-2 text-xs font-bold flex items-center gap-2',
                feedback.correct
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                  : 'bg-rose-950/80 border-rose-500/80 text-rose-200'
              )}
            >
              {feedback.correct ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
              )}
              <span>{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blood Bank Selection (4 TÚI MÁU ĐỂ HỌC SINH CHỌN) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-rose-400" />
              Ngân Hàng Máu — Chọn Túi Máu Tiếp Ứng:
            </span>
            <span className="text-[10px] text-amber-300 font-bold">Bấm để truyền ngay</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(['O', 'A', 'B', 'AB'] as const).map((donorType) => {
              return (
                <button
                  key={donorType}
                  disabled={!!feedback || isGameOver}
                  onClick={() => {
                    handleSelectBloodBag(donorType);
                  }}
                  className={cn(
                    'p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center group cursor-pointer shadow-[0_4px_0_0_#131f24] active:scale-95 disabled:cursor-not-allowed',
                    'bg-[#18272f] hover:bg-[#20333d] border-[#2e4756] hover:border-rose-400'
                  )}
                >
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <Droplets className="w-5 h-5 text-rose-400 fill-rose-500" />
                  </div>

                  <span className="text-lg font-black text-white">Túi {donorType}</span>
                  <span className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">
                    {donorType === 'O' ? 'Chuyên cho' : donorType === 'AB' ? 'Chuyên nhận' : `KN ${donorType}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Educational Hint Footer */}
        <div className="p-3 bg-[#14232c] border border-slate-700/60 rounded-2xl text-[11px] text-slate-400 text-left leading-relaxed">
          💡 <strong>Nguyên tắc vàng truyền máu:</strong> Không để kháng nguyên trên hồng cầu người cho bị kháng thể trong huyết tương người nhận ngưng kết. Nhóm <strong>O</strong> truyền được cho tất cả các nhóm; Nhóm <strong>AB</strong> có thể nhận được từ tất cả các nhóm.
        </div>
      </div>
    </MinigameShell>
  );
};
