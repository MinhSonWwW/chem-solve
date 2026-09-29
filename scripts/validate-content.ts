import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ExerciseSchema } from '../src/content/schema/exercise';
import { TheoryContentSchema } from '../src/content/schema/theory';
import { checkBalance } from '../src/chem/checkBalance';
import knowledgeList from '../src/content/kb/knowledge.json';

const KNOWLEDGE_IDS = new Set<string>(knowledgeList.map((k) => k.id));

// Load all knowledge IDs from src/content/kb recursively
try {
  const kbDir = path.resolve(process.cwd(), 'src/content/kb');
  function scanKb(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanKb(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        try {
          const list = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
          if (Array.isArray(list)) {
            list.forEach((item: { id?: string }) => {
              if (item?.id) {
                KNOWLEDGE_IDS.add(item.id);
                KNOWLEDGE_IDS.add(`constant.${item.id}`);
                KNOWLEDGE_IDS.add(`formula.${item.id}`);
              }
            });
          }
        } catch {
          // ignore malformed kb file
        }
      }
    }
  }
  scanKb(kbDir);
} catch (err) {
  console.warn('Could not scan knowledge base:', err);
}

export interface ValidationReport {
  totalFiles: number;
  totalExercises: number;
  totalTheories: number;
  errors: string[];
}

export function validateContent(contentDir: string): ValidationReport {
  const errors: string[] = [];
  const exerciseIds = new Set<string>();
  let totalFiles = 0;
  let totalExercises = 0;
  let totalTheories = 0;

  if (!fs.existsSync(contentDir)) {
    return { totalFiles: 0, totalExercises: 0, totalTheories: 0, errors: [`Directory not found: ${contentDir}`] };
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

          // Handle Theory JSON
          if (entry.name.endsWith('.theory.json')) {
            totalTheories++;
            const parsedTheory = TheoryContentSchema.safeParse(json);
            if (!parsedTheory.success) {
              errors.push(
                `${entry.name}: ${parsedTheory.error.issues
                  .map((i) => `${i.path.join('.')}: ${i.message}`)
                  .join('; ')}`
              );
            }
            continue;
          }

          // Handle Exercise JSON (array of exercises)
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
                  `${entry.name} [${data.id}]: Referenced knowledge ID "${kId}" not found in knowledge base`
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

  walkDir(contentDir);

  return {
    totalFiles,
    totalExercises,
    totalTheories,
    errors
  };
}

const currentPath = path.resolve(fileURLToPath(import.meta.url));
const scriptPath = process.argv[1] ? path.resolve(process.argv[1]) : '';

if (currentPath === scriptPath || process.argv[1]?.includes('validate-content')) {
  const dirsToScan = [
    path.resolve(process.cwd(), 'src/content/exercises'),
    path.resolve(process.cwd(), 'src/content/physics'),
  ].filter(fs.existsSync);

  let grandTotalFiles = 0;
  let grandTotalExercises = 0;
  let grandTotalTheories = 0;
  const allErrors: string[] = [];

  for (const dir of dirsToScan) {
    console.log(`🔍 Validating content in ${dir}...`);
    const report = validateContent(dir);
    grandTotalFiles += report.totalFiles;
    grandTotalExercises += report.totalExercises;
    grandTotalTheories += report.totalTheories;
    allErrors.push(...report.errors);
  }

  console.log(`Scanned ${grandTotalFiles} files: ${grandTotalExercises} exercises, ${grandTotalTheories} theories.`);
  if (allErrors.length > 0) {
    console.error(`❌ Validation failed with ${allErrors.length} errors:`);
    allErrors.forEach((e) => console.error(` - ${e}`));
    process.exit(1);
  } else {
    console.log('✅ All content files are valid!');
  }
}
