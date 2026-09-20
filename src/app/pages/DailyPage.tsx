import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';
import { useUserStore } from '@/features/gamification/useUserStore';
import { Button, Card, Streak } from '@/design-system';
import { sound } from '@/lib/audio';
import trueFalseData from '@/content/kb/true-false-statements.json';

// Simple pseudo-random generator seeded by integer
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export const DailyPage: React.FC = () => {
  const { streak, addXp, incrementStreak } = useUserStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAns, setSelectedAns] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const storageKey = `chem_daily_${todayStr}`;

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
    const pool = [...trueFalseData];
    const picked: typeof pool = [];

    for (let i = 0; i < 5; i++) {
      const idx = Math.floor(seededRandom(seedNum++) * pool.length);
      picked.push(pool.splice(idx, 1)[0]);
    }
    return picked;
  }, [todayStr]);

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
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          Thử thách hàng ngày
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Hoàn thành 5 câu mỗi ngày để nhận +30 XP và duy trì ngọn lửa streak
        </p>
      </div>

      {/* Main Challenge Card or Active Game Card */}
      {!isPlaying ? (
        <Card className="space-y-4 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-amber-800/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-black text-slate-200">
                {todayStr} · 5 câu hỏi
              </span>
            </div>
            <Streak days={streak} />
          </div>

          <div>
            <h2 className="text-base font-extrabold text-slate-100">
              Chủ đề hôm nay: Thử thách Hóa học tổng hợp
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Phần thưởng:{' '}
              <span className="text-cyan-400 font-bold">+30 XP</span> & thắp sáng ngọn lửa Streak
            </p>
          </div>

          {alreadyCompleted ? (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-600/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                Bạn đã hoàn thành thử thách hôm nay! (+30 XP)
              </div>
              <Button variant="ghost" size="sm" onClick={startDaily}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Làm lại
              </Button>
            </div>
          ) : (
            <Button
              variant="accent"
              size="lg"
              fullWidth
              onClick={startDaily}
            >
              ✨ Bắt đầu thử thách ngay
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </Card>
      ) : (
        /* In-session 5 Questions Flow */
        <Card className="space-y-4 bg-slate-900 border-cyan-500/40 shadow-2xl">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-cyan-400">
              Câu {currentQIndex + 1} / 5
            </span>
            <span className="text-slate-400">
              Đúng: {score}/{currentQIndex + (selectedAns !== null ? 1 : 0)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-cyan-400 h-full transition-all duration-300"
              style={{ width: `${((currentQIndex + 1) / 5) * 100}%` }}
            />
          </div>

          {/* Question card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 min-h-[120px] flex flex-col justify-between">
            <p className="text-sm sm:text-base font-bold text-slate-100 leading-relaxed">
              {currentQ.statement}
            </p>

            {selectedAns !== null && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-2 p-2 rounded-xl text-xs font-semibold ${
                  selectedAns === currentQ.isTrue
                    ? 'text-emerald-300 bg-emerald-950/60'
                    : 'text-rose-300 bg-rose-950/60'
                }`}
              >
                {selectedAns === currentQ.isTrue ? '✓ Đúng! ' : '✗ Chưa đúng! '}
                {currentQ.explanation}
              </motion.div>
            )}
          </div>

          {/* Buttons: ĐÚNG / SAI */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              disabled={selectedAns !== null}
              onClick={() => handleAnswer(true)}
              className="py-3.5 rounded-xl border-2 border-emerald-500/50 bg-emerald-950/30 text-emerald-400 font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-950/50 transition disabled:opacity-40"
            >
              <Check className="w-4 h-4" /> ĐÚNG
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              disabled={selectedAns !== null}
              onClick={() => handleAnswer(false)}
              className="py-3.5 rounded-xl border-2 border-rose-500/50 bg-rose-950/30 text-rose-400 font-bold flex items-center justify-center gap-1.5 hover:bg-rose-950/50 transition disabled:opacity-40"
            >
              <X className="w-4 h-4" /> SAI
            </motion.button>
          </div>
        </Card>
      )}

      {/* Finished Summary Banner */}
      {isFinished && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-900 border-2 border-amber-500 shadow-2xl text-center space-y-3"
        >
          <Trophy className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
          <h2 className="text-lg font-black text-slate-100">
            Hoàn thành Thử thách Hôm nay!
          </h2>
          <p className="text-xs text-slate-300">
            Bạn đạt <span className="text-cyan-400 font-black">{score}/5 câu đúng</span>. Nhận ngay{' '}
            <span className="text-amber-400 font-black">+30 XP</span> và kéo dài chuỗi streak!
          </p>
        </motion.div>
      )}

      {/* Previous Streak Tracker */}
      <div className="space-y-2">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Lịch sử tuần này
        </h2>
        <div className="flex justify-between gap-2">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, i) => (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-bold border ${
                  i < 5
                    ? 'bg-amber-500 border-amber-600 text-slate-950 shadow-[0_3px_0_0_#d97706]'
                    : i === 5
                    ? 'bg-cyan-500 border-cyan-600 text-slate-950 shadow-[0_3px_0_0_#0891b2] ring-2 ring-cyan-400/40'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                {i < 6 ? '🔥' : '○'}
              </div>
              <span
                className={`text-[10px] font-bold ${i < 6 ? 'text-amber-400' : 'text-slate-600'}`}
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
