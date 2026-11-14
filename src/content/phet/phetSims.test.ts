import { describe, it, expect } from 'vitest';
import { PHET_SIMS, getPhetSims, phetEmbedUrl } from './phetSims';
import { findLesson } from '@/content/curriculum';

describe('PhET simulation catalogue', () => {
  it('has unique sim ids', () => {
    const ids = PHET_SIMS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only links to lessons that exist in the curriculum, with a matching grade', () => {
    for (const s of PHET_SIMS) {
      if (!s.lessonId) continue;
      const lesson = findLesson(s.lessonId, s.subject);
      expect(lesson, `${s.id} -> ${s.lessonId}`).toBeDefined();
      expect(s.lessonId.startsWith(`g${s.grade}-`) || s.lessonId.includes(`-g${s.grade}-`)).toBe(true);
    }
  });

  it('lists chemistry sims ordered by grade and builds the Vietnamese embed URL', () => {
    const chem = getPhetSims('chem');
    expect(chem.length).toBeGreaterThanOrEqual(10);
    expect(chem.map((s) => s.grade)).toEqual([...chem.map((s) => s.grade)].sort((a, b) => a - b));
    expect(phetEmbedUrl('build-an-atom')).toBe(
      'https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_vi.html'
    );
  });
});
