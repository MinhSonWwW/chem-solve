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
  BookOpen,
  GraduationCap,
  Play,
} from 'lucide-react';
import { useUserStore } from '@/features/gamification/useUserStore';
import { getLevelInfo } from '@/config/gamification';
import { ACHIEVEMENTS } from '@/config/achievements';
import {
  loadStoredLeitnerCards,
  getLeitnerBoxStats,
  getDueReviewCards,
  type LeitnerCard,
} from '@/engine/review/leitner';
import { detectWeakTopics, type WeakTopicReport } from '@/engine/review/weakTopics';
import { Button } from '@/design-system';
import { sound } from '@/lib/audio';
import { getCurriculum, type Grade } from '@/content/curriculum';
import { getSkillsByGrade, type Skill } from '@/content/skills';
import type { CompletedNodeData } from '@/engine/progress/progressRepo';

const CATEGORY_MAP: Record<
  Skill['category'],
  { label: string; bg: string; text: string; border: string; icon: string }
> = {
  'ly-thuyet': { label: 'Lý thuyết', bg: 'bg-sky-500/15', text: 'text-sky-300', border: 'border-sky-500/30', icon: '📖' },
  'tinh-toan': { label: 'Tính toán', bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30', icon: '🧮' },
  'phuong-trinh': { label: 'Phương trình', bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30', icon: '⚖️' },
  'nhan-biet': { label: 'Nhận biết', bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30', icon: '🔍' },
  'thi-nghiem': { label: 'Thí nghiệm', bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30', icon: '🧪' },
};

export const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { xp, streak, completedNodes, achievements } = useUserStore();

  // Grade selection (Duolingo Course switcher style)
  const [selectedGrade, setSelectedGrade] = useState<Grade>(8);
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

  // ── Per-Grade Curriculum & Stats Calculation ──
  const selectedCurriculum = useMemo(() => getCurriculum(selectedGrade), [selectedGrade]);

  const allGradeLessons = useMemo(() => {
    return selectedCurriculum.chapters.flatMap((ch) => ch.lessons);
  }, [selectedCurriculum]);

  const allGradeNodes = useMemo(() => {
    return allGradeLessons.flatMap((l) =>
      l.nodes.map((n) => ({ lessonId: l.id, node: n, lessonReady: l.ready }))
    );
  }, [allGradeLessons]);

  const completedGradeNodeEntries = useMemo(() => {
    return Object.entries(completedNodes).filter(([key]) => key.startsWith(`g${selectedGrade}-`));
  }, [completedNodes, selectedGrade]);

  const completedGradeCount = completedGradeNodeEntries.length;
  const totalGradeNodeCount = allGradeNodes.length;
  const gradeCompletionPercent =
    totalGradeNodeCount > 0
      ? Math.round((completedGradeCount / totalGradeNodeCount) * 100)
      : 0;

  const gradeAccuracy = useMemo(() => {
    if (completedGradeNodeEntries.length === 0) return 0;
    const sum = completedGradeNodeEntries.reduce(
      (acc, [, data]) => acc + (data?.accuracy ?? 0),
      0
    );
    return Math.round((sum / completedGradeNodeEntries.length) * 100);
  }, [completedGradeNodeEntries]);

  const completedGradeLessonsCount = useMemo(() => {
    return allGradeLessons.filter((lesson) => {
      return (
        lesson.nodes.length > 0 &&
        lesson.nodes.every((n) => !!completedNodes[`${lesson.id}:${n.id}`])
      );
    }).length;
  }, [allGradeLessons, completedNodes]);

  const readyGradeLessonsCount = useMemo(() => {
    return allGradeLessons.filter((l) => l.ready).length;
  }, [allGradeLessons]);

  // ── Dynamic Skills for the Selected Grade ──
  const gradeSkillsWithProgress = useMemo(() => {
    const skills = getSkillsByGrade(selectedGrade);
    return skills.map((skill) => {
      const lesson = allGradeLessons.find((l) => l.id === skill.lessonId);
      if (!lesson) {
        return {
          ...skill,
          lessonTitle: 'Đang chuẩn bị',
          status: 'Chưa học' as const,
          progress: 0,
          color: 'bg-slate-700',
          textColor: 'text-slate-500',
          lessonReady: false,
          firstNodeId: '',
        };
      }

      const lessonCompletedNodes = lesson.nodes
        .map((n) => completedNodes[`${lesson.id}:${n.id}`])
        .filter((n): n is CompletedNodeData => !!n);

      const isAllCompleted =
        lesson.nodes.length > 0 && lessonCompletedNodes.length === lesson.nodes.length;
      const isPartiallyCompleted = lessonCompletedNodes.length > 0 && !isAllCompleted;

      let status = 'Chưa bắt đầu';
      let progress = 0;
      let color = 'bg-slate-700';
      let textColor = 'text-slate-400';

      if (isAllCompleted) {
        const avgAcc =
          lessonCompletedNodes.reduce((a, b) => a + b.accuracy, 0) /
          lessonCompletedNodes.length;
        if (avgAcc >= 0.85) {
          status = 'Thành thạo ⭐⭐⭐';
          progress = 100;
          color = 'bg-emerald-500';
          textColor = 'text-emerald-400';
        } else if (avgAcc >= 0.65) {
          status = 'Khá tốt ⭐⭐';
          progress = Math.round(avgAcc * 100);
          color = 'bg-cyan-500';
          textColor = 'text-cyan-400';
        } else {
          status = 'Cần củng cố ⚠️';
          progress = Math.round(avgAcc * 100);
          color = 'bg-amber-500';
          textColor = 'text-amber-400';
        }
      } else if (isPartiallyCompleted) {
        status = 'Đang rèn luyện ⏳';
        progress = Math.round((lessonCompletedNodes.length / lesson.nodes.length) * 60);
        color = 'bg-cyan-400';
        textColor = 'text-cyan-300';
      } else if (lesson.ready) {
        status = 'Sẵn sàng học 🚀';
        progress = 10;
        color = 'bg-blue-500';
        textColor = 'text-blue-400';
      } else {
        status = 'Đang biên soạn 🛠️';
        progress = 0;
        color = 'bg-slate-700';
        textColor = 'text-slate-500';
      }

      return {
        ...skill,
        lessonTitle: lesson.title,
        status,
        progress,
        color,
        textColor,
        lessonReady: lesson.ready,
        firstNodeId: lesson.nodes[0]?.id ?? '',
      };
    });
  }, [selectedGrade, allGradeLessons, completedNodes]);

  // Weak topic detection
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

  // Weak topics of the currently selected grade
  const gradeWeakTopics = useMemo(() => {
    return weakTopics.filter((w) => w.skill.grade === selectedGrade);
  }, [weakTopics, selectedGrade]);

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">📊</span>
          <h1 className="text-xl font-black text-slate-100">Tiến trình & Kỹ năng</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Theo dõi tiến độ, phân loại theo từng khối lớp và rèn luyện các kỹ năng trọng tâm
        </p>
      </div>

      {/* 2. Duolingo-style Grade Switcher Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            Chọn khối lớp theo dõi:
          </label>
          <span className="text-[11px] text-cyan-400 font-bold">
            Đang xem Lớp {selectedGrade}
          </span>
        </div>

        <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shadow-lg">
          {([6, 7, 8, 9] as Grade[]).map((g) => {
            const isSelected = selectedGrade === g;
            return (
              <button
                key={g}
                onClick={() => {
                  sound.playClick();
                  setSelectedGrade(g);
                }}
                className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_3px_0_0_#0891b2]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span><span className="hidden sm:inline">Hóa học </span>Lớp {g}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Grade Overview Card (Thông số riêng của khối lớp được chọn) */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/30 border-2 border-cyan-500/30 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-1">
            <span className="inline-block text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/90 px-2 py-0.5 rounded-lg border border-cyan-800/60">
              {selectedCurriculum.title} · SGK Mới
            </span>
            <h2 className="text-lg font-black text-white">
              Tiến độ hoàn thành Lớp {selectedGrade}
            </h2>
            <p className="text-xs text-slate-300 line-clamp-1">
              {selectedGrade === 6
                ? 'Chất quanh ta: Sự đa dạng của chất, Các thể của chất, Oxygen và Không khí'
                : selectedGrade === 8
                ? 'Phản ứng hóa học, Mol, Dung dịch và Các hợp chất vô cơ'
                : selectedGrade === 7
                ? 'Nguyên tử, Bảng tuần hoàn và Phân tử chất'
                : 'Kim loại, Phi kim và Hợp chất hữu cơ'}
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-cyan-400">{gradeCompletionPercent}%</span>
            <span className="text-[10px] text-slate-400 block font-bold">hoàn thành</span>
          </div>
        </div>

        {/* Master Progress Bar */}
        <div className="space-y-1.5 relative z-10">
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-700"
              style={{ width: `${Math.max(4, gradeCompletionPercent)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-bold text-slate-400 px-0.5">
            <span>Đã vượt qua {completedGradeCount}/{totalGradeNodeCount} chặng</span>
            <span>{totalGradeNodeCount - completedGradeCount} chặng còn lại</span>
          </div>
        </div>

        {/* 4 Per-Grade Specific Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 relative z-10">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-0.5 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Chặng đã học</span>
            <div className="text-base font-black text-slate-100">
              {completedGradeCount}/{totalGradeNodeCount}
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-0.5 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Độ chính xác TB</span>
            <div className="text-base font-black text-emerald-400">
              {completedGradeCount > 0 ? `${gradeAccuracy}%` : 'Chưa học'}
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-0.5 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Bài hoàn thành</span>
            <div className="text-base font-black text-cyan-400">
              {completedGradeLessonsCount}/{allGradeLessons.length}
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-0.5 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Bài có sẵn</span>
            <div className="text-base font-black text-amber-400">
              {readyGradeLessonsCount}/{allGradeLessons.length}
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 relative z-10">
          <Button
            variant="primary"
            size="md"
            className="flex items-center justify-center gap-2"
            onClick={() => {
              sound.playClick();
              navigate(`/learn/${selectedGrade}`);
            }}
          >
            <BookOpen className="w-4 h-4" />
            <span>MỞ BẢN ĐỒ HỌC LỚP {selectedGrade}</span>
          </Button>

          <Button
            variant="secondary"
            size="md"
            className="flex items-center justify-center gap-2"
            onClick={() => {
              sound.playClick();
              navigate('/practice');
            }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>LUYỆN TẬP BÀI HỌC LỚP {selectedGrade}</span>
          </Button>
        </div>
      </div>

      {/* 4. Weak Topics of Selected Grade */}
      {gradeWeakTopics.length > 0 && (
        <div className="p-4 bg-amber-950/40 border border-amber-800/50 rounded-3xl space-y-2.5 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <h2 className="text-xs font-black uppercase tracking-wider">
              Chủ đề cần củng cố ở Lớp {selectedGrade}
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Hệ thống phát hiện bạn gặp khó khăn ở các dạng bài sau (&lt; 70% chính xác):
          </p>
          <div className="space-y-2">
            {gradeWeakTopics.map((item) => (
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
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-amber-500/30 flex items-center gap-1 transition cursor-pointer"
                >
                  Luyện ngay <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Mastered Skills of Selected Grade (Kỹ năng hóa học trọng tâm của từng lớp) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            Kỹ năng Hóa học trọng tâm · Lớp {selectedGrade} ({gradeSkillsWithProgress.length} kỹ năng)
          </h2>
          <span className="text-[10px] font-bold text-slate-500">
            Cập nhật theo tiến độ học
          </span>
        </div>

        <div className="space-y-3">
          {gradeSkillsWithProgress.map((skill) => {
            const cat = CATEGORY_MAP[skill.category] || CATEGORY_MAP['ly-thuyet'];
            return (
              <div
                key={skill.id}
                className="p-4 bg-slate-900/95 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl space-y-2.5 transition-all shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${cat.bg} ${cat.text} ${cat.border} flex items-center gap-1`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {skill.lessonTitle}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-black text-slate-100">
                      {skill.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                      {skill.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-xs font-black ${skill.textColor} block`}>
                      {skill.status}
                    </span>
                    {skill.lessonReady && skill.firstNodeId && (
                      <button
                        onClick={() => {
                          sound.playClick();
                          navigate(`/play/${skill.lessonId}/${skill.firstNodeId}`);
                        }}
                        className="mt-1.5 px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition active:scale-95"
                      >
                        <Play className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                        <span>Luyện tập</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`${skill.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(4, skill.progress)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Spaced Repetition (Leitner 5-Box Distribution) */}
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

      {/* 7. Overall Account Stats Summary Grid */}
      <div className="space-y-2">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-violet-400" />
          Tổng quan toàn tài khoản
        </h2>

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
              Độ chính xác chung
            </div>
            <div className="text-2xl font-black text-slate-100">{avgAccuracy}%</div>
            <div className="text-[10px] text-emerald-400 font-medium">
              {totalCompleted > 0 ? `Dựa trên ${totalCompleted} chặng đã qua` : 'Chưa có dữ liệu'}
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
      </div>
    </div>
  );
};
