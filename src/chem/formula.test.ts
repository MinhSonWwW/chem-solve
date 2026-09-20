import { describe, it, expect } from 'vitest';
import { parseChemicalFormula } from './formula';

describe('parseChemicalFormula', () => {
  it('correctly parses simple formula H2O', () => {
    const result = parseChemicalFormula('H2O');
    expect(result).toEqual([
      { symbol: 'H', count: 2 },
      { symbol: 'O', count: 1 }
    ]);
  });

  it('correctly parses H2SO4', () => {
    const result = parseChemicalFormula('H2SO4');
    expect(result).toEqual([
      { symbol: 'H', count: 2 },
      { symbol: 'S', count: 1 },
      { symbol: 'O', count: 4 }
    ]);
  });
});
