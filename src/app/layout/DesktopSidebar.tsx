import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  User,
  Volume2,
  VolumeX,
  Code2,
  ChevronDown,
} from 'lucide-react';
import { sound } from '@/lib/audio';
import { useUserStore } from '@/features/gamification/useUserStore';
import { HandDrawnIcon, SubjectSelectorModal } from '@/design-system';
import { useActiveSubject, SUBJECTS } from '@/content/subjects';
import type { HandDrawnIconName } from '@/design-system';

/** Icon vẽ tay cho từng môn */
const SUBJECT_ICON_MAP: Record<string, HandDrawnIconName> = {
  chem: 'flask',
  physics: 'atom',
  bio: 'dna',
};

/** Icon vẽ tay cho tab Luyện tập theo môn */
const PRACTICE_ICON_MAP: Record<string, HandDrawnIconName> = {
  chem: 'flask',
  physics: 'atom',
  bio: 'microscope',
};

interface NavItemDef {
  to: string;
  label: string;
  matchPrefix: string;
  /** Icon vẽ tay — ưu tiên hơn iconStatic */
  iconName?: HandDrawnIconName;
  /** Lucide icon dùng cho tab phụ (Tiến độ, Hồ sơ, Cửa hàng) */
  iconStatic?: React.ElementType;
  /** Tab thay đổi icon theo môn học */
  subjectVariant?: 'practice' | 'learn';
}

const NAV_ITEMS: NavItemDef[] = [
  { to: '/learn', label: 'HỌC', matchPrefix: '/learn', iconName: 'flask', subjectVariant: 'learn' },
  { to: '/practice', label: 'LUYỆN TẬP', matchPrefix: '/practice', iconName: 'flask', subjectVariant: 'practice' },
  { to: '/shop', label: 'CỬA HÀNG', matchPrefix: '/shop', iconName: 'treasure-chest' },
  { to: '/progress', label: 'TIẾN ĐỘ', matchPrefix: '/progress', iconStatic: BarChart3 },
  { to: '/profile', label: 'HỒ SƠ', matchPrefix: '/profile', iconStatic: User },
];

export const DesktopSidebar: React.FC = () => {
  const location = useLocation();
  const { soundEnabled, toggleSound } = useUserStore();
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const { subject: activeSubject, setSubject: setActiveSubjectState } = useActiveSubject();
  const currentSub = SUBJECTS.find((s) => s.id === activeSubject) || SUBJECTS[0];
  const activeGrade =
    typeof window !== 'undefined' ? localStorage.getItem('chem_active_grade') || '8' : '8';

  /* Accent tokens per subject */
  const accent = {
    chem: {
      bg: 'bg-[#0ea5e9] border-sky-300/40',
      shadow: 'shadow-[0_4px_0_0_#0284c7]',
      activeCls:
        'bg-[#0ea5e9]/15 border-[#0ea5e9] text-[#38bdf8] shadow-[0_4px_0_0_#0284c7]',
      iconColor: 'text-[#0ea5e9]',
      text: 'text-[#0ea5e9]',
      subBorder: 'border-[#2e4756] hover:border-sky-500/60',
      chipText: 'text-sky-400',
    },
    physics: {
      bg: 'bg-[#eab308] border-amber-300/50',
      shadow: 'shadow-[0_4px_0_0_#ca8a04]',
      activeCls:
        'bg-[#eab308]/15 border-[#eab308] text-amber-300 shadow-[0_4px_0_0_#ca8a04]',
      iconColor: 'text-[#eab308]',
      text: 'text-[#eab308]',
      subBorder: 'border-amber-500/40 hover:border-amber-400',
      chipText: 'text-amber-400',
    },
    bio: {
      bg: 'bg-[#10b981] border-emerald-300/50',
      shadow: 'shadow-[0_4px_0_0_#059669]',
      activeCls:
        'bg-[#10b981]/15 border-[#10b981] text-emerald-300 shadow-[0_4px_0_0_#059669]',
      iconColor: 'text-[#10b981]',
      text: 'text-[#10b981]',
      subBorder: 'border-emerald-500/40 hover:border-emerald-400',
      chipText: 'text-emerald-400',
    },
  };
  const ac = accent[activeSubject as keyof typeof accent] ?? accent.chem;
  const subjectIconName = SUBJECT_ICON_MAP[activeSubject] ?? 'flask';
  const brandPrefix =
    activeSubject === 'physics' ? 'PHY' : activeSubject === 'bio' ? 'BIO' : 'CHEM';

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 h-[100dvh] sticky top-0 border-r-2 border-[#2e4756] bg-[#0f171c]/97 px-4 py-6 select-none z-20">

      <div className="space-y-4">
        {/* ── 1. Logo / Brand ── */}
        <NavLink
          to={`/learn/${activeGrade}`}
          onClick={() => sound.playClick()}
          className="flex items-center gap-3 px-2 group cursor-pointer"
        >
          {/* Avatar icon vẽ tay 3D chunky */}
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center
              overflow-hidden border-2
              ${ac.bg} ${ac.shadow}
              group-active:translate-y-[4px] group-active:shadow-none
              transition-all duration-100`}
          >
            <HandDrawnIcon name={subjectIconName} size={34} />
          </div>
          <div>
            <span className="font-black text-xl tracking-wider text-white block leading-tight">
              {brandPrefix}<span className={ac.text}>-SOLVE</span>
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

        {/* ── 2. Subject Switcher — Chunky 3D ── */}
        <button
          id="desktop-sidebar-subject-switcher"
          onClick={() => {
            sound.playClick();
            setShowSubjectModal(true);
          }}
          className={`w-full flex items-center justify-between p-3 rounded-2xl
            bg-[#18272f] border-2
            shadow-[0_4px_0_0_#0c1419]
            active:translate-y-[4px] active:shadow-none
            transition-all duration-100 text-left cursor-pointer group
            ${ac.subBorder}`}
          title="Chọn môn học"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Icon vẽ tay thay emoji */}
            <HandDrawnIcon name={subjectIconName} size={28} className="shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white truncate">{currentSub.name}</span>
                <span
                  className="text-[9px] font-black uppercase px-1 py-0.5 rounded border"
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

        {/* ── 3. Navigation List ── */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const to = item.matchPrefix === '/learn' ? `/learn/${activeGrade}` : item.to;
            const isActive = location.pathname.startsWith(item.matchPrefix);

            /* Resolve icon per subject variant */
            let resolvedIcon: HandDrawnIconName | undefined = item.iconName;
            if (item.subjectVariant === 'practice') {
              resolvedIcon = PRACTICE_ICON_MAP[activeSubject] ?? 'flask';
            } else if (item.subjectVariant === 'learn') {
              resolvedIcon = SUBJECT_ICON_MAP[activeSubject] ?? 'flask';
            }

            const StaticIcon = item.iconStatic;

            return (
              <NavLink
                key={item.to}
                to={to}
                onClick={() => sound.playClick()}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl
                  text-xs font-black tracking-wider
                  transition-all duration-150 cursor-pointer border-2
                  ${isActive
                    ? `${ac.activeCls} -translate-y-[2px]`
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-[#18272f]'
                  }`}
              >
                {/* Icon vẽ tay hoặc Lucide */}
                {resolvedIcon ? (
                  <HandDrawnIcon
                    name={resolvedIcon}
                    size={24}
                    className={`transition-transform shrink-0
                      ${isActive ? `${ac.iconColor} scale-110` : 'opacity-50'}`}
                  />
                ) : StaticIcon ? (
                  <StaticIcon
                    className={`w-6 h-6 transition-transform shrink-0
                      ${isActive ? `${ac.iconColor} scale-110` : 'opacity-50'}`}
                  />
                ) : null}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* ── 4. Footer Tools ── */}
      <div className="pt-4 border-t border-[#2e4756] space-y-2">
        {/* Sound Toggle */}
        <button
          id="desktop-sidebar-sound-toggle"
          onClick={() => {
            toggleSound();
            sound.playClick();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl
            text-[11px] font-bold text-slate-400
            hover:text-slate-200 hover:bg-[#18272f]
            transition-colors cursor-pointer"
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
            className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded
              ${soundEnabled
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'bg-[#18272f] text-slate-400 border border-slate-700'}`}
          >
            {soundEnabled ? 'BẬT' : 'TẮT'}
          </span>
        </button>

        {/* Design System Gallery */}
        <NavLink
          to="/dev/design-system"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl
            text-[11px] font-bold text-slate-500
            hover:text-cyan-400 hover:bg-[#18272f]
            transition-colors"
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
