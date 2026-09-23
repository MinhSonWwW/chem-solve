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
      border: 'border-[3.5px] border-[#009b76]',
      bg: 'bg-gradient-to-br from-[#10e8b0] via-[#00cd9c] to-[#009b76]',
      shadow: 'shadow-[0_5px_0_0_#00684f,0_10px_24px_rgba(0,205,156,0.45)]',
      glow: 'after:absolute after:inset-0 after:rounded-full after:ring-4 after:ring-[#00cd9c]/30 after:animate-pulse',
      rotation: [0, -6, 4, 0],
    },
    cross: {
      border: 'border-[3.5px] border-[#c92a2a]',
      bg: 'bg-gradient-to-br from-[#ff6b6b] via-[#ff4b4b] to-[#c92a2a]',
      shadow: 'shadow-[0_5px_0_0_#8f1818,0_10px_24px_rgba(255,75,75,0.45)]',
      glow: 'after:absolute after:inset-0 after:rounded-full after:ring-4 after:ring-[#ff4b4b]/30 after:animate-pulse',
      rotation: [0, 8, -6, 0],
    },
    warning: {
      border: 'border-[3.5px] border-[#d97706]',
      bg: 'bg-gradient-to-br from-[#fbbf24] via-[#f59e0b] to-[#d97706]',
      shadow: 'shadow-[0_5px_0_0_#92400e,0_10px_24px_rgba(245,158,11,0.45)]',
      glow: 'after:absolute after:inset-0 after:rounded-full after:ring-4 after:ring-[#f59e0b]/30 after:animate-pulse',
      rotation: [0, -4, 4, 0],
    },
    hint: {
      border: 'border-[3.5px] border-[#d97706]',
      bg: 'bg-gradient-to-br from-[#fde047] via-[#eab308] to-[#ca8a04]',
      shadow: 'shadow-[0_5px_0_0_#854d0e,0_10px_24px_rgba(234,179,8,0.45)]',
      glow: 'after:absolute after:inset-0 after:rounded-full after:ring-4 after:ring-[#eab308]/30 after:animate-pulse',
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
      {/* 3D Specular Gloss Highlight Arc (top shine) */}
      <div className="absolute top-1 left-2 right-2 h-1/3 rounded-full bg-gradient-to-b from-white/50 via-white/20 to-transparent pointer-events-none" />

      {/* Inner Icon */}
      {type === 'check' && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-1/2 h-1/2 text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] relative z-10"
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
          className="w-[45%] h-[45%] text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] relative z-10"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}

      {type === 'warning' && (
        <AlertTriangle className="w-1/2 h-1/2 text-white stroke-[3.5] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] relative z-10" />
      )}

      {type === 'hint' && (
        <Lightbulb className="w-1/2 h-1/2 text-white stroke-[3.5] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] relative z-10" />
      )}
    </motion.div>
  );
};
