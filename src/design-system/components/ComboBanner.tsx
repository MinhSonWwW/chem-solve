import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Zap } from 'lucide-react';

export interface ComboBannerProps {
  combo: number;
  visible: boolean;
}

export const ComboBanner: React.FC<ComboBannerProps> = ({ combo, visible }) => {
  if (!visible || combo < 2) return null;

  const getComboText = () => {
    if (combo === 2) return '2 câu liên tiếp!';
    if (combo === 3) return '3 câu chuẩn xác!';
    if (combo === 4) return 'Phong độ xuất sắc!';
    return `Chuỗi ${combo} câu đúng! Bốc hỏa!`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -25, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        className="fixed top-14 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
      >
        <div className="flex items-center gap-2 bg-[var(--warn-fill)] text-[var(--on-ink)] font-black px-4 py-2 rounded-2xl shadow-[var(--shadow-modal)] border border-[var(--warn-edge)] text-sm tracking-wide">
          {combo >= 4 ? (
            <Zap className="w-5 h-5 fill-[var(--on-ink)] text-[var(--on-ink)]" />
          ) : (
            <Flame className="w-5 h-5 fill-[var(--on-ink)] text-[var(--on-ink)]" />
          )}
          <span>{getComboText()}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
