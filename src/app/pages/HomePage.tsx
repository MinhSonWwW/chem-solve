import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, ArrowRight, Zap, Trophy, Map, FlaskConical } from 'lucide-react';
import { useUserStore } from '@/features/gamification/useUserStore';
import { Button, Card, Progress, Streak, XPBadge, Mascot } from '@/design-system';
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
        className="bg-[#18272f] border-2 border-[#2e4756] rounded-3xl p-5 shadow-[0_4px_0_0_#131f24] relative overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-3 flex-1 min-w-0">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#0ea5e9]/20 text-[#38bdf8] font-black text-[10px] uppercase tracking-wider border border-[#0ea5e9]/30">
              Tiếp tục học hôm nay
            </span>
            <h1 className="text-xl font-black text-white leading-snug">
              Lớp 8 · Bài 3: <br />
              <span className="text-[#38bdf8]">
                Mol và tỉ khối chất khí
              </span>
            </h1>
            <p className="text-xs text-slate-300">
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
              <Play className="w-4 h-4 fill-white text-white" />
              <span>Tiếp tục chặng</span>
            </Button>
          </div>
          <div className="shrink-0 flex items-center justify-center">
            <Mascot state="cheering" size="lg" />
          </div>
        </div>
      </motion.div>

      {/* Daily Goal Progress */}
      <Card className="space-y-3 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs font-black text-white">Mục tiêu ngày</span>
            {progressPercent >= 100 && (
              <span className="text-[10px] font-black bg-[#58cc02]/20 text-emerald-300 border border-[#58cc02]/40 px-2 py-0.5 rounded-lg flex items-center gap-1">
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
          className="bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24] hover:border-[#ce82ff] p-4 rounded-3xl cursor-pointer flex flex-col gap-3 active:translate-y-1 active:shadow-none transition-all"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#ce82ff]/15 border-2 border-[#ce82ff]/30 flex items-center justify-center text-[#ce82ff]">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-sm text-white">Thử thách ngày</h2>
            <p className="text-[11px] text-slate-300 mt-0.5">5 câu nhanh +30 XP</p>
          </div>
        </motion.div>

        <motion.div
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            sound.playClick();
            navigate('/learn/8');
          }}
          className="bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24] hover:border-[#0ea5e9] p-4 rounded-3xl cursor-pointer flex flex-col gap-3 active:translate-y-1 active:shadow-none transition-all"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0ea5e9]/15 border-2 border-[#0ea5e9]/30 flex items-center justify-center text-[#38bdf8]">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-sm text-white">Lộ trình học</h2>
            <p className="text-[11px] text-slate-300 mt-0.5">Lớp 6, 7, 8, 9 ziczac</p>
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
        className="flex items-center justify-between p-4 bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24] hover:border-[#58cc02] rounded-3xl cursor-pointer active:translate-y-1 active:shadow-none transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#58cc02]/15 border-2 border-[#58cc02]/30 flex items-center justify-center text-[#58cc02]">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-white">Ôn tập tự do</div>
            <div className="text-[11px] text-slate-300">Tùy chọn dạng bài & độ khó</div>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-400" />
      </motion.div>
    </div>
  );
};
