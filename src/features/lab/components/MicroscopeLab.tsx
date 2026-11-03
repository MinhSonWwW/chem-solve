import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCcw,
  Sliders,
  Sun,
  Eye,
  Info,
  CheckCircle2,
  ZoomIn,
} from 'lucide-react';
import { SPECIMENS, calculateFocusClarity } from '../microscopeEngine';
import type { SpecimenId, ObjectiveLens } from '../types';
import { sound } from '@/lib/audio';

export const MicroscopeLab: React.FC = () => {
  const [selectedSpecimenId, setSelectedSpecimenId] = useState<SpecimenId>('onion-cell');
  const [lens, setLens] = useState<ObjectiveLens>('40x');
  const [fineFocus, setFineFocus] = useState<number>(30); // Start slightly out of focus
  const [lightIntensity, setLightIntensity] = useState<number>(65);
  const [activeOrganelleIndex, setActiveOrganelleIndex] = useState<number | null>(null);

  const specimen = SPECIMENS[selectedSpecimenId];

  // Calculate focus clarity
  const clarity = useMemo(() => {
    return calculateFocusClarity(fineFocus, specimen.optimalFocus);
  }, [fineFocus, specimen.optimalFocus]);

  // Handle changing specimen
  const handleSelectSpecimen = useCallback((id: SpecimenId) => {
    sound.playClick();
    setSelectedSpecimenId(id);
    setActiveOrganelleIndex(null);
    // Reset focus to test user finding it
    setFineFocus(20);
  }, []);

  // Handle lens change
  const handleChangeLens = useCallback((newLens: ObjectiveLens) => {
    sound.playClick();
    setLens(newLens);
  }, []);

  // Reset
  const handleReset = useCallback(() => {
    sound.playClick();
    setFineFocus(20);
    setLightIntensity(65);
    setActiveOrganelleIndex(null);
  }, []);

  // Magnification factor
  const zoomScale = lens === '10x' ? 1 : lens === '40x' ? 1.4 : 1.9;

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-3.5 rounded-2xl bg-[#18272f] border-2 border-[#2e4756] flex items-center justify-between gap-3 shadow-[0_3px_0_0_#101a1f]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <span className="text-lg">🔬</span>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-white">Kính Hiển Vi Quang Học Sinh Học</h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Soi tiêu bản tế bào. Xoay ốc vi cấp điều chỉnh độ nét, đổi vật kính và khám phá bào quan.
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-[#20333d] hover:bg-[#ff4b4b]/20 hover:border-[#ff4b4b]/50 border-2 border-[#2e4756] text-slate-300 hover:text-[#ff4b4b] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-[0_2px_0_0_#131f24] active:translate-y-[2px] active:shadow-none"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      {/* Main Grid: Microscope Viewport + Microscope Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Microscope Eyepiece Viewport (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#101a1f] space-y-3">
            {/* Viewport Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                Thị Kính Quang Học (Độ phóng đại {lens})
              </span>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                  clarity.isSharp
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                }`}
              >
                {clarity.isSharp ? '✨ RÕ NÉT 100%' : `MỜ (${clarity.clarityPercent}%)`}
              </span>
            </div>

            {/* Circular Eyepiece Container */}
            <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[380px] mx-auto rounded-full border-4 border-[#20333d] bg-[#080d10] overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.8)_inset,0_4px_12px_rgba(0,0,0,0.5)]">
              {/* Microscope Glass Reflection vignette */}
              <div className="absolute inset-0 rounded-full pointer-events-none z-20 shadow-[0_0_40px_rgba(0,0,0,0.9)_inset]" />
              <div className="absolute inset-0 rounded-full border border-sky-400/10 pointer-events-none z-20" />

              {/* Specimen Slide SVG Visualizer */}
              <div
                className="w-full h-full flex items-center justify-center transition-all duration-300 relative select-none"
                style={{
                  filter: `blur(${clarity.blurPx}px) brightness(${lightIntensity / 60})`,
                  transform: `scale(${zoomScale})`,
                }}
              >
                {/* SVG Illustrations for each specimen */}
                {selectedSpecimenId === 'onion-cell' && (
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Onion cell grid pattern (elongated plant cells) */}
                    <defs>
                      <pattern id="onionGrid" width="60" height="30" patternUnits="userSpaceOnUse">
                        <path
                          d="M 0 0 L 60 0 L 60 30 L 0 30 Z"
                          fill="#422006"
                          stroke="#ca8a04"
                          strokeWidth="2"
                        />
                        <ellipse cx="30" cy="15" rx="6" ry="5" fill="#a16207" />
                        <ellipse cx="30" cy="15" rx="3" ry="2.5" fill="#713f12" />
                      </pattern>
                    </defs>
                    <rect width="200" height="200" fill="url(#onionGrid)" />
                    {/* Prominent focused center cell */}
                    <rect
                      x="40"
                      y="70"
                      width="120"
                      height="60"
                      rx="6"
                      fill="#854d0e"
                      fillOpacity="0.4"
                      stroke="#facc15"
                      strokeWidth="3.5"
                    />
                    {/* Nucleus */}
                    <ellipse
                      cx="105"
                      cy="100"
                      rx="14"
                      ry="12"
                      fill="#eab308"
                      stroke="#ca8a04"
                      strokeWidth="2"
                    />
                    <circle cx="107" cy="101" r="5" fill="#713f12" />
                    {/* Large vacuole */}
                    <ellipse
                      cx="68"
                      cy="100"
                      rx="18"
                      ry="22"
                      fill="#ca8a04"
                      fillOpacity="0.25"
                      stroke="#eab308"
                      strokeDasharray="3 3"
                    />
                  </svg>
                )}

                {selectedSpecimenId === 'cheek-cell' && (
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Organic irregular cell boundary */}
                    <path
                      d="M 50,70 Q 30,110 65,150 Q 120,175 160,135 Q 180,85 140,50 Q 80,40 50,70 Z"
                      fill="#0284c7"
                      fillOpacity="0.2"
                      stroke="#38bdf8"
                      strokeWidth="3"
                    />
                    {/* Granular cytoplasm dots */}
                    <circle cx="80" cy="80" r="2" fill="#38bdf8" fillOpacity="0.6" />
                    <circle cx="130" cy="95" r="2.5" fill="#38bdf8" fillOpacity="0.6" />
                    <circle cx="95" cy="140" r="2" fill="#38bdf8" fillOpacity="0.6" />
                    <circle cx="140" cy="130" r="1.5" fill="#38bdf8" fillOpacity="0.6" />
                    {/* Dark methylene blue nucleus */}
                    <ellipse
                      cx="100"
                      cy="100"
                      rx="16"
                      ry="15"
                      fill="#0369a1"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                    />
                    <circle cx="102" cy="101" r="6" fill="#082f49" />
                  </svg>
                )}

                {selectedSpecimenId === 'leaf-chloroplast' && (
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Plant cell wall */}
                    <rect
                      x="30"
                      y="30"
                      width="140"
                      height="140"
                      rx="12"
                      fill="#064e3b"
                      fillOpacity="0.3"
                      stroke="#10b981"
                      strokeWidth="4"
                    />
                    {/* Scattered chloroplasts */}
                    {[
                      [60, 60],
                      [90, 50],
                      [135, 65],
                      [145, 105],
                      [130, 140],
                      [95, 145],
                      [55, 130],
                      [50, 95],
                      [85, 95],
                      [115, 105],
                    ].map(([cx, cy], i) => (
                      <ellipse
                        key={i}
                        cx={cx}
                        cy={cy}
                        rx="11"
                        ry="8"
                        transform={`rotate(${i * 25} ${cx} ${cy})`}
                        fill="#22c55e"
                        stroke="#15803d"
                        strokeWidth="1.5"
                      />
                    ))}
                  </svg>
                )}

                {selectedSpecimenId === 'amoeba' && (
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Amoeba pseudopodia protrusions */}
                    <path
                      d="M 70,40 Q 110,25 130,55 Q 165,65 170,105 Q 160,145 125,160 Q 95,175 60,150 Q 35,130 40,90 Q 30,55 70,40 Z"
                      fill="#4f46e5"
                      fillOpacity="0.2"
                      stroke="#818cf8"
                      strokeWidth="3.5"
                    />
                    {/* Pseudopodia arm tip */}
                    <path
                      d="M 160,85 Q 185,95 165,115"
                      stroke="#a5b4fc"
                      strokeWidth="3"
                      fill="none"
                    />
                    {/* Amoeba Nucleus */}
                    <circle cx="105" cy="110" r="14" fill="#3730a3" stroke="#6366f1" strokeWidth="2" />
                    {/* Contractile vacuole */}
                    <circle
                      cx="70"
                      cy="90"
                      r="12"
                      fill="#818cf8"
                      fillOpacity="0.35"
                      stroke="#c7d2fe"
                      strokeWidth="1.5"
                    />
                  </svg>
                )}
              </div>

              {/* Organelle Hotspot Pins (only active & visible when focus is sharp) */}
              <AnimatePresence>
                {clarity.isSharp && (
                  <div className="absolute inset-0 pointer-events-auto z-30">
                    {specimen.organelles.map((org, index) => {
                      const isActive = activeOrganelleIndex === index;
                      return (
                        <div
                          key={index}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${org.x}%`, top: `${org.y}%` }}
                        >
                          <button
                            onClick={() => {
                              sound.playClick();
                              setActiveOrganelleIndex(isActive ? null : index);
                            }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-transform cursor-pointer border-2 shadow-lg animate-bounce ${
                              isActive
                                ? 'bg-amber-400 text-slate-950 border-white scale-125'
                                : 'bg-emerald-500 text-white border-white hover:scale-110'
                            }`}
                            title={`Chạm để xem ${org.name}`}
                          >
                            {index + 1}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Active Organelle Explanation Popover Card */}
            {clarity.isSharp && activeOrganelleIndex !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-[#20333d] border-2 border-emerald-500/50 space-y-1 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Bào quan #{activeOrganelleIndex + 1}:{' '}
                    {specimen.organelles[activeOrganelleIndex].name}
                  </span>
                  <button
                    onClick={() => setActiveOrganelleIndex(null)}
                    className="text-slate-400 hover:text-white text-xs font-bold px-1"
                  >
                    Đóng
                  </button>
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed font-medium">
                  {specimen.organelles[activeOrganelleIndex].description}
                </p>
              </motion.div>
            )}

            {/* Hint message if not sharp */}
            {!clarity.isSharp && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-2">
                <Sliders className="w-4 h-4 shrink-0" />
                <span>
                  Tiêu bản đang bị mờ! Kéo thanh **Ốc Vi Cấp** bên phải sang trái/phải để tìm điểm
                  nét hoàn hảo (~{specimen.optimalFocus}%).
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Microscope Controls & Specimen Tray (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Specimen Slide Tray (Khay Tiêu Bản) */}
          <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#101a1f] space-y-3">
            <span className="text-xs font-black text-white uppercase tracking-wider block">
              Khay Tiêu Bản Sinh Học
            </span>

            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(SPECIMENS) as SpecimenId[]).map((id) => {
                const sp = SPECIMENS[id];
                const isSelected = id === selectedSpecimenId;
                return (
                  <button
                    key={id}
                    onClick={() => handleSelectSpecimen(id)}
                    className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer shadow-[0_2px_0_0_#131f24] active:translate-y-[2px] active:shadow-none ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-600 shadow-sm'
                        : 'bg-[#20333d] hover:bg-[#28404e] border-[#2e4756]'
                    }`}
                  >
                    <div className="text-xs font-black text-white line-clamp-1">{sp.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{sp.source}</div>
                    <div className="mt-1">
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                        {sp.stain}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Objective Lens Revolver (Mâm Xoay Vật Kính) */}
          <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#101a1f] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <ZoomIn className="w-4 h-4 text-sky-400" />
                Vật Kính (Độ phóng đại)
              </span>
              <span className="text-[10px] font-bold text-slate-400">Chọn ống kính</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['10x', '40x', '100x'] as ObjectiveLens[]).map((l) => (
                <button
                  key={l}
                  onClick={() => handleChangeLens(l)}
                  className={`py-2 rounded-xl font-black text-xs border-2 transition-all cursor-pointer ${
                    lens === l
                      ? 'bg-sky-500 text-white border-sky-300 shadow-[0_3px_0_0_#0284c7]'
                      : 'bg-[#20333d] hover:bg-[#28404e] text-slate-300 border-[#2e4756]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Microscope Optical Adjustment Knobs (Ốc Vi Cấp & Đèn Chiếu) */}
          <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#101a1f] space-y-4">
            <span className="text-xs font-black text-white uppercase tracking-wider block">
              Điều Chỉnh Quang Học
            </span>

            {/* Fine Focus Knob Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  Ốc Vi Cấp (Độ nét tiêu cự)
                </span>
                <span className="font-mono font-black text-emerald-400">{fineFocus}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={fineFocus}
                onChange={(e) => setFineFocus(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-[#20333d] rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>0% (Hạ bàn soi)</span>
                <span>50% (Trung tâm)</span>
                <span>100% (Nâng bàn soi)</span>
              </div>
            </div>

            {/* Light Intensity Slider */}
            <div className="space-y-1.5 pt-2 border-t border-[#2e4756]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Gương/Đèn Chiếu Sáng
                </span>
                <span className="font-mono font-black text-amber-400">{lightIntensity}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={lightIntensity}
                onChange={(e) => setLightIntensity(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-[#20333d] rounded-lg"
              />
            </div>
          </div>

          {/* Educational Note */}
          <div className="p-3.5 rounded-2xl bg-[#18272f] border-2 border-[#2e4756] text-xs space-y-1">
            <div className="font-black text-white flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-sky-400" />
              Đặc điểm tiêu bản hiện tại:
            </div>
            <p className="text-slate-300 text-[11px] font-medium leading-relaxed">
              {specimen.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
