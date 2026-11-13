import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('theme store default & persistence', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('light', 'dark');
    document.body.classList.remove('light', 'dark');
  });

  it('defaults to dark mode on fresh visit without setting explicit preference', async () => {
    const { useTheme } = await import('./theme');

    expect(useTheme.getState().theme).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
    expect(document.body.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('chem_theme')).toBeNull();
    expect(localStorage.getItem('chem_theme_explicit')).toBeNull();
  });

  it('ignores legacy non-explicit light value in localStorage and resets to dark', async () => {
    localStorage.setItem('chem_theme', 'light');

    const { useTheme } = await import('./theme');

    expect(useTheme.getState().theme).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('chem_theme')).toBeNull();
  });

  it('persists explicit light selection when user toggles or sets theme', async () => {
    const { useTheme } = await import('./theme');

    useTheme.getState().toggleTheme();

    expect(useTheme.getState().theme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('chem_theme')).toBe('light');
    expect(localStorage.getItem('chem_theme_explicit')).toBe('1');
  });

  it('restores explicit light preference on subsequent reload and can toggle back to dark', async () => {
    localStorage.setItem('chem_theme', 'light');
    localStorage.setItem('chem_theme_explicit', '1');

    const { useTheme } = await import('./theme');

    expect(useTheme.getState().theme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    useTheme.getState().toggleTheme();

    expect(useTheme.getState().theme).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('chem_theme')).toBe('dark');
    expect(localStorage.getItem('chem_theme_explicit')).toBe('1');
  });
});

