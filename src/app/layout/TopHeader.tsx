import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Zap, User, LogIn } from 'lucide-react';
import { Heart, Streak, XPBadge, GemBadge, HeartRefillModal, SubjectSelectorModal, ThemeToggle } from '@/design-system';
import { useUserStore } from '@/features/gamification/useUserStore';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { sound } from '@/lib/audio';
import { assetUrl } from '@/lib/utils';
import { useActiveSubject, useActiveGrade, SUBJECTS } from '@/content/subjects';

export const TopHeader: React.FC = () => {
  const { xp, streak, hearts, gems, buyHeartWithGems } = useUserStore();
  const { user, isAuthenticated } = useAuthStore();
  const [showHeartModal, setShowHeartModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const { subject: activeSubject, setSubject: setActiveSubjectState } = useActiveSubject();
  const { grade: activeGrade } = useActiveGrade();
  const currentSub = SUBJECTS.find((s) => s.id === activeSubject) || SUBJECTS[0];
  const navigate = useNavigate();

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
              {/* Avatar icon môn học — phong cách ảnh 2 */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden border-2
                  ${accentBg} ${accentShadow}
                  group-active:translate-y-[2px] group-active:shadow-none
                  transition-all duration-100`}
              >
                {activeSubject === 'physics' ? (
                  <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
                ) : activeSubject === 'bio' ? (
                  <span className="text-base select-none">🌿</span>
                ) : (
                  <img
                    src={assetUrl('/assets/mascot/atom-idle.png')}
                    alt="Atom"
                    className="w-7 h-7 object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
              </div>
              <span className="hidden sm:inline font-black tracking-wider text-sm sm:text-base text-white">
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
              className={`flex items-center gap-1 px-2 py-1.5 rounded-xl
                bg-[#18272f] border-2 text-xs font-black
                shadow-[0_3px_0_0_#101a1f]
                active:translate-y-[3px] active:shadow-none
                transition-all duration-100 cursor-pointer
                ${accentBorder}`}
              title="Đổi môn học"
            >
              <span className="text-sm shrink-0">{currentSub.icon}</span>
              <span className={`hidden sm:inline text-[11px] ${accentText}`}>{currentSub.shortName}</span>
            </button>
          </div>

          {/* ─── Gamification Stats ─── */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <Streak days={streak} />
            <div className="hidden sm:inline-flex">
              <XPBadge amount={xp} />
            </div>

            {/* Gems → nhấn vào đến Shop */}
            <div
              id="top-header-gems"
              onClick={() => {
                sound.playClick();
                navigate('/shop');
              }}
              className="hidden min-[400px]:block cursor-pointer active:scale-90 transition-transform duration-100"
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
              className="hidden sm:flex p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg
                bg-[#18272f] border-2 border-[#2e4756]
                shadow-[0_2px_0_0_#101a1f]
                active:translate-y-[2px] active:shadow-none
                transition-all duration-100 cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Theme Toggle (Light / Dark mode) */}
            <ThemeToggle variant="compact" />

            {/* Account / Login button */}
            <button
              id="top-header-auth"
              onClick={() => {
                sound.playClick();
                navigate(isAuthenticated ? '/profile' : '/auth');
              }}
              aria-label={isAuthenticated ? 'Hồ sơ người dùng' : 'Đăng nhập / Đăng ký'}
              title={isAuthenticated ? `Tài khoản: ${user?.displayName}` : 'Đăng nhập để lưu tiến trình'}
              className={`p-1.5 rounded-lg border-2 shadow-[0_2px_0_0_#101a1f] active:translate-y-[2px] active:shadow-none transition-all duration-100 cursor-pointer ${
                isAuthenticated
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400 hover:border-emerald-400'
                  : 'bg-[#18272f] border-[#2e4756] text-slate-400 hover:text-cyan-400'
              }`}
            >
              {isAuthenticated ? (
                <User className="w-4 h-4 text-emerald-400" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
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
