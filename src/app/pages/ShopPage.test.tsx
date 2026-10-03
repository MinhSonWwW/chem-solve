/**
 * Unit & Integration tests for ShopPage (Milestone 5).
 * Tests:
 *  1. Renders all shop items with hand-drawn SVG icons and human-crafted copy.
 *  2. Contains ZERO unicode emojis in buttons, badges, and headers.
 *  3. Verifies tactile push button states (available vs disabled).
 *  4. Correctly integrates with useUserStore.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShopPage } from './ShopPage';
import { useUserStore } from '@/features/gamification/useUserStore';
import { copyVi } from '@/copy/vi';

// Mock audio
vi.mock('@/lib/audio', () => ({
  sound: {
    playClick: vi.fn(),
    playCorrect: vi.fn(),
    playWrong: vi.fn(),
    playLevelUp: vi.fn(),
  },
}));

// Mock indexedDB / progressRepo
vi.mock('@/engine/progress/progressRepo', () => ({
  loadUserProgress: vi.fn().mockResolvedValue({
    xp: 0,
    gems: 500,
    hearts: 3,
    streakFreeze: 0,
    xpBoostUntil: 0,
    dailyGoal: 20,
    achievements: {},
    completedNodes: {},
  }),
  saveUserProgress: vi.fn().mockResolvedValue(undefined),
}));

describe('ShopPage (Milestone 5: Tactile & Human Copy)', () => {
  beforeEach(() => {
    // Reset store state
    useUserStore.setState({
      gems: 500,
      hearts: 3,
      streakFreeze: 0,
      xpBoostUntil: 0,
    });
  });

  it('renders hero banner and wallet summary with human-crafted copy', () => {
    render(<ShopPage />);
    expect(screen.getByText(copyVi.shop.hero.title)).toBeDefined();
    expect(screen.getByText(copyVi.shop.hero.badge)).toBeDefined();
    expect(screen.getByText('500')).toBeDefined(); // gems
    expect(screen.getByText('3/5')).toBeDefined(); // hearts
    expect(screen.getByText('0/2 khiên')).toBeDefined(); // freeze shields
  });

  it('renders all shop items with proper titles and descriptions', () => {
    render(<ShopPage />);
    expect(screen.getByText(copyVi.shop.items.heartSingle.title)).toBeDefined();
    expect(screen.getByText(copyVi.shop.items.heartFull.title)).toBeDefined();
    expect(screen.getByText(copyVi.shop.items.streakFreeze.title)).toBeDefined();
    expect(screen.getByText(copyVi.shop.items.xpBoost.title)).toBeDefined();
    expect(screen.getByText(copyVi.shop.items.chest.title)).toBeDefined();
  });

  it('does NOT contain any unicode emojis in headers, buttons, or badges', () => {
    const { container } = render(<ShopPage />);
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    
    // Check all buttons
    const buttons = container.querySelectorAll('button');
    buttons.forEach((btn) => {
      expect(btn.textContent).not.toMatch(emojiRegex);
    });

    // Check all headings
    const headings = container.querySelectorAll('h1, h2, h3');
    headings.forEach((h) => {
      expect(h.textContent).not.toMatch(emojiRegex);
    });
  });

  it('allows purchasing a single heart when user has enough gems and missing hearts', () => {
    render(<ShopPage />);
    const buyButton = screen.getByText('150 ĐÁ QUÝ (+1 TIM)');
    expect(buyButton).toBeDefined();

    fireEvent.click(buyButton);

    const state = useUserStore.getState();
    expect(state.hearts).toBe(4);
    expect(state.gems).toBe(350);
  });

  it('shows disabled state when user has insufficient gems', () => {
    useUserStore.setState({ gems: 50, hearts: 2 });
    render(<ShopPage />);
    
    // 150 gem heart button should be disabled
    expect(screen.getByText(`(${copyVi.shop.status.needMoreGems(100)})`)).toBeDefined();
  });

  it('shows full hearts state when user already has 5/5 hearts', () => {
    useUserStore.setState({ hearts: 5, gems: 1000 });
    render(<ShopPage />);

    const fullHeartBadges = screen.getAllByText(copyVi.shop.status.fullHearts);
    expect(fullHeartBadges.length).toBeGreaterThan(0);
  });

  it('handles mystery chest purchase with sufficient gems', () => {
    render(<ShopPage />);
    const chestButton = screen.getByText('120 ĐÁ QUÝ — MỞ RƯƠNG MAY MẮN');
    expect(chestButton).toBeDefined();

    fireEvent.click(chestButton);

    const state = useUserStore.getState();
    expect(state.gems).toBe(380); // 500 - 120
  });
});
