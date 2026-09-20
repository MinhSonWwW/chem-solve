import { parseFormula } from '../../chem/parseFormula';
import { normalizeChemicalText } from '../../chem/normalize';
import type { Checker, Verdict } from './types';

export interface FormulaAnswerConfig {
  kind: 'formula';
  accepted: string[];
}

export const formulaChecker: Checker<FormulaAnswerConfig, string> = {
  check(answer, rawInput): Verdict {
    const input = normalizeChemicalText(rawInput.trim());
    if (!input) {
      return { status: 'incorrect', reason: 'Bạn chưa nhập công thức hóa học.' };
    }

    // 1. Check exact match in accepted list
    if (answer.accepted.includes(input)) {
      return { status: 'correct' };
    }

    // 2. Check lowercase mistake (e.g. user typed "h2so4" or "cacl2")
    const isAllLowerSymbols = /[a-z]/.test(input) && !/[A-Z]/.test(input);
    if (isAllLowerSymbols) {
      for (const accepted of answer.accepted) {
        if (input.toLowerCase() === accepted.toLowerCase()) {
          return {
            status: 'partial',
            reason: 'wrong-case',
            message: 'Kí hiệu hóa học của nguyên tố luôn phải viết hoa chữ cái đầu (ví dụ H2SO4, CaCl2).'
          };
        }
      }
    }

    // 3. Structural comparison using parseFormula
    try {
      const inputParsed = parseFormula(input);

      for (const accepted of answer.accepted) {
        const acceptedParsed = parseFormula(accepted);

        const inputElements = Object.keys(inputParsed.elements);
        const acceptedElements = Object.keys(acceptedParsed.elements);

        if (inputElements.length === acceptedElements.length) {
          const allMatch = inputElements.every(
            (el) => inputParsed.elements[el] === acceptedParsed.elements[el]
          );

          if (allMatch && inputParsed.charge === acceptedParsed.charge) {
            // Elements and counts match, but the string wasn't accepted
            // e.g. "OH2" instead of "H2O", or "ClNa" instead of "NaCl"
            return {
              status: 'partial',
              reason: 'noncanonical-formula',
              message: `Đúng thành phần nguyên tố, nhưng thứ tự viết chưa đúng quy ước hóa học. Đáp án chuẩn là ${accepted}.`
            };
          }
        }
      }
    } catch {
      return {
        status: 'incorrect',
        reason: `Công thức không hợp lệ: "${input}".`
      };
    }

    return {
      status: 'incorrect',
      reason: `Công thức "${input}" chưa chính xác.`
    };
  }
};
