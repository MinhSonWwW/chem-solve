/**
 * Gamification constants — single source of truth.
 * Tuned per PLAN.md §10.
 */
export const GAMIFICATION = {
  xp: {
    /** XP earned per correct answer by attempt number */
    attempt1: 10,
    attempt2: 6,
    attempt3: 3,
    /** XP when solution is revealed */
    revealed: 0,
    /** XP deducted when using hint level 2 or revealing steps */
    hintDeduction: 2,
    /** Minimum XP per correct answer (after deductions) */
    minXp: 3,
  },
  combo: {
    /** Consecutive correct answers needed for combo bonuses */
    threshold3: { count: 3, bonus: 2 },
    threshold5: { count: 5, bonus: 5 },
  },
  session: {
    /** Bonus XP for completing a session (chặng) */
    completeBonus: 20,
    /** Extra bonus if no hearts were lost */
    perfectBonus: 10,
  },
  hearts: {
    /** Maximum hearts */
    max: 5,
    /** Minutes to recover 1 heart */
    recoveryMinutes: 20,
    /** Hearts restored when completing a review exercise */
    reviewRestore: 1,
  },
  unlock: {
    /** Minimum accuracy (non-revealed) to unlock next node */
    minAccuracy: 0.7,
  },
  dailyGoals: [20, 40, 60] as const,
  maxAttempts: 3,
} as const;

export type GamificationConfig = typeof GAMIFICATION;

/**
 * Level formula per PLAN.md §10:
 * xpToReach(n) = 50 * n * (n - 1)
 * L1 = 0, L2 = 100, L3 = 300, L4 = 600, L5 = 1000...
 */
export function xpToReachLevel(level: number): number {
  if (level <= 1) return 0;
  return 50 * level * (level - 1);
}

export function getLevelInfo(totalXp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  let level = 1;
  while (totalXp >= xpToReachLevel(level + 1)) {
    level++;
  }
  const currentFloor = xpToReachLevel(level);
  const nextCeiling = xpToReachLevel(level + 1);
  const progressInLevel = totalXp - currentFloor;
  const neededForNext = nextCeiling - currentFloor;
  const progressPercent = Math.min(100, Math.round((progressInLevel / neededForNext) * 100));

  return {
    level,
    currentLevelXp: progressInLevel,
    nextLevelXp: neededForNext,
    progressPercent,
  };
}

