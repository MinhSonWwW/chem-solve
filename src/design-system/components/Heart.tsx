import React from 'react';
import { Heart as HeartIcon } from 'lucide-react';
import { cn, assetUrl } from '@/lib/utils';

export interface HeartProps extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
  max?: number;
}

export const Heart: React.FC<HeartProps> = ({ count, max = 5, className, ...props }) => {
  const isInfinite = count >= 99 || count === Infinity;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 text-[var(--err-fg)] font-black text-xs bg-[var(--err-tint)] border border-[var(--err-edge)] px-2.5 py-1 rounded-full select-none hover:scale-105 transition-transform',
        className
      )}
      {...props}
    >
      <img
        src={assetUrl('/assets/icons/heart-flask.png')}
        alt="Tim"
        className="w-4 h-4 object-contain animate-pulse shrink-0"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
      <HeartIcon className="hidden w-3.5 h-3.5 fill-[var(--err-fill)] text-[var(--err-fill)]" />
      <span className={isInfinite ? 'text-sm font-black' : ''}>
        {isInfinite ? '∞' : `${count}${max ? `/${max}` : ''}`}
      </span>
    </div>
  );
};
