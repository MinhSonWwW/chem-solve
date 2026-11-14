/**
 * Builds one practice round for a unit: a few questions drawn from the unit's pool, preferring
 * questions not seen in the last rounds, plus fresh generated ones for calculation units.
 */
import type { Exercise } from '@/content/schema/exercise';
import { PRACTICE_ROUND_SIZE, practiceQuestionToExercise, type PracticeBank, type PracticeUnit } from '@/content/schema/practice';
import { PRACTICE_GENERATORS } from '@/content/generators/practiceGenerators';

/** How many questions of the round come from the generator (when the unit has one). */
const GENERATED_PER_ROUND = 2;

export interface RoundOptions {
  size?: number;
  /** Exercise ids shown in recent rounds of this unit (avoid repeating them). */
  recent?: string[];
  random?: () => number;
}

/** Every fixed question of a unit as full exercises (existing curriculum + extra practice questions). */
export function unitPool(bank: PracticeBank, unit: PracticeUnit, lessonExercises: Exercise[]): Exercise[] {
  const byId = new Map(lessonExercises.map((e) => [e.id, e]));
  const existing = unit.fromExercises.map((id) => byId.get(id)).filter((e): e is Exercise => !!e);
  const fallbackSkills = existing[0]?.skillIds ?? lessonExercises[0]?.skillIds ?? [];
  const extra = unit.questions.map((q) => practiceQuestionToExercise(bank.lessonId, unit, q, fallbackSkills));
  return [...existing, ...extra];
}

function shuffle<T>(xs: T[], r: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildPracticeRound(
  bank: PracticeBank,
  unit: PracticeUnit,
  lessonExercises: Exercise[],
  { size = PRACTICE_ROUND_SIZE, recent = [], random = Math.random }: RoundOptions = {}
): Exercise[] {
  const gen = unit.generator ? PRACTICE_GENERATORS[unit.generator] : undefined;
  const generatedCount = gen ? Math.min(GENERATED_PER_ROUND, size) : 0;
  const pool = shuffle(unitPool(bank, unit, lessonExercises), random);
  const seen = new Set(recent);
  // Unseen questions first, then the least recently seen.
  const order = [...pool.filter((e) => !seen.has(e.id)), ...pool.filter((e) => seen.has(e.id)).sort((a, b) => recent.indexOf(a.id) - recent.indexOf(b.id))];
  const fixed = order.slice(0, Math.max(0, size - generatedCount));
  const generated = Array.from({ length: gen ? size - fixed.length : 0 }, (_, i) => {
    const ex = gen!(random);
    const tag = Math.floor(random() * 1e6).toString(36);
    return { ...ex, id: `${bank.lessonId}-p-${unit.id}-g${i}-${tag}`, lessonId: bank.lessonId };
  });
  // Shuffle MCQ options too, so the right answer is not always where the author wrote it.
  return shuffle([...fixed, ...generated], random).map((e) =>
    e.answer.kind === 'mcq-single' || e.answer.kind === 'mcq-multi'
      ? { ...e, answer: { ...e.answer, options: shuffle(e.answer.options, random) } }
      : e
  );
}

// ── Recently seen questions per unit (device-local) ──
const RECENT_KEY = 'sci_practice_recent';
const RECENT_LIMIT = 8;

export function loadRecent(lessonId: string, unitId: string): string[] {
  try {
    return (JSON.parse(localStorage.getItem(RECENT_KEY) || '{}') as Record<string, string[]>)[`${lessonId}:${unitId}`] ?? [];
  } catch {
    return [];
  }
}

export function rememberRound(lessonId: string, unitId: string, ids: string[]) {
  try {
    const all = JSON.parse(localStorage.getItem(RECENT_KEY) || '{}') as Record<string, string[]>;
    const key = `${lessonId}:${unitId}`;
    // Generated questions are unique every time, no need to remember them.
    const fixed = ids.filter((id) => !/-g\d+-[a-z0-9]+$/.test(id));
    all[key] = [...fixed, ...(all[key] ?? []).filter((id) => !fixed.includes(id))].slice(0, RECENT_LIMIT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable */
  }
}
