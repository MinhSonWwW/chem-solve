import React from 'react';
import { cn } from '@/lib/utils';

export interface FormulaProps extends React.HTMLAttributes<HTMLSpanElement> {
  code?: string;
  formula?: string;
}

/**
 * Parses ASCII chemical formulas (e.g. "H2SO4", "Fe^3+", "Al2(SO4)3", "SO4^2-")
 * and renders them with semantic HTML <sub> and <sup> tags.
 * Also safely preserves arbitrary text, spaces, and Vietnamese diacritics.
 */
export const Formula: React.FC<FormulaProps> = ({ code, formula, className, ...props }) => {
  // Clean potential bracket wrapper like [[H2SO4]]
  const inputVal = formula ?? code ?? '';
  const raw = inputVal.replace(/^\[\[|\]\]$/g, '');

  if (!raw) return null;

  // Split tokens while preserving ALL characters:
  // 1. Superscripts: ^3+, ^2-, ^+, ^-
  // 2. Subscripts: digits following an ASCII letter, closing parenthesis/bracket: H2, SO4, (OH)2
  // 3. Regular digits (coefficients like 2H2, or numbers in text like "100 ml")
  // 4. Any other text chunks (preserving spaces, Vietnamese characters, punctuation)
  const parts: React.ReactNode[] = [];
  const regex = /(\^[0-9+-]+)|((?<=[A-Za-z\)\]])\d+)|(\d+)|([^\^\d]+)/g;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(raw)) !== null) {
    const [, sup, sub, plainNum, text] = match;

    if (sup) {
      // Superscript for ion charge: ^2+, ^3-, ^+, ^-
      parts.push(
        <sup key={key++} className="text-[0.7em] font-semibold leading-none ml-[0.5px]">
          {sup.slice(1)}
        </sup>
      );
    } else if (sub) {
      // Subscript for atom count (follows element or closing bracket): H2, SO4, (OH)2
      parts.push(
        <sub key={key++} className="text-[0.7em] font-semibold leading-none ml-[0.5px]">
          {sub}
        </sub>
      );
    } else if (plainNum) {
      // Regular number (coefficient like 2H2, or number in text like "100 ml")
      parts.push(
        <span key={key++} className="font-semibold tracking-tight">
          {plainNum}
        </span>
      );
    } else if (text) {
      // Regular text/element symbol/spaces
      parts.push(
        <span key={key++} className="font-semibold tracking-tight">
          {text}
        </span>
      );
    }
  }

  const hasSpaces = raw.includes(' ');

  return (
    <span
      className={cn(
        'inline-block font-sans',
        hasSpaces ? 'whitespace-normal' : 'whitespace-nowrap',
        className
      )}
      aria-label={raw}
      {...props}
    >
      {parts.length > 0 ? parts : raw}
    </span>
  );
};
