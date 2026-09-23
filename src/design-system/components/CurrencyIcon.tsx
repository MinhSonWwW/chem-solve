import React from 'react';
import { assetUrl, cn } from '@/lib/utils';
import { Shield, Snowflake } from 'lucide-react';

export type CurrencyType =
  | 'gem'
  | 'heart'
  | 'streak'
  | 'xp'
  | 'coin'
  | 'trophy'
  | 'freeze'
  | 'shield';

export type CurrencySize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface CurrencyIconProps {
  type: CurrencyType;
  size?: CurrencySize;
  className?: string;
  animate?: boolean;
}

const SIZE_MAP: Record<CurrencySize, { box: string }> = {
  xs: { box: 'w-3.5 h-3.5' },
  sm: { box: 'w-4 h-4' },
  md: { box: 'w-5 h-5' },
  lg: { box: 'w-6 h-6' },
  xl: { box: 'w-8 h-8' },
};

export const CurrencyIcon: React.FC<CurrencyIconProps> = ({
  type,
  size = 'md',
  className,
  animate = false,
}) => {
  const s = SIZE_MAP[size];

  switch (type) {
    case 'gem':
      return (
        <img
          src={assetUrl('/assets/icons/gem-crystal.png')}
          alt="Đá quý"
          className={cn(
            s.box,
            'object-contain inline-block shrink-0 select-none align-middle filter drop-shadow-[0_2px_4px_rgba(6,182,212,0.4)]',
            animate && 'animate-bounce',
            className
          )}
          loading="lazy"
        />
      );

    case 'heart':
      return (
        <img
          src={assetUrl('/assets/icons/heart-flask.png')}
          alt="Bình tim"
          className={cn(
            s.box,
            'object-contain inline-block shrink-0 select-none align-middle filter drop-shadow-[0_2px_4px_rgba(244,63,94,0.4)]',
            animate && 'animate-pulse',
            className
          )}
          loading="lazy"
        />
      );

    case 'streak':
      return (
        <img
          src={assetUrl('/assets/icons/streak-flame.png')}
          alt="Lửa chuỗi"
          className={cn(
            s.box,
            'object-contain inline-block shrink-0 select-none align-middle filter drop-shadow-[0_2px_6px_rgba(249,115,22,0.5)]',
            className
          )}
          loading="lazy"
        />
      );

    case 'xp':
      return (
        <img
          src={assetUrl('/assets/icons/xp-potion.png')}
          alt="Kinh nghiệm"
          className={cn(
            s.box,
            'object-contain inline-block shrink-0 select-none align-middle filter drop-shadow-[0_2px_4px_rgba(168,85,247,0.4)]',
            className
          )}
          loading="lazy"
        />
      );

    case 'coin':
      return (
        <img
          src={assetUrl('/assets/icons/chem-coin.png')}
          alt="Xu Hóa học"
          className={cn(
            s.box,
            'object-contain inline-block shrink-0 select-none align-middle filter drop-shadow-[0_2px_4px_rgba(234,179,8,0.4)]',
            className
          )}
          loading="lazy"
        />
      );

    case 'trophy':
      return (
        <img
          src={assetUrl('/assets/roadmap/trophy-gold.png')}
          alt="Cúp vàng"
          className={cn(
            s.box,
            'object-contain inline-block shrink-0 select-none align-middle filter drop-shadow-[0_2px_6px_rgba(245,158,11,0.5)]',
            className
          )}
          loading="lazy"
        />
      );

    case 'freeze':
    case 'shield':
      return (
        <span
          className={cn(
            s.box,
            'inline-flex items-center justify-center rounded-lg bg-sky-500/20 border border-sky-400/50 text-sky-300 shrink-0 shadow-sm align-middle',
            className
          )}
          title="Khiên đóng băng"
        >
          {type === 'freeze' ? (
            <Snowflake className="w-full h-full p-0.5 text-cyan-300" />
          ) : (
            <Shield className="w-full h-full p-0.5 text-sky-400" />
          )}
        </span>
      );

    default:
      return null;
  }
};
