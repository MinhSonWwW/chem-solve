import { create } from 'zustand';

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
  logout: () => void;
  clearError: () => void;
  setUser: (user: UserProfile) => void;
}

const STORAGE_KEY = 'chem_auth_user';

// Load persisted user
function loadPersistedUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function persistUser(user: UserProfile | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Simple mock user DB in localStorage
function getMockUsers(): Record<string, { password: string; profile: UserProfile }> {
  try {
    const raw = localStorage.getItem('chem_mock_users');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

function saveMockUsers(users: Record<string, { password: string; profile: UserProfile }>) {
  localStorage.setItem('chem_mock_users', JSON.stringify(users));
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
    return true;
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
