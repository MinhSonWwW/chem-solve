/**
 * SnakePath — Bản đồ học tập ziczac phong cách Studio Game vẽ tay.
 * M3 Design Bible:
 *  - Đường nối: nét đứt 4px vẽ tay không đều, bọt khí + tinh thể rải rác
 *  - Nốt chưa học: khối đá xám 3D viền #2e4756, bóng 6px
 *  - Nốt đang học: hào quang pulse + linh vật Flasky mini nhún nhảy vẫy tay
 *  - Nốt hoàn thành: sao vàng đúc nổi viền mực đen tỏa tia sáng khi hover
 *  - Rương cuối chương: animation bập bùng + mũi tên vẽ tay "Chinh phục để mở rương!"
 */
import React from 'react';
import { motion } from 'motion/react';
import { Check, Lock, Star, Play, Award, BookOpen } from 'lucide-react';
import { sound } from '@/lib/audio';
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

/* ─── Design tokens per subject ─── */
const ACCENT = {
  chem: {
    grad1: '#38bdf8',
    grad2: '#0ea5e9',
    shadow: '#0284c7',
    activeBg: 'bg-gradient-to-tr from-[#0ea5e9] to-[#38bdf8]',
    activeShadow: 'shadow-[0_8px_0_0_#0284c7] active:shadow-[0_0px_0_0_#0284c7]',
    ring: 'bg-cyan-400/30',
    badge: 'from-cyan-400 to-sky-300 text-slate-950 border-cyan-200',
    badgePointer: 'border-t-sky-300',
    trackColor: '#0ea5e9',
    glowColor: '#0284c7',
    bubbleColor: '#38bdf8',
    iconColor: 'text-white',
  },
  physics: {
    grad1: '#fde68a',
    grad2: '#eab308',
    shadow: '#ca8a04',
    activeBg: 'bg-gradient-to-tr from-[#eab308] to-[#fde68a]',
    activeShadow: 'shadow-[0_8px_0_0_#ca8a04] active:shadow-[0_0px_0_0_#ca8a04]',
    ring: 'bg-amber-400/30',
    badge: 'from-amber-400 to-yellow-300 text-slate-950 border-amber-200',
    badgePointer: 'border-t-yellow-300',
    trackColor: '#eab308',
    glowColor: '#ca8a04',
    bubbleColor: '#fbbf24',
    iconColor: 'text-slate-950',
  },
  bio: {
    grad1: '#34d399',
    grad2: '#059669',
    shadow: '#047857',
    activeBg: 'bg-gradient-to-tr from-[#059669] to-[#34d399]',
    activeShadow: 'shadow-[0_8px_0_0_#047857] active:shadow-[0_0px_0_0_#047857]',
    ring: 'bg-emerald-400/30',
    badge: 'from-emerald-400 to-teal-300 text-slate-950 border-emerald-200',
    badgePointer: 'border-t-teal-300',
    trackColor: '#10b981',
    glowColor: '#059669',
    bubbleColor: '#34d399',
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

    // Bọt khí nhỏ (2 bên đường)
    decorations.push(
      <circle
        key={`bubble-${i}-a`}
        cx={midX + 22}
        cy={midY - 10}
        r={4}
        fill="none"
        stroke={bubbleColor}
        strokeWidth={1.5}
        opacity={0.45}
      />,
      <circle
        key={`bubble-${i}-b`}
        cx={midX - 22}
        cy={midY + 8}
        r={2.5}
        fill="none"
        stroke={bubbleColor}
        strokeWidth={1.2}
        opacity={0.35}
      />,
    );

    // Tinh thể dấu sao nhỏ (glint 4 nét)
    const sx = midX + (i % 2 === 0 ? -32 : 30);
    const sy = midY + (i % 3 === 0 ? 6 : -14);
    decorations.push(
      <g key={`glint-${i}`} opacity={0.55}>
        <line x1={sx - 4} y1={sy} x2={sx + 4} y2={sy} stroke={bubbleColor} strokeWidth={1.5} strokeLinecap="round" />
        <line x1={sx} y1={sy - 4} x2={sx} y2={sy + 4} stroke={bubbleColor} strokeWidth={1.5} strokeLinecap="round" />
        <line x1={sx - 2.5} y1={sy - 2.5} x2={sx + 2.5} y2={sy + 2.5} stroke={bubbleColor} strokeWidth={0.8} strokeLinecap="round" />
        <line x1={sx + 2.5} y1={sy - 2.5} x2={sx - 2.5} y2={sy + 2.5} stroke={bubbleColor} strokeWidth={0.8} strokeLinecap="round" />
      </g>,
    );
  }
  return <>{decorations}</>;
}

/* ─── Mũi tên vẽ tay chỉ vào rương cuối chương: "Chinh phục để mở rương!" ─── */
function ChestArrow({ x, y }: { x: number; y: number }) {
  const pillW = 148;
  const pillH = 22;
  const pillX = x - pillW / 2;
  const pillY = y - 56;

  return (
    <g className="pointer-events-none">
      {/* Khung nhãn dạng sticker vẽ tay */}
      <rect
        x={pillX}
        y={pillY}
        width={pillW}
        height={pillH}
        rx={11}
        fill="#18272f"
        stroke="#f59e0b"
        strokeWidth={2}
      />
      {/* Text nhãn */}
      <text
        x={x}
        y={pillY + 14.5}
        fontSize="9.5"
        fontWeight="900"
        fill="#fbbf24"
        fontFamily="system-ui, -apple-system, sans-serif"
        textAnchor="middle"
        letterSpacing="0.3px"
      >
        Chinh phục để mở rương!
      </text>

      {/* Mũi tên vẽ tay cong chỉ từ đáy nhãn xuống nóc rương */}
      <path
        d={`M ${x} ${pillY + pillH + 1} Q ${x + 6} ${y - 20}, ${x} ${y - 10}`}
        fill="none"
        stroke="#fbbf24"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* Đầu mũi tên nhọn */}
      <path
        d={`M ${x - 4} ${y - 16} L ${x} ${y - 10} L ${x + 4} ${y - 16}`}
        fill="none"
        stroke="#fbbf24"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

export const SnakePath: React.FC<SnakePathProps> = ({ nodes, onNodeClick, subject = 'chem' }) => {
  const ac = ACCENT[subject] ?? ACCENT.chem;
  const isPhysics = subject === 'physics';
  const isBio = subject === 'bio';

  const nodeSpacing = 94;
  const startY = 52;
  const svgWidth = 360;
  const totalHeight = startY + nodes.length * nodeSpacing + 40;

  /* Tọa độ nốt — sine wave ziczac */
  const nodeCoords = nodes.map((_, index) => {
    const wave = Math.sin((index * Math.PI) / 2);
    const x = 180 + Math.round(wave * 68);
    const y = startY + index * nodeSpacing;
    return { x, y };
  });

  /* Build SVG paths */
  let fullPathD = '';
  let completedPathD = '';
  let lastReachedIndex = -1;

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
      const seg = ` C ${prev.x} ${cy1}, ${coord.x} ${cy2}, ${coord.x} ${coord.y}`;
      fullPathD += seg;
      if (i <= lastReachedIndex) completedPathD += seg;
    }
  });

  const firstActiveIndex = nodes.findIndex((n) => n.status === 'active');
  // Tìm chỉ số nốt rương để vẽ mũi tên
  const chestIndices = nodes
    .map((n, i) => (n.type === 'chest' && n.status !== 'completed' ? i : -1))
    .filter((i) => i >= 0);

  const handleNodePress = (node: PathNode) => {
    sound.playClick();
    onNodeClick(node);
  };

  return (
    <div className="relative w-full max-w-[380px] mx-auto select-none py-1">
      {/* ─── SVG Background Track ─── */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${svgWidth} ${totalHeight}`}
        preserveAspectRatio="xMidYMin meet"
      >
        <defs>
          {/* Gradient cho đường đã đi */}
          <linearGradient id={`grad-${subject}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ac.grad1} />
            <stop offset="100%" stopColor={ac.grad2} />
          </linearGradient>
          {/* Glow filter nhẹ */}
          <filter id={`glow-${subject}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3"
              floodColor={ac.glowColor} floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 1. Bóng đổ đường (3D depth) */}
        <path d={fullPathD} fill="none"
          stroke="#080d12" strokeWidth={18}
          strokeLinecap="round" strokeLinejoin="round"
        />

        {/* 2. Đường nền xám đá — viền #20333d */}
        <path d={fullPathD} fill="none"
          stroke="#20333d" strokeWidth={14}
          strokeLinecap="round" strokeLinejoin="round"
        />

        {/* 3. Nét viền mực đậm bên ngoài đường */}
        <path d={fullPathD} fill="none"
          stroke="#131f24" strokeWidth={16}
          strokeLinecap="round" strokeLinejoin="round"
          opacity={0.6}
        />

        {/* 4. Đường đã hoàn thành — gradient rực rỡ */}
        {lastReachedIndex > 0 && (
          <path d={completedPathD} fill="none"
            stroke={`url(#grad-${subject})`} strokeWidth={14}
            strokeLinecap="round" strokeLinejoin="round"
            filter={`url(#glow-${subject})`}
          />
        )}

        {/* 5. Nét đứt vẽ tay dày 4px — uốn lượn tự nhiên */}
        <path d={fullPathD} fill="none"
          stroke="#1e3040" strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray="8 8 4 8 12 8"
          opacity={0.8}
        />

        {/* 5b. Nét đứt phát sáng trên đoạn đường đã hoàn thành */}
        {lastReachedIndex > 0 && (
          <path d={completedPathD} fill="none"
            stroke="#ffffff" strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray="6 8 3 8 10 8"
            opacity={0.4}
          />
        )}

        {/* 6. Bọt khí + tinh thể trang trí rải trên đường */}
        <PathDecorations nodeCoords={nodeCoords} bubbleColor={ac.bubbleColor} />

        {/* 7. Mũi tên vẽ tay chỉ vào rương chưa mở */}
        {chestIndices.map((ci) => (
          <ChestArrow key={ci} x={nodeCoords[ci].x} y={nodeCoords[ci].y} />
        ))}
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
          const showStartBadge = isActive && index === firstActiveIndex;
          const leftPercent = (coord.x / svgWidth) * 100;

          return (
            <div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${leftPercent}%`, top: `${coord.y}px` }}
            >
              {/* ── Badge nổi "BẮT ĐẦU / LÝ THUYẾT" có Flasky mini nhún nhảy vẫy tay ── */}
              {showStartBadge && (
                <motion.div
                  initial={{ y: 4 }}
                  animate={{ y: -4 }}
                  transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.85, ease: 'easeInOut' }}
                  className="absolute -top-16 z-20 flex flex-col items-center pointer-events-none"
                >
                  {/* Linh vật Flasky mini nhún nhảy vẫy tay gọi học sinh */}
                  <div className="-mb-2 scale-75 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
                    <Mascot state="cheering" size="sm" interactive={false} />
                  </div>
                  <div
                    className={`font-black text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-xl
                      shadow-[0_4px_0_0_rgba(0,0,0,0.4)] border-2
                      bg-gradient-to-r ${ac.badge}`}
                  >
                    {isTheory ? 'LÝ THUYẾT' : 'BẮT ĐẦU'}
                  </div>
                  {/* Tam giác chỉ xuống */}
                  <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] -mt-[1px] ${ac.badgePointer}`} />
                </motion.div>
              )}

              {/* ── Sparkle trang trí quanh nốt active ── */}
              {isActive && (
                <div className="absolute -top-4 -right-6 pointer-events-none opacity-80">
                  <HandDrawnIcon name="flame" size={16} />
                </div>
              )}

              {/* ── Node Button ── */}
              <div className="relative">
                {/* Pulse ring cho nốt active */}
                {isActive && (
                  <span
                    className={`absolute -inset-3 rounded-full animate-ping pointer-events-none ${ac.ring}`}
                  />
                )}
                {/* Ring thứ 2 chậm hơn */}
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
                    isActive
                      ? {
                          background: `linear-gradient(135deg, ${ac.grad2}, ${ac.grad1})`,
                          boxShadow: `0 8px 0 0 ${ac.shadow}`,
                        }
                      : undefined
                  }
                  className={`relative flex flex-col items-center justify-center font-black select-none
                    transition-all duration-100 cursor-pointer rounded-full
                    ${isChest
                      ? `w-[76px] h-[76px]
                          bg-gradient-to-tr from-amber-600 to-amber-300
                          text-amber-950 border-[3px] border-amber-200
                          shadow-[0_8px_0_0_#78350f]
                          hover:brightness-110
                          active:translate-y-[8px] active:shadow-[0_0px_0_0_#78350f]`
                      : isCompleted
                      ? `w-[68px] h-[68px]
                          bg-[#22c55e] text-slate-950 border-[3px] border-emerald-300
                          shadow-[0_6px_0_0_#15803d]
                          hover:bg-emerald-400
                          active:translate-y-[6px] active:shadow-[0_0px_0_0_#15803d]`
                      : isActive
                      ? `w-[74px] h-[74px]
                          ${ac.activeBg}
                          ${ac.activeShadow}
                          border-[3px] border-white/40
                          hover:brightness-110
                          active:translate-y-[8px]
                          ring-4 ring-white/20`
                      : isCheckpoint
                      ? `w-[64px] h-[64px]
                          bg-[#1e3a4a] text-slate-300 border-[3px] border-[#2e5470]
                          shadow-[0_6px_0_0_#0f1f28]
                          active:translate-y-[6px] active:shadow-[0_0px_0_0_#0f1f28]`
                      : `w-[64px] h-[64px]
                          bg-[#20333d] text-slate-400 border-[3px] border-[#2e4756]
                          shadow-[0_6px_0_0_#131f24]
                          hover:border-slate-500
                          active:translate-y-[6px] active:shadow-[0_0px_0_0_#131f24]`
                    }`}
                >
                  {/* Gloss shine viền trên */}
                  <div className="absolute top-1.5 left-3 right-3 h-3 bg-white/20 rounded-full pointer-events-none" />

                  {/* Icon nội dung nốt */}
                  {isChest ? (
                    <HandDrawnIcon
                      name="treasure-chest"
                      size={36}
                      className={isCompleted ? 'opacity-70' : ''}
                    />
                  ) : isCompleted ? (
                    <Check className="w-8 h-8 stroke-[3.5]" />
                  ) : isActive && isTheory ? (
                    <BookOpen className={`w-7 h-7 stroke-[2.5] ${ac.iconColor}`} />
                  ) : isActive ? (
                    <Play className={`w-7 h-7 ${ac.iconColor === 'text-white' ? 'fill-white' : 'fill-slate-950'} ml-0.5`} />
                  ) : isUnready ? (
                    <HandDrawnIcon name="flask" size={22} className="opacity-40" />
                  ) : isTheory ? (
                    <BookOpen className="w-6 h-6 text-slate-500" />
                  ) : isCheckpoint ? (
                    <Award className="w-7 h-7 text-slate-400" />
                  ) : (
                    <Lock className="w-6 h-6 text-slate-500" />
                  )}
                </button>

                {/* Rương: animation bập bùng ánh sáng vàng */}
                {isChest && node.status !== 'completed' && (
                  <motion.div
                    className="absolute -inset-1 rounded-full pointer-events-none"
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(251,191,36,0)',
                        '0 0 12px 8px rgba(251,191,36,0.35)',
                        '0 0 0 0 rgba(251,191,36,0)',
                      ],
                    }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  />
                )}
              </div>

              {/* ── Node Title & Star Rating ── */}
              <div className="mt-2.5 text-center w-[130px] flex flex-col items-center">
                <span
                  className={`text-[11px] font-black block leading-tight truncate w-full text-center
                    ${isActive
                      ? isPhysics ? 'text-amber-300' : isBio ? 'text-emerald-300' : 'text-sky-300'
                      : isCompleted
                      ? 'text-slate-200'
                      : 'text-slate-500'
                    }`}
                >
                  {node.title}
                </span>

                {/* "Sắp có" badge cho bài chưa sẵn */}
                {isUnready && !isCompleted && (
                  <span className="inline-block text-[9px] font-bold text-amber-400/80
                    bg-amber-950/60 px-1.5 py-0.5 rounded mt-0.5
                    border border-amber-900/50">
                    Sắp có
                  </span>
                )}

                {/* Sao vàng đúc nổi viền mực đen cho nốt hoàn thành */}
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
                          className="w-4 h-4 fill-amber-400 text-slate-950 stroke-[1.8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                        />
                        <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-yellow-200 rounded-full opacity-0 group-hover/star:opacity-100 animate-ping pointer-events-none" />
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
