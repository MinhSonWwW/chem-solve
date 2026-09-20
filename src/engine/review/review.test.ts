import { describe, it, expect } from 'vitest';
import {
  createLeitnerCard,
  updateLeitnerCard,
  getDueReviewCards,
  getLeitnerBoxStats,
  LEITNER_INTERVALS_MS,
  LeitnerCard,
} from './leitner';
import { detectWeakTopics, SkillAttemptRecord } from './weakTopics';
import { normalizeSearchTerm, searchChemicalData } from '@/features/search/searchEngine';

describe('Review & Personalization Engine (M7)', () => {
  describe('Leitner Spaced Repetition Logic', () => {
    it('creates a new card in Box 1 with 1-day interval', () => {
      const now = 1700000000000;
      const card = createLeitnerCard('g8-b03-mcq-001', 'g8-b03', now);

      expect(card.box).toBe(1);
      expect(card.lastReviewed).toBe(now);
      expect(card.nextReviewDate).toBe(now + LEITNER_INTERVALS_MS[1]);
      expect(card.consecutiveCorrect).toBe(0);
      expect(card.totalAttempts).toBe(1);
    });

    it('promotes card to higher boxes upon correct attempts, capped at Box 5', () => {
      const now = 1700000000000;
      let card = createLeitnerCard('g8-b03-mcq-001', 'g8-b03', now);

      // Box 1 -> Box 2
      card = updateLeitnerCard(card, true, now + 1000);
      expect(card.box).toBe(2);
      expect(card.consecutiveCorrect).toBe(1);

      // Box 2 -> Box 3
      card = updateLeitnerCard(card, true, now + 2000);
      expect(card.box).toBe(3);

      // Box 3 -> Box 4
      card = updateLeitnerCard(card, true, now + 3000);
      expect(card.box).toBe(4);

      // Box 4 -> Box 5
      card = updateLeitnerCard(card, true, now + 4000);
      expect(card.box).toBe(5);

      // Box 5 -> stays Box 5
      card = updateLeitnerCard(card, true, now + 5000);
      expect(card.box).toBe(5);
      expect(card.consecutiveCorrect).toBe(5);
    });

    it('demotes card back to Box 1 immediately upon failure', () => {
      const now = 1700000000000;
      let card: LeitnerCard = {
        exerciseId: 'g8-b03-mcq-001',
        lessonId: 'g8-b03',
        box: 4,
        lastReviewed: now,
        nextReviewDate: now + LEITNER_INTERVALS_MS[4],
        consecutiveCorrect: 3,
        totalAttempts: 4,
      };

      card = updateLeitnerCard(card, false, now + 5000);
      expect(card.box).toBe(1);
      expect(card.consecutiveCorrect).toBe(0);
      expect(card.nextReviewDate).toBe(now + 5000 + LEITNER_INTERVALS_MS[1]);
    });

    it('filters due review cards based on timestamp and limit', () => {
      const now = 1700000000000;
      const cards: LeitnerCard[] = [
        {
          exerciseId: 'due-1',
          lessonId: 'g8-b03',
          box: 1,
          lastReviewed: now - 100000,
          nextReviewDate: now - 50000, // Due
          consecutiveCorrect: 0,
          totalAttempts: 1,
        },
        {
          exerciseId: 'due-2',
          lessonId: 'g8-b03',
          box: 2,
          lastReviewed: now - 200000,
          nextReviewDate: now - 10000, // Due
          consecutiveCorrect: 1,
          totalAttempts: 2,
        },
        {
          exerciseId: 'future-3',
          lessonId: 'g8-b03',
          box: 3,
          lastReviewed: now,
          nextReviewDate: now + 500000, // Future, not due
          consecutiveCorrect: 2,
          totalAttempts: 3,
        },
      ];

      const due = getDueReviewCards(cards, now, 10);
      expect(due.length).toBe(2);
      expect(due[0].exerciseId).toBe('due-1');
      expect(due[1].exerciseId).toBe('due-2');
    });

    it('computes Leitner box distribution statistics', () => {
      const now = Date.now();
      const cards: LeitnerCard[] = [
        createLeitnerCard('e1', 'g8-b03', now),
        createLeitnerCard('e2', 'g8-b03', now),
        { ...createLeitnerCard('e3', 'g8-b03', now), box: 3 },
        { ...createLeitnerCard('e4', 'g8-b03', now), box: 5 },
      ];

      const stats = getLeitnerBoxStats(cards);
      expect(stats[1]).toBe(2);
      expect(stats[2]).toBe(0);
      expect(stats[3]).toBe(1);
      expect(stats[4]).toBe(0);
      expect(stats[5]).toBe(1);
    });
  });

  describe('Weak Topics Detection', () => {
    it('flags skills with >= 5 attempts and < 70% accuracy', () => {
      const attempts: SkillAttemptRecord[] = [
        // Skill A: 5 attempts, 2 correct = 40% (Weak)
        { skillId: 'balance-equation', isCorrect: false, timestamp: 1 },
        { skillId: 'balance-equation', isCorrect: false, timestamp: 2 },
        { skillId: 'balance-equation', isCorrect: true, timestamp: 3 },
        { skillId: 'balance-equation', isCorrect: false, timestamp: 4 },
        { skillId: 'balance-equation', isCorrect: true, timestamp: 5 },

        // Skill B: 5 attempts, 4 correct = 80% (Not weak)
        { skillId: 'mol-mass-calc', isCorrect: true, timestamp: 1 },
        { skillId: 'mol-mass-calc', isCorrect: true, timestamp: 2 },
        { skillId: 'mol-mass-calc', isCorrect: true, timestamp: 3 },
        { skillId: 'mol-mass-calc', isCorrect: true, timestamp: 4 },
        { skillId: 'mol-mass-calc', isCorrect: false, timestamp: 5 },

        // Skill C: 3 attempts (< 5) - Not enough data
        { skillId: 'gas-volume-calc', isCorrect: false, timestamp: 1 },
        { skillId: 'gas-volume-calc', isCorrect: false, timestamp: 2 },
        { skillId: 'gas-volume-calc', isCorrect: false, timestamp: 3 },
      ];

      const weak = detectWeakTopics(attempts, 5, 0.7);
      expect(weak.length).toBe(1);
      expect(weak[0].skill.id).toBe('balance-equation');
      expect(weak[0].accuracy).toBe(0.4);
    });
  });

  describe('Search Engine Normalization & Multi-Source Search', () => {
    it('normalizes Vietnamese diacritics and case accurately', () => {
      expect(normalizeSearchTerm('Axit Sunfuric')).toBe('axit sunfuric');
      expect(normalizeSearchTerm('Đồng(II) hiđroxit')).toBe('dong(ii) hidroxit');
      expect(normalizeSearchTerm('NaOH')).toBe('naoh');
    });

    it('searches substances, reactions and skills matching naoh query', () => {
      const results = searchChemicalData('naoh');
      expect(results.substances.some((s) => s.formula === 'NaOH')).toBe(true);
      expect(results.reactions.some((r) => r.equation.includes('NaOH'))).toBe(true);
    });

    it('searches lessons and skills matching mol query', () => {
      const results = searchChemicalData('mol');
      expect(results.skills.some((s) => s.name.toLowerCase().includes('mol'))).toBe(true);
      expect(results.lessons.some((l) => l.title.toLowerCase().includes('mol'))).toBe(true);
    });
  });
});
