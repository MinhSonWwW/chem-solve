import { normalizeChemicalText } from './normalize';

export interface FormulaComposition {
  elements: Record<string, number>;
  charge?: number;
}

/**
 * Parses a chemical formula string into elemental atom counts and net charge.
 * Supports:
 * - Simple formulas: H2, H2SO4, NaCl
 * - Parentheses / brackets: Ca(OH)2, Al2(SO4)3
 * - Hydrates: CuSO4.5H2O, Na2CO3·10H2O
 * - Ions: Fe^3+, SO4^2-, Cl^-, OH^-
 */
export function parseFormula(rawFormula: string): FormulaComposition {
  const formula = normalizeChemicalText(rawFormula.trim());
  if (!formula) {
    return { elements: {} };
  }

  // Check for ion charge at the end, e.g. Fe^3+ or OH^- or Fe3+ or Ca2+
  let charge: number | undefined;
  let baseFormula = formula;

  const chargeMatch = baseFormula.match(/\^?([0-9]*)([+-])$/);
  if (chargeMatch) {
    const sign = chargeMatch[2] === '+' ? 1 : -1;
    const magnitude = chargeMatch[1] ? parseInt(chargeMatch[1], 10) : 1;
    charge = sign * magnitude;
    baseFormula = baseFormula.substring(0, chargeMatch.index).trim();
  }

  // Check for hydrate dot (e.g. CuSO4.5H2O or CuSO4·5H2O)
  const hydrateParts = baseFormula.split(/[.·]/);
  const totalElements: Record<string, number> = {};

  for (let idx = 0; idx < hydrateParts.length; idx++) {
    let part = hydrateParts[idx].trim();
    if (!part) continue;

    let multiplier = 1;
    if (idx > 0) {
      // Check leading coefficient in hydrate, e.g. "5H2O"
      const coefMatch = part.match(/^(\d+)(.*)$/);
      if (coefMatch) {
        multiplier = parseInt(coefMatch[1], 10);
        part = coefMatch[2];
      }
    }

    const partElements = parseFormulaSegment(part);
    for (const [elem, count] of Object.entries(partElements)) {
      totalElements[elem] = (totalElements[elem] || 0) + count * multiplier;
    }
  }

  return {
    elements: totalElements,
    charge
  };
}

/**
 * Parses a segment containing nested parentheses, brackets, elements and subscripts.
 * e.g. Al2(SO4)3
 */
function parseFormulaSegment(segment: string): Record<string, number> {
  const stack: Array<Record<string, number>> = [{}];
  let i = 0;

  while (i < segment.length) {
    const ch = segment[i];

    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push({});
      i++;
    } else if (ch === ')' || ch === ']' || ch === '}') {
      i++;
      // Parse multiplier after closing bracket, e.g. )3
      let numStr = '';
      while (i < segment.length && /\d/.test(segment[i])) {
        numStr += segment[i];
        i++;
      }
      const multiplier = numStr ? parseInt(numStr, 10) : 1;
      const top = stack.pop() || {};
      const current = stack[stack.length - 1];

      for (const [elem, count] of Object.entries(top)) {
        current[elem] = (current[elem] || 0) + count * multiplier;
      }
    } else if (/[A-Z]/.test(ch)) {
      // Element symbol starts with an uppercase letter
      let symbol = ch;
      i++;
      while (i < segment.length && /[a-z]/.test(segment[i])) {
        symbol += segment[i];
        i++;
      }

      // Read subscript number
      let numStr = '';
      while (i < segment.length && /\d/.test(segment[i])) {
        numStr += segment[i];
        i++;
      }
      const count = numStr ? parseInt(numStr, 10) : 1;
      const current = stack[stack.length - 1];
      current[symbol] = (current[symbol] || 0) + count;
    } else {
      // Skip unexpected characters (whitespace, etc.)
      i++;
    }
  }

  return stack[0] || {};
}
