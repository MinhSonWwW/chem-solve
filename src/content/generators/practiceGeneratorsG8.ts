/**
 * Grade 8 number generators for practice units (SGK KHTN 8 Kết nối tri thức):
 * mol, gas volume (24,79 L/mol at 25 °C, 1 bar), gas density, C%, CM, mass conservation, stoichiometry,
 * density, pressure, liquid pressure, Archimedes force, moment, lever, electric units, heat of water.
 */
import type { Exercise } from '@/content/schema/exercise';
import { numberExercise, pick, round, vn, type Rand } from './numberKit';
import { molecularMass } from './practiceGeneratorsG7';
import { generateBloodTransfusionExercise, generateDietaryCaloriesExercise, generatePopulationDensityExercise } from './biologyGenerators';

const VM = 24.79;
const SUBSTANCES = ['Fe', 'Cu', 'Mg', 'Zn', 'Al', 'NaCl', 'H2O', 'CaCO3', 'NaOH', 'CuSO4', 'CO2', 'H2SO4'];
const GASES = ['O2', 'H2', 'CO2', 'N2', 'SO2', 'NH3', 'CH4'];
const MATERIALS: Array<[string, number]> = [['nước', 1000], ['sắt', 7800], ['nhôm', 2700], ['đồng', 8900], ['dầu ăn', 800], ['gỗ', 600]];
const LIQUIDS: Array<[string, number]> = [['nước', 10000], ['dầu', 8000], ['nước biển', 10300]];

export const G8_GENERATORS: Record<string, (r: Rand) => Exercise> = {
  'mol-mass': (r) => {
    const f = pick(SUBSTANCES, r);
    const M = molecularMass(f);
    const n = pick([0.1, 0.2, 0.25, 0.5, 1.5, 2], r);
    if (r() < 0.5) {
      return numberExercise({
        prompt: `Tính số mol của ${vn(n * M)} g [[${f}]]. Biết khối lượng mol của [[${f}]] là ${vn(M)} g/mol.`,
        value: n, unit: 'mol', hint: 'Số mol bằng khối lượng chia cho khối lượng mol.', formula: 'n = m : M',
        work: `n = ${vn(n * M)} : ${vn(M)} = ${vn(n)} mol.`, trap: [n * M * M], skill: 'mol-from-mass',
      });
    }
    return numberExercise({
      prompt: `Tính khối lượng của ${vn(n)} mol [[${f}]]. Biết khối lượng mol của [[${f}]] là ${vn(M)} g/mol.`,
      value: n * M, unit: 'g', hint: 'Khối lượng bằng số mol nhân khối lượng mol.', formula: 'm = n × M',
      work: `m = ${vn(n)} × ${vn(M)} = ${vn(n * M)} g.`, trap: [M / n], skill: 'mass-from-mol',
    });
  },

  'gas-volume': (r) => {
    const g = pick(GASES, r);
    const n = pick([0.1, 0.2, 0.25, 0.5, 2], r);
    if (r() < 0.5) {
      return numberExercise({
        prompt: `Tính thể tích của ${vn(n)} mol khí [[${g}]] ở điều kiện chuẩn (25 °C, 1 bar).`,
        value: n * VM, unit: 'L', hint: 'Ở điều kiện chuẩn, 1 mol khí chiếm 24,79 L.', formula: 'V = n × 24,79',
        work: `V = ${vn(n)} × 24,79 = ${vn(n * VM)} L.`, trap: [n * 22.4], skill: 'gas-volume-from-mol',
      });
    }
    return numberExercise({
      prompt: `Ở điều kiện chuẩn (25 °C, 1 bar), ${vn(n * VM)} L khí [[${g}]] có bao nhiêu mol?`,
      value: n, unit: 'mol', hint: 'Chia thể tích cho 24,79 L/mol.', formula: 'n = V : 24,79',
      work: `n = ${vn(n * VM)} : 24,79 = ${vn(n)} mol.`, trap: [n * VM * VM], skill: 'gas-volume-from-mol',
    });
  },

  'gas-density': (r) => {
    const a = pick(GASES, r);
    const MA = molecularMass(a);
    if (r() < 0.5) {
      return numberExercise({
        prompt: `Tính tỉ khối của khí [[${a}]] so với không khí (M không khí = 29 g/mol). Làm tròn đến 2 chữ số thập phân. Biết M([[${a}]]) = ${vn(MA)} g/mol.`,
        value: round(MA / 29, 2), hint: 'Tỉ khối so với không khí bằng khối lượng mol của khí chia cho 29.', formula: 'd = M : 29',
        work: `d = ${vn(MA)} : 29 ≈ ${vn(round(MA / 29, 2))}.`, trap: [round(29 / MA, 2)], skill: 'gas-density-air',
      });
    }
    const b = pick(GASES.filter((x) => x !== a), r);
    const MB = molecularMass(b);
    return numberExercise({
      prompt: `Tính tỉ khối của khí [[${a}]] so với khí [[${b}]]. Làm tròn đến 2 chữ số thập phân. Biết M([[${a}]]) = ${vn(MA)}, M([[${b}]]) = ${vn(MB)} g/mol.`,
      value: round(MA / MB, 2), hint: 'Lấy khối lượng mol của khí thứ nhất chia cho khí thứ hai.', formula: 'd(A/B) = M(A) : M(B)',
      work: `d = ${vn(MA)} : ${vn(MB)} ≈ ${vn(round(MA / MB, 2))}.`, trap: [round(MB / MA, 2)], skill: 'gas-density',
    });
  },

  'c-percent': (r) => {
    const mct = pick([5, 10, 15, 20, 25, 30], r);
    const mdd = pick([50, 100, 200, 250], r);
    if (r() < 0.5) {
      const water = mdd - mct;
      return numberExercise({
        prompt: `Hòa tan ${mct} g đường vào ${water} g nước. Tính nồng độ phần trăm của dung dịch.`,
        value: round((mct / mdd) * 100, 2), unit: '%', hint: 'Khối lượng dung dịch = khối lượng chất tan + khối lượng nước.', formula: 'C% = m chất tan : m dung dịch × 100%',
        work: `m dd = ${mct} + ${water} = ${mdd} g; C% = ${mct} : ${mdd} × 100% = ${vn(round((mct / mdd) * 100, 2))}%.`,
        trap: [round((mct / water) * 100, 2)], skill: 'solution-concentration',
      });
    }
    const c = pick([5, 10, 20, 25], r);
    return numberExercise({
      prompt: `Cần bao nhiêu gam muối để pha ${mdd} g dung dịch nước muối ${c}%?`,
      value: (mdd * c) / 100, unit: 'g', hint: 'Khối lượng chất tan bằng C% nhân khối lượng dung dịch.', formula: 'm chất tan = C% × m dung dịch : 100',
      work: `m = ${c} × ${mdd} : 100 = ${vn((mdd * c) / 100)} g.`, trap: [mdd * c], skill: 'solution-concentration',
    });
  },

  'c-molar': (r) => {
    const n = pick([0.1, 0.2, 0.25, 0.5, 1], r);
    const vml = pick([100, 200, 250, 500], r);
    const v = vml / 1000;
    if (r() < 0.5) {
      return numberExercise({
        prompt: `Hòa tan ${vn(n)} mol [[NaCl]] vào nước được ${vml} mL dung dịch. Tính nồng độ mol (CM) của dung dịch.`,
        value: n / v, unit: 'M', hint: 'Đổi thể tích sang lít trước khi tính.', formula: 'CM = n : V (V tính bằng L)',
        work: `V = ${vml} mL = ${vn(v)} L; CM = ${vn(n)} : ${vn(v)} = ${vn(n / v)} M.`, trap: [n / vml], skill: 'solution-concentration',
      });
    }
    const cm = pick([0.1, 0.2, 0.5, 1, 2], r);
    return numberExercise({
      prompt: `Cần bao nhiêu mol chất tan để pha ${vml} mL dung dịch ${vn(cm)} M?`,
      value: cm * v, unit: 'mol', hint: 'Số mol bằng nồng độ mol nhân thể tích (lít).', formula: 'n = CM × V',
      work: `n = ${vn(cm)} × ${vn(v)} = ${vn(cm * v)} mol.`, trap: [cm * vml], skill: 'solution-concentration',
    });
  },

  'mass-conservation': (r) => {
    const cases: Array<[string, string, string, number, number]> = [
      ['magnesium', 'oxygen', 'magnesium oxide', 2.4, 1.6],
      ['iron', 'sulfur', 'iron(II) sulfide', 5.6, 3.2],
      ['copper', 'oxygen', 'copper(II) oxide', 6.4, 1.6],
      ['carbon', 'oxygen', 'carbon dioxide', 1.2, 3.2],
    ];
    const [a, b, c, ma, mb] = pick(cases, r);
    const k = pick([1, 2, 3], r);
    const A = ma * k, Bm = mb * k;
    if (r() < 0.5) {
      return numberExercise({
        prompt: `Cho ${vn(A)} g ${a} phản ứng vừa đủ với ${vn(Bm)} g ${b} tạo thành ${c}. Tính khối lượng ${c} thu được.`,
        value: A + Bm, unit: 'g', hint: 'Tổng khối lượng các chất tham gia bằng tổng khối lượng sản phẩm.', formula: 'm sản phẩm = m chất A + m chất B',
        work: `m = ${vn(A)} + ${vn(Bm)} = ${vn(A + Bm)} g.`, trap: [A - Bm], skill: 'mass-conservation-calc',
      });
    }
    return numberExercise({
      prompt: `Cho ${vn(A)} g ${a} phản ứng vừa đủ với ${b}, thu được ${vn(A + Bm)} g ${c}. Tính khối lượng ${b} đã phản ứng.`,
      value: Bm, unit: 'g', hint: 'Áp dụng định luật bảo toàn khối lượng.', formula: 'm B = m sản phẩm − m A',
      work: `m = ${vn(A + Bm)} − ${vn(A)} = ${vn(Bm)} g.`, trap: [A + Bm + A], skill: 'mass-conservation-calc',
    });
  },

  stoich: (r) => {
    // M + 2HCl -> MCl2 + H2 (Mg, Zn, Fe)
    const metals: Array<[string, number]> = [['Mg', 24], ['Zn', 65], ['Fe', 56]];
    const [m, M] = pick(metals, r);
    const n = pick([0.05, 0.1, 0.2, 0.25], r);
    if (r() < 0.5) {
      return numberExercise({
        prompt: `Cho ${vn(n * M)} g [[${m}]] tác dụng hết với dung dịch [[HCl]]: [[${m}]] + 2[[HCl]] → [[${m}Cl2]] + [[H2]]. Tính thể tích khí [[H2]] thu được ở điều kiện chuẩn (24,79 L/mol).`,
        value: round(n * VM, 4), unit: 'L', hint: 'Tính số mol kim loại, theo phương trình số mol H2 bằng số mol kim loại.', formula: 'n H2 = n kim loại; V = n × 24,79',
        work: `n(${m}) = ${vn(n * M)} : ${M} = ${vn(n)} mol = n(H2); V = ${vn(n)} × 24,79 = ${vn(n * VM)} L.`,
        trap: [2 * n * VM], skill: 'stoichiometry-steps',
      });
    }
    return numberExercise({
      prompt: `Cho ${vn(n * M)} g [[${m}]] tác dụng hết với dung dịch [[HCl]]: [[${m}]] + 2[[HCl]] → [[${m}Cl2]] + [[H2]]. Tính số mol [[HCl]] đã phản ứng.`,
      value: 2 * n, unit: 'mol', hint: 'Theo phương trình, số mol HCl gấp đôi số mol kim loại.', formula: 'n HCl = 2 × n kim loại',
      work: `n(${m}) = ${vn(n * M)} : ${M} = ${vn(n)} mol; n(HCl) = 2 × ${vn(n)} = ${vn(2 * n)} mol.`, trap: [n], skill: 'stoichiometry-steps',
    });
  },

  density: (r) => {
    const [name, D] = pick(MATERIALS, r);
    const V = pick([0.001, 0.002, 0.005, 0.01, 0.02, 0.5], r);
    const mode = r();
    if (mode < 0.4) {
      return numberExercise({
        prompt: `Một khối ${name} có thể tích ${vn(V)} m³. Biết khối lượng riêng của ${name} là ${D} kg/m³. Tính khối lượng của khối ${name}.`,
        value: D * V, unit: 'kg', hint: 'Khối lượng bằng khối lượng riêng nhân thể tích.', formula: 'm = D × V',
        work: `m = ${D} × ${vn(V)} = ${vn(D * V)} kg.`, trap: [D / V], skill: 'density-calc',
      });
    }
    if (mode < 0.7) {
      return numberExercise({
        prompt: `Một vật có khối lượng ${vn(D * V)} kg và thể tích ${vn(V)} m³. Tính khối lượng riêng của vật.`,
        value: D, unit: 'kg/m³', hint: 'Khối lượng riêng bằng khối lượng chia cho thể tích.', formula: 'D = m : V',
        work: `D = ${vn(D * V)} : ${vn(V)} = ${D} kg/m³.`, trap: [D * V * V], skill: 'density-calc',
      });
    }
    return numberExercise({
      prompt: `Một khối ${name} có khối lượng ${vn(D * V)} kg. Biết khối lượng riêng của ${name} là ${D} kg/m³. Tính thể tích của khối đó.`,
      value: V, unit: 'm³', hint: 'Thể tích bằng khối lượng chia cho khối lượng riêng.', formula: 'V = m : D',
      work: `V = ${vn(D * V)} : ${D} = ${vn(V)} m³.`, trap: [D * V * D], skill: 'density-calc',
    });
  },

  pressure: (r) => {
    const F = pick([200, 400, 500, 600, 1000, 20000], r);
    const S = pick([0.02, 0.04, 0.05, 0.1, 0.5], r);
    if (r() < 0.6) {
      return numberExercise({
        prompt: `Một áp lực ${F} N tác dụng vuông góc lên diện tích ${vn(S)} m². Tính áp suất.`,
        value: F / S, unit: 'Pa', hint: 'Áp suất bằng áp lực chia cho diện tích bị ép.', formula: 'p = F : S',
        work: `p = ${F} : ${vn(S)} = ${vn(F / S)} Pa.`, trap: [F * S], skill: 'pressure-calc',
      });
    }
    return numberExercise({
      prompt: `Áp suất do một vật gây ra trên mặt sàn là ${vn(F / S)} Pa, diện tích tiếp xúc ${vn(S)} m². Tính áp lực của vật lên sàn.`,
      value: F, unit: 'N', hint: 'Áp lực bằng áp suất nhân diện tích.', formula: 'F = p × S',
      work: `F = ${vn(F / S)} × ${vn(S)} = ${F} N.`, trap: [F / S / S], skill: 'pressure-calc',
    });
  },

  'liquid-pressure': (r) => {
    const [name, d] = pick(LIQUIDS, r);
    const h = pick([0.5, 1.2, 2, 5, 10, 20], r);
    return numberExercise({
      prompt: `Tính áp suất của ${name} tại điểm ở độ sâu ${vn(h)} m. Biết trọng lượng riêng của ${name} là ${d} N/m³.`,
      value: d * h, unit: 'Pa', hint: 'Áp suất chất lỏng bằng trọng lượng riêng nhân độ sâu.', formula: 'p = d × h',
      work: `p = ${d} × ${vn(h)} = ${vn(d * h)} Pa.`, trap: [d / h], skill: 'liquid-pressure-calc',
    });
  },

  archimedes: (r) => {
    const [name, d] = pick(LIQUIDS, r);
    const V = pick([0.0005, 0.001, 0.002, 0.005, 0.01], r);
    return numberExercise({
      prompt: `Một vật có thể tích ${vn(V)} m³ được nhúng chìm hoàn toàn trong ${name} (trọng lượng riêng ${d} N/m³). Tính lực đẩy Archimedes tác dụng lên vật.`,
      value: d * V, unit: 'N', hint: 'Lực đẩy bằng trọng lượng riêng của chất lỏng nhân thể tích phần chìm.', formula: 'F_A = d × V',
      work: `F_A = ${d} × ${vn(V)} = ${vn(d * V)} N.`, trap: [d / V], skill: 'archimedes-calc',
    });
  },

  moment: (r) => {
    const F = pick([10, 20, 25, 40, 50], r);
    const dcm = pick([10, 20, 25, 30, 50], r);
    return numberExercise({
      prompt: `Một lực ${F} N tác dụng vuông góc lên cán cờ lê, cách trục quay ${dcm} cm. Tính moment lực.`,
      value: F * (dcm / 100), unit: 'N·m', hint: 'Đổi cánh tay đòn sang mét.', formula: 'M = F × d',
      work: `d = ${dcm} cm = ${vn(dcm / 100)} m; M = ${F} × ${vn(dcm / 100)} = ${vn(F * (dcm / 100))} N·m.`,
      trap: [F * dcm], skill: 'moment-calc',
    });
  },

  lever: (r) => {
    const F2 = pick([100, 200, 300, 600], r);
    const d2 = pick([0.2, 0.25, 0.3, 0.5], r);
    const d1 = pick([0.5, 1, 1.2, 1.5], r);
    return numberExercise({
      prompt: `Dùng đòn bẩy nâng vật nặng ${F2} N đặt cách điểm tựa ${vn(d2)} m. Lực tác dụng cách điểm tựa ${vn(d1)} m. Cần lực tối thiểu bao nhiêu niutơn để đòn bẩy cân bằng?`,
      value: (F2 * d2) / d1, unit: 'N', hint: 'Đòn bẩy cân bằng khi F₁ × d₁ = F₂ × d₂.', formula: 'F₁ = F₂ × d₂ : d₁',
      work: `F₁ = ${F2} × ${vn(d2)} : ${vn(d1)} = ${vn((F2 * d2) / d1)} N.`, trap: [(F2 * d1) / d2], skill: 'lever-calc',
    });
  },

  'electric-units': (r) => {
    const mode = r();
    if (mode < 0.35) {
      const ma = pick([50, 150, 250, 350, 1200], r);
      return numberExercise({
        prompt: `Đổi ${ma} mA sang đơn vị ampe (A).`,
        value: ma / 1000, unit: 'A', hint: '1 A = 1000 mA.', formula: 'I (A) = I (mA) : 1000',
        work: `${ma} : 1000 = ${vn(ma / 1000)} A.`, trap: [ma * 1000], skill: 'current-voltage-units',
      });
    }
    if (mode < 0.7) {
      const a = pick([0.2, 0.45, 1.5, 2], r);
      return numberExercise({
        prompt: `Đổi ${vn(a)} A sang đơn vị miliampe (mA).`,
        value: a * 1000, unit: 'mA', hint: '1 A = 1000 mA.', formula: 'I (mA) = I (A) × 1000',
        work: `${vn(a)} × 1000 = ${vn(a * 1000)} mA.`, trap: [a / 1000], skill: 'current-voltage-units',
      });
    }
    const kv = pick([0.22, 1.5, 2.5, 22, 110], r);
    return numberExercise({
      prompt: `Đổi ${vn(kv)} kV sang đơn vị vôn (V).`,
      value: kv * 1000, unit: 'V', hint: '1 kV = 1000 V.', formula: 'U (V) = U (kV) × 1000',
      work: `${vn(kv)} × 1000 = ${vn(kv * 1000)} V.`, trap: [kv / 1000], skill: 'current-voltage-units',
    });
  },

  'heat-water': (r) => {
    const g = pick([100, 200, 250, 500], r);
    const dt = pick([5, 10, 20, 25], r);
    const Q = (g / 1000) * 4200 * dt;
    return numberExercise({
      prompt: `Tính nhiệt lượng cần cung cấp để ${g} g nước tăng thêm ${dt} °C. Biết nhiệt dung riêng của nước là 4200 J/(kg·K).`,
      value: Q, unit: 'J', hint: 'Đổi khối lượng nước sang kilôgam.', formula: 'Q = m × c × Δt',
      work: `Q = ${vn(g / 1000)} × 4200 × ${dt} = ${vn(Q)} J.`, trap: [g * 4200 * dt], skill: 'heat-calc',
    });
  },

  // Biology (existing generators)
  'population-density': () => generatePopulationDensityExercise('p'),
  'dietary-calories': () => generateDietaryCaloriesExercise('p'),
  'blood-transfusion': () => generateBloodTransfusionExercise('p'),
};
