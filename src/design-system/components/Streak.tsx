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
        'inline-flex items-center gap-1.5 text-amber-300 font-black text-xs bg-amber-950/40 border border-amber-500/40 px-2.5 py-1 rounded-full shadow-[0_2px_0_0_#78350f] select-none hover:scale-105 transition-transform',
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
      <Flame className="hidden w-3.5 h-3.5 fill-amber-400 text-amber-500" />
      <span>{days} ngày</span>
    </div>
  );
};
