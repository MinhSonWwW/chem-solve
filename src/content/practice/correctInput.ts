import type { Answer } from '@/content/schema/exercise';

/** The input a student would submit to answer `a` correctly (used to self-check content in tests). */
export function correctInputFor(a: Answer): unknown {
  switch (a.kind) {
    case 'mcq-single':
      return a.correctId;
    case 'mcq-multi':
      return a.correctIds;
    case 'true-false':
      return Object.fromEntries(a.statements.map((s) => [s.id, s.correct]));
    case 'number':
      return String(a.value).replace('.', ',');
    case 'text':
    case 'formula':
    case 'formula-builder':
      return a.accepted[0];
    case 'equation':
      return a.coefficients;
    case 'match':
      return a.pairs.map((p) => ({ ...p }));
    case 'sort':
      return Object.fromEntries(a.items.map((i) => [i.id, i.bucketId]));
    case 'ordering':
      return a.correctOrder;
  }
}
