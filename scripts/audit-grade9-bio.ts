import fs from 'fs';
import path from 'path';
import { ExerciseSchema } from '../src/content/schema/exercise';
import { TheoryContentSchema } from '../src/content/schema/theory';
import { SKILLS } from '../src/content/skills';
import { GRADE_9_BIOLOGY_CURRICULUM } from '../src/content/biology/g9/curriculum';

async function audit() {
  console.log('--- STARTING GRADE 9 BIOLOGY AUDIT ---');
  let errors: string[] = [];
  let warnings: string[] = [];

  const skillIdSet = new Set(SKILLS.map((s) => s.id));
  const baseDir = path.resolve('src/content/biology/g9');

  // Load all KB IDs in biology
  const kbIds = new Set<string>();
  const kbDir = path.resolve('src/content/kb/biology');
  function scanKb(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanKb(full);
      } else if (entry.name.endsWith('.json')) {
        try {
          const content = JSON.parse(fs.readFileSync(full, 'utf-8'));
          if (Array.isArray(content)) {
            content.forEach((item) => {
              if (item.id) kbIds.add(item.id);
            });
          }
        } catch {}
      }
    }
  }
  scanKb(kbDir);

  // Expected lesson mapping
  const expectedLessons: Record<string, { sgk: number; title: string }> = {
    'bio-g9-b01': { sgk: 36, title: 'Khái quát về di truyền học' },
    'bio-g9-b02': { sgk: 37, title: 'Các quy luật di truyền của Mendel' },
    'bio-g9-b03': { sgk: 38, title: 'Nucleic acid và gene' },
    'bio-g9-b04': { sgk: 39, title: 'Tái bản DNA và phiên mã tạo RNA' },
    'bio-g9-b05': { sgk: 40, title: 'Dịch mã và mối quan hệ từ gene đến tính trạng' },
    'bio-g9-b06': { sgk: 41, title: 'Đột biến gene' },
    'bio-g9-b07': { sgk: 42, title: 'Nhiễm sắc thể và bộ nhiễm sắc thể' },
    'bio-g9-b08': { sgk: 43, title: 'Nguyên phân và giảm phân' },
    'bio-g9-b09': { sgk: 44, title: 'Nhiễm sắc thể giới tính và cơ chế xác định giới tính' },
    'bio-g9-b10': { sgk: 45, title: 'Di truyền liên kết' },
    'bio-g9-b11': { sgk: 46, title: 'Đột biến nhiễm sắc thể' },
    'bio-g9-b12': { sgk: 47, title: 'Di truyền học với con người' },
    'bio-g9-b13': { sgk: 48, title: 'Ứng dụng công nghệ di truyền vào đời sống' },
    'bio-g9-b14': { sgk: 49, title: 'Khái niệm tiến hoá và các hình thức chọn lọc' },
    'bio-g9-b15': { sgk: 50, title: 'Cơ chế tiến hoá' },
    'bio-g9-b16': { sgk: 51, title: 'Sự phát sinh và phát triển sự sống trên Trái Đất' },
  };

  // 1. Audit Curriculum
  console.log('1. Auditing Curriculum mapping...');
  const curriculumLessons = GRADE_9_BIOLOGY_CURRICULUM.chapters.flatMap((c) => c.lessons);
  if (curriculumLessons.length !== 16) {
    errors.push(`Curriculum should have 16 lessons, found ${curriculumLessons.length}`);
  }
  for (const [lessonId, exp] of Object.entries(expectedLessons)) {
    const l = curriculumLessons.find((item) => item.id === lessonId);
    if (!l) {
      errors.push(`Missing lesson in curriculum: ${lessonId}`);
    } else {
      if (l.sgkBaiSo !== exp.sgk) {
        errors.push(`Lesson ${lessonId} sgkBaiSo mismatch: expected ${exp.sgk}, got ${l.sgkBaiSo}`);
      }
      if (!l.ready) {
        errors.push(`Lesson ${lessonId} ready flag should be true`);
      }
      if (!l.nodes || l.nodes.length === 0) {
        errors.push(`Lesson ${lessonId} has no nodes`);
      }
    }
  }

  // 2. Audit files in src/content/biology/g9
  console.log('2. Auditing Theory & Exercise files...');
  for (const [lessonId, exp] of Object.entries(expectedLessons)) {
    // Find theory file
    let theoryFound = false;
    let exerciseFound = false;

    function findFiles(dir: string) {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const f of files) {
        const full = path.join(dir, f.name);
        if (f.isDirectory()) {
          findFiles(full);
        } else if (f.name === `${lessonId}.theory.json`) {
          theoryFound = true;
          const raw = JSON.parse(fs.readFileSync(full, 'utf-8'));
          const parseRes = TheoryContentSchema.safeParse(raw);
          if (!parseRes.success) {
            errors.push(`Theory ${lessonId} Zod schema invalid: ${parseRes.error.message}`);
          }
          if (raw.lessonId !== lessonId) {
            errors.push(`Theory ${lessonId} lessonId mismatch: got ${raw.lessonId}`);
          }
          if (raw.sgkBaiSo !== exp.sgk) {
            errors.push(`Theory ${lessonId} sgkBaiSo mismatch: expected ${exp.sgk}, got ${raw.sgkBaiSo}`);
          }
        } else if (f.name === `${lessonId}.exercises.json`) {
          exerciseFound = true;
          const raw = JSON.parse(fs.readFileSync(full, 'utf-8'));
          if (!Array.isArray(raw)) {
            errors.push(`Exercises in ${lessonId} must be an array`);
          } else {
            if (raw.length < 8) {
              warnings.push(`Lesson ${lessonId} has only ${raw.length} exercises (expected >= 8)`);
            }
            raw.forEach((ex: any, idx: number) => {
              const parseRes = ExerciseSchema.safeParse(ex);
              if (!parseRes.success) {
                errors.push(`Exercise ${ex.id || idx} in ${lessonId} invalid: ${parseRes.error.message}`);
              }
              if (ex.lessonId !== lessonId) {
                errors.push(`Exercise ${ex.id} lessonId mismatch: got ${ex.lessonId}`);
              }
              if (ex.sgkBaiSo !== exp.sgk) {
                errors.push(`Exercise ${ex.id} sgkBaiSo mismatch: expected ${exp.sgk}, got ${ex.sgkBaiSo}`);
              }
              // Check answer logic
              if (ex.answer?.kind === 'mcq-single') {
                const optIds = ex.answer.options.map((o: any) => o.id);
                if (!optIds.includes(ex.answer.correctId)) {
                  errors.push(`Exercise ${ex.id} mcq-single correctId "${ex.answer.correctId}" not in options [${optIds}]`);
                }
              }
              if (ex.answer?.kind === 'mcq-multi') {
                const optIds = ex.answer.options.map((o: any) => o.id);
                for (const cid of ex.answer.correctIds) {
                  if (!optIds.includes(cid)) {
                    errors.push(`Exercise ${ex.id} mcq-multi correctId "${cid}" not in options [${optIds}]`);
                  }
                }
              }
              if (ex.answer?.kind === 'number') {
                if (typeof ex.answer.value !== 'number' || isNaN(ex.answer.value)) {
                  errors.push(`Exercise ${ex.id} number answer value is NaN or not a number: ${ex.answer.value}`);
                }
              }
              // Check skillIds
              for (const sk of ex.skillIds || []) {
                if (!skillIdSet.has(sk)) {
                  warnings.push(`Exercise ${ex.id} references unregistered skillId "${sk}"`);
                }
              }
              // Check knowledge
              for (const kb of ex.knowledge || []) {
                if (!kbIds.has(kb)) {
                  warnings.push(`Exercise ${ex.id} references missing knowledge ID "${kb}"`);
                }
              }
            });
          }
        }
      }
    }
    findFiles(baseDir);

    if (!theoryFound) errors.push(`Missing theory file for ${lessonId}`);
    if (!exerciseFound) errors.push(`Missing exercises file for ${lessonId}`);
  }

  // 3. Check biology curriculum indexing
  console.log('3. Auditing BIOLOGY_CURRICULUM[9]...');
  const { BIOLOGY_CURRICULUM } = await import('../src/content/curriculum/biology');
  const g9LessonsInCurriculum = BIOLOGY_CURRICULUM[9]?.chapters.flatMap((c) => c.lessons) || [];
  for (const [lessonId] of Object.entries(expectedLessons)) {
    const inCurriculum = g9LessonsInCurriculum.find((item) => item.id === lessonId);
    if (!inCurriculum) {
      errors.push(`Lesson ${lessonId} missing from BIOLOGY_CURRICULUM[9]`);
    }
  }

  console.log('\n--- AUDIT SUMMARY ---');
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  if (errors.length > 0) {
    console.error('\nERRORS FOUND:');
    errors.forEach((e) => console.error('  - ' + e));
  }
  if (warnings.length > 0) {
    console.warn('\nWARNINGS FOUND:');
    warnings.forEach((w) => console.warn('  - ' + w));
  }
  if (errors.length === 0 && warnings.length === 0) {
    console.log('ALL CHECKS PASSED WITH 0 ERRORS AND 0 WARNINGS!');
  }
}

audit().catch(console.error);
