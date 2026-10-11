import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  RotateCcw,
  Plus,
  Trash2,
  AlertTriangle,
  Lightbulb,
  ToggleLeft,
  ToggleRight,
  Info,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { solveCircuit } from '../circuitEngine';
import type { CircuitComponent, ComponentType } from '../types';
import { sound } from '@/lib/audio';

// Presets for quick learning
const CIRCUIT_PRESETS: { name: string; components: CircuitComponent[] }[] = [
  {
    name: 'Mạch chuẩn (1 pin + 1 công tắc + 1 đèn)',
    components: [
      { id: 'bat-1', type: 'battery', value: 3, position: 0 },
      { id: 'sw-1', type: 'switch', value: 0, state: true, position: 1 },
      { id: 'bulb-1', type: 'bulb', value: 10, position: 2 },
    ],
  },
  {
    name: 'Mạch có điện trở giảm sáng (Pin 3V + R=20Ω + Đèn 10Ω)',
    components: [
      { id: 'bat-1', type: 'battery', value: 3, position: 0 },
      { id: 'res-1', type: 'resistor', value: 20, position: 1 },
      { id: 'bulb-1', type: 'bulb', value: 10, position: 2 },
      { id: 'sw-1', type: 'switch', value: 0, state: true, position: 3 },
    ],
  },
  {
    name: 'Cảnh báo quá tải cháy bóng (Pin 15V + Đèn 10Ω)',
    components: [
      { id: 'bat-1', type: 'battery', value: 9, position: 0 },
      { id: 'bat-2', type: 'battery', value: 6, position: 1 },
      { id: 'sw-1', type: 'switch', value: 0, state: true, position: 2 },
      { id: 'bulb-1', type: 'bulb', value: 10, position: 3 },
    ],
  },
];

export const CircuitLab: React.FC = () => {
  // Initial default: standard circuit
  const [components, setComponents] = useState<CircuitComponent[]>([
    { id: 'bat-1', type: 'battery', value: 3, position: 0 },
    { id: 'sw-1', type: 'switch', value: 0, state: true, position: 1 },
    { id: 'bulb-1', type: 'bulb', value: 10, position: 2 },
  ]);

  const simState = useMemo(() => solveCircuit(components), [components]);

  // Toggle switch
  const toggleSwitch = useCallback((id: string) => {
    sound.playClick();
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, state: !c.state } : c))
    );
  }, []);

  // Remove component
  const handleRemove = useCallback((id: string) => {
    sound.playClick();
    setComponents((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Add component
  const handleAdd = useCallback(
    (type: ComponentType, value: number = 0) => {
      if (components.length >= 6) return;
      sound.playClick();
      const newId = `${type}-${Date.now().toString(36)}`;
      const newComp: CircuitComponent = {
        id: newId,
        type,
        value: type === 'battery' ? value || 3 : type === 'bulb' ? 10 : type === 'resistor' ? value || 10 : 0,
        state: type === 'switch' ? true : undefined,
        position: components.length,
      };
      setComponents((prev) => [...prev, newComp]);
    },
    [components.length]
  );

  // Apply preset
  const handleApplyPreset = useCallback((presetComponents: CircuitComponent[]) => {
    sound.playClick();
    setComponents(presetComponents);
  }, []);

  // Reset
  const handleReset = useCallback(() => {
    sound.playClick();
    setComponents([]);
  }, []);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-3.5 rounded-2xl bg-[#18272f] border-2 border-[#2e4756] flex items-center justify-between gap-3 shadow-[0_3px_0_0_#101a1f]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 fill-amber-400/30" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-white">Bàn Lắp Mạch Điện Vật Lý Ảo</h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Lắp pin, công tắc, bóng đèn, điện trở. Kiểm chứng Định luật Ôm: I = U / R.
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-[#20333d] hover:bg-[#ff4b4b]/20 hover:border-[#ff4b4b]/50 border-2 border-[#2e4756] text-slate-300 hover:text-[#ff4b4b] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-[0_2px_0_0_#131f24] active:translate-y-[2px] active:shadow-none"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Main Grid: Workbench + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Circuit Workbench (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Circuit Canvas Container */}
          <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#101a1f] relative overflow-hidden">
            {/* Background grid markings */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />

            {/* Circuit Status Header */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                Mạch Điện Nối Tiếp ({components.length}/6 linh kiện)
              </span>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                  simState.isShortCircuit
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                    : simState.isClosed && simState.current > 0
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-700/50 text-slate-400 border-slate-600'
                }`}
              >
                {simState.isShortCircuit
                  ? '⚠️ ĐOẢN MẠCH'
                  : simState.isClosed && simState.current > 0
                  ? '⚡ MẠCH KÍN CÓ DÒNG ĐIỆN'
                  : '⚪ MẠCH HỞ / KHÔNG DÒNG'}
              </span>
            </div>

            {/* Interactive Circuit Loop Schematic */}
            <div className="min-h-[260px] rounded-2xl bg-[#131f24] border-2 border-[#20333d] p-3 flex flex-col justify-between relative">
              {/* Animated Electrons Wire Simulation if circuit closed with current */}
              {simState.isClosed && simState.current > 0 && !simState.isShortCircuit && (
                <div className="absolute inset-2 border-2 border-dashed border-amber-400/40 rounded-xl pointer-events-none animate-[pulse_1.5s_infinite]" />
              )}

              {components.length === 0 ? (
                <div className="h-56 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#20333d] flex items-center justify-center text-slate-500 mb-2">
                    <Zap className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-400">
                    Mạch đang trống. Hãy bấm thêm linh kiện bên dưới hoặc chọn một Mạch Mẫu!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-auto">
                  {components.map((comp) => {
                    return (
                      <motion.div
                        key={comp.id}
                        layout
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className={`p-2.5 rounded-2xl border-2 transition-all relative flex flex-col justify-between min-h-[96px] ${
                          comp.type === 'bulb' && simState.bulbBrightness > 0 && !simState.isBulbBurnt
                            ? 'bg-amber-500/10 border-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                            : comp.type === 'bulb' && simState.isBulbBurnt
                            ? 'bg-rose-500/10 border-rose-500/50'
                            : 'bg-[#18272f] border-[#2e4756]'
                        }`}
                      >
                        {/* Remove button */}
                        <button
                          onClick={() => handleRemove(comp.id)}
                          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-md bg-[#20333d] hover:bg-rose-500/30 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                          title="Xóa linh kiện"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>

                        {/* Component Visual Representation */}
                        <div>
                          {comp.type === 'battery' && (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-xs">
                                🔋
                              </div>
                              <div>
                                <div className="text-xs font-black text-white">Nguồn Pin</div>
                                <div className="text-[11px] font-bold text-amber-400">
                                  {comp.value}V
                                </div>
                              </div>
                            </div>
                          )}

                          {comp.type === 'switch' && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleSwitch(comp.id)}
                                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all cursor-pointer border ${
                                  comp.state
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                }`}
                                title="Bấm để Đóng/Ngắt công tắc"
                              >
                                {comp.state ? (
                                  <ToggleRight className="w-5 h-5" />
                                ) : (
                                  <ToggleLeft className="w-5 h-5" />
                                )}
                              </button>
                              <div>
                                <div className="text-xs font-black text-white">Công tắc K</div>
                                <div
                                  className={`text-[10px] font-bold ${
                                    comp.state ? 'text-emerald-400' : 'text-rose-400'
                                  }`}
                                >
                                  {comp.state ? 'ĐANG ĐÓNG' : 'ĐANG NGẮT'}
                                </div>
                              </div>
                            </div>
                          )}

                          {comp.type === 'bulb' && (
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all border ${
                                  simState.isBulbBurnt
                                    ? 'bg-rose-950 text-rose-400 border-rose-700'
                                    : simState.bulbBrightness > 0
                                    ? 'bg-yellow-400 text-slate-950 border-amber-300 shadow-[0_0_12px_#facc15]'
                                    : 'bg-slate-800 text-slate-500 border-slate-700'
                                }`}
                              >
                                <Lightbulb className="w-5 h-5 fill-current" />
                              </div>
                              <div>
                                <div className="text-xs font-black text-white">Bóng đèn Đ</div>
                                <div className="text-[10px] font-bold text-slate-400">
                                  {simState.isBulbBurnt ? (
                                    <span className="text-rose-400 font-black">CHÁY DÂY TÓC!</span>
                                  ) : simState.bulbBrightness > 0 ? (
                                    <span className="text-amber-400 font-bold">
                                      Sáng {Math.round(simState.bulbBrightness * 100)}%
                                    </span>
                                  ) : (
                                    'Tắt (0%)'
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {comp.type === 'resistor' && (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center font-black text-xs">
                                ⚡
                              </div>
                              <div>
                                <div className="text-xs font-black text-white">Điện trở R</div>
                                <div className="text-[11px] font-bold text-purple-400">
                                  {comp.value} Ω
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Bottom Tag */}
                        <div className="text-[9px] font-semibold text-slate-400 text-right mt-1">
                          Vị trí #{comp.position + 1}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Status footer inside schematic */}
              <div
                className={`mt-2 p-2 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                  simState.isShortCircuit
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : simState.isBulbBurnt
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-[#18272f] text-slate-300 border-[#2e4756]'
                }`}
              >
                {simState.isShortCircuit || simState.isBulbBurnt ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-sky-400 shrink-0" />
                )}
                <span className="leading-tight">{simState.statusMessage}</span>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="p-3.5 rounded-2xl bg-[#18272f] border-2 border-[#2e4756] space-y-2">
            <span className="text-xs font-black text-white uppercase tracking-wider block">
              Mạch Thí Nghiệm Mẫu SGK
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {CIRCUIT_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(preset.components)}
                  className="p-2 rounded-xl bg-[#20333d] hover:bg-sky-500/20 border-2 border-[#2e4756] hover:border-sky-500/40 text-left transition-all cursor-pointer group"
                >
                  <div className="text-[11px] font-black text-white group-hover:text-sky-300 line-clamp-1">
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {preset.components.length} linh kiện
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Component Inventory & Digital Multimeter (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Digital Multimeter (Đồng hồ đo Vôn & Ampe số) */}
          <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#101a1f] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Đồng Hồ Đo Kỹ Thuật Số
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                MULTIMETER
              </span>
            </div>

            {/* LCD Screen Display */}
            <div className="p-3 rounded-2xl bg-[#0b1317] border-2 border-[#20333d] font-mono space-y-2 shadow-inner">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-sans">Hiệu điện thế (U)</span>
                <span className="text-sky-400 font-black text-sm tracking-widest">
                  {simState.totalVoltage.toFixed(1)} V
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-sans">Tổng điện trở (R)</span>
                <span className="text-purple-400 font-black text-sm tracking-widest">
                  {simState.totalResistance} Ω
                </span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between items-center">
                <span className="text-amber-400 font-sans font-bold text-xs">
                  Cường độ dòng điện (I = U/R)
                </span>
                <span className="text-amber-300 font-black text-base tracking-widest">
                  {simState.current.toFixed(2)} A
                </span>
              </div>
            </div>

            {/* Ohm Law Formula Card */}
            <div className="p-3 rounded-2xl bg-[#20333d]/60 border border-[#2e4756] text-xs space-y-1">
              <div className="font-black text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Định luật Ôm (Ohm&apos;s Law):
              </div>
              <p className="text-slate-300 text-[11px] font-medium leading-relaxed">
                Cường độ dòng điện chạy qua dây dẫn tỉ lệ thuận với hiệu điện thế giữa hai đầu dây và
                tỉ lệ nghịch với điện trở của dây:{' '}
                <span className="font-mono font-black text-amber-400">I = U / R</span>
              </p>
            </div>
          </div>

          {/* Component Toolbox (Hộp linh kiện có thể thêm) */}
          <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#101a1f] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-400" />
                Hộp Linh Kiện Điện
              </span>
              <span className="text-[10px] font-bold text-slate-400">Chạm để thêm</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Add Battery 1.5V */}
              <button
                onClick={() => handleAdd('battery', 1.5)}
                disabled={components.length >= 6}
                className="p-2.5 rounded-2xl bg-[#20333d] hover:bg-[#28404e] border-2 border-[#2e4756] text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-[0_2px_0_0_#131f24] active:translate-y-[2px] active:shadow-none"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">🔋</span>
                  <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                    1.5V
                  </span>
                </div>
                <div className="text-xs font-black text-white mt-1">Pin AA (1.5V)</div>
                <div className="text-[10px] text-slate-400">Nguồn 1 pin con thỏ</div>
              </button>

              {/* Add Battery 9V */}
              <button
                onClick={() => handleAdd('battery', 9)}
                disabled={components.length >= 6}
                className="p-2.5 rounded-2xl bg-[#20333d] hover:bg-[#28404e] border-2 border-[#2e4756] text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-[0_2px_0_0_#131f24] active:translate-y-[2px] active:shadow-none"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">⚡</span>
                  <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                    9V
                  </span>
                </div>
                <div className="text-xs font-black text-white mt-1">Pin Vuông (9V)</div>
                <div className="text-[10px] text-slate-400">Nguồn áp cao</div>
              </button>

              {/* Add Switch */}
              <button
                onClick={() => handleAdd('switch')}
                disabled={components.length >= 6}
                className="p-2.5 rounded-2xl bg-[#20333d] hover:bg-[#28404e] border-2 border-[#2e4756] text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-[0_2px_0_0_#131f24] active:translate-y-[2px] active:shadow-none"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">🔘</span>
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                    K
                  </span>
                </div>
                <div className="text-xs font-black text-white mt-1">Công Tắc K</div>
                <div className="text-[10px] text-slate-400">Đóng / Ngắt dòng điện</div>
              </button>

              {/* Add Bulb */}
              <button
                onClick={() => handleAdd('bulb', 10)}
                disabled={components.length >= 6}
                className="p-2.5 rounded-2xl bg-[#20333d] hover:bg-[#28404e] border-2 border-[#2e4756] text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-[0_2px_0_0_#131f24] active:translate-y-[2px] active:shadow-none"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">💡</span>
                  <span className="text-[10px] font-black text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">
                    10Ω
                  </span>
                </div>
                <div className="text-xs font-black text-white mt-1">Bóng Đèn Sợi Đốt</div>
                <div className="text-[10px] text-slate-400">R = 10Ω định mức 3V</div>
              </button>

              {/* Add Resistor 20Ω */}
              <button
                onClick={() => handleAdd('resistor', 20)}
                disabled={components.length >= 6}
                className="p-2.5 rounded-2xl bg-[#20333d] hover:bg-[#28404e] border-2 border-[#2e4756] text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-[0_2px_0_0_#131f24] active:translate-y-[2px] active:shadow-none"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">⚙️</span>
                  <span className="text-[10px] font-black text-purple-400 bg-purple-400/10 px-1.5 py-0.5 rounded">
                    20Ω
                  </span>
                </div>
                <div className="text-xs font-black text-white mt-1">Điện Trở (20Ω)</div>
                <div className="text-[10px] text-slate-400">Cản trở dòng điện</div>
              </button>

              {/* Add Resistor 50Ω */}
              <button
                onClick={() => handleAdd('resistor', 50)}
                disabled={components.length >= 6}
                className="p-2.5 rounded-2xl bg-[#20333d] hover:bg-[#28404e] border-2 border-[#2e4756] text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-[0_2px_0_0_#131f24] active:translate-y-[2px] active:shadow-none"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">⚙️</span>
                  <span className="text-[10px] font-black text-purple-400 bg-purple-400/10 px-1.5 py-0.5 rounded">
                    50Ω
                  </span>
                </div>
                <div className="text-xs font-black text-white mt-1">Điện Trở Lớn (50Ω)</div>
                <div className="text-[10px] text-slate-400">Giảm dòng điện mạnh</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
