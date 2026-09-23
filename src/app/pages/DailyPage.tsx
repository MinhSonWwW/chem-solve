import React, { useState, useEffect, useMemo } from 'react';
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
    <div className="space-y-5 pb-8">
      <div>
        <h1 className="text-xl font-black text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#ff9600]" />
          Thử thách hàng ngày
        </h1>
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
          Hoàn thành 5 câu mỗi ngày để nhận
          <span className="inline-flex items-center gap-1 font-bold text-cyan-300">
            <CurrencyIcon type="xp" size="xs" /> +30 XP
          </span>
          và duy trì ngọn lửa chuỗi
          <span className="inline-flex items-center gap-1 font-bold text-amber-400">
            <CurrencyIcon type="streak" size="xs" /> Streak
          </span>
        </p>
      </div>

      {/* Main Challenge Card or Active Game Card */}
      {!isPlaying ? (
        <div className="p-5 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#ff9600]" />
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
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <span>Phần thưởng:</span>
              <span className="text-[#38bdf8] font-bold flex items-center gap-1">
                <CurrencyIcon type="xp" size="xs" /> +30 XP
              </span>
              <span>& thắp sáng ngọn lửa Streak</span>
            </div>
          </div>

          {alreadyCompleted ? (
            <div className="p-3.5 rounded-2xl bg-[#00cd9c]/10 border-2 border-[#00cd9c]/40 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#00cd9c] font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Bạn đã hoàn thành thử thách hôm nay! (+30 XP)</span>
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
        <div className="p-5 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24] space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#38bdf8]">
              Câu {currentQIndex + 1} / 5
            </span>
            <span className="text-slate-400">
              Đúng: {score}/{currentQIndex + (selectedAns !== null ? 1 : 0)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#131f24] h-2.5 rounded-full overflow-hidden border border-[#2e4756]">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentQIndex + 1) / 5) * 100}%` }}
            />
          </div>

          {/* Question card */}
          <div className="p-4 rounded-2xl bg-[#131f24] border-2 border-[#2e4756] min-h-[120px] flex flex-col justify-between">
            <p className="text-sm sm:text-base font-bold text-slate-100 leading-relaxed">
              {currentQ.statement}
            </p>

            {selectedAns !== null && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-2 p-2.5 rounded-xl text-xs font-semibold ${
                  selectedAns === currentQ.isTrue
                    ? 'text-[#00cd9c] bg-[#00cd9c]/15 border border-[#00cd9c]/30'
                    : 'text-[#ff4b4b] bg-[#ff4b4b]/15 border border-[#ff4b4b]/30'
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
              className="py-3.5 rounded-2xl border-2 border-[#00cd9c] bg-gradient-to-b from-[#00cd9c]/25 to-[#00cd9c]/10 text-[#00cd9c] font-black flex items-center justify-center gap-2 shadow-[0_4px_0_0_#007a5d] active:shadow-none hover:bg-[#00cd9c]/30 transition disabled:opacity-40 cursor-pointer text-base"
            >
              <Check className="w-5 h-5 stroke-[3]" /> ĐÚNG
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96, y: 3 }}
              disabled={selectedAns !== null}
              onClick={() => handleAnswer(false)}
              className="py-3.5 rounded-2xl border-2 border-[#ff4b4b] bg-gradient-to-b from-[#ff4b4b]/25 to-[#ff4b4b]/10 text-[#ff4b4b] font-black flex items-center justify-center gap-2 shadow-[0_4px_0_0_#b32525] active:shadow-none hover:bg-[#ff4b4b]/30 transition disabled:opacity-40 cursor-pointer text-base"
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
          className="p-5 rounded-3xl bg-[#18272f] border-2 border-[#ffc800] shadow-[0_6px_0_0_#b38b00] text-center space-y-3"
        >
          <div className="flex justify-center">
            <CurrencyIcon type="trophy" size="lg" className="animate-bounce" />
          </div>
          <h2 className="text-lg font-black text-slate-100">
            Hoàn thành Thử thách Hôm nay!
          </h2>
          <p className="text-xs text-slate-300">
            Bạn đạt <span className="text-[#38bdf8] font-black">{score}/5 câu đúng</span>. Nhận ngay{' '}
            <span className="text-[#ffc800] font-black inline-flex items-center gap-1">
              <CurrencyIcon type="xp" size="xs" /> +30 XP
            </span>{' '}
            và kéo dài chuỗi streak!
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
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold border-2 ${
                  i < 5
                    ? 'bg-[#ff9600] border-[#ff9600] text-slate-950 shadow-[0_3px_0_0_#b36b00]'
                    : i === 5
                    ? 'bg-[#0ea5e9] border-[#0ea5e9] text-slate-950 shadow-[0_3px_0_0_#0284c7] ring-2 ring-[#38bdf8]/40'
                    : 'bg-[#18272f] border-[#2e4756] text-slate-600'
                }`}
              >
                {i < 6 ? <Flame className="w-4 h-4 fill-slate-950 text-slate-950" /> : <span className="text-xs opacity-40">○</span>}
              </div>
              <span
                className={`text-[10px] font-bold ${i < 6 ? 'text-[#ff9600]' : 'text-slate-600'}`}
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

