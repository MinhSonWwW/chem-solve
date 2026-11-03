import React from 'react';
import { Gem as GemIcon } from 'lucide-react';
import { cn, assetUrl } from '@/lib/utils';

export interface GemBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: number;
}

export const GemBadge: React.FC<GemBadgeProps> = ({ amount, className, ...props }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 text-[var(--gem-fg)] font-black text-xs bg-[var(--gem-tint)] border border-[var(--gem-edge)] px-2.5 py-1 rounded-full select-none hover:scale-105 transition-transform',
        className
      )}
      title={`${amount} Đá quý`}
      {...props}
    >
      <img
        src={assetUrl('/assets/icons/gem-crystal.png')}
        alt="Gem"
        className="w-4 h-4 object-contain shrink-0 drop-shadow-sm"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
      <GemIcon className="hidden w-3.5 h-3.5 fill-[var(--gem-fill)] text-[var(--gem-fill)]" />
      <span>{amount}</span>
    </div>
  );
};
