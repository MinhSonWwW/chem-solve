import { describe, it, expect } from 'vitest';
import { decidePracticeHeart, localDay } from './practiceHearts';

const now = new Date(2026, 10, 14, 9, 0).getTime();
const base = { unitKey: 'phy-g6-b01:practice-don-vi', hearts: 4, maxHearts: 10, log: {}, now };

describe('practice heart reward', () => {
  it.each<[string, Partial<Parameters<typeof decidePracticeHeart>[0]>, boolean, string | undefined]>([
    ['3/4 correct earns a heart', { accuracy: 0.75 }, true, undefined],
    ['4/4 correct earns a heart', { accuracy: 1 }, true, undefined],
    ['2/4 correct does not', { accuracy: 0.5 }, false, 'low-accuracy'],
    ['same unit again the same day does not', { accuracy: 1, log: { 'phy-g6-b01:practice-don-vi': localDay(now) } }, false, 'already-today'],
    ['same unit, but yesterday, does', { accuracy: 1, log: { 'phy-g6-b01:practice-don-vi': localDay(now - 86_400_000) } }, true, undefined],
    ['another unit the same day does', { accuracy: 1, log: { 'phy-g6-b01:practice-dung-cu': localDay(now) } }, true, undefined],
    ['full hearts: nothing to add', { accuracy: 1, hearts: 10 }, false, 'hearts-full'],
  ])('%s', (_name, over, award, reason) => {
    const d = decidePracticeHeart({ ...base, accuracy: 1, ...over });
    expect(d.award).toBe(award);
    if (!d.award) expect(d.reason).toBe(reason);
  });

  it('records the unit for today and drops older days', () => {
    const d = decidePracticeHeart({ ...base, accuracy: 1, log: { old: '2020-01-01', other: localDay(now) } });
    expect(d.log).toEqual({ other: localDay(now), 'phy-g6-b01:practice-don-vi': localDay(now) });
  });
});
