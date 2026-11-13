import { create } from 'zustand';

export type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'chem_theme';
const THEME_EXPLICIT_KEY = 'chem_theme_explicit';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const explicit = localStorage.getItem(THEME_EXPLICIT_KEY);
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (explicit === '1' && (saved === 'light' || saved === 'dark')) {
    return saved;
  }
  return 'dark';
}

function applyThemeToDom(theme: Theme, persist = false) {
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

  if (persist) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    localStorage.setItem(THEME_EXPLICIT_KEY, '1');
  } else if (localStorage.getItem(THEME_EXPLICIT_KEY) !== '1') {
    localStorage.removeItem(THEME_STORAGE_KEY);
  }
  window.dispatchEvent(new CustomEvent('chem_theme_changed', { detail: { theme } }));
}

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useTheme = create<ThemeState>((set, get) => {
  const initialTheme = getInitialTheme();
  // Apply initially on store load without forcing user preference into localStorage
  if (typeof window !== 'undefined') {
    applyThemeToDom(initialTheme, false);
  }

  return {
    theme: initialTheme,
    setTheme: (theme: Theme) => {
      applyThemeToDom(theme, true);
      set({ theme });
    },
    toggleTheme: () => {
      const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
      applyThemeToDom(nextTheme, true);
      set({ theme: nextTheme });
    },
  };
});
