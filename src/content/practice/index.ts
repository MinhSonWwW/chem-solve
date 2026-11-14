/**
 * Practice banks per lesson (practice/g6/<lessonId>.json …), loaded lazily and validated with Zod.
 * Lessons without a bank fall back to one unit per exercise node (the previous behaviour).
 */
import { PracticeBankSchema, practiceNodeId, type PracticeBank } from '@/content/schema/practice';
import { findLesson } from '@/content/curriculum';

const files = import.meta.glob<{ default: unknown }>('./g*/*.json');
const pathFor = (lessonId: string) => Object.keys(files).find((p) => p.endsWith(`/${lessonId}.json`));

export const hasPracticeBank = (lessonId: string) => !!pathFor(lessonId);

export async function loadPracticeBank(lessonId: string): Promise<PracticeBank | null> {
  const p = pathFor(lessonId);
  if (!p) return null;
  const mod = await files[p]();
  return PracticeBankSchema.parse(mod.default);
}

export interface PracticeEntry {
  /** Node id to open in /play/:lessonId/:nodeId?mode=practice */
  nodeId: string;
  title: string;
}

/** Practice units of a lesson for the Practice page. */
export async function getPracticeEntries(lessonId: string): Promise<PracticeEntry[]> {
  const bank = await loadPracticeBank(lessonId);
  if (bank) return bank.units.map((u) => ({ nodeId: practiceNodeId(u.id), title: u.title }));
  const lesson = findLesson(lessonId);
  return (lesson?.nodes ?? []).filter((n) => n.type === 'lesson').map((n) => ({ nodeId: n.id, title: n.title.replace(/^Luyện tập:\s*/, '') }));
}
