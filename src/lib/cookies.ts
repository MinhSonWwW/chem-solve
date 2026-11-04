/**
 * Cross-platform Cookie helper for persistent browser storage.
 * Provides unbreakable persistence across PWA updates, service worker cache flushes, and hard page reloads.
 */

export function setCookie(name: string, value: string, days = 365): void {
  if (typeof document === 'undefined') return;
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const encoded = encodeURIComponent(value);
    document.cookie = `${name}=${encoded}; expires=${expires}; path=/; SameSite=Lax`;
  } catch {
    // Ignore if cookies are disabled by strict browser policy
  }
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
    );
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  try {
    document.cookie = `${name}=; max-age=-1; path=/; SameSite=Lax`;
  } catch {
    // Ignore
  }
}
