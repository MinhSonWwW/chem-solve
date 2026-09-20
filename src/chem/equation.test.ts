import { describe, it, expect } from 'vitest';
import { parseEquation } from './parseEquation';
import { checkBalance, areSimplestCoefficients, simplestCoefficients } from './checkBalance';

describe('chem/equation', () => {
  describe('parseEquation', () => {
    it('parses standard equations', () => {
      const eq = parseEquation('2H2 + O2 -> 2H2O');
      expect(eq.reactants).toEqual([
        { formula: 'H2', coefficient: 2 },
        { formula: 'O2', coefficient: 1 }
      ]);
      expect(eq.products).toEqual([
        { formula: 'H2O', coefficient: 2 }
      ]);
    });

    it('handles equations with states and visual indicators', () => {
      const eq = parseEquation('Fe (s) + 2HCl (aq) -> FeCl2 (dd) + H2 (k) [[up]]');
      expect(eq.reactants).toEqual([
        { formula: 'Fe', coefficient: 1 },
        { formula: 'HCl', coefficient: 2 }
      ]);
      expect(eq.products).toEqual([
        { formula: 'FeCl2', coefficient: 1 },
        { formula: 'H2', coefficient: 1 }
      ]);
    });

    it('extracts conditions when present', () => {
      const eq = parseEquation('CaCO3 ->|t°| CaO + CO2');
      expect(eq.condition).toBe('t°');
      expect(eq.reactants[0].formula).toBe('CaCO3');
    });

    it('throws error for equations without valid arrow', () => {
      expect(() => parseEquation('2H2 + O2')).toThrowError(/missing '->' or '='/);
    });
  });

  describe('checkBalance', () => {
    it('identifies balanced equations with simplest coefficients', () => {
      const res = checkBalance('2H2 + O2 -> 2H2O');
      expect(res.isBalanced).toBe(true);
      expect(res.isSimplest).toBe(true);
      expect(res.imbalances).toHaveLength(0);
    });

    it('identifies balanced equations that are NOT in simplest ratio', () => {
      const res = checkBalance('4H2 + 2O2 -> 4H2O');
      expect(res.isBalanced).toBe(true);
      expect(res.isSimplest).toBe(false);
      expect(res.feedbackMessage).toContain('chưa ở tỉ lệ tối giản');
    });

    it('accurately identifies unbalanced elements and atom count discrepancy', () => {
      const res = checkBalance('H2 + O2 -> H2O');
      expect(res.isBalanced).toBe(false);
      expect(res.imbalances).toEqual([
        { element: 'O', left: 2, right: 1, diff: -1 }
      ]);
      expect(res.feedbackMessage).toContain('nguyên tố O');
      expect(res.feedbackMessage).toContain('vế trái có 2');
      expect(res.feedbackMessage).toContain('vế phải có 1');
    });

    it('works with complex equations with parentheses', () => {
      // Ba(OH)2 + H2SO4 -> BaSO4 + 2H2O
      const res = checkBalance('Ba(OH)2 + H2SO4 -> BaSO4 + 2H2O');
      expect(res.isBalanced).toBe(true);
      expect(res.isSimplest).toBe(true);
    });
  });

  describe('simplestCoefficients', () => {
    it('reduces non-simplest integer ratios', () => {
      expect(areSimplestCoefficients([4, 2, 4])).toBe(false);
      expect(simplestCoefficients([4, 2, 4])).toEqual([2, 1, 2]);
      expect(simplestCoefficients([6, 3, 6])).toEqual([2, 1, 2]);
      expect(simplestCoefficients([2, 1, 2])).toEqual([2, 1, 2]);
    });
  });
});
