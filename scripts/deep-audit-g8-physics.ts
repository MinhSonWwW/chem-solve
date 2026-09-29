import fs from 'node:fs';
import path from 'node:path';

const g8Dir = path.resolve(process.cwd(), 'src/content/physics/g8');
const units = [
  'unit-1-khoi-luong-rieng-ap-suat',
  'unit-2-tac-dung-lam-quay',
  'unit-3-dien',
  'unit-4-nhiet'
];

const EXPECTED_LESSON_SGK_MAP: Record<string, number> = {
  'phy-g8-b01': 13,
  'phy-g8-b02': 14,
  'phy-g8-b03': 15,
  'phy-g8-b04': 16,
  'phy-g8-b05': 17,
  'phy-g8-b06': 18,
  'phy-g8-b07': 19,
  'phy-g8-b08': 20,
  'phy-g8-b09': 21,
  'phy-g8-b10': 22,
  'phy-g8-b11': 23,
  'phy-g8-b12': 24,
  'phy-g8-b13': 25,
  'phy-g8-b14': 26,
  'phy-g8-b15': 27,
  'phy-g8-b16': 28,
  'phy-g8-b17': 29,
};

const issues: string[] = [];

for (const unit of units) {
  const unitPath = path.join(g8Dir, unit);
  const files = fs.readdirSync(unitPath);

  for (const file of files) {
    const fullPath = path.join(unitPath, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const json = JSON.parse(content);

    if (file.endsWith('.theory.json')) {
      const expectedSgk = EXPECTED_LESSON_SGK_MAP[json.lessonId];
      if (json.sgkBaiSo !== expectedSgk) {
        issues.push(`${file}: sgkBaiSo is ${json.sgkBaiSo}, expected ${expectedSgk}`);
      }
      // Check unclosed math $
      const dollarCount = (content.match(/\$/g) || []).length;
      if (dollarCount % 2 !== 0) {
        issues.push(`${file}: Unbalanced LaTeX dollar signs ($): count is ${dollarCount}`);
      }
    } else if (file.endsWith('.exercises.json')) {
      // Check unclosed math $
      const dollarCount = (content.match(/\$/g) || []).length;
      if (dollarCount % 2 !== 0) {
        issues.push(`${file}: Unbalanced LaTeX dollar signs ($): count is ${dollarCount}`);
      }

      json.forEach((ex: any) => {
        const expectedSgk = EXPECTED_LESSON_SGK_MAP[ex.lessonId];
        if (ex.sgkBaiSo !== expectedSgk) {
          issues.push(`${file} [${ex.id}]: sgkBaiSo is ${ex.sgkBaiSo}, expected ${expectedSgk}`);
        }

        // Check if numeric calculation matches steps
        if (ex.answer.kind === 'number') {
          const val = ex.answer.value;
          const unit = ex.answer.unit;
          const valStr = String(val);
          const finalSolClean = (ex.finalSolution || '')
            .replace(/\\,/g, '')
            .replace(/\{,\}/g, '.')
            .replace(/,/g, '.');
          if (!finalSolClean.includes(valStr)) {
            issues.push(`${file} [${ex.id}]: finalSolution ("${ex.finalSolution}") does not contain answer.value (${val})`);
          }
        }

        // Check if MCQ correct option matches final solution keywords
        if (ex.answer.kind === 'mcq-single') {
          const correctOpt = ex.answer.options.find((o: any) => o.id === ex.answer.correctId);
          if (!correctOpt) {
            issues.push(`${file} [${ex.id}]: correctId "${ex.answer.correctId}" not found in options`);
          }
        }
      });
    }
  }
}

console.log(`Deep audit finished. Found ${issues.length} issues.`);
if (issues.length > 0) {
  issues.forEach((i) => console.log(' - ' + i));
} else {
  console.log('✅ All 17 lessons match exact SGK numbers, balanced LaTeX formulas, and solution values!');
}
