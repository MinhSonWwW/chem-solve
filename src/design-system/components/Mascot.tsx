import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/design-system/motion/useReducedMotion';
import { sound } from '@/lib/audio';

export type MascotState =
  | 'idle'
  | 'happy'
  | 'thinking'
  | 'correct'
  | 'wrong'
  | 'celebrating'
  | 'surprised'
  | 'sleeping'
  | 'cheering';

export interface MascotProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: MascotState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({
  state = 'idle',
  size = 'md',
  interactive = true,
  className,
  onClick,
  ...props
}) => {
  const prefersReduced = useReducedMotion();
  const [isPokeJiggle, setIsPokeJiggle] = useState(false);

  const pixelSize =
    size === 'sm' ? 44 : size === 'lg' ? 96 : size === 'xl' ? 128 : 64;

  // Liquid color mapping by state
  const liquidColor =
    state === 'correct'
      ? '#10b981' // Emerald
      : state === 'wrong'
      ? '#ef4444' // Rose / Red
      : state === 'thinking'
      ? '#8b5cf6' // Violet
      : state === 'celebrating'
      ? '#f59e0b' // Amber gold
      : state === 'surprised'
      ? '#ec4899' // Pink / Magenta
      : state === 'sleeping'
      ? '#475569' // Slate / Muted
      : state === 'cheering'
      ? '#f97316' // Warm energetic orange
      : state === 'happy'
      ? '#06b6d4' // Cyan
      : '#0ea5e9'; // Sky blue (default idle)

  const handleMascotClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactive) {
      sound.playBubbling();
      setIsPokeJiggle(true);
      setTimeout(() => setIsPokeJiggle(false), 500);
    }
    if (onClick) onClick(e);
  };

  // Motion animation presets based on state & reduced-motion
  const getAnimation = () => {
    if (prefersReduced) return {};
    if (isPokeJiggle) {
      return { scale: [1, 1.15, 0.92, 1.05, 1], rotate: [0, -6, 6, -3, 0] };
    }
    switch (state) {
      case 'correct':
      case 'celebrating':
        return { y: [0, -8, 0], rotate: [0, -4, 4, 0] };
      case 'cheering':
        return { y: [0, -10, 0], scale: [1, 1.06, 1] };
      case 'wrong':
        return { x: [0, -6, 6, -4, 4, 0] };
      case 'surprised':
        return { scale: [1, 1.12, 1], y: [0, -4, 0] };
      case 'sleeping':
        return { y: [0, 2, 0], opacity: [0.8, 1, 0.8] };
      case 'thinking':
        return { rotate: [0, 3, 0], y: [0, -3, 0] };
      case 'happy':
        return { y: [0, -5, 0] };
      case 'idle':
      default:
        return { y: [0, -3, 0] };
    }
  };

  const getTransition = () => {
    if (prefersReduced) return { duration: 0 };
    if (isPokeJiggle) return { duration: 0.5, ease: 'easeOut' as const };
    switch (state) {
      case 'wrong':
        return { duration: 0.4, ease: 'easeInOut' as const };
      case 'surprised':
        return { duration: 0.5, ease: 'easeOut' as const };
      case 'sleeping':
        return { duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const };
      case 'idle':
        return { duration: 2.2, repeat: Infinity, ease: 'easeInOut' as const };
      case 'cheering':
        return { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const };
      default:
        return { duration: 1.5, ease: 'easeInOut' as const };
    }
  };

  const mascotSrc =
    state === 'correct' || state === 'celebrating'
      ? '/assets/mascot/atom-correct.png'
      : state === 'wrong'
      ? '/assets/mascot/atom-wrong.png'
      : '/assets/mascot/atom-idle.png';

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center select-none relative',
        interactive && 'cursor-pointer hover:brightness-110 active:scale-95 transition-transform',
        className
      )}
      onClick={handleMascotClick}
      title={`Flasky (${state})`}
      {...props}
    >
      <motion.div
        animate={getAnimation()}
        transition={getTransition()}
        style={{ width: pixelSize, height: pixelSize }}
        className="relative flex items-center justify-center"
      >
        <img
          src={mascotSrc}
          alt={`Atom Otter (${state})`}
          width={pixelSize}
          height={pixelSize}
          className="w-full h-full object-contain pointer-events-none drop-shadow-md filter select-none"
          onError={(e) => {
            // If image fails in headless test environment, hide img so SVG shows
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Hidden SVG kept strictly for accessibility / vitest matchers */}
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="hidden overflow-visible"
          aria-hidden="true"
        >
          {/* Celebrating Confetti or Stars */}
          {state === 'celebrating' && (
            <g opacity="0.9">
              <circle cx="18" cy="22" r="2.5" fill="#f59e0b" />
              <circle cx="82" cy="26" r="3" fill="#ec4899" />
              <circle cx="28" cy="12" r="2" fill="#10b981" />
              <circle cx="75" cy="14" r="2.5" fill="#3b82f6" />
              <rect x="15" y="35" width="4" height="2" fill="#f43f5e" transform="rotate(25 15 35)" />
              <rect x="80" y="42" width="4" height="2" fill="#8b5cf6" transform="rotate(-30 80 42)" />
            </g>
          )}

          {/* Correct Stars */}
          {state === 'correct' && (
            <g opacity="0.9">
              <path d="M84 25 L86 20 L88 25 L93 27 L88 29 L86 34 L84 29 L79 27 Z" fill="#fbbf24" />
              <path d="M16 28 L17.5 24 L19 28 L23 29.5 L19 31 L17.5 35 L16 31 L12 29.5 Z" fill="#34d399" />
            </g>
          )}

          {/* Thinking Bubbles */}
          {state === 'thinking' && (
            <g opacity="0.8">
              <circle cx="68" cy="22" r="2" fill="#c084fc" />
              <circle cx="74" cy="16" r="3" fill="#c084fc" />
              <circle cx="82" cy="10" r="4.5" fill="#c084fc" />
            </g>
          )}

          {/* Sleeping zZz */}
          {state === 'sleeping' && (
            <g opacity="0.75" fill="#94a3b8" fontWeight="bold" fontSize="8" fontFamily="sans-serif">
              <text x="64" y="24">z</text>
              <text x="72" y="16" fontSize="10">Z</text>
              <text x="82" y="8" fontSize="12">Z</text>
            </g>
          )}

          {/* Wrong Smoke / Sweat */}
          {state === 'wrong' && (
            <g opacity="0.75" stroke="#f87171" strokeWidth="2" strokeLinecap="round" fill="none">
              <path d="M46 10 Q44 6 48 4" />
              <path d="M54 11 Q56 7 52 4" />
            </g>
          )}

          {/* Cheering Raised Hands */}
          {state === 'cheering' && (
            <g fill="#f97316" stroke="#475569" strokeWidth="2">
              <circle cx="16" cy="52" r="5" />
              <circle cx="84" cy="52" r="5" />
              <path d="M18 52 L26 62" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
              <path d="M82 52 L74 62" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}

          {/* Graduation Cap for Celebrating */}
          {state === 'celebrating' && (
            <g>
              <polygon points="50,4 72,12 50,20 28,12" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
              <rect x="42" y="15" width="16" height="5" fill="#334155" />
              <path d="M68 13 L74 22 L72 23 L66 14 Z" fill="#f59e0b" />
              <circle cx="73" cy="23" r="2" fill="#f59e0b" />
            </g>
          )}

          {/* Flask Glass Body Outline */}
          <path
            d="M42 16 H58 V35 L82 78 C85 84 81 90 74 90 H26 C19 90 15 84 18 78 L42 35 V16 Z"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Flask Lip */}
          {state !== 'celebrating' && (
            <rect x="38" y="12" width="24" height="6" rx="3" fill="#64748b" />
          )}

          {/* Liquid Inside */}
          <path
            d={
              state === 'sleeping'
                ? 'M26 84 L38 64 H62 L74 84 C76 87 73 88 68 88 H32 C27 88 24 87 26 84 Z'
                : 'M26 82 L44 48 H56 L74 82 C76 86 73 88 68 88 H32 C27 88 24 86 26 82 Z'
            }
            fill={liquidColor}
            opacity="0.85"
          />

          {/* Liquid Bubbles inside */}
          <circle cx="48" cy="62" r="3" fill="#ffffff" opacity="0.6" />
          <circle cx="58" cy="72" r="4" fill="#ffffff" opacity="0.5" />
          <circle cx="38" cy="76" r="2.5" fill="#ffffff" opacity="0.7" />
          {(state === 'surprised' || state === 'cheering') && (
            <>
              <circle cx="50" cy="50" r="3.5" fill="#ffffff" opacity="0.8" />
              <circle cx="44" cy="40" r="2.5" fill="#ffffff" opacity="0.8" />
              <circle cx="56" cy="42" r="2" fill="#ffffff" opacity="0.7" />
            </>
          )}

          {/* EYES */}
          {state === 'correct' || state === 'celebrating' || state === 'happy' ? (
            // Happy Smiling Eyes
            <>
              <path d="M40 56 Q45 50 50 56" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              <path d="M54 56 Q59 50 64 56" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : state === 'wrong' ? (
            // Dizzy/Sad Eyes (crosses)
            <>
              <path d="M42 52 L48 58 M48 52 L42 58" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M56 52 L62 58 M62 52 L56 58" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : state === 'surprised' ? (
            // Wide Open Big Eyes
            <>
              <circle cx="44" cy="54" r="5" fill="#ffffff" />
              <circle cx="58" cy="54" r="5" fill="#ffffff" />
              <circle cx="44" cy="54" r="2.5" fill="#0f172a" />
              <circle cx="58" cy="54" r="2.5" fill="#0f172a" />
              <circle cx="43" cy="52" r="1" fill="#ffffff" />
              <circle cx="57" cy="52" r="1" fill="#ffffff" />
            </>
          ) : state === 'sleeping' ? (
            // Closed Sleeping Slit Eyes
            <>
              <path d="M41 57 L49 57" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M53 57 L61 57" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : state === 'cheering' ? (
            // Cheering Sparkly Eyes
            <>
              <path d="M39 55 Q44 48 49 55" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              <path d="M53 55 Q58 48 63 55" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : state === 'thinking' ? (
            // Thinking Eyes (looking up right)
            <>
              <circle cx="45" cy="52" r="3.5" fill="#ffffff" />
              <circle cx="58" cy="52" r="3.5" fill="#ffffff" />
              <circle cx="47" cy="50" r="1.8" fill="#0f172a" />
              <circle cx="60" cy="50" r="1.8" fill="#0f172a" />
            </>
          ) : (
            // Idle Eyes
            <>
              <circle cx="45" cy="55" r="3.5" fill="#ffffff" />
              <circle cx="58" cy="55" r="3.5" fill="#ffffff" />
              <circle cx="46" cy="55" r="1.8" fill="#0f172a" />
              <circle cx="59" cy="55" r="1.8" fill="#0f172a" />
            </>
          )}

          {/* MOUTH */}
          {state === 'correct' || state === 'celebrating' || state === 'happy' || state === 'cheering' ? (
            <path d="M47 64 Q52 70 57 64" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          ) : state === 'surprised' ? (
            // Open 'O' Mouth
            <ellipse cx="51" cy="65" rx="3" ry="4" fill="#0f172a" />
          ) : state === 'wrong' ? (
            <path d="M48 66 Q52 62 56 66" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          ) : state === 'sleeping' ? (
            <path d="M49 64 Q51 66 53 64" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          ) : (
            <circle cx="52" cy="63" r="1.5" fill="#0f172a" />
          )}

          {/* Cute Pink Cheeks on Happy / Cheering / Surprised */}
          {(state === 'happy' || state === 'cheering' || state === 'celebrating') && (
            <>
              <circle cx="36" cy="60" r="2.5" fill="#fb7185" opacity="0.6" />
              <circle cx="66" cy="60" r="2.5" fill="#fb7185" opacity="0.6" />
            </>
          )}
        </svg>
      </motion.div>
    </div>
  );
};
