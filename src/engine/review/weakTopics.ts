import { getSkillById, Skill } from '@/content/skills';

export interface SkillAttemptRecord {
  skillId: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface WeakTopicReport {
  skill: Skill;
  totalAttempts: number;
  correctCount: number;
  accuracy: number; // 0.0 to 1.0
}

/**
 * Evaluates skill attempts and detects weak topics based on PLAN.md criteria:
 * - Skill has >= 5 recent attempts
 * - Accuracy rate < 70% (0.70)
 */
export function detectWeakTopics(
  attempts: SkillAttemptRecord[],
  minAttempts = 5,
  maxAccuracyThreshold = 0.7
): WeakTopicReport[] {
  // Group attempts by skillId
  const grouped: Record<string, { total: number; correct: number }> = {};

  for (const att of attempts) {
    if (!grouped[att.skillId]) {
      grouped[att.skillId] = { total: 0, correct: 0 };
    }
    grouped[att.skillId].total += 1;
    if (att.isCorrect) {
      grouped[att.skillId].correct += 1;
    }
  }

  const reports: WeakTopicReport[] = [];

  for (const [skillId, stats] of Object.entries(grouped)) {
    if (stats.total >= minAttempts) {
      const accuracy = stats.correct / stats.total;
      if (accuracy < maxAccuracyThreshold) {
        const skill = getSkillById(skillId) || {
          id: skillId,
          name: skillId,
          grade: 8,
          lessonId: 'g8-b03',
          category: 'ly-thuyet',
          description: '',
        };
        reports.push({
          skill,
          totalAttempts: stats.total,
          correctCount: stats.correct,
          accuracy: Math.round(accuracy * 100) / 100,
        });
      }
    }
  }

  // Sort by lowest accuracy first
  return reports.sort((a, b) => a.accuracy - b.accuracy);
}
