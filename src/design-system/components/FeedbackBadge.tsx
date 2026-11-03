import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Lightbulb } from 'lucide-react';

export interface FeedbackBadgeProps {
  type: 'check' | 'cross' | 'warning' | 'hint';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FeedbackBadge: React.FC<FeedbackBadgeProps> = ({
  type,
  size = 'lg',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-15 h-15 sm:w-16 sm:h-16',
  }[size];

  const config = {
    check: {
      border: 'border-[3px] border-[var(--ok-edge)]',
      bg: 'bg-[var(--ok-fill)]',
      shadow: 'shadow-[0_4px_0_0_var(--ok-edge)]',
      rotation: [0, -6, 4, 0],
    },
    cross: {
      border: 'border-[3px] border-[var(--err-edge)]',
      bg: 'bg-[var(--err-fill)]',
      shadow: 'shadow-[0_4px_0_0_var(--err-edge)]',
      rotation: [0, 8, -6, 0],
    },
    warning: {
      border: 'border-[3px] border-[var(--warn-edge)]',
      bg: 'bg-[var(--warn-fill)]',
      shadow: 'shadow-[0_4px_0_0_var(--warn-edge)]',
      rotation: [0, -4, 4, 0],
    },
    hint: {
      border: 'border-[3px] border-[var(--warn-edge)]',
      bg: 'bg-[var(--warn-fill)]',
      shadow: 'shadow-[0_4px_0_0_var(--warn-edge)]',
      rotation: [0, -4, 4, 0],
    },
  }[type];

  return (
    <motion.div
      initial={{ scale: 0.35, rotate: -20, opacity: 0 }}
      animate={{ scale: 1, rotate: config.rotation, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      className={`relative rounded-full shrink-0 flex items-center justify-center select-none overflow-visible ${sizeClasses} ${config.border} ${config.bg} ${config.shadow} ${className}`}
    >
      {/* 3D Specular Highlight Arc */}
      <div className="absolute top-1 left-2 right-2 h-1/3 rounded-full bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

      {/* Inner Icon */}
      {type === 'check' && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-1/2 h-1/2 text-white relative z-10"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}

      {type === 'cross' && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[45%] h-[45%] text-white relative z-10"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}

      {type === 'warning' && (
        <AlertTriangle className="w-1/2 h-1/2 text-[var(--on-ink)] stroke-[3.5] relative z-10" />
      )}

      {type === 'hint' && (
        <Lightbulb className="w-1/2 h-1/2 text-[var(--on-ink)] stroke-[3.5] relative z-10" />
      )}
    </motion.div>
  );
};
