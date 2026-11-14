import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { ExerciseSchema, type Answer } from './exercise';
import {
  ANSWER_KINDS,
  ExerciseSetInputSchema,
  answerProblem,
  formatAnswer,
  isSetLessonId,
  questionToExercise,
  setIdFromLessonId,
  type TeacherQuestion,
} from './teacherSet';
import { checkAnswer } from '@/engine/checkers';

const opts = (...labels: string[]) => labels.map((label, i) => ({ id: `o${i + 1}`, label }));

/** One valid sample per answer kind, plus the input a student would submit to get it right. */
const VALID: Array<{ answer: Answer; correctInput: unknown; formatted: string }> = [
  { answer: { kind: 'mcq-single', options: opts('Fe', 'Cu'), correctId: 'o2' }, correctInput: 'o2', formatted: 'Cu' },
  { answer: { kind: 'mcq-multi', options: opts('A', 'B', 'C'), correctIds: ['o1', 'o3'] }, correctInput: ['o1', 'o3'], formatted: 'A; C' },
  {
    answer: { kind: 'true-false', statements: [{ id: 's1', text: 'Nước sôi ở 100 °C', correct: true }, { id: 's2', text: 'Sắt nhẹ hơn nước', correct: false }] },
    correctInput: { s1: true, s2: false },
    formatted: 'a) Đúng; b) Sai',
  },
  { answer: { kind: 'number', value: 12.395, unit: 'L', tolerance: { rel: 0.01 } }, correctInput: '12,4', formatted: '12,395 L' },
  { answer: { kind: 'text', accepted: ['quang hợp'], lenientDiacritics: true }, correctInput: 'quang hợp', formatted: 'quang hợp' },
  { answer: { kind: 'formula', accepted: ['H2SO4'] }, correctInput: 'H2SO4', formatted: '[[H2SO4]]' },
  {
    answer: { kind: 'equation', mode: 'fill-coefficients', reactants: ['H2', 'O2'], products: ['H2O'], coefficients: [2, 1, 2] },
    correctInput: [2, 1, 2],
    formatted: '2[[H2]] + [[O2]] → 2[[H2O]]',
  },
  {
    answer: { kind: 'match', pairs: [{ left: 'Tim', right: 'Bơm máu' }, { left: 'Phổi', right: 'Trao đổi khí' }] },
    correctInput: [{ left: 'Tim', right: 'Bơm máu' }, { left: 'Phổi', right: 'Trao đổi khí' }],
    formatted: 'Tim – Bơm máu; Phổi – Trao đổi khí',
  },
  {
    answer: {
      kind: 'sort',
      buckets: [{ id: 'b1', label: 'Acid' }, { id: 'b2', label: 'Base' }],
      items: [{ id: 'i1', label: 'HCl', bucketId: 'b1' }, { id: 'i2', label: 'NaOH', bucketId: 'b2' }],
    },
    correctInput: { i1: 'b1', i2: 'b2' },
    formatted: 'Acid: HCl; Base: NaOH',
  },
  { answer: { kind: 'ordering', correctOrder: ['Cân', 'Hòa tan', 'Khuấy'] }, correctInput: ['Cân', 'Hòa tan', 'Khuấy'], formatted: 'Cân → Hòa tan → Khuấy' },
  { answer: { kind: 'formula-builder', tiles: ['H', '2', 'O', 'S', '4'], accepted: ['H2SO4'] }, correctInput: 'H2SO4', formatted: '[[H2SO4]]' },
];

const question = (answer: Answer, extra: Partial<TeacherQuestion> = {}): TeacherQuestion => ({
  id: 'q1',
  prompt: 'Câu hỏi thử của thầy cô',
  difficulty: 1,
  answer,
  ...extra,
});

describe('teacher question sets', () => {
  it('has a valid sample for every answer kind the app supports', () => {
    expect(VALID.map((v) => v.answer.kind).sort()).toEqual([...ANSWER_KINDS].sort());
  });

  it.each(VALID)('accepts a valid $answer.kind question, formats it and the real checker grades it correct', ({ answer, correctInput, formatted }) => {
    expect(answerProblem(answer)).toBeNull();
    expect(formatAnswer(answer)).toBe(formatted);
    const ex = questionToExercise('abcde12345', question(answer));
    // Same shape as curriculum exercises (only the id patterns differ).
    const Relaxed = ExerciseSchema.extend({ id: z.string(), lessonId: z.string() });
    expect(Relaxed.safeParse(ex).success).toBe(true);
    expect(ex.id).toBe('set-abcde12345-q1');
    expect(ex.lessonId).toBe('set-abcde12345');
    expect(checkAnswer(ex.answer, correctInput).status).toBe('correct');
  });

  // Edge cases a teacher can easily produce in the editor.
  it.each<[string, Answer, string]>([
    ['mcq: no correct option chosen', { kind: 'mcq-single', options: opts('A', 'B'), correctId: '' }, 'Hãy chọn đáp án đúng.'],
    ['mcq: empty option', { kind: 'mcq-single', options: opts('A', ' '), correctId: 'o1' }, 'Có phương án đang để trống.'],
    ['mcq: duplicate options (case-insensitive)', { kind: 'mcq-single', options: opts('Fe', 'fe'), correctId: 'o1' }, 'Có hai phương án giống nhau.'],
    ['mcq-multi: nothing ticked', { kind: 'mcq-multi', options: opts('A', 'B'), correctIds: [] }, 'Hãy chọn ít nhất một đáp án đúng.'],
    ['true-false: empty statement', { kind: 'true-false', statements: [{ id: 's1', text: '', correct: true }] }, 'Có mệnh đề đang để trống.'],
    ['number: NaN', { kind: 'number', value: Number.NaN }, 'Đáp án phải là một số.'],
    ['number: negative tolerance', { kind: 'number', value: 1, tolerance: { rel: -0.1 } }, 'Sai số cho phép không được âm.'],
    ['text: only blanks accepted', { kind: 'text', accepted: ['  '] }, 'Hãy nhập ít nhất một đáp án được chấp nhận.'],
    ['formula-builder: answer not buildable', { kind: 'formula-builder', tiles: ['H', '2'], accepted: ['H2O'] }, 'Không ghép được công thức đúng từ các thẻ đã cho.'],
    ['formula-builder: one tile', { kind: 'formula-builder', tiles: ['H2O', ' '], accepted: ['H2O'] }, 'Cần ít nhất 2 thẻ để ghép.'],
    ['equation: coefficient count mismatch', { kind: 'equation', mode: 'fill-coefficients', reactants: ['H2', 'O2'], products: ['H2O'], coefficients: [2, 2] }, 'Số hệ số phải bằng số chất.'],
    ['equation: empty species', { kind: 'equation', mode: 'build', reactants: ['H2', ''], products: ['H2O'], coefficients: [2, 1, 2] }, 'Có chất đang để trống.'],
    ['match: same right side twice', { kind: 'match', pairs: [{ left: 'A', right: 'X' }, { left: 'B', right: 'x' }] }, 'Mỗi vế trong cột chỉ được xuất hiện một lần.'],
    [
      'sort: item in a deleted bucket',
      { kind: 'sort', buckets: [{ id: 'b1', label: 'A' }, { id: 'b2', label: 'B' }], items: [{ id: 'i1', label: 'x', bucketId: 'b3' }, { id: 'i2', label: 'y', bucketId: 'b1' }] },
      'Có mục chưa được xếp vào nhóm.',
    ],
    ['ordering: duplicate step', { kind: 'ordering', correctOrder: ['Đun', 'đun'] }, 'Có hai bước giống nhau.'],
  ])('rejects %s', (_name, answer, message) => {
    expect(answerProblem(answer)).toBe(message);
    expect(ExerciseSetInputSchema.safeParse({ title: 'Bộ 1', subject: 'chem', grade: 8, questions: [question(answer)] }).error?.issues[0].message).toBe(message);
  });

  it('validates the set itself', () => {
    const ok = { title: 'Ôn tập mol', subject: 'chem', grade: 8, questions: [question(VALID[0].answer)] };
    expect(ExerciseSetInputSchema.safeParse(ok).success).toBe(true);
    expect(ExerciseSetInputSchema.safeParse({ ...ok, questions: [] }).error?.issues[0].message).toBe('Bộ câu hỏi cần ít nhất 1 câu.');
    expect(ExerciseSetInputSchema.safeParse({ ...ok, title: '  ' }).error?.issues[0].message).toBe('Hãy đặt tên bộ câu hỏi.');
    expect(ExerciseSetInputSchema.safeParse({ ...ok, grade: 10 }).success).toBe(false);
    const dup = { ...ok, questions: [question(VALID[0].answer), question(VALID[1].answer)] };
    expect(ExerciseSetInputSchema.safeParse(dup).error?.issues[0].message).toBe('Mã câu hỏi bị trùng.');
  });

  it('uses the teacher hint and explanation in the solution', () => {
    const ex = questionToExercise('abcde12345', question(VALID[0].answer, { hint: 'Kim loại màu đỏ', explanation: 'Đồng có màu đỏ.' }));
    expect(ex.hints[1].text).toBe('Kim loại màu đỏ');
    expect(ex.steps[1].body).toBe('Đồng có màu đỏ.');
    expect(ex.finalSolution).toBe('Cu. Đồng có màu đỏ.');
  });

  it('recognises set pseudo lesson ids', () => {
    expect(isSetLessonId('set-abcde12345')).toBe(true);
    expect(isSetLessonId('g8-b03')).toBe(false);
    expect(isSetLessonId('set-ABC')).toBe(false);
    expect(setIdFromLessonId('set-abcde12345')).toBe('abcde12345');
    expect(setIdFromLessonId('g8-b03')).toBeNull();
  });
});
