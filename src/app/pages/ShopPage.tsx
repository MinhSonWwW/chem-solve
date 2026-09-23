import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, Clock } from 'lucide-react';
import { Button, Mascot, CurrencyIcon } from '@/design-system';
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

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info'; iconType?: 'gem' | 'heart' | 'streak' | 'xp' | 'shield' } | null>(null);
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

  const showToast = (message: string, type: 'success' | 'info' = 'success', iconType?: 'gem' | 'heart' | 'streak' | 'xp' | 'shield') => {
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
      showToast(`Bạn cần thêm ${GAMIFICATION.gems.costPerHeart - gems} Đá quý để đổi tim!`, 'info', 'gem');
      return;
    }
    const ok = buyHeartWithGems();
    if (ok) {
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
      showToast(`Bạn cần thêm ${GAMIFICATION.gems.costFullHearts - gems} Đá quý để hồi đầy bình!`, 'info', 'gem');
      return;
    }
    const ok = buyFullHeartsWithGems();
    if (ok) {
      showToast('Đã hồi phục đầy bình 5/5 Tim! Sẵn sàng chinh phục bài học!', 'success', 'heart');
    }
  };

  const handleBuyStreakFreeze = () => {
    if (streakFreeze >= 2) {
      showToast('Bạn đã trang bị tối đa 2 Khiên bảo vệ chuỗi ngày!', 'info', 'shield');
      return;
    }
    if (gems < GAMIFICATION.gems.costStreakFreeze) {
      sound.playWrong();
      showToast(`Bạn cần thêm ${GAMIFICATION.gems.costStreakFreeze - gems} Đá quý để mua khiên!`, 'info', 'gem');
      return;
    }
    const ok = buyStreakFreeze();
    if (ok) {
      showToast('Đã trang bị 1 Khiên Băng bảo vệ Chuỗi ngày học!', 'success', 'shield');
    }
  };

  const handleBuyXpBoost = () => {
    if (gems < GAMIFICATION.gems.costXpBoost) {
      sound.playWrong();
      showToast(`Bạn cần thêm ${GAMIFICATION.gems.costXpBoost - gems} Đá quý để mua Tăng tốc XP!`, 'info', 'gem');
      return;
    }
    const ok = buyXpBoost();
    if (ok) {
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

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 select-none">
      {/* Toast Notification with Custom 3D Icon */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={cn(
              'fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl text-xs font-black shadow-2xl border-2 flex items-center gap-2.5',
              notification.type === 'success'
                ? 'bg-[#18272f] border-emerald-500 text-emerald-200 shadow-[0_6px_20px_rgba(16,185,129,0.35)]'
                : 'bg-[#18272f] border-cyan-500 text-cyan-200 shadow-[0_6px_20px_rgba(6,182,212,0.35)]'
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

      {/* 1. Laboratory Supply Depot Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-[#18272f] border-2 border-[#2e4756] p-5 sm:p-6 shadow-[0_4px_0_0_#131f24]"
      >
        {/* Subtle Ambient Radial Backlight */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0ea5e9]/20 border border-[#0ea5e9]/40 text-[11px] font-black uppercase tracking-wider text-[#38bdf8]">
              <Sparkles className="w-3.5 h-3.5 text-[#0ea5e9]" />
              <span>Tiếp Tế Phòng Lab</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              Kho Trang Bị & Tiếp Sức
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed font-medium max-w-sm">
              Dùng Đá quý thu thập từ các bài tập để nạp đầy bình Tim, kích hoạt khiên đóng băng và tăng tốc độ nhân kinh nghiệm.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-2">
            <Mascot state="happy" size="lg" />
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#131f24] border-2 border-[#2e4756] shadow-inner">
              <CurrencyIcon type="gem" size="sm" animate />
              <span className="text-base font-black text-[#00cd9c]">{gems}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Section: Hồi Phục Tim (Heart Energy) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <CurrencyIcon type="heart" size="sm" />
            <span>Năng Lượng Thí Nghiệm ({hearts}/5)</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">Tự động hồi đầy vào ngày mai</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Card: 1 Heart Single Refill */}
          <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] hover:border-rose-500/40 shadow-[0_4px_0_0_#131f24] flex flex-col justify-between space-y-4 transition-all relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-13 h-13 rounded-2xl bg-[#ff4b4b]/15 border-2 border-[#ff4b4b]/30 flex items-center justify-center shrink-0 shadow-inner">
                <CurrencyIcon type="heart" size="lg" animate />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-black text-white">Nạp 1 Bình Tim</h3>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Tiếp sức ngay 1 tim năng lượng để tiếp tục hoàn thành chặng học đang dang dở.
                </p>
              </div>
            </div>

            <Button
              variant={hearts >= 5 ? 'secondary' : gems >= 150 ? 'gem' : 'secondary'}
              size="md"
              fullWidth
              disabled={hearts >= 5 || gems < 150}
              onClick={handleBuySingleHeart}
              className={cn(
                'flex items-center justify-center gap-2 font-black shadow-[0_4px_0_0_#0284c7] active:translate-y-1 active:shadow-none',
                hearts >= 5 && 'opacity-40 cursor-not-allowed text-slate-400 shadow-none'
              )}
            >
              {hearts >= 5 ? (
                <span>ĐÃ ĐẦY TIM (5/5)</span>
              ) : (
                <>
                  <CurrencyIcon type="gem" size="xs" />
                  <span>150 ĐÁ QUÝ (+1 TIM)</span>
                </>
              )}
            </Button>
          </div>

          {/* Card: Full 5 Hearts Refill (Gold Pedestal) */}
          <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#ff9600]/50 hover:border-[#ff9600] shadow-[0_4px_0_0_#131f24] flex flex-col justify-between space-y-4 transition-all relative overflow-hidden">
            {/* 3D Value Ribbon */}
            <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-lg bg-[#ff9600]/25 text-[#ff9600] text-[10px] font-black uppercase border border-[#ff9600]/50 flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>Tiết kiệm 300 Đá quý</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-13 h-13 rounded-2xl bg-[#ff9600]/15 border-2 border-[#ff9600]/40 flex items-center justify-center shrink-0 shadow-inner relative">
                <CurrencyIcon type="heart" size="lg" />
                <Sparkles className="w-3.5 h-3.5 text-amber-400 absolute -top-1 -right-1" />
              </div>
              <div className="space-y-1 flex-1 pr-14 sm:pr-0">
                <h3 className="text-sm font-black text-amber-300">Bơm Trọn Vẹn 5/5 Tim</h3>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Hồi phục toàn bộ 5 bình năng lượng và nhận thêm năng suất tối đa.
                </p>
              </div>
            </div>

            <Button
              variant={hearts >= 5 ? 'secondary' : gems >= 450 ? 'warning' : 'secondary'}
              size="md"
              fullWidth
              disabled={hearts >= 5 || gems < 450}
              onClick={handleBuyFullHearts}
              className={cn(
                'flex items-center justify-center gap-2 font-black shadow-[0_4px_0_0_#b45309] active:translate-y-1 active:shadow-none',
                hearts >= 5 && 'opacity-40 cursor-not-allowed text-slate-400 shadow-none'
              )}
            >
              {hearts >= 5 ? (
                <span>ĐÃ ĐẦY TIM (5/5)</span>
              ) : (
                <>
                  <CurrencyIcon type="gem" size="xs" />
                  <span>450 ĐÁ QUÝ (HỒI ĐẦY 5 TIM)</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Section: Trang Bị & Tăng Tốc (Power-ups & Streaks) */}
      <div className="space-y-3">
        <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2 px-1">
          <Zap className="w-4 h-4 text-[#ff9600] fill-[#ff9600]" />
          <span>Trang Bị Hỗ Trợ & Nhân Đôi Kinh Nghiệm</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Card: Streak Freeze Shield */}
          <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] hover:border-cyan-500/40 shadow-[0_4px_0_0_#131f24] flex flex-col justify-between space-y-4 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-13 h-13 rounded-2xl bg-[#0ea5e9]/15 border-2 border-[#0ea5e9]/30 flex items-center justify-center shrink-0 shadow-inner">
                <CurrencyIcon type="freeze" size="md" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white">Khiên Băng Chuỗi Ngày</h3>
                  <span className="text-[10px] font-bold text-[#38bdf8] bg-[#0ea5e9]/15 px-2 py-0.5 rounded-md border border-[#0ea5e9]/30">
                    Đã có: {streakFreeze}/2
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Bảo vệ ngọn lửa Streak không bị tắt nếu bạn bận rộn không thể học 1 ngày.
                </p>
              </div>
            </div>

            <Button
              variant={streakFreeze >= 2 ? 'secondary' : gems >= 200 ? 'primary' : 'secondary'}
              size="md"
              fullWidth
              disabled={streakFreeze >= 2 || gems < 200}
              onClick={handleBuyStreakFreeze}
              className={cn(
                'flex items-center justify-center gap-2 font-black shadow-[0_4px_0_0_#0369a1] active:translate-y-1 active:shadow-none',
                streakFreeze >= 2 && 'opacity-40 cursor-not-allowed text-slate-400 shadow-none'
              )}
            >
              {streakFreeze >= 2 ? (
                <span>TỐI ĐA 2 KHIÊN BẢO VỆ</span>
              ) : (
                <>
                  <CurrencyIcon type="gem" size="xs" />
                  <span>200 ĐÁ QUÝ (1 KHIÊN BĂNG)</span>
                </>
              )}
            </Button>
          </div>

          {/* Card: 2X XP Potion */}
          <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] hover:border-emerald-500/40 shadow-[0_4px_0_0_#131f24] flex flex-col justify-between space-y-4 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-13 h-13 rounded-2xl bg-[#58cc02]/15 border-2 border-[#58cc02]/30 flex items-center justify-center shrink-0 shadow-inner">
                <CurrencyIcon type="xp" size="lg" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white">Bình Nhân Đôi XP (2X)</h3>
                  {boostRemainingSeconds > 0 && (
                    <span className="text-[10px] font-bold text-[#58cc02] bg-[#58cc02]/15 px-2 py-0.5 rounded-md border border-[#58cc02]/30 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {Math.floor(boostRemainingSeconds / 60)}:
                      {String(boostRemainingSeconds % 60).padStart(2, '0')}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Nhận gấp đôi điểm kinh nghiệm trong mọi bài học suốt 15 phút.
                </p>
              </div>
            </div>

            <Button
              variant={gems >= 100 ? 'success' : 'secondary'}
              size="md"
              fullWidth
              disabled={gems < 100}
              onClick={handleBuyXpBoost}
              className="flex items-center justify-center gap-2 font-black shadow-[0_4px_0_0_#15803d] active:translate-y-1 active:shadow-none"
            >
              <CurrencyIcon type="gem" size="xs" />
              <span>
                {boostRemainingSeconds > 0 ? '+15 PHÚT (100 ĐÁ QUÝ)' : '100 ĐÁ QUÝ (15 PHÚT 2X)'}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* 4. Section: Mystery Chest (Animated Gift Video) */}
      <div className="p-5 rounded-3xl bg-[#18272f] border-2 border-[#ce82ff]/50 hover:border-[#ce82ff] shadow-[0_4px_0_0_#131f24] space-y-4 relative overflow-hidden transition-all">
        <div className="flex items-center justify-between gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#131f24] border-2 border-[#ce82ff]/40 flex items-center justify-center p-1 shrink-0 shadow-inner overflow-hidden">
            <video
              src={assetUrl('/assets/animations/gift.mp4')}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="text-sm sm:text-base font-black text-white">Rương Kho Báu Thí Nghiệm</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Mở khóa bí mật phòng Lab: Cơ hội nhận được tới <span className="text-[#00cd9c] font-black">300 Đá quý</span>, bình hồi phục Tim hoặc gói XP khổng lồ!
            </p>
          </div>
        </div>

        {chestReward && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-3 rounded-2xl bg-[#ce82ff]/15 border-2 border-[#ce82ff]/40 text-[#ce82ff] text-xs font-black text-center"
          >
            {chestReward}
          </motion.div>
        )}

        <Button
          variant="primary"
          size="md"
          fullWidth
          disabled={gems < 120 || isOpeningChest}
          onClick={handleOpenMysteryChest}
          className="flex items-center justify-center gap-2 font-black bg-[#ce82ff] hover:bg-[#d99bff] text-white shadow-[0_4px_0_0_#9d4edd] active:translate-y-1 active:shadow-none"
        >
          <CurrencyIcon type="gem" size="xs" />
          <span>{isOpeningChest ? 'ĐANG MỞ RƯƠNG THÍ NGHIỆM…' : 'MỞ RƯƠNG (120 ĐÁ QUÝ)'}</span>
        </Button>
      </div>
    </div>
  );
};
