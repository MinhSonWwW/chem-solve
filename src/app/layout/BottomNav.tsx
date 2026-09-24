import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, FlaskConical, ShoppingBag, BarChart3, User } from 'lucide-react';
import { sound } from '@/lib/audio';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const activeGrade = typeof window !== 'undefined' ? localStorage.getItem('chem_active_grade') || '8' : '8';

  const navItems = [
    { to: `/learn/${activeGrade}`, label: 'Học', icon: BookOpen, isLearn: true },
    { to: '/practice', label: 'Luyện tập', icon: FlaskConical },
    { to: '/shop', label: 'Shop', icon: ShoppingBag },
    { to: '/progress', label: 'Tiến độ', icon: BarChart3 },
    { to: '/profile', label: 'Hồ sơ', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#131f24]/95 backdrop-blur-md border-t-2 border-[#2e4756] safe-pb lg:hidden">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isItemActive = item.isLearn
            ? location.pathname.startsWith('/learn')
            : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => sound.playClick()}
              className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                isItemActive
                  ? 'text-[#0ea5e9] font-black scale-105'
                  : 'text-slate-400 hover:text-white font-bold'
              }`}
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
