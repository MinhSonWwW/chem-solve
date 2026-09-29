import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Thermometer,
  Weight,
  Moon,
  Orbit,
  ArrowRight,
  Eye,
  ZoomIn,
  Zap,
  Play,
  RotateCcw,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { sound } from '@/lib/audio';

export type PhysicsVisualizerMode =
  | 'spring-scale'
  | 'moon-phases'
  | 'ruler-measurement'
  | 'thermometer'
  | 'solar-system'
  | 'vector-force'
  | 'lever-balance'
  | 'circuit-diagram'
  | 'potential-height'
  | 'kinetic-speed'
  | 'optics-lens';

export interface PhysicsVisualizerProps {
  mode: PhysicsVisualizerMode;
  className?: string;
  initialValue?: number;
  highlightItem?: string;
  params?: {
    mass?: number;
    height?: number;
    velocity?: number;
    force?: number;
    focalLength?: number;
    distance?: number;
    label?: string;
  };
}

export const PhysicsVisualizer: React.FC<PhysicsVisualizerProps> = ({
  mode,
  className,
  initialValue,
  highlightItem,
  params,
}) => {
  return (
    <div
      className={cn(
        'w-full rounded-2xl bg-[#0e1720]/90 border border-amber-500/25 p-3.5 shadow-lg relative overflow-hidden select-none',
        className
      )}
    >
      {/* Background radial glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {mode === 'spring-scale' && <SpringScaleWidget initialMass={params?.mass ?? initialValue ?? 100} />}
      {mode === 'moon-phases' && <MoonPhasesWidget />}
      {mode === 'ruler-measurement' && <RulerMeasurementWidget initialLength={initialValue ?? 6.8} />}
      {mode === 'thermometer' && <ThermometerWidget initialTemp={initialValue ?? 37} />}
      {mode === 'solar-system' && <SolarSystemWidget activePlanet={highlightItem} />}
      {mode === 'vector-force' && <VectorForceWidget initialForce={params?.force ?? initialValue ?? 30} />}
      {mode === 'lever-balance' && <LeverBalanceWidget />}
      {mode === 'circuit-diagram' && <CircuitDiagramWidget />}
      {mode === 'potential-height' && (
        <PotentialHeightWidget
          initialMass={params?.mass ?? 2.5}
          initialHeight={params?.height ?? (initialValue && initialValue < 50 ? initialValue : 6)}
        />
      )}
      {mode === 'kinetic-speed' && (
        <KineticSpeedWidget
          initialMass={params?.mass ?? 0.4}
          initialSpeed={params?.velocity ?? (initialValue && initialValue < 100 ? initialValue : 15)}
        />
      )}
      {mode === 'optics-lens' && (
        <OpticsLensWidget
          focalLength={params?.focalLength ?? 12}
          initialDistance={params?.distance ?? (initialValue && initialValue < 100 ? initialValue : 24)}
        />
      )}
    </div>
  );
};

// ── 1. Spring Scale Widget (Lò xo & Lực kế) ──
const SpringScaleWidget: React.FC<{ initialMass: number }> = ({ initialMass }) => {
  const [mass, setMass] = useState(initialMass);

  // Force in Newton: P = 10 * m(kg) = 10 * (mass / 1000)
  const forceN = (mass / 100).toFixed(1);
  // Spring stretch px: 100g -> 25px
  const stretchY = (mass / 100) * 22;

  const handleSelectMass = (m: number) => {
    sound.playClick();
    setMass(m);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Visual Rig */}
      <div className="flex items-start gap-4">
        {/* Support beam & Spring */}
        <div className="flex flex-col items-center">
          {/* Ceiling stand */}
          <div className="w-16 h-2 bg-slate-600 rounded-full shadow-inner" />
          <div className="w-1 h-3 bg-slate-500" />

          {/* Animated Spring */}
          <motion.svg
            width="32"
            height={50 + stretchY}
            viewBox={`0 0 32 ${50 + stretchY}`}
            className="overflow-visible"
            animate={{ height: 50 + stretchY }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            {/* Helical spring zigzag */}
            <path
              d={`M 16 0 
                  L 24 6 L 8 14 L 24 22 L 8 30 L 24 38 L 8 46 L 24 54 
                  L 16 ${50 + stretchY}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>

          {/* Hook & Weight */}
          <motion.div
            animate={{ y: stretchY }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            className="flex flex-col items-center -mt-1"
          >
            <div className="w-2.5 h-3 border-2 border-slate-400 rounded-b-full border-t-0" />
            <div className="px-2.5 py-1 rounded-lg bg-gradient-to-b from-amber-600 to-amber-700 border border-amber-400 text-[11px] font-black text-white shadow-md flex items-center gap-1">
              <Weight className="w-3 h-3" />
              <span>{mass} g</span>
            </div>
          </motion.div>
        </div>

        {/* Newton Gauge Ruler */}
        <div className="h-32 w-16 bg-[#16222f] border border-slate-700/80 rounded-xl p-1.5 flex flex-col justify-between text-[10px] font-bold text-slate-400 relative">
          <div className="text-[9px] text-center font-black text-amber-400 uppercase tracking-wider border-b border-slate-700 pb-0.5">
            Lực kế (N)
          </div>
          <div className="flex-1 relative my-1">
            {[0, 1, 2, 3].map((val) => (
              <div
                key={val}
                className="absolute inset-x-0 flex items-center justify-between text-[9px]"
                style={{ top: `${val * 30}%` }}
              >
                <div className="w-2 h-0.5 bg-slate-500" />
                <span>{val} N</span>
              </div>
            ))}
            {/* Red indicator needle */}
            <motion.div
              animate={{ top: `${Math.min(95, (mass / 300) * 90)}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="absolute left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_8px_#f43f5e] flex items-center"
            >
              <div className="w-2 h-2 rounded-full bg-rose-500 -ml-1 shadow-sm" />
            </motion.div>
          </div>
          <div className="text-center font-black text-rose-400 text-xs">
            {forceN} N
          </div>
        </div>
      </div>

      {/* Interactive Controls & Note */}
      <div className="flex-1 flex flex-col items-center sm:items-end gap-2 text-center sm:text-right">
        <div className="text-xs text-slate-300">
          <span className="font-bold text-amber-300">💡 Mô phỏng biến dạng lò xo:</span>
          <br />
          Độ dãn tỉ lệ thuận với khối lượng quả nặng.
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-end">
          <span className="text-[11px] text-slate-400 mr-1">Thử móc:</span>
          {[50, 100, 150, 200].map((m) => (
            <button
              key={m}
              onClick={() => handleSelectMass(m)}
              className={cn(
                'px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer border',
                mass === m
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-amber-500/50'
              )}
            >
              {m}g
            </button>
          ))}
        </div>
        <div className="text-[10px] text-slate-400 italic">
          Khối lượng m = {mass} g → Trọng lượng P = 10 × m ≈ {forceN} N.
        </div>
      </div>
    </div>
  );
};

// ── 2. Moon Phases Widget (Mô phỏng Pha Mặt Trăng) ──
const MOON_PHASES = [
  { day: 1, name: 'Không Trăng (Trăng non)', lightPct: 0, desc: 'Mặt Trời chiếu nửa bên kia, từ Trái Đất không thấy' },
  { day: 4, name: 'Trăng lưỡi liềm đầu tháng', lightPct: 25, desc: 'Vành trăng mỏng cong hình chữ C ngược' },
  { day: 8, name: 'Trăng bán nguyệt đầu tháng', lightPct: 50, desc: 'Nhìn thấy đúng một nửa đĩa tròn sáng (Thượng huyền)' },
  { day: 11, name: 'Trăng khuyết đầu tháng', lightPct: 75, desc: 'Đĩa sáng chiếm hơn một nửa hình tròn' },
  { day: 15, name: 'Trăng tròn (Ngày Rằm)', lightPct: 100, desc: 'Toàn bộ nửa được chiếu sáng hướng về Trái Đất' },
  { day: 23, name: 'Trăng bán nguyệt cuối tháng', lightPct: 50, desc: 'Thu hẹp lại còn một nửa đĩa sáng (Hạ huyền)' },
];

const MoonPhasesWidget: React.FC = () => {
  const [phaseIndex, setPhaseIndex] = useState(4); // Default: Trăng tròn ngày Rằm
  const current = MOON_PHASES[phaseIndex];

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-1.5">
        <div className="flex items-center gap-1.5 font-bold text-amber-300">
          <Moon className="w-3.5 h-3.5" />
          <span>Mô phỏng Pha Mặt Trăng theo chu kỳ Tuần trăng</span>
        </div>
        <span className="text-[11px] text-slate-400">
          Ngày {current.day} Âm lịch
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-1">
        {/* Earth View Simulation Telescope */}
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16 rounded-full bg-[#0b1017] border-2 border-cyan-500/40 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            {/* The Moon Disk */}
            <div className="relative w-12 h-12 rounded-full bg-slate-900 border border-slate-700 overflow-hidden shadow-inner flex items-center justify-center">
              {/* Moon craters texture dots */}
              <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-slate-800/80" />
              <div className="absolute bottom-2.5 right-2 w-2 h-2 rounded-full bg-slate-800/80" />

              {/* Lit portion based on lightPct */}
              <motion.div
                key={phaseIndex}
                initial={{ opacity: 0.5, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-200 via-amber-100 to-yellow-200 shadow-[0_0_12px_#fef08a]"
                style={{
                  clipPath:
                    current.lightPct === 0
                      ? 'circle(0% at 50% 50%)'
                      : current.lightPct === 25
                      ? 'polygon(60% 0, 100% 0, 100% 100%, 60% 100%)'
                      : current.lightPct === 50
                      ? 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)'
                      : current.lightPct === 75
                      ? 'polygon(25% 0, 100% 0, 100% 100%, 25% 100%)'
                      : 'circle(100% at 50% 50%)',
                }}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>Góc nhìn từ Trái Đất:</span>
            </div>
            <div className="text-sm font-black text-slate-100">
              {current.name}
            </div>
            <div className="text-[11px] text-slate-400 max-w-[220px]">
              {current.desc}
            </div>
          </div>
        </div>

        {/* Orbit Model diagram */}
        <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-cyan-500 shadow-sm flex items-center justify-center text-[8px] font-black text-slate-950">
              🌍
            </div>
            <span className="text-[9px]">Trái Đất</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-amber-300 shadow-sm flex items-center justify-center text-[7px] font-black text-slate-950">
              🌕
            </div>
            <span className="text-[9px]">Mặt Trăng</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] flex items-center justify-center text-[9px]">
              ☀️
            </div>
            <span className="text-[9px] text-amber-300">Tia nắng</span>
          </div>
        </div>
      </div>

      {/* Phase selector buttons */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
        {MOON_PHASES.map((p, idx) => (
          <button
            key={p.day}
            onClick={() => {
              sound.playClick();
              setPhaseIndex(idx);
            }}
            className={cn(
              'px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer border',
              phaseIndex === idx
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black'
                : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:border-amber-400/50'
            )}
          >
            Mùng {p.day} ({p.lightPct}%)
          </button>
        ))}
      </div>
    </div>
  );
};

// ── 3. Ruler Measurement Widget (Thước kẻ & Kính lúp phóng to) ──
const RulerMeasurementWidget: React.FC<{ initialLength: number }> = ({ initialLength }) => {
  const [lengthCm, setLengthCm] = useState(initialLength);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-1">
        <span className="font-bold text-amber-300 flex items-center gap-1.5">
          <ZoomIn className="w-3.5 h-3.5" />
          <span>Thước đo chiều dài (ĐCNN = 1 mm, GHĐ = 15 cm)</span>
        </span>
        <span className="text-[11px] text-slate-400 font-mono">
          Số đo: <strong className="text-amber-300 text-xs">{lengthCm} cm</strong>
        </span>
      </div>

      {/* Visual Ruler & Pencil */}
      <div className="relative h-20 bg-[#1e2a38] border border-amber-500/30 rounded-xl p-2 overflow-hidden flex flex-col justify-end">
        {/* Pencil object placed from 0 to length */}
        <motion.div
          animate={{ width: `${(lengthCm / 15) * 100}%` }}
          transition={{ type: 'spring', stiffness: 150, damping: 12 }}
          className="absolute top-2 left-3 h-5 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600 rounded-l-md rounded-r-sm shadow-md border-y border-amber-300 flex items-center justify-end pr-1 z-10"
        >
          {/* Pencil lead tip */}
          <div className="w-0 h-0 border-y-4 border-y-transparent border-l-[7px] border-l-slate-900 -mr-2.5" />
        </motion.div>

        {/* Ruler ticks background */}
        <div className="relative w-full h-8 bg-amber-200/90 rounded-sm border-t border-amber-400 text-slate-950 flex items-start justify-between px-3 overflow-hidden select-none font-mono">
          {Array.from({ length: 16 }).map((_, cm) => (
            <div key={cm} className="flex flex-col items-center h-full">
              <div className="w-0.5 h-3.5 bg-slate-900" />
              <span className="text-[8px] font-black leading-tight mt-0.5">{cm}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive preset test lengths */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
        <span>Đổi độ dài vật:</span>
        <div className="flex items-center gap-1.5">
          {[4.5, 6.8, 10.2, 12.5].map((len) => (
            <button
              key={len}
              onClick={() => {
                sound.playClick();
                setLengthCm(len);
              }}
              className={cn(
                'px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer',
                lengthCm === len
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-400/50'
              )}
            >
              {len} cm
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── 4. Thermometer Widget (Nhiệt kế thủy ngân / rượu) ──
const ThermometerWidget: React.FC<{ initialTemp: number }> = ({ initialTemp }) => {
  const [temp, setTemp] = useState(initialTemp);

  return (
    <div className="flex items-center justify-between gap-4 py-1">
      {/* Visual Glass Thermometer */}
      <div className="flex items-center gap-3">
        <div className="relative w-7 h-28 bg-slate-800/80 rounded-full border-2 border-slate-600 flex flex-col items-center justify-end p-1 shadow-inner">
          {/* Mercury Column */}
          <motion.div
            animate={{ height: `${Math.max(10, Math.min(100, ((temp + 10) / 110) * 100))}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 10 }}
            className="w-2 bg-rose-500 rounded-t-full shadow-[0_0_8px_#f43f5e]"
          />
          {/* Bulb at bottom */}
          <div className="w-5 h-5 rounded-full bg-rose-500 border border-rose-300 shadow-[0_0_10px_#f43f5e] -mb-0.5" />
        </div>

        <div className="flex flex-col">
          <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Thermometer className="w-3 h-3" />
            <span>Nhiệt độ hiện tại:</span>
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">
            {temp} °C
          </div>
          <div className="text-[11px] text-slate-400">
            {temp <= 0 ? 'Nước đóng băng (0 °C)' : temp >= 100 ? 'Nước sôi bốc hơi (100 °C)' : temp === 37 ? 'Thân nhiệt người bình thường' : 'Nhiệt độ phòng mát mẻ'}
          </div>
        </div>
      </div>

      {/* Preset Temperature Buttons */}
      <div className="flex flex-col gap-1 items-end">
        <span className="text-[10px] text-slate-400">Các mốc nhiệt độ chuẩn:</span>
        <div className="flex flex-wrap gap-1 justify-end max-w-[180px]">
          {[
            { label: '0 °C (Đá tan)', val: 0 },
            { label: '25 °C (Phòng)', val: 25 },
            { label: '37 °C (Thân nhiệt)', val: 37 },
            { label: '100 °C (Nước sôi)', val: 100 },
          ].map((m) => (
            <button
              key={m.val}
              onClick={() => {
                sound.playClick();
                setTemp(m.val);
              }}
              className={cn(
                'px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer',
                temp === m.val
                  ? 'bg-rose-500 text-white border-rose-400 font-black shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-rose-400/50'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── 5. Solar System Mini-Orrery (8 Hành tinh) ──
const PLANETS = [
  { name: 'Thủy', color: '#94a3b8', size: 5, note: 'Gần Mặt Trời nhất' },
  { name: 'Kim', color: '#fbbf24', size: 7, note: 'Nóng nhất Hệ Mặt Trời' },
  { name: 'Trái Đất', color: '#38bdf8', size: 8, note: 'Duy nhất có sự sống' },
  { name: 'Hỏa', color: '#f87171', size: 6, note: 'Hành tinh Đỏ' },
  { name: 'Mộc', color: '#fb923c', size: 14, note: 'Lớn nhất Hệ Mặt Trời' },
  { name: 'Thổ', color: '#fde047', size: 12, note: 'Vành đai đẹp nhất' },
  { name: 'Thiên vương', color: '#67e8f9', size: 9, note: 'Băng khổng lồ' },
  { name: 'Hải vương', color: '#60a5fa', size: 9, note: 'Xa Mặt Trời nhất' },
];

const SolarSystemWidget: React.FC<{ activePlanet?: string }> = ({ activePlanet }) => {
  const defaultIdx = activePlanet ? PLANETS.findIndex((p) => p.name.includes(activePlanet)) : 2;
  const [selectedIdx, setSelectedIdx] = useState(defaultIdx >= 0 ? defaultIdx : 2);
  const selected = PLANETS[selectedIdx] ?? PLANETS[2];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-1">
        <span className="font-bold text-amber-300 flex items-center gap-1.5">
          <Orbit className="w-3.5 h-3.5" />
          <span>Hệ Mặt Trời — 8 Hành tinh theo thứ tự khoảng cách</span>
        </span>
        <span className="text-[11px] text-cyan-400 font-bold">
          Hành tinh #{selectedIdx + 1}: {selected.name} tinh
        </span>
      </div>

      {/* Visual Alignment of Sun and 8 Planets */}
      <div className="flex items-center justify-between gap-1 py-3 px-2 bg-[#091017] rounded-xl border border-slate-800/80 overflow-x-auto scrollbar-none">
        {/* Sun */}
        <div className="flex flex-col items-center shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_15px_#f59e0b] animate-pulse flex items-center justify-center text-xs">
            ☀️
          </div>
          <span className="text-[8px] text-amber-300 font-black mt-1">Mặt Trời</span>
        </div>

        {/* 8 Planets */}
        {PLANETS.map((p, idx) => (
          <button
            key={p.name}
            onClick={() => {
              sound.playClick();
              setSelectedIdx(idx);
            }}
            className={cn(
              'flex flex-col items-center shrink-0 p-1.5 rounded-lg transition-all cursor-pointer',
              selectedIdx === idx ? 'bg-slate-800 border border-amber-400/80 shadow-md scale-105' : 'hover:bg-slate-800/40'
            )}
          >
            <div
              className="rounded-full shadow-sm transition-transform"
              style={{
                width: p.size * 1.5,
                height: p.size * 1.5,
                backgroundColor: p.color,
                boxShadow: selectedIdx === idx ? `0 0 10px ${p.color}` : 'none',
              }}
            />
            <span
              className={cn(
                'text-[8px] mt-1 font-bold whitespace-nowrap',
                selectedIdx === idx ? 'text-amber-300 font-black' : 'text-slate-400'
              )}
            >
              {p.name}
            </span>
          </button>
        ))}
      </div>

      <div className="text-[11px] text-center text-slate-300 bg-slate-900/60 py-1 rounded-lg border border-slate-800">
        ⭐ <strong className="text-amber-300">{selected.name} tinh</strong>: {selected.note} (Vị trí thứ {selectedIdx + 1} từ Mặt Trời).
      </div>
    </div>
  );
};

// ── 6. Vector Force Arrow Widget (Biểu diễn lực) ──
const VectorForceWidget: React.FC<{ initialForce: number }> = ({ initialForce }) => {
  const [force, setForce] = useState(initialForce);
  // Scale: 10N = 25px
  const arrowLength = (force / 10) * 28;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-1">
        <span className="font-bold text-amber-300 flex items-center gap-1.5">
          <ArrowRight className="w-3.5 h-3.5" />
          <span>Biểu diễn lực kéo: Tỉ xích 1 cm ứng với 10 N</span>
        </span>
        <span className="text-[11px] font-mono text-cyan-300">
          Độ lớn: <strong className="text-amber-300">{force} N</strong> ({force / 10} đoạn tỉ xích)
        </span>
      </div>

      {/* Visual block on horizontal floor with force arrow */}
      <div className="relative h-20 bg-[#0c131a] rounded-xl border border-slate-800 p-2 flex items-center overflow-hidden">
        {/* Floor line */}
        <div className="absolute bottom-3 inset-x-0 h-0.5 bg-slate-600" />

        {/* Block */}
        <div className="relative w-12 h-10 bg-slate-700 border border-slate-500 rounded flex items-center justify-center text-[10px] font-black text-slate-200 shadow-md ml-6 z-10">
          Vật
          {/* Point of application (Gốc) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm border border-white" />
        </div>

        {/* Vector Arrow starting from block right side */}
        <motion.div
          animate={{ width: arrowLength }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="h-1 bg-amber-400 shadow-[0_0_8px_#f59e0b] relative flex items-center justify-end z-10"
          style={{ marginLeft: 0 }}
        >
          {/* Arrowhead */}
          <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-amber-400 -mr-2" />

          {/* Scale segments dots */}
          <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
            {Array.from({ length: force / 10 }).map((_, i) => (
              <div key={i} className="w-1 h-3 -mt-1 bg-slate-900 border-x border-amber-300" />
            ))}
          </div>
        </motion.div>

        {/* Force label floating */}
        <div
          className="text-xs font-black text-amber-300 ml-4 bg-slate-900/90 px-2 py-0.5 rounded border border-amber-500/40 z-10 font-mono"
        >
          F = {force} N
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>Chọn độ lớn lực:</span>
        <div className="flex items-center gap-1.5">
          {[10, 20, 30, 40].map((f) => (
            <button
              key={f}
              onClick={() => {
                sound.playClick();
                setForce(f);
              }}
              className={cn(
                'px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer',
                force === f
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-400/50'
              )}
            >
              {f} N
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── 7. Lever & Moment Balance Widget (Đòn bẩy & Momen lực) ──
interface LeverPreset {
  name: string;
  f1: number;
  d1: number;
  f2: number;
  d2: number;
  label: string;
}

const LEVER_PRESETS: LeverPreset[] = [
  { name: 'Thăng bằng', f1: 20, d1: 10, f2: 10, d2: 20, label: 'F1 x d1 = F2 x d2 (200 = 200 N.cm)' },
  { name: 'Nghiêng trái', f1: 30, d1: 10, f2: 10, d2: 20, label: 'M1 (300) > M2 (200) -> Chúc trái' },
  { name: 'Nghiêng phải', f1: 10, d1: 10, f2: 20, d2: 20, label: 'M1 (100) < M2 (400) -> Chúc phải' },
  { name: 'Lợi về lực', f1: 40, d1: 5, f2: 10, d2: 20, label: 'd2 gấp 4 lần d1 -> Lực F2 nhỏ hơn 4 lần' },
];

const LeverBalanceWidget: React.FC = () => {
  const [presetIdx, setPresetIdx] = useState(0);
  const p = LEVER_PRESETS[presetIdx];

  const m1 = p.f1 * p.d1;
  const m2 = p.f2 * p.d2;
  const isBalanced = m1 === m2;
  // Tilt angle: negative = counter-clockwise (left down), positive = clockwise (right down)
  const tiltAngle = isBalanced ? 0 : m1 > m2 ? -7 : 7;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-1">
        <span className="font-bold text-amber-300 flex items-center gap-1.5">
          <Weight className="w-3.5 h-3.5 text-cyan-400" />
          <span>Mô hình đòn bẩy: Điểm tựa O & Quy tắc Momen lực</span>
        </span>
        <span
          className={cn(
            'text-[10px] font-black px-2 py-0.5 rounded-full font-mono border',
            isBalanced
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          )}
        >
          {isBalanced ? '⚖️ THĂNG BẰNG' : '⚠️ KHÔNG CÂN BẰNG'}
        </span>
      </div>

      {/* SVG Canvas */}
      <div className="relative h-28 bg-[#0a1017] rounded-xl border border-slate-800/80 p-2 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 320 100" className="w-full h-full max-w-[340px] overflow-visible select-none">
          {/* Base Stand & Triangular Fulcrum (Điểm tựa O) */}
          <path d="M 145 92 L 175 92 L 160 62 Z" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
          <line x1="130" y1="92" x2="190" y2="92" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          <circle cx="160" cy="62" r="3" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
          <text x="160" y="56" fill="#f59e0b" fontSize="10" fontWeight="900" textAnchor="middle">
            O
          </text>

          {/* Rotating Lever Arm */}
          <motion.g
            animate={{ rotate: tiltAngle }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
            style={{ originX: '160px', originY: '62px' }}
          >
            {/* Beam bar */}
            <rect x="20" y="59" width="280" height="6" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />

            {/* Left load (F1, d1) */}
            <g transform={`translate(${160 - p.d1 * 6}, 59)`}>
              {/* String */}
              <line x1="0" y1="6" x2="0" y2="18" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2 2" />
              {/* Box */}
              <rect x="-12" y="18" width="24" height="16" rx="2" fill="#e11d48" stroke="#fda4af" strokeWidth="1" />
              <text x="0" y="30" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                {p.f1}N
              </text>
              {/* Vector arrow down */}
              <line x1="0" y1="35" x2="0" y2="48" stroke="#f43f5e" strokeWidth="1.5" markerEnd="url(#arrow-red)" />
              <text x="0" y="-4" fill="#fda4af" fontSize="8" fontWeight="bold" textAnchor="middle">
                d1={p.d1}cm
              </text>
            </g>

            {/* Right load (F2, d2) */}
            <g transform={`translate(${160 + p.d2 * 6}, 59)`}>
              {/* String */}
              <line x1="0" y1="6" x2="0" y2="18" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" />
              {/* Box */}
              <rect x="-12" y="18" width="24" height="16" rx="2" fill="#0891b2" stroke="#67e8f9" strokeWidth="1" />
              <text x="0" y="30" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                {p.f2}N
              </text>
              {/* Vector arrow down */}
              <line x1="0" y1="35" x2="0" y2="48" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arrow-cyan)" />
              <text x="0" y="-4" fill="#67e8f9" fontSize="8" fontWeight="bold" textAnchor="middle">
                d2={p.d2}cm
              </text>
            </g>
          </motion.g>

          {/* Marker definitions */}
          <defs>
            <marker id="arrow-red" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 Z" fill="#f43f5e" />
            </marker>
            <marker id="arrow-cyan" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 Z" fill="#06b6d4" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Numerical Moment comparison */}
      <div className="flex items-center justify-between text-[11px] bg-slate-900/70 py-1.5 px-3 rounded-lg border border-slate-800 font-mono">
        <span className="text-rose-300">
          M₁ = F₁ × d₁ = <strong>{m1} N·cm</strong>
        </span>
        <span className="text-slate-400 font-sans text-[10px]">{p.label}</span>
        <span className="text-cyan-300">
          M₂ = F₂ × d₂ = <strong>{m2} N·cm</strong>
        </span>
      </div>

      {/* Preset selector */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
        <span>Chọn trường hợp:</span>
        <div className="flex items-center gap-1.5">
          {LEVER_PRESETS.map((item, idx) => (
            <button
              key={item.name}
              onClick={() => {
                sound.playClick();
                setPresetIdx(idx);
              }}
              className={cn(
                'px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer',
                presetIdx === idx
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-cyan-400/50'
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── 8. Circuit Diagram Widget (Sơ đồ mạch điện SGK) ──
const CircuitDiagramWidget: React.FC = () => {
  const [isClosed, setIsClosed] = useState(true);

  const toggleSwitch = () => {
    sound.playClick();
    setIsClosed((prev) => !prev);
  };

  const currentI = isClosed ? 0.5 : 0;
  const voltageU = isClosed ? 6.0 : 0;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-1">
        <span className="font-bold text-amber-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span>Sơ đồ mạch điện: Nguồn pin, Khóa K, Đèn, Ampe kế (A) & Vôn kế (V)</span>
        </span>
        <button
          onClick={toggleSwitch}
          className={cn(
            'text-[10px] font-black px-2.5 py-0.5 rounded-full border cursor-pointer transition-all',
            isClosed
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          )}
        >
          {isClosed ? '⚡ KHÓA K ĐÓNG (MẠCH KÍN)' : '⭕ KHÓA K MỞ (MẠCH HỞ)'}
        </button>
      </div>

      {/* SVG Circuit Canvas */}
      <div className="relative h-32 bg-[#090e15] rounded-xl border border-slate-800 p-2 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 320 120" className="w-full h-full max-w-[340px] select-none">
          {/* Main Circuit Wires */}
          <path
            d="M 50 35 L 140 35 M 180 35 L 215 35 M 245 35 L 270 35 L 270 85 L 180 85 M 140 85 L 50 85 L 50 35"
            fill="none"
            stroke={isClosed ? '#f59e0b' : '#64748b'}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Parallel branch for Voltmeter around bulb */}
          <path
            d="M 130 85 L 130 110 L 145 110 M 175 110 L 190 110 L 190 85"
            fill="none"
            stroke={isClosed ? '#06b6d4' : '#475569'}
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />

          {/* 1. Battery (Nguồn điện một chiều DC) at Top Center */}
          <g transform="translate(70, 35)">
            {/* Long thin line (+) */}
            <line x1="0" y1="-12" x2="0" y2="12" stroke="#f43f5e" strokeWidth="2.5" />
            <text x="-6" y="-14" fill="#f43f5e" fontSize="9" fontWeight="black">
              +
            </text>
            {/* Short thick line (-) */}
            <line x1="8" y1="-7" x2="8" y2="7" stroke="#38bdf8" strokeWidth="4" />
            <text x="12" y="-14" fill="#38bdf8" fontSize="9" fontWeight="black">
              -
            </text>
            <text x="4" y="24" fill="#94a3b8" fontSize="8" textAnchor="middle">
              Pin 6V
            </text>
          </g>

          {/* 2. Switch (Khóa K) */}
          <g transform="translate(150, 35)" className="cursor-pointer" onClick={toggleSwitch}>
            <circle cx="0" cy="0" r="2.5" fill="#f59e0b" />
            <circle cx="20" cy="0" r="2.5" fill="#f59e0b" />
            {/* Switch arm: horizontal if closed, angled if open */}
            <line
              x1="0"
              y1="0"
              x2={isClosed ? "20" : "16"}
              y2={isClosed ? "0" : "-12"}
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <text x="10" y="-12" fill="#cbd5e1" fontSize="8" fontWeight="bold" textAnchor="middle">
              K
            </text>
          </g>

          {/* 3. Ammeter (Ampe kế A mắc nối tiếp) */}
          <g transform="translate(230, 35)">
            <circle cx="0" cy="0" r="10" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="0" y="3.5" fill="#fbbf24" fontSize="9" fontWeight="900" textAnchor="middle">
              A
            </text>
            <text x="0" y="-13" fill="#f59e0b" fontSize="7" fontWeight="bold" textAnchor="middle">
              + nối tiếp
            </text>
          </g>

          {/* 4. Lamp (Bóng đèn Đ) at Bottom */}
          <g transform="translate(160, 85)">
            <circle
              cx="0"
              cy="0"
              r="12"
              fill={isClosed ? '#fef08a' : '#1e293b'}
              stroke={isClosed ? '#eab308' : '#64748b'}
              strokeWidth="1.5"
              className={isClosed ? 'filter drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]' : ''}
            />
            {/* Cross inside bulb */}
            <line x1="-7" y1="-7" x2="7" y2="7" stroke={isClosed ? '#a16207' : '#94a3b8'} strokeWidth="1.5" />
            <line x1="7" y1="-7" x2="-7" y2="7" stroke={isClosed ? '#a16207' : '#94a3b8'} strokeWidth="1.5" />
            <text x="0" y="-15" fill={isClosed ? '#fef08a' : '#94a3b8'} fontSize="8" fontWeight="bold" textAnchor="middle">
              Đèn Đ
            </text>
          </g>

          {/* 5. Voltmeter (Vôn kế V mắc song song) */}
          <g transform="translate(160, 110)">
            <circle cx="0" cy="0" r="9" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
            <text x="0" y="3.5" fill="#67e8f9" fontSize="9" fontWeight="900" textAnchor="middle">
              V
            </text>
            <text x="0" y="16" fill="#06b6d4" fontSize="7" fontWeight="bold" textAnchor="middle">
              song song
            </text>
          </g>

          {/* Conventional Current Flow Arrows (+ to -) */}
          {isClosed && (
            <g fill="#ef4444" fontSize="8" fontWeight="black">
              {/* Arrow right on top wire */}
              <polygon points="120,33 125,35 120,37" />
              {/* Arrow down on right wire */}
              <polygon points="268,60 270,65 272,60" />
              {/* Arrow left on bottom wire */}
              <polygon points="215,83 210,85 215,87" />
              {/* Arrow up on left wire */}
              <polygon points="48,60 50,55 52,60" />
            </g>
          )}
        </svg>
      </div>

      {/* Numerical Meter Readout */}
      <div className="flex items-center justify-between text-[11px] bg-slate-900/70 py-1.5 px-3 rounded-lg border border-slate-800 font-mono">
        <span className="text-amber-300">
          Ampe kế: I = <strong>{currentI.toFixed(1)} A</strong> (Mắc nối tiếp)
        </span>
        <span className="text-cyan-300">
          Vôn kế: U = <strong>{voltageU.toFixed(1)} V</strong> (Mắc song song)
        </span>
      </div>
    </div>
  );
};

// ── 9. Potential Energy & Free Fall Widget (Thế năng & Rơi tự do) ──
const PotentialHeightWidget: React.FC<{ initialMass: number; initialHeight: number }> = ({
  initialMass,
  initialHeight,
}) => {
  const [mass, setMass] = useState(initialMass);
  const [height, setHeight] = useState(initialHeight);
  const [isFalling, setIsFalling] = useState(false);
  const [progress, setProgress] = useState(0); // 0 (top) to 1 (ground)
  const [hasImpacted, setHasImpacted] = useState(false);

  // P = 10 * m
  const weightP = +(mass * 10).toFixed(1);
  // Total potential energy at peak: Wt_max = P * h (J)
  const maxEnergy = Math.round(weightP * height);
  // Current height: h_cur = height * (1 - progress)
  const currentH = +(height * (1 - progress)).toFixed(1);
  // Current potential energy: Wt = P * h_cur
  const currentWt = Math.round(maxEnergy * (1 - progress));
  // Current kinetic energy: Wđ = W_max - Wt (Conservation of Mechanical Energy!)
  const currentWd = maxEnergy - currentWt;
  // Current velocity: v = sqrt(2 * 10 * h_fallen)
  const fallenH = height * progress;
  const currentV = progress > 0 ? +(Math.sqrt(2 * 10 * fallenH)).toFixed(1) : 0;

  const handleDrop = () => {
    if (isFalling) return;
    sound.playClick();
    setIsFalling(true);
    setHasImpacted(false);
    setProgress(0);

    const startTime = performance.now();
    const duration = 1200; // ms

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Quadratic gravity acceleration: s = 0.5 * g * t^2
      const easeGravity = t * t;
      setProgress(easeGravity);

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        setProgress(1);
        setIsFalling(false);
        setHasImpacted(true);
        sound.playDragDrop();
        setTimeout(() => setHasImpacted(false), 800);
      }
    };
    requestAnimationFrame(frame);
  };

  const handleReset = () => {
    sound.playClick();
    setIsFalling(false);
    setProgress(0);
    setHasImpacted(false);
  };

  return (
    <div className="space-y-3">
      {/* Header Info Banner */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Thí nghiệm: Thế năng trọng trường</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
            m = <strong>{mass} kg</strong> (P = {weightP} N)
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            h = <strong>{height} m</strong>
          </span>
        </div>
      </div>

      {/* Main Simulation Stage & Energy Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Visual Fall Stage (7 cols) */}
        <div className="sm:col-span-7 relative h-48 bg-[#070d14] rounded-xl border border-slate-800 p-2 overflow-hidden flex flex-col justify-between">
          {/* Subtle background height grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#1e293b22_1px,transparent_1px)] bg-[size:100%_20px] pointer-events-none" />

          {/* Left Height Ruler */}
          <div className="absolute left-2 top-3 bottom-8 flex flex-col justify-between text-[9px] font-mono text-slate-500 select-none border-r border-slate-700/60 pr-1.5 z-10">
            <span>{height}m</span>
            <span>{(height * 0.75).toFixed(1)}m</span>
            <span>{(height * 0.5).toFixed(1)}m</span>
            <span>{(height * 0.25).toFixed(1)}m</span>
            <span className="text-emerald-400 font-bold">0m</span>
          </div>

          {/* Dropping Track Area */}
          <div className="relative ml-10 mr-2 flex-1 flex flex-col justify-between">
            {/* Top Balcony/Platform */}
            <div className="relative z-0 pt-1">
              <div className="w-20 h-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-sm shadow-sm border border-amber-500/40" />
              <div className="w-1.5 h-6 bg-slate-700 ml-1" />
            </div>

            {/* Falling Object */}
            <div
              className="absolute left-6 transition-transform"
              style={{
                top: `${8 + progress * 115}px`,
              }}
            >
              <motion.div
                animate={hasImpacted ? { scale: [1, 1.25, 0.95, 1], y: [0, -4, 0] } : {}}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                {/* Object Body (Flower pot / heavy weight) */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)] flex items-center justify-center text-slate-950 font-black text-[10px]">
                  {mass}kg
                </div>

                {/* Motion streak lines when falling */}
                {isFalling && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none opacity-80">
                    <span className="w-0.5 h-3 bg-amber-400/80 rounded animate-pulse" />
                    <span className="w-0.5 h-4 bg-cyan-400/80 rounded" />
                    <span className="w-0.5 h-3 bg-amber-400/80 rounded animate-pulse" />
                  </div>
                )}
              </motion.div>
            </div>

            {/* Ground Impact Flare */}
            {hasImpacted && (
              <motion.div
                initial={{ scale: 0.2, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-6 left-5 w-12 h-4 rounded-full bg-amber-400/60 blur-xs"
              />
            )}

            {/* Ground Platform (Reference plane h = 0) */}
            <div className="relative z-10 border-t-2 border-emerald-500/60 bg-emerald-950/40 py-1 px-2 rounded-b flex items-center justify-between text-[10px] text-emerald-400 font-semibold">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Mốc thế năng (Mặt đất h = 0)
              </span>
              <span className="font-mono text-[9px] text-slate-400">h = {currentH}m</span>
            </div>
          </div>
        </div>

        {/* Live Energy & Velocity HUD (5 cols) */}
        <div className="sm:col-span-5 flex flex-col justify-between gap-2 bg-slate-900/60 rounded-xl p-3 border border-slate-800 text-xs">
          {/* Potential Energy Bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-amber-300">Thế năng W_t:</span>
              <span className="font-mono font-black text-amber-400">{currentWt} J</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-75"
                style={{ width: `${Math.max(0, Math.min(100, (currentWt / (maxEnergy || 1)) * 100))}%` }}
              />
            </div>
            <div className="text-[9px] text-slate-400 font-mono">W_t = P · h = {weightP} × {currentH}</div>
          </div>

          {/* Kinetic Energy Bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-cyan-300">Động năng W_đ:</span>
              <span className="font-mono font-black text-cyan-400">{currentWd} J</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full transition-all duration-75"
                style={{ width: `${Math.max(0, Math.min(100, (currentWd / (maxEnergy || 1)) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>W_đ = ½ · m · v²</span>
              <span className="text-cyan-300 font-bold">v = {currentV} m/s</span>
            </div>
          </div>

          {/* Total Mechanical Energy Conservation */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Cơ năng W =
            </span>
            <span className="text-emerald-400 font-mono font-black text-sm">
              {maxEnergy} J
            </span>
          </div>
        </div>
      </div>

      {/* Control Buttons & Param Presets */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
        {/* Preset Heights */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Độ cao:</span>
          {[3.6, 6, 10].map((h) => (
            <button
              key={h}
              onClick={() => {
                sound.playClick();
                setHeight(h);
                setProgress(0);
                setIsFalling(false);
              }}
              className={cn(
                'px-2 py-1 rounded-md text-[10px] font-bold transition-all border cursor-pointer',
                height === h
                  ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-sm'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
              )}
            >
              {h}m
            </button>
          ))}
          <span className="text-slate-500 mx-1">|</span>
          <span className="text-slate-400 text-[10px] uppercase font-bold">Vật m:</span>
          {[1, 2.5, 5].map((mVal) => (
            <button
              key={mVal}
              onClick={() => {
                sound.playClick();
                setMass(mVal);
                setProgress(0);
                setIsFalling(false);
              }}
              className={cn(
                'px-2 py-1 rounded-md text-[10px] font-bold transition-all border cursor-pointer',
                mass === mVal
                  ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-sm'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
              )}
            >
              {mVal}kg
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={isFalling}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700 disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Đặt lại</span>
          </button>
          <button
            onClick={handleDrop}
            disabled={isFalling || progress === 1}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-md active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isFalling ? 'Đang rơi...' : '▶ Thả rơi mô phỏng'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ── 10. Kinetic Energy & Velocity Widget (Động năng & Tốc độ chuyển động) ──
const KineticSpeedWidget: React.FC<{ initialMass: number; initialSpeed: number }> = ({
  initialMass,
  initialSpeed,
}) => {
  const [mass, setMass] = useState(initialMass);
  const [speed, setSpeed] = useState(initialSpeed);
  const [isRunning, setIsRunning] = useState(false);
  const [cartX, setCartX] = useState(0); // 0% to 75%
  const [isImpact, setIsImpact] = useState(false);

  // W_đ = 1/2 * m * v^2
  const kineticEnergy = Math.round(0.5 * mass * speed * speed);
  // Max scale reference (for 25 m/s)
  const maxRefEnergy = Math.round(0.5 * mass * 25 * 25);

  const handleRun = () => {
    if (isRunning) return;
    sound.playClick();
    setIsRunning(true);
    setIsImpact(false);
    setCartX(0);

    const startTime = performance.now();
    const duration = Math.max(500, 1400 - speed * 35); // Faster speed = faster traversal

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      setCartX(t * 78);

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        setCartX(78);
        setIsRunning(false);
        setIsImpact(true);
        sound.playDragDrop();
        setTimeout(() => setIsImpact(false), 800);
      }
    };
    requestAnimationFrame(frame);
  };

  const handleReset = () => {
    sound.playClick();
    setIsRunning(false);
    setCartX(0);
    setIsImpact(false);
  };

  return (
    <div className="space-y-3">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Thí nghiệm: Động năng chuyển động</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
            m = <strong>{mass} kg</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            v = <strong>{speed} m/s</strong>
          </span>
        </div>
      </div>

      {/* Experimental Track */}
      <div className="relative h-28 bg-[#070d14] rounded-xl border border-slate-800 p-2 overflow-hidden flex flex-col justify-end">
        {/* Distance Grid & Marks */}
        <div className="absolute top-2 inset-x-4 flex justify-between text-[9px] font-mono text-slate-500 select-none border-b border-slate-800 pb-1">
          <span>0m (Khởi hành)</span>
          <span>5m</span>
          <span>10m</span>
          <span>15m</span>
          <span className="text-amber-400 font-bold">20m (Cản)</span>
        </div>

        {/* Track Line */}
        <div className="relative h-12 w-full mb-1 flex items-center">
          {/* Dual steel rails */}
          <div className="absolute bottom-2 inset-x-2 h-1.5 bg-slate-700 rounded-full border border-slate-600 shadow-inner" />

          {/* Cart / Rolling Object */}
          <div
            className="absolute transition-transform"
            style={{ left: `calc(${cartX}% + 8px)` }}
          >
            <motion.div
              animate={isImpact ? { x: [0, 4, -2, 0] } : {}}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              {/* Sleek Aerodynamic Cart Body */}
              <div className="w-14 h-6 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.6)] flex items-center justify-center text-slate-950 font-black text-[9px]">
                {speed}m/s
              </div>
              {/* Wheels */}
              <div className="flex justify-between px-1 -mt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-amber-300 shadow-xs" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-amber-300 shadow-xs" />
              </div>

              {/* Speed blur streak */}
              {isRunning && (
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 opacity-80 pointer-events-none">
                  <span className="w-5 h-0.5 bg-amber-400/80 rounded" />
                  <span className="w-8 h-0.5 bg-cyan-400/80 rounded" />
                </div>
              )}
            </motion.div>
          </div>

          {/* Safety Spring Damper Block at End */}
          <div className="absolute right-2 bottom-1 flex items-center">
            {/* Spring */}
            <svg width="24" height="16" viewBox="0 0 24 16" className="overflow-visible">
              <path
                d={isImpact ? "M 0 8 L 4 3 L 8 13 L 12 3 L 16 13 L 20 8" : "M 0 8 L 5 2 L 10 14 L 15 2 L 20 14 L 24 8"}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {/* Rigid Stop Block */}
            <div className="w-3.5 h-8 bg-gradient-to-b from-slate-600 to-slate-800 rounded border border-slate-500 shadow-sm" />
          </div>

          {/* Impact Spark */}
          {isImpact && (
            <motion.div
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute right-8 bottom-3 w-8 h-8 rounded-full bg-amber-400/70 blur-xs pointer-events-none"
            />
          )}
        </div>
      </div>

      {/* Dynamic Kinetic Energy Readout HUD */}
      <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex-1 w-full space-y-1">
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-bold text-amber-300">Động năng W_đ:</span>
            <span className="font-mono font-black text-amber-400 text-sm">{kineticEnergy} J</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-cyan-400 rounded-full transition-all duration-150"
              style={{ width: `${Math.max(5, Math.min(100, (kineticEnergy / (maxRefEnergy || 1)) * 100))}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            W_đ = ½ · m · v² = ½ × {mass} × {speed}² = <strong>{kineticEnergy} J</strong>
          </div>
        </div>

        <div className="sm:border-l sm:border-slate-800 sm:pl-3 text-[11px] text-slate-300 font-medium">
          <span className="text-amber-400 font-bold block mb-0.5">💡 Quy luật bậc 2:</span>
          Tốc độ tăng gấp 2 thì Động năng tăng gấp <strong>4 lần</strong> ({speed} m/s → {kineticEnergy} J).
        </div>
      </div>

      {/* Control Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Tốc độ v:</span>
          {[5, 10, 15, 20].map((v) => (
            <button
              key={v}
              onClick={() => {
                sound.playClick();
                setSpeed(v);
                setCartX(0);
                setIsRunning(false);
              }}
              className={cn(
                'px-2 py-1 rounded-md text-[10px] font-bold transition-all border cursor-pointer',
                speed === v
                  ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-sm'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
              )}
            >
              {v} m/s
            </button>
          ))}
          <span className="text-slate-500 mx-1">|</span>
          <span className="text-slate-400 text-[10px] uppercase font-bold">Vật m:</span>
          {[0.4, 1.0, 2.0].map((mVal) => (
            <button
              key={mVal}
              onClick={() => {
                sound.playClick();
                setMass(mVal);
                setCartX(0);
                setIsRunning(false);
              }}
              className={cn(
                'px-2 py-1 rounded-md text-[10px] font-bold transition-all border cursor-pointer',
                mass === mVal
                  ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-sm'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
              )}
            >
              {mVal}kg
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={isRunning}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700 disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Đặt lại</span>
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-md active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Đang chạy...' : '▶ Khởi động chuyển động'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ── 11. Converging Lens Optics Widget (Thấu kính hội tụ & Tạo ảnh) ──
const OpticsLensWidget: React.FC<{ focalLength: number; initialDistance: number }> = ({
  focalLength,
  initialDistance,
}) => {
  const [f] = useState(focalLength);
  const [d, setD] = useState(initialDistance);
  const [showRays, setShowRays] = useState(true);

  // Thin lens equation: 1/f = 1/d + 1/d' => d' = (d * f) / (d - f)
  const isInfinity = d === f;
  const isVirtual = d < f;
  const dPrime = !isInfinity ? (d * f) / (d - f) : 0;
  // Magnification: k = -d' / d
  const heightObj = 32; // px
  const heightImg = !isInfinity ? (Math.abs(dPrime) / d) * heightObj : 0;

  // Scale: 1 cm = 4 px
  const pxScale = 3.6;
  const originX = 180; // Lens at center
  const originY = 80; // Optical axis

  const fPx = f * pxScale;
  const dPx = d * pxScale;
  const dPrimePx = Math.abs(dPrime) * pxScale;

  const objX = originX - dPx;
  const objTopY = originY - heightObj;

  const imgX = isVirtual ? originX - dPrimePx : originX + dPrimePx;
  const imgTopY = isVirtual ? originY - heightImg : originY + heightImg;

  return (
    <div className="space-y-3">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>Thí nghiệm: Thấu kính hội tụ</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            f = <strong>{f} cm</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
            d = <strong>{d} cm</strong>
          </span>
        </div>
      </div>

      {/* Optical Bench Canvas */}
      <div className="relative h-44 bg-[#070d14] rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 360 160" className="w-full h-full select-none">
          {/* Main Optical Axis Delta */}
          <line x1="10" y1={originY} x2="350" y2={originY} stroke="#475569" strokeWidth="1.5" />
          <polygon points="350,80 344,77 344,83" fill="#475569" />
          <text x="345" y="74" fill="#64748b" fontSize="8" fontWeight="bold">Δ</text>

          {/* Converging Lens at Center (x = 180) */}
          <line x1={originX} y1="15" x2={originX} y2="145" stroke="#38bdf8" strokeWidth="2.5" />
          {/* Double-arrowheads for converging lens */}
          <polygon points={`${originX},15 ${originX - 4},23 ${originX + 4},23`} fill="#38bdf8" />
          <polygon points={`${originX},145 ${originX - 4},137 ${originX + 4},137`} fill="#38bdf8" />
          {/* Optical Center O */}
          <circle cx={originX} cy={originY} r="2.5" fill="#38bdf8" />
          <text x={originX + 4} y={originY + 12} fill="#38bdf8" fontSize="9" fontWeight="bold">O</text>

          {/* Focal Points F and F' */}
          {/* Object focal point F on left */}
          <circle cx={originX - fPx} cy={originY} r="2.5" fill="#f59e0b" />
          <text x={originX - fPx} y={originY + 12} fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle">F</text>
          {/* 2F marker */}
          <circle cx={originX - 2 * fPx} cy={originY} r="2" fill="#64748b" />
          <text x={originX - 2 * fPx} y={originY + 12} fill="#64748b" fontSize="8" textAnchor="middle">2F</text>

          {/* Image focal point F' on right */}
          <circle cx={originX + fPx} cy={originY} r="2.5" fill="#f59e0b" />
          <text x={originX + fPx} y={originY + 12} fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle">F&apos;</text>
          {/* 2F' marker */}
          <circle cx={originX + 2 * fPx} cy={originY} r="2" fill="#64748b" />
          <text x={originX + 2 * fPx} y={originY + 12} fill="#64748b" fontSize="8" textAnchor="middle">2F&apos;</text>

          {/* Object Arrow AB */}
          <g>
            <line x1={objX} y1={originY} x2={objX} y2={objTopY} stroke="#fbbf24" strokeWidth="2.5" />
            <polygon points={`${objX},${objTopY} ${objX - 3},${objTopY + 7} ${objX + 3},${objTopY + 7}`} fill="#fbbf24" />
            <text x={objX - 4} y={objTopY - 3} fill="#fbbf24" fontSize="9" fontWeight="black">B</text>
            <text x={objX - 4} y={originY + 12} fill="#fbbf24" fontSize="9" fontWeight="bold">A</text>
          </g>

          {/* Light Rays */}
          {showRays && !isInfinity && (
            <g opacity="0.9">
              {/* Ray 1: From B parallel to axis -> Lens -> passes through F' */}
              <line x1={objX} y1={objTopY} x2={originX} y2={objTopY} stroke="#06b6d4" strokeWidth="1.5" />
              {/* Arrow on parallel ray */}
              <polygon points={`${(objX + originX) / 2},${objTopY} ${(objX + originX) / 2 - 4},${objTopY - 3} ${(objX + originX) / 2 - 4},${objTopY + 3}`} fill="#06b6d4" />

              {/* Refracted Ray 1 through F' */}
              {!isVirtual ? (
                <line x1={originX} y1={objTopY} x2={imgX} y2={imgTopY} stroke="#06b6d4" strokeWidth="1.5" />
              ) : (
                <>
                  <line x1={originX} y1={objTopY} x2="340" y2={originY + (originY - objTopY)} stroke="#06b6d4" strokeWidth="1.5" />
                  {/* Virtual backward extension */}
                  <line x1={originX} y1={objTopY} x2={imgX} y2={imgTopY} stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" />
                </>
              )}

              {/* Ray 2: From B through optical center O */}
              {!isVirtual ? (
                <line x1={objX} y1={objTopY} x2={imgX} y2={imgTopY} stroke="#f59e0b" strokeWidth="1.5" />
              ) : (
                <>
                  <line x1={objX} y1={objTopY} x2="340" y2={originY + ((340 - originX) / (originX - objX)) * (originY - objTopY)} stroke="#f59e0b" strokeWidth="1.5" />
                  {/* Virtual backward extension */}
                  <line x1={originX} y1={originY} x2={imgX} y2={imgTopY} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                </>
              )}
            </g>
          )}

          {/* Image Arrow A'B' */}
          {!isInfinity && (
            <g>
              <line
                x1={imgX}
                y1={originY}
                x2={imgX}
                y2={imgTopY}
                stroke={isVirtual ? '#ec4899' : '#10b981'}
                strokeWidth="2.5"
                strokeDasharray={isVirtual ? '4 3' : undefined}
              />
              <polygon
                points={
                  !isVirtual
                    ? `${imgX},${imgTopY} ${imgX - 3},${imgTopY - 7} ${imgX + 3},${imgTopY - 7}`
                    : `${imgX},${imgTopY} ${imgX - 3},${imgTopY + 7} ${imgX + 3},${imgTopY + 7}`
                }
                fill={isVirtual ? '#ec4899' : '#10b981'}
              />
              <text x={imgX + 4} y={imgTopY + (isVirtual ? -2 : 10)} fill={isVirtual ? '#ec4899' : '#10b981'} fontSize="9" fontWeight="black">
                B&apos;
              </text>
              <text x={imgX + 4} y={originY + 12} fill={isVirtual ? '#ec4899' : '#10b981'} fontSize="9" fontWeight="bold">
                A&apos;
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Optical Characteristics Card */}
      <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-mono text-[11px]">Vị trí ảnh d&apos;:</span>
          <span className="font-mono font-bold text-cyan-300">
            {isInfinity ? 'Ở vô cực (∞)' : `${Math.abs(dPrime).toFixed(1)} cm`}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-slate-400">Tính chất:</span>
          <span
            className={cn(
              'px-2 py-0.5 rounded font-black',
              isVirtual
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            )}
          >
            {isVirtual
              ? 'Ảnh ảo, cùng chiều, lớn hơn vật'
              : d > 2 * f
              ? 'Ảnh thật, ngược chiều, nhỏ hơn vật'
              : d === 2 * f
              ? 'Ảnh thật, ngược chiều, bằng vật'
              : 'Ảnh thật, ngược chiều, lớn hơn vật'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Vị trí d:</span>
          {[
            { label: 'd > 2f', val: 32 },
            { label: 'd = 2f', val: 24 },
            { label: 'f < d < 2f', val: 18 },
            { label: 'd < f', val: 8 },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                sound.playClick();
                setD(preset.val);
              }}
              className={cn(
                'px-2 py-1 rounded-md text-[10px] font-bold transition-all border cursor-pointer',
                d === preset.val
                  ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-sm'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setShowRays(!showRays);
          }}
          className={cn(
            'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer',
            showRays
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          )}
        >
          <Lightbulb className="w-3 h-3" />
          <span>{showRays ? 'Tắt tia sáng' : 'Bật tia sáng'}</span>
        </button>
      </div>
    </div>
  );
};

