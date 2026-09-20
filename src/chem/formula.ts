import { z } from 'zod';

export const ChemicalFormulaSchema = z.string().min(1);

export interface ParsedElement {
  symbol: string;
  count: number;
}

/**
 * Parses simple chemical formula strings like 'H2SO4' or 'Al2(SO4)3' into elements.
 */
export function parseChemicalFormula(formula: string): ParsedElement[] {
  const elementRegex = /([A-Z][a-z]*)(\d*)/g;
  const results: ParsedElement[] = [];
  let match: RegExpExecArray | null;

  while ((match = elementRegex.exec(formula)) !== null) {
    if (match[1]) {
      results.push({
        symbol: match[1],
        count: match[2] ? parseInt(match[2], 10) : 1
      });
    }
  }

  return results;
}
