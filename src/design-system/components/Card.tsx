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
          'rounded-2xl p-5 transition-all',
          variant === 'default' &&
            'bg-[var(--bg-surface)] border border-[var(--border)]',
          variant === 'erlenmeyer' &&
            'bg-[var(--bg-surface)] border border-[var(--border)] relative overflow-hidden',
          variant === 'interactive' &&
            'bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--subject-fill)] cursor-pointer transition-colors',
          variant === 'outline' &&
            'bg-transparent border border-[var(--border)]',
          selected &&
            'border-2 border-[var(--subject-fill)] bg-[var(--subject-tint)]',
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
