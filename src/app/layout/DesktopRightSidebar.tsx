import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, ArrowRight } from 'lucide-react';
import { Heart, Streak, XPBadge, GemBadge, HeartRefillModal, CurrencyIcon } from '@/design-system';
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
      <aside className="hidden lg:flex flex-col gap-5 w-[340px] h-[100dvh] sticky top-0 border-l-2 border-[#2e4756] bg-[#131f24]/95 px-5 py-6 select-none overflow-y-auto z-20">
        {/* 1. Header Stats Bar */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_3px_0_0_#131f24] gap-1.5">
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
            className="p-2 text-slate-300 hover:text-[#0ea5e9] rounded-xl bg-[#20333d] hover:bg-[#283e4a] border border-[#2e4756] shadow-[0_2px_0_0_#131f24] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            title="Tìm kiếm chất, phản ứng, bài học"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Widget: Nhiệm vụ hằng ngày (Real Daily Quests) */}
        <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24] space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CurrencyIcon type="xp" size="xs" />
              <h3 className="text-xs font-black text-white tracking-wider uppercase">
                Nhiệm vụ hôm nay
              </h3>
            </div>
            <Link
              to="/daily"
              onClick={() => sound.playClick()}
              className="text-[10px] font-black text-[#0ea5e9] hover:text-[#38bdf8] uppercase tracking-tight"
            >
              Xem thử thách
            </Link>
          </div>

          {/* Quest Item 1: Daily Challenge */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 text-[11px]">
                5 câu Thử thách ngày
              </span>
              <span className={`text-[11px] font-mono font-bold ${dailyChallengeDone ? 'text-emerald-400' : 'text-slate-400'}`}>
                {dailyChallengeDone ? '1/1 ✓' : '0/1'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2.5 rounded-full bg-[#20333d] overflow-hidden border border-[#2e4756] p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                  style={{ width: dailyChallengeDone ? '100%' : '0%' }}
                />
              </div>
              <CurrencyIcon type="trophy" size="xs" className={dailyChallengeDone ? 'animate-bounce' : 'opacity-40 grayscale'} />
            </div>
          </div>

          {/* Quest Item 2: Lesson Completion Today */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 text-[11px]">
                Hoàn thành 1 chặng bài học
              </span>
              <span className={`text-[11px] font-mono font-bold ${todayNodesCount >= 1 ? 'text-cyan-400' : 'text-slate-400'}`}>
                {todayNodesCount >= 1 ? '1/1 ✓' : '0/1'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2.5 rounded-full bg-[#20333d] overflow-hidden border border-[#2e4756] p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-500"
                  style={{ width: todayNodesCount >= 1 ? '100%' : '0%' }}
                />
              </div>
              <CurrencyIcon type="gem" size="xs" className={todayNodesCount >= 1 ? 'animate-bounce' : 'opacity-40 grayscale'} />
            </div>
          </div>

          {/* Quest Item 3: Daily Goal XP */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 text-[11px]">
                Đạt mục tiêu {dailyGoalTarget} XP ngày
              </span>
              <span className={`text-[11px] font-mono font-bold ${dailyXpPercent >= 100 ? 'text-amber-400' : 'text-slate-400'}`}>
                {currentDailyXp}/{dailyGoalTarget} XP
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2.5 rounded-full bg-[#20333d] overflow-hidden border border-[#2e4756] p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                  style={{ width: `${dailyXpPercent}%` }}
                />
              </div>
              <CurrencyIcon type="xp" size="xs" className={dailyXpPercent >= 100 ? 'animate-bounce' : 'opacity-40 grayscale'} />
            </div>
          </div>
        </div>

        {/* 3. Widget: Chuỗi đèn cồn Streak */}
        <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#ff9600]/40 shadow-[0_4px_0_0_#131f24] flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#ff9600] uppercase tracking-wider">
              <CurrencyIcon type="streak" size="xs" />
              <span>Chuỗi đèn cồn Streak</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium leading-tight">
              {streak > 0
                ? `Bạn đang giữ chuỗi ${streak} ngày học liên tiếp!`
                : 'Học 1 bài hôm nay để thắp sáng ngọn đèn cồn!'}
            </p>
          </div>
          <div className="flex items-center gap-1 text-2xl font-black text-[#ff9600] pl-2">
            <span>{streak}</span>
            <CurrencyIcon type="streak" size="sm" className="animate-pulse" />
          </div>
        </div>

      {/* 5. Widget: Ôn tập nhanh (Spaced Repetition) */}
      <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24] space-y-2.5">
        <div className="flex items-center gap-2 text-[#38bdf8] text-xs font-black uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Sổ tay ôn tập</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-tight">
          Hệ thống Leitner tự động nhắc nhở ôn lại các câu bạn đã từng làm sai.
        </p>
        <button
          onClick={() => {
            sound.playClick();
            navigate('/daily');
          }}
          className="w-full py-2.5 px-3 rounded-2xl bg-[#0ea5e9] hover:bg-[#38bdf8] text-white font-black text-xs flex items-center justify-center gap-2 shadow-[0_4px_0_0_#0284c7] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
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
