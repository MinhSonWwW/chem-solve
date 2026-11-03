import { describe, it, expect, beforeEach } from 'vitest';
import { loadUserProgress, saveUserProgress, type UserProgress } from './progressRepo';
import { useUserStore } from '@/features/gamification/useUserStore';
import type { Exercise } from '@/content/schema/exercise';

describe('Progress Isolation & Practice Mode Integrity', () => {
  beforeEach(() => {
    useUserStore.setState({
      completedNodes: {},
      practiceCompletedLessons: {},
      hearts: 5,
      xp: 0,
      gems: 0,
      sessionState: null,
      sessionInfo: null,
    });
  });

  it('sanitizes spurious :practice keys from completedNodes and migrates to practiceCompletedLessons', async () => {
    const dirtyProgress: UserProgress = {
      xp: 100,
      gems: 50,
      hearts: 5,
      heartsLastDecAt: 0,
      streak: 1,
      streakDate: new Date().toISOString().slice(0, 10),
      dailyGoal: 20,
      achievements: {},
      completedNodes: {
        'phy-g9-b01:phy-g9-b01-theory': { accuracy: 1, bestXp: 10, completedAt: 123456 },
        'phy-g9-b02:practice:phy-g9-b02-n01': { accuracy: 0.9, bestXp: 40, completedAt: 123457 },
        'bio-g9-b01:practice:bio-g9-b01-n01': { accuracy: 1, bestXp: 50, completedAt: 123458 },
      },
      practiceCompletedLessons: {},
    };

    await saveUserProgress(dirtyProgress);
    const cleaned = await loadUserProgress();

    // Spurious :practice keys must be removed from completedNodes
    expect(cleaned.completedNodes['phy-g9-b02:practice:phy-g9-b02-n01']).toBeUndefined();
    expect(cleaned.completedNodes['bio-g9-b01:practice:bio-g9-b01-n01']).toBeUndefined();
    // Genuine learn node must be preserved
    expect(cleaned.completedNodes['phy-g9-b01:phy-g9-b01-theory']).toBeDefined();

    // Migrated properly to practiceCompletedLessons
    expect(cleaned.practiceCompletedLessons?.['phy-g9-b02']?.accuracy).toBe(0.9);
    expect(cleaned.practiceCompletedLessons?.['bio-g9-b01']?.accuracy).toBe(1);
  });

  it('endSession in practice mode does NOT contaminate completedNodes on Learn path', async () => {
    const store = useUserStore.getState();

    // Start practice session for phy-g9-b02
    store.startSession(
      'phy-g9-b02:practice',
      'phy-g9-b02-n01',
      [
        {
          id: 'phy-g9-b02-q01',
          lessonId: 'phy-g9-b02',
          prompt: 'Thực hành cơ năng',
          difficulty: 1,
          skillIds: ['energy'],
          answer: {
            kind: 'mcq-single',
            options: [
              { id: 'a', label: 'Đúng' },
              { id: 'b', label: 'Sai' },
            ],
            correctId: 'a',
          },
        } as unknown as Exercise,
      ],
      5,
      true // isPractice = true
    );

    // Answer correctly
    store.submitAnswer();
    // Simulate question marked correct
    const session = useUserStore.getState().sessionState!;
    session.questions[0].status = 'correct';
    session.totalXpEarned = 20;

    await useUserStore.getState().endSession();

    const stateAfter = useUserStore.getState();

    // Must NOT add to completedNodes (which belongs exclusively to Learn path)
    expect(stateAfter.completedNodes['phy-g9-b02:phy-g9-b02-n01']).toBeUndefined();
    expect(stateAfter.completedNodes['phy-g9-b02:practice:phy-g9-b02-n01']).toBeUndefined();

    // Must record in practiceCompletedLessons
    expect(stateAfter.practiceCompletedLessons['phy-g9-b02']).toBeDefined();
    expect(stateAfter.practiceCompletedLessons['phy-g9-b02'].accuracy).toBe(1);
  });

  it('endSession in learn mode records progress in completedNodes', async () => {
    const store = useUserStore.getState();

    // Start official learn session for phy-g9-b01
    store.startSession(
      'phy-g9-b01',
      'phy-g9-b01-n01',
      [
        {
          id: 'phy-g9-b01-q01',
          lessonId: 'phy-g9-b01',
          prompt: 'Động năng là gì?',
          difficulty: 1,
          skillIds: ['kinetic'],
          answer: {
            kind: 'mcq-single',
            options: [
              { id: 'a', label: 'Năng lượng do chuyển động' },
              { id: 'b', label: 'Năng lượng do đứng yên' },
            ],
            correctId: 'a',
          },
        } as unknown as Exercise,
      ],
      5,
      false // isPractice = false (Learn mode)
    );

    store.submitAnswer();
    const session = useUserStore.getState().sessionState!;
    session.questions[0].status = 'correct';
    session.totalXpEarned = 25;

    await useUserStore.getState().endSession();

    const stateAfter = useUserStore.getState();
    // In learn mode, node is recorded in completedNodes
    expect(stateAfter.completedNodes['phy-g9-b01:phy-g9-b01-n01']).toBeDefined();
    expect(stateAfter.completedNodes['phy-g9-b01:phy-g9-b01-n01'].accuracy).toBe(1);
  });
});
