import React, { useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  FlaskConical,
  Zap,
  Award,
  ChevronLeft,
  CheckCircle2,
  Lock,
  Leaf,
} from 'lucide-react';
import { ChemistryLab } from './components/ChemistryLab';
import { CircuitLab } from './components/CircuitLab';
import { MicroscopeLab } from './components/MicroscopeLab';
import { PhetSimLibrary } from './components/PhetSimLibrary';
import type { LabSubject } from './types';
import { sound } from '@/lib/audio';
import { useUserStore } from '@/features/gamification/useUserStore';
import { useActiveSubject } from '@/content/subjects';

interface LabMission {
  id: string;
  subject: LabSubject;
  title: string;
  desc: string;
  xpReward: number;
  completed: boolean;
}

export const LabPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { subject: activeGlobalSubject } = useActiveSubject();
  const { addXp } = useUserStore();

  // Active subject comes from the URL (?tab=...) so deep links and back/forward work,
  // falling back to the globally selected subject.
  const tabParam = searchParams.get('tab');
  const activeTab: LabSubject =
    tabParam === 'chem' || tabParam === 'physics' || tabParam === 'bio'
      ? tabParam
      : activeGlobalSubject === 'physics'
        ? 'physics'
        : activeGlobalSubject === 'bio'
          ? 'bio'
          : 'chem';
  const [completedMissions, setCompletedMissions] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('chem_lab_completed_missions') || '[]');
    } catch {
      return [];
    }
  });

  // Missions the student has actually performed in this visit (unlocks the claim button).
  const [achievedMissions, setAchievedMissions] = useState<string[]>([]);
  const markAchieved = useCallback((missionId: string) => {
    setAchievedMissions((prev) => (prev.includes(missionId) ? prev : [...prev, missionId]));
  }, []);
  const onChemAchieve = useCallback(() => markAchieved('mission-chem-1'), [markAchieved]);
  const onPhysicsAchieve = useCallback(() => markAchieved('mission-phy-1'), [markAchieved]);
  const onBioAchieve = useCallback(() => markAchieved('mission-bio-1'), [markAchieved]);

  const missions: LabMission[] = [
    {
      id: 'mission-chem-1',
      subject: 'chem',
      title: 'Phản ứng sủi bọt khí H₂',
      desc: 'Cho kim loại kẽm (Zn) tác dụng với hydrochloric acid (HCl) trong ống nghiệm.',
      xpReward: 25,
      completed: completedMissions.includes('mission-chem-1'),
    },
    {
      id: 'mission-phy-1',
      subject: 'physics',
      title: 'Thắp sáng bóng đèn',
      desc: 'Đóng công tắc để bóng đèn trong mạch sáng lên.',
      xpReward: 25,
      completed: completedMissions.includes('mission-phy-1'),
    },
    {
      id: 'mission-bio-1',
      subject: 'bio',
      title: 'Soi nét tế bào vảy hành',
      desc: 'Chọn mẫu tế bào vảy hành, vặn ốc vi cấp đến khi ảnh rõ nét để quan sát nhân tế bào.',
      xpReward: 25,
      completed: completedMissions.includes('mission-bio-1'),
    },
  ];

  const handleTabChange = (tab: LabSubject) => {
    sound.playClick();
    setSearchParams({ tab }, { replace: true });
  };

  const handleClaimReward = (missionId: string, xpReward: number) => {
    // Only reward missions that were actually performed, and never twice.
    if (!achievedMissions.includes(missionId) || completedMissions.includes(missionId)) return;
    sound.playLevelUp();
    addXp(xpReward);
    const updated = [...completedMissions, missionId];
    setCompletedMissions(updated);
    localStorage.setItem('chem_lab_completed_missions', JSON.stringify(updated));
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-[var(--text-primary)]">
      {/* Top Title & Tab Switcher Bar */}
      <div className="p-3 sm:p-4 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border)] shadow-[0_4px_0_0_var(--edge-neutral)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              navigate(-1);
            }}
            className="w-10 h-10 rounded-2xl bg-[var(--bg-surface-2)] hover:bg-[var(--border)] border-2 border-[var(--border)] text-slate-300 hover:text-[var(--text-primary)] flex items-center justify-center transition-all cursor-pointer shadow-[0_2px_0_0_var(--edge-neutral)] active:translate-y-[2px] active:shadow-none shrink-0"
            title="Quay lại"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-[var(--text-primary)] tracking-wide">
                Phòng thí nghiệm ảo
              </h1>
            </div>
          </div>
        </div>

        {/* Subject Tab Selector Buttons */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-canvas)] border-2 border-[var(--border)]">
          <button
            onClick={() => handleTabChange('chem')}
            className={`py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'chem'
                ? 'bg-sky-500 text-white shadow-[0_3px_0_0_var(--chem-edge)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Hóa học</span>
          </button>

          <button
            onClick={() => handleTabChange('physics')}
            className={`py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'physics'
                ? 'bg-amber-500 text-slate-950 shadow-[0_3px_0_0_var(--gold-edge)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Vật lý</span>
          </button>

          <button
            onClick={() => handleTabChange('bio')}
            className={`py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'bio'
                ? 'bg-emerald-500 text-white shadow-[0_3px_0_0_var(--bio-edge)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span className="whitespace-nowrap">Sinh học</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Missions Carousel Bar */}
        <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border)] shadow-[0_3px_0_0_var(--edge-neutral)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[var(--gold-fg)] flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Nhiệm vụ
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              {completedMissions.length} / {missions.length} hoàn thành
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {missions.map((m) => {
              const isClaimed = m.completed;
              return (
                <div
                  key={m.id}
                  className={`p-2.5 rounded-xl border-2 flex flex-col justify-between transition-all ${
                    isClaimed
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-300'
                      : m.subject === activeTab
                      ? 'bg-[var(--bg-surface-2)] border-[var(--border-strong)]'
                      : 'bg-[var(--bg-surface)]/60 border-[var(--border)] opacity-75'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-black text-[var(--text-primary)]">{m.title}</span>
                      <span className="text-[11px] font-black text-[var(--gold-fg)] flex items-center gap-0.5">
                        +{m.xpReward} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{m.desc}</p>
                  </div>

                  <div className="mt-2 text-right">
                    {isClaimed ? (
                      <span className="text-[11px] font-bold text-[var(--ok-fg)] flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Đã nhận thưởng
                      </span>
                    ) : !achievedMissions.includes(m.id) ? (
                      <span className="text-[11px] font-bold text-slate-400 flex items-center justify-end gap-1">
                        <Lock className="w-3 h-3" /> Làm thí nghiệm để mở khóa
                      </span>
                    ) : (
                      <button
                        onClick={() => handleClaimReward(m.id, m.xpReward)}
                        className="px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] transition-transform active:scale-95 cursor-pointer shadow-[0_2px_0_0_var(--gold-edge)]"
                      >
                        Nhận +{m.xpReward} XP
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Lab Workbench Container */}
        <AnimatePresence mode="wait">
          {activeTab === 'chem' && (
            <motion.div
              key="chem-lab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <ChemistryLab onAchieve={onChemAchieve} />
                <PhetSimLibrary subject="chem" />
              </div>
            </motion.div>
          )}

          {activeTab === 'physics' && (
            <motion.div
              key="physics-lab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <CircuitLab onAchieve={onPhysicsAchieve} />
                <PhetSimLibrary subject="physics" />
              </div>
            </motion.div>
          )}

          {activeTab === 'bio' && (
            <motion.div
              key="bio-lab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <MicroscopeLab onAchieve={onBioAchieve} />
                <PhetSimLibrary subject="bio" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
