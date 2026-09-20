import type { Checker, Verdict } from './types';

export interface MatchAnswerConfig {
  kind: 'match';
  pairs: { left: string; right: string }[];
}

export interface SortAnswerConfig {
  kind: 'sort';
  buckets: { id: string; label: string }[];
  items: { id: string; label: string; bucketId: string }[];
}

export interface OrderingAnswerConfig {
  kind: 'ordering';
  correctOrder: string[];
}

export interface FormulaBuilderAnswerConfig {
  kind: 'formula-builder';
  tiles: string[];
  accepted: string[];
}

export const matchChecker: Checker<MatchAnswerConfig, Array<{ left: string; right: string }>> = {
  check(answer, input): Verdict {
    if (!Array.isArray(input) || input.length !== answer.pairs.length) {
      return { status: 'incorrect', reason: 'Vui lòng ghép đôi đầy đủ các mục.' };
    }

    const expectedMap = new Map<string, string>();
    for (const p of answer.pairs) {
      expectedMap.set(p.left, p.right);
    }

    const allCorrect = input.every((pair) => expectedMap.get(pair.left) === pair.right);
    if (allCorrect) {
      return { status: 'correct' };
    }

    return { status: 'incorrect', reason: 'Có cặp ghép chưa chính xác.' };
  }
};

export const sortChecker: Checker<SortAnswerConfig, Record<string, string>> = {
  check(answer, input): Verdict {
    if (!input || typeof input !== 'object') {
      return { status: 'incorrect', reason: 'Vui lòng phân loại đầy đủ các chất.' };
    }

    // input is mapping: { [itemId: string]: bucketId }
    const allCorrect = answer.items.every((item) => input[item.id] === item.bucketId);
    if (allCorrect) {
      return { status: 'correct' };
    }

    return { status: 'incorrect', reason: 'Có chất được xếp vào nhóm chưa đúng.' };
  }
};

export const orderingChecker: Checker<OrderingAnswerConfig, string[]> = {
  check(answer, input): Verdict {
    if (!Array.isArray(input) || input.length !== answer.correctOrder.length) {
      return { status: 'incorrect', reason: 'Vui lòng sắp xếp đầy đủ các bước.' };
    }

    const isCorrect = input.every((item, idx) => item === answer.correctOrder[idx]);
    if (isCorrect) {
      return { status: 'correct' };
    }

    return { status: 'incorrect', reason: 'Thứ tự sắp xếp chưa chính xác.' };
  }
};

export const formulaBuilderChecker: Checker<FormulaBuilderAnswerConfig, string> = {
  check(answer, input): Verdict {
    const formulaStr = String(input || '').trim().replace(/\s+/g, '');
    if (!formulaStr) {
      return { status: 'incorrect', reason: 'Vui lòng ghép các thẻ để tạo công thức.' };
    }

    if (answer.accepted.includes(formulaStr)) {
      return { status: 'correct' };
    }

    return { status: 'incorrect', reason: `Công thức "${formulaStr}" chưa chính xác.` };
  }
};
