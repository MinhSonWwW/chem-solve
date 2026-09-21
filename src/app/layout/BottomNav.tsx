import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, FlaskConical, Gamepad2, BarChart3, User } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/learn/8', label: 'Học', icon: BookOpen },
  { to: '/practice', label: 'Luyện', icon: FlaskConical },
  { to: '/games', label: 'Game', icon: Gamepad2 },
  { to: '/progress', label: 'Tiến độ', icon: BarChart3 },
  { to: '/profile', label: 'Hồ sơ', icon: User },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 safe-pb lg:hidden">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-cyan-400 font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-200 font-medium'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
