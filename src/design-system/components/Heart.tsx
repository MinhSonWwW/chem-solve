import React from 'react';
import { Heart as HeartIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HeartProps extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
  max?: number;
}

export const Heart: React.FC<HeartProps> = ({ count, max = 5, className, ...props }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 text-rose-400 font-black text-xs bg-rose-950/40 border border-rose-800/50 px-2.5 py-1 rounded-full shadow-[0_2px_0_0_#4c0519]',
        className
      )}
      {...props}
    >
      <HeartIcon className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
      <span>
        {count}
        {max ? `/${max}` : ''}
      </span>
    </div>
  );
};
