import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Calendar,
  ArrowRight,
  CheckCircle2,
  Check,
  X,
  RotateCcw,
  Sparkles,
  Flame,
} from 'lucide-react';
import { useUserStore } from '@/features/gamification/useUserStore';
import { Button, Streak, CurrencyIcon } from '@/design-system';
import { sound } from '@/lib/audio';
import { assetUrl } from '@/lib/utils';
import { useActiveSubject } from '@/content/subjects';
import trueFalseData from '@/content/kb/true-false-statements.json';
import physicsTrueFalseData from '@/content/kb/physics/true-false-statements.json';
import biologyTrueFalseData from '@/content/kb/biology/true-false-statements.json';

// Simple pseudo-random generator seeded by integer
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export const DailyPage: React.FC = () => {
  const navigate = useNavigate();
  const { streak, addXp, incrementStreak } = useUserStore();
  const { subject: activeSubject } = useActiveSubject();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAns, setSelectedAns] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const storageKey = `daily_${activeSubject}_${todayStr}`;

  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setAlreadyCompleted(true);
    }
  }, [storageKey]);

  // Deterministic 5 questions for today using date as seed
  const dailyQuestions = useMemo(() => {
    let seedNum = todayStr.split('-').reduce((acc, part) => acc * 31 + parseInt(part, 10), 7);
    const pool =
      activeSubject === 'bio'
        ? [...biologyTrueFalseData]
        : activeSubject === 'physics'
        ? [...physicsTrueFalseData]
        : [...trueFalseData];
    const picked: typeof pool = [];

    for (let i = 0; i < 5; i++) {
      const idx = Math.floor(seededRandom(seedNum++) * pool.length);
      picked.push(pool.splice(idx, 1)[0]);
    }
    return picked;
  }, [todayStr, activeSubject]);

  const currentQ = dailyQuestions[currentQIndex] || dailyQuestions[0];

  const handleAnswer = (choice: boolean) => {
    if (selectedAns !== null) return;
    setSelectedAns(choice);
    const isCorrect = choice === currentQ.isTrue;

    if (isCorrect) {
      sound.playCorrect();
      setScore((s) => s + 1);
    } else {
      sound.playWrong();
    }

    setTimeout(() => {
      setSelectedAns(null);
      if (currentQIndex + 1 >= dailyQuestions.length) {
        // Complete Daily Challenge
        setIsFinished(true);
        setIsPlaying(false);
        if (!alreadyCompleted) {
          addXp(30);
          incrementStreak();
          localStorage.setItem(storageKey, JSON.stringify({ completedAt: Date.now() }));
          setAlreadyCompleted(true);
        }
      } else {
        setCurrentQIndex((i) => i + 1);
      }
    }, 1200);
  };

  const startDaily = () => {
    sound.playClick();
    setIsPlaying(true);
    setCurrentQIndex(0);
    setScore(0);
    setSelectedAns(null);
    setIsFinished(false);
  };

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h1 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[var(--warn-fg)]" />
          Thử thách hàng ngày
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-1.5 flex-wrap">
          Hoàn thành 5 câu mỗi ngày để nhận
          <span className="inline-flex items-center gap-1 font-bold text-[var(--gold-fg)]">
            <CurrencyIcon type="xp" size="xs" /> +30 XP
          </span>
          và duy trì ngọn lửa chuỗi
          <span className="inline-flex items-center gap-1 font-bold text-[var(--warn-fg)]">
            <CurrencyIcon type="streak" size="xs" /> Streak
          </span>
        </p>
      </div>

      {/* Main Challenge Card or Active Game Card */}
      {!isPlaying ? (
        <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--warn-fg)]" />
              <span className="text-xs font-black text-[var(--text-primary)]">
                {todayStr} · 5 câu hỏi
              </span>
            </div>
            <Streak days={streak} />
          </div>

          <div className="flex items-center gap-4">
            <img
              src={assetUrl('/assets/roadmap/node-daily.png')}
              alt="Thử thách ngày"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-lg shrink-0 select-none pointer-events-none"
            />
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-[var(--text-primary)] leading-snug">
                Chủ đề hôm nay: Thử thách {activeSubject === 'physics' ? 'Vật lý' : activeSubject === 'bio' ? 'Sinh học' : 'Hóa học'} tổng hợp
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <span>Phần thưởng:</span>
                <span className="text-[var(--gold-fg)] font-bold flex items-center gap-1">
                  <CurrencyIcon type="xp" size="xs" /> +30 XP
                </span>
                <span>& thắp sáng ngọn lửa Streak</span>
              </div>
            </div>
          </div>

          {alreadyCompleted ? (
            <div className="p-3.5 rounded-2xl bg-[var(--ok-tint)] border border-[var(--ok-edge)] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--ok-fg)] font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Bạn đã hoàn thành thử thách hôm nay! (+30 XP)</span>
              </div>
              <Button variant="ghost" size="sm" onClick={startDaily}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Làm lại
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={startDaily}
              className="flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>BẮT ĐẦU THỬ THÁCH NGAY</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      ) : (
        /* In-session 5 Questions Flow */
        <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[var(--subject-fg)]">
              Câu {currentQIndex + 1} / 5
            </span>
            <span className="text-[var(--text-secondary)]">
              Đúng: {score}/{currentQIndex + (selectedAns !== null ? 1 : 0)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[var(--bg-surface-2)] h-2.5 rounded-full overflow-hidden border border-[var(--border)]">
            <div
              className="bg-[var(--subject-fill)] h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentQIndex + 1) / 5) * 100}%` }}
            />
          </div>

          {/* Question card */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] min-h-[120px] flex flex-col justify-between">
            <p className="text-sm sm:text-base font-bold text-[var(--text-primary)] leading-relaxed">
              {currentQ.statement}
            </p>

            {selectedAns !== null && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-2 p-2.5 rounded-xl text-xs font-semibold ${
                  selectedAns === currentQ.isTrue
                    ? 'text-[var(--ok-fg)] bg-[var(--ok-tint)] border border-[var(--ok-edge)]'
                    : 'text-[var(--err-fg)] bg-[var(--err-tint)] border border-[var(--err-edge)]'
                }`}
              >
                {selectedAns === currentQ.isTrue ? '✓ Đúng! ' : '✗ Chưa đúng! '}
                {currentQ.explanation}
              </motion.div>
            )}
          </div>

          {/* Buttons: Chunky 3D ĐÚNG / SAI */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.96, y: 3 }}
              disabled={selectedAns !== null}
              onClick={() => handleAnswer(true)}
              className="py-3.5 rounded-2xl border border-[var(--ok-edge)] bg-[var(--ok-fill)] text-white font-black flex items-center justify-center gap-2 shadow-[0_4px_0_0_var(--ok-edge)] active:shadow-none hover:opacity-95 transition disabled:opacity-40 cursor-pointer text-base"
            >
              <Check className="w-5 h-5 stroke-[3]" /> ĐÚNG
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96, y: 3 }}
              disabled={selectedAns !== null}
              onClick={() => handleAnswer(false)}
              className="py-3.5 rounded-2xl border border-[var(--err-edge)] bg-[var(--err-fill)] text-white font-black flex items-center justify-center gap-2 shadow-[0_4px_0_0_var(--err-edge)] active:shadow-none hover:opacity-95 transition disabled:opacity-40 cursor-pointer text-base"
            >
              <X className="w-5 h-5 stroke-[3]" /> SAI
            </motion.button>
          </div>
        </div>
      )}

      {/* Finished Summary Banner */}
      {isFinished && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--gold-edge)] shadow-[var(--shadow-modal)] text-center space-y-3"
        >
          <div className="flex justify-center">
            <CurrencyIcon type="trophy" size="lg" className="animate-bounce" />
          </div>
          <h2 className="text-lg font-black text-[var(--text-primary)]">
            Hoàn thành Thử thách Hôm nay!
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Bạn đạt <span className="text-[var(--subject-fg)] font-black">{score}/5 câu đúng</span>. Nhận ngay{' '}
            <span className="text-[var(--gold-fg)] font-black inline-flex items-center gap-1">
              <CurrencyIcon type="xp" size="xs" /> +30 XP
            </span>{' '}
            và kéo dài chuỗi streak!
          </p>
          <div className="pt-2 max-w-xs mx-auto">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => {
                sound.playClick();
                const activeGrade = typeof window !== 'undefined' ? localStorage.getItem('chem_active_grade') || '8' : '8';
                navigate(`/learn/${activeGrade}`);
              }}
            >
              TIẾP TỤC HỌC TẬP
            </Button>
          </div>
        </motion.div>
      )}

      {/* Previous Streak Tracker */}
      <div className="space-y-2">
        <h2 className="text-xs font-black uppercase tracking-wider text-[var(--text-tertiary)]">
          Lịch sử tuần này
        </h2>
        <div className="flex justify-between gap-2">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, i) => (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold border-2 ${
                  i < 5
                    ? 'bg-[var(--warn-fill)] border-[var(--warn-edge)] text-[var(--on-ink)] shadow-[0_3px_0_0_var(--warn-edge)]'
                    : i === 5
                    ? 'bg-[var(--subject-fill)] border-[var(--subject-edge)] text-white shadow-[0_3px_0_0_var(--subject-edge)] ring-2 ring-[var(--subject-tint)]'
                    : 'bg-[var(--bg-surface-2)] border-[var(--border)] text-[var(--text-tertiary)]'
                }`}
              >
                {i < 6 ? <Flame className="w-4 h-4 fill-current text-current" /> : <span className="text-xs opacity-40">○</span>}
              </div>
              <span
                className={`text-[10px] font-bold ${i < 6 ? 'text-[var(--warn-fg)]' : 'text-[var(--text-tertiary)]'}`}
              >
                {day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

