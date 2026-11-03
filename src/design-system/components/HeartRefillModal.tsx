import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X, ShoppingBag } from 'lucide-react';
import { Button } from './Button';
import { Mascot } from './Mascot';
import { assetUrl, cn } from '@/lib/utils';
import { sound } from '@/lib/audio';

export interface HeartRefillModalProps {
  isOpen: boolean;
  hearts: number;
  maxHearts?: number;
  gems: number;
  costPerHeart?: number;
  onBuyWithGems: () => void;
  onGoToPractice: () => void;
  onGoToShop?: () => void;
  onClose: () => void;
}

export const HeartRefillModal: React.FC<HeartRefillModalProps> = ({
  isOpen,
  hearts,
  maxHearts = 5,
  gems,
  costPerHeart = 150,
  onBuyWithGems,
  onGoToPractice,
  onGoToShop,
  onClose,
}) => {
  if (!isOpen) return null;

  const isFull = hearts >= maxHearts;
  const canAfford = gems >= costPerHeart;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-sm rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] p-6 shadow-[var(--shadow-modal)] text-center space-y-4 z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-surface-2)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header mascot & Heart icon */}
          <div className="flex justify-center items-center gap-3 pt-2">
            <Mascot state={isFull ? 'happy' : hearts <= 1 ? 'out_of_hearts' : 'thinking'} size="lg" />
            <div className="w-14 h-14 rounded-2xl bg-[var(--err-tint)] border border-[var(--err-edge)] flex flex-col items-center justify-center text-[var(--err-fg)]">
              <img
                src={assetUrl('/assets/icons/heart-flask.png')}
                alt="Heart"
                className="w-7 h-7 object-contain animate-pulse"
              />
              <span className="text-xs font-black text-[var(--err-fg)] mt-0.5">
                {hearts}/{maxHearts}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
              {isFull ? 'Tim của bạn đang đầy!' : 'Hồi phục số Tim'}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              {isFull
                ? 'Bạn đang có đủ 5 tim để sẵn sàng chinh phục mọi bài học.'
                : 'Mỗi câu làm sai trong phần học sẽ tiêu hao 1 tim. Bạn có thể đổi đá quý hoặc luyện tập để hồi phục!'}
            </p>
          </div>

          {/* Heart Status Bar */}
          <div className="flex justify-center items-center gap-2 py-1.5 bg-[var(--bg-canvas)] border border-[var(--border)] rounded-2xl p-2">
            {Array.from({ length: maxHearts }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center transition-all',
                  i < hearts
                    ? 'bg-[var(--err-tint)] border border-[var(--err-edge)] text-[var(--err-fg)]'
                    : 'bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-tertiary)]'
                )}
              >
                <Heart className={cn('w-4 h-4', i < hearts ? 'fill-[var(--err-fill)] text-[var(--err-fill)]' : 'opacity-30')} />
              </div>
            ))}
          </div>

          {/* Gem Balance Display */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border)] text-xs">
            <span className="text-[var(--text-secondary)] font-bold">Số Đá quý của bạn:</span>
            <div className="flex items-center gap-1.5 font-black text-[var(--gem-fg)]">
              <img src={assetUrl('/assets/icons/gem-crystal.png')} alt="Gem" className="w-4 h-4 object-contain" />
              <span>{gems} Đá quý</span>
            </div>
          </div>

          {/* Action Options */}
          {!isFull && (
            <div className="space-y-2.5 pt-1">
              {/* Option 1: Buy with gems */}
              <Button
                variant="gem"
                size="md"
                fullWidth
                disabled={!canAfford}
                className="flex items-center justify-center gap-2 font-black"
                onClick={() => {
                  if (canAfford) {
                    onBuyWithGems();
                  }
                }}
              >
                <img src={assetUrl('/assets/icons/gem-crystal.png')} alt="Gem" className="w-4 h-4 object-contain" />
                <span>
                  {canAfford
                    ? `ĐỔI 1 TIM (${costPerHeart} ĐÁ QUÝ)`
                    : `CẦN ${costPerHeart} ĐÁ QUÝ (THIẾU ${costPerHeart - gems})`}
                </span>
              </Button>

              {/* Option 2: Go to practice */}
              <Button
                variant="primary"
                size="md"
                fullWidth
                className="flex items-center justify-center gap-2 font-black"
                onClick={() => {
                  sound.playClick();
                  onGoToPractice();
                }}
              >
                <Heart className="w-4 h-4 fill-white text-white" />
                <span>LUYỆN TẬP ĐỂ HỒI TIM (+1 TIM)</span>
              </Button>
            </div>
          )}

          {/* Option: Go to Shop */}
          {onGoToShop && (
            <button
              onClick={() => {
                sound.playClick();
                onGoToShop();
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl text-xs font-black text-[var(--gem-fg)] hover:underline transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Ghé Cửa Hàng (Bơm đầy 5 tim, khiên bảo vệ) ➔</span>
            </button>
          )}

          {/* Daily Reset Note */}
          <p className="text-[11px] text-[var(--text-tertiary)] italic pt-1">
            Toàn bộ 5 tim sẽ tự động hồi đầy mỗi khi chuyển sang ngày mới!
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
