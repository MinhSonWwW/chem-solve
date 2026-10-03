import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BarChart3, User } from 'lucide-react';
import { HandDrawnIcon } from '@/design-system';
import { sound } from '@/lib/audio';
import { useActiveSubject } from '@/content/subjects';
import type { HandDrawnIconName } from '@/design-system';

/** Nav tab định nghĩa — icon vẽ tay thay Lucide */
const BASE_NAV_ITEMS = [
  { to: '/learn', label: 'Học', iconName: 'flask' as HandDrawnIconName, isLearn: true },
  { to: '/practice', label: 'Luyện tập', iconName: 'flask' as HandDrawnIconName },
  { to: '/shop', label: 'Shop', iconName: 'treasure-chest' as HandDrawnIconName },
  { to: '/progress', label: 'Tiến độ', iconStatic: BarChart3 },
  { to: '/profile', label: 'Hồ sơ', iconStatic: User },
];

/** Icon vẽ tay cho tab Luyện tập — theo môn */
const PRACTICE_ICON_MAP: Record<string, HandDrawnIconName> = {
  chem: 'flask',
  physics: 'atom',
  bio: 'dna',
};

/** Icon vẽ tay cho tab Học — theo môn */
const LEARN_ICON_MAP: Record<string, HandDrawnIconName> = {
  chem: 'flask',
  physics: 'microscope',
  bio: 'dna',
};

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { subject: activeSubject } = useActiveSubject();
  const activeGrade =
    typeof window !== 'undefined' ? localStorage.getItem('chem_active_grade') || '8' : '8';

  /* Màu active theo môn */
  const activeColor =
    activeSubject === 'physics'
      ? { text: 'text-[#eab308]', bar: 'bg-[#eab308]', shadow: 'shadow-[0_-2px_0_0_#ca8a04]' }
      : activeSubject === 'bio'
      ? { text: 'text-[#10b981]', bar: 'bg-[#10b981]', shadow: 'shadow-[0_-2px_0_0_#059669]' }
      : { text: 'text-[#38bdf8]', bar: 'bg-[#38bdf8]', shadow: 'shadow-[0_-2px_0_0_#0284c7]' };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30
        bg-[#0f171c]/97 backdrop-blur-md
        border-t-2 border-[#2e4756]
        safe-pb lg:hidden"
    >
      <div className="max-w-md mx-auto flex items-stretch justify-around py-1 px-1">
        {BASE_NAV_ITEMS.map((item) => {
          /* Xác định đường dẫn đúng cho tab Học */
          const to = item.isLearn ? `/learn/${activeGrade}` : item.to;

          const isItemActive = item.isLearn
            ? location.pathname.startsWith('/learn')
            : location.pathname === item.to ||
              location.pathname.startsWith(`${item.to}/`);

          /* Chọn icon đúng theo môn */
          let resolvedIconName: HandDrawnIconName | undefined;
          if (item.isLearn) {
            resolvedIconName = LEARN_ICON_MAP[activeSubject] ?? 'flask';
          } else if (item.to === '/practice') {
            resolvedIconName = PRACTICE_ICON_MAP[activeSubject] ?? 'flask';
          } else {
            resolvedIconName = item.iconName;
          }

          const StaticIcon = item.iconStatic;

          return (
            <NavLink
              key={to}
              to={to}
              onClick={() => sound.playClick()}
              className={`relative flex flex-col items-center justify-center gap-0.5
                py-2 px-1.5 rounded-2xl min-w-[52px]
                transition-all duration-150 cursor-pointer select-none
                ${isItemActive
                  ? `${activeColor.text} font-black scale-105`
                  : 'text-slate-500 hover:text-slate-300 font-bold'
                }`}
            >
              {/* Vệt sáng đáy tab active */}
              {isItemActive && (
                <span
                  className={`absolute bottom-0.5 left-1/2 -translate-x-1/2
                    w-8 h-[3px] rounded-full ${activeColor.bar}
                    animate-[fadeIn_0.2s_ease]`}
                />
              )}

              {/* Icon: HandDrawn hoặc Lucide tĩnh */}
              {resolvedIconName ? (
                <HandDrawnIcon
                  name={resolvedIconName}
                  size={22}
                  className={`transition-transform duration-150
                    ${isItemActive ? 'scale-110' : 'opacity-60'}`}
                />
              ) : StaticIcon ? (
                <StaticIcon
                  className={`w-5 h-5 transition-transform duration-150
                    ${isItemActive ? 'scale-110' : 'opacity-60'}`}
                />
              ) : null}

              <span className="text-[10px] font-semibold tracking-tight leading-none mt-0.5">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
