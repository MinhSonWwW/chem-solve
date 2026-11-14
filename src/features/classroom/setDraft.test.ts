import { describe, it, expect } from 'vitest';
import { ANSWER_KINDS, ExerciseSetInputSchema, answerProblem } from '@/content/schema/teacherSet';
import { cleanAnswer, cleanQuestion, equationWarning, newAnswer, newQuestion, nextId } from './setDraft';

describe('teacher set editor helpers', () => {
  it('creates an empty answer for every kind, which the validator then flags (never silently accepted)', () => {
    for (const kind of ANSWER_KINDS) {
      const a = newAnswer(kind);
      expect(a.kind).toBe(kind);
      expect(answerProblem(cleanAnswer(a))).not.toBeNull();
    }
  });

  it('numbers questions without reusing ids', () => {
    const q1 = newQuestion([]);
    const q2 = newQuestion([q1]);
    expect([q1.id, q2.id]).toEqual(['q1', 'q2']);
    expect(newQuestion([q2]).id).toBe('q3'); // q2 still taken after q1 is deleted
    expect(nextId('o', ['o1', 'o2', 'o4'])).toBe('o5');
    expect(nextId('o', ['o2'])).toBe('o3');
  });

  it('cleans blanks before saving', () => {
    expect(cleanAnswer({ kind: 'text', accepted: [' quang hợp ', '', '  '] })).toEqual({ kind: 'text', accepted: ['quang hợp'] });
    expect(cleanAnswer({ kind: 'formula-builder', tiles: ['H', ' ', '2', 'O'], accepted: ['H 2 O'] })).toEqual({
      kind: 'formula-builder',
      tiles: ['H', '2', 'O'],
      accepted: ['H2O'],
    });
    const q = cleanQuestion({ id: 'q1', prompt: '  Đề  ', difficulty: 1, hint: '  ', answer: { kind: 'number', value: 2, unit: ' ' } });
    expect(q.prompt).toBe('Đề');
    expect(q.hint).toBeUndefined();
    expect(q.answer).toEqual({ kind: 'number', value: 2, unit: undefined });
  });

  it('a cleaned, filled-in question passes the server schema', () => {
    const q = cleanQuestion({
      id: 'q1',
      prompt: 'Chất nào là acid?',
      difficulty: 2,
      answer: { kind: 'mcq-single', options: [{ id: 'o1', label: ' HCl ' }, { id: 'o2', label: 'NaOH' }], correctId: 'o1' },
    });
    expect(ExerciseSetInputSchema.safeParse({ title: 'Acid', subject: 'chem', grade: 8, questions: [q] }).success).toBe(true);
  });

  it.each<[string, number[], string | null]>([
    ['balanced', [2, 1, 2], null],
    ['unbalanced', [1, 1, 1], 'Phương trình chưa cân bằng với các hệ số này.'],
    ['not simplest', [4, 2, 4], 'Hệ số chưa tối giản.'],
  ])('equation warning: %s', (_n, coefficients, expected) => {
    expect(equationWarning({ kind: 'equation', mode: 'fill-coefficients', reactants: ['H2', 'O2'], products: ['H2O'], coefficients })).toBe(expected);
  });

  it('does not warn while the equation is still being typed', () => {
    expect(equationWarning({ kind: 'equation', mode: 'build', reactants: ['H2', ''], products: ['H2O'], coefficients: [2, 1, 2] })).toBeNull();
  });
});
