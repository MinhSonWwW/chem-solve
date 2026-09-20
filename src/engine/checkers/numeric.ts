import type { Checker, Verdict } from './types';

export interface NumberAnswerConfig {
  kind: 'number';
  value: number;
  unit?: string;
  decimals?: number;
  tolerance?: {
    abs?: number;
    rel?: number;
  };
}

/**
 * Numeric Answer Checker:
 * - Accepts both comma and dot as decimal separators ("0,5" and "0.5")
 * - Handles optional units
 * - Checks against tolerance / decimals rounding
 * - Matches trapAnswers in commonMistakes
 */
export const numericChecker: Checker<NumberAnswerConfig, string | number> = {
  check(answer, rawInput, commonMistakes = []): Verdict {
    const inputStr = String(rawInput).trim();
    if (!inputStr) {
      return { status: 'incorrect', reason: 'Bạn chưa nhập câu trả lời.' };
    }

    // 1. Check trap answers first
    const normalizedInput = inputStr.replace(/\s+/g, '');
    for (const mistake of commonMistakes) {
      if (mistake.trapAnswers) {
        for (const trap of mistake.trapAnswers) {
          const normTrap = trap.replace(/\s+/g, '');
          if (
            normalizedInput === normTrap ||
            normalizedInput.startsWith(normTrap) ||
            normalizedInput.replace(',', '.') === normTrap.replace(',', '.')
          ) {
            return {
              status: 'incorrect',
              mistakeId: mistake.id,
              diagnosis: mistake.message,
              reason: mistake.message
            };
          }
        }
      }
    }

    // 2. Extract number and unit
    // Handles formats like "4,96", "4.96", "4,96 L", "4.96L", "4.96 mol"
    const match = inputStr.match(/^([+-]?\d+(?:[.,]\d+)?)\s*([a-zA-Z/%°]*)?$/);
    if (!match) {
      return {
        status: 'incorrect',
        reason: `Không nhận diện được số hợp lệ: "${inputStr}". Vui lòng nhập số như 4,96 hoặc 4.96.`
      };
    }

    const numValue = parseFloat(match[1].replace(',', '.'));
    const inputUnit = match[2]?.trim();

    if (isNaN(numValue)) {
      return { status: 'incorrect', reason: 'Giá trị nhập không phải là số hợp lệ.' };
    }

    // 3. Tolerance & Decimals verification
    let isValueCorrect = false;

    if (answer.tolerance) {
      const absTol = answer.tolerance.abs ?? 0;
      const relTol = answer.tolerance.rel ?? 0;
      const allowedDelta = Math.max(absTol, Math.abs(answer.value * relTol));
      isValueCorrect = Math.abs(numValue - answer.value) <= allowedDelta;
    } else if (answer.decimals !== undefined) {
      // Default: tolerance is ±0.5 * 10^(-decimals)
      const allowedDelta = 0.51 * Math.pow(10, -answer.decimals);
      isValueCorrect = Math.abs(numValue - answer.value) <= allowedDelta;
    } else {
      // Exact or standard floating point tolerance
      isValueCorrect = Math.abs(numValue - answer.value) <= 1e-4;
    }

    if (!isValueCorrect) {
      return {
        status: 'incorrect',
        reason: `Kết quả tính toán chưa chính xác. Bạn đã nhập ${match[1]}.`
      };
    }

    // 4. Unit verification (if expected)
    if (answer.unit) {
      if (!inputUnit) {
        // Missing unit -> partial (warning, does not deduct heart)
        return {
          status: 'partial',
          reason: 'missing-unit',
          message: `Kết quả số đúng, nhưng bạn quên ghi đơn vị (${answer.unit}).`
        };
      } else if (inputUnit.toLowerCase() !== answer.unit.toLowerCase()) {
        return {
          status: 'incorrect',
          reason: `Sai đơn vị: bạn nhập "${inputUnit}", đơn vị yêu cầu là "${answer.unit}".`
        };
      }
    }

    return { status: 'correct' };
  }
};
