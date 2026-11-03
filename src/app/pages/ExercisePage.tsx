import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, FlaskConical, Heart as HeartIcon, Zap, Dna } from 'lucide-react';
import { useUserStore } from '@/features/gamification/useUserStore';
import {
  Button,
  Card,
  Progress,
  Heart,
  GemBadge,
  MathText,
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
  BiologyVisualizer,
  type BiologyVisualizerMode,
} from '@/design-system';
import { sound } from '@/lib/audio';
import { haptic } from '@/lib/haptic';
import { loadExercisesForNode } from '@/content/contentLoader';
import { loadSession, clearSession } from '@/engine/progress';
import { assetUrl } from '@/lib/utils';
import { GAMIFICATION } from '@/config/gamification';
import { setActiveSubject, setActiveGrade, parseLessonSubjectAndGrade } from '@/content/subjects';
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

const BIOLOGY_TRIVIA = [
  'Tổng chiều dài các mạch máu trong cơ thể một người trưởng thành lên tới gần 100 000 km — đủ quấn quanh Trái Đất hơn 2 vòng!',
  'Mỗi ngày tim người đập khoảng 100 000 lần và bơm khoảng 7 500 lít máu đi khắp cơ thể không ngừng nghỉ.',
  'Diện tích bề mặt trao đổi khí của hàng triệu phế nang trong hai lá phổi người trải rộng tới khoảng 70 - 80 m² (bằng một sân cầu lông)!',
  'Nephron là đơn vị chức năng của thận. Mỗi quả thận chứa khoảng 1 triệu nephron để lọc khoảng 1 400 lít máu mỗi ngày.',
  'Nhóm máu O là nhóm máu chuyên cho trong hệ ABO vì trên màng tế bào hồng cầu không chứa kháng nguyên A hay B.',
  'Trong hệ sinh thái, năng lượng hao hụt khoảng 90% qua mỗi bậc dinh dưỡng và chỉ có khoảng 10% được chuyển lên bậc kế tiếp.',
];

const ChemicalLoadingScreen: React.FC<{ isPhysics?: boolean; isBio?: boolean }> = ({ isPhysics, isBio }) => {
  const [triviaIndex, setTriviaIndex] = useState(0);
  const triviaList = isPhysics ? PHYSICS_TRIVIA : isBio ? BIOLOGY_TRIVIA : CHEMISTRY_TRIVIA;

  useEffect(() => {
    const timer = setInterval(() => {
      setTriviaIndex((prev) => (prev + 1) % triviaList.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [triviaList.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[82dvh] px-4 select-none">
      <div className="max-w-sm w-full flex flex-col items-center text-center space-y-6">
        {/* Icon Container */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div
            className={`relative w-20 h-20 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border)] flex items-center justify-center overflow-hidden shadow-sm`}
          >
            {isPhysics ? (
              <Zap className="w-10 h-10 text-[var(--phy-fg)] drop-shadow-md z-10 animate-bounce duration-1000 fill-[var(--phy-fill)]" />
            ) : isBio ? (
              <Dna className="w-10 h-10 text-[var(--bio-fg)] drop-shadow-md z-10 animate-spin duration-[4000ms]" />
            ) : (
              <>
                <div className="absolute bottom-0 inset-x-0 h-11 bg-[var(--chem-tint)] border-t border-[var(--chem-edge)]" />
                <motion.div
                  animate={{ y: [16, -18], opacity: [0, 1, 0], scale: [0.6, 1.2, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: 'easeOut' }}
                  className="absolute w-2.5 h-2.5 rounded-full bg-[var(--chem-fg)] shadow-sm"
                  style={{ left: '35%' }}
                />
                <FlaskConical className="w-10 h-10 text-[var(--chem-fg)] drop-shadow-md z-10 animate-bounce duration-1000" />
              </>
            )}
          </div>
        </div>

        {/* Loading text & progress bar */}
        <div className="space-y-2 w-full max-w-xs">
          <div className="flex items-center justify-center gap-2">
            <span
              className={`w-2 h-2 rounded-full animate-ping ${
                isPhysics ? 'bg-[var(--phy-fill)]' : isBio ? 'bg-[var(--bio-fill)]' : 'bg-[var(--chem-fill)]'
              }`}
            />
            <span className="text-sm font-black text-[var(--text-primary)] tracking-wide">
              {isPhysics
                ? 'Đang chuẩn bị dụng cụ thí nghiệm…'
                : isBio
                ? 'Đang chuẩn bị tiêu bản & quan sát sinh học…'
                : 'Đang chuẩn bị phòng thí nghiệm…'}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--bg-surface-2)] border border-[var(--border)] overflow-hidden p-0.5">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className={`w-1/2 h-full rounded-full bg-gradient-to-r ${
                isPhysics
                  ? 'from-transparent via-[var(--phy-fill)] to-transparent'
                  : isBio
                  ? 'from-transparent via-[var(--bio-fill)] to-transparent'
                  : 'from-transparent via-[var(--chem-fill)] to-transparent'
              }`}
            />
          </div>
        </div>

        {/* Trivia Flashcard */}
        <div className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 text-left relative overflow-hidden">
          <div
            className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider mb-1.5 ${
              isPhysics
                ? 'text-[var(--phy-fg)]'
                : isBio
                ? 'text-[var(--bio-fg)]'
                : 'text-[var(--chem-fg)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isPhysics
                ? 'Góc khám phá Vật lý'
                : isBio
                ? 'Góc khám phá Sinh học'
                : 'Góc khám phá Hóa học'}
            </span>
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
  const { subject, grade } = parseLessonSubjectAndGrade(lessonId);
  const isPhysics = subject === 'physics';
  const isBio = subject === 'bio';
  const gradeNumber = String(grade);

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
    setActiveSubject(subject);
    setActiveGrade(grade);

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

        const shuffleExerciseOptions = (ex: Exercise): Exercise => {
          if (ex.answer.kind === 'mcq-single') {
            return {
              ...ex,
              answer: {
                ...ex.answer,
                options: shuffleArray(ex.answer.options),
              },
            };
          }
          if (ex.answer.kind === 'mcq-multi') {
            return {
              ...ex,
              answer: {
                ...ex.answer,
                options: shuffleArray(ex.answer.options),
              },
            };
          }
          return ex;
        };

        const sortedExercises = [
          ...shuffleArray(diff1),
          ...shuffleArray(diff2),
          ...shuffleArray(diff3),
        ].map(shuffleExerciseOptions);

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

  // ── Biology Interactive Visualizer Mode ──
  const biologyVisualMode = useMemo<BiologyVisualizerMode | null>(() => {
    if (!isBio || !exercise) return null;
    if (exercise.visual?.mode) {
      return exercise.visual.mode as BiologyVisualizerMode;
    }
    const lid = exercise.lessonId;
    const pLower = (exercise.prompt || '').toLowerCase();

    // 1. Blood Transfusion (Bài 33: nhóm máu ABO, truyền máu, hồng cầu, ngưng kết)
    if (
      pLower.includes('nhóm máu') ||
      pLower.includes('truyền máu') ||
      pLower.includes('ngưng kết') ||
      pLower.includes('kháng thể α') ||
      pLower.includes('kháng thể β') ||
      exercise.skillIds?.some((s) => s.includes('blood') || s.includes('truyen-mau'))
    ) {
      return 'blood-transfusion';
    }

    // 2. Circulation Loop & Heart (Bài 33: vòng tuần hoàn, tâm thất, tâm nhĩ, mao mạch)
    if (
      pLower.includes('vòng tuần hoàn') ||
      pLower.includes('tâm thất') ||
      pLower.includes('tâm nhĩ') ||
      pLower.includes('động mạch chủ') ||
      pLower.includes('tĩnh mạch') ||
      exercise.skillIds?.some((s) => s.includes('circulation') || s.includes('tuan-hoan'))
    ) {
      return 'circulation-loop';
    }

    // 3. Energy Pyramid (Bài 44: tháp năng lượng, bậc dinh dưỡng, quy luật 10%)
    if (
      pLower.includes('tháp năng lượng') ||
      pLower.includes('tháp sinh thái') ||
      pLower.includes('bậc dinh dưỡng') ||
      pLower.includes('hao hụt') ||
      pLower.includes('10%') ||
      exercise.skillIds?.some((s) => s.includes('he-sinh-thai') || s.includes('pyramid'))
    ) {
      return 'energy-pyramid';
    }

    // 4. Nephron Filtration (Bài 35: cầu thận, ống thận, nước tiểu đầu, nephron)
    if (
      pLower.includes('nephron') ||
      pLower.includes('cầu thận') ||
      pLower.includes('nước tiểu đầu') ||
      pLower.includes('tái hấp thụ') ||
      pLower.includes('bài tiết') ||
      exercise.skillIds?.some((s) => s.includes('bai-tiet') || s.includes('nephron'))
    ) {
      return 'nephron-filtration';
    }

    // 5. Cell Structure (Bài 19, 20 Lớp 6 / Lớp 8 Bài 30: tế bào, lục lạp, nhân tế bào)
    if (
      pLower.includes('lục lạp') ||
      pLower.includes('không bào') ||
      pLower.includes('thành tế bào') ||
      (lid.includes('b01') && pLower.includes('tế bào'))
    ) {
      return 'cell-structure';
    }

    // 6. Mendel Punnett Grid (Bài 36, 37: lai phân tích, mendel, punnett, dị hợp, đồng hợp, AaBb)
    if (
      pLower.includes('mendel') ||
      pLower.includes('punnett') ||
      pLower.includes('phép lai') ||
      pLower.includes('lai phân tích') ||
      pLower.includes('aabb') ||
      pLower.includes('dị hợp') ||
      pLower.includes('đồng hợp') ||
      pLower.includes('tính trạng trội') ||
      exercise.skillIds?.some((s) => s.includes('mendel'))
    ) {
      return 'mendel-punnett-grid';
    }

    // 7. DNA & Transcription Builder (Bài 38, 39, 40, 41: nucleic acid, dna, rna, phiên mã, dịch mã, codon)
    if (
      pLower.includes('dna') ||
      pLower.includes('rna') ||
      pLower.includes('nucleotide') ||
      pLower.includes('tái bản') ||
      pLower.includes('phiên mã') ||
      pLower.includes('dịch mã') ||
      pLower.includes('hydrogen') ||
      pLower.includes('codon') ||
      exercise.skillIds?.some((s) => s.includes('nucleic') || s.includes('tai-ban') || s.includes('dich-ma'))
    ) {
      return 'dna-transcription-builder';
    }

    // 8. Mitosis & Meiosis Scope (Bài 42, 43, 44, 46: nguyên phân, giảm phân, nhiễm sắc thể, chromatid, kì giữa)
    if (
      pLower.includes('nguyên phân') ||
      pLower.includes('giảm phân') ||
      pLower.includes('nhiễm sắc thể') ||
      pLower.includes('chromatid') ||
      pLower.includes('thoi phân bào') ||
      pLower.includes('thoi vô sắc') ||
      pLower.includes('kì giữa') ||
      pLower.includes('kì sau') ||
      pLower.includes('kì đầu') ||
      pLower.includes('kì cuối') ||
      exercise.skillIds?.some((s) => s.includes('nguyen-phan') || s.includes('nhiem-sac-the'))
    ) {
      return 'mitosis-meiosis-scope';
    }

    return null;
  }, [isBio, exercise]);

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
        haptic.correct();
        setShowXpFly(true);
        setTimeout(() => setShowXpFly(false), 1200);

        if (updated.comboStreak >= 2) {
          haptic.streak();
          setComboCount(updated.comboStreak);
          setShowComboBanner(true);
          setTimeout(() => setShowComboBanner(false), 2400);
        }
      } else if (q?.status === 'wrong') {
        haptic.wrong();

        if (!isPracticeMode && updated.hearts <= 0) {
          // Failed session! Clear in-progress session so it doesn't linger
          clearSession(sessionKey, nodeId).catch(console.error);
          sound.playWrong();
          setShowOutOfHeartsModal(true);
        }
      }
    }
  }, [currentQ, submitAnswer, isPracticeMode, lessonId, nodeId, isBio, isPhysics]);

  const handleNext = useCallback(async () => {
    sound.playClick();
    haptic.tap();

    if (!sessionState) return;

    // Check if this was the last question
    const nextIndex = sessionState.currentIndex + 1;
    const isLast = nextIndex >= sessionState.questions.length;

    dispatch({ type: 'NEXT_QUESTION' });

    if (isLast) {
      const result = await endSession();
      if (result) {
        haptic.completion();

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
    setActiveSubject(subject);
    setActiveGrade(grade);
    setShowQuitModal(true);
  }, [subject, grade]);

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
        subject={isBio ? 'bio' : isPhysics ? 'physics' : 'chem'}
        onContinue={() => {
          setActiveSubject(subject);
          setActiveGrade(grade);
          if (isPracticeMode) {
            navigate('/practice');
          } else {
            navigate(`/learn/${gradeNumber}`);
          }
        }}
      />
    );
  }

  // ── Loading state ──
  if (loadingState === 'loading') {
    return <ChemicalLoadingScreen isPhysics={isPhysics} isBio={isBio} />;
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

  // ── Diagnosis & Smart Hint (Milestone M11) ──
  const diagnosis =
    lastVerdict?.status === 'incorrect' && lastVerdict.diagnosis
      ? lastVerdict.diagnosis
      : lastVerdict?.status === 'incorrect' && lastVerdict.mistakeId
        ? exercise.commonMistakes?.find((m) => m.id === lastVerdict.mistakeId)
            ?.message
        : undefined;

  const smartHint =
    lastVerdict?.status === 'incorrect' && lastVerdict.smartHint
      ? lastVerdict.smartHint
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
          className={`p-1.5 px-2 rounded-xl bg-[var(--bg-surface)] border text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
            isPhysics
              ? 'border-[var(--phy-edge)]/50 text-[var(--phy-fg)] hover:bg-[var(--bg-surface-2)]'
              : 'border-[var(--border)] text-[var(--chem-fg)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)]'
          }`}
          title={isPhysics ? 'Tra cứu công thức & hằng số Vật lý' : 'Tra cứu nguyên tử khối & hóa trị'}
        >
          {isPhysics ? <Zap className="w-3.5 h-3.5 text-[var(--phy-fg)] fill-[var(--phy-fill)]" /> : <FlaskConical className="w-3.5 h-3.5 text-[var(--chem-fg)]" />}
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
              isPhysics ? 'text-[var(--phy-fg)] flex items-center gap-1' : 'text-[var(--chem-fg)]'
            }`}
          >
            {isPhysics && <Zap className="w-3.5 h-3.5 fill-[var(--phy-fill)]" />}
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
          className="space-y-3 relative overflow-hidden"
        >
          <h2 className="text-base font-bold text-[var(--text-primary)] leading-relaxed relative z-10">
            {renderPrompt(exercise.prompt)}
          </h2>

          {/* Dữ kiện / Cần tìm chips */}
          {(exercise.given || exercise.find) && (
            <div className="flex flex-wrap gap-2 pt-1 relative z-10">
              {exercise.given?.map((g, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2.5 py-1 rounded-xl border bg-[var(--bg-surface-2)] border-[var(--border)] text-[var(--text-secondary)]"
                >
                  📌 {renderPrompt(g.label)}: {g.value}
                  {g.unit ? ` ${g.unit}` : ''}
                </span>
              ))}
              {exercise.find && (
                <span
                  className="text-[11px] px-2.5 py-1 rounded-xl border bg-[var(--subject-tint)] border-[var(--subject-edge)] text-[var(--subject-fg)]"
                >
                  🎯 Cần tìm: {renderPrompt(exercise.find.label)}
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

        {/* Biology Interactive Visualizer Sandbox directly integrated into lesson */}
        {biologyVisualMode && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-0.5"
          >
            <BiologyVisualizer mode={biologyVisualMode} />
          </motion.div>
        )}

        {/* Visual Illustration Image (if specified in exercise) */}
        {exercise.visual?.image && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)] p-2.5 flex flex-col items-center justify-center shadow-sm select-none"
          >
            <img
              src={assetUrl(exercise.visual.image)}
              alt={exercise.visual.caption || 'Hình ảnh minh họa'}
              className="max-h-56 w-auto object-contain rounded-xl"
              loading="lazy"
            />
            {exercise.visual.caption && (
              <p className="text-xs text-[var(--text-secondary)] mt-2 text-center font-medium">
                {exercise.visual.caption}
              </p>
            )}
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
      <div className="pt-2 border-t border-[var(--border)] safe-pb">
        {!isFeedbackVisible && (
          <Button
            variant="primary"
            size="lg"
            fullWidth
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
                  color: isRed ? 'var(--lab-acid-red)' : 'var(--lab-base-blue)',
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
                  color: isBlue ? 'var(--lab-cuso4)' : isBrown ? 'var(--warn-fill)' : 'var(--lab-precipitate)',
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
                color: 'var(--lab-cuso4)',
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
            smartHint={smartHint}
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
        onQuit={() => {
          setActiveSubject(subject);
          setActiveGrade(grade);
          navigate(isPracticeMode ? '/practice' : `/learn/${gradeNumber}`);
        }}
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
          setActiveSubject(subject);
          setActiveGrade(grade);
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

// ── Helper: Render prompt with Math ($...$), [[Formula]], and Bold (**) ──
function renderPrompt(text: string): React.ReactNode {
  return <MathText text={text} />;
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
                isPhysics ? 'text-[var(--phy-fg)] hover:underline' : 'text-[var(--chem-fg)] hover:underline'
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
