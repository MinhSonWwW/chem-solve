import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, Clock, CheckCircle2, Snowflake } from 'lucide-react';
import { Mascot, CurrencyIcon } from '@/design-system';
import { useUserStore } from '@/features/gamification/useUserStore';
import { GAMIFICATION } from '@/config/gamification';
import { assetUrl, cn } from '@/lib/utils';
import { sound } from '@/lib/audio';

export const ShopPage: React.FC = () => {
  const {
    gems,
    hearts,
    streakFreeze = 0,
    xpBoostUntil = 0,
    buyHeartWithGems,
    buyFullHeartsWithGems,
    buyStreakFreeze,
    buyXpBoost,
    addGems,
    addXp,
    addHearts,
  } = useUserStore();

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info';
    iconType?: 'gem' | 'heart' | 'streak' | 'xp' | 'shield';
  } | null>(null);
  const [isOpeningChest, setIsOpeningChest] = useState(false);
  const [chestReward, setChestReward] = useState<string | null>(null);

  // Remaining time for XP boost
  const [boostRemainingSeconds, setBoostRemainingSeconds] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const diff = Math.max(0, Math.floor(((xpBoostUntil ?? 0) - Date.now()) / 1000));
      setBoostRemainingSeconds(diff);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [xpBoostUntil]);

  const showToast = (
    message: string,
    type: 'success' | 'info' = 'success',
    iconType?: 'gem' | 'heart' | 'streak' | 'xp' | 'shield'
  ) => {
    setNotification({ message, type, iconType });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBuySingleHeart = () => {
    if (hearts >= GAMIFICATION.hearts.max) {
      showToast('Tim năng lượng đã đầy (5/5)!', 'info', 'heart');
      return;
    }
    if (gems < GAMIFICATION.gems.costPerHeart) {
      sound.playWrong();
      showToast(
        `Bạn cần thêm ${GAMIFICATION.gems.costPerHeart - gems} Đá quý để đổi tim!`,
        'info',
        'gem'
      );
      return;
    }
    const ok = buyHeartWithGems();
    if (ok) {
      sound.playCorrect();
      showToast('Đã đổi thành công 150 Đá quý lấy 1 Bình Tim!', 'success', 'heart');
    }
  };

  const handleBuyFullHearts = () => {
    if (hearts >= GAMIFICATION.hearts.max) {
      showToast('Tim năng lượng đã đầy (5/5)!', 'info', 'heart');
      return;
    }
    if (gems < GAMIFICATION.gems.costFullHearts) {
      sound.playWrong();
      showToast(
        `Bạn cần thêm ${GAMIFICATION.gems.costFullHearts - gems} Đá quý để hồi đầy bình!`,
        'info',
        'gem'
      );
      return;
    }
    const ok = buyFullHeartsWithGems();
    if (ok) {
      sound.playLevelUp();
      showToast('Đã hồi phục toàn bộ 5/5 Tim năng lượng!', 'success', 'heart');
    }
  };

  const handleBuyStreakFreeze = () => {
    if (streakFreeze >= 2) {
      showToast('Bạn đã trang bị tối đa 2 Khiên bảo vệ chuỗi ngày!', 'info', 'shield');
      return;
    }
    if (gems < GAMIFICATION.gems.costStreakFreeze) {
      sound.playWrong();
      showToast(
        `Bạn cần thêm ${GAMIFICATION.gems.costStreakFreeze - gems} Đá quý để mua khiên!`,
        'info',
        'gem'
      );
      return;
    }
    const ok = buyStreakFreeze();
    if (ok) {
      sound.playCorrect();
      showToast('Đã trang bị 1 Khiên Băng bảo vệ Chuỗi ngày học!', 'success', 'shield');
    }
  };

  const handleBuyXpBoost = () => {
    if (gems < GAMIFICATION.gems.costXpBoost) {
      sound.playWrong();
      showToast(
        `Bạn cần thêm ${GAMIFICATION.gems.costXpBoost - gems} Đá quý để mua Tăng tốc XP!`,
        'info',
        'gem'
      );
      return;
    }
    const ok = buyXpBoost();
    if (ok) {
      sound.playLevelUp();
      showToast('Đã kích hoạt Nhân đôi XP (2X) trong 15 phút!', 'success', 'xp');
    }
  };

  const handleOpenMysteryChest = () => {
    const chestCost = 120;
    if (gems < chestCost) {
      sound.playWrong();
      showToast(`Cần thêm ${chestCost - gems} Đá quý để mở Rương kho báu!`, 'info', 'gem');
      return;
    }
    setIsOpeningChest(true);
    sound.playClick();
    addGems(-chestCost);

    setTimeout(() => {
      sound.playLevelUp();
      const rand = Math.random();
      let rewardText = '';
      if (rand < 0.35) {
        const bonusGems = 150 + Math.floor(Math.random() * 150);
        addGems(bonusGems);
        rewardText = `Kho báu tỏa sáng: Nhận +${bonusGems} Đá quý tinh thể!`;
      } else if (rand < 0.7) {
        addHearts(2);
        rewardText = 'Nạp năng lượng: Nhận +2 Bình Tim thí nghiệm!';
      } else {
        addXp(60);
        rewardText = 'Đột phá kiến thức: Nhận +60 XP Kinh nghiệm phòng lab!';
      }
      setChestReward(rewardText);
      setIsOpeningChest(false);
    }, 1200);
  };

  const isFullHearts = hearts >= GAMIFICATION.hearts.max;
  const isMaxStreakFreeze = streakFreeze >= 2;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 select-none px-2 sm:px-0">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={cn(
              'fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl text-xs font-black shadow-2xl border-2 flex items-center gap-2.5 backdrop-blur-md',
              notification.type === 'success'
                ? 'bg-[#18272f]/95 border-emerald-500 text-emerald-300 shadow-[0_8px_25px_rgba(16,185,129,0.3)]'
                : 'bg-[#18272f]/95 border-cyan-500 text-cyan-300 shadow-[0_8px_25px_rgba(6,182,212,0.3)]'
            )}
          >
            {notification.iconType ? (
              <CurrencyIcon type={notification.iconType} size="sm" animate />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-400" />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. WALLET & DEPOT HERO BANNER ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-[#18272f] border-2 border-[#2e4756] p-5 sm:p-6 shadow-[0_4px_0_0_#131f24]"
      >
        {/* Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[11px] font-black uppercase tracking-wider text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cửa Hàng Tiếp Tế Phòng Lab</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Kho Trang Bị & Tiếp Sức
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed font-medium max-w-md">
              Dùng Đá quý thu thập từ các bài tập để nạp đầy bình Tim, kích hoạt khiên đóng băng và tăng tốc kinh nghiệm.
            </p>
          </div>

          {/* User Wallet Balance Summary */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2e4756]/60">
            <div className="hidden sm:block shrink-0 mb-1">
              <Mascot state="happy" size="sm" />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#131f24] border-2 border-[#2e4756] shadow-inner">
              <CurrencyIcon type="gem" size="sm" animate />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-bold leading-none">Đá quý sở hữu</span>
                <span className="text-lg font-black text-[#00cd9c] leading-tight">{gems}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1">
                <CurrencyIcon type="heart" size="xs" />
                <span className="text-rose-400 font-black">{isFullHearts ? 'Đầy (5/5)' : `${hearts}/5`}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <Snowflake className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-sky-400 font-black">{streakFreeze}/2 khiên</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 2. SECTION: NĂNG LƯỢNG HỌC TẬP (HEARTS) ── */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <CurrencyIcon type="heart" size="sm" />
            <span>Năng Lượng Thí Nghiệm ({isFullHearts ? 'Đầy 5/5' : `${hearts}/5`})</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">Tự động hồi đầy vào ngày mai</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Card: Refill 1 Heart */}
          <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] hover:border-rose-500/50 shadow-[0_4px_0_0_#131f24] flex flex-col justify-between space-y-4 transition-all group">
            <div className="flex items-start gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <CurrencyIcon type="heart" size="lg" animate={!isFullHearts} />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-black text-white group-hover:text-rose-300 transition-colors">
                  Hồi 1 Bình Tim
                </h3>
                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  Tiếp sức ngay 1 tim năng lượng để tiếp tục giải các bài tập đang dang dở.
                </p>
              </div>
            </div>

            {/* Action Button */}
            {isFullHearts ? (
              <div className="w-full py-3 px-4 rounded-2xl bg-[#1a2830] border-2 border-[#243641] text-slate-400 text-xs font-black flex items-center justify-center gap-2 select-none">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ĐÃ ĐẦY TIM (5/5)</span>
              </div>
            ) : gems >= 150 ? (
              <button
                onClick={handleBuySingleHeart}
                className="w-full py-3 px-4 rounded-2xl bg-[#ff4b4b] hover:bg-[#ff5c5c] text-white font-black text-xs sm:text-sm shadow-[0_4px_0_0_#d92d2d] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer border-t border-rose-300/30"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>150 ĐÁ QUÝ (+1 TIM)</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 px-4 rounded-2xl bg-[#1a2830] border-2 border-[#2e4756] text-slate-400 text-xs font-black flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>150 ĐÁ QUÝ</span>
                <span className="text-amber-400 text-[11px] font-bold">
                  (Cần thêm {150 - gems} 💎)
                </span>
              </button>
            )}
          </div>

          {/* Card: Full 5 Hearts Refill (Value Bundle) */}
          <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-amber-500/40 hover:border-amber-400 shadow-[0_4px_0_0_#131f24] flex flex-col justify-between space-y-4 transition-all group relative overflow-hidden">
            <div className="space-y-3">
              {/* Clean Value Badge (No overlap!) */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase border border-amber-500/40 inline-flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Tiết kiệm 300 Đá quý
                </span>
                <span className="text-[10px] font-bold text-amber-400/80 uppercase tracking-wider">
                  Gói Siêu Hời
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform relative">
                  <CurrencyIcon type="heart" size="lg" />
                  <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-sm font-black text-amber-300 group-hover:text-amber-200 transition-colors">
                    Bơm Trọn Vẹn 5/5 Tim
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    Hồi phục toàn bộ 5 bình năng lượng, cày bài tập thoải mái không giới hạn.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {isFullHearts ? (
              <div className="w-full py-3 px-4 rounded-2xl bg-[#1a2830] border-2 border-[#243641] text-slate-400 text-xs font-black flex items-center justify-center gap-2 select-none">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ĐÃ ĐẦY TIM (5/5)</span>
              </div>
            ) : gems >= 450 ? (
              <button
                onClick={handleBuyFullHearts}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-b from-[#ffaa00] to-[#ff9600] hover:from-[#ffb733] hover:to-[#ffa21a] text-slate-950 font-black text-xs sm:text-sm shadow-[0_4px_0_0_#ca8a04] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer border-t border-amber-200/50"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>450 ĐÁ QUÝ (HỒI ĐẦY 5 TIM)</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 px-4 rounded-2xl bg-[#1a2830] border-2 border-[#2e4756] text-slate-400 text-xs font-black flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>450 ĐÁ QUÝ</span>
                <span className="text-amber-400 text-[11px] font-bold">
                  (Cần thêm {450 - gems} 💎)
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 3. SECTION: TRANG BỊ HỖ TRỢ & TĂNG TỐC ── */}
      <div className="space-y-3 pt-1">
        <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2 px-1">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Trang Bị Hỗ Trợ & Nhân Đôi Kinh Nghiệm</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Card: Streak Freeze Shield */}
          <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] hover:border-sky-500/50 shadow-[0_4px_0_0_#131f24] flex flex-col justify-between space-y-4 transition-all group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  Đã có: {streakFreeze}/2 khiên
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Tối đa 2 khiên
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-sky-500/10 border-2 border-sky-500/30 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  <Snowflake className="w-6 h-6 text-sky-400" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-sm font-black text-white group-hover:text-sky-300 transition-colors">
                    Khiên Băng Chuỗi Ngày
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    Bảo vệ ngọn lửa Streak không bị tắt nếu bạn bận rộn không thể học 1 ngày.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {isMaxStreakFreeze ? (
              <div className="w-full py-3 px-4 rounded-2xl bg-[#1a2830] border-2 border-[#243641] text-slate-400 text-xs font-black flex items-center justify-center gap-2 select-none">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>ĐÃ TRANG BỊ TỐI ĐA (2/2)</span>
              </div>
            ) : gems >= 200 ? (
              <button
                onClick={handleBuyStreakFreeze}
                className="w-full py-3 px-4 rounded-2xl bg-[#0ea5e9] hover:bg-[#38bdf8] text-white font-black text-xs sm:text-sm shadow-[0_4px_0_0_#0284c7] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer border-t border-sky-300/30"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>200 ĐÁ QUÝ (1 KHIÊN BĂNG)</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 px-4 rounded-2xl bg-[#1a2830] border-2 border-[#2e4756] text-slate-400 text-xs font-black flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>200 ĐÁ QUÝ</span>
                <span className="text-amber-400 text-[11px] font-bold">
                  (Cần thêm {200 - gems} 💎)
                </span>
              </button>
            )}
          </div>

          {/* Card: 2X XP Potion */}
          <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] hover:border-emerald-500/50 shadow-[0_4px_0_0_#131f24] flex flex-col justify-between space-y-4 transition-all group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                {boostRemainingSeconds > 0 ? (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-emerald-400 animate-spin" />
                    Đang kích hoạt: {Math.floor(boostRemainingSeconds / 60)}:
                    {String(boostRemainingSeconds % 60).padStart(2, '0')}
                  </span>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Tăng tốc 15 phút
                  </span>
                )}
                <span className="text-[10px] font-bold text-slate-400">
                  +100% XP
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  <CurrencyIcon type="xp" size="lg" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
                    Bình Nhân Đôi XP (2X)
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    Nhận gấp đôi điểm kinh nghiệm trong mọi bài học và mini-game suốt 15 phút.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {gems >= 100 ? (
              <button
                onClick={handleBuyXpBoost}
                className="w-full py-3 px-4 rounded-2xl bg-[#58cc02] hover:bg-[#68d810] text-slate-950 font-black text-xs sm:text-sm shadow-[0_4px_0_0_#3fa802] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer border-t border-lime-200/40"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>
                  {boostRemainingSeconds > 0 ? '+15 PHÚT 2X (100 ĐÁ QUÝ)' : '100 ĐÁ QUÝ (15 PHÚT 2X)'}
                </span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 px-4 rounded-2xl bg-[#1a2830] border-2 border-[#2e4756] text-slate-400 text-xs font-black flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>100 ĐÁ QUÝ</span>
                <span className="text-amber-400 text-[11px] font-bold">
                  (Cần thêm {100 - gems} 💎)
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 4. SECTION: MYSTERY CHEST (ANIMATED GIFT VIDEO) ── */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#18272f] via-[#1c2c36] to-[#241f17] border-2 border-amber-500/30 hover:border-amber-400/60 shadow-[0_4px_0_0_#131f24] space-y-4 relative overflow-hidden transition-all group">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#131f24] border-2 border-amber-500/40 flex items-center justify-center p-1 shrink-0 shadow-inner overflow-hidden group-hover:scale-105 transition-transform">
              <video
                src={assetUrl('/assets/animations/gift.mp4')}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-amber-300">
                  Rương Kho Báu Bí Mật Phòng Lab
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Kho Báu
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Cơ hội nhận ngẫu nhiên tới <span className="text-[#00cd9c] font-black">+300 Đá quý</span>, bình hồi phục Tim hoặc gói XP khổng lồ!
              </p>
            </div>
          </div>
        </div>

        {chestReward && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-3.5 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-200 text-xs font-black text-center flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{chestReward}</span>
          </motion.div>
        )}

        {/* Action Button */}
        {gems >= 120 ? (
          <button
            disabled={isOpeningChest}
            onClick={handleOpenMysteryChest}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-[0_4px_0_0_#ca8a04] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer border-t border-amber-200/50"
          >
            <CurrencyIcon type="gem" size="xs" />
            <span>
              {isOpeningChest ? 'ĐANG MỞ RƯƠNG THÍ NGHIỆM…' : '120 ĐÁ QUÝ — MỞ RƯƠNG MAY MẮN'}
            </span>
          </button>
        ) : (
          <button
            disabled
            className="w-full py-3.5 px-5 rounded-2xl bg-[#1a2830] border-2 border-[#2e4756] text-slate-400 text-xs font-black flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
          >
            <CurrencyIcon type="gem" size="xs" />
            <span>120 ĐÁ QUÝ</span>
            <span className="text-amber-400 text-[11px] font-bold">
              (Cần thêm {120 - gems} 💎 để mở rương)
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
