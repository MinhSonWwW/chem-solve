import { get, set, del } from 'idb-keyval';
import type { SessionState } from '../session/types';
import { GAMIFICATION } from '../../config/gamification';
import { setCookie, getCookie } from '@/lib/cookies';

// Resilient fallback store for environments without IndexedDB (e.g. Vitest, private mode)
const memStore = new Map<string, unknown>();

async function storageGet<T>(key: string): Promise<T | undefined> {
  if (typeof indexedDB === 'undefined') {
    return memStore.get(key) as T | undefined;
  }
  try {
    return await get<T>(key);
  } catch {
    return memStore.get(key) as T | undefined;
  }
}

async function storageSet<T>(key: string, value: T): Promise<void> {
  memStore.set(key, value);
  if (typeof indexedDB !== 'undefined') {
    try {
      await set(key, value);
    } catch {
      // safely fallback to memory
    }
  }
}

async function storageDel(key: string): Promise<void> {
  memStore.delete(key);
  if (typeof indexedDB !== 'undefined') {
    try {
      await del(key);
    } catch {
      // safely fallback to memory
    }
  }
}

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
  await storageSet(sessionKey(lessonId, nodeId), data);
}

export async function loadSession(
  lessonId: string,
  nodeId: string
): Promise<SavedSession | null> {
  const data = await storageGet<SavedSession>(sessionKey(lessonId, nodeId));
  return data ?? null;
}

export async function clearSession(
  lessonId: string,
  nodeId: string
): Promise<void> {
  await storageDel(sessionKey(lessonId, nodeId));
}

// ── User progress (persistent stats) ──

export interface CompletedNodeData {
  accuracy: number;
  bestXp: number;
  completedAt: number;
}

export interface UserProgress {
  xp: number;
  gems: number;
  hearts: number;
  heartsLastDecAt: number; // timestamp of last heart decrement
  lastHeartResetDate?: string; // YYYY-MM-DD for daily full heart refill
  streak: number;
  streakDate: string; // YYYY-MM-DD of last streak bump
  streakFreeze?: number; // khiên bảo vệ chuỗi streak (max 2)
  xpBoostUntil?: number; // timestamp hết hạn 2x XP boost
  dailyGoal: number; // 20, 40, 60 XP
  achievements: Record<string, number>; // achievementId -> progress
  completedNodes: Record<string, CompletedNodeData>;
  practiceCompletedLessons?: Record<string, { accuracy: number; completedAt: number }>;
}

const USER_PROGRESS_KEY = 'userProgress';
const LOCALSTORAGE_BACKUP_KEY = 'chem_progress_backup';
const COOKIE_SUMMARY_KEY = 'chem_progress_summary';

// Helper to get active user ID across LocalStorage and Cookies
function getActiveUserId(): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('chem_auth_user');
      if (raw) {
        const u = JSON.parse(raw);
        if (u && typeof u.uid === 'string') return u.uid;
      }
    }
  } catch { /* ignore */ }
  try {
    const cookieRaw = getCookie('chem_auth_user');
    if (cookieRaw) {
      const u = JSON.parse(cookieRaw);
      if (u && typeof u.uid === 'string') return u.uid;
    }
  } catch { /* ignore */ }
  return null;
}

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  gems: 0,
  hearts: 99,
  heartsLastDecAt: 0,
  lastHeartResetDate: new Date().toISOString().slice(0, 10),
  streak: 0,
  streakDate: '',
  streakFreeze: 0,
  xpBoostUntil: 0,
  dailyGoal: 20,
  achievements: {},
  completedNodes: {},
  practiceCompletedLessons: {},
};

export async function loadUserProgress(): Promise<UserProgress> {
  const candidates: UserProgress[] = [];

  // 1. Layer 1: IndexedDB
  const idbData = await storageGet<UserProgress>(USER_PROGRESS_KEY);
  if (idbData && typeof idbData === 'object' && typeof idbData.xp === 'number') {
    candidates.push(idbData);
  }

  // 2. Layer 2: LocalStorage Backup (General + User-specific)
  try {
    if (typeof localStorage !== 'undefined') {
      const lsRaw = localStorage.getItem(LOCALSTORAGE_BACKUP_KEY);
      if (lsRaw) {
        const parsed = JSON.parse(lsRaw) as UserProgress;
        if (parsed && typeof parsed.xp === 'number') {
          candidates.push(parsed);
        }
      }

      const uid = getActiveUserId();
      if (uid) {
        const userLsRaw = localStorage.getItem(`chem_progress_${uid}`);
        if (userLsRaw) {
          const parsed = JSON.parse(userLsRaw) as UserProgress;
          if (parsed && typeof parsed.xp === 'number') {
            candidates.push(parsed);
          }
        }
      }
    }
  } catch { /* ignore */ }

  // 3. Layer 3: Cookies Summary Fallback
  if (candidates.length === 0) {
    try {
      const cookieRaw = getCookie(COOKIE_SUMMARY_KEY);
      if (cookieRaw) {
        const summary = JSON.parse(cookieRaw);
        if (summary && typeof summary.xp === 'number') {
          const restoredCompleted: Record<string, CompletedNodeData> = {};
          if (Array.isArray(summary.keys)) {
            for (const k of summary.keys) {
              restoredCompleted[k] = {
                accuracy: 1,
                bestXp: 20,
                completedAt: summary.time || Date.now(),
              };
            }
          }
          candidates.push({
            ...DEFAULT_PROGRESS,
            xp: summary.xp || 0,
            gems: summary.gems || 0,
            streak: summary.streak || 0,
            streakDate: summary.streakDate || '',
            completedNodes: restoredCompleted,
          });
        }
      }
    } catch { /* ignore */ }
  }

  // 4. Merge candidates into the most advanced progress state
  let raw: UserProgress;
  if (candidates.length === 0) {
    raw = { ...DEFAULT_PROGRESS };
  } else {
    raw = { ...DEFAULT_PROGRESS };
    for (const c of candidates) {
      raw.xp = Math.max(raw.xp, c.xp ?? 0);
      raw.gems = Math.max(raw.gems, c.gems ?? 0);
      raw.streak = Math.max(raw.streak, c.streak ?? 0);
      if (c.streakDate && (!raw.streakDate || c.streakDate > raw.streakDate)) {
        raw.streakDate = c.streakDate;
      }
      raw.streakFreeze = Math.max(raw.streakFreeze ?? 0, c.streakFreeze ?? 0);
      raw.dailyGoal = c.dailyGoal ?? raw.dailyGoal ?? 20;

      if (c.achievements) {
        raw.achievements = { ...raw.achievements, ...c.achievements };
      }
      if (c.completedNodes) {
        raw.completedNodes = { ...raw.completedNodes, ...c.completedNodes };
      }
      if (c.practiceCompletedLessons) {
        raw.practiceCompletedLessons = {
          ...raw.practiceCompletedLessons,
          ...c.practiceCompletedLessons,
        };
      }
    }
  }

  // Ensure default values if old schema
  raw.gems = raw.gems ?? 0;
  raw.streakFreeze = raw.streakFreeze ?? 0;
  raw.xpBoostUntil = raw.xpBoostUntil ?? 0;
  raw.dailyGoal = raw.dailyGoal ?? 20;
  raw.achievements = raw.achievements ?? {};
  raw.completedNodes = raw.completedNodes ?? {};
  raw.practiceCompletedLessons = raw.practiceCompletedLessons ?? {};

  // Sanitize and isolate any practice keys accidentally stored in completedNodes
  for (const key of Object.keys(raw.completedNodes)) {
    if (key.includes(':practice')) {
      const lessonId = key.split(':')[0];
      if (lessonId) {
        raw.practiceCompletedLessons[lessonId] = {
          accuracy: raw.completedNodes[key].accuracy,
          completedAt: raw.completedNodes[key].completedAt,
        };
      }
      delete raw.completedNodes[key];
    }
  }

  raw.hearts = 99; // Testing mode: unlimited hearts

  // Daily Full Heart Refill: automatically recovers full 5 hearts upon new calendar day
  const today = new Date().toISOString().slice(0, 10);
  if (raw.lastHeartResetDate !== today) {
    raw.hearts = GAMIFICATION.hearts.max;
    raw.heartsLastDecAt = 0;
    raw.lastHeartResetDate = today;
    await storageSet(USER_PROGRESS_KEY, raw);
  }

  // Streak validation on new calendar day:
  if (raw.streakDate && raw.streakDate !== today) {
    const lastTime = new Date(raw.streakDate).getTime();
    const todayTime = new Date(today).getTime();
    const diffDays = Math.round((todayTime - lastTime) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) {
      if (raw.streakFreeze && raw.streakFreeze > 0) {
        // Streak freeze shields the user
        raw.streakFreeze -= 1;
        // Move streakDate to yesterday to keep the streak valid for today
        const yesterday = new Date(todayTime - 86400000).toISOString().slice(0, 10);
        raw.streakDate = yesterday;
      } else {
        raw.streak = 0;
      }
      await storageSet(USER_PROGRESS_KEY, raw);
    }
  }

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
      await storageSet(USER_PROGRESS_KEY, raw);
    }
  }

  return raw;
}

export async function saveUserProgress(data: UserProgress): Promise<void> {
  // 1. Layer 1: IndexedDB
  await storageSet(USER_PROGRESS_KEY, data);

  // 2. Layer 2: LocalStorage Backup (General + User-specific)
  try {
    if (typeof localStorage !== 'undefined') {
      const serialized = JSON.stringify(data);
      localStorage.setItem(LOCALSTORAGE_BACKUP_KEY, serialized);

      const uid = getActiveUserId();
      if (uid) {
        localStorage.setItem(`chem_progress_${uid}`, serialized);
        await storageSet(`chem_progress_${uid}`, data);
      }
    }
  } catch {
    // LocalStorage quota or blocked
  }

  // 3. Layer 3: Cookies Summary (Preserved across PWA updates & hard reloads)
  try {
    const completedKeys = Object.keys(data.completedNodes || {});
    const summary = {
      xp: data.xp,
      gems: data.gems,
      streak: data.streak,
      streakDate: data.streakDate,
      count: completedKeys.length,
      keys: completedKeys.slice(0, 100),
      time: Date.now(),
    };
    setCookie(COOKIE_SUMMARY_KEY, JSON.stringify(summary), 365);
  } catch {
    // Cookie blocked
  }
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

