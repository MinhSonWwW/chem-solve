import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  color?: 'primary' | 'success' | 'amber';
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

  const gradientClass =
    color === 'success'
      ? 'from-emerald-500 to-teal-400'
      : color === 'amber'
      ? 'from-amber-500 to-orange-400'
      : 'from-cyan-500 to-blue-500';

  return (
    <div
      className={cn(
        'w-full bg-slate-950 h-3.5 rounded-full border border-slate-800 relative overflow-hidden shadow-inner',
        className
      )}
      {...props}
    >
      {/* Liquid Fill */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn('h-full bg-gradient-to-r rounded-full relative', gradientClass)}
      >
        {/* Highlight sheen */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-white/40 rounded-full" />
      </motion.div>

      {/* Laboratory Measurement Ticks */}
      {showTicks && (
        <div className="absolute inset-0 flex justify-between px-3 pointer-events-none opacity-40">
          <span className="w-[1px] h-full bg-slate-700" />
          <span className="w-[1px] h-full bg-slate-700" />
          <span className="w-[1px] h-full bg-slate-700" />
          <span className="w-[1px] h-full bg-slate-700" />
        </div>
      )}
    </div>
  );
};
