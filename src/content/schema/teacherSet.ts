/**
 * Teacher-authored question sets ("bộ câu hỏi của thầy cô").
 *
 * Shared by the web app and the Cloudflare API (server/classroom.ts), so it may only import zod
 * and ./exercise. A teacher writes a prompt + an answer in any of the answer kinds the app already
 * renders and checks (AnswerSchema); `questionToExercise` turns it into a regular Exercise so the
 * normal exercise screen, checkers and hints work unchanged.
 */
import { z } from 'zod';
import { AnswerSchema, type Answer, type Exercise } from './exercise';

export const SET_ID_RE = /^[a-z0-9]{10}$/;
/** Assignments and progress rows refer to a set as a pseudo lesson id. */
export const SET_LESSON_RE = /^set-[a-z0-9]{10}$/;
export const SET_NODE_ID = 'set';

export const setLessonId = (setId: string) => `set-${setId}`;
export const isSetLessonId = (lessonId: string) => SET_LESSON_RE.test(lessonId);
export const setIdFromLessonId = (lessonId: string) => (isSetLessonId(lessonId) ? lessonId.slice(4) : null);

export const ANSWER_KINDS = [
  'mcq-single',
  'mcq-multi',
  'true-false',
  'number',
  'text',
  'formula',
  'equation',
  'match',
  'sort',
  'ordering',
  'formula-builder',
] as const satisfies readonly Answer['kind'][];

export const ANSWER_KIND_LABELS: Record<Answer['kind'], string> = {
  'mcq-single': 'Trắc nghiệm 1 đáp án',
  'mcq-multi': 'Trắc nghiệm nhiều đáp án',
  'true-false': 'Đúng / Sai',
  number: 'Điền số (có đơn vị)',
  text: 'Điền từ',
  formula: 'Điền công thức hóa học',
  equation: 'Cân bằng / viết phương trình',
  match: 'Ghép đôi',
  sort: 'Phân loại vào nhóm',
  ordering: 'Sắp xếp thứ tự',
  'formula-builder': 'Ghép thẻ thành công thức',
};

const nonEmpty = (xs: string[]) => xs.map((x) => x.trim()).filter(Boolean);
const hasDuplicates = (xs: string[]) => new Set(xs.map((x) => x.trim().toLowerCase())).size !== xs.length;

/**
 * Semantic checks the zod shape cannot express (correct option exists, no duplicates, …).
 * Returns a Vietnamese message for the teacher, or null when the answer is usable.
 */
export function answerProblem(a: Answer): string | null {
  switch (a.kind) {
    case 'mcq-single':
    case 'mcq-multi': {
      if (a.options.some((o) => !o.label.trim())) return 'Có phương án đang để trống.';
      if (hasDuplicates(a.options.map((o) => o.label))) return 'Có hai phương án giống nhau.';
      if (new Set(a.options.map((o) => o.id)).size !== a.options.length) return 'Mã phương án bị trùng.';
      const ids = new Set(a.options.map((o) => o.id));
      if (a.kind === 'mcq-single') return ids.has(a.correctId) ? null : 'Hãy chọn đáp án đúng.';
      if (a.correctIds.length === 0 || a.correctIds.some((id) => !ids.has(id))) return 'Hãy chọn ít nhất một đáp án đúng.';
      return null;
    }
    case 'true-false':
      if (a.statements.some((s) => !s.text.trim())) return 'Có mệnh đề đang để trống.';
      if (new Set(a.statements.map((s) => s.id)).size !== a.statements.length) return 'Mã mệnh đề bị trùng.';
      return null;
    case 'number':
      if (!Number.isFinite(a.value)) return 'Đáp án phải là một số.';
      if (a.tolerance && ((a.tolerance.abs ?? 0) < 0 || (a.tolerance.rel ?? 0) < 0)) return 'Sai số cho phép không được âm.';
      return null;
    case 'text':
    case 'formula':
      return nonEmpty(a.accepted).length === 0 ? 'Hãy nhập ít nhất một đáp án được chấp nhận.' : null;
    case 'formula-builder': {
      if (nonEmpty(a.tiles).length < 2) return 'Cần ít nhất 2 thẻ để ghép.';
      if (nonEmpty(a.accepted).length === 0) return 'Hãy nhập công thức đúng.';
      // The student builds the answer by tapping tiles, so it must be reachable from them.
      const canBuild = (target: string): boolean => {
        const tiles = nonEmpty(a.tiles);
        const memo = new Map<number, boolean>();
        const go = (i: number): boolean => {
          if (i === target.length) return true;
          if (memo.has(i)) return memo.get(i)!;
          const ok = tiles.some((t) => target.startsWith(t, i) && go(i + t.length));
          memo.set(i, ok);
          return ok;
        };
        return go(0);
      };
      const target = a.accepted[0].replace(/\s+/g, '');
      return canBuild(target) ? null : 'Không ghép được công thức đúng từ các thẻ đã cho.';
    }
    case 'equation':
      if (nonEmpty(a.reactants).length !== a.reactants.length || nonEmpty(a.products).length !== a.products.length) {
        return 'Có chất đang để trống.';
      }
      if (a.coefficients.length !== a.reactants.length + a.products.length) return 'Số hệ số phải bằng số chất.';
      return null;
    case 'match':
      if (a.pairs.some((p) => !p.left.trim() || !p.right.trim())) return 'Có cặp ghép đang để trống.';
      if (hasDuplicates(a.pairs.map((p) => p.left)) || hasDuplicates(a.pairs.map((p) => p.right))) {
        return 'Mỗi vế trong cột chỉ được xuất hiện một lần.';
      }
      return null;
    case 'sort': {
      if (a.buckets.some((b) => !b.label.trim()) || a.items.some((i) => !i.label.trim())) return 'Có nhóm hoặc mục đang để trống.';
      if (hasDuplicates(a.buckets.map((b) => b.label))) return 'Có hai nhóm trùng tên.';
      const bucketIds = new Set(a.buckets.map((b) => b.id));
      if (a.items.some((i) => !bucketIds.has(i.bucketId))) return 'Có mục chưa được xếp vào nhóm.';
      return null;
    }
    case 'ordering':
      if (a.correctOrder.some((x) => !x.trim())) return 'Có bước đang để trống.';
      return hasDuplicates(a.correctOrder) ? 'Có hai bước giống nhau.' : null;
  }
}

/**
 * The answer field runs the Vietnamese checks first, so a teacher sees "Hãy chọn đáp án đúng."
 * rather than zod's English shape errors for the mistakes the editor can produce.
 */
const AnswerField = z.unknown().transform((raw, ctx): Answer => {
  let problem: string | null = null;
  try {
    problem = raw && typeof raw === 'object' ? (answerProblem(raw as Answer) ?? null) : null;
  } catch {
    problem = null; // malformed shape: reported by AnswerSchema below
  }
  if (problem) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: problem });
    return z.NEVER;
  }
  const parsed = AnswerSchema.safeParse(raw);
  if (!parsed.success) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Đáp án chưa đúng định dạng.' });
    return z.NEVER;
  }
  return parsed.data;
});

export const TeacherQuestionSchema = z
  .object({
    id: z.string().regex(/^q\d{1,3}$/),
    prompt: z.string().trim().min(3, 'Đề bài quá ngắn.').max(2000, 'Đề bài tối đa 2000 kí tự.'),
    difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
    hint: z.string().trim().max(500).optional(),
    explanation: z.string().trim().max(2000).optional(),
    answer: AnswerField,
  });

export const ExerciseSetInputSchema = z
  .object({
    title: z.string().trim().min(1, 'Hãy đặt tên bộ câu hỏi.').max(80, 'Tên bộ câu hỏi tối đa 80 kí tự.'),
    subject: z.enum(['chem', 'physics', 'bio']),
    grade: z.number().int().min(6, 'Chỉ hỗ trợ lớp 6 đến 9.').max(9, 'Chỉ hỗ trợ lớp 6 đến 9.'),
    questions: z.array(TeacherQuestionSchema).min(1, 'Bộ câu hỏi cần ít nhất 1 câu.').max(40, 'Mỗi bộ tối đa 40 câu.'),
  })
  .superRefine((s, ctx) => {
    if (new Set(s.questions.map((q) => q.id)).size !== s.questions.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Mã câu hỏi bị trùng.', path: ['questions'] });
    }
  });

export type TeacherQuestion = z.output<typeof TeacherQuestionSchema>;
export type ExerciseSetInput = z.output<typeof ExerciseSetInputSchema>;
export interface ExerciseSet extends ExerciseSetInput {
  id: string;
  updatedAt: number;
}

const fmtNumber = (n: number) => String(n).replace('.', ',');

/** Human-readable correct answer, used for the "Đáp án" step and the final solution. */
export function formatAnswer(a: Answer): string {
  switch (a.kind) {
    case 'mcq-single':
      return a.options.find((o) => o.id === a.correctId)?.label ?? '';
    case 'mcq-multi':
      return a.options.filter((o) => a.correctIds.includes(o.id)).map((o) => o.label).join('; ');
    case 'true-false':
      return a.statements.map((s, i) => `${String.fromCharCode(97 + i)}) ${s.correct ? 'Đúng' : 'Sai'}`).join('; ');
    case 'number':
      return `${fmtNumber(a.value)}${a.unit ? ` ${a.unit}` : ''}`;
    case 'text':
      return a.accepted[0];
    case 'formula':
    case 'formula-builder':
      return `[[${a.accepted[0]}]]`;
    case 'equation': {
      const side = (xs: string[], offset: number) =>
        xs.map((f, i) => `${a.coefficients[offset + i] > 1 ? a.coefficients[offset + i] : ''}[[${f}]]`).join(' + ');
      return `${side(a.reactants, 0)} → ${side(a.products, a.reactants.length)}`;
    }
    case 'match':
      return a.pairs.map((p) => `${p.left} – ${p.right}`).join('; ');
    case 'sort':
      return a.buckets
        .map((b) => `${b.label}: ${a.items.filter((i) => i.bucketId === b.id).map((i) => i.label).join(', ') || '(không có)'}`)
        .join('; ');
    case 'ordering':
      return a.correctOrder.join(' → ');
  }
}

/** Turn a teacher question into a regular Exercise for the exercise screen. */
export function questionToExercise(setId: string, q: TeacherQuestion): Exercise {
  const answerText = formatAnswer(q.answer);
  const guide = q.explanation || q.hint || 'Vận dụng kiến thức đã học trong bài để trả lời.';
  return {
    id: `set-${setId}-${q.id}`,
    lessonId: setLessonId(setId),
    skillIds: ['teacher-question'],
    difficulty: q.difficulty ?? 1,
    prompt: q.prompt,
    knowledge: [],
    answer: q.answer,
    hints: [
      { level: 1, text: 'Đọc kỹ đề, gạch chân dữ kiện và xác định đề hỏi gì.' },
      { level: 2, text: q.hint || 'Nhớ lại kiến thức trong bài học có liên quan đến câu hỏi này.' },
    ],
    steps: [
      { kind: 'identify', title: 'Đọc đề', body: q.prompt },
      { kind: 'knowledge', title: 'Hướng dẫn', body: guide },
      { kind: 'answer', title: 'Đáp án', body: answerText },
    ],
    finalSolution: q.explanation ? `${answerText}. ${q.explanation}` : answerText,
    commonMistakes: [],
  };
}
