import { describe, it, expect } from 'vitest';
import { PHET_SIMS, getPhetSims, getPhetSimsForLesson, phetEmbedUrl } from './phetSims';
import { findLesson } from '@/content/curriculum';

describe('PhET simulation catalogue', () => {
  it('has unique sim ids', () => {
    const ids = PHET_SIMS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only links to lessons that exist in the curriculum, main lesson matching the grade', () => {
    for (const s of PHET_SIMS) {
      expect(new Set(s.lessonIds).size, `${s.id} has duplicate lessons`).toBe(s.lessonIds.length);
      for (const id of s.lessonIds) {
        expect(findLesson(id, s.subject), `${s.id} -> ${id}`).toBeDefined();
        const prefix = s.subject === 'chem' ? 'g' : s.subject === 'physics' ? 'phy-g' : 'bio-g';
        expect(id.startsWith(prefix), `${s.id} -> ${id} is another subject`).toBe(true);
      }
      const main = s.lessonIds[0];
      if (main) {
        expect(main.startsWith(`g${s.grade}-`) || main.includes(`-g${s.grade}-`), `${s.id} main lesson grade`).toBe(true);
      }
    }
  });

  it('puts the main-lesson sim first when a lesson has several sims', () => {
    expect(getPhetSimsForLesson('g8-b08').map((s) => s.id)).toEqual(['acid-base-solutions', 'ph-scale-basics']);
    expect(getPhetSimsForLesson('g8-b09').map((s) => s.id)).toEqual(['ph-scale-basics', 'acid-base-solutions']);
    expect(getPhetSimsForLesson('phy-g7-b09').map((s) => s.id)).toEqual(['bending-light']);
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
