import React from 'react';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StreakProps extends React.HTMLAttributes<HTMLDivElement> {
  days: number;
}

export const Streak: React.FC<StreakProps> = ({ days, className, ...props }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 text-amber-400 font-black text-xs bg-amber-950/40 border border-amber-800/50 px-2.5 py-1 rounded-full shadow-[0_2px_0_0_#451a03]',
        className
      )}
      {...props}
    >
      <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500 animate-bounce" />
      <span>{days} ngày</span>
    </div>
  );
};
