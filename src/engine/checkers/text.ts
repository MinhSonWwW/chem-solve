import type { Checker, Verdict } from './types';

export interface TextAnswerConfig {
  kind: 'text';
  accepted: string[];
  lenientDiacritics?: boolean;
}

function removeVietnameseDiacritics(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export const textChecker: Checker<TextAnswerConfig, string> = {
  check(answer, rawInput): Verdict {
    const input = String(rawInput || '').trim();
    if (!input) {
      return { status: 'incorrect', reason: 'Bạn chưa nhập câu trả lời.' };
    }

    const normInput = input.toLowerCase().replace(/\s+/g, ' ');

    for (const accepted of answer.accepted) {
      const normAccepted = accepted.toLowerCase().replace(/\s+/g, ' ').trim();

      if (normInput === normAccepted) {
        return { status: 'correct' };
      }

      if (answer.lenientDiacritics) {
        if (
          removeVietnameseDiacritics(normInput) ===
          removeVietnameseDiacritics(normAccepted)
        ) {
          return { status: 'correct' };
        }
      }
    }

    return {
      status: 'incorrect',
      reason: `Câu trả lời "${input}" chưa chính xác.`
    };
  }
};
