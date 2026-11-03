import React from 'react';
import { assetUrl } from '@/lib/utils';
import type { SubjectId } from '@/content/subjects';

export interface SubjectTrophyProps {
  subject: SubjectId;
  size?: number;
  className?: string;
  animate?: boolean;
}

export const SubjectTrophy: React.FC<SubjectTrophyProps> = ({
  subject,
  size = 80,
  className = '',
  animate = true,
}) => {
  if (subject === 'bio') {
    return (
      <div
        className={`relative inline-flex items-center justify-center select-none ${
          animate ? 'animate-bounce' : ''
        } ${className}`}
        style={{
          width: size,
          height: size,
          animationDuration: '2.5s',
        }}
        title="Cúp Sinh học: Mầm cây & Chuỗi xoắn ADN Hoàng Kim"
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain overflow-visible"
        >
          <defs>
            {/* Vàng cúp hoàng kim */}
            <linearGradient id="bioGoldCup" x1="20" y1="25" x2="80" y2="75" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--gold-soft)" />
              <stop offset="25%" stopColor="var(--gold)" />
              <stop offset="65%" stopColor="var(--gold-shade)" />
              <stop offset="100%" stopColor="var(--ink)" />
            </linearGradient>

            {/* Viền quai cúp */}
            <linearGradient id="bioGoldHandle" x1="10" y1="30" x2="90" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--gold-soft)" />
              <stop offset="50%" stopColor="var(--gold)" />
              <stop offset="100%" stopColor="var(--gold-shade)" />
            </linearGradient>

            {/* Màu lá mầm xanh ngọc lục bảo tươi */}
            <linearGradient id="bioLeafGrad1" x1="30" y1="10" x2="55" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--bio-soft)" />
              <stop offset="40%" stopColor="var(--bio)" />
              <stop offset="100%" stopColor="var(--bio-shade)" />
            </linearGradient>

            <linearGradient id="bioLeafGrad2" x1="45" y1="10" x2="70" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--bio-soft)" />
              <stop offset="50%" stopColor="var(--bio)" />
              <stop offset="100%" stopColor="var(--bio-shade)" />
            </linearGradient>

            {/* Thân ADN vàng ngọc */}
            <linearGradient id="bioDnaGold" x1="40" y1="15" x2="60" y2="45" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--gold-soft)" />
              <stop offset="100%" stopColor="var(--gold-shade)" />
            </linearGradient>

            {/* Đế cúp cẩm thạch đen xanh */}
            <linearGradient id="bioBaseGrad" x1="30" y1="75" x2="70" y2="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--bg-elevated)" />
              <stop offset="50%" stopColor="var(--bg-canvas)" />
              <stop offset="100%" stopColor="var(--bio-shade)" />
            </linearGradient>

            {/* Hào quang ngọc lục bảo */}
            <radialGradient id="bioAura" cx="50" cy="35" r="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--bio)" stopOpacity="0.6" />
              <stop offset="70%" stopColor="var(--bio)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--bio)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Vầng hào quang nền sau mầm cây */}
          <circle cx="50" cy="32" r="28" fill="url(#bioAura)" />

          {/* Quai cúp bên trái */}
          <path
            d="M 32 36 C 14 36, 12 56, 32 60 L 32 54 C 20 52, 20 42, 32 42 Z"
            fill="url(#bioGoldHandle)"
            stroke="var(--gold-shade)"
            strokeWidth="1.5"
          />

          {/* Quai cúp bên phải */}
          <path
            d="M 68 36 C 86 36, 88 56, 68 60 L 68 54 C 80 52, 80 42, 68 42 Z"
            fill="url(#bioGoldHandle)"
            stroke="var(--gold-shade)"
            strokeWidth="1.5"
          />

          {/* Đế cúp - Chân đế cẩm thạch 3D */}
          <path
            d="M 32 86 L 68 86 L 72 94 L 28 94 Z"
            fill="url(#bioBaseGrad)"
            stroke="var(--bio-shade)"
            strokeWidth="1.5"
          />
          {/* Tấm biển vàng gắn trên đế */}
          <rect x="36" y="87" width="28" height="5" rx="1.5" fill="var(--gold)" stroke="var(--gold-shade)" strokeWidth="0.8" />
          <circle cx="43" cy="89.5" r="1" fill="var(--bio)" />
          <circle cx="50" cy="89.5" r="1" fill="var(--bio)" />
          <circle cx="57" cy="89.5" r="1" fill="var(--bio)" />

          {/* Trụ nối cúp với đế */}
          <path d="M 46 72 L 54 72 L 56 86 L 44 86 Z" fill="url(#bioGoldCup)" stroke="var(--gold-shade)" strokeWidth="1" />
          <ellipse cx="50" cy="72" rx="7" ry="2" fill="var(--gold-soft)" />

          {/* Thân cúp vàng */}
          <path
            d="M 30 35 C 30 58, 40 72, 50 72 C 60 72, 70 58, 70 35 Z"
            fill="url(#bioGoldCup)"
            stroke="var(--gold-shade)"
            strokeWidth="1.5"
          />
          {/* Miệng cúp vàng */}
          <ellipse cx="50" cy="35" rx="20" ry="5.5" fill="var(--gold)" stroke="var(--gold-shade)" strokeWidth="1.2" />
          <ellipse cx="50" cy="35" rx="17" ry="4" fill="var(--gold-shade)" />

          {/* Viên ngọc lục bảo khảm giữa thân cúp */}
          <path
            d="M 50 48 L 54 53 L 50 58 L 46 53 Z"
            fill="var(--bio)"
            stroke="var(--bio-soft)"
            strokeWidth="0.8"
          />

          {/* ─── Nổi lên từ cúp: MẦM CÂY & CHUỖI XOẮN ADN ─── */}
          {/* Thân cây / Trục xoắn kép vàng */}
          <path
            d="M 50 35 Q 48 24, 50 14"
            stroke="url(#bioDnaGold)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Cặp liên kết ADN dạng bậc thang phát sáng */}
          <line x1="46" y1="28" x2="54" y2="28" stroke="var(--bio)" strokeWidth="2" strokeLinecap="round" />
          <line x1="45" y1="22" x2="55" y2="22" stroke="var(--bio-soft)" strokeWidth="2" strokeLinecap="round" />
          <line x1="47" y1="17" x2="53" y2="17" stroke="var(--bio-soft)" strokeWidth="2" strokeLinecap="round" />

          {/* Lá mầm bên trái - vươn cong tươi tắn */}
          <path
            d="M 50 24 C 42 22, 32 15, 33 8 C 42 9, 48 18, 50 24 Z"
            fill="url(#bioLeafGrad1)"
            stroke="var(--bio-shade)"
            strokeWidth="1.2"
          />
          {/* Gân lá trái trắng sáng */}
          <path d="M 37 12 Q 43 17, 49 22" stroke="var(--bio-soft)" strokeWidth="1" strokeLinecap="round" opacity="0.8" />

          {/* Lá mầm bên phải - vươn cao đón nắng */}
          <path
            d="M 50 20 C 58 17, 68 10, 67 4 C 58 5, 52 14, 50 20 Z"
            fill="url(#bioLeafGrad2)"
            stroke="var(--bio-shade)"
            strokeWidth="1.2"
          />
          {/* Gân lá phải trắng sáng */}
          <path d="M 63 8 Q 57 14, 51 18" stroke="var(--bio-soft)" strokeWidth="1" strokeLinecap="round" opacity="0.8" />

          {/* Giọt sương / hạt lấp lánh trên chóp lá */}
          <circle cx="67" cy="4" r="2.2" fill="var(--bg-surface)" />
          <circle cx="33" cy="8" r="1.8" fill="var(--bg-surface)" />

          {/* Bào tử sinh học lấp lánh xung quanh */}
          <circle cx="28" cy="22" r="1.5" fill="var(--bio)" opacity="0.9" />
          <circle cx="73" cy="26" r="1.8" fill="var(--bio-soft)" opacity="0.9" />
          <path d="M 23 16 L 25 18 L 23 20 L 21 18 Z" fill="var(--gold)" />
          <path d="M 75 14 L 77 16 L 75 18 L 73 16 Z" fill="var(--gold)" />
        </svg>
      </div>
    );
  }

  if (subject === 'physics') {
    return (
      <div
        className={`relative inline-flex items-center justify-center select-none ${
          animate ? 'animate-bounce' : ''
        } ${className}`}
        style={{
          width: size,
          height: size,
          animationDuration: '2.5s',
        }}
        title="Cúp Vật lý: Lõi Năng lượng & Quỹ đạo Nguyên tử Hoàng Kim"
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain overflow-visible"
        >
          <defs>
            {/* Vàng cúp hoàng kim Vật lý */}
            <linearGradient id="phyGoldCup" x1="20" y1="25" x2="80" y2="75" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--gold-soft)" />
              <stop offset="25%" stopColor="var(--gold)" />
              <stop offset="65%" stopColor="var(--gold-shade)" />
              <stop offset="100%" stopColor="var(--ink)" />
            </linearGradient>

            <linearGradient id="phyGoldHandle" x1="10" y1="30" x2="90" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--gold-soft)" />
              <stop offset="50%" stopColor="var(--gold)" />
              <stop offset="100%" stopColor="var(--gold-shade)" />
            </linearGradient>

            {/* Lõi plasma hạt nhân năng lượng */}
            <radialGradient id="phyCorePlasma" cx="50" cy="24" r="10" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--bg-surface)" />
              <stop offset="35%" stopColor="var(--gold-soft)" />
              <stop offset="70%" stopColor="var(--gold)" />
              <stop offset="100%" stopColor="var(--err)" />
            </radialGradient>

            {/* Đế lượng tử titan */}
            <linearGradient id="phyBaseGrad" x1="30" y1="75" x2="70" y2="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--bg-elevated)" />
              <stop offset="50%" stopColor="var(--bg-canvas)" />
              <stop offset="100%" stopColor="var(--phy-shade)" />
            </linearGradient>

            {/* Hào quang điện trường */}
            <radialGradient id="phyAura" cx="50" cy="25" r="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--phy)" stopOpacity="0.6" />
              <stop offset="65%" stopColor="var(--gold)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Vầng hào quang nền sau nguyên tử */}
          <circle cx="50" cy="26" r="28" fill="url(#phyAura)" />

          {/* Quai cúp bên trái kiểu góc cạnh công nghệ */}
          <path
            d="M 32 36 L 16 36 L 16 52 L 32 58 L 32 52 L 22 48 L 22 42 L 32 42 Z"
            fill="url(#phyGoldHandle)"
            stroke="var(--gold-shade)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Quai cúp bên phải kiểu góc cạnh công nghệ */}
          <path
            d="M 68 36 L 84 36 L 84 52 L 68 58 L 68 52 L 78 48 L 78 42 L 68 42 Z"
            fill="url(#phyGoldHandle)"
            stroke="var(--gold-shade)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Đế cúp lượng tử 3D */}
          <path
            d="M 32 86 L 68 86 L 74 94 L 26 94 Z"
            fill="url(#phyBaseGrad)"
            stroke="var(--phy-shade)"
            strokeWidth="1.5"
          />
          {/* Tấm biển vàng khắc vạch năng lượng */}
          <rect x="36" y="87" width="28" height="5" rx="1.5" fill="var(--gold)" stroke="var(--gold-shade)" strokeWidth="0.8" />
          <line x1="41" y1="89.5" x2="59" y2="89.5" stroke="var(--phy)" strokeWidth="1.5" strokeLinecap="round" />

          {/* Trụ nối cúp với đế */}
          <path d="M 46 72 L 54 72 L 56 86 L 44 86 Z" fill="url(#phyGoldCup)" stroke="var(--gold-shade)" strokeWidth="1" />
          <ellipse cx="50" cy="72" rx="7" ry="2" fill="var(--gold-soft)" />

          {/* Thân cúp vàng */}
          <path
            d="M 30 35 C 30 58, 40 72, 50 72 C 60 72, 70 58, 70 35 Z"
            fill="url(#phyGoldCup)"
            stroke="var(--gold-shade)"
            strokeWidth="1.5"
          />
          {/* Miệng cúp vàng */}
          <ellipse cx="50" cy="35" rx="20" ry="5.5" fill="var(--gold-soft)" stroke="var(--gold-shade)" strokeWidth="1.2" />
          <ellipse cx="50" cy="35" rx="17" ry="4" fill="var(--gold-shade)" />

          {/* Biểu tượng tia sét khảm trên thân cúp */}
          <path
            d="M 52 46 L 46 54 L 49 54 L 47 62 L 55 52 L 51 52 Z"
            fill="var(--phy-soft)"
            stroke="var(--bg-surface)"
            strokeWidth="0.8"
          />

          {/* ─── Nổi lên từ cúp: MÔ HÌNH NGUYÊN TỬ & QUỸ ĐẠO ELECTRON ─── */}
          {/* Quỹ đạo electron 1 (Nghiêng -35 độ) */}
          <ellipse
            cx="50"
            cy="24"
            rx="24"
            ry="7.5"
            fill="none"
            stroke="var(--phy)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            transform="rotate(-35 50 24)"
            opacity="0.95"
          />
          {/* Hạt electron trên quỹ đạo 1 */}
          <circle cx="32" cy="12" r="2.8" fill="var(--phy)" stroke="var(--bg-surface)" strokeWidth="0.8" />

          {/* Quỹ đạo electron 2 (Nghiêng +35 độ) */}
          <ellipse
            cx="50"
            cy="24"
            rx="24"
            ry="7.5"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            transform="rotate(35 50 24)"
            opacity="0.95"
          />
          {/* Hạt electron trên quỹ đạo 2 */}
          <circle cx="68" cy="12" r="2.8" fill="var(--gold)" stroke="var(--bg-surface)" strokeWidth="0.8" />

          {/* Quỹ đạo electron 3 (Nằm ngang) */}
          <ellipse
            cx="50"
            cy="24"
            rx="22"
            ry="6"
            fill="none"
            stroke="var(--gems)"
            strokeWidth="1.2"
            opacity="0.8"
          />
          {/* Hạt electron trên quỹ đạo 3 */}
          <circle cx="71" cy="24" r="2.4" fill="var(--gems)" stroke="var(--bg-surface)" strokeWidth="0.6" />

          {/* Lõi nguyên tử plasma phát sáng rực rỡ */}
          <circle cx="50" cy="24" r="7.5" fill="url(#phyCorePlasma)" />
          <circle cx="48" cy="22" r="2.2" fill="var(--bg-surface)" opacity="0.9" />

          {/* Tia lửa điện / tia năng lượng xung quanh */}
          <path d="M 24 16 L 27 18 L 24 20 L 22 18 Z" fill="var(--phy)" />
          <path d="M 76 16 L 78 18 L 76 20 L 74 18 Z" fill="var(--gold)" />
          <circle cx="28" cy="30" r="1.5" fill="var(--gold)" />
          <circle cx="72" cy="30" r="1.5" fill="var(--phy)" />
        </svg>
      </div>
    );
  }

  // Mặc định: Hóa học (Bình chưng cất Alembic vàng cổ điển)
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${
        animate ? 'animate-bounce' : ''
      } ${className}`}
      style={{
        width: size,
        height: size,
        animationDuration: '2.5s',
      }}
      title="Cúp Hóa học: Bình Chưng Cất Hoàng Kim"
    >
      <img
        src={assetUrl('/assets/roadmap/trophy-gold.png')}
        alt="Cúp Hóa học Vàng"
        className="w-full h-full object-contain"
      />
    </div>
  );
};
