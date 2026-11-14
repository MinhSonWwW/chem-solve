import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MathText } from '@/design-system/components/MathText';
import { loadExercises, loadTheory } from './contentLoader';

/** Every student-visible string must render without leaking raw markup. */
function expectClean(text: string, where: string) {
  const { container, unmount } = render(<MathText text={text} />);
  const out = container.textContent ?? '';
  expect(out, `${where}: raw LaTeX`).not.toMatch(/\$[^$]+\$/);
  expect(out, `${where}: raw [[formula]]`).not.toContain('[[');
  expect(out, `${where}: raw bold`).not.toMatch(/\*\*.+\*\*/);
  unmount();
}

describe('Hóa 7 – Chương 2 renders cleanly', () => {
  for (const lessonId of ['g7-b05', 'g7-b06']) {
    it(`${lessonId}: theory and exercises render without raw markup`, async () => {
      const theory = (await loadTheory(lessonId))!;
      for (const c of theory.cards) {
        for (const s of [c.title, c.content, c.callout, c.formulaExample, ...(c.bulletPoints ?? [])]) {
          if (s) expectClean(s, `${lessonId}/${c.id}`);
        }
      }
      if (theory.quickCheck) {
        expectClean(theory.quickCheck.prompt, `${lessonId}/quickCheck`);
        expectClean(theory.quickCheck.explanation, `${lessonId}/quickCheck`);
        theory.quickCheck.options.forEach((o) => expectClean(o.text, `${lessonId}/quickCheck`));
      }

      for (const ex of await loadExercises(lessonId)) {
        const strings = [ex.prompt, ex.finalSolution, ...ex.hints.map((h) => h.text), ...ex.steps.map((s) => s.body)];
        const a = ex.answer;
        if (a.kind === 'mcq-single') strings.push(...a.options.map((o) => o.label));
        if (a.kind === 'true-false') strings.push(...a.statements.map((s) => s.text));
        if (a.kind === 'match') strings.push(...a.pairs.flatMap((p) => [p.left, p.right]));
        if (a.kind === 'sort') strings.push(...a.items.map((i) => i.label));
        strings.forEach((s) => expectClean(s, ex.id));
      }
    });
  }

  it('renders the valence rule with KaTeX and formulas with subscripts', async () => {
    const card = (await loadTheory('g7-b06'))!.cards.find((c) => c.id === 'c4')!;
    const { container } = render(<MathText text={`${card.content} ${card.formulaExample}`} />);
    expect(container.querySelectorAll('.katex').length).toBe(2);
    const { container: f } = render(<MathText text={card.bulletPoints![0]} />);
    expect(f.querySelector('sub')).not.toBeNull(); // Al2O3 -> Al<sub>2</sub>O<sub>3</sub>
  });
});
