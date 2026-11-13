import { parseEquation } from '../../chem/parseEquation';
import { checkBalance, areSimplestCoefficients, coefficientsGcd } from '../../chem/checkBalance';
import type { Checker, Verdict } from './types';

export interface EquationAnswerConfig {
  kind: 'equation';
  mode: 'fill-coefficients' | 'build';
  reactants: string[];
  products: string[];
  coefficients: number[];
  condition?: string;
}

export const equationChecker: Checker<EquationAnswerConfig, number[] | string> = {
  check(answer, input): Verdict {
    if (answer.mode === 'fill-coefficients') {
      const coefs = Array.isArray(input) ? input : [];
      if (coefs.length !== answer.coefficients.length) {
        return {
          status: 'incorrect',
          reason: `Vui lòng điền đủ ${answer.coefficients.length} hệ số.`
        };
      }

      // Check exact match first
      const isExact = coefs.every((c, i) => c === answer.coefficients[i]);
      if (isExact) {
        return { status: 'correct' };
      }

      // Check if user entered multiples of simplest ratio
      // Build test equation string with user coefficients
      const reactantStr = answer.reactants
        .map((r, i) => `${coefs[i] || 1}${r}`)
        .join(' + ');
      const offset = answer.reactants.length;
      const productStr = answer.products
        .map((p, i) => `${coefs[offset + i] || 1}${p}`)
        .join(' + ');

      const eqStr = `${reactantStr} -> ${productStr}`;
      const balance = checkBalance(eqStr);

      if (balance.isBalanced) {
        if (!balance.isSimplest || !areSimplestCoefficients(coefs)) {
          const factor = coefficientsGcd(coefs);
          const coefPreview = coefs.join(', ');
          return {
            status: 'partial',
            reason: 'not-simplest',
            message:
              factor > 1
                ? `Số nguyên tử hai vế đã bằng nhau, nhưng bộ hệ số (${coefPreview}) chưa tối giản — các hệ số đều chia hết cho ${factor}. Hãy chia tất cả cho ${factor} để được tỉ lệ tối giản nhất!`
                : 'Hệ số của bạn đã cân bằng đúng số nguyên tử, nhưng chưa ở tỉ lệ nguyên tối giản nhất.'
          };
        }
        return { status: 'correct' };
      }

      return {
        status: 'incorrect',
        reason: balance.feedbackMessage || 'Các hệ số chưa cân bằng đúng số nguyên tử ở hai vế.'
      };
    } else {
      // mode: 'build'
      const eqString = String(input || '').trim();
      if (!eqString) {
        return { status: 'incorrect', reason: 'Bạn chưa nhập phương trình hóa học.' };
      }

      try {
        const parsed = parseEquation(eqString);
        const balance = checkBalance(parsed);

        // Check if reactants and products match required formulas (ignoring order within same side)
        const expectedReactants = [...answer.reactants].sort();
        const actualReactants = parsed.reactants.map((r) => r.formula).sort();

        const expectedProducts = [...answer.products].sort();
        const actualProducts = parsed.products.map((p) => p.formula).sort();

        const reactantsMatch =
          expectedReactants.length === actualReactants.length &&
          expectedReactants.every((r, i) => r === actualReactants[i]);

        const productsMatch =
          expectedProducts.length === actualProducts.length &&
          expectedProducts.every((p, i) => p === actualProducts[i]);

        if (!reactantsMatch || !productsMatch) {
          return {
            status: 'incorrect',
            reason: 'Chất tham gia hoặc chất sản phẩm chưa đúng với đề bài.'
          };
        }

        if (!balance.isBalanced) {
          return {
            status: 'incorrect',
            reason: balance.feedbackMessage || 'Phương trình chưa cân bằng đúng nguyên tử.'
          };
        }

        if (!balance.isSimplest) {
          const parsedCoefs = [
            ...parsed.reactants.map((r) => r.coefficient),
            ...parsed.products.map((p) => p.coefficient)
          ];
          const factor = coefficientsGcd(parsedCoefs);
          return {
            status: 'partial',
            reason: 'not-simplest',
            message:
              factor > 1
                ? `Phương trình đã cân bằng đúng số nguyên tử, nhưng các hệ số đều chia hết cho ${factor}. Hãy rút gọn về tỉ lệ nguyên tối giản nhất!`
                : 'Phương trình đã cân bằng đúng, nhưng hệ số chưa ở tỉ lệ tối giản.'
          };
        }

        return { status: 'correct' };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return {
          status: 'incorrect',
          reason: `Phương trình không hợp lệ: ${msg}`
        };
      }
    }
  }
};
