import React, { useRef, useState } from 'react';
import {
  Award,
  Volume2,
  VolumeX,
  Eye,
  Download,
  Upload,
  Target,
  CheckCircle2,
  AlertCircle,
  Rocket,
  Gem,
  Scale,
  Flame,
  Zap,
  FlaskConical,
  Crown,
  Sliders,
} from 'lucide-react';
import { useUserStore } from '@/features/gamification/useUserStore';
import { Button, Streak, XPBadge, Heart, GemBadge, Mascot, type MascotState } from '@/design-system';
import { ACHIEVEMENTS } from '@/config/achievements';
import { getLevelInfo, GAMIFICATION } from '@/config/gamification';
import { sound } from '@/lib/audio';

const ACHIEVEMENT_ICONS: Record<
  string,
  { icon: React.ElementType; color: string; bg: string; border: string }
> = {
  'first-lesson': { icon: Rocket, color: 'text-[#38bdf8]', bg: 'bg-[#0ea5e9]/15', border: 'border-[#0ea5e9]/30' },
  'perfect-run': { icon: Gem, color: 'text-[#00cd9c]', bg: 'bg-[#00cd9c]/15', border: 'border-[#00cd9c]/30' },
  'mol-warrior': { icon: Scale, color: 'text-[#ce82ff]', bg: 'bg-[#ce82ff]/15', border: 'border-[#ce82ff]/30' },
  'combo-master': { icon: Flame, color: 'text-[#ff9600]', bg: 'bg-[#ff9600]/15', border: 'border-[#ff9600]/30' },
  'streak-3': { icon: Zap, color: 'text-[#ff9600]', bg: 'bg-[#ff9600]/15', border: 'border-[#ff9600]/30' },
  'equation-hunter': { icon: Target, color: 'text-[#ff4b4b]', bg: 'bg-[#ff4b4b]/15', border: 'border-[#ff4b4b]/30' },
  'acid-base-expert': { icon: FlaskConical, color: 'text-[#38bdf8]', bg: 'bg-[#0ea5e9]/15', border: 'border-[#0ea5e9]/30' },
  'level-5': { icon: Crown, color: 'text-[#ffc800]', bg: 'bg-[#ffc800]/15', border: 'border-[#ffc800]/30' },
};

const AVATAR_STATES: { state: MascotState; label: string }[] = [
  { state: 'happy', label: 'Vui vẻ' },
  { state: 'cheering', label: 'Cổ vũ' },
  { state: 'celebrating', label: 'Ăn mừng' },
  { state: 'thinking', label: 'Suy nghĩ' },
  { state: 'surprised', label: 'Kinh ngạc' },
  { state: 'idle', label: 'Tập trung' },
];

export const ProfilePage: React.FC = () => {
  const {
    xp,
    gems,
    streak,
    hearts,
    soundEnabled,
    toggleSound,
    dailyGoal,
    setDailyGoal,
    achievements,
    completedNodes,
    exportData,
    importData,
  } = useUserStore();

  const [reducedMotion, setReducedMotion] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [avatarState, setAvatarState] = useState<MascotState>('happy');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const levelInfo = getLevelInfo(xp);
  const totalCompletedCount = Object.keys(completedNodes || {}).filter((k) => completedNodes[k]).length;

  const handleExport = async () => {
    sound.playClick();
    const jsonStr = await exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chem-solve-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const success = await importData(text);
      if (success) {
        sound.playCorrect();
        setImportStatus('success');
        setTimeout(() => setImportStatus('idle'), 3000);
      } else {
        sound.playWrong();
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 3000);
      }
    } catch {
      sound.playWrong();
      setImportStatus('error');
      setTimeout(() => setImportStatus('idle'), 3000);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* 1. Profile Header */}
      <div className="p-5 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24] space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#131f24] border-2 border-[#0ea5e9]/40 shadow-[0_4px_0_0_#0284c7] flex items-center justify-center overflow-hidden shrink-0 p-1">
            <Mascot state={avatarState} size="sm" interactive={false} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#0ea5e9]/15 text-[#38bdf8] font-extrabold text-[10px] uppercase tracking-wider mb-1 border border-[#0ea5e9]/30">
              Cấp {levelInfo.level} · Nhà Hóa Học Chem-Solve
            </div>
            <h1 className="text-lg font-black text-slate-100 truncate">Học viên xuất sắc</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <Streak days={streak} />
              <XPBadge amount={xp} />
              <GemBadge amount={gems} />
              <Heart count={hearts} max={GAMIFICATION.hearts.max} />
              <span className="inline-flex items-center gap-1.5 text-slate-300 font-black text-xs bg-[#131f24] border-2 border-[#2e4756] px-2.5 py-1 rounded-full shadow-[0_2px_0_0_#131f24]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00cd9c]" />
                <span>{totalCompletedCount} chặng đã qua</span>
              </span>
            </div>
          </div>
        </div>

        {/* Mascot Avatar Mood Selector */}
        <div className="pt-3 border-t border-[#2e4756] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-400">Tâm trạng Mascot đại diện:</span>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {AVATAR_STATES.map(({ state, label }) => (
              <button
                key={state}
                onClick={() => {
                  sound.playClick();
                  setAvatarState(state);
                }}
                className={`px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer border-2 ${
                  avatarState === state
                    ? 'bg-[#0ea5e9]/20 border-[#38bdf8] text-[#38bdf8] shadow-[0_2px_0_0_#0284c7]'
                    : 'bg-[#131f24] border-[#2e4756] text-slate-400 hover:text-slate-200'
                }`}
                title={label}
              >
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Level Progress */}
      <div className="p-4 rounded-2xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24] space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-300">
            Tiến độ lên Cấp {levelInfo.level + 1}
          </span>
          <span className="text-[#38bdf8]">
            {levelInfo.currentLevelXp}/{levelInfo.nextLevelXp} XP
          </span>
        </div>
        <div className="w-full bg-[#131f24] h-3.5 rounded-full overflow-hidden border border-[#2e4756]">
          <div
            className="bg-gradient-to-r from-[#0ea5e9] to-[#00cd9c] h-full rounded-full transition-all duration-700 relative"
            style={{ width: `${Math.max(5, levelInfo.progressPercent)}%` }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/40 rounded-full" />
          </div>
        </div>
      </div>

      {/* 3. Daily Goal Setting */}
      <div className="p-4 rounded-2xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black text-slate-200">
            <Target className="w-4 h-4 text-[#ff9600]" />
            <span>Mục tiêu học mỗi ngày</span>
          </div>
          <span className="text-xs font-bold text-[#ff9600] font-mono">
            {dailyGoal} XP / ngày
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {GAMIFICATION.dailyGoals.map((g) => (
            <button
              key={g}
              onClick={() => {
                sound.playClick();
                setDailyGoal(g);
              }}
              className={`py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                dailyGoal === g
                  ? 'bg-[#ff9600]/20 text-[#ff9600] border-[#ff9600] shadow-[0_3px_0_0_#b36b00]'
                  : 'bg-[#131f24] text-slate-400 border-[#2e4756] hover:text-slate-200'
              }`}
            >
              {g} XP
            </button>
          ))}
        </div>
      </div>

      {/* 4. Achievements Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#ffc800]" />
            Thành tựu Hóa học ({ACHIEVEMENTS.filter((a) => (achievements[a.id] ?? 0) >= a.maxProgress).length}/{ACHIEVEMENTS.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((ach) => {
            const currentProgress = achievements[ach.id] ?? 0;
            const isUnlocked = currentProgress >= ach.maxProgress;
            const percent = Math.min(100, Math.round((currentProgress / ach.maxProgress) * 100));
            const achConfig = ACHIEVEMENT_ICONS[ach.id] || {
              icon: Award,
              color: 'text-[#ffc800]',
              bg: 'bg-[#ffc800]/15',
              border: 'border-[#ffc800]/30',
            };
            const AchIcon = achConfig.icon;

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border-2 flex flex-col justify-between gap-2.5 transition-all shadow-[0_3px_0_0_#131f24] ${
                  isUnlocked
                    ? 'bg-[#18272f] border-[#ffc800]/50'
                    : 'bg-[#18272f]/60 border-[#2e4756] opacity-75'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${
                      isUnlocked
                        ? `${achConfig.bg} ${achConfig.border} ${achConfig.color}`
                        : 'bg-[#131f24] border-[#2e4756] text-slate-500'
                    }`}
                  >
                    <AchIcon className="w-5 h-5" />
                  </div>
                  {isUnlocked && (
                    <span className="text-[10px] font-black text-[#ffc800] bg-[#ffc800]/15 border border-[#ffc800]/30 px-2 py-0.5 rounded-md">
                      ✓ Đạt
                    </span>
                  )}
                </div>

                <div>
                  <div className={`text-xs font-black leading-snug ${isUnlocked ? 'text-slate-100' : 'text-slate-400'}`}>
                    {ach.title}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                    {ach.description}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 mt-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-400">Tiến độ</span>
                    <span className={isUnlocked ? 'text-[#ffc800] font-black' : 'text-slate-400'}>
                      {currentProgress}/{ach.maxProgress} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#131f24] h-2 rounded-full overflow-hidden border border-[#2e4756]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked
                          ? 'bg-gradient-to-r from-[#ffc800] to-[#ff9600]'
                          : percent > 0
                          ? 'bg-gradient-to-r from-[#0ea5e9] to-[#00cd9c]'
                          : 'bg-slate-800'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Settings & Data Export / Import */}
      <div className="space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-cyan-400" />
          Cài đặt & Dữ liệu
        </h2>
        <div className="bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24] rounded-2xl divide-y divide-[#2e4756]">
          {/* Sound toggle */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#38bdf8]" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <span className="text-xs font-semibold text-slate-200">
                Âm thanh hiệu ứng
              </span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                toggleSound();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer border-2 ${
                soundEnabled ? 'bg-[#0ea5e9] border-[#38bdf8]' : 'bg-[#131f24] border-[#2e4756]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-100 absolute top-0.5 transition-all ${
                  soundEnabled ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion toggle */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-200">
                Giảm hiệu ứng rung lắc
              </span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setReducedMotion(!reducedMotion);
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer border-2 ${
                reducedMotion ? 'bg-[#0ea5e9] border-[#38bdf8]' : 'bg-[#131f24] border-[#2e4756]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-100 absolute top-0.5 transition-all ${
                  reducedMotion ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Export / Import Section */}
          <div className="p-3.5 space-y-2">
            <div className="flex gap-2">
              <Button
                variant="surface"
                size="sm"
                fullWidth
                onClick={handleExport}
                className="flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Sao lưu dữ liệu</span>
              </Button>

              <Button
                variant="surface"
                size="sm"
                fullWidth
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Khôi phục dữ liệu</span>
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportFile}
              />
            </div>

            {/* Import Status Alert */}
            {importStatus === 'success' && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã khôi phục tiến trình học tập thành công!</span>
              </div>
            )}
            {importStatus === 'error' && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Tệp dữ liệu không hợp lệ. Vui lòng kiểm tra lại.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
