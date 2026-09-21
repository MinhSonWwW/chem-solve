import type { Exercise } from '../../content/schema/exercise';
import type { SessionState, SessionAction, QuestionState } from './types';

export function createInitialSession(
  exercises: Exercise[],
  initialHearts: number = 5,
  isPractice: boolean = false
): SessionState {
  return {
    questions: exercises.map((ex) => ({
      exercise: ex,
      status: 'unanswered',
      userInput: null,
      attemptsCount: 0,
      hintsUsed: 0,
      stepsRevealedCount: 0,
      earnedXp: 0,
      isCompleted: false
    })),
    currentIndex: 0,
    hearts: initialHearts,
    comboStreak: 0,
    totalXpEarned: 0,
    isSessionComplete: exercises.length === 0,
    isPractice
  };
}

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  if (state.isSessionComplete) return state;

  const currentQ = state.questions[state.currentIndex];
  if (!currentQ) return state;

  switch (action.type) {
    case 'SET_INPUT': {
      // Guard: Cannot change input while checking or completed
      if (currentQ.status === 'checking' || currentQ.isCompleted) {
        return state;
      }

      const updatedQ: QuestionState = {
        ...currentQ,
        userInput: action.payload,
        status: 'answering'
      };

      const newQuestions = [...state.questions];
      newQuestions[state.currentIndex] = updatedQ;
      return { ...state, questions: newQuestions };
    }

    case 'START_CHECK': {
      // Guard: Cannot start check if already checking, no input, or completed
      if (
        currentQ.status === 'checking' ||
        currentQ.status === 'unanswered' ||
        currentQ.isCompleted ||
        currentQ.userInput === null ||
        currentQ.userInput === undefined
      ) {
        return state;
      }

      const updatedQ: QuestionState = {
        ...currentQ,
        status: 'checking'
      };

      const newQuestions = [...state.questions];
      newQuestions[state.currentIndex] = updatedQ;
      return { ...state, questions: newQuestions };
    }

    case 'EVALUATE_RESULT': {
      // Guard: Only evaluate if currently checking
      if (currentQ.status !== 'checking') {
        return state;
      }

      const verdict = action.payload;

      if (verdict.status === 'correct') {
        const attempt = currentQ.attemptsCount + 1; // 1, 2, or 3
        let xp = attempt === 1 ? 10 : attempt === 2 ? 6 : 3;

        // Support deduction: hints level 2 or steps revealed: -2 (min 3)
        if (currentQ.hintsUsed >= 2 || currentQ.stepsRevealedCount > 0) {
          xp = Math.max(3, xp - 2);
        }

        const updatedQ: QuestionState = {
          ...currentQ,
          status: 'correct',
          lastVerdict: verdict,
          earnedXp: xp,
          isCompleted: true,
          attemptsCount: attempt
        };

        const newQuestions = [...state.questions];
        newQuestions[state.currentIndex] = updatedQ;

        return {
          ...state,
          questions: newQuestions,
          hearts: state.isPractice ? Math.min(5, state.hearts + 1) : state.hearts,
          comboStreak: state.comboStreak + 1,
          totalXpEarned: state.totalXpEarned + xp
        };
      }

      if (verdict.status === 'partial') {
        // Partial does NOT deduct heart and does NOT count as a failed attempt
        const updatedQ: QuestionState = {
          ...currentQ,
          status: 'partial',
          lastVerdict: verdict
        };

        const newQuestions = [...state.questions];
        newQuestions[state.currentIndex] = updatedQ;
        return { ...state, questions: newQuestions };
      }

      // verdict.status === 'incorrect'
      const nextAttempt = currentQ.attemptsCount + 1;
      const newHearts = state.isPractice ? state.hearts : Math.max(0, state.hearts - 1);
      const isRevealed = nextAttempt >= 3;

      const updatedQ: QuestionState = {
        ...currentQ,
        status: isRevealed ? 'revealed' : 'wrong',
        lastVerdict: verdict,
        attemptsCount: nextAttempt,
        isCompleted: isRevealed,
        earnedXp: 0
      };

      const newQuestions = [...state.questions];
      newQuestions[state.currentIndex] = updatedQ;

      // Duolingo Review Queue: If failed 3 attempts, queue to end for later practice
      if (isRevealed && !currentQ.isReview) {
        newQuestions.push({
          exercise: currentQ.exercise,
          status: 'unanswered',
          userInput: null,
          attemptsCount: 0,
          hintsUsed: 0,
          stepsRevealedCount: 0,
          earnedXp: 0,
          isCompleted: false,
          isReview: true
        });
      }

      return {
        ...state,
        questions: newQuestions,
        hearts: newHearts,
        comboStreak: 0
      };
    }

    case 'USE_HINT': {
      if (currentQ.isCompleted) return state;
      const level = action.payload.level;
      const newHintsUsed = Math.max(currentQ.hintsUsed, level);

      const updatedQ: QuestionState = {
        ...currentQ,
        hintsUsed: newHintsUsed
      };

      const newQuestions = [...state.questions];
      newQuestions[state.currentIndex] = updatedQ;
      return { ...state, questions: newQuestions };
    }

    case 'REVEAL_NEXT_STEP': {
      if (currentQ.isCompleted) return state;
      const totalSteps = currentQ.exercise.steps.length;
      const nextStepCount = Math.min(totalSteps, currentQ.stepsRevealedCount + 1);

      const updatedQ: QuestionState = {
        ...currentQ,
        stepsRevealedCount: nextStepCount
      };

      const newQuestions = [...state.questions];
      newQuestions[state.currentIndex] = updatedQ;
      return { ...state, questions: newQuestions };
    }

    case 'REVEAL_SOLUTION': {
      if (currentQ.isCompleted) return state;

      const updatedQ: QuestionState = {
        ...currentQ,
        status: 'revealed',
        stepsRevealedCount: currentQ.exercise.steps.length,
        isCompleted: true,
        earnedXp: 0
      };

      const newQuestions = [...state.questions];
      newQuestions[state.currentIndex] = updatedQ;

      // Also queue to end if not already in review
      if (!currentQ.isReview) {
        newQuestions.push({
          exercise: currentQ.exercise,
          status: 'unanswered',
          userInput: null,
          attemptsCount: 0,
          hintsUsed: 0,
          stepsRevealedCount: 0,
          earnedXp: 0,
          isCompleted: false,
          isReview: true
        });
      }

      return {
        ...state,
        questions: newQuestions,
        comboStreak: 0
      };
    }

    case 'DISMISS_FEEDBACK': {
      // If partial or wrong (with attempts left), let user continue answering
      if (currentQ.status === 'partial' || currentQ.status === 'wrong') {
        const updatedQ: QuestionState = {
          ...currentQ,
          status: 'answering'
        };
        const newQuestions = [...state.questions];
        newQuestions[state.currentIndex] = updatedQ;
        return { ...state, questions: newQuestions };
      }
      return state;
    }

    case 'NEXT_QUESTION': {
      // Guard: Cannot proceed if current question is not completed
      if (!currentQ.isCompleted) {
        return state;
      }

      const nextIndex = state.currentIndex + 1;
      const isComplete = nextIndex >= state.questions.length;

      return {
        ...state,
        currentIndex: isComplete ? state.currentIndex : nextIndex,
        isSessionComplete: isComplete
      };
    }

    case 'REFILL_HEARTS': {
      return {
        ...state,
        hearts: 5
      };
    }

    default:
      return state;
  }
}
