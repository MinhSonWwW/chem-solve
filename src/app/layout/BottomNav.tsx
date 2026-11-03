import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, FlaskConical, ShoppingBag, BarChart3, User, Zap, Dna } from 'lucide-react';
import { sound } from '@/lib/audio';
import { useActiveSubject, useActiveGrade } from '@/content/subjects';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { subject: activeSubject } = useActiveSubject();
  const { grade: activeGrade } = useActiveGrade();

  const navItems = [
    { to: `/learn/${activeGrade}`, label: 'Học', icon: BookOpen, isLearn: true },
    { to: '/practice', label: 'Luyện tập', icon: activeSubject === 'physics' ? Zap : activeSubject === 'bio' ? Dna : FlaskConical },
    { to: '/shop', label: 'Shop', icon: ShoppingBag },
    { to: '/progress', label: 'Tiến độ', icon: BarChart3 },
    { to: '/profile', label: 'Hồ sơ', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[var(--bg-surface)] backdrop-blur-md border-t border-[var(--border)] safe-pb lg:hidden">
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
                  ? 'text-[var(--subject-fg)] font-black scale-105'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] font-bold'
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
