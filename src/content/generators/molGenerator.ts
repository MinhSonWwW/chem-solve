import { Exercise } from '@/content/schema';

export interface SubstanceMolParam {
  formula: string;
  nameVi: string;
  molarMass: number;
}

const COMMON_SUBSTANCES: SubstanceMolParam[] = [
  { formula: 'H2O', nameVi: 'Nước', molarMass: 18 },
  { formula: 'CO2', nameVi: 'Khí cacbonic', molarMass: 44 },
  { formula: 'NaOH', nameVi: 'Natri hiđroxit', molarMass: 40 },
  { formula: 'CaCO3', nameVi: 'Canxi cacbonat', molarMass: 100 },
  { formula: 'Fe', nameVi: 'Sắt', molarMass: 56 },
  { formula: 'Cu', nameVi: 'Đồng', molarMass: 64 },
  { formula: 'Al', nameVi: 'Nhôm', molarMass: 27 },
  { formula: 'O2', nameVi: 'Khí oxi', molarMass: 32 },
  { formula: 'H2SO4', nameVi: 'Axit sunfuric', molarMass: 98 },
  { formula: 'NaCl', nameVi: 'Natri clorua', molarMass: 58.5 },
];

/**
 * Generates an exercise calculating mol from mass (n = m / M)
 */
export function generateMolFromMassExercise(
  substanceIndex = 0,
  molVal = 0.5,
  idSuffix = '001'
): Exercise {
  const sub = COMMON_SUBSTANCES[substanceIndex % COMMON_SUBSTANCES.length];
  const mass = Math.round(molVal * sub.molarMass * 100) / 100;

  return {
    id: `g8-b03-gen-mol-${idSuffix}`,
    lessonId: 'g8-b03',
    skillIds: ['mol-mass-calc'],
    difficulty: 1,
    prompt: `Tính số mol của ${mass} g [[${sub.formula}]] (${sub.nameVi}). Biết khối lượng mol của [[${sub.formula}]] là ${sub.molarMass} g/mol.`,
    given: [
      { label: `Khối lượng ${sub.formula} (m)`, value: `${mass}`, unit: 'g' },
      { label: `Khối lượng mol (M)`, value: `${sub.molarMass}`, unit: 'g/mol' },
    ],
    find: { label: `Số mol (n)`, unit: 'mol' },
    knowledge: ['formula.mol-from-mass'],
    answer: {
      kind: 'number',
      value: molVal,
      unit: 'mol',
      decimals: 3,
      tolerance: { abs: 0.01 },
    },
    hints: [
      { level: 1, text: `Áp dụng công thức liên hệ giữa khối lượng m, khối lượng mol M và số mol n.` },
      { level: 2, text: `Công thức: n = m / M = ${mass} / ${sub.molarMass}.` },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Nhận dạng dạng bài',
        body: `Bài toán yêu cầu tính số mol n khi đã biết khối lượng m (${mass} g) và khối lượng mol M (${sub.molarMass} g/mol).`,
      },
      {
        kind: 'knowledge',
        title: 'Công thức áp dụng',
        body: `Sử dụng công thức: n = m / M.`,
      },
      {
        kind: 'compute',
        title: 'Thực hiện phép tính',
        body: `Thay số vào: n = ${mass} / ${sub.molarMass} = ${molVal} mol.`,
      },
      {
        kind: 'answer',
        title: 'Kết luận',
        body: `Số mol của ${mass} g [[${sub.formula}]] là ${molVal} mol.`,
      },
    ],
    finalSolution: `n = m / M = ${mass} / ${sub.molarMass} = ${molVal} mol.`,
    commonMistakes: [
      {
        id: 'inverted-formula',
        message: 'Nhầm lẫn công thức lấy M chia cho m thay vì m chia M.',
        trapAnswers: [`${Math.round((sub.molarMass / mass) * 100) / 100}`],
      },
    ],
  };
}

/**
 * Generates an exercise calculating mass from mol (m = n * M)
 */
export function generateMassFromMolExercise(
  substanceIndex = 0,
  molVal = 0.25,
  idSuffix = '002'
): Exercise {
  const sub = COMMON_SUBSTANCES[substanceIndex % COMMON_SUBSTANCES.length];
  const mass = Math.round(molVal * sub.molarMass * 100) / 100;

  return {
    id: `g8-b03-gen-mass-${idSuffix}`,
    lessonId: 'g8-b03',
    skillIds: ['mol-mass-calc'],
    difficulty: 1,
    prompt: `Tính khối lượng của ${molVal} mol [[${sub.formula}]] (${sub.nameVi}). Biết M của [[${sub.formula}]] là ${sub.molarMass} g/mol.`,
    given: [
      { label: `Số mol (n)`, value: `${molVal}`, unit: 'mol' },
      { label: `Khối lượng mol (M)`, value: `${sub.molarMass}`, unit: 'g/mol' },
    ],
    find: { label: `Khối lượng (m)`, unit: 'g' },
    knowledge: ['formula.mol-from-mass'],
    answer: {
      kind: 'number',
      value: mass,
      unit: 'g',
      decimals: 2,
      tolerance: { abs: 0.05 },
    },
    hints: [
      { level: 1, text: `Từ công thức n = m / M, hãy suy ra công thức tính khối lượng m.` },
      { level: 2, text: `Công thức: m = n × M = ${molVal} × ${sub.molarMass}.` },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Nhận dạng dạng bài',
        body: `Bài toán yêu cầu tính khối lượng m khi biết số mol n (${molVal} mol) và khối lượng mol M (${sub.molarMass} g/mol).`,
      },
      {
        kind: 'knowledge',
        title: 'Công thức áp dụng',
        body: `Từ n = m / M suy ra m = n × M.`,
      },
      {
        kind: 'compute',
        title: 'Thực hiện phép tính',
        body: `Thay số: m = ${molVal} × ${sub.molarMass} = ${mass} g.`,
      },
      {
        kind: 'answer',
        title: 'Kết luận',
        body: `Khối lượng của ${molVal} mol [[${sub.formula}]] là ${mass} g.`,
      },
    ],
    finalSolution: `m = n × M = ${molVal} × ${sub.molarMass} = ${mass} g.`,
    commonMistakes: [
      {
        id: 'divided-instead-of-multiplied',
        message: 'Lấy số mol chia cho khối lượng mol thay vì nhân.',
        trapAnswers: [`${Math.round((molVal / sub.molarMass) * 1000) / 1000}`],
      },
    ],
  };
}
