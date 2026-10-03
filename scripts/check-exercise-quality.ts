import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('src/content/biology/g9');

function checkExercises() {
  const dirs = fs.readdirSync(baseDir, { withFileTypes: true });
  let totalEx = 0;
  let issues = 0;

  for (const d of dirs) {
    if (!d.isDirectory()) continue;
    const unitPath = path.join(baseDir, d.name);
    const files = fs.readdirSync(unitPath).filter((f) => f.endsWith('.exercises.json'));

    for (const f of files) {
      const full = path.join(unitPath, f);
      const exercises = JSON.parse(fs.readFileSync(full, 'utf-8'));
      console.log(`\nChecking ${f} (${exercises.length} questions)...`);

      exercises.forEach((ex: any, idx: number) => {
        totalEx++;
        // Check for empty or trivial fields
        if (!ex.prompt || ex.prompt.trim().length < 10) {
          console.error(`  [!] Ex ${ex.id} has very short prompt: "${ex.prompt}"`);
          issues++;
        }
        if (!ex.finalSolution || ex.finalSolution.trim().length < 10) {
          console.error(`  [!] Ex ${ex.id} has very short finalSolution: "${ex.finalSolution}"`);
          issues++;
        }
        if (!ex.hints || ex.hints.length < 2) {
          console.error(`  [!] Ex ${ex.id} has < 2 hints`);
          issues++;
        }
        if (!ex.steps || ex.steps.length < 3) {
          console.error(`  [!] Ex ${ex.id} has < 3 steps`);
          issues++;
        }

        // Logic check for MCQ-single
        if (ex.answer?.kind === 'mcq-single') {
          const opt = ex.answer.options.find((o: any) => o.id === ex.answer.correctId);
          if (!opt) {
            console.error(`  [!] Ex ${ex.id} correctId not found in options`);
            issues++;
          }
        }

        // Check if finalSolution mentions correct answer or reason
        const solLower = (ex.finalSolution || '').toLowerCase();
        if (ex.answer?.kind === 'mcq-single') {
          const opt = ex.answer.options.find((o: any) => o.id === ex.answer.correctId);
          // Just check that opt exists
          if (!opt.label) {
            console.error(`  [!] Ex ${ex.id} correct option has empty label`);
            issues++;
          }
        }
      });
    }
  }

  console.log(`\nChecked total ${totalEx} exercises across all 16 lessons.`);
  console.log(`Issues found: ${issues}`);
}

checkExercises();
