import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, Compass } from 'lucide-react';
import { SnakePath, type PathNode, NodePreviewDrawer, ChapterGuideModal, SubjectSelectorModal } from '@/design-system';
import { sound } from '@/lib/audio';
import { getCurriculum, type Grade, type Lesson, type NodeInfo, type Chapter } from '@/content/curriculum';
import { useUserStore } from '@/features/gamification/useUserStore';
import { loadUserProgress, saveUserProgress } from '@/engine/progress';
import { useActiveSubject, SUBJECTS } from '@/content/subjects';

export const LearnPage: React.FC = () => {
  const { grade = '8' } = useParams<{ grade: string }>();
  const navigate = useNavigate();
  const { completedNodes, hearts, addGems, addXp } = useUserStore();
  const { subject: activeSubject, setSubject: setActiveSubjectState } = useActiveSubject();
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const currentSub = useMemo(() => SUBJECTS.find((s) => s.id === activeSubject) || SUBJECTS[0], [activeSubject]);


  const currentGrade = (parseInt(grade, 10) as Grade) || 8;
  const curriculum = useMemo(() => getCurriculum(currentGrade), [currentGrade]);

  useEffect(() => {
    localStorage.setItem('chem_active_grade', String(currentGrade));
  }, [currentGrade]);

  // Selected node for preview drawer
  const [selectedNode, setSelectedNode] = useState<{
    lesson: Lesson;
    node: NodeInfo;
    isUnlocked: boolean;
    isCompleted: boolean;
    bestAccuracy?: number;
    prerequisiteTitle?: string;
  } | null>(null);

  // Selected chapter for guidebook modal
  const [selectedChapterGuide, setSelectedChapterGuide] = useState<Chapter | null>(null);

  const chaptersWithNodes = useMemo(() => {
    // 1. Flatten all nodes in the grade in exact curriculum order
    const allNodesInGrade: {
      chapter: Chapter;
      lesson: Lesson;
      node: NodeInfo;
      key: string;
    }[] = [];

    curriculum.chapters.forEach((ch) => {
      ch.lessons.forEach((lesson) => {
        lesson.nodes.forEach((node) => {
          allNodesInGrade.push({
            chapter: ch,
            lesson,
            node,
            key: `${lesson.id}:${node.id}`,
          });
        });
      });
    });

    // 2. Determine node statuses sequentially across the entire grade
    const completedKeys = new Set(
      Object.keys(completedNodes).filter((k) => completedNodes[k])
    );

    let canUnlock = true;
    let foundActive = false;
    let lastCompletedReadyTitle: string | undefined = undefined;

    const nodeStatusMap = new Map<
      string,
      {
        status: PathNode['status'];
        isUnlocked: boolean;
        isCompleted: boolean;
        stars?: number;
        prerequisiteTitle?: string;
      }
    >();

    for (let i = 0; i < allNodesInGrade.length; i++) {
      const item = allNodesInGrade[i];
      const isComp = completedKeys.has(item.key);
      const isReady = item.lesson.ready;

      if (isComp) {
        const compData = completedNodes[item.key];
        const stars = Math.min(3, Math.max(1, Math.round(compData.accuracy * 3)));
        nodeStatusMap.set(item.key, {
          status: 'completed',
          isUnlocked: true,
          isCompleted: true,
          stars,
        });
        if (isReady) {
          lastCompletedReadyTitle = item.node.title;
        }
      } else if (canUnlock && isReady && !foundActive) {
        // Exactly one current active playable node for the student
        nodeStatusMap.set(item.key, {
          status: 'active',
          isUnlocked: true,
          isCompleted: false,
        });
        foundActive = true;
        canUnlock = false; // All subsequent nodes are locked
      } else {
        // Locked node (unready draft or ahead of progress)
        nodeStatusMap.set(item.key, {
          status: 'locked',
          isUnlocked: false,
          isCompleted: false,
          prerequisiteTitle: lastCompletedReadyTitle,
        });
      }
    }

    // 3. Assemble chapters with pathNodes
    return curriculum.chapters.map((ch) => {
      const pathNodes: PathNode[] = [];
      const nodeLessonMap = new Map<
        string,
        {
          lesson: Lesson;
          node: NodeInfo;
          isUnlocked: boolean;
          isCompleted: boolean;
          bestAccuracy?: number;
          prerequisiteTitle?: string;
        }
      >();

      ch.lessons.forEach((lesson) => {
        lesson.nodes.forEach((node) => {
          const key = `${lesson.id}:${node.id}`;
          const comp = completedNodes[key];
          const calculated = nodeStatusMap.get(key) ?? {
            status: 'locked' as const,
            isUnlocked: false,
            isCompleted: false,
          };

          pathNodes.push({
            id: node.id,
            title: node.title,
            type: node.type,
            status: calculated.status,
            stars: calculated.stars,
            isReady: lesson.ready,
          });

          nodeLessonMap.set(node.id, {
            lesson,
            node,
            isUnlocked: calculated.isUnlocked,
            isCompleted: calculated.isCompleted,
            bestAccuracy: comp?.accuracy,
            prerequisiteTitle: calculated.prerequisiteTitle,
          });
        });
      });

      return {
        chapter: ch,
        pathNodes,
        nodeLessonMap,
      };
    });
  }, [curriculum, completedNodes]);

  const handleNodeClick = (
    pathNode: PathNode,
    map: Map<
      string,
      {
        lesson: Lesson;
        node: NodeInfo;
        isUnlocked: boolean;
        isCompleted: boolean;
        bestAccuracy?: number;
        prerequisiteTitle?: string;
      }
    >
  ) => {
    sound.playClick();
    const info = map.get(pathNode.id);
    if (info) {
      setSelectedNode(info);
    }
  };

  const handleOpenChest = async () => {
    if (!selectedNode) return;
    const { lesson, node } = selectedNode;
    const nodeKey = `${lesson.id}:${node.id}`;

    sound.playLevelUp();
    addGems(30);
    addXp(50);

    const progress = await loadUserProgress();
    progress.gems = (progress.gems || 0) + 30;
    progress.xp = (progress.xp || 0) + 50;
    progress.completedNodes[nodeKey] = {
      accuracy: 1,
      bestXp: 50,
      completedAt: Date.now(),
    };
    await saveUserProgress(progress);

    useUserStore.setState((s) => ({
      gems: s.gems + 30,
      xp: s.xp + 50,
      completedNodes: {
        ...s.completedNodes,
        [nodeKey]: {
          accuracy: 1,
          bestXp: 50,
          completedAt: Date.now(),
        },
      },
    }));

    setSelectedNode(null);
  };

  const handleStartNode = () => {
    if (!selectedNode) return;
    const { lesson, node } = selectedNode;
    setSelectedNode(null);
    if (node.type === 'theory') {
      navigate(`/theory/${lesson.id}/${node.id}`);
    } else {
      navigate(`/play/${lesson.id}/${node.id}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 0. Subject Selection Bar */}
      <div className="bg-[#18272f] border-2 border-[#2e4756] p-3 rounded-2xl flex items-center justify-between shadow-[0_4px_0_0_#131f24]">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 border shadow-inner"
            style={{
              backgroundColor: `${currentSub.accentColor}20`,
              borderColor: `${currentSub.accentColor}50`,
            }}
          >
            {currentSub.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">{currentSub.name} THCS</span>
              <span
                className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md border tracking-wider"
                style={{
                  backgroundColor: `${currentSub.accentColor}25`,
                  color: currentSub.accentColor,
                  borderColor: `${currentSub.accentColor}50`,
                }}
              >
                {currentSub.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium line-clamp-1">
              {currentSub.tagline}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setShowSubjectModal(true);
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#20333d] hover:bg-[#28414f] border border-[#2e4756] text-xs font-black text-sky-400 hover:text-white transition-colors cursor-pointer shrink-0 shadow-[0_2px_0_0_#131f24]"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Đổi môn</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Physics Under Construction View */}
      {activeSubject === 'physics' && (
        <div className="bg-[#18272f] border-2 border-amber-500/40 p-6 sm:p-8 rounded-3xl shadow-[0_6px_0_0_#131f24] space-y-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-4xl mx-auto shadow-inner animate-pulse">
            ⚡
          </div>
          <div className="space-y-2">
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-800/60 inline-block">
              ĐANG XÂY DỰNG · SẮP RA MẮT
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">Môn Vật lý THCS</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Hệ thống bài tập, công thức tính toán và mô phỏng thí nghiệm tương tác (Cơ - Nhiệt - Điện - Quang) cho môn Vật lý (KHTN 6, 7, 8, 9) đang được chuẩn bị bám sát SGK Kết nối tri thức & Cánh diều!
            </p>
          </div>

          {/* Topics Roadmap Preview */}
          <div className="space-y-2 text-left max-w-md mx-auto pt-2">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              LỘ TRÌNH DỰ KIẾN:
            </div>
            {currentSub.topics.map((top, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#131f24] border border-[#2e4756] flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-black shrink-0 border border-amber-500/30">
                  {i + 1}
                </div>
                <span className="text-xs font-bold text-slate-200">{top}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                sound.playClick();
                setActiveSubjectState('chem');
              }}
              className="px-6 py-3 bg-[#0ea5e9] hover:bg-[#38bdf8] text-white font-black text-xs sm:text-sm rounded-2xl shadow-[0_4px_0_0_#0284c7] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              🧪 Quay lại học Hóa học ngay
            </button>
          </div>
        </div>
      )}

      {/* Biology Preview View */}
      {activeSubject === 'bio' && (
        <div className="bg-[#18272f] border-2 border-emerald-500/40 p-6 sm:p-8 rounded-3xl shadow-[0_6px_0_0_#131f24] space-y-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-4xl mx-auto shadow-inner">
            🌿
          </div>
          <div className="space-y-2">
            <span className="text-xs font-black uppercase text-emerald-400 tracking-wider bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-800/60 inline-block">
              LÊN KẾ HOẠCH TÍCH HỢP
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">Môn Sinh học THCS</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Môn Sinh học sẽ hoàn thiện bộ ba môn Khoa học Tự nhiên THCS, với các bài tập sơ đồ tế bào, di truyền học và hệ sinh thái tương tác!
            </p>
          </div>

          <div className="space-y-2 text-left max-w-md mx-auto pt-2">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              LỘ TRÌNH DỰ KIẾN:
            </div>
            {currentSub.topics.map((top, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#131f24] border border-[#2e4756] flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-black shrink-0 border border-emerald-500/30">
                  {i + 1}
                </div>
                <span className="text-xs font-bold text-slate-200">{top}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                sound.playClick();
                setActiveSubjectState('chem');
              }}
              className="px-6 py-3 bg-[#0ea5e9] hover:bg-[#38bdf8] text-white font-black text-xs sm:text-sm rounded-2xl shadow-[0_4px_0_0_#0284c7] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              🧪 Quay lại học Hóa học ngay
            </button>
          </div>
        </div>
      )}

      {/* Normal Chemistry Curriculum View */}
      {activeSubject === 'chem' && (
        <>
          {/* 1. Grade Selector (3D chunky tabs) */}
          <div className="flex bg-[#18272f] border-2 border-[#2e4756] p-1.5 rounded-2xl shadow-[0_4px_0_0_#131f24]">
            {([6, 7, 8, 9] as Grade[]).map((g) => (
              <button
                key={g}
                onClick={() => {
                  sound.playClick();
                  navigate(`/learn/${g}`);
                }}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  currentGrade === g
                    ? 'bg-[#0ea5e9] text-white shadow-[0_3px_0_0_#0284c7]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>

          {/* 2. Chapters & Snake Paths */}
          {chaptersWithNodes.map(({ chapter, pathNodes, nodeLessonMap }) => (
            <div key={chapter.id} className="space-y-4">
              {/* Chapter Banner (Duolingo Style) */}
              <div className="bg-[#18272f] border-2 border-[#2e4756] p-4 sm:p-5 rounded-3xl flex items-center justify-between shadow-[0_6px_0_0_#131f24] relative overflow-hidden">
                {/* Background glowing ambient light */}
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#0ea5e9]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-1 max-w-[65%] sm:max-w-[70%] relative z-10">
                  <span className="inline-block text-[10px] font-black uppercase tracking-wider text-sky-300 bg-[#20333d] px-2 py-0.5 rounded-lg border border-[#2e4756]">
                    Chương {chapter.chapterNumber} · Lớp {currentGrade}
                  </span>
                  <h1 className="text-sm sm:text-base font-black text-white leading-tight">
                    {chapter.title}
                  </h1>
                  <p className="text-[11px] text-slate-300 line-clamp-1">
                    {chapter.description}
                  </p>
                </div>

                {/* Duolingo-style Guidebook Pill Button */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setSelectedChapterGuide(chapter);
                  }}
                  className="relative z-10 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#ce82ff] hover:bg-[#d896ff] text-white font-black text-[11px] sm:text-xs rounded-2xl shadow-[0_4px_0_0_#a545ee] active:translate-y-1 active:shadow-none transition-all cursor-pointer whitespace-nowrap border-2 border-[#e9d5ff]/40"
                  title="Xem sổ tay kiến thức chương"
                >
                  <BookOpen className="w-4 h-4 stroke-[2.5]" />
                  <span className="tracking-wide">HƯỚNG DẪN</span>
                </button>
              </div>

              {/* Duolingo Snake Path */}
              <SnakePath
                nodes={pathNodes}
                onNodeClick={(node) => handleNodeClick(node, nodeLessonMap)}
              />
            </div>
          ))}
        </>
      )}

      {/* 3. Node Preview Drawer */}
      <NodePreviewDrawer
        isOpen={!!selectedNode}
        lesson={selectedNode?.lesson}
        node={selectedNode?.node}
        isUnlocked={selectedNode?.isUnlocked ?? false}
        isCompleted={selectedNode?.isCompleted ?? false}
        bestAccuracy={selectedNode?.bestAccuracy}
        prerequisiteTitle={selectedNode?.prerequisiteTitle}
        hearts={hearts}
        onGoToPractice={() => {
          setSelectedNode(null);
          navigate('/practice');
        }}
        onClose={() => setSelectedNode(null)}
        onStart={handleStartNode}
        onOpenChest={handleOpenChest}
      />

      {/* 4. Chapter Guidebook Modal */}
      <ChapterGuideModal
        isOpen={!!selectedChapterGuide}
        chapter={selectedChapterGuide}
        grade={currentGrade}
        onClose={() => setSelectedChapterGuide(null)}
      />

      {/* 5. Subject Selector Modal */}
      <SubjectSelectorModal
        isOpen={showSubjectModal}
        currentSubject={activeSubject}
        onSelectSubject={(id) => setActiveSubjectState(id)}
        onClose={() => setShowSubjectModal(false)}
      />
    </div>
  );
};
