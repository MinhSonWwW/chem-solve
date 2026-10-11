import { create } from 'zustand';

export type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'chem_theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  return 'dark';
}

function applyThemeToDom(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;

  root.setAttribute('data-theme', theme);

  if (theme === 'light') {
    root.classList.add('light');
    root.classList.remove('dark');
    body.classList.add('light');
    body.classList.remove('dark');
  } else {
    root.classList.add('dark');
    root.classList.remove('light');
    body.classList.add('dark');
    body.classList.remove('light');
  }

  localStorage.setItem(THEME_STORAGE_KEY, theme);
  window.dispatchEvent(new CustomEvent('chem_theme_changed', { detail: { theme } }));
}

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useTheme = create<ThemeState>((set, get) => {
  const initialTheme = getInitialTheme();
  // Apply initially on store load
  if (typeof window !== 'undefined') {
    applyThemeToDom(initialTheme);
  }

  return {
    theme: initialTheme,
    setTheme: (theme: Theme) => {
      applyThemeToDom(theme);
      set({ theme });
    },
    toggleTheme: () => {
      const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
      applyThemeToDom(nextTheme);
      set({ theme: nextTheme });
    },
  };
});
