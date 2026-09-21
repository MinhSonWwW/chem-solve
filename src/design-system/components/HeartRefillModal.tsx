import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X } from 'lucide-react';
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
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-rose-500/40 p-6 shadow-[0_0_50px_rgba(244,63,94,0.2)] text-center space-y-4 z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header mascot & Heart icon */}
          <div className="flex justify-center items-center gap-3 pt-2">
            <Mascot state={isFull ? 'happy' : hearts <= 1 ? 'out_of_hearts' : 'thinking'} size="lg" />
            <div className="w-14 h-14 rounded-2xl bg-rose-950/60 border border-rose-500/50 flex flex-col items-center justify-center text-rose-400 shadow-inner">
              <img
                src={assetUrl('/assets/icons/heart-flask.png')}
                alt="Heart"
                className="w-7 h-7 object-contain animate-pulse"
              />
              <span className="text-xs font-black text-rose-300 mt-0.5">
                {hearts}/{maxHearts}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-white tracking-tight">
              {isFull ? 'Tim của bạn đang đầy!' : 'Hồi phục số Tim'}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {isFull
                ? 'Bạn đang có đủ 5 tim để sẵn sàng chinh phục mọi bài học.'
                : 'Mỗi câu làm sai trong phần học sẽ tiêu hao 1 tim. Bạn có thể đổi đá quý hoặc luyện tập để hồi phục!'}
            </p>
          </div>

          {/* Heart Status Bar */}
          <div className="flex justify-center items-center gap-2 py-1.5 bg-slate-950/50 border border-slate-800 rounded-2xl p-2">
            {Array.from({ length: maxHearts }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center transition-all',
                  i < hearts
                    ? 'bg-rose-500/20 border border-rose-500/60 text-rose-400 shadow-[0_2px_0_0_#e11d48]'
                    : 'bg-slate-900 border border-slate-800 text-slate-600'
                )}
              >
                <Heart className={cn('w-4 h-4', i < hearts ? 'fill-rose-500' : 'opacity-30')} />
              </div>
            ))}
          </div>

          {/* Gem Balance Display */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-cyan-950/40 border border-cyan-700/50 text-xs">
            <span className="text-slate-300 font-bold">Số Đá quý của bạn:</span>
            <div className="flex items-center gap-1.5 font-black text-cyan-300">
              <img src={assetUrl('/assets/icons/gem-crystal.png')} alt="Gem" className="w-4 h-4 object-contain" />
              <span>{gems} Đá quý</span>
            </div>
          </div>

          {/* Action Options */}
          {!isFull && (
            <div className="space-y-2.5 pt-1">
              {/* Option 1: Buy with gems */}
              <Button
                variant="primary"
                size="md"
                fullWidth
                disabled={!canAfford}
                className={cn(
                  'flex items-center justify-center gap-2 font-black',
                  canAfford
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 shadow-[0_4px_0_0_#0891b2]'
                    : 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-400 border border-slate-700'
                )}
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
                    : `CẦN ${costPerHeart} ĐÁ QUÝ (THIẾU ${costPerHeart - gems} 💎)`}
                </span>
              </Button>

              {/* Option 2: Go to practice */}
              <Button
                variant="secondary"
                size="md"
                fullWidth
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black shadow-[0_4px_0_0_#b45309]"
                onClick={() => {
                  sound.playClick();
                  onGoToPractice();
                }}
              >
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>LUYỆN TẬP ĐỂ HỒI TIM (+1 TIM)</span>
              </Button>
            </div>
          )}

          {/* Daily Reset Note */}
          <p className="text-[11px] text-slate-400 italic pt-1">
            ⚡ Toàn bộ 5 tim sẽ tự động hồi đầy mỗi khi chuyển sang ngày mới!
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
