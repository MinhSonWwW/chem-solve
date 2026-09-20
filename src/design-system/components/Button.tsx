import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-black transition-all select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[0_4px_0_0]',
  {
    variants: {
      variant: {
        primary:
          'bg-cyan-500 text-slate-950 shadow-[0_4px_0_0_#0891b2] hover:bg-cyan-400 active:translate-y-1 active:shadow-[0_0px_0_0_transparent]',
        success:
          'bg-emerald-500 text-slate-950 shadow-[0_4px_0_0_#059669] hover:bg-emerald-400 active:translate-y-1 active:shadow-[0_0px_0_0_transparent]',
        danger:
          'bg-rose-500 text-white shadow-[0_4px_0_0_#dc2626] hover:bg-rose-400 active:translate-y-1 active:shadow-[0_0px_0_0_transparent]',
        accent:
          'bg-amber-500 text-slate-950 shadow-[0_4px_0_0_#d97706] hover:bg-amber-400 active:translate-y-1 active:shadow-[0_0px_0_0_transparent]',
        surface:
          'bg-slate-800 text-slate-100 shadow-[0_4px_0_0_#334155] border border-slate-700/60 hover:bg-slate-700 active:translate-y-1 active:shadow-[0_0px_0_0_transparent]',
        outline:
          'bg-transparent text-slate-300 border-2 border-slate-700 shadow-[0_4px_0_0_#1e293b] hover:bg-slate-800 active:translate-y-1 active:shadow-[0_0px_0_0_transparent]',
        warning:
          'bg-amber-500 text-slate-950 shadow-[0_4px_0_0_#b45309] hover:bg-amber-400 active:translate-y-1 active:shadow-[0_0px_0_0_transparent]',
        secondary:
          'bg-indigo-500 text-white shadow-[0_4px_0_0_#4338ca] hover:bg-indigo-400 active:translate-y-1 active:shadow-[0_0px_0_0_transparent]',
        ghost:
          'bg-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
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
