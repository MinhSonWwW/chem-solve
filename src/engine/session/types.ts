import type { Exercise } from '../../content/schema/exercise';
import type { Verdict } from '../checkers/types';

export type QuestionStatus =
  | 'unanswered'
  | 'answering'
  | 'checking'
  | 'correct'
  | 'partial'
  | 'wrong'
  | 'revealed'
  | 'feedback';

export interface QuestionState {
  exercise: Exercise;
  status: QuestionStatus;
  userInput: unknown;
  attemptsCount: number; // 0, 1, 2, 3
  hintsUsed: number; // 0, 1, 2
  stepsRevealedCount: number;
  lastVerdict?: Verdict;
  earnedXp: number;
  isCompleted: boolean;
  isReview?: boolean;
}

export interface SessionState {
  questions: QuestionState[];
  currentIndex: number;
  hearts: number; // 0 to 5
  comboStreak: number; // consecutive correct answers
  totalXpEarned: number;
  isSessionComplete: boolean;
  isPractice?: boolean;
}

export type SessionAction =
  | { type: 'SET_INPUT'; payload: unknown }
  | { type: 'START_CHECK' }
  | { type: 'EVALUATE_RESULT'; payload: Verdict }
  | { type: 'USE_HINT'; payload: { level: 1 | 2 } }
  | { type: 'REVEAL_NEXT_STEP' }
  | { type: 'REVEAL_SOLUTION' }
  | { type: 'DISMISS_FEEDBACK' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'REFILL_HEARTS' };

