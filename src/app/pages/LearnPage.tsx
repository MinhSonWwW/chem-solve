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

          // Next node is only unlocked if this one was completed
          isPreviousNodeDone = isCompleted;
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
          {/* Chapter Banner */}
          <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-900 border-2 border-cyan-800/40 p-4 rounded-3xl flex items-center justify-between shadow-xl">
            <div className="space-y-0.5 max-w-[75%]">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                Chương {chapter.chapterNumber} · Lớp {currentGrade}
              </span>
              <h1 className="text-base font-black text-slate-100 leading-snug">
                {chapter.title}
              </h1>
              <p className="text-[11px] text-slate-400 truncate">
                {chapter.description}
              </p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setSelectedChapterGuide(chapter);
              }}
              className="flex flex-col items-center gap-1 p-2.5 bg-slate-800/90 hover:bg-slate-700/90 border border-cyan-500/30 rounded-2xl shadow-[0_3px_0_0_#0e7490] active:translate-y-1 active:shadow-none transition-all cursor-pointer text-cyan-300"
              title="Xem sổ tay kiến thức chương"
            >
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span className="text-[9px] font-extrabold uppercase tracking-tight">Sổ tay</span>
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
