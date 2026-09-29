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
  strictUnit?: boolean;
}

/**
 * Numeric Answer Checker:
 * - Accepts both comma and dot as decimal separators ("0,5" and "0.5")
 * - Handles optional units
 * - Checks against tolerance / decimals rounding
 * - Matches trapAnswers in commonMistakes for incorrect submissions
 */
export const numericChecker: Checker<NumberAnswerConfig, string | number> = {
  check(answer, rawInput, commonMistakes = []): Verdict {
    const inputStr = String(rawInput).trim();
    if (!inputStr) {
      return { status: 'incorrect', reason: 'Bạn chưa nhập câu trả lời.' };
    }

    // 1. Extract number and unit
    // Handles formats like "4,96", "4.96", "4,96 L", "4.96L", "4.96 mol", "105 phút", "20 N", "150 J"
    const match = inputStr.match(/^([+-]?\d+(?:[.,]\d+)?)\s*([\p{L}/%°^23\s]*)$/u);
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

    // 2. Tolerance & Decimals verification for the correct value
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

    // 3. If correct, verify unit
    if (isValueCorrect) {
      if (answer.unit) {
        if (!inputUnit) {
          // If strictUnit is required, warn about missing unit
          if (answer.strictUnit) {
            return {
              status: 'partial',
              reason: 'missing-unit',
              message: `Kết quả số đúng, nhưng bạn quên ghi đơn vị (${answer.unit}).`
            };
          }
          // Otherwise, unit is already displayed alongside the input field in the UI, so numeric-only is correct!
          return { status: 'correct' };
        } else if (inputUnit.toLowerCase() !== answer.unit.toLowerCase()) {
          return {
            status: 'incorrect',
            reason: `Sai đơn vị: bạn nhập "${inputUnit}", đơn vị yêu cầu là "${answer.unit}".`
          };
        }
      }
      return { status: 'correct' };
    }

    // 4. If value is not correct, check against common mistakes / trap answers for diagnostic feedback
    const normalizedInput = inputStr.replace(/\s+/g, '').toLowerCase();
    for (const mistake of commonMistakes) {
      if (mistake.trapAnswers) {
        for (const trap of mistake.trapAnswers) {
          const normTrap = trap.replace(/\s+/g, '').toLowerCase();
          // Exact string match (e.g. "4.48", "4,48")
          if (
            normalizedInput === normTrap ||
            normalizedInput.replace(',', '.') === normTrap.replace(',', '.')
          ) {
            return {
              status: 'incorrect',
              mistakeId: mistake.id,
              diagnosis: mistake.message,
              reason: mistake.message
            };
          }

          // Numeric trap match (e.g. user entered "4,48 L" and trap is "4.48" or "4,48")
          const trapMatch = trap.trim().match(/^([+-]?\d+(?:[.,]\d+)?)\s*([\p{L}/%°^23\s]*)$/u);
          if (trapMatch) {
            const trapNum = parseFloat(trapMatch[1].replace(',', '.'));
            const trapUnit = trapMatch[2]?.trim().toLowerCase();
            if (Math.abs(numValue - trapNum) < 1e-4) {
              if (!trapUnit || trapUnit === inputUnit.toLowerCase()) {
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
      }
    }

    return {
      status: 'incorrect',
      reason: `Kết quả tính toán chưa chính xác. Bạn đã nhập ${match[1]}.`
    };
  }
};
