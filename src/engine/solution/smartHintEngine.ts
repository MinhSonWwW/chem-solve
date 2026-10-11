import type { Exercise } from '../../content/schema/exercise';
import type { Verdict } from '../checkers/types';

export type SmartHintCategory =
  | 'coefficient_error' // Quên nhân/chia hệ số phương trình (2x, 0.5x, 3x)
  | 'formula_misuse' // Nhầm công thức hoặc hằng số (22.4 vs 24.79, m = n/M)
  | 'unit_conversion' // Quên đổi đơn vị (mL -> L, g -> kg, km/h -> m/s, phút -> s)
  | 'reciprocal_error' // Đảo ngược phép chia (lấy mẫu chia tử)
  | 'squared_term' // Quên bình phương (v^2, r^2)
  | 'cell_division' // Nhầm lũy thừa phân bào (2*n thay vì 2^n)
  | 'dna_pairing' // Nhầm nguyên tắc bổ sung A-T, G-C hoặc liên kết hydrogen
  | 'formula_syntax' // Viết hoa/thường ký hiệu hóa học (co -> CO, cl -> Cl)
  | 'negative_question' // Bẫy câu hỏi phủ định (KHÔNG ĐÚNG, NGOẠI TRỪ)
  | 'common_mistake' // Khớp bẫy định sẵn trong commonMistakes
  | 'guided_step'; // Gợi ý bước giải định hướng sư phạm

export interface SmartHintDiagnosis {
  category: SmartHintCategory;
  title: string;
  hint: string;
  guidingQuestion: string;
}

/**
 * Parses numeric input string cleanly, supporting both comma and dot separators.
 */
function parseNumericInput(raw: unknown): number | null {
  if (typeof raw === 'number' && !isNaN(raw)) return raw;
  if (typeof raw !== 'string') return null;
  const match = raw.trim().match(/^([+-]?\d+(?:[.,]\d+)?)/);
  if (!match) return null;
  const val = parseFloat(match[1].replace(',', '.'));
  return isNaN(val) ? null : val;
}

/**
 * Checks if two numbers are approximately equal within a percentage tolerance.
 */
function isCloseRatio(actualRatio: number, targetRatio: number, tolerance = 0.06): boolean {
  return Math.abs(actualRatio - targetRatio) <= tolerance;
}

/**
 * 1. Numeric Syntax & Calculation Diagnostic Analyzer
 */
export function analyzeNumericError(
  expectedVal: number,
  rawInput: unknown,
  prompt: string
): SmartHintDiagnosis | null {
  const userNum = parseNumericInput(rawInput);
  if (userNum === null || expectedVal === 0) return null;

  const ratio = userNum / expectedVal;
  const pLower = prompt.toLowerCase();

  // A. Reciprocal / Inverted division (e.g., student calculated M/m instead of m/M, or R/U instead of U/R)
  if (userNum > 0 && expectedVal > 0) {
    const reciprocalRatio = userNum * expectedVal;
    if (isCloseRatio(reciprocalRatio, 1, 0.08) && !isCloseRatio(ratio, 1, 0.08)) {
      return {
        category: 'reciprocal_error',
        title: 'Đảo ngược phép chia (Mẫu số / Tử số)',
        hint: 'Có vẻ bạn đang đảo ngược phép chia (lấy mẫu chia cho tử thay vì tử chia cho mẫu).',
        guidingQuestion: 'Hãy kiểm tra lại công thức gốc: Đại lượng nào nằm trên tử số và đại lượng nào ở mẫu số?',
      };
    }
  }

  // B. Specific Domain Cues (Biology & Physics specific contexts)
  // 1. Biology Cell Division: 2*n instead of 2^n
  if (
    (pLower.includes('phân bào') || pLower.includes('nguyên phân') || pLower.includes('tế bào con')) &&
    expectedVal > 4
  ) {
    return {
      category: 'cell_division',
      title: 'Nhầm cấp số nhân lũy thừa (2ⁿ)',
      hint: 'Mỗi lần nguyên phân số tế bào tăng gấp đôi, qua n lần liên tiếp sẽ tạo 2ⁿ tế bào con (chứ không phải 2 × n).',
      guidingQuestion: 'Số tế bào con là 2 lũy thừa số lần nguyên phân: 2ⁿ bằng bao nhiêu?',
    };
  }

  // 2. Velocity unit: factor of 3.6 or 1/3.6 (km/h ↔ m/s)
  if (isCloseRatio(ratio, 3.6, 0.1) || isCloseRatio(ratio, 1 / 3.6, 0.05)) {
    return {
      category: 'unit_conversion',
      title: 'Chưa đổi đơn vị vận tốc (km/h ↔ m/s)',
      hint: 'Trong các công thức động năng và chuyển động, vận tốc v cần đổi về đơn vị chuẩn m/s (Quy tắc: 1 m/s = 3,6 km/h, lấy km/h chia 3,6 để ra m/s).',
      guidingQuestion: 'Vận tốc trong đề bài là km/h hay m/s? Bạn đã quy đổi đúng về m/s chưa?',
    };
  }

  // 3. Kinetic Energy: Forgot squared velocity (W_đ = 1/2 m v²)
  if (
    (pLower.includes('động năng') || pLower.includes('kinetic') || pLower.includes('w_đ')) &&
    userNum > 0
  ) {
    return {
      category: 'squared_term',
      title: 'Chú ý bình phương vận tốc (v²)',
      hint: 'Trong công thức tính động năng W_đ = ½ m v², đại lượng vận tốc v phải được bình phương (v²).',
      guidingQuestion: 'Hãy kiểm tra xem bạn đã nhân v với chính nó (v²) chưa nhé!',
    };
  }

  // 3. Biology DNA Complementary Bases & Hydrogen bonds: H = 2A + 3G
  if (pLower.includes('nucleotide') || pLower.includes('hydrogen') || pLower.includes('dna')) {
    return {
      category: 'dna_pairing',
      title: 'Nguyên tắc bổ sung & Liên kết Hydrogen',
      hint: 'Cặp A-T liên kết bằng 2 liên kết hydrogen, cặp G-C liên kết bằng 3 liên kết hydrogen. Công thức tổng số liên kết là H = 2A + 3G.',
      guidingQuestion: 'Bạn đã áp dụng đúng số liên kết giữa các cặp nuclêôtit chưa?',
    };
  }

  // 4. Standard gas conditions constant misuse: 22.4 L/mol (old) vs 24.79 L/mol (KNTT standard)
  if (isCloseRatio(ratio, 22.4 / 24.79, 0.04) || isCloseRatio(ratio, 24.79 / 22.4, 0.04)) {
    return {
      category: 'formula_misuse',
      title: 'Nhầm hằng số Điều kiện chuẩn (ĐKC)',
      hint: 'Bạn đang dùng hằng số 22,4 L/mol của chương trình cũ. SGK Kết nối tri thức hiện hành quy định thể tích 1 mol khí ở điều kiện chuẩn (25°C, 1 bar) là 24,79 lít.',
      guidingQuestion: 'Hãy áp dụng công thức mới V = 24,79 × n để tính lại thể tích khí nhé!',
    };
  }

  // C. Stoichiometric / Coefficient Factor error (e.g. forgot ratio 1:2 or 2:1)
  if (isCloseRatio(ratio, 2, 0.04) || isCloseRatio(ratio, 0.5, 0.04)) {
    return {
      category: 'coefficient_error',
      title: 'Lệch hệ số tỉ lệ phương trình (2 lần)',
      hint: 'Kết quả của bạn đang lệch đúng 2 lần so với đáp án chuẩn. Rất có thể bạn đã quên nhân hoặc chia hệ số 2 trong tỉ lệ phản ứng.',
      guidingQuestion: 'Hãy cân bằng lại PTHH và kiểm tra tỉ lệ số mol giữa các chất tham gia và sản phẩm!',
    };
  }

  if (isCloseRatio(ratio, 3, 0.03) || isCloseRatio(ratio, 1 / 3, 0.02)) {
    return {
      category: 'coefficient_error',
      title: 'Lệch hệ số tỉ lệ phương trình (3 lần)',
      hint: 'Kết quả của bạn lệch 3 lần so với đáp án. Có thể bạn đã bỏ sót hệ số 3 trong phương trình phản ứng.',
      guidingQuestion: 'Tỉ lệ mol của chất cần tìm so với chất đã biết trong phương trình là bao nhiêu?',
    };
  }

  // D. Unit Conversion: factor of 1000 or 0.001 (mL ↔ L, g ↔ kg, kJ ↔ J, kW ↔ W)
  if (isCloseRatio(ratio, 1000, 50) || isCloseRatio(ratio, 0.001, 0.0002)) {
    return {
      category: 'unit_conversion',
      title: 'Quên đổi đơn vị đo (Lệch 1000 lần)',
      hint: 'Giá trị của bạn lệch đúng 1000 lần. Bạn có thể đã quên đổi mL sang Lít (chia cho 1000) hoặc đổi gam sang kilôgam trước khi tính.',
      guidingQuestion: 'Thể tích hoặc khối lượng trong đề bài đã ở đơn vị chuẩn (Lít hoặc kg) chưa?',
    };
  }

  // E. Percentage factor of 100 or 0.01 (forgot * 100% in C% or cm ↔ m)
  if (isCloseRatio(ratio, 100, 5) || isCloseRatio(ratio, 0.01, 0.002)) {
    return {
      category: 'unit_conversion',
      title: 'Thiếu hoặc thừa nhân 100%',
      hint: 'Kết quả của bạn lệch 100 lần. Trong công thức tính nồng độ phần trăm C% = (m_ct / m_dd) × 100% hoặc quy đổi cm sang mét, hãy nhớ nhân thêm 100% nhé.',
      guidingQuestion: 'Bạn đã nhân thêm 100% khi tính nồng độ phần trăm chưa?',
    };
  }


  // G. Time unit: factor of 60 or 3600 (phút/giờ sang giây)
  if (
    isCloseRatio(ratio, 60, 2) ||
    isCloseRatio(ratio, 1 / 60, 0.005) ||
    isCloseRatio(ratio, 3600, 100) ||
    isCloseRatio(ratio, 1 / 3600, 0.0001)
  ) {
    return {
      category: 'unit_conversion',
      title: 'Chưa đổi đơn vị thời gian sang giây (s)',
      hint: 'Thời gian trong các công thức vật lý (công suất P = A/t, vận tốc v = s/t) cần đổi thời gian sang giây (s) (1 phút = 60s, 1 giờ = 3600s).',
      guidingQuestion: 'Bạn đã đổi thời gian sang giây trước khi tính toán chưa?',
    };
  }

  return null;
}

/**
 * 2. Chemical Formula Syntax & Valence Analyzer
 */
export function analyzeFormulaError(
  expectedFormula: string,
  rawInput: unknown
): SmartHintDiagnosis | null {
  if (typeof rawInput !== 'string') return null;
  const inputStr = rawInput.trim();
  if (!inputStr) return null;

  // Case sensitivity issue: e.g. "co" vs "CO", "cl2" vs "Cl2", "naoh" vs "NaOH"
  if (inputStr.toLowerCase() === expectedFormula.toLowerCase() && inputStr !== expectedFormula) {
    return {
      category: 'formula_syntax',
      title: 'Quy tắc viết hoa ký hiệu nguyên tố',
      hint: 'Ký hiệu nguyên tố hóa học phải viết hoa chữ cái đầu và viết thường chữ cái sau (ví dụ: CO là Carbon monoxide, Co là Coban; Cl chứ không phải cl).',
      guidingQuestion: 'Hãy kiểm tra lại việc viết hoa chữ cái đầu của mỗi nguyên tố nhé!',
    };
  }

  // Common valence subscript slips: e.g., AlO instead of Al2O3, FeCl instead of FeCl2/FeCl3
  const expectedLower = expectedFormula.toLowerCase();
  const inputLower = inputStr.toLowerCase();

  if (
    (expectedLower.includes('al2o3') && inputLower === 'alo') ||
    (expectedLower.includes('fecl3') && inputLower === 'fecl') ||
    (expectedLower.includes('na2so4') && inputLower === 'naso4')
  ) {
    return {
      category: 'formula_misuse',
      title: 'Quy tắc lập công thức theo hóa trị',
      hint: 'Chỉ số chân của các nguyên tố phải tuân theo quy tắc hóa trị: a · x = b · y.',
      guidingQuestion: 'Mỗi nguyên tố/nhóm nguyên tử trong hợp chất này có hóa trị mấy? Hãy chéo hóa trị để lập chỉ số chân!',
    };
  }

  return null;
}

/**
 * 3. Multiple Choice & Concept Prompt Analyzer
 */
export function analyzeMcqError(
  exercise: Exercise,
  _selectedOptionId: string
): SmartHintDiagnosis | null {
  const pLower = exercise.prompt.toLowerCase();

  // Negative question trap: "KHÔNG ĐÚNG", "SAI", "NGOẠI TRỪ"
  if (
    pLower.includes('không đúng') ||
    pLower.includes('phát biểu sai') ||
    pLower.includes('ngoại trừ') ||
    pLower.includes('không phải là') ||
    exercise.prompt.includes('KHÔNG') ||
    exercise.prompt.includes('SAI')
  ) {
    return {
      category: 'negative_question',
      title: 'Bẫy câu hỏi phủ định',
      hint: 'Đề bài đang yêu cầu bạn tìm phát biểu KHÔNG ĐÚNG hoặc NGOẠI TRỪ. Hãy đọc kỹ từng phương án để chọn mệnh đề sai nhé!',
      guidingQuestion: 'Câu hỏi yêu cầu tìm ý đúng hay ý sai?',
    };
  }

  return null;
}

/**
 * 4. Fallback Pedagogical Hint Generator
 * Extracts constructive, step-by-step guidance without giving away the final answer.
 */
export function getFallbackPedagogicalHint(exercise: Exercise): SmartHintDiagnosis {
  // Use first hint if available
  if (exercise.hints && exercise.hints.length > 0) {
    const firstHint = exercise.hints[0].text;
    return {
      category: 'guided_step',
      title: 'Gợi ý định hướng tư duy',
      hint: firstHint,
      guidingQuestion: 'Bạn có thể vận dụng kiến thức trên để làm lại câu hỏi này không?',
    };
  }

  // Use first solution step if available
  if (exercise.steps && exercise.steps.length > 0) {
    const firstStep = exercise.steps[0];
    return {
      category: 'guided_step',
      title: firstStep.title || 'Bước 1: Xác định kiến thức',
      hint: firstStep.body,
      guidingQuestion: 'Thử thực hiện bước đầu tiên này xem nhé!',
    };
  }

  // General default guidance
  return {
    category: 'guided_step',
    title: 'Gợi ý giải bài',
    hint: 'Hãy đọc kỹ các đại lượng đề bài đã cho và xác định công thức liên hệ trực tiếp trước khi tính toán.',
    guidingQuestion: 'Đề bài đã cho những dữ kiện gì và yêu cầu tìm đại lượng nào?',
  };
}

/**
 * Main Entry Point: AI Smart Step Hint Engine
 * Analyzes the student's specific incorrect input and returns a rich, non-revealing pedagogical diagnosis.
 * Deterministic, zero AI hallucination, execution time < 5ms.
 */
export function generateSmartHint(
  exercise: Exercise,
  userInput: unknown,
  lastVerdict?: Verdict
): SmartHintDiagnosis {
  // 1. If verdict already matched an explicit commonMistake with diagnosis, prioritize it
  if (lastVerdict && lastVerdict.status === 'incorrect' && lastVerdict.diagnosis) {
    return {
      category: 'common_mistake',
      title: 'Chẩn đoán lỗi sai phổ biến',
      hint: lastVerdict.diagnosis,
      guidingQuestion: 'Hãy đọc kỹ chẩn đoán trên và thử khắc phục bước này nhé!',
    };
  }

  // 2. Check if exercise answer is numeric
  if (exercise.answer.kind === 'number') {
    const numericDiagnosis = analyzeNumericError(
      exercise.answer.value,
      userInput,
      exercise.prompt
    );
    if (numericDiagnosis) return numericDiagnosis;
  }

  // 3. Check if exercise answer is a chemical formula
  if (exercise.answer.kind === 'formula' && exercise.answer.accepted.length > 0) {
    const formulaDiagnosis = analyzeFormulaError(
      exercise.answer.accepted[0],
      userInput
    );
    if (formulaDiagnosis) return formulaDiagnosis;
  }

  // 4. Check if exercise is MCQ
  if (exercise.answer.kind === 'mcq-single') {
    const mcqDiagnosis = analyzeMcqError(
      exercise,
      typeof userInput === 'string' ? userInput : ''
    );
    if (mcqDiagnosis) return mcqDiagnosis;
  }

  // 5. Fallback to pedagogical scaffolding ladder
  return getFallbackPedagogicalHint(exercise);
}
