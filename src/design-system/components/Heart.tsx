import React from 'react';
import { Heart as HeartIcon } from 'lucide-react';
import { cn, assetUrl } from '@/lib/utils';

export interface HeartProps extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
  max?: number;
}

export const Heart: React.FC<HeartProps> = ({ count, max = 5, className, ...props }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 text-rose-300 font-black text-xs bg-rose-950/50 border border-rose-800/60 px-2.5 py-1 rounded-full shadow-[0_2px_0_0_#4c0519] select-none hover:scale-105 transition-transform',
        className
      )}
      {...props}
    >
      <img
        src={assetUrl('/assets/icons/heart-flask.png')}
        alt="Tim"
        className="w-4 h-4 object-contain animate-pulse shrink-0"
        onError={(e) => {
          // Fallback if image fails in mock tests
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
      <HeartIcon className="hidden w-3.5 h-3.5 fill-rose-500 text-rose-500" />
      <span>
        {count}
        {max ? `/${max}` : ''}
      </span>
    </div>
  );
};
