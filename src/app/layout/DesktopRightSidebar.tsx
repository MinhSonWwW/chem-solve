import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, ArrowRight } from 'lucide-react';
import { Heart, Streak, XPBadge, GemBadge, HeartRefillModal, CurrencyIcon, ThemeToggle } from '@/design-system';
import { useUserStore } from '@/features/gamification/useUserStore';
import { sound } from '@/lib/audio';

export const DesktopRightSidebar: React.FC = () => {
  const { xp, streak, hearts, gems, completedNodes, dailyGoal, buyHeartWithGems } = useUserStore();
  const [showHeartModal, setShowHeartModal] = useState(false);
  const navigate = useNavigate();

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todayDateString = useMemo(() => new Date().toDateString(), []);

  // 1. Real check: Did user complete daily challenge today?
  const dailyChallengeDone = useMemo(() => {
    return !!localStorage.getItem(`chem_daily_${todayStr}`);
  }, [todayStr]);

  // 2. Real check: Did user complete any lesson node today?
  const todayNodesCount = useMemo(() => {
    return Object.values(completedNodes || {}).filter((n) => {
      if (!n?.completedAt) return false;
      return new Date(n.completedAt).toDateString() === todayDateString;
    }).length;
  }, [completedNodes, todayDateString]);

  // 3. Real Daily Goal Progress
  const dailyGoalTarget = dailyGoal || 20;
  const currentDailyXp = Math.min(dailyGoalTarget, xp);
  const dailyXpPercent = Math.min(100, Math.round((currentDailyXp / dailyGoalTarget) * 100));

  return (
    <>
      <aside className="hidden lg:flex flex-col gap-5 w-[340px] h-[100dvh] sticky top-0 border-l border-[var(--border)] bg-[var(--bg-surface)] px-5 py-6 select-none overflow-y-auto z-20">
        {/* 1. Header Stats Bar */}
        <div className="sidebar-stats-bar flex items-center justify-between p-2 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] gap-1.5">
          <Streak days={streak} />
          <XPBadge amount={xp} />
          <div
            onClick={() => {
              sound.playClick();
              navigate('/shop');
            }}
            className="cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            title="Cửa hàng Đá quý - Đổi lấy Tim & Vật phẩm!"
          >
            <GemBadge amount={gems} />
          </div>
          <div
            onClick={() => {
              sound.playClick();
              setShowHeartModal(true);
            }}
            className="cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            title={`Đang có ${hearts}/5 tim. Bấm để đổi đá quý hoặc luyện tập!`}
          >
            <Heart count={hearts} max={5} />
          </div>

          <button
            onClick={() => {
              sound.playClick();
              navigate('/search');
            }}
            aria-label="Tìm kiếm"
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--subject-fg)] rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)] active:translate-y-[1px] transition-all cursor-pointer"
            title="Tìm kiếm chất, phản ứng, bài học"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Toggle (Light / Dark mode) */}
          <ThemeToggle variant="compact" />
        </div>

        {/* 2. Widget: Nhiệm vụ hôm nay — vạch nhấn trái môn học */}
        <div className="widget-quests-card p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] border-l-4 border-l-[var(--subject-fill)] space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CurrencyIcon type="xp" size="xs" />
              <h3 className="text-xs font-black text-[var(--text-primary)] tracking-wider uppercase">
                Nhiệm vụ hôm nay
              </h3>
            </div>
            <Link
              to="/daily"
              onClick={() => sound.playClick()}
              className="text-[10px] font-black text-[var(--subject-fg)] hover:underline uppercase tracking-tight"
            >
              Xem thử thách
            </Link>
          </div>

          {/* Quest Item 1: Daily Challenge */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--text-secondary)] text-[11px]">
                5 câu Thử thách ngày
              </span>
              <span className={`text-[11px] font-mono font-bold ${dailyChallengeDone ? 'text-[var(--ok-fg)]' : 'text-[var(--text-tertiary)]'}`}>
                {dailyChallengeDone ? '1/1 ✓' : '0/1'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2.5 rounded-full bg-[var(--bg-surface-2)] overflow-hidden border border-[var(--border)] p-0.5">
                <div
                  className="h-full rounded-full bg-[var(--ok-fill)] transition-all duration-500"
                  style={{ width: dailyChallengeDone ? '100%' : '0%' }}
                />
              </div>
              <CurrencyIcon type="trophy" size="xs" className={dailyChallengeDone ? 'animate-bounce' : 'opacity-40 grayscale'} />
            </div>
          </div>

          {/* Quest Item 2: Lesson Completion Today */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--text-secondary)] text-[11px]">
                Hoàn thành 1 chặng bài học
              </span>
              <span className={`text-[11px] font-mono font-bold ${todayNodesCount >= 1 ? 'text-[var(--subject-fg)]' : 'text-[var(--text-tertiary)]'}`}>
                {todayNodesCount >= 1 ? '1/1 ✓' : '0/1'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2.5 rounded-full bg-[var(--bg-surface-2)] overflow-hidden border border-[var(--border)] p-0.5">
                <div
                  className="h-full rounded-full bg-[var(--subject-fill)] transition-all duration-500"
                  style={{ width: todayNodesCount >= 1 ? '100%' : '0%' }}
                />
              </div>
              <CurrencyIcon type="gem" size="xs" className={todayNodesCount >= 1 ? 'animate-bounce' : 'opacity-40 grayscale'} />
            </div>
          </div>

          {/* Quest Item 3: Daily Goal XP */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--text-secondary)] text-[11px]">
                Đạt mục tiêu {dailyGoalTarget} XP ngày
              </span>
              <span className={`text-[11px] font-mono font-bold ${dailyXpPercent >= 100 ? 'text-[var(--gold-fg)]' : 'text-[var(--text-tertiary)]'}`}>
                {currentDailyXp}/{dailyGoalTarget} XP
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2.5 rounded-full bg-[var(--bg-surface-2)] overflow-hidden border border-[var(--border)] p-0.5">
                <div
                  className="h-full rounded-full bg-[var(--gold-fill)] transition-all duration-500"
                  style={{ width: `${dailyXpPercent}%` }}
                />
              </div>
              <CurrencyIcon type="xp" size="xs" className={dailyXpPercent >= 100 ? 'animate-bounce' : 'opacity-40 grayscale'} />
            </div>
          </div>
        </div>

        {/* 3. Widget: Chuỗi đèn cồn Streak — vạch nhấn trái warn.fill */}
        <div className="widget-streak-card p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] border-l-4 border-l-[var(--warn-fill)] flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-black text-[var(--warn-fg)] uppercase tracking-wider">
              <CurrencyIcon type="streak" size="xs" />
              <span>Chuỗi đèn cồn Streak</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-tight">
              {streak > 0
                ? `Bạn đang giữ chuỗi ${streak} ngày học liên tiếp!`
                : 'Học 1 bài hôm nay để thắp sáng ngọn đèn cồn!'}
            </p>
          </div>
          <div className="flex items-center gap-1 text-2xl font-black text-[var(--warn-fg)] pl-2">
            <span>{streak}</span>
            <CurrencyIcon type="streak" size="sm" className="animate-pulse" />
          </div>
        </div>

        {/* 4. Widget: Sổ tay ôn tập Leitner — vạch nhấn trái slate.fill */}
        <div className="widget-review-card p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] border-l-4 border-l-[var(--slate-fill)] space-y-2.5">
          <div className="flex items-center gap-2 text-[var(--slate-fg)] text-xs font-black uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Sổ tay ôn tập</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] leading-tight">
            Hệ thống Leitner tự động nhắc nhở ôn lại các câu bạn đã từng làm sai.
          </p>
          <button
            onClick={() => {
              sound.playClick();
              navigate('/practice');
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-[var(--slate-fill)] hover:opacity-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-[0_4px_0_0_var(--slate-edge)] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <span>ÔN TẬP CÂU SAI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Heart Refill & Gem Exchange Modal */}
      <HeartRefillModal
        isOpen={showHeartModal}
        hearts={hearts}
        gems={gems}
        costPerHeart={150}
        onBuyWithGems={() => {
          buyHeartWithGems();
        }}
        onGoToPractice={() => {
          setShowHeartModal(false);
          navigate('/practice');
        }}
        onGoToShop={() => {
          setShowHeartModal(false);
          navigate('/shop');
        }}
        onClose={() => setShowHeartModal(false)}
      />
    </>
  );
};
