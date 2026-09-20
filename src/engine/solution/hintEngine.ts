import type { Exercise, SolutionStep, Hint } from '../../content/schema/exercise';

export interface HintStateView {
  canRequestHint1: boolean;
  canRequestHint2: boolean;
  canRevealStep: boolean;
  canRevealAll: boolean;
  visibleHints: Hint[];
  visibleSteps: SolutionStep[];
}

/**
 * Provides progressive ladder support for exercises:
 * Hint 1 (gợi mở) -> Hint 2 (nhắc công thức/quy tắc) -> Steps (từng bước) -> Full solution.
 */
export function getHintStateView(
  exercise: Exercise,
  hintsUsed: number,
  stepsRevealedCount: number
): HintStateView {
  const visibleHints = exercise.hints.slice(0, hintsUsed);
  const visibleSteps = exercise.steps.slice(0, stepsRevealedCount);

  const canRequestHint1 = hintsUsed < 1 && exercise.hints.length >= 1;
  const canRequestHint2 = hintsUsed === 1 && exercise.hints.length >= 2;
  const canRevealStep = stepsRevealedCount < exercise.steps.length;
  const canRevealAll = stepsRevealedCount < exercise.steps.length;

  return {
    canRequestHint1,
    canRequestHint2,
    canRevealStep,
    canRevealAll,
    visibleHints,
    visibleSteps
  };
}

/**
 * Replaces rich text markers like [[H2SO4]] into plain chemical formulas or HTML tags.
 */
export function renderRichText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\[\[([A-Za-z0-9.+^-]+)\]\]/g, '$1')
    .replace(/\[\[up\]\]/g, '↑')
    .replace(/\[\[down\]\]/g, '↓');
}
