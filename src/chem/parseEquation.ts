import { normalizeChemicalText } from './normalize';

export interface EquationParticipant {
  formula: string;
  coefficient: number;
}

export interface ParsedEquation {
  reactants: EquationParticipant[];
  products: EquationParticipant[];
  condition?: string;
  raw: string;
}

/**
 * Parses chemical equation strings into structured reactants and products with coefficients.
 * e.g. "2H2 + O2 -> 2H2O" -> reactants: [{ formula: "H2", coefficient: 2 }, { formula: "O2", coefficient: 1 }]
 */
export function parseEquation(rawEquation: string): ParsedEquation {
  const normalized = normalizeChemicalText(rawEquation);

  // Extract condition from arrow if present, e.g. "->|t°" or "--(t°)->" or "=[t°]=>"
  let condition: string | undefined;
  let cleanEq = normalized;

  const condMatch = cleanEq.match(/->\|([^|]+)\|/);
  if (condMatch) {
    condition = condMatch[1].trim();
    cleanEq = cleanEq.replace(/->\|[^|]+\|/, '->');
  }

  // Split by reaction arrow "->" or "="
  let parts: string[];
  if (cleanEq.includes('->')) {
    parts = cleanEq.split('->');
  } else if (cleanEq.includes('=')) {
    parts = cleanEq.split('=');
  } else {
    throw new Error(`Invalid chemical equation, missing '->' or '=': "${rawEquation}"`);
  }

  if (parts.length !== 2) {
    throw new Error(`Equation must have exactly two sides separated by arrow: "${rawEquation}"`);
  }

  const reactants = parseSide(parts[0]);
  const products = parseSide(parts[1]);

  return {
    reactants,
    products,
    condition,
    raw: rawEquation
  };
}

function parseSide(sideStr: string): EquationParticipant[] {
  // Split by '+'
  const tokens = sideStr.split('+');
  const participants: EquationParticipant[] = [];

  for (let token of tokens) {
    token = token.trim();
    if (!token) continue;

    // Strip states like (s), (l), (g), (aq), (dd), (r), (k)
    token = token.replace(/\s*\((?:s|l|g|aq|dd|r|k)\)\s*/gi, '');

    // Strip indicators like [[up]], [[down]], ↑, ↓
    token = token.replace(/\[\[(?:up|down)\]\]|[↑↓]/g, '').trim();

    // Extract leading integer coefficient
    const match = token.match(/^(\d+)\s*(.*)$/);
    let coefficient = 1;
    let formula = token;

    if (match) {
      coefficient = parseInt(match[1], 10);
      formula = match[2].trim();
    }

    if (formula) {
      participants.push({
        formula,
        coefficient
      });
    }
  }

  return participants;
}
