import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, FlaskConical, ShoppingBag, BarChart3, User } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/learn/8', label: 'Học', icon: BookOpen },
  { to: '/practice', label: 'Luyện tập', icon: FlaskConical },
  { to: '/shop', label: 'Shop', icon: ShoppingBag },
  { to: '/progress', label: 'Tiến độ', icon: BarChart3 },
  { to: '/profile', label: 'Hồ sơ', icon: User },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#131f24]/95 backdrop-blur-md border-t-2 border-[#2e4756] safe-pb lg:hidden">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 px-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-[#0ea5e9] font-black scale-105'
                    : 'text-slate-400 hover:text-white font-bold'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
