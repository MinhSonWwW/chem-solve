import { ExerciseSchema } from './schema/exercise';
import type { Exercise } from './schema/exercise';

import {
  generateMolFromMassExercise,
  generateMassFromMolExercise,
  generateGasVolumeExercise,
  generateGasDensityAirExercise,
  generateMassPercentageExercise,
  generateMolarConcentrationExercise,
  generateMetalAcidStoichiometry,
  generatePhysicsDynamicExercises,
  generateBiologyDynamicExercises,
} from './generators';

const exerciseCache = new Map<string, Exercise[]>();

/**
 * Load and validate exercises for a given lesson.
 * Uses dynamic import to code-split per lesson.
 */
export async function loadExercises(lessonId: string): Promise<Exercise[]> {
  // Support dynamic on-the-fly generated physics exercises
  if (lessonId.startsWith('phy-gen-')) {
    return generatePhysicsDynamicExercises(lessonId);
  }

  // Support dynamic on-the-fly generated biology exercises
  if (lessonId.startsWith('bio-gen-')) {
    return generateBiologyDynamicExercises(lessonId);
  }

  // Support dynamic on-the-fly generated chemistry exercises
  if (lessonId.startsWith('gen-')) {
    const list: Exercise[] = [];
    const rnd = (min: number, max: number) => +(Math.random() * (max - min) + min).toFixed(1);

    if (lessonId === 'gen-mol' || lessonId === 'gen-infinite') {
      list.push(generateMolFromMassExercise(Math.floor(Math.random() * 4), rnd(0.2, 2.5), `dyn-${Date.now()}-1`));
      list.push(generateMassFromMolExercise(Math.floor(Math.random() * 4), rnd(0.2, 2.0), `dyn-${Date.now()}-2`));
    }
    if (lessonId === 'gen-gas' || lessonId === 'gen-infinite') {
      list.push(generateGasVolumeExercise('CO2', 'carbon dioxide', rnd(0.5, 3.0), `dyn-${Date.now()}-3`));
      list.push(generateGasDensityAirExercise('SO2', 'sulfur dioxide', 64, `dyn-${Date.now()}-4`));
    }
    if (lessonId === 'gen-solution' || lessonId === 'gen-infinite') {
      list.push(generateMassPercentageExercise('NaCl', 'sodium chloride', 15, 85, `dyn-${Date.now()}-5`));
      list.push(generateMolarConcentrationExercise('CuSO4', 'copper(II) sulfate', rnd(0.1, 0.8), 500, `dyn-${Date.now()}-6`));
    }
    if (lessonId === 'gen-stoich' || lessonId === 'gen-infinite') {
      list.push(generateMetalAcidStoichiometry('Zn', 'zinc (kẽm)', 65, 13, `dyn-${Date.now()}-7`));
      list.push(generateMetalAcidStoichiometry('Fe', 'iron (sắt)', 56, 11.2, `dyn-${Date.now()}-8`));
    }
    return list.slice(0, 5);
  }

  if (exerciseCache.has(lessonId)) {
    return exerciseCache.get(lessonId)!;
  }

  if (lessonId.startsWith('phy-')) {
    const physicsModules = import.meta.glob('./physics/**/*.exercises.json');
    const matchedPath = Object.keys(physicsModules).find((p) => p.endsWith(`/${lessonId}.exercises.json`));
    if (!matchedPath) {
      throw new Error(`Physics exercises not found for lesson "${lessonId}"`);
    }
    const module = (await physicsModules[matchedPath]()) as { default: unknown[] };
    const raw: unknown[] = module.default;
    const exercises: Exercise[] = raw.map((item, i) => {
      const result = ExerciseSchema.safeParse(item);
      if (!result.success) {
        console.error(`Exercise ${i} in ${lessonId} failed validation:`, result.error.issues);
        throw new Error(`Invalid exercise at index ${i}: ${result.error.issues[0]?.message}`);
      }
      return result.data;
    });
    exerciseCache.set(lessonId, exercises);
    return exercises;
  }

  if (lessonId.startsWith('bio-')) {
    const bioModules = import.meta.glob('./biology/**/*.exercises.json');
    const matchedPath = Object.keys(bioModules).find((p) => p.endsWith(`/${lessonId}.exercises.json`));
    if (!matchedPath) {
      throw new Error(`Biology exercises not found for lesson "${lessonId}"`);
    }
    const module = (await bioModules[matchedPath]()) as { default: unknown[] };
    const raw: unknown[] = module.default;
    const exercises: Exercise[] = raw.map((item, i) => {
      const result = ExerciseSchema.safeParse(item);
      if (!result.success) {
        console.error(`Exercise ${i} in ${lessonId} failed validation:`, result.error.issues);
        throw new Error(`Invalid exercise at index ${i}: ${result.error.issues[0]?.message}`);
      }
      return result.data;
    });
    exerciseCache.set(lessonId, exercises);
    return exercises;
  }

  // Extract grade and lesson number from lessonId (e.g., "g8-b03")
  const match = lessonId.match(/^g(\d)-b\d{2}$/);
  if (!match) {
    throw new Error(`Invalid lessonId format: ${lessonId}`);
  }

  const grade = match[1];

  try {
    // Dynamic import — Vite handles JSON modules
    const module = await import(`./exercises/g${grade}/${lessonId}.json`);
    const raw: unknown[] = module.default;

    // Validate each exercise against Zod schema
    const exercises: Exercise[] = raw.map((item, i) => {
      const result = ExerciseSchema.safeParse(item);
      if (!result.success) {
        console.error(`Exercise ${i} in ${lessonId} failed validation:`, result.error.issues);
        throw new Error(`Invalid exercise at index ${i}: ${result.error.issues[0]?.message}`);
      }
      return result.data;
    });

    exerciseCache.set(lessonId, exercises);
    return exercises;
  } catch (err) {
    if (err instanceof Error && err.message.includes('Invalid exercise')) {
      throw err;
    }
    throw new Error(`Failed to load exercises for lesson "${lessonId}": ${err}`);
  }
}

/**
 * Load and select a targeted subset of exercises for a specific milestone node.
 * This guarantees proper scaffolding (introductory vs advanced questions)
 * and keeps each learning session within 4-7 questions.
 */
export async function loadExercisesForNode(
  lessonId: string,
  nodeId: string
): Promise<Exercise[]> {
  const allExercises = await loadExercises(lessonId);
  if (!allExercises || allExercises.length === 0) return [];

  // Special node-level partitioning for multi-node lessons
  if (lessonId === 'g8-b03') {
    if (nodeId.endsWith('n01')) {
      const basic = allExercises.filter(
        (q) =>
          q.difficulty === 1 ||
          q.skillIds.some((s) => s.includes('mol') || s.includes('gas-volume'))
      );
      return basic.slice(0, 6);
    }
    if (nodeId.endsWith('n02')) {
      const advanced = allExercises.filter(
        (q) =>
          q.difficulty === 2 ||
          q.skillIds.some((s) => s.includes('density') || s.includes('molecular'))
      );
      return advanced.slice(0, 6);
    }
  }

  if (lessonId === 'g8-b04') {
    // 8 questions: n01 = Nồng độ C% (4 questions), n02 = Nồng độ CM (4 questions) - Zero overlap
    if (nodeId.endsWith('n01')) return allExercises.slice(0, 4);
    if (nodeId.endsWith('n02')) return allExercises.slice(4, 8);
  }

  if (lessonId === 'g8-b05') {
    // 10 questions: n01 = ĐL Bảo toàn khối lượng (5 questions), n02 = Cân bằng PTHH (5 questions) - Zero overlap
    if (nodeId.endsWith('n01')) return allExercises.slice(0, 5);
    if (nodeId.endsWith('n02')) return allExercises.slice(5, 10);
  }

  if (lessonId === 'g7-b02') {
    // 12 questions: n01 = atomic structure (p, n, e), n02 = atomic mass (amu)
    if (nodeId.endsWith('n01')) return allExercises.slice(0, 6);
    if (nodeId.endsWith('n02')) return allExercises.slice(6, 12);
  }

  if (lessonId === 'g6-b09') {
    // 12 questions: n01 = objects/matter, n02 = properties, n03 = heating sugar/salt, boss = composite
    if (nodeId.endsWith('n01')) return allExercises.slice(0, 4);
    if (nodeId.endsWith('n02')) return allExercises.slice(4, 8);
    if (nodeId.endsWith('n03')) return allExercises.slice(8, 12);
    if (nodeId.endsWith('boss')) {
      return [
        allExercises[0],
        allExercises[2],
        allExercises[4],
        allExercises[6],
        allExercises[8],
        allExercises[10],
      ].filter(Boolean);
    }
  }

  if (lessonId === 'g6-b10') {
    // 9 questions: n01 = 3 states, n02 = state changes, n03 = boiling/evaporation, boss = composite
    if (nodeId.endsWith('n01')) return allExercises.slice(0, 3);
    if (nodeId.endsWith('n02')) return allExercises.slice(3, 6);
    if (nodeId.endsWith('n03')) return allExercises.slice(6, 9);
    if (nodeId.endsWith('boss')) return allExercises.slice(0, 6);
  }

  if (lessonId === 'g6-b11') {
    // 8 questions: n01 = oxygen role, n02 = air composition, n03 = air pollution, boss = composite
    if (nodeId.endsWith('n01')) return allExercises.slice(0, 3);
    if (nodeId.endsWith('n02')) return allExercises.slice(3, 6);
    if (nodeId.endsWith('n03')) return allExercises.slice(5, 8);
    if (nodeId.endsWith('boss')) return allExercises.slice(0, 6);
  }

  if (lessonId === 'phy-g6-b04' && nodeId.endsWith('boss')) {
    // Composite checkpoint for Unit 0 (Đo lường): 6 questions across length, mass, time, temperature
    try {
      const [exB01, exB02, exB03] = await Promise.all([
        loadExercises('phy-g6-b01'),
        loadExercises('phy-g6-b02'),
        loadExercises('phy-g6-b03'),
      ]);
      return [
        exB01[1] ?? exB01[0], // length: GHĐ & ĐCNN
        exB01[4] ?? exB01[2], // length: đọc kết quả đo
        exB02[4] ?? exB02[0], // mass: tính khối lượng cân đồng hồ
        exB03[3] ?? exB03[0], // time: đổi đơn vị thời gian
        allExercises[3] ?? allExercises[0], // temp: quy trình đo nhiệt độ
        allExercises[4] ?? allExercises[1], // temp: đổi thang Kelvin
      ].filter(Boolean);
    } catch {
      return allExercises.slice(0, 6);
    }
  }

  if (lessonId === 'phy-g6-b10' && nodeId.endsWith('boss')) {
    // Composite checkpoint for Unit 1 (Lực trong đời sống): 6 questions across force concepts, representation, spring, gravity, friction, drag
    try {
      const [exB05, exB06, exB07, exB08, exB09] = await Promise.all([
        loadExercises('phy-g6-b05'),
        loadExercises('phy-g6-b06'),
        loadExercises('phy-g6-b07'),
        loadExercises('phy-g6-b08'),
        loadExercises('phy-g6-b09'),
      ]);
      return [
        exB05[4] ?? exB05[0], // b05: Lực tiếp xúc vs không tiếp xúc
        exB06[2] ?? exB06[0], // b06: Tính độ lớn lực theo tỉ xích
        exB07[3] ?? exB07[0], // b07: Tính độ dãn lò xo tỉ lệ thuận
        exB08[2] ?? exB08[0], // b08: Tính trọng lượng P = 10.m
        exB09[3] ?? exB09[0], // b09: Yếu tố ảnh hưởng lực ma sát
        allExercises[2] ?? allExercises[0], // b10: Hình dạng khí động học giảm lực cản
      ].filter(Boolean);
    } catch {
      return allExercises.slice(0, 6);
    }
  }

  if (lessonId === 'phy-g6-b16' && nodeId.endsWith('boss')) {
    // Composite checkpoint for Unit 2 (Năng lượng): 6 questions across energy transfer, forms, conservation, waste, renewables, saving
    try {
      const [exB11, exB12, exB13, exB14, exB15] = await Promise.all([
        loadExercises('phy-g6-b11'),
        loadExercises('phy-g6-b12'),
        loadExercises('phy-g6-b13'),
        loadExercises('phy-g6-b14'),
        loadExercises('phy-g6-b15'),
      ]);
      return [
        exB11[4] ?? exB11[0], // b11: Đổi đơn vị kJ sang J
        exB12[1] ?? exB12[0], // b12: Thế năng hấp dẫn của quả dừa trên cao
        exB13[2] ?? exB13[0], // b13: Định luật bảo toàn năng lượng
        exB14[0] ?? exB14[1], // b14: Năng lượng hao phí bóng đèn
        exB15[2] ?? exB15[0], // b15: Ưu điểm năng lượng tái tạo
        allExercises[5] ?? allExercises[0], // b16: Tính công suất tiết kiệm đèn LED
      ].filter(Boolean);
    } catch {
      return allExercises.slice(0, 6);
    }
  }

  if (lessonId === 'phy-g6-b20' && nodeId.endsWith('boss')) {
    // Composite checkpoint for Unit 3 (Trái Đất và bầu trời) & Graduation for Physics Grade 6:
    // 6 questions covering earth rotation, celestial bodies, moon phases, solar system, and galaxy
    try {
      const [exB17, exB18, exB19] = await Promise.all([
        loadExercises('phy-g6-b17'),
        loadExercises('phy-g6-b18'),
        loadExercises('phy-g6-b19'),
      ]);
      return [
        exB17[0] ?? exB17[1], // b17: Chiều tự quay Trái Đất từ Tây sang Đông
        exB17[2] ?? exB17[0], // b17: Ngôi sao tự phát sáng
        exB18[0] ?? exB18[1], // b18: Mặt Trăng phản xạ ánh sáng Mặt Trời
        exB18[2] ?? exB18[0], // b18: Thứ tự các pha Mặt Trăng
        exB19[1] ?? exB19[0], // b19: Sắp xếp 8 hành tinh từ gần ra xa
        allExercises[2] ?? allExercises[0], // b20: Năm ánh sáng đo khoảng cách
      ].filter(Boolean);
    } catch {
      return allExercises.slice(0, 6);
    }
  }

  if (lessonId === 'phy-g8-b05' && nodeId.endsWith('boss')) {
    // Composite checkpoint for Unit 1 (Khối lượng riêng và áp suất):
    try {
      const [exB01, exB02, exB03, exB04] = await Promise.all([
        loadExercises('phy-g8-b01'),
        loadExercises('phy-g8-b02'),
        loadExercises('phy-g8-b03'),
        loadExercises('phy-g8-b04'),
      ]);
      return [
        exB01[3] ?? exB01[0], // b01: Tính m từ D = m/V
        exB02[1] ?? exB02[0], // b02: Quy trình đo D sỏi
        exB03[3] ?? exB03[0], // b03: Tính p = F/S
        exB04[4] ?? exB04[0], // b04: Tính p chất lỏng = d.h
        allExercises[2] ?? allExercises[0], // b05: Điều kiện vật nổi
        allExercises[3] ?? allExercises[1], // b05: Tính lực đẩy Archimedes
      ].filter(Boolean);
    } catch {
      return allExercises.slice(0, 6);
    }
  }

  if (lessonId === 'phy-g8-b07' && nodeId.endsWith('boss')) {
    // Composite checkpoint for Unit 2 (Tác dụng làm quay của lực):
    try {
      const exB06 = await loadExercises('phy-g8-b06');
      return [
        exB06[1] ?? exB06[0], // b06: Định nghĩa moment lực
        exB06[3] ?? exB06[0], // b06: Cánh tay đòn d
        exB06[5] ?? exB06[0], // b06: Tính M = F.d
        allExercises[0] ?? allExercises[1], // b07: 3 thành phần đòn bẩy
        allExercises[2] ?? allExercises[0], // b07: Đòn bẩy lợi về lực
        allExercises[3] ?? allExercises[0], // b07: Tính lực F cân bằng
      ].filter(Boolean);
    } catch {
      return allExercises.slice(0, 6);
    }
  }

  if (lessonId === 'phy-g8-b13' && nodeId.endsWith('boss')) {
    // Composite checkpoint for Unit 3 (Điện):
    try {
      const [exB08, exB09, exB10, exB11, exB12] = await Promise.all([
        loadExercises('phy-g8-b08'),
        loadExercises('phy-g8-b09'),
        loadExercises('phy-g8-b10'),
        loadExercises('phy-g8-b11'),
        loadExercises('phy-g8-b12'),
      ]);
      return [
        exB08[2] ?? exB08[0], // b08: Tương tác 2 loại điện tích
        exB09[0] ?? exB09[1], // b09: Bản chất dòng điện kim loại
        exB10[2] ?? exB10[0], // b10: Chiều dòng điện quy ước
        exB11[2] ?? exB11[0], // b11: Tác dụng từ của dòng điện
        exB12[5] ?? exB12[0], // b12: Đọc thang đo ampe kế
        allExercises[0] ?? allExercises[1], // b13: Quy trình đo dòng điện
      ].filter(Boolean);
    } catch {
      return allExercises.slice(0, 6);
    }
  }

  if (lessonId === 'phy-g8-b17' && nodeId.endsWith('boss')) {
    // Composite checkpoint for Unit 4 (Nhiệt):
    try {
      const [exB14, exB15, exB16] = await Promise.all([
        loadExercises('phy-g8-b14'),
        loadExercises('phy-g8-b15'),
        loadExercises('phy-g8-b16'),
      ]);
      return [
        exB14[1] ?? exB14[0], // b14: Định nghĩa nội năng
        exB14[3] ?? exB14[0], // b14: Đổi nội năng bằng thực hiện công
        exB15[0] ?? exB15[1], // b15: Quy trình đo joulemeter
        exB16[0] ?? exB16[1], // b16: Dẫn nhiệt
        exB16[1] ?? exB16[2], // b16: Đối lưu
        allExercises[4] ?? allExercises[0], // b17: Chiều cong băng kép
      ].filter(Boolean);
    } catch {
      return allExercises.slice(0, 6);
    }
  }

  if (lessonId === 'phy-g9-b03' && nodeId.endsWith('boss')) {
    // Composite checkpoint for Unit 1 (Năng lượng cơ học): 6 questions across kinetic, potential, mechanical energy, conservation, work, power
    try {
      const [exB01, exB02] = await Promise.all([
        loadExercises('phy-g9-b01'),
        loadExercises('phy-g9-b02'),
      ]);
      return [
        exB01[4] ?? exB01[0], // b01: Tính động năng W_đ = 1/2 m v^2
        exB01[5] ?? exB01[1], // b01: Tính thế năng W_t = P.h
        exB02[4] ?? exB02[0], // b02: Cơ năng W = W_đ + W_t
        exB02[6] ?? exB02[1], // b02: Bảo toàn cơ năng tìm W_đ
        allExercises[3] ?? allExercises[0], // b03: Tính công A = F.s
        allExercises[5] ?? allExercises[1], // b03: Tính công suất P = A / t
      ].filter(Boolean);
    } catch {
      return allExercises.slice(0, 6);
    }
  }

  if (lessonId === 'phy-g9-b09' && nodeId.endsWith('boss')) {
    // Composite checkpoint for Unit 2 (Ánh sáng): 6 questions across refraction, total internal reflection, prism, lens, lab measurement, magnifying glass
    try {
      const [exB04, exB05, exB06, exB07, exB08] = await Promise.all([
        loadExercises('phy-g9-b04'),
        loadExercises('phy-g9-b05'),
        loadExercises('phy-g9-b06'),
        loadExercises('phy-g9-b07'),
        loadExercises('phy-g9-b08'),
      ]);
      return [
        exB04[1] ?? exB04[0], // b04: Khúc xạ từ không khí vào nước r < i
        exB05[2] ?? exB05[0], // b05: Điều kiện góc tới i >= i_gh
        exB06[3] ?? exB06[0], // b06: Thứ tự góc lệch màu đỏ ít nhất, tím nhiều nhất
        exB07[5] ?? exB07[0], // b07: Tính khoảng cách ảnh tại d = 2f
        exB08[3] ?? exB08[0], // b08: Thực hành tính f = D / 4
        allExercises[3] ?? allExercises[0], // b09: Tính số bội giác G = 25 / f
      ].filter(Boolean);
    } catch {
      return allExercises.slice(0, 6);
    }
  }

  if (lessonId === 'phy-g9-b12' && nodeId.endsWith('boss')) {
    // Composite checkpoint for Unit 3 (Điện): 6 questions across Ohm's law, wire resistance, series circuit, parallel circuit, electric power, energy
    try {
      const [exB10, exB11] = await Promise.all([
        loadExercises('phy-g9-b10'),
        loadExercises('phy-g9-b11'),
      ]);
      return [
        exB10[3] ?? exB10[0], // b10: Tính cường độ I = U / R
        exB10[7] ?? exB10[1], // b10: Tính điện trở tỉ lệ thuận chiều dài
        exB11[3] ?? exB11[0], // b11: Tính điện trở tương đương nối tiếp
        exB11[4] ?? exB11[1], // b11: Tính điện trở tương đương song song
        allExercises[3] ?? allExercises[0], // b12: Tính công suất P = U . I
        allExercises[4] ?? allExercises[1], // b12: Tính điện năng A = P . t
      ].filter(Boolean);
    } catch {
      return allExercises.slice(0, 6);
    }
  }

  if (lessonId === 'phy-g9-b14' && nodeId.endsWith('boss')) {
    // Composite checkpoint for Unit 4 (Điện từ): 6 questions across induction condition, AC current, generator, transmission loss, transformer
    try {
      const exB13 = await loadExercises('phy-g9-b13');
      return [
        exB13[0], // b13: Điều kiện cảm ứng điện từ
        exB13[1] ?? exB13[0], // b13: Bản chất dòng điện xoay chiều
        exB13[2] ?? exB13[0], // b13: Cấu tạo máy phát điện xoay chiều
        allExercises[1] ?? allExercises[0], // b14: Biện pháp giảm hao phí truyền tải
        allExercises[3] ?? allExercises[0], // b14: Tính toán máy biến thế U1/U2 = N1/N2
        allExercises[7] ?? allExercises[0], // b14: Tính công suất hao phí nhiệt P_hp
      ].filter(Boolean);
    } catch {
      return allExercises.slice(0, 6);
    }
  }

  if (lessonId === 'phy-g9-b16' && nodeId.endsWith('boss')) {
    // Composite checkpoint for Unit 5 (Năng lượng với cuộc sống) & Graduation for Physics Grade 9:
    // 6 questions covering sun energy cycle, fossil fuels, CO2 greenhouse effect, renewable definitions, wind/solar, and Net Zero 2050
    try {
      const exB15 = await loadExercises('phy-g9-b15');
      return [
        exB15[0], // b15: Nguồn gốc năng lượng Mặt Trời trên Trái Đất
        exB15[1] ?? exB15[0], // b15: Nhóm nhiên liệu hóa thạch
        exB15[3] ?? exB15[2], // b15: Tác hại khí thải CO2 hiệu ứng nhà kính
        allExercises[0], // b16: Định nghĩa năng lượng tái tạo
        allExercises[2] ?? allExercises[0], // b16: Pin quang điện chuyển quang năng thành điện năng
        allExercises[7] ?? allExercises[1], // b16: Cam kết Net Zero 2050 và chuyển dịch năng lượng xanh
      ].filter(Boolean);
    } catch {
      return allExercises.slice(0, 6);
    }
  }

  // For lessons with more than 7 questions (e.g. g7-b01, g7-b03, g7-b04),
  // limit to 6 questions per session to avoid heart exhaustion
  if (allExercises.length > 7) {
    return allExercises.slice(0, 6);
  }

  return allExercises;
}

import { TheoryContentSchema, type TheoryContent } from './schema/theory';
export type { TheoryContent };

const theoryCache = new Map<string, TheoryContent>();

/**
 * Load and validate micro-learning theory content for a given lesson.
 */
export async function loadTheory(lessonId: string): Promise<TheoryContent | null> {
  if (theoryCache.has(lessonId)) {
    return theoryCache.get(lessonId)!;
  }

  if (lessonId.startsWith('phy-')) {
    const physicsTheories = import.meta.glob('./physics/**/*.theory.json');
    const matchedPath = Object.keys(physicsTheories).find((p) => p.endsWith(`/${lessonId}.theory.json`));
    if (!matchedPath) return null;
    try {
      const module = (await physicsTheories[matchedPath]()) as { default: unknown };
      const raw: unknown = module.default;
      const result = TheoryContentSchema.safeParse(raw);
      if (!result.success) {
        console.error(`Theory in ${lessonId} failed validation:`, result.error.issues);
        throw new Error(`Invalid theory in ${lessonId}: ${result.error.issues[0]?.message}`);
      }
      theoryCache.set(lessonId, result.data);
      return result.data;
    } catch {
      return null;
    }
  }

  if (lessonId.startsWith('bio-')) {
    const bioTheories = import.meta.glob('./biology/**/*.theory.json');
    const matchedPath = Object.keys(bioTheories).find((p) => p.endsWith(`/${lessonId}.theory.json`));
    if (!matchedPath) return null;
    try {
      const module = (await bioTheories[matchedPath]()) as { default: unknown };
      const raw: unknown = module.default;
      const result = TheoryContentSchema.safeParse(raw);
      if (!result.success) {
        console.error(`Theory in ${lessonId} failed validation:`, result.error.issues);
        throw new Error(`Invalid theory in ${lessonId}: ${result.error.issues[0]?.message}`);
      }
      theoryCache.set(lessonId, result.data);
      return result.data;
    } catch {
      return null;
    }
  }

  const match = lessonId.match(/^g(\d)-b\d{2}$/);
  if (!match) return null;

  const grade = match[1];

  try {
    const module = await import(`./theories/g${grade}/${lessonId}.json`);
    const raw: unknown = module.default;

    const result = TheoryContentSchema.safeParse(raw);
    if (!result.success) {
      console.error(`Theory in ${lessonId} failed validation:`, result.error.issues);
      throw new Error(`Invalid theory in ${lessonId}: ${result.error.issues[0]?.message}`);
    }

    theoryCache.set(lessonId, result.data);
    return result.data;
  } catch (err) {
    return null;
  }
}

/** Clear the exercise and theory caches (useful for testing) */
export function clearExerciseCache(): void {
  exerciseCache.clear();
  theoryCache.clear();
}

