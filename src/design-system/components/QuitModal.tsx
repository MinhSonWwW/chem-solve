import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './Button';
import { Mascot } from './Mascot';
import { sound } from '@/lib/audio';

export interface QuitModalProps {
  isOpen: boolean;
  onKeepLearning: () => void;
  onQuit: () => void;
}

export const QuitModal: React.FC<QuitModalProps> = ({
  isOpen,
  onKeepLearning,
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
          onClick={onKeepLearning}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-sm rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] p-6 shadow-[var(--shadow-modal)] text-center space-y-4 z-10"
        >
          {/* Mascot Header */}
          <div className="flex justify-center pt-2">
            <Mascot state="surprised" size="xl" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
              Đừng bỏ cuộc lúc này!
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
              Bạn sắp chinh phục xong bài học rồi. Nếu thoát bây giờ, bạn sẽ bỏ lỡ phần thưởng kinh nghiệm đấy!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                sound.playClick();
                onKeepLearning();
              }}
            >
              HỌC TIẾP
            </Button>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              className="text-[var(--err-fg)] hover:text-[var(--err-fg)] hover:bg-[var(--err-tint)] font-black tracking-wider"
              onClick={() => {
                sound.playClick();
                onQuit();
              }}
            >
              RỜI BÀI HỌC
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
