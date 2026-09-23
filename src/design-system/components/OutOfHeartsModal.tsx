import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { Mascot } from './Mascot';
import { sound } from '@/lib/audio';

import { assetUrl, cn } from '@/lib/utils';

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
          className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-rose-500/40 p-6 shadow-[0_0_50px_rgba(244,63,94,0.2)] text-center space-y-4 z-10"
        >
          {/* Failure Alert Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-[11px] font-black uppercase tracking-wider text-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Thất bại chặng này</span>
          </div>

          {/* Header Icon / Mascot */}
          <div className="flex justify-center items-center gap-3 pt-1">
            <Mascot state="out_of_hearts" size="lg" />
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [0, -4, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-inner"
            >
              <Heart className="w-7 h-7 stroke-rose-400 opacity-60" />
            </motion.div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-white tracking-tight">
              Bạn đã hết tim rồi!
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Bạn có thể <span className="text-cyan-300 font-bold">đổi 150 đá quý</span> để hồi 1 tim tiếp tục học ngay, hoặc sang mục <span className="text-amber-300 font-bold">Luyện tập</span> để làm bài (+1 tim/bài).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            {/* Option 1: Buy Heart with 150 Gems */}
            {onBuyWithGems && (
              <Button
                variant="primary"
                size="lg"
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
                  {canAfford ? 'ĐỔI 1 TIM (150 ĐÁ QUÝ)' : `ĐỔI 1 TIM (CÓ ${gems}/150 ĐÁ QUÝ)`}
                </span>
              </Button>
            )}

            {/* Option 2: Go to practice */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black shadow-[0_4px_0_0_#b45309]"
              onClick={() => {
                sound.playClick();
                onGoToPractice();
              }}
            >
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              <span>LUYỆN TẬP ĐỂ HỒI TIM (+1 TIM)</span>
            </Button>

            <Button
              variant="ghost"
              size="md"
              fullWidth
              className="text-slate-400 hover:text-slate-200 font-bold"
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
