/**
 * Practice banks: short, single-topic practice rounds per lesson ("mục luyện").
 *
 * A lesson's bank splits it into units (one content point each). A unit's pool is
 *  - existing curriculum exercises of the lesson (`fromExercises`, by id),
 *  - extra compact questions written for practice (`questions`, same shape as teacher questions),
 *  - optionally a number generator (`generator`) for calculation topics, so rounds never repeat.
 * Every round draws a few questions from the pool (see src/content/practice/practiceRound.ts).
 */
import { z } from 'zod';
import { TeacherQuestionSchema, buildExerciseFromQuestion, type TeacherQuestion } from './teacherSet';
import type { Exercise } from './exercise';

export const PRACTICE_ROUND_SIZE = 4;
/** Node id used in /play/:lessonId/:nodeId for a practice unit. */
export const practiceNodeId = (unitId: string) => `practice-${unitId}`;
export const unitIdFromNodeId = (nodeId: string) => (nodeId.startsWith('practice-') ? nodeId.slice('practice-'.length) : null);

export const PracticeUnitSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Mã mục luyện chỉ gồm chữ thường, số và dấu gạch ngang.'),
  title: z.string().min(3).max(60),
  /** Skill ids recorded for the extra questions (defaults to the skills of the first existing exercise). */
  skillIds: z.array(z.string()).optional(),
  fromExercises: z.array(z.string()).default([]),
  generator: z.string().optional(),
  questions: z.array(TeacherQuestionSchema).default([]),
});

export const PracticeBankSchema = z
  .object({
    lessonId: z.string().regex(/^(phy-|bio-)?g[6-9]-b\d{2}$/),
    units: z.array(PracticeUnitSchema).min(1),
  })
  .superRefine((b, ctx) => {
    const ids = b.units.map((u) => u.id);
    if (new Set(ids).size !== ids.length) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Mã mục luyện bị trùng.' });
    b.units.forEach((u, i) => {
      const qids = u.questions.map((q) => q.id);
      if (new Set(qids).size !== qids.length) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Mục ${u.id}: mã câu bị trùng.`, path: ['units', i] });
      }
    });
  });

export type PracticeUnit = z.output<typeof PracticeUnitSchema>;
export type PracticeBank = z.output<typeof PracticeBankSchema>;

/** Full Exercise for an extra practice question; ids stay inside the lesson so reports/review work. */
export function practiceQuestionToExercise(lessonId: string, unit: PracticeUnit, q: TeacherQuestion, fallbackSkills: string[]): Exercise {
  const skills = unit.skillIds?.length ? unit.skillIds : fallbackSkills.length ? fallbackSkills : [`${lessonId}-${unit.id}`];
  return buildExerciseFromQuestion(`${lessonId}-p-${unit.id}-${q.id}`, lessonId, skills, q);
}
