import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, ChevronDown, Atom } from 'lucide-react';

export interface ChemKeyboardProps {
  onInsert: (text: string) => void;
  onDelete: () => void;
  visible: boolean;
  onClose: () => void;
}

const ELEMENT_KEYS = [
  'H', 'O', 'C', 'N', 'Na', 'K',
  'Ca', 'Fe', 'Mg', 'Al', 'Cl', 'S',
  'P', 'Zn', 'Cu', 'Ba', 'Ag', 'Mn',
];

const DIGIT_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

const SYMBOL_KEYS = ['(', ')', '+', '−', '→', '↑', '↓', '·'];

/**
 * Mobile chemistry keyboard for formula/equation input.
 * Sticky to bottom, avoids native keyboard overlap via visualViewport.
 */
export const ChemKeyboard: React.FC<ChemKeyboardProps> = ({
  onInsert,
  onDelete,
  visible,
  onClose,
}) => {
  const [tab, setTab] = useState<'elements' | 'digits' | 'symbols'>('elements');

  const keyClass =
    'p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm hover:bg-slate-700 active:bg-slate-600 active:translate-y-0.5 transition-all cursor-pointer select-none min-w-[40px] min-h-[40px] flex items-center justify-center';

  const tabClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
      active
        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
        : 'bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:text-slate-300'
    }`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/98 backdrop-blur-xl border-t-2 border-slate-800 safe-pb"
        >
          {/* Tab bar + close */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <Atom className="w-4 h-4 text-cyan-400" />
              <button
                onClick={() => setTab('elements')}
                className={tabClass(tab === 'elements')}
              >
                Nguyên tố
              </button>
              <button
                onClick={() => setTab('digits')}
                className={tabClass(tab === 'digits')}
              >
                Số
              </button>
              <button
                onClick={() => setTab('symbols')}
                className={tabClass(tab === 'symbols')}
              >
                Ký hiệu
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              aria-label="Đóng bàn phím hóa học"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Key grid */}
          <div className="p-3">
            {tab === 'elements' && (
              <div className="grid grid-cols-6 gap-1.5">
                {ELEMENT_KEYS.map((el) => (
                  <button
                    key={el}
                    onClick={() => onInsert(el)}
                    className={keyClass}
                  >
                    {el}
                  </button>
                ))}
              </div>
            )}

            {tab === 'digits' && (
              <div className="grid grid-cols-5 gap-1.5">
                {DIGIT_KEYS.map((d) => (
                  <button key={d} onClick={() => onInsert(d)} className={keyClass}>
                    {d}
                  </button>
                ))}
              </div>
            )}

            {tab === 'symbols' && (
              <div className="grid grid-cols-4 gap-1.5">
                {SYMBOL_KEYS.map((s) => (
                  <button key={s} onClick={() => onInsert(s)} className={keyClass}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Delete key — always visible */}
            <div className="flex justify-end mt-2">
              <button
                onClick={onDelete}
                className="px-4 py-2 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 font-bold text-sm hover:bg-rose-900/50 active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Delete className="w-4 h-4" />
                Xóa
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
