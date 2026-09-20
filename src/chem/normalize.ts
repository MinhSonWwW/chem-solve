/**
 * Normalizes chemical strings without losing uppercase/lowercase chemical symbol distinctions.
 * Handles Unicode subscripts (₂ -> 2), superscripts (³⁺ -> ^3+), and various reaction arrows (→ -> ->).
 */

const SUBSCRIPT_MAP: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
};

const SUPERSCRIPT_MAP: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  '⁺': '+', '⁻': '-'
};

export function normalizeChemicalText(input: string): string {
  if (!input) return '';

  let text = input;

  // 1. Replace superscripts into ^... format BEFORE NFKC decomposes them
  text = text.replace(/([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+)/g, (_, match) => {
    let converted = '';
    for (const char of match) {
      converted += SUPERSCRIPT_MAP[char] || char;
    }
    return `^${converted}`;
  });

  // 2. Replace subscripts
  text = text.replace(/[₀-₉]/g, (char) => SUBSCRIPT_MAP[char] || char);

  // 3. Normalize remaining Unicode characters
  text = text.normalize('NFKC');

  // 4. Standardize arrows
  text = text.replace(/(\s*(?:⟶|→|==>|=>)\s*)/g, ' -> ');

  // 5. Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}
