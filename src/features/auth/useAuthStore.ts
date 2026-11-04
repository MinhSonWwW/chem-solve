import { create } from 'zustand';
import { setCookie, getCookie, deleteCookie } from '@/lib/cookies';
import { signInWithGoogleReal } from '@/lib/googleAuth';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  provider: 'email' | 'google' | 'facebook' | 'github';
  createdAt: number;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  registerWithEmail: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithSocial: (provider: 'google' | 'facebook' | 'github') => Promise<boolean>;
  loginWithGoogleReal: (customClientId?: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: UserProfile) => void;
}

const STORAGE_KEY = 'chem_auth_user';
const TOKEN_KEY = 'chem_auth_token';

// Load persisted user across LocalStorage and Cookies
function loadPersistedUser(): UserProfile | null {
  // 1. Try LocalStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const user = JSON.parse(raw);
      if (user && user.uid) return user;
    }
  } catch { /* ignore */ }

  // 2. Fallback to Cookie
  try {
    const cookieRaw = getCookie(STORAGE_KEY);
    if (cookieRaw) {
      const user = JSON.parse(cookieRaw);
      if (user && user.uid) {
        // Self-heal: restore to localStorage
        try {
          localStorage.setItem(STORAGE_KEY, cookieRaw);
        } catch { /* ignore */ }
        return user;
      }
    }
  } catch { /* ignore */ }

  return null;
}

function persistUser(user: UserProfile | null) {
  if (user) {
    const str = JSON.stringify(user);
    // 1. Save to LocalStorage
    try {
      localStorage.setItem(STORAGE_KEY, str);
    } catch { /* ignore */ }

    // 2. Save to Cookies (365 days)
    setCookie(STORAGE_KEY, str, 365);
    setCookie(TOKEN_KEY, user.uid, 365);
  } else {
    // 1. Remove from LocalStorage
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }

    // 2. Remove Cookies
    deleteCookie(STORAGE_KEY);
    deleteCookie(TOKEN_KEY);
  }
}

// Resilient mock user DB across LocalStorage
function getMockUsers(): Record<string, { password: string; profile: UserProfile }> {
  try {
    const raw = localStorage.getItem('chem_mock_users');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function saveMockUsers(users: Record<string, { password: string; profile: UserProfile }>) {
  try {
    const json = JSON.stringify(users);
    localStorage.setItem('chem_mock_users', json);
    localStorage.setItem('chem_mock_users_backup', json);
  } catch { /* ignore */ }
}

function notifyProgressReload() {
  try {
    import('@/features/gamification/useUserStore').then((m) => {
      m.useUserStore.getState().restoreProgress().catch(console.error);
    });
  } catch { /* ignore */ }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: loadPersistedUser(),
  isAuthenticated: !!loadPersistedUser(),
  isLoading: false,
  error: null,

  loginWithEmail: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));

    const users = getMockUsers();
    const userEntry = users[email.toLowerCase()];

    if (!userEntry) {
      set({ isLoading: false, error: 'Không tìm thấy tài khoản với email này.' });
      return false;
    }

    if (userEntry.password !== password) {
      set({ isLoading: false, error: 'Mật khẩu không chính xác. Vui lòng thử lại.' });
      return false;
    }

    persistUser(userEntry.profile);
    set({ user: userEntry.profile, isAuthenticated: true, isLoading: false, error: null });
    notifyProgressReload();
    return true;
  },

  registerWithEmail: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));

    const users = getMockUsers();
    if (users[email.toLowerCase()]) {
      set({ isLoading: false, error: 'Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.' });
      return false;
    }

    const profile: UserProfile = {
      uid: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      displayName: name,
      email: email.toLowerCase(),
      photoURL: null,
      provider: 'email',
      createdAt: Date.now(),
    };

    users[email.toLowerCase()] = { password, profile };
    saveMockUsers(users);
    persistUser(profile);
    set({ user: profile, isAuthenticated: true, isLoading: false, error: null });
    notifyProgressReload();
    return true;
  },

  loginWithSocial: async (provider: 'google' | 'facebook' | 'github') => {
    set({ isLoading: true, error: null });

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 600));

    const providerNames = { google: 'Google', facebook: 'Facebook', github: 'GitHub' };
    const profile: UserProfile = {
      uid: `${provider}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      displayName: `Nhà Khoa Học ${providerNames[provider]}`,
      email: `user@${provider}.example.com`,
      photoURL: null,
      provider,
      createdAt: Date.now(),
    };

    persistUser(profile);
    set({ user: profile, isAuthenticated: true, isLoading: false, error: null });
    notifyProgressReload();
    return true;
  },

  loginWithGoogleReal: async (customClientId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await signInWithGoogleReal(customClientId);
      persistUser(profile);
      set({ user: profile, isAuthenticated: true, isLoading: false, error: null });
      notifyProgressReload();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'MISSING_CLIENT_ID') {
        set({ isLoading: false });
        throw err;
      }
      set({ isLoading: false, error: msg });
      return false;
    }
  },

  logout: () => {
    persistUser(null);
    set({ user: null, isAuthenticated: false, isLoading: false, error: null });
  },

  clearError: () => set({ error: null }),

  setUser: (user: UserProfile) => {
    persistUser(user);
    set({ user, isAuthenticated: true });
  },
}));
