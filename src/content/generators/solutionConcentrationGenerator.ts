import { Exercise } from '@/content/schema';

export function generateMassPercentageExercise(
  soluteFormula = 'NaCl',
  soluteNameVi = 'natri clorua',
  soluteMass = 20,
  waterMass = 80,
  idSuffix = '001'
): Exercise {
  const solutionMass = soluteMass + waterMass;
  const cPercent = Math.round((soluteMass / solutionMass) * 100 * 10) / 10;
  const wrongTrapWithoutSolute = Math.round((soluteMass / waterMass) * 100 * 10) / 10;

  return {
    id: `g8-b04-gen-cpercent-${idSuffix}`,
    lessonId: 'g8-b04',
    skillIds: ['mass-percentage-calc'],
    difficulty: 2,
    prompt: `Hòa tan hoàn toàn ${soluteMass} g [[${soluteFormula}]] (${soluteNameVi}) vào ${waterMass} g nước cất. Tính nồng độ phần trăm (C%) của dung dịch thu được.`,
    given: [
      { label: `Khối lượng chất tan (m_ct)`, value: `${soluteMass}`, unit: 'g' },
      { label: `Khối lượng dung môi nước (m_H2O)`, value: `${waterMass}`, unit: 'g' },
    ],
    find: { label: `Nồng độ phần trăm (C%)`, unit: '%' },
    knowledge: ['formula.mass-percentage'],
    answer: {
      kind: 'number',
      value: cPercent,
      unit: '%',
      decimals: 1,
      tolerance: { abs: 0.1 },
    },
    hints: [
      {
        level: 1,
        text: 'Trước hết, cần tính khối lượng dung dịch: m_dd = m_chất tan + m_nước.',
      },
      {
        level: 2,
        text: `Công thức: C% = (m_ct / m_dd) × 100% = (${soluteMass} / (${soluteMass} + ${waterMass})) × 100%.`,
      },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Đọc dữ kiện',
        body: `m_{ct} = ${soluteMass} g [[${soluteFormula}]], m_{H2O} = ${waterMass} g. Yêu cầu tính C%.`,
      },
      {
        kind: 'compute',
        title: 'Tính khối lượng dung dịch',
        body: `m_{dd} = m_{ct} + m_{H2O} = ${soluteMass} + ${waterMass} = ${solutionMass} g. Lưu ý không được lấy khối lượng nước làm mẫu số.`,
      },
      {
        kind: 'compute',
        title: 'Tính nồng độ phần trăm C%',
        body: `C% = (m_{ct} / m_{dd}) × 100% = (${soluteMass} / ${solutionMass}) × 100% = ${cPercent}%.`,
      },
      {
        kind: 'answer',
        title: 'Kết luận',
        body: `Nồng độ phần trăm của dung dịch [[${soluteFormula}]] là ${cPercent}%.`,
      },
    ],
    finalSolution: `m_{dd} = ${soluteMass} + ${waterMass} = ${solutionMass} g. C% = (${soluteMass} / ${solutionMass}) × 100% = ${cPercent}%.`,
    commonMistakes: [
      {
        id: 'forgot-to-add-solute-mass',
        message: 'Lỗi thường gặp: quên cộng khối lượng chất tan vào khối lượng dung môi để ra khối lượng dung dịch (m_dd = m_ct + m_dm).',
        trapAnswers: [`${wrongTrapWithoutSolute}`],
      },
    ],
  };
}

export function generateMolarConcentrationExercise(
  soluteFormula = 'CuSO4',
  soluteNameVi = 'đồng(II) sunfat',
  molVal = 0.2,
  volumeMl = 400,
  idSuffix = '002'
): Exercise {
  const volumeL = volumeMl / 1000;
  const cM = Math.round((molVal / volumeL) * 100) / 100;
  const trapWrongUnit = Math.round((molVal / volumeMl) * 10000) / 10000;

  return {
    id: `g8-b04-gen-cmolar-${idSuffix}`,
    lessonId: 'g8-b04',
    skillIds: ['molar-concentration-calc'],
    difficulty: 2,
    prompt: `Hòa tan ${molVal} mol [[${soluteFormula}]] (${soluteNameVi}) vào nước thu được ${volumeMl} mL dung dịch. Tính nồng độ mol (CM) của dung dịch.`,
    given: [
      { label: `Số mol chất tan (n)`, value: `${molVal}`, unit: 'mol' },
      { label: `Thể tích dung dịch (V)`, value: `${volumeMl}`, unit: 'mL' },
    ],
    find: { label: `Nồng độ mol (CM)`, unit: 'M' },
    knowledge: ['formula.molar-concentration'],
    answer: {
      kind: 'number',
      value: cM,
      unit: 'M',
      decimals: 2,
      tolerance: { abs: 0.05 },
    },
    hints: [
      {
        level: 1,
        text: 'Cần chú ý đổi thể tích dung dịch từ đơn vị mL sang đơn vị Lít (1 L = 1000 mL).',
      },
      {
        level: 2,
        text: `V = ${volumeMl} / 1000 = ${volumeL} L. Công thức: CM = n / V = ${molVal} / ${volumeL}.`,
      },
    ],
    steps: [
      {
        kind: 'given',
        title: 'Đổi đơn vị thể tích',
        body: `V = ${volumeMl} mL = ${volumeMl} / 1000 = ${volumeL} L.`,
      },
      {
        kind: 'knowledge',
        title: 'Công thức áp dụng',
        body: `C_M = n / V (trong đó n tính bằng mol, V tính bằng Lít).`,
      },
      {
        kind: 'compute',
        title: 'Tính toán',
        body: `C_M = ${molVal} / ${volumeL} = ${cM} (mol/L hoặc M).`,
      },
      {
        kind: 'answer',
        title: 'Kết luận',
        body: `Nồng độ mol của dung dịch là ${cM} M.`,
      },
    ],
    finalSolution: `V = ${volumeL} L. CM = n / V = ${molVal} / ${volumeL} = ${cM} M.`,
    commonMistakes: [
      {
        id: 'forgot-unit-conversion-ml-to-l',
        message: 'Quên đổi thể tích từ mL sang Lít trước khi áp dụng công thức CM = n / V.',
        trapAnswers: [`${trapWrongUnit}`],
      },
    ],
  };
}
