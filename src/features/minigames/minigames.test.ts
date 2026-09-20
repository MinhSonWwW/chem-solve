import { describe, it, expect } from 'vitest';
import {
  cleanIonSymbol,
  needsParens,
  buildCompoundFormula,
} from './FormulaBuilderGame';
import { normalizeSubstanceCategory } from './SortGame';
import { checkBalance } from '@/chem';
import trueFalseData from '@/content/kb/true-false-statements.json';
import reactionsData from '@/content/kb/reactions.json';

describe('Minigames Engine Tests', () => {
  describe('FormulaBuilderGame logic', () => {
    it('cleans ion charge symbols properly', () => {
      expect(cleanIonSymbol('Al^3+')).toBe('Al');
      expect(cleanIonSymbol('SO4^2-')).toBe('SO4');
      expect(cleanIonSymbol('OH^-')).toBe('OH');
      expect(cleanIonSymbol('NH4^+')).toBe('NH4');
      expect(cleanIonSymbol('Na^+')).toBe('Na');
      expect(cleanIonSymbol('PO4^3-')).toBe('PO4');
    });

    it('identifies polyatomic groups needing parentheses', () => {
      expect(needsParens('SO4')).toBe(true);
      expect(needsParens('OH')).toBe(true);
      expect(needsParens('NO3')).toBe(true);
      expect(needsParens('CO3')).toBe(true);
      expect(needsParens('NH4')).toBe(true);
      expect(needsParens('Cl')).toBe(false);
      expect(needsParens('O')).toBe(false);
      expect(needsParens('Br')).toBe(false);
      expect(needsParens('Al')).toBe(false);
    });

    it('constructs correct neutral chemical formulas', () => {
      expect(buildCompoundFormula('Na^+', 1, 'Cl^-', 1)).toBe('NaCl');
      expect(buildCompoundFormula('Ca^2+', 1, 'OH^-', 2)).toBe('Ca(OH)2');
      expect(buildCompoundFormula('Al^3+', 2, 'SO4^2-', 3)).toBe('Al2(SO4)3');
      expect(buildCompoundFormula('Fe^3+', 1, 'Cl^-', 3)).toBe('FeCl3');
      expect(buildCompoundFormula('NH4^+', 2, 'SO4^2-', 1)).toBe('(NH4)2SO4');
      expect(buildCompoundFormula('Ba^2+', 1, 'CO3^2-', 1)).toBe('BaCO3');
      expect(buildCompoundFormula('Mg^2+', 1, 'O^2-', 1)).toBe('MgO');
      expect(buildCompoundFormula('K^+', 1, 'NO3^-', 1)).toBe('KNO3');
    });
  });

  describe('SortGame logic', () => {
    it('normalizes substance categories to 4 target lab buckets', () => {
      expect(normalizeSubstanceCategory('acid')).toBe('acid');
      expect(normalizeSubstanceCategory('base')).toBe('base');
      expect(normalizeSubstanceCategory('oxide-acid')).toBe('oxide');
      expect(normalizeSubstanceCategory('oxide-base')).toBe('oxide');
      expect(normalizeSubstanceCategory('salt')).toBe('salt');
      expect(normalizeSubstanceCategory('metal')).toBeNull();
      expect(normalizeSubstanceCategory('non-metal')).toBeNull();
    });
  });

  describe('EquationBalanceGame reactions validation', () => {
    it('verifies default equations in reactions.json are chemically balanced and simplest', () => {
      for (const rx of reactionsData) {
        const result = checkBalance(rx.equation);
        expect(result.isBalanced, `Equation ${rx.equation} should be balanced`).toBe(true);
        expect(result.isSimplest, `Equation ${rx.equation} should have simplest coefficients`).toBe(true);
      }
    });

    it('detects unbalanced and unsimplified equations accurately', () => {
      const unbalanced = checkBalance('Al + HCl -> AlCl3 + H2');
      expect(unbalanced.isBalanced).toBe(false);

      const notSimplest = checkBalance('4Al + 12HCl -> 4AlCl3 + 6H2');
      expect(notSimplest.isBalanced).toBe(true);
      expect(notSimplest.isSimplest).toBe(false);

      const balanced = checkBalance('2Al + 6HCl -> 2AlCl3 + 3H2');
      expect(balanced.isBalanced).toBe(true);
      expect(balanced.isSimplest).toBe(true);
    });
  });

  describe('TrueFalse data integrity', () => {
    it('contains valid statements with explanation and topic', () => {
      expect(trueFalseData.length).toBeGreaterThanOrEqual(20);
      for (const item of trueFalseData) {
        expect(item.id).toBeDefined();
        expect(typeof item.statement).toBe('string');
        expect(item.statement.length).toBeGreaterThan(10);
        expect(typeof item.isTrue).toBe('boolean');
        expect(typeof item.explanation).toBe('string');
        expect(item.explanation.length).toBeGreaterThan(5);
        expect(typeof item.topic).toBe('string');
      }
    });
  });

  describe('ReactionBuilderGame logic', () => {
    it('verifies all reactions have reactants and products', () => {
      for (const rx of reactionsData) {
        expect(rx.reactants.length).toBeGreaterThan(0);
        expect(rx.products.length).toBeGreaterThan(0);
        const reactantStr = rx.reactants.map((r) => r.formula).sort().join(' + ');
        const productStr = rx.products.map((p) => p.formula).sort().join(' + ');
        expect(reactantStr).not.toBe(productStr);
      }
    });
  });
});

