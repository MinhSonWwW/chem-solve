import { create } from 'zustand';
import { sound } from '@/lib/audio';
import { GAMIFICATION } from '@/config/gamification';
import { sessionReducer, createInitialSession } from '@/engine/session/sessionReducer';
import { checkAnswer } from '@/engine/checkers';
import type { SessionState, SessionAction } from '@/engine/session/types';
import type { Exercise } from '@/content/schema/exercise';
import type { Verdict } from '@/engine/checkers/types';
import {
  saveSession,
  clearSession,
  saveUserProgress,
  loadUserProgress,
  exportProgressJson,
  importProgressJson,
  type UserProgress,
  type CompletedNodeData,
} from '@/engine/progress';

interface SessionInfo {
  lessonId: string;
  nodeId: string;
}

interface UserState {
  // ── User-level stats (persisted) ──
  xp: number;
  gems: number;
  streak: number;
  hearts: number;
  soundEnabled: boolean;
  dailyGoal: number;
  achievements: Record<string, number>;
  completedNodes: Record<string, CompletedNodeData>;

  // ── Session state ──
  sessionState: SessionState | null;
  sessionInfo: SessionInfo | null;
  lastVerdict: Verdict | null;
  consecutiveCorrect: number;

  // ── Actions ──
  startSession: (
    lessonId: string,
    nodeId: string,
    exercises: Exercise[],
    initialHearts?: number,
    isPractice?: boolean
  ) => void;
  resumeSession: (lessonId: string, nodeId: string, state: SessionState) => void;
  dispatch: (action: SessionAction) => void;
  submitAnswer: () => void;
  addXp: (amount: number) => void;
  addGems: (amount: number) => void;
  buyHeartWithGems: () => boolean;
  buyFullHeartsWithGems: () => boolean;
  buyStreakFreeze: () => boolean;
  buyXpBoost: () => boolean;
  streakFreeze: number;
  xpBoostUntil: number;
  decrementHearts: () => void;
  addHearts: (amount?: number) => void;
  incrementStreak: () => void;
  toggleSound: () => void;
  setDailyGoal: (goal: number) => void;
  restoreProgress: () => Promise<void>;
  exportData: () => Promise<string>;
  importData: (jsonStr: string) => Promise<boolean>;
  completeTheoryNode: (lessonId: string, nodeId: string, earnedXp?: number) => Promise<void>;
  endSession: () => Promise<{
    totalXp: number;
    accuracy: number;
    perfectRun: boolean;
    earnedGems: number;
  } | null>;
}

export const useUserStore = create<UserState>((set, get) => ({
  xp: 0,
  gems: 0,
  streak: 0,
  hearts: GAMIFICATION.hearts.max,
  streakFreeze: 0,
  xpBoostUntil: 0,
  soundEnabled: true,
  dailyGoal: 20,
  achievements: {},
  completedNodes: {},

  sessionState: null,
  sessionInfo: null,
  lastVerdict: null,
  consecutiveCorrect: 0,

  startSession: (lessonId, nodeId, exercises, initialHearts, isPractice = false) => {
    const hearts = initialHearts ?? get().hearts;
    const session = createInitialSession(exercises, hearts, isPractice);
    set({
      sessionState: session,
      sessionInfo: { lessonId, nodeId },
      lastVerdict: null,
      consecutiveCorrect: 0,
    });
  },

  resumeSession: (lessonId, nodeId, state) => {
    set({
      sessionState: state,
      sessionInfo: { lessonId, nodeId },
      lastVerdict: null,
      consecutiveCorrect: 0,
    });
  },

  dispatch: (action) => {
    const { sessionState, sessionInfo } = get();
    if (!sessionState || !sessionInfo) return;

    const next = sessionReducer(sessionState, action);
    set({ sessionState: next });

    // Auto-persist on state change
    saveSession(sessionInfo.lessonId, sessionInfo.nodeId, next).catch(console.error);

    // Sync hearts to store-level state and persist
    if (next.hearts !== get().hearts) {
      set({ hearts: next.hearts });
      loadUserProgress().then((p) => {
        p.hearts = next.hearts;
        saveUserProgress(p).catch(console.error);
      });
    }
  },

  submitAnswer: () => {
    const { sessionState } = get();
    if (!sessionState) return;

    const currentQ = sessionState.questions[sessionState.currentIndex];
    if (!currentQ || currentQ.userInput == null) return;

    // Transition to CHECKING
    get().dispatch({ type: 'START_CHECK' });

    // Run checker
    const verdict = checkAnswer(
      currentQ.exercise.answer,
      currentQ.userInput,
      currentQ.exercise.commonMistakes ?? []
    );

    set({ lastVerdict: verdict });

    // Play sound & update combo
    if (verdict.status === 'correct') {
      sound.playCorrect();
      set((s) => ({ consecutiveCorrect: s.consecutiveCorrect + 1 }));
    } else if (verdict.status === 'incorrect') {
      sound.playWrong();
      set({ consecutiveCorrect: 0 });
    }

    // Evaluate result in session reducer
    get().dispatch({ type: 'EVALUATE_RESULT', payload: verdict });

    // Sync XP from session to user store
    const updatedSession = get().sessionState;
    if (updatedSession) {
      const updatedQ = updatedSession.questions[updatedSession.currentIndex];
      if (updatedQ?.status === 'correct' && updatedQ.earnedXp > 0) {
        // Apply combo bonus
        const combo = get().consecutiveCorrect;
        let bonus = 0;
        if (combo >= GAMIFICATION.combo.threshold5.count) {
          bonus = GAMIFICATION.combo.threshold5.bonus;
        } else if (combo >= GAMIFICATION.combo.threshold3.count) {
          bonus = GAMIFICATION.combo.threshold3.bonus;
        }
        const totalXpGain = updatedQ.earnedXp + bonus;
        set((s) => ({ xp: s.xp + totalXpGain }));

        // Check combo-master achievement
        if (combo >= 5) {
          set((s) => ({
            achievements: { ...s.achievements, 'combo-master': 5 },
          }));
        }
      }
    }
  },

  addXp: (amount) =>
    set((state) => {
      const next = state.xp + amount;
      loadUserProgress().then((p) => {
        p.xp = next;
        saveUserProgress(p).catch(console.error);
      });
      return { xp: next };
    }),

  addGems: (amount) =>
    set((state) => {
      const next = Math.max(0, state.gems + amount);
      loadUserProgress().then((p) => {
        p.gems = next;
        saveUserProgress(p).catch(console.error);
      });
      return { gems: next };
    }),

  buyHeartWithGems: () => {
    const { gems, hearts } = get();
    if (gems < GAMIFICATION.gems.costPerHeart || hearts >= GAMIFICATION.hearts.max) {
      return false;
    }
    const nextGems = gems - GAMIFICATION.gems.costPerHeart;
    const nextHearts = hearts + 1;
    set({ gems: nextGems, hearts: nextHearts });
    sound.playLevelUp();
    loadUserProgress().then((p) => {
      p.gems = nextGems;
      p.hearts = nextHearts;
      saveUserProgress(p).catch(console.error);
    });
    return true;
  },

  buyFullHeartsWithGems: () => {
    const { gems, hearts } = get();
    if (gems < GAMIFICATION.gems.costFullHearts || hearts >= GAMIFICATION.hearts.max) {
      return false;
    }
    const nextGems = gems - GAMIFICATION.gems.costFullHearts;
    const nextHearts = GAMIFICATION.hearts.max;
    set({ gems: nextGems, hearts: nextHearts });
    sound.playLevelUp();
    loadUserProgress().then((p) => {
      p.gems = nextGems;
      p.hearts = nextHearts;
      saveUserProgress(p).catch(console.error);
    });
    return true;
  },

  buyStreakFreeze: () => {
    const { gems, streakFreeze } = get();
    if (gems < GAMIFICATION.gems.costStreakFreeze || (streakFreeze ?? 0) >= 2) {
      return false;
    }
    const nextGems = gems - GAMIFICATION.gems.costStreakFreeze;
    const nextFreeze = (streakFreeze ?? 0) + 1;
    set({ gems: nextGems, streakFreeze: nextFreeze });
    sound.playLevelUp();
    loadUserProgress().then((p) => {
      p.gems = nextGems;
      p.streakFreeze = nextFreeze;
      saveUserProgress(p).catch(console.error);
    });
    return true;
  },

  buyXpBoost: () => {
    const { gems, xpBoostUntil } = get();
    if (gems < GAMIFICATION.gems.costXpBoost) {
      return false;
    }
    const nextGems = gems - GAMIFICATION.gems.costXpBoost;
    const baseTime = Math.max(Date.now(), xpBoostUntil ?? 0);
    const nextBoost = baseTime + 15 * 60 * 1000;
    set({ gems: nextGems, xpBoostUntil: nextBoost });
    sound.playLevelUp();
    loadUserProgress().then((p) => {
      p.gems = nextGems;
      p.xpBoostUntil = nextBoost;
      saveUserProgress(p).catch(console.error);
    });
    return true;
  },

  decrementHearts: () =>
    set((state) => {
      const next = Math.max(0, state.hearts - 1);
      loadUserProgress().then((p) => {
        p.hearts = next;
        saveUserProgress(p).catch(console.error);
      });
      return { hearts: next };
    }),
  addHearts: (amount = 1) =>
    set((state) => {
      const next = Math.min(GAMIFICATION.hearts.max, state.hearts + amount);
      loadUserProgress().then((p) => {
        p.hearts = next;
        saveUserProgress(p).catch(console.error);
      });
      return { hearts: next };
    }),
  incrementStreak: () => {
    const today = new Date().toISOString().slice(0, 10);
    loadUserProgress().then((progress) => {
      if (progress.streakDate === today) {
        // Already incremented for today
        return;
      }
      if (!progress.streakDate) {
        progress.streak = 1;
      } else {
        const lastTime = new Date(progress.streakDate).getTime();
        const todayTime = new Date(today).getTime();
        const diffDays = Math.round((todayTime - lastTime) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          progress.streak += 1;
        } else if (diffDays > 1) {
          progress.streak = 1;
        }
      }
      progress.streakDate = today;
      set({ streak: progress.streak });
      saveUserProgress(progress).catch(console.error);
    });
  },

  toggleSound: () =>
    set((state) => {
      const next = !state.soundEnabled;
      sound.setMuted(!next);
      return { soundEnabled: next };
    }),

  setDailyGoal: (dailyGoal) => {
    set({ dailyGoal });
    loadUserProgress().then((p) => {
      p.dailyGoal = dailyGoal;
      saveUserProgress(p).catch(console.error);
    });
  },

  restoreProgress: async () => {
    try {
      const progress: UserProgress = await loadUserProgress();
      set({
        xp: progress.xp,
        gems: progress.gems ?? 0,
        hearts: progress.hearts,
        streak: progress.streak,
        streakFreeze: progress.streakFreeze ?? 0,
        xpBoostUntil: progress.xpBoostUntil ?? 0,
        dailyGoal: progress.dailyGoal ?? 20,
        achievements: progress.achievements ?? {},
        completedNodes: progress.completedNodes ?? {},
      });
    } catch (err) {
      console.error('Failed to restore progress:', err);
    }
  },

  exportData: async () => {
    return exportProgressJson();
  },

  importData: async (jsonStr: string) => {
    const ok = await importProgressJson(jsonStr);
    if (ok) {
      await get().restoreProgress();
    }
    return ok;
  },

  completeTheoryNode: async (lessonId: string, nodeId: string, earnedXp = 10) => {
    const nodeKey = `${lessonId}:${nodeId}`;
    const earnedGems = 10;

    set((s) => ({
      xp: s.xp + earnedXp,
      gems: (s.gems || 0) + earnedGems,
      completedNodes: {
        ...s.completedNodes,
        [nodeKey]: {
          accuracy: 1,
          bestXp: earnedXp,
          completedAt: Date.now(),
        },
      },
    }));

    try {
      const progress = await loadUserProgress();
      progress.xp = get().xp;
      progress.gems = get().gems;
      progress.completedNodes[nodeKey] = {
        accuracy: 1,
        bestXp: earnedXp,
        completedAt: Date.now(),
      };
      await saveUserProgress(progress);
      get().incrementStreak();
    } catch (err) {
      console.error('Failed to save theory progress:', err);
    }
  },

  endSession: async () => {
    const { sessionState, sessionInfo } = get();
    if (!sessionState || !sessionInfo) return null;

    const totalQuestions = sessionState.questions.length;
    const correctCount = sessionState.questions.filter(
      (q) => q.status === 'correct'
    ).length;
    const accuracy = totalQuestions > 0 ? correctCount / totalQuestions : 0;
    const heartsLost = GAMIFICATION.hearts.max - sessionState.hearts;
    const perfectRun = heartsLost === 0;

    // Session completion bonus
    let sessionBonus = GAMIFICATION.session.completeBonus;
    if (perfectRun) {
      sessionBonus += GAMIFICATION.session.perfectBonus;
    }

    const totalXp = sessionState.totalXpEarned + sessionBonus;

    // Gem reward: 10 to 60 gems depending on accuracy
    const earnedGems = GAMIFICATION.gems.calcReward(accuracy);
    const nextGems = (get().gems || 0) + earnedGems;

    // Update user XP & Gems
    set((s) => ({ xp: s.xp + sessionBonus, gems: nextGems }));

    // Save user progress
    try {
      const progress = await loadUserProgress();
      progress.xp = get().xp;
      progress.gems = nextGems;

      // When finishing a full practice session, award +1 heart!
      if (sessionState.isPractice) {
        const nextHearts = Math.min(GAMIFICATION.hearts.max, get().hearts + 1);
        set({ hearts: nextHearts });
        progress.hearts = nextHearts;
      } else {
        progress.hearts = get().hearts;
        progress.heartsLastDecAt = heartsLost > 0 ? Date.now() : progress.heartsLastDecAt;
      }

      const nodeKey = `${sessionInfo.lessonId}:${sessionInfo.nodeId}`;
      const existing = progress.completedNodes[nodeKey];
      if (!existing || totalXp > existing.bestXp) {
        progress.completedNodes[nodeKey] = {
          accuracy,
          bestXp: totalXp,
          completedAt: Date.now(),
        };
      }

      // Streak: calculate consecutive days
      const today = new Date().toISOString().slice(0, 10);
      if (progress.streakDate !== today) {
        if (!progress.streakDate) {
          progress.streak = 1;
        } else {
          const lastTime = new Date(progress.streakDate).getTime();
          const todayTime = new Date(today).getTime();
          const diffDays = Math.round((todayTime - lastTime) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            progress.streak += 1;
          } else if (diffDays > 1) {
            progress.streak = 1;
          }
        }
        progress.streakDate = today;
        set({ streak: progress.streak });
      }

      // Achievement updates
      progress.achievements = progress.achievements ?? {};
      progress.achievements['first-lesson'] = 1;
      if (perfectRun) {
        progress.achievements['perfect-run'] = 1;
      }
      if (progress.streak >= 3) {
        progress.achievements['streak-3'] = Math.min(3, progress.streak);
      }
      if (sessionInfo.lessonId === 'g8-b03') {
        const curMol = progress.achievements['mol-warrior'] ?? 0;
        progress.achievements['mol-warrior'] = Math.min(10, curMol + 1);
      }

      set({
        completedNodes: progress.completedNodes,
        achievements: progress.achievements,
      });

      await saveUserProgress(progress);
      await clearSession(sessionInfo.lessonId, sessionInfo.nodeId);
    } catch (err) {
      console.error('Failed to save progress:', err);
    }

    // Clear session from store
    set({ sessionState: null, sessionInfo: null, lastVerdict: null });

    return { totalXp, accuracy, perfectRun, earnedGems };
  },
}));
