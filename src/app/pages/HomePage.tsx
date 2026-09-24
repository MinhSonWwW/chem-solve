import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, ArrowRight, Map, FlaskConical, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { useUserStore } from '@/features/gamification/useUserStore';
import { Button, Card, Progress, Streak, XPBadge, Mascot, CurrencyIcon } from '@/design-system';
import { sound } from '@/lib/audio';
import { getCurriculum, type Grade } from '@/content/curriculum';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { xp, streak, dailyGoal, completedNodes } = useUserStore();

  // Active grade selector (persisted in localStorage or default to 8)
  const [activeGrade, setActiveGrade] = useState<Grade>(() => {
    const saved = localStorage.getItem('chem_active_grade');
    if (saved && [6, 7, 8, 9].includes(Number(saved))) {
      return Number(saved) as Grade;
    }
    return 8;
  });

  const handleSelectGrade = (g: Grade) => {
    sound.playClick();
    setActiveGrade(g);
    localStorage.setItem('chem_active_grade', String(g));
  };

  // Dynamically find next playable node in the active grade
  const nextPlayable = useMemo(() => {
    const curriculum = getCurriculum(activeGrade);
    const completedKeys = new Set(
      Object.keys(completedNodes).filter((k) => completedNodes[k])
    );

    for (const chapter of curriculum.chapters) {
      for (const lesson of chapter.lessons) {
        if (!lesson.ready) continue;
        for (const node of lesson.nodes) {
          const key = `${lesson.id}:${node.id}`;
          if (!completedKeys.has(key)) {
            return {
              grade: activeGrade,
              chapter,
              lesson,
              node,
              isCompletedAll: false,
            };
          }
        }
      }
    }

    // All available nodes in this grade are completed!
    return {
      grade: activeGrade,
      chapter: curriculum.chapters[0],
      lesson: curriculum.chapters[0]?.lessons[0],
      node: curriculum.chapters[0]?.lessons[0]?.nodes[0],
      isCompletedAll: true,
    };
  }, [activeGrade, completedNodes]);

  const progressPercent = Math.min(100, Math.round((xp / dailyGoal) * 100));

  return (
    <div className="space-y-5 pb-8">
      {/* Grade Selector Pills */}
      <div className="flex items-center justify-between gap-1.5 p-1.5 rounded-2xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24]">
        <span className="text-[10px] font-black uppercase text-slate-400 pl-2 tracking-wider flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          Khối lớp:
        </span>
        <div className="flex gap-1">
          {([6, 7, 8, 9] as Grade[]).map((g) => (
            <button
              key={g}
              onClick={() => handleSelectGrade(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                activeGrade === g
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 border-cyan-300 shadow-[0_2px_0_0_#0891b2] font-black'
                  : 'bg-[#131f24] border-[#2e4756] text-slate-400 hover:text-slate-200'
              }`}
            >
              Lớp {g}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Next Lesson Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-b from-[#1c2c36] to-[#121c22] border-2 border-[#2e4756] rounded-3xl p-5 shadow-[0_6px_0_0_#0c1419] relative overflow-hidden"
      >
        {/* Ambient radial glow */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="space-y-2.5 flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 font-black text-[10px] uppercase tracking-wider border border-cyan-700/60 shadow-sm">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              {nextPlayable.isCompletedAll ? 'Đã hoàn thành xuất sắc' : 'Chặng tiếp theo của bạn'}
            </div>

            <h1 className="text-lg sm:text-xl font-black text-white leading-snug">
              Lớp {nextPlayable.grade} · {nextPlayable.lesson?.title ?? 'Hóa học THCS'} <br />
              <span className="text-cyan-400 text-base sm:text-lg">
                {nextPlayable.node?.title ?? 'Khám phá bài học mới'}
              </span>
            </h1>

            <p className="text-xs text-slate-300 line-clamp-1">
              Chương {nextPlayable.chapter?.chapterNumber}: {nextPlayable.chapter?.title} · {nextPlayable.node?.description}
            </p>

            <div className="pt-1">
              <Button
                variant="primary"
                size="md"
                className="flex items-center gap-2 font-black shadow-[0_4px_0_0_#007a5d] bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950"
                onClick={() => {
                  sound.playClick();
                  if (nextPlayable.lesson && nextPlayable.node) {
                    navigate(`/play/${nextPlayable.lesson.id}/${nextPlayable.node.id}`);
                  } else {
                    navigate(`/learn/${activeGrade}`);
                  }
                }}
              >
                <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>{nextPlayable.isCompletedAll ? 'ÔN TẬP LẠI' : 'TIẾP TỤC CHẶNG'}</span>
              </Button>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center pl-2">
            <Mascot state={nextPlayable.isCompletedAll ? 'celebrating' : 'cheering'} size="lg" />
          </div>
        </div>
      </motion.div>

      {/* Daily Goal Progress Card */}
      <Card className="space-y-3.5 py-4 border-2 border-[#2e4756] bg-[#18272f] shadow-[0_4px_0_0_#131f24] rounded-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CurrencyIcon type="xp" size="xs" />
            <span className="text-xs font-black text-white tracking-wide uppercase">Mục tiêu hôm nay</span>
            {progressPercent >= 100 && (
              <span className="text-[10px] font-black bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Hoàn thành!
              </span>
            )}
          </div>
          <span className="text-xs font-mono font-black text-amber-300">
            {xp}/{dailyGoal} XP
          </span>
        </div>

        <Progress
          value={progressPercent}
          color={progressPercent >= 100 ? 'success' : 'amber'}
        />

        <div className="flex items-center gap-2 pt-0.5">
          <Streak days={streak} />
          <XPBadge amount={xp} />
        </div>
      </Card>

      {/* Quick Actions Grid (3D tactile style) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Daily Challenge Card */}
        <motion.div
          whileTap={{ scale: 0.96, y: 3 }}
          onClick={() => {
            sound.playClick();
            navigate('/daily');
          }}
          className="bg-gradient-to-b from-[#2a1c38] to-[#1a1224] border-2 border-purple-500/40 hover:border-purple-400 p-4 rounded-3xl cursor-pointer flex flex-col gap-3 shadow-[0_5px_0_0_#3b0764] transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-[0_2px_8px_rgba(168,85,247,0.3)] group-hover:scale-110 transition-transform">
            <CurrencyIcon type="trophy" size="sm" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-black text-sm text-white">Thử thách ngày</h2>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                +30 XP
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">5 câu kiểm định nhanh</p>
          </div>
        </motion.div>

        {/* Roadmap Card */}
        <motion.div
          whileTap={{ scale: 0.96, y: 3 }}
          onClick={() => {
            sound.playClick();
            navigate(`/learn/${activeGrade}`);
          }}
          className="bg-gradient-to-b from-[#182c38] to-[#121c24] border-2 border-cyan-500/40 hover:border-cyan-400 p-4 rounded-3xl cursor-pointer flex flex-col gap-3 shadow-[0_5px_0_0_#083344] transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_2px_8px_rgba(6,182,212,0.3)] group-hover:scale-110 transition-transform">
            <Map className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-black text-sm text-white">Lộ trình học</h2>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Lớp {activeGrade}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">Bản đồ học tập chuẩn SGK</p>
          </div>
        </motion.div>
      </div>

      {/* Practice Lab Banner */}
      <motion.div
        whileTap={{ scale: 0.98, y: 2 }}
        onClick={() => {
          sound.playClick();
          navigate('/practice');
        }}
        className="flex items-center justify-between p-4 bg-gradient-to-r from-[#142921] to-[#121c22] border-2 border-emerald-500/40 hover:border-emerald-400 shadow-[0_5px_0_0_#064e3b] rounded-3xl cursor-pointer transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-[0_2px_8px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-black text-white flex items-center gap-1.5">
              <span>Phòng Thí Nghiệm & Ôn Tập</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-600/60 text-emerald-300">
                5 Trò Chơi
              </span>
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">
              Ghép đôi, cân bằng PTHH, phân loại hợp chất & ráp phản ứng
            </div>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0" />
      </motion.div>
    </div>
  );
};

