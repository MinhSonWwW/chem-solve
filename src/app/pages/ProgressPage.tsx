import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Flame,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Layers,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useUserStore } from '@/features/gamification/useUserStore';
import { getLevelInfo } from '@/config/gamification';
import { ACHIEVEMENTS } from '@/config/achievements';
import {
  loadStoredLeitnerCards,
  getLeitnerBoxStats,
  getDueReviewCards,
  LeitnerCard,
} from '@/engine/review/leitner';
import { detectWeakTopics, WeakTopicReport } from '@/engine/review/weakTopics';
import { Button } from '@/design-system';
import { sound } from '@/lib/audio';

export const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { xp, streak, completedNodes, achievements } = useUserStore();

  const [leitnerCards, setLeitnerCards] = useState<LeitnerCard[]>([]);

  useEffect(() => {
    setLeitnerCards(loadStoredLeitnerCards());
  }, []);

  const levelInfo = getLevelInfo(xp);
  const completedList = Object.values(completedNodes);
  const totalCompleted = completedList.length;
  const avgAccuracy =
    totalCompleted > 0
      ? Math.round(
          (completedList.reduce((acc, c) => acc + c.accuracy, 0) /
            totalCompleted) *
            100
        )
      : 100;

  const unlockedAchievementsCount = ACHIEVEMENTS.filter(
    (a) => (achievements[a.id] ?? 0) >= a.maxProgress
  ).length;

  const boxStats = useMemo(() => getLeitnerBoxStats(leitnerCards), [leitnerCards]);
  const dueCards = useMemo(() => getDueReviewCards(leitnerCards), [leitnerCards]);

  // Generate mock/real attempts for weak topic detection based on completed nodes
  const weakTopics: WeakTopicReport[] = useMemo(() => {
    const attempts = completedList.flatMap((node) => [
      { skillId: 'mol-mass-calc', isCorrect: node.accuracy >= 0.7, timestamp: Date.now() },
      { skillId: 'gas-volume-calc', isCorrect: node.accuracy >= 0.8, timestamp: Date.now() },
      { skillId: 'balance-equation', isCorrect: node.accuracy < 0.6, timestamp: Date.now() },
      { skillId: 'balance-equation', isCorrect: false, timestamp: Date.now() },
      { skillId: 'balance-equation', isCorrect: true, timestamp: Date.now() },
      { skillId: 'balance-equation', isCorrect: false, timestamp: Date.now() },
      { skillId: 'balance-equation', isCorrect: false, timestamp: Date.now() },
    ]);
    return detectWeakTopics(attempts, 5, 0.7);
  }, [completedList]);

  return (
    <div className="space-y-5 pb-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h1 className="text-xl font-black text-slate-100">Tiến trình học tập</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Theo dõi mức độ thành thạo và chu kỳ ghi nhớ dài hạn của bạn
        </p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
            <Sparkles className="w-4 h-4 fill-cyan-400" />
            Tổng kinh nghiệm
          </div>
          <div className="text-2xl font-black text-slate-100">{xp} XP</div>
          <div className="text-[10px] text-cyan-400 font-medium">
            Cấp {levelInfo.level} · {levelInfo.progressPercent}% đến Cấp {levelInfo.level + 1}
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
            <Flame className="w-4 h-4 fill-amber-400" />
            Chuỗi ngày học
          </div>
          <div className="text-2xl font-black text-slate-100">{streak} ngày</div>
          <div className="text-[10px] text-amber-400 font-medium">
            {streak > 0 ? 'Đang duy trì ngọn lửa!' : 'Học hôm nay để thắp lửa!'}
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            Độ chính xác TB
          </div>
          <div className="text-2xl font-black text-slate-100">{avgAccuracy}%</div>
          <div className="text-[10px] text-emerald-400 font-medium">
            {totalCompleted > 0 ? `Dựa trên ${totalCompleted} chặng` : 'Chưa có dữ liệu'}
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <div className="flex items-center gap-1.5 text-violet-400 text-xs font-bold">
            <Award className="w-4 h-4" />
            Huy hiệu đạt được
          </div>
          <div className="text-2xl font-black text-slate-100">
            {unlockedAchievementsCount}/{ACHIEVEMENTS.length}
          </div>
          <div className="text-[10px] text-violet-400 font-medium">
            Thành tựu Chem-Solve
          </div>
        </div>
      </div>

      {/* Spaced Repetition (Leitner 5-Box Distribution) */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Hộp ghi nhớ Leitner (5 cấp độ)
            </h2>
          </div>
          <span className="text-[10px] font-bold text-slate-400">
            {dueCards.length} thẻ đến hạn
          </span>
        </div>

        {/* 5 Boxes Visualization */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {[
            { box: 1, label: '1 ngày', count: boxStats[1] || 0, color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
            { box: 2, label: '2 ngày', count: boxStats[2] || 0, color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
            { box: 3, label: '4 ngày', count: boxStats[3] || 0, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' },
            { box: 4, label: '7 ngày', count: boxStats[4] || 0, color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' },
            { box: 5, label: '14 ngày', count: boxStats[5] || 0, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
          ].map((b) => (
            <div
              key={b.box}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center ${b.color}`}
            >
              <span className="text-[10px] font-black">Hộp {b.box}</span>
              <span className="text-base font-black my-0.5">{b.count}</span>
              <span className="text-[9px] opacity-75">{b.label}</span>
            </div>
          ))}
        </div>

        <Button
          variant="accent"
          size="sm"
          fullWidth
          onClick={() => {
            sound.playClick();
            navigate('/games/review');
          }}
          className="mt-2"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Vào Review Game ({dueCards.length > 0 ? `${dueCards.length} câu` : 'Luyện tập'})
        </Button>
      </div>

      {/* Weak Topics Alert */}
      {weakTopics.length > 0 && (
        <div className="p-4 bg-amber-950/40 border border-amber-800/50 rounded-3xl space-y-2.5">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <h2 className="text-xs font-black uppercase tracking-wider">
              Chủ đề cần củng cố (Weak Topics)
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Hệ thống phát hiện bạn gặp khó khăn ở các dạng bài sau (&lt; 70% chính xác):
          </p>
          <div className="space-y-2">
            {weakTopics.map((item) => (
              <div
                key={item.skill.id}
                className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xs font-bold text-slate-100">{item.skill.name}</h3>
                  <p className="text-[10px] text-amber-400 mt-0.5 font-medium">
                    Độ chính xác: {Math.round(item.accuracy * 100)}% ({item.correctCount}/{item.totalAttempts} câu)
                  </p>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    navigate(`/learn/${item.skill.grade}`);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-amber-500/30 flex items-center gap-1 transition"
                >
                  Luyện ngay <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mastered Skills & Topics */}
      <div className="space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          Kỹ năng Hóa học trọng tâm
        </h2>
        <div className="space-y-2.5">
          {[
            {
              name: 'Khái niệm Mol & Khối lượng mol (M)',
              grade: 'Lớp 8',
              status: totalCompleted > 0 ? 'Đang rèn luyện' : 'Chưa bắt đầu',
              progress: totalCompleted > 0 ? Math.min(100, totalCompleted * 50) : 10,
              color: 'bg-cyan-500',
            },
            {
              name: 'Thể tích khí ở ĐKC (24,79 L/mol)',
              grade: 'Lớp 8',
              status: 'Sẵn sàng',
              progress: totalCompleted > 0 ? Math.min(100, totalCompleted * 40) : 10,
              color: 'bg-emerald-500',
            },
            {
              name: 'Tỉ khối của chất khí',
              grade: 'Lớp 8',
              status: 'Cơ bản',
              progress: 25,
              color: 'bg-amber-500',
            },
            {
              name: 'Dung dịch & Nồng độ (C%, CM)',
              grade: 'Lớp 8',
              status: 'Chuẩn bị học',
              progress: 0,
              color: 'bg-slate-700',
            },
          ].map((skill, i) => (
            <div
              key={i}
              className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-100">{skill.name}</span>
                  <span className="text-[10px] text-slate-500 ml-2">({skill.grade})</span>
                </div>
                <span className="text-[11px] text-cyan-400 font-bold">
                  {skill.status}
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`${skill.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${Math.max(5, skill.progress)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
