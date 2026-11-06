/**
 * Official Google Identity Services (GIS) OAuth 2.0 Integration.
 * Provides real Google Sign-In with real Google profiles (name, email, avatar).
 */

import type { UserProfile } from '@/features/auth/useAuthStore';

// Default or environment configured Google OAuth Client ID
const DEFAULT_CLIENT_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_CLIENT_ID) ||
  '21560242226-l5m16g2kegnfpj6ba6opjg07lkl22f4g.apps.googleusercontent.com';

export const GOOGLE_CLIENT_ID_STORAGE_KEY = 'chem_google_client_id';

/**
 * Get active Google Client ID (from env or custom config in localStorage)
 */
export function getGoogleClientId(): string {
  if (typeof localStorage !== 'undefined') {
    const custom = localStorage.getItem(GOOGLE_CLIENT_ID_STORAGE_KEY);
    if (custom && custom.trim()) return custom.trim();
  }
  return DEFAULT_CLIENT_ID;
}

/**
 * Save custom Google Client ID
 */
export function setGoogleClientId(clientId: string): void {
  if (typeof localStorage !== 'undefined') {
    if (clientId.trim()) {
      localStorage.setItem(GOOGLE_CLIENT_ID_STORAGE_KEY, clientId.trim());
    } else {
      localStorage.removeItem(GOOGLE_CLIENT_ID_STORAGE_KEY);
    }
  }
}

/**
 * Load Google Identity Services script if not already present
 */
export function loadGoogleGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve();

    // Check if script already loaded
    if (window.google?.accounts?.oauth2) {
      return resolve();
    }

    const existingScript = document.getElementById('google-gsi-client');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google GIS script')));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
}

export interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified: boolean;
}

/**
 * Prompt real Google Sign-In popup and fetch user profile info
 */
export async function signInWithGoogleReal(customClientId?: string): Promise<UserProfile> {
  await loadGoogleGsiScript();

  const clientId = customClientId || getGoogleClientId();
  if (!clientId) {
    throw new Error('MISSING_CLIENT_ID');
  }

  const google = window.google;
  if (!google?.accounts?.oauth2) {
    throw new Error('Google Identity Services SDK không sẵn sàng. Vui lòng kiểm tra kết nối mạng.');
  }

  return new Promise((resolve, reject) => {
    try {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        prompt: 'select_account',
        callback: async (tokenResponse: { access_token?: string; error?: string }) => {
          if (tokenResponse.error || !tokenResponse.access_token) {
            return reject(new Error(tokenResponse.error || 'Đăng nhập Google bị hủy hoặc thất bại.'));
          }

          try {
            // Fetch real Google user info with access token
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });

            if (!res.ok) {
              throw new Error(`Google API responded with status ${res.status}`);
            }

            const info: GoogleUserInfo = await res.json();

            const profile: UserProfile = {
              uid: `google_${info.sub}`,
              displayName: info.name || info.given_name || 'Học viên Google',
              email: info.email,
              photoURL: info.picture || null,
              provider: 'google',
              createdAt: Date.now(),
            };

            resolve(profile);
          } catch (fetchErr) {
            reject(fetchErr instanceof Error ? fetchErr : new Error('Không thể lấy thông tin tài khoản Google.'));
          }
        },
      });

      client.requestAccessToken();
    } catch (err) {
      reject(err instanceof Error ? err : new Error('Khởi tạo Google OAuth thất bại.'));
    }
  });
}

// Global TypeScript declarations for Google GSI
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (res: { access_token?: string; error?: string }) => void;
            prompt?: string;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
        id: {
          initialize: (config: unknown) => void;
          prompt: () => void;
          renderButton: (parent: HTMLElement, options: unknown) => void;
        };
      };
    };
  }
}
