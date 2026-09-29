import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, FlaskConical, Heart as HeartIcon, Zap } from 'lucide-react';
import { useUserStore } from '@/features/gamification/useUserStore';
import {
  Button,
  Card,
  Progress,
  Heart,
  GemBadge,
  Formula,
  FeedbackSheet,
  SessionCompleteScreen,
  QuitModal,
  OutOfHeartsModal,
  QuickReferenceDrawer,
  ComboBanner,
  McqPanel,
  TrueFalsePanel,
  NumberInput,
  FormulaInput,
  MatchGrid,
  OrderingList,
  EquationInput,
  SortPanel,
  FormulaBuilderPanel,
  ChemKeyboard,
  PhysicsKeyboard,
  PhysicsVisualizer,
  type PhysicsVisualizerMode,
  type PhysicsEffectData,
} from '@/design-system';
import { sound } from '@/lib/audio';
import { loadExercisesForNode } from '@/content/contentLoader';
import { loadSession, clearSession } from '@/engine/progress';
import { GAMIFICATION } from '@/config/gamification';
import { setActiveSubject } from '@/content/subjects';
import type { Exercise } from '@/content/schema/exercise';
import type { Verdict } from '@/engine/checkers/types';

type LoadingState = 'loading' | 'ready' | 'error';

const CHEMISTRY_TRIVIA = [
  'Oxy chiếm 21% thể tích không khí và là nguyên tố phổ biến nhất trong vỏ Trái Đất.',
  'Kim cương và than chì cùng cấu tạo từ nguyên tử Carbon, chỉ khác nhau ở cấu trúc mạng tinh thể.',
  'Nước (H2O) có khối lượng riêng lớn nhất ở 4°C, giúp sinh vật thủy sinh không bị đông đá vào mùa đông.',
  'Acid trong dạ dày (HCl) có nồng độ pH từ 1.5 - 3.5, đủ mạnh để hòa tan nhiều kim loại thông thường.',
  'Khí Heli nhẹ hơn không khí khoảng 7 lần và hoàn toàn trơ, rất an toàn để bơm bóng thám không.',
  'Muối ăn (NaCl) được tạo bởi kim loại hoạt động mạnh (Natri) và khí độc màu vàng lục (Clo).',
];

const PHYSICS_TRIVIA = [
  'Ánh sáng truyền đi trong chân không với tốc độ xấp xỉ 300 000 km/s — đi hết 7,5 vòng Trái Đất trong 1 giây!',
  'Thủy ngân là kim loại duy nhất ở thể lỏng ở nhiệt độ phòng và có khối lượng riêng rất lớn: 13 600 kg/m³.',
  'Trọng lực ở Mặt Trăng chỉ bằng khoảng 1/6 so với Trái Đất, giúp các nhà du hành nhảy rất cao!',
  'Nhiệt kế y tế có chỗ thắt hẹp gần bầu để giữ mức thủy ngân không tự tụt xuống sau khi lấy ra khỏi cơ thể.',
  'Thang nhiệt độ Celsius lấy điểm đóng băng của nước tinh khiết là 0 °C và điểm sôi là 100 °C.',
  'Nhiệt độ thấp nhất trên thang Kelvin là Độ không tuyệt đối (0 K hay -273,15 °C), nơi mọi chuyển động nhiệt ngừng lại.',
];

const ChemicalLoadingScreen: React.FC<{ isPhysics?: boolean }> = ({ isPhysics }) => {
  const [triviaIndex, setTriviaIndex] = useState(0);
  const triviaList = isPhysics ? PHYSICS_TRIVIA : CHEMISTRY_TRIVIA;

  useEffect(() => {
    const timer = setInterval(() => {
      setTriviaIndex((prev) => (prev + 1) % triviaList.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [triviaList.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[82dvh] px-4 select-none">
      <div className="max-w-sm w-full flex flex-col items-center text-center space-y-6">
        {/* Animated laboratory flask with bubbling effect */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Outer glowing aura */}
          <div className="absolute inset-0 rounded-full bg-cyan-500/15 blur-xl animate-pulse" />

          {/* Flask container */}
          <div className="relative w-20 h-20 rounded-3xl bg-[#131f24] border-2 border-cyan-400/50 shadow-[0_6px_0_0_#0284c7] flex items-center justify-center overflow-hidden">
            {/* Liquid level */}
            <div className="absolute bottom-0 inset-x-0 h-11 bg-gradient-to-t from-cyan-500/40 to-teal-400/20 border-t border-cyan-400/50" />

            {/* Rising bubbling particles */}
            <motion.div
              animate={{ y: [16, -18], opacity: [0, 1, 0], scale: [0.6, 1.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeOut' }}
              className="absolute w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-sm"
              style={{ left: '35%' }}
            />
            <motion.div
              animate={{ y: [18, -20], opacity: [0, 1, 0], scale: [0.5, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.8, delay: 0.4, ease: 'easeOut' }}
              className="absolute w-2 h-2 rounded-full bg-teal-200 shadow-sm"
              style={{ left: '55%' }}
            />
            <motion.div
              animate={{ y: [14, -16], opacity: [0, 1, 0], scale: [0.4, 0.9, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: 0.7, ease: 'easeOut' }}
              className="absolute w-1.5 h-1.5 rounded-full bg-sky-200 shadow-sm"
              style={{ left: '46%' }}
            />

            <FlaskConical className="w-10 h-10 text-cyan-400 drop-shadow-md z-10 animate-bounce duration-1000" />
          </div>
        </div>

        {/* Loading text & progress bar */}
        <div className="space-y-2 w-full max-w-xs">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-sm font-black text-slate-200 tracking-wide">
              {isPhysics ? 'Đang chuẩn bị dụng cụ thí nghiệm…' : 'Đang chuẩn bị phòng thí nghiệm…'}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#131f24] border border-[#2e4756] overflow-hidden p-0.5">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="w-1/2 h-full rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            />
          </div>
        </div>

        {/* Trivia Flashcard */}
        <div className="w-full bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24] rounded-2xl p-4 text-left relative overflow-hidden">
          <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-black uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isPhysics ? 'Góc khám phá Vật lý' : 'Góc khám phá Hóa học'}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed min-h-[36px]">
            {triviaList[triviaIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ExercisePage: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId = 'g8-b03', nodeId = 'n01' } = useParams();
  const [searchParams] = useSearchParams();
  const isPracticeMode = searchParams.get('mode') === 'practice';
  const isPhysics = lessonId.startsWith('phy-');
  const gradeNumber = lessonId.match(/(?:phy-)?g(\d)/)?.[1] ?? '8';

  const {
    hearts: _hearts,
    gems,
    buyHeartWithGems,
    sessionState,
    lastVerdict,
    startSession,
    resumeSession,
    dispatch,
    submitAnswer,
    endSession,
    streak,
  } = useUserStore();

  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [showXpFly, setShowXpFly] = useState(false);
  const [showHeartFly, setShowHeartFly] = useState(false);
  const [recoveredHeartsCount, setRecoveredHeartsCount] = useState(0);
  const [showChemKeyboard, setShowChemKeyboard] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showOutOfHeartsModal, setShowOutOfHeartsModal] = useState(false);
  const [showReferenceDrawer, setShowReferenceDrawer] = useState(false);
  const [showComboBanner, setShowComboBanner] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [sessionResult, setSessionResult] = useState<{
    totalXp: number;
    accuracy: number;
    perfectRun: boolean;
    earnedGems?: number;
  } | null>(null);

  // ── Load exercises & resume ──
  useEffect(() => {
    let cancelled = false;
    setActiveSubject(isPhysics ? 'physics' : 'chem');

    async function init() {
      try {
        setLoadingState('loading');

        // If user has 0 hearts and is not in practice mode, they cannot start a lesson
        const currentHearts = useUserStore.getState().hearts;
        if (!isPracticeMode && currentHearts <= 0) {
          setShowOutOfHeartsModal(true);
          setLoadingState('ready');
          return;
        }

        const sessionKey = isPracticeMode ? `${lessonId}:practice` : lessonId;

        // Try to resume saved session first (strictly verify matching practice vs learn mode)
        const saved = await loadSession(sessionKey, nodeId);
        if (
          saved &&
          !saved.sessionState.isSessionComplete &&
          Boolean(saved.sessionState.isPractice) === isPracticeMode
        ) {
          saved.sessionState.isPractice = isPracticeMode;
          resumeSession(sessionKey, nodeId, saved.sessionState);
          if (!cancelled) setLoadingState('ready');
          return;
        }

        // Load fresh targeted exercises for this specific milestone node
        const exercises = await loadExercisesForNode(lessonId, nodeId);
        if (exercises.length === 0) {
          throw new Error('Không tìm thấy bài tập cho bài học này.');
        }

        // Pedagogical Scaffolding: Sort exercises from Easy to Hard (Difficulty 1 -> 2 -> 3).
        // Shuffle within the same difficulty level so questions remain fresh on replay,
        // but easier foundational questions always come before complex calculations.
        const diff1 = exercises.filter((q) => (q.difficulty ?? 1) === 1);
        const diff2 = exercises.filter((q) => (q.difficulty ?? 1) === 2);
        const diff3 = exercises.filter((q) => (q.difficulty ?? 1) >= 3);

        const shuffleArray = <T,>(arr: T[]): T[] => {
          const copy = [...arr];
          for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
          }
          return copy;
        };

        const sortedExercises = [
          ...shuffleArray(diff1),
          ...shuffleArray(diff2),
          ...shuffleArray(diff3),
        ];

        startSession(sessionKey, nodeId, sortedExercises, undefined, isPracticeMode);
        if (!cancelled) setLoadingState('ready');
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : 'Lỗi không xác định');
          setLoadingState('error');
        }
      }
    }

    init();
    return () => { cancelled = true; };
  }, [lessonId, nodeId]);

  // ── Derived state ──
  const currentQ = useMemo(() => {
    if (!sessionState) return null;
    return sessionState.questions[sessionState.currentIndex] ?? null;
  }, [sessionState]);

  const exercise = currentQ?.exercise ?? null;
  const status = currentQ?.status ?? 'unanswered';
  const isCompleted = currentQ?.isCompleted ?? false;

  const isFeedbackVisible =
    !showOutOfHeartsModal &&
    (status === 'correct' ||
      status === 'wrong' ||
      status === 'partial' ||
      status === 'revealed');

  const feedbackStatus = isFeedbackVisible
    ? (status as 'correct' | 'wrong' | 'partial' | 'revealed')
    : 'idle';

  const attemptsLeft = currentQ
    ? GAMIFICATION.maxAttempts - currentQ.attemptsCount
    : 0;

  // ── Physics Interactive Sandbox / Mini-game Mode ──
  const physicsVisualMode = useMemo<PhysicsVisualizerMode | null>(() => {
    if (!isPhysics || !exercise) return null;
    if (exercise.visual?.mode) {
      return exercise.visual.mode as PhysicsVisualizerMode;
    }
    const lid = exercise.lessonId;
    const pLower = (exercise.prompt || '').toLowerCase();

    // 1. Potential energy & Gravitational height (Grade 9 Unit 1: Cơ năng, thế năng, độ cao)
    if (
      pLower.includes('thế năng') ||
      pLower.includes('mốc thế năng') ||
      pLower.includes('rơi từ') ||
      pLower.includes('rơi tự do') ||
      pLower.includes('thả rơi') ||
      pLower.includes('gác lửng') ||
      pLower.includes('lan can') ||
      (pLower.includes('độ cao') && !pLower.includes('thước')) ||
      exercise.skillIds?.some((s) => s.includes('potential'))
    ) {
      return 'potential-height';
    }

    // 2. Kinetic energy & Speed (Grade 9 Unit 1: Động năng, tốc độ)
    if (
      pLower.includes('động năng') ||
      pLower.includes('tốc độ') ||
      pLower.includes('vận tốc') ||
      pLower.includes('m/s') ||
      pLower.includes('km/h') ||
      pLower.includes('quả bóng') ||
      exercise.skillIds?.some((s) => s.includes('kinetic'))
    ) {
      return 'kinetic-speed';
    }

    // 3. Optics & Converging lens (Grade 9 Unit 2: Thấu kính, quang học)
    if (
      pLower.includes('thấu kính') ||
      pLower.includes('tiêu cự') ||
      pLower.includes('quang tâm') ||
      pLower.includes('ảnh thật') ||
      pLower.includes('ảnh ảo') ||
      exercise.skillIds?.some((s) => s.includes('lens') || s.includes('optics'))
    ) {
      return 'optics-lens';
    }

    // 4. Circuit diagram (Grade 9 Unit 3 / Grade 8 / Grade 7 electricity)
    if (
      pLower.includes('đoạn mạch') ||
      pLower.includes('mạch điện') ||
      pLower.includes('định luật ôm') ||
      pLower.includes('ampe kế') ||
      pLower.includes('vôn kế') ||
      (pLower.includes('điện trở') && !pLower.includes('thước'))
    ) {
      return 'circuit-diagram';
    }

    // 5. Spring stretch & Dynamometer (Specific to springs, NOT general weight)
    if (
      lid === 'phy-g6-b07' ||
      lid === 'phy-g6-b08' ||
      lid === 'phy-g6-b09' ||
      pLower.includes('lò xo') ||
      pLower.includes('lực kế') ||
      pLower.includes('độ dãn')
    ) {
      return 'spring-scale';
    }

    // 6. Length measurement
    if (lid === 'phy-g6-b01' || pLower.includes('thước kẻ') || pLower.includes('đo chiều dài') || pLower.includes('đcnn')) {
      return 'ruler-measurement';
    }

    // 7. Temperature measurement
    if (lid === 'phy-g6-b04' || pLower.includes('nhiệt kế') || pLower.includes('thang celsius')) {
      return 'thermometer';
    }

    // 8. Vector Force representation
    if (lid === 'phy-g6-b06' || pLower.includes('biểu diễn lực') || pLower.includes('mũi tên lực') || pLower.includes('tỉ xích')) {
      return 'vector-force';
    }

    // 9. Lever & Balance (Grade 8)
    if (lid.includes('don-bay') || pLower.includes('đòn bẩy') || pLower.includes('điểm tựa')) {
      return 'lever-balance';
    }

    // 10. Moon phases & Orbit
    if (lid === 'phy-g6-b18' || pLower.includes('mặt trăng') || pLower.includes('tuần trăng') || pLower.includes('pha mặt trăng')) {
      return 'moon-phases';
    }

    // 11. Solar System & Celestial Bodies
    if (
      lid === 'phy-g6-b19' ||
      lid === 'phy-g6-b20' ||
      lid === 'phy-g6-b17' ||
      pLower.includes('hành tinh') ||
      pLower.includes('hệ mặt trời') ||
      pLower.includes('ngân hà')
    ) {
      return 'solar-system';
    }

    return null;
  }, [isPhysics, exercise]);

  const physicsParams = useMemo(() => {
    if (!exercise?.prompt) return undefined;
    const p = exercise.prompt;

    // Mass: m = 0,4 kg or 2.5 kg or 250 g
    let mass: number | undefined;
    const massKgMatch = p.match(/(?:m\s*=\s*|khối lượng\s*(?:là\s*)?)(\d+(?:[.,]\d+)?)\s*kg/i);
    if (massKgMatch) {
      mass = parseFloat(massKgMatch[1].replace(',', '.'));
    } else {
      const massGMatch = p.match(/(?:m\s*=\s*|khối lượng\s*(?:là\s*)?)(\d+(?:[.,]\d+)?)\s*g\b/i);
      if (massGMatch) {
        mass = parseFloat(massGMatch[1].replace(',', '.')) / 1000;
      }
    }

    // Height: h = 6 m or 3,6 m
    let height: number | undefined;
    const heightMatch = p.match(/(?:h\s*=\s*|độ cao\s*(?:là\s*)?)(\d+(?:[.,]\d+)?)\s*m\b/i);
    if (heightMatch) {
      height = parseFloat(heightMatch[1].replace(',', '.'));
    }

    // Velocity / Speed: v = 15 m/s
    let velocity: number | undefined;
    const velocityMatch = p.match(/(?:v\s*=\s*|tốc độ\s*(?:là\s*)?)(\d+(?:[.,]\d+)?)\s*m\/s/i);
    if (velocityMatch) {
      velocity = parseFloat(velocityMatch[1].replace(',', '.'));
    }

    // Force: P = 250 N or F = 30 N
    let force: number | undefined;
    const forceMatch = p.match(/(?:[PF]\s*=\s*|lực\s*(?:là\s*)?)(\d+(?:[.,]\d+)?)\s*N\b/i);
    if (forceMatch) {
      force = parseFloat(forceMatch[1].replace(',', '.'));
      if (force && !mass) {
        mass = +(force / 10).toFixed(1);
      }
    }

    // Focal length / distance for optics: f = 12 cm, d = 24 cm
    let focalLength: number | undefined;
    const fMatch = p.match(/(?:f\s*=\s*|tiêu cự\s*(?:là\s*)?)(\d+(?:[.,]\d+)?)\s*cm\b/i);
    if (fMatch) {
      focalLength = parseFloat(fMatch[1].replace(',', '.'));
    }

    let distance: number | undefined;
    const dMatch = p.match(/(?:d\s*=\s*|khoảng cách\s*(?:là\s*)?)(\d+(?:[.,]\d+)?)\s*cm\b/i);
    if (dMatch) {
      distance = parseFloat(dMatch[1].replace(',', '.'));
    }

    return { mass, height, velocity, force, focalLength, distance };
  }, [exercise?.prompt]);

  const initialVisualValue = useMemo(() => {
    if (!exercise?.prompt) return undefined;
    const matchNum = exercise.prompt.match(/(\d+(?:[.,]\d+)?)\s*(?:g|cm|°C|N)/i);
    if (matchNum) {
      return parseFloat(matchNum[1].replace(',', '.'));
    }
    return undefined;
  }, [exercise?.prompt]);

  // ── Handlers ──
  const handleSetInput = useCallback(
    (value: unknown) => {
      dispatch({ type: 'SET_INPUT', payload: value });
    },
    [dispatch]
  );

  const handleCheck = useCallback(() => {
    if (!currentQ || currentQ.userInput == null) return;
    submitAnswer();

    // Check updated session state after submission
    const sessionKey = isPracticeMode ? `${lessonId}:practice` : lessonId;
    const updated = useUserStore.getState().sessionState;
    if (updated) {
      const q = updated.questions[updated.currentIndex];
      if (q?.status === 'correct') {
        setShowXpFly(true);
        setTimeout(() => setShowXpFly(false), 1200);

        if (updated.comboStreak >= 2) {
          setComboCount(updated.comboStreak);
          setShowComboBanner(true);
          setTimeout(() => setShowComboBanner(false), 2400);
        }
      } else if (!isPracticeMode && updated.hearts <= 0) {
        // Failed session! Clear in-progress session so it doesn't linger
        clearSession(sessionKey, nodeId).catch(console.error);
        sound.playWrong();
        setShowOutOfHeartsModal(true);
      }
    }
  }, [currentQ, submitAnswer, isPracticeMode, lessonId, nodeId]);

  const handleNext = useCallback(async () => {
    sound.playClick();

    if (!sessionState) return;

    // Check if this was the last question
    const nextIndex = sessionState.currentIndex + 1;
    const isLast = nextIndex >= sessionState.questions.length;

    dispatch({ type: 'NEXT_QUESTION' });

    if (isLast) {
      const result = await endSession();
      if (result) {
        if (isPracticeMode) {
          sound.playLevelUp();
          setShowHeartFly(true);
          setRecoveredHeartsCount(1);
          setTimeout(() => setShowHeartFly(false), 2400);
        }
        setSessionResult(result);
      }
    }
  }, [sessionState, dispatch, endSession, isPracticeMode]);

  const handleRetry = useCallback(() => {
    sound.playClick();
    dispatch({ type: 'DISMISS_FEEDBACK' });
  }, [dispatch]);

  const handleExit = useCallback(() => {
    sound.playClick();
    setShowQuitModal(true);
  }, []);

  // ── ChemKeyboard handlers ──
  const handleChemInsert = useCallback(
    (text: string) => {
      if (!currentQ) return;
      const current = (currentQ.userInput as string) ?? '';
      handleSetInput(current + text);
    },
    [currentQ, handleSetInput]
  );

  const handleChemDelete = useCallback(() => {
    if (!currentQ) return;
    const current = (currentQ.userInput as string) ?? '';
    handleSetInput(current.slice(0, -1));
  }, [currentQ, handleSetInput]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      if (e.key === 'Enter') {
        if (!isFeedbackVisible && currentQ?.userInput != null && currentQ.userInput !== '') {
          handleCheck();
        } else if (isFeedbackVisible && isCompleted) {
          handleNext();
        } else if (isFeedbackVisible && !isCompleted) {
          handleRetry();
        }
      }

      // 1, 2, 3, 4 and A, B, C, D shortcuts for MCQ when not typing in text field
      if (!isInput && !isFeedbackVisible && exercise?.answer) {
        let optIndex = -1;
        const keyUpper = e.key.toUpperCase();
        if (['1', '2', '3', '4'].includes(e.key)) {
          optIndex = parseInt(e.key, 10) - 1;
        } else if (['A', 'B', 'C', 'D'].includes(keyUpper)) {
          optIndex = keyUpper.charCodeAt(0) - 65; // A -> 0, B -> 1, C -> 2, D -> 3
        }

        if (exercise.answer.kind === 'mcq-single') {
          if (optIndex >= 0 && optIndex < exercise.answer.options.length) {
            const opt = exercise.answer.options[optIndex];
            if (opt) {
              sound.playClick();
              handleSetInput(opt.id);
            }
          }
        } else if (exercise.answer.kind === 'mcq-multi') {
          if (optIndex >= 0 && optIndex < exercise.answer.options.length) {
            const opt = exercise.answer.options[optIndex];
            if (opt) {
              sound.playClick();
              const current = (currentQ?.userInput as string[] | null) ?? [];
              const next = current.includes(opt.id)
                ? current.filter((x) => x !== opt.id)
                : [...current, opt.id];
              handleSetInput(next);
            }
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFeedbackVisible, isCompleted, currentQ, exercise, handleCheck, handleNext, handleRetry, handleSetInput]);

  // ── Session complete screen ──
  if (sessionResult) {
    return (
      <SessionCompleteScreen
        totalXp={sessionResult.totalXp}
        accuracy={sessionResult.accuracy}
        perfectRun={sessionResult.perfectRun}
        earnedGems={sessionResult.earnedGems}
        totalQuestions={sessionState?.questions.length ?? 0}
        correctCount={
          sessionState?.questions.filter((q) => q.status === 'correct').length ?? 0
        }
        streak={streak}
        isPractice={isPracticeMode}
        recoveredHearts={recoveredHeartsCount}
        onContinue={() => {
          if (isPracticeMode) {
            navigate('/practice');
          } else {
            navigate(`/learn/${gradeNumber}`);
          }
        }}
      />
    );
  }

  // ── Chemical Loading state ──
  if (loadingState === 'loading') {
    return <ChemicalLoadingScreen isPhysics={isPhysics} />;
  }

  // ── Error state ──
  if (loadingState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80dvh] gap-4 text-center">
        <div className="text-4xl">⚗️</div>
        <h2 className="text-lg font-black text-slate-200">Có lỗi xảy ra</h2>
        <p className="text-sm text-slate-400">{errorMsg}</p>
        <Button variant="primary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    );
  }

  if (!sessionState || !currentQ || !exercise) {
    return null;
  }

  // ── Diagnosis from commonMistakes ──
  const diagnosis =
    lastVerdict?.status === 'incorrect' && lastVerdict.diagnosis
      ? lastVerdict.diagnosis
      : lastVerdict?.status === 'incorrect' && lastVerdict.mistakeId
        ? exercise.commonMistakes?.find((m) => m.id === lastVerdict.mistakeId)
            ?.message
        : undefined;

  const progressPercent = Math.round(
    ((sessionState.currentIndex + (isCompleted ? 1 : 0)) /
      sessionState.questions.length) *
      100
  );

  const answerKind = exercise.answer.kind;
  const showChemKb =
    showChemKeyboard && (answerKind === 'formula' || answerKind === 'equation');

  return (
    <div className="flex flex-col justify-between min-h-[92dvh] relative overflow-x-hidden">
      {/* 1. Top Bar */}
      <div className="flex items-center justify-between gap-2.5 pb-3 border-b border-slate-800">
        <button
          onClick={handleExit}
          className="p-1.5 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
          aria-label="Đóng bài tập"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <Progress value={progressPercent} color={isPhysics ? 'amber' : 'primary'} />
        </div>

        {/* Practice Mode Badge */}
        {isPracticeMode && (
          <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-black uppercase text-amber-300 bg-amber-950/70 border border-amber-500/50 px-2.5 py-1 rounded-xl shadow-sm">
            <HeartIcon className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Luyện tập · Hồi tim</span>
          </div>
        )}

        {/* Reference Button */}
        <button
          onClick={() => {
            sound.playClick();
            setShowReferenceDrawer(true);
          }}
          className={`p-1.5 px-2 rounded-xl bg-slate-900 border text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
            isPhysics
              ? 'border-amber-500/50 text-amber-300 hover:text-amber-200 hover:bg-slate-800'
              : 'border-slate-700/80 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800'
          }`}
          title={isPhysics ? 'Tra cứu công thức & hằng số Vật lý' : 'Tra cứu nguyên tử khối & hóa trị'}
        >
          {isPhysics ? <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> : <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />}
          <span className="hidden sm:inline">{isPhysics ? 'Công thức' : 'Tra cứu'}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <GemBadge amount={gems} />
          <Heart count={sessionState.hearts} max={GAMIFICATION.hearts.max} />
        </div>
      </div>

      {/* 2. Floating XP popup */}
      <AnimatePresence>
        {showXpFly && currentQ.earnedXp > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.6 }}
            animate={{ opacity: 1, y: -40, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 300 }}
            className="absolute top-28 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black px-4 py-2 rounded-2xl shadow-[0_8px_20px_rgba(245,158,11,0.5)] border-2 border-amber-200 flex items-center gap-1.5 text-base">
              <Sparkles className="w-5 h-5 fill-slate-950 text-slate-950" />
              <span>+{currentQ.earnedXp} KN!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Heart popup in Practice mode */}
      <AnimatePresence>
        {showHeartFly && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.6 }}
            animate={{ opacity: 1, y: -40, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 300 }}
            className="absolute top-40 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black px-4 py-2 rounded-2xl shadow-[0_8px_20px_rgba(244,63,94,0.5)] border-2 border-rose-300 flex items-center gap-1.5 text-base">
              <HeartIcon className="w-5 h-5 fill-white text-white animate-pulse" />
              <span>+1 Tim hồi phục!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Question Area */}
      <motion.div
        animate={
          status === 'wrong' ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }
        }
        transition={{ duration: 0.4 }}
        className="my-auto space-y-4 py-4"
      >
        {/* Question meta & Review badge */}
        <div className="flex items-center justify-between">
          <div
            className={`text-[11px] font-black uppercase tracking-wide ${
              isPhysics ? 'text-amber-400 flex items-center gap-1' : 'text-cyan-400'
            }`}
          >
            {isPhysics && <Zap className="w-3.5 h-3.5 fill-amber-400" />}
            <span>
              {lessonId} · Câu {sessionState.currentIndex + 1}/{sessionState.questions.length}
            </span>
          </div>
          {currentQ.isReview && (
            <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-xl flex items-center gap-1">
              🔁 Cùng làm lại câu chưa đúng nhé!
            </span>
          )}
        </div>

        {/* Prompt Card */}
        <Card
          variant={isPhysics ? 'default' : 'erlenmeyer'}
          className={`space-y-3 relative overflow-hidden ${
            isPhysics
              ? 'border-2 border-amber-500/40 bg-[#18272f] shadow-[0_6px_0_0_#131f24]'
              : ''
          }`}
        >
          {isPhysics && (
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          )}
          <h2 className="text-base font-bold text-slate-100 leading-relaxed relative z-10">
            {renderPrompt(exercise.prompt)}
          </h2>

          {/* Dữ kiện / Cần tìm chips */}
          {(exercise.given || exercise.find) && (
            <div className="flex flex-wrap gap-2 pt-1 relative z-10">
              {exercise.given?.map((g, i) => (
                <span
                  key={i}
                  className={`text-[11px] px-2.5 py-1 rounded-xl border ${
                    isPhysics
                      ? 'bg-slate-800/90 border-slate-700 text-amber-200'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-300'
                  }`}
                >
                  📌 {renderPrompt(g.label)}: {g.value}
                  {g.unit ? ` ${g.unit}` : ''}
                </span>
              ))}
              {exercise.find && (
                <span
                  className={`text-[11px] px-2.5 py-1 rounded-xl border ${
                    isPhysics
                      ? 'bg-amber-950/60 border-amber-500/60 text-amber-300'
                      : 'bg-cyan-950/50 border-cyan-800/60 text-cyan-300'
                  }`}
                >
                  🎯 Cần tìm: {exercise.find.label}
                  {exercise.find.unit ? ` (${exercise.find.unit})` : ''}
                </span>
              )}
            </div>
          )}
        </Card>

        {/* Physics Interactive Mini-game / Sandbox directly integrated into lesson */}
        {physicsVisualMode && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-0.5"
          >
            <PhysicsVisualizer
              mode={physicsVisualMode}
              initialValue={initialVisualValue}
              params={physicsParams}
            />
          </motion.div>
        )}

        {/* Answer Area — dynamic by kind */}
        <AnswerRenderer
          exercise={exercise}
          userInput={currentQ.userInput}
          onInputChange={handleSetInput}
          disabled={status === 'checking' || isCompleted}
          verdict={isFeedbackVisible ? lastVerdict ?? undefined : undefined}
          onShowChemKeyboard={() => setShowChemKeyboard(true)}
          isPhysics={isPhysics}
        />
      </motion.div>

      {/* 4. Bottom Sticky Action Bar */}
      <div className="pt-2 border-t border-slate-800 safe-pb">
        {!isFeedbackVisible && (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            className={
              isPhysics
                ? 'bg-[#eab308] hover:bg-[#facc15] text-slate-950 font-black shadow-[0_4px_0_0_#ca8a04]'
                : ''
            }
            disabled={
              exercise.answer.kind === 'equation' && exercise.answer.mode === 'fill-coefficients'
                ? false
                : exercise.answer.kind === 'true-false'
                  ? !currentQ.userInput ||
                    typeof currentQ.userInput !== 'object' ||
                    exercise.answer.statements.some(
                      (st) => (currentQ.userInput as Record<string, boolean>)[st.id] === undefined
                    )
                  : currentQ.userInput == null || currentQ.userInput === ''
            }
            onClick={() => {
              if (exercise.answer.kind === 'equation' && exercise.answer.mode === 'fill-coefficients' && !currentQ.userInput) {
                const defaultCoeffs = new Array(exercise.answer.reactants.length + exercise.answer.products.length).fill(1);
                handleSetInput(defaultCoeffs);
              }
              handleCheck();
            }}
          >
            KIỂM TRA
          </Button>
        )}
      </div>

      {/* 5. Feedback Sheet */}
      {(() => {
        let reactionEffect: { type: 'gas' | 'precipitate' | 'indicator'; color: string; label: string } | undefined;
        
        // Exclude questions where ReactionVisualizer does NOT make sense or when studying Physics:
        const isMultiOrStepAnswer = ['match', 'ordering', 'sort', 'formula-builder', 'number'].includes(exercise.answer.kind);
        const finalSolLower = (exercise.finalSolution || '').toLowerCase();
        const promptLower = (exercise.prompt || '').toLowerCase();
        
        // Strictly exclude Physics from chemistry precipitate/gas visualizers
        if (isPhysics) {
          reactionEffect = undefined;
        } else {
          // Exclude general meta-discussion of signs (e.g., questions asking to list/distinguish signs)
          const isGeneralPhenomenaQuestion = promptLower.includes('dấu hiệu') && (promptLower.includes('nối') || promptLower.includes('ghép') || isMultiOrStepAnswer);

          if ((status === 'correct' || status === 'revealed') && !isMultiOrStepAnswer && !isGeneralPhenomenaQuestion) {
            // Specific indicator reaction
            if (finalSolLower.includes('quỳ tím') || promptLower.includes('nhúng giấy quỳ') || promptLower.includes('nhỏ quỳ tím')) {
              const isRed = finalSolLower.includes('đỏ') || promptLower.includes('acid') || promptLower.includes('axit');
              const isBlue = finalSolLower.includes('xanh') || promptLower.includes('base') || promptLower.includes('bazơ');
              if (isRed || isBlue) {
                reactionEffect = {
                  type: 'indicator',
                  color: isRed ? '#ef4444' : '#3b82f6',
                  label: isRed ? 'Hiện tượng: Quỳ tím hóa đỏ (Tính axit)' : 'Hiện tượng: Quỳ tím hóa xanh (Tính kiềm)',
                };
              }
            }
            // Specific precipitate reaction (must be affirmative specific precipitate, not "không kết tủa" or general listing)
            else if (
              (finalSolLower.includes('↓') || finalSolLower.includes('kết tủa') || promptLower.includes('kết tủa')) &&
              !finalSolLower.includes('không có kết tủa') &&
              !finalSolLower.includes('không tạo kết tủa') &&
              !promptLower.includes('không tạo kết tủa')
            ) {
              const isBlue = finalSolLower.includes('cu(oh)2') || finalSolLower.includes('xanh lam') || finalSolLower.includes('màu xanh');
              const isBrown = finalSolLower.includes('fe(oh)3') || finalSolLower.includes('nâu đỏ');
              const isWhite = finalSolLower.includes('baso4') || finalSolLower.includes('caco3') || finalSolLower.includes('agcl') || finalSolLower.includes('trắng') || promptLower.includes('kết tủa trắng');
              
              // Only show if a specific color or formula precipitate is identified
              if (isBlue || isBrown || isWhite || finalSolLower.includes('↓')) {
                reactionEffect = {
                  type: 'precipitate',
                  color: isBlue ? '#38bdf8' : isBrown ? '#b45309' : '#ffffff',
                  label: isBlue
                    ? '↓ Hiện tượng: Kết tủa xanh lam Cu(OH)2'
                    : isBrown
                    ? '↓ Hiện tượng: Kết tủa nâu đỏ Fe(OH)3'
                    : '↓ Hiện tượng: Kết tủa trắng',
                };
              }
            }
            // Specific gas evolution reaction
            else if (
              (finalSolLower.includes('↑') || finalSolLower.includes('sủi bọt khí') || finalSolLower.includes('thoát khí')) &&
              !finalSolLower.includes('không thoát khí') &&
              !promptLower.includes('không sinh ra khí')
            ) {
              reactionEffect = {
                type: 'gas',
                color: '#38bdf8',
                label: '↑ Hiện tượng: Sủi bọt khí bay lên',
              };
            }
          }
        }

        let physicsEffect: PhysicsEffectData | undefined;

        if (isPhysics && (status === 'correct' || status === 'revealed')) {
          if (physicsVisualMode === 'potential-height') {
            physicsEffect = {
              type: 'energy-surge',
              label: '⚡ Bừng sáng thế năng & cơ năng bảo toàn!',
              detail: 'Thế năng cực đại tại đỉnh chuyển hóa trọn vẹn thành động năng khi chạm đất (W = Wt + Wđ = hằng số).',
            };
          } else if (physicsVisualMode === 'kinetic-speed') {
            physicsEffect = {
              type: 'motion-burst',
              label: '⚡ Bừng sáng động năng & tốc độ!',
              detail: 'Động năng tỉ lệ thuận với khối lượng và bình phương tốc độ (Wđ = ½ · m · v²).',
            };
          } else if (physicsVisualMode === 'circuit-diagram') {
            physicsEffect = {
              type: 'electric-spark',
              label: '⚡ Mạch điện thông suốt - Định luật Ôm nghiệm đúng!',
              detail: 'Cường độ dòng điện tỉ lệ thuận với hiệu điện thế và tỉ lệ nghịch với điện trở (I = U / R).',
            };
          } else if (physicsVisualMode === 'optics-lens') {
            physicsEffect = {
              type: 'optics-beam',
              label: '💡 Chùm sáng khúc xạ chuẩn xác!',
              detail: 'Đường truyền các tia sáng đặc biệt qua thấu kính hội tụ xác định đúng vị trí và tính chất của ảnh.',
            };
          } else {
            physicsEffect = {
              type: 'energy-surge',
              label: '⚡ Thực hành vật lý chuẩn xác!',
              detail: 'Bạn đã áp dụng đúng quy luật và biểu thức định lượng.',
            };
          }
        }

        return (
          <FeedbackSheet
            status={feedbackStatus}
            reactionEffect={reactionEffect}
            physicsEffect={physicsEffect}
            solutionText={status === 'correct' ? exercise.finalSolution : undefined}
            explanation={status === 'correct' ? exercise.steps[exercise.steps.length - 1]?.body : undefined}
            hints={status === 'wrong' || status === 'revealed' ? exercise.hints : undefined}
            diagnosis={diagnosis}
            attemptsLeft={attemptsLeft > 0 ? attemptsLeft : undefined}
            onContinue={handleNext}
            onRetry={handleRetry}
          />
        );
      })()}

      {/* 6. On-screen Keyboard */}
      {isPhysics ? (
        <PhysicsKeyboard
          visible={showChemKb && !isFeedbackVisible}
          onInsert={handleChemInsert}
          onDelete={handleChemDelete}
          onClose={() => setShowChemKeyboard(false)}
        />
      ) : (
        <ChemKeyboard
          visible={showChemKb && !isFeedbackVisible}
          onInsert={handleChemInsert}
          onDelete={handleChemDelete}
          onClose={() => setShowChemKeyboard(false)}
        />
      )}

      {/* 7. Modals & Drawers */}
      <QuitModal
        isOpen={showQuitModal}
        onKeepLearning={() => setShowQuitModal(false)}
        onQuit={() => navigate(isPracticeMode ? '/practice' : `/learn/${gradeNumber}`)}
      />

      <OutOfHeartsModal
        isOpen={showOutOfHeartsModal}
        gems={gems}
        onBuyWithGems={() => {
          const ok = buyHeartWithGems();
          if (ok) {
            setShowOutOfHeartsModal(false);
          }
        }}
        onGoToPractice={() => {
          setShowOutOfHeartsModal(false);
          navigate('/practice');
        }}
        onQuit={() => {
          setShowOutOfHeartsModal(false);
          navigate(`/learn/${gradeNumber}`);
        }}
      />

      <QuickReferenceDrawer
        isOpen={showReferenceDrawer}
        onClose={() => setShowReferenceDrawer(false)}
        subject={isPhysics ? 'physics' : 'chem'}
      />

      <ComboBanner combo={comboCount} visible={showComboBanner} />
    </div>
  );
};

// ── Helper: Render prompt with [[Formula]] markers ──
function renderPrompt(text: string): React.ReactNode {
  const parts = text.split(/\[\[([^\]]+)\]\]/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <Formula key={i} code={part} className="text-cyan-300 font-black" />
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

// ── Answer Renderer ──
interface AnswerRendererProps {
  exercise: Exercise;
  userInput: unknown;
  onInputChange: (v: unknown) => void;
  disabled: boolean;
  verdict?: Verdict;
  onShowChemKeyboard: () => void;
  isPhysics?: boolean;
}

const AnswerRenderer: React.FC<AnswerRendererProps> = ({
  exercise,
  userInput,
  onInputChange,
  disabled,
  verdict,
  onShowChemKeyboard,
  isPhysics = false,
}) => {
  const answer = exercise.answer;

  switch (answer.kind) {
    case 'mcq-single':
      return (
        <McqPanel
          options={answer.options}
          correctId={answer.correctId}
          value={(userInput as string) ?? null}
          onChange={(v) => onInputChange(v)}
          disabled={disabled}
          verdict={verdict}
        />
      );

    case 'mcq-multi':
      return (
        <McqPanel
          options={answer.options}
          correctIds={answer.correctIds}
          multi
          value={(userInput as string[]) ?? []}
          onChange={(v) => onInputChange(v)}
          disabled={disabled}
          verdict={verdict}
        />
      );

    case 'true-false':
      return (
        <TrueFalsePanel
          statements={answer.statements}
          value={(userInput as Record<string, boolean>) ?? {}}
          onChange={(v) => onInputChange(v)}
          disabled={disabled}
          verdict={verdict}
        />
      );

    case 'number':
      return (
        <NumberInput
          value={(userInput as string) ?? ''}
          onChange={(v) => onInputChange(v)}
          disabled={disabled}
          unit={answer.unit}
          verdict={verdict}
        />
      );

    case 'formula':
      return (
        <div>
          <FormulaInput
            value={(userInput as string) ?? ''}
            onChange={(v) => onInputChange(v)}
            disabled={disabled}
            verdict={verdict}
          />
          {!disabled && (
            <button
              onClick={onShowChemKeyboard}
              className={`mt-2 text-[11px] font-bold transition-colors cursor-pointer ${
                isPhysics ? 'text-amber-400 hover:text-amber-300' : 'text-cyan-400 hover:text-cyan-300'
              }`}
            >
              {isPhysics ? '⌨️ Mở bàn phím vật lý & công thức' : '⌨️ Mở bàn phím hóa học'}
            </button>
          )}
        </div>
      );

    case 'match':
      return (
        <MatchGrid
          pairs={answer.pairs}
          value={(userInput as Array<{ left: string; right: string }>) ?? []}
          onChange={(v) => onInputChange(v)}
          disabled={disabled}
          verdict={verdict}
        />
      );

    case 'ordering': {
      // Shuffle initially
      const shuffledItems = React.useMemo(() => {
        const items = [...answer.correctOrder];
        for (let i = items.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [items[i], items[j]] = [items[j], items[i]];
        }
        return items;
      }, [answer.correctOrder]);

      return (
        <OrderingList
          items={shuffledItems}
          value={(userInput as string[]) ?? shuffledItems}
          onChange={(v) => onInputChange(v)}
          disabled={disabled}
          verdict={verdict}
          correctOrder={answer.correctOrder}
        />
      );
    }

    case 'equation':
      return (
        <EquationInput
          mode={answer.mode}
          reactants={answer.reactants}
          products={answer.products}
          coefficients={answer.coefficients}
          condition={answer.condition}
          value={userInput as number[] | string}
          onChange={(v) => onInputChange(v)}
          disabled={disabled}
          verdict={verdict}
        />
      );

    case 'sort':
      return (
        <SortPanel
          buckets={answer.buckets}
          items={answer.items}
          value={(userInput as Record<string, string>) || {}}
          onChange={(v) => onInputChange(v)}
          disabled={disabled}
          verdict={verdict}
        />
      );

    case 'formula-builder':
      return (
        <FormulaBuilderPanel
          tiles={answer.tiles}
          accepted={answer.accepted}
          value={(userInput as string) || ''}
          onChange={(v) => onInputChange(v)}
          disabled={disabled}
          verdict={verdict}
        />
      );

    default:
      return (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center text-sm text-slate-400">
          Kiểu bài tập này chưa được hỗ trợ hiển thị.
        </div>
      );
  }
};
