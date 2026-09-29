import fs from 'node:fs';
import path from 'node:path';

const g9Dir = path.resolve(process.cwd(), 'src/content/physics/g9');
const units = [
  'unit-1-nang-luong-co-hoc',
  'unit-2-anh-sang',
  'unit-3-dien',
  'unit-4-dien-tu',
  'unit-5-nang-luong-cuoc-song',
];

interface MathCheck {
  id: string;
  kind: string;
  prompt: string;
  answer: any;
  finalSolution: string;
}

const mathQuestions: MathCheck[] = [];

for (const unit of units) {
  const unitPath = path.join(g9Dir, unit);
  const files = fs.readdirSync(unitPath).filter(f => f.endsWith('.exercises.json'));
  for (const file of files) {
    const list = JSON.parse(fs.readFileSync(path.join(unitPath, file), 'utf-8'));
    list.forEach((ex: any) => {
      if (
        ex.answer.kind === 'number' ||
        ex.given ||
        ex.find ||
        /\d+\s*(?:m|kg|s|J|kJ|W|kW|V|A|mA|Ω|cm|mm|diop|độ|kWh)/.test(ex.prompt)
      ) {
        mathQuestions.push({
          id: ex.id,
          kind: ex.answer.kind,
          prompt: ex.prompt,
          answer: ex.answer,
          finalSolution: ex.finalSolution,
        });
      }
    });
  }
}

console.log(`Found ${mathQuestions.length} calculation/quantitative questions across G9:`);
mathQuestions.forEach((q, i) => {
  console.log(`\n[${i + 1}] ${q.id} (${q.kind})`);
  console.log(`Prompt: ${q.prompt}`);
  if (q.kind === 'number') {
    console.log(`Answer Value: ${q.answer.value} ${q.answer.unit || ''}`);
  } else if (q.kind === 'mcq-single') {
    const opt = q.answer.options.find((o: any) => o.id === q.answer.correctId);
    console.log(`MCQ Correct (${q.answer.correctId}): ${opt?.label}`);
  }
  console.log(`Solution: ${q.finalSolution}`);
});
