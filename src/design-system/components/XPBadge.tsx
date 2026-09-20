import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface XPBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: number;
}

export const XPBadge: React.FC<XPBadgeProps> = ({ amount, className, ...props }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 text-cyan-400 font-black text-xs bg-cyan-950/40 border border-cyan-800/50 px-2.5 py-1 rounded-full shadow-[0_2px_0_0_#083344]',
        className
      )}
      {...props}
    >
      <Sparkles className="w-3.5 h-3.5 fill-cyan-400 text-cyan-300" />
      <span>{amount} XP</span>
    </div>
  );
};
