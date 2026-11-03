import React from 'react';
import { Flame } from 'lucide-react';
import { cn, assetUrl } from '@/lib/utils';

export interface StreakProps extends React.HTMLAttributes<HTMLDivElement> {
  days: number;
}

export const Streak: React.FC<StreakProps> = ({ days, className, ...props }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 text-[var(--warn-fg)] font-black text-xs bg-[var(--warn-tint)] border border-[var(--warn-edge)] px-2.5 py-1 rounded-full select-none hover:scale-105 transition-transform',
        className
      )}
      {...props}
    >
      <img
        src={assetUrl('/assets/icons/streak-flame.png')}
        alt="Streak"
        className="w-4 h-4 object-contain shrink-0"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
      <Flame className="hidden w-3.5 h-3.5 fill-[var(--warn-fill)] text-[var(--warn-fill)]" />
      <span>{days} ngày</span>
    </div>
  );
};
