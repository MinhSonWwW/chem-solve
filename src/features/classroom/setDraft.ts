/** Editor helpers for teacher question sets (pure, unit-tested). */
import type { Answer } from '@/content/schema/exercise';
import type { TeacherQuestion } from '@/content/schema/teacherSet';
import { checkBalance } from '@/chem/checkBalance';

/** An empty answer of the given kind, ready for the editor. */
export function newAnswer(kind: Answer['kind']): Answer {
  const opts = () => [1, 2, 3, 4].map((i) => ({ id: `o${i}`, label: '' }));
  switch (kind) {
    case 'mcq-single':
      return { kind, options: opts(), correctId: '' };
    case 'mcq-multi':
      return { kind, options: opts(), correctIds: [] };
    case 'true-false':
      return { kind, statements: [1, 2].map((i) => ({ id: `s${i}`, text: '', correct: true })) };
    case 'number':
      return { kind, value: Number.NaN, unit: '', tolerance: { rel: 0.01 } };
    case 'text':
      return { kind, accepted: [''], lenientDiacritics: true };
    case 'formula':
      return { kind, accepted: [''] };
    case 'equation':
      return { kind, mode: 'fill-coefficients', reactants: ['', ''], products: [''], coefficients: [1, 1, 1] };
    case 'match':
      return { kind, pairs: [1, 2, 3].map(() => ({ left: '', right: '' })) };
    case 'sort':
      return {
        kind,
        buckets: [
          { id: 'b1', label: '' },
          { id: 'b2', label: '' },
        ],
        items: [1, 2, 3, 4].map((i) => ({ id: `i${i}`, label: '', bucketId: 'b1' })),
      };
    case 'ordering':
      return { kind, correctOrder: ['', '', ''] };
    case 'formula-builder':
      return { kind, tiles: [], accepted: [''] };
  }
}

export function newQuestion(existing: TeacherQuestion[], kind: Answer['kind'] = 'mcq-single'): TeacherQuestion {
  const used = new Set(existing.map((q) => q.id));
  let n = existing.length + 1;
  while (used.has(`q${n}`)) n++;
  return { id: `q${n}`, prompt: '', difficulty: 1, answer: newAnswer(kind) };
}

/** Unique next id like o5 / s3 / b4 for a list of objects with ids `prefix + number`. */
export function nextId(prefix: string, ids: string[]): string {
  let n = ids.length + 1;
  while (ids.includes(`${prefix}${n}`)) n++;
  return `${prefix}${n}`;
}

const lines = (xs: string[]) => xs.map((x) => x.trim()).filter(Boolean);

/** Trim text and drop blank "accepted" lines before saving. Empty options are kept so the server can point them out. */
export function cleanAnswer(a: Answer): Answer {
  switch (a.kind) {
    case 'mcq-single':
    case 'mcq-multi':
      return { ...a, options: a.options.map((o) => ({ ...o, label: o.label.trim() })) } as Answer;
    case 'true-false':
      return { ...a, statements: a.statements.map((s) => ({ ...s, text: s.text.trim() })) };
    case 'number':
      return { ...a, unit: a.unit?.trim() || undefined };
    case 'text':
    case 'formula':
      return { ...a, accepted: lines(a.accepted).length ? lines(a.accepted) : [''] } as Answer;
    case 'formula-builder':
      return { ...a, tiles: lines(a.tiles), accepted: lines(a.accepted).map((x) => x.replace(/\s+/g, '')) };
    case 'equation':
      return { ...a, reactants: a.reactants.map((x) => x.trim()), products: a.products.map((x) => x.trim()), condition: a.condition?.trim() || undefined };
    case 'match':
      return { ...a, pairs: a.pairs.map((p) => ({ left: p.left.trim(), right: p.right.trim() })) };
    case 'sort':
      return {
        ...a,
        buckets: a.buckets.map((b) => ({ ...b, label: b.label.trim() })),
        items: a.items.map((i) => ({ ...i, label: i.label.trim() })),
      };
    case 'ordering':
      return { ...a, correctOrder: a.correctOrder.map((x) => x.trim()) };
  }
}

export function cleanQuestion(q: TeacherQuestion): TeacherQuestion {
  return {
    ...q,
    prompt: q.prompt.trim(),
    hint: q.hint?.trim() || undefined,
    explanation: q.explanation?.trim() || undefined,
    answer: cleanAnswer(q.answer),
  };
}

/** Warning for an equation whose coefficients do not balance (null when fine or not checkable yet). */
export function equationWarning(a: Extract<Answer, { kind: 'equation' }>): string | null {
  const all = [...a.reactants, ...a.products];
  if (all.some((f) => !f.trim()) || a.coefficients.length !== all.length) return null;
  const side = (xs: string[], offset: number) => xs.map((f, i) => `${a.coefficients[offset + i]}${f.trim()}`).join(' + ');
  try {
    const r = checkBalance(`${side(a.reactants, 0)} -> ${side(a.products, a.reactants.length)}`);
    if (!r.isBalanced) return 'Phương trình chưa cân bằng với các hệ số này.';
    if (!r.isSimplest) return 'Hệ số chưa tối giản.';
    return null;
  } catch {
    return 'Không đọc được công thức. Viết kiểu H2SO4, Fe2O3.';
  }
}
