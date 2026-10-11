import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { sound } from '@/lib/audio';
import { haptic } from '@/lib/haptic';

export interface ThemeToggleProps {
  variant?: 'compact' | 'sidebar' | 'switch';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const handleClick = () => {
    sound.playClick();
    haptic.tap();
    toggleTheme();
  };

  if (variant === 'sidebar') {
    return (
      <button
        onClick={handleClick}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer select-none ${
          isLight
            ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
        } ${className}`}
        title={isLight ? 'Chuyển sang Chế độ Tối' : 'Chuyển sang Chế độ Sáng'}
      >
        <span className="flex items-center gap-2">
          {isLight ? (
            <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          ) : (
            <Moon className="w-4 h-4 text-sky-400 fill-sky-400/20" />
          )}
          Giao diện
        </span>
        <span
          className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded border transition-colors ${
            isLight
              ? 'bg-amber-100 text-amber-800 border-amber-300 font-black'
              : 'bg-slate-800 text-slate-300 border-slate-700'
          }`}
        >
          {isLight ? '☀️ SÁNG' : '🌙 TỐI'}
        </span>
      </button>
    );
  }

  if (variant === 'switch') {
    return (
      <div className={`p-3.5 flex items-center justify-between ${className}`}>
        <div className="flex items-center gap-2.5">
          {isLight ? (
            <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          ) : (
            <Moon className="w-4 h-4 text-sky-400 fill-sky-400/20" />
          )}
          <div>
            <div className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              Chế độ hiển thị: {isLight ? 'Giao diện Sáng' : 'Giao diện Tối'}
            </div>
            <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {isLight
                ? 'Nền sáng dịu mắt, tương phản cao, dễ nhìn ban ngày'
                : 'Nền tối phòng lab chuyên sâu, chống mỏi mắt ban đêm'}
            </div>
          </div>
        </div>
        <button
          onClick={handleClick}
          className={`w-14 h-7 rounded-full transition-colors relative cursor-pointer border-2 flex items-center px-1 ${
            isLight
              ? 'bg-amber-400 border-amber-500'
              : 'bg-[#131f24] border-[#2e4756]'
          }`}
          title={isLight ? 'Bấm để đổi sang giao diện Tối' : 'Bấm để đổi sang giao diện Sáng'}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all transform ${
              isLight
                ? 'translate-x-6 bg-white text-amber-500 shadow-sm'
                : 'translate-x-0 bg-slate-200 text-slate-800'
            }`}
          >
            {isLight ? '☀️' : '🌙'}
          </div>
        </button>
      </div>
    );
  }

  // Compact icon button for TopHeader / Mobile
  return (
    <button
      onClick={handleClick}
      aria-label={isLight ? 'Chuyển sang giao diện Tối' : 'Chuyển sang giao diện Sáng'}
      title={isLight ? 'Giao diện Sáng (Bấm để đổi sang Tối)' : 'Giao diện Tối (Bấm để đổi sang Sáng)'}
      className={`p-1.5 rounded-lg border-2 transition-all duration-100 cursor-pointer select-none active:translate-y-[2px] active:shadow-none flex items-center justify-center ${
        isLight
          ? 'bg-amber-50 border-amber-300 text-amber-600 hover:bg-amber-100 shadow-[0_2px_0_0_#d97706]'
          : 'bg-[#18272f] border-[#2e4756] text-slate-300 hover:text-amber-400 shadow-[0_2px_0_0_#101a1f]'
      } ${className}`}
    >
      {isLight ? (
        <Sun className="w-4 h-4 text-amber-500 fill-amber-500/30" />
      ) : (
        <Moon className="w-4 h-4 text-sky-400 fill-sky-400/20" />
      )}
    </button>
  );
};
