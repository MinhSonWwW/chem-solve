import periodicTable from '../content/kb/periodic-table.json';
import { parseFormula } from './parseFormula';

const ATOMIC_MASSES: Record<string, number> = {};

for (const el of periodicTable) {
  ATOMIC_MASSES[el.symbol] = el.atomicMass;
}

/**
 * Calculates molar mass (g/mol) of a chemical formula based on standard textbook atomic masses.
 * e.g. H2O -> 18, H2SO4 -> 98, Al2(SO4)3 -> 342, CuSO4.5H2O -> 250
 */
export function calculateMolarMass(formula: string): number {
  const parsed = parseFormula(formula);
  let totalMass = 0;

  for (const [element, count] of Object.entries(parsed.elements)) {
    const atomicMass = ATOMIC_MASSES[element];
    if (atomicMass === undefined) {
      throw new Error(`Unknown chemical element symbol: "${element}" in formula "${formula}"`);
    }
    totalMass += atomicMass * count;
  }

  // Round to 2 decimal places to avoid floating point issues (e.g. Cl = 35.5)
  return Math.round(totalMass * 100) / 100;
}

export function getAtomicMass(symbol: string): number | undefined {
  return ATOMIC_MASSES[symbol];
}
