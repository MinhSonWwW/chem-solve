import { describe, it, expect, beforeEach } from 'vitest';
import { useOnboarding } from './useOnboarding';
import { renderHook, act } from '@testing-library/react';

describe('Interactive Welcome Onboarding Tour (A-Z)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('detects new user as needing onboarding walkthrough', () => {
    const { result } = renderHook(() => useOnboarding());
    expect(result.current.hasCompletedOnboarding).toBe(false);
    expect(result.current.shouldShowOnboarding).toBe(true);
  });

  it('marks onboarding as completed and persists to localStorage', () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.completeOnboarding();
    });

    expect(result.current.hasCompletedOnboarding).toBe(true);
    expect(result.current.shouldShowOnboarding).toBe(false);

    // Verify localStorage persistence
    const stored = localStorage.getItem('chem_onboarding_completed_guest');
    expect(stored).toBe('true');
  });

  it('allows user to reset and replay the walkthrough from profile settings', () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.completeOnboarding();
    });
    expect(result.current.hasCompletedOnboarding).toBe(true);

    act(() => {
      result.current.resetOnboarding();
    });
    expect(result.current.hasCompletedOnboarding).toBe(false);
    expect(result.current.shouldShowOnboarding).toBe(true);
  });
});
