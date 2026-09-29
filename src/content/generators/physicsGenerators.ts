import type { Exercise } from '@/content/schema';

/**
 * Generates an exercise calculating speed, distance, or time (v = s / t)
 */
export function generateSpeedExercise(idSuffix: string): Exercise {
  const speeds = [30, 36, 40, 45, 54, 60, 72]; // km/h
  const times = [0.5, 1, 1.5, 2, 2.5]; // h
  const v = speeds[Math.floor(Math.random() * speeds.length)];
  const t = times[Math.floor(Math.random() * times.length)];
  const s = Math.round(v * t * 10) / 10;

  return {
    id: `phy-gen-speed-${idSuffix}`,
    lessonId: 'phy-g7-b08',
    skillIds: ['speed-calc', 'mechanics'],
    difficulty: 1,
    prompt: `Một xe ô tô chuyển động đều trên quãng đường thẳng dài ${s} km trong thời gian ${t} giờ. Hãy tính tốc độ chuyển động của xe ô tô (theo đơn vị km/h).`,
    given: [
      { label: 'Quãng đường (s)', value: `${s}`, unit: 'km' },
      { label: 'Thời gian (t)', value: `${t}`, unit: 'h' },
    ],
    find: { label: 'Tốc độ (v)', unit: 'km/h' },
    knowledge: ['formula.speed'],
    answer: {
      kind: 'number',
      value: v,
      unit: 'km/h',
      decimals: 1,
      tolerance: { abs: 0.1 },
    },
    hints: [
      { level: 1, text: 'Áp dụng công thức tính tốc độ trong chuyển động đều liên hệ giữa quãng đường s và thời gian t.' },
      { level: 2, text: `Công thức: v = s / t = ${s} / ${t}.` },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Nhận dạng bài toán',
        body: `Bài toán cho biết quãng đường s = ${s} km và thời gian t = ${t} h, yêu cầu tính tốc độ v (km/h).`,
      },
      {
        kind: 'equation',
        title: 'Áp dụng công thức',
        body: `Áp dụng công thức: v = s / t = ${s} / ${t} = ${v} km/h.`,
      },
      {
        kind: 'compute',
        title: 'Kết luận',
        body: `Tốc độ của xe ô tô là ${v} km/h.`,
      },
    ],
    finalSolution: `v = s / t = ${s} / ${t} = ${v} km/h.`,
    commonMistakes: [
      {
        id: 'inverted-speed',
        message: 'Nhầm lẫn lấy thời gian chia cho quãng đường hoặc nhân thời gian với quãng đường.',
        trapAnswers: [`${Math.round((t / s) * 100) / 100}`, `${Math.round(s * t * 100) / 100}`],
      },
    ],
  };
}

/**
 * Generates an exercise calculating density or weight (D = m / V, P = 10m)
 */
export function generateDensityExercise(idSuffix: string): Exercise {
  const materials = [
    { name: 'nhôm', D: 2700 },
    { name: 'sắt', D: 7800 },
    { name: 'đồng', D: 8900 },
    { name: 'chì', D: 11300 },
  ];
  const mat = materials[Math.floor(Math.random() * materials.length)];
  const volumes = [0.001, 0.002, 0.004, 0.005]; // m3
  const V = volumes[Math.floor(Math.random() * volumes.length)];
  const m = Math.round(mat.D * V * 10) / 10;

  return {
    id: `phy-gen-density-${idSuffix}`,
    lessonId: 'phy-g8-b13',
    skillIds: ['density-calc', 'mechanics'],
    difficulty: 1,
    prompt: `Một khối kim loại bằng ${mat.name} có thể tích V = ${V} m³ và khối lượng m = ${m} kg. Hãy tính khối lượng riêng của khối ${mat.name} đó (theo đơn vị kg/m³).`,
    given: [
      { label: `Khối lượng ${mat.name} (m)`, value: `${m}`, unit: 'kg' },
      { label: 'Thể tích (V)', value: `${V}`, unit: 'm³' },
    ],
    find: { label: 'Khối lượng riêng (D)', unit: 'kg/m³' },
    knowledge: ['formula.density'],
    answer: {
      kind: 'number',
      value: mat.D,
      unit: 'kg/m³',
      decimals: 0,
      tolerance: { abs: 5 },
    },
    hints: [
      { level: 1, text: 'Áp dụng công thức tính khối lượng riêng của vật theo khối lượng và thể tích.' },
      { level: 2, text: `Công thức: D = m / V = ${m} / ${V}.` },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Xác định đại lượng',
        body: `Vật có khối lượng m = ${m} kg và thể tích V = ${V} m³.`,
      },
      {
        kind: 'equation',
        title: 'Tính khối lượng riêng',
        body: `Áp dụng công thức: D = m / V = ${m} / ${V} = ${mat.D} kg/m³.`,
      },
      {
        kind: 'compute',
        title: 'Kết luận',
        body: `Khối lượng riêng của khối ${mat.name} là ${mat.D} kg/m³.`,
      },
    ],
    finalSolution: `D = m / V = ${m} / ${V} = ${mat.D} kg/m³.`,
    commonMistakes: [
      {
        id: 'inverted-density',
        message: 'Nhầm lẫn lấy thể tích chia cho khối lượng thay vì m chia V.',
        trapAnswers: [`${Math.round((V / m) * 1000) / 1000}`],
      },
    ],
  };
}

/**
 * Generates an exercise calculating pressure (p = F / S)
 */
export function generatePressureExercise(idSuffix: string): Exercise {
  const forces = [60, 100, 120, 200, 300, 500]; // N
  const areas = [0.1, 0.2, 0.5, 1.0, 2.0]; // m2
  const F = forces[Math.floor(Math.random() * forces.length)];
  const S = areas[Math.floor(Math.random() * areas.length)];
  const p = Math.round(F / S);

  return {
    id: `phy-gen-pressure-${idSuffix}`,
    lessonId: 'phy-g8-b14',
    skillIds: ['pressure-calc', 'mechanics'],
    difficulty: 1,
    prompt: `Một áp lực F = ${F} N tác dụng vuông góc lên một mặt phẳng có diện tích bị ép S = ${S} m². Hãy tính áp suất p tác dụng lên mặt phẳng này (theo đơn vị Pascal hoặc N/m²).`,
    given: [
      { label: 'Áp lực (F)', value: `${F}`, unit: 'N' },
      { label: 'Diện tích bị ép (S)', value: `${S}`, unit: 'm²' },
    ],
    find: { label: 'Áp suất (p)', unit: 'Pa' },
    knowledge: ['formula.pressure'],
    answer: {
      kind: 'number',
      value: p,
      unit: 'Pa',
      decimals: 1,
      tolerance: { abs: 0.5 },
    },
    hints: [
      { level: 1, text: 'Áp dụng công thức tính áp suất chất rắn từ áp lực và diện tích bị ép.' },
      { level: 2, text: `Công thức: p = F / S = ${F} / ${S}.` },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Xác định bài toán',
        body: `Áp lực tác dụng F = ${F} N lên diện tích S = ${S} m².`,
      },
      {
        kind: 'equation',
        title: 'Áp dụng công thức',
        body: `p = F / S = ${F} / ${S} = ${p} Pa.`,
      },
      {
        kind: 'compute',
        title: 'Kết luận',
        body: `Áp suất tác dụng lên mặt phẳng là ${p} Pa.`,
      },
    ],
    finalSolution: `p = F / S = ${F} / ${S} = ${p} Pa.`,
    commonMistakes: [
      {
        id: 'inverted-pressure',
        message: 'Nhầm lẫn lấy diện tích chia cho áp lực hoặc nhân F với S.',
        trapAnswers: [`${Math.round((S / F) * 1000) / 1000}`, `${F * S}`],
      },
    ],
  };
}

/**
 * Generates an exercise calculating mechanical work or energy (A = F * s, W_t = P * h)
 */
export function generateEnergyExercise(idSuffix: string): Exercise {
  const forces = [20, 40, 50, 80, 100, 150]; // N
  const distances = [2, 3, 4, 5, 8, 10]; // m
  const F = forces[Math.floor(Math.random() * forces.length)];
  const s = distances[Math.floor(Math.random() * distances.length)];
  const A = F * s;

  return {
    id: `phy-gen-energy-${idSuffix}`,
    lessonId: 'phy-g8-b17',
    skillIds: ['work-energy-calc', 'mechanics'],
    difficulty: 1,
    prompt: `Một người dùng lực kéo F = ${F} N tác dụng lên một vật làm vật dịch chuyển một quãng đường s = ${s} m theo phương của lực. Hãy tính công cơ học A mà người đó đã thực hiện (theo đơn vị Joule).`,
    given: [
      { label: 'Lực tác dụng (F)', value: `${F}`, unit: 'N' },
      { label: 'Quãng đường dịch chuyển (s)', value: `${s}`, unit: 'm' },
    ],
    find: { label: 'Công cơ học (A)', unit: 'J' },
    knowledge: ['formula.work'],
    answer: {
      kind: 'number',
      value: A,
      unit: 'J',
      decimals: 0,
      tolerance: { abs: 0 },
    },
    hints: [
      { level: 1, text: 'Áp dụng công thức tính công cơ học khi lực cùng phương với phương chuyển động.' },
      { level: 2, text: `Công thức: A = F × s = ${F} × ${s}.` },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Nhận diện bài toán',
        body: `Lực tác dụng F = ${F} N và quãng đường s = ${s} m cùng phương.`,
      },
      {
        kind: 'equation',
        title: 'Áp dụng công thức tính công',
        body: `A = F × s = ${F} × ${s} = ${A} J.`,
      },
      {
        kind: 'compute',
        title: 'Kết luận',
        body: `Công cơ học thực hiện được là ${A} J.`,
      },
    ],
    finalSolution: `A = F × s = ${F} × ${s} = ${A} J.`,
    commonMistakes: [
      {
        id: 'divided-work',
        message: 'Nhầm lẫn lấy lực chia cho quãng đường thay vì nhân F với s.',
        trapAnswers: [`${Math.round((F / s) * 10) / 10}`],
      },
    ],
  };
}

/**
 * Generates an exercise calculating Ohm's law (I = U / R)
 */
export function generateOhmExercise(idSuffix: string): Exercise {
  const voltages = [6, 9, 12, 18, 24]; // V
  const resistances = [3, 4, 6, 8, 12]; // Ohm
  const U = voltages[Math.floor(Math.random() * voltages.length)];
  const R = resistances[Math.floor(Math.random() * resistances.length)];
  const I = Math.round((U / R) * 100) / 100;

  return {
    id: `phy-gen-ohm-${idSuffix}`,
    lessonId: 'phy-g9-b08',
    skillIds: ['ohm-law', 'electricity'],
    difficulty: 1,
    prompt: `Đặt một hiệu điện thế U = ${U} V vào hai đầu dây dẫn có điện trở R = ${R} Ω. Hãy tính cường độ dòng điện I chạy qua dây dẫn này (theo đơn vị Ampe).`,
    given: [
      { label: 'Hiệu điện thế (U)', value: `${U}`, unit: 'V' },
      { label: 'Điện trở (R)', value: `${R}`, unit: 'Ω' },
    ],
    find: { label: 'Cường độ dòng điện (I)', unit: 'A' },
    knowledge: ['formula.ohm'],
    answer: {
      kind: 'number',
      value: I,
      unit: 'A',
      decimals: 2,
      tolerance: { abs: 0.05 },
    },
    hints: [
      { level: 1, text: 'Áp dụng hệ thức định luật Ôm cho đoạn mạch chứa điện trở.' },
      { level: 2, text: `Công thức: I = U / R = ${U} / ${R}.` },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Nhận dạng bài toán',
        body: `Hiệu điện thế U = ${U} V, điện trở R = ${R} Ω.`,
      },
      {
        kind: 'equation',
        title: 'Áp dụng định luật Ôm',
        body: `I = U / R = ${U} / ${R} = ${I} A.`,
      },
      {
        kind: 'compute',
        title: 'Kết luận',
        body: `Cường độ dòng điện qua dây dẫn là ${I} A.`,
      },
    ],
    finalSolution: `I = U / R = ${U} / ${R} = ${I} A.`,
    commonMistakes: [
      {
        id: 'inverted-ohm',
        message: 'Nhầm lẫn lấy điện trở chia cho hiệu điện thế thay vì U chia R.',
        trapAnswers: [`${Math.round((R / U) * 100) / 100}`],
      },
    ],
  };
}

/**
 * Main dispatch for physics generators
 */
export function generatePhysicsDynamicExercises(topicId: string): Exercise[] {
  const now = Date.now();
  if (topicId === 'phy-gen-speed') {
    return [
      generateSpeedExercise(`${now}-1`),
      generateSpeedExercise(`${now}-2`),
      generateSpeedExercise(`${now}-3`),
      generateSpeedExercise(`${now}-4`),
      generateSpeedExercise(`${now}-5`),
    ];
  }
  if (topicId === 'phy-gen-density') {
    return [
      generateDensityExercise(`${now}-1`),
      generateDensityExercise(`${now}-2`),
      generateDensityExercise(`${now}-3`),
      generateDensityExercise(`${now}-4`),
      generateDensityExercise(`${now}-5`),
    ];
  }
  if (topicId === 'phy-gen-pressure') {
    return [
      generatePressureExercise(`${now}-1`),
      generatePressureExercise(`${now}-2`),
      generatePressureExercise(`${now}-3`),
      generatePressureExercise(`${now}-4`),
      generatePressureExercise(`${now}-5`),
    ];
  }
  if (topicId === 'phy-gen-energy') {
    return [
      generateEnergyExercise(`${now}-1`),
      generateEnergyExercise(`${now}-2`),
      generateEnergyExercise(`${now}-3`),
      generateEnergyExercise(`${now}-4`),
      generateEnergyExercise(`${now}-5`),
    ];
  }
  if (topicId === 'phy-gen-ohm') {
    return [
      generateOhmExercise(`${now}-1`),
      generateOhmExercise(`${now}-2`),
      generateOhmExercise(`${now}-3`),
      generateOhmExercise(`${now}-4`),
      generateOhmExercise(`${now}-5`),
    ];
  }

  // phy-gen-infinite (Mix 5 topics)
  return [
    generateSpeedExercise(`${now}-1`),
    generateDensityExercise(`${now}-2`),
    generatePressureExercise(`${now}-3`),
    generateEnergyExercise(`${now}-4`),
    generateOhmExercise(`${now}-5`),
  ];
}
