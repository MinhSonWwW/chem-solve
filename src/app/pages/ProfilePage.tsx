import React, { useRef, useState, useMemo } from 'react';
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
  Lock,
  Check,
  Sparkles,
  Medal,
} from 'lucide-react';
import { useUserStore } from '@/features/gamification/useUserStore';
import { Button, Streak, XPBadge, Heart, GemBadge, Mascot, type MascotState } from '@/design-system';
import { ACHIEVEMENTS } from '@/config/achievements';
import { getLevelInfo, GAMIFICATION } from '@/config/gamification';
import { sound } from '@/lib/audio';

interface AchievementMeta {
  tier: 'bronze' | 'silver' | 'gold' | 'diamond' | 'emerald' | 'ruby' | 'amethyst' | 'mythic';
  tierLabel: string;
  icon: React.ElementType;
  gradient: string;
  border: string;
  shadow: string;
  textColor: string;
}

const ACHIEVEMENT_METAS: Record<string, AchievementMeta> = {
  'first-lesson': {
    tier: 'bronze',
    tierLabel: 'Huy Chương Đồng',
    icon: Rocket,
    gradient: 'from-amber-500 via-amber-600 to-amber-700',
    border: 'border-amber-300/80',
    shadow: '#78350f',
    textColor: 'text-amber-100',
  },
  'streak-3': {
    tier: 'silver',
    tierLabel: 'Huy Chương Bạc',
    icon: Zap,
    gradient: 'from-slate-100 via-slate-200 to-slate-400',
    border: 'border-white',
    shadow: '#475569',
    textColor: 'text-slate-900',
  },
  'combo-master': {
    tier: 'gold',
    tierLabel: 'Huy Chương Vàng',
    icon: Flame,
    gradient: 'from-amber-300 via-yellow-400 to-amber-500',
    border: 'border-yellow-100',
    shadow: '#b45309',
    textColor: 'text-amber-950',
  },
  'perfect-run': {
    tier: 'diamond',
    tierLabel: 'Kim Cương Hoàn Hảo',
    icon: Gem,
    gradient: 'from-cyan-200 via-sky-300 to-blue-500',
    border: 'border-cyan-100',
    shadow: '#0369a1',
    textColor: 'text-sky-950',
  },
  'mol-warrior': {
    tier: 'emerald',
    tierLabel: 'Ngọc Lục Chiến Binh',
    icon: Scale,
    gradient: 'from-emerald-300 via-emerald-400 to-teal-600',
    border: 'border-emerald-100',
    shadow: '#065f46',
    textColor: 'text-emerald-950',
  },
  'equation-hunter': {
    tier: 'ruby',
    tierLabel: 'Hồng Ngọc Cân Bằng',
    icon: Target,
    gradient: 'from-rose-300 via-rose-400 to-rose-600',
    border: 'border-rose-100',
    shadow: '#9f1239',
    textColor: 'text-rose-950',
  },
  'acid-base-expert': {
    tier: 'amethyst',
    tierLabel: 'Thạch Anh Chuyên Gia',
    icon: FlaskConical,
    gradient: 'from-purple-300 via-fuchsia-400 to-purple-600',
    border: 'border-purple-100',
    shadow: '#6b21a8',
    textColor: 'text-purple-950',
  },
  'level-5': {
    tier: 'mythic',
    tierLabel: 'Vương Miện Huyền Thoại',
    icon: Crown,
    gradient: 'from-yellow-200 via-amber-400 to-orange-500',
    border: 'border-yellow-100',
    shadow: '#9a3412',
    textColor: 'text-yellow-950',
  },
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
  const [achFilter, setAchFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const levelInfo = getLevelInfo(xp);
  const totalCompletedCount = Object.keys(completedNodes || {}).filter((k) => completedNodes[k]).length;

  const unlockedAchCount = ACHIEVEMENTS.filter((a) => (achievements[a.id] ?? 0) >= a.maxProgress).length;
  const inProgressAchCount = ACHIEVEMENTS.length - unlockedAchCount;

  const filteredAchievements = useMemo(() => {
    return ACHIEVEMENTS.filter((a) => {
      const isUnlocked = (achievements[a.id] ?? 0) >= a.maxProgress;
      if (achFilter === 'unlocked') return isUnlocked;
      if (achFilter === 'locked') return !isUnlocked;
      return true;
    });
  }, [achievements, achFilter]);

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Medal className="w-4 h-4 text-amber-400" />
            Bảng Thành tựu Vinh danh ({unlockedAchCount}/{ACHIEVEMENTS.length})
          </h2>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-[#131f24] p-1 rounded-xl border border-[#2e4756] self-start sm:self-auto">
            <button
              onClick={() => {
                sound.playClick();
                setAchFilter('all');
              }}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                achFilter === 'all'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tất cả ({ACHIEVEMENTS.length})
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setAchFilter('unlocked');
              }}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                achFilter === 'unlocked'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Đã mở ({unlockedAchCount})
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setAchFilter('locked');
              }}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                achFilter === 'locked'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Chưa mở ({inProgressAchCount})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredAchievements.map((ach) => {
            const currentProgress = achievements[ach.id] ?? 0;
            const isUnlocked = currentProgress >= ach.maxProgress;
            const percent = Math.min(100, Math.round((currentProgress / ach.maxProgress) * 100));
            const meta = ACHIEVEMENT_METAS[ach.id] || {
              tier: 'gold',
              tierLabel: 'Huy Chương Vàng',
              icon: Award,
              gradient: 'from-amber-300 via-yellow-400 to-amber-500',
              border: 'border-yellow-100',
              shadow: '#b45309',
              textColor: 'text-amber-950',
            };
            const AchIcon = meta.icon;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-3xl border-2 flex flex-col justify-between gap-3 transition-all relative overflow-hidden group select-none ${
                  isUnlocked
                    ? 'bg-[#182a35] border-amber-500/40 shadow-[0_4px_0_0_#0f1c24] hover:border-amber-400/80'
                    : 'bg-[#142028]/85 border-[#253946] shadow-[0_4px_0_0_#0d151a]'
                }`}
              >
                {/* Header row: Medallion + Status pill */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* 3D Tactile Medallion Badge */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isUnlocked) {
                          sound.playLevelUp();
                        } else {
                          sound.playClick();
                        }
                      }}
                      title={isUnlocked ? 'Nhấn để nghe âm thanh vinh danh!' : `${currentProgress}/${ach.maxProgress}`}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center relative transition-transform group-hover:scale-105 active:scale-95 cursor-pointer border-2 shrink-0 ${
                        isUnlocked
                          ? `bg-gradient-to-b ${meta.gradient} ${meta.border} ${meta.textColor} shadow-[0_4px_0_0_${meta.shadow},inset_0_1.5px_0_rgba(255,255,255,0.7)]`
                          : percent > 0
                          ? 'bg-[#172731] border-[#385669] text-sky-400 shadow-[0_4px_0_0_#0e1920]'
                          : 'bg-[#121b21] border-[#253946] text-slate-500 shadow-[0_4px_0_0_#0a1014]'
                      }`}
                    >
                      <AchIcon className="w-6 h-6 stroke-[2.2]" />
                      {isUnlocked ? (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#182a35] flex items-center justify-center text-white shadow-sm">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      ) : percent === 0 ? (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400">
                          <Lock className="w-2.5 h-2.5" />
                        </div>
                      ) : null}
                    </button>

                    <div>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider block ${
                          isUnlocked ? 'text-amber-400' : 'text-slate-400'
                        }`}
                      >
                        {meta.tierLabel}
                      </span>
                      <h3
                        className={`text-sm font-black leading-snug ${
                          isUnlocked ? 'text-slate-100' : 'text-slate-300'
                        }`}
                      >
                        {ach.title}
                      </h3>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-full shadow-sm shrink-0">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>ĐÃ ĐẠT</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-black text-slate-400 bg-slate-800/60 border border-slate-700/60 px-2.5 py-1 rounded-full shrink-0">
                      {currentProgress}/{ach.maxProgress}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {ach.description}
                </p>

                {/* Tactile Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-400">
                      {isUnlocked
                        ? 'Hoàn thành tuyệt đối'
                        : percent > 0
                        ? `Đang tiến hành (${currentProgress}/${ach.maxProgress})`
                        : 'Chưa bắt đầu'}
                    </span>
                    <span className={isUnlocked ? 'text-amber-400 font-black' : 'text-slate-400'}>
                      {percent}%
                    </span>
                  </div>
                  <div className="w-full bg-[#0d161c] h-2.5 rounded-full overflow-hidden border border-[#233541] p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] ${
                        isUnlocked
                          ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500'
                          : percent > 0
                          ? 'bg-gradient-to-r from-cyan-400 to-emerald-400'
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
