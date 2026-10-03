import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Heart, Streak, XPBadge, GemBadge, HeartRefillModal, SubjectSelectorModal, HandDrawnIcon } from '@/design-system';
import { useUserStore } from '@/features/gamification/useUserStore';
import { sound } from '@/lib/audio';
import { useActiveSubject, SUBJECTS } from '@/content/subjects';
import type { HandDrawnIconName } from '@/design-system';

/** Icon vẽ tay cho từng môn học — thay thế emoji/Lucide */
const SUBJECT_ICON_MAP: Record<string, HandDrawnIconName> = {
  chem: 'flask',
  physics: 'atom',
  bio: 'dna',
};

export const TopHeader: React.FC = () => {
  const { xp, streak, hearts, gems, buyHeartWithGems } = useUserStore();
  const [showHeartModal, setShowHeartModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const { subject: activeSubject, setSubject: setActiveSubjectState } = useActiveSubject();
  const currentSub = SUBJECTS.find((s) => s.id === activeSubject) || SUBJECTS[0];
  const navigate = useNavigate();
  const activeGrade = typeof window !== 'undefined' ? localStorage.getItem('chem_active_grade') || '8' : '8';

  const accentShadow =
    activeSubject === 'physics'
      ? 'shadow-[0_3px_0_0_#ca8a04]'
      : activeSubject === 'bio'
      ? 'shadow-[0_3px_0_0_#059669]'
      : 'shadow-[0_3px_0_0_#0284c7]';

  const accentBg =
    activeSubject === 'physics'
      ? 'bg-[#eab308] border-amber-300/50'
      : activeSubject === 'bio'
      ? 'bg-[#10b981] border-emerald-300/50'
      : 'bg-[#0ea5e9] border-sky-300/40';

  const accentBorder =
    activeSubject === 'physics'
      ? 'border-amber-500/40 hover:border-amber-400 text-amber-300'
      : activeSubject === 'bio'
      ? 'border-emerald-500/40 hover:border-emerald-400 text-emerald-300'
      : 'border-[#2e4756] hover:border-sky-400 text-slate-200';

  const accentText =
    activeSubject === 'physics'
      ? 'text-[#eab308]'
      : activeSubject === 'bio'
      ? 'text-[#10b981]'
      : 'text-[#0ea5e9]';

  const brandPrefix =
    activeSubject === 'physics' ? 'PHY' : activeSubject === 'bio' ? 'BIO' : 'CHEM';

  const iconName = SUBJECT_ICON_MAP[activeSubject] ?? 'flask';

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-[#0f171c]/95 backdrop-blur-md border-b-2 border-[#2e4756] px-4 py-2 lg:hidden">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">

          {/* ─── Brand + Subject Chip ─── */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              to={`/learn/${activeGrade}`}
              onClick={() => sound.playClick()}
              className="flex items-center gap-1.5 cursor-pointer group"
            >
              {/* Avatar icon vẽ tay — 3D chunky */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden border-2
                  ${accentBg} ${accentShadow}
                  group-active:translate-y-[2px] group-active:shadow-none
                  transition-all duration-100`}
              >
                <HandDrawnIcon name={iconName} size={28} />
              </div>
              <span className="font-black tracking-wider text-sm sm:text-base text-white">
                {brandPrefix}<span className={accentText}>-SOLVE</span>
              </span>
            </Link>

            {/* Subject Switcher Chip — nút bấm chunky 3D */}
            <button
              id="top-header-subject-switcher"
              onClick={() => {
                sound.playClick();
                setShowSubjectModal(true);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl
                bg-[#18272f] border-2 text-xs font-black
                shadow-[0_3px_0_0_#101a1f]
                active:translate-y-[3px] active:shadow-none
                transition-all duration-100 cursor-pointer
                ${accentBorder}`}
              title="Đổi môn học"
            >
              {/* Icon vẽ tay nhỏ */}
              <HandDrawnIcon name={iconName} size={16} />
              <span className={`text-[11px] ${accentText}`}>{currentSub.shortName}</span>
            </button>
          </div>

          {/* ─── Gamification Stats ─── */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Streak days={streak} />
            <XPBadge amount={xp} />

            {/* Gems → nhấn vào đến Shop */}
            <div
              id="top-header-gems"
              onClick={() => {
                sound.playClick();
                navigate('/shop');
              }}
              className="cursor-pointer active:scale-90 transition-transform duration-100"
              title="Cửa hàng — đổi đá quý lấy vật phẩm!"
            >
              <GemBadge amount={gems} />
            </div>

            {/* Hearts → nhấn vào mở modal */}
            <div
              id="top-header-hearts"
              onClick={() => {
                sound.playClick();
                setShowHeartModal(true);
              }}
              className="cursor-pointer active:scale-90 transition-transform duration-100"
              title={`${hearts}/5 tim — Bấm để hồi phục!`}
            >
              <Heart count={hearts} max={5} />
            </div>

            {/* Search button chunky 3D */}
            <button
              id="top-header-search"
              onClick={() => navigate('/search')}
              aria-label="Tìm kiếm bài học"
              className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg
                bg-[#18272f] border-2 border-[#2e4756]
                shadow-[0_2px_0_0_#101a1f]
                active:translate-y-[2px] active:shadow-none
                transition-all duration-100"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Heart Refill Modal */}
      <HeartRefillModal
        isOpen={showHeartModal}
        hearts={hearts}
        gems={gems}
        costPerHeart={150}
        onBuyWithGems={() => { buyHeartWithGems(); }}
        onGoToPractice={() => { setShowHeartModal(false); navigate('/practice'); }}
        onGoToShop={() => { setShowHeartModal(false); navigate('/shop'); }}
        onClose={() => setShowHeartModal(false)}
      />

      {/* Subject Switcher Modal */}
      <SubjectSelectorModal
        isOpen={showSubjectModal}
        currentSubject={activeSubject}
        onSelectSubject={(id) => setActiveSubjectState(id)}
        onClose={() => setShowSubjectModal(false)}
      />
    </>
  );
};
