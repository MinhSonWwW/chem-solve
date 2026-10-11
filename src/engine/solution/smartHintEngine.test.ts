import { describe, it, expect } from 'vitest';
import {
  generateSmartHint,
  analyzeNumericError,
  analyzeFormulaError,
  analyzeMcqError,
  getFallbackPedagogicalHint,
} from './smartHintEngine';
import type { Exercise } from '../../content/schema/exercise';

describe('Milestone M11: AI Smart Step Hint Engine', () => {
  // ── 1. Numeric Syntax & Calculation Diagnostic Tests ──
  describe('Numeric Calculation Diagnostics', () => {
    it('diagnoses stoichiometric coefficient error (ratio 2x)', () => {
      // Expected: 2.0 mol, student enters 4.0 mol
      const diagnosis = analyzeNumericError(2.0, '4.0', 'Tính số mol khí H2 sinh ra từ phản ứng: Zn + 2HCl -> ZnCl2 + H2');
      expect(diagnosis).not.toBeNull();
      expect(diagnosis?.category).toBe('coefficient_error');
      expect(diagnosis?.hint).toContain('lệch đúng 2 lần');
      expect(diagnosis?.guidingQuestion).toContain('tỉ lệ số mol');
    });

    it('diagnoses stoichiometric coefficient error (ratio 0.5x)', () => {
      // Expected: 4.0 mol, student enters 2.0 mol
      const diagnosis = analyzeNumericError(4.0, 2.0, 'Tính số mol HCl cần dùng');
      expect(diagnosis).not.toBeNull();
      expect(diagnosis?.category).toBe('coefficient_error');
    });

    it('diagnoses old standard conditions constant 22.4 L/mol instead of 24.79 L/mol', () => {
      // 1 mol gas at ĐKC: expected = 24.79 L, student calculated 22.4 L
      const diagnosis = analyzeNumericError(24.79, '22.4', 'Tính thể tích của 1 mol khí O2 ở điều kiện chuẩn');
      expect(diagnosis).not.toBeNull();
      expect(diagnosis?.category).toBe('formula_misuse');
      expect(diagnosis?.hint).toContain('22,4 L/mol của chương trình cũ');
      expect(diagnosis?.hint).toContain('24,79 lít');
    });

    it('diagnoses inverted division (reciprocal error)', () => {
      // Expected: 0.2 mol (m/M = 8/40 = 0.2), student computed M/m = 40/8 = 5
      const diagnosis = analyzeNumericError(0.2, 5.0, 'Tính số mol của 8 gam NaOH (M = 40 g/mol)');
      expect(diagnosis).not.toBeNull();
      expect(diagnosis?.category).toBe('reciprocal_error');
      expect(diagnosis?.hint).toContain('đảo ngược phép chia');
    });

    it('diagnoses volume unit conversion omission (mL to L, factor 1000)', () => {
      // Expected: 0.5 L, student entered 500 mL
      const diagnosis = analyzeNumericError(0.5, '500', 'Tính nồng độ mol của dung dịch khi hòa tan 1 mol chất tan vào 500 mL nước');
      expect(diagnosis).not.toBeNull();
      expect(diagnosis?.category).toBe('unit_conversion');
      expect(diagnosis?.hint).toContain('mL sang Lít');
    });

    it('diagnoses percentage conversion omission (factor 100)', () => {
      // Expected: 20%, student entered 0.2
      const diagnosis = analyzeNumericError(20, '0.2', 'Tính nồng độ phần trăm C% của dung dịch');
      expect(diagnosis).not.toBeNull();
      expect(diagnosis?.category).toBe('unit_conversion');
      expect(diagnosis?.hint).toContain('nhân thêm 100%');
    });

    it('diagnoses velocity unit conversion (km/h vs m/s, factor 3.6)', () => {
      // Expected: 20 m/s (72 km/h / 3.6 = 20), student entered 72
      const diagnosis = analyzeNumericError(20, '72', 'Một ô tô chuyển động với tốc độ 72 km/h. Động năng của ô tô là bao nhiêu?');
      expect(diagnosis).not.toBeNull();
      expect(diagnosis?.category).toBe('unit_conversion');
      expect(diagnosis?.hint).toContain('1 m/s = 3,6 km/h');
    });

    it('diagnoses time unit conversion (minutes to seconds, factor 60)', () => {
      // Expected: 600 s (10 minutes), student entered 10
      const diagnosis = analyzeNumericError(600, '10', 'Tính công thực hiện được trong thời gian 10 phút');
      expect(diagnosis).not.toBeNull();
      expect(diagnosis?.category).toBe('unit_conversion');
      expect(diagnosis?.hint).toContain('thời gian sang giây');
    });

    it('diagnoses kinetic energy squared velocity omission', () => {
      const diagnosis = analyzeNumericError(100, 20, 'Tính động năng W_đ của vật có khối lượng 2kg chuyển động với vận tốc 10 m/s');
      expect(diagnosis).not.toBeNull();
      expect(diagnosis?.category).toBe('squared_term');
      expect(diagnosis?.hint).toContain('bình phương');
    });

    it('diagnoses biology cell division multiplication vs power error', () => {
      // Expected: 32 cells (2^5), student entered 10 (2*5)
      const diagnosis = analyzeNumericError(32, 10, 'Một tế bào nguyên phân liên tiếp 5 lần. Tính số tế bào con tạo thành?');
      expect(diagnosis).not.toBeNull();
      expect(diagnosis?.category).toBe('cell_division');
      expect(diagnosis?.hint).toContain('2ⁿ tế bào con');
    });
  });

  // ── 2. Chemical Formula Diagnostics ──
  describe('Formula Syntax Diagnostics', () => {
    it('diagnoses lowercase capitalization mistakes (co instead of CO)', () => {
      const diagnosis = analyzeFormulaError('CO', 'co');
      expect(diagnosis).not.toBeNull();
      expect(diagnosis?.category).toBe('formula_syntax');
      expect(diagnosis?.hint).toContain('viết hoa chữ cái đầu');
    });

    it('diagnoses lowercase chlorine (cl2 instead of Cl2)', () => {
      const diagnosis = analyzeFormulaError('Cl2', 'cl2');
      expect(diagnosis).not.toBeNull();
      expect(diagnosis?.category).toBe('formula_syntax');
    });

    it('diagnoses valence subscript slip (AlO instead of Al2O3)', () => {
      const diagnosis = analyzeFormulaError('Al2O3', 'alo');
      expect(diagnosis).not.toBeNull();
      expect(diagnosis?.category).toBe('formula_misuse');
      expect(diagnosis?.hint).toContain('quy tắc hóa trị');
    });
  });

  // ── 3. MCQ & Concept Diagnostics ──
  describe('Multiple Choice Prompt Diagnostics', () => {
    it('detects negative question traps (KHÔNG ĐÚNG)', () => {
      const dummyEx = {
        id: 'g8-b08-mcq-01',
        lessonId: 'g8-b08',
        skillIds: ['concept'],
        difficulty: 1 as const,
        prompt: 'Phát biểu nào sau đây KHÔNG ĐÚNG về tính chất hóa học của acid?',
        answer: {
          kind: 'mcq-single' as const,
          correctId: 'opt-b',
          options: [
            { id: 'opt-a', label: 'Làm quỳ tím hóa đỏ' },
            { id: 'opt-b', label: 'Tác dụng với kim loại đứng sau H' },
            { id: 'opt-c', label: 'Tác dụng với base tạo muối và nước' },
          ],
        },
        hints: [
          { level: 1 as const, text: 'Acid tác dụng kim loại đứng trước Hydro.' },
          { level: 2 as const, text: 'Đọc kỹ câu hỏi phủ định.' },
        ],
        steps: [
          { kind: 'identify' as const, title: 'Bước 1', body: 'Xác định yêu cầu' },
          { kind: 'knowledge' as const, title: 'Bước 2', body: 'Tính chất acid' },
          { kind: 'answer' as const, title: 'Bước 3', body: 'Kết luận đáp án' },
        ],
        finalSolution: 'Đáp án B là phát biểu không đúng.',
        commonMistakes: [],
      } as unknown as Exercise;

      const diagnosis = analyzeMcqError(dummyEx, 'opt-a');
      expect(diagnosis).not.toBeNull();
      expect(diagnosis?.category).toBe('negative_question');
      expect(diagnosis?.title).toContain('phủ định');
    });
  });

  // ── 4. Full Smart Hint Engine Integration ──
  describe('generateSmartHint End-to-End Execution', () => {
    it('directly provides fallback pedagogical hint ladder', () => {
      const dummyEx = {
        id: 'g8-b03-calc-001',
        lessonId: 'g8-b03',
        skillIds: ['mol'],
        difficulty: 1 as const,
        prompt: 'Tính số mol',
        answer: { kind: 'number' as const, value: 0.5 },
        hints: [
          { level: 1 as const, text: 'Dùng công thức n = m / M' },
          { level: 2 as const, text: 'Thay số vào công thức' },
        ],
        steps: [
          { kind: 'identify' as const, title: 'Bước 1', body: 'Xác định công thức' },
          { kind: 'compute' as const, title: 'Bước 2', body: 'Tính toán' },
          { kind: 'answer' as const, title: 'Bước 3', body: 'Kết luận' },
        ],
        finalSolution: 'n = 0.5 mol',
        commonMistakes: [],
      } as unknown as Exercise;

      const fallback = getFallbackPedagogicalHint(dummyEx);
      expect(fallback.category).toBe('guided_step');
      expect(fallback.hint).toContain('Dùng công thức n = m / M');
    });

    it('prioritizes explicit diagnosis from commonMistakes when matched', () => {
      const dummyEx = {
        id: 'g8-b03-num-01',
        lessonId: 'g8-b03',
        skillIds: ['mol'],
        difficulty: 1 as const,
        prompt: 'Tính số mol của 16g khí O2',
        answer: { kind: 'number' as const, value: 0.5, unit: 'mol' },
        commonMistakes: [
          {
            id: 'm-atom-o',
            trapAnswers: ['1', '1.0'],
            message: 'Bạn đã dùng M(O) = 16 thay vì M(O2) = 32 g/mol của phân tử khí oxi.',
          },
        ],
        hints: [
          { level: 1 as const, text: 'M của O2 là 32 g/mol' },
          { level: 2 as const, text: 'n = 16 / 32' },
        ],
        steps: [
          { kind: 'identify' as const, title: 'Bước 1', body: 'Xác định M' },
          { kind: 'compute' as const, title: 'Bước 2', body: 'Tính toán' },
          { kind: 'answer' as const, title: 'Bước 3', body: 'Kết luận' },
        ],
        finalSolution: 'n = 0.5 mol',
      } as unknown as Exercise;

      const verdict = {
        status: 'incorrect' as const,
        reason: 'Sai số',
        mistakeId: 'm-atom-o',
        diagnosis: 'Bạn đã dùng M(O) = 16 thay vì M(O2) = 32 g/mol của phân tử khí oxi.',
      };

      const result = generateSmartHint(dummyEx, '1.0', verdict);
      expect(result.category).toBe('common_mistake');
      expect(result.hint).toContain('M(O) = 16 thay vì M(O2) = 32');
    });

    it('falls back to pedagogical scaffolding ladder when no specific pattern matches', () => {
      const dummyEx = {
        id: 'g8-b03-calc-002',
        lessonId: 'g8-b03',
        skillIds: ['mol'],
        difficulty: 2 as const,
        prompt: 'Tính thể tích chất khí',
        answer: { kind: 'number' as const, value: 12.395, unit: 'L' },
        hints: [
          { level: 1 as const, text: 'Áp dụng công thức V = 24,79 × n' },
          { level: 2 as const, text: 'Thay số n vào' },
        ],
        steps: [
          { kind: 'identify' as const, title: 'Bước 1', body: 'Xác định công thức' },
          { kind: 'compute' as const, title: 'Bước 2', body: 'Tính toán' },
          { kind: 'answer' as const, title: 'Bước 3', body: 'Kết luận' },
        ],
        finalSolution: 'V = 12.395 L',
        commonMistakes: [],
      } as unknown as Exercise;

      // Completely unrelated input that matches no ratio
      const result = generateSmartHint(dummyEx, '9999');
      expect(result.category).toBe('guided_step');
      expect(result.hint).toContain('V = 24,79 × n');
    });

    it('executes in sub-millisecond response time (< 5ms)', () => {
      const dummyEx = {
        id: 'g8-b03-calc-perf',
        lessonId: 'g8-b03',
        skillIds: ['mol'],
        difficulty: 1 as const,
        prompt: 'Tính số mol khí',
        answer: { kind: 'number' as const, value: 2.0 },
        hints: [
          { level: 1 as const, text: 'Gợi ý giải bài' },
          { level: 2 as const, text: 'Gợi ý cấp 2' },
        ],
        steps: [
          { kind: 'identify' as const, title: 'Bước 1', body: 'Xác định' },
          { kind: 'compute' as const, title: 'Bước 2', body: 'Tính' },
          { kind: 'answer' as const, title: 'Bước 3', body: 'Xong' },
        ],
        finalSolution: '2.0 mol',
        commonMistakes: [],
      } as unknown as Exercise;

      const start = performance.now();
      for (let i = 0; i < 50; i++) {
        generateSmartHint(dummyEx, '4.0');
      }
      const end = performance.now();
      const avgDuration = (end - start) / 50;
      expect(avgDuration).toBeLessThan(5); // Far below the 500ms requirement!
    });
  });
});
