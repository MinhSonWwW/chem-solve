import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
  BatteryMedium,
  Activity,
  Gauge,
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

export interface CircuitLabProps {
  /** Fired once the student has made a bulb light up safely (closed, no short, not burnt). */
  onAchieve?: () => void;
}

export const CircuitLab: React.FC<CircuitLabProps> = ({ onAchieve }) => {
  // Initial default: standard circuit with the switch OPEN, so the student
  // has to close it themselves to light the bulb (the lab mission).
  const [components, setComponents] = useState<CircuitComponent[]>([
    { id: 'bat-1', type: 'battery', value: 3, position: 0 },
    { id: 'sw-1', type: 'switch', value: 0, state: false, position: 1 },
    { id: 'bulb-1', type: 'bulb', value: 10, position: 2 },
  ]);

  const simState = useMemo(() => solveCircuit(components), [components]);

  const missionDone =
    simState.isClosed &&
    !simState.isShortCircuit &&
    !simState.isBulbBurnt &&
    simState.bulbBrightness > 0;
  useEffect(() => {
    if (missionDone) onAchieve?.();
  }, [missionDone, onAchieve]);

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
      <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border)] flex items-center justify-between gap-3 shadow-[0_3px_0_0_var(--edge-neutral)]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-[var(--gold-fg)] border border-amber-500/40 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 fill-amber-400/30" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-[var(--text-primary)]">Bàn lắp mạch điện vật lý ảo</h3>
            <p className="text-xs text-slate-400 font-medium">
              Lắp pin, công tắc, bóng đèn, điện trở. Kiểm chứng Định luật Ôm: I = U / R.
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-[var(--bg-surface-2)] hover:bg-[var(--err-fill)]/20 hover:border-[var(--err-fill)]/50 border-2 border-[var(--border)] text-slate-300 hover:text-[var(--err-fill)] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-[0_2px_0_0_var(--edge-neutral)] active:translate-y-[2px] active:shadow-none"
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
          <div className="p-4 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border)] shadow-[0_4px_0_0_var(--edge-neutral)] relative overflow-hidden">
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
              <span className="text-xs font-black text-[var(--gold-fg)] flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                Mạch điện nối tiếp ({components.length}/6 linh kiện)
              </span>
              <span
                className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                  simState.isShortCircuit
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                    : simState.isClosed && simState.current > 0
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-700/50 text-slate-400 border-slate-600'
                }`}
              >
                {simState.isShortCircuit
                  ? 'Đoản mạch'
                  : simState.isClosed && simState.current > 0
                  ? 'Mạch kín có dòng điện'
                  : 'Mạch hở / không dòng'}
              </span>
            </div>

            {/* Interactive Circuit Loop Schematic */}
            <div className="min-h-[260px] rounded-2xl bg-[var(--bg-canvas)] border-2 border-[var(--border)] p-3 flex flex-col justify-between relative">
              {/* Animated Electrons Wire Simulation if circuit closed with current */}
              {simState.isClosed && simState.current > 0 && !simState.isShortCircuit && (
                <div className="absolute inset-2 border-2 border-dashed border-amber-400/40 rounded-xl pointer-events-none animate-[pulse_1.5s_infinite]" />
              )}

              {components.length === 0 ? (
                <div className="h-56 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface-2)] flex items-center justify-center text-slate-500 mb-2">
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
                            ? 'bg-amber-500/10 border-amber-500 shadow-sm'
                            : comp.type === 'bulb' && simState.isBulbBurnt
                            ? 'bg-rose-500/10 border-rose-500/50'
                            : 'bg-[var(--bg-surface)] border-[var(--border)]'
                        }`}
                      >
                        {/* Remove button */}
                        <button
                          onClick={() => handleRemove(comp.id)}
                          className="absolute top-1.5 right-1.5 w-7 h-7 rounded-lg bg-[var(--bg-surface-2)] hover:bg-rose-500/30 text-slate-400 hover:text-[var(--err-fg)] flex items-center justify-center transition-colors cursor-pointer"
                          title="Xóa linh kiện"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Component Visual Representation */}
                        <div className="pr-7 min-w-0">
                          {comp.type === 'battery' && (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-[var(--gold-fg)] border border-amber-500/40 flex items-center justify-center">
                                <BatteryMedium className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-xs font-black text-[var(--text-primary)]">Nguồn Pin</div>
                                <div className="text-xs font-bold text-[var(--gold-fg)]">
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
                                    ? 'bg-emerald-500/20 text-[var(--ok-fg)] border-emerald-500/40'
                                    : 'bg-rose-500/20 text-[var(--err-fg)] border-rose-500/40'
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
                                <div className="text-xs font-black text-[var(--text-primary)]">Công tắc K</div>
                                <div
                                  className={`text-[11px] font-bold ${
                                    comp.state ? 'text-[var(--ok-fg)]' : 'text-[var(--err-fg)]'
                                  }`}
                                >
                                  {comp.state ? 'Đang đóng' : 'Đang ngắt'}
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
                                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                                    : 'bg-slate-800 text-slate-500 border-slate-700'
                                }`}
                              >
                                <Lightbulb className="w-5 h-5 fill-current" />
                              </div>
                              <div>
                                <div className="text-xs font-black text-[var(--text-primary)]">Bóng đèn Đ</div>
                                <div className="text-[11px] font-bold text-slate-400">
                                  {simState.isBulbBurnt ? (
                                    <span className="text-[var(--err-fg)] font-black">Cháy dây tóc!</span>
                                  ) : simState.bulbBrightness > 0 ? (
                                    <span className="text-[var(--gold-fg)] font-bold">
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
                              <div className="w-8 h-8 rounded-xl bg-[var(--slate-tint)] text-[var(--slate-fg)] border border-[var(--border-strong)] flex items-center justify-center">
                                <Activity className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-xs font-black text-[var(--text-primary)]">Điện trở R</div>
                                <div className="text-xs font-bold text-[var(--slate-fg)]">
                                  {comp.value} Ω
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Bottom Tag */}
                        <div className="text-[11px] font-semibold text-slate-400 text-right mt-1">
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
                    ? 'bg-rose-500/20 text-[var(--err-fg)] border-rose-500/40'
                    : simState.isBulbBurnt
                    ? 'bg-amber-500/20 text-[var(--gold-fg)] border-amber-500/40'
                    : 'bg-[var(--bg-surface)] text-slate-300 border-[var(--border)]'
                }`}
              >
                {simState.isShortCircuit || simState.isBulbBurnt ? (
                  <AlertTriangle className="w-4 h-4 text-[var(--err-fg)] shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-[var(--chem-fg)] shrink-0" />
                )}
                <span className="leading-tight">{simState.statusMessage}</span>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border)] space-y-2">
            <span className="text-xs font-black text-[var(--text-primary)] block">
              Mạch thí nghiệm mẫu SGK
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {CIRCUIT_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(preset.components)}
                  className="p-2 rounded-xl bg-[var(--bg-surface-2)] hover:bg-sky-500/20 border-2 border-[var(--border)] hover:border-sky-500/40 text-left transition-all cursor-pointer group"
                >
                  <div className="text-xs font-black text-[var(--text-primary)] group-hover:text-[var(--chem-fg)] line-clamp-1">
                    {preset.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
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
          <div className="p-4 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border)] shadow-[0_4px_0_0_var(--edge-neutral)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[var(--text-primary)] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[var(--gold-fg)]" />
                Đồng hồ đo kỹ thuật số
              </span>
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                MULTIMETER
              </span>
            </div>

            {/* LCD Screen Display */}
            <div className="p-3 rounded-2xl bg-[var(--bg-canvas)] border-2 border-[var(--border)] font-mono space-y-2 shadow-inner">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-sans">Hiệu điện thế (U)</span>
                <span className="text-[var(--chem-fg)] font-black text-sm ">
                  {simState.totalVoltage.toFixed(1)} V
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-sans">Tổng điện trở (R)</span>
                <span className="text-[var(--gem-fg)] font-black text-sm ">
                  {simState.totalResistance} Ω
                </span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between items-center">
                <span className="text-[var(--gold-fg)] font-sans font-bold text-xs">
                  Cường độ dòng điện (I = U/R)
                </span>
                <span className="text-[var(--gold-fg)] font-black text-base ">
                  {simState.current.toFixed(2)} A
                </span>
              </div>
            </div>

            {/* Ohm Law Formula Card */}
            <div className="p-3 rounded-2xl bg-[var(--bg-surface-2)]/60 border border-[var(--border)] text-xs space-y-1">
              <div className="font-black text-[var(--text-primary)] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--ok-fg)]" />
                Định luật Ôm (Ohm&apos;s Law):
              </div>
              <p className="text-slate-300 text-xs font-medium leading-relaxed">
                Cường độ dòng điện chạy qua dây dẫn tỉ lệ thuận với hiệu điện thế giữa hai đầu dây và
                tỉ lệ nghịch với điện trở của dây:{' '}
                <span className="font-mono font-black text-[var(--gold-fg)]">I = U / R</span>
              </p>
            </div>
          </div>

          {/* Component Toolbox (Hộp linh kiện có thể thêm) */}
          <div className="p-4 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border)] shadow-[0_4px_0_0_var(--edge-neutral)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[var(--text-primary)] flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[var(--ok-fg)]" />
                Hộp linh kiện điện
              </span>
              <span className="text-[11px] font-bold text-slate-400">Chạm để thêm</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Add Battery 1.5V */}
              <button
                onClick={() => handleAdd('battery', 1.5)}
                disabled={components.length >= 6}
                className="p-2.5 rounded-2xl bg-[var(--bg-surface-2)] hover:bg-[var(--border)] border-2 border-[var(--border)] text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-[0_2px_0_0_var(--edge-neutral)] active:translate-y-[2px] active:shadow-none"
              >
                <div className="flex items-center justify-between">
                  <BatteryMedium className="w-4 h-4" />
                  <span className="text-[11px] font-black text-[var(--gold-fg)] bg-amber-400/10 px-1.5 py-0.5 rounded">
                    1.5V
                  </span>
                </div>
                <div className="text-xs font-black text-[var(--text-primary)] mt-1">Pin AA (1.5V)</div>
                <div className="text-[11px] text-slate-400">Nguồn 1 pin con thỏ</div>
              </button>

              {/* Add Battery 9V */}
              <button
                onClick={() => handleAdd('battery', 9)}
                disabled={components.length >= 6}
                className="p-2.5 rounded-2xl bg-[var(--bg-surface-2)] hover:bg-[var(--border)] border-2 border-[var(--border)] text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-[0_2px_0_0_var(--edge-neutral)] active:translate-y-[2px] active:shadow-none"
              >
                <div className="flex items-center justify-between">
                  <Activity className="w-4 h-4" />
                  <span className="text-[11px] font-black text-[var(--gold-fg)] bg-amber-400/10 px-1.5 py-0.5 rounded">
                    9V
                  </span>
                </div>
                <div className="text-xs font-black text-[var(--text-primary)] mt-1">Pin Vuông (9V)</div>
                <div className="text-[11px] text-slate-400">Nguồn áp cao</div>
              </button>

              {/* Add Switch */}
              <button
                onClick={() => handleAdd('switch')}
                disabled={components.length >= 6}
                className="p-2.5 rounded-2xl bg-[var(--bg-surface-2)] hover:bg-[var(--border)] border-2 border-[var(--border)] text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-[0_2px_0_0_var(--edge-neutral)] active:translate-y-[2px] active:shadow-none"
              >
                <div className="flex items-center justify-between">
                  <ToggleLeft className="w-4 h-4" />
                  <span className="text-[11px] font-black text-[var(--ok-fg)] bg-emerald-400/10 px-1.5 py-0.5 rounded">
                    K
                  </span>
                </div>
                <div className="text-xs font-black text-[var(--text-primary)] mt-1">Công Tắc K</div>
                <div className="text-[11px] text-slate-400">Đóng / Ngắt dòng điện</div>
              </button>

              {/* Add Bulb */}
              <button
                onClick={() => handleAdd('bulb', 10)}
                disabled={components.length >= 6}
                className="p-2.5 rounded-2xl bg-[var(--bg-surface-2)] hover:bg-[var(--border)] border-2 border-[var(--border)] text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-[0_2px_0_0_var(--edge-neutral)] active:translate-y-[2px] active:shadow-none"
              >
                <div className="flex items-center justify-between">
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-[11px] font-black text-[var(--gold-fg)] bg-yellow-400/10 px-1.5 py-0.5 rounded">
                    10Ω
                  </span>
                </div>
                <div className="text-xs font-black text-[var(--text-primary)] mt-1">Bóng đèn sợi đốt</div>
                <div className="text-[11px] text-slate-400">R = 10Ω định mức 3V</div>
              </button>

              {/* Add Resistor 20Ω */}
              <button
                onClick={() => handleAdd('resistor', 20)}
                disabled={components.length >= 6}
                className="p-2.5 rounded-2xl bg-[var(--bg-surface-2)] hover:bg-[var(--border)] border-2 border-[var(--border)] text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-[0_2px_0_0_var(--edge-neutral)] active:translate-y-[2px] active:shadow-none"
              >
                <div className="flex items-center justify-between">
                  <Gauge className="w-4 h-4" />
                  <span className="text-[11px] font-black text-[var(--gem-fg)] bg-purple-400/10 px-1.5 py-0.5 rounded">
                    20Ω
                  </span>
                </div>
                <div className="text-xs font-black text-[var(--text-primary)] mt-1">Điện Trở (20Ω)</div>
                <div className="text-[11px] text-slate-400">Cản trở dòng điện</div>
              </button>

              {/* Add Resistor 50Ω */}
              <button
                onClick={() => handleAdd('resistor', 50)}
                disabled={components.length >= 6}
                className="p-2.5 rounded-2xl bg-[var(--bg-surface-2)] hover:bg-[var(--border)] border-2 border-[var(--border)] text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-[0_2px_0_0_var(--edge-neutral)] active:translate-y-[2px] active:shadow-none"
              >
                <div className="flex items-center justify-between">
                  <Gauge className="w-4 h-4" />
                  <span className="text-[11px] font-black text-[var(--gem-fg)] bg-purple-400/10 px-1.5 py-0.5 rounded">
                    50Ω
                  </span>
                </div>
                <div className="text-xs font-black text-[var(--text-primary)] mt-1">Điện trở lớn (50Ω)</div>
                <div className="text-[11px] text-slate-400">Giảm dòng điện mạnh</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
