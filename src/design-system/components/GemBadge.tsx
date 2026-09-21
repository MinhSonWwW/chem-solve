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
        'inline-flex items-center gap-1.5 text-cyan-200 font-black text-xs bg-cyan-950/60 border border-cyan-700/60 px-2.5 py-1 rounded-full shadow-[0_2px_0_0_#0e7490] select-none hover:scale-105 transition-transform',
        className
      )}
      title={`${amount} Đá quý (Dùng 150 đá quý để đổi 1 Tim)`}
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
      <GemIcon className="hidden w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
      <span>{amount}</span>
    </div>
  );
};
