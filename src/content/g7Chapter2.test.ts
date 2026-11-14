import { describe, it, expect } from 'vitest';
import { loadExercises, loadExercisesForNode, loadTheory } from './contentLoader';
import { findLesson } from './curriculum';
import { SKILLS } from './skills';
import { checkAnswer } from '@/engine/checkers';
import type { Answer } from './schema/exercise';

/** The input a student would give when answering perfectly. */
function perfectInput(answer: Answer): unknown {
  switch (answer.kind) {
    case 'mcq-single':
      return answer.correctId;
    case 'mcq-multi':
      return answer.correctIds;
    case 'number':
      return String(answer.value);
    case 'formula':
    case 'formula-builder':
    case 'text':
      return answer.accepted[0];
    case 'true-false':
      return Object.fromEntries(answer.statements.map((s) => [s.id, s.correct]));
    case 'match':
      return answer.pairs;
    case 'sort':
      return Object.fromEntries(answer.items.map((i) => [i.id, i.bucketId]));
    case 'ordering':
      return answer.correctOrder;
    case 'equation':
      return answer.coefficients;
  }
}

describe('Hóa 7 – Chương 2 (Bài 5, Bài 6)', () => {
  for (const lessonId of ['g7-b05', 'g7-b06']) {
    it(`${lessonId}: is registered with theory + two 6-question nodes`, async () => {
      const lesson = findLesson(lessonId);
      expect(lesson?.ready).toBe(true);

      const theory = await loadTheory(lessonId);
      expect(theory?.cards.length).toBeGreaterThanOrEqual(4);
      expect(theory?.quickCheck?.options.filter((o) => o.correct)).toHaveLength(1);

      const all = await loadExercises(lessonId);
      expect(all).toHaveLength(12);
      const n01 = await loadExercisesForNode(lessonId, `${lessonId}-n01`);
      const n02 = await loadExercisesForNode(lessonId, `${lessonId}-n02`);
      expect(n01).toHaveLength(6);
      expect(n02).toHaveLength(6);
      expect(new Set([...n01, ...n02].map((e) => e.id)).size).toBe(12);
    });

    it(`${lessonId}: every correct answer is accepted by the real checker`, async () => {
      for (const ex of await loadExercises(lessonId)) {
        const verdict = checkAnswer(ex.answer, perfectInput(ex.answer), ex.commonMistakes);
        expect(verdict.status, `${ex.id}: ${JSON.stringify(verdict)}`).toBe('correct');
        for (const skill of ex.skillIds) {
          expect(SKILLS.some((s) => s.id === skill), `${ex.id} skill ${skill}`).toBe(true);
        }
      }
    });
  }

  it('flags the classic valence mistakes', async () => {
    const ex = (await loadExercises('g7-b06')).find((e) => e.id === 'g7-b06-formula-001')!;
    expect(checkAnswer(ex.answer, 'Ca(OH)2').status).toBe('correct');
    expect(checkAnswer(ex.answer, 'CaOH').status).toBe('incorrect');
    const al = (await loadExercises('g7-b06')).find((e) => e.id === 'g7-b06-build-001')!;
    expect(checkAnswer(al.answer, 'AlO').status).toBe('incorrect');
  });
});
