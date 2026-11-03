/**
 * SnakePath — Bản đồ học tập ziczac phong cách Studio Game vẽ tay.
 * Hệ màu v2 (stem-solve-colors-v2.md):
 *  - Node đang học: {subject}.fill + bóng 3D {subject}.edge + pulse {subject}-tint + mascot
 *  - Node đã hoàn thành: {subject}.fill + tick + sao gold (KHÔNG tô xanh lục)
 *  - Node đã khóa: --bg-surface-2 + viền/đáy --border + icon ổ khóa --text-tertiary
 *  - Rương thưởng: gold.fill + bóng gold.edge (chữ/icon mực --on-ink)
 *  - Trạm ôn tập: slate.fill + bóng slate.edge + icon trắng
 */
import React from 'react';
import { motion } from 'motion/react';
import { Check, Lock, Star, Play, Award, BookOpen, Gift } from 'lucide-react';
import { sound } from '@/lib/audio';
import { assetUrl } from '@/lib/utils';
import { HandDrawnIcon } from './HandDrawnIcon';
import { Mascot } from './Mascot';

export interface PathNode {
  id: string;
  title: string;
  type: 'lesson' | 'theory' | 'checkpoint' | 'chest';
  status: 'completed' | 'active' | 'locked';
  stars?: number; // 0-3
  isReady?: boolean;
}

export interface SnakePathProps {
  nodes: PathNode[];
  onNodeClick: (node: PathNode) => void;
  subject?: 'chem' | 'physics' | 'bio';
}

/* ─── Design tokens per subject (v2) ─── */
const ACCENT = {
  chem: {
    fill: 'var(--chem-fill)',
    edge: 'var(--chem-edge)',
    fg: 'var(--chem-fg)',
    tint: 'var(--chem-tint)',
    activeShadow: 'shadow-[0_8px_0_0_var(--chem-edge)]',
    ring: 'bg-[var(--chem-tint)]',
    badge: 'bg-[var(--chem-fill)] text-white border-[var(--chem-edge)]',
    badgePointer: 'border-t-[var(--chem-fill)]',
    trackColor: 'var(--chem-fill)',
    bubbleColor: 'var(--chem-fg)',
    iconColor: 'text-white',
  },
  physics: {
    fill: 'var(--phy-fill)',
    edge: 'var(--phy-edge)',
    fg: 'var(--phy-fg)',
    tint: 'var(--phy-tint)',
    activeShadow: 'shadow-[0_8px_0_0_var(--phy-edge)]',
    ring: 'bg-[var(--phy-tint)]',
    badge: 'bg-[var(--phy-fill)] text-white border-[var(--phy-edge)]',
    badgePointer: 'border-t-[var(--phy-fill)]',
    trackColor: 'var(--phy-fill)',
    bubbleColor: 'var(--phy-fg)',
    iconColor: 'text-white',
  },
  bio: {
    fill: 'var(--bio-fill)',
    edge: 'var(--bio-edge)',
    fg: 'var(--bio-fg)',
    tint: 'var(--bio-tint)',
    activeShadow: 'shadow-[0_8px_0_0_var(--bio-edge)]',
    ring: 'bg-[var(--bio-tint)]',
    badge: 'bg-[var(--bio-fill)] text-white border-[var(--bio-edge)]',
    badgePointer: 'border-t-[var(--bio-fill)]',
    trackColor: 'var(--bio-fill)',
    bubbleColor: 'var(--bio-fg)',
    iconColor: 'text-white',
  },
};

/* ─── SVG bọt khí lab + tinh thể rải trên đường đi ─── */
function PathDecorations({
  nodeCoords,
  bubbleColor,
}: {
  nodeCoords: { x: number; y: number }[];
  bubbleColor: string;
}) {
  const decorations: React.ReactNode[] = [];
  for (let i = 0; i < nodeCoords.length - 1; i++) {
    const c = nodeCoords[i];
    const n = nodeCoords[i + 1];
    const midX = (c.x + n.x) / 2;
    const midY = (c.y + n.y) / 2;

    decorations.push(
      <circle
        key={`bubble-${i}-a`}
        cx={midX + 22}
        cy={midY - 10}
        r={4}
        fill={bubbleColor}
        opacity={0.35}
      />
    );
    decorations.push(
      <circle
        key={`bubble-${i}-b`}
        cx={midX - 18}
        cy={midY + 12}
        r={2.5}
        fill={bubbleColor}
        opacity={0.25}
      />
    );

    if (i % 2 === 0) {
      decorations.push(
        <polygon
          key={`glint-${i}`}
          points={`${midX},${midY - 5} ${midX + 3},${midY} ${midX},${midY + 5} ${midX - 3},${midY}`}
          fill="white"
          opacity={0.4}
        />
      );
    }
  }
  return <g>{decorations}</g>;
}

export const SnakePath: React.FC<SnakePathProps> = ({
  nodes,
  onNodeClick,
  subject = 'chem',
}) => {
  const ac = ACCENT[subject] || ACCENT.chem;

  const svgWidth = 360;
  const nodeSpacingY = 112;
  const startY = 80;
  const xOffsets = [180, 110, 80, 130, 220, 260, 220, 140, 90, 130, 230];

  const nodeCoords = nodes.map((_, index) => ({
    x: xOffsets[index % xOffsets.length],
    y: startY + index * nodeSpacingY,
  }));

  const totalHeight = startY + (nodes.length - 1) * nodeSpacingY + 100;

  let fullPathD = '';
  for (let i = 0; i < nodeCoords.length; i++) {
    const { x, y } = nodeCoords[i];
    if (i === 0) {
      fullPathD = `M ${x} ${y}`;
    } else {
      const prev = nodeCoords[i - 1];
      const midY = (prev.y + y) / 2;
      fullPathD += ` C ${prev.x} ${midY}, ${x} ${midY}, ${x} ${y}`;
    }
  }

  let lastReachedIndex = -1;
  nodes.forEach((node, idx) => {
    if (node.status === 'completed' || node.status === 'active') {
      lastReachedIndex = idx;
    }
  });

  let completedPathD = '';
  if (lastReachedIndex > 0) {
    for (let i = 0; i <= lastReachedIndex; i++) {
      const { x, y } = nodeCoords[i];
      if (i === 0) {
        completedPathD = `M ${x} ${y}`;
      } else {
        const prev = nodeCoords[i - 1];
        const midY = (prev.y + y) / 2;
        completedPathD += ` C ${prev.x} ${midY}, ${x} ${midY}, ${x} ${y}`;
      }
    }
  }

  const firstActiveIndex = nodes.findIndex((n) => n.status === 'active');

  const handleNodePress = (node: PathNode) => {
    sound.playClick();
    onNodeClick(node);
  };

  return (
    <div className="relative w-full max-w-[390px] mx-auto select-none pt-4 pb-20">
      {/* ─── SVG Connecting Road ─── */}
      <svg
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{ height: `${totalHeight}px` }}
        viewBox={`0 0 ${svgWidth} ${totalHeight}`}
        preserveAspectRatio="xMidYMin meet"
      >
        {/* Nét viền tối bên ngoài đường */}
        <path
          d={fullPathD}
          fill="none"
          stroke="var(--border)"
          strokeWidth={14}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.4}
        />

        {/* Đường đã hoàn thành — màu môn học */}
        {lastReachedIndex > 0 && (
          <path
            d={completedPathD}
            fill="none"
            stroke={ac.trackColor}
            strokeWidth={10}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.8}
          />
        )}

        {/* Nét đứt vẽ tay tự nhiên */}
        <path
          d={fullPathD}
          fill="none"
          stroke="var(--bg-canvas)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray="8 8 4 8 12 8"
          opacity={0.7}
        />

        {/* Bọt khí trang trí rải trên đường */}
        <PathDecorations nodeCoords={nodeCoords} bubbleColor={ac.bubbleColor} />
      </svg>

      {/* ─── Nodes Container ─── */}
      <div className="relative w-full" style={{ height: `${totalHeight}px` }}>
        {nodes.map((node, index) => {
          const coord = nodeCoords[index];
          const isCompleted = node.status === 'completed';
          const isActive = node.status === 'active';
          const isChest = node.type === 'chest';
          const isTheory = node.type === 'theory';
          const isCheckpoint = node.type === 'checkpoint';
          const isUnready = node.isReady === false;
          const showStartBadge = isActive && index === firstActiveIndex && !isChest;
          const leftPercent = (coord.x / svgWidth) * 100;

          return (
            <div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${leftPercent}%`, top: `${coord.y}px` }}
            >
              {/* Badge "Chinh phục để mở rương!" */}
              {isChest && !isCompleted && (
                <motion.div
                  initial={{ y: 2 }}
                  animate={{ y: -3 }}
                  transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.6, ease: 'easeInOut' }}
                  className="absolute -top-[52px] z-20 flex flex-col items-center pointer-events-none whitespace-nowrap"
                >
                  <div className="bg-[var(--bg-surface)] text-[var(--gold-fg)] border border-[var(--gold-edge)] text-[10.5px] font-black tracking-wide px-3 py-1 rounded-xl shadow-[var(--shadow-modal)] flex items-center gap-1.5 backdrop-blur-md">
                    <span className="text-xs select-none">🎁</span>
                    <span>Chinh phục để mở rương!</span>
                  </div>
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[var(--gold-edge)] -mt-[1px]" />
                </motion.div>
              )}

              {/* Badge nổi "BẮT ĐẦU / LÝ THUYẾT" */}
              {showStartBadge && (
                <motion.div
                  initial={{ y: 4 }}
                  animate={{ y: -4 }}
                  transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.85, ease: 'easeInOut' }}
                  className="absolute -top-16 z-20 flex flex-col items-center pointer-events-none"
                >
                  <div className="-mb-2 scale-75 drop-shadow-md">
                    <Mascot state="cheering" size="sm" interactive={false} />
                  </div>
                  <div
                    className={`font-black text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-xl
                      shadow-[0_4px_0_0_var(--subject-edge)] border-2 ${ac.badge}`}
                  >
                    {isTheory ? 'LÝ THUYẾT' : 'BẮT ĐẦU'}
                  </div>
                  <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] -mt-[1px] ${ac.badgePointer}`} />
                </motion.div>
              )}

              {/* Sparkle trang trí quanh nốt active */}
              {isActive && (
                <div className="absolute -top-4 -right-6 pointer-events-none opacity-80 text-[var(--warn-fg)]">
                  <HandDrawnIcon name="flame" size={16} />
                </div>
              )}

              {/* Node Button */}
              <div className="relative">
                {/* Pulse ring cho nốt active */}
                {isActive && (
                  <span
                    className={`absolute -inset-3 rounded-full animate-ping pointer-events-none ${ac.ring}`}
                  />
                )}
                {isActive && (
                  <span
                    className={`absolute -inset-1.5 rounded-full pointer-events-none opacity-50
                      ${ac.ring} animate-[ping_1.8s_ease-in-out_0.4s_infinite]`}
                  />
                )}

                <button
                  onClick={() => handleNodePress(node)}
                  aria-label={node.title}
                  style={
                    isActive || isCompleted
                      ? {
                          backgroundColor: ac.fill,
                          boxShadow: `0 8px 0 0 ${ac.edge}`,
                        }
                      : isChest
                      ? {
                          backgroundColor: 'var(--gold-fill)',
                          boxShadow: '0 8px 0 0 var(--gold-edge)',
                        }
                      : isCheckpoint
                      ? {
                          backgroundColor: 'var(--slate-fill)',
                          boxShadow: '0 8px 0 0 var(--slate-edge)',
                        }
                      : {
                          backgroundColor: 'var(--bg-surface-2)',
                          boxShadow: '0 6px 0 0 var(--border)',
                        }
                  }
                  className={`relative flex flex-col items-center justify-center font-black select-none
                    transition-all duration-100 cursor-pointer rounded-full
                    ${isChest
                      ? `w-[76px] h-[76px] text-[var(--on-ink)] border-2 border-[var(--gold-edge)]
                         hover:brightness-105 active:translate-y-[8px] active:shadow-none`
                      : isCompleted
                      ? `w-[68px] h-[68px] text-white border-2 border-white/40
                         hover:brightness-105 active:translate-y-[6px] active:shadow-none`
                      : isActive
                      ? `w-[74px] h-[74px] text-white border-2 border-white/50
                         hover:brightness-110 active:translate-y-[8px] active:shadow-none ring-4 ring-white/20`
                      : isCheckpoint
                      ? `w-[64px] h-[64px] text-white border-2 border-[var(--slate-edge)]
                         active:translate-y-[6px] active:shadow-none`
                      : `w-[64px] h-[64px] text-[var(--text-tertiary)] border border-[var(--border)]
                         active:translate-y-[6px] active:shadow-none`
                    }`}
                >
                  {/* Gloss shine viền trên */}
                  <div className="absolute top-1.5 left-3 right-3 h-3 bg-white/25 rounded-full pointer-events-none" />

                  {/* Icon nội dung nốt */}
                  {isChest ? (
                    isCompleted ? (
                      <img
                        src={assetUrl('/assets/roadmap/node-chest-completed.png')}
                        alt="Rương đã mở"
                        className="w-12 h-12 object-contain drop-shadow-md select-none pointer-events-none"
                      />
                    ) : (
                      <Gift className="w-9 h-9 stroke-[2] text-[var(--on-ink)]" />
                    )
                  ) : isCompleted ? (
                    <Check className="w-8 h-8 stroke-[3.5] text-white" />
                  ) : isActive && isTheory ? (
                    <BookOpen className="w-7 h-7 stroke-[2.5] text-white" />
                  ) : isActive ? (
                    <Play className="w-7 h-7 fill-white text-white ml-0.5" />
                  ) : isUnready ? (
                    <Lock className="w-6 h-6 text-[var(--text-tertiary)] opacity-40" />
                  ) : isTheory ? (
                    <BookOpen className="w-6 h-6 text-[var(--text-tertiary)]" />
                  ) : isCheckpoint ? (
                    <Award className="w-7 h-7 text-white" />
                  ) : (
                    <Lock className="w-6 h-6 text-[var(--text-tertiary)]" />
                  )}
                </button>
              </div>

              {/* ── Node Title & Star Rating ── */}
              <div className="mt-2.5 text-center w-[130px] flex flex-col items-center">
                <span
                  className={`text-[11px] font-black block leading-tight truncate w-full text-center
                    ${isActive
                      ? 'text-[var(--text-primary)]'
                      : isCompleted
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-tertiary)]'
                    }`}
                >
                  {node.title}
                </span>

                {/* "Sắp có" badge cho bài chưa sẵn */}
                {isUnready && !isCompleted && (
                  <span className="inline-block text-[9px] font-bold text-[var(--warn-fg)]
                    bg-[var(--warn-tint)] px-1.5 py-0.5 rounded mt-0.5
                    border border-[var(--warn-edge)]">
                    Sắp có
                  </span>
                )}

                {/* 1-3 Sao vàng gold cho nốt hoàn thành */}
                {isCompleted && (
                  <div className="flex justify-center gap-0.5 mt-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.35, rotate: 12 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        className="relative group/star"
                      >
                        <Star
                          className="w-4 h-4 fill-[var(--gold-fill)] text-[var(--gold-edge)] stroke-[1.5]"
                        />
                      </motion.div>
                    ))}
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
