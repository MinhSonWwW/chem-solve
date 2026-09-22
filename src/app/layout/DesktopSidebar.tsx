import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BookOpen,
  FlaskConical,
  Zap,
  BarChart3,
  User,
  ShoppingBag,
  Volume2,
  VolumeX,
  Code2,
} from 'lucide-react';
import { sound } from '@/lib/audio';
import { useUserStore } from '@/features/gamification/useUserStore';
import { assetUrl } from '@/lib/utils';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  matchPrefix?: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/learn', label: 'HỌC', icon: BookOpen, matchPrefix: '/learn' },
  { to: '/practice', label: 'LUYỆN TẬP & GAME', icon: FlaskConical, matchPrefix: '/practice' },
  { to: '/shop', label: 'CỬA HÀNG', icon: ShoppingBag, matchPrefix: '/shop' },
  { to: '/daily', label: 'NHIỆM VỤ', icon: Zap, matchPrefix: '/daily' },
  { to: '/progress', label: 'TIẾN ĐỘ', icon: BarChart3, matchPrefix: '/progress' },
  { to: '/profile', label: 'HỒ SƠ', icon: User, matchPrefix: '/profile' },
];

export const DesktopSidebar: React.FC = () => {
  const location = useLocation();
  const { soundEnabled, toggleSound } = useUserStore();

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 h-[100dvh] sticky top-0 border-r-2 border-[#2e4756] bg-[#131f24]/95 px-4 py-6 select-none z-20">
      {/* 1. Header / Logo */}
      <div className="space-y-6">
        <NavLink
          to="/learn/8"
          onClick={() => sound.playClick()}
          className="flex items-center gap-3 px-2 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0ea5e9] flex items-center justify-center font-black text-white text-base shadow-[0_4px_0_0_#0284c7] overflow-hidden border border-sky-300/40 group-hover:scale-105 transition-transform">
            <img
              src={assetUrl('/assets/mascot/atom-idle.png')}
              alt="Atom"
              className="w-8 h-8 object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <span className="font-black text-xl tracking-wider text-white block leading-tight">
              CHEM<span className="text-[#0ea5e9]">-SOLVE</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              Hóa học THCS 6–9
            </span>
          </div>
        </NavLink>

        {/* 2. Navigation List */}
        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.matchPrefix
              ? location.pathname.startsWith(item.matchPrefix)
              : location.pathname === item.to;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => sound.playClick()}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-black tracking-wider transition-all duration-150 cursor-pointer border-2 ${
                  isActive
                    ? 'bg-[#0ea5e9]/15 border-[#0ea5e9] text-[#38bdf8] shadow-[0_4px_0_0_#0284c7] translate-y-[-2px]'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-[#18272f]'
                }`}
              >
                <Icon
                  className={`w-6 h-6 transition-transform ${
                    isActive ? 'text-[#0ea5e9] scale-110' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* 3. Footer Tools */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2">
        {/* Sound Toggle */}
        <button
          onClick={() => {
            toggleSound();
            sound.playClick();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
            Âm thanh
          </span>
          <span
            className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
              soundEnabled ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {soundEnabled ? 'BẬT' : 'TẮT'}
          </span>
        </button>

        {/* Design System Gallery Link */}
        <NavLink
          to="/dev/design-system"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-500 hover:text-cyan-400 hover:bg-slate-900/60 transition-colors"
        >
          <Code2 className="w-4 h-4" />
          <span>Design System</span>
        </NavLink>
      </div>
    </aside>
  );
};
