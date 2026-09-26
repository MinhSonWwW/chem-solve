import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Heart, Streak, XPBadge, GemBadge, HeartRefillModal, SubjectSelectorModal } from '@/design-system';
import { useUserStore } from '@/features/gamification/useUserStore';
import { sound } from '@/lib/audio';
import { assetUrl } from '@/lib/utils';
import { useActiveSubject, SUBJECTS } from '@/content/subjects';

export const TopHeader: React.FC = () => {
  const { xp, streak, hearts, gems, buyHeartWithGems } = useUserStore();
  const [showHeartModal, setShowHeartModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const { subject: activeSubject, setSubject: setActiveSubjectState } = useActiveSubject();
  const currentSub = SUBJECTS.find((s) => s.id === activeSubject) || SUBJECTS[0];
  const navigate = useNavigate();
  const activeGrade = typeof window !== 'undefined' ? localStorage.getItem('chem_active_grade') || '8' : '8';

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-[#131f24]/95 backdrop-blur-md border-b-2 border-[#2e4756] px-4 py-2.5 lg:hidden">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* Brand with Atom Avatar + Subject Chip */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              to={`/learn/${activeGrade}`}
              onClick={() => sound.playClick()}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#0ea5e9] flex items-center justify-center font-black text-white text-sm shadow-[0_3px_0_0_#0284c7] overflow-hidden border border-sky-300/40">
                <img
                  src={assetUrl('/assets/mascot/atom-idle.png')}
                  alt="Atom"
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="font-black tracking-wider text-sm sm:text-base text-white">
                CHEM<span className="text-[#0ea5e9]">-SOLVE</span>
              </span>
            </Link>

            {/* Subject Switcher Chip */}
            <button
              onClick={() => {
                sound.playClick();
                setShowSubjectModal(true);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-[#18272f] border border-[#2e4756] hover:border-sky-400 text-xs font-black text-slate-200 transition-colors shadow-sm cursor-pointer"
              title="Đổi môn học (Hóa học, Vật lý...)"
            >
              <span>{currentSub.icon}</span>
              <span className="text-[11px] text-sky-400">{currentSub.shortName}</span>
            </button>
          </div>

          {/* Gamification Stats */}
          <div className="flex items-center gap-2">
            <Streak days={streak} />
            <XPBadge amount={xp} />
            <div
              onClick={() => {
                sound.playClick();
                navigate('/shop');
              }}
              className="cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              title="Cửa hàng Đá quý - Đổi lấy Tim & Vật phẩm!"
            >
              <GemBadge amount={gems} />
            </div>
            <div
              onClick={() => {
                sound.playClick();
                setShowHeartModal(true);
              }}
              className="cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              title={`Đang có ${hearts}/5 tim. Bấm để đổi đá quý hoặc luyện tập!`}
            >
              <Heart count={hearts} max={5} />
            </div>

            <button
              onClick={() => navigate('/search')}
              aria-label="Tìm kiếm"
              className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg bg-slate-900 border border-slate-800 shadow-[0_2px_0_0_#1e293b] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Heart Refill & Gem Exchange Modal */}
      <HeartRefillModal
        isOpen={showHeartModal}
        hearts={hearts}
        gems={gems}
        costPerHeart={150}
        onBuyWithGems={() => {
          buyHeartWithGems();
        }}
        onGoToPractice={() => {
          setShowHeartModal(false);
          navigate('/practice');
        }}
        onGoToShop={() => {
          setShowHeartModal(false);
          navigate('/shop');
        }}
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
