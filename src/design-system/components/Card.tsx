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
            'bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24]',
          variant === 'erlenmeyer' &&
            'bg-[#18272f] border-2 border-[#2e4756] shadow-[0_6px_0_0_#131f24] relative overflow-hidden',
          variant === 'interactive' &&
            'bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24] hover:border-[#0ea5e9] cursor-pointer active:translate-y-1 active:shadow-none',
          variant === 'outline' &&
            'bg-[#131f24]/80 border-2 border-[#20333d]',
          selected &&
            'border-[#0ea5e9] bg-[#0ea5e9]/15 shadow-[0_4px_0_0_#0284c7] ring-1 ring-[#0ea5e9]/50',
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
