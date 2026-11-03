import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, ArrowRight, Map, FlaskConical, CheckCircle2, Sparkles, BookOpen, Zap } from 'lucide-react';
import { useUserStore } from '@/features/gamification/useUserStore';
import { Button, Card, Progress, Streak, XPBadge, Mascot, CurrencyIcon } from '@/design-system';
import { sound } from '@/lib/audio';
import { getCurriculum, type Grade } from '@/content/curriculum';
import { useActiveSubject } from '@/content/subjects';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { xp, streak, dailyGoal, completedNodes } = useUserStore();
  const { subject: activeSubject } = useActiveSubject();
  const isPhysics = activeSubject === 'physics';

  // Active grade selector (persisted in localStorage or default based on subject)
  const [activeGrade, setActiveGrade] = useState<Grade>(() => {
    const saved = localStorage.getItem('chem_active_grade');
    if (saved && [6, 7, 8, 9].includes(Number(saved))) {
      return Number(saved) as Grade;
    }
    return isPhysics ? 9 : 8;
  });

  const handleSelectGrade = (g: Grade) => {
    sound.playClick();
    setActiveGrade(g);
    localStorage.setItem('chem_active_grade', String(g));
  };

  // Dynamically find next playable node in the active grade
  const nextPlayable = useMemo(() => {
    const curriculum = getCurriculum(activeGrade, activeSubject);
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
  }, [activeGrade, activeSubject, completedNodes]);

  const progressPercent = Math.min(100, Math.round((xp / dailyGoal) * 100));

  return (
    <div className="space-y-5 pb-8">
      {/* Grade Selector Pills */}
      <div className="flex items-center justify-between gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)]">
        <span className="text-[10px] font-black uppercase text-[var(--text-tertiary)] pl-2 tracking-wider flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-[var(--subject-fg)]" />
          Khối lớp:
        </span>
        <div className="flex gap-1">
          {([6, 7, 8, 9] as Grade[]).map((g) => (
            <button
              key={g}
              onClick={() => handleSelectGrade(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                activeGrade === g
                  ? 'bg-[var(--subject-fill)] text-white border-[var(--subject-edge)] shadow-[0_2px_0_0_var(--subject-edge)] font-black'
                  : 'bg-[var(--bg-surface-2)] border-[var(--border)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
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
        className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-5 relative overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="space-y-2.5 flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider border bg-[var(--subject-tint)] text-[var(--subject-fg)] border-[var(--subject-edge)]">
              {isPhysics ? <Zap className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
              {nextPlayable.isCompletedAll ? 'Đã hoàn thành xuất sắc' : 'Chặng tiếp theo của bạn'}
            </div>

            <h1 className="text-lg sm:text-xl font-black text-[var(--text-primary)] leading-snug">
              Lớp {nextPlayable.grade} · {nextPlayable.lesson?.title ?? (isPhysics ? 'Vật lý THCS' : 'Hóa học THCS')} <br />
              <span className="text-base sm:text-lg text-[var(--subject-fg)]">
                {nextPlayable.node?.title ?? 'Khám phá bài học mới'}
              </span>
            </h1>

            <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
              Chương {nextPlayable.chapter?.chapterNumber}: {nextPlayable.chapter?.title} · {nextPlayable.node?.description}
            </p>

            <div className="pt-1">
              <Button
                variant="primary"
                size="md"
                className="flex items-center gap-2"
                onClick={() => {
                  sound.playClick();
                  if (nextPlayable.lesson && nextPlayable.node) {
                    if (nextPlayable.node.type === 'theory') {
                      navigate(`/theory/${nextPlayable.lesson.id}/${nextPlayable.node.id}`);
                    } else {
                      navigate(`/play/${nextPlayable.lesson.id}/${nextPlayable.node.id}`);
                    }
                  } else {
                    navigate(`/learn/${activeGrade}`);
                  }
                }}
              >
                <Play className="w-4 h-4 fill-current" />
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
      <Card className="space-y-3.5 py-4 border border-[var(--border)] bg-[var(--bg-surface)] rounded-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CurrencyIcon type="xp" size="xs" />
            <span className="text-xs font-black text-[var(--text-primary)] tracking-wide uppercase">Mục tiêu hôm nay</span>
            {progressPercent >= 100 && (
              <span className="text-[10px] font-black bg-[var(--ok-tint)] text-[var(--ok-fg)] border border-[var(--ok-edge)] px-2 py-0.5 rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[var(--ok-fg)]" />
                Hoàn thành!
              </span>
            )}
          </div>
          <span className="text-xs font-mono font-black text-[var(--gold-fg)]">
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
        {/* Daily Challenge Card */}
        <motion.div
          whileTap={{ scale: 0.98, y: 1 }}
          onClick={() => {
            sound.playClick();
            navigate('/daily');
          }}
          className="bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-strong)] p-4 rounded-3xl cursor-pointer flex flex-col gap-3 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[var(--gold-tint)] border border-[var(--gold-edge)] flex items-center justify-center text-[var(--gold-fg)] group-hover:scale-105 transition-transform">
            <CurrencyIcon type="trophy" size="sm" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-black text-sm text-[var(--text-primary)]">Thử thách ngày</h2>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[var(--gold-tint)] text-[var(--gold-fg)] border border-[var(--gold-edge)]">
                +30 XP
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">5 câu kiểm định nhanh</p>
          </div>
        </motion.div>

        {/* Roadmap Card */}
        <motion.div
          whileTap={{ scale: 0.98, y: 1 }}
          onClick={() => {
            sound.playClick();
            navigate(`/learn/${activeGrade}`);
          }}
          className="border border-[var(--border)] hover:border-[var(--border-strong)] p-4 rounded-3xl cursor-pointer flex flex-col gap-3 transition-all group bg-[var(--bg-surface)]"
        >
          <div className="w-10 h-10 rounded-2xl border border-[var(--subject-edge)] bg-[var(--subject-tint)] text-[var(--subject-fg)] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Map className="w-5 h-5 text-[var(--subject-fg)]" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-black text-sm text-[var(--text-primary)]">Lộ trình học</h2>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded border bg-[var(--subject-tint)] text-[var(--subject-fg)] border-[var(--subject-edge)]">
                Lớp {activeGrade}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">Bản đồ học tập chuẩn SGK</p>
          </div>
        </motion.div>
      </div>

      {/* Practice Lab Banner */}
      <motion.div
        whileTap={{ scale: 0.98, y: 1 }}
        onClick={() => {
          sound.playClick();
          navigate('/practice');
        }}
        className="flex items-center justify-between p-4 border border-[var(--border)] rounded-3xl cursor-pointer transition-all group bg-[var(--bg-surface)] hover:border-[var(--border-strong)]"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl border border-[var(--subject-edge)] bg-[var(--subject-tint)] text-[var(--subject-fg)] flex items-center justify-center group-hover:scale-105 transition-transform">
            {isPhysics ? <Zap className="w-6 h-6" /> : <FlaskConical className="w-6 h-6" />}
          </div>
          <div>
            <div className="text-sm font-black text-white flex items-center gap-1.5">
              <span>{isPhysics ? 'Phòng Luyện Tập Vật Lý' : 'Phòng Thí Nghiệm & Ôn Tập'}</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                isPhysics
                  ? 'bg-amber-950 border-amber-600/60 text-amber-300'
                  : 'bg-emerald-950 border-emerald-600/60 text-emerald-300'
              }`}>
                {isPhysics ? 'Công Thức & Bài Tập' : '5 Trò Chơi'}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">
              {isPhysics
                ? 'Luyện giải toán Cơ - Nhiệt - Điện - Quang, thử thách tốc độ & ôn tập'
                : 'Ghép đôi, cân bằng PTHH, phân loại hợp chất & ráp phản ứng'}
            </div>
          </div>
        </div>
        <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0 ${
          isPhysics ? 'text-amber-400' : 'text-emerald-400'
        }`} />
      </motion.div>
    </div>
  );
};

