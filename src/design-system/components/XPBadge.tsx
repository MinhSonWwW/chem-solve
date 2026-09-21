import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn, assetUrl } from '@/lib/utils';

export interface XPBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: number;
}

export const XPBadge: React.FC<XPBadgeProps> = ({ amount, className, ...props }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 text-emerald-300 font-black text-xs bg-emerald-950/50 border border-emerald-800/60 px-2.5 py-1 rounded-full shadow-[0_2px_0_0_#064e3b] select-none hover:scale-105 transition-transform',
        className
      )}
      {...props}
    >
      <img
        src={assetUrl('/assets/icons/xp-potion.png')}
        alt="XP"
        className="w-4 h-4 object-contain shrink-0"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
      <Sparkles className="hidden w-3.5 h-3.5 fill-emerald-400 text-emerald-300" />
      <span>{amount} XP</span>
    </div>
  );
};
