import { describe, it, expect } from 'vitest';
import { checkAnswer } from './index';
import type { Answer, CommonMistake } from '../../content/schema/exercise';

describe('engine/checkers', () => {
  describe('numericChecker', () => {
    const numAnswer: Answer = {
      kind: 'number',
      value: 4.958,
      unit: 'L',
      decimals: 2
    };

    const mistakes: CommonMistake[] = [
      {
        id: 'used-22.4',
        message: 'Bạn đã dùng 22,4 L thay vì 24,79 L.',
        trapAnswers: ['4.48', '4,48']
      }
    ];

    it('accepts correct number with comma and unit', () => {
      const res = checkAnswer(numAnswer, '4,96 L', mistakes);
      expect(res.status).toBe('correct');
    });

    it('accepts correct number with dot and unit', () => {
      const res = checkAnswer(numAnswer, '4.96L', mistakes);
      expect(res.status).toBe('correct');
    });

    it('warns partial for missing unit when expected', () => {
      const res = checkAnswer(numAnswer, '4,96', mistakes);
      expect(res.status).toBe('partial');
      if (res.status === 'partial') {
        expect(res.reason).toBe('missing-unit');
      }
    });

    it('detects trap answer and attaches mistakeId', () => {
      const res = checkAnswer(numAnswer, '4,48 L', mistakes);
      expect(res.status).toBe('incorrect');
      if (res.status === 'incorrect') {
        expect(res.mistakeId).toBe('used-22.4');
        expect(res.diagnosis).toContain('22,4');
      }
    });

    it('rejects wrong unit', () => {
      const res = checkAnswer(numAnswer, '4,96 ml', mistakes);
      expect(res.status).toBe('incorrect');
      if (res.status === 'incorrect') {
        expect(res.reason).toContain('Sai đơn vị');
      }
    });

    it('rejects completely wrong number', () => {
      const res = checkAnswer(numAnswer, '12,5 L', mistakes);
      expect(res.status).toBe('incorrect');
    });
  });

  describe('formulaChecker', () => {
    const formulaAnswer: Answer = {
      kind: 'formula',
      accepted: ['H2O']
    };

    it('accepts exact formula', () => {
      expect(checkAnswer(formulaAnswer, 'H2O').status).toBe('correct');
    });

    it('warns for non-canonical formula (OH2)', () => {
      const res = checkAnswer(formulaAnswer, 'OH2');
      expect(res.status).toBe('partial');
      if (res.status === 'partial') {
        expect(res.reason).toBe('noncanonical-formula');
      }
    });

    it('warns for wrong case (h2o)', () => {
      const res = checkAnswer(formulaAnswer, 'h2o');
      expect(res.status).toBe('partial');
      if (res.status === 'partial') {
        expect(res.reason).toBe('wrong-case');
      }
    });

    it('rejects incorrect formula (H2O2)', () => {
      const res = checkAnswer(formulaAnswer, 'H2O2');
      expect(res.status).toBe('incorrect');
    });
  });

  describe('equationChecker', () => {
    const eqAnswer: Answer = {
      kind: 'equation',
      mode: 'fill-coefficients',
      reactants: ['H2', 'O2'],
      products: ['H2O'],
      coefficients: [2, 1, 2]
    };

    it('accepts exact correct coefficients', () => {
      const res = checkAnswer(eqAnswer, [2, 1, 2]);
      expect(res.status).toBe('correct');
    });

    it('warns partial for balanced but not-simplest coefficients', () => {
      const res = checkAnswer(eqAnswer, [4, 2, 4]);
      expect(res.status).toBe('partial');
      if (res.status === 'partial') {
        expect(res.reason).toBe('not-simplest');
      }
    });

    it('rejects unbalanced coefficients and reports error', () => {
      const res = checkAnswer(eqAnswer, [1, 1, 1]);
      expect(res.status).toBe('incorrect');
    });

    it('verifies equation build mode correctly', () => {
      const buildAnswer: Answer = {
        kind: 'equation',
        mode: 'build',
        reactants: ['H2', 'O2'],
        products: ['H2O'],
        coefficients: [2, 1, 2]
      };

      expect(checkAnswer(buildAnswer, '2H2 + O2 -> 2H2O').status).toBe('correct');
      // Order of reactants swapped should still be correct
      expect(checkAnswer(buildAnswer, 'O2 + 2H2 -> 2H2O').status).toBe('correct');
      // Not simplest
      const notSimple = checkAnswer(buildAnswer, '4H2 + 2O2 -> 4H2O');
      expect(notSimple.status).toBe('partial');
    });
  });

  describe('choiceChecker', () => {
    it('checks mcq-single', () => {
      const ans: Answer = {
        kind: 'mcq-single',
        options: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }],
        correctId: 'b'
      };
      expect(checkAnswer(ans, 'b').status).toBe('correct');
      expect(checkAnswer(ans, 'a').status).toBe('incorrect');
    });

    it('checks mcq-multi with partial subset diagnosis', () => {
      const ans: Answer = {
        kind: 'mcq-multi',
        options: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }],
        correctIds: ['a', 'c']
      };
      expect(checkAnswer(ans, ['a', 'c']).status).toBe('correct');
      const subsetRes = checkAnswer(ans, ['a']);
      expect(subsetRes.status).toBe('incorrect');
      if (subsetRes.status === 'incorrect') {
        expect(subsetRes.reason).toContain('còn thiếu');
      }
    });

    it('checks true-false', () => {
      const ans: Answer = {
        kind: 'true-false',
        statements: [
          { id: 's1', text: 'St1', correct: true },
          { id: 's2', text: 'St2', correct: false }
        ]
      };
      expect(checkAnswer(ans, { s1: true, s2: false }).status).toBe('correct');
      expect(checkAnswer(ans, { s1: true, s2: true }).status).toBe('incorrect');
    });
  });

  describe('matchSortChecker', () => {
    it('checks match pairs', () => {
      const ans: Answer = {
        kind: 'match',
        pairs: [
          { left: 'HCl', right: 'Acid' },
          { left: 'NaOH', right: 'Base' }
        ]
      };
      expect(
        checkAnswer(ans, [
          { left: 'HCl', right: 'Acid' },
          { left: 'NaOH', right: 'Base' }
        ]).status
      ).toBe('correct');
    });

    it('checks ordering sequence', () => {
      const ans: Answer = {
        kind: 'ordering',
        correctOrder: ['step1', 'step2', 'step3']
      };
      expect(checkAnswer(ans, ['step1', 'step2', 'step3']).status).toBe('correct');
      expect(checkAnswer(ans, ['step2', 'step1', 'step3']).status).toBe('incorrect');
    });
  });
});
