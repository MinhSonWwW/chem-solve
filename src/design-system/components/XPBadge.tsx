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
        'inline-flex items-center gap-1.5 text-[var(--gold-fg)] font-black text-xs bg-[var(--gold-tint)] border border-[var(--gold-edge)] px-2.5 py-1 rounded-full select-none hover:scale-105 transition-transform',
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
      <Sparkles className="hidden w-3.5 h-3.5 fill-[var(--gold-fill)] text-[var(--gold-fill)]" />
      <span>{amount} XP</span>
    </div>
  );
};
