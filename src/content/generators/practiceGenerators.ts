/**
 * Number generators for practice units (src/content/practice). Each call returns a fresh exercise
 * with random values, so a calculation unit never repeats. Ids/lessonId are set by the round builder.
 * Formulas follow SGK KHTN 6 Kết nối tri thức.
 */
import type { Exercise } from '@/content/schema/exercise';
import { generateCellDivisionExercise, generateMicroscopeMagnificationExercise } from './biologyGenerators';

type Rand = () => number;
const pick = <T,>(xs: readonly T[], r: Rand): T => xs[Math.floor(r() * xs.length)];
const round = (x: number, d = 3) => Math.round(x * 10 ** d) / 10 ** d;
/** Vietnamese decimal comma. */
export const vn = (x: number) => String(round(x)).replace('.', ',');

function numberExercise(o: {
  prompt: string;
  value: number;
  unit?: string;
  hint: string;
  formula: string;
  work: string;
  trap?: number[];
  skill: string;
}): Exercise {
  const answer = `${vn(o.value)}${o.unit ? ` ${o.unit}` : ''}`;
  return {
    id: 'gen',
    lessonId: 'gen',
    skillIds: [o.skill],
    difficulty: 2,
    prompt: o.prompt,
    knowledge: [],
    answer: { kind: 'number', value: round(o.value), unit: o.unit, tolerance: { abs: 0.0005, rel: 0.001 } },
    hints: [
      { level: 1, text: o.hint },
      { level: 2, text: `Áp dụng: ${o.formula}` },
    ],
    steps: [
      { kind: 'identify', title: 'Xác định dữ kiện', body: o.prompt },
      { kind: 'compute', title: 'Tính toán', body: o.work },
      { kind: 'answer', title: 'Đáp án', body: answer },
    ],
    finalSolution: `${o.work} Đáp án: ${answer}.`,
    commonMistakes: o.trap?.length
      ? [{ id: 'wrong-factor', message: 'Kiểm tra lại hệ số quy đổi hoặc công thức.', trapAnswers: o.trap.map(vn) }]
      : [],
  };
}

const LENGTH: Array<[string, string, number]> = [
  ['km', 'm', 1000],
  ['m', 'cm', 100],
  ['m', 'mm', 1000],
  ['dm', 'cm', 10],
  ['cm', 'mm', 10],
  ['mm', 'cm', 0.1],
  ['cm', 'm', 0.01],
];
const MASS: Array<[string, string, number]> = [
  ['tấn', 'kg', 1000],
  ['tạ', 'kg', 100],
  ['yến', 'kg', 10],
  ['kg', 'g', 1000],
  ['g', 'kg', 0.001],
  ['g', 'mg', 1000],
];
const TIME: Array<[string, string, number]> = [
  ['h', 'min', 60],
  ['min', 's', 60],
  ['h', 's', 3600],
  ['ngày', 'h', 24],
];

function convert(table: Array<[string, string, number]>, skill: string, r: Rand): Exercise {
  const [from, to, k] = pick(table, r);
  const base = k < 1 ? pick([30, 45, 90, 120, 150, 250, 500, 1500, 2500], r) : pick([0.5, 1.2, 1.5, 2, 2.5, 3.4, 4, 7.5, 12], r);
  const value = base * k;
  return numberExercise({
    prompt: `Đổi ${vn(base)} ${from} sang đơn vị ${to}. (Chỉ nhập số)`,
    value,
    hint: `Nhớ quan hệ giữa ${from} và ${to}: 1 ${from} = ${vn(k)} ${to}.`,
    formula: `giá trị (${to}) = giá trị (${from}) × ${vn(k)}`,
    work: `${vn(base)} ${from} = ${vn(base)} × ${vn(k)} ${to} = ${vn(value)} ${to}.`,
    trap: [base / (k || 1), base * k * 10, base * k / 10].filter((x) => round(x) !== round(value)),
    skill,
  });
}

export const PRACTICE_GENERATORS: Record<string, (r: Rand) => Exercise> = {
  'length-convert': (r) => convert(LENGTH, 'length-unit-convert', r),
  'mass-convert': (r) => convert(MASS, 'mass-unit-convert', r),
  'time-convert': (r) => convert(TIME, 'time-unit-convert', r),

  'temperature-convert': (r) => {
    const t = pick([-10, 0, 15, 20, 25, 27, 30, 37, 40, 60, 80, 100], r);
    if (r() < 0.6) {
      return numberExercise({
        prompt: `Nhiệt độ của một vật là ${t} °C. Nhiệt độ đó trong thang Kelvin là bao nhiêu K?`,
        value: t + 273,
        unit: 'K',
        hint: 'Thang Kelvin lệch thang Celsius đúng 273 độ.',
        formula: 'T (K) = t (°C) + 273',
        work: `T = ${t} + 273 = ${t + 273} K.`,
        trap: [t - 273, t + 237],
        skill: 'temperature-kelvin-convert',
      });
    }
    const f = t * 1.8 + 32;
    return numberExercise({
      prompt: `Nhiệt độ ngoài trời là ${t} °C. Nhiệt độ đó trong thang Fahrenheit là bao nhiêu °F?`,
      value: f,
      unit: '°F',
      hint: 'Mỗi độ C ứng với 1,8 độ F, và 0 °C ứng với 32 °F.',
      formula: 't (°F) = t (°C) × 1,8 + 32',
      work: `t = ${t} × 1,8 + 32 = ${vn(f)} °F.`,
      trap: [t * 1.8, (t + 32) * 1.8],
      skill: 'temperature-scale-celsius',
    });
  },

  'force-scale': (r) => {
    const k = pick([2, 5, 10, 20, 50], r);
    const len = pick([2, 3, 4, 5, 6], r);
    if (r() < 0.5) {
      return numberExercise({
        prompt: `Một lực được biểu diễn bằng mũi tên dài ${len} cm, với tỉ xích 1 cm ứng với ${k} N. Độ lớn của lực là bao nhiêu N?`,
        value: len * k,
        unit: 'N',
        hint: 'Mỗi xentimét chiều dài mũi tên ứng với một lượng lực bằng tỉ xích.',
        formula: 'F = độ dài mũi tên (cm) × tỉ xích (N/cm)',
        work: `F = ${len} × ${k} = ${len * k} N.`,
        trap: [len + k, k / len],
        skill: 'force-representation',
      });
    }
    return numberExercise({
      prompt: `Biểu diễn một lực ${len * k} N theo tỉ xích 1 cm ứng với ${k} N. Mũi tên cần vẽ dài bao nhiêu cm?`,
      value: len,
      unit: 'cm',
      hint: 'Chia độ lớn của lực cho số niutơn ứng với 1 cm.',
      formula: 'độ dài (cm) = F : tỉ xích',
      work: `Độ dài = ${len * k} : ${k} = ${len} cm.`,
      trap: [len * k * k, len * k],
      skill: 'force-representation',
    });
  },

  'spring-extension': (r) => {
    if (r() < 0.5) {
      const l0 = pick([10, 12, 15, 20, 25], r);
      const d = pick([1.5, 2, 3, 4, 5], r);
      return numberExercise({
        prompt: `Một lò xo có chiều dài tự nhiên ${l0} cm. Khi treo vật nặng, lò xo dài ${vn(l0 + d)} cm. Độ dãn của lò xo là bao nhiêu cm?`,
        value: d,
        unit: 'cm',
        hint: 'Độ dãn là phần chiều dài tăng thêm so với chiều dài tự nhiên.',
        formula: 'Δl = l − l₀',
        work: `Δl = ${vn(l0 + d)} − ${l0} = ${vn(d)} cm.`,
        trap: [l0 + d + l0, l0],
        skill: 'spring-extension-calc',
      });
    }
    const m1 = pick([50, 100, 200], r);
    const d1 = pick([0.5, 1, 1.5, 2], r);
    const n = pick([2, 3, 4], r);
    return numberExercise({
      prompt: `Treo quả nặng ${m1} g vào một lò xo thì lò xo dãn ${vn(d1)} cm. Nếu treo vật ${m1 * n} g (lò xo vẫn đàn hồi) thì lò xo dãn bao nhiêu cm?`,
      value: d1 * n,
      unit: 'cm',
      hint: 'Độ dãn của lò xo tỉ lệ thuận với khối lượng vật treo.',
      formula: 'Δl₂ = Δl₁ × m₂ : m₁',
      work: `Khối lượng gấp ${n} lần nên độ dãn cũng gấp ${n} lần: Δl₂ = ${vn(d1)} × ${n} = ${vn(d1 * n)} cm.`,
      trap: [d1 + n, d1],
      skill: 'spring-extension-calc',
    });
  },

  weight: (r) => {
    const mode = r();
    if (mode < 0.4) {
      const m = pick([0.5, 1.5, 2, 3, 4.5, 12, 45], r);
      return numberExercise({
        prompt: `Một vật có khối lượng ${vn(m)} kg. Trọng lượng của vật gần mặt đất là bao nhiêu N?`,
        value: m * 10,
        unit: 'N',
        hint: 'Vật có khối lượng 1 kg thì có trọng lượng khoảng 10 N.',
        formula: 'P = 10 × m (m tính bằng kg)',
        work: `P = 10 × ${vn(m)} = ${vn(m * 10)} N.`,
        trap: [m, m / 10],
        skill: 'gravity-weight-calc',
      });
    }
    if (mode < 0.7) {
      const g = pick([100, 200, 250, 500, 800], r);
      return numberExercise({
        prompt: `Một gói hàng có khối lượng ${g} g. Trọng lượng của gói hàng là bao nhiêu N?`,
        value: g / 100,
        unit: 'N',
        hint: 'Đổi khối lượng ra kilôgam trước khi tính trọng lượng.',
        formula: 'P = 10 × m, với m = khối lượng (g) : 1000',
        work: `m = ${g} g = ${vn(g / 1000)} kg; P = 10 × ${vn(g / 1000)} = ${vn(g / 100)} N.`,
        trap: [g * 10, g / 10],
        skill: 'gravity-weight-calc',
      });
    }
    const p = pick([20, 35, 50, 120, 450], r);
    return numberExercise({
      prompt: `Lực kế chỉ trọng lượng của một vật là ${p} N. Khối lượng của vật là bao nhiêu kg?`,
      value: p / 10,
      unit: 'kg',
      hint: 'Trọng lượng (N) gấp 10 lần số kilôgam.',
      formula: 'm = P : 10',
      work: `m = ${p} : 10 = ${vn(p / 10)} kg.`,
      trap: [p * 10, p],
      skill: 'gravity-weight-calc',
    });
  },

  'energy-kj': (r) => {
    const kj = pick([0.5, 1.2, 2.5, 4, 15, 120], r);
    return numberExercise({
      prompt: `Đổi ${vn(kj)} kJ sang đơn vị jun (J). (Chỉ nhập số)`,
      value: kj * 1000,
      hint: 'Tiền tố "kilô" nghĩa là nghìn.',
      formula: '1 kJ = 1000 J',
      work: `${vn(kj)} kJ = ${vn(kj)} × 1000 = ${vn(kj * 1000)} J.`,
      trap: [kj * 100, kj / 1000],
      skill: 'energy-unit-convert',
    });
  },

  'energy-wasted': (r) => {
    const total = pick([100, 200, 500, 1000, 1200], r);
    const pct = pick([0.1, 0.15, 0.25, 0.3, 0.4, 0.8], r);
    const useful = total * pct;
    const ask = r() < 0.5;
    return numberExercise({
      prompt: ask
        ? `Một thiết bị nhận ${total} J năng lượng, trong đó ${vn(useful)} J được dùng có ích. Năng lượng hao phí là bao nhiêu J?`
        : `Một thiết bị nhận ${total} J năng lượng và bị hao phí ${vn(total - useful)} J. Năng lượng có ích là bao nhiêu J?`,
      value: ask ? total - useful : useful,
      unit: 'J',
      hint: 'Năng lượng nhận vào bằng năng lượng có ích cộng năng lượng hao phí.',
      formula: 'W toàn phần = W có ích + W hao phí',
      work: ask
        ? `W hao phí = ${total} − ${vn(useful)} = ${vn(total - useful)} J.`
        : `W có ích = ${total} − ${vn(total - useful)} = ${vn(useful)} J.`,
      trap: [total + useful],
      skill: 'energy-wasted-calc',
    });
  },

  // Biology (existing generators)
  'microscope-magnification': () => generateMicroscopeMagnificationExercise('p'),
  'cell-division': () => generateCellDivisionExercise('p'),
};
