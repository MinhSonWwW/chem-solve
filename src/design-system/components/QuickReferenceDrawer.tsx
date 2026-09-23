import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Atom, Scale, Calculator, Droplets, Zap } from 'lucide-react';

export interface QuickReferenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

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
  { cation: 'H+', cationLabel: 'H⁺ (Axit)', OH: { val: 'T' }, Cl: { val: 'T' }, NO3: { val: 'T' }, SO4: { val: 'T' }, CO3: { val: 'B', color: 'Bay hơi CO2' }, PO4: { val: 'T' }, S: { val: 'B', color: 'Khí H2S' } },
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
}) => {
  const [tab, setTab] = useState<'elements' | 'solubility' | 'reactivity' | 'radicals' | 'formulas'>('elements');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredElements = ELEMENTS.filter(
    (e) =>
      e.sym.toLowerCase().includes(search.toLowerCase()) ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.vnName.toLowerCase().includes(search.toLowerCase())
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
              <span className="text-2xl">🧪</span>
              <div>
                <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                  Sổ tay tra cứu Hóa học
                  <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    THCS 7-9
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  Nguyên tử khối, Bảng tính tan, Dãy hoạt động và Công thức
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
          <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 text-[11px] font-bold overflow-x-auto select-none no-scrollbar">
            <button
              onClick={() => setTab('elements')}
              className={`py-2 px-3 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                tab === 'elements'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              Nguyên tố (M)
            </button>
            <button
              onClick={() => setTab('solubility')}
              className={`py-2 px-3 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                tab === 'solubility'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              Bảng tính tan
            </button>
            <button
              onClick={() => setTab('reactivity')}
              className={`py-2 px-3 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                tab === 'reactivity'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Dãy hoạt động
            </button>
            <button
              onClick={() => setTab('radicals')}
              className={`py-2 px-3 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                tab === 'radicals'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              Hóa trị gốc
            </button>
            <button
              onClick={() => setTab('formulas')}
              className={`py-2 px-3 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                tab === 'formulas'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              Công thức
            </button>
          </div>

          {/* Search bar (for elements) */}
          {tab === 'elements' && (
            <div className="p-2.5 border-b border-slate-800/80 bg-slate-900/50">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Tìm tên hoặc kí hiệu (vd: Fe, O, Sắt, Sodium...)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="p-3 overflow-y-auto flex-1 space-y-3">
            {/* 1. Tab Nguyên tố */}
            {tab === 'elements' && (
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
                      <div className="text-[9px] text-slate-500 uppercase font-bold">amu (đvC)</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. Tab Bảng tính tan */}
            {tab === 'solubility' && (
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
                        <th className="p-2 border-l border-slate-800">OH⁻</th>
                        <th className="p-2 border-l border-slate-800">Cl⁻</th>
                        <th className="p-2 border-l border-slate-800">NO₃⁻</th>
                        <th className="p-2 border-l border-slate-800">SO₄²⁻</th>
                        <th className="p-2 border-l border-slate-800">CO₃²⁻</th>
                        <th className="p-2 border-l border-slate-800">PO₄³⁻</th>
                        <th className="p-2 border-l border-slate-800">S²⁻</th>
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
                                  <div className="text-[9px] font-sans text-slate-400 scale-90 -mt-0.5 truncate max-w-[60px] mx-auto">
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
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-400">
                    <li>Tất cả muối của <strong className="text-slate-200">Na, K, NH₄</strong> và muối <strong className="text-slate-200">Nitrat (NO₃)</strong> đều <strong>tan hoàn toàn</strong>.</li>
                    <li>Muối <strong className="text-slate-200">Clorua (Cl)</strong>: chỉ có <strong>AgCl ↓ trắng</strong> không tan; PbCl₂ ít tan.</li>
                    <li>Muối <strong className="text-slate-200">Sunfat (SO₄)</strong>: có <strong>BaSO₄ ↓ trắng</strong> không tan; CaSO₄, Ag₂SO₄ ít tan.</li>
                    <li>Muối <strong className="text-slate-200">Cacbonat (CO₃)</strong> & <strong className="text-slate-200">Photphat (PO₄)</strong>: hầu hết không tan, trừ muối của Na, K.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 3. Tab Dãy hoạt động hóa học */}
            {tab === 'reactivity' && (
              <div className="space-y-3">
                {/* Mnemonic Banner */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-700/50">
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
                      Chỉ có các kim loại mạnh: <strong>K, Na, Ca, Ba</strong> phản ứng mạnh với nước tạo dung dịch kiềm (base) và giải phóng khí H₂.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <span className="font-black text-amber-400">2. Tác dụng với dung dịch Acid (HCl, H₂SO₄ loãng):</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Kim loại đứng <strong>trước H</strong> (từ K đến Pb) phản ứng giải phóng khí H₂. Các kim loại đứng <strong>sau H (Cu, Ag, Pt, Au) không phản ứng</strong>.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <span className="font-black text-emerald-400">3. Kim loại đẩy nhau ra khỏi dung dịch muối:</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Kim loại đứng trước (từ Mg trở đi) <strong>đẩy kim loại đứng sau</strong> ra khỏi dung dịch muối của chúng. (Ví dụ: Fe + CuSO₄ → FeSO₄ + Cu ↓).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Tab Hóa trị gốc */}
            {tab === 'radicals' && (
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
            {tab === 'formulas' && (
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
