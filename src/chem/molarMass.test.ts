import { describe, it, expect } from 'vitest';
import { calculateMolarMass } from './molarMass';

describe('chem/molarMass', () => {
  it('calculates molar mass for simple molecules', () => {
    expect(calculateMolarMass('H2')).toBe(2);
    expect(calculateMolarMass('O2')).toBe(32);
    expect(calculateMolarMass('H2O')).toBe(18);
    expect(calculateMolarMass('CO2')).toBe(44);
    expect(calculateMolarMass('NaCl')).toBe(58.5);
  });

  it('calculates molar mass for acids and bases with parentheses', () => {
    expect(calculateMolarMass('H2SO4')).toBe(98);
    expect(calculateMolarMass('Ca(OH)2')).toBe(74);
    expect(calculateMolarMass('Al2(SO4)3')).toBe(342); // 27*2 + (32 + 16*4)*3 = 54 + 96*3 = 342
    expect(calculateMolarMass('Ba(OH)2')).toBe(171); // 137 + 17*2 = 171
  });

  it('calculates molar mass for hydrates', () => {
    // CuSO4.5H2O = 64 + 32 + 64 + 5*18 = 160 + 90 = 250
    expect(calculateMolarMass('CuSO4.5H2O')).toBe(250);
  });

  it('throws error for invalid / unknown element symbols', () => {
    expect(() => calculateMolarMass('Xx2O')).toThrowError(/Unknown chemical element symbol/);
  });
});
