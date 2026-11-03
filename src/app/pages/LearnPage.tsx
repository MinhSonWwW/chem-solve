import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Compass, ChevronRight, BookOpen } from 'lucide-react';
import { SnakePath, type PathNode, NodePreviewDrawer, ChapterGuideModal, SubjectSelectorModal, HandDrawnIcon, DoodleOrnament } from '@/design-system';
import { sound } from '@/lib/audio';
import { assetUrl } from '@/lib/utils';
import { getCurriculum, type Grade, type Lesson, type NodeInfo, type Chapter } from '@/content/curriculum';
import { useUserStore } from '@/features/gamification/useUserStore';
import { loadUserProgress, saveUserProgress } from '@/engine/progress';
import { useActiveSubject, useActiveGrade, setActiveGrade, SUBJECTS } from '@/content/subjects';
import { useOnboarding, WelcomeOnboardingTour } from '@/features/onboarding';

export const LearnPage: React.FC = () => {
  const { grade } = useParams<{ grade: string }>();
  const navigate = useNavigate();
  const { completedNodes, hearts, addGems, addXp } = useUserStore();
  const { subject: activeSubject, setSubject: setActiveSubjectState } = useActiveSubject();
  const { setGrade: setActiveGradeState } = useActiveGrade();
  const { shouldShowOnboarding, completeOnboarding } = useOnboarding();
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const currentSub = useMemo(() => SUBJECTS.find((s) => s.id === activeSubject) || SUBJECTS[0], [activeSubject]);

  const currentGrade = (parseInt(grade || (typeof window !== 'undefined' ? localStorage.getItem('chem_active_grade') || '8' : '8'), 10) as Grade) || 8;
  const curriculum = useMemo(() => getCurriculum(currentGrade, activeSubject), [currentGrade, activeSubject]);

  useEffect(() => {
    setActiveGrade(currentGrade);
    setActiveGradeState(currentGrade);
  }, [currentGrade, setActiveGradeState]);

  // Sync route whenever grade changes from external modals (like Onboarding tour)
  useEffect(() => {
    const handleGradeChanged = (e: Event) => {
      const g = (e as CustomEvent<Grade>).detail;
      if (g && String(g) !== grade) {
        navigate(`/learn/${g}`, { replace: true });
      }
    };
    window.addEventListener('chem_grade_changed', handleGradeChanged);
    return () => window.removeEventListener('chem_grade_changed', handleGradeChanged);
  }, [grade, navigate]);

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
      Object.keys(completedNodes).filter((k) => completedNodes[k] && !k.includes(':practice'))
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

      if (canUnlock && isComp) {
        const compData = completedNodes[item.key];
        const stars = Math.min(3, Math.max(1, Math.round((compData?.accuracy ?? 1) * 3)));
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
        canUnlock = false;
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
      <div className="learn-subject-bar bg-[var(--bg-surface)] border border-[var(--border)] p-3 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 border bg-[var(--subject-tint)] border-[var(--subject-edge)] text-[var(--subject-fg)] shadow-inner">
            {currentSub.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[var(--text-primary)]">{currentSub.name} THCS</span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md border tracking-wider bg-[var(--subject-tint)] text-[var(--subject-fg)] border-[var(--subject-edge)]">
                {currentSub.badge}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] font-medium line-clamp-1">
              {currentSub.tagline}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setShowSubjectModal(true);
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-surface-2)] hover:bg-[var(--border)] border border-[var(--border)] text-xs font-black text-[var(--subject-fg)] hover:text-[var(--text-primary)] transition-colors cursor-pointer shrink-0"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Đổi môn</span>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
        </button>
      </div>

      {/* Physics Placeholder for grades without ready lessons yet (7, 8, 9) */}
      {activeSubject === 'physics' && chaptersWithNodes.every((c) => c.pathNodes.length === 0) && (
        <div className="space-y-6">
          {/* Grade Selector for Physics */}
          <div className="flex bg-[var(--bg-surface)] border border-[var(--border)] p-1.5 rounded-2xl">
            {([6, 7, 8, 9] as Grade[]).map((g) => (
              <button
                key={g}
                onClick={() => {
                  sound.playClick();
                  navigate(`/learn/${g}`);
                }}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  currentGrade === g
                    ? 'bg-[var(--phy-fill)] text-white shadow-[0_3px_0_0_var(--phy-edge)]'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border)] p-6 sm:p-8 rounded-3xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--phy-tint)] border border-[var(--phy-edge)] text-[var(--phy-fg)] flex items-center justify-center mx-auto shadow-inner">
              <HandDrawnIcon name="atom" size={36} />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-[var(--phy-fg)] tracking-wider bg-[var(--phy-tint)] px-3 py-1 rounded-xl border border-[var(--phy-edge)] inline-block">
                HẠ TẦNG VẬT LÝ SẴN SÀNG · LỚP {currentGrade}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">{curriculum.title}</h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
                Khung chương trình, bộ hằng số, công thức và bàn phím Vật lý đã được thiết lập. Hệ thống sẵn sàng tạo chặng học ngay khi bạn cung cấp danh sách bài học!
              </p>
            </div>

            {/* Chapters list */}
            <div className="space-y-3 text-left max-w-lg mx-auto pt-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-[var(--phy-fg)] flex items-center justify-between">
                <span>CÁC CHƯƠNG LỚP {currentGrade} ({curriculum.chapters.length} chương)</span>
                <span className="text-[10px] text-[var(--text-tertiary)] font-normal">Chờ danh sách bài</span>
              </div>
              {curriculum.chapters.map((ch) => (
                <div key={ch.id} className="p-3.5 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] hover:border-[var(--phy-edge)] transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-[var(--text-primary)]">{ch.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--phy-tint)] text-[var(--phy-fg)] border border-[var(--phy-edge)] shrink-0">
                      Sẵn sàng nạp bài
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed">{ch.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  navigate('/learn/6');
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-[var(--phy-fill)] hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-[0_4px_0_0_var(--phy-edge)] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <HandDrawnIcon name="atom" size={18} />
                <span>Học Vật lý Lớp 6 (Unit 0 Đo lường)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Curriculum Snake Path View (Chemistry, Physics, or Biology) */}
      {(activeSubject === 'chem' || activeSubject === 'bio' || (activeSubject === 'physics' && chaptersWithNodes.some((c) => c.pathNodes.length > 0))) && (
        <>
          {/* 1. Grade Selector (3D chunky tabs) */}
          <div className="learn-grade-selector flex bg-[var(--bg-surface)] border border-[var(--border)] p-1.5 rounded-2xl">
            {([6, 7, 8, 9] as Grade[]).map((g) => (
              <button
                key={g}
                onClick={() => {
                  sound.playClick();
                  navigate(`/learn/${g}`);
                }}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  currentGrade === g
                    ? 'bg-[var(--subject-fill)] text-white shadow-[0_3px_0_0_var(--subject-edge)]'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>

          {/* 2. Chapters & Snake Paths */}
          {chaptersWithNodes.map(({ chapter, pathNodes, nodeLessonMap }) => (
            <div key={chapter.id} className="space-y-3">
              {/* ─── Chapter Banner — Sổ tay phòng thí nghiệm ─── */}
              <div
                className="relative rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)]"
              >
                {/* Nhãn dán chương — sticker label dán chéo */}
                <div
                  className="absolute -left-2 top-4 z-10 px-3 py-0.5 text-[9px] font-black uppercase tracking-widest bg-[var(--subject-fill)] text-white shadow-sm"
                  style={{ transform: 'rotate(-1.5deg)' }}
                >
                  {activeSubject === 'physics' || activeSubject === 'bio'
                    ? `UNIT ${chapter.chapterNumber}`
                    : `CHƯƠNG ${chapter.chapterNumber}`}
                </div>

                {/* Nội dung chính */}
                <div className="p-4 sm:p-5 pt-5 flex items-center justify-between gap-3">
                  {/* Left: Icon vẽ tay môn + text */}
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Icon vẽ tay lớn — đặc trưng môn học */}
                    <div
                      className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border bg-[var(--subject-tint)] border-[var(--subject-edge)] text-[var(--subject-fg)]"
                    >
                      <HandDrawnIcon
                        name={activeSubject === 'physics' ? 'atom' : activeSubject === 'bio' ? 'dna' : 'flask'}
                        size={30}
                      />
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <h2 className="text-sm sm:text-base font-black text-[var(--text-primary)] leading-tight line-clamp-2">
                        {chapter.title}
                      </h2>
                      <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1">
                        {chapter.description}
                      </p>
                      {/* Gạch chân lượn sóng dưới tiêu đề */}
                      <DoodleOrnament name="wavy-underline" color="var(--subject-fg)" />
                    </div>
                  </div>

                  {/* Right: Nút Hướng dẫn chunky 3D */}
                  <button
                    onClick={() => {
                      sound.playClick();
                      setSelectedChapterGuide(chapter);
                    }}
                    className="relative z-10 shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 font-black text-[10px] rounded-2xl active:translate-y-[4px] active:shadow-none transition-all duration-100 cursor-pointer whitespace-nowrap bg-[var(--subject-fill)] text-white shadow-[0_4px_0_0_var(--subject-edge)] border border-[var(--subject-edge)]"
                    title="Xem sổ tay kiến thức chương"
                  >
                    <BookOpen className="w-5 h-5 text-white stroke-[2.5]" />
                    <span className="tracking-wide">HƯỚNG DẪN</span>
                  </button>
                </div>
              </div>

              {/* Duolingo Snake Path */}
              <SnakePath
                nodes={pathNodes}
                onNodeClick={(node) => handleNodeClick(node, nodeLessonMap)}
                subject={activeSubject as 'chem' | 'physics' | 'bio'}
              />
            </div>
          ))}

          {chaptersWithNodes.length === 0 && (
            <div className="py-12 px-4 text-center space-y-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl">
              <img
                src={assetUrl('/assets/ui/empty-no-lessons.png')}
                alt="Chưa có bài học"
                className="w-32 h-32 object-contain mx-auto drop-shadow-md select-none pointer-events-none"
              />
              <p className="text-base font-bold text-[var(--text-primary)]">Chưa có bài học cho khối Lớp {currentGrade}</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Hãy chọn khối lớp khác hoặc chuyển sang môn học khác từ thanh chọn môn để tiếp tục hành trình khám phá!
              </p>
            </div>
          )}
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

      {/* 6. Welcome Onboarding Tour (Interactive Walkthrough A-Z) */}
      <WelcomeOnboardingTour
        isOpen={shouldShowOnboarding}
        onClose={completeOnboarding}
      />
    </div>
  );
};
