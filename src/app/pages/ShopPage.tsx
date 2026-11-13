import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { Mascot, CurrencyIcon } from '@/design-system';
import { HandDrawnIcon } from '@/design-system/components/HandDrawnIcon';
import { useUserStore } from '@/features/gamification/useUserStore';
import { GAMIFICATION } from '@/config/gamification';
import { assetUrl, cn } from '@/lib/utils';
import { sound } from '@/lib/audio';
import { copyVi } from '@/copy/vi';

/**
 * Hiệu ứng bọt khí tim nổi lên từ đáy bình
 */
// Decorative looping particles removed (no continuous animation, see AGENTS.md #9).
const HeartBubbles: React.FC = () => null;

/**
 * Hiệu ứng sương khói tuyết lạnh và tia sáng băng giá bay nhẹ quanh khiên
 */
// Decorative looping particles removed (no continuous animation, see AGENTS.md #9).
const FrostMist: React.FC = () => null;

/**
 * Hiệu ứng tia năng lượng và bọt khí sôi sục quanh bình XP
 */
// Decorative looping particles removed (no continuous animation, see AGENTS.md #9).
const PotionFizz: React.FC = () => null;

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
      showToast(`Tim năng lượng đã đầy (${GAMIFICATION.hearts.max}/${GAMIFICATION.hearts.max})!`, 'info', 'heart');
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
      showToast(`Tim năng lượng đã đầy (${GAMIFICATION.hearts.max}/${GAMIFICATION.hearts.max})!`, 'info', 'heart');
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
      showToast(`Đã hồi phục toàn bộ ${GAMIFICATION.hearts.max}/${GAMIFICATION.hearts.max} Tim năng lượng!`, 'success', 'heart');
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
              <CheckCircle2 className="w-4 h-4 text-[var(--ok-fg)]" />
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
            <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
              <span>{copyVi.shop.hero.title}</span>
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
                <span className="text-[11px] text-[var(--text-tertiary)] block font-bold leading-none whitespace-nowrap">Bạn có</span>
                <span className="text-lg font-black text-[var(--gem-fg)] leading-tight">{gems}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <CurrencyIcon type="heart" size="xs" />
                <span className="text-[var(--err-fg)] font-black">{isFullHearts ? `Đầy (${GAMIFICATION.hearts.max}/${GAMIFICATION.hearts.max})` : `${hearts}/${GAMIFICATION.hearts.max}`}</span>
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
          <h2 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-2">
            <HandDrawnIcon name="heart-flask" size={22} />
            <span>Tim · {hearts}/{GAMIFICATION.hearts.max}</span>
          </h2>
          <span className="text-xs text-[var(--text-tertiary)] font-medium">Tự hồi 1 tim mỗi 20 phút</span>
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
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
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
                <span>150 đá quý (+1 tim)</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-tertiary)] text-xs font-black flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>150 đá quý</span>
                <span className="text-[var(--warn-fg)] text-xs font-bold">
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
                <span className="text-xs font-bold text-[var(--gold-fg)]">
                  Rẻ hơn {GAMIFICATION.hearts.max * GAMIFICATION.gems.costPerHeart - GAMIFICATION.gems.costFullHearts} đá quý so với mua lẻ
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[var(--err-tint)] border border-[var(--err-edge)]/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform relative">
                  <HandDrawnIcon name="heart-flask" size={40} />
                  <HeartBubbles />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-sm font-black text-[var(--text-primary)] group-hover:text-[var(--gold-fg)] transition-colors">
                    {copyVi.shop.items.heartFull.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
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
                <span>450 ĐÁ QUÝ (HỒI ĐẦY {GAMIFICATION.hearts.max} TIM)</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-tertiary)] text-xs font-black flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>450 đá quý</span>
                <span className="text-[var(--warn-fg)] text-xs font-bold">
                  ({copyVi.shop.status.needMoreGems(450 - gems)})
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── 3. SECTION: TRANG BỊ HỖ TRỢ & TĂNG TỐC ── */}
      <div className="space-y-3 pt-1">
        <h2 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-2 px-1">
          <HandDrawnIcon name="flame" size={20} />
          <span>Khiên và nhân đôi XP</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Card: Streak Freeze Shield */}
          <div className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--warn-fill)] flex flex-col justify-between space-y-4 transition-all group relative overflow-hidden">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[var(--warn-tint)] text-[var(--warn-fg)] border border-[var(--warn-edge)]/40">
                  Đã có: {streakFreeze}/2 khiên
                </span>
                <span className="text-[11px] font-bold text-[var(--text-tertiary)]">
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
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
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
                <span>200 đá quý (1 khiên băng)</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-tertiary)] text-xs font-black flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>200 đá quý</span>
                <span className="text-[var(--warn-fg)] text-xs font-bold">
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
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[var(--gold-tint)] text-[var(--gold-fg)] border border-[var(--gold-edge)]/40 inline-flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-[var(--gold-fg)] animate-spin" />
                    {copyVi.shop.status.activeBoost(
                      `${Math.floor(boostRemainingSeconds / 60)}:${String(boostRemainingSeconds % 60).padStart(2, '0')}`
                    )}
                  </span>
                ) : (
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[var(--gold-tint)] text-[var(--gold-fg)] border border-[var(--gold-edge)]/40">
                    Tăng tốc 15 phút
                  </span>
                )}
                <span className="text-[11px] font-bold text-[var(--text-tertiary)]">
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
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
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
                  {boostRemainingSeconds > 0 ? '+15 phút 2X (100 đá quý)' : '100 đá quý (15 phút 2X)'}
                </span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 px-4 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-tertiary)] text-xs font-black flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
              >
                <CurrencyIcon type="gem" size="xs" />
                <span>100 đá quý</span>
                <span className="text-[var(--warn-fg)] text-xs font-bold">
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
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[var(--gold-fg)]">
                  {copyVi.shop.items.chest.title}
                </h3>
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-[var(--gold-tint)] text-[var(--gold-fg)] border border-[var(--gold-edge)]/40">
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
              {isOpeningChest ? 'Đang mở rương…' : 'Mở rương · 120 đá quý'}
            </span>
          </button>
        ) : (
          <button
            disabled
            className="w-full py-3.5 px-5 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-tertiary)] text-xs font-black flex items-center justify-center gap-2 cursor-not-allowed opacity-80 relative z-10"
          >
            <CurrencyIcon type="gem" size="xs" />
            <span>120 đá quý</span>
            <span className="text-[var(--warn-fg)] text-xs font-bold">
              ({copyVi.shop.status.needMoreGems(120 - gems)} để mở rương)
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
