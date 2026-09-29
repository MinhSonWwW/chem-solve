import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Atom, Scale, Calculator, Droplets, Zap } from 'lucide-react';
import { Formula } from './Formula';

export interface QuickReferenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  subject?: 'chem' | 'physics';
}

interface PhysicsFormula {
  category: string;
  name: string;
  eq: string;
  note: string;
}

const PHYSICS_FORMULAS: PhysicsFormula[] = [
  // ── Cơ học & Chuyển động (Lớp 6, 7, 8, 9) ──
  { category: 'Cơ học', name: 'Tốc độ chuyển động', eq: 'v = s / t', note: 's: quãng đường (m hoặc km), t: thời gian (s hoặc h), v: tốc độ (m/s hoặc km/h). 1 m/s = 3,6 km/h' },
  { category: 'Cơ học', name: 'Khối lượng riêng & Trọng lượng riêng', eq: 'D = m / V  ;  d = P / V = 10 × D', note: 'm: khối lượng (kg), V: thể tích (m³), D: kg/m³, d: N/m³' },
  { category: 'Cơ học', name: 'Trọng lượng theo khối lượng', eq: 'P = 10 × m', note: 'm: khối lượng (kg), P: trọng lượng (N). 1 kg = 1000 g' },
  { category: 'Cơ học', name: 'Độ dãn của lò xo', eq: 'Δl = l - l₀', note: 'l: chiều dài khi dãn, l₀: chiều dài tự nhiên. Độ dãn tỉ lệ thuận với khối lượng treo' },
  { category: 'Cơ học', name: 'Công cơ học', eq: 'A = F × s', note: 'F: lực tác dụng cùng hướng chuyển động (N), s: quãng đường dịch chuyển (m), A: công cơ học (J). 1 kJ = 1000 J' },
  { category: 'Cơ học', name: 'Công suất cơ học', eq: 'P = A / t = F × v', note: 'A: công (J), t: thời gian thực hiện công (s), P: công suất (W hoặc J/s). 1 kW = 1000 W' },
  { category: 'Cơ học', name: 'Động năng', eq: 'Wđ = ½ × m × v²', note: 'm: khối lượng (kg), v: vận tốc (m/s), Wđ: động năng (J). Động năng phụ thuộc vào khối lượng và bình phương vận tốc' },
  { category: 'Cơ học', name: 'Thế năng trọng trường', eq: 'Wt = P × h = 10 × m × h', note: 'm: khối lượng (kg), h: độ cao so với mốc thế năng (m), Wt: thế năng trọng trường (J)' },
  { category: 'Cơ học', name: 'Cơ năng & Bảo toàn cơ năng', eq: 'W = Wđ + Wt = const', note: 'Trong quá trình chuyển động khi bỏ qua ma sát và lực cản, tổng động năng và thế năng luôn được bảo toàn' },
  { category: 'Cơ học', name: 'Hiệu suất máy móc / Động cơ', eq: 'H = (A_ich / A_toan_phan) × 100%', note: 'A_ich: công có ích (J), A_toan_phan: công toàn phần tiêu hao (J). Luôn có H < 100%' },

  // ── Áp suất & Lực đẩy chất lưu ──
  { category: 'Chất lưu', name: 'Áp suất chất rắn', eq: 'p = F / S', note: 'F: áp lực vuông góc với mặt bị ép (N), S: diện tích bị ép (m²), p: áp suất (Pa = N/m²)' },
  { category: 'Chất lưu', name: 'Áp suất chất lỏng', eq: 'p = d × h = 10 × D × h', note: 'd: trọng lượng riêng chất lỏng (N/m³), h: độ sâu tính từ mặt thoáng (m)' },
  { category: 'Chất lưu', name: 'Lực đẩy Ác-si-mét', eq: 'F_A = d × V = 10 × D × V', note: 'd: trọng lượng riêng chất lỏng (N/m³), V: thể tích phần vật chìm trong chất lỏng (m³)' },

  // ── Nhiệt học (Lớp 8, 9) ──
  { category: 'Nhiệt học', name: 'Quy đổi nhiệt độ Celsius sang Kelvin', eq: 'T (K) = t (°C) + 273,15', note: '0 K là độ không tuyệt đối (-273,15 °C). 0 °C = 273,15 K; 100 °C = 373,15 K' },
  { category: 'Nhiệt học', name: 'Nhiệt lượng thu vào / toả ra', eq: 'Q = m × c × Δt', note: 'm: khối lượng (kg), c: nhiệt dung riêng (J/kg.K), Δt = |t₂ - t₁|: độ biến thiên nhiệt độ (°C hoặc K)' },
  { category: 'Nhiệt học', name: 'Phương trình cân bằng nhiệt', eq: 'Q_toa = Q_thu', note: 'Tổng nhiệt lượng các vật toả ra bằng tổng nhiệt lượng các vật thu vào' },
  { category: 'Nhiệt học', name: 'Năng suất toả nhiệt nhiên liệu', eq: 'Q = q × m', note: 'q: năng suất toả nhiệt của nhiên liệu (J/kg), m: khối lượng nhiên liệu cháy hoàn toàn (kg)' },

  // ── Điện học (Lớp 9) ──
  { category: 'Điện học', name: 'Định luật Ohm (Đoạn mạch)', eq: 'I = U / R', note: 'U: hiệu điện thế (V), R: điện trở đoạn mạch (Ω), I: cường độ dòng điện (A)' },
  { category: 'Điện học', name: 'Điện trở dây dẫn kim loại', eq: 'R = ρ × (l / S)', note: 'ρ: điện trở suất (Ω·m), l: chiều dài dây (m), S: tiết diện ngang (m²). Lưu ý 1 mm² = 10⁻⁶ m²' },
  { category: 'Điện học', name: 'Đoạn mạch mắc nối tiếp', eq: 'I = I₁ = I₂ ; U = U₁ + U₂ ; R_tđ = R₁ + R₂', note: 'Hiệu điện thế phân phối tỉ lệ thuận với điện trở: U₁ / U₂ = R₁ / R₂' },
  { category: 'Điện học', name: 'Đoạn mạch mắc song song', eq: 'U = U₁ = U₂ ; I = I₁ + I₂ ; 1/R_tđ = 1/R₁ + 1/R₂', note: 'Với 2 điện trở: R_tđ = (R₁ × R₂) / (R₁ + R₂). Cường độ tỉ lệ nghịch điện trở: I₁ / I₂ = R₂ / R₁' },
  { category: 'Điện học', name: 'Công suất điện', eq: 'P = U × I = I² × R = U² / R', note: 'P: công suất tiêu thụ (W), U: hiệu điện thế (V), I: cường độ (A), R: điện trở (Ω)' },
  { category: 'Điện học', name: 'Điện năng tiêu thụ (Định luật Jun - Len-xơ)', eq: 'A = Q = P × t = U × I × t = I² × R × t', note: 't: giây (s) → A tính theo Jun (J). 1 kWh = 1 số điện = 3 600 000 J = 3,6 MJ' },

  // ── Điện từ & Quang học (Lớp 9) ──
  { category: 'Điện từ', name: 'Tỉ số máy biến áp', eq: 'U₁ / U₂ = N₁ / N₂', note: 'U₁, N₁: HĐT và số vòng dây cuộn sơ cấp; U₂, N₂: HĐT và số vòng cuộn thứ cấp. N₂ > N₁: tăng áp' },
  { category: 'Điện từ', name: 'Công suất hao phí do toả nhiệt', eq: 'P_hp = (R × P²) / U²', note: 'P: công suất cần truyền tải (W), U: HĐT đường dây (V), R: điện trở đường dây dẫn (Ω). Tăng U lên n lần → giảm P_hp n² lần' },
  { category: 'Quang học', name: 'Định luật phản xạ ánh sáng', eq: 'i\' = i', note: 'Tia phản xạ nằm trong mặt phẳng tới. Góc phản xạ i\' bằng góc tới i' },
  { category: 'Quang học', name: 'Công thức thấu kính (Ảnh thật)', eq: '1 / f = 1 / d + 1 / d\'', note: 'f: tiêu cự thấu kính (m), d: khoảng cách vật đến TK (m), d\': khoảng cách ảnh đến TK (m)' },
  { category: 'Quang học', name: 'Tỉ lệ kích thước ảnh / vật', eq: 'A\'B\' / AB = d\' / d', note: 'A\'B\': chiều cao của ảnh, AB: chiều cao của vật, d\': khoảng cách ảnh, d: khoảng cách vật' },
];

const PHYSICS_UNITS = [
  { qty: 'Chiều dài (l, s)', si: 'Mét (m)', conv: '1 km = 1000 m; 1 m = 100 cm = 1000 mm' },
  { qty: 'Khối lượng (m)', si: 'Kilôgam (kg)', conv: '1 tấn = 1000 kg; 1 kg = 1000 g = 1 000 000 mg' },
  { qty: 'Thời gian (t)', si: 'Giây (s)', conv: '1 giờ = 60 phút = 3600 giây; 1 phút = 60 giây' },
  { qty: 'Lực (F, P)', si: 'Niutơn (N)', conv: 'Vật 100 g có trọng lượng ≈ 1 N; vật 1 kg có P = 10 N' },
  { qty: 'Thể tích (V)', si: 'Mét khối (m³)', conv: '1 m³ = 1000 lít (L) = 1 000 000 cm³ (mL)' },
  { qty: 'Nhiệt độ (T)', si: 'Kelvin (K), Celsius (°C)', conv: 'Thang Celsius (°C); Thang nhiệt động Kelvin (K)' },
  { qty: 'Tốc độ (v)', si: 'Mét trên giây (m/s)', conv: '1 m/s = 3,6 km/h (VD: 54 km/h = 15 m/s)' },
  { qty: 'Năng lượng (E, A)', si: 'Jun (J)', conv: '1 kJ = 1000 J; 1 cal ≈ 4,184 J ≈ 4,2 J; 1 kcal = 1000 cal' },
  { qty: 'Công suất (P)', si: 'Oát (W)', conv: '1 kW = 1000 W; 1 MW = 1 000 000 W' },
];

const PHYSICS_CONSTANTS = [
  { name: 'Gia tốc trọng trường Trái Đất', sym: 'g', val: '≈ 9,8 N/kg (làm tròn 10 N/kg)', note: 'Dùng để tính trọng lượng P = 10.m ở THCS' },
  { name: 'Gia tốc trọng trường Mặt Trăng', sym: 'g_moon', val: '≈ 1/6 g_earth ≈ 1,63 N/kg', note: 'Trọng lượng trên Mặt Trăng chỉ bằng khoảng 1/6 trên Trái Đất' },
  { name: 'Khối lượng riêng nước cất', sym: 'D_nước', val: '1000 kg/m³ = 1 g/cm³', note: '1 lít nước cất nặng đúng 1 kg' },
  { name: 'Tốc độ ánh sáng trong chân không', sym: 'c', val: '≈ 300 000 km/s = 3 × 10⁸ m/s', note: 'Vận tốc lớn nhất trong vũ trụ' },
  { name: 'Nhiệt độ sôi của nước (1 atm)', sym: 't_sôi', val: '100 °C = 373,15 K', note: 'Ở áp suất khí quyển tiêu chuẩn' },
  { name: 'Nhiệt độ đóng băng của nước', sym: 't_đông', val: '0 °C = 273,15 K', note: 'Điểm chuẩn 0 của thang nhiệt độ Celsius' },
  { name: 'Năm ánh sáng', sym: 'ly', val: '≈ 9 460 tỉ km', note: 'Quãng đường ánh sáng đi trong 1 năm chân không' },
  { name: 'Khoảng cách Trái Đất - Mặt Trời', sym: '1 AU', val: '≈ 150 triệu km', note: 'Đơn vị thiên văn (AU), ánh sáng truyền mất ≈ 8 phút 20 giây' },
];

const ELEMENTS = [
  { sym: 'H', name: 'Hydrogen', vnName: 'Hiđro', m: 1, val: 'I' },
  { sym: 'He', name: 'Helium', vnName: 'Heli', m: 4, val: '0' },
  { sym: 'C', name: 'Carbon', vnName: 'Cacbon', m: 12, val: 'IV, II' },
  { sym: 'N', name: 'Nitrogen', vnName: 'Nitơ', m: 14, val: 'III, IV, II, V' },
  { sym: 'O', name: 'Oxygen', vnName: 'Oxi', m: 16, val: 'II' },
  { sym: 'Na', name: 'Sodium', vnName: 'Natri', m: 23, val: 'I' },
  { sym: 'Mg', name: 'Magnesium', vnName: 'Magie', m: 24, val: 'II' },
  { sym: 'Al', name: 'Aluminium', vnName: 'Nhôm', m: 27, val: 'III' },
  { sym: 'P', name: 'Phosphorus', vnName: 'Photpho', m: 31, val: 'V, III' },
  { sym: 'S', name: 'Sulfur', vnName: 'Lưu huỳnh', m: 32, val: 'II, IV, VI' },
  { sym: 'Cl', name: 'Chlorine', vnName: 'Clo', m: 35.5, val: 'I' },
  { sym: 'K', name: 'Potassium', vnName: 'Kali', m: 39, val: 'I' },
  { sym: 'Ca', name: 'Calcium', vnName: 'Canxi', m: 40, val: 'II' },
  { sym: 'Fe', name: 'Iron', vnName: 'Sắt', m: 56, val: 'II, III' },
  { sym: 'Cu', name: 'Copper', vnName: 'Đồng', m: 64, val: 'II, I' },
  { sym: 'Zn', name: 'Zinc', vnName: 'Kẽm', m: 65, val: 'II' },
  { sym: 'Br', name: 'Bromine', vnName: 'Brom', m: 80, val: 'I' },
  { sym: 'Ag', name: 'Silver', vnName: 'Bạc', m: 108, val: 'I' },
  { sym: 'Ba', name: 'Barium', vnName: 'Bari', m: 137, val: 'II' },
  { sym: 'Pb', name: 'Lead', vnName: 'Chì', m: 207, val: 'II' },
];

const RADICALS = [
  { group: '-OH', name: 'Hydroxide (Hiđroxit)', val: 'I', formulaM: 17 },
  { group: '-NO3', name: 'Nitrate (Nitrat)', val: 'I', formulaM: 62 },
  { group: '-Cl', name: 'Chloride (Clorua)', val: 'I', formulaM: 35.5 },
  { group: '=SO4', name: 'Sulfate (Sunfat)', val: 'II', formulaM: 96 },
  { group: '=CO3', name: 'Carbonate (Cacbonat)', val: 'II', formulaM: 60 },
  { group: '=SO3', name: 'Sulfite (Sunfit)', val: 'II', formulaM: 80 },
  { group: '=S', name: 'Sulfide (Sunfua)', val: 'II', formulaM: 32 },
  { group: '≡PO4', name: 'Phosphate (Photphat)', val: 'III', formulaM: 95 },
];

const FORMULAS = [
  { name: 'Số mol theo khối lượng', eq: 'n = m / M', note: 'm: khối lượng (g), M: khối lượng mol (g/mol)' },
  { name: 'Thể tích khí (ở ĐKC: 25 °C, 1 bar)', eq: 'V = n × 24,79', note: 'V: thể tích khí (lít), n: số mol' },
  { name: 'Nồng độ phần trăm', eq: 'C% = (m_ct / m_dd) × 100%', note: 'm_dd = m_ct + m_dm (khối lượng dung dịch)' },
  { name: 'Nồng độ mol', eq: 'CM = n / V_dd', note: 'V_dd: thể tích dung dịch (lít)' },
  { name: 'Tỉ khối chất khí A so với B', eq: 'd(A/B) = M_A / M_B', note: 'So với không khí: d(A/kk) = M_A / 29' },
  { name: 'Định luật bảo toàn khối lượng', eq: 'm_A + m_B = m_C + m_D', note: 'Tổng khối lượng chất tham gia = Tổng sản phẩm' },
];

// Dãy hoạt động hóa học của kim loại
const REACTIVITY_SERIES = [
  { sym: 'K', name: 'Potassium (Kali)', mnemonic: 'Khi', note: 'Tan trong nước ở t° thường' },
  { sym: 'Na', name: 'Sodium (Natri)', mnemonic: 'nào', note: 'Tan trong nước ở t° thường' },
  { sym: 'Ca', name: 'Calcium (Canxi)', mnemonic: 'cần', note: 'Tan trong nước ở t° thường' },
  { sym: 'Mg', name: 'Magnesium (Magie)', mnemonic: 'may', note: 'Tác dụng nước nóng chậm' },
  { sym: 'Al', name: 'Aluminium (Nhôm)', mnemonic: 'áo', note: 'Bền nhờ màng oxide' },
  { sym: 'Zn', name: 'Zinc (Kẽm)', mnemonic: 'giáp', note: 'Đẩy kim loại sau ra khỏi muối' },
  { sym: 'Fe', name: 'Iron (Sắt)', mnemonic: 'sắt', note: 'Có hóa trị II & III' },
  { sym: 'Ni', name: 'Nickel (Niken)', mnemonic: 'nhớ', note: 'Kim loại trung bình' },
  { sym: 'Sn', name: 'Tin (Thiếc)', mnemonic: 'sang', note: 'Đứng trước H' },
  { sym: 'Pb', name: 'Lead (Chì)', mnemonic: 'phố', note: 'Kim loại cuối trước H' },
  { sym: '(H)', name: 'Hydrogen (Hiđro)', mnemonic: 'hỏi', isDivider: true, note: 'Mốc so sánh phản ứng acid' },
  { sym: 'Cu', name: 'Copper (Đồng)', mnemonic: 'cửa', note: 'Không tác dụng acid loãng' },
  { sym: 'Hg', name: 'Mercury (Thủy ngân)', mnemonic: 'hàng', note: 'Chất lỏng ở t° thường' },
  { sym: 'Ag', name: 'Silver (Bạc)', mnemonic: 'á', note: 'Kim loại quý' },
  { sym: 'Pt', name: 'Platinum (Bạch kim)', mnemonic: 'phi', note: 'Rất trơ hóa học' },
  { sym: 'Au', name: 'Gold (Vàng)', mnemonic: 'âu', note: 'Kim loại hoạt động yếu nhất' },
];

// Bảng tính tan trong nước: T (Tan), K (Không tan - kết tủa), I (Ít tan), - (Không tồn tại / bị thủy phân)
interface SolubilityEntry {
  cation: string;
  cationLabel: string;
  OH: { val: string; color?: string };
  Cl: { val: string; color?: string };
  NO3: { val: string; color?: string };
  SO4: { val: string; color?: string };
  CO3: { val: string; color?: string };
  PO4: { val: string; color?: string };
  S: { val: string; color?: string };
}

const SOLUBILITY_DATA: SolubilityEntry[] = [
  { cation: 'H+', cationLabel: 'H⁺ (Acid)', OH: { val: 'T' }, Cl: { val: 'T' }, NO3: { val: 'T' }, SO4: { val: 'T' }, CO3: { val: 'B', color: 'Bay hơi CO2' }, PO4: { val: 'T' }, S: { val: 'B', color: 'Khí H2S' } },
  { cation: 'K+', cationLabel: 'K⁺', OH: { val: 'T' }, Cl: { val: 'T' }, NO3: { val: 'T' }, SO4: { val: 'T' }, CO3: { val: 'T' }, PO4: { val: 'T' }, S: { val: 'T' } },
  { cation: 'Na+', cationLabel: 'Na⁺', OH: { val: 'T' }, Cl: { val: 'T' }, NO3: { val: 'T' }, SO4: { val: 'T' }, CO3: { val: 'T' }, PO4: { val: 'T' }, S: { val: 'T' } },
  { cation: 'Ba2+', cationLabel: 'Ba²⁺', OH: { val: 'T' }, Cl: { val: 'T' }, NO3: { val: 'T' }, SO4: { val: 'K', color: '↓ Trắng' }, CO3: { val: 'K', color: '↓ Trắng' }, PO4: { val: 'K', color: '↓ Trắng' }, S: { val: 'T' } },
  { cation: 'Ca2+', cationLabel: 'Ca²⁺', OH: { val: 'I', color: 'Nước vôi ít tan' }, Cl: { val: 'T' }, NO3: { val: 'T' }, SO4: { val: 'I', color: 'Ít tan' }, CO3: { val: 'K', color: '↓ Trắng' }, PO4: { val: 'K', color: '↓ Trắng' }, S: { val: 'T' } },
  { cation: 'Mg2+', cationLabel: 'Mg²⁺', OH: { val: 'K', color: '↓ Trắng' }, Cl: { val: 'T' }, NO3: { val: 'T' }, SO4: { val: 'T' }, CO3: { val: 'K', color: '↓ Trắng' }, PO4: { val: 'K', color: '↓ Trắng' }, S: { val: '-' } },
  { cation: 'Al3+', cationLabel: 'Al³⁺', OH: { val: 'K', color: '↓ Keo trắng' }, Cl: { val: 'T' }, NO3: { val: 'T' }, SO4: { val: 'T' }, CO3: { val: '-' }, PO4: { val: 'K', color: '↓ Trắng' }, S: { val: '-' } },
  { cation: 'Zn2+', cationLabel: 'Zn²⁺', OH: { val: 'K', color: '↓ Trắng' }, Cl: { val: 'T' }, NO3: { val: 'T' }, SO4: { val: 'T' }, CO3: { val: 'K', color: '↓ Trắng' }, PO4: { val: 'K', color: '↓ Trắng' }, S: { val: 'K', color: '↓ Trắng' } },
  { cation: 'Fe2+', cationLabel: 'Fe²⁺', OH: { val: 'K', color: '↓ Trắng xanh' }, Cl: { val: 'T' }, NO3: { val: 'T' }, SO4: { val: 'T' }, CO3: { val: 'K', color: '↓ Trắng tro' }, PO4: { val: 'K', color: '↓ Trắng xanh' }, S: { val: 'K', color: '↓ Đen' } },
  { cation: 'Fe3+', cationLabel: 'Fe³⁺', OH: { val: 'K', color: '↓ Nâu đỏ' }, Cl: { val: 'T' }, NO3: { val: 'T' }, SO4: { val: 'T' }, CO3: { val: '-' }, PO4: { val: 'K', color: '↓ Vàng nhạt' }, S: { val: '-' } },
  { cation: 'Cu2+', cationLabel: 'Cu²⁺', OH: { val: 'K', color: '↓ Xanh lam' }, Cl: { val: 'T' }, NO3: { val: 'T' }, SO4: { val: 'T' }, CO3: { val: '-' }, PO4: { val: 'K', color: '↓ Xanh' }, S: { val: 'K', color: '↓ Đen' } },
  { cation: 'Ag+', cationLabel: 'Ag⁺', OH: { val: '-', color: 'Tạo Ag2O đen' }, Cl: { val: 'K', color: '↓ Trắng' }, NO3: { val: 'T' }, SO4: { val: 'I', color: 'Ít tan' }, CO3: { val: 'K', color: '↓ Vàng' }, PO4: { val: 'K', color: '↓ Vàng' }, S: { val: 'K', color: '↓ Đen' } },
  { cation: 'Pb2+', cationLabel: 'Pb²⁺', OH: { val: 'K', color: '↓ Trắng' }, Cl: { val: 'I', color: 'Ít tan (tan khi đun)' }, NO3: { val: 'T' }, SO4: { val: 'K', color: '↓ Trắng' }, CO3: { val: 'K', color: '↓ Trắng' }, PO4: { val: 'K', color: '↓ Trắng' }, S: { val: 'K', color: '↓ Đen' } },
];

export const QuickReferenceDrawer: React.FC<QuickReferenceDrawerProps> = ({
  isOpen,
  onClose,
  subject = 'chem',
}) => {
  const [chemTab, setChemTab] = useState<'elements' | 'solubility' | 'reactivity' | 'radicals' | 'formulas'>('elements');
  const [phyTab, setPhyTab] = useState<'phy-formulas' | 'phy-units' | 'phy-constants'>('phy-formulas');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const isPhy = subject === 'physics';

  const filteredElements = ELEMENTS.filter(
    (e) =>
      e.sym.toLowerCase().includes(search.toLowerCase()) ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.vnName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPhyFormulas = PHYSICS_FORMULAS.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.eq.toLowerCase().includes(search.toLowerCase()) ||
      f.note.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Drawer Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-2xl bg-slate-900 border-t-2 sm:border-2 border-slate-700 rounded-t-3xl sm:rounded-3xl max-h-[90dvh] flex flex-col shadow-2xl z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{isPhy ? '⚡' : '🧪'}</span>
              <div>
                <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                  {isPhy ? 'Sổ tay tra cứu Vật lý' : 'Sổ tay tra cứu Hóa học'}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isPhy ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'}`}>
                    THCS 6-9
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  {isPhy ? 'Công thức Cơ - Nhiệt - Điện, Hệ đơn vị SI & Hằng số vật lý' : 'Nguyên tử khối, Bảng tính tan, Dãy hoạt động và Công thức'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          {isPhy ? (
            <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 text-[11px] font-bold select-none">
              <button
                onClick={() => setPhyTab('phy-formulas')}
                className={`py-2 px-3 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                  phyTab === 'phy-formulas'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                Công thức
              </button>
              <button
                onClick={() => setPhyTab('phy-units')}
                className={`py-2 px-3 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                  phyTab === 'phy-units'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                Đơn vị SI
              </button>
              <button
                onClick={() => setPhyTab('phy-constants')}
                className={`py-2 px-3 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                  phyTab === 'phy-constants'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Hằng số chuẩn
              </button>
            </div>
          ) : (
            <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 text-[11px] font-bold overflow-x-auto select-none no-scrollbar">
              <button
                onClick={() => setChemTab('elements')}
                className={`py-2 px-3 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                  chemTab === 'elements'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Atom className="w-3.5 h-3.5" />
                Nguyên tố (M)
              </button>
              <button
                onClick={() => setChemTab('solubility')}
                className={`py-2 px-3 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                  chemTab === 'solubility'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
                Bảng tính tan
              </button>
              <button
                onClick={() => setChemTab('reactivity')}
                className={`py-2 px-3 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                  chemTab === 'reactivity'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Dãy hoạt động
              </button>
              <button
                onClick={() => setChemTab('radicals')}
                className={`py-2 px-3 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                  chemTab === 'radicals'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                Hóa trị gốc
              </button>
              <button
                onClick={() => setChemTab('formulas')}
                className={`py-2 px-3 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                  chemTab === 'formulas'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                Công thức
              </button>
            </div>
          )}

          {/* Search bar (for chem elements) */}
          {!isPhy && chemTab === 'elements' && (
            <div className="p-2.5 border-b border-slate-800/80 bg-slate-900/50">
              <div className="relative text-slate-100">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Tìm tên hoặc kí hiệu (vd: Fe, O, Sắt, Sodium...)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>
          )}

          {/* Search bar (for physics formulas) */}
          {isPhy && phyTab === 'phy-formulas' && (
            <div className="p-2.5 border-b border-slate-800/80 bg-slate-900/50">
              <div className="relative text-slate-100">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/70" />
                <input
                  type="text"
                  placeholder="Tìm công thức (vd: công, động năng, ôm, điện trở, thấu kính...)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="p-3 overflow-y-auto flex-1 space-y-3">
            {/* ── PHYSICS TABS ── */}
            {isPhy && phyTab === 'phy-formulas' && (
              <div className="space-y-2.5">
                {filteredPhyFormulas.map((f, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5 hover:border-amber-500/40 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-200">{f.name}</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 shrink-0">
                        {f.category}
                      </span>
                    </div>
                    <div className="text-sm font-black text-amber-300 font-mono tracking-wide">{f.eq}</div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">{f.note}</div>
                  </div>
                ))}
                {filteredPhyFormulas.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-500">
                    Không tìm thấy công thức phù hợp với từ khóa "{search}"
                  </div>
                )}
              </div>
            )}

            {isPhy && phyTab === 'phy-units' && (
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 leading-relaxed font-medium">
                  💡 <strong>Quy tắc giải toán Vật lý:</strong> Luôn đổi tất cả các đại lượng về đơn vị chuẩn trong hệ SI trước khi thế số vào công thức tính toán.
                </div>
                {PHYSICS_UNITS.map((u, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="text-xs font-bold text-slate-200">{u.qty}</span>
                      <div className="text-[11px] text-amber-300 font-mono mt-0.5">{u.conv}</div>
                    </div>
                    <span className="text-xs font-mono font-black text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-xl shrink-0 self-start sm:self-auto border border-slate-700">
                      SI: {u.si}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {isPhy && phyTab === 'phy-constants' && (
              <div className="space-y-2.5">
                {PHYSICS_CONSTANTS.map((c, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{c.name}</span>
                      <span className="text-xs font-mono font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/30">
                        {c.sym}
                      </span>
                    </div>
                    <div className="text-sm font-black text-emerald-400 font-mono">{c.val}</div>
                    <div className="text-[11px] text-slate-400">{c.note}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ── CHEMISTRY TABS ── */}
            {/* 1. Tab Nguyên tố */}
            {!isPhy && chemTab === 'elements' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredElements.map((el) => (
                  <div
                    key={el.sym}
                    className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-base font-black text-cyan-400 font-mono">
                        {el.sym}
                      </div>
                      <div className="text-xs font-bold text-slate-200">{el.name}</div>
                      <div className="text-[10px] text-slate-400 italic">({el.vnName})</div>
                      <div className="text-[10px] text-slate-500 font-semibold mt-0.5">HT: {el.val}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-amber-300 font-mono">
                        {el.m}
                      </div>
                      <div className="text-[9px] text-slate-500 uppercase font-bold">amu</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. Tab Bảng tính tan */}
            {!isPhy && chemTab === 'solubility' && (
              <div className="space-y-3">
                {/* Legend bar */}
                <div className="flex flex-wrap gap-2 text-[11px] p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-300">
                    <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/60 inline-flex items-center justify-center text-[9px]">T</span> Tan
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-rose-300">
                    <span className="w-3 h-3 rounded bg-rose-500/20 border border-rose-500/60 inline-flex items-center justify-center text-[9px]">K</span> Không tan (↓)
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-amber-300">
                    <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/60 inline-flex items-center justify-center text-[9px]">I</span> Ít tan
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-slate-400">
                    <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700 inline-flex items-center justify-center text-[9px]">-</span> Không tồn tại / bay hơi
                  </span>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/50 shadow-inner">
                  <table className="w-full text-xs text-center border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 font-black text-slate-300 text-[11px]">
                        <th className="p-2.5 text-left sticky left-0 bg-slate-900 z-10">Cation</th>
                        <th className="p-2 border-l border-slate-800"><Formula formula="OH^-" /></th>
                        <th className="p-2 border-l border-slate-800"><Formula formula="Cl^-" /></th>
                        <th className="p-2 border-l border-slate-800"><Formula formula="NO3^-" /></th>
                        <th className="p-2 border-l border-slate-800"><Formula formula="SO4^2-" /></th>
                        <th className="p-2 border-l border-slate-800"><Formula formula="CO3^2-" /></th>
                        <th className="p-2 border-l border-slate-800"><Formula formula="PO4^3-" /></th>
                        <th className="p-2 border-l border-slate-800"><Formula formula="S^2-" /></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 font-mono">
                      {SOLUBILITY_DATA.map((row) => (
                        <tr key={row.cation} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-2 text-left font-bold text-cyan-300 font-sans sticky left-0 bg-slate-950/95 border-r border-slate-800 whitespace-nowrap">
                            {row.cationLabel}
                          </td>
                          {[row.OH, row.Cl, row.NO3, row.SO4, row.CO3, row.PO4, row.S].map((cell, idx) => {
                            const isK = cell.val === 'K';
                            const isT = cell.val === 'T';
                            const isI = cell.val === 'I';
                            return (
                              <td key={idx} className="p-2 border-l border-slate-800/60">
                                <span
                                  className={`inline-block px-1.5 py-0.5 rounded font-black text-xs ${
                                    isT
                                      ? 'text-emerald-300 bg-emerald-950/40'
                                      : isK
                                      ? 'text-rose-300 bg-rose-950/60 font-bold'
                                      : isI
                                      ? 'text-amber-300 bg-amber-950/40'
                                      : 'text-slate-500'
                                  }`}
                                  title={cell.color || undefined}
                                >
                                  {cell.val}
                                </span>
                                {cell.color && (
                                  <div className="text-[9px] font-sans text-slate-400 scale-90 -mt-0.5 truncate max-w-15 mx-auto">
                                    {cell.color}
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <div className="font-bold text-amber-300 mb-1">💡 Mẹo nhớ nhanh tính tan:</div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                    <li>Tất cả muối của <strong className="text-slate-200">Na, K, <Formula formula="NH4^+" /></strong> và muối <strong className="text-slate-200">Nitrate (<Formula formula="NO3^-" />)</strong> đều <strong>tan hoàn toàn</strong>.</li>
                    <li>Muối <strong className="text-slate-200">Chloride (<Formula formula="Cl^-" />)</strong>: chỉ có <strong><Formula formula="AgCl" /> ↓ trắng</strong> không tan; <Formula formula="PbCl2" /> ít tan.</li>
                    <li>Muối <strong className="text-slate-200">Sulfate (<Formula formula="SO4^2-" />)</strong>: có <strong><Formula formula="BaSO4" /> ↓ trắng</strong> không tan; <Formula formula="CaSO4" />, <Formula formula="Ag2SO4" /> ít tan.</li>
                    <li>Muối <strong className="text-slate-200">Carbonate (<Formula formula="CO3^2-" />)</strong> & <strong className="text-slate-200">Phosphate (<Formula formula="PO4^3-" />)</strong>: hầu hết không tan, trừ muối của Na, K.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 3. Tab Dãy hoạt động hóa học */}
            {!isPhy && chemTab === 'reactivity' && (
              <div className="space-y-3">
                {/* Mnemonic Banner */}
                <div className="p-3 rounded-2xl bg-linear-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-700/50">
                  <div className="text-xs font-black text-cyan-300 mb-1 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Câu thần chú học thuộc lòng:</span>
                  </div>
                  <p className="text-xs font-medium text-slate-200 leading-relaxed italic">
                    "<strong>Khi (K) nào (Na) cần (Ca) may (Mg) áo (Al) giáp (Zn) sắt (Fe) nhớ (Ni) sang (Sn) phố (Pb) hỏi (H) cửa (Cu) hàng (Hg) á (Ag) phi (Pt) âu (Au)</strong>"
                  </p>
                </div>

                {/* Series horizontal cards */}
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2">
                    <span className="text-rose-400 font-extrabold">← Kim loại hoạt động MẠNH</span>
                    <span className="text-blue-400 font-extrabold">Kim loại hoạt động YẾU →</span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {REACTIVITY_SERIES.map((m) => (
                      <div
                        key={m.sym}
                        className={`p-2 rounded-xl text-center border transition-all ${
                          m.isDivider
                            ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                            : 'bg-slate-900 border-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="text-base font-black font-mono leading-none">
                          {m.sym}
                        </div>
                        <div className="text-[10px] font-extrabold text-cyan-400 mt-1">
                          {m.mnemonic}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3 Golden Rules */}
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <span className="font-black text-rose-400">1. Tác dụng với nước ở t° thường:</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Chỉ có các kim loại mạnh: <strong>K, Na, Ca, Ba</strong> phản ứng mạnh với nước tạo dung dịch kiềm (base) và giải phóng khí <Formula formula="H2" />.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <span className="font-black text-amber-400">2. Tác dụng với dung dịch Acid (HCl, <Formula formula="H2SO4" /> loãng):</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Kim loại đứng <strong>trước H</strong> (từ K đến Pb) phản ứng giải phóng khí <Formula formula="H2" />. Các kim loại đứng <strong>sau H (Cu, Ag, Pt, Au) không phản ứng</strong>.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <span className="font-black text-emerald-400">3. Kim loại đẩy nhau ra khỏi dung dịch muối:</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Kim loại đứng trước (từ Mg trở đi) <strong>đẩy kim loại đứng sau</strong> ra khỏi dung dịch muối của chúng. (Ví dụ: Fe + <Formula formula="CuSO4" /> → <Formula formula="FeSO4" /> + Cu ↓).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Tab Hóa trị gốc */}
            {!isPhy && chemTab === 'radicals' && (
              <div className="grid grid-cols-2 gap-2">
                {RADICALS.map((rad) => (
                  <div
                    key={rad.group}
                    className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-black text-amber-400 font-mono">
                        {rad.group}
                      </div>
                      <div className="text-[11px] text-slate-300 font-bold">{rad.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">M = {rad.formulaM} g/mol</div>
                    </div>
                    <div className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-black text-xs">
                      HT: {rad.val}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. Tab Công thức */}
            {!isPhy && chemTab === 'formulas' && (
              <div className="space-y-2">
                {FORMULAS.map((f, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1"
                  >
                    <div className="text-xs font-bold text-slate-200">{f.name}</div>
                    <div className="text-sm font-black text-emerald-400 font-mono">
                      {f.eq}
                    </div>
                    <div className="text-[10px] text-slate-400">{f.note}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
