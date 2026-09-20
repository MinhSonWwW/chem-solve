import React from 'react';
import { motion } from 'motion/react';
import { Check, Lock, Star, Gift, Play } from 'lucide-react';
import { Mascot } from './Mascot';
import { sound } from '@/lib/audio';

export interface PathNode {
  id: string;
  title: string;
  type: 'lesson' | 'checkpoint' | 'chest';
  status: 'completed' | 'active' | 'locked';
  stars?: number; // 0-3
}

export interface SnakePathProps {
  nodes: PathNode[];
  onNodeClick: (node: PathNode) => void;
}

export const SnakePath: React.FC<SnakePathProps> = ({ nodes, onNodeClick }) => {
  const nodeSpacing = 118;
  const startY = 60;
  const svgWidth = 360;
  const totalHeight = startY + nodes.length * nodeSpacing + 20;

  // Calculate coordinates for each node using a smooth sine wave
  const nodeCoords = nodes.map((_, index) => {
    // index 0: center (180)
    // index 1: right (260)
    // index 2: center (180)
    // index 3: left (100)
    // index 4: center (180)...
    const wave = Math.sin((index * Math.PI) / 2);
    const x = 180 + Math.round(wave * 75);
    const y = startY + index * nodeSpacing;
    return { x, y };
  });

  // Build SVG path string for background track and completed track
  let fullPathD = '';
  let completedPathD = '';

  // Find index of the active or last completed node to color the path
  let lastReachedIndex = 0;
  nodes.forEach((node, idx) => {
    if (node.status === 'completed' || node.status === 'active') {
      lastReachedIndex = idx;
    }
  });

  nodeCoords.forEach((coord, i) => {
    if (i === 0) {
      fullPathD = `M ${coord.x} ${coord.y}`;
      completedPathD = `M ${coord.x} ${coord.y}`;
    } else {
      const prev = nodeCoords[i - 1];
      const cy1 = prev.y + nodeSpacing / 2;
      const cy2 = coord.y - nodeSpacing / 2;
      const segment = ` C ${prev.x} ${cy1}, ${coord.x} ${cy2}, ${coord.x} ${coord.y}`;
      fullPathD += segment;
      if (i <= lastReachedIndex) {
        completedPathD += segment;
      }
    }
  });

  const handleNodePress = (node: PathNode) => {
    sound.playClick();
    onNodeClick(node);
  };

  return (
    <div className="relative w-full max-w-[380px] mx-auto select-none py-2">
      {/* SVG Connecting Paths */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${svgWidth} ${totalHeight}`}
        preserveAspectRatio="xMidYMin meet"
      >
        <defs>
          <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <filter id="pathGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#059669" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 1. Base track shadow */}
        <path
          d={fullPathD}
          fill="none"
          stroke="#0f172a"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 2. Uncompleted track ribbon */}
        <path
          d={fullPathD}
          fill="none"
          stroke="#1e293b"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3. Completed path trail with green-to-cyan gradient */}
        {lastReachedIndex > 0 && (
          <path
            d={completedPathD}
            fill="none"
            stroke="url(#completedGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#pathGlow)"
          />
        )}

        {/* 4. Dashed centerline track decoration */}
        <path
          d={fullPathD}
          fill="none"
          stroke="#334155"
          strokeWidth="2"
          strokeDasharray="6 8"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>

      {/* Container for Nodes */}
      <div
        className="relative w-full"
        style={{ height: `${totalHeight}px` }}
      >
        {nodes.map((node, index) => {
          const coord = nodeCoords[index];
          const isCompleted = node.status === 'completed';
          const isActive = node.status === 'active';
          const isLocked = node.status === 'locked';
          const isChest = node.type === 'chest';

          // Position in percentage of 360 width
          const leftPercent = (coord.x / svgWidth) * 100;

          return (
            <div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{
                left: `${leftPercent}%`,
                top: `${coord.y}px`,
              }}
            >
              {/* Active Node Floating Tooltip / Speech Bubble */}
              {isActive && (
                <motion.div
                  initial={{ y: 8, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.2, ease: 'easeInOut' }}
                  className="absolute -top-12 z-20 flex flex-col items-center pointer-events-none"
                >
                  <div className="bg-cyan-400 text-slate-950 font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-xl shadow-lg border border-cyan-300">
                    BẮT ĐẦU
                  </div>
                  {/* Downward triangle arrow */}
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-cyan-400" />
                </motion.div>
              )}

              {/* Mascot cheering beside active node */}
              {isActive && (
                <div
                  className={`absolute top-0 z-10 hidden sm:block ${
                    coord.x > 180 ? '-left-24' : '-right-24'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="bg-slate-900/90 border border-cyan-500/40 text-[10px] text-cyan-300 font-bold px-2 py-0.5 rounded-full mb-1 shadow whitespace-nowrap">
                      Tiến lên! ⚗️
                    </div>
                    <Mascot state="happy" size="sm" />
                  </div>
                </div>
              )}

              {/* Node Button (72px chunky Duolingo round button) */}
              <div className="relative">
                {/* Active pulsating beacon ring */}
                {isActive && (
                  <span className="absolute -inset-2.5 rounded-full bg-cyan-400/30 animate-ping pointer-events-none" />
                )}

                <button
                  onClick={() => handleNodePress(node)}
                  disabled={isLocked}
                  aria-label={node.title}
                  className={`w-[72px] h-[72px] rounded-full flex flex-col items-center justify-center font-black select-none transition-transform cursor-pointer relative ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950 border-2 border-emerald-300 shadow-[0_8px_0_0_#059669] hover:bg-emerald-400 active:translate-y-1.5 active:shadow-[0_2px_0_0_#059669]'
                      : isActive
                      ? 'bg-cyan-400 text-slate-950 border-2 border-cyan-200 shadow-[0_8px_0_0_#0891b2] hover:bg-cyan-300 active:translate-y-1.5 active:shadow-[0_2px_0_0_#0891b2] ring-4 ring-cyan-500/30'
                      : isChest
                      ? 'bg-amber-600 text-amber-200 border-2 border-amber-500 shadow-[0_6px_0_0_#78350f] opacity-75'
                      : 'bg-slate-800 text-slate-600 border-2 border-slate-700 shadow-[0_6px_0_0_#0f172a] cursor-not-allowed opacity-60'
                  }`}
                >
                  {/* Top gloss highlight shine */}
                  <div className="absolute top-1.5 left-3 right-3 h-3.5 bg-white/20 rounded-full pointer-events-none" />

                  {isChest ? (
                    <Gift className={`w-8 h-8 ${isCompleted ? 'text-slate-950' : 'text-amber-400'}`} />
                  ) : isCompleted ? (
                    <Check className="w-8 h-8 stroke-[3.5]" />
                  ) : isActive ? (
                    <Play className="w-8 h-8 fill-slate-950 ml-0.5" />
                  ) : (
                    <Lock className="w-6 h-6" />
                  )}
                </button>
              </div>

              {/* Node Title & Star rating */}
              <div className="mt-3 text-center w-[120px]">
                <span
                  className={`text-[11px] font-black block leading-tight truncate ${
                    isActive
                      ? 'text-cyan-300'
                      : isCompleted
                      ? 'text-slate-200'
                      : 'text-slate-500'
                  }`}
                >
                  {node.title}
                </span>

                {isCompleted && (
                  <div className="flex justify-center gap-0.5 mt-1 text-amber-400 drop-shadow">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
