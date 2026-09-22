import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Sparkles,
  Filter,
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
  grade: Grade | 'all';
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
    grade: 8,
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
    grade: 7,
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
    grade: 8,
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
    grade: 8,
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
    grade: 8,
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
    grade: 'all',
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
    grade: 'all',
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
    grade: 'all',
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { completedNodes, hearts } = useUserStore();

  const tabParam = searchParams.get('tab');
  const initialTab = tabParam === 'games' || tabParam === 'minigames'
    ? 'minigames'
    : tabParam === 'generators'
      ? 'generators'
      : 'curriculum';

  const [activeTab, setActiveTab] = useState<'curriculum' | 'minigames' | 'generators'>(initialTab);
  const [selectedGrade, setSelectedGrade] = useState<Grade>(8);
  const [selectedDiff, setSelectedDiff] = useState<'all' | '1' | '2' | '3'>('all');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all');
  const [gameGradeFilter, setGameGradeFilter] = useState<string>('all');
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

  // Update tab in URL query param when changing tabs
  const handleTabChange = (tab: 'curriculum' | 'minigames' | 'generators') => {
    sound.playClick();
    setActiveTab(tab);
    setSearchParams({ tab });
  };

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
          canUnlockNextPlayable = false; // Only unlock up to this point!
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
  const isLessonReached = (targetLessonId: string, targetGrade: Grade = 8) => {
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

  const filteredMinigames = useMemo(() => {
    if (gameGradeFilter === 'all') return MINIGAMES;
    const gradeNum = parseInt(gameGradeFilter, 10);
    return MINIGAMES.filter((g) => g.grade === 'all' || g.grade === gradeNum);
  }, [gameGradeFilter]);

  return (
    <div className="space-y-5 pb-8 select-none">
      {/* Header Banner */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Luyện Tập & Minigames
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Mở khóa theo tiến độ học tập: không trừ tim, rèn luyện phản xạ và nhận thêm XP & Đá quý
            </p>
          </div>
        </div>
      </div>

      {/* Hearts Recovery Alert if user is low on hearts */}
      {hearts < 5 && (
        <div
          className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 shadow-md ${
            hearts === 0
              ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                hearts === 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              ❤️
            </div>
            <div>
              <div className="text-xs font-black">
                {hearts === 0 ? 'Bạn đã hết tim (0/5)!' : `Đang có ${hearts}/5 tim`}
              </div>
              <div className="text-[11px] opacity-90 font-medium">
                Làm xong 1 bài luyện tập hoặc chơi minigame sẽ nhận ngay <span className="font-bold underline text-white">+1 tim</span>!
              </div>
            </div>
          </div>
          <div className="shrink-0 text-xs font-black px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-700">
            {hearts}/5 ❤️
          </div>
        </div>
      )}

      {/* 3 Unified Tabs: Curriculum | Minigames | Generators */}
      <div className="flex bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl shadow-sm gap-1">
        <button
          onClick={() => handleTabChange('curriculum')}
          className={`flex-1 py-2.5 px-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'curriculum'
              ? 'bg-cyan-500 text-slate-950 shadow-[0_3px_0_0_#0891b2]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="truncate">Luyện theo SGK</span>
        </button>

        <button
          onClick={() => handleTabChange('minigames')}
          className={`flex-1 py-2.5 px-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'minigames'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_3px_0_0_#6366f1]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span className="truncate">Kho Minigames 🎮</span>
        </button>

        <button
          onClick={() => handleTabChange('generators')}
          className={`flex-1 py-2.5 px-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'generators'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-[0_3px_0_0_#d97706]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span className="truncate">Toán hóa vô hạn ⚡</span>
        </button>
      </div>

      {/* ── TAB 1: CURRICULUM LESSONS (Luyện theo SGK) ── */}
      {activeTab === 'curriculum' && (
        <div className="space-y-4">
          {/* Grade Selector (Lớp 6, 7, 8, 9) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Khối lớp:</label>
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl">
              {([6, 7, 8, 9] as Grade[]).map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    sound.playClick();
                    setSelectedGrade(g);
                    setSelectedChapterId('all');
                  }}
                  className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    selectedGrade === g
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_3px_0_0_#0891b2]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Lớp {g}
                </button>
              ))}
            </div>
          </div>

          {/* Chapter Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              Chương bài học:
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedChapterId('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                  selectedChapterId === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                Tất cả chương
              </button>
              {chapters.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChapterId(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                    selectedChapterId === c.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Chương {c.chapterNumber}: {c.title}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Độ khó bài tập:</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'all', label: 'Tất cả' },
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
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedDiff === d.id
                      ? 'bg-slate-800 text-cyan-300 border-cyan-500/60 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lesson Topics List */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Danh sách bài học Lớp {selectedGrade} ({lessons.length} bài):</span>
              <span className="text-[11px] text-cyan-400 font-semibold">
                Mở khóa theo tiến độ lộ trình học
              </span>
            </div>

            <div className="space-y-2.5">
              {lessons.map((lesson) => {
                const status = lessonUnlockStatus.get(lesson.id) ?? {
                  isUnlocked: false,
                  isCompleted: false,
                };
                const isAvailable = lesson.ready && status.isUnlocked;

                return (
                  <div
                    key={lesson.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      !lesson.ready
                        ? 'bg-slate-950/50 border-slate-900 hover:border-slate-700/60 cursor-pointer'
                        : isAvailable
                          ? 'bg-slate-900 border-slate-800 hover:border-cyan-500/50 shadow-md cursor-pointer hover:translate-y-[-1px]'
                          : 'bg-slate-950/60 border-slate-900 hover:border-amber-500/40 cursor-pointer opacity-80'
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
                              isAvailable ? 'text-slate-100' : 'text-slate-400'
                            }`}
                          >
                            {lesson.title}
                          </span>
                          {!lesson.ready ? (
                            <span className="text-[10px] font-bold bg-slate-800/90 text-slate-400 border border-slate-700/60 px-2 py-0.5 rounded-lg flex items-center gap-1">
                              🛠️ Sắp có
                            </span>
                          ) : status.isCompleted ? (
                            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Đã học · Luyện tập
                            </span>
                          ) : isAvailable ? (
                            <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-cyan-400" /> Đang học · Luyện tập
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold bg-slate-800/90 text-amber-400/90 border border-amber-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <Lock className="w-3 h-3 text-amber-400" /> Chưa mở khóa
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                          {lesson.subtitle}
                        </p>

                        {!isAvailable && lesson.ready && status.requiredLessonTitle && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400/90 pt-0.5">
                            <span>🔒 Cần hoàn thành "{status.requiredLessonTitle}" trên lộ trình học</span>
                            <span className="text-cyan-400 underline flex items-center ml-1">
                              Đến học <ArrowRight className="w-3 h-3 ml-0.5 inline" />
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right Action Icon */}
                      {isAvailable ? (
                        <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                          <Play className="w-4 h-4 fill-cyan-400" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 shrink-0">
                          <Lock className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: KHO MINIGAMES HÓA HỌC ── */}
      {activeTab === 'minigames' && (
        <div className="space-y-4">
          {/* Grade filter for Minigames */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-purple-400" />
              Lọc minigame theo khối lớp:
            </label>
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl gap-1">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: '6', label: 'Lớp 6' },
                { id: '7', label: 'Lớp 7' },
                { id: '8', label: 'Lớp 8' },
                { id: '9', label: 'Lớp 9' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    sound.playClick();
                    setGameGradeFilter(f.id);
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    gameGradeFilter === f.id
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-400 bg-purple-950/20 border border-purple-800/30 p-3 rounded-2xl flex items-center justify-between">
            <span>🎮 Luyện phản xạ & nhận tới <strong className="text-purple-300">+25 XP</strong> mỗi lượt chơi</span>
            <span className="text-[11px] text-amber-300 font-bold">Hồi +1 ❤️ khi hoàn thành</span>
          </div>

          {/* Minigames Grid */}
          <div className="grid grid-cols-1 gap-3">
            {filteredMinigames.map((game) => {
              const Icon = game.icon;
              const bestScore = highScores[game.id] || 0;
              const isUnlocked = !game.requiredLessonId || isLessonReached(game.requiredLessonId, game.requiredGrade || 8);

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
                        description: `Minigame "${game.name}" đòi hỏi kiến thức của ${game.requiredLessonName}. Bạn cần học và hoàn thành bài này trên lộ trình trước nhé!`,
                        requiredLessonName: game.requiredLessonName,
                        targetGrade: game.requiredGrade || 8,
                        actionLabel: 'ĐẾN HỌC BÀI NÀY',
                      });
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all shadow-md flex items-center justify-between cursor-pointer group ${
                    isUnlocked
                      ? `bg-slate-900 border-slate-800 ${game.borderAccent} hover:translate-y-[-1px]`
                      : 'bg-slate-950/60 border-slate-900 opacity-75 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform ${
                        isUnlocked
                          ? `bg-gradient-to-br ${game.color} border-slate-700/60`
                          : 'bg-slate-900 border-slate-800 text-slate-600'
                      }`}
                    >
                      {isUnlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5 text-slate-500" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h2
                          className={`text-sm font-bold truncate transition-colors ${
                            isUnlocked ? 'text-slate-100 group-hover:text-cyan-300' : 'text-slate-400'
                          }`}
                        >
                          {game.name}
                        </h2>

                        {game.grade !== 'all' && (
                          <span className="text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 px-2 py-0.5 rounded-md">
                            Lớp {game.grade}
                          </span>
                        )}

                        {!isUnlocked && (
                          <span className="text-[10px] font-bold bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full border border-slate-700 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Chưa mở khóa
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 mt-0.5 truncate">{game.desc}</p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                          {game.skill}
                        </span>
                        {bestScore > 0 && isUnlocked && (
                          <span className="flex items-center gap-1 text-[10px] font-black text-amber-400">
                            <Trophy className="w-3 h-3" /> {bestScore} điểm
                          </span>
                        )}
                      </div>

                      {!isUnlocked && game.requiredLessonName && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400/90 pt-1">
                          <span>🔒 Cần học đến: {game.requiredLessonName}</span>
                          <span className="text-cyan-400 underline flex items-center ml-1">
                            Đến học <ArrowRight className="w-3 h-3 ml-0.5 inline" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                      isUnlocked
                        ? 'bg-slate-800/80 border-slate-700 group-hover:bg-cyan-500 group-hover:border-cyan-400'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    {isUnlocked ? (
                      <Play className="w-4 h-4 text-cyan-400 fill-cyan-400 group-hover:text-slate-950 group-hover:fill-slate-950 transition-colors" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 3: GENERATORS (Sinh đề vô hạn) ── */}
      {activeTab === 'generators' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-400 leading-relaxed bg-amber-950/20 border border-amber-800/30 p-3 rounded-2xl">
            ⚡ <span className="font-bold text-amber-300">Đề sinh tự động:</span> Mỗi lượt làm bài sẽ tự động tạo ra số liệu và chất hóa học mới hoàn toàn với 7 bước giải chuẩn mực theo các chủ đề bạn đã mở khóa.
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
                  className={`border p-4 rounded-2xl transition-all shadow-md flex items-center justify-between group cursor-pointer ${
                    isUnlocked
                      ? 'bg-slate-900 border-slate-800 hover:border-amber-500/50'
                      : 'bg-slate-950/60 border-slate-900 hover:border-amber-500/40 opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <div
                      className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${
                        isUnlocked
                          ? `bg-gradient-to-br ${gen.color}`
                          : 'bg-slate-900 border-slate-800 text-slate-600'
                      }`}
                    >
                      {isUnlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-5 h-5 text-slate-500" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h2
                          className={`text-xs font-black truncate transition-colors ${
                            isUnlocked ? 'text-slate-100 group-hover:text-amber-300' : 'text-slate-400'
                          }`}
                        >
                          {gen.title}
                        </h2>
                        {isUnlocked ? (
                          <span className="text-[10px] font-bold bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full border border-slate-700 shrink-0">
                            {gen.badge}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-slate-800/90 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700/60 flex items-center gap-1 shrink-0">
                            <Lock className="w-2.5 h-2.5" /> Chưa mở khóa
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed truncate font-medium">
                        {gen.desc}
                      </p>
                      {!isUnlocked && gen.requiredLessonName && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400/90 pt-0.5">
                          <span>🔒 Mở khóa khi học đến: {gen.requiredLessonName}</span>
                          <span className="text-cyan-400 underline flex items-center ml-1">
                            Đến học <ArrowRight className="w-3 h-3 ml-0.5 inline" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-2xl border flex items-center justify-center shrink-0 transition-transform ${
                      isUnlocked
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 group-hover:scale-105'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    {isUnlocked ? <Play className="w-4 h-4 fill-amber-400" /> : <Lock className="w-4 h-4" />}
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
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-slate-700/80 p-6 shadow-2xl text-center space-y-4 z-10"
            >
              {/* Mascot */}
              <div className="flex justify-center pt-1">
                <Mascot state="thinking" size="lg" />
              </div>

              <div className="space-y-2">
                <span className="inline-block text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-800/60">
                  {modalInfo.badge}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-100">
                  {modalInfo.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {modalInfo.description}
                </p>

                {modalInfo.requiredLessonName && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold text-left space-y-0.5">
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
