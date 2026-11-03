import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { sound } from '@/lib/audio';
import { assetUrl } from '@/lib/utils';

export interface OutOfHeartsModalProps {
  isOpen: boolean;
  gems?: number;
  onBuyWithGems?: () => void;
  onGoToPractice: () => void;
  onQuit: () => void;
}

export const OutOfHeartsModal: React.FC<OutOfHeartsModalProps> = ({
  isOpen,
  gems = 0,
  onBuyWithGems,
  onGoToPractice,
  onQuit,
}) => {
  if (!isOpen) return null;

  const canAfford = gems >= 150;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-sm rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] p-6 shadow-[var(--shadow-modal)] text-center space-y-4 z-10"
        >
          {/* Failure Alert Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--err-tint)] border border-[var(--err-edge)] text-[11px] font-black uppercase tracking-wider text-[var(--err-fg)]">
            <AlertTriangle className="w-3.5 h-3.5 text-[var(--err-fg)]" />
            <span>Thất bại chặng này</span>
          </div>

          {/* Header Illustration */}
          <div className="flex justify-center items-center pt-1">
            <img
              src={assetUrl('/assets/ui/empty-no-hearts.png')}
              alt="Hết tim"
              className="w-28 h-28 object-contain drop-shadow-lg select-none pointer-events-none"
            />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
              Bạn đã hết tim rồi!
            </h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              Bạn có thể <span className="text-[var(--gem-fg)] font-bold">đổi 150 đá quý</span> để hồi 1 tim tiếp tục học ngay, hoặc sang mục <span className="text-[var(--subject-fg)] font-bold">Luyện tập</span> để làm bài (+1 tim/bài).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            {/* Option 1: Buy Heart with 150 Gems */}
            {onBuyWithGems && (
              <Button
                variant="gem"
                size="lg"
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
                  {canAfford ? 'ĐỔI 1 TIM (150 ĐÁ QUÝ)' : `ĐỔI 1 TIM (CÓ ${gems}/150 ĐÁ QUÝ)`}
                </span>
              </Button>
            )}

            {/* Option 2: Go to practice */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="flex items-center justify-center gap-2 font-black"
              onClick={() => {
                sound.playClick();
                onGoToPractice();
              }}
            >
              <Heart className="w-5 h-5 fill-white text-white" />
              <span>LUYỆN TẬP ĐỂ HỒI TIM (+1 TIM)</span>
            </Button>

            <Button
              variant="ghost"
              size="md"
              fullWidth
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] font-bold"
              onClick={() => {
                sound.playClick();
                onQuit();
              }}
            >
              VỀ BẢN ĐỒ HỌC
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
