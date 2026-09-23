import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Zap, Gift, BookOpen, ArrowRight, Flame } from 'lucide-react';
import { Heart, Streak, XPBadge, GemBadge, HeartRefillModal } from '@/design-system';
import { useUserStore } from '@/features/gamification/useUserStore';
import { sound } from '@/lib/audio';

export const DesktopRightSidebar: React.FC = () => {
  const { xp, streak, hearts, gems, buyHeartWithGems } = useUserStore();
  const [showHeartModal, setShowHeartModal] = useState(false);
  const navigate = useNavigate();

  // Simulated daily quests based on user XP
  const dailyXpTarget = 10;
  const currentDailyXp = Math.min(dailyXpTarget, xp > 0 ? (xp % 50) + 2 : 0);
  const dailyXpPercent = Math.min(100, Math.round((currentDailyXp / dailyXpTarget) * 100));

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

      {/* 2. Widget: Nhiệm vụ hằng ngày (Daily Quests) */}
      <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24] space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h3 className="text-xs font-black text-white tracking-wider uppercase">
              Nhiệm vụ hằng ngày
            </h3>
          </div>
          <Link
            to="/daily"
            onClick={() => sound.playClick()}
            className="text-[10px] font-black text-[#0ea5e9] hover:text-[#38bdf8] uppercase tracking-tight"
          >
            Xem tất cả
          </Link>
        </div>

        {/* Quest Item 1 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 text-[11px]">Kiếm 10 XP</span>
            <span className="text-[11px] font-mono text-slate-400 font-bold">
              {currentDailyXp}/{dailyXpTarget}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-3 rounded-full bg-[#20333d] overflow-hidden border border-[#2e4756] p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                style={{ width: `${dailyXpPercent}%` }}
              />
            </div>
            <Gift
              className={`w-5 h-5 transition-transform ${
                dailyXpPercent >= 100
                  ? 'text-amber-400 animate-bounce'
                  : 'text-slate-600'
              }`}
            />
          </div>
        </div>

        {/* Quest Item 2 */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 text-[11px]">Hoàn thành 1 bài học</span>
            <span className="text-[11px] font-mono text-slate-400 font-bold">
              {xp >= 15 ? '1/1' : '0/1'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-3 rounded-full bg-[#20333d] overflow-hidden border border-[#2e4756] p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-500"
                style={{ width: xp >= 15 ? '100%' : '0%' }}
              />
            </div>
            <Gift
              className={`w-5 h-5 transition-transform ${
                xp >= 15 ? 'text-[#0ea5e9]' : 'text-slate-600'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 4. Widget: Chuỗi đèn cồn Streak */}
      <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#ff9600]/40 shadow-[0_4px_0_0_#131f24] flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#ff9600] uppercase tracking-wider">
            <Flame className="w-4 h-4 fill-[#ff9600]" />
            <span>Đèn cồn Streak</span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium leading-tight">
            {streak > 0
              ? `Bạn đang giữ chuỗi ${streak} ngày học liên tiếp!`
              : 'Học 1 bài hôm nay để thắp sáng ngọn đèn cồn!'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-2xl font-black text-[#ff9600] pl-2">
          <span>{streak}</span>
          <Flame className="w-6 h-6 fill-[#ff9600] text-[#ff9600] animate-pulse" />
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
