import fs from 'node:fs';
import path from 'node:path';
import { ExerciseSchema } from '../src/content/schema/exercise';
import { checkBalance } from '../src/chem/checkBalance';
import knowledgeList from '../src/content/kb/knowledge.json';

const KNOWLEDGE_IDS = new Set(knowledgeList.map((k) => k.id));

export interface ValidationReport {
  totalFiles: number;
  totalExercises: number;
  errors: string[];
}

export function validateContent(exercisesDir: string): ValidationReport {
  const errors: string[] = [];
  const exerciseIds = new Set<string>();
  let totalFiles = 0;
  let totalExercises = 0;

  if (!fs.existsSync(exercisesDir)) {
    return { totalFiles: 0, totalExercises: 0, errors: [`Directory not found: ${exercisesDir}`] };
  }

  function walkDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        totalFiles++;
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const json = JSON.parse(content);
          if (!Array.isArray(json)) {
            errors.push(`${entry.name}: File content must be a JSON array of exercises`);
            continue;
          }

          json.forEach((ex, idx) => {
            totalExercises++;
            // 1. Zod validation
            const parsed = ExerciseSchema.safeParse(ex);
            if (!parsed.success) {
              errors.push(
                `${entry.name} [item ${idx} - id: ${ex.id || 'unknown'}]: ${parsed.error.issues
                  .map((i) => `${i.path.join('.')}: ${i.message}`)
                  .join('; ')}`
              );
              return;
            }

            const data = parsed.data;

            // 2. ID uniqueness
            if (exerciseIds.has(data.id)) {
              errors.push(`${entry.name}: Duplicate exercise id "${data.id}"`);
            } else {
              exerciseIds.add(data.id);
            }

            // 3. Knowledge base reference check
            for (const kId of data.knowledge) {
              if (!KNOWLEDGE_IDS.has(kId)) {
                errors.push(
                  `${entry.name} [${data.id}]: Referenced knowledge ID "${kId}" not found in knowledge.json`
                );
              }
            }

            // 4. Equation balancing check if answer kind is equation
            if (data.answer.kind === 'equation') {
              const rCount = data.answer.reactants.length;
              const rCoefs = data.answer.coefficients.slice(0, rCount);
              const pCoefs = data.answer.coefficients.slice(rCount);
              const leftStr = data.answer.reactants
                .map((r, i) => `${(rCoefs[i] || 1) > 1 ? rCoefs[i] : ''}${r}`)
                .join(' + ');
              const rightStr = data.answer.products
                .map((p, i) => `${(pCoefs[i] || 1) > 1 ? pCoefs[i] : ''}${p}`)
                .join(' + ');
              const eqStr = `${leftStr} -> ${rightStr}`;
              try {
                const bal = checkBalance(eqStr);
                if (!bal.isBalanced) {
                  errors.push(
                    `${entry.name} [${data.id}]: Equation is not balanced (${eqStr}). ${bal.feedbackMessage}`
                  );
                }
              } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                errors.push(`${entry.name} [${data.id}]: Equation parse error (${eqStr}): ${msg}`);
              }
            }
          });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`${entry.name}: Invalid JSON file: ${msg}`);
        }
      }
    }
  }

  walkDir(exercisesDir);

  return {
    totalFiles,
    totalExercises,
    errors
  };
}

// Run CLI directly if called from node
import { fileURLToPath } from 'node:url';

const currentPath = path.resolve(fileURLToPath(import.meta.url));
const scriptPath = process.argv[1] ? path.resolve(process.argv[1]) : '';

if (currentPath === scriptPath || process.argv[1]?.includes('validate-content')) {
  const contentDir = path.resolve(process.cwd(), 'src/content/exercises');
  console.log(`🔍 Validating exercises in ${contentDir}...`);
  const report = validateContent(contentDir);

  console.log(`Scanned ${report.totalFiles} files, ${report.totalExercises} exercises.`);
  if (report.errors.length > 0) {
    console.error(`❌ Validation failed with ${report.errors.length} errors:`);
    report.errors.forEach((e) => console.error(` - ${e}`));
    process.exit(1);
  } else {
    console.log('✅ All exercises are valid!');
  }
}
