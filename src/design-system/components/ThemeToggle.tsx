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
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer select-none text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] ${className}`}
        title={isLight ? 'Chuyển sang Chế độ Tối' : 'Chuyển sang Chế độ Sáng'}
      >
        <span className="flex items-center gap-2">
          {isLight ? (
            <Sun className="w-4 h-4 text-[var(--gold-fg)]" />
          ) : (
            <Moon className="w-4 h-4 text-[var(--chem-fg)]" />
          )}
          Giao diện
        </span>
        <span
          className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded border transition-colors bg-[var(--gold-tint)] text-[var(--gold-fg)] border-[var(--gold-edge)]"
        >
          {isLight ? 'SÁNG' : 'TỐI'}
        </span>
      </button>
    );
  }

  if (variant === 'switch') {
    return (
      <div className={`p-3.5 flex items-center justify-between ${className}`}>
        <div className="flex items-center gap-2.5">
          {isLight ? (
            <Sun className="w-4 h-4 text-[var(--gold-fg)]" />
          ) : (
            <Moon className="w-4 h-4 text-[var(--chem-fg)]" />
          )}
          <div>
            <div className="text-xs font-semibold text-[var(--text-primary)]">
              Chế độ hiển thị: {isLight ? 'Giao diện Sáng' : 'Giao diện Tối'}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              {isLight
                ? 'Nền sáng dịu mắt, tương phản cao, dễ nhìn ban ngày'
                : 'Nền tối chống mỏi mắt, gam màu khoa học tiêu chuẩn'}
            </div>
          </div>
        </div>
        <button
          onClick={handleClick}
          className="w-14 h-7 rounded-full transition-colors relative cursor-pointer border border-[var(--border)] bg-[var(--bg-surface-2)] flex items-center px-1"
          title={isLight ? 'Bấm để đổi sang giao diện Tối' : 'Bấm để đổi sang giao diện Sáng'}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all transform ${
              isLight
                ? 'translate-x-6 bg-[var(--gold-fill)] text-[var(--on-ink)] shadow-sm'
                : 'translate-x-0 bg-[var(--border-strong)] text-[var(--text-primary)]'
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
      className={`p-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:text-[var(--gold-fg)] shadow-[0_2px_0_0_var(--edge-neutral)] active:translate-y-[2px] active:shadow-none transition-all duration-100 cursor-pointer select-none flex items-center justify-center ${className}`}
    >
      {isLight ? (
        <Sun className="w-4 h-4 text-[var(--gold-fg)]" />
      ) : (
        <Moon className="w-4 h-4 text-[var(--chem-fg)]" />
      )}
    </button>
  );
};
