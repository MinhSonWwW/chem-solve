import React from 'react';

export type MinigameId =
  | 'blood-transfusion'
  | 'equation-balance'
  | 'formula-builder'
  | 'reaction-builder'
  | 'match'
  | 'sort'
  | 'speed'
  | 'true-false'
  | 'review';

export interface MinigameIllustrationProps extends React.SVGProps<SVGSVGElement> {
  id: MinigameId | string;
  size?: number;
  className?: string;
}

export const MinigameIllustration: React.FC<MinigameIllustrationProps> = ({
  id,
  size = 56,
  className = '',
  ...props
}) => {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 64 64',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className: `select-none shrink-0 ${className}`,
    'aria-hidden': true,
    ...props,
  };

  switch (id) {
    /* ─── Cấp cứu ABO: Túi máu truyền dịch + kim tiêm chibi ─── */
    case 'blood-transfusion':
      return (
        <svg {...common}>
          {/* Quai treo túi máu */}
          <path d="M 28 8 L 36 8 L 34 14 L 30 14 Z" fill="#94a3b8" stroke="#0f172a" strokeWidth={2} strokeLinejoin="round" />
          <circle cx="32" cy="7" r="2.5" fill="#f8fafc" stroke="#0f172a" strokeWidth={1.5} />
          {/* Thân túi máu */}
          <rect x="20" y="14" width="24" height="34" rx="6" fill="#ef4444" stroke="#0f172a" strokeWidth={2.5} />
          {/* Mức dung dịch máu sẫm đáy */}
          <path d="M 21 34 Q 32 36, 43 34 L 43 42 Q 43 47, 38 47 L 26 47 Q 21 47, 21 42 Z" fill="#b91c1c" />
          {/* Vạch chia thể tích túi */}
          <line x1="24" y1="24" x2="28" y2="24" stroke="#fecaca" strokeWidth={1.5} strokeLinecap="round" />
          <line x1="24" y1="29" x2="30" y2="29" stroke="#fecaca" strokeWidth={1.5} strokeLinecap="round" />
          <line x1="24" y1="34" x2="28" y2="34" stroke="#fecaca" strokeWidth={1.5} strokeLinecap="round" />
          {/* Nhãn chữ thập đỏ trên túi */}
          <circle cx="35" cy="24" r="5" fill="#ffffff" stroke="#0f172a" strokeWidth={1.5} />
          <path d="M 35 21 L 35 27 M 32 24 L 38 24" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" />
          {/* Dây truyền dịch cong xuống */}
          <path d="M 32 48 C 32 54, 40 52, 40 58 L 48 58" fill="none" stroke="#fca5a5" strokeWidth={2} strokeLinecap="round" />
          {/* Kim tiêm chibi bên cạnh */}
          <rect x="46" y="28" width="6" height="14" rx="2" fill="#38bdf8" stroke="#0f172a" strokeWidth={1.5} transform="rotate(25 46 28)" />
          <line x1="53" y1="26" x2="57" y2="22" stroke="#e2e8f0" strokeWidth={1.5} strokeLinecap="round" />
          {/* Giọt máu rơi */}
          <circle cx="32" cy="56" r="2.5" fill="#ef4444" stroke="#0f172a" strokeWidth={1} />
        </svg>
      );

    /* ─── Cân bằng PTHH: Cân tiểu ly hai đĩa bập bênh ─── */
    case 'equation-balance':
      return (
        <svg {...common}>
          {/* Đế cân 3D */}
          <rect x="18" y="52" width="28" height="6" rx="2" fill="#334155" stroke="#0f172a" strokeWidth={2} />
          <rect x="22" y="50" width="20" height="3" fill="#64748b" stroke="#0f172a" strokeWidth={1.5} />
          {/* Trụ đứng cân */}
          <line x1="32" y1="16" x2="32" y2="50" stroke="#0f172a" strokeWidth={3.5} strokeLinecap="round" />
          <circle cx="32" cy="16" r="3.5" fill="#f59e0b" stroke="#0f172a" strokeWidth={2} />
          {/* Thanh đòn nghiêng nhẹ (bập bênh) */}
          <line x1="12" y1="20" x2="52" y2="24" stroke="#0f172a" strokeWidth={3} strokeLinecap="round" />
          {/* Dây treo đĩa trái (nâng lên) */}
          <line x1="14" y1="20" x2="8" y2="34" stroke="#94a3b8" strokeWidth={1.5} />
          <line x1="14" y1="20" x2="20" y2="34" stroke="#94a3b8" strokeWidth={1.5} />
          {/* Đĩa trái */}
          <path d="M 6 34 Q 14 40, 22 34 Z" fill="#10b981" stroke="#0f172a" strokeWidth={2} />
          {/* Hạt phân tử trên đĩa trái */}
          <circle cx="11" cy="31" r="2.5" fill="#38bdf8" stroke="#0f172a" strokeWidth={1} />
          <circle cx="17" cy="31" r="2.5" fill="#38bdf8" stroke="#0f172a" strokeWidth={1} />

          {/* Dây treo đĩa phải (hạ xuống) */}
          <line x1="50" y1="24" x2="44" y2="38" stroke="#94a3b8" strokeWidth={1.5} />
          <line x1="50" y1="24" x2="56" y2="38" stroke="#94a3b8" strokeWidth={1.5} />
          {/* Đĩa phải */}
          <path d="M 42 38 Q 50 44, 58 38 Z" fill="#f59e0b" stroke="#0f172a" strokeWidth={2} />
          {/* Hạt phân tử trên đĩa phải */}
          <circle cx="50" cy="35" r="3" fill="#ef4444" stroke="#0f172a" strokeWidth={1} />
        </svg>
      );

    /* ─── Ghép công thức: Khối xếp hình nguyên tử nam châm hút nhau ─── */
    case 'formula-builder':
      return (
        <svg {...common}>
          {/* Khối Cation Na+ (Xanh Cyan) */}
          <g transform="translate(6, 16)">
            <rect x="0" y="0" width="22" height="26" rx="4" fill="#0ea5e9" stroke="#0f172a" strokeWidth={2.5} />
            {/* Mấu lồi khớp nối puzzle */}
            <path d="M 22 8 Q 28 13, 22 18 Z" fill="#0ea5e9" stroke="#0f172a" strokeWidth={2} />
            <text x="10" y="17" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
              Na⁺
            </text>
            <circle cx="5" cy="5" r="1.5" fill="#bae6fd" />
          </g>

          {/* Khối Anion Cl- (Đỏ Hồng) */}
          <g transform="translate(34, 16)">
            <rect x="0" y="0" width="22" height="26" rx="4" fill="#f43f5e" stroke="#0f172a" strokeWidth={2.5} />
            {/* Lỗ lõm khớp nối puzzle */}
            <path d="M 0 8 Q 6 13, 0 18 Z" fill="#18272f" stroke="#0f172a" strokeWidth={2} />
            <text x="12" y="17" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
              Cl⁻
            </text>
            <circle cx="17" cy="5" r="1.5" fill="#fecdd3" />
          </g>

          {/* Tia lực hút nam châm giữa hai khối */}
          <path d="M 27 18 L 33 18 M 26 25 L 34 25 M 27 32 L 33 32" stroke="#fbbf24" strokeWidth={2} strokeLinecap="round" />
          {/* Tia sáng glint phía trên */}
          <path d="M 30 7 L 30 13 M 27 10 L 33 10" stroke="#facc15" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      );

    /* ─── Phân loại chất: 4 chiếc bình tam giác màu sắc khác nhau ─── */
    case 'sort':
      return (
        <svg {...common}>
          {/* Kệ đỡ gỗ phòng lab */}
          <rect x="4" y="50" width="56" height="5" rx="2" fill="#78350f" stroke="#0f172a" strokeWidth={2} />
          {/* Bình 1: Acid (Đỏ) */}
          <g transform="translate(6, 18)">
            <path d="M 6 0 L 8 0 L 8 8 L 13 26 Q 14 30, 7 30 L 1 30 Q -6 30, 1 26 L 6 8 Z" fill="#ef4444" stroke="#0f172a" strokeWidth={2} strokeLinejoin="round" />
            <circle cx="7" cy="22" r="1.2" fill="#ffffff" />
          </g>
          {/* Bình 2: Base (Xanh lam) */}
          <g transform="translate(19, 14)">
            <path d="M 7 0 L 9 0 L 9 9 L 15 30 Q 16 34, 8 34 L 1 34 Q -7 34, 1 30 L 7 9 Z" fill="#0284c7" stroke="#0f172a" strokeWidth={2} strokeLinejoin="round" />
            <circle cx="8" cy="24" r="1.5" fill="#ffffff" />
          </g>
          {/* Bình 3: Oxide (Tím) */}
          <g transform="translate(33, 16)">
            <path d="M 6 0 L 8 0 L 8 8 L 14 28 Q 15 32, 7 32 L 1 32 Q -7 32, 1 28 L 6 8 Z" fill="#a855f7" stroke="#0f172a" strokeWidth={2} strokeLinejoin="round" />
            <circle cx="7" cy="23" r="1.2" fill="#ffffff" />
          </g>
          {/* Bình 4: Muối (Vàng hổ phách) */}
          <g transform="translate(46, 20)">
            <path d="M 6 0 L 8 0 L 8 7 L 13 24 Q 14 28, 7 28 L 1 28 Q -6 28, 1 24 L 6 7 Z" fill="#f59e0b" stroke="#0f172a" strokeWidth={2} strokeLinejoin="round" />
            <circle cx="7" cy="20" r="1.2" fill="#ffffff" />
          </g>
        </svg>
      );

    /* ─── Đố vui tốc độ: Đồng hồ bấm giờ kim giật + ngọn lửa ─── */
    case 'speed':
      return (
        <svg {...common}>
          {/* Ngọn lửa năng lượng phía sau đồng hồ */}
          <path
            d="M 32 4 C 44 14, 54 26, 48 42 C 44 52, 28 60, 18 50 C 10 42, 18 28, 22 20 C 24 16, 28 8, 32 4 Z"
            fill="#f97316"
            opacity={0.4}
          />
          {/* Thân đồng hồ bấm giờ */}
          <circle cx="32" cy="34" r="22" fill="#1e293b" stroke="#0f172a" strokeWidth={2.5} />
          {/* Vành bezel kim loại */}
          <circle cx="32" cy="34" r="18" fill="#f8fafc" stroke="#0f172a" strokeWidth={2} />
          {/* Núm bấm phía trên */}
          <rect x="29" y="5" width="6" height="5" rx="1.5" fill="#f59e0b" stroke="#0f172a" strokeWidth={1.5} />
          <path d="M 27 10 L 37 10" stroke="#0f172a" strokeWidth={2} strokeLinecap="round" />
          {/* Các vạch số 12, 3, 6, 9 */}
          <line x1="32" y1="18" x2="32" y2="21" stroke="#64748b" strokeWidth={2} strokeLinecap="round" />
          <line x1="45" y1="34" x2="48" y2="34" stroke="#64748b" strokeWidth={2} strokeLinecap="round" />
          <line x1="32" y1="47" x2="32" y2="50" stroke="#64748b" strokeWidth={2} strokeLinecap="round" />
          <line x1="16" y1="34" x2="19" y2="34" stroke="#64748b" strokeWidth={2} strokeLinecap="round" />
          {/* Kim giây màu đỏ chỉ 2 giờ */}
          <line x1="32" y1="34" x2="41" y2="25" stroke="#ef4444" strokeWidth={2.5} strokeLinecap="round" />
          <circle cx="32" cy="34" r="3" fill="#0f172a" />
          {/* Tia sét tốc độ nhỏ */}
          <path d="M 48 10 L 44 18 L 48 18 L 44 26" fill="none" stroke="#fbbf24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    /* ─── Hộp Leitner: Chồng thẻ bài flashcard 5 ngăn xếp lớp 3D ─── */
    case 'review':
      return (
        <svg {...common}>
          {/* Hộp gỗ 3D nhìn xéo */}
          <path d="M 10 24 L 54 24 L 46 54 L 4 54 Z" fill="#334155" stroke="#0f172a" strokeWidth={2.5} strokeLinejoin="round" />
          {/* 5 vách ngăn thẻ bài với màu sắc cấp độ */}
          {/* Ngăn 1: Đỏ */}
          <path d="M 12 18 L 22 18 L 20 32 L 10 32 Z" fill="#ef4444" stroke="#0f172a" strokeWidth={1.5} />
          {/* Ngăn 2: Cam */}
          <path d="M 19 15 L 29 15 L 27 32 L 17 32 Z" fill="#f97316" stroke="#0f172a" strokeWidth={1.5} />
          {/* Ngăn 3: Vàng */}
          <path d="M 26 12 L 36 12 L 34 32 L 24 32 Z" fill="#facc15" stroke="#0f172a" strokeWidth={1.5} />
          {/* Ngăn 4: Xanh lá */}
          <path d="M 33 9 L 43 9 L 41 32 L 31 32 Z" fill="#22c55e" stroke="#0f172a" strokeWidth={1.5} />
          {/* Ngăn 5: Xanh cyan (Làm chủ) */}
          <path d="M 40 6 L 50 6 L 48 32 L 38 32 Z" fill="#06b6d4" stroke="#0f172a" strokeWidth={1.5} />
          {/* Mặt trước hộp có nhãn Leitner */}
          <rect x="12" y="34" width="34" height="14" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth={1.5} />
          {/* 5 vạch sao nhỏ trên nhãn */}
          <circle cx="18" cy="41" r="2" fill="#ef4444" />
          <circle cx="23" cy="41" r="2" fill="#f97316" />
          <circle cx="28" cy="41" r="2" fill="#facc15" />
          <circle cx="33" cy="41" r="2" fill="#22c55e" />
          <circle cx="38" cy="41" r="2" fill="#06b6d4" />
          {/* Ngôi sao tri thức bay ra */}
          <path d="M 52 14 L 54 18 L 58 19 L 55 22 L 56 26 L 52 24 L 48 26 L 49 22 L 46 19 L 50 18 Z" fill="#fbbf24" stroke="#0f172a" strokeWidth={1} />
        </svg>
      );

    /* ─── Ghép chuỗi phản ứng: Chuỗi 3 bình hóa học nối ống dẫn ─── */
    case 'reaction-builder':
      return (
        <svg {...common}>
          {/* Ống dẫn cong nối giữa các bình */}
          <path d="M 18 28 C 18 16, 32 16, 32 28 C 32 16, 46 16, 46 28" fill="none" stroke="#94a3b8" strokeWidth={3} strokeLinecap="round" />
          {/* Bình 1 (Chất đầu - Vàng) */}
          <rect x="8" y="28" width="16" height="22" rx="4" fill="#f59e0b" stroke="#0f172a" strokeWidth={2} />
          <rect x="11" y="24" width="10" height="4" rx="1" fill="#78350f" stroke="#0f172a" strokeWidth={1.5} />
          {/* Mũi tên biến hóa 1 */}
          <path d="M 23 38 L 27 38 M 25 35 L 28 38 L 25 41" stroke="#38bdf8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          {/* Bình 2 (Trung gian - Tím) */}
          <rect x="24" y="28" width="16" height="22" rx="4" fill="#8b5cf6" stroke="#0f172a" strokeWidth={2} />
          {/* Mũi tên biến hóa 2 */}
          <path d="M 39 38 L 43 38 M 41 35 L 44 38 L 41 41" stroke="#38bdf8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          {/* Bình 3 (Sản phẩm - Xanh ngọc) */}
          <rect x="40" y="28" width="16" height="22" rx="4" fill="#10b981" stroke="#0f172a" strokeWidth={2} />
          <rect x="43" y="24" width="10" height="4" rx="1" fill="#064e3b" stroke="#0f172a" strokeWidth={1.5} />
          {/* Bọt khí phản ứng */}
          <circle cx="16" cy="38" r="1.5" fill="#fef3c7" />
          <circle cx="32" cy="36" r="1.5" fill="#ede9fe" />
          <circle cx="48" cy="38" r="1.5" fill="#d1fae5" />
        </svg>
      );

    /* ─── Nối thẻ chất / Hiện tượng: 2 tấm thẻ bài liên kết ─── */
    case 'match':
      return (
        <svg {...common}>
          {/* Thẻ bên trái (A) */}
          <rect x="6" y="16" width="22" height="32" rx="4" fill="#6366f1" stroke="#0f172a" strokeWidth={2} />
          <rect x="9" y="20" width="16" height="6" rx="2" fill="#a5b4fc" />
          <circle cx="17" cy="36" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth={1.5} />
          {/* Thẻ bên phải (B) */}
          <rect x="36" y="16" width="22" height="32" rx="4" fill="#10b981" stroke="#0f172a" strokeWidth={2} />
          <rect x="39" y="20" width="16" height="6" rx="2" fill="#a7f3d0" />
          <circle cx="47" cy="36" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth={1.5} />
          {/* Dây năng lượng nối 2 thẻ */}
          <path d="M 28 32 C 32 26, 32 38, 36 32" fill="none" stroke="#facc15" strokeWidth={2.5} strokeLinecap="round" />
          {/* Tia sáng tia chớp ở điểm nối */}
          <path d="M 32 23 L 34 27 L 31 29 L 33 33" stroke="#fbbf24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    /* ─── Đúng hay Sai: Khiên kiểm định tích xanh & chéo đỏ ─── */
    case 'true-false':
      return (
        <svg {...common}>
          {/* Tấm khiên kiểm định */}
          <path
            d="M 32 8 C 44 8, 52 14, 52 26 C 52 42, 38 52, 32 56 C 26 52, 12 42, 12 26 C 12 14, 20 8, 32 8 Z"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth={2.5}
          />
          {/* Nửa trái khiên: Xanh lá (Đúng) */}
          <path
            d="M 32 11 L 32 53 C 27 49, 15 40, 15 26 C 15 16, 21 11, 32 11 Z"
            fill="#10b981"
            opacity={0.85}
          />
          {/* Nửa phải khiên: Đỏ (Sai) */}
          <path
            d="M 32 11 L 32 53 C 37 49, 49 40, 49 26 C 49 16, 43 11, 32 11 Z"
            fill="#ef4444"
            opacity={0.85}
          />
          {/* Dấu Tích Xanh bên trái */}
          <path d="M 20 30 L 24 34 L 28 26" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          {/* Dấu Gạch Chéo bên phải */}
          <path d="M 36 27 L 44 35 M 44 27 L 36 35" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" />
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="22" fill="#0ea5e9" stroke="#0f172a" strokeWidth={2.5} />
          <path d="M 28 22 L 42 32 L 28 42 Z" fill="#ffffff" stroke="#0f172a" strokeWidth={1.5} />
        </svg>
      );
  }
};
