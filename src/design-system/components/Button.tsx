import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';
import { spring } from '@/design-system/motion/presets';
import { haptic } from '@/lib/haptic';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-black transition-all select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[0_4px_0_0_var(--border)]',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--subject-fill)] text-white shadow-[0_4px_0_0_var(--subject-edge)] active:shadow-[0_0px_0_0_transparent]',
        success:
          'bg-[var(--ok-fill)] text-white shadow-[0_4px_0_0_var(--ok-edge)] active:shadow-[0_0px_0_0_transparent]',
        ok:
          'bg-[var(--ok-fill)] text-white shadow-[0_4px_0_0_var(--ok-edge)] active:shadow-[0_0px_0_0_transparent]',
        danger:
          'bg-[var(--err-fill)] text-white shadow-[0_4px_0_0_var(--err-edge)] active:shadow-[0_0px_0_0_transparent]',
        warning:
          'bg-[var(--warn-fill)] text-[var(--on-ink)] shadow-[0_4px_0_0_var(--warn-edge)] active:shadow-[0_0px_0_0_transparent]',
        warn:
          'bg-[var(--warn-fill)] text-[var(--on-ink)] shadow-[0_4px_0_0_var(--warn-edge)] active:shadow-[0_0px_0_0_transparent]',
        accent:
          'bg-[var(--gold-fill)] text-[var(--on-ink)] shadow-[0_4px_0_0_var(--gold-edge)] active:shadow-[0_0px_0_0_transparent]',
        gold:
          'bg-[var(--gold-fill)] text-[var(--on-ink)] shadow-[0_4px_0_0_var(--gold-edge)] active:shadow-[0_0px_0_0_transparent]',
        gem:
          'bg-[var(--gem-fill)] text-white shadow-[0_4px_0_0_var(--gem-edge)] active:shadow-[0_0px_0_0_transparent]',
        secondary:
          'bg-[var(--bg-surface-2)] text-[var(--text-primary)] border border-[var(--border)] shadow-[0_4px_0_0_var(--edge-neutral)] hover:bg-[var(--bg-surface-2)]/80 active:shadow-[0_0px_0_0_transparent]',
        surface:
          'bg-[var(--bg-surface-2)] text-[var(--text-primary)] border border-[var(--border)] shadow-[0_4px_0_0_var(--edge-neutral)] hover:bg-[var(--bg-surface-2)]/80 active:shadow-[0_0px_0_0_transparent]',
        outline:
          'bg-transparent text-[var(--text-secondary)] border-2 border-[var(--border)] shadow-[0_4px_0_0_var(--edge-neutral)] hover:bg-[var(--bg-surface-2)] active:shadow-[0_0px_0_0_transparent]',
        ghost:
          'bg-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)]/60',
      },
      size: {
        sm: 'text-xs py-2 px-3.5 rounded-xl gap-1.5',
        md: 'text-sm py-3 px-5 rounded-2xl gap-2',
        lg: 'text-base py-4 px-6 rounded-2xl gap-2.5',
        icon: 'p-3 rounded-2xl',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, isLoading, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        whileTap={disabled || isLoading ? undefined : { y: 4 }}
        transition={spring.tactile}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        onClick={(e) => {
          if (!disabled && !isLoading) {
            haptic.tap();
          }
          props.onClick?.(e);
        }}
        {...(props as HTMLMotionProps<'button'>)}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
