import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BookOpen,
  FlaskConical,
  Zap,
  Dna,
  BarChart3,
  User,
  ShoppingBag,
  Volume2,
  VolumeX,
  Code2,
  ChevronDown,
  LogIn,
  TestTubes,
} from 'lucide-react';
import { sound } from '@/lib/audio';
import { useUserStore } from '@/features/gamification/useUserStore';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { assetUrl } from '@/lib/utils';
import { SubjectSelectorModal, ThemeToggle } from '@/design-system';
import { useActiveSubject, useActiveGrade, SUBJECTS } from '@/content/subjects';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  matchPrefix?: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/learn', label: 'HỌC', icon: BookOpen, matchPrefix: '/learn' },
  { to: '/practice', label: 'LUYỆN TẬP', icon: FlaskConical, matchPrefix: '/practice' },
  { to: '/lab', label: 'PHÒNG LAB', icon: TestTubes, matchPrefix: '/lab' },
  { to: '/shop', label: 'CỬA HÀNG', icon: ShoppingBag, matchPrefix: '/shop' },
  { to: '/daily', label: 'NHIỆM VỤ', icon: Zap, matchPrefix: '/daily' },
  { to: '/progress', label: 'TIẾN ĐỘ', icon: BarChart3, matchPrefix: '/progress' },
  { to: '/profile', label: 'HỒ SƠ', icon: User, matchPrefix: '/profile' },
];

export const DesktopSidebar: React.FC = () => {
  const location = useLocation();
  const { soundEnabled, toggleSound } = useUserStore();
  const { user, isAuthenticated } = useAuthStore();
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const { subject: activeSubject, setSubject: setActiveSubjectState } = useActiveSubject();
  const { grade: activeGrade } = useActiveGrade();
  const currentSub = SUBJECTS.find((s) => s.id === activeSubject) || SUBJECTS[0];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 h-[100dvh] sticky top-0 border-r border-[var(--border)] bg-[var(--bg-surface)] px-4 py-6 select-none z-20">
      {/* 1. Header / Logo */}
      <div className="space-y-4">
        <NavLink
          to={`/learn/${activeGrade}`}
          onClick={() => sound.playClick()}
          className="flex items-center gap-3 px-2 group cursor-pointer"
        >
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-base overflow-hidden border border-white/30 bg-[var(--subject-fill)] shadow-[0_4px_0_0_var(--subject-edge)] group-hover:scale-105 transition-transform"
          >
            {activeSubject === 'physics' ? (
              <Zap className="w-6 h-6 text-white fill-white" />
            ) : activeSubject === 'bio' ? (
              <span className="text-xl select-none">🌿</span>
            ) : (
              <img
                src={assetUrl('/assets/mascot/atom-idle.png')}
                alt="Atom"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            )}
          </div>
          <div>
            <span className="font-black text-xl tracking-wider text-[var(--text-primary)] block leading-tight">
              {activeSubject === 'physics' ? (
                <>
                  PHY<span className="text-[var(--phy-fg)]">-SOLVE</span>
                </>
              ) : activeSubject === 'bio' ? (
                <>
                  BIO<span className="text-[var(--bio-fg)]">-SOLVE</span>
                </>
              ) : (
                <>
                  CHEM<span className="text-[var(--chem-fg)]">-SOLVE</span>
                </>
              )}
            </span>
            <span className="text-[10px] font-bold text-[var(--text-tertiary)] tracking-wider uppercase">
              {activeSubject === 'physics'
                ? 'Vật lý Lớp 6-9 KNTT'
                : activeSubject === 'bio'
                ? 'Sinh học Lớp 6-8 KNTT'
                : 'Hóa học THCS'}
            </span>
          </div>
        </NavLink>

        {/* Subject Switcher Button */}
        <button
          onClick={() => {
            sound.playClick();
            setShowSubjectModal(true);
          }}
          className="sidebar-subject-btn w-full flex items-center justify-between p-2.5 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] hover:border-[var(--subject-edge)] transition-all text-left cursor-pointer group"
          title="Chọn môn học (Hóa học, Vật lý, Sinh học...)"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl shrink-0">{currentSub.icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-[var(--text-primary)] truncate">{currentSub.name}</span>
                <span
                  className="text-[9px] font-black uppercase px-1 py-0.2 rounded border bg-[var(--subject-tint)] text-[var(--subject-fg)] border-[var(--subject-edge)]"
                >
                  {currentSub.badge}
                </span>
              </div>
              <div className="text-[10px] text-[var(--text-tertiary)] truncate">Nhấn để đổi môn</div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors shrink-0" />
        </button>

        {/* 2. Navigation List */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon =
              item.to === '/practice' && activeSubject === 'physics'
                ? Zap
                : item.to === '/practice' && activeSubject === 'bio'
                ? Dna
                : item.icon;
            const to = item.matchPrefix === '/learn' ? `/learn/${activeGrade}` : item.to;
            const isActive = item.matchPrefix
              ? location.pathname.startsWith(item.matchPrefix)
              : location.pathname === item.to;

            return (
              <NavLink
                key={item.to}
                to={to}
                onClick={() => sound.playClick()}
                className={`sidebar-nav-item flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-black tracking-wider transition-all duration-150 cursor-pointer border ${
                  isActive
                    ? 'border-2 border-[var(--subject-fill)] bg-[var(--subject-tint)] text-[var(--subject-fg)]'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'text-[var(--subject-fg)] scale-110' : 'text-[var(--text-tertiary)]'
                  }`}
                />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* 3. Footer Tools */}
      <div className="pt-4 border-t border-[var(--border)] space-y-2.5">
        {/* Account / Login CTA Widget */}
        {isAuthenticated && user ? (
          <NavLink
            to="/profile"
            onClick={() => sound.playClick()}
            className="sidebar-profile-card w-full flex items-center justify-between p-2 rounded-2xl bg-[var(--ok-tint)] border border-[var(--ok-edge)] transition-all cursor-pointer group"
            title="Đến trang Hồ sơ cá nhân"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[var(--ok-fill)] text-white flex items-center justify-center font-black text-xs shrink-0">
                {user.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 text-left">
                <span className="block text-xs font-black text-[var(--text-primary)] truncate">
                  {user.displayName}
                </span>
                <span className="block text-[9px] text-[var(--ok-fg)] font-extrabold uppercase tracking-tight">
                  Đã đồng bộ ✓
                </span>
              </div>
            </div>
            <User className="w-4 h-4 text-[var(--ok-fg)] shrink-0 mr-1" />
          </NavLink>
        ) : (
          <NavLink
            to="/auth"
            onClick={() => sound.playClick()}
            className="w-full py-2.5 px-3 rounded-2xl bg-[var(--subject-fill)] hover:opacity-95 text-white text-xs font-black flex items-center justify-center gap-2 shadow-[0_4px_0_0_var(--subject-edge)] active:translate-y-1 active:shadow-none transition-all cursor-pointer select-none"
            title="Đăng nhập để lưu tiến trình học tập"
          >
            <LogIn className="w-4 h-4" />
            <span>ĐĂNG NHẬP / ĐĂNG KÝ</span>
          </NavLink>
        )}

        {/* Theme Toggle (Light / Dark mode) */}
        <ThemeToggle variant="sidebar" />

        {/* Sound Toggle */}
        <button
          onClick={() => {
            toggleSound();
            sound.playClick();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[var(--subject-fg)]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[var(--text-tertiary)]" />
            )}
            Âm thanh
          </span>
          <span
            className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
              soundEnabled ? 'bg-[var(--subject-tint)] text-[var(--subject-fg)] border border-[var(--subject-edge)]' : 'bg-[var(--bg-surface-2)] text-[var(--text-tertiary)]'
            }`}
          >
            {soundEnabled ? 'BẬT' : 'TẮT'}
          </span>
        </button>

        {/* Design System Gallery Link */}
        <NavLink
          to="/dev/design-system"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold text-[var(--text-tertiary)] hover:text-[var(--subject-fg)] hover:bg-[var(--bg-surface-2)] transition-colors"
        >
          <Code2 className="w-4 h-4" />
          <span>Design System</span>
        </NavLink>
      </div>

      {/* Subject Switcher Modal */}
      <SubjectSelectorModal
        isOpen={showSubjectModal}
        currentSubject={activeSubject}
        onSelectSubject={(id) => setActiveSubjectState(id)}
        onClose={() => setShowSubjectModal(false)}
      />
    </aside>
  );
};
