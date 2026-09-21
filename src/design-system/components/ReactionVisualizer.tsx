import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn, assetUrl } from '@/lib/utils';
import { useReducedMotion } from '@/design-system/motion/useReducedMotion';
import { sound } from '@/lib/audio';

export type ReactionEffectType = 'gas' | 'precipitate' | 'indicator' | 'liquid-level';

export interface ReactionVisualizerProps {
  type: ReactionEffectType;
  color?: string; // Hex or CSS color, e.g. '#ffffff' (BaSO4), '#38bdf8' (Cu(OH)2), '#ef4444' (red acid litmus)
  label?: string; // Optional label e.g. "↑ Khí H2 thoát ra", "↓ Kết tủa BaSO4 trắng"
  className?: string;
  autoPlaySound?: boolean;
  onComplete?: () => void;
}

export const ReactionVisualizer: React.FC<ReactionVisualizerProps> = ({
  type,
  color,
  label,
  className,
  autoPlaySound = true,
  onComplete,
}) => {
  const prefersReduced = useReducedMotion();
  const [animationKey, setAnimationKey] = useState(0);

  // Play reaction sound on mount/restart
  useEffect(() => {
    if (!autoPlaySound) return;
    if (type === 'gas') {
      sound.playGasHiss();
      setTimeout(() => sound.playBubbling(), 100);
    } else if (type === 'precipitate') {
      sound.playDragDrop();
    } else if (type === 'indicator') {
      sound.playBubbling();
    }

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, [type, autoPlaySound, animationKey, onComplete]);

  // Color defaults
  const resolvedColor =
    color ||
    (type === 'gas'
      ? '#38bdf8' // Sky blue bubbles
      : type === 'precipitate'
      ? '#ffffff' // White precipitate
      : type === 'indicator'
      ? '#f43f5e' // Red litmus
      : '#10b981'); // Emerald liquid

  // 1. Gas Evolution (≤ 12 bubbles rising from bottom)
  const renderGasEffect = () => {
    const bubbles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: 20 + ((i * 7) % 60),
      size: 4 + (i % 4) * 2,
      delay: i * 0.14,
      duration: 1.2 + (i % 3) * 0.25,
    }));

    return (
      <div className="relative w-full h-32 flex items-center justify-center">
        {/* Test Tube Graphic */}
        <div className="relative w-20 h-28 rounded-b-full border-2 border-slate-700 bg-slate-900/60 overflow-hidden shadow-inner">
          {/* Liquid Base */}
          <div
            className="absolute bottom-0 inset-x-0 h-20 opacity-40 transition-colors"
            style={{ backgroundColor: resolvedColor }}
          />

          {/* Rising Gas Bubbles */}
          {!prefersReduced &&
            bubbles.map((b) => (
              <motion.div
                key={`${animationKey}-${b.id}`}
                initial={{ y: 70, x: b.x - 10, opacity: 0.9, scale: 0.5 }}
                animate={{
                  y: -10,
                  x: [b.x - 10, b.x - 14, b.x - 6, b.x - 10],
                  opacity: [0, 0.9, 0.9, 0],
                  scale: [0.5, 1, 1.2, 0.2],
                }}
                transition={{
                  duration: b.duration,
                  delay: b.delay,
                  ease: 'easeOut',
                }}
                className="absolute rounded-full border border-white/80 bg-cyan-300/40"
                style={{
                  width: b.size,
                  height: b.size,
                }}
              />
            ))}
        </div>
      </div>
    );
  };

  // 2. Precipitate Formation (≤ 12 flakes settling down)
  const renderPrecipitateEffect = () => {
    const flakes = Array.from({ length: 11 }, (_, i) => ({
      id: i,
      x: 15 + ((i * 13) % 55),
      size: 4 + (i % 3) * 1.5,
      delay: i * 0.1,
      targetY: 65 + (i % 4) * 3,
    }));

    return (
      <div className="relative w-full h-32 flex items-center justify-center">
        <div className="relative w-20 h-28 rounded-b-full border-2 border-slate-700 bg-slate-900/60 overflow-hidden shadow-inner">
          {/* Liquid */}
          <div className="absolute bottom-0 inset-x-0 h-22 bg-slate-800/40" />

          {/* Settling Precipitate Flakes */}
          {!prefersReduced ? (
            flakes.map((f) => (
              <motion.div
                key={`${animationKey}-${f.id}`}
                initial={{ y: 5, x: f.x, opacity: 0, scale: 0.8 }}
                animate={{
                  y: f.targetY,
                  x: [f.x, f.x + ((f.id % 2 === 0 ? 3 : -3)), f.x],
                  opacity: [0, 0.95, 1],
                  scale: 1,
                }}
                transition={{
                  duration: 1.4,
                  delay: f.delay,
                  ease: 'easeIn',
                }}
                className="absolute rounded-sm shadow-sm"
                style={{
                  width: f.size,
                  height: f.size,
                  backgroundColor: resolvedColor,
                }}
              />
            ))
          ) : (
            /* Reduced motion fallback: static sediment */
            <div
              className="absolute bottom-1 inset-x-2 h-4 rounded-b-full opacity-80"
              style={{ backgroundColor: resolvedColor }}
            />
          )}

          {/* Sediment layer accumulated at the bottom */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 10, opacity: 0.95 }}
            transition={{ delay: 0.8, duration: 1.0 }}
            className="absolute bottom-0 inset-x-1 rounded-b-full shadow-md"
            style={{ backgroundColor: resolvedColor }}
          />
        </div>
      </div>
    );
  };

  // 3. Indicator Color Change (Reagent drop creates expanding color bloom)
  const renderIndicatorEffect = () => {
    return (
      <div className="relative w-full h-32 flex items-center justify-center">
        <div className="relative w-20 h-28 rounded-b-full border-2 border-slate-700 bg-slate-900/60 overflow-hidden shadow-inner">
          {/* Falling Reagent Droplet */}
          {!prefersReduced && (
            <motion.div
              initial={{ y: -8, opacity: 1, scale: 1 }}
              animate={{ y: 35, opacity: [1, 1, 0], scale: [1, 1, 0.2] }}
              transition={{ duration: 0.6, ease: 'easeIn' }}
              className="absolute left-1/2 -translate-x-1/2 w-2.5 h-3.5 rounded-full z-10"
              style={{ backgroundColor: resolvedColor }}
            />
          )}

          {/* Liquid with expanding radial color wave */}
          <div className="absolute bottom-0 inset-x-0 h-22 bg-slate-800/40 overflow-hidden">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: prefersReduced ? 1 : 4, opacity: 0.85 }}
              transition={{ delay: prefersReduced ? 0 : 0.5, duration: 1.2, ease: 'easeOut' }}
              className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full filter blur-sm"
              style={{ backgroundColor: resolvedColor }}
            />
          </div>
        </div>
      </div>
    );
  };

  // 4. Liquid Level change in graduated cylinder
  const renderLiquidLevelEffect = () => {
    return (
      <div className="relative w-full h-32 flex items-center justify-center">
        <div className="relative w-16 h-28 rounded-b-lg border-2 border-slate-700 bg-slate-900/60 overflow-hidden shadow-inner flex flex-col justify-end">
          {/* Graduated Tick Marks */}
          <div className="absolute inset-y-2 left-1.5 flex flex-col justify-between text-[7px] text-slate-500 select-none pointer-events-none">
            <span>- 50</span>
            <span>- 40</span>
            <span>- 30</span>
            <span>- 20</span>
            <span>- 10</span>
          </div>

          {/* Rising Liquid Column */}
          <motion.div
            initial={{ height: '20%' }}
            animate={{ height: prefersReduced ? '75%' : ['20%', '75%'] }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="w-full relative shadow-inner"
            style={{ backgroundColor: resolvedColor }}
          >
            {/* Meniscus surface */}
            <div className="absolute -top-1.5 inset-x-0 h-3 rounded-[50%] bg-white/30" />
          </motion.div>
        </div>
      </div>
    );
  };

  const vfxSticker =
    type === 'gas'
      ? assetUrl('/assets/vfx/vfx-gas.png')
      : type === 'precipitate'
      ? assetUrl('/assets/vfx/vfx-precipitate.png')
      : type === 'indicator'
      ? resolvedColor === '#ef4444' || resolvedColor === '#f43f5e'
        ? assetUrl('/assets/vfx/litmus-red.png')
        : assetUrl('/assets/vfx/litmus-blue.png')
      : null;

  return (
    <div
      onClick={() => setAnimationKey((k) => k + 1)}
      title="Chạm để phát lại hiện tượng phản ứng"
      className={cn(
        'flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80 cursor-pointer hover:border-cyan-500/30 transition-colors relative overflow-hidden',
        className
      )}
    >
      {vfxSticker && (
        <motion.div
          key={`sticker-${animationKey}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="mb-1"
        >
          <img
            src={vfxSticker}
            alt="Hiện tượng hóa học"
            className="w-14 h-14 object-contain drop-shadow-md"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </motion.div>
      )}

      {type === 'gas' && renderGasEffect()}
      {type === 'precipitate' && renderPrecipitateEffect()}
      {type === 'indicator' && renderIndicatorEffect()}
      {type === 'liquid-level' && renderLiquidLevelEffect()}

      {label && (
        <div className="mt-2 text-xs font-bold text-slate-200 text-center flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-sm"
            style={{ backgroundColor: resolvedColor }}
          />
          {label}
        </div>
      )}
    </div>
  );
};
