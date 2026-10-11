import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  FlaskConical,
  Zap,
  Award,
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react';
import { ChemistryLab } from './components/ChemistryLab';
import { CircuitLab } from './components/CircuitLab';
import { MicroscopeLab } from './components/MicroscopeLab';
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

  // Determine initial subject from URL params or global subject
  const initialSubject: LabSubject = (searchParams.get('tab') as LabSubject) ||
    (activeGlobalSubject === 'physics' ? 'physics' : activeGlobalSubject === 'bio' ? 'bio' : 'chem');

  const [activeTab, setActiveTab] = useState<LabSubject>(initialSubject);
  const [completedMissions, setCompletedMissions] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('chem_lab_completed_missions') || '[]');
    } catch {
      return [];
    }
  });

  const missions: LabMission[] = [
    {
      id: 'mission-chem-1',
      subject: 'chem',
      title: 'Phản ứng sủi bọt khí H₂',
      desc: 'Cho kim loại Kẽm (Zn) tác dụng với axit clohiđric (HCl) trong ống nghiệm.',
      xpReward: 25,
      completed: completedMissions.includes('mission-chem-1'),
    },
    {
      id: 'mission-phy-1',
      subject: 'physics',
      title: 'Thắp sáng bóng đèn',
      desc: 'Lắp nguồn Pin và Công tắc đóng để làm bóng đèn sợi đốt phát sáng.',
      xpReward: 25,
      completed: completedMissions.includes('mission-phy-1'),
    },
    {
      id: 'mission-bio-1',
      subject: 'bio',
      title: 'Soi nét tế bào vảy hành',
      desc: 'Điều chỉnh ốc vi cấp của kính hiển vi đạt độ nét 100% để quan sát nhân tế bào.',
      xpReward: 25,
      completed: completedMissions.includes('mission-bio-1'),
    },
  ];

  const handleTabChange = (tab: LabSubject) => {
    sound.playClick();
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleClaimReward = (missionId: string, xpReward: number) => {
    sound.playLevelUp();
    addXp(xpReward);
    const updated = [...completedMissions, missionId];
    setCompletedMissions(updated);
    localStorage.setItem('chem_lab_completed_missions', JSON.stringify(updated));
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-white">
      {/* Top Title & Tab Switcher Bar */}
      <div className="p-3 sm:p-4 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#101a1f] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              navigate(-1);
            }}
            className="w-10 h-10 rounded-2xl bg-[#20333d] hover:bg-[#28404e] border-2 border-[#2e4756] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-[0_2px_0_0_#101a1f] active:translate-y-[2px] active:shadow-none shrink-0"
            title="Quay lại"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-wide">
                Phòng Thí Nghiệm Ảo
              </h1>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950">
                M10 LAB
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Mô phỏng trực quan 3 môn KHTN: Hóa học · Vật lý · Sinh học
            </p>
          </div>
        </div>

        {/* Subject Tab Selector Buttons */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1.5 p-1 rounded-2xl bg-[#131f24] border-2 border-[#20333d]">
          <button
            onClick={() => handleTabChange('chem')}
            className={`py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'chem'
                ? 'bg-sky-500 text-white shadow-[0_3px_0_0_#0284c7]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Hóa Học</span>
          </button>

          <button
            onClick={() => handleTabChange('physics')}
            className={`py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'physics'
                ? 'bg-amber-500 text-slate-950 shadow-[0_3px_0_0_#ca8a04]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Vật Lý</span>
          </button>

          <button
            onClick={() => handleTabChange('bio')}
            className={`py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'bio'
                ? 'bg-emerald-500 text-white shadow-[0_3px_0_0_#059669]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-sm">🌿</span>
            <span>Sinh Học</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Missions Carousel Bar */}
        <div className="p-3.5 rounded-2xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_3px_0_0_#101a1f] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Nhiệm Vụ Thực Hành Phòng Lab
            </span>
            <span className="text-[10px] font-bold text-slate-400">
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
                      ? 'bg-[#20333d] border-[#3b596d]'
                      : 'bg-[#18272f]/60 border-[#253945] opacity-75'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-black text-white">{m.title}</span>
                      <span className="text-[10px] font-black text-amber-400 flex items-center gap-0.5">
                        +{m.xpReward} XP
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{m.desc}</p>
                  </div>

                  <div className="mt-2 text-right">
                    {isClaimed ? (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Đã nhận thưởng
                      </span>
                    ) : (
                      <button
                        onClick={() => handleClaimReward(m.id, m.xpReward)}
                        className="px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] transition-transform active:scale-95 cursor-pointer shadow-[0_2px_0_0_#ca8a04]"
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
              <ChemistryLab />
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
              <CircuitLab />
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
              <MicroscopeLab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
