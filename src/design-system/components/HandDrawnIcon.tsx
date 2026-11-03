/**
 * HandDrawnIcon — Bộ icon SVG vẽ tay độc quyền nét viền mực dày 2.5px.
 * Tuân thủ Design Bible: Chunky Cartoon / Bold Line-Art, stroke var(--ink).
 * KHÔNG dùng icon Lucide hoặc emoji hệ thống tại các vị trí trọng tâm.
 */
import React from 'react';

export type HandDrawnIconName =
  | 'flask'
  | 'test-tube'
  | 'atom'
  | 'dna'
  | 'heart-flask'
  | 'ice-shield'
  | 'xp-potion'
  | 'treasure-chest'
  | 'microscope'
  | 'flame';

interface HandDrawnIconProps {
  name: HandDrawnIconName;
  size?: number;
  className?: string;
  /** Ghi đè màu nền dung dịch / tô màu chính bên trong icon */
  fillColor?: string;
}

const INK = 'var(--ink, #101a1f)';
const STROKE_W = 2.5;

/* ─────────────────────────────────────────────────────────────────
   Shared SVG wrapper — sets up viewBox, no overflow, aria-hidden
   ───────────────────────────────────────────────────────────────── */
function IconSVG({
  size,
  className,
  children,
  viewBox = '0 0 48 48',
}: {
  size: number;
  className?: string;
  children: React.ReactNode;
  viewBox?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
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
   FLASK — Bình Erlenmeyer với vạch chia và bọt khí
   ───────────────────────────────────────────────────────────────── */
function FlaskIcon({ size, className, fillColor = 'var(--chem, #2A6FDB)' }: HandDrawnIconProps & { size: number }) {
  return (
    <IconSVG size={size} className={className}>
      {/* Thân bình */}
      <path
        d="M18 8 L18 24 L10 38 Q8 42 12 43 L36 43 Q40 43 38 38 L30 24 L30 8 Z"
        fill={fillColor}
        fillOpacity={0.88}
        stroke={INK}
        strokeWidth={STROKE_W}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Cổ bình */}
      <rect x="15" y="5" width="18" height="5" rx="2.5"
        fill="var(--chem-soft, rgba(42, 111, 219, 0.18))" stroke={INK} strokeWidth={STROKE_W} />
      {/* Vạch chia mức dung dịch */}
      <line x1="14" y1="34" x2="19" y2="34" stroke={INK} strokeWidth={1.5} strokeLinecap="round" />
      <line x1="12" y1="38" x2="17" y2="38" stroke={INK} strokeWidth={1.5} strokeLinecap="round" />
      {/* Bọt khí */}
      <circle cx="23" cy="35" r="2" fill="#ffffff" fillOpacity={0.75} stroke={INK} strokeWidth={1.2} />
      <circle cx="29" cy="31" r="1.3" fill="#ffffff" fillOpacity={0.65} stroke={INK} strokeWidth={1} />
      {/* Phản quang thủy tinh */}
      <line x1="21" y1="14" x2="21" y2="22" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeOpacity={0.7} />
    </IconSVG>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TEST-TUBE — Ống nghiệm nghiêng có giọt dung dịch rơi
   ───────────────────────────────────────────────────────────────── */
function TestTubeIcon({ size, className, fillColor = 'var(--bio, #0A8272)' }: HandDrawnIconProps & { size: number }) {
  return (
    <IconSVG size={size} className={className}>
      {/* Thân ống nghiệm nghiêng */}
      <path
        d="M14 8 L34 28 Q38 34 34 38 Q30 42 24 38 L4 18 Z"
        fill={fillColor}
        fillOpacity={0.88}
        stroke={INK}
        strokeWidth={STROKE_W}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Nắp ống */}
      <rect
        x="22" y="4" width="10" height="6" rx="2"
        transform="rotate(45 27 7)"
        fill="var(--bio-soft, rgba(10, 130, 114, 0.18))"
        stroke={INK}
        strokeWidth={STROKE_W}
      />
      {/* Giọt dung dịch rơi */}
      <ellipse cx="39" cy="38" rx="3" ry="4.5"
        fill={fillColor} stroke={INK} strokeWidth={1.5} />
      <path d="M39 34 Q40 36 39 38" stroke="#ffffff" strokeWidth={1.2} strokeLinecap="round" strokeOpacity={0.7} />
      {/* Phản quang */}
      <line x1="10" y1="14" x2="20" y2="24" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeOpacity={0.6} />
    </IconSVG>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ATOM — Mô hình nguyên tử Bo cartoon chunky
   ───────────────────────────────────────────────────────────────── */
function AtomIcon({ size, className, fillColor = 'var(--phy, #6B4DE0)' }: HandDrawnIconProps & { size: number }) {
  return (
    <IconSVG size={size} className={className}>
      {/* Quỹ đạo ellipse 1 */}
      <ellipse cx="24" cy="24" rx="20" ry="8"
        stroke={INK} strokeWidth={STROKE_W} fill="none" />
      {/* Quỹ đạo ellipse 2 — xoay 60° */}
      <ellipse cx="24" cy="24" rx="20" ry="8"
        stroke={INK} strokeWidth={STROKE_W} fill="none"
        transform="rotate(60 24 24)" />
      {/* Quỹ đạo ellipse 3 — xoay 120° */}
      <ellipse cx="24" cy="24" rx="20" ry="8"
        stroke={INK} strokeWidth={STROKE_W} fill="none"
        transform="rotate(120 24 24)" />
      {/* Hạt nhân */}
      <circle cx="24" cy="24" r="5"
        fill={fillColor} stroke={INK} strokeWidth={STROKE_W} />
      {/* Electron */}
      <circle cx="44" cy="24" r="2.5"
        fill="var(--gold, #F2B705)" stroke={INK} strokeWidth={1.5} />
      <circle cx="14" cy="10" r="2.5"
        fill="var(--gold, #F2B705)" stroke={INK} strokeWidth={1.5} />
      <circle cx="14" cy="38" r="2.5"
        fill="var(--gold, #F2B705)" stroke={INK} strokeWidth={1.5} />
    </IconSVG>
  );
}

/* ─────────────────────────────────────────────────────────────────
   DNA — Chuỗi xoắn kép cartoon chunky lines
   ───────────────────────────────────────────────────────────────── */
function DnaIcon({ size, className, fillColor = 'var(--bio, #0A8272)' }: HandDrawnIconProps & { size: number }) {
  return (
    <IconSVG size={size} className={className}>
      {/* Sợi xoắn trái */}
      <path
        d="M16 4 Q26 12 16 20 Q6 28 16 36 Q26 44 16 44"
        stroke={INK} strokeWidth={STROKE_W + 0.5} fill="none" strokeLinecap="round"
      />
      {/* Sợi xoắn phải */}
      <path
        d="M32 4 Q22 12 32 20 Q42 28 32 36 Q22 44 32 44"
        stroke={INK} strokeWidth={STROKE_W + 0.5} fill="none" strokeLinecap="round"
      />
      {/* Cầu nối bazơ */}
      <line x1="16" y1="10" x2="32" y2="10" stroke={fillColor} strokeWidth={2.5} strokeLinecap="round" />
      <line x1="16" y1="18" x2="32" y2="18" stroke="var(--gems, #CC3A78)" strokeWidth={2.5} strokeLinecap="round" />
      <line x1="16" y1="26" x2="32" y2="26" stroke="var(--bio, #0A8272)" strokeWidth={2.5} strokeLinecap="round" />
      <line x1="16" y1="34" x2="32" y2="34" stroke="var(--gold, #F2B705)" strokeWidth={2.5} strokeLinecap="round" />
      <line x1="16" y1="42" x2="32" y2="42" stroke={fillColor} strokeWidth={2.5} strokeLinecap="round" />
    </IconSVG>
  );
}

/* ─────────────────────────────────────────────────────────────────
   HEART-FLASK — Bình tim năng lượng dạng thủy tinh
   ───────────────────────────────────────────────────────────────── */
function HeartFlaskIcon({ size, className, fillColor = 'var(--err, #D23636)' }: HandDrawnIconProps & { size: number }) {
  return (
    <IconSVG size={size} className={className}>
      {/* Thân tim */}
      <path
        d="M24 40 C24 40 6 27 6 17 C6 11 11 6 17 8 C20 9 22 11 24 14 C26 11 28 9 31 8 C37 6 42 11 42 17 C42 27 24 40 24 40 Z"
        fill={fillColor}
        fillOpacity={0.92}
        stroke={INK}
        strokeWidth={STROKE_W}
        strokeLinejoin="round"
      />
      {/* Bóng đổ đáy tim / Liquid shadow */}
      <path
        d="M10 25 Q14 22 18 25 Q22 28 26 25 Q30 22 34 25 Q38 28 40 27 C39 31 36 35 30 39 L24 40 C18 37 14 33 10 28 Z"
        fill="rgba(0, 0, 0, 0.15)"
      />
      {/* Phản quang */}
      <path d="M12 15 Q14 11 18 12" stroke="#ffffff" strokeWidth={2.2} strokeLinecap="round" strokeOpacity={0.8} />
      {/* Bọt khí */}
      <circle cx="20" cy="28" r="2" fill="#ffffff" fillOpacity={0.65} stroke={INK} strokeWidth={1} />
      <circle cx="28" cy="24" r="1.3" fill="#ffffff" fillOpacity={0.55} stroke={INK} strokeWidth={0.8} />
    </IconSVG>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ICE-SHIELD — Khiên băng pha lê có bông tuyết vẽ tay
   ───────────────────────────────────────────────────────────────── */
function IceShieldIcon({ size, className, fillColor = 'var(--chem, #2A6FDB)' }: HandDrawnIconProps & { size: number }) {
  return (
    <IconSVG size={size} className={className}>
      {/* Thân khiên */}
      <path
        d="M24 4 L42 12 L42 26 Q42 38 24 45 Q6 38 6 26 L6 12 Z"
        fill={fillColor}
        fillOpacity={0.85}
        stroke={INK}
        strokeWidth={STROKE_W}
        strokeLinejoin="round"
      />
      {/* Lớp băng phủ */}
      <path
        d="M24 8 L38 14 L38 26 Q38 35 24 41 Q10 35 10 26 L10 14 Z"
        fill="rgba(255, 255, 255, 0.3)"
      />
      {/* Bông tuyết trung tâm (trắng tuyết phản quang nổi bật) */}
      <line x1="24" y1="16" x2="24" y2="34" stroke="#ffffff" strokeWidth={2.2} strokeLinecap="round" />
      <line x1="15" y1="21" x2="33" y2="29" stroke="#ffffff" strokeWidth={2.2} strokeLinecap="round" />
      <line x1="15" y1="29" x2="33" y2="21" stroke="#ffffff" strokeWidth={2.2} strokeLinecap="round" />
      {/* Nhánh nhỏ bông tuyết */}
      <line x1="24" y1="16" x2="21" y2="13" stroke="#ffffff" strokeWidth={1.5} strokeLinecap="round" />
      <line x1="24" y1="16" x2="27" y2="13" stroke="#ffffff" strokeWidth={1.5} strokeLinecap="round" />
      <line x1="24" y1="34" x2="21" y2="37" stroke="#ffffff" strokeWidth={1.5} strokeLinecap="round" />
      <line x1="24" y1="34" x2="27" y2="37" stroke="#ffffff" strokeWidth={1.5} strokeLinecap="round" />
    </IconSVG>
  );
}

/* ─────────────────────────────────────────────────────────────────
   XP-POTION — Bình thuốc phát sáng có nút bần gỗ
   ───────────────────────────────────────────────────────────────── */
function XpPotionIcon({ size, className, fillColor = 'var(--gold, #F2B705)' }: HandDrawnIconProps & { size: number }) {
  return (
    <IconSVG size={size} className={className}>
      {/* Thân bình tròn */}
      <circle cx="24" cy="30" r="15"
        fill={fillColor} fillOpacity={0.95} stroke={INK} strokeWidth={STROKE_W} />
      {/* Tia sáng phát ra */}
      <line x1="24" y1="10" x2="24" y2="6" stroke={fillColor} strokeWidth={2.5} strokeLinecap="round" />
      <line x1="35" y1="14" x2="38" y2="11" stroke={fillColor} strokeWidth={2.5} strokeLinecap="round" />
      <line x1="13" y1="14" x2="10" y2="11" stroke={fillColor} strokeWidth={2.5} strokeLinecap="round" />
      {/* Cổ bình */}
      <rect x="19" y="14" width="10" height="6" rx="2"
        fill="var(--gold-soft, rgba(242, 183, 5, 0.2))" stroke={INK} strokeWidth={STROKE_W} />
      {/* Nút bần gỗ */}
      <rect x="18" y="11" width="12" height="5" rx="2.5"
        fill="var(--gold-shade, #B88A00)" stroke={INK} strokeWidth={STROKE_W} />
      {/* Chữ XP trong bình */}
      <text x="24" y="35" textAnchor="middle" fontSize="10" fontWeight="900"
        fill="var(--on-ink, #1A1205)" fontFamily="system-ui, sans-serif">XP</text>
      {/* Phản quang */}
      <path d="M14 24 Q15 20 19 22" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeOpacity={0.75} />
      {/* Bọt khí */}
      <circle cx="30" cy="28" r="2" fill="#ffffff" fillOpacity={0.6} stroke={INK} strokeWidth={0.8} />
    </IconSVG>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TREASURE-CHEST — Rương kho báu mở nắp có tia sáng
   ───────────────────────────────────────────────────────────────── */
function TreasureChestIcon({ size, className, fillColor = 'var(--gold, #F2B705)' }: HandDrawnIconProps & { size: number }) {
  return (
    <IconSVG size={size} className={className}>
      {/* Nắp rương mở */}
      <path
        d="M6 22 L6 12 Q6 8 10 8 L38 8 Q42 8 42 12 L42 22 Q36 16 24 16 Q12 16 6 22 Z"
        fill="var(--gold-shade, #B88A00)"
        stroke={INK}
        strokeWidth={STROKE_W}
        strokeLinejoin="round"
      />
      {/* Viền kim loại nắp */}
      <rect x="6" y="17" width="36" height="5" rx="1"
        fill={fillColor} stroke={INK} strokeWidth={1.5} />
      {/* Thân rương */}
      <rect x="6" y="22" width="36" height="20" rx="3"
        fill="var(--gold-shade, #B88A00)" stroke={INK} strokeWidth={STROKE_W} />
      {/* Viền kim loại thân */}
      <rect x="6" y="28" width="36" height="4" rx="0"
        fill={fillColor} stroke={INK} strokeWidth={1.2} />
      {/* Khóa rương */}
      <rect x="20" y="24" width="8" height="6" rx="2"
        fill={fillColor} stroke={INK} strokeWidth={1.5} />
      <circle cx="24" cy="27" r="1.5" fill={INK} />
      {/* Tia sáng bên trên */}
      <line x1="24" y1="6" x2="24" y2="2" stroke={fillColor} strokeWidth={2.5} strokeLinecap="round" />
      <line x1="32" y1="9" x2="35" y2="6" stroke={fillColor} strokeWidth={2} strokeLinecap="round" />
      <line x1="16" y1="9" x2="13" y2="6" stroke={fillColor} strokeWidth={2} strokeLinecap="round" />
      <line x1="28" y1="5" x2="30" y2="2" stroke={fillColor} strokeWidth={1.5} strokeLinecap="round" />
      <line x1="20" y1="5" x2="18" y2="2" stroke={fillColor} strokeWidth={1.5} strokeLinecap="round" />
    </IconSVG>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MICROSCOPE — Kính hiển vi quang học cách điệu
   ───────────────────────────────────────────────────────────────── */
function MicroscopeIcon({ size, className, fillColor = 'var(--chem, #2A6FDB)' }: HandDrawnIconProps & { size: number }) {
  return (
    <IconSVG size={size} className={className}>
      {/* Đế kính hiển vi */}
      <path d="M8 42 L40 42 Q42 42 42 40 L42 38 Q42 36 40 36 L8 36 Q6 36 6 38 L6 40 Q6 42 8 42 Z"
        fill="var(--border)" stroke={INK} strokeWidth={STROKE_W} strokeLinejoin="round" />
      {/* Thân kính */}
      <rect x="20" y="18" width="10" height="18" rx="2"
        fill="var(--ink-muted, #4A5B68)" stroke={INK} strokeWidth={STROKE_W} />
      {/* Tay cầm */}
      <path d="M30 24 Q38 22 36 36 L30 36"
        fill="var(--ink-muted, #4A5B68)" stroke={INK} strokeWidth={STROKE_W} strokeLinejoin="round" strokeLinecap="round" />
      {/* Đầu thị kính */}
      <rect x="19" y="13" width="12" height="7" rx="3"
        fill="var(--ink-secondary, #2C3E4C)" stroke={INK} strokeWidth={STROKE_W} />
      {/* Mắt thị kính */}
      <ellipse cx="25" cy="10" rx="5" ry="4"
        fill={fillColor} stroke={INK} strokeWidth={STROKE_W} />
      <circle cx="25" cy="10" r="2"
        fill="#ffffff" fillOpacity={0.7} />
      {/* Lam kính */}
      <rect x="6" y="33" width="20" height="3" rx="1"
        fill="var(--chem-soft, rgba(42, 111, 219, 0.18))" stroke={INK} strokeWidth={1.2} />
      {/* Ánh sáng */}
      <path d="M25 14 Q25 20 25 24" stroke={fillColor} strokeWidth={1.5}
        strokeLinecap="round" strokeOpacity={0.6} strokeDasharray="1.5 2" />
    </IconSVG>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FLAME — Ngọn lửa đèn cồn streak 3 lớp màu
   ───────────────────────────────────────────────────────────────── */
function FlameIcon({ size, className, fillColor = 'var(--warn, #E8710A)' }: HandDrawnIconProps & { size: number }) {
  return (
    <IconSVG size={size} className={className}>
      {/* Thân đèn cồn */}
      <rect x="14" y="36" width="20" height="8" rx="3"
        fill="var(--border)" stroke={INK} strokeWidth={STROKE_W} />
      {/* Bấc đèn */}
      <rect x="22" y="30" width="4" height="8" rx="1"
        fill="var(--warn-soft, rgba(232, 113, 10, 0.18))" stroke={INK} strokeWidth={1.5} />
      {/* Lớp ngọn lửa ngoài cùng (cam đỏ) */}
      <path
        d="M24 6 C20 10 14 16 14 24 C14 32 18 36 24 36 C30 36 34 32 34 24 C34 16 28 10 24 6 Z"
        fill="var(--err, #D23636)"
        stroke={INK}
        strokeWidth={STROKE_W}
        strokeLinejoin="round"
      />
      {/* Lớp ngọn lửa giữa (cam vàng) */}
      <path
        d="M24 10 C21 14 17 19 17 25 C17 30 20 34 24 34 C28 34 31 30 31 25 C31 19 27 14 24 10 Z"
        fill={fillColor}
      />
      {/* Lõi ngọn lửa sáng nhất (vàng trắng) */}
      <path
        d="M24 16 C22 19 20 23 20 27 C20 30 22 32 24 32 C26 32 28 30 28 27 C28 23 26 19 24 16 Z"
        fill="var(--gold-soft, #FEF08A)"
      />
    </IconSVG>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN EXPORT — Dispatcher component
   ───────────────────────────────────────────────────────────────── */
const iconMap: Record<
  HandDrawnIconName,
  React.FC<HandDrawnIconProps & { size: number }>
> = {
  flask: FlaskIcon,
  'test-tube': TestTubeIcon,
  atom: AtomIcon,
  dna: DnaIcon,
  'heart-flask': HeartFlaskIcon,
  'ice-shield': IceShieldIcon,
  'xp-potion': XpPotionIcon,
  'treasure-chest': TreasureChestIcon,
  microscope: MicroscopeIcon,
  flame: FlameIcon,
};

export function HandDrawnIcon({
  name,
  size = 48,
  className,
  fillColor,
}: HandDrawnIconProps) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon name={name} size={size} className={className} fillColor={fillColor} />;
}
