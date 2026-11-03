import React from 'react';

export interface GeneratorBadgeProps extends React.SVGProps<SVGSVGElement> {
  id: string;
  size?: number;
  className?: string;
}

export const GeneratorBadge: React.FC<GeneratorBadgeProps> = ({
  id,
  size = 52,
  className = '',
  ...props
}) => {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 56 56',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className: `select-none shrink-0 ${className}`,
    'aria-hidden': true,
    ...props,
  };

  /* Render formula stamp / lab device based on topic id */
  if (id.includes('infinite')) {
    // Máy tạo đề vô hạn — Bánh răng phòng lab + cần gạt + vô cực ∞
    return (
      <svg {...common}>
        <rect x="4" y="4" width="48" height="48" rx="14" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth={2.5} />
        {/* Bánh răng hoạt họa */}
        <circle cx="28" cy="24" r="10" fill="var(--gold)" stroke="var(--ink)" strokeWidth={2} />
        <path d="M 28 10 L 28 14 M 28 34 L 28 38 M 14 24 L 18 24 M 38 24 L 42 24 M 18 14 L 21 17 M 35 31 L 38 34 M 18 34 L 21 31 M 35 17 L 38 14" stroke="var(--ink)" strokeWidth={3} strokeLinecap="round" />
        <circle cx="28" cy="24" r="4.5" fill="var(--bg-elevated)" />
        {/* Biểu tượng vô hạn ∞ ở đáy */}
        <path d="M 19 41 C 19 38, 23 38, 26 41 C 29 44, 33 44, 35 41 C 37 38, 33 38, 30 41 C 27 44, 23 44, 21 41 Z" fill="none" stroke="var(--gold)" strokeWidth={2.5} strokeLinecap="round" />
      </svg>
    );
  }

  if (id === 'gen-mol') {
    // n = m/M
    return (
      <svg {...common}>
        <rect x="4" y="4" width="48" height="48" rx="14" fill="var(--chem)" stroke="var(--chem-shade)" strokeWidth={2.5} />
        <text x="28" y="24" fill="var(--chem-soft)" fontSize="13" fontWeight="900" fontFamily="serif" textAnchor="middle">
          n = m
        </text>
        <line x1="20" y1="28" x2="36" y2="28" stroke="var(--chem-soft)" strokeWidth={2} strokeLinecap="round" />
        <text x="28" y="42" fill="var(--chem-soft)" fontSize="14" fontWeight="900" fontFamily="serif" textAnchor="middle">
          M
        </text>
      </svg>
    );
  }

  if (id === 'gen-gas') {
    // 24.79L
    return (
      <svg {...common}>
        <rect x="4" y="4" width="48" height="48" rx="14" fill="var(--chem)" stroke="var(--chem-shade)" strokeWidth={2.5} />
        <path d="M 22 10 L 34 10 L 34 14 L 38 20 L 38 26 L 18 26 L 18 20 L 22 14 Z" fill="var(--chem-soft)" stroke="var(--chem-shade)" strokeWidth={1.5} />
        <text x="28" y="38" fill="var(--chem-soft)" fontSize="10" fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          24,79L
        </text>
        <circle cx="28" cy="18" r="1.5" fill="var(--chem-soft)" />
      </svg>
    );
  }

  if (id === 'gen-solution') {
    // C% & CM
    return (
      <svg {...common}>
        <rect x="4" y="4" width="48" height="48" rx="14" fill="var(--chem)" stroke="var(--chem-shade)" strokeWidth={2.5} />
        <text x="28" y="26" fill="var(--chem-soft)" fontSize="13" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
          C%
        </text>
        <text x="28" y="42" fill="var(--chem-soft)" fontSize="12" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
          C<tspan fontSize="9" dy="2">M</tspan>
        </text>
      </svg>
    );
  }

  if (id === 'gen-stoich') {
    // Phản ứng Zn + HCl
    return (
      <svg {...common}>
        <rect x="4" y="4" width="48" height="48" rx="14" fill="var(--chem)" stroke="var(--chem-shade)" strokeWidth={2.5} />
        <text x="28" y="23" fill="var(--chem-soft)" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
          Zn+HCl
        </text>
        <path d="M 20 29 L 32 29 M 29 26 L 33 29 L 29 32" stroke="var(--chem-soft)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <text x="28" y="44" fill="var(--chem-soft)" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
          H<tspan fontSize="7" dy="1">2</tspan>↑
        </text>
      </svg>
    );
  }

  if (id.includes('speed')) {
    // v = s/t
    return (
      <svg {...common}>
        <rect x="4" y="4" width="48" height="48" rx="14" fill="var(--phy)" stroke="var(--phy-shade)" strokeWidth={2.5} />
        <text x="28" y="23" fill="var(--phy-soft)" fontSize="12" fontWeight="900" fontFamily="serif" textAnchor="middle">
          v = s
        </text>
        <line x1="22" y1="27" x2="34" y2="27" stroke="var(--phy-soft)" strokeWidth={2} strokeLinecap="round" />
        <text x="28" y="42" fill="var(--phy-soft)" fontSize="13" fontWeight="900" fontFamily="serif" textAnchor="middle">
          t
        </text>
      </svg>
    );
  }

  if (id.includes('density')) {
    // D = m/V
    return (
      <svg {...common}>
        <rect x="4" y="4" width="48" height="48" rx="14" fill="var(--phy)" stroke="var(--phy-shade)" strokeWidth={2.5} />
        <text x="28" y="23" fill="var(--phy-soft)" fontSize="12" fontWeight="900" fontFamily="serif" textAnchor="middle">
          D = m
        </text>
        <line x1="22" y1="27" x2="34" y2="27" stroke="var(--phy-soft)" strokeWidth={2} strokeLinecap="round" />
        <text x="28" y="42" fill="var(--phy-soft)" fontSize="13" fontWeight="900" fontFamily="serif" textAnchor="middle">
          V
        </text>
      </svg>
    );
  }

  if (id.includes('pressure')) {
    // p = F/S
    return (
      <svg {...common}>
        <rect x="4" y="4" width="48" height="48" rx="14" fill="var(--phy)" stroke="var(--phy-shade)" strokeWidth={2.5} />
        <text x="28" y="23" fill="var(--phy-soft)" fontSize="12" fontWeight="900" fontFamily="serif" textAnchor="middle">
          p = F
        </text>
        <line x1="22" y1="27" x2="34" y2="27" stroke="var(--phy-soft)" strokeWidth={2} strokeLinecap="round" />
        <text x="28" y="42" fill="var(--phy-soft)" fontSize="13" fontWeight="900" fontFamily="serif" textAnchor="middle">
          S
        </text>
      </svg>
    );
  }

  if (id.includes('energy')) {
    // A = F·s
    return (
      <svg {...common}>
        <rect x="4" y="4" width="48" height="48" rx="14" fill="var(--phy)" stroke="var(--phy-shade)" strokeWidth={2.5} />
        <text x="28" y="26" fill="var(--phy-soft)" fontSize="12" fontWeight="900" fontFamily="serif" textAnchor="middle">
          A = F·s
        </text>
        <text x="28" y="42" fill="var(--phy-soft)" fontSize="11" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
          Joule
        </text>
      </svg>
    );
  }

  if (id.includes('ohm')) {
    // I = U/R
    return (
      <svg {...common}>
        <rect x="4" y="4" width="48" height="48" rx="14" fill="var(--phy)" stroke="var(--phy-shade)" strokeWidth={2.5} />
        <text x="28" y="23" fill="var(--phy-soft)" fontSize="12" fontWeight="900" fontFamily="serif" textAnchor="middle">
          I = U
        </text>
        <line x1="22" y1="27" x2="34" y2="27" stroke="var(--phy-soft)" strokeWidth={2} strokeLinecap="round" />
        <text x="28" y="42" fill="var(--phy-soft)" fontSize="13" fontWeight="900" fontFamily="serif" textAnchor="middle">
          R
        </text>
      </svg>
    );
  }

  if (id.includes('mendel')) {
    // Khung Punnett Mendel 2x2
    return (
      <svg {...common}>
        <rect x="4" y="4" width="48" height="48" rx="14" fill="var(--bio)" stroke="var(--bio-shade)" strokeWidth={2.5} />
        <rect x="14" y="14" width="28" height="28" rx="3" fill="var(--bio-shade)" stroke="var(--bio-soft)" strokeWidth={2} />
        <line x1="28" y1="14" x2="28" y2="42" stroke="var(--bio-soft)" strokeWidth={1.5} />
        <line x1="14" y1="28" x2="42" y2="28" stroke="var(--bio-soft)" strokeWidth={1.5} />
        <text x="21" y="24" fill="var(--bio-soft)" fontSize="8" fontWeight="900" textAnchor="middle">AA</text>
        <text x="35" y="24" fill="var(--bio-soft)" fontSize="8" fontWeight="900" textAnchor="middle">Aa</text>
        <text x="21" y="38" fill="var(--bio-soft)" fontSize="8" fontWeight="900" textAnchor="middle">Aa</text>
        <text x="35" y="38" fill="var(--bio-soft)" fontSize="8" fontWeight="900" textAnchor="middle">aa</text>
      </svg>
    );
  }

  if (id.includes('dna')) {
    // Chuỗi DNA 2A + 3G
    return (
      <svg {...common}>
        <rect x="4" y="4" width="48" height="48" rx="14" fill="var(--bio)" stroke="var(--bio-shade)" strokeWidth={2.5} />
        <path d="M 14 16 C 24 24, 32 32, 42 40" stroke="var(--bio-soft)" strokeWidth={2.5} strokeLinecap="round" />
        <path d="M 42 16 C 32 24, 24 32, 14 40" stroke="var(--bio-soft)" strokeWidth={2.5} strokeLinecap="round" />
        <text x="28" y="50" fill="var(--bio-soft)" fontSize="9" fontWeight="900" textAnchor="middle">
          2A + 3G
        </text>
      </svg>
    );
  }

  if (id.includes('chromosome')) {
    // NST 2n
    return (
      <svg {...common}>
        <rect x="4" y="4" width="48" height="48" rx="14" fill="var(--bio)" stroke="var(--bio-shade)" strokeWidth={2.5} />
        <path d="M 18 16 Q 28 28, 38 40 M 38 16 Q 28 28, 18 40" stroke="var(--bio-soft)" strokeWidth={3.5} strokeLinecap="round" />
        <circle cx="28" cy="28" r="3" fill="var(--bio-soft)" stroke="var(--bio-shade)" strokeWidth={1} />
        <text x="28" y="50" fill="var(--bio-soft)" fontSize="9" fontWeight="900" textAnchor="middle">
          2n = 46
        </text>
      </svg>
    );
  }

  if (id.includes('calorie')) {
    // Calo kcal
    return (
      <svg {...common}>
        <rect x="4" y="4" width="48" height="48" rx="14" fill="var(--bio)" stroke="var(--bio-shade)" strokeWidth={2.5} />
        <path d="M 28 12 C 34 18, 38 24, 34 32 C 32 36, 24 38, 22 32 C 20 28, 24 20, 28 12 Z" fill="var(--gold)" stroke="var(--bio-shade)" strokeWidth={1.5} />
        <text x="28" y="47" fill="var(--bio-soft)" fontSize="10" fontWeight="900" textAnchor="middle">
          KCAL
        </text>
      </svg>
    );
  }

  if (id.includes('blood')) {
    // ABO
    return (
      <svg {...common}>
        <rect x="4" y="4" width="48" height="48" rx="14" fill="var(--err)" stroke="var(--err-shade)" strokeWidth={2.5} />
        <path d="M 28 14 C 34 22, 38 28, 34 34 C 30 40, 24 40, 22 34 C 18 28, 22 22, 28 14 Z" fill="var(--err-soft)" stroke="var(--err-shade)" strokeWidth={1.5} />
        <text x="28" y="48" fill="var(--err-soft)" fontSize="11" fontWeight="900" textAnchor="middle">
          ABO
        </text>
      </svg>
    );
  }

  // Default lab machine stamp
  return (
    <svg {...common}>
      <rect x="4" y="4" width="48" height="48" rx="14" fill="var(--bg-elevated)" stroke="var(--border)" strokeWidth={2.5} />
      <circle cx="28" cy="28" r="12" fill="var(--bg-canvas)" stroke="var(--border)" strokeWidth={2} />
      <path d="M 22 28 L 34 28 M 28 22 L 28 34" stroke="var(--chem)" strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
};
