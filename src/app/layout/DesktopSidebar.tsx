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
    <aside className="hidden lg:flex flex-col justify-between w-64 h-[100dvh] sticky top-0 border-r-2 border-[#2e4756] bg-[#131f24]/95 px-4 py-6 select-none z-20">
      {/* 1. Header / Logo */}
      <div className="space-y-4">
        <NavLink
          to={`/learn/${activeGrade}`}
          onClick={() => sound.playClick()}
          className="flex items-center gap-3 px-2 group cursor-pointer"
        >
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-base overflow-hidden border group-hover:scale-105 transition-transform ${
              activeSubject === 'physics'
                ? 'bg-[#eab308] border-amber-300/50 shadow-[0_4px_0_0_#ca8a04]'
                : activeSubject === 'bio'
                ? 'bg-[#10b981] border-emerald-300/50 shadow-[0_4px_0_0_#059669]'
                : 'bg-[#0ea5e9] border-sky-300/40 shadow-[0_4px_0_0_#0284c7]'
            }`}
          >
            {activeSubject === 'physics' ? (
              <Zap className="w-6 h-6 text-slate-950 fill-slate-950" />
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
            <span className="font-black text-xl tracking-wider text-white block leading-tight">
              {activeSubject === 'physics' ? (
                <>
                  PHY<span className="text-[#eab308]">-SOLVE</span>
                </>
              ) : activeSubject === 'bio' ? (
                <>
                  BIO<span className="text-[#10b981]">-SOLVE</span>
                </>
              ) : (
                <>
                  CHEM<span className="text-[#0ea5e9]">-SOLVE</span>
                </>
              )}
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
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
          className={`sidebar-subject-btn w-full flex items-center justify-between p-2.5 rounded-2xl bg-[#18272f] border-2 transition-all text-left shadow-[0_3px_0_0_#101a1f] cursor-pointer group ${
            activeSubject === 'physics'
              ? 'border-amber-500/40 hover:border-amber-400'
              : activeSubject === 'bio'
              ? 'border-emerald-500/40 hover:border-emerald-400'
              : 'border-[#2e4756] hover:border-sky-500/60'
          }`}
          title="Chọn môn học (Hóa học, Vật lý, Sinh học...)"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl shrink-0">{currentSub.icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white truncate">{currentSub.name}</span>
                <span
                  className="text-[9px] font-black uppercase px-1 py-0.2 rounded border"
                  style={{
                    backgroundColor: `${currentSub.accentColor}20`,
                    color: currentSub.accentColor,
                    borderColor: `${currentSub.accentColor}40`,
                  }}
                >
                  {currentSub.badge}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 truncate">Nhấn để đổi môn</div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors shrink-0" />
        </button>

        {/* 2. Navigation List */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            // For Physics & Bio, replace chemistry flask icon
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

            const activeColorClass =
              activeSubject === 'physics'
                ? 'bg-[#eab308]/15 border-[#eab308] text-amber-300 shadow-[0_4px_0_0_#ca8a04]'
                : activeSubject === 'bio'
                ? 'bg-[#10b981]/15 border-[#10b981] text-emerald-300 shadow-[0_4px_0_0_#059669]'
                : 'bg-[#0ea5e9]/15 border-[#0ea5e9] text-[#38bdf8] shadow-[0_4px_0_0_#0284c7]';

            const activeIconColor =
              activeSubject === 'physics'
                ? 'text-[#eab308]'
                : activeSubject === 'bio'
                ? 'text-[#10b981]'
                : 'text-[#0ea5e9]';

            return (
              <NavLink
                key={item.to}
                to={to}
                onClick={() => sound.playClick()}
                className={`sidebar-nav-item flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-black tracking-wider transition-all duration-150 cursor-pointer border-2 ${
                  isActive
                    ? `${activeColorClass} -translate-y-[2px]`
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-[#18272f]'
                }`}
              >
                <Icon
                  className={`w-6 h-6 transition-transform ${
                    isActive ? `${activeIconColor} scale-110` : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* 3. Footer Tools */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
        {/* Account / Login CTA Widget */}
        {isAuthenticated && user ? (
          <NavLink
            to="/profile"
            onClick={() => sound.playClick()}
            className="sidebar-profile-card w-full flex items-center justify-between p-2 rounded-2xl bg-[#18272f] border-2 border-emerald-500/40 hover:border-emerald-400 transition-all cursor-pointer group shadow-[0_2px_0_0_#064e3b]"
            title="Đến trang Hồ sơ cá nhân"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-black text-xs shrink-0">
                {user.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 text-left">
                <span className="block text-xs font-black text-white truncate group-hover:text-emerald-300">
                  {user.displayName}
                </span>
                <span className="block text-[9px] text-emerald-400 font-extrabold uppercase tracking-tight">
                  Đã đồng bộ ✓
                </span>
              </div>
            </div>
            <User className="w-4 h-4 text-slate-400 group-hover:text-emerald-300 shrink-0 mr-1" />
          </NavLink>
        ) : (
          <NavLink
            to="/auth"
            onClick={() => sound.playClick()}
            className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#38bdf8] hover:to-[#0ea5e9] text-white text-xs font-black flex items-center justify-center gap-2 shadow-[0_3px_0_0_#0369a1] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer select-none"
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
