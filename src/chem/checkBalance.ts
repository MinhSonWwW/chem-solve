import { parseFormula } from './parseFormula';
import { parseEquation, type ParsedEquation } from './parseEquation';

export interface ElementalImbalance {
  element: string;
  left: number;
  right: number;
  diff: number; // right - left
}

export interface BalanceResult {
  isBalanced: boolean;
  isSimplest: boolean;
  imbalances: ElementalImbalance[];
  feedbackMessage?: string;
  leftAtoms: Record<string, number>;
  rightAtoms: Record<string, number>;
}

/**
 * Calculates greatest common divisor (GCD) of two integers.
 */
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

/**
 * Checks if a list of coefficients is in simplest integer ratio.
 */
export function areSimplestCoefficients(coefficients: number[]): boolean {
  if (coefficients.length === 0) return true;
  let overallGcd = coefficients[0];
  for (let i = 1; i < coefficients.length; i++) {
    overallGcd = gcd(overallGcd, coefficients[i]);
  }
  return overallGcd === 1;
}

/**
 * Reduces an array of coefficients to their simplest integer ratio.
 */
export function simplestCoefficients(coefficients: number[]): number[] {
  if (coefficients.length === 0) return [];
  let overallGcd = coefficients[0];
  for (let i = 1; i < coefficients.length; i++) {
    overallGcd = gcd(overallGcd, coefficients[i]);
  }
  if (overallGcd <= 1) return [...coefficients];
  return coefficients.map((c) => c / overallGcd);
}

/**
 * Verifies if a chemical equation is balanced and has simplest integer coefficients.
 * Detailed imbalances are provided for pedagogic feedback (e.g. "Vế trái có 2 O, vế phải có 1 O").
 */
export function checkBalance(input: string | ParsedEquation): BalanceResult {
  const parsed = typeof input === 'string' ? parseEquation(input) : input;

  const leftAtoms: Record<string, number> = {};
  const rightAtoms: Record<string, number> = {};

  // Count atoms on reactant side
  for (const reactant of parsed.reactants) {
    const comp = parseFormula(reactant.formula);
    for (const [elem, count] of Object.entries(comp.elements)) {
      leftAtoms[elem] = (leftAtoms[elem] || 0) + count * reactant.coefficient;
    }
  }

  // Count atoms on product side
  for (const product of parsed.products) {
    const comp = parseFormula(product.formula);
    for (const [elem, count] of Object.entries(comp.elements)) {
      rightAtoms[elem] = (rightAtoms[elem] || 0) + count * product.coefficient;
    }
  }

  // Find all distinct elements involved
  const allElements = new Set([...Object.keys(leftAtoms), ...Object.keys(rightAtoms)]);
  const imbalances: ElementalImbalance[] = [];

  for (const element of allElements) {
    const left = leftAtoms[element] || 0;
    const right = rightAtoms[element] || 0;
    if (left !== right) {
      imbalances.push({
        element,
        left,
        right,
        diff: right - left
      });
    }
  }

  const allCoefficients = [
    ...parsed.reactants.map((r) => r.coefficient),
    ...parsed.products.map((p) => p.coefficient)
  ];
  const isSimplest = areSimplestCoefficients(allCoefficients);
  const isBalanced = imbalances.length === 0;

  let feedbackMessage: string | undefined;
  if (!isBalanced) {
    const details = imbalances
      .map(
        (imb) =>
          `nguyên tố ${imb.element} (vế trái có ${imb.left}, vế phải có ${imb.right})`
      )
      .join('; ');
    feedbackMessage = `Phương trình chưa cân bằng ở: ${details}.`;
  } else if (!isSimplest) {
    feedbackMessage = 'Phương trình đã cân bằng đúng nhưng các hệ số chưa ở tỉ lệ tối giản.';
  }

  return {
    isBalanced,
    isSimplest,
    imbalances,
    feedbackMessage,
    leftAtoms,
    rightAtoms
  };
}
