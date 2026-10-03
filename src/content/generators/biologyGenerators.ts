import type { Exercise } from '@/content/schema';

/**
 * Generates an exercise calculating the number of cells after n divisions (N = N0 * 2^n)
 */
export function generateCellDivisionExercise(idSuffix: string): Exercise {
  const initialCells = [1, 2, 3, 5, 10];
  const divisions = [2, 3, 4, 5];
  const n0 = initialCells[Math.floor(Math.random() * initialCells.length)];
  const n = divisions[Math.floor(Math.random() * divisions.length)];
  const total = n0 * Math.pow(2, n);

  return {
    id: `bio-gen-division-${idSuffix}`,
    lessonId: 'bio-g6-b04',
    skillIds: ['bio-te-bao-lon-len-phan-chia'],
    difficulty: 1,
    prompt: `Từ ${n0} tế bào ban đầu, sau ${n} lần phân chia liên tiếp thì số lượng tế bào con tạo thành là bao nhiêu?`,
    given: [
      { label: 'Số tế bào ban đầu (N₀)', value: `${n0}`, unit: 'tế bào' },
      { label: 'Số lần phân chia (n)', value: `${n}`, unit: 'lần' },
    ],
    find: { label: 'Tổng số tế bào con (N)', unit: 'tế bào' },
    knowledge: ['bio-su-phan-chia-te-bao'],
    answer: {
      kind: 'number',
      value: total,
      unit: 'tế bào',
      decimals: 0,
      tolerance: { abs: 0 },
    },
    hints: [
      {
        level: 1,
        text: 'Cứ 1 tế bào phân chia 1 lần tạo thành 2 tế bào con.',
      },
      {
        level: 2,
        text: `Áp dụng công thức số tế bào con sau n lần phân chia: N = N₀ × 2ⁿ = ${n0} × 2^${n}.`,
      },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Xác định bài toán',
        body: `Số tế bào ban đầu N₀ = ${n0}, số lần phân chia liên tiếp n = ${n}.`,
      },
      {
        kind: 'equation',
        title: 'Áp dụng công thức phân bào',
        body: `Công thức: N = N₀ × 2ⁿ = ${n0} × 2^${n} = ${n0} × ${Math.pow(2, n)} = ${total} tế bào.`,
      },
      {
        kind: 'compute',
        title: 'Kết luận',
        body: `Số lượng tế bào con tạo thành là ${total} tế bào.`,
      },
    ],
    finalSolution: `N = N₀ × 2ⁿ = ${n0} × 2^${n} = ${total} tế bào.`,
    commonMistakes: [
      {
        id: 'linear-multiplication',
        message: 'Lấy số tế bào nhân với số lần phân chia thay vì tính theo lũy thừa 2.',
        trapAnswers: [`${n0 * n}`, `${n0 * 2 * n}`],
      },
    ],
  };
}

/**
 * Generates an exercise calculating the magnification of an optical microscope (M = M_ocular * M_objective)
 */
export function generateMicroscopeMagnificationExercise(idSuffix: string): Exercise {
  const oculars = [10, 15, 20]; // Thị kính (10x, 15x, 20x)
  const objectives = [10, 20, 40, 100]; // Vật kính (10x, 20x, 40x, 100x)
  const oc = oculars[Math.floor(Math.random() * oculars.length)];
  const obj = objectives[Math.floor(Math.random() * objectives.length)];
  const mag = oc * obj;

  return {
    id: `bio-gen-microscope-${idSuffix}`,
    lessonId: 'bio-g6-b03',
    skillIds: ['bio-thuc-hanh-soi-te-bao'],
    difficulty: 1,
    prompt: `Khi quan sát tiêu bản tế bào thực vật dưới kính hiển vi quang học với thị kính có độ phóng đại ${oc}x và vật kính có độ phóng đại ${obj}x, độ phóng đại tổng cộng của hình ảnh thu được là bao nhiêu lần?`,
    given: [
      { label: 'Độ phóng đại thị kính', value: `${oc}`, unit: 'lần' },
      { label: 'Độ phóng đại vật kính', value: `${obj}`, unit: 'lần' },
    ],
    find: { label: 'Độ phóng đại tổng cộng', unit: 'lần' },
    knowledge: ['bio-thuc-hanh-kinh-hien-vi'],
    answer: {
      kind: 'number',
      value: mag,
      unit: 'lần',
      decimals: 0,
      tolerance: { abs: 0 },
    },
    hints: [
      {
        level: 1,
        text: 'Độ phóng đại của kính hiển vi là tích số giữa độ phóng đại của thị kính và vật kính.',
      },
      {
        level: 2,
        text: `Độ phóng đại = Độ phóng đại thị kính × Độ phóng đại vật kính = ${oc} × ${obj}.`,
      },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Mục tiêu bài toán',
        body: `Thị kính phóng đại ${oc}x, vật kính phóng đại ${obj}x. Tính độ phóng đại của ảnh hiển vi.`,
      },
      {
        kind: 'equation',
        title: 'Công thức độ phóng đại kính hiển vi',
        body: `Độ phóng đại = ${oc} × ${obj} = ${mag} lần.`,
      },
      {
        kind: 'compute',
        title: 'Kết luận',
        body: `Hình ảnh tế bào được phóng đại lên ${mag} lần.`,
      },
    ],
    finalSolution: `Độ phóng đại tổng cộng = ${oc} × ${obj} = ${mag} lần.`,
    commonMistakes: [
      {
        id: 'addition-magnification',
        message: 'Lấy độ phóng đại thị kính cộng với vật kính thay vì nhân với nhau.',
        trapAnswers: [`${oc + obj}`],
      },
    ],
  };
}

/**
 * Generates an exercise calculating the daily required water intake (V = m * 40 mL)
 * (SGK KHTN 7 Kết nối tri thức - Bài 29: Nhu cầu nước của một người khoảng 40 mL/kg thể trọng mỗi ngày)
 */
export function generateWaterIntakeExercise(idSuffix: string): Exercise {
  const bodyMasses = [35, 40, 45, 48, 50, 52, 55, 60, 65];
  const m = bodyMasses[Math.floor(Math.random() * bodyMasses.length)];
  const vMl = m * 40;

  return {
    id: `bio-gen-water-${idSuffix}`,
    lessonId: 'bio-g7-b09',
    skillIds: ['bio-vai-tro-nuoc-dinh-duong'],
    difficulty: 1,
    prompt: `Theo khuyến nghị dinh dưỡng cho người bình thường (cần khoảng 40 mL nước cho mỗi kilôgam trọng lượng cơ thể mỗi ngày), một bạn học sinh nặng ${m} kg thì lượng nước tối thiểu cần cung cấp cho cơ thể trong một ngày là bao nhiêu mL?`,
    given: [
      { label: 'Khối lượng cơ thể (m)', value: `${m}`, unit: 'kg' },
      { label: 'Nhu cầu nước tiêu chuẩn', value: '40', unit: 'mL/kg/ngày' },
    ],
    find: { label: 'Lượng nước cơ thể cần (V)', unit: 'mL' },
    knowledge: ['kb-bio-g7-nhu-cau-nuoc'],
    answer: {
      kind: 'number',
      value: vMl,
      unit: 'mL',
      decimals: 0,
      tolerance: { abs: 0 },
    },
    hints: [
      {
        level: 1,
        text: 'Nhu cầu nước mỗi ngày được tính bằng khối lượng cơ thể nhân với định mức 40 mL/kg.',
      },
      {
        level: 2,
        text: `Áp dụng công thức: V = m × 40 = ${m} × 40.`,
      },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Xác định bài toán',
        body: `Khối lượng cơ thể m = ${m} kg. Định mức nước cần thiết là 40 mL/kg/ngày.`,
      },
      {
        kind: 'equation',
        title: 'Áp dụng công thức tính lượng nước',
        body: `V = m × 40 = ${m} × 40 = ${vMl} mL (tương đương ${(vMl / 1000).toFixed(2)} lít).`,
      },
      {
        kind: 'compute',
        title: 'Kết luận',
        body: `Học sinh này cần uống khoảng ${vMl} mL nước mỗi ngày để đảm bảo hoạt động sinh lý tối ưu.`,
      },
    ],
    finalSolution: `V = m × 40 = ${m} × 40 = ${vMl} mL.`,
    commonMistakes: [
      {
        id: 'addition-mistake',
        message: 'Lấy khối lượng cộng với 40 thay vì làm phép nhân.',
        trapAnswers: [`${m + 40}`],
      },
      {
        id: 'division-mistake',
        message: 'Lấy khối lượng chia cho 40.',
        trapAnswers: [`${(m / 40).toFixed(1)}`],
      },
    ],
  };
}

/**
 * Generates an exercise calculating total dietary calories (Energy = 4*Protein + 4*Carb + 9*Lipid)
 */
export function generateDietaryCaloriesExercise(idSuffix: string): Exercise {
  const proteins = [40, 50, 60, 70, 80];
  const lipids = [20, 30, 40, 50];
  const carbs = [200, 250, 300, 350, 400];

  const p = proteins[Math.floor(Math.random() * proteins.length)];
  const l = lipids[Math.floor(Math.random() * lipids.length)];
  const c = carbs[Math.floor(Math.random() * carbs.length)];
  const totalCalories = 4 * p + 4 * c + 9 * l;

  return {
    id: `bio-gen-calories-${idSuffix}`,
    lessonId: 'bio-g8-b03',
    skillIds: ['bio-dinh-duong-tieu-hoa'],
    difficulty: 2,
    prompt: `Một khẩu phần ăn trong ngày của học sinh lớp 8 chứa ${p} g protein, ${l} g lipid và ${c} g carbohydrate. Biết 1 g protein giải phóng 4 kcal, 1 g carbohydrate giải phóng 4 kcal, 1 g lipid giải phóng 9 kcal. Tính tổng năng lượng (kcal) mà khẩu phần ăn này cung cấp cho cơ thể?`,
    given: [
      { label: 'Khối lượng Protein (m_P)', value: `${p}`, unit: 'g' },
      { label: 'Khối lượng Lipid (m_L)', value: `${l}`, unit: 'g' },
      { label: 'Khối lượng Carbohydrate (m_C)', value: `${c}`, unit: 'g' },
    ],
    find: { label: 'Tổng năng lượng (E)', unit: 'kcal' },
    knowledge: ['kb-bio-g8-nhom-chat-dinh-duong'],
    answer: {
      kind: 'number',
      value: totalCalories,
      unit: 'kcal',
      decimals: 0,
      tolerance: { abs: 0 },
    },
    hints: [
      {
        level: 1,
        text: 'Năng lượng từ Protein và Carb đều là 4 kcal/g; năng lượng từ Lipid là 9 kcal/g.',
      },
      {
        level: 2,
        text: `Công thức: E = 4 × m_P + 4 × m_C + 9 × m_L = 4 × ${p} + 4 × ${c} + 9 × ${l}.`,
      },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Xác định bài toán',
        body: `Protein: ${p} g, Carbohydrate: ${c} g, Lipid: ${l} g.`,
      },
      {
        kind: 'equation',
        title: 'Áp dụng công thức tính năng lượng calo',
        body: `E = 4 × m_P + 4 × m_C + 9 × m_L = 4 × ${p} + 4 × ${c} + 9 × ${l} = ${4 * p} + ${4 * c} + ${9 * l} = ${totalCalories} kcal.`,
      },
      {
        kind: 'compute',
        title: 'Kết luận',
        body: `Tổng năng lượng mà khẩu phần ăn cung cấp là ${totalCalories} kcal.`,
      },
    ],
    finalSolution: `E = 4 × ${p} + 4 × ${c} + 9 × ${l} = ${totalCalories} kcal.`,
    commonMistakes: [
      {
        id: 'equal-calorie-mistake',
        message: 'Tính tất cả các chất đều nhân 4 kcal/g (quên lipid nhân 9).',
        trapAnswers: [`${4 * (p + l + c)}`],
      },
    ],
  };
}

/**
 * Generates an exercise calculating population density (D = N / S)
 */
export function generatePopulationDensityExercise(idSuffix: string): Exercise {
  const scenarios = [
    { name: 'rừng thông', unitObj: 'cây thông', area: 5, total: 2500, areaUnit: 'ha', densityUnit: 'cây/ha' },
    { name: 'ruộng lúa', unitObj: 'cây lúa', area: 2, total: 80, areaUnit: 'm²', densityUnit: 'cây/m²' },
    { name: 'ao cá chép', unitObj: 'con cá', area: 400, total: 1600, areaUnit: 'm²', densityUnit: 'con/m²' },
    { name: 'vườn cam', unitObj: 'cây cam', area: 4, total: 1200, areaUnit: 'ha', densityUnit: 'cây/ha' },
    { name: 'bãi cỏ thảo nguyên', unitObj: 'con ngựa vằn', area: 10, total: 350, areaUnit: 'ha', densityUnit: 'con/ha' },
  ];

  const sc = scenarios[Math.floor(Math.random() * scenarios.length)];
  const density = sc.total / sc.area;

  return {
    id: `bio-gen-density-${idSuffix}`,
    lessonId: 'bio-g8-b13',
    skillIds: ['bio-quan-the-sinh-vat'],
    difficulty: 1,
    prompt: `Trong một quần thể ${sc.name}, người ta đếm được tổng cộng ${sc.total} ${sc.unitObj} sinh sống trên diện tích ${sc.area} ${sc.areaUnit}. Mật độ cá thể của quần thể này là bao nhiêu?`,
    given: [
      { label: `Số lượng cá thể (N)`, value: `${sc.total}`, unit: sc.unitObj },
      { label: `Diện tích sinh cảnh (S)`, value: `${sc.area}`, unit: sc.areaUnit },
    ],
    find: { label: 'Mật độ cá thể (D)', unit: sc.densityUnit },
    knowledge: ['kb-bio-g8-mat-do-quan-the'],
    answer: {
      kind: 'number',
      value: density,
      unit: sc.densityUnit,
      decimals: 0,
      tolerance: { abs: 0 },
    },
    hints: [
      {
        level: 1,
        text: 'Mật độ cá thể là số lượng cá thể trên một đơn vị diện tích hoặc thể tích.',
      },
      {
        level: 2,
        text: `Công thức tính: D = N / S = ${sc.total} / ${sc.area}.`,
      },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Xác định bài toán',
        body: `Số lượng cá thể N = ${sc.total} ${sc.unitObj}, diện tích phân bố S = ${sc.area} ${sc.areaUnit}.`,
      },
      {
        kind: 'equation',
        title: 'Áp dụng công thức tính mật độ cá thể',
        body: `D = N / S = ${sc.total} / ${sc.area} = ${density} ${sc.densityUnit}.`,
      },
      {
        kind: 'compute',
        title: 'Kết luận',
        body: `Mật độ cá thể của quần thể là ${density} ${sc.densityUnit}.`,
      },
    ],
    finalSolution: `D = N / S = ${sc.total} / ${sc.area} = ${density} ${sc.densityUnit}.`,
    commonMistakes: [
      {
        id: 'multiplication-mistake',
        message: 'Lấy số cá thể nhân với diện tích thay vì làm phép chia.',
        trapAnswers: [`${sc.total * sc.area}`],
      },
    ],
  };
}

/**
 * Generates an exercise on safe ABO blood transfusion (counting compatible donors)
 */
export function generateBloodTransfusionExercise(idSuffix: string): Exercise {
  const bloodTypes = ['O', 'A', 'B', 'AB'] as const;
  const recipient = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];

  // Compatible donors rule for recipient:
  // Recipient O: receives O
  // Recipient A: receives O, A
  // Recipient B: receives O, B
  // Recipient AB: receives O, A, B, AB
  const isCompatible = (donor: string, rec: string): boolean => {
    if (donor === 'O') return true;
    if (rec === 'AB') return true;
    return donor === rec;
  };

  // Generate 6 donors
  const donors: string[] = [];
  for (let i = 0; i < 6; i++) {
    donors.push(bloodTypes[Math.floor(Math.random() * bloodTypes.length)]);
  }

  const compatibleCount = donors.filter((d) => isCompatible(d, recipient)).length;

  return {
    id: `bio-gen-blood-${idSuffix}`,
    lessonId: 'bio-g8-b04',
    skillIds: ['bio-mau-tuan-hoan'],
    difficulty: 2,
    prompt: `Một bệnh nhân có nhóm máu ${recipient} đang cần truyền máu khẩn cấp tại bệnh viện. Có 6 người tình nguyện hiến máu với các nhóm máu lần lượt là: ${donors.join(', ')}. Theo nguyên tắc truyền máu an toàn hệ ABO (không để kháng nguyên người cho bị ngưng kết bởi kháng thể người nhận), có bao nhiêu người hiến máu có thể truyền an toàn cho bệnh nhân này?`,
    given: [
      { label: 'Nhóm máu người nhận', value: recipient },
      { label: 'Danh sách nhóm máu 6 người hiến', value: donors.join(', ') },
    ],
    find: { label: 'Số người hiến máu an toàn', unit: 'người' },
    knowledge: ['kb-bio-g8-nhom-mau-abo'],
    answer: {
      kind: 'number',
      value: compatibleCount,
      unit: 'người',
      decimals: 0,
      tolerance: { abs: 0 },
    },
    hints: [
      {
        level: 1,
        text: 'Nguyên tắc truyền máu hệ ABO: Người nhóm O là người cho phổ thông; người nhóm AB là người nhận phổ thông; nhóm A nhận được O và A; nhóm B nhận được O và B.',
      },
      {
        level: 2,
        text: `Bệnh nhân nhóm máu ${recipient} có thể nhận máu từ nhóm: ${
          recipient === 'O' ? 'O' : recipient === 'A' ? 'O, A' : recipient === 'B' ? 'O, B' : 'O, A, B, AB'
        }. Hãy đếm số người thỏa mãn trong danh sách.`,
      },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Xác định nhóm máu người nhận và nguyên tắc truyền máu',
        body: `Người nhận có nhóm máu ${recipient}. Để hồng cầu người cho không bị ngưng kết trong máu người nhận, nhóm ${recipient} nhận được máu từ các nhóm tương thích: ${
          recipient === 'O' ? 'chỉ nhóm O' : recipient === 'A' ? 'nhóm O và A' : recipient === 'B' ? 'nhóm O và B' : 'tất cả các nhóm O, A, B, AB'
        }.`,
      },
      {
        kind: 'equation',
        title: 'Đối chiếu danh sách người hiến',
        body: `Danh sách người hiến: [${donors.join(', ')}]. Các nhóm máu tương thích với người nhận ${recipient} là: [${donors.filter((d) => isCompatible(d, recipient)).join(', ')}].`,
      },
      {
        kind: 'compute',
        title: 'Kết luận',
        body: `Có tổng cộng ${compatibleCount} người có thể hiến máu an toàn cho bệnh nhân này.`,
      },
    ],
    finalSolution: `Bệnh nhân nhóm ${recipient} nhận được máu từ ${
      recipient === 'O' ? 'nhóm O' : recipient === 'A' ? 'nhóm O, A' : recipient === 'B' ? 'nhóm O, B' : 'nhóm O, A, B, AB'
    } → Có ${compatibleCount} người hiến máu an toàn.`,
    commonMistakes: [
      {
        id: 'universal-donor-confusion',
        message: 'Nghĩ rằng nhóm AB có thể cho tất cả mọi người (AB là người nhận phổ thông, O mới là người cho phổ thông).',
      },
    ],
  };
}

/**
 * Generates an exercise on Mendel inheritance rules (number of gametes, genotypes, phenotypes, Punnett square)
 */
export function generateMendelInheritanceExercise(idSuffix: string): Exercise {
  const modes = ['gametes', 'dihybrid-genotypes', 'testcross', 'gamete-combinations'] as const;
  const mode = modes[Math.floor(Math.random() * modes.length)];

  if (mode === 'gametes') {
    const geneOptions = [
      { genotype: 'AaBb', n: 2, desc: 'dị hợp 2 cặp gen (Aa, Bb)' },
      { genotype: 'AaBbDd', n: 3, desc: 'dị hợp 3 cặp gen (Aa, Bb, Dd)' },
      { genotype: 'AaBbDdEe', n: 4, desc: 'dị hợp 4 cặp gen (Aa, Bb, Dd, Ee)' },
      { genotype: 'AaBBDd', n: 2, desc: 'dị hợp 2 cặp gen (Aa, Dd) và đồng hợp 1 cặp (BB)' },
    ];
    const item = geneOptions[Math.floor(Math.random() * geneOptions.length)];
    const totalGametes = Math.pow(2, item.n);

    return {
      id: `bio-gen-mendel-${idSuffix}`,
      lessonId: 'bio-g9-b02',
      skillIds: ['bio9-quy-luat-mendel'],
      difficulty: 1,
      prompt: `Một cá thể sinh vật có kiểu gen ${item.genotype} (${item.desc}). Biết các gen phân li độc lập và giảm phân diễn ra bình thường không xảy ra đột biến. Số loại giao tử tối đa mà cá thể này có thể tạo ra là bao nhiêu?`,
      given: [
        { label: 'Kiểu gen cơ thể', value: item.genotype },
        { label: 'Số cặp gen dị hợp (n)', value: `${item.n}` },
      ],
      find: { label: 'Số loại giao tử tối đa', unit: 'loại' },
      knowledge: ['kb-bio-g9-phan-li-doc-lap', 'kb-bio-g9-phuong-phap-lai-mendel'],
      answer: {
        kind: 'number',
        value: totalGametes,
        unit: 'loại',
        decimals: 0,
        tolerance: { abs: 0 },
      },
      hints: [
        {
          level: 1,
          text: 'Mỗi cặp gen dị hợp khi giảm phân cho 2 loại giao tử; cặp gen đồng hợp chỉ cho 1 loại giao tử.',
        },
        {
          level: 2,
          text: `Áp dụng công thức số loại giao tử khi các cặp gen phân li độc lập: Số loại giao tử = 2ⁿ (với n là số cặp gen dị hợp). Ở đây n = ${item.n} → 2^${item.n}.`,
        },
      ],
      steps: [
        {
          kind: 'identify',
          title: 'Xác định số cặp gen dị hợp',
          body: `Cơ thể có kiểu gen ${item.genotype} gồm n = ${item.n} cặp gen dị hợp.`,
        },
        {
          kind: 'equation',
          title: 'Áp dụng quy tắc phân li độc lập Mendel',
          body: `Số loại giao tử = 2ⁿ = 2^${item.n} = ${totalGametes} loại giao tử.`,
        },
        {
          kind: 'compute',
          title: 'Kết luận',
          body: `Cá thể có kiểu gen ${item.genotype} có thể tạo ra tối đa ${totalGametes} loại giao tử khác nhau.`,
        },
      ],
      finalSolution: `Số loại giao tử = 2^${item.n} = ${totalGametes} loại giao tử.`,
      commonMistakes: [
        {
          id: 'linear-multiplication',
          message: 'Nhân đôi số cặp gen (lấy 2 × n) thay vì lũy thừa 2^n.',
          trapAnswers: [`${2 * item.n}`],
        },
      ],
    };
  }

  if (mode === 'dihybrid-genotypes') {
    return {
      id: `bio-gen-mendel-${idSuffix}`,
      lessonId: 'bio-g9-b02',
      skillIds: ['bio9-quy-luat-mendel'],
      difficulty: 2,
      prompt: `Ở đậu Hà Lan, cho giao phấn giữa hai cây F1 đều dị hợp hai cặp gen (P: AaBb × AaBb). Biết hai cặp gen nằm trên hai cặp NST tương đồng khác nhau và phân li độc lập. Đời con F2 thu được tối đa bao nhiêu loại kiểu gen khác nhau?`,
      given: [
        { label: 'Phép lai P', value: 'AaBb × AaBb' },
        { label: 'Đặc điểm di truyền', value: 'Phân li độc lập' },
      ],
      find: { label: 'Số loại kiểu gen ở F2', unit: 'loại' },
      knowledge: ['kb-bio-g9-phan-li-doc-lap', 'kb-bio-g9-dau-ha-lan-doi-tuong-nghien-cuu'],
      answer: {
        kind: 'number',
        value: 9,
        unit: 'loại',
        decimals: 0,
        tolerance: { abs: 0 },
      },
      hints: [
        {
          level: 1,
          text: 'Tách riêng từng cặp tính trạng: Phép lai Aa × Aa cho 3 loại kiểu gen (1AA : 2Aa : 1aa).',
        },
        {
          level: 2,
          text: 'Vì hai cặp gen phân li độc lập nên số loại kiểu gen chung bằng tích số loại kiểu gen của từng cặp riêng rẽ: 3 × 3 = 9 loại kiểu gen.',
        },
      ],
      steps: [
        {
          kind: 'identify',
          title: 'Phân tích từng cặp tính trạng riêng rẽ',
          body: 'Xét cặp A: Aa × Aa cho 3 loại kiểu gen (AA, Aa, aa). Xét cặp B: Bb × Bb cho 3 loại kiểu gen (BB, Bb, bb).',
        },
        {
          kind: 'equation',
          title: 'Nhân xác suất độc lập',
          body: 'Số loại kiểu gen F2 = 3 (cặp A) × 3 (cặp B) = 9 loại kiểu gen.',
        },
        {
          kind: 'compute',
          title: 'Kết luận',
          body: 'Đời F2 có tối đa 9 loại kiểu gen khác nhau (1AABB : 2AABb : 1AAbb : 2AaBB : 4AaBb : 2Aabb : 1aaBB : 2aaBb : 1aabb).',
        },
      ],
      finalSolution: 'Số loại kiểu gen = 3 × 3 = 9 loại kiểu gen.',
      commonMistakes: [
        {
          id: 'confuse-phenotype',
          message: 'Nhầm lẫn giữa số loại kiểu gen (9) và số loại kiểu hình (4).',
          trapAnswers: ['4', '16'],
        },
      ],
    };
  }

  if (mode === 'testcross') {
    return {
      id: `bio-gen-mendel-${idSuffix}`,
      lessonId: 'bio-g9-b02',
      skillIds: ['bio9-quy-luat-mendel'],
      difficulty: 1,
      prompt: `Khi thực hiện phép lai phân tích cá thể dị hợp hai cặp gen (P: AaBb × aabb) với các gen phân li độc lập, đời con lai Fa sẽ thu được bao nhiêu loại kiểu hình khác nhau?`,
      given: [
        { label: 'Phép lai phân tích', value: 'AaBb × aabb' },
      ],
      find: { label: 'Số loại kiểu hình ở Fa', unit: 'loại' },
      knowledge: ['kb-bio-g9-phep-lai-phan-tich', 'kb-bio-g9-phan-li-doc-lap'],
      answer: {
        kind: 'number',
        value: 4,
        unit: 'loại',
        decimals: 0,
        tolerance: { abs: 0 },
      },
      hints: [
        {
          level: 1,
          text: 'Cơ thể AaBb cho 4 loại giao tử với tỉ lệ ngang nhau (1/4 AB : 1/4 Ab : 1/4 aB : 1/4 ab), cơ thể aabb chỉ cho 1 loại giao tử ab.',
        },
        {
          level: 2,
          text: 'Tỉ lệ kiểu hình phép lai phân tích phản ánh tỉ lệ giao tử của cá thể dị hợp: 1 A-B- : 1 A-bb : 1 aaB- : 1 aabb → có 4 loại kiểu hình.',
        },
      ],
      steps: [
        {
          kind: 'identify',
          title: 'Xác định giao tử của bố mẹ',
          body: 'Cơ thể AaBb giảm phân cho 4 loại giao tử: 1/4 AB, 1/4 Ab, 1/4 aB, 1/4 ab. Cơ thể đồng hợp lặn aabb chỉ cho 1 loại giao tử ab.',
        },
        {
          kind: 'equation',
          title: 'Sự kết hợp giao tử trong thụ tinh',
          body: 'Đời con Fa gồm 4 kiểu tổ hợp: 1 AaBb (trội - trội) : 1 Aabb (trội - lặn) : 1 aaBb (lặn - trội) : 1 aabb (lặn - lặn).',
        },
        {
          kind: 'compute',
          title: 'Kết luận',
          body: 'Đời con thu được 4 loại kiểu hình khác nhau với tỉ lệ phân li 1 : 1 : 1 : 1.',
        },
      ],
      finalSolution: 'Số loại kiểu hình ở đời con lai phân tích là 4 loại.',
      commonMistakes: [
        {
          id: 'square-confusion',
          message: 'Lấy số kiểu hình của F2 tự thụ (9:3:3:1) thay vì lai phân tích (1:1:1:1).',
          trapAnswers: ['16', '9'],
        },
      ],
    };
  }

  // mode === 'gamete-combinations'
  const parentPairs = [
    { p1: 'AaBb', p2: 'AaBb', g1: 4, g2: 4, total: 16 },
    { p1: 'AaBbDd', p2: 'AaBb', g1: 8, g2: 4, total: 32 },
    { p1: 'AaBbDd', p2: 'Aabbdd', g1: 8, g2: 2, total: 16 },
    { p1: 'AaBbDd', p2: 'AaBbDd', g1: 8, g2: 8, total: 64 },
  ];
  const pair = parentPairs[Math.floor(Math.random() * parentPairs.length)];

  return {
    id: `bio-gen-mendel-${idSuffix}`,
    lessonId: 'bio-g9-b02',
    skillIds: ['bio9-quy-luat-mendel'],
    difficulty: 2,
    prompt: `Cho phép lai P: ${pair.p1} × ${pair.p2}. Biết các gen phân li độc lập và giảm phân thụ tinh diễn ra hoàn toàn bình thường. Số tổ hợp giao tử (hợp tử) thu được ở thế hệ đời con là bao nhiêu?`,
    given: [
      { label: 'Kiểu gen bố mẹ', value: `${pair.p1} × ${pair.p2}` },
    ],
    find: { label: 'Số tổ hợp giao tử ở đời con', unit: 'tổ hợp' },
    knowledge: ['kb-bio-g9-phan-li-doc-lap', 'kb-bio-g9-bien-di-to-hop'],
    answer: {
      kind: 'number',
      value: pair.total,
      unit: 'tổ hợp',
      decimals: 0,
      tolerance: { abs: 0 },
    },
    hints: [
      {
        level: 1,
        text: 'Số tổ hợp giao tử ở đời con bằng tích số loại giao tử đực nhân với số loại giao tử cái.',
      },
      {
        level: 2,
        text: `Cơ thể ${pair.p1} tạo ra ${pair.g1} loại giao tử; cơ thể ${pair.p2} tạo ra ${pair.g2} loại giao tử. Lấy ${pair.g1} × ${pair.g2}.`,
      },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Xác định số loại giao tử của từng bên bố mẹ',
        body: `Cá thể thứ nhất (${pair.p1}) tạo ra 2^${Math.round(Math.log2(pair.g1))} = ${pair.g1} loại giao tử. Cá thể thứ hai (${pair.p2}) tạo ra 2^${Math.round(Math.log2(pair.g2))} = ${pair.g2} loại giao tử.`,
      },
      {
        kind: 'equation',
        title: 'Tính số tổ hợp giao tử',
        body: `Số tổ hợp giao tử = Số giao tử P1 × Số giao tử P2 = ${pair.g1} × ${pair.g2} = ${pair.total} tổ hợp.`,
      },
      {
        kind: 'compute',
        title: 'Kết luận',
        body: `Đời con thu được ${pair.total} tổ hợp giao tử.`,
      },
    ],
    finalSolution: `Số tổ hợp giao tử = ${pair.g1} × ${pair.g2} = ${pair.total} tổ hợp.`,
    commonMistakes: [
      {
        id: 'addition-mistake',
        message: 'Cộng số giao tử hai bên thay vì làm phép nhân.',
        trapAnswers: [`${pair.g1 + pair.g2}`],
      },
    ],
  };
}

/**
 * Generates an exercise calculating DNA structure or replication metrics:
 * - Hydrogen bonds (H = 2A + 3G)
 * - Length (L = (N/2) * 3.4 Å)
 * - Free nucleotides needed in replication (N_mt = N * (2^k - 1))
 */
export function generateMolecularDnaExercise(idSuffix: string): Exercise {
  const modes = ['hydrogen-bonds', 'dna-length', 'dna-replication'] as const;
  const mode = modes[Math.floor(Math.random() * modes.length)];

  if (mode === 'hydrogen-bonds') {
    const totalNList = [1200, 1800, 2400, 3000];
    const n = totalNList[Math.floor(Math.random() * totalNList.length)];
    const percentA = [20, 25, 30][Math.floor(Math.random() * 3)];
    const a = (n * percentA) / 100;
    const g = (n - 2 * a) / 2;
    const h = 2 * a + 3 * g;

    return {
      id: `bio-gen-dna-${idSuffix}`,
      lessonId: 'bio-g9-b03',
      skillIds: ['bio9-nucleic-acid-gene'],
      difficulty: 2,
      prompt: `Một đoạn phân tử DNA có tổng số ${n} nucleotide, trong đó số nucleotide loại Adenine (A) chiếm ${percentA}% tổng số nucleotide. Theo nguyên tắc bổ sung, tổng số liên kết hydrogen giữa hai mạch của đoạn DNA này là bao nhiêu?`,
      given: [
        { label: 'Tổng số nucleotide (N)', value: `${n}`, unit: 'nu' },
        { label: 'Tỉ lệ nucleotide loại A', value: `${percentA}`, unit: '%' },
      ],
      find: { label: 'Số liên kết hydrogen (H)', unit: 'liên kết' },
      knowledge: ['kb-bio-g9-dna-cau-truc-hoa-hoc', 'kb-bio-g9-dna-cau-truc-khong-gian'],
      answer: {
        kind: 'number',
        value: h,
        unit: 'liên kết',
        decimals: 0,
        tolerance: { abs: 0 },
      },
      hints: [
        {
          level: 1,
          text: 'Theo nguyên tắc bổ sung (NTBS): A liên kết với T bằng 2 liên kết hydrogen (A = T); G liên kết với C bằng 3 liên kết hydrogen (G = C).',
        },
        {
          level: 2,
          text: `Tính số nu mỗi loại: A = T = ${n} × ${percentA}% = ${a} nu; G = C = (N - 2A) / 2 = ${g} nu. Tổng số liên kết hydrogen: H = 2A + 3G.`,
        },
      ],
      steps: [
        {
          kind: 'identify',
          title: 'Tính số nucleotide từng loại theo NTBS',
          body: `Số nucleotide loại A = T = ${n} × ${percentA}% = ${a} nucleotide. Số nucleotide loại G = C = (${n} - 2 × ${a}) / 2 = ${g} nucleotide.`,
        },
        {
          kind: 'equation',
          title: 'Áp dụng công thức tính số liên kết hydrogen',
          body: `H = 2A + 3G = 2 × ${a} + 3 × ${g} = ${2 * a} + ${3 * g} = ${h} liên kết hydrogen.`,
        },
        {
          kind: 'compute',
          title: 'Kết luận',
          body: `Đoạn phân tử DNA có tổng cộng ${h} liên kết hydrogen.`,
        },
      ],
      finalSolution: `H = 2A + 3G = 2 × ${a} + 3 × ${g} = ${h} liên kết hydrogen.`,
      commonMistakes: [
        {
          id: 'two-bonds-only',
          message: 'Tính tất cả các cặp base đều có 2 liên kết (lấy 2 × (N/2) = N).',
          trapAnswers: [`${n}`],
        },
      ],
    };
  }

  if (mode === 'dna-length') {
    const totalNList = [1200, 1600, 2000, 2400, 3000];
    const n = totalNList[Math.floor(Math.random() * totalNList.length)];
    const lengthA = (n / 2) * 3.4;

    return {
      id: `bio-gen-dna-${idSuffix}`,
      lessonId: 'bio-g9-b03',
      skillIds: ['bio9-nucleic-acid-gene'],
      difficulty: 1,
      prompt: `Một gene cấu trúc có tổng số ${n} nucleotide. Biết mỗi chu kì xoắn gồm 10 cặp nucleotide dài 34 Å (mỗi nucleotide trên một mạch dài 3,4 Å). Chiều dài của gene này là bao nhiêu Ångström (Å)?`,
      given: [
        { label: 'Tổng số nucleotide (N)', value: `${n}`, unit: 'nu' },
        { label: 'Kích thước 1 nucleotide', value: '3.4', unit: 'Å' },
      ],
      find: { label: 'Chiều dài của gene (L)', unit: 'Å' },
      knowledge: ['kb-bio-g9-dna-cau-truc-khong-gian'],
      answer: {
        kind: 'number',
        value: lengthA,
        unit: 'Å',
        decimals: 1,
        tolerance: { abs: 0 },
      },
      hints: [
        {
          level: 1,
          text: 'Phân tử DNA gồm 2 mạch song song ngược chiều. Chiều dài DNA bằng số nucleotide của MỘT MẠCH nhân với 3,4 Å.',
        },
        {
          level: 2,
          text: `Áp dụng công thức: L = (N / 2) × 3,4 = (${n} / 2) × 3,4 Å.`,
        },
      ],
      steps: [
        {
          kind: 'identify',
          title: 'Xác định số nucleotide trên một mạch đơn',
          body: `Tổng số nu là ${n}, suy ra số nucleotide trên mỗi mạch đơn là N / 2 = ${n} / 2 = ${n / 2} nucleotide.`,
        },
        {
          kind: 'equation',
          title: 'Áp dụng công thức tính chiều dài DNA',
          body: `L = (N / 2) × 3,4 = ${n / 2} × 3,4 = ${lengthA} Å (tương đương ${(lengthA / 10).toFixed(1)} nm).`,
        },
        {
          kind: 'compute',
          title: 'Kết luận',
          body: `Chiều dài của gene là ${lengthA} Å.`,
        },
      ],
      finalSolution: `L = (N / 2) × 3,4 = (${n} / 2) × 3,4 = ${lengthA} Å.`,
      commonMistakes: [
        {
          id: 'forgot-half',
          message: 'Lấy cả 2 mạch nhân 3,4 (quên chia 2).',
          trapAnswers: [`${n * 3.4}`],
        },
      ],
    };
  }

  // mode === 'dna-replication'
  const dnaList = [1200, 1500, 2000, 2400];
  const n = dnaList[Math.floor(Math.random() * dnaList.length)];
  const kList = [2, 3, 4];
  const k = kList[Math.floor(Math.random() * kList.length)];
  const nEnv = n * (Math.pow(2, k) - 1);

  return {
    id: `bio-gen-dna-${idSuffix}`,
    lessonId: 'bio-g9-b04',
    skillIds: ['bio9-tai-ban-phien-ma'],
    difficulty: 2,
    prompt: `Một phân tử DNA chứa ${n} nucleotide tiến hành nhân đôi (tái bản) liên tiếp ${k} lần trong nhân tế bào. Môi trường nội bào cần cung cấp tổng cộng bao nhiêu nucleotide tự do cho quá trình nhân đôi này?`,
    given: [
      { label: 'Số nucleotide DNA mẹ (N)', value: `${n}`, unit: 'nu' },
      { label: 'Số lần nhân đôi (k)', value: `${k}`, unit: 'lần' },
    ],
    find: { label: 'Số nucleotide môi trường cung cấp (N_mt)', unit: 'nu' },
    knowledge: ['kb-bio-g9-tai-ban-dna-nguyen-tac', 'kb-bio-g9-tai-ban-dna-dien-bien'],
    answer: {
      kind: 'number',
      value: nEnv,
      unit: 'nu',
      decimals: 0,
      tolerance: { abs: 0 },
    },
    hints: [
      {
        level: 1,
        text: 'Sau k lần nhân đôi, 1 phân tử DNA tạo ra 2^k phân tử DNA con.',
      },
      {
        level: 2,
        text: `Số nucleotide môi trường nội bào cần cung cấp: N_mt = N × (2^k - 1) = ${n} × (2^${k} - 1).`,
      },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Xác định số phân tử DNA con tạo thành',
        body: `Sau ${k} lần tái bản liên tiếp, số phân tử DNA con tạo thành là 2^${k} = ${Math.pow(2, k)} phân tử DNA.`,
      },
      {
        kind: 'equation',
        title: 'Áp dụng công thức tính nucleotide môi trường cung cấp',
        body: `Theo nguyên tắc bán bảo tồn, 2 mạch của DNA mẹ được giữ lại trong 2 DNA con. Do đó số nucleotide môi trường cung cấp là: N_mt = N × (2^k - 1) = ${n} × (${Math.pow(2, k)} - 1) = ${n} × ${Math.pow(2, k) - 1} = ${nEnv} nucleotide.`,
      },
      {
        kind: 'compute',
        title: 'Kết luận',
        body: `Môi trường nội bào cần cung cấp tổng cộng ${nEnv} nucleotide tự do.`,
      },
    ],
    finalSolution: `N_mt = N × (2^${k} - 1) = ${n} × ${Math.pow(2, k) - 1} = ${nEnv} nucleotide.`,
    commonMistakes: [
      {
        id: 'forgot-subtract-one',
        message: 'Lấy N × 2^k (quên trừ đi phân tử DNA ban đầu của mẹ).',
        trapAnswers: [`${n * Math.pow(2, k)}`],
      },
    ],
  };
}

/**
 * Generates an exercise calculating chromosome dynamics and gamete production:
 * - Chromosomes needed during mitosis: 2n * a * (2^k - 1)
 * - Sperm production from primary spermatocytes: 4 * x
 * - Ovum production from primary oocytes: 1 * y
 */
export function generateCellDivisionChromosomeExercise(idSuffix: string): Exercise {
  const modes = ['mitosis-chromosomes', 'sperm-production', 'egg-production'] as const;
  const mode = modes[Math.floor(Math.random() * modes.length)];

  if (mode === 'mitosis-chromosomes') {
    const species = [
      { name: 'ruồi giấm', twoN: 8 },
      { name: 'đậu Hà Lan', twoN: 14 },
      { name: 'ngô', twoN: 20 },
      { name: 'người', twoN: 46 },
    ];
    const sp = species[Math.floor(Math.random() * species.length)];
    const initialCells = [1, 2, 3, 5];
    const a = initialCells[Math.floor(Math.random() * initialCells.length)];
    const kList = [2, 3, 4];
    const k = kList[Math.floor(Math.random() * kList.length)];
    const nstEnv = a * sp.twoN * (Math.pow(2, k) - 1);

    return {
      id: `bio-gen-chromosomes-${idSuffix}`,
      lessonId: 'bio-g9-b08',
      skillIds: ['bio9-nguyen-phan-giam-phan', 'bio9-nhiem-sac-the'],
      difficulty: 2,
      prompt: `Có ${a} tế bào sinh dưỡng của loài ${sp.name} (bộ NST lưỡng bội 2n = ${sp.twoN}) cùng tiến hành nguyên phân liên tiếp ${k} lần bằng nhau. Môi trường nội bào cần cung cấp nguyên liệu tương đương với bao nhiêu nhiễm sắc thể đơn cho quá trình nguyên phân trên?`,
      given: [
        { label: 'Số tế bào ban đầu (a)', value: `${a}`, unit: 'tế bào' },
        { label: 'Bộ NST lưỡng bội (2n)', value: `${sp.twoN}`, unit: 'NST' },
        { label: 'Số lần nguyên phân (k)', value: `${k}`, unit: 'lần' },
      ],
      find: { label: 'Số NST môi trường cung cấp (NST_mt)', unit: 'NST' },
      knowledge: ['kb-bio-g9-tinh-dac-trung-bo-nst', 'kb-bio-g9-nguyen-phan-y-nghia'],
      answer: {
        kind: 'number',
        value: nstEnv,
        unit: 'NST',
        decimals: 0,
        tolerance: { abs: 0 },
      },
      hints: [
        {
          level: 1,
          text: 'Mỗi lần nguyên phân tế bào nhân đôi bộ NST một lần. a tế bào sau k lần nguyên phân tạo a × 2^k tế bào con.',
        },
        {
          level: 2,
          text: `Áp dụng công thức số NST môi trường cung cấp: NST_mt = a × 2n × (2^k - 1) = ${a} × ${sp.twoN} × (2^${k} - 1).`,
        },
      ],
      steps: [
        {
          kind: 'identify',
          title: 'Xác định các đại lượng đã biết',
          body: `Số tế bào a = ${a}, bộ NST 2n = ${sp.twoN}, số đợt nguyên phân k = ${k}.`,
        },
        {
          kind: 'equation',
          title: 'Áp dụng công thức nguyên phân',
          body: `Số NST môi trường cung cấp: NST_mt = a × 2n × (2^k - 1) = ${a} × ${sp.twoN} × (${Math.pow(2, k)} - 1) = ${a * sp.twoN} × ${Math.pow(2, k) - 1} = ${nstEnv} NST.`,
        },
        {
          kind: 'compute',
          title: 'Kết luận',
          body: `Môi trường nội bào cần cung cấp ${nstEnv} nhiễm sắc thể đơn.`,
        },
      ],
      finalSolution: `NST_mt = a × 2n × (2^k - 1) = ${a} × ${sp.twoN} × (2^${k} - 1) = ${nstEnv} NST.`,
      commonMistakes: [
        {
          id: 'forgot-subtract-one',
          message: 'Tính tổng số NST có trong các tế bào con (a × 2n × 2^k) mà quên trừ đi số NST ban đầu của mẹ.',
          trapAnswers: [`${a * sp.twoN * Math.pow(2, k)}`],
        },
      ],
    };
  }

  if (mode === 'sperm-production') {
    const xList = [5, 10, 15, 20, 50];
    const x = xList[Math.floor(Math.random() * xList.length)];
    const totalSperms = x * 4;

    return {
      id: `bio-gen-chromosomes-${idSuffix}`,
      lessonId: 'bio-g9-b08',
      skillIds: ['bio9-nguyen-phan-giam-phan'],
      difficulty: 1,
      prompt: `Có ${x} tế bào sinh tinh (tinh bào bậc 1) của một loài động vật tiến hành giảm phân bình thường để tạo giao tử đực. Kết thúc giảm phân, tổng số tinh trùng được tạo ra là bao nhiêu?`,
      given: [
        { label: 'Số tế bào sinh tinh ban đầu', value: `${x}`, unit: 'tế bào' },
      ],
      find: { label: 'Tổng số tinh trùng tạo thành', unit: 'tinh trùng' },
      knowledge: ['kb-bio-g9-giam-phan-dien-bien-1', 'kb-bio-g9-giam-phan-dien-bien-2'],
      answer: {
        kind: 'number',
        value: totalSperms,
        unit: 'tinh trùng',
        decimals: 0,
        tolerance: { abs: 0 },
      },
      hints: [
        {
          level: 1,
          text: 'Trong quá trình phát sinh giao tử đực, mỗi tế bào sinh tinh qua 2 lần phân bào của giảm phân sẽ tạo thành 4 tinh tử, sau đó phát triển thành 4 tinh trùng.',
        },
        {
          level: 2,
          text: `Số tinh trùng tạo thành = Số tế bào sinh tinh × 4 = ${x} × 4.`,
        },
      ],
      steps: [
        {
          kind: 'identify',
          title: 'Cơ chế tạo tinh trùng trong giảm phân',
          body: 'Mỗi tế bào sinh tinh (2n) giảm phân I tạo 2 tế bào con (n kép), sau đó giảm phân II tạo 4 tinh tử (n đơn) và đều phát triển thành 4 tinh trùng có khả năng thụ tinh.',
        },
        {
          kind: 'equation',
          title: 'Tính số tinh trùng tạo thành',
          body: `Tổng số tinh trùng = ${x} × 4 = ${totalSperms} tinh trùng.`,
        },
        {
          kind: 'compute',
          title: 'Kết luận',
          body: `Từ ${x} tế bào sinh tinh sẽ tạo ra ${totalSperms} tinh trùng.`,
        },
      ],
      finalSolution: `Số tinh trùng = ${x} × 4 = ${totalSperms} tinh trùng.`,
      commonMistakes: [
        {
          id: 'two-instead-of-four',
          message: 'Nghĩ rằng 1 tế bào chỉ tạo ra 2 giao tử giống nguyên phân.',
          trapAnswers: [`${x * 2}`],
        },
      ],
    };
  }

  // mode === 'egg-production'
  const yList = [8, 12, 20, 25, 40];
  const y = yList[Math.floor(Math.random() * yList.length)];
  const totalEggs = y;
  const polarBodies = y * 3;

  return {
    id: `bio-gen-chromosomes-${idSuffix}`,
    lessonId: 'bio-g9-b08',
    skillIds: ['bio9-nguyen-phan-giam-phan'],
    difficulty: 2,
    prompt: `Có ${y} tế bào sinh trứng (noãn bào bậc 1) tiến hành giảm phân bình thường. Quá trình này sẽ tạo ra bao nhiêu tế bào trứng có khả năng thụ tinh và bao nhiêu thể cực (thể định hướng) bị thoái hóa? Hãy nhập số lượng tế bào trứng tạo thành.`,
    given: [
      { label: 'Số tế bào sinh trứng', value: `${y}`, unit: 'tế bào' },
    ],
    find: { label: 'Số tế bào trứng hữu thụ', unit: 'trứng' },
    knowledge: ['kb-bio-g9-giam-phan-dien-bien-1', 'kb-bio-g9-giam-phan-dien-bien-2'],
    answer: {
      kind: 'number',
      value: totalEggs,
      unit: 'trứng',
      decimals: 0,
      tolerance: { abs: 0 },
    },
    hints: [
      {
        level: 1,
        text: 'Khác với tạo tinh trùng, mỗi tế bào sinh trứng qua giảm phân chỉ tạo ra 1 tế bào trứng có kích thước lớn và 3 thể cực có kích thước nhỏ.',
      },
      {
        level: 2,
        text: `1 tế bào sinh trứng → 1 trứng + 3 thể cực. Vậy ${y} tế bào sinh trứng → ${y} trứng (và ${polarBodies} thể cực bị tiêu biến).`,
      },
    ],
    steps: [
      {
        kind: 'identify',
        title: 'Cơ chế sinh noãn (tạo trứng)',
        body: 'Do phân chia tế bào chất không đồng đều ở cả 2 lần phân bào của giảm phân, 1 tế bào sinh trứng chỉ tạo ra 1 tế bào trứng mang hầu hết chất dinh dưỡng và 3 thể cực (bị thoái hóa).',
      },
      {
        kind: 'equation',
        title: 'Tính số tế bào trứng tạo thành',
        body: `Số tế bào trứng = ${y} × 1 = ${totalEggs} trứng (đồng thời tạo ${polarBodies} thể cực).`,
      },
      {
        kind: 'compute',
        title: 'Kết luận',
        body: `Từ ${y} tế bào sinh trứng chỉ thu được ${totalEggs} tế bào trứng hữu thụ.`,
      },
    ],
    finalSolution: `Số tế bào trứng = ${y} × 1 = ${totalEggs} trứng.`,
    commonMistakes: [
      {
        id: 'confuse-with-sperm',
        message: 'Lấy số tế bào nhân 4 giống như quá trình sinh tinh.',
        trapAnswers: [`${y * 4}`],
      },
    ],
  };
}

/**
 * Generate a pack of dynamic biology exercises for a given generator topic
 */
export function generateBiologyDynamicExercises(topicId: string): Exercise[] {
  const now = Date.now();
  if (topicId === 'bio-gen-mendel') {
    return [
      generateMendelInheritanceExercise(`${now}-1`),
      generateMendelInheritanceExercise(`${now}-2`),
      generateMendelInheritanceExercise(`${now}-3`),
      generateMendelInheritanceExercise(`${now}-4`),
      generateMendelInheritanceExercise(`${now}-5`),
    ];
  }
  if (topicId === 'bio-gen-dna') {
    return [
      generateMolecularDnaExercise(`${now}-1`),
      generateMolecularDnaExercise(`${now}-2`),
      generateMolecularDnaExercise(`${now}-3`),
      generateMolecularDnaExercise(`${now}-4`),
      generateMolecularDnaExercise(`${now}-5`),
    ];
  }
  if (topicId === 'bio-gen-chromosomes') {
    return [
      generateCellDivisionChromosomeExercise(`${now}-1`),
      generateCellDivisionChromosomeExercise(`${now}-2`),
      generateCellDivisionChromosomeExercise(`${now}-3`),
      generateCellDivisionChromosomeExercise(`${now}-4`),
      generateCellDivisionChromosomeExercise(`${now}-5`),
    ];
  }
  if (topicId === 'bio-gen-division') {
    return [
      generateCellDivisionExercise(`${now}-1`),
      generateCellDivisionExercise(`${now}-2`),
      generateCellDivisionExercise(`${now}-3`),
      generateCellDivisionExercise(`${now}-4`),
      generateCellDivisionExercise(`${now}-5`),
    ];
  }
  if (topicId === 'bio-gen-microscope') {
    return [
      generateMicroscopeMagnificationExercise(`${now}-1`),
      generateMicroscopeMagnificationExercise(`${now}-2`),
      generateMicroscopeMagnificationExercise(`${now}-3`),
      generateMicroscopeMagnificationExercise(`${now}-4`),
      generateMicroscopeMagnificationExercise(`${now}-5`),
    ];
  }
  if (topicId === 'bio-gen-water') {
    return [
      generateWaterIntakeExercise(`${now}-1`),
      generateWaterIntakeExercise(`${now}-2`),
      generateWaterIntakeExercise(`${now}-3`),
      generateWaterIntakeExercise(`${now}-4`),
      generateWaterIntakeExercise(`${now}-5`),
    ];
  }
  if (topicId === 'bio-gen-calories') {
    return [
      generateDietaryCaloriesExercise(`${now}-1`),
      generateDietaryCaloriesExercise(`${now}-2`),
      generateDietaryCaloriesExercise(`${now}-3`),
      generateDietaryCaloriesExercise(`${now}-4`),
      generateDietaryCaloriesExercise(`${now}-5`),
    ];
  }
  if (topicId === 'bio-gen-density') {
    return [
      generatePopulationDensityExercise(`${now}-1`),
      generatePopulationDensityExercise(`${now}-2`),
      generatePopulationDensityExercise(`${now}-3`),
      generatePopulationDensityExercise(`${now}-4`),
      generatePopulationDensityExercise(`${now}-5`),
    ];
  }
  if (topicId === 'bio-gen-blood') {
    return [
      generateBloodTransfusionExercise(`${now}-1`),
      generateBloodTransfusionExercise(`${now}-2`),
      generateBloodTransfusionExercise(`${now}-3`),
      generateBloodTransfusionExercise(`${now}-4`),
      generateBloodTransfusionExercise(`${now}-5`),
    ];
  }

  // bio-gen-infinite (Mix G6, G7, G8 & G9)
  return [
    generateMendelInheritanceExercise(`${now}-1`),
    generateMolecularDnaExercise(`${now}-2`),
    generateCellDivisionChromosomeExercise(`${now}-3`),
    generateDietaryCaloriesExercise(`${now}-4`),
    generatePopulationDensityExercise(`${now}-5`),
  ];
}

