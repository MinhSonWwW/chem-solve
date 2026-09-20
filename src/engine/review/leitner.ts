export type LeitnerBox = 1 | 2 | 3 | 4 | 5;

export interface LeitnerCard {
  exerciseId: string;
  lessonId: string;
  box: LeitnerBox;
  lastReviewed: number; // timestamp in ms
  nextReviewDate: number; // timestamp in ms
  consecutiveCorrect: number;
  totalAttempts: number;
}

// Spaced repetition intervals in milliseconds for boxes 1 to 5 (1, 2, 4, 7, 14 days)
export const LEITNER_INTERVALS_MS: Record<LeitnerBox, number> = {
  1: 1 * 24 * 60 * 60 * 1000,
  2: 2 * 24 * 60 * 60 * 1000,
  3: 4 * 24 * 60 * 60 * 1000,
  4: 7 * 24 * 60 * 60 * 1000,
  5: 14 * 24 * 60 * 60 * 1000,
};

/**
 * Creates a brand new Leitner card in Box 1
 */
export function createLeitnerCard(
  exerciseId: string,
  lessonId: string,
  now = Date.now()
): LeitnerCard {
  return {
    exerciseId,
    lessonId,
    box: 1,
    lastReviewed: now,
    nextReviewDate: now + LEITNER_INTERVALS_MS[1],
    consecutiveCorrect: 0,
    totalAttempts: 1,
  };
}

/**
 * Updates a Leitner card after a review attempt:
 * - Correct on 1st try: advance to next box (up to Box 5)
 * - Incorrect or revealed: demote back to Box 1 immediately
 */
export function updateLeitnerCard(
  card: LeitnerCard,
  isCorrectFirstTry: boolean,
  now = Date.now()
): LeitnerCard {
  const totalAttempts = card.totalAttempts + 1;

  if (isCorrectFirstTry) {
    const nextBox = Math.min(5, card.box + 1) as LeitnerBox;
    const consecutiveCorrect = card.consecutiveCorrect + 1;
    return {
      ...card,
      box: nextBox,
      lastReviewed: now,
      nextReviewDate: now + LEITNER_INTERVALS_MS[nextBox],
      consecutiveCorrect,
      totalAttempts,
    };
  }

  // Failed or needed solution -> demoted to Box 1
  return {
    ...card,
    box: 1,
    lastReviewed: now,
    nextReviewDate: now + LEITNER_INTERVALS_MS[1],
    consecutiveCorrect: 0,
    totalAttempts,
  };
}

/**
 * Filters cards that are due for review (nextReviewDate <= now)
 * Sorted by oldest due date first, capped by maxLimit (default 10)
 */
export function getDueReviewCards(
  cards: LeitnerCard[],
  now = Date.now(),
  maxLimit = 10
): LeitnerCard[] {
  return cards
    .filter((c) => c.nextReviewDate <= now)
    .sort((a, b) => a.nextReviewDate - b.nextReviewDate)
    .slice(0, maxLimit);
}

/**
 * Computes the distribution of cards across the 5 Leitner boxes
 */
export function getLeitnerBoxStats(cards: LeitnerCard[]): Record<LeitnerBox, number> {
  const stats: Record<LeitnerBox, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const card of cards) {
    stats[card.box] = (stats[card.box] || 0) + 1;
  }
  return stats;
}

// Local storage repository helpers for client-side persistence
const LEITNER_STORAGE_KEY = 'chem_leitner_cards';

export function loadStoredLeitnerCards(): LeitnerCard[] {
  try {
    const raw = localStorage.getItem(LEITNER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredLeitnerCards(cards: LeitnerCard[]): void {
  try {
    localStorage.setItem(LEITNER_STORAGE_KEY, JSON.stringify(cards));
  } catch {
    // ignore
  }
}
