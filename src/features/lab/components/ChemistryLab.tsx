import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FlaskConical,
  RotateCcw,
  Info,
  Droplets,
  CheckCircle2,
} from 'lucide-react';
import { REAGENTS, evaluateReaction } from '../chemEngine';
import type { ReagentId, ChemistryReactionResult } from '../types';
import { sound } from '@/lib/audio';

export const ChemistryLab: React.FC = () => {
  const [selectedReagents, setSelectedReagents] = useState<ReagentId[]>([]);
  const [activePipette, setActivePipette] = useState<ReagentId | null>(null);
  const [isDropping, setIsDropping] = useState(false);

  // Evaluate reaction based on current reagents in test tube
  const reactionResult: ChemistryReactionResult | null = useMemo(() => {
    return evaluateReaction(selectedReagents);
  }, [selectedReagents]);

  // Color of liquid in test tube
  const liquidColor = useMemo(() => {
    if (reactionResult?.solutionColor) return reactionResult.solutionColor;
    if (selectedReagents.length === 0) return 'transparent';
    const lastReagent = REAGENTS[selectedReagents[selectedReagents.length - 1]];
    return lastReagent.color;
  }, [selectedReagents, reactionResult]);

  // Liquid volume height percentage
  const liquidHeight = Math.min(85, selectedReagents.length * 28);

  // Handle adding a reagent via pipette or click
  const handleAddReagent = useCallback((id: ReagentId) => {
    if (selectedReagents.includes(id)) return;
    sound.playClick();
    setActivePipette(id);
    setIsDropping(true);

    setTimeout(() => {
      sound.playBubbling();
      setSelectedReagents((prev) => [...prev, id]);
      setIsDropping(false);
      setActivePipette(null);
    }, 600);
  }, [selectedReagents]);

  const handleReset = useCallback(() => {
    sound.playClick();
    setSelectedReagents([]);
    setActivePipette(null);
    setIsDropping(false);
  }, []);

  return (
    <div className="space-y-4">
      {/* Top Banner / Mode Explanation */}
      <div className="p-3.5 rounded-2xl bg-[#18272f] border-2 border-[#2e4756] flex items-center justify-between gap-3 shadow-[0_3px_0_0_#101a1f]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center shrink-0">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-white">Bàn Thí Nghiệm Hóa Học Ảo</h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Nhỏ hóa chất vào ống nghiệm để quan sát đổi màu, sủi bọt khí và kết tủa.
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-[#20333d] hover:bg-[#ff4b4b]/20 hover:border-[#ff4b4b]/50 border-2 border-[#2e4756] text-slate-300 hover:text-[#ff4b4b] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-[0_2px_0_0_#131f24] active:translate-y-[2px] active:shadow-none"
          title="Rửa sạch ống nghiệm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Rửa sạch</span>
        </button>
      </div>

      {/* Main Lab Bench: Workbench Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Column: Reagent Rack */}
        <div className="md:col-span-5 p-3.5 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#101a1f] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-400" />
              Kệ Hóa Chất
            </span>
            <span className="text-[10px] font-bold text-slate-400">Chạm để nhỏ</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(REAGENTS) as ReagentId[]).map((id) => {
              const r = REAGENTS[id];
              const isAdded = selectedReagents.includes(id);

              return (
                <button
                  key={id}
                  onClick={() => handleAddReagent(id)}
                  disabled={isAdded || isDropping}
                  className={`p-2.5 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer select-none flex flex-col justify-between ${
                    isAdded
                      ? 'bg-slate-900/60 border-slate-700/60 opacity-40 cursor-not-allowed'
                      : 'bg-[#20333d] border-[#2e4756] hover:border-sky-400/80 hover:bg-[#263e4a] shadow-[0_3px_0_0_#131f24] active:translate-y-[2px] active:shadow-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono font-black text-xs text-sky-300">{r.formula}</span>
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: r.color }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 line-clamp-1">{r.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Reaction Vessel & Phenomena */}
        <div className="md:col-span-7 flex flex-col gap-3">
          {/* Reaction Vessel Visualizer */}
          <div className="p-4 rounded-3xl bg-[#0f171c] border-2 border-[#2e4756] shadow-[0_4px_0_0_#091014] flex flex-col items-center justify-center relative min-h-[260px] overflow-hidden">
            {/* Background Lab Grid */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />

            {/* Dropper Animation */}
            <AnimatePresence>
              {isDropping && activePipette && (
                <motion.div
                  initial={{ y: -40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="absolute top-2 z-20 flex flex-col items-center"
                >
                  <div className="w-3 h-10 bg-slate-200 rounded-t-sm border border-slate-400" />
                  <motion.div
                    animate={{ y: [0, 40], scale: [1, 0.6], opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="w-2.5 h-3 rounded-full mt-1"
                    style={{ backgroundColor: REAGENTS[activePipette].color }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Test Tube Container */}
            <div className="relative w-20 h-48 border-4 border-slate-400/60 rounded-b-full bg-slate-900/40 backdrop-blur-sm overflow-hidden flex flex-col justify-end shadow-2xl">
              {/* Test Tube Neck Lip */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-slate-300/40 border-b border-slate-400" />

              {/* Liquid Level */}
              <motion.div
                className="w-full relative transition-all duration-700"
                style={{
                  height: `${liquidHeight}%`,
                  backgroundColor: liquidColor,
                }}
                animate={{
                  height: `${liquidHeight}%`,
                }}
              >
                {/* Precipitate Settling Effect */}
                {reactionResult?.precipitateColor && (
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 0.95 }}
                    transition={{ duration: 1 }}
                    className="absolute bottom-0 left-0 right-0 h-6 border-t border-white/40"
                    style={{ backgroundColor: reactionResult.precipitateColor }}
                  />
                )}

                {/* Rising Gas Bubbles */}
                {reactionResult?.gasBubbles && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[1, 2, 3, 4, 5, 6, 7].map((b) => (
                      <motion.div
                        key={b}
                        className="absolute w-2 h-2 rounded-full bg-white/70 border border-white"
                        style={{ left: `${b * 12}%`, bottom: '4px' }}
                        animate={{
                          y: [0, -120],
                          x: [0, (b % 2 === 0 ? 4 : -4)],
                          opacity: [0.8, 0],
                        }}
                        transition={{
                          duration: 0.9 + (b % 3) * 0.2,
                          repeat: Infinity,
                          delay: b * 0.15,
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Solid Reagents sitting at bottom of tube */}
            <div className="mt-2 text-center">
              {selectedReagents.length === 0 ? (
                <span className="text-[11px] text-slate-500 font-bold">Ống nghiệm trống</span>
              ) : (
                <div className="flex flex-wrap gap-1 justify-center max-w-[200px]">
                  {selectedReagents.map((id) => (
                    <span
                      key={id}
                      className="px-2 py-0.5 rounded-md bg-[#20333d] border border-[#2e4756] text-[10px] font-mono font-bold text-slate-300"
                    >
                      {REAGENTS[id].formula}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reaction Findings / Phenomenon Feedback */}
          {reactionResult ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-[#18272f] to-[#1a2d39] border-2 border-emerald-500/50 shadow-[0_3px_0_0_#064e3b] space-y-2"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-black text-emerald-300 uppercase tracking-wide">
                  Phát Hiện Hiện Tượng Phản Ứng!
                </span>
              </div>

              {/* Equation */}
              <div className="p-2 rounded-xl bg-black/40 border border-emerald-500/30 text-center font-mono font-black text-sm text-emerald-300">
                {reactionResult.equation}
              </div>

              {/* Phenomenon description */}
              <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                {reactionResult.phenomenon}
              </p>

              {/* Scientific explanation */}
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed border-t border-[#2e4756] pt-1.5">
                💡 <span className="font-bold text-slate-300">Bản chất:</span> {reactionResult.explanation}
              </p>
            </motion.div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-[#18272f] border-2 border-[#2e4756] flex items-center gap-2.5 text-slate-400">
              <Info className="w-4 h-4 text-sky-400 shrink-0" />
              <p className="text-xs font-medium">
                Hãy phối hợp các chất hóa học để kích hoạt hiện tượng phản ứng (ví dụ: Axit HCl + Quỳ tím, hoặc HCl + Kẽm Zn).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
