import fs from 'node:fs';
import path from 'node:path';

const g8Dir = path.resolve(process.cwd(), 'src/content/physics/g8');
const units = [
  'unit-1-khoi-luong-rieng-ap-suat',
  'unit-2-tac-dung-lam-quay',
  'unit-3-dien',
  'unit-4-nhiet'
];

interface Issue {
  file: string;
  itemId?: string;
  type: string;
  message: string;
}

const issues: Issue[] = [];

for (const unit of units) {
  const unitPath = path.join(g8Dir, unit);
  if (!fs.existsSync(unitPath)) {
    issues.push({ file: unit, type: 'missing_dir', message: `Directory does not exist: ${unitPath}` });
    continue;
  }

  const files = fs.readdirSync(unitPath);
  for (const file of files) {
    const fullPath = path.join(unitPath, file);
    if (!file.endsWith('.json')) continue;

    const raw = fs.readFileSync(fullPath, 'utf-8');
    let data: any;
    try {
      data = JSON.parse(raw);
    } catch (e: any) {
      issues.push({ file, type: 'json_syntax', message: e.message });
      continue;
    }

    if (file.endsWith('.theory.json')) {
      // Check theory
      if (!data.lessonId || !data.nodeId || !data.title || !data.cards || !data.quickCheck) {
        issues.push({ file, type: 'theory_structure', message: 'Missing required top-level fields in theory' });
      }
      if (Array.isArray(data.cards)) {
        if (data.cards.length < 3) {
          issues.push({ file, type: 'theory_cards', message: `Only ${data.cards.length} cards, expected at least 3` });
        }
        data.cards.forEach((c: any, idx: number) => {
          if (!c.id || !c.badge || !c.title || !c.bulletPoints || c.bulletPoints.length === 0) {
            issues.push({ file, type: 'theory_card_content', message: `Card ${idx} (${c.id}) incomplete` });
          }
        });
      }
      if (data.quickCheck) {
        const correctCount = (data.quickCheck.options || []).filter((o: any) => o.correct).length;
        if (correctCount !== 1) {
          issues.push({ file, type: 'theory_quickcheck', message: `QuickCheck has ${correctCount} correct options, expected exactly 1` });
        }
      }
    } else if (file.endsWith('.exercises.json')) {
      if (!Array.isArray(data)) {
        issues.push({ file, type: 'exercise_format', message: 'Exercises file must be an array' });
        continue;
      }
      if (data.length < 6) {
        issues.push({ file, type: 'exercise_count', message: `Only ${data.length} exercises, expected at least 6` });
      }

      data.forEach((ex: any, idx: number) => {
        const id = ex.id || `index_${idx}`;
        if (!ex.lessonId) issues.push({ file, itemId: id, type: 'missing_field', message: 'Missing lessonId' });
        if (!ex.sgkBaiSo) issues.push({ file, itemId: id, type: 'missing_field', message: 'Missing sgkBaiSo' });
        if (!ex.prompt || ex.prompt.trim().length < 10) issues.push({ file, itemId: id, type: 'prompt_too_short', message: 'Prompt too short or missing' });
        if (!ex.hints || ex.hints.length < 2) issues.push({ file, itemId: id, type: 'hints_count', message: `Only ${ex.hints?.length || 0} hints, expected >= 2` });
        if (!ex.steps || ex.steps.length < 3) issues.push({ file, itemId: id, type: 'steps_count', message: `Only ${ex.steps?.length || 0} steps, expected >= 3` });
        if (!ex.finalSolution) issues.push({ file, itemId: id, type: 'missing_solution', message: 'Missing finalSolution' });
        if (!ex.commonMistakes || ex.commonMistakes.length === 0) issues.push({ file, itemId: id, type: 'missing_mistakes', message: 'Missing commonMistakes' });

        // Answer specific validation
        const ans = ex.answer;
        if (!ans) {
          issues.push({ file, itemId: id, type: 'missing_answer', message: 'Missing answer' });
          return;
        }

        if (ans.kind === 'mcq-single') {
          if (!ans.options || ans.options.length < 2) {
            issues.push({ file, itemId: id, type: 'mcq_options', message: 'Less than 2 options' });
          } else {
            const ids = ans.options.map((o: any) => o.id);
            const uniqueIds = new Set(ids);
            if (ids.length !== uniqueIds.size) {
              issues.push({ file, itemId: id, type: 'mcq_duplicate_option_ids', message: 'Duplicate option IDs' });
            }
            if (!uniqueIds.has(ans.correctId)) {
              issues.push({ file, itemId: id, type: 'mcq_invalid_correct_id', message: `correctId "${ans.correctId}" not in options` });
            }
          }
        } else if (ans.kind === 'number') {
          if (typeof ans.value !== 'number' || isNaN(ans.value)) {
            issues.push({ file, itemId: id, type: 'number_invalid_value', message: `Invalid numeric value: ${ans.value}` });
          }
          if (!ans.unit && ans.unit !== '') {
            issues.push({ file, itemId: id, type: 'number_missing_unit', message: 'Missing unit field' });
          }
        } else if (ans.kind === 'ordering') {
          if (!Array.isArray(ans.correctOrder) || ans.correctOrder.length < 3) {
            issues.push({ file, itemId: id, type: 'ordering_items', message: 'Ordering exercise has fewer than 3 items' });
          }
        }
      });
    }
  }
}

console.log(`Audit finished. Found ${issues.length} potential issues.`);
if (issues.length > 0) {
  console.log(JSON.stringify(issues, null, 2));
} else {
  console.log('✅ ALL STRUCTURAL AND PEDAGOGICAL CHECKS PASSED PERFECTLY!');
}
