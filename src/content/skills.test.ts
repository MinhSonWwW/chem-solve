import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { SKILLS } from './skills';

/** Exercise JSON files under a content folder. */
function exerciseFiles(dir: string): string[] {
  const out: string[] = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) out.push(...exerciseFiles(p));
    else if (p.endsWith('.json')) out.push(p);
  }
  return out;
}

describe('skills', () => {
  it('has unique ids', () => {
    const ids = SKILLS.map((s) => s.id);
    expect(ids.length).toBe(new Set(ids).size);
  });

  // The teacher's "Kỹ năng cần ôn lại" only shows named skills. Physics exercises use one
  // fine-grained skill id per question, so physics is analysed per lesson ("Bài cần ôn lại") instead.
  it('names every skill used by chemistry and biology exercises', () => {
    const named = new Set(SKILLS.map((s) => s.id));
    const missing = new Set<string>();
    for (const dir of ['src/content/exercises', 'src/content/biology']) {
      for (const f of exerciseFiles(dir)) {
        const data = JSON.parse(fs.readFileSync(f, 'utf8'));
        const list = Array.isArray(data) ? data : data.exercises;
        if (!Array.isArray(list)) continue;
        for (const ex of list) for (const id of ex.skillIds ?? []) if (!named.has(id)) missing.add(`${ex.lessonId}: ${id}`);
      }
    }
    expect([...missing]).toEqual([]);
  });
});
