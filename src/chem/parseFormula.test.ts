import { describe, it, expect } from 'vitest';
import { parseFormula } from './parseFormula';

describe('chem/parseFormula', () => {
  it('parses simple formulas', () => {
    expect(parseFormula('H2').elements).toEqual({ H: 2 });
    expect(parseFormula('O2').elements).toEqual({ O: 2 });
    expect(parseFormula('NaCl').elements).toEqual({ Na: 1, Cl: 1 });
    expect(parseFormula('H2SO4').elements).toEqual({ H: 2, S: 1, O: 4 });
  });

  it('parses nested parentheses and brackets', () => {
    expect(parseFormula('Ca(OH)2').elements).toEqual({ Ca: 1, O: 2, H: 2 });
    expect(parseFormula('Al2(SO4)3').elements).toEqual({ Al: 2, S: 3, O: 12 });
    expect(parseFormula('Ba(NO3)2').elements).toEqual({ Ba: 1, N: 2, O: 6 });
  });

  it('parses hydrates with dot notation', () => {
    // CuSO4.5H2O -> Cu: 1, S: 1, O: 4 + 5 = 9, H: 10
    expect(parseFormula('CuSO4.5H2O').elements).toEqual({ Cu: 1, S: 1, O: 9, H: 10 });
    // Na2CO3·10H2O
    expect(parseFormula('Na2CO3.10H2O').elements).toEqual({ Na: 2, C: 1, O: 13, H: 20 });
  });

  it('parses ions and their charges', () => {
    const fe3 = parseFormula('Fe^3+');
    expect(fe3.elements).toEqual({ Fe: 1 });
    expect(fe3.charge).toBe(3);

    const so4 = parseFormula('SO4^2-');
    expect(so4.elements).toEqual({ S: 1, O: 4 });
    expect(so4.charge).toBe(-2);

    const cl = parseFormula('Cl^-');
    expect(cl.elements).toEqual({ Cl: 1 });
    expect(cl.charge).toBe(-1);
  });

  it('handles Unicode subscript inputs seamlessly', () => {
    expect(parseFormula('Ca(OH)₂').elements).toEqual({ Ca: 1, O: 2, H: 2 });
    expect(parseFormula('Fe³⁺').charge).toBe(3);
  });

  it('returns empty composition for empty string', () => {
    expect(parseFormula('').elements).toEqual({});
  });
});
