import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Zap, Shield, Gift, BookOpen, ArrowRight, Flame } from 'lucide-react';
import { Heart, Streak, XPBadge } from '@/design-system';
import { useUserStore } from '@/features/gamification/useUserStore';
import { sound } from '@/lib/audio';

export const DesktopRightSidebar: React.FC = () => {
  const { xp, streak, hearts } = useUserStore();
  const navigate = useNavigate();

  // Simulated daily quests based on user XP
  const dailyXpTarget = 10;
  const currentDailyXp = Math.min(dailyXpTarget, xp > 0 ? (xp % 50) + 2 : 0);
  const dailyXpPercent = Math.min(100, Math.round((currentDailyXp / dailyXpTarget) * 100));

  const weeklyXp = Math.max(15, xp > 0 ? (xp % 300) + 15 : 15);

  return (
    <aside className="hidden lg:flex flex-col gap-5 w-[340px] h-[100dvh] sticky top-0 border-l border-slate-800/80 bg-slate-950/80 px-5 py-6 select-none overflow-y-auto z-20">
      {/* 1. Header Stats Bar */}
      <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
        <Streak days={streak} />
        <XPBadge amount={xp} />
        <Heart count={hearts} max={5} />

        <button
          onClick={() => {
            sound.playClick();
            navigate('/search');
          }}
          aria-label="Tìm kiếm"
          className="p-2 text-slate-400 hover:text-cyan-400 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 shadow-[0_2px_0_0_#1e293b] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
          title="Tìm kiếm chất, phản ứng, bài học"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Widget: Nhiệm vụ hằng ngày (Daily Quests) */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border-2 border-slate-800 shadow-md space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h3 className="text-xs font-black text-slate-200 tracking-wider uppercase">
              Nhiệm vụ hằng ngày
            </h3>
          </div>
          <Link
            to="/daily"
            onClick={() => sound.playClick()}
            className="text-[10px] font-black text-cyan-400 hover:text-cyan-300 uppercase tracking-tight"
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
            <div className="flex-1 h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700/60 p-0.5">
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
            <div className="flex-1 h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700/60 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-500"
                style={{ width: xp >= 15 ? '100%' : '0%' }}
              />
            </div>
            <Gift
              className={`w-5 h-5 transition-transform ${
                xp >= 15 ? 'text-cyan-400' : 'text-slate-600'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 3. Widget: Bảng xếp hạng / Giải đấu (Leagues) */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border-2 border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h3 className="text-xs font-black text-slate-200 tracking-wider uppercase">
              Giải đấu Đồng
            </h3>
          </div>
          <Link
            to="/progress"
            onClick={() => sound.playClick()}
            className="text-[10px] font-black text-cyan-400 hover:text-cyan-300 uppercase tracking-tight"
          >
            Bảng vàng
          </Link>
        </div>

        <div className="flex items-center gap-3.5 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-500 flex items-center justify-center text-xl shadow-[0_4px_0_0_#78350f] border-2 border-amber-400/40">
            🥉
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="text-xs font-black text-slate-100">
              Bạn đang ở vị trí <span className="text-amber-400">#15</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Đạt <span className="font-bold text-cyan-300">{weeklyXp} XP</span> tuần này. Top 10 sẽ thăng hạng Bạc!
            </p>
          </div>
        </div>
      </div>

      {/* 4. Widget: Chuỗi đèn cồn Streak */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-amber-950/20 border-2 border-amber-900/40 shadow-md flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>Đèn cồn Streak</span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium leading-tight">
            {streak > 0
              ? `Bạn đang giữ chuỗi ${streak} ngày học liên tiếp!`
              : 'Học 1 bài hôm nay để thắp sáng ngọn đèn cồn!'}
          </p>
        </div>
        <div className="text-2xl font-black text-amber-400 pl-2">
          {streak} 🔥
        </div>
      </div>

      {/* 5. Widget: Ôn tập nhanh (Spaced Repetition) */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-cyan-950/20 border-2 border-cyan-800/30 shadow-md space-y-2.5">
        <div className="flex items-center gap-2 text-cyan-300 text-xs font-black uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Sổ tay ôn tập</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          Hệ thống Leitner tự động nhắc nhở ôn lại các câu bạn đã từng làm sai.
        </p>
        <button
          onClick={() => {
            sound.playClick();
            navigate('/daily');
          }}
          className="w-full py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_3px_0_0_#0891b2] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
        >
          <span>ÔN TẬP CÂU SAI</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
