import fs from 'node:fs';
import path from 'node:path';
import { ExerciseSchema } from '../src/content/schema/exercise';
import { TheoryContentSchema } from '../src/content/schema/theory';

const g9Dir = path.resolve(process.cwd(), 'src/content/physics/g9');
const units = [
  'unit-1-nang-luong-co-hoc',
  'unit-2-anh-sang',
  'unit-3-dien',
  'unit-4-dien-tu',
  'unit-5-nang-luong-cuoc-song',
];

const EXPECTED_LESSON_SGK_MAP: Record<string, { sgk: number; title: string }> = {
  'phy-g9-b01': { sgk: 2, title: 'Động năng. Thế năng' },
  'phy-g9-b02': { sgk: 3, title: 'Cơ năng' },
  'phy-g9-b03': { sgk: 4, title: 'Công và công suất' },
  'phy-g9-b04': { sgk: 5, title: 'Khúc xạ ánh sáng' },
  'phy-g9-b05': { sgk: 6, title: 'Phản xạ toàn phần' },
  'phy-g9-b06': { sgk: 7, title: 'Lăng kính' },
  'phy-g9-b07': { sgk: 8, title: 'Thấu kính' },
  'phy-g9-b08': { sgk: 9, title: 'Thực hành đo tiêu cự của thấu kính hội tụ' },
  'phy-g9-b09': { sgk: 10, title: 'Kính lúp' },
  'phy-g9-b10': { sgk: 11, title: 'Điện trở. Định luật Ohm' },
  'phy-g9-b11': { sgk: 12, title: 'Đoạn mạch nối tiếp, song song' },
  'phy-g9-b12': { sgk: 13, title: 'Năng lượng dòng điện. Công suất điện' },
  'phy-g9-b13': { sgk: 14, title: 'Cảm ứng điện từ. Dòng điện xoay chiều' },
  'phy-g9-b14': { sgk: 15, title: 'Tác dụng của dòng điện xoay chiều' },
  'phy-g9-b15': { sgk: 16, title: 'Vòng năng lượng trên Trái Đất. Năng lượng hóa thạch' },
  'phy-g9-b16': { sgk: 17, title: 'Một số dạng năng lượng tái tạo' },
};

const issues: string[] = [];
let totalExercises = 0;
let totalTheories = 0;

for (const unit of units) {
  const unitPath = path.join(g9Dir, unit);
  if (!fs.existsSync(unitPath)) {
    issues.push(`Unit folder missing: ${unit}`);
    continue;
  }
  const files = fs.readdirSync(unitPath);

  for (const file of files) {
    const fullPath = path.join(unitPath, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    let json: any;
    try {
      json = JSON.parse(content);
    } catch (e: any) {
      issues.push(`${file}: Invalid JSON - ${e.message}`);
      continue;
    }

    // Check LaTeX balance
    const dollarMatches = content.match(/(?<!\\)\$/g);
    const dollarCount = dollarMatches ? dollarMatches.length : 0;
    if (dollarCount % 2 !== 0) {
      issues.push(`${file}: Unbalanced LaTeX dollar signs ($): count is ${dollarCount}`);
    }

    if (file.endsWith('.theory.json')) {
      totalTheories++;
      const parseResult = TheoryContentSchema.safeParse(json);
      if (!parseResult.success) {
        issues.push(`${file}: TheorySchema errors: ${parseResult.error.message}`);
      }

      const lessonId = json.lessonId;
      const expected = EXPECTED_LESSON_SGK_MAP[lessonId];
      if (!expected) {
        issues.push(`${file}: Unknown lessonId ${lessonId}`);
      } else if (json.sgkBaiSo !== expected.sgk) {
        issues.push(`${file}: sgkBaiSo is ${json.sgkBaiSo}, expected ${expected.sgk}`);
      }

      if (!json.cards || json.cards.length < 3) {
        issues.push(`${file}: Theory has fewer than 3 cards`);
      }

      if (!json.quickCheck || !json.quickCheck.options) {
        issues.push(`${file}: Missing quickCheck`);
      } else {
        const correctCount = json.quickCheck.options.filter((o: any) => o.correct).length;
        if (correctCount !== 1) {
          issues.push(`${file}: quickCheck has ${correctCount} correct options, expected exactly 1`);
        }
      }
    } else if (file.endsWith('.exercises.json')) {
      if (!Array.isArray(json)) {
        issues.push(`${file}: Exercises must be an array`);
        continue;
      }

      if (json.length < 8) {
        issues.push(`${file}: Has ${json.length} exercises, expected at least 8`);
      }

      const lessonIdMatch = file.replace('.exercises.json', '');
      const expected = EXPECTED_LESSON_SGK_MAP[lessonIdMatch];

      const exerciseIds = new Set<string>();

      json.forEach((ex: any, idx: number) => {
        totalExercises++;
        const parseResult = ExerciseSchema.safeParse(ex);
        if (!parseResult.success) {
          issues.push(`${file} [index ${idx}, id: ${ex.id}]: Schema error: ${parseResult.error.message}`);
        }

        if (exerciseIds.has(ex.id)) {
          issues.push(`${file}: Duplicate exercise id ${ex.id}`);
        }
        exerciseIds.add(ex.id);

        if (expected && ex.sgkBaiSo !== expected.sgk) {
          issues.push(`${file} [${ex.id}]: sgkBaiSo is ${ex.sgkBaiSo}, expected ${expected.sgk}`);
        }

        if (ex.lessonId !== lessonIdMatch) {
          issues.push(`${file} [${ex.id}]: lessonId "${ex.lessonId}" does not match file "${lessonIdMatch}"`);
        }

        // Check MCQ
        if (ex.answer?.kind === 'mcq-single') {
          const options = ex.answer.options || [];
          if (options.length < 2) {
            issues.push(`${file} [${ex.id}]: MCQ has fewer than 2 options`);
          }
          const correctOpt = options.find((o: any) => o.id === ex.answer.correctId);
          if (!correctOpt) {
            issues.push(`${file} [${ex.id}]: correctId "${ex.answer.correctId}" not in options`);
          }
        }

        // Check number
        if (ex.answer?.kind === 'number') {
          const val = ex.answer.value;
          if (typeof val !== 'number' || !Number.isFinite(val)) {
            issues.push(`${file} [${ex.id}]: answer.value is not a valid finite number`);
          }
          const valStr = String(val);
          const fullText = JSON.stringify(ex.steps) + ' ' + (ex.finalSolution || '');
          const cleanText = fullText.replace(/\\,/g, '').replace(/\{,\}/g, '.').replace(/,/g, '.');
          if (!cleanText.includes(valStr)) {
            issues.push(`${file} [${ex.id}]: number value ${val} not found in steps or finalSolution`);
          }
        }

        // Check ordering
        if (ex.answer?.kind === 'ordering') {
          const correctOrder = ex.answer.correctOrder || [];
          if (!Array.isArray(correctOrder) || correctOrder.length < 2) {
            issues.push(`${file} [${ex.id}]: ordering correctOrder must have at least 2 items`);
          }
          const uniqueItems = new Set(correctOrder);
          if (uniqueItems.size !== correctOrder.length) {
            issues.push(`${file} [${ex.id}]: ordering items are not unique`);
          }
        }

        // Check hints
        if (!ex.hints || ex.hints.length < 2) {
          issues.push(`${file} [${ex.id}]: Has fewer than 2 hints`);
        }

        // Check steps
        if (!ex.steps || ex.steps.length < 2) {
          issues.push(`${file} [${ex.id}]: Has fewer than 2 steps`);
        }

        // Check common mistakes
        if (!ex.commonMistakes || ex.commonMistakes.length < 1) {
          issues.push(`${file} [${ex.id}]: Missing commonMistakes`);
        }
      });
    }
  }
}

console.log('--- AUDIT RESULTS FOR GRADE 9 PHYSICS ---');
console.log(`Units checked: ${units.length}`);
console.log(`Theories checked: ${totalTheories} (expected 16)`);
console.log(`Exercises checked: ${totalExercises} (expected >= 128)`);
console.log(`Issues found: ${issues.length}`);

if (issues.length > 0) {
  console.log('\n❌ ISSUES DETECTED:');
  issues.forEach((issue) => console.log(` - ${issue}`));
} else {
  console.log('\n✅ ALL 16 LESSONS ACROSS UNITS 1-5 PASSED ALL SCHEMA, LATEX, SGK, AND LOGIC CHECKS!');
}
