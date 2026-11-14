import { describe, it, expect, vi } from 'vitest';
import {
  CODE_ALPHABET,
  ReportSchema,
  generateClassCode,
  normalizeClassCode,
  sha256Hex,
  verifyGoogleAccessToken,
} from './classroom';

const CLIENT = 'abc.apps.googleusercontent.com';

function fakeFetch(tokeninfo: Record<string, string> | null, name = 'Cô Lan') {
  return vi.fn(async (url: string | URL | Request) => {
    const u = String(url);
    if (u.includes('tokeninfo')) {
      return tokeninfo ? new Response(JSON.stringify(tokeninfo)) : new Response('bad', { status: 400 });
    }
    return new Response(JSON.stringify({ name }));
  }) as unknown as typeof fetch;
}

describe('verifyGoogleAccessToken', () => {
  const ok = { aud: CLIENT, sub: '123', email: 'lan@school.edu.vn', email_verified: 'true', expires_in: '3500' };

  it('accepts a valid token for our client and returns the profile name', async () => {
    await expect(verifyGoogleAccessToken('tok', [CLIENT], fakeFetch(ok))).resolves.toEqual({
      sub: '123',
      email: 'lan@school.edu.vn',
      name: 'Cô Lan',
    });
  });

  it('rejects tokens issued to another app', async () => {
    await expect(verifyGoogleAccessToken('tok', [CLIENT], fakeFetch({ ...ok, aud: 'evil.apps' }))).rejects.toMatchObject({
      status: 401,
    });
  });

  it('rejects unverified emails, expired and invalid tokens', async () => {
    await expect(verifyGoogleAccessToken('t', [CLIENT], fakeFetch({ ...ok, email_verified: 'false' }))).rejects.toMatchObject({ status: 401 });
    await expect(verifyGoogleAccessToken('t', [CLIENT], fakeFetch({ ...ok, expires_in: '0' }))).rejects.toMatchObject({ status: 401 });
    await expect(verifyGoogleAccessToken('t', [CLIENT], fakeFetch(null))).rejects.toMatchObject({ status: 401 });
  });
});

describe('class codes', () => {
  it('uses 6 unambiguous characters (no I, L, O, 0, 1)', () => {
    for (let i = 0; i < 200; i++) {
      const code = generateClassCode();
      expect(code).toMatch(/^[A-Z2-9]{6}$/);
      expect(code).not.toMatch(/[ILO01]/);
      for (const ch of code) expect(CODE_ALPHABET).toContain(ch);
    }
  });

  it('normalises what students type', () => {
    expect(normalizeClassCode(' vwh rff ')).toBe('VWHRFF');
    expect(normalizeClassCode('ab-c2-3d')).toBe('ABC23D');
  });
});

describe('ReportSchema', () => {
  const session = {
    reportId: 'rep-12345678',
    lessonId: 'g7-b05',
    nodeId: 'g7-b05-n01',
    isPractice: false,
    accuracy: 0.8,
    xp: 40,
    completedAt: 1_763_000_000_000,
    questions: [{ exerciseId: 'g7-b05-mcq-001', skillIds: ['valence'], correctFirstTry: true, attempts: 1 }],
  };
  it('accepts a normal report', () => {
    expect(ReportSchema.safeParse({ sessions: [session] }).success).toBe(true);
  });
  it('rejects bogus lesson ids, accuracy > 1 and empty reports', () => {
    expect(ReportSchema.safeParse({ sessions: [{ ...session, lessonId: 'gen-mol' }] }).success).toBe(false);
    expect(ReportSchema.safeParse({ sessions: [{ ...session, accuracy: 2 }] }).success).toBe(false);
    expect(ReportSchema.safeParse({ sessions: [] }).success).toBe(false);
  });
});

describe('sha256Hex', () => {
  it('matches the known digest', async () => {
    expect(await sha256Hex('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });
});

describe('question set ids', () => {
  it('are 10 lowercase chars that form a valid set lesson id', async () => {
    const { generateSetId } = await import('./classroom');
    const { isSetLessonId, setLessonId, SET_ID_RE } = await import('../src/content/schema/teacherSet');
    for (let i = 0; i < 50; i++) {
      const id = generateSetId();
      expect(id).toMatch(SET_ID_RE);
      expect(isSetLessonId(setLessonId(id))).toBe(true);
    }
  });
});
