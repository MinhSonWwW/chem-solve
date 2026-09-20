import { Exercise } from '@/content/schema';

export function generateGasDensityAirExercise(
  gasFormula = 'SO2',
  gasNameVi = 'khí lưu huỳnh đioxit',
  molarMass = 64,
  idSuffix = '001'
): Exercise {
  const density = Math.round((molarMass / 29) * 100) / 100;
  const isHeavier = molarMass > 29;

  return {
    id: `g8-b03-gen-density-air-${idSuffix}`,
    lessonId: 'g8-b03',
    skillIds: ['gas-density-calc'],
    difficulty: 2,
    prompt: `Tính tỉ khối của [[${gasFormula}]] (${gasNameVi}, M = ${molarMass} g/mol) đối với không khí. Cho biết khối lượng mol trung bình của không khí xấp xỉ 29 g/mol.`,
    given: [
      { label: `Khối lượng mol của khí (M_A)`, value: `${molarMass}`, unit: 'g/mol' },
      { label: `Khối lượng mol trung bình của không khí (M_kk)`, value: '29', unit: 'g/mol' },
    ],
    find: { label: `Tỉ khối đối với không khí (d_A/kk)` },
    knowledge: ['formula.relative-gas-density'],
    answer: {
      kind: 'number',
      value: density,
      decimals: 2,
      tolerance: { abs: 0.05 },
    },
    hints: [
      { level: 1, text: 'Tỉ khối của khí A đối với không khí được tính theo công thức d_A/kk = M_A / 29.' },
      { level: 2, text: `Thực hiện phép chia: d = ${molarMass} / 29.` },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Nhận dạng yêu cầu',
        body: `Cần tính tỉ khối của khí [[${gasFormula}]] đối với không khí.`,
      },
      {
        kind: 'knowledge',
        title: 'Công thức áp dụng',
        body: `d_{A/kk} = M_A / 29. Tỉ khối là đại lượng không có đơn vị đo.`,
      },
      {
        kind: 'compute',
        title: 'Tính toán',
        body: `d = ${molarMass} / 29 ≈ ${density}.`,
      },
      {
        kind: 'answer',
        title: 'Kết luận & Nhận xét',
        body: `Tỉ khối của [[${gasFormula}]] đối với không khí là ${density}. Vì ${density} ${isHeavier ? '> 1 nên khí này nặng hơn không khí' : '< 1 nên khí này nhẹ hơn không khí'}.`,
      },
    ],
    finalSolution: `d_{A/kk} = M_A / 29 = ${molarMass} / 29 ≈ ${density}.`,
    commonMistakes: [
      {
        id: 'inverted-density-fraction',
        message: 'Lấy 29 chia cho khối lượng mol của khí (ngược chiều tỉ khối).',
        trapAnswers: [`${Math.round((29 / molarMass) * 100) / 100}`],
      },
    ],
  };
}
