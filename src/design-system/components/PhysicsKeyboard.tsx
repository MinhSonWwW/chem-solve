import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, ChevronDown, Zap } from 'lucide-react';

export interface PhysicsKeyboardProps {
  onInsert: (text: string) => void;
  onDelete: () => void;
  visible: boolean;
  onClose: () => void;
}

const UNIT_KEYS = [
  'V', 'A', 'Ω', 'W', 'kW', 'J', 'kJ',
  'N', 'Pa', 'm/s', 'km/h', 'kg', 'g',
  'm', 'cm', 's', 'h', '°C', 'Hz',
];

const DIGIT_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', ','];

const SYMBOL_KEYS = [
  'Δ', '·', '/', '√', '²', '³', '(', ')',
  '=', '≈', '+', '−', '10^', 'π', 'g', 'c'
];

/**
 * Mobile physics keyboard for units, math symbols and formula input.
 * Sticky to bottom, touch-optimized.
 */
export const PhysicsKeyboard: React.FC<PhysicsKeyboardProps> = ({
  onInsert,
  onDelete,
  visible,
  onClose,
}) => {
  const [tab, setTab] = useState<'units' | 'digits' | 'symbols'>('units');

  const keyClass =
    'p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm hover:bg-slate-700 active:bg-slate-600 active:translate-y-0.5 transition-all cursor-pointer select-none min-w-[40px] min-h-[40px] flex items-center justify-center';

  const tabClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
      active
        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
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
              <Zap className="w-4 h-4 text-amber-400" />
              <button
                onClick={() => setTab('units')}
                className={tabClass(tab === 'units')}
              >
                Đơn vị
              </button>
              <button
                onClick={() => setTab('digits')}
                className={tabClass(tab === 'digits')}
              >
                Số & Dấu
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
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Đóng bàn phím"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Key grid */}
          <div className="p-3">
            {tab === 'units' && (
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">
                {UNIT_KEYS.map((k) => (
                  <button
                    key={k}
                    onClick={() => onInsert(` ${k}`)}
                    className={`${keyClass} text-amber-300 font-semibold`}
                  >
                    {k}
                  </button>
                ))}
                <button
                  onClick={onDelete}
                  className={`${keyClass} bg-red-950/40 border-red-800/40 text-red-300 hover:bg-red-900/50`}
                  title="Xóa"
                >
                  <Delete className="w-4 h-4" />
                </button>
              </div>
            )}

            {tab === 'digits' && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                {DIGIT_KEYS.map((k) => (
                  <button
                    key={k}
                    onClick={() => onInsert(k)}
                    className={`${keyClass} text-lg`}
                  >
                    {k}
                  </button>
                ))}
                <button
                  onClick={onDelete}
                  className={`${keyClass} bg-red-950/40 border-red-800/40 text-red-300 hover:bg-red-900/50`}
                  title="Xóa"
                >
                  <Delete className="w-4 h-4" />
                </button>
              </div>
            )}

            {tab === 'symbols' && (
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {SYMBOL_KEYS.map((k) => (
                  <button
                    key={k}
                    onClick={() => onInsert(k)}
                    className={`${keyClass} text-base`}
                  >
                    {k}
                  </button>
                ))}
                <button
                  onClick={onDelete}
                  className={`${keyClass} bg-red-950/40 border-red-800/40 text-red-300 hover:bg-red-900/50`}
                  title="Xóa"
                >
                  <Delete className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
