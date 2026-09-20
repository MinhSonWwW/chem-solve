import type { Option } from '../../content/schema/exercise';
import type { Checker, Verdict } from './types';

export interface McqSingleAnswerConfig {
  kind: 'mcq-single';
  options: Option[];
  correctId: string;
}

export interface McqMultiAnswerConfig {
  kind: 'mcq-multi';
  options: Option[];
  correctIds: string[];
}

export interface TrueFalseAnswerConfig {
  kind: 'true-false';
  statements: { id: string; text: string; correct: boolean }[];
}

export const mcqSingleChecker: Checker<McqSingleAnswerConfig, string> = {
  check(answer, input): Verdict {
    if (!input) {
      return { status: 'incorrect', reason: 'Bạn chưa chọn phương án nào.' };
    }
    if (input === answer.correctId) {
      return { status: 'correct' };
    }
    return { status: 'incorrect', reason: 'Phương án đã chọn chưa chính xác.' };
  }
};

export const mcqMultiChecker: Checker<McqMultiAnswerConfig, string[]> = {
  check(answer, input): Verdict {
    const selected = Array.isArray(input) ? input : [];
    if (selected.length === 0) {
      return { status: 'incorrect', reason: 'Bạn chưa chọn phương án nào.' };
    }

    const expectedSet = new Set(answer.correctIds);
    const selectedSet = new Set(selected);

    if (expectedSet.size === selectedSet.size && [...selectedSet].every((id) => expectedSet.has(id))) {
      return { status: 'correct' };
    }

    // Check if user selected only correct options but missed some
    const isSubset = [...selectedSet].every((id) => expectedSet.has(id));
    if (isSubset) {
      return {
        status: 'incorrect',
        reason: 'Bạn đã chọn đúng một số phương án nhưng vẫn còn thiếu.'
      };
    }

    return { status: 'incorrect', reason: 'Lựa chọn của bạn chưa chính xác.' };
  }
};

export const trueFalseChecker: Checker<TrueFalseAnswerConfig, Record<string, boolean>> = {
  check(answer, input): Verdict {
    if (!input || typeof input !== 'object') {
      return { status: 'incorrect', reason: 'Vui lòng đưa ra nhận định đúng/sai cho các mệnh đề.' };
    }

    const isAllCorrect = answer.statements.every((s) => input[s.id] === s.correct);
    if (isAllCorrect) {
      return { status: 'correct' };
    }

    return { status: 'incorrect', reason: 'Có mệnh đề bạn nhận định chưa chính xác.' };
  }
};
