import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/features/auth/useAuthStore';

const STORAGE_PREFIX = 'chem_onboarding_completed_';

export function useOnboarding() {
  const { user } = useAuthStore();
  const storageKey = `${STORAGE_PREFIX}${user?.uid || 'guest'}`;

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const val = localStorage.getItem(storageKey);
      return val === 'true';
    } catch {
      return false;
    }
  });

  // Keep in sync when user changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const val = localStorage.getItem(storageKey);
      setHasCompletedOnboarding(val === 'true');
    } catch {
      setHasCompletedOnboarding(false);
    }
  }, [storageKey]);

  const completeOnboarding = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, 'true');
      } catch {
        // Ignore
      }
    }
    setHasCompletedOnboarding(true);
  }, [storageKey]);

  const resetOnboarding = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // Ignore
      }
    }
    setHasCompletedOnboarding(false);
  }, [storageKey]);

  return {
    hasCompletedOnboarding,
    completeOnboarding,
    resetOnboarding,
    shouldShowOnboarding: !hasCompletedOnboarding,
  };
}
