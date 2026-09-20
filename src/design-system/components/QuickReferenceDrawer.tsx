import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Atom, Scale, Calculator } from 'lucide-react';

export interface QuickReferenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ELEMENTS = [
  { sym: 'H', name: 'Hiđro', m: 1, val: 'I' },
  { sym: 'He', name: 'Heli', m: 4, val: '0' },
  { sym: 'C', name: 'Cacbon', m: 12, val: 'IV, II' },
  { sym: 'N', name: 'Nitơ', m: 14, val: 'III, IV, II, V' },
  { sym: 'O', name: 'Oxi', m: 16, val: 'II' },
  { sym: 'Na', name: 'Natri', m: 23, val: 'I' },
  { sym: 'Mg', name: 'Magie', m: 24, val: 'II' },
  { sym: 'Al', name: 'Nhôm', m: 27, val: 'III' },
  { sym: 'P', name: 'Photpho', m: 31, val: 'V, III' },
  { sym: 'S', name: 'Lưu huỳnh', m: 32, val: 'II, IV, VI' },
  { sym: 'Cl', name: 'Clo', m: 35.5, val: 'I' },
  { sym: 'K', name: 'Kali', m: 39, val: 'I' },
  { sym: 'Ca', name: 'Canxi', m: 40, val: 'II' },
  { sym: 'Fe', name: 'Sắt', m: 56, val: 'II, III' },
  { sym: 'Cu', name: 'Đồng', m: 64, val: 'II, I' },
  { sym: 'Zn', name: 'Kẽm', m: 65, val: 'II' },
  { sym: 'Br', name: 'Brom', m: 80, val: 'I' },
  { sym: 'Ag', name: 'Bạc', m: 108, val: 'I' },
  { sym: 'Ba', name: 'Bari', m: 137, val: 'II' },
];

const RADICALS = [
  { group: '-OH', name: 'Hiđroxit', val: 'I' },
  { group: '-NO3', name: 'Nitrat', val: 'I' },
  { group: '-Cl', name: 'Clorua', val: 'I' },
  { group: '=SO4', name: 'Sunfat', val: 'II' },
  { group: '=CO3', name: 'Cacbonat', val: 'II' },
  { group: '=SO3', name: 'Sunfit', val: 'II' },
  { group: '=S', name: 'Sunfua', val: 'II' },
  { group: '≡PO4', name: 'Photphat', val: 'III' },
];

const FORMULAS = [
  { name: 'Số mol theo khối lượng', eq: 'n = m / M', note: 'm (gam), M (g/mol)' },
  { name: 'Thể tích khí (chuẩn 25°C, 1 bar)', eq: 'V = n × 24,79', note: 'V (lít), n (mol)' },
  { name: 'Nồng độ phần trăm', eq: 'C% = (m_ct / m_dd) × 100%', note: 'm_dd = m_ct + m_dm' },
  { name: 'Nồng độ mol', eq: 'C_M = n / V', note: 'V (lít)' },
];

export const QuickReferenceDrawer: React.FC<QuickReferenceDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [tab, setTab] = useState<'elements' | 'radicals' | 'formulas'>('elements');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredElements = ELEMENTS.filter(
    (e) =>
      e.sym.toLowerCase().includes(search.toLowerCase()) ||
      e.name.toLowerCase().includes(search.toLowerCase())
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
          className="relative w-full max-w-lg bg-slate-900 border-t-2 sm:border-2 border-slate-700 rounded-t-3xl sm:rounded-3xl max-h-[85dvh] flex flex-col shadow-2xl z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧪</span>
              <div>
                <h3 className="text-base font-black text-slate-100">
                  Sổ tay tra cứu Hóa học
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  Nguyên tử khối, hóa trị và công thức THCS
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
          <div className="flex border-b border-slate-800 bg-slate-950/50 p-1.5 gap-1.5 text-xs font-bold">
            <button
              onClick={() => setTab('elements')}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                tab === 'elements'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Atom className="w-4 h-4" />
              Nguyên tố (M)
            </button>
            <button
              onClick={() => setTab('radicals')}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                tab === 'radicals'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Scale className="w-4 h-4" />
              Hóa trị gốc
            </button>
            <button
              onClick={() => setTab('formulas')}
              className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                tab === 'formulas'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Công thức
            </button>
          </div>

          {/* Search bar (only for elements) */}
          {tab === 'elements' && (
            <div className="p-3 border-b border-slate-800/80 bg-slate-900/50">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Tìm tên hoặc kí hiệu (vd: Fe, O, Canxi...)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="p-3 overflow-y-auto flex-1 space-y-2">
            {tab === 'elements' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredElements.map((el) => (
                  <div
                    key={el.sym}
                    className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-base font-black text-cyan-400">
                        {el.sym}
                      </div>
                      <div className="text-[11px] text-slate-400">{el.name}</div>
                      <div className="text-[10px] text-slate-500">HT: {el.val}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-200 font-mono">
                        {el.m}
                      </div>
                      <div className="text-[9px] text-slate-500 uppercase">đvC</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

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
                      <div className="text-[11px] text-slate-400">{rad.name}</div>
                    </div>
                    <div className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-black text-xs">
                      {rad.val}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'formulas' && (
              <div className="space-y-2">
                {FORMULAS.map((f, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1"
                  >
                    <div className="text-xs font-bold text-slate-300">{f.name}</div>
                    <div className="text-sm font-black text-emerald-400 font-mono">
                      {f.eq}
                    </div>
                    <div className="text-[10px] text-slate-500">{f.note}</div>
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
