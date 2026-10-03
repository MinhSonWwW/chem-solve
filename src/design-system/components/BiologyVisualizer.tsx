import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Activity,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Droplets,
  Dna,
  Leaf,
  Flame,
  Grid,
  Sparkles,
  Microscope,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { sound } from '@/lib/audio';

export type BiologyVisualizerMode =
  | 'blood-transfusion'
  | 'circulation-loop'
  | 'energy-pyramid'
  | 'nephron-filtration'
  | 'cell-structure'
  | 'mendel-punnett-grid'
  | 'dna-transcription-builder'
  | 'mitosis-meiosis-scope';

export interface BiologyVisualizerProps {
  mode: BiologyVisualizerMode;
  className?: string;
  initialValue?: string | number;
  highlightItem?: string;
  params?: {
    patientBloodType?: 'O' | 'A' | 'B' | 'AB';
    donorBloodType?: 'O' | 'A' | 'B' | 'AB';
    trophicLevel?: number;
    organelle?: string;
    label?: string;
  };
}

// ── Blood Compatibility Rules (ABO System) ──
const ABO_DATA: Record<
  'O' | 'A' | 'B' | 'AB',
  {
    antigens: string; // Kháng nguyên trên hồng cầu
    antibodies: string; // Kháng thể trong huyết tương
    canReceiveFrom: ('O' | 'A' | 'B' | 'AB')[];
    canDonateTo: ('O' | 'A' | 'B' | 'AB')[];
    color: string;
    textColor: string;
    borderColor: string;
  }
> = {
  O: {
    antigens: 'Không có kháng nguyên A, B',
    antibodies: 'Có cả kháng thể α và β',
    canReceiveFrom: ['O'],
    canDonateTo: ['O', 'A', 'B', 'AB'],
    color: 'bg-emerald-500/20',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
  },
  A: {
    antigens: 'Chỉ có kháng nguyên A',
    antibodies: 'Chỉ có kháng thể β (chống B)',
    canReceiveFrom: ['O', 'A'],
    canDonateTo: ['A', 'AB'],
    color: 'bg-sky-500/20',
    textColor: 'text-sky-400',
    borderColor: 'border-sky-500/40',
  },
  B: {
    antigens: 'Chỉ có kháng nguyên B',
    antibodies: 'Chỉ có kháng thể α (chống A)',
    canReceiveFrom: ['O', 'B'],
    canDonateTo: ['B', 'AB'],
    color: 'bg-amber-500/20',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/40',
  },
  AB: {
    antigens: 'Có cả kháng nguyên A và B',
    antibodies: 'Không có kháng thể α, β',
    canReceiveFrom: ['O', 'A', 'B', 'AB'],
    canDonateTo: ['AB'],
    color: 'bg-purple-500/20',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/40',
  },
};

export const BiologyVisualizer: React.FC<BiologyVisualizerProps> = ({
  mode,
  className,
  params,
}) => {
  return (
    <div
      className={cn(
        'w-full rounded-3xl bg-[#111f26]/95 border-2 border-emerald-500/30 p-4 shadow-[0_6px_0_0_#062319] relative overflow-hidden select-none',
        className
      )}
    >
      {/* Background glow & subtle bio grid pattern */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      {mode === 'blood-transfusion' && (
        <BloodTransfusionSandbox
          defaultPatient={params?.patientBloodType || 'A'}
          defaultDonor={params?.donorBloodType || 'O'}
        />
      )}

      {mode === 'circulation-loop' && <CirculationLoopSandbox />}

      {mode === 'energy-pyramid' && <EnergyPyramidSandbox />}

      {mode === 'nephron-filtration' && <NephronFiltrationSandbox />}

      {mode === 'cell-structure' && <CellStructureSandbox />}

      {mode === 'mendel-punnett-grid' && <MendelPunnettGridSandbox />}

      {mode === 'dna-transcription-builder' && <DnaTranscriptionBuilderSandbox />}

      {mode === 'mitosis-meiosis-scope' && <MitosisMeiosisScopeSandbox />}
    </div>
  );
};

// ── 1. BLOOD TRANSFUSION VISUALIZER (Hệ nhóm máu ABO & Kháng thể) ──
const BloodTransfusionSandbox: React.FC<{
  defaultPatient?: 'O' | 'A' | 'B' | 'AB';
  defaultDonor?: 'O' | 'A' | 'B' | 'AB';
}> = ({ defaultPatient = 'A', defaultDonor = 'O' }) => {
  const [patient, setPatient] = useState<'O' | 'A' | 'B' | 'AB'>(defaultPatient);
  const [donor, setDonor] = useState<'O' | 'A' | 'B' | 'AB'>(defaultDonor);

  const patientInfo = ABO_DATA[patient];
  const donorInfo = ABO_DATA[donor];
  const isCompatible = patientInfo.canReceiveFrom.includes(donor);

  return (
    <div className="space-y-3 relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Mô Phỏng Truyền Máu ABO</span>
              <span className="text-[10px] text-emerald-400 font-bold lowercase px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-800/60">
                bài 33
              </span>
            </h4>
          </div>
        </div>

        {/* Compatibility badge */}
        <span
          className={cn(
            'text-[10px] font-black px-2.5 py-1 rounded-xl border flex items-center gap-1 transition-all',
            isCompatible
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
          )}
        >
          {isCompatible ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TRUYỀN ĐƯỢC (AN TOÀN)</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>NGƯNG KẾT HỒNG CẦU (NGUY HIỂM)</span>
            </>
          )}
        </span>
      </div>

      {/* Interactive Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Donor Selector */}
        <div className="p-3 rounded-2xl bg-[#14232c] border-2 border-[#223946] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-slate-300 flex items-center gap-1">
              🩸 Người Cho (Hồng Cầu):
            </span>
            <span className={cn('text-xs font-black px-2 py-0.5 rounded-lg border', donorInfo.color, donorInfo.textColor, donorInfo.borderColor)}>
              Nhóm {donor}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1">
            {(['O', 'A', 'B', 'AB'] as const).map((b) => (
              <button
                key={`donor-${b}`}
                onClick={() => {
                  sound.playClick();
                  setDonor(b);
                }}
                className={cn(
                  'py-1.5 rounded-xl text-xs font-black transition-all border',
                  donor === b
                    ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-[0_2px_0_0_#9f1239]'
                    : 'bg-[#1b2f3a] text-slate-400 border-slate-700/60 hover:text-white'
                )}
              >
                {b}
              </button>
            ))}
          </div>

          <p className="text-[10px] text-slate-400 leading-tight">
            Kháng nguyên: <strong className="text-slate-200">{donorInfo.antigens}</strong>
          </p>
        </div>

        {/* Patient / Recipient Selector */}
        <div className="p-3 rounded-2xl bg-[#14232c] border-2 border-[#223946] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-slate-300 flex items-center gap-1">
              🏥 Người Nhận (Huyết Tương):
            </span>
            <span className={cn('text-xs font-black px-2 py-0.5 rounded-lg border', patientInfo.color, patientInfo.textColor, patientInfo.borderColor)}>
              Nhóm {patient}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1">
            {(['O', 'A', 'B', 'AB'] as const).map((b) => (
              <button
                key={`patient-${b}`}
                onClick={() => {
                  sound.playClick();
                  setPatient(b);
                }}
                className={cn(
                  'py-1.5 rounded-xl text-xs font-black transition-all border',
                  patient === b
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_2px_0_0_#0284c7]'
                    : 'bg-[#1b2f3a] text-slate-400 border-slate-700/60 hover:text-white'
                )}
              >
                {b}
              </button>
            ))}
          </div>

          <p className="text-[10px] text-slate-400 leading-tight">
            Kháng thể: <strong className="text-slate-200">{patientInfo.antibodies}</strong>
          </p>
        </div>
      </div>

      {/* Visual Simulation Display Box */}
      <div
        className={cn(
          'p-3 rounded-2xl border-2 transition-all flex items-center justify-between gap-3',
          isCompatible
            ? 'bg-emerald-950/30 border-emerald-500/30'
            : 'bg-rose-950/40 border-rose-500/40'
        )}
      >
        <div className="flex items-center gap-3">
          {/* Animated Erythrocytes */}
          <div className="relative w-12 h-12 rounded-2xl bg-[#111f26] border border-slate-700 flex items-center justify-center overflow-hidden">
            {isCompatible ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="relative w-8 h-8"
              >
                <div className="absolute top-0 left-2 w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
                <div className="absolute bottom-0 right-2 w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
                <div className="absolute top-2 right-0 w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ x: [-2, 2, -2], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 0.25, repeat: Infinity }}
                className="w-7 h-7 rounded-xl bg-rose-600/80 border border-rose-300 flex items-center justify-center font-black text-white text-[10px]"
              >
                ✕
              </motion.div>
            )}
          </div>

          <div className="text-xs leading-snug">
            {isCompatible ? (
              <p className="text-emerald-300 font-bold">
                ✅ Không xảy ra ngưng kết: Huyết tương người nhận ({patient}) không có kháng thể tương ứng chống lại hồng cầu người cho ({donor}).
              </p>
            ) : (
              <p className="text-rose-300 font-bold">
                ⚠️ Ngưng kết hồng cầu: Kháng thể của người nhận kết dính với kháng nguyên trên hồng cầu người cho, gây tắc mạch máu nguy kịch!
              </p>
            )}
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Quy tắc vàng: Nhóm O chuyên cho; Nhóm AB chuyên nhận.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── 2. CIRCULATION LOOP VISUALIZER (2 Vòng tuần hoàn & Tim co bóp) ──
const CirculationLoopSandbox: React.FC = () => {
  const [activeLoop, setActiveLoop] = useState<'all' | 'pulmonary' | 'systemic'>('all');

  return (
    <div className="space-y-3 relative z-10">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <Heart className="w-4 h-4 fill-rose-500 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Hệ Tuần Hoàn Kép & Nhịp Tim</span>
              <span className="text-[10px] text-emerald-400 font-bold lowercase px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-800/60">
                bài 33
              </span>
            </h4>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-[#14232c] p-0.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveLoop('all')}
            className={cn(
              'px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all',
              activeLoop === 'all'
                ? 'bg-rose-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white'
            )}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveLoop('pulmonary')}
            className={cn(
              'px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all',
              activeLoop === 'pulmonary'
                ? 'bg-sky-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white'
            )}
          >
            Vòng nhỏ (Phổi)
          </button>
          <button
            onClick={() => setActiveLoop('systemic')}
            className={cn(
              'px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all',
              activeLoop === 'systemic'
                ? 'bg-rose-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white'
            )}
          >
            Vòng lớn (Cơ thể)
          </button>
        </div>
      </div>

      {/* Interactive 2-Loop Circuit Diagram */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Vòng nhỏ */}
        <div
          className={cn(
            'p-3 rounded-2xl border-2 transition-all space-y-1.5',
            activeLoop === 'all' || activeLoop === 'pulmonary'
              ? 'bg-sky-950/30 border-sky-500/40 shadow-sm'
              : 'bg-[#14232c]/50 border-slate-800 opacity-50'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-sky-400 uppercase">
              1. Vòng tuần hoàn nhỏ (ở Phổi)
            </span>
            <span className="text-[10px] font-bold text-sky-300 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-700/60">
              Trao đổi khí
            </span>
          </div>

          <div className="text-[11px] text-slate-300 font-mono space-y-0.5 leading-relaxed bg-[#0d171d] p-2 rounded-xl border border-sky-900/50">
            <div className="text-slate-400">Tâm thất phải (máu thẫm)</div>
            <div className="text-sky-400 font-bold">↳ Động mạch phổi ➜ Mao mạch phổi</div>
            <div className="text-emerald-400 font-bold">↳ Nhả CO₂ & Nhận O₂ (hóa đỏ tươi)</div>
            <div className="text-rose-400 font-bold">↳ Tĩnh mạch phổi ➜ Tâm nhĩ trái</div>
          </div>
        </div>

        {/* Vòng lớn */}
        <div
          className={cn(
            'p-3 rounded-2xl border-2 transition-all space-y-1.5',
            activeLoop === 'all' || activeLoop === 'systemic'
              ? 'bg-rose-950/30 border-rose-500/40 shadow-sm'
              : 'bg-[#14232c]/50 border-slate-800 opacity-50'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-rose-400 uppercase">
              2. Vòng tuần hoàn lớn (Cơ thể)
            </span>
            <span className="text-[10px] font-bold text-rose-300 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-700/60">
              Nuôi tế bào
            </span>
          </div>

          <div className="text-[11px] text-slate-300 font-mono space-y-0.5 leading-relaxed bg-[#0d171d] p-2 rounded-xl border border-rose-900/50">
            <div className="text-rose-300 font-bold">Tâm thất trái (máu đỏ tươi)</div>
            <div className="text-rose-400 font-bold">↳ Động mạch chủ ➜ Mao mạch cơ quan</div>
            <div className="text-amber-400 font-bold">↳ Cung cấp O₂ & dinh dưỡng (hóa thẫm)</div>
            <div className="text-sky-400 font-bold">↳ Tĩnh mạch chủ ➜ Tâm nhĩ phải</div>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 flex items-center justify-between bg-[#14232c] px-3 py-2 rounded-xl border border-slate-700/60">
        <span>💡 Tim người có <strong>4 ngăn</strong>: 2 tâm nhĩ ở trên, 2 tâm thất ở dưới.</span>
        <span className="text-rose-400 font-black">Nhịp tim TB: 75 lần/phút</span>
      </div>
    </div>
  );
};

// ── 3. ECOLOGICAL ENERGY PYRAMID (Tháp năng lượng 10% & Bậc dinh dưỡng) ──
const EnergyPyramidSandbox: React.FC = () => {
  const [baseEnergy, setBaseEnergy] = useState<number>(100000);

  const level1 = baseEnergy;
  const level2 = Math.round(baseEnergy * 0.1);
  const level3 = Math.round(level2 * 0.1);
  const level4 = Math.round(level3 * 0.1);

  return (
    <div className="space-y-3 relative z-10">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Tháp Năng Lượng & Quy Luật 10%</span>
              <span className="text-[10px] text-emerald-400 font-bold lowercase px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-800/60">
                bài 44
              </span>
            </h4>
          </div>
        </div>

        <span className="text-[10px] text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60 flex items-center gap-1">
          <Flame className="w-3 h-3 text-amber-400" />
          Hao hụt 90% mỗi bậc
        </span>
      </div>

      {/* Visual Pyramid Tiers */}
      <div className="space-y-1.5 max-w-md mx-auto pt-1">
        {/* Tier 4 (Apex) */}
        <div className="w-1/3 mx-auto p-1.5 bg-rose-500/20 border-2 border-rose-500/50 rounded-xl text-center shadow-sm">
          <div className="text-[10px] font-black text-rose-300">Đỉnh: SV Tiêu Thụ Bậc 3</div>
          <div className="text-xs font-mono font-black text-white">{level4.toLocaleString()} kcal (0,1%)</div>
        </div>

        {/* Tier 3 */}
        <div className="w-1/2 mx-auto p-1.5 bg-amber-500/20 border-2 border-amber-500/50 rounded-xl text-center shadow-sm">
          <div className="text-[10px] font-black text-amber-300">Bậc 3: SV Tiêu Thụ Bậc 2</div>
          <div className="text-xs font-mono font-black text-white">{level3.toLocaleString()} kcal (1%)</div>
        </div>

        {/* Tier 2 */}
        <div className="w-3/4 mx-auto p-1.5 bg-cyan-500/20 border-2 border-cyan-500/50 rounded-xl text-center shadow-sm">
          <div className="text-[10px] font-black text-cyan-300">Bậc 2: SV Tiêu Thụ Bậc 1 (Ăn cỏ)</div>
          <div className="text-xs font-mono font-black text-white">{level2.toLocaleString()} kcal (10%)</div>
        </div>

        {/* Tier 1 (Base) */}
        <div className="w-full p-2 bg-emerald-500/25 border-2 border-emerald-500/60 rounded-xl text-center shadow-sm">
          <div className="text-[10px] font-black text-emerald-300 flex items-center justify-center gap-1">
            <Leaf className="w-3 h-3 text-emerald-400" />
            Đáy Tháp: Sinh Vật Sản Xuất (Cây Xanh, Tảo)
          </div>
          <div className="text-sm font-mono font-black text-white">{level1.toLocaleString()} kcal (100%)</div>
        </div>
      </div>

      {/* Interactive slider */}
      <div className="p-2.5 rounded-2xl bg-[#14232c] border border-slate-700/60 space-y-1">
        <div className="flex justify-between text-[11px] font-bold text-slate-300">
          <span>Năng lượng ban đầu (SV sản xuất):</span>
          <span className="text-emerald-400 font-mono font-black">{baseEnergy.toLocaleString()} kcal</span>
        </div>
        <input
          type="range"
          min="10000"
          max="500000"
          step="10000"
          value={baseEnergy}
          onChange={(e) => setBaseEnergy(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer"
        />
      </div>
    </div>
  );
};

// ── 4. NEPHRON FILTRATION VISUALIZER (Cơ chế bài tiết thận & Nước tiểu) ──
const NephronFiltrationSandbox: React.FC = () => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  return (
    <div className="space-y-3 relative z-10">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Đơn Vị Chức Năng Thận (Nephron)</span>
              <span className="text-[10px] text-emerald-400 font-bold lowercase px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-800/60">
                bài 35
              </span>
            </h4>
          </div>
        </div>

        <span className="text-[10px] text-cyan-300 font-bold">1 triệu Nephron / thận</span>
      </div>

      {/* 3 Steps Pipeline */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { step: 1, title: '1. Lọc máu', place: 'Cầu thận', color: 'border-rose-500/50 bg-rose-950/30 text-rose-300' },
          { step: 2, title: '2. Tái hấp thụ', place: 'Ống thận', color: 'border-amber-500/50 bg-amber-950/30 text-amber-300' },
          { step: 3, title: '3. Bài tiết tiếp', place: 'Ống góp', color: 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300' },
        ].map((s) => (
          <button
            key={s.step}
            onClick={() => setActiveStep(s.step as 1 | 2 | 3)}
            className={cn(
              'p-2 rounded-xl border text-center transition-all cursor-pointer',
              activeStep === s.step ? s.color : 'bg-[#14232c] border-slate-800 text-slate-400 hover:text-white'
            )}
          >
            <div className="text-[10px] font-black">{s.title}</div>
            <div className="text-[9px] opacity-80">{s.place}</div>
          </button>
        ))}
      </div>

      {/* Step details card */}
      <div className="p-3 bg-[#14232c] rounded-2xl border-2 border-slate-700/60 space-y-1">
        {activeStep === 1 && (
          <div className="text-xs leading-relaxed space-y-0.5">
            <span className="text-rose-400 font-black block">🩸 Bước 1: Quá trình lọc máu tại Cầu thận</span>
            <p className="text-slate-300">
              Áp lực máu đẩy nước, ion, glucose, ure qua vách mao mạch cầu thận vào nang Bowman tạo ra <strong>Nước tiểu đầu (170 - 180 lít/ngày)</strong>. Tế bào máu và protein kích thước lớn được giữ lại trong máu.
            </p>
          </div>
        )}
        {activeStep === 2 && (
          <div className="text-xs leading-relaxed space-y-0.5">
            <span className="text-amber-400 font-black block">💧 Bước 2: Quá trình tái hấp thụ tại Ống thận</span>
            <p className="text-slate-300">
              Ống thận hấp thụ lại <strong>99% lượng nước</strong>, toàn bộ glucose, axit amin và các ion cần thiết trở lại mao mạch máu. Tiết kiệm tối đa nước và dưỡng chất cho cơ thể.
            </p>
          </div>
        )}
        {activeStep === 3 && (
          <div className="text-xs leading-relaxed space-y-0.5">
            <span className="text-emerald-400 font-black block">✨ Bước 3: Bài tiết tiếp tạo Nước tiểu chính thức</span>
            <p className="text-slate-300">
              Ống thận chủ động bài tiết các chất cặn bã thừa, axit uric, ure, thuốc men tạo thành <strong>Nước tiểu chính thức (khoảng 1,5 lít/ngày)</strong> dẫn về bóng đái và thải ra ngoài.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── 5. CELL STRUCTURE (Tế bào học trực quan) ──
const CellStructureSandbox: React.FC = () => {
  const [cellType, setCellType] = useState<'animal' | 'plant'>('plant');

  return (
    <div className="space-y-3 relative z-10">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Dna className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Cấu Trúc Tế Bào Sống</span>
            </h4>
          </div>
        </div>

        <div className="flex gap-1 bg-[#14232c] p-0.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setCellType('plant')}
            className={cn(
              'px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all',
              cellType === 'plant' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            )}
          >
            🌿 Tế bào thực vật
          </button>
          <button
            onClick={() => setCellType('animal')}
            className={cn(
              'px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all',
              cellType === 'animal' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            )}
          >
            🐾 Tế bào động vật
          </button>
        </div>
      </div>

      <div className="p-3 bg-[#14232c] rounded-2xl border-2 border-slate-700/60 grid grid-cols-2 gap-2 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400 block">Thành phần chung:</span>
          <div className="text-emerald-300 font-bold">• Màng sinh chất (bảo vệ & trao đổi chất)</div>
          <div className="text-cyan-300 font-bold">• Tế bào chất (chứa bào quan)</div>
          <div className="text-purple-300 font-bold">• Nhân tế bào (chứa vật chất di truyền ADN)</div>
        </div>

        <div className="space-y-1 border-l border-slate-700 pl-2">
          <span className="text-[10px] font-black uppercase text-amber-400 block">Đặc điểm riêng {cellType === 'plant' ? 'Thực vật' : 'Động vật'}:</span>
          {cellType === 'plant' ? (
            <>
              <div className="text-emerald-400 font-bold">✓ Có thành tế bào xenlulôzơ vững chắc</div>
              <div className="text-emerald-400 font-bold">✓ Có Lục lạp (quang hợp tạo glucose)</div>
              <div className="text-emerald-400 font-bold">✓ Có Không bào trung tâm rất lớn</div>
            </>
          ) : (
            <>
              <div className="text-amber-300 font-bold">✕ Không có thành tế bào cứng</div>
              <div className="text-amber-300 font-bold">✕ Không có lục lạp (dị dưỡng)</div>
              <div className="text-amber-300 font-bold">• Có trung thể tham gia phân bào</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── 6. MENDEL PUNNETT GRID (Ma Trận Bảng Punnett Mendel) ──
const MENDEL_PRESETS = [
  {
    id: 'Aa_x_Aa',
    title: 'P: Aa × Aa',
    desc: 'Đậu hoa đỏ dị hợp tự thụ',
    femaleGametes: ['A', 'a'],
    maleGametes: ['A', 'a'],
    solve: (f: string, m: string) => {
      const g = [f, m].sort().join('');
      const isRed = g.includes('A');
      return {
        genotype: g,
        phenotype: isRed ? 'Hoa đỏ' : 'Hoa trắng',
        color: isRed ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-500/20 text-slate-300 border-slate-500/40',
        badge: isRed ? '🔴' : '⚪',
      };
    },
    ratioSummary: 'Tỉ lệ KG: 1 AA : 2 Aa : 1 aa (25% : 50% : 25%) | Tỉ lệ KH: 3 Hoa đỏ : 1 Hoa trắng (75% : 25%)',
  },
  {
    id: 'Aa_x_aa',
    title: 'P: Aa × aa',
    desc: 'Lai phân tích 1 cặp gen',
    femaleGametes: ['A', 'a'],
    maleGametes: ['a'],
    solve: (f: string, m: string) => {
      const g = [f, m].sort().join('');
      const isRed = g.includes('A');
      return {
        genotype: g,
        phenotype: isRed ? 'Hoa đỏ' : 'Hoa trắng',
        color: isRed ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-500/20 text-slate-300 border-slate-500/40',
        badge: isRed ? '🔴' : '⚪',
      };
    },
    ratioSummary: 'Tỉ lệ KG: 1 Aa : 1 aa | Tỉ lệ KH: 1 Hoa đỏ : 1 Hoa trắng (50% : 50%)',
  },
  {
    id: 'AaBb_x_AaBb',
    title: 'P: AaBb × AaBb',
    desc: 'Phân li độc lập 2 cặp gen (Mendel)',
    femaleGametes: ['AB', 'Ab', 'aB', 'ab'],
    maleGametes: ['AB', 'Ab', 'aB', 'ab'],
    solve: (f: string, m: string) => {
      const aAlleles = [f[0], m[0]].sort().join('');
      const bAlleles = [f[1], m[1]].sort().join('');
      const genotype = `${aAlleles}${bAlleles}`;
      const hasA = aAlleles.includes('A');
      const hasB = bAlleles.includes('B');
      if (hasA && hasB) {
        return { genotype, phenotype: 'Vàng, trơn', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', badge: '🟡' };
      }
      if (hasA && !hasB) {
        return { genotype, phenotype: 'Vàng, nhăn', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40', badge: '🟨' };
      }
      if (!hasA && hasB) {
        return { genotype, phenotype: 'Xanh, trơn', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', badge: '🟢' };
      }
      return { genotype, phenotype: 'Xanh, nhăn', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40', badge: '🟩' };
    },
    ratioSummary: 'Tỉ lệ KH F2: 9 Vàng, trơn : 3 Vàng, nhăn : 3 Xanh, trơn : 1 Xanh, nhăn (16 tổ hợp)',
  },
  {
    id: 'AaBb_x_aabb',
    title: 'P: AaBb × aabb',
    desc: 'Lai phân tích 2 cặp gen',
    femaleGametes: ['AB', 'Ab', 'aB', 'ab'],
    maleGametes: ['ab'],
    solve: (f: string, m: string) => {
      const aAlleles = [f[0], m[0]].sort().join('');
      const bAlleles = [f[1], m[1]].sort().join('');
      const genotype = `${aAlleles}${bAlleles}`;
      const hasA = aAlleles.includes('A');
      const hasB = bAlleles.includes('B');
      if (hasA && hasB) {
        return { genotype, phenotype: 'Vàng, trơn', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', badge: '🟡' };
      }
      if (hasA && !hasB) {
        return { genotype, phenotype: 'Vàng, nhăn', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40', badge: '🟨' };
      }
      if (!hasA && hasB) {
        return { genotype, phenotype: 'Xanh, trơn', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', badge: '🟢' };
      }
      return { genotype, phenotype: 'Xanh, nhăn', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40', badge: '🟩' };
    },
    ratioSummary: 'Tỉ lệ KH Fa: 1 Vàng, trơn : 1 Vàng, nhăn : 1 Xanh, trơn : 1 Xanh, nhăn (1:1:1:1)',
  },
];

const MendelPunnettGridSandbox: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState('Aa_x_Aa');
  const preset = MENDEL_PRESETS.find((p) => p.id === selectedPresetId) || MENDEL_PRESETS[0];

  return (
    <div className="space-y-3 relative z-10">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Grid className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Bảng Punnett Mendel Tương Tác</span>
              <span className="text-[10px] text-amber-400 font-bold lowercase px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-800/60">
                bài 37
              </span>
            </h4>
          </div>
        </div>
      </div>

      {/* Preset selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {MENDEL_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              sound.playClick();
              setSelectedPresetId(p.id);
            }}
            className={cn(
              'px-2 py-1.5 rounded-xl text-left border transition-all cursor-pointer',
              selectedPresetId === p.id
                ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-[0_2px_0_0_#ca8a04]'
                : 'bg-[#14232c] text-slate-400 border-slate-700/60 hover:text-white hover:bg-[#1b2f3a]'
            )}
          >
            <div className="text-xs font-black">{p.title}</div>
            <div className="text-[10px] text-slate-400 truncate">{p.desc}</div>
          </button>
        ))}
      </div>

      {/* Punnett Table */}
      <div className="p-3 bg-[#14232c] rounded-2xl border-2 border-slate-700/60 overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr>
              <th className="p-1.5 text-[11px] font-black text-slate-400 border border-slate-700/50 bg-[#18272f]">
                ♀ \ ♂
              </th>
              {preset.maleGametes.map((mg, idx) => (
                <th
                  key={`mg-${idx}`}
                  className="p-1.5 text-xs font-black text-cyan-300 border border-slate-700/50 bg-[#18272f]"
                >
                  ♂ {mg}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preset.femaleGametes.map((fg, rIdx) => (
              <tr key={`fg-${rIdx}`}>
                <td className="p-1.5 text-xs font-black text-rose-300 border border-slate-700/50 bg-[#18272f]">
                  ♀ {fg}
                </td>
                {preset.maleGametes.map((mg, cIdx) => {
                  const cell = preset.solve(fg, mg);
                  return (
                    <td
                      key={`cell-${rIdx}-${cIdx}`}
                      className="p-1.5 border border-slate-700/50 bg-[#101b22]"
                    >
                      <div className={cn('p-1 rounded-lg border text-center transition-all', cell.color)}>
                        <div className="text-xs font-black flex items-center justify-center gap-1">
                          <span>{cell.badge}</span>
                          <span>{cell.genotype}</span>
                        </div>
                        <div className="text-[10px] font-medium opacity-90 truncate">{cell.phenotype}</div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ratio Summary */}
      <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/30 text-xs font-bold text-amber-300 flex items-center gap-2">
        <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
        <span>{preset.ratioSummary}</span>
      </div>
    </div>
  );
};

// ── 7. DNA & TRANSCRIPTION BUILDER (Cơ chế di truyền phân tử) ──
const DNA_TEMPLATE_DEMO = [
  { pos: 1, base: 'T', compDna: 'A', compRna: 'A', bonds: 2 },
  { pos: 2, base: 'A', compDna: 'T', compRna: 'U', bonds: 2 },
  { pos: 3, base: 'C', compDna: 'G', compRna: 'G', bonds: 3 },
  { pos: 4, base: 'G', compDna: 'C', compRna: 'C', bonds: 3 },
  { pos: 5, base: 'A', compDna: 'T', compRna: 'U', bonds: 2 },
  { pos: 6, base: 'A', compDna: 'T', compRna: 'U', bonds: 2 },
  { pos: 7, base: 'C', compDna: 'G', compRna: 'G', bonds: 3 },
  { pos: 8, base: 'T', compDna: 'A', compRna: 'A', bonds: 2 },
];

const DnaTranscriptionBuilderSandbox: React.FC = () => {
  const [subMode, setSubMode] = useState<'dna-structure' | 'transcription' | 'translation'>('dna-structure');

  const baseColors: Record<string, string> = {
    A: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    T: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
    U: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    G: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    C: 'bg-sky-500/20 text-sky-300 border-sky-500/50',
  };

  return (
    <div className="space-y-3 relative z-10">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Dna className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Mô Hình Phân Tử DNA & Phiên Mã</span>
              <span className="text-[10px] text-blue-400 font-bold lowercase px-1.5 py-0.2 rounded bg-blue-950/60 border border-blue-800/60">
                bài 38-40
              </span>
            </h4>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-1 bg-[#14232c] p-0.5 rounded-xl border border-slate-700">
          <button
            onClick={() => {
              sound.playClick();
              setSubMode('dna-structure');
            }}
            className={cn(
              'px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer',
              subMode === 'dna-structure' ? 'bg-blue-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            )}
          >
            🧬 DNA Xoắn kép
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setSubMode('transcription');
            }}
            className={cn(
              'px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer',
              subMode === 'transcription' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            )}
          >
            ⚡ Phiên mã mRNA
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setSubMode('translation');
            }}
            className={cn(
              'px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer',
              subMode === 'translation' ? 'bg-purple-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            )}
          >
            🧪 Dịch mã Codon
          </button>
        </div>
      </div>

      {/* Main Interactive Visual */}
      <div className="p-3 bg-[#14232c] rounded-2xl border-2 border-slate-700/60 space-y-3">
        {/* Template Strand */}
        <div>
          <div className="text-[10px] font-black uppercase text-slate-400 mb-1 flex items-center justify-between">
            <span>Mạch gốc DNA (3' → 5'):</span>
            <span className="text-slate-500">Mạch khuôn</span>
          </div>
          <div className="grid grid-cols-8 gap-1.5 text-center">
            {DNA_TEMPLATE_DEMO.map((item) => (
              <div
                key={`top-${item.pos}`}
                className={cn('p-1.5 rounded-xl border font-black text-xs shadow-sm', baseColors[item.base])}
              >
                <div>{item.base}</div>
                <div className="text-[9px] opacity-75 font-normal">#{item.pos}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hydrogen Bonds or Process Indicator */}
        <div className="grid grid-cols-8 gap-1.5 text-center">
          {DNA_TEMPLATE_DEMO.map((item) => (
            <div key={`bond-${item.pos}`} className="flex flex-col items-center justify-center text-[10px] text-amber-400 font-bold">
              {subMode === 'dna-structure' ? (
                <>
                  <span className="leading-none text-slate-400">{item.bonds === 3 ? '≡' : '='}</span>
                  <span className="text-[8px] text-amber-300 font-mono">{item.bonds}H</span>
                </>
              ) : subMode === 'transcription' ? (
                <span className="text-cyan-400 text-xs">↓</span>
              ) : (
                <span className="text-purple-400 text-[9px] font-mono">cod</span>
              )}
            </div>
          ))}
        </div>

        {/* Complementary Strand / mRNA */}
        <div>
          <div className="text-[10px] font-black uppercase text-slate-400 mb-1 flex items-center justify-between">
            <span>
              {subMode === 'dna-structure'
                ? "Mạch bổ sung DNA (5' → 3'):"
                : "Mạch đơn mRNA (5' → 3'):"}
            </span>
            <span className={cn('text-[10px] font-bold', subMode === 'dna-structure' ? 'text-blue-400' : 'text-cyan-400')}>
              {subMode === 'dna-structure' ? 'NTBS: A=T, G≡C' : 'NTBS: A-U, T-A, G-C'}
            </span>
          </div>
          <div className="grid grid-cols-8 gap-1.5 text-center">
            {DNA_TEMPLATE_DEMO.map((item) => {
              const base = subMode === 'dna-structure' ? item.compDna : item.compRna;
              return (
                <div
                  key={`bot-${item.pos}`}
                  className={cn('p-1.5 rounded-xl border font-black text-xs shadow-sm', baseColors[base])}
                >
                  <div>{base}</div>
                  <div className="text-[9px] opacity-75 font-normal">
                    {subMode === 'dna-structure'
                      ? base === 'T' ? 'Thymine' : base === 'A' ? 'Adenine' : base === 'C' ? 'Cytosine' : 'Guanine'
                      : base === 'U' ? 'Uracil' : base}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Translation Codon Breakdown if translation submode */}
        {subMode === 'translation' && (
          <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-purple-300 block">
              Dịch mã trên Ribosome (Central Dogma: Gene → mRNA → Protein):
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-purple-900/60 border border-purple-700 text-purple-200">
                Codon 1: <strong>AUG</strong> (Mở đầu → Met)
              </span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded bg-purple-900/60 border border-purple-700 text-purple-200">
                Codon 2: <strong>CUU</strong> (Leu)
              </span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded bg-purple-900/60 border border-purple-700 text-purple-200">
                Codon 3: <strong>GA...</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Explanatory footer */}
      <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/30 text-xs text-blue-300 space-y-0.5">
        <strong>Nguyên tắc bổ sung:</strong>
        {subMode === 'dna-structure' && (
          <p className="text-[11px] text-slate-300">
            Adenine (A) liên kết với Thymine (T) bằng 2 liên kết hydrogen. Guanine (G) liên kết với Cytosine (C) bằng 3 liên kết hydrogen.
          </p>
        )}
        {subMode === 'transcription' && (
          <p className="text-[11px] text-slate-300">
            Enzyme RNA polymerase sử dụng mạch gốc 3'→5' tổng hợp mRNA: A liên kết U, T liên kết A, G liên kết C, C liên kết G.
          </p>
        )}
        {subMode === 'translation' && (
          <p className="text-[11px] text-slate-300">
            Cứ 3 nucleotide liền kề trên mRNA tạo thành 1 bộ ba codon mã hóa 1 amino acid trong chuỗi polypeptide.
          </p>
        )}
      </div>
    </div>
  );
};

// ── 8. MITOSIS & MEIOSIS SCOPE (Kính hiển vi bắt kì phân bào) ──
const MITOSIS_STAGES = [
  { id: 'prophase', name: 'Kì đầu', chromosomes: '4 NST kép', chromatids: '8', centromeres: '4', desc: 'Màng nhân tiêu biến, thoi vô sắc xuất hiện, NST kép bắt đầu co xoắn.' },
  { id: 'metaphase', name: 'Kì giữa', chromosomes: '4 NST kép (xếp 1 hàng)', chromatids: '8', centromeres: '4', desc: 'NST kép co xoắn cực đại, tập trung xếp thành 1 HÀNG tại mặt phẳng xích đạo.' },
  { id: 'anaphase', name: 'Kì sau', chromosomes: '8 NST đơn (phân li)', chromatids: '0', centromeres: '8', desc: 'Tâm động chẻ đôi, 2 nhiễm sắc tử (chromatid) tách nhau thành 2 NST đơn phân li về 2 cực.' },
  { id: 'telophase', name: 'Kì cuối', chromosomes: '4 NST đơn / mỗi tế bào', chromatids: '0', centromeres: '4', desc: 'Màng nhân tái lập, dãn xoắn, phân chia tế bào chất tạo 2 tế bào con giống hệt mẹ (2n = 4).' },
];

const MEIOSIS_STAGES = [
  { id: 'metaphase-1', name: 'Kì giữa I', chromosomes: '4 NST kép (xếp 2 hàng)', chromatids: '8', centromeres: '4', desc: 'Các cặp NST kép tương đồng tập trung xếp thành 2 HÀNG song song trên mặt phẳng xích đạo.' },
  { id: 'anaphase-1', name: 'Kì sau I', chromosomes: '4 NST kép (phân li kép)', chromatids: '8', centromeres: '4', desc: 'Các cặp NST kép tương đồng phân li độc lập về 2 cực. Tâm động KHÔNG chẻ đôi!' },
  { id: 'telophase-1', name: 'Kì cuối I', chromosomes: '2 NST kép / mỗi tế bào', chromatids: '4', centromeres: '2', desc: 'Tạo 2 tế bào con có số lượng NST giảm một nửa (bộ đơn bội kép n = 2 kép).' },
  { id: 'metaphase-2', name: 'Kì giữa II', chromosomes: '2 NST kép (xếp 1 hàng)', chromatids: '4', centromeres: '2', desc: 'n NST kép co xoắn và xếp thành 1 HÀNG trên mặt phẳng xích đạo thoi phân bào.' },
  { id: 'anaphase-2', name: 'Kì sau II', chromosomes: '4 NST đơn (phân li đơn)', chromatids: '0', centromeres: '4', desc: 'Tâm động chẻ đôi, các chromatid tách nhau thành NST đơn phân li về 2 cực tế bào.' },
  { id: 'telophase-2', name: 'Kì cuối II', chromosomes: '2 NST đơn / giao tử (n = 2)', chromatids: '0', centromeres: '2', desc: 'Kết thúc giảm phân tạo 4 tế bào con đơn bội (giao tử: tinh trùng hoặc trứng).' },
];

const MitosisMeiosisScopeSandbox: React.FC = () => {
  const [divisionType, setDivisionType] = useState<'mitosis' | 'meiosis'>('mitosis');
  const [stageIdx, setStageIdx] = useState(1);

  const stages = divisionType === 'mitosis' ? MITOSIS_STAGES : MEIOSIS_STAGES;
  const currentStage = stages[Math.min(stageIdx, stages.length - 1)];

  return (
    <div className="space-y-3 relative z-10">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Microscope className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Kính Hiển Vi Bắt Kì Phân Bào</span>
              <span className="text-[10px] text-emerald-400 font-bold lowercase px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-800/60">
                bài 42-43
              </span>
            </h4>
          </div>
        </div>

        {/* Division switch */}
        <div className="flex gap-1 bg-[#14232c] p-0.5 rounded-xl border border-slate-700">
          <button
            onClick={() => {
              sound.playClick();
              setDivisionType('mitosis');
              setStageIdx(1);
            }}
            className={cn(
              'px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer',
              divisionType === 'mitosis' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            )}
          >
            Nguyên phân (2n → 2n)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setDivisionType('meiosis');
              setStageIdx(0);
            }}
            className={cn(
              'px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer',
              divisionType === 'meiosis' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            )}
          >
            Giảm phân (2n → n)
          </button>
        </div>
      </div>

      {/* Stage timeline tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {stages.map((st, idx) => (
          <button
            key={st.id}
            onClick={() => {
              sound.playClick();
              setStageIdx(idx);
            }}
            className={cn(
              'px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer',
              stageIdx === idx
                ? divisionType === 'mitosis'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm'
                : 'bg-[#14232c] text-slate-400 border-slate-700/60 hover:text-white'
            )}
          >
            {st.name}
          </button>
        ))}
      </div>

      {/* Microscope Viewport & Metrics */}
      <div className="p-3 bg-[#14232c] rounded-2xl border-2 border-slate-700/60 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-white flex items-center gap-1.5">
            <span>🔬 Tiêu bản tế bào (2n = 4):</span>
            <span className={cn('px-2 py-0.5 rounded-lg border text-[10px] font-bold', divisionType === 'mitosis' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-amber-950 text-amber-300 border-amber-700')}>
              {currentStage.name}
            </span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {divisionType === 'mitosis' ? '1 lần phân bào' : '2 lần phân bào liên tiếp'}
          </span>
        </div>

        {/* Visual chromosome representation */}
        <div className="h-24 rounded-xl bg-[#091317] border border-slate-800 flex items-center justify-center p-3 relative overflow-hidden">
          {/* Centrosomes & spindle fibers */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          <div className="absolute inset-x-6 top-1/2 h-[1px] bg-cyan-500/20 border-dashed" />

          {/* Chromosome graphics depending on stage */}
          <div className="flex items-center justify-center gap-4 z-10">
            {currentStage.id.includes('metaphase') && (
              <div className={cn('flex items-center gap-2 p-2 rounded-xl border', currentStage.id.includes('1') ? 'flex-col border-amber-500/40 bg-amber-500/10' : 'flex-row border-emerald-500/40 bg-emerald-500/10')}>
                <span className="text-xs font-black text-white">
                  {currentStage.id.includes('1') ? 'Xếp 2 hàng song song' : 'Xếp 1 hàng mặt phẳng xích đạo'}
                </span>
                <span className="text-lg">🧬🧬🧬🧬</span>
              </div>
            )}
            {currentStage.id.includes('anaphase') && (
              <div className="flex items-center justify-between w-48 px-2">
                <span className="text-base animate-pulse">👈 🧬🧬</span>
                <span className="text-[10px] font-bold text-amber-400">Phân li về 2 cực</span>
                <span className="text-base animate-pulse">🧬🧬 👉</span>
              </div>
            )}
            {(!currentStage.id.includes('metaphase') && !currentStage.id.includes('anaphase')) && (
              <div className="text-center space-y-1">
                <span className="text-xl">🧬 🧬 🧬 🧬</span>
                <div className="text-[10px] text-slate-400 font-bold">{currentStage.chromosomes}</div>
              </div>
            )}
          </div>
        </div>

        {/* Live Chromosome Counts Table (2n = 4) */}
        <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
          <div className="p-2 rounded-xl bg-[#18272f] border border-slate-700/60">
            <div className="text-[10px] text-slate-400">Số NST</div>
            <div className="font-black text-emerald-400 text-xs">{currentStage.chromosomes}</div>
          </div>
          <div className="p-2 rounded-xl bg-[#18272f] border border-slate-700/60">
            <div className="text-[10px] text-slate-400">Chromatid</div>
            <div className="font-black text-cyan-400 text-xs">{currentStage.chromatids}</div>
          </div>
          <div className="p-2 rounded-xl bg-[#18272f] border border-slate-700/60">
            <div className="text-[10px] text-slate-400">Tâm động</div>
            <div className="font-black text-amber-400 text-xs">{currentStage.centromeres}</div>
          </div>
          <div className="p-2 rounded-xl bg-[#18272f] border border-slate-700/60">
            <div className="text-[10px] text-slate-400">Trạng thái</div>
            <div className="font-black text-purple-400 text-[11px] truncate">
              {currentStage.chromatids === '0' ? 'NST Đơn' : 'NST Kép'}
            </div>
          </div>
        </div>

        {/* Stage description */}
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          {currentStage.desc}
        </p>
      </div>
    </div>
  );
};
