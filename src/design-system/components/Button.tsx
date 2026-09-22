import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-black transition-all select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[0_4px_0_0]',
  {
    variants: {
      variant: {
        primary:
          'bg-[#0ea5e9] text-white shadow-[0_4px_0_0_#0284c7] hover:bg-[#38bdf8] active:translate-y-1 active:shadow-[0_0px_0_0_transparent]',
        success:
          'bg-[#58cc02] text-white shadow-[0_4px_0_0_#46a302] hover:bg-[#68d810] active:translate-y-1 active:shadow-[0_0px_0_0_transparent]',
        danger:
          'bg-[#ff4b4b] text-white shadow-[0_4px_0_0_#ea2b2b] hover:bg-[#ff6161] active:translate-y-1 active:shadow-[0_0px_0_0_transparent]',
        accent:
          'bg-[#ff9600] text-white shadow-[0_4px_0_0_#e07a00] hover:bg-[#ffa726] active:translate-y-1 active:shadow-[0_0px_0_0_transparent]',
        surface:
          'bg-[#20333d] text-slate-100 shadow-[0_4px_0_0_#131f24] border-2 border-[#2e4756] hover:bg-[#283e4a] active:translate-y-1 active:shadow-[0_0px_0_0_transparent]',
        outline:
          'bg-transparent text-slate-300 border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24] hover:bg-[#20333d] active:translate-y-1 active:shadow-[0_0px_0_0_transparent]',
        warning:
          'bg-[#ff9600] text-white shadow-[0_4px_0_0_#b45309] hover:bg-[#ffa726] active:translate-y-1 active:shadow-[0_0px_0_0_transparent]',
        secondary:
          'bg-[#ce82ff] text-white shadow-[0_4px_0_0_#a545ee] hover:bg-[#d896ff] active:translate-y-1 active:shadow-[0_0px_0_0_transparent]',
        gem:
          'bg-[#00cd9c] text-white shadow-[0_4px_0_0_#00a880] hover:bg-[#10dcab] active:translate-y-1 active:shadow-[0_0px_0_0_transparent]',
        ghost:
          'bg-transparent text-slate-400 hover:text-slate-100 hover:bg-[#20333d]/60'
      },
      size: {
        sm: 'text-xs py-2 px-3.5 rounded-xl gap-1.5',
        md: 'text-sm py-3 px-5 rounded-2xl gap-2',
        lg: 'text-base py-4 px-6 rounded-2xl gap-2.5',
        icon: 'p-3 rounded-2xl'
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false
    }
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
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
