import { Exercise } from '@/content/schema';

export function generateGasVolumeExercise(
  gasFormula = 'CO2',
  gasNameVi = 'carbon dioxide',
  molVal = 1.5,
  idSuffix = '001'
): Exercise {
  // SGK Kết nối tri thức: 24.79 L/mol at 25 °C, 1 bar
  const volume = Math.round(molVal * 24.79 * 100) / 100;
  const oldVolumeTrap = Math.round(molVal * 22.4 * 100) / 100;

  return {
    id: `g8-b03-gen-gas-vol-${idSuffix}`,
    lessonId: 'g8-b03',
    skillIds: ['gas-volume-calc'],
    difficulty: 1,
    prompt: `Tính thể tích của ${molVal} mol [[${gasFormula}]] (${gasNameVi}) ở điều kiện chuẩn (25 °C, 1 bar).`,
    given: [{ label: `Số mol chất khí (n)`, value: `${molVal}`, unit: 'mol' }],
    find: { label: `Thể tích chất khí ở ĐKC (V)`, unit: 'L' },
    knowledge: ['formula.gas-volume'],
    answer: {
      kind: 'number',
      value: volume,
      unit: 'L',
      decimals: 2,
      tolerance: { abs: 0.05 },
    },
    hints: [
      {
        level: 1,
        text: 'Ở điều kiện chuẩn (25 °C, 1 bar theo SGK mới), 1 mol chất khí bất kì đều chiếm thể tích 24,79 L.',
      },
      { level: 2, text: `Công thức: V = n × 24,79 = ${molVal} × 24,79.` },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Nhận dạng dữ kiện',
        body: `Biết số mol n = ${molVal} mol khí [[${gasFormula}]], cần tính thể tích V ở điều kiện chuẩn.`,
      },
      {
        kind: 'knowledge',
        title: 'Kiến thức cần dùng',
        body: `Công thức chuyển đổi thể tích khí ở điều kiện chuẩn: V = n × 24,79 (lít). Chú ý không dùng 22,4 L của quy chuẩn cũ.`,
      },
      {
        kind: 'compute',
        title: 'Tính toán',
        body: `V = ${molVal} × 24,79 = ${volume} (L).`,
      },
      {
        kind: 'answer',
        title: 'Kết luận',
        body: `Thể tích của ${molVal} mol [[${gasFormula}]] ở ĐKC là ${volume} lít.`,
      },
    ],
    finalSolution: `V = n × 24,79 = ${molVal} × 24,79 = ${volume} L.`,
    commonMistakes: [
      {
        id: 'used-old-standard-22.4',
        message: 'Bạn đang dùng nhầm số 22,4 L của điều kiện tiêu chuẩn cũ (0 °C, 1 atm). SGK mới dùng ĐKC là 24,79 L.',
        trapAnswers: [`${oldVolumeTrap}`],
      },
    ],
  };
}

export function generateMolFromGasVolumeExercise(
  gasFormula = 'O2',
  gasNameVi = 'oxygen',
  volume = 4.958,
  idSuffix = '002'
): Exercise {
  const mol = Math.round((volume / 24.79) * 1000) / 1000;
  const oldMolTrap = Math.round((volume / 22.4) * 1000) / 1000;

  return {
    id: `g8-b03-gen-gas-mol-${idSuffix}`,
    lessonId: 'g8-b03',
    skillIds: ['gas-volume-calc'],
    difficulty: 1,
    prompt: `Một bình kín chứa ${volume} lít [[${gasFormula}]] (${gasNameVi}) ở điều kiện chuẩn (25 °C, 1 bar). Hãy tính số mol khí có trong bình.`,
    given: [{ label: `Thể tích chất khí ở ĐKC (V)`, value: `${volume}`, unit: 'L' }],
    find: { label: `Số mol chất khí (n)`, unit: 'mol' },
    knowledge: ['formula.gas-volume'],
    answer: {
      kind: 'number',
      value: mol,
      unit: 'mol',
      decimals: 3,
      tolerance: { abs: 0.01 },
    },
    hints: [
      { level: 1, text: 'Từ công thức V = n × 24,79, hãy suy ra công thức tính số mol n.' },
      { level: 2, text: `Công thức: n = V / 24,79 = ${volume} / 24,79.` },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Đọc dữ kiện',
        body: `Đề cho thể tích V = ${volume} L ở ĐKC, cần tìm số mol n.`,
      },
      {
        kind: 'knowledge',
        title: 'Công thức áp dụng',
        body: `Áp dụng công thức: n = V / 24,79.`,
      },
      {
        kind: 'compute',
        title: 'Thực hiện phép chia',
        body: `n = ${volume} / 24,79 = ${mol} mol.`,
      },
      {
        kind: 'answer',
        title: 'Kết luận',
        body: `Số mol của ${volume} L [[${gasFormula}]] ở ĐKC là ${mol} mol.`,
      },
    ],
    finalSolution: `n = V / 24,79 = ${volume} / 24,79 = ${mol} mol.`,
    commonMistakes: [
      {
        id: 'divided-by-22.4',
        message: 'Bạn đã chia cho 22,4 (chuẩn cũ). Hãy chia cho 24,79 theo quy chuẩn mới.',
        trapAnswers: [`${oldMolTrap}`],
      },
    ],
  };
}
