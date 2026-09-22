import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Heart, Streak, XPBadge, GemBadge, HeartRefillModal } from '@/design-system';
import { useUserStore } from '@/features/gamification/useUserStore';
import { sound } from '@/lib/audio';

export const TopHeader: React.FC = () => {
  const { xp, streak, hearts, gems, buyHeartWithGems } = useUserStore();
  const [showHeartModal, setShowHeartModal] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 lg:hidden">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-slate-950 text-sm shadow-[0_3px_0_0_#0891b2]">
              CS
            </div>
            <span className="font-black tracking-wider text-base bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              CHEM-SOLVE
            </span>
          </Link>

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
    </>
  );
};
