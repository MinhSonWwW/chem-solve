import { Exercise } from '@/content/schema';

export function generateMetalAcidStoichiometry(
  metal = 'Fe',
  metalName = 'sắt',
  metalMolarMass = 56,
  metalMass = 5.6,
  idSuffix = '001'
): Exercise {
  // Reaction: Fe + 2HCl -> FeCl2 + H2
  // 1 mol Fe -> 1 mol H2
  const molMetal = Math.round((metalMass / metalMolarMass) * 1000) / 1000; // 0.1 mol
  const molH2 = molMetal;
  const volH2 = Math.round(molH2 * 24.79 * 100) / 100; // 2.479 L -> 2.48 L
  const trapOldVol = Math.round(molH2 * 22.4 * 100) / 100;

  return {
    id: `g8-b06-gen-stoich-${idSuffix}`,
    lessonId: 'g8-b06',
    skillIds: ['stoichiometry-calc'],
    difficulty: 2,
    prompt: `Cho ${metalMass} g [[${metal}]] (${metalName}) phản ứng hoàn toàn với dung dịch acid [[HCl]] dư theo phương trình: [[${metal}]] + 2[[HCl]] -> [[${metal}Cl2]] + [[H2]]. Tính thể tích khí [[H2]] thoát ra ở điều kiện chuẩn (25 °C, 1 bar). Cho M(${metal}) = ${metalMolarMass} g/mol.`,
    given: [
      { label: `Khối lượng kim loại (m_${metal})`, value: `${metalMass}`, unit: 'g' },
      { label: `Khối lượng mol của ${metal}`, value: `${metalMolarMass}`, unit: 'g/mol' },
      { label: `Phương trình phản ứng`, value: `${metal} + 2HCl -> ${metal}Cl2 + H2` },
    ],
    find: { label: `Thể tích khí H2 ở ĐKC (V_H2)`, unit: 'L' },
    knowledge: ['formula.mol-from-mass', 'formula.gas-volume'],
    answer: {
      kind: 'number',
      value: volH2,
      unit: 'L',
      decimals: 3,
      tolerance: { abs: 0.05 },
    },
    hints: [
      {
        level: 1,
        text: `Bước 1: Tính số mol của ${metal} (n = m / M). Bước 2: Dựa vào PTHH tìm số mol khí H2. Bước 3: Tính thể tích khí H2 ở ĐKC (V = n × 24,79).`,
      },
      {
        level: 2,
        text: `n_${metal} = ${metalMass} / ${metalMolarMass} = ${molMetal} mol. Tỉ lệ mol ${metal} : H2 là 1 : 1 => n_H2 = ${molH2} mol. V_H2 = ${molH2} × 24,79 = ${volH2} L.`,
      },
    ],
    steps: [
      {
        kind: 'compute',
        title: 'Bước 1: Tính số mol kim loại đã phản ứng',
        body: `n_${metal} = m_${metal} / M_${metal} = ${metalMass} / ${metalMolarMass} = ${molMetal} mol.`,
      },
      {
        kind: 'equation',
        title: 'Bước 2: Dựa vào tỉ lệ phương trình hóa học',
        body: `Phương trình phản ứng: [[${metal}]] + 2[[HCl]] -> [[${metal}Cl2]] + [[H2]]\nTheo PTHH: n_{H2} = n_{${metal}} = ${molMetal} mol.`,
      },
      {
        kind: 'compute',
        title: 'Bước 3: Tính thể tích khí hiđro ở điều kiện chuẩn',
        body: `V_{H2} = n_{H2} × 24,79 = ${molH2} × 24,79 = ${volH2} (lít).`,
      },
      {
        kind: 'answer',
        title: 'Kết luận',
        body: `Thể tích khí hiđro thu được ở ĐKC là ${volH2} L.`,
      },
    ],
    finalSolution: `n_${metal} = ${molMetal} mol => n_H2 = ${molH2} mol => V_H2 = ${molH2} × 24,79 = ${volH2} L.`,
    commonMistakes: [
      {
        id: 'used-old-standard-22.4',
        message: 'Lưu ý nhân với 24,79 (ĐKC theo SGK KNTT mới) chứ không phải 22,4.',
        trapAnswers: [`${trapOldVol}`],
      },
    ],
  };
}
