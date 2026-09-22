import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Sparkles,
  BookOpen,
  Zap,
  Calculator,
  Scale,
  Beaker,
  Flame,
  Lock,
  CheckCircle2,
  ArrowRight,
  Gamepad2,
  Layers,
  CheckSquare,
  Split,
  ArrowUpDown,
  Trophy,
  RotateCcw,
  FlaskConical,
} from 'lucide-react';
import { sound } from '@/lib/audio';
import { assetUrl } from '@/lib/utils';
import { getCurriculum, type Grade } from '@/content/curriculum';
import { useUserStore } from '@/features/gamification/useUserStore';
import { Mascot, Button } from '@/design-system';

interface LockModalInfo {
  isOpen: boolean;
  title: string;
  badge: string;
  description: string;
  requiredLessonName?: string;
  targetGrade: number;
  actionLabel?: string;
}

interface GameDef {
  id: string;
  name: string;
  desc: string;
  skill: string;
  grades: Grade[]; // Which grades this game belongs to
  icon: React.ElementType;
  color: string;
  borderAccent: string;
  requiredLessonId?: string;
  requiredLessonName?: string;
  requiredGrade?: Grade;
}

const MINIGAMES: GameDef[] = [
  {
    id: 'match',
    name: 'Ghép đôi chất & loại',
    desc: 'HCl ↔ Acid, NaOH ↔ Base, CO2 ↔ Oxide...',
    skill: 'Nhận diện chất & loại hợp chất',
    grades: [8, 9],
    icon: Layers,
    color: 'from-blue-500/20 to-cyan-500/20 text-cyan-400',
    borderAccent: 'hover:border-cyan-500/50',
    requiredLessonId: 'g8-b08',
    requiredLessonName: 'Bài 8: Acid',
    requiredGrade: 8,
  },
  {
    id: 'formula-builder',
    name: 'Ghép công thức (Formula Builder)',
    desc: 'Cân bằng điện tích ∑q = 0 để tạo công thức ion',
    skill: 'Hóa trị, điện tích & công thức',
    grades: [7, 8],
    icon: Split,
    color: 'from-violet-500/20 to-purple-500/20 text-violet-400',
    borderAccent: 'hover:border-violet-500/50',
    requiredLessonId: 'g7-b03',
    requiredLessonName: 'Bài 3: Hóa trị & CTHH',
    requiredGrade: 7,
  },
  {
    id: 'equation-balance',
    name: 'Cân bằng PTHH',
    desc: 'Điền hệ số cân bằng phản ứng hóa học nhanh',
    skill: 'Bảo toàn nguyên tố & PTHH',
    grades: [8, 9],
    icon: ArrowUpDown,
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400',
    borderAccent: 'hover:border-amber-500/50',
    requiredLessonId: 'g8-b02',
    requiredLessonName: 'Bài 2: Phản ứng hóa học',
    requiredGrade: 8,
  },
  {
    id: 'sort',
    name: 'Phân loại hợp chất',
    desc: 'Kéo/chọn chất vào 4 nhóm Axit, Bazơ, Oxide, Muối',
    skill: 'Phân loại hóa học vô cơ',
    grades: [8, 9],
    icon: Gamepad2,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400',
    borderAccent: 'hover:border-emerald-500/50',
    requiredLessonId: 'g8-b08',
    requiredLessonName: 'Bài 8: Acid và Bazơ',
    requiredGrade: 8,
  },
  {
    id: 'reaction-builder',
    name: 'Ráp phản ứng (Reaction Builder)',
    desc: 'Chọn chất tham gia và dự đoán sản phẩm phản ứng chính xác',
    skill: 'Phản ứng hóa học & Hiện tượng',
    grades: [8, 9],
    icon: FlaskConical,
    color: 'from-pink-500/20 to-rose-500/20 text-pink-400',
    borderAccent: 'hover:border-pink-500/50',
    requiredLessonId: 'g8-b06',
    requiredLessonName: 'Bài 6: Tính theo PTHH',
    requiredGrade: 8,
  },
  {
    id: 'true-false',
    name: 'Đúng hay Sai',
    desc: 'Phản xạ nhanh với nhận định Hóa học then chốt',
    skill: 'Kiến thức lý thuyết & hiện tượng',
    grades: [6, 7, 8, 9],
    icon: CheckSquare,
    color: 'from-rose-500/20 to-pink-500/20 text-rose-400',
    borderAccent: 'hover:border-rose-500/50',
    requiredLessonId: 'g8-b01',
    requiredLessonName: 'Bài 1: Mở đầu môn Hóa học',
    requiredGrade: 8,
  },
  {
    id: 'speed',
    name: 'Thử thách tốc độ (60s)',
    desc: 'Trả lời tối đa câu hỏi trắc nghiệm trong 60 giây',
    skill: 'Tốc độ phản xạ & tính toán',
    grades: [6, 7, 8, 9],
    icon: Flame,
    color: 'from-yellow-500/20 to-red-500/20 text-yellow-400',
    borderAccent: 'hover:border-yellow-500/50',
    requiredLessonId: 'g8-b01',
    requiredLessonName: 'Bài 1: Mở đầu môn Hóa học',
    requiredGrade: 8,
  },
  {
    id: 'review',
    name: 'Review Game (Ôn tập Leitner)',
    desc: 'Ôn các câu hỏi từng làm sai theo chu kỳ lặp lại ngắt quãng',
    skill: 'Ghi nhớ dài hạn Leitner',
    grades: [6, 7, 8, 9],
    icon: RotateCcw,
    color: 'from-indigo-500/20 to-blue-500/20 text-indigo-400',
    borderAccent: 'hover:border-indigo-500/50',
  },
];

const GENERATOR_TOPICS = [
  {
    id: 'gen-infinite',
    title: 'Đề tổng hợp toán hóa ngẫu nhiên',
    desc: 'Trộn đều 5 câu: Mol, Thể tích khí, Tỉ khối, Nồng độ & PTHH',
    icon: Zap,
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    badge: 'Vô hạn đề',
    requiredLessonId: 'g8-b06',
    requiredLessonName: 'Bài 6: Tính theo PTHH',
  },
  {
    id: 'gen-mol',
    title: 'Toán số Mol & Khối lượng',
    desc: 'Công thức n = m / M và m = n × M với các bẫy đảo mẫu số',
    icon: Calculator,
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
    badge: 'Cơ bản',
    requiredLessonId: 'g8-b03',
    requiredLessonName: 'Bài 3: Mol và tỉ khối chất khí',
  },
  {
    id: 'gen-gas',
    title: 'Thể tích khí ở ĐKC & Tỉ khối',
    desc: 'Áp dụng chuẩn mới 24,79 L/mol, tỉ khối d(A/B) và d(A/kk)',
    icon: Flame,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    badge: 'ĐKC 24,79L',
    requiredLessonId: 'g8-b03',
    requiredLessonName: 'Bài 3: Mol và tỉ khối chất khí',
  },
  {
    id: 'gen-solution',
    title: 'Dung dịch & Nồng độ (C%, CM)',
    desc: 'Nồng độ phần trăm, nồng độ mol và quy đổi thể tích dung dịch',
    icon: Beaker,
    color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
    badge: 'Dung dịch',
    requiredLessonId: 'g8-b04',
    requiredLessonName: 'Bài 4: Dung dịch và nồng độ',
  },
  {
    id: 'gen-stoich',
    title: 'Tính theo phương trình hóa học',
    desc: 'Kim loại tác dụng với axit: Zn, Fe + HCl, H2SO4 loãng',
    icon: Scale,
    color: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30',
    badge: 'Toán PTHH',
    requiredLessonId: 'g8-b06',
    requiredLessonName: 'Bài 6: Tính theo PTHH',
  },
];

export const PracticePage: React.FC = () => {
  const navigate = useNavigate();
  const { completedNodes, hearts } = useUserStore();

  const [selectedGrade, setSelectedGrade] = useState<Grade>(8);
  const [selectedDiff, setSelectedDiff] = useState<'all' | '1' | '2' | '3'>('all');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all');
  const [modalInfo, setModalInfo] = useState<LockModalInfo | null>(null);
  const [highScores, setHighScores] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('chem_minigame_scores');
      if (saved) {
        setHighScores(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const curriculum = useMemo(() => getCurriculum(selectedGrade), [selectedGrade]);
  const chapters = curriculum.chapters;

  // ── Sequential Unlock Check: Học đến đâu thì mở khóa luyện tập đến đấy ──
  const lessonUnlockStatus = useMemo(() => {
    const statusMap = new Map<
      string,
      { isUnlocked: boolean; isCompleted: boolean; requiredLessonTitle?: string }
    >();

    let canUnlockNextPlayable = true;
    let lastCompletedTitle = '';

    for (const ch of chapters) {
      for (const lesson of ch.lessons) {
        const nodes = lesson.nodes;
        const isAnyNodeCompleted = nodes.some((n) => !!completedNodes[`${lesson.id}:${n.id}`]);
        const isAllNodesCompleted =
          nodes.length > 0 && nodes.every((n) => !!completedNodes[`${lesson.id}:${n.id}`]);

        let isUnlocked = false;

        if (isAnyNodeCompleted || isAllNodesCompleted) {
          isUnlocked = true;
          if (lesson.ready) {
            lastCompletedTitle = lesson.title;
          }
        } else if (canUnlockNextPlayable && lesson.ready) {
          // Current active uncompleted lesson reached on the Learn path
          isUnlocked = true;
          canUnlockNextPlayable = false; // Only unlock up to the lesson currently reached!
        } else {
          isUnlocked = false;
        }

        statusMap.set(lesson.id, {
          isUnlocked,
          isCompleted: isAllNodesCompleted,
          requiredLessonTitle: isUnlocked ? undefined : lastCompletedTitle || 'bài học trước đó',
        });
      }
    }

    return statusMap;
  }, [chapters, completedNodes]);

  const lessons = useMemo(() => {
    if (selectedChapterId === 'all') {
      return chapters.flatMap((c) => c.lessons);
    }
    const found = chapters.find((c) => c.id === selectedChapterId);
    return found ? found.lessons : [];
  }, [chapters, selectedChapterId]);

  const handleStartPractice = (lessonId: string, nodeId: string) => {
    sound.playClick();
    navigate(`/play/${lessonId}/${nodeId}?mode=practice`);
  };

  // Helper to verify if a topic / lesson has been reached on the Learn path
  const isLessonReached = (targetLessonId?: string, targetGrade: Grade = 8) => {
    if (!targetLessonId) return true;
    const gradeCurriculum = getCurriculum(targetGrade);
    let canUnlockNext = true;
    for (const ch of gradeCurriculum.chapters) {
      for (const l of ch.lessons) {
        const isAnyDone = l.nodes.some((n) => !!completedNodes[`${l.id}:${n.id}`]);
        const isAllDone = l.nodes.length > 0 && l.nodes.every((n) => !!completedNodes[`${l.id}:${n.id}`]);
        const isReached = isAnyDone || isAllDone || (canUnlockNext && l.ready);
        if (l.id === targetLessonId) {
          return isReached;
        }
        if (isAllDone) {
          // continues
        } else if (l.ready) {
          canUnlockNext = false;
        }
      }
    }
    return false;
  };

  // Filter Minigames for the currently selected grade
  const gradeMinigames = useMemo(() => {
    return MINIGAMES.filter((g) => g.grades.includes(selectedGrade));
  }, [selectedGrade]);

  const unlockedLessonsCount = useMemo(() => {
    let count = 0;
    lessonUnlockStatus.forEach((val) => {
      if (val.isUnlocked) count++;
    });
    return count;
  }, [lessonUnlockStatus]);

  return (
    <div className="space-y-6 pb-12 select-none max-w-3xl mx-auto">
      {/* Header Banner */}
      <div>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#18272f] border-2 border-[#2e4756] flex items-center justify-center p-2 shadow-[0_4px_0_0_#131f24] shrink-0">
            <img
              src={assetUrl('/assets/icons/xp-potion.png')}
              alt="Practice"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Luyện Tập & Minigames</span>
            </h1>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Tích hợp luyện tập SGK & Minigames: học đến đâu mở khóa đến đấy, không trừ tim, kiếm thêm XP & phục hồi Tim
            </p>
          </div>
        </div>
      </div>

      {/* Hearts Recovery Alert if user is low on hearts */}
      {hearts < 5 && (
        <div
          className={`p-3.5 rounded-3xl border-2 flex items-center justify-between gap-3 shadow-[0_4px_0_0_#131f24] ${
            hearts === 0
              ? 'bg-[#ff4b4b]/15 border-[#ff4b4b]/40 text-rose-200'
              : 'bg-[#ff9600]/15 border-[#ff9600]/40 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#18272f] border-2 border-[#2e4756] flex items-center justify-center p-1.5 shrink-0 shadow-inner">
              <img
                src={assetUrl('/assets/icons/heart-flask.png')}
                alt="Heart"
                className="w-full h-full object-contain animate-pulse"
              />
            </div>
            <div>
              <div className="text-xs font-black text-white">
                {hearts === 0 ? 'Bạn đã hết tim (0/5)!' : `Đang có ${hearts}/5 tim`}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                Hoàn thành 1 bài luyện tập hoặc chơi 1 minigame sẽ nhận ngay <span className="font-bold text-[#58cc02]">+1 tim</span>!
              </div>
            </div>
          </div>
          <div className="shrink-0 text-xs font-black px-3 py-1.5 rounded-xl bg-[#18272f] border-2 border-[#2e4756] text-white flex items-center gap-1.5 shadow-sm">
            <img src={assetUrl('/assets/icons/heart-flask.png')} alt="Heart" className="w-3.5 h-3.5 object-contain" />
            <span>{hearts}/5</span>
          </div>
        </div>
      )}

      {/* Grade Selector (Lớp 6 | Lớp 7 | Lớp 8 | Lớp 9) */}
      <div className="space-y-1.5 bg-[#18272f] border-2 border-[#2e4756] p-2.5 rounded-3xl shadow-[0_4px_0_0_#131f24]">
        <div className="flex items-center justify-between px-1 mb-1">
          <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
            Chọn khối lớp học tập:
          </label>
          <span className="text-[11px] font-bold text-[#0ea5e9]">
            {unlockedLessonsCount} bài đã mở khóa
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {([6, 7, 8, 9] as Grade[]).map((g) => (
            <button
              key={g}
              onClick={() => {
                sound.playClick();
                setSelectedGrade(g);
                setSelectedChapterId('all');
              }}
              className={`py-2.5 text-xs font-black rounded-2xl transition-all cursor-pointer border-2 ${
                selectedGrade === g
                  ? 'bg-[#0ea5e9] text-white border-sky-200 shadow-[0_4px_0_0_#0284c7] scale-[1.02]'
                  : 'bg-[#20333d] border-[#2e4756] text-slate-400 hover:text-white hover:bg-[#283e4a]'
              }`}
            >
              Lớp {g}
            </button>
          ))}
        </div>
      </div>

      {/* ── SECTION 1: MINIGAMES TƯƠNG TÁC THEO LỚP ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-[#ce82ff]" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              Minigames Thực Hành Lớp {selectedGrade} ({gradeMinigames.length} trò chơi)
            </h2>
          </div>
          <span className="text-[11px] text-purple-300 font-bold">
            Rèn luyện phản xạ & củng cố kiến thức
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {gradeMinigames.map((game) => {
            const Icon = game.icon;
            const bestScore = highScores[game.id] || 0;
            const isUnlocked = !game.requiredLessonId || isLessonReached(game.requiredLessonId, game.requiredGrade || selectedGrade);

            return (
              <motion.div
                key={game.id}
                whileTap={isUnlocked ? { scale: 0.98 } : undefined}
                onClick={() => {
                  sound.playClick();
                  if (isUnlocked) {
                    navigate(`/practice/${game.id}`);
                  } else {
                    setModalInfo({
                      isOpen: true,
                      title: game.name,
                      badge: '🔒 Chưa mở khóa Minigame',
                      description: `Minigame "${game.name}" yêu cầu nắm chắc kiến thức của ${game.requiredLessonName}. Bạn cần học và hoàn thành bài này trên lộ trình trước nhé!`,
                      requiredLessonName: game.requiredLessonName,
                      targetGrade: game.requiredGrade || selectedGrade,
                      actionLabel: 'ĐẾN HỌC BÀI NÀY',
                    });
                  }
                }}
                className={`p-3.5 rounded-3xl border-2 transition-all flex items-center justify-between cursor-pointer group ${
                  isUnlocked
                    ? `bg-[#18272f] border-[#2e4756] hover:border-[#ce82ff] shadow-[0_4px_0_0_#131f24] hover:translate-y-[-2px]`
                    : 'bg-[#131f24]/80 border-[#20333d] opacity-75 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div
                    className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${
                      isUnlocked
                        ? `bg-[#20333d] border-[#2e4756] text-[#ce82ff]`
                        : 'bg-[#18272f] border-[#20333d] text-slate-600'
                    }`}
                  >
                    {isUnlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-5 h-5 text-slate-500" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3
                        className={`text-xs font-black truncate transition-colors ${
                          isUnlocked ? 'text-white group-hover:text-[#38bdf8]' : 'text-slate-400'
                        }`}
                      >
                        {game.name}
                      </h3>
                      {!isUnlocked && (
                        <span className="text-[9px] font-bold bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded-md border border-slate-700 flex items-center gap-0.5 shrink-0">
                          <Lock className="w-2.5 h-2.5" /> Khóa
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 truncate leading-tight">
                      {game.desc}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 truncate">
                        {game.skill}
                      </span>
                      {bestScore > 0 && isUnlocked && (
                        <span className="flex items-center gap-1 text-[10px] font-black text-amber-400 shrink-0">
                          <Trophy className="w-3 h-3" /> {bestScore} điểm
                        </span>
                      )}
                    </div>

                    {!isUnlocked && game.requiredLessonName && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400/90 pt-1 truncate">
                        <span>🔒 Cần học: {game.requiredLessonName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ml-1 transition-colors ${
                    isUnlocked
                      ? 'bg-slate-800/80 border-slate-700 group-hover:bg-purple-600 group-hover:border-purple-400'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                >
                  {isUnlocked ? (
                    <Play className="w-3.5 h-3.5 text-purple-400 fill-purple-400 group-hover:text-white group-hover:fill-white transition-colors" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 2: BÀI TẬP THEO TỪNG BÀI SGK LỚP X ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider">
              Bài Tập Theo Từng Bài SGK Lớp {selectedGrade} ({lessons.length} bài)
            </h2>
          </div>
          <span className="text-[11px] text-cyan-400 font-semibold">
            Chỉ mở khóa các bài bạn đã học đến
          </span>
        </div>

        {/* Chapter Filter */}
        <div className="space-y-1.5">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedChapterId('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border-2 ${
                selectedChapterId === 'all'
                  ? 'bg-[#0ea5e9]/20 text-[#38bdf8] border-[#0ea5e9] shadow-[0_2px_0_0_#0284c7]'
                  : 'bg-[#20333d] text-slate-300 border-[#2e4756] hover:text-white hover:bg-[#283e4a]'
              }`}
            >
              Tất cả chương ({chapters.length} chương)
            </button>
            {chapters.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedChapterId(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border-2 ${
                  selectedChapterId === c.id
                    ? 'bg-[#0ea5e9]/20 text-[#38bdf8] border-[#0ea5e9] shadow-[0_2px_0_0_#0284c7]'
                    : 'bg-[#20333d] text-slate-300 border-[#2e4756] hover:text-white hover:bg-[#283e4a]'
                }`}
              >
                Chương {c.chapterNumber}: {c.title}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'all', label: 'Tất cả độ khó' },
            { id: '1', label: 'Dễ (★)' },
            { id: '2', label: 'Vừa (★★)' },
            { id: '3', label: 'Khó (★★★)' },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => {
                sound.playClick();
                setSelectedDiff(d.id as 'all' | '1' | '2' | '3');
              }}
              className={`py-1.5 rounded-xl text-[11px] font-bold border-2 transition-all cursor-pointer ${
                selectedDiff === d.id
                  ? 'bg-[#0ea5e9]/20 text-[#38bdf8] border-[#0ea5e9] shadow-[0_2px_0_0_#0284c7]'
                  : 'bg-[#20333d] border-[#2e4756] text-slate-400 hover:text-slate-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Lessons List */}
        <div className="space-y-2.5">
          {lessons.map((lesson) => {
            const status = lessonUnlockStatus.get(lesson.id) ?? {
              isUnlocked: false,
              isCompleted: false,
            };
            const isAvailable = lesson.ready && status.isUnlocked;

            // Check if this lesson has an associated minigame
            const relatedMinigame = MINIGAMES.find((m) => m.requiredLessonId === lesson.id);

            return (
              <div
                key={lesson.id}
                className={`p-4 rounded-3xl border-2 transition-all ${
                  !lesson.ready
                    ? 'bg-[#131f24]/80 border-[#20333d] hover:border-[#2e4756] cursor-pointer opacity-75'
                    : isAvailable
                      ? 'bg-[#18272f] border-[#2e4756] hover:border-[#0ea5e9] shadow-[0_4px_0_0_#131f24] cursor-pointer hover:translate-y-[-2px]'
                      : 'bg-[#131f24]/80 border-[#20333d] hover:border-amber-500/40 cursor-pointer opacity-75'
                }`}
                onClick={() => {
                  if (isAvailable && lesson.nodes[0]) {
                    handleStartPractice(lesson.id, lesson.nodes[0].id);
                  } else if (!lesson.ready) {
                    sound.playClick();
                    setModalInfo({
                      isOpen: true,
                      title: lesson.title,
                      badge: '🛠️ Sắp có (Đang biên soạn)',
                      description: `Nội dung của bài "${lesson.title}" đang được ban biên tập hoàn thiện theo SGK mới. Bạn hãy tập trung học và luyện tập các bài học đang có sẵn trên bản đồ trước nhé!`,
                      requiredLessonName: status.requiredLessonTitle || 'các bài học trước đó',
                      targetGrade: selectedGrade,
                      actionLabel: 'XEM BẢN ĐỒ HỌC',
                    });
                  } else if (!status.isUnlocked) {
                    sound.playClick();
                    setModalInfo({
                      isOpen: true,
                      title: lesson.title,
                      badge: '🔒 Chưa mở khóa',
                      description: `Bạn chưa học đến bài "${lesson.title}". Cần hoàn thành "${status.requiredLessonTitle}" trên Lộ trình học trước để mở khóa bài luyện tập này nhé!`,
                      requiredLessonName: status.requiredLessonTitle,
                      targetGrade: selectedGrade,
                      actionLabel: 'ĐẾN LỘ TRÌNH HỌC NGAY',
                    });
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5 pr-3 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-black ${
                          isAvailable ? 'text-white' : 'text-slate-400'
                        }`}
                      >
                        {lesson.title}
                      </span>
                      {!lesson.ready ? (
                        <span className="text-[10px] font-bold bg-[#20333d] text-slate-400 border border-[#2e4756] px-2 py-0.5 rounded-lg flex items-center gap-1">
                          🛠️ Sắp có
                        </span>
                      ) : status.isCompleted ? (
                        <span className="text-[10px] font-bold bg-[#58cc02]/15 text-emerald-300 border border-[#58cc02]/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#58cc02]" /> Đã học · Luyện tập
                        </span>
                      ) : isAvailable ? (
                        <span className="text-[10px] font-bold bg-[#0ea5e9]/15 text-[#38bdf8] border border-[#0ea5e9]/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#0ea5e9]" /> Đang học · Luyện tập
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-[#20333d] text-amber-400/90 border border-amber-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-400" /> Chưa mở khóa
                        </span>
                      )}

                      {/* Associated Minigame Tag */}
                      {relatedMinigame && isAvailable && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            sound.playClick();
                            navigate(`/practice/${relatedMinigame.id}`);
                          }}
                          className="text-[10px] font-bold bg-[#ce82ff]/15 text-[#ce82ff] border border-[#ce82ff]/40 px-2 py-0.5 rounded-lg hover:bg-[#ce82ff]/25 transition-colors flex items-center gap-1 cursor-pointer"
                          title={`Chơi minigame ${relatedMinigame.name}`}
                        >
                          <Gamepad2 className="w-3 h-3 text-[#ce82ff]" />
                          <span>Game: {relatedMinigame.name}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                      {lesson.subtitle}
                    </p>

                    {!isAvailable && lesson.ready && status.requiredLessonTitle && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400/90 pt-0.5">
                        <span>🔒 Cần hoàn thành "{status.requiredLessonTitle}" trên lộ trình học</span>
                        <span className="text-[#38bdf8] underline flex items-center ml-1">
                          Đến học <ArrowRight className="w-3 h-3 ml-0.5 inline" />
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Action Icon */}
                  {isAvailable ? (
                    <div className="w-9 h-9 rounded-2xl bg-[#0ea5e9]/20 border-2 border-[#0ea5e9] flex items-center justify-center text-[#38bdf8] shrink-0 shadow-[0_2px_0_0_#0284c7] group-hover:scale-105 transition-transform">
                      <Play className="w-4 h-4 fill-[#0ea5e9]" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-2xl bg-[#18272f] border-2 border-[#20333d] flex items-center justify-center text-slate-500 shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 3: ĐỀ TOÁN HÓA SINH TỰ ĐỘNG (Dành cho Lớp 8) ── */}
      {selectedGrade === 8 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider">
                Đề Toán Hóa Sinh Tự Động (Generators Vô Hạn)
              </h2>
            </div>
            <span className="text-[11px] text-amber-300 font-bold">
              Tự sinh đề & chất mới theo bài học
            </span>
          </div>

          <div className="space-y-2.5">
            {GENERATOR_TOPICS.map((gen) => {
              const Icon = gen.icon;
              const isUnlocked = isLessonReached(gen.requiredLessonId, 8);

              return (
                <div
                  key={gen.id}
                  onClick={() => {
                    sound.playClick();
                    if (isUnlocked) {
                      navigate(`/play/${gen.id}/dyn?mode=practice`);
                    } else {
                      setModalInfo({
                        isOpen: true,
                        title: gen.title,
                        badge: '🔒 Chưa mở khóa',
                        description: `Dạng bài tập "${gen.title}" yêu cầu vận dụng kiến thức của ${gen.requiredLessonName}. Bạn cần học và hoàn thành bài này trên lộ trình trước nhé!`,
                        requiredLessonName: gen.requiredLessonName,
                        targetGrade: 8,
                        actionLabel: 'ĐẾN HỌC BÀI NÀY',
                      });
                    }
                  }}
                  className={`border-2 p-4 rounded-3xl transition-all shadow-[0_4px_0_0_#131f24] flex items-center justify-between group cursor-pointer ${
                    isUnlocked
                      ? 'bg-[#18272f] border-[#2e4756] hover:border-[#ff9600] hover:translate-y-[-2px]'
                      : 'bg-[#131f24]/80 border-[#20333d] hover:border-amber-500/40 opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <div
                      className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center shrink-0 ${
                        isUnlocked
                          ? `bg-[#20333d] border-[#2e4756] text-[#ff9600]`
                          : 'bg-[#18272f] border-[#20333d] text-slate-600'
                      }`}
                    >
                      {isUnlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-5 h-5 text-slate-500" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3
                          className={`text-xs font-black truncate transition-colors ${
                            isUnlocked ? 'text-white group-hover:text-amber-300' : 'text-slate-400'
                          }`}
                        >
                          {gen.title}
                        </h3>
                        {isUnlocked ? (
                          <span className="text-[10px] font-bold bg-[#ff9600]/15 text-[#ff9600] px-2 py-0.5 rounded-full border border-[#ff9600]/30 shrink-0">
                            {gen.badge}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-[#20333d] text-slate-400 px-2 py-0.5 rounded-full border border-[#2e4756] flex items-center gap-1 shrink-0">
                            <Lock className="w-2.5 h-2.5" /> Chưa mở khóa
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed truncate font-medium">
                        {gen.desc}
                      </p>
                      {!isUnlocked && gen.requiredLessonName && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400/90 pt-0.5">
                          <span>🔒 Mở khóa khi học đến: {gen.requiredLessonName}</span>
                          <span className="text-[#38bdf8] underline flex items-center ml-1">
                            Đến học <ArrowRight className="w-3 h-3 ml-0.5 inline" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-transform ${
                      isUnlocked
                        ? 'bg-[#ff9600]/20 border-[#ff9600] text-[#ff9600] shadow-[0_2px_0_0_#c26f00] group-hover:scale-105'
                        : 'bg-[#18272f] border-[#20333d] text-slate-600'
                    }`}
                  >
                    {isUnlocked ? <Play className="w-4 h-4 fill-[#ff9600]" /> : <Lock className="w-4 h-4" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Guidance Modal for Locked & Coming Soon Items */}
      <AnimatePresence>
        {modalInfo?.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalInfo(null)}
              className="absolute inset-0 bg-[#0c1417]/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-sm rounded-3xl bg-[#18272f] border-2 border-[#2e4756] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.65)] text-center space-y-4 z-10"
            >
              {/* Mascot */}
              <div className="flex justify-center pt-1">
                <Mascot state="thinking" size="xl" />
              </div>

              <div className="space-y-2">
                <span className="inline-block text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-800/60">
                  {modalInfo.badge}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {modalInfo.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {modalInfo.description}
                </p>

                {modalInfo.requiredLessonName && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-300 text-xs font-bold text-left space-y-0.5">
                    <span className="text-[10px] uppercase text-amber-400/80 font-black block">
                      Điều kiện mở khóa:
                    </span>
                    <span>👉 Cần học xong: <strong>{modalInfo.requiredLessonName}</strong></span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="flex items-center justify-center gap-2 font-black"
                  onClick={() => {
                    sound.playClick();
                    const target = modalInfo.targetGrade;
                    setModalInfo(null);
                    navigate(`/learn/${target}`);
                  }}
                >
                  <span>{modalInfo.actionLabel || 'ĐẾN LỘ TRÌNH HỌC'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    sound.playClick();
                    setModalInfo(null);
                  }}
                >
                  ĐÃ HIỂU
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
