import React, { useRef, useState } from 'react';
import { Award, Volume2, VolumeX, Eye, Download, Upload, Target, CheckCircle2, AlertCircle } from 'lucide-react';
import { useUserStore } from '@/features/gamification/useUserStore';
import { Button, Card, Streak, XPBadge, Heart, GemBadge } from '@/design-system';
import { ACHIEVEMENTS } from '@/config/achievements';
import { getLevelInfo, GAMIFICATION } from '@/config/gamification';
import { sound } from '@/lib/audio';

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

  const [avatar, setAvatar] = useState('🧪');
  const AVATARS = ['🧪', '⚗️', '🔬', '🧬', '⚛️', '🔥'];

  return (
    <div className="space-y-5 pb-8">
      {/* 1. Profile Header */}
      <Card className="bg-gradient-to-br from-cyan-950/50 via-slate-900 to-slate-900 border-cyan-800/40 space-y-3">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-3xl shadow-[0_4px_0_0_#0891b2] shrink-0">
            {avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-[10px] uppercase tracking-wider mb-1 border border-cyan-500/30">
              Cấp {levelInfo.level} · Nhà Hóa Học Chem-Solve
            </div>
            <h1 className="text-lg font-black text-slate-100 truncate">Học viên xuất sắc</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <Streak days={streak} />
              <XPBadge amount={xp} />
              <GemBadge amount={gems} />
              <Heart count={hearts} max={GAMIFICATION.hearts.max} />
              <span className="inline-flex items-center gap-1 text-slate-300 font-black text-xs bg-slate-800/80 border border-slate-700/80 px-2.5 py-1 rounded-full shadow-[0_2px_0_0_#1e293b]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{totalCompletedCount} chặng đã qua</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Avatar Selector */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400">Chọn huy hiệu đại diện:</span>
          <div className="flex gap-1.5">
            {AVATARS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  sound.playClick();
                  setAvatar(emoji);
                }}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-base transition-all cursor-pointer border ${
                  avatar === emoji
                    ? 'bg-cyan-500/30 border-cyan-400 scale-110'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* 2. Level Progress */}
      <Card className="space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-300">
            Tiến độ lên Cấp {levelInfo.level + 1}
          </span>
          <span className="text-cyan-400">
            {levelInfo.currentLevelXp}/{levelInfo.nextLevelXp} XP
          </span>
        </div>
        <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-700 relative"
            style={{ width: `${Math.max(5, levelInfo.progressPercent)}%` }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/40 rounded-full" />
          </div>
        </div>
      </Card>

      {/* 3. Daily Goal Setting */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black text-slate-200">
            <Target className="w-4 h-4 text-amber-400" />
            <span>Mục tiêu học mỗi ngày</span>
          </div>
          <span className="text-xs font-bold text-amber-400 font-mono">
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
              className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                dailyGoal === g
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {g} XP
            </button>
          ))}
        </div>
      </Card>

      {/* 4. Achievements Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            Thành tựu Hóa học ({ACHIEVEMENTS.filter((a) => (achievements[a.id] ?? 0) >= a.maxProgress).length}/{ACHIEVEMENTS.length})
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {ACHIEVEMENTS.map((ach) => {
            const currentProgress = achievements[ach.id] ?? 0;
            const isUnlocked = currentProgress >= ach.maxProgress;
            const percent = Math.min(100, Math.round((currentProgress / ach.maxProgress) * 100));

            return (
              <div
                key={ach.id}
                className={`p-3 rounded-2xl border flex flex-col justify-between gap-2 transition-all ${
                  isUnlocked
                    ? 'bg-slate-900 border-amber-500/50 shadow-[0_3px_0_0_#b45309]'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{ach.icon}</span>
                  {isUnlocked && (
                    <span className="text-[10px] font-black text-amber-300 bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.2 rounded-md">
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
                    <span className={isUnlocked ? 'text-amber-400 font-black' : 'text-slate-400'}>
                      {currentProgress}/{ach.maxProgress} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked
                          ? 'bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                          : percent > 0
                          ? 'bg-gradient-to-r from-cyan-600 to-cyan-400'
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
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1">
          Cài đặt & Sao lưu tiến độ
        </h2>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800">
          {/* Sound toggle */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
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
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer border ${
                soundEnabled ? 'bg-cyan-500 border-cyan-400' : 'bg-slate-800 border-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 absolute top-0.5 transition-all ${
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
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer border ${
                reducedMotion ? 'bg-cyan-500 border-cyan-400' : 'bg-slate-800 border-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 absolute top-0.5 transition-all ${
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
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sao lưu dữ liệu</span>
              </Button>

              <Button
                variant="surface"
                size="sm"
                fullWidth
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
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
