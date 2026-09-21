import { describe, it, expect } from 'vitest';
import { createInitialSession, sessionReducer } from './sessionReducer';
import type { Exercise } from '../../content/schema/exercise';

const SAMPLE_EXERCISES: Exercise[] = [
  {
    id: 'g8-b03-calc-001',
    lessonId: 'g8-b03',
    skillIds: ['gas-volume'],
    difficulty: 1,
    prompt: 'Tính thể tích khí...',
    knowledge: [],
    answer: { kind: 'number', value: 4.96, unit: 'L' },
    hints: [
      { level: 1, text: 'Gợi ý 1' },
      { level: 2, text: 'Gợi ý 2' }
    ],
    steps: [
      { kind: 'identify', title: 'Bước 1', body: 'Nhận dạng' },
      { kind: 'compute', title: 'Bước 2', body: 'Tính toán' },
      { kind: 'answer', title: 'Bước 3', body: 'Kết luận' }
    ],
    finalSolution: 'V = 4,96 L',
    commonMistakes: []
  },
  {
    id: 'g8-b03-calc-002',
    lessonId: 'g8-b03',
    skillIds: ['gas-volume'],
    difficulty: 1,
    prompt: 'Câu hỏi số 2...',
    knowledge: [],
    answer: { kind: 'formula', accepted: ['CO2'] },
    hints: [
      { level: 1, text: 'Gợi ý 1' },
      { level: 2, text: 'Gợi ý 2' }
    ],
    steps: [
      { kind: 'identify', title: 'Bước 1', body: 'Nhận dạng' },
      { kind: 'compute', title: 'Bước 2', body: 'Tính toán' },
      { kind: 'answer', title: 'Bước 3', body: 'Kết luận' }
    ],
    finalSolution: 'CO2',
    commonMistakes: []
  }
];

describe('engine/sessionReducer', () => {
  it('initializes session correctly with 5 hearts', () => {
    const session = createInitialSession(SAMPLE_EXERCISES);
    expect(session.questions).toHaveLength(2);
    expect(session.currentIndex).toBe(0);
    expect(session.hearts).toBe(5);
    expect(session.totalXpEarned).toBe(0);
    expect(session.isSessionComplete).toBe(false);
  });

  it('handles first-try correct answer (+10 XP)', () => {
    let state = createInitialSession(SAMPLE_EXERCISES);

    // 1. User types input
    state = sessionReducer(state, { type: 'SET_INPUT', payload: '4.96 L' });
    expect(state.questions[0].status).toBe('answering');

    // 2. Start checking
    state = sessionReducer(state, { type: 'START_CHECK' });
    expect(state.questions[0].status).toBe('checking');

    // 3. Evaluate correct
    state = sessionReducer(state, { type: 'EVALUATE_RESULT', payload: { status: 'correct' } });
    expect(state.questions[0].status).toBe('correct');
    expect(state.questions[0].earnedXp).toBe(10);
    expect(state.totalXpEarned).toBe(10);
    expect(state.hearts).toBe(5);
    expect(state.questions[0].isCompleted).toBe(true);

    // 4. Advance to next question
    state = sessionReducer(state, { type: 'NEXT_QUESTION' });
    expect(state.currentIndex).toBe(1);
    expect(state.isSessionComplete).toBe(false);
  });

  it('handles partial feedback without deducting hearts', () => {
    let state = createInitialSession(SAMPLE_EXERCISES);

    state = sessionReducer(state, { type: 'SET_INPUT', payload: '4.96' });
    state = sessionReducer(state, { type: 'START_CHECK' });
    state = sessionReducer(state, {
      type: 'EVALUATE_RESULT',
      payload: { status: 'partial', reason: 'missing-unit', message: 'Thiếu đơn vị' }
    });

    expect(state.questions[0].status).toBe('partial');
    expect(state.hearts).toBe(5); // Hearts preserved!
    expect(state.questions[0].attemptsCount).toBe(0); // Not counted as failed attempt!

    // Dismiss feedback to re-answer
    state = sessionReducer(state, { type: 'DISMISS_FEEDBACK' });
    expect(state.questions[0].status).toBe('answering');
  });

  it('deducts hearts on incorrect answer and marks revealed after 3 attempts', () => {
    let state = createInitialSession(SAMPLE_EXERCISES);

    // Attempt 1: Wrong
    state = sessionReducer(state, { type: 'SET_INPUT', payload: '1.0 L' });
    state = sessionReducer(state, { type: 'START_CHECK' });
    state = sessionReducer(state, {
      type: 'EVALUATE_RESULT',
      payload: { status: 'incorrect', reason: 'Sai kết quả' }
    });
    expect(state.hearts).toBe(4);
    expect(state.questions[0].attemptsCount).toBe(1);
    expect(state.questions[0].status).toBe('wrong');

    // Dismiss feedback & Attempt 2: Wrong
    state = sessionReducer(state, { type: 'DISMISS_FEEDBACK' });
    state = sessionReducer(state, { type: 'SET_INPUT', payload: '2.0 L' });
    state = sessionReducer(state, { type: 'START_CHECK' });
    state = sessionReducer(state, {
      type: 'EVALUATE_RESULT',
      payload: { status: 'incorrect', reason: 'Sai kết quả' }
    });
    expect(state.hearts).toBe(3);
    expect(state.questions[0].attemptsCount).toBe(2);

    // Dismiss feedback & Attempt 3: Wrong -> Revealed!
    state = sessionReducer(state, { type: 'DISMISS_FEEDBACK' });
    state = sessionReducer(state, { type: 'SET_INPUT', payload: '3.0 L' });
    state = sessionReducer(state, { type: 'START_CHECK' });
    state = sessionReducer(state, {
      type: 'EVALUATE_RESULT',
      payload: { status: 'incorrect', reason: 'Sai kết quả' }
    });
    expect(state.hearts).toBe(2);
    expect(state.questions[0].attemptsCount).toBe(3);
    expect(state.questions[0].status).toBe('revealed');
    expect(state.questions[0].isCompleted).toBe(true);
    expect(state.questions[0].earnedXp).toBe(0);
  });

  it('applies XP penalty when level 2 hint is used', () => {
    let state = createInitialSession(SAMPLE_EXERCISES);

    // Use level 2 hint
    state = sessionReducer(state, { type: 'USE_HINT', payload: { level: 2 } });
    expect(state.questions[0].hintsUsed).toBe(2);

    state = sessionReducer(state, { type: 'SET_INPUT', payload: '4.96 L' });
    state = sessionReducer(state, { type: 'START_CHECK' });
    state = sessionReducer(state, { type: 'EVALUATE_RESULT', payload: { status: 'correct' } });

    // 10 XP - 2 (hint penalty) = 8 XP
    expect(state.questions[0].earnedXp).toBe(8);
  });

  it('prevents invalid transitions such as double check or advancing incomplete questions', () => {
    let state = createInitialSession(SAMPLE_EXERCISES);

    // Cannot advance without completing
    const advanced = sessionReducer(state, { type: 'NEXT_QUESTION' });
    expect(advanced.currentIndex).toBe(0);

    // Cannot start check without input
    const checked = sessionReducer(state, { type: 'START_CHECK' });
    expect(checked.questions[0].status).toBe('unanswered');
  });

  it('completes session when all questions are answered', () => {
    let state = createInitialSession([SAMPLE_EXERCISES[0]]);

    state = sessionReducer(state, { type: 'SET_INPUT', payload: '4.96 L' });
    state = sessionReducer(state, { type: 'START_CHECK' });
    state = sessionReducer(state, { type: 'EVALUATE_RESULT', payload: { status: 'correct' } });
    state = sessionReducer(state, { type: 'NEXT_QUESTION' });

    expect(state.isSessionComplete).toBe(true);
  });

  it('increments comboStreak on consecutive correct answers and resets on wrong', () => {
    let state = createInitialSession(SAMPLE_EXERCISES);
    expect(state.comboStreak).toBe(0);

    // Q1 Correct -> combo 1
    state = sessionReducer(state, { type: 'SET_INPUT', payload: '4.96 L' });
    state = sessionReducer(state, { type: 'START_CHECK' });
    state = sessionReducer(state, { type: 'EVALUATE_RESULT', payload: { status: 'correct' } });
    expect(state.comboStreak).toBe(1);

    // Q2 Wrong -> combo resets to 0
    state = sessionReducer(state, { type: 'NEXT_QUESTION' });
    state = sessionReducer(state, { type: 'SET_INPUT', payload: 'wrong' });
    state = sessionReducer(state, { type: 'START_CHECK' });
    state = sessionReducer(state, { type: 'EVALUATE_RESULT', payload: { status: 'incorrect', reason: 'Sai kết quả' } });
    expect(state.comboStreak).toBe(0);
  });

  it('refills hearts when REFILL_HEARTS is dispatched', () => {
    let state = createInitialSession(SAMPLE_EXERCISES, 1);
    expect(state.hearts).toBe(1);

    state = sessionReducer(state, { type: 'REFILL_HEARTS' });
    expect(state.hearts).toBe(5);
  });

  it('queues revealed question to the end for review practice', () => {
    let state = createInitialSession([SAMPLE_EXERCISES[0]]);
    expect(state.questions).toHaveLength(1);

    state = sessionReducer(state, { type: 'REVEAL_SOLUTION' });
    expect(state.questions[0].status).toBe('revealed');
    expect(state.questions).toHaveLength(2);
    expect(state.questions[1].isReview).toBe(true);
    expect(state.questions[1].status).toBe('unanswered');
  });

  it('does not deduct hearts on wrong answer in practice mode', () => {
    let state = createInitialSession(SAMPLE_EXERCISES, 2, true);
    expect(state.hearts).toBe(2);
    expect(state.isPractice).toBe(true);

    state = sessionReducer(state, { type: 'SET_INPUT', payload: 'wrong' });
    state = sessionReducer(state, { type: 'START_CHECK' });
    state = sessionReducer(state, {
      type: 'EVALUATE_RESULT',
      payload: { status: 'incorrect', reason: 'Sai kết quả' },
    });

    // In practice mode, hearts must remain 2 (not deducted)
    expect(state.hearts).toBe(2);
  });

  it('recovers 1 heart up to 5 on correct answer in practice mode', () => {
    let state = createInitialSession(SAMPLE_EXERCISES, 1, true);
    expect(state.hearts).toBe(1);

    state = sessionReducer(state, { type: 'SET_INPUT', payload: '4.96 L' });
    state = sessionReducer(state, { type: 'START_CHECK' });
    state = sessionReducer(state, {
      type: 'EVALUATE_RESULT',
      payload: { status: 'correct' },
    });

    // In practice mode, correct answer recovers +1 heart
    expect(state.hearts).toBe(2);
  });
});

