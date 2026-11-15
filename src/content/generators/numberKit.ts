/** Shared helpers for practice number generators. */
import type { Exercise } from '@/content/schema/exercise';

export type Rand = () => number;
export const pick = <T,>(xs: readonly T[], r: Rand): T => xs[Math.floor(r() * xs.length)];
export const round = (x: number, d = 3) => Math.round(x * 10 ** d) / 10 ** d;
/** Vietnamese decimal comma. */
export const vn = (x: number) => String(round(x)).replace('.', ',');

export function numberExercise(o: {
  prompt: string;
  value: number;
  unit?: string;
  hint: string;
  formula: string;
  work: string;
  trap?: number[];
  skill: string;
}): Exercise {
  const answer = `${vn(o.value)}${o.unit ? ` ${o.unit}` : ''}`;
  return {
    id: 'gen',
    lessonId: 'gen',
    skillIds: [o.skill],
    difficulty: 2,
    prompt: o.prompt,
    knowledge: [],
    answer: { kind: 'number', value: round(o.value), unit: o.unit, tolerance: { abs: 0.0005, rel: 0.001 } },
    hints: [
      { level: 1, text: o.hint },
      { level: 2, text: `Áp dụng: ${o.formula}` },
    ],
    steps: [
      { kind: 'identify', title: 'Xác định dữ kiện', body: o.prompt },
      { kind: 'compute', title: 'Tính toán', body: o.work },
      { kind: 'answer', title: 'Đáp án', body: answer },
    ],
    finalSolution: `${o.work} Đáp án: ${answer}.`,
    commonMistakes: o.trap?.length
      ? [{ id: 'wrong-factor', message: 'Kiểm tra lại hệ số quy đổi hoặc công thức.', trapAnswers: o.trap.map(vn) }]
      : [],
  };
}
