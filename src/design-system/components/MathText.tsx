import React from 'react';
import katex from 'katex';
import { Formula } from './Formula';
import { cn } from '@/lib/utils';

export interface MathTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text?: string;
  children?: string;
  className?: string;
}

// A single-letter (or Greek) symbol followed by _sub or _{sub}, e.g. F_A, d_vật, v_{tb}, R_1.
// The lookbehind keeps identifiers like "snake_case" (multi-letter base) untouched.
const SUBSCRIPT = /(?<![\p{L}\p{N}_])(\p{L})_(\{[^}]+\}|[\p{L}\p{N}]+)/gu;

function renderSubscripts(text: string): React.ReactNode {
  if (!text.includes('_')) return text;
  const out: React.ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(SUBSCRIPT)) {
    const start = m.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    const sub = m[2].startsWith('{') ? m[2].slice(1, -1) : m[2];
    out.push(
      <React.Fragment key={k++}>
        {m[1]}
        <sub className="text-[0.75em]">{sub}</sub>
      </React.Fragment>
    );
    last = start + m[0].length;
  }
  if (last === 0) return text;
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * Universal scientific content renderer:
 * 1. LaTeX math: `$E = mc^2$` or `$$...$$` rendered via KaTeX
 * 2. Chemical formulas: `[[H2SO4]]`, `[[Fe^3+]]` rendered via Formula component
 * 3. Markdown bold: `**chữ đậm**` rendered as styled strong tags
 * 4. Fallback: gracefully renders plain text if formula has minor syntax typos
 */
export const MathText: React.FC<MathTextProps> = ({ text, children, className, ...props }) => {
  const content = text ?? children ?? '';
  if (!content) return null;

  // Split by math `$ ... $` or `$$ ... $$`, chemical brackets `[[ ... ]]`, and markdown `** ... **`
  const tokens = content.split(/(\$\$[\s\S]+?\$\$|\$[^\$]+?\$|\[\[[^\]]+?\]\]|\*\*.*?\*\*)/g);

  return (
    <span className={cn('inline leading-relaxed', className)} {...props}>
      {tokens.map((token, idx) => {
        if (!token) return null;

        // Display math: $$...$$
        if (token.startsWith('$$') && token.endsWith('$$') && token.length > 4) {
          const math = token.slice(2, -2).trim();
          try {
            const html = katex.renderToString(math, {
              displayMode: true,
              throwOnError: false,
              strict: 'ignore',
            });
            return (
              <span
                key={idx}
                className="my-2 block text-center overflow-x-auto text-[var(--text-primary)]"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return <code key={idx}>{token}</code>;
          }
        }

        // Inline math: $...$
        if (token.startsWith('$') && token.endsWith('$') && token.length > 2) {
          const math = token.slice(1, -1).trim();
          try {
            const html = katex.renderToString(math, {
              displayMode: false,
              throwOnError: false,
              strict: 'ignore',
            });
            return (
              <span
                key={idx}
                className="inline-math inline-block align-baseline mx-0.5 text-[var(--text-primary)]"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return <code key={idx}>{token}</code>;
          }
        }

        // Chemical formula: [[H2SO4]]
        if (token.startsWith('[[') && token.endsWith(']]') && token.length > 4) {
          const chem = token.slice(2, -2).trim();
          return (
            <Formula
              key={idx}
              code={chem}
              className="text-[var(--chem-fg)] font-bold inline-block mx-0.5"
            />
          );
        }

        // Markdown Bold: **bold text** — recurse so LaTeX/chemical formulas nested
        // inside bold markers (e.g. "**$F_A = d \times V$**") still get rendered.
        if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
          return (
            <strong key={idx} className="font-black text-[var(--text-primary)]">
              <MathText text={token.slice(2, -2)} />
            </strong>
          );
        }

        // Plain text — with lightweight physics subscripts: "F_A", "d_vật", "v_{tb}"
        return <React.Fragment key={idx}>{renderSubscripts(token)}</React.Fragment>;
      })}
    </span>
  );
};
