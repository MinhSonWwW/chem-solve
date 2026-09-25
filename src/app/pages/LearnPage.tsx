import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { SnakePath, type PathNode, NodePreviewDrawer, ChapterGuideModal } from '@/design-system';
import { sound } from '@/lib/audio';
import { getCurriculum, type Grade, type Lesson, type NodeInfo, type Chapter } from '@/content/curriculum';
import { useUserStore } from '@/features/gamification/useUserStore';
import { loadUserProgress, saveUserProgress } from '@/engine/progress';

export const LearnPage: React.FC = () => {
  const { grade = '8' } = useParams<{ grade: string }>();
  const navigate = useNavigate();
  const { completedNodes, hearts, addGems, addXp } = useUserStore();

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
    </div>
  );
};
