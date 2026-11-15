/**
 * Grade 9 number generators for practice units (SGK KHTN 9 Kết nối tri thức):
 * kinetic/potential/mechanical energy, work and power, thin lens, magnifier, Ohm's law, series/parallel
 * resistors, electric power and energy, transformer, alcohol degree; biology DNA/Mendel/chromosomes.
 */
import type { Exercise } from '@/content/schema/exercise';
import { numberExercise, pick, round, vn, type Rand } from './numberKit';
import { generateCellDivisionChromosomeExercise, generateMendelInheritanceExercise, generateMolecularDnaExercise } from './biologyGenerators';

export const G9_GENERATORS: Record<string, (r: Rand) => Exercise> = {
  'kinetic-potential': (r) => {
    if (r() < 0.5) {
      const m = pick([0.4, 0.5, 2, 4, 50, 1000], r);
      const v = pick([2, 4, 5, 10, 20], r);
      return numberExercise({
        prompt: `Một vật có khối lượng ${vn(m)} kg chuyển động với tốc độ ${v} m/s. Tính động năng của vật.`,
        value: 0.5 * m * v * v, unit: 'J', hint: 'Động năng tỉ lệ với khối lượng và bình phương tốc độ.', formula: 'Wđ = ½ × m × v²',
        work: `Wđ = 0,5 × ${vn(m)} × ${v}² = ${vn(0.5 * m * v * v)} J.`, trap: [m * v, 0.5 * m * v], skill: 'kinetic-energy-calc',
      });
    }
    const m = pick([0.2, 0.5, 1.2, 2.5, 10, 50], r);
    const h = pick([2, 3, 5, 8, 10, 15], r);
    return numberExercise({
      prompt: `Một vật có khối lượng ${vn(m)} kg ở độ cao ${h} m so với mặt đất. Tính thế năng trọng trường của vật (chọn mốc ở mặt đất, P = 10m).`,
      value: 10 * m * h, unit: 'J', hint: 'Thế năng bằng trọng lượng nhân độ cao.', formula: 'Wt = P × h = 10 × m × h',
      work: `Wt = 10 × ${vn(m)} × ${h} = ${vn(10 * m * h)} J.`, trap: [m * h], skill: 'potential-energy-calc',
    });
  },

  mechanical: (r) => {
    const m = pick([0.2, 0.5, 1, 2], r);
    const h = pick([2, 5, 10, 20], r);
    const W = 10 * m * h;
    if (r() < 0.5) {
      const wd = pick([10, 20, 50, 100], r);
      return numberExercise({
        prompt: `Một vật có động năng ${wd} J và thế năng ${vn(W)} J. Tính cơ năng của vật.`,
        value: wd + W, unit: 'J', hint: 'Cơ năng bằng tổng động năng và thế năng.', formula: 'W = Wđ + Wt',
        work: `W = ${wd} + ${vn(W)} = ${vn(wd + W)} J.`, trap: [Math.abs(wd - W)], skill: 'mechanical-energy-calc',
      });
    }
    return numberExercise({
      prompt: `Thả rơi một vật ${vn(m)} kg từ độ cao ${h} m (bỏ qua sức cản không khí, P = 10m). Ngay trước khi chạm đất, động năng của vật là bao nhiêu J?`,
      value: W, unit: 'J', hint: 'Cơ năng được bảo toàn: thế năng ban đầu chuyển hết thành động năng.', formula: 'Wđ (cuối) = Wt (đầu) = 10 × m × h',
      work: `Wđ = 10 × ${vn(m)} × ${h} = ${vn(W)} J.`, trap: [W / 2], skill: 'mechanical-energy-calc',
    });
  },

  'work-power': (r) => {
    const mode = r();
    if (mode < 0.4) {
      const F = pick([50, 100, 150, 200, 500], r);
      const s = pick([2, 5, 10, 20], r);
      return numberExercise({
        prompt: `Một lực ${F} N kéo vật dịch chuyển ${s} m theo phương của lực. Tính công của lực.`,
        value: F * s, unit: 'J', hint: 'Công bằng lực nhân quãng đường dịch chuyển theo phương của lực.', formula: 'A = F × s',
        work: `A = ${F} × ${s} = ${F * s} J.`, trap: [F / s], skill: 'work-calc',
      });
    }
    const A = pick([1200, 3000, 6000, 15000, 36000], r);
    const t = pick([10, 20, 30, 60, 120], r);
    if (mode < 0.75) {
      return numberExercise({
        prompt: `Một máy thực hiện công ${A} J trong ${t} s. Tính công suất của máy.`,
        value: A / t, unit: 'W', hint: 'Công suất là công thực hiện trong một giây.', formula: 'P = A : t',
        work: `P = ${A} : ${t} = ${vn(A / t)} W.`, trap: [A * t], skill: 'power-calc',
      });
    }
    const P = A / t;
    return numberExercise({
      prompt: `Một động cơ có công suất ${vn(P)} W hoạt động trong ${t} s. Tính công động cơ thực hiện.`,
      value: A, unit: 'J', hint: 'Công bằng công suất nhân thời gian.', formula: 'A = P × t',
      work: `A = ${vn(P)} × ${t} = ${A} J.`, trap: [P / t], skill: 'power-calc',
    });
  },

  lens: (r) => {
    // Converging lens, real image: 1/f = 1/d + 1/d'
    const cases: Array<[number, number]> = [[10, 15], [10, 20], [12, 24], [12, 18], [15, 30], [20, 30], [20, 40], [6, 9]];
    const [f, d] = pick(cases, r);
    const dp = (d * f) / (d - f);
    if (r() < 0.6) {
      return numberExercise({
        prompt: `Đặt vật sáng AB vuông góc với trục chính của thấu kính hội tụ có tiêu cự ${f} cm, cách thấu kính ${d} cm. Ảnh thật cách thấu kính bao nhiêu cm?`,
        value: dp, unit: 'cm', hint: 'Dùng công thức thấu kính cho ảnh thật.', formula: "1/f = 1/d + 1/d'",
        work: `1/d' = 1/${f} − 1/${d} ⇒ d' = ${d} × ${f} : (${d} − ${f}) = ${vn(dp)} cm.`, trap: [d - f, d + f], skill: 'thin-lens-calc',
      });
    }
    return numberExercise({
      prompt: `Vật sáng đặt cách thấu kính hội tụ ${d} cm cho ảnh thật cách thấu kính ${vn(dp)} cm. Tiêu cự của thấu kính là bao nhiêu cm?`,
      value: f, unit: 'cm', hint: 'Áp dụng công thức thấu kính.', formula: "f = d × d' : (d + d')",
      work: `f = ${d} × ${vn(dp)} : (${d} + ${vn(dp)}) = ${f} cm.`, trap: [d + dp, (d + dp) / 2], skill: 'thin-lens-calc',
    });
  },

  magnifier: (r) => {
    const f = pick([2.5, 5, 6.25, 10, 12.5], r);
    if (r() < 0.6) {
      return numberExercise({
        prompt: `Một kính lúp có tiêu cự ${vn(f)} cm. Số bội giác của kính lúp là bao nhiêu?`,
        value: 25 / f, hint: 'Số bội giác G = 25 : f, với f tính bằng cm.', formula: 'G = 25 : f',
        work: `G = 25 : ${vn(f)} = ${vn(25 / f)}.`, trap: [f / 25], skill: 'magnifier-calc',
      });
    }
    const G = 25 / f;
    return numberExercise({
      prompt: `Trên kính lúp ghi ${vn(G)}X. Tiêu cự của kính lúp là bao nhiêu cm?`,
      value: f, unit: 'cm', hint: 'Từ G = 25 : f suy ra f = 25 : G.', formula: 'f = 25 : G',
      work: `f = 25 : ${vn(G)} = ${vn(f)} cm.`, trap: [G * 25], skill: 'magnifier-calc',
    });
  },

  ohm: (r) => {
    const R = pick([4, 6, 8, 10, 12, 20, 24, 30, 48], r);
    const I = pick([0.25, 0.5, 1, 1.5, 2], r);
    const U = R * I;
    const mode = r();
    if (mode < 0.4) {
      return numberExercise({
        prompt: `Đặt hiệu điện thế ${vn(U)} V vào hai đầu điện trở ${R} Ω. Tính cường độ dòng điện chạy qua điện trở.`,
        value: I, unit: 'A', hint: 'Cường độ dòng điện tỉ lệ thuận với U, tỉ lệ nghịch với R.', formula: 'I = U : R',
        work: `I = ${vn(U)} : ${R} = ${vn(I)} A.`, trap: [U * R], skill: 'ohm-law-calc',
      });
    }
    if (mode < 0.7) {
      return numberExercise({
        prompt: `Dòng điện ${vn(I)} A chạy qua điện trở ${R} Ω. Tính hiệu điện thế giữa hai đầu điện trở.`,
        value: U, unit: 'V', hint: 'Từ I = U : R suy ra U = I × R.', formula: 'U = I × R',
        work: `U = ${vn(I)} × ${R} = ${vn(U)} V.`, trap: [R / I], skill: 'ohm-law-calc',
      });
    }
    return numberExercise({
      prompt: `Đặt hiệu điện thế ${vn(U)} V vào hai đầu một dây dẫn thì dòng điện qua dây là ${vn(I)} A. Tính điện trở của dây.`,
      value: R, unit: 'Ω', hint: 'Điện trở bằng hiệu điện thế chia cho cường độ dòng điện.', formula: 'R = U : I',
      work: `R = ${vn(U)} : ${vn(I)} = ${R} Ω.`, trap: [U * I], skill: 'ohm-law-calc',
    });
  },

  resistors: (r) => {
    const pairs: Array<[number, number]> = [[10, 15], [20, 30], [12, 6], [40, 40], [10, 40], [6, 3], [30, 60]];
    const [a, b] = pick(pairs, r);
    if (r() < 0.5) {
      return numberExercise({
        prompt: `Hai điện trở R₁ = ${a} Ω và R₂ = ${b} Ω mắc nối tiếp. Tính điện trở tương đương của đoạn mạch.`,
        value: a + b, unit: 'Ω', hint: 'Đoạn mạch nối tiếp: các điện trở cộng lại.', formula: 'R = R₁ + R₂',
        work: `R = ${a} + ${b} = ${a + b} Ω.`, trap: [(a * b) / (a + b)], skill: 'series-parallel-calc',
      });
    }
    const p = (a * b) / (a + b);
    return numberExercise({
      prompt: `Hai điện trở R₁ = ${a} Ω và R₂ = ${b} Ω mắc song song. Tính điện trở tương đương của đoạn mạch.`,
      value: p, unit: 'Ω', hint: 'Đoạn mạch song song: nghịch đảo điện trở tương đương bằng tổng nghịch đảo các điện trở.', formula: 'R = R₁ × R₂ : (R₁ + R₂)',
      work: `R = ${a} × ${b} : (${a} + ${b}) = ${vn(p)} Ω.`, trap: [a + b], skill: 'series-parallel-calc',
    });
  },

  'electric-power': (r) => {
    const mode = r();
    if (mode < 0.35) {
      const U = pick([6, 12, 220], r);
      const I = pick([0.5, 1, 2, 5], r);
      return numberExercise({
        prompt: `Một dụng cụ điện dùng hiệu điện thế ${U} V, dòng điện qua nó là ${vn(I)} A. Tính công suất điện của dụng cụ.`,
        value: U * I, unit: 'W', hint: 'Công suất điện bằng hiệu điện thế nhân cường độ dòng điện.', formula: 'P = U × I',
        work: `P = ${U} × ${vn(I)} = ${vn(U * I)} W.`, trap: [U / I], skill: 'electric-power-calc',
      });
    }
    const P = pick([60, 100, 500, 1000, 1500, 2000], r);
    const h = pick([0.5, 1, 2, 4, 5], r);
    if (mode < 0.7) {
      return numberExercise({
        prompt: `Một thiết bị có công suất ${P} W hoạt động trong ${vn(h)} giờ. Tính điện năng tiêu thụ theo đơn vị kW·h (số điện).`,
        value: (P / 1000) * h, unit: 'kWh', hint: 'Đổi công suất sang kW rồi nhân với số giờ.', formula: 'A = P (kW) × t (h)',
        work: `A = ${vn(P / 1000)} × ${vn(h)} = ${vn((P / 1000) * h)} kW·h.`, trap: [P * h], skill: 'electric-energy-calc',
      });
    }
    const days = pick([10, 30], r);
    const kwh = (P / 1000) * h * days;
    const price = 2000;
    return numberExercise({
      prompt: `Một thiết bị ${P} W dùng ${vn(h)} giờ mỗi ngày trong ${days} ngày. Giá điện 2 000 đồng/kW·h. Tính tiền điện phải trả (đồng).`,
      value: kwh * price, unit: 'đồng', hint: 'Tính số kW·h trước, rồi nhân với giá điện.', formula: 'Tiền = P (kW) × giờ/ngày × số ngày × giá',
      work: `A = ${vn(P / 1000)} × ${vn(h)} × ${days} = ${vn(kwh)} kW·h; tiền = ${vn(kwh)} × 2 000 = ${vn(kwh * price)} đồng.`,
      trap: [kwh], skill: 'electric-energy-calc',
    });
  },

  transformer: (r) => {
    const cases: Array<[number, number, number]> = [[500, 1000, 220], [1000, 50, 220], [2000, 100, 220], [200, 1000, 12], [400, 2000, 6], [1100, 55, 220]];
    const [N1, N2, U1] = pick(cases, r);
    const U2 = (U1 * N2) / N1;
    if (r() < 0.6) {
      return numberExercise({
        prompt: `Máy biến thế có cuộn sơ cấp ${N1} vòng, cuộn thứ cấp ${N2} vòng. Đặt vào cuộn sơ cấp hiệu điện thế ${U1} V. Tính hiệu điện thế ở cuộn thứ cấp.`,
        value: U2, unit: 'V', hint: 'Tỉ số hiệu điện thế bằng tỉ số số vòng dây.', formula: 'U₁ : U₂ = N₁ : N₂',
        work: `U₂ = ${U1} × ${N2} : ${N1} = ${vn(U2)} V.`, trap: [(U1 * N1) / N2], skill: 'transformer-calc',
      });
    }
    return numberExercise({
      prompt: `Máy biến thế có cuộn sơ cấp ${N1} vòng, hạ (hoặc tăng) hiệu điện thế từ ${U1} V xuống (lên) ${vn(U2)} V. Cuộn thứ cấp có bao nhiêu vòng?`,
      value: N2, unit: 'vòng', hint: 'Số vòng tỉ lệ với hiệu điện thế.', formula: 'N₂ = N₁ × U₂ : U₁',
      work: `N₂ = ${N1} × ${vn(U2)} : ${U1} = ${N2} vòng.`, trap: [(N1 * U1) / U2], skill: 'transformer-calc',
    });
  },

  'alcohol-degree': (r) => {
    const deg = pick([5, 12, 15, 30, 40, 45], r);
    const V = pick([100, 200, 250, 500, 750, 1000], r);
    if (r() < 0.6) {
      return numberExercise({
        prompt: `Có ${V} mL rượu ${deg}°. Tính thể tích ethylic alcohol nguyên chất có trong lượng rượu đó.`,
        value: (deg * V) / 100, unit: 'mL', hint: 'Độ rượu là số mL ethylic alcohol có trong 100 mL dung dịch rượu.', formula: 'V alcohol = độ rượu × V dung dịch : 100',
        work: `V = ${deg} × ${V} : 100 = ${vn((deg * V) / 100)} mL.`, trap: [deg * V], skill: 'ethylic-alcohol',
      });
    }
    const va = (deg * V) / 100;
    return numberExercise({
      prompt: `Trong ${V} mL dung dịch rượu có ${vn(va)} mL ethylic alcohol nguyên chất. Độ rượu là bao nhiêu độ?`,
      value: deg, unit: '°', hint: 'Độ rượu = V alcohol : V dung dịch × 100.', formula: 'Độ rượu = V alcohol × 100 : V dung dịch',
      work: `Độ rượu = ${vn(va)} × 100 : ${V} = ${deg}°.`, trap: [round(va / V, 3)], skill: 'ethylic-alcohol',
    });
  },

  // Biology (existing generators)
  dna: () => generateMolecularDnaExercise('p'),
  mendel: () => generateMendelInheritanceExercise('p'),
  chromosomes: () => generateCellDivisionChromosomeExercise('p'),
};
