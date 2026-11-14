/**
 * Heart reward for practice: +1 heart when a round is done well (≥ 75 % correct),
 * at most once per practice unit per day, so a student cannot farm one easy round.
 */
export const PRACTICE_HEART_MIN_ACCURACY = 0.75;

/** `${lessonId}:${nodeId}` → last day (YYYY-MM-DD, local time) that unit gave a heart. */
export type PracticeHeartLog = Record<string, string>;

export function localDay(now: number): string {
  const d = new Date(now);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export type PracticeHeartDecision =
  | { award: true; log: PracticeHeartLog }
  | { award: false; reason: 'low-accuracy' | 'already-today' | 'hearts-full'; log: PracticeHeartLog };

export function decidePracticeHeart(o: {
  unitKey: string;
  accuracy: number;
  hearts: number;
  maxHearts: number;
  log: PracticeHeartLog;
  now: number;
}): PracticeHeartDecision {
  const today = localDay(o.now);
  if (o.accuracy < PRACTICE_HEART_MIN_ACCURACY) return { award: false, reason: 'low-accuracy', log: o.log };
  if (o.log[o.unitKey] === today) return { award: false, reason: 'already-today', log: o.log };
  if (o.hearts >= o.maxHearts) return { award: false, reason: 'hearts-full', log: o.log };
  // Keep only today's entries so the log never grows.
  const kept = Object.fromEntries(Object.entries(o.log).filter(([, day]) => day === today));
  return { award: true, log: { ...kept, [o.unitKey]: today } };
}

const LOG_KEY = 'sci_practice_heart_days';
export function loadPracticeHeartLog(): PracticeHeartLog {
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) || '{}') as PracticeHeartLog;
  } catch {
    return {};
  }
}
export function savePracticeHeartLog(log: PracticeHeartLog) {
  try {
    localStorage.setItem(LOG_KEY, JSON.stringify(log));
  } catch {
    /* storage unavailable */
  }
}
