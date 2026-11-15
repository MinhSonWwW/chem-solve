/**
 * Grade 7 number generators for practice units (SGK KHTN 7 Kết nối tri thức):
 * speed, safe distance, sound, echo, frequency, reflection, plane mirror, atoms, molecular mass,
 * mass percentage, daily water need.
 */
import type { Exercise } from '@/content/schema/exercise';
import { numberExercise, pick, round, vn, type Rand } from './numberKit';

const ATOMIC: Record<string, number> = { H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, S: 32, Cl: 35.5, K: 39, Ca: 40, Fe: 56, Cu: 64, Zn: 65 };

/** Atom counts of a formula such as Ca(OH)2 or Al2(SO4)3. */
export function atomCounts(formula: string): Record<string, number> {
  const counts: Record<string, number> = {};
  const add = (el: string, n: number) => (counts[el] = (counts[el] ?? 0) + n);
  const re = /\(([^()]+)\)(\d*)|([A-Z][a-z]?)(\d*)/g;
  for (const m of formula.matchAll(re)) {
    if (m[1]) {
      const k = Number(m[2] || 1);
      for (const [el, n] of Object.entries(atomCounts(m[1]))) add(el, n * k);
    } else add(m[3], Number(m[4] || 1));
  }
  return counts;
}
export const molecularMass = (formula: string) =>
  round(Object.entries(atomCounts(formula)).reduce((s, [el, n]) => s + ATOMIC[el] * n, 0), 2);
const massList = (formula: string) =>
  Object.keys(atomCounts(formula))
    .map((el) => `${el} = ${vn(ATOMIC[el])}`)
    .join(', ');

const FORMULAS = ['H2O', 'CO2', 'NH3', 'CH4', 'SO2', 'NaCl', 'CaCO3', 'H2SO4', 'Fe2O3', 'MgO', 'HCl', 'CuO', 'NaOH', 'Al2O3', 'Ca(OH)2', 'KCl', 'ZnO', 'CuSO4'];
const PERCENT_CASES: Array<[string, string]> = [
  ['CuO', 'Cu'], ['MgO', 'Mg'], ['Fe2O3', 'Fe'], ['CaCO3', 'Ca'], ['SO2', 'S'], ['NaOH', 'Na'], ['CO2', 'O'], ['H2O', 'H'], ['NH3', 'N'], ['Al2O3', 'Al'],
];
const ATOMS: Array<[string, string, number, number]> = [
  ['carbon', 'C', 6, 6], ['nitrogen', 'N', 7, 7], ['oxygen', 'O', 8, 8], ['sodium', 'Na', 11, 12], ['magnesium', 'Mg', 12, 12],
  ['aluminium', 'Al', 13, 14], ['chlorine', 'Cl', 17, 18], ['potassium', 'K', 19, 20], ['calcium', 'Ca', 20, 20],
];

export const G7_GENERATORS: Record<string, (r: Rand) => Exercise> = {
  speed: (r) => {
    const mode = r();
    if (mode < 0.35) {
      const v = pick([30, 36, 40, 45, 50, 54, 60, 72], r);
      const t = pick([0.5, 1.5, 2, 2.5, 3], r);
      return numberExercise({
        prompt: `Một xe đi quãng đường ${vn(v * t)} km hết ${vn(t)} giờ. Tốc độ của xe là bao nhiêu km/h?`,
        value: v, unit: 'km/h', hint: 'Tốc độ bằng quãng đường chia cho thời gian.', formula: 'v = s : t',
        work: `v = ${vn(v * t)} : ${vn(t)} = ${v} km/h.`, trap: [v * t * t], skill: 'speed-calc',
      });
    }
    if (mode < 0.7) {
      const v = pick([12, 15, 40, 45, 60, 80], r);
      const t = pick([0.5, 1.5, 2, 3, 4], r);
      return numberExercise({
        prompt: `Một người đi xe với tốc độ ${v} km/h trong ${vn(t)} giờ. Quãng đường đi được là bao nhiêu km?`,
        value: v * t, unit: 'km', hint: 'Quãng đường bằng tốc độ nhân thời gian.', formula: 's = v × t',
        work: `s = ${v} × ${vn(t)} = ${vn(v * t)} km.`, trap: [v / t], skill: 'speed-calc',
      });
    }
    const v = pick([2, 4, 5, 10, 15, 20], r);
    const t = pick([10, 20, 30, 60, 120], r);
    return numberExercise({
      prompt: `Một vật chuyển động với tốc độ ${v} m/s trên quãng đường ${v * t} m. Thời gian chuyển động là bao nhiêu giây?`,
      value: t, unit: 's', hint: 'Thời gian bằng quãng đường chia cho tốc độ.', formula: 't = s : v',
      work: `t = ${v * t} : ${v} = ${t} s.`, trap: [v * t * v], skill: 'speed-calc',
    });
  },

  'speed-convert': (r) => {
    if (r() < 0.5) {
      const kmh = pick([18, 36, 54, 72, 90, 108], r);
      return numberExercise({
        prompt: `Đổi tốc độ ${kmh} km/h sang đơn vị m/s.`,
        value: kmh / 3.6, unit: 'm/s', hint: '1 km/h = 1000 m : 3600 s.', formula: 'v (m/s) = v (km/h) : 3,6',
        work: `${kmh} : 3,6 = ${vn(kmh / 3.6)} m/s.`, trap: [kmh * 3.6], skill: 'speed-unit-convert',
      });
    }
    const ms = pick([5, 10, 15, 20, 25], r);
    return numberExercise({
      prompt: `Đổi tốc độ ${ms} m/s sang đơn vị km/h.`,
      value: ms * 3.6, unit: 'km/h', hint: '1 m/s = 3,6 km/h.', formula: 'v (km/h) = v (m/s) × 3,6',
      work: `${ms} × 3,6 = ${vn(ms * 3.6)} km/h.`, trap: [ms / 3.6], skill: 'speed-unit-convert',
    });
  },

  'safe-distance': (r) => {
    const kmh = pick([36, 54, 72, 90, 108], r);
    const sec = pick([2, 3], r);
    return numberExercise({
      prompt: `Xe chạy với tốc độ ${kmh} km/h. Theo quy tắc giữ khoảng cách ${sec} giây, khoảng cách an toàn tối thiểu với xe phía trước là bao nhiêu mét?`,
      value: (kmh / 3.6) * sec, unit: 'm', hint: 'Đổi tốc độ sang m/s rồi nhân với số giây.', formula: `d = v (m/s) × ${sec}`,
      work: `v = ${kmh} : 3,6 = ${vn(kmh / 3.6)} m/s; d = ${vn(kmh / 3.6)} × ${sec} = ${vn((kmh / 3.6) * sec)} m.`,
      trap: [kmh * sec], skill: 'safe-distance-calc',
    });
  },

  'sound-distance': (r) => {
    const t = pick([0.5, 1, 1.5, 2, 3, 4], r);
    if (r() < 0.5) {
      return numberExercise({
        prompt: `Thấy tia chớp, ${vn(t)} giây sau mới nghe tiếng sấm. Biết âm truyền trong không khí với tốc độ 340 m/s. Chỗ sét đánh cách người quan sát bao nhiêu mét?`,
        value: 340 * t, unit: 'm', hint: 'Ánh sáng đến gần như tức thì; thời gian chênh lệch là thời gian âm truyền.', formula: 's = v × t',
        work: `s = 340 × ${vn(t)} = ${vn(340 * t)} m.`, trap: [340 / t, (340 * t) / 2], skill: 'sound-speed-calc',
      });
    }
    const d = pick([340, 680, 1020, 1700], r);
    return numberExercise({
      prompt: `Âm truyền trong không khí với tốc độ 340 m/s. Âm đi hết quãng đường ${d} m trong bao lâu (giây)?`,
      value: d / 340, unit: 's', hint: 'Thời gian bằng quãng đường chia cho tốc độ.', formula: 't = s : v',
      work: `t = ${d} : 340 = ${vn(d / 340)} s.`, trap: [d * 340], skill: 'sound-speed-calc',
    });
  },

  echo: (r) => {
    if (r() < 0.6) {
      const t = pick([0.4, 0.8, 1, 1.2, 2, 3], r);
      return numberExercise({
        prompt: `Một người hét to trước vách núi, sau ${vn(t)} giây nghe thấy tiếng vang. Tốc độ âm trong không khí là 340 m/s. Vách núi cách người đó bao nhiêu mét?`,
        value: (340 * t) / 2, unit: 'm', hint: 'Âm đi đến vách núi rồi dội lại: quãng đường âm đi gấp đôi khoảng cách.', formula: 'd = v × t : 2',
        work: `d = 340 × ${vn(t)} : 2 = ${vn((340 * t) / 2)} m.`, trap: [340 * t], skill: 'echo-calc',
      });
    }
    const t = pick([0.4, 1, 2, 4], r);
    return numberExercise({
      prompt: `Tàu phát siêu âm xuống đáy biển, sau ${vn(t)} giây thu được âm phản xạ. Tốc độ âm trong nước biển là 1500 m/s. Độ sâu của biển là bao nhiêu mét?`,
      value: (1500 * t) / 2, unit: 'm', hint: 'Âm đi xuống đáy biển rồi dội lên.', formula: 'h = v × t : 2',
      work: `h = 1500 × ${vn(t)} : 2 = ${vn((1500 * t) / 2)} m.`, trap: [1500 * t], skill: 'echo-calc',
    });
  },

  frequency: (r) => {
    const f = pick([20, 50, 100, 200, 440], r);
    const t = pick([2, 5, 10], r);
    if (r() < 0.5) {
      return numberExercise({
        prompt: `Một vật thực hiện ${f * t} dao động trong ${t} giây. Tần số dao động của vật là bao nhiêu Hz?`,
        value: f, unit: 'Hz', hint: 'Tần số là số dao động trong một giây.', formula: 'f = số dao động : thời gian',
        work: `f = ${f * t} : ${t} = ${f} Hz.`, trap: [f * t * t], skill: 'frequency-calc',
      });
    }
    return numberExercise({
      prompt: `Một dây đàn dao động với tần số ${f} Hz. Trong ${t} giây dây đàn thực hiện bao nhiêu dao động?`,
      value: f * t, hint: 'Mỗi giây dây thực hiện f dao động.', formula: 'số dao động = f × t',
      work: `${f} × ${t} = ${f * t} dao động.`, trap: [f / t], skill: 'frequency-calc',
    });
  },

  'reflection-angle': (r) => {
    const mode = r();
    if (mode < 0.35) {
      const i = pick([20, 30, 35, 45, 50, 60], r);
      return numberExercise({
        prompt: `Chiếu tia sáng tới gương phẳng với góc tới ${i}°. Góc phản xạ bằng bao nhiêu độ?`,
        value: i, unit: '°', hint: 'Theo định luật phản xạ, góc phản xạ bằng góc tới.', formula: "i' = i",
        work: `i' = i = ${i}°.`, trap: [90 - i, 2 * i], skill: 'reflection-law',
      });
    }
    if (mode < 0.7) {
      const a = pick([20, 30, 40, 50, 60], r);
      return numberExercise({
        prompt: `Tia sáng tới hợp với mặt gương phẳng một góc ${a}°. Góc phản xạ bằng bao nhiêu độ?`,
        value: 90 - a, unit: '°', hint: 'Góc tới đo từ pháp tuyến, không đo từ mặt gương.', formula: "i = 90° − góc với mặt gương; i' = i",
        work: `i = 90° − ${a}° = ${90 - a}°, nên i' = ${90 - a}°.`, trap: [a], skill: 'reflection-law',
      });
    }
    const b = pick([40, 60, 80, 100, 120], r);
    return numberExercise({
      prompt: `Góc hợp bởi tia tới và tia phản xạ trên gương phẳng là ${b}°. Góc tới bằng bao nhiêu độ?`,
      value: b / 2, unit: '°', hint: 'Pháp tuyến chia đôi góc giữa tia tới và tia phản xạ.', formula: 'i = góc giữa hai tia : 2',
      work: `i = ${b}° : 2 = ${b / 2}°.`, trap: [b, 90 - b / 2], skill: 'reflection-law',
    });
  },

  'mirror-image': (r) => {
    const mode = r();
    if (mode < 0.4) {
      const d = pick([0.5, 1, 1.5, 2, 2.5, 3], r);
      return numberExercise({
        prompt: `Một người đứng cách gương phẳng ${vn(d)} m. Người đó cách ảnh của mình bao nhiêu mét?`,
        value: 2 * d, unit: 'm', hint: 'Ảnh cách gương một khoảng bằng vật cách gương.', formula: 'khoảng cách người – ảnh = 2 × d',
        work: `2 × ${vn(d)} = ${vn(2 * d)} m.`, trap: [d], skill: 'plane-mirror-image',
      });
    }
    if (mode < 0.75) {
      const d = pick([2, 2.5, 3, 4], r);
      const x = pick([0.5, 1], r);
      return numberExercise({
        prompt: `Bạn An đứng cách gương phẳng ${vn(d)} m rồi tiến lại gần gương thêm ${vn(x)} m. Lúc này An cách ảnh của mình bao nhiêu mét?`,
        value: 2 * (d - x), unit: 'm', hint: 'Tính khoảng cách mới tới gương trước, rồi nhân đôi.', formula: 'khoảng cách = 2 × (d − x)',
        work: `Khoảng cách tới gương: ${vn(d)} − ${vn(x)} = ${vn(d - x)} m; khoảng cách tới ảnh: 2 × ${vn(d - x)} = ${vn(2 * (d - x))} m.`,
        trap: [d - x, 2 * d - x], skill: 'plane-mirror-image',
      });
    }
    const h = pick([12, 15, 20, 25, 160], r);
    return numberExercise({
      prompt: `Một vật cao ${h} cm đặt thẳng đứng trước gương phẳng. Ảnh của vật cao bao nhiêu cm?`,
      value: h, unit: 'cm', hint: 'Ảnh tạo bởi gương phẳng lớn bằng vật.', formula: 'h ảnh = h vật',
      work: `Ảnh cao bằng vật: ${h} cm.`, trap: [2 * h, h / 2], skill: 'plane-mirror-image',
    });
  },

  'atom-particles': (r) => {
    const [name, sym, p, n] = pick(ATOMS, r);
    if (r() < 0.5) {
      return numberExercise({
        prompt: `Nguyên tử ${name} ([[${sym}]]) có ${p} proton và ${n} neutron. Coi khối lượng mỗi proton và neutron là 1 amu, khối lượng electron không đáng kể. Khối lượng nguyên tử là bao nhiêu amu?`,
        value: p + n, unit: 'amu', hint: 'Khối lượng nguyên tử tập trung ở hạt nhân.', formula: 'khối lượng ≈ số proton + số neutron',
        work: `${p} + ${n} = ${p + n} amu.`, trap: [p, 2 * p + n], skill: 'atomic-mass-calc',
      });
    }
    return numberExercise({
      prompt: `Hạt nhân nguyên tử ${name} ([[${sym}]]) có ${p} proton. Lớp vỏ của nguyên tử có bao nhiêu electron?`,
      value: p, hint: 'Nguyên tử trung hòa về điện.', formula: 'số electron = số proton',
      work: `Số electron = số proton = ${p}.`, trap: [n, p + n], skill: 'atomic-mass-calc',
    });
  },

  'molecular-mass': (r) => {
    const f = pick(FORMULAS, r);
    const m = molecularMass(f);
    return numberExercise({
      prompt: `Tính khối lượng phân tử của [[${f}]]. Biết ${massList(f)} (amu).`,
      value: m, unit: 'amu', hint: 'Cộng khối lượng của tất cả nguyên tử trong phân tử (nhân với số nguyên tử).', formula: 'KLPT = tổng (khối lượng nguyên tử × số nguyên tử)',
      work: `${Object.entries(atomCounts(f)).map(([el, n]) => `${n} × ${vn(ATOMIC[el])}`).join(' + ')} = ${vn(m)} amu.`,
      skill: 'atomic-mass-calc',
    });
  },

  'mass-percent': (r) => {
    const [f, el] = pick(PERCENT_CASES, r);
    const n = atomCounts(f)[el];
    const m = molecularMass(f);
    const pct = round(((n * ATOMIC[el]) / m) * 100, 1);
    const ex = numberExercise({
      prompt: `Tính phần trăm khối lượng của nguyên tố ${el} trong [[${f}]] (làm tròn đến 1 chữ số thập phân). Biết ${massList(f)} (amu).`,
      value: pct, unit: '%', hint: 'Lấy khối lượng của nguyên tố trong phân tử chia cho khối lượng phân tử.', formula: `%${el} = (số nguyên tử ${el} × KLNT) : KLPT × 100%`,
      work: `KLPT = ${vn(m)} amu; %${el} = ${n} × ${vn(ATOMIC[el])} : ${vn(m)} × 100% ≈ ${vn(pct)}%.`,
      trap: [round(100 - pct, 1)], skill: 'mass-percent-calc',
    });
    if (ex.answer.kind === 'number') ex.answer.tolerance = { abs: 0.11 };
    return ex;
  },

  'water-need': (r) => {
    const kg = pick([30, 35, 40, 45, 50, 55, 60], r);
    const inL = r() < 0.5;
    return numberExercise({
      prompt: `Mỗi ngày cơ thể cần khoảng 40 mL nước cho mỗi kilôgam khối lượng. Một bạn nặng ${kg} kg cần khoảng bao nhiêu ${inL ? 'lít (L)' : 'mililít (mL)'} nước mỗi ngày?`,
      value: inL ? (kg * 40) / 1000 : kg * 40, unit: inL ? 'L' : 'mL', hint: 'Nhân khối lượng cơ thể với 40 mL.', formula: 'V = 40 mL × m (kg)',
      work: `V = 40 × ${kg} = ${kg * 40} mL${inL ? ` = ${vn((kg * 40) / 1000)} L` : ''}.`, trap: [kg * 4, kg * 400], skill: 'bio-water-need',
    });
  },
};
