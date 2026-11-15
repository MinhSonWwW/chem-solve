import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { PracticeBankSchema, PRACTICE_ROUND_SIZE, type PracticeBank } from '@/content/schema/practice';
import { ExerciseSchema } from '@/content/schema/exercise';
import { SUBJECT_ANSWER_KINDS } from '@/content/schema/teacherSet';
import { getCurriculum, type Grade } from '@/content/curriculum';
import { loadExercises } from '@/content/contentLoader';
import { checkAnswer } from '@/engine/checkers';
import { PRACTICE_GENERATORS } from '@/content/generators/practiceGenerators';
import { buildPracticeRound, unitPool } from './practiceRound';
import { molecularMass } from '@/content/generators/practiceGeneratorsG7';
import { correctInputFor } from './correctInput';

const DIR = 'src/content/practice';
const MIN_POOL = 8;
const MIN_POOL_WITH_GENERATOR = 5;
/** Grades whose every ready lesson must have a practice bank. */
const COVERED_GRADES: Grade[] = [6, 7, 8, 9];

const banks: Array<{ file: string; bank: PracticeBank }> = fs
  .readdirSync(DIR)
  .filter((d) => /^g\d$/.test(d))
  .flatMap((d) => fs.readdirSync(path.join(DIR, d)).map((f) => path.join(DIR, d, f)))
  .filter((f) => f.endsWith('.json'))
  .map((file) => {
    const parsed = PracticeBankSchema.safeParse(JSON.parse(fs.readFileSync(file, 'utf8')));
    if (!parsed.success) throw new Error(`${file}: ${JSON.stringify(parsed.error.issues[0])}`);
    return { file, bank: parsed.data };
  });

const subjectOf = (lessonId: string) => (lessonId.startsWith('phy-') ? 'physics' : lessonId.startsWith('bio-') ? 'bio' : 'chem');
const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const RelaxedExercise = ExerciseSchema.extend({ id: z.string().regex(/^(phy-|bio-)?g[6-9]-b\d{2}-[a-z0-9-]+$/) });

describe('practice banks', () => {
  it.each(COVERED_GRADES)('covers every ready lesson of grade %i in all subjects', (grade) => {
    const have = new Set(banks.map((b) => b.bank.lessonId));
    const missing = (['chem', 'physics', 'bio'] as const)
      .flatMap((s) => getCurriculum(grade, s).chapters.flatMap((c) => c.lessons))
      .filter((l) => l.ready && !have.has(l.id))
      .map((l) => l.id);
    expect(missing).toEqual([]);
  });

  describe.each(banks.map((b) => [b.bank.lessonId, b] as const))('%s', (_id, { file, bank }) => {
    it('is named after its lesson', () => {
      expect(path.basename(file, '.json')).toBe(bank.lessonId);
    });

    it('puts every curriculum exercise of the lesson in exactly one unit', async () => {
      const lessonIds = (await loadExercises(bank.lessonId)).map((e) => e.id);
      const used = bank.units.flatMap((u) => u.fromExercises);
      expect(used.filter((id) => !lessonIds.includes(id)), 'unknown ids').toEqual([]);
      expect(used.length, 'an exercise is in two units').toBe(new Set(used).size);
      expect(lessonIds.filter((id) => !used.includes(id)), 'exercises left out').toEqual([]);
    });

    it('has enough questions per unit, fitting answer kinds and a known generator', async () => {
      const lessonEx = await loadExercises(bank.lessonId);
      for (const u of bank.units) {
        const pool = unitPool(bank, u, lessonEx).length;
        expect(pool, `${u.id} pool`).toBeGreaterThanOrEqual(u.generator ? MIN_POOL_WITH_GENERATOR : MIN_POOL);
        if (u.generator) expect(PRACTICE_GENERATORS[u.generator], `${u.id} generator`).toBeDefined();
        for (const q of u.questions) {
          expect(SUBJECT_ANSWER_KINDS[subjectOf(bank.lessonId)], `${u.id}/${q.id} kind`).toContain(q.answer.kind);
        }
      }
    });

    it('extra questions are valid exercises the checker grades correct with their own answer', async () => {
      const lessonEx = await loadExercises(bank.lessonId);
      for (const u of bank.units) {
        for (const ex of unitPool(bank, u, lessonEx).filter((e) => e.id.includes('-p-'))) {
          const parsed = RelaxedExercise.safeParse(ex);
          expect(parsed.success, `${ex.id}: ${parsed.error?.issues[0]?.message}`).toBe(true);
          expect(checkAnswer(ex.answer, correctInputFor(ex.answer)).status, ex.id).toBe('correct');
        }
      }
    });

    it('has no duplicate prompts within the lesson', async () => {
      const lessonEx = await loadExercises(bank.lessonId);
      const prompts = bank.units.flatMap((u) => unitPool(bank, u, lessonEx)).map((e) => norm(e.prompt));
      const dup = prompts.filter((p, i) => prompts.indexOf(p) !== i);
      expect(dup).toEqual([]);
    });

    it('builds rounds of distinct questions', async () => {
      const lessonEx = await loadExercises(bank.lessonId);
      for (const u of bank.units) {
        const round = buildPracticeRound(bank, u, lessonEx);
        expect(round).toHaveLength(PRACTICE_ROUND_SIZE);
        expect(new Set(round.map((e) => e.id)).size).toBe(PRACTICE_ROUND_SIZE);
        round.forEach((e) => expect(e.lessonId).toBe(bank.lessonId));
      }
    });
  });
});

describe('practice rounds', () => {
  it('prefer questions not seen recently', async () => {
    const { bank } = banks[0];
    const unit = bank.units[0];
    const lessonEx = await loadExercises(bank.lessonId);
    const pool = unitPool(bank, unit, lessonEx);
    const recent = pool.slice(0, pool.length - PRACTICE_ROUND_SIZE).map((e) => e.id);
    const round = buildPracticeRound(bank, { ...unit, generator: undefined }, lessonEx, { recent });
    expect(round.every((e) => !recent.includes(e.id))).toBe(true);
  });
});

describe('practice generators', () => {
  it.each(Object.keys(PRACTICE_GENERATORS))('%s makes valid exercises the checker accepts', (name) => {
    for (let i = 0; i < 40; i++) {
      const ex = { ...PRACTICE_GENERATORS[name](Math.random), id: 'g6-b01-p-x-g0-ab', lessonId: 'g6-b01' };
      const parsed = ExerciseSchema.safeParse(ex);
      expect(parsed.success, `${name}: ${parsed.error?.issues[0]?.path} ${parsed.error?.issues[0]?.message}`).toBe(true);
      expect(checkAnswer(ex.answer, correctInputFor(ex.answer)).status, `${name}: ${ex.prompt}`).toBe('correct');
    }
  });
});

describe('molecular mass helper', () => {
  it.each([
    ['H2O', 18],
    ['CO2', 44],
    ['Ca(OH)2', 74],
    ['Al2O3', 102],
    ['H2SO4', 98],
    ['NaCl', 58.5],
    ['CuSO4', 160],
  ])('%s = %d amu', (f, m) => {
    expect(molecularMass(f)).toBe(m);
  });
});
