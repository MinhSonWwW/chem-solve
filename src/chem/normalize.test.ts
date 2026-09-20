import { describe, it, expect } from 'vitest';
import { normalizeChemicalText } from './normalize';

describe('chem/normalize', () => {
  it('converts Unicode subscripts to ASCII digits', () => {
    expect(normalizeChemicalText('H₂SO₄')).toBe('H2SO4');
    expect(normalizeChemicalText('Ca(OH)₂')).toBe('Ca(OH)2');
    expect(normalizeChemicalText('Al₂(SO₄)₃')).toBe('Al2(SO4)3');
  });

  it('converts Unicode superscripts to ^ format', () => {
    expect(normalizeChemicalText('Fe³⁺')).toBe('Fe^3+');
    expect(normalizeChemicalText('SO₄²⁻')).toBe('SO4^2-');
    expect(normalizeChemicalText('Cl⁻')).toBe('Cl^-');
  });

  it('standardizes various reaction arrows to ->', () => {
    expect(normalizeChemicalText('2H2 + O2 → 2H2O')).toBe('2H2 + O2 -> 2H2O');
    expect(normalizeChemicalText('2H2 + O2 ⟶ 2H2O')).toBe('2H2 + O2 -> 2H2O');
    expect(normalizeChemicalText('2H2 + O2 ==> 2H2O')).toBe('2H2 + O2 -> 2H2O');
  });

  it('strictly preserves element letter casing (Co vs CO)', () => {
    expect(normalizeChemicalText('CoCl2')).toBe('CoCl2');
    expect(normalizeChemicalText('CO2')).toBe('CO2');
    expect(normalizeChemicalText('NO2')).toBe('NO2');
  });

  it('collapses excessive whitespace and trims', () => {
    expect(normalizeChemicalText('  2 H2   +   O2    ->   2 H2O  ')).toBe('2 H2 + O2 -> 2 H2O');
  });
});
