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
  Sparkles,
  Medal,
  Check,
  Lock,
  LogOut,
  LogIn,
  UserCheck,
  Vibrate,
  Compass,
  ShieldCheck,
  Copy,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { useUserStore } from '@/features/gamification/useUserStore';
import { Button, Streak, XPBadge, Heart, GemBadge, Mascot, type MascotState, ThemeToggle } from '@/design-system';
import { ACHIEVEMENTS } from '@/config/achievements';
import { getLevelInfo, GAMIFICATION } from '@/config/gamification';
import { sound } from '@/lib/audio';
import { haptic } from '@/lib/haptic';
import { WelcomeOnboardingTour } from '@/features/onboarding';
import { assetUrl } from '@/lib/utils';

interface AchievementMeta {
  tier: 'bronze' | 'silver' | 'gold' | 'diamond' | 'emerald' | 'ruby' | 'amethyst' | 'mythic';
  tierLabel: string;
  icon: React.ElementType;
  image?: string;
  badgeClass: string;
  tierColor: string;
}

const ACHIEVEMENT_METAS: Record<string, AchievementMeta> = {
  'first-lesson': {
    tier: 'bronze',
    tierLabel: 'Huy Chương Đồng',
    icon: Rocket,
    image: '/assets/icons/achievement-first-lesson.png',
    badgeClass: 'bg-[var(--gold-subtle)] text-[var(--gold-fg)] border-[var(--gold)] shadow-[0_3px_0_0_var(--gold-shade)]',
    tierColor: 'text-[var(--gold-fg)]',
  },
  'streak-3': {
    tier: 'silver',
    tierLabel: 'Huy Chương Bạc',
    icon: Zap,
    image: '/assets/icons/achievement-streak-3.png',
    badgeClass: 'bg-[var(--slate-subtle)] text-[var(--slate-fg)] border-[var(--slate)] shadow-[0_3px_0_0_var(--border-strong)]',
    tierColor: 'text-[var(--slate-fg)]',
  },
  'combo-master': {
    tier: 'gold',
    tierLabel: 'Huy Chương Vàng',
    icon: Flame,
    image: '/assets/icons/achievement-combo-master.png',
    badgeClass: 'bg-[var(--gold)] text-[var(--on-ink)] border-[var(--gold-shade)] shadow-[0_3px_0_0_var(--gold-shade)]',
    tierColor: 'text-[var(--gold-fg)]',
  },
  'perfect-run': {
    tier: 'diamond',
    tierLabel: 'Kim Cương Hoàn Hảo',
    icon: Gem,
    image: '/assets/icons/achievement-perfect-run.png',
    badgeClass: 'bg-[var(--chem)] text-[var(--on-chem)] border-[var(--chem-shade)] shadow-[0_3px_0_0_var(--chem-shade)]',
    tierColor: 'text-[var(--chem-fg)]',
  },
  'mol-warrior': {
    tier: 'emerald',
    tierLabel: 'Ngọc Lục Chiến Binh',
    icon: Scale,
    image: '/assets/icons/achievement-mol-warrior.png',
    badgeClass: 'bg-[var(--bio)] text-[var(--on-bio)] border-[var(--bio-shade)] shadow-[0_3px_0_0_var(--bio-shade)]',
    tierColor: 'text-[var(--bio-fg)]',
  },
  'equation-hunter': {
    tier: 'ruby',
    tierLabel: 'Hồng Ngọc Cân Bằng',
    icon: Target,
    image: '/assets/icons/achievement-equation-hunter.png',
    badgeClass: 'bg-[var(--err)] text-[var(--on-err)] border-[var(--err-shade)] shadow-[0_3px_0_0_var(--err-shade)]',
    tierColor: 'text-[var(--err-fg)]',
  },
  'acid-base-expert': {
    tier: 'amethyst',
    tierLabel: 'Thạch Anh Chuyên Gia',
    icon: FlaskConical,
    image: '/assets/icons/achievement-acid-base-expert.png',
    badgeClass: 'bg-[var(--phy)] text-[var(--on-phy)] border-[var(--phy-shade)] shadow-[0_3px_0_0_var(--phy-shade)]',
    tierColor: 'text-[var(--phy-fg)]',
  },
  'level-5': {
    tier: 'mythic',
    tierLabel: 'Vương Miện Huyền Thoại',
    icon: Crown,
    image: '/assets/icons/achievement-level-5.png',
    badgeClass: 'bg-[var(--warn)] text-[var(--on-ink)] border-[var(--warn-shade)] shadow-[0_3px_0_0_var(--warn-shade)]',
    tierColor: 'text-[var(--warn-fg)]',
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

  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [reducedMotion, setReducedMotion] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(haptic.isEnabled());
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
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

  const handleCopyBackupCode = async () => {
    sound.playClick();
    try {
      const jsonStr = await exportData();
      await navigator.clipboard.writeText(jsonStr);
      setImportStatus('success');
      setTimeout(() => setImportStatus('idle'), 3000);
    } catch {
      handleExport();
    }
  };

  const handlePasteBackupCode = async () => {
    sound.playClick();
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        const manual = prompt('Dán chuỗi mã sao lưu tiến trình của bạn vào đây:');
        if (!manual) return;
        const ok = await importData(manual);
        if (ok) {
          sound.playCorrect();
          setImportStatus('success');
          setTimeout(() => setImportStatus('idle'), 3000);
        } else {
          sound.playWrong();
          setImportStatus('error');
          setTimeout(() => setImportStatus('idle'), 3000);
        }
        return;
      }
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
      const manual = prompt('Dán chuỗi mã sao lưu tiến trình của bạn vào đây:');
      if (!manual) return;
      const ok = await importData(manual);
      if (ok) {
        sound.playCorrect();
        setImportStatus('success');
        setTimeout(() => setImportStatus('idle'), 3000);
      } else {
        sound.playWrong();
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 3000);
      }
    }
  };

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
      {/* 0. Account Status & Sync Banner */}
      {isAuthenticated && user ? (
        <div className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--ok)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--ok-subtle)] border border-[var(--ok)] flex items-center justify-center text-[var(--ok-fg)] font-bold shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-[var(--fg-default)]">{user.displayName || 'Nhà Khoa Học'}</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[var(--ok-subtle)] text-[var(--ok-fg)] border border-[var(--ok)]">
                  {user.provider === 'google' ? 'Google' : user.provider === 'facebook' ? 'Facebook' : user.provider === 'github' ? 'GitHub' : 'Đã xác thực'}
                </span>
              </div>
              <span className="text-xs text-[var(--fg-muted)] font-medium">{user.email}</span>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              logout();
            }}
            className="px-3.5 py-2 rounded-xl bg-[var(--bg-muted)] hover:bg-[var(--err-subtle)] hover:border-[var(--err)] border border-[var(--border)] text-xs font-bold text-[var(--fg-muted)] hover:text-[var(--err-fg)] flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer active:translate-y-0.5"
            title="Đăng xuất khỏi tài khoản"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--chem)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[var(--chem-subtle)] border border-[var(--chem)] flex items-center justify-center text-[var(--chem-fg)] shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-[var(--fg-default)]">Chế độ Học viên Tự do (Guest)</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[var(--warn-subtle)] text-[var(--warn-fg)] border border-[var(--warn)]">
                  Chưa đăng nhập
                </span>
              </div>
              <p className="text-xs text-[var(--fg-muted)] font-medium mt-0.5">
                Đăng nhập để đồng bộ tiến trình học, lưu huy chương và thi đua cùng bạn bè!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              navigate('/auth');
            }}
            className="px-4 py-2.5 rounded-2xl bg-[var(--chem)] hover:bg-[var(--chem-hover)] text-[var(--on-chem)] text-xs font-black flex items-center justify-center gap-2 transition-all shadow-[0_3px_0_0_var(--chem-shade)] active:translate-y-[2px] active:shadow-none cursor-pointer shrink-0"
          >
            <LogIn className="w-4 h-4" />
            <span>ĐĂNG NHẬP / ĐĂNG KÝ</span>
          </button>
        </div>
      )}

      {/* 1. Profile Header */}
      <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0 p-1">
            <Mascot state={avatarState} size="sm" interactive={false} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-[var(--chem-subtle)] text-[var(--chem-fg)] font-extrabold text-[10px] uppercase tracking-wider mb-1 border border-[var(--border)]">
              Cấp {levelInfo.level} · Nhà Hóa Học Chem-Solve
            </div>
            <h1 className="text-lg font-black text-[var(--fg-default)] truncate">
              {isAuthenticated && user?.displayName ? user.displayName : 'Học viên xuất sắc'}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <Streak days={streak} />
              <XPBadge amount={xp} />
              <GemBadge amount={gems} />
              <Heart count={hearts} max={GAMIFICATION.hearts.max} />
              <span className="inline-flex items-center gap-1.5 text-[var(--fg-default)] font-black text-xs bg-[var(--bg-canvas)] border border-[var(--border)] px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--ok-fg)]" />
                <span>{totalCompletedCount} chặng đã qua</span>
              </span>
            </div>
          </div>
        </div>

        {/* Mascot Avatar Mood Selector */}
        <div className="pt-3 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-[var(--fg-muted)]">Tâm trạng Mascot đại diện:</span>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {AVATAR_STATES.map(({ state, label }) => (
              <button
                key={state}
                onClick={() => {
                  sound.playClick();
                  setAvatarState(state);
                }}
                className={`px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer border ${
                  avatarState === state
                    ? 'bg-[var(--chem-subtle)] border-[var(--chem)] text-[var(--chem-fg)]'
                    : 'bg-[var(--bg-canvas)] border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg-default)]'
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
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-[var(--fg-muted)]">
            Tiến độ lên Cấp {levelInfo.level + 1}
          </span>
          <span className="text-[var(--chem-fg)] font-mono">
            {levelInfo.currentLevelXp}/{levelInfo.nextLevelXp} XP
          </span>
        </div>
        <div className="w-full bg-[var(--bg-canvas)] h-3.5 rounded-full overflow-hidden border border-[var(--border)]">
          <div
            className="bg-[var(--chem)] h-full rounded-full transition-all duration-700 relative"
            style={{ width: `${Math.max(5, levelInfo.progressPercent)}%` }}
          />
        </div>
      </div>

      {/* 3. Daily Goal Setting */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black text-[var(--fg-default)]">
            <Target className="w-4 h-4 text-[var(--warn-fg)]" />
            <span>Mục tiêu học mỗi ngày</span>
          </div>
          <span className="text-xs font-bold text-[var(--warn-fg)] font-mono">
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
                  ? 'bg-[var(--warn)] text-[var(--on-ink)] border-[var(--warn-shade)] shadow-[0_3px_0_0_var(--warn-shade)] active:translate-y-[2px] active:shadow-none'
                  : 'bg-[var(--bg-canvas)] text-[var(--fg-muted)] border-[var(--border)] hover:text-[var(--fg-default)]'
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
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[var(--fg-muted)] flex items-center gap-1.5">
            <Medal className="w-4 h-4 text-[var(--gold-fg)]" />
            Bảng Thành tựu Vinh danh ({unlockedAchCount}/{ACHIEVEMENTS.length})
          </h2>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-[var(--bg-canvas)] p-1 rounded-xl border border-[var(--border)] self-start sm:self-auto">
            <button
              onClick={() => {
                sound.playClick();
                setAchFilter('all');
              }}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                achFilter === 'all'
                  ? 'bg-[var(--gold-subtle)] text-[var(--gold-fg)] border border-[var(--gold)]'
                  : 'text-[var(--fg-muted)] hover:text-[var(--fg-default)]'
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
                  ? 'bg-[var(--ok-subtle)] text-[var(--ok-fg)] border border-[var(--ok)]'
                  : 'text-[var(--fg-muted)] hover:text-[var(--fg-default)]'
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
                  ? 'bg-[var(--chem-subtle)] text-[var(--chem-fg)] border border-[var(--chem)]'
                  : 'text-[var(--fg-muted)] hover:text-[var(--fg-default)]'
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
              badgeClass: 'bg-[var(--gold)] text-[var(--on-ink)] border-[var(--gold-shade)] shadow-[0_3px_0_0_var(--gold-shade)]',
              tierColor: 'text-[var(--gold-fg)]',
            };
            const AchIcon = meta.icon;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-3xl border flex flex-col justify-between gap-3 transition-all relative overflow-hidden group select-none ${
                  isUnlocked
                    ? 'bg-[var(--bg-surface)] border-[var(--gold)]'
                    : 'bg-[var(--bg-surface)]/85 border-[var(--border)]'
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
                      className={`w-13 h-13 rounded-2xl flex items-center justify-center relative transition-transform group-hover:scale-105 active:scale-95 cursor-pointer border shrink-0 overflow-hidden ${
                        isUnlocked
                          ? meta.badgeClass
                          : percent > 0
                          ? 'bg-[var(--chem-subtle)] border-[var(--border)] text-[var(--chem-fg)]'
                          : 'bg-[var(--bg-muted)] border-[var(--border)] text-[var(--fg-subtle)]'
                      }`}
                    >
                      {meta.image ? (
                        <img
                          src={assetUrl(meta.image)}
                          alt={ach.title}
                          className={`w-full h-full object-cover select-none pointer-events-none transition-all ${
                            isUnlocked
                              ? 'filter-none drop-shadow-md'
                              : 'grayscale opacity-40 contrast-75'
                          }`}
                        />
                      ) : (
                        <AchIcon className="w-6 h-6 stroke-[2.2]" />
                      )}
                      {isUnlocked ? (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--ok)] border-2 border-[var(--bg-surface)] flex items-center justify-center text-[var(--on-ok)] shadow-sm z-10">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      ) : percent === 0 ? (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[var(--bg-canvas)] border border-[var(--border)] flex items-center justify-center text-[var(--fg-subtle)] z-10">
                          <Lock className="w-2.5 h-2.5" />
                        </div>
                      ) : null}
                    </button>

                    <div>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider block ${
                          isUnlocked ? meta.tierColor : 'text-[var(--fg-muted)]'
                        }`}
                      >
                        {meta.tierLabel}
                      </span>
                      <h3
                        className={`text-sm font-black leading-snug ${
                          isUnlocked ? 'text-[var(--fg-default)]' : 'text-[var(--fg-muted)]'
                        }`}
                      >
                        {ach.title}
                      </h3>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-[var(--gold-fg)] bg-[var(--gold-subtle)] border border-[var(--gold)] px-2.5 py-1 rounded-full shrink-0">
                      <Sparkles className="w-3 h-3 text-[var(--gold-fg)]" />
                      <span>ĐÃ ĐẠT</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-black text-[var(--fg-muted)] bg-[var(--bg-canvas)] border border-[var(--border)] px-2.5 py-1 rounded-full shrink-0">
                      {currentProgress}/{ach.maxProgress}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[var(--fg-muted)] leading-relaxed font-medium">
                  {ach.description}
                </p>

                {/* Tactile Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-[var(--fg-muted)]">
                      {isUnlocked
                        ? 'Hoàn thành tuyệt đối'
                        : percent > 0
                        ? `Đang tiến hành (${currentProgress}/${ach.maxProgress})`
                        : 'Chưa bắt đầu'}
                    </span>
                    <span className={isUnlocked ? 'text-[var(--gold-fg)] font-black' : 'text-[var(--fg-muted)]'}>
                      {percent}%
                    </span>
                  </div>
                  <div className="w-full bg-[var(--bg-canvas)] h-2.5 rounded-full overflow-hidden border border-[var(--border)] p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked
                          ? 'bg-[var(--gold)]'
                          : percent > 0
                          ? 'bg-[var(--chem)]'
                          : 'bg-[var(--bg-muted)]'
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
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-[var(--fg-muted)] px-1 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-[var(--chem-fg)]" />
          Cài đặt & Dữ liệu
        </h2>
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)]">
          {/* Light / Dark Theme Mode Toggle */}
          <ThemeToggle variant="switch" />

          {/* Sound toggle */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[var(--chem-fg)]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[var(--fg-subtle)]" />
              )}
              <span className="text-xs font-semibold text-[var(--fg-default)]">
                Âm thanh hiệu ứng
              </span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                toggleSound();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer border ${
                soundEnabled ? 'bg-[var(--chem)] border-[var(--chem-shade)]' : 'bg-[var(--bg-canvas)] border-[var(--border)]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-[var(--fg-default)] absolute top-0.5 transition-all ${
                  soundEnabled ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Haptic Vibration Toggle (Milestone M14) */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Vibrate className={`w-4 h-4 ${hapticEnabled ? 'text-[var(--warn-fg)]' : 'text-[var(--fg-subtle)]'}`} />
              <div>
                <div className="text-xs font-semibold text-[var(--fg-default)]">
                  Rung phản hồi xúc giác (Haptic)
                </div>
                <div className="text-[11px] text-[var(--fg-muted)]">
                  Rung nhẹ khi nhấn nút và làm bài trên điện thoại
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                const nextVal = !hapticEnabled;
                setHapticEnabled(nextVal);
                haptic.setEnabled(nextVal);
                if (nextVal) {
                  haptic.correct();
                }
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer border ${
                hapticEnabled ? 'bg-[var(--warn)] border-[var(--warn-shade)]' : 'bg-[var(--bg-canvas)] border-[var(--border)]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-[var(--fg-default)] absolute top-0.5 transition-all ${
                  hapticEnabled ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion toggle */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-[var(--fg-subtle)]" />
              <span className="text-xs font-semibold text-[var(--fg-default)]">
                Giảm hiệu ứng rung lắc
              </span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                haptic.tap();
                setReducedMotion(!reducedMotion);
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer border ${
                reducedMotion ? 'bg-[var(--chem)] border-[var(--chem-shade)]' : 'bg-[var(--bg-canvas)] border-[var(--border)]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-[var(--fg-default)] absolute top-0.5 transition-all ${
                  reducedMotion ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Re-open Onboarding Tour from A-Z */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-[var(--chem-fg)]" />
              <div>
                <div className="text-xs font-semibold text-[var(--fg-default)]">
                  Hướng dẫn tân thủ (Tour A-Z)
                </div>
                <div className="text-[11px] text-[var(--fg-muted)]">
                  Xem lại cách chọn môn, mở nốt, hồi tim và quà khởi nghiệp
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                sound.playClick();
                haptic.tap();
                setShowOnboardingModal(true);
              }}
              className="text-xs shrink-0"
            >
              <span>Xem lại</span>
            </Button>
          </div>

          {/* Export / Import & 3-Layer Persistent Backup Section */}
          <div className="p-3.5 space-y-3">
            {/* 3-Tier Protection Status Card */}
            <div className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border)] text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-black text-[var(--ok-fg)]">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[var(--ok-fg)]" />
                <span>Bảo vệ tiến trình 3 lớp: Cookies + LocalStorage + IndexedDB</span>
              </div>
              <p className="text-[11px] text-[var(--fg-muted)] leading-relaxed">
                Dữ liệu bài học và đăng nhập được lưu song song trên Cookies (365 ngày), Bộ nhớ cục bộ và Cơ sở dữ liệu PWA. Khi web cập nhật phiên bản mới, tiến trình sẽ tự động khôi phục.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="surface"
                size="sm"
                onClick={handleCopyBackupCode}
                className="flex items-center justify-center gap-1.5 text-xs"
                title="Sao chép toàn bộ mã tiến trình vào bộ nhớ tạm"
              >
                <Copy className="w-3.5 h-3.5 text-[var(--chem-fg)]" />
                <span>Chép mã sao lưu</span>
              </Button>

              <Button
                variant="surface"
                size="sm"
                onClick={handlePasteBackupCode}
                className="flex items-center justify-center gap-1.5 text-xs"
                title="Dán mã sao lưu để khôi phục tiến trình"
              >
                <Upload className="w-3.5 h-3.5 text-[var(--chem-fg)]" />
                <span>Dán mã khôi phục</span>
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={handleExport}
                className="flex items-center justify-center gap-1.5 text-xs"
              >
                <Download className="w-3.5 h-3.5 text-[var(--fg-muted)]" />
                <span>Tải tệp JSON</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 text-xs"
              >
                <Upload className="w-3.5 h-3.5 text-[var(--fg-muted)]" />
                <span>Mở tệp JSON</span>
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
              <div className="p-2.5 rounded-xl bg-[var(--ok-subtle)] border border-[var(--ok)] text-[var(--ok-fg)] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Đã sao lưu / khôi phục tiến trình học tập thành công!</span>
              </div>
            )}
            {importStatus === 'error' && (
              <div className="p-2.5 rounded-xl bg-[var(--err-subtle)] border border-[var(--err)] text-[var(--err-fg)] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Mã hoặc tệp dữ liệu không hợp lệ. Vui lòng thử lại.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Welcome Onboarding Tour Modal */}
      <WelcomeOnboardingTour
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
      />
    </div>
  );
};
