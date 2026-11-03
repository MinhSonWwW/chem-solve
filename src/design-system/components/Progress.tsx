import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  color?: 'primary' | 'success' | 'amber' | 'gold';
  showTicks?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  color = 'primary',
  showTicks = true,
  className,
  ...props
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const fillStyle =
    color === 'success'
      ? { backgroundColor: 'var(--ok-fill)' }
      : color === 'amber'
      ? { backgroundColor: 'var(--warn-fill)' }
      : color === 'gold'
      ? { backgroundColor: 'var(--gold-fill)' }
      : { backgroundColor: 'var(--subject-fill)' };

  return (
    <div
      className={cn(
        'w-full bg-[var(--bg-surface-2)] h-3.5 rounded-full border border-[var(--border)] relative overflow-hidden',
        className
      )}
      {...props}
    >
      {/* Liquid Fill */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={fillStyle}
        className="h-full rounded-full relative"
      >
        {/* Highlight sheen */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-white/40 rounded-full" />
      </motion.div>

      {/* Laboratory Measurement Ticks */}
      {showTicks && (
        <div className="absolute inset-0 flex justify-between px-3 pointer-events-none opacity-40">
          <span className="w-[1px] h-full bg-[var(--border)]" />
          <span className="w-[1px] h-full bg-[var(--border)]" />
          <span className="w-[1px] h-full bg-[var(--border)]" />
          <span className="w-[1px] h-full bg-[var(--border)]" />
        </div>
      )}
    </div>
  );
};
