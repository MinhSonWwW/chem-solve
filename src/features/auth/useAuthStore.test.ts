import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.getState().logout();
  });

  it('initializes in unauthenticated state when localStorage is empty', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('registers a new user successfully', async () => {
    const success = await useAuthStore
      .getState()
      .registerWithEmail('Nhà Hóa Học', 'test@example.com', 'password123');

    expect(success).toBe(true);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.displayName).toBe('Nhà Hóa Học');
    expect(state.user?.email).toBe('test@example.com');
    expect(state.user?.provider).toBe('email');
  });

  it('prevents registering duplicate emails', async () => {
    await useAuthStore.getState().registerWithEmail('User 1', 'dupe@example.com', 'pass123');
    useAuthStore.getState().logout();

    const success = await useAuthStore
      .getState()
      .registerWithEmail('User 2', 'dupe@example.com', 'pass456');

    expect(success).toBe(false);
    expect(useAuthStore.getState().error).toContain('đã được đăng ký');
  });

  it('logs in with registered credentials', async () => {
    await useAuthStore.getState().registerWithEmail('Minh Sơn', 'son@example.com', 'secret999');
    useAuthStore.getState().logout();

    const success = await useAuthStore.getState().loginWithEmail('son@example.com', 'secret999');
    expect(success).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.displayName).toBe('Minh Sơn');
  });

  it('fails login with wrong password', async () => {
    await useAuthStore.getState().registerWithEmail('Minh Sơn', 'son2@example.com', 'secret999');
    useAuthStore.getState().logout();

    const success = await useAuthStore.getState().loginWithEmail('son2@example.com', 'wrongpass');
    expect(success).toBe(false);
    expect(useAuthStore.getState().error).toContain('Mật khẩu không chính xác');
  });

  it('logs in via social providers (Google/Facebook/GitHub)', async () => {
    const success = await useAuthStore.getState().loginWithSocial('google');
    expect(success).toBe(true);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.provider).toBe('google');
  });

  it('logs out properly', async () => {
    await useAuthStore.getState().loginWithSocial('facebook');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
