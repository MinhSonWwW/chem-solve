import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { SnakePath, type PathNode, NodePreviewDrawer, ChapterGuideModal } from '@/design-system';
import { sound } from '@/lib/audio';
import { getCurriculum, type Grade, type Lesson, type NodeInfo, type Chapter } from '@/content/curriculum';
import { useUserStore } from '@/features/gamification/useUserStore';

export const LearnPage: React.FC = () => {
  const { grade = '8' } = useParams<{ grade: string }>();
  const navigate = useNavigate();
  const { completedNodes } = useUserStore();

  const currentGrade = (parseInt(grade, 10) as Grade) || 8;
  const curriculum = useMemo(() => getCurriculum(currentGrade), [currentGrade]);

  // Selected node for preview drawer
  const [selectedNode, setSelectedNode] = useState<{
    lesson: Lesson;
    node: NodeInfo;
    isUnlocked: boolean;
    isCompleted: boolean;
    bestAccuracy?: number;
  } | null>(null);

  // Selected chapter for guidebook modal
  const [selectedChapterGuide, setSelectedChapterGuide] = useState<Chapter | null>(null);
  const chaptersWithNodes = useMemo(() => {
    return curriculum.chapters.map((ch) => {
      let isPreviousNodeDone = true; // First node of chapter is unlocked

      const pathNodes: PathNode[] = [];
      const nodeLessonMap = new Map<string, { lesson: Lesson; node: NodeInfo; isUnlocked: boolean; isCompleted: boolean; bestAccuracy?: number }>();

      ch.lessons.forEach((lesson) => {
        lesson.nodes.forEach((node) => {
          const key = `${lesson.id}:${node.id}`;
          const comp = completedNodes[key];
          const isCompleted = !!comp;
          const isUnlocked = isPreviousNodeDone || isCompleted;

          // Determine status
          let status: PathNode['status'] = 'locked';
          let stars: number | undefined;

          if (isCompleted) {
            status = 'completed';
            stars = Math.min(3, Math.max(1, Math.round(comp.accuracy * 3)));
          } else if (isUnlocked) {
            status = 'active';
          }

          pathNodes.push({
            id: node.id,
            title: node.title,
            type: node.type,
            status,
            stars,
          });

          nodeLessonMap.set(node.id, {
            lesson,
            node,
            isUnlocked,
            isCompleted,
            bestAccuracy: comp?.accuracy,
          });

          // Next node is only unlocked if this one was completed (do not let unready lessons block progression)
          if (lesson.ready) {
            isPreviousNodeDone = isCompleted;
          }
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
    map: Map<string, { lesson: Lesson; node: NodeInfo; isUnlocked: boolean; isCompleted: boolean; bestAccuracy?: number }>
  ) => {
    sound.playClick();
    const info = map.get(pathNode.id);
    if (info) {
      setSelectedNode(info);
    }
  };

  const handleStartNode = () => {
    if (!selectedNode) return;
    const { lesson, node } = selectedNode;
    setSelectedNode(null);
    navigate(`/play/${lesson.id}/${node.id}`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Grade Selector (3D chunky tabs) */}
      <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shadow-md">
        {([7, 8, 9] as Grade[]).map((g) => (
          <button
            key={g}
            onClick={() => {
              sound.playClick();
              navigate(`/learn/${g}`);
            }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              currentGrade === g
                ? 'bg-cyan-500 text-slate-950 shadow-[0_3px_0_0_#0891b2]'
                : 'text-slate-400 hover:text-slate-200'
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
          <div className="bg-gradient-to-r from-cyan-950/90 via-slate-900 to-indigo-950/80 border-2 border-cyan-500/40 p-4 sm:p-5 rounded-3xl flex items-center justify-between shadow-2xl relative overflow-hidden">
            {/* Background glowing ambient light */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-1 max-w-[65%] sm:max-w-[70%] relative z-10">
              <span className="inline-block text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/90 px-2 py-0.5 rounded-lg border border-cyan-800/70">
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
              className="relative z-10 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black text-[11px] sm:text-xs rounded-2xl shadow-[0_4px_0_0_#9f1239] active:translate-y-1 active:shadow-none transition-all cursor-pointer whitespace-nowrap border border-pink-400/40"
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
        onClose={() => setSelectedNode(null)}
        onStart={handleStartNode}
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
