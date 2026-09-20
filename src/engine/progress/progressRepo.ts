import { get, set, del } from 'idb-keyval';
import type { SessionState } from '../session/types';
import { GAMIFICATION } from '../../config/gamification';

// ── Saved session (resume mid-session) ──

export interface SavedSession {
  lessonId: string;
  nodeId: string;
  sessionState: SessionState;
  savedAt: number;
}

const SESSION_KEY_PREFIX = 'session:';

function sessionKey(lessonId: string, nodeId: string): string {
  return `${SESSION_KEY_PREFIX}${lessonId}:${nodeId}`;
}

export async function saveSession(
  lessonId: string,
  nodeId: string,
  state: SessionState
): Promise<void> {
  const data: SavedSession = {
    lessonId,
    nodeId,
    sessionState: state,
    savedAt: Date.now(),
  };
  await set(sessionKey(lessonId, nodeId), data);
}

export async function loadSession(
  lessonId: string,
  nodeId: string
): Promise<SavedSession | null> {
  const data = await get<SavedSession>(sessionKey(lessonId, nodeId));
  return data ?? null;
}

export async function clearSession(
  lessonId: string,
  nodeId: string
): Promise<void> {
  await del(sessionKey(lessonId, nodeId));
}

// ── User progress (persistent stats) ──

export interface CompletedNodeData {
  accuracy: number;
  bestXp: number;
  completedAt: number;
}

export interface UserProgress {
  xp: number;
  hearts: number;
  heartsLastDecAt: number; // timestamp of last heart decrement
  streak: number;
  streakDate: string; // YYYY-MM-DD of last streak bump
  dailyGoal: number; // 20, 40, 60 XP
  achievements: Record<string, number>; // achievementId -> progress
  completedNodes: Record<string, CompletedNodeData>;
}

const USER_PROGRESS_KEY = 'userProgress';

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  hearts: GAMIFICATION.hearts.max,
  heartsLastDecAt: 0,
  streak: 0,
  streakDate: '',
  dailyGoal: 20,
  achievements: {},
  completedNodes: {},
};

export async function loadUserProgress(): Promise<UserProgress> {
  const raw = await get<UserProgress>(USER_PROGRESS_KEY);
  if (!raw) return { ...DEFAULT_PROGRESS };

  // Ensure default values if old schema
  raw.dailyGoal = raw.dailyGoal ?? 20;
  raw.achievements = raw.achievements ?? {};
  raw.completedNodes = raw.completedNodes ?? {};

  // Heart recovery: auto-recover based on time elapsed since last decrement
  const now = Date.now();
  if (raw.hearts < GAMIFICATION.hearts.max && raw.heartsLastDecAt > 0) {
    const elapsedMs = now - raw.heartsLastDecAt;
    const recoveredHearts = Math.floor(
      elapsedMs / (GAMIFICATION.hearts.recoveryMinutes * 60 * 1000)
    );
    if (recoveredHearts > 0) {
      raw.hearts = Math.min(GAMIFICATION.hearts.max, raw.hearts + recoveredHearts);
      // If fully recovered, reset the timer
      if (raw.hearts >= GAMIFICATION.hearts.max) {
        raw.heartsLastDecAt = 0;
      } else {
        // Advance the timer by the recovered amount
        raw.heartsLastDecAt += recoveredHearts * GAMIFICATION.hearts.recoveryMinutes * 60 * 1000;
      }
      await set(USER_PROGRESS_KEY, raw);
    }
  }

  return raw;
}

export async function saveUserProgress(data: UserProgress): Promise<void> {
  await set(USER_PROGRESS_KEY, data);
}

/** Export all progress as JSON string */
export async function exportProgressJson(): Promise<string> {
  const data = await loadUserProgress();
  return JSON.stringify(data, null, 2);
}

/** Import progress from JSON string, validating basic structure */
export async function importProgressJson(jsonStr: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(jsonStr) as Partial<UserProgress>;
    if (typeof parsed.xp === 'number' && typeof parsed.hearts === 'number') {
      const merged: UserProgress = {
        ...DEFAULT_PROGRESS,
        ...parsed,
      };
      await saveUserProgress(merged);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/** Check if a lesson node is unlocked based on prior node completion */
export function isNodeUnlocked(
  _nodeKey: string,
  prevNodeKey: string | null,
  completedNodes: Record<string, CompletedNodeData>
): boolean {
  // First node is always unlocked
  if (!prevNodeKey) return true;
  const prev = completedNodes[prevNodeKey];
  if (!prev) return false;
  return prev.accuracy >= GAMIFICATION.unlock.minAccuracy;
}

