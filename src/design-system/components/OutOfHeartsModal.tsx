import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { Mascot } from './Mascot';
import { sound } from '@/lib/audio';

export interface OutOfHeartsModalProps {
  isOpen: boolean;
  onRefillHearts: () => void;
  onQuit: () => void;
}

export const OutOfHeartsModal: React.FC<OutOfHeartsModalProps> = ({
  isOpen,
  onRefillHearts,
  onQuit,
}) => {
  if (!isOpen) return null;

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
          {/* Header Icon / Mascot */}
          <div className="flex justify-center items-center gap-3 pt-2">
            <Mascot state="wrong" size="lg" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400"
            >
              <Heart className="w-7 h-7 fill-rose-500 stroke-rose-400" />
            </motion.div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-rose-300 tracking-tight">
              Bạn đã hết tim rồi!
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Làm sai nhiều câu đã tiêu tốn hết số tim của bạn. Đừng nản chí! Hãy nạp đầy tim để tiếp tục thử thách nhé.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="flex items-center justify-center gap-2"
              onClick={() => {
                sound.playCorrect();
                onRefillHearts();
              }}
            >
              <Sparkles className="w-5 h-5 fill-slate-950" />
              <span>HỒI PHỤC TIM & HỌC TIẾP</span>
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
              VỀ DANH SÁCH BÀI HỌC
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
