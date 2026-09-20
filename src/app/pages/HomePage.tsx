import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, ArrowRight } from 'lucide-react';
import { useUserStore } from '@/features/gamification/useUserStore';
import { Button, Card, Progress, Streak, XPBadge } from '@/design-system';
import { sound } from '@/lib/audio';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { xp, streak, dailyGoal, completedNodes } = useUserStore();

  const isFirstDone = !!completedNodes['g8-b03:g8-b03-n01'];
  const nextNodeId = isFirstDone ? 'n02' : 'n01';
  const nextNodeTitle = isFirstDone
    ? 'Chặng 2: Thể tích chất khí ở ĐKC & Tỉ khối'
    : 'Chặng 1: Khái niệm Mol và tính khối lượng mol (6 câu)';

  const progressPercent = Math.min(100, Math.round((xp / dailyGoal) * 100));

  return (
    <div className="space-y-5">
      {/* Today's Lesson Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-800/40 rounded-3xl p-5 shadow-xl"
      >
        <div className="space-y-3">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-black text-[10px] uppercase tracking-wider border border-cyan-500/30">
            Tiếp tục học hôm nay
          </span>
          <h1 className="text-xl font-black text-slate-100 leading-snug">
            Lớp 8 · Bài 3: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Mol và tỉ khối chất khí
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            {nextNodeTitle}
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              sound.playClick();
              navigate(`/play/g8-b03/${nextNodeId}`);
            }}
          >
            <Play className="w-4 h-4 fill-slate-950" />
            Tiếp tục chặng
          </Button>
        </div>
      </motion.div>

      {/* Daily Goal Progress */}
      <Card className="space-y-3 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-200">⚡ Mục tiêu ngày</span>
            {progressPercent >= 100 && (
              <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-lg flex items-center gap-1">
                ✓ Hoàn thành!
              </span>
            )}
          </div>
          <span className="text-xs font-bold text-slate-400">
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

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            sound.playClick();
            navigate('/daily');
          }}
          className="bg-slate-900 border border-slate-800 shadow-[0_4px_0_0_#1e293b] hover:border-slate-700 p-4 rounded-2xl cursor-pointer flex flex-col gap-3 active:translate-y-1 active:shadow-none transition-all"
        >
          <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-xl">
            🏆
          </div>
          <div>
            <h2 className="font-black text-sm text-slate-200">Thử thách ngày</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">5 câu nhanh +30 XP</p>
          </div>
        </motion.div>

        <motion.div
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            sound.playClick();
            navigate('/learn/8');
          }}
          className="bg-slate-900 border border-slate-800 shadow-[0_4px_0_0_#1e293b] hover:border-slate-700 p-4 rounded-2xl cursor-pointer flex flex-col gap-3 active:translate-y-1 active:shadow-none transition-all"
        >
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl">
            🗺️
          </div>
          <div>
            <h2 className="font-black text-sm text-slate-200">Lộ trình học</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Lớp 7, 8, 9 ziczac</p>
          </div>
        </motion.div>
      </div>

      {/* Practice Banner */}
      <motion.div
        whileTap={{ scale: 0.99 }}
        onClick={() => {
          sound.playClick();
          navigate('/practice');
        }}
        className="flex items-center justify-between p-3.5 bg-slate-900/60 border border-slate-800 shadow-[0_3px_0_0_#1e293b] hover:border-slate-700 rounded-2xl cursor-pointer active:translate-y-[3px] active:shadow-none transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="text-2xl">🧪</div>
          <div>
            <div className="text-xs font-black text-slate-200">Ôn tập tự do</div>
            <div className="text-[11px] text-slate-400">Tùy chọn dạng bài & độ khó</div>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-500" />
      </motion.div>
    </div>
  );
};
