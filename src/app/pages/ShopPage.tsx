import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Shield, Zap, Clock } from 'lucide-react';
import { Button, Card, Mascot } from '@/design-system';
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

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
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

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBuySingleHeart = () => {
    if (hearts >= GAMIFICATION.hearts.max) {
      showToast('Tim của bạn đã đầy (5/5) rồi!', 'info');
      return;
    }
    if (gems < GAMIFICATION.gems.costPerHeart) {
      sound.playWrong();
      showToast(`Bạn cần thêm ${GAMIFICATION.gems.costPerHeart - gems} 💎 để đổi 1 tim!`, 'info');
      return;
    }
    const ok = buyHeartWithGems();
    if (ok) {
      showToast('Đã đổi thành công 150 💎 lấy 1 Tim! ❤️');
    }
  };

  const handleBuyFullHearts = () => {
    if (hearts >= GAMIFICATION.hearts.max) {
      showToast('Tim của bạn đã đầy (5/5) rồi!', 'info');
      return;
    }
    if (gems < GAMIFICATION.gems.costFullHearts) {
      sound.playWrong();
      showToast(`Bạn cần thêm ${GAMIFICATION.gems.costFullHearts - gems} 💎 để hồi đầy bình!`, 'info');
      return;
    }
    const ok = buyFullHeartsWithGems();
    if (ok) {
      showToast('Đã hồi phục đầy 5 Tim! Chuẩn bị chinh phục bài học nào! 🎉');
    }
  };

  const handleBuyStreakFreeze = () => {
    if (streakFreeze >= 2) {
      showToast('Bạn đã trang bị tối đa 2 Khiên đóng băng chuỗi rồi!', 'info');
      return;
    }
    if (gems < GAMIFICATION.gems.costStreakFreeze) {
      sound.playWrong();
      showToast(`Bạn cần thêm ${GAMIFICATION.gems.costStreakFreeze - gems} 💎 để mua khiên!`, 'info');
      return;
    }
    const ok = buyStreakFreeze();
    if (ok) {
      showToast('Đã mua 1 Khiên Băng bảo vệ Chuỗi ngày học! ❄️');
    }
  };

  const handleBuyXpBoost = () => {
    if (gems < GAMIFICATION.gems.costXpBoost) {
      sound.playWrong();
      showToast(`Bạn cần thêm ${GAMIFICATION.gems.costXpBoost - gems} 💎 để mua Tăng tốc XP!`, 'info');
      return;
    }
    const ok = buyXpBoost();
    if (ok) {
      showToast('Đã kích hoạt Nhân đôi XP (2X) trong 15 phút! ⚡');
    }
  };

  const handleOpenMysteryChest = () => {
    const chestCost = 120;
    if (gems < chestCost) {
      sound.playWrong();
      showToast(`Cần ${chestCost - gems} 💎 nữa để mở Rương kho báu!`, 'info');
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
        rewardText = `💎 Trúng lớn: +${bonusGems} Đá quý thần kỳ!`;
      } else if (rand < 0.7) {
        addHearts(2);
        rewardText = '❤️ Hồi phục: +2 Bình Tim thí nghiệm!';
      } else {
        addXp(60);
        rewardText = '⚡ Thần tốc: +60 XP Kinh nghiệm phòng lab!';
      }
      setChestReward(rewardText);
      setIsOpeningChest(false);
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 select-none">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={cn(
              'fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl text-xs font-black shadow-xl border flex items-center gap-2',
              notification.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200'
                : 'bg-cyan-950/90 border-cyan-500/60 text-cyan-200'
            )}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-[#18272f] border-2 border-[#2e4756] p-5 sm:p-6 shadow-[0_4px_0_0_#131f24]"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0ea5e9]/20 border border-[#0ea5e9]/40 text-[11px] font-black uppercase tracking-wider text-[#38bdf8]">
              <Sparkles className="w-3.5 h-3.5 text-[#0ea5e9]" />
              <span>Cửa hàng Phòng Lab</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              Đổi Đá Quý & Tiếp Sức
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed font-medium max-w-sm">
              Sử dụng Đá quý kiếm được sau mỗi bài học để hồi phục Tim, bảo vệ chuỗi ngày và nhân đôi kinh nghiệm!
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-2">
            <Mascot state="happy" size="lg" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#20333d] border-2 border-[#2e4756] shadow-sm">
              <img src={assetUrl('/assets/icons/gem-crystal.png')} alt="Gem" className="w-5 h-5 object-contain" />
              <span className="text-base font-black text-[#00cd9c]">{gems}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Section: Hồi Phục Tim (Hearts) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-500" />
            <span>Năng Lượng & Số Tim ({hearts}/5)</span>
          </h2>
          <span className="text-[11px] text-slate-400">Tự động hồi đầy vào ngày mai</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Card: 1 Heart */}
          <Card className="p-4 flex flex-col justify-between space-y-4 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ff4b4b]/15 border-2 border-[#ff4b4b]/30 flex items-center justify-center shrink-0 shadow-inner">
                <img
                  src={assetUrl('/assets/icons/heart-flask.png')}
                  alt="1 Heart"
                  className="w-7 h-7 object-contain animate-pulse"
                />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-black text-white">Hồi phục 1 Tim</h3>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Cộng ngay 1 tim để tiếp tục làm bài học đang dang dở.
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
                'flex items-center justify-center gap-2 font-black',
                hearts >= 5 && 'opacity-40 cursor-not-allowed text-slate-400'
              )}
            >
              {hearts >= 5 ? (
                <span>ĐÃ ĐẦY TIM (5/5)</span>
              ) : (
                <>
                  <img src={assetUrl('/assets/icons/gem-crystal.png')} alt="Gem" className="w-4 h-4 object-contain" />
                  <span>150 ĐÁ QUÝ (+1 ❤️)</span>
                </>
              )}
            </Button>
          </Card>

          {/* Card: Full 5 Hearts Refill */}
          <Card className="p-4 flex flex-col justify-between space-y-4 border-2 border-[#ff9600]/40 hover:border-[#ff9600]/70 transition-all relative">
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-[#ff9600]/20 text-[#ff9600] text-[10px] font-black uppercase border border-[#ff9600]/40">
              Tiết kiệm 300 💎
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ff9600]/15 border-2 border-[#ff9600]/30 flex items-center justify-center shrink-0 shadow-inner">
                <div className="relative flex items-center justify-center">
                  <img
                    src={assetUrl('/assets/icons/heart-flask.png')}
                    alt="Full Hearts"
                    className="w-7 h-7 object-contain"
                  />
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 absolute -top-1 -right-1" />
                </div>
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-black text-amber-300">Bơm Đầy 5/5 Tim</h3>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Làm đầy trọn vẹn 5 bình năng lượng thí nghiệm.
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
                'flex items-center justify-center gap-2 font-black',
                hearts >= 5 && 'opacity-40 cursor-not-allowed text-slate-400'
              )}
            >
              {hearts >= 5 ? (
                <span>ĐÃ ĐẦY TIM (5/5)</span>
              ) : (
                <>
                  <img src={assetUrl('/assets/icons/gem-crystal.png')} alt="Gem" className="w-4 h-4 object-contain" />
                  <span>450 ĐÁ QUÝ (HỒI ĐẦY 5 ❤️)</span>
                </>
              )}
            </Button>
          </Card>
        </div>
      </div>

      {/* 3. Section: Trang Bị & Tăng Tốc (Power-ups & Streaks) */}
      <div className="space-y-3">
        <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2 px-1">
          <Zap className="w-4 h-4 text-[#ff9600] fill-[#ff9600]" />
          <span>Vật Phẩm Hỗ Trợ & Tăng Tốc</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Card: Streak Freeze */}
          <Card className="p-4 flex flex-col justify-between space-y-4 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0ea5e9]/15 border-2 border-[#0ea5e9]/30 flex items-center justify-center shrink-0 shadow-inner">
                <Shield className="w-6 h-6 text-[#38bdf8]" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white">Khiên Đóng Băng</h3>
                  <span className="text-[10px] font-bold text-[#38bdf8] bg-[#0ea5e9]/15 px-2 py-0.5 rounded-md border border-[#0ea5e9]/30">
                    Có: {streakFreeze}/2
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Bảo vệ chuỗi Streak không bị đứt nếu bạn quên học 1 ngày.
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
                'flex items-center justify-center gap-2 font-black',
                streakFreeze >= 2 && 'opacity-40 cursor-not-allowed text-slate-400'
              )}
            >
              {streakFreeze >= 2 ? (
                <span>ĐÃ ĐẠT TỐI ĐA (2/2 KHIÊN)</span>
              ) : (
                <>
                  <img src={assetUrl('/assets/icons/gem-crystal.png')} alt="Gem" className="w-4 h-4 object-contain" />
                  <span>200 ĐÁ QUÝ (MUA 1 KHIÊN)</span>
                </>
              )}
            </Button>
          </Card>

          {/* Card: 2X XP Boost */}
          <Card className="p-4 flex flex-col justify-between space-y-4 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#58cc02]/15 border-2 border-[#58cc02]/30 flex items-center justify-center shrink-0 shadow-inner">
                <img
                  src={assetUrl('/assets/icons/xp-potion.png')}
                  alt="XP Potion"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white">2X XP Tăng Tốc</h3>
                  {boostRemainingSeconds > 0 && (
                    <span className="text-[10px] font-bold text-[#58cc02] bg-[#58cc02]/15 px-2 py-0.5 rounded-md border border-[#58cc02]/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.floor(boostRemainingSeconds / 60)}:
                      {String(boostRemainingSeconds % 60).padStart(2, '0')}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Nhận gấp đôi điểm XP bài học trong vòng 15 phút.
                </p>
              </div>
            </div>

            <Button
              variant={gems >= 100 ? 'success' : 'secondary'}
              size="md"
              fullWidth
              disabled={gems < 100}
              onClick={handleBuyXpBoost}
              className="flex items-center justify-center gap-2 font-black"
            >
              <img src={assetUrl('/assets/icons/gem-crystal.png')} alt="Gem" className="w-4 h-4 object-contain" />
              <span>
                {boostRemainingSeconds > 0 ? '+15 PHÚT (100 ĐÁ QUÝ)' : '100 ĐÁ QUÝ (15 PHÚT 2X)'}
              </span>
            </Button>
          </Card>
        </div>
      </div>

      {/* 4. Section: Rương May Mắn Phòng Lab (Mystery Chest) */}
      <Card className="p-5 border-2 border-[#ce82ff]/40 space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#20333d] border-2 border-[#ce82ff]/40 flex items-center justify-center p-1 shrink-0 shadow-inner overflow-hidden">
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
              Mở khóa bí ẩn phòng Lab: Cơ hội nhận được lên tới <span className="text-[#00cd9c] font-bold">300 Đá quý</span>, bình hồi phục Tim hoặc gói XP khổng lồ!
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
          className="flex items-center justify-center gap-2 font-black bg-[#ce82ff] hover:bg-[#d99bff] text-white shadow-[0_4px_0_0_#9d4edd]"
        >
          <img src={assetUrl('/assets/icons/gem-crystal.png')} alt="Gem" className="w-4 h-4 object-contain" />
          <span>{isOpeningChest ? 'ĐANG MỞ RƯƠNG…' : 'MỞ RƯƠNG (120 ĐÁ QUÝ)'}</span>
        </Button>
      </Card>
    </div>
  );
};
