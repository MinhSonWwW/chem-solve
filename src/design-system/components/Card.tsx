import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'erlenmeyer' | 'interactive' | 'outline';
  selected?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', selected = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-3xl p-5 transition-all',
          variant === 'default' &&
            'bg-slate-900 border border-slate-800 shadow-[0_4px_0_0_#1e293b]',
          variant === 'erlenmeyer' &&
            'bg-slate-900/90 border-2 border-slate-700 shadow-[0_6px_0_0_#0f172a] relative overflow-hidden',
          variant === 'interactive' &&
            'bg-slate-900 border-2 border-slate-800 shadow-[0_4px_0_0_#1e293b] hover:border-slate-700 cursor-pointer active:translate-y-1 active:shadow-none',
          variant === 'outline' &&
            'bg-slate-950/60 border border-slate-800',
          selected &&
            'border-cyan-400 bg-cyan-950/40 shadow-[0_4px_0_0_#0891b2] ring-1 ring-cyan-400/50',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
