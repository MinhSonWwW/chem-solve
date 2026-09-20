import React from 'react';
import { cn } from '@/lib/utils';

export interface FormulaProps extends React.HTMLAttributes<HTMLSpanElement> {
  code?: string;
  formula?: string;
}

/**
 * Parses ASCII chemical formulas (e.g. "H2SO4", "Fe^3+", "Al2(SO4)3", "SO4^2-")
 * and renders them with semantic HTML <sub> and <sup> tags.
 */
export const Formula: React.FC<FormulaProps> = ({ code, formula, className, ...props }) => {
  // Clean potential bracket wrapper like [[H2SO4]]
  const inputVal = formula ?? code ?? '';
  const raw = inputVal.replace(/^\[\[|\]\]$/g, '');

  // Split tokens by charge/superscript marker ^ or subscript numbers
  // Example: "Fe^3+" -> ["Fe", "^3+"], "H2SO4" -> ["H", "2", "S", "O", "4"]
  const parts: React.ReactNode[] = [];
  const regex = /(\^[0-9+-]+)|(\d+)|([A-Za-z]+|\(|\))/g;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(raw)) !== null) {
    const [token, sup, sub, elem] = match;

    if (sup) {
      // Superscript for ion charge: ^2+, ^3-, ^+
      parts.push(
        <sup key={key++} className="text-[0.7em] font-semibold leading-none ml-[0.5px]">
          {sup.slice(1)}
        </sup>
      );
    } else if (sub) {
      // Subscript for atom count: 2, 4, 3
      parts.push(
        <sub key={key++} className="text-[0.7em] font-semibold leading-none ml-[0.5px]">
          {sub}
        </sub>
      );
    } else {
      parts.push(
        <span key={key++} className="font-semibold tracking-tight">
          {elem || token}
        </span>
      );
    }
  }

  return (
    <span
      className={cn('inline-block font-sans whitespace-nowrap', className)}
      aria-label={raw}
      {...props}
    >
      {parts.length > 0 ? parts : raw}
    </span>
  );
};
