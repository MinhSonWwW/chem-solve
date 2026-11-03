import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { Mascot, CurrencyIcon } from '@/design-system';
import { HandDrawnIcon } from '@/design-system/components/HandDrawnIcon';
import { DoodleOrnament } from '@/design-system/components/DoodleOrnament';
import { useUserStore } from '@/features/gamification/useUserStore';
import { GAMIFICATION } from '@/config/gamification';
import { assetUrl, cn } from '@/lib/utils';
import { sound } from '@/lib/audio';
import { copyVi } from '@/copy/vi';

/**
 * Hiệu ứng bọt khí tim nổi lên từ đáy bình
 */
const HeartBubbles: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
    <motion.span
      className="absolute bottom-2 left-3 w-1.5 h-1.5 rounded-full bg-rose-400/80"
      animate={{ y: [-2, -22], opacity: [0, 0.9, 0], scale: [0.6, 1, 0.4] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.2 }}
    />
    <motion.span
      className="absolute bottom-3 right-3.5 w-2 h-2 rounded-full bg-rose-300/80"
      animate={{ y: [-2, -26], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 0.9 }}
    />
    <motion.span
      className="absolute bottom-4 left-6 w-1 h-1 rounded-full bg-pink-300/90"
      animate={{ y: [-2, -18], opacity: [0, 0.8, 0], scale: [0.7, 1.1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 1.4 }}
    />
  </div>
);

/**
 * Hiệu ứng sương khói tuyết lạnh và tia sáng băng giá bay nhẹ quanh khiên
 */
const FrostMist: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
    <motion.div
      className="absolute top-1.5 left-1.5"
      animate={{ y: [-2, 3, -2], opacity: [0.35, 0.85, 0.35], rotate: [0, 15, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <DoodleOrnament name="glint" size={12} color="var(--chem-fg)" />
    </motion.div>
    <motion.div
      className="absolute top-2 right-1.5"
      animate={{ y: [2, -3, 2], opacity: [0.4, 0.9, 0.4], rotate: [0, -20, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
    >
      <DoodleOrnament name="sparkle-star" size={10} color="var(--chem)" />
    </motion.div>
    <motion.span
      className="absolute bottom-2 right-3 w-1.5 h-1.5 rounded-full bg-sky-300/60 blur-[0.5px]"
      animate={{ y: [0, -6, 0], opacity: [0.2, 0.7, 0.2] }}
      transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut', delay: 1.0 }}
    />
  </div>
);

/**
 * Hiệu ứng tia năng lượng và bọt khí sôi sục quanh bình XP
 */
const PotionFizz: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
    <motion.div
      className="absolute top-1.5 right-1.5"
      animate={{ scale: [0.7, 1.15, 0.7], opacity: [0.4, 0.95, 0.4] }}
      transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
    >
      <DoodleOrnament name="sparkle-star" size={12} color="var(--ok)" />
    </motion.div>
    <motion.span
      className="absolute bottom-2 left-3 w-1.5 h-1.5 rounded-full bg-emerald-400/80"
      animate={{ y: [-2, -22], opacity: [0, 0.9, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
    />
    <motion.span
      className="absolute bottom-3 right-3 w-1 h-1 rounded-full bg-lime-300/80"
      animate={{ y: [-2, -18], opacity: [0, 0.8, 0] }}
      transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut', delay: 1.1 }}
    />
  </div>
);

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

  // Thời gian còn lại của gói X2 XP
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
        rewardText = `Kho báu tỏa sáng rực rỡ: Nhận +${bonusGems} Đá quý tinh thể!`;
      } else if (rand < 0.7) {
        addHearts(2);
        rewardText = 'Nạp năng lượng dồi dào: Nhận +2 Bình Tim thí nghiệm!';
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
              'fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl text-xs font-black shadow-2xl border flex items-center gap-2.5 backdrop-blur-md',
              notification.type === 'success'
                ? 'bg-[var(--bg-surface)] border-[var(--ok-fill)] text-[var(--ok-fg)]'
                : 'bg-[var(--bg-surface)] border-[var(--chem-fill)] text-[var(--chem-fg)]'
            )}
          >
            {notification.iconType ? (
              <CurrencyIcon type={notification.iconType} size="sm" animate />
            ) : (
              <DoodleOrnament name="sparkle-star" size={16} color="var(--gold-fill)" />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. WALLET & DEPOT HERO BANNER ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] p-5 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--gem-tint)] border border-[var(--gem-edge)]/40 text-[11px] font-black uppercase tracking-wider text-[var(--gem-fg)]">
              <DoodleOrnament name="sparkle-star" size={14} color="var(--gem-fg)" />
              <span>{copyVi.shop.hero.badge}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
              <span>{copyVi.shop.hero.title}</span>
              <DoodleOrnament name="glint" size={18} color="var(--gem-fg)" />
            </h1>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium max-w-md">
              {copyVi.shop.hero.desc}
            </p>
          </div>

          {/* User Wallet Balance Summary */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--border)]">
            <div className="hidden sm:block shrink-0 mb-1">
              <Mascot state="happy" size="sm" />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)]">
              <CurrencyIcon type="gem" size="sm" animate />
              <div className="text-left">
                <span className="text-[10px] text-[var(--text-tertiary)] block font-bold leading-none">Đá quý sở hữu</span>
                <span className="text-lg font-black text-[var(--gem-fg)] leading-tight">{gems}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <CurrencyIcon type="heart" size="xs" />
                <span className="text-[var(--err-fg)] font-black">{isFullHearts ? 'Đầy (5/5)' : `${hearts}/5`}</span>
              </span>
              <span className="text-[var(--text-tertiary)]">•</span>
              <span className="flex items-center gap-1.5">
                <HandDrawnIcon name="ice-shield" size={16} />
                <span className="text-[var(--warn-fg)] font-black">{streakFreeze}/2 khiên</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 2. SECTION: NĂNG LƯỢNG HỌC TẬP (HEARTS) ── */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
            <HandDrawnIcon name="heart-flask" size={22} />
            <span>Năng Lượng Thí Nghiệm ({isFullHearts ? 'Đầy 5/5' : `${hearts}/5`})</span>
          </h2>
          <span className="text-[11px] text-[var(--text-tertiary)] font-medium">Tự động hồi đầy vào ngày mai</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Card: Refill 1 Heart */}
          <div className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--err-fill)] flex flex-col justify-between space-y-4 transition-all group relative overflow-hidden">
            <div className="flex items-start gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-[var(--err-tint)] border border-[var(--err-edge)]/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform relative">
                <HandDrawnIcon name="heart-flask" size={40} />
                <HeartBubbles />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-black text-[var(--text-primary)] group-hover:text-[var(--err-fg)] transition-colors">
                  {copyVi.shop.items.heartSingle.title}
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-medium">
                  {copyVi.shop.items.heartSingle.desc}
                </p>
              </div>
            </div>

            {/* Action Button */}
            {isFullHearts ? (
              <div className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-tertiary)] text-xs font-black flex items-center justify-center gap-2 select-none">
                <CheckCircle2 className="w-4 h-4 text-[var(--ok-fg)] shrink-0" />
                <span>{copyVi.shop.status.fullHearts}</span>
              </div>
            ) : gems >= 150 ? (
              <button
                onClick={handleBuySingleHeart}
                className="w-full py-3 px-4 rounded-2xl bg-[var(--err-fill)] text-white shadow-[0_4px_0_0_var(--err-edge)] active:translate-y-1 active:shadow-none hover:brightness-110 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>150 ĐÁ QUÝ (+1 TIM)</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-tertiary)] text-xs font-black flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>150 ĐÁ QUÝ</span>
                <span className="text-[var(--warn-fg)] text-[11px] font-bold">
                  ({copyVi.shop.status.needMoreGems(150 - gems)})
                </span>
              </button>
            )}
          </div>

          {/* Card: Full 5 Hearts Refill (Value Bundle) */}
          <div className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--gold-fill)] flex flex-col justify-between space-y-4 transition-all group relative overflow-hidden">
            <div className="space-y-3">
              {/* Clean Value Badge (No overlap!) */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--gold-tint)] text-[var(--gold-fg)] text-[10px] font-black uppercase border border-[var(--gold-edge)]/40 inline-flex items-center gap-1">
                  <DoodleOrnament name="sparkle-star" size={12} color="var(--gold-fill)" />
                  Tiết kiệm 300 Đá quý
                </span>
                <span className="text-[10px] font-bold text-[var(--gold-fg)] uppercase tracking-wider">
                  {copyVi.shop.items.heartFull.badge}
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[var(--err-tint)] border border-[var(--err-edge)]/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform relative">
                  <HandDrawnIcon name="heart-flask" size={40} />
                  <HeartBubbles />
                  <div className="absolute -top-1.5 -right-1.5">
                    <DoodleOrnament name="glint" size={14} color="var(--gold-fill)" />
                  </div>
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-sm font-black text-[var(--text-primary)] group-hover:text-[var(--gold-fg)] transition-colors">
                    {copyVi.shop.items.heartFull.title}
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-medium">
                    {copyVi.shop.items.heartFull.desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {isFullHearts ? (
              <div className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-tertiary)] text-xs font-black flex items-center justify-center gap-2 select-none">
                <CheckCircle2 className="w-4 h-4 text-[var(--ok-fg)] shrink-0" />
                <span>{copyVi.shop.status.fullHearts}</span>
              </div>
            ) : gems >= 450 ? (
              <button
                onClick={handleBuyFullHearts}
                className="w-full py-3 px-4 rounded-2xl bg-[var(--gold-fill)] text-[var(--on-ink)] shadow-[0_4px_0_0_var(--gold-edge)] active:translate-y-1 active:shadow-none hover:brightness-105 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>450 ĐÁ QUÝ (HỒI ĐẦY 5 TIM)</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-tertiary)] text-xs font-black flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>450 ĐÁ QUÝ</span>
                <span className="text-[var(--warn-fg)] text-[11px] font-bold">
                  ({copyVi.shop.status.needMoreGems(450 - gems)})
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 3. SECTION: TRANG BỊ HỖ TRỢ & TĂNG TỐC ── */}
      <div className="space-y-3 pt-1">
        <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2 px-1">
          <HandDrawnIcon name="flame" size={20} />
          <span>Trang Bị Hỗ Trợ & Nhân Đôi Kinh Nghiệm</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Card: Streak Freeze Shield */}
          <div className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--warn-fill)] flex flex-col justify-between space-y-4 transition-all group relative overflow-hidden">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--warn-tint)] text-[var(--warn-fg)] border border-[var(--warn-edge)]/40">
                  Đã có: {streakFreeze}/2 khiên
                </span>
                <span className="text-[10px] font-bold text-[var(--text-tertiary)]">
                  Tối đa 2 khiên
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[var(--warn-tint)] border border-[var(--warn-edge)]/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform relative">
                  <HandDrawnIcon name="ice-shield" size={40} />
                  <FrostMist />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-sm font-black text-[var(--text-primary)] group-hover:text-[var(--warn-fg)] transition-colors">
                    {copyVi.shop.items.streakFreeze.title}
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-medium">
                    {copyVi.shop.items.streakFreeze.desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {isMaxStreakFreeze ? (
              <div className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-tertiary)] text-xs font-black flex items-center justify-center gap-2 select-none">
                <CheckCircle2 className="w-4 h-4 text-[var(--ok-fg)] shrink-0" />
                <span>{copyVi.shop.status.maxShield}</span>
              </div>
            ) : gems >= 200 ? (
              <button
                onClick={handleBuyStreakFreeze}
                className="w-full py-3 px-4 rounded-2xl bg-[var(--warn-fill)] text-[var(--on-ink)] shadow-[0_4px_0_0_var(--warn-edge)] active:translate-y-1 active:shadow-none hover:brightness-105 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>200 ĐÁ QUÝ (1 KHIÊN BĂNG)</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-tertiary)] text-xs font-black flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>200 ĐÁ QUÝ</span>
                <span className="text-[var(--warn-fg)] text-[11px] font-bold">
                  ({copyVi.shop.status.needMoreGems(200 - gems)})
                </span>
              </button>
            )}
          </div>

          {/* Card: 2X XP Potion */}
          <div className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--gold-fill)] flex flex-col justify-between space-y-4 transition-all group relative overflow-hidden">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                {boostRemainingSeconds > 0 ? (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--gold-tint)] text-[var(--gold-fg)] border border-[var(--gold-edge)]/40 inline-flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-[var(--gold-fg)] animate-spin" />
                    {copyVi.shop.status.activeBoost(
                      `${Math.floor(boostRemainingSeconds / 60)}:${String(boostRemainingSeconds % 60).padStart(2, '0')}`
                    )}
                  </span>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--gold-tint)] text-[var(--gold-fg)] border border-[var(--gold-edge)]/40">
                    Tăng tốc 15 phút
                  </span>
                )}
                <span className="text-[10px] font-bold text-[var(--text-tertiary)]">
                  +100% XP
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[var(--gold-tint)] border border-[var(--gold-edge)]/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform relative">
                  <HandDrawnIcon name="xp-potion" size={40} />
                  <PotionFizz />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-sm font-black text-[var(--text-primary)] group-hover:text-[var(--gold-fg)] transition-colors">
                    {copyVi.shop.items.xpBoost.title}
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-medium">
                    {copyVi.shop.items.xpBoost.desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {gems >= 100 ? (
              <button
                onClick={handleBuyXpBoost}
                className="w-full py-3 px-4 rounded-2xl bg-[var(--gold-fill)] text-[var(--on-ink)] shadow-[0_4px_0_0_var(--gold-edge)] active:translate-y-1 active:shadow-none hover:brightness-105 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>
                  {boostRemainingSeconds > 0 ? '+15 PHÚT 2X (100 ĐÁ QUÝ)' : '100 ĐÁ QUÝ (15 PHÚT 2X)'}
                </span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-tertiary)] text-xs font-black flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>100 ĐÁ QUÝ</span>
                <span className="text-[var(--warn-fg)] text-[11px] font-bold">
                  ({copyVi.shop.status.needMoreGems(100 - gems)})
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 4. SECTION: MYSTERY CHEST (ANIMATED GIFT VIDEO + SHIMMER SHINE) ── */}
      <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--gold-edge)]/50 space-y-4 relative overflow-hidden transition-all group">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-18 h-18 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] flex items-center justify-center p-1 shrink-0 overflow-hidden group-hover:scale-105 transition-transform relative">
              <video
                src={assetUrl('/assets/animations/gift.mp4')}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain pointer-events-none"
              />
              <div className="absolute top-1 right-1 pointer-events-none">
                <DoodleOrnament name="sparkle-star" size={12} color="var(--gold-fill)" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[var(--gold-fg)]">
                  {copyVi.shop.items.chest.title}
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[var(--gold-tint)] text-[var(--gold-fg)] border border-[var(--gold-edge)]/40">
                  Kho Báu
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                {copyVi.shop.items.chest.desc}
              </p>
            </div>
          </div>
        </div>

        {chestReward && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-3.5 rounded-2xl bg-[var(--gold-tint)] border border-[var(--gold-edge)]/40 text-[var(--gold-fg)] text-xs font-black text-center flex items-center justify-center gap-2 relative z-10"
          >
            <HandDrawnIcon name="treasure-chest" size={24} />
            <span>{chestReward}</span>
          </motion.div>
        )}

        {/* Action Button */}
        {gems >= 120 ? (
          <button
            disabled={isOpeningChest}
            onClick={handleOpenMysteryChest}
            className="w-full py-3.5 px-5 rounded-2xl bg-[var(--gold-fill)] text-[var(--on-ink)] shadow-[0_4px_0_0_var(--gold-edge)] active:translate-y-1 active:shadow-none hover:brightness-105 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer relative z-10"
          >
            <CurrencyIcon type="gem" size="xs" />
            <span>
              {isOpeningChest ? 'ĐANG MỞ RƯƠNG THÍ NGHIỆM…' : '120 ĐÁ QUÝ — MỞ RƯƠNG MAY MẮN'}
            </span>
          </button>
        ) : (
          <button
            disabled
            className="w-full py-3.5 px-5 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-tertiary)] text-xs font-black flex items-center justify-center gap-2 cursor-not-allowed opacity-80 relative z-10"
          >
            <CurrencyIcon type="gem" size="xs" />
            <span>120 ĐÁ QUÝ</span>
            <span className="text-[var(--warn-fg)] text-[11px] font-bold">
              ({copyVi.shop.status.needMoreGems(120 - gems)} để mở rương)
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
