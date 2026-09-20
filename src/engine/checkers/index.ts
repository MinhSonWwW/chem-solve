import type { Answer, CommonMistake } from '../../content/schema/exercise';
import type { Verdict } from './types';
import { numericChecker } from './numeric';
import { formulaChecker } from './formula';
import { textChecker } from './text';
import { equationChecker } from './equation';
import { mcqSingleChecker, mcqMultiChecker, trueFalseChecker } from './choice';
import { matchChecker, sortChecker, orderingChecker, formulaBuilderChecker } from './matchSort';

export * from './types';
export * from './numeric';
export * from './formula';
export * from './text';
export * from './equation';
export * from './choice';
export * from './matchSort';

/**
 * Universal dispatcher to check any Exercise answer against user input.
 */
export function checkAnswer(
  answer: Answer,
  input: unknown,
  commonMistakes: CommonMistake[] = []
): Verdict {
  switch (answer.kind) {
    case 'number':
      return numericChecker.check(answer, input as string | number, commonMistakes);
    case 'formula':
      return formulaChecker.check(answer, input as string, commonMistakes);
    case 'text':
      return textChecker.check(answer, input as string, commonMistakes);
    case 'equation':
      return equationChecker.check(answer, input as number[] | string, commonMistakes);
    case 'mcq-single':
      return mcqSingleChecker.check(answer, input as string, commonMistakes);
    case 'mcq-multi':
      return mcqMultiChecker.check(answer, input as string[], commonMistakes);
    case 'true-false':
      return trueFalseChecker.check(answer, input as Record<string, boolean>, commonMistakes);
    case 'match':
      return matchChecker.check(answer, input as Array<{ left: string; right: string }>, commonMistakes);
    case 'sort':
      return sortChecker.check(answer, input as Record<string, string>, commonMistakes);
    case 'ordering':
      return orderingChecker.check(answer, input as string[], commonMistakes);
    case 'formula-builder':
      return formulaBuilderChecker.check(answer, input as string, commonMistakes);
    default:
      return { status: 'incorrect', reason: 'Loại câu hỏi không được hỗ trợ.' };
  }
}
