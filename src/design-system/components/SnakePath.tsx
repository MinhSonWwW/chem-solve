import React from 'react';
import { motion } from 'motion/react';
import { Star, Play } from 'lucide-react';
import { sound } from '@/lib/audio';

export interface PathNode {
  id: string;
  title: string;
  type: 'lesson' | 'checkpoint' | 'chest';
  status: 'completed' | 'active' | 'locked';
  stars?: number; // 0-3
  isReady?: boolean;
}

export interface SnakePathProps {
  nodes: PathNode[];
  onNodeClick: (node: PathNode) => void;
}

export const SnakePath: React.FC<SnakePathProps> = ({ nodes, onNodeClick }) => {
  // Duolingo-style compact & rhythmic node spacing
  const nodeSpacing = 94;
  const startY = 48;
  const svgWidth = 360;
  const totalHeight = startY + nodes.length * nodeSpacing + 28;

  // Calculate coordinates for each node using a smooth sine wave
  const nodeCoords = nodes.map((_, index) => {
    // Smooth alternating snake curve
    const wave = Math.sin((index * Math.PI) / 2);
    const x = 180 + Math.round(wave * 68);
    const y = startY + index * nodeSpacing;
    return { x, y };
  });

  // Build SVG path string for background track and completed track
  let fullPathD = '';
  let completedPathD = '';

  // Find index of the active or last completed node to color the path
  let lastReachedIndex = -1;
  nodes.forEach((node, idx) => {
    if (node.status === 'completed' || node.status === 'active') {
      lastReachedIndex = idx;
    }
  });

  // Only the first active node shows the floating "BẮT ĐẦU" badge
  const firstActiveIndex = nodes.findIndex((n) => n.status === 'active');

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
    <div className="relative w-full max-w-[380px] mx-auto select-none py-1">
      {/* SVG Connecting Track */}
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

        {/* 1. Track 3D Drop Shadow */}
        <path
          d={fullPathD}
          fill="none"
          stroke="#090d16"
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
          opacity="0.5"
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
          const isChest = node.type === 'chest';
          const isUnready = node.isReady === false;
          const showStartBadge = isActive && index === firstActiveIndex;

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
              {/* Active Node Floating Tooltip Banner (Duolingo Style - only for the current active node) */}
              {showStartBadge && (
                <motion.div
                  initial={{ y: 4 }}
                  animate={{ y: -4 }}
                  transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.9, ease: 'easeInOut' }}
                  className="absolute -top-11 z-20 flex flex-col items-center pointer-events-none"
                >
                  <div className="bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-black text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-xl shadow-[0_4px_12px_rgba(6,182,212,0.5)] border border-cyan-200">
                    BẮT ĐẦU
                  </div>
                  {/* Downward pointer triangle */}
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-cyan-300 -mt-[1px]" />
                </motion.div>
              )}

              {/* Node Button (70px chunky 3D round button) */}
              <div className="relative">
                {/* Active pulsating beacon ring */}
                {isActive && (
                  <span className="absolute -inset-2.5 rounded-full bg-cyan-400/35 animate-ping pointer-events-none" />
                )}

                <button
                  onClick={() => handleNodePress(node)}
                  aria-label={node.title}
                  className={`w-[74px] h-[74px] rounded-full flex flex-col items-center justify-center font-black select-none transition-transform cursor-pointer relative hover:scale-105 active:scale-95 ${
                    isActive
                      ? 'drop-shadow-[0_0_16px_rgba(6,182,212,0.6)]'
                      : isCompleted
                      ? 'drop-shadow-[0_4px_10px_rgba(16,185,129,0.4)]'
                      : 'drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  {isChest ? (
                    <img
                      src="/assets/roadmap/trophy-gold.png"
                      alt="Phần thưởng"
                      className="w-[68px] h-[68px] object-contain drop-shadow-md"
                    />
                  ) : isCompleted ? (
                    <img
                      src="/assets/roadmap/node-completed.png"
                      alt="Hoàn thành"
                      className="w-[72px] h-[72px] object-contain"
                    />
                  ) : isActive ? (
                    <div className="relative flex items-center justify-center w-full h-full">
                      <img
                        src="/assets/roadmap/node-active.png"
                        alt="Đang học"
                        className="w-[72px] h-[72px] object-contain"
                      />
                      {/* Central small play indicator */}
                      <Play className="w-6 h-6 fill-white text-white absolute drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ml-0.5" />
                    </div>
                  ) : isUnready ? (
                    <div className="w-[68px] h-[68px] rounded-full bg-slate-800/90 border-2 border-slate-700 flex items-center justify-center shadow-inner">
                      <span className="text-2xl select-none" title="Đang biên soạn">🛠️</span>
                    </div>
                  ) : (
                    <img
                      src="/assets/roadmap/node-locked.png"
                      alt="Chưa mở khóa"
                      className="w-[70px] h-[70px] object-contain opacity-85 hover:opacity-100 transition-opacity"
                    />
                  )}
                </button>
              </div>

              {/* Node Title & Star Rating */}
              <div className="mt-2.5 text-center w-[130px] flex flex-col items-center">
                <span
                  className={`text-[11px] font-black block leading-tight truncate w-full ${
                    isActive
                      ? 'text-cyan-300'
                      : isCompleted
                      ? 'text-slate-200'
                      : 'text-slate-500'
                  }`}
                >
                  {node.title}
                </span>

                {isUnready && !isCompleted && (
                  <span className="inline-block text-[9px] font-bold text-amber-400/80 bg-amber-950/60 px-1.5 py-0.5 rounded mt-0.5 border border-amber-900/50">
                    Sắp có
                  </span>
                )}

                {isCompleted && (
                  <div className="flex justify-center gap-0.5 mt-0.5 text-amber-400 drop-shadow">
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
