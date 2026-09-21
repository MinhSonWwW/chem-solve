import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { sound } from '@/lib/audio';
import { getCurriculum, type Grade } from '@/content/curriculum';
import { useUserStore } from '@/features/gamification/useUserStore';

export const PracticePage: React.FC = () => {
  const navigate = useNavigate();
  const { completedNodes } = useUserStore();

  const [activeTab, setActiveTab] = useState<'curriculum' | 'generators'>('curriculum');
  const [selectedGrade, setSelectedGrade] = useState<Grade>(8);
  const [selectedDiff, setSelectedDiff] = useState<'all' | '1' | '2' | '3'>('all');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all');

  const curriculum = useMemo(() => getCurriculum(selectedGrade), [selectedGrade]);
  const chapters = curriculum.chapters;

  // Compute unlock and completion status for each lesson to keep Practice strictly in sync with Learn path
  const lessonUnlockStatus = useMemo(() => {
    const statusMap = new Map<
      string,
      { isUnlocked: boolean; isCompleted: boolean; requiredLessonTitle?: string }
    >();

    chapters.forEach((ch) => {
      let isPreviousLessonCompleted = true;
      let lastPlayableTitle = '';

      ch.lessons.forEach((lesson) => {
        const nodes = lesson.nodes;
        const isAnyNodeCompleted = nodes.some((n) => !!completedNodes[`${lesson.id}:${n.id}`]);
        const isAllNodesCompleted =
          nodes.length > 0 && nodes.every((n) => !!completedNodes[`${lesson.id}:${n.id}`]);

        // Unlocked if previous lesson is completed, or if user is currently at / completed this lesson
        const isUnlocked = isPreviousLessonCompleted || isAnyNodeCompleted || isAllNodesCompleted;

        statusMap.set(lesson.id, {
          isUnlocked,
          isCompleted: isAllNodesCompleted,
          requiredLessonTitle: isUnlocked ? undefined : lastPlayableTitle,
        });

        if (lesson.ready) {
          lastPlayableTitle = lesson.title;
          isPreviousLessonCompleted = isAllNodesCompleted;
        }
      });
    });

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
    navigate(`/play/${lessonId}/${nodeId}`);
  };

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

  // Helper to verify if a generator's topic has been unlocked on the Learn path
  const isGeneratorUnlocked = (gen: typeof GENERATOR_TOPICS[number]) => {
    if (!gen.requiredLessonId) return true;
    const reqLesson = gen.requiredLessonId;
    const gradeCurriculum = getCurriculum(8);
    let isPrevDone = true;
    for (const ch of gradeCurriculum.chapters) {
      for (const l of ch.lessons) {
        const isAnyDone = l.nodes.some((n) => !!completedNodes[`${l.id}:${n.id}`]);
        const isAllDone = l.nodes.length > 0 && l.nodes.every((n) => !!completedNodes[`${l.id}:${n.id}`]);
        const isUnlocked = isPrevDone || isAnyDone || isAllDone;
        if (l.id === reqLesson) {
          return isUnlocked;
        }
        if (l.ready) {
          isPrevDone = isAllDone;
        }
      }
    }
    return false;
  };

  return (
    <div className="space-y-5 pb-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <h1 className="text-xl font-black text-slate-100">Luyện tập tự do</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Luyện các bài bạn đã mở khóa trên lộ trình học: không trừ tim, củng cố kiến thức và kiếm thêm XP
        </p>
      </div>

      {/* Main Mode Toggle: Curriculum vs Generators */}
      <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl shadow-sm">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('curriculum');
          }}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'curriculum'
              ? 'bg-cyan-500 text-slate-950 shadow-[0_3px_0_0_#0891b2]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Theo chương SGK
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('generators');
          }}
          className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'generators'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-[0_3px_0_0_#d97706]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          Sinh đề vô hạn (Generators) ⚡
        </button>
      </div>

      {/* Tab 1: Curriculum Lessons */}
      {activeTab === 'curriculum' && (
        <div className="space-y-4">
          {/* Grade Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Khối lớp:</label>
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl">
              {([7, 8, 9] as Grade[]).map((g) => (
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
            <label className="text-xs font-bold text-slate-300">
              Danh sách bài học & kỹ năng ({lessons.length} bài):
            </label>
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
                        ? 'bg-slate-950/40 border-slate-900 opacity-50 cursor-not-allowed'
                        : isAvailable
                          ? 'bg-slate-900 border-slate-800 hover:border-cyan-500/50 shadow-md cursor-pointer hover:translate-y-[-1px]'
                          : 'bg-slate-950/60 border-slate-900 opacity-75'
                    }`}
                    onClick={() => {
                      if (isAvailable && lesson.nodes[0]) {
                        handleStartPractice(lesson.id, lesson.nodes[0].id);
                      } else if (!status.isUnlocked && lesson.ready) {
                        sound.playClick();
                        navigate(`/learn/${selectedGrade}`);
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
                            <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-lg">
                              Sắp có
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
                            <span className="text-[10px] font-bold bg-slate-800/90 text-slate-400 border border-slate-700/60 px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <Lock className="w-3 h-3 text-slate-400" /> Chưa mở khóa
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {lesson.subtitle}
                        </p>

                        {!isAvailable && lesson.ready && status.requiredLessonTitle && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400/90 pt-0.5">
                            <span>🔒 Cần hoàn thành "{status.requiredLessonTitle}" trên lộ trình học</span>
                            <span className="text-cyan-400 underline flex items-center">
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

      {/* Tab 2: Infinite Generator Topics */}
      {activeTab === 'generators' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-400 leading-relaxed bg-amber-950/20 border border-amber-800/30 p-3 rounded-2xl">
            ⚡ <span className="font-bold text-amber-300">Đề sinh tự động:</span> Mỗi lượt luyện tập sẽ tạo ra các thông số và chất hóa học mới hoàn toàn với 7 bước giải chuẩn mực theo các chủ đề bạn đã mở khóa.
          </div>

          <div className="space-y-2.5">
            {GENERATOR_TOPICS.map((gen) => {
              const Icon = gen.icon;
              const isUnlocked = isGeneratorUnlocked(gen);

              return (
                <div
                  key={gen.id}
                  onClick={() => {
                    if (isUnlocked) {
                      sound.playClick();
                      navigate(`/play/${gen.id}/dyn`);
                    } else {
                      sound.playClick();
                      navigate('/learn/8');
                    }
                  }}
                  className={`border p-4 rounded-2xl transition-all shadow-md flex items-center justify-between group ${
                    isUnlocked
                      ? 'bg-slate-900 border-slate-800 hover:border-amber-500/50 cursor-pointer'
                      : 'bg-slate-950/60 border-slate-900 opacity-70 cursor-pointer'
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
                      <p className="text-[11px] text-slate-400 leading-relaxed truncate">
                        {gen.desc}
                      </p>
                      {!isUnlocked && gen.requiredLessonName && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400/90 pt-0.5">
                          <span>🔒 Mở khóa khi học đến {gen.requiredLessonName}</span>
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
    </div>
  );
};
