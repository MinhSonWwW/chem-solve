/**
 * DoodleOrnament — Bộ trang trí vẽ tay (doodles) cho giao diện:
 * mũi tên uốn lượn, tia sao 4 cánh, gạch chân lượn sóng, bụi sao, bọt khí.
 * Mọi nét vẽ dùng stroke #131f24, dày 2–3px, không dùng bóng mờ nhòe.
 */
import React from 'react';

export type DoodleOrnamentName =
  | 'arrow-curved'
  | 'arrow-bounce'
  | 'sparkle-star'
  | 'glint'
  | 'wavy-underline'
  | 'double-underline'
  | 'star-dust'
  | 'bubble-lab';

interface DoodleOrnamentProps {
  name: DoodleOrnamentName;
  size?: number;
  color?: string;
  className?: string;
}

const INK = '#131f24';

/* ─────────────────────────────────────────────────────────────────
   Shared SVG wrapper
   ───────────────────────────────────────────────────────────────── */
function DoodleSVG({
  size,
  width,
  height,
  className,
  children,
  viewBox,
}: {
  size?: number;
  width?: number;
  height?: number;
  className?: string;
  children: React.ReactNode;
  viewBox: string;
}) {
  return (
    <svg
      width={width ?? size}
      height={height ?? size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {children}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ARROW-CURVED — Mũi tên cong vẽ tay chỉ hướng sang phải-xuống
   ───────────────────────────────────────────────────────────────── */
function ArrowCurved({ size = 48, color = INK, className }: DoodleOrnamentProps) {
  return (
    <DoodleSVG size={size} viewBox="0 0 56 48" className={className}>
      {/* Thân mũi tên cong */}
      <path
        d="M6 12 C10 6 22 4 30 10 C40 18 44 30 40 40"
        stroke={color} strokeWidth={2.8} fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Đầu mũi tên */}
      <path
        d="M32 42 L40 40 L38 32"
        stroke={color} strokeWidth={2.8} fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Nét phụ tạo cảm giác vẽ tay (không hoàn hảo) */}
      <path
        d="M7 13 C11 7 22 5 30 11"
        stroke={color} strokeWidth={1.2} fill="none"
        strokeLinecap="round" strokeOpacity={0.35}
      />
    </DoodleSVG>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ARROW-BOUNCE — Mũi tên nảy nhún vẽ tay (chỉ xuống)
   ───────────────────────────────────────────────────────────────── */
function ArrowBounce({ size = 40, color = INK, className }: DoodleOrnamentProps) {
  return (
    <DoodleSVG size={size} viewBox="0 0 32 48" className={className}>
      {/* Thân mũi tên ziczac nhẹ */}
      <path
        d="M16 4 C14 12 18 18 15 26 C13 32 17 38 16 44"
        stroke={color} strokeWidth={2.8} fill="none"
        strokeLinecap="round"
      />
      {/* Đầu mũi tên chỉ xuống */}
      <path
        d="M8 38 L16 46 L24 38"
        stroke={color} strokeWidth={2.8} fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </DoodleSVG>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SPARKLE-STAR — Tia sao 4 cánh nét dày mỏng không đều tự nhiên
   ───────────────────────────────────────────────────────────────── */
function SparkleStar({ size = 32, color = '#ff9600', className }: DoodleOrnamentProps) {
  return (
    <DoodleSVG size={size} viewBox="0 0 32 32" className={className}>
      {/* Cánh sao dọc dày */}
      <path
        d="M16 2 C16.5 8 16.5 8 16 30"
        stroke={color} strokeWidth={3.5} fill="none"
        strokeLinecap="round"
      />
      {/* Cánh sao ngang dày */}
      <path
        d="M2 16 C8 16.5 8 16.5 30 16"
        stroke={color} strokeWidth={3.5} fill="none"
        strokeLinecap="round"
      />
      {/* Cánh chéo mỏng hơn — tạo cảm không đồng đều tự nhiên */}
      <path
        d="M6 6 L26 26"
        stroke={color} strokeWidth={1.8} fill="none"
        strokeLinecap="round" strokeOpacity={0.7}
      />
      <path
        d="M26 6 L6 26"
        stroke={color} strokeWidth={1.8} fill="none"
        strokeLinecap="round" strokeOpacity={0.7}
      />
      {/* Tâm sao */}
      <circle cx="16" cy="16" r="2.5" fill={color} />
    </DoodleSVG>
  );
}

/* ─────────────────────────────────────────────────────────────────
   GLINT — Tia lấp lánh nhỏ (3 cánh) dùng trang trí góc icon
   ───────────────────────────────────────────────────────────────── */
function Glint({ size = 20, color = '#fbbf24', className }: DoodleOrnamentProps) {
  return (
    <DoodleSVG size={size} viewBox="0 0 20 20" className={className}>
      <path d="M10 2 L10 18" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M2 10 L18 10" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M4 4 L16 16" stroke={color} strokeWidth={1.2} strokeLinecap="round" strokeOpacity={0.6} />
      <path d="M16 4 L4 16" stroke={color} strokeWidth={1.2} strokeLinecap="round" strokeOpacity={0.6} />
    </DoodleSVG>
  );
}

/* ─────────────────────────────────────────────────────────────────
   WAVY-UNDERLINE — Gạch chân lượn sóng màu vàng phấn
   ───────────────────────────────────────────────────────────────── */
function WavyUnderline({ color = '#fbbf24', className }: DoodleOrnamentProps) {
  return (
    <DoodleSVG width={80} height={10} viewBox="0 0 80 10" className={className}>
      <path
        d="M0 7 Q10 2 20 7 Q30 12 40 7 Q50 2 60 7 Q70 12 80 7"
        stroke={color} strokeWidth={2.5} fill="none"
        strokeLinecap="round"
      />
    </DoodleSVG>
  );
}

/* ─────────────────────────────────────────────────────────────────
   DOUBLE-UNDERLINE — Hai gạch chân màu mực đậm
   ───────────────────────────────────────────────────────────────── */
function DoubleUnderline({ color = INK, className }: DoodleOrnamentProps) {
  return (
    <DoodleSVG width={80} height={10} viewBox="0 0 80 10" className={className}>
      {/* Nét trên dày hơn */}
      <path
        d="M0 4 Q20 3 40 4 Q60 5 80 4"
        stroke={color} strokeWidth={2} fill="none"
        strokeLinecap="round"
      />
      {/* Nét dưới mỏng hơn */}
      <path
        d="M0 8 Q20 7 40 8 Q60 9 80 8"
        stroke={color} strokeWidth={1} fill="none"
        strokeLinecap="round" strokeOpacity={0.6}
      />
    </DoodleSVG>
  );
}

/* ─────────────────────────────────────────────────────────────────
   STAR-DUST — Bụi sao bay lơ lửng (5 điểm sáng ngẫu nhiên)
   ───────────────────────────────────────────────────────────────── */
function StarDust({ size = 48, color = '#fbbf24', className }: DoodleOrnamentProps) {
  // Vị trí cố định — intentionally not centered, tạo cảm giác tự nhiên
  const stars = [
    { cx: 8, cy: 10, r: 1.8 },
    { cx: 20, cy: 4, r: 2.5 },
    { cx: 36, cy: 14, r: 1.5 },
    { cx: 14, cy: 30, r: 2 },
    { cx: 42, cy: 36, r: 1.2 },
    { cx: 30, cy: 44, r: 1.8 },
  ];
  return (
    <DoodleSVG size={size} viewBox="0 0 48 48" className={className}>
      {stars.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={color} />
      ))}
      {/* Vài tia glint nhỏ */}
      <path d="M20 4 L20 1" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M17 4 L23 4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M8 10 L8 7" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <path d="M5 10 L11 10" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
    </DoodleSVG>
  );
}

/* ─────────────────────────────────────────────────────────────────
   BUBBLE-LAB — Bọt khí phòng lab bay lơ lửng (cartoon circles)
   ───────────────────────────────────────────────────────────────── */
function BubbleLab({ size = 48, color = '#38bdf8', className }: DoodleOrnamentProps) {
  return (
    <DoodleSVG size={size} viewBox="0 0 48 48" className={className}>
      <circle cx="10" cy="38" r="5" stroke={color} strokeWidth={2} fill="none" />
      <circle cx="24" cy="26" r="8" stroke={color} strokeWidth={2.5} fill="none" />
      <circle cx="38" cy="40" r="4" stroke={color} strokeWidth={1.8} fill="none" />
      <circle cx="18" cy="12" r="3" stroke={color} strokeWidth={1.5} fill="none" />
      <circle cx="40" cy="18" r="2" stroke={color} strokeWidth={1.2} fill="none" />
      {/* Phản quang bọt khí */}
      <path d="M21 22 Q22 20 24 21" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeOpacity={0.8} />
      <path d="M8 35 Q9 34 10 35" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" strokeOpacity={0.7} />
    </DoodleSVG>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN EXPORT — Dispatcher component
   ───────────────────────────────────────────────────────────────── */
const doodleMap: Record<DoodleOrnamentName, React.FC<DoodleOrnamentProps>> = {
  'arrow-curved': ArrowCurved,
  'arrow-bounce': ArrowBounce,
  'sparkle-star': SparkleStar,
  glint: Glint,
  'wavy-underline': WavyUnderline,
  'double-underline': DoubleUnderline,
  'star-dust': StarDust,
  'bubble-lab': BubbleLab,
};

export function DoodleOrnament({
  name,
  size,
  color,
  className,
}: DoodleOrnamentProps) {
  const Doodle = doodleMap[name];
  if (!Doodle) return null;
  return <Doodle name={name} size={size} color={color} className={className} />;
}
