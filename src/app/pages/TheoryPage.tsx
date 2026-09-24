import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  AlertTriangle,
  FlaskConical,
  Award,
} from 'lucide-react';
import { loadTheory, type TheoryContent } from '@/content/contentLoader';
import { useUserStore } from '@/features/gamification/useUserStore';
import { Formula, Mascot, Button } from '@/design-system';
import { sound } from '@/lib/audio';

// Helper to render text with [[Formula]] markers
function renderFormulaText(text: string): React.ReactNode {
  const parts = text.split(/\[\[([^\]]+)\]\]/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <Formula key={i} code={part} className="text-cyan-300 font-bold inline-block mx-0.5" />
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

export const TheoryPage: React.FC = () => {
  const { lessonId, nodeId } = useParams<{ lessonId: string; nodeId: string }>();
  const navigate = useNavigate();
  const completeTheoryNode = useUserStore((s) => s.completeTheoryNode);

  const [theory, setTheory] = useState<TheoryContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Slide index: 0..N-1 for cards, N for quickCheck, N+1 for completed
  const [currentSlide, setCurrentSlide] = useState(0);

  // Quick check state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchTheory() {
      if (!lessonId) return;
      try {
        setLoading(true);
        const data = await loadTheory(lessonId);
        if (cancelled) return;
        if (!data) {
          setError('Không tìm thấy nội dung lý thuyết cho bài học này.');
        } else {
          setTheory(data);
        }
      } catch (err) {
        if (!cancelled) setError('Lỗi nạp bài học lý thuyết.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTheory();
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80dvh] px-4 select-none">
        <div className="w-16 h-16 rounded-3xl bg-[#131f24] border-2 border-purple-500/50 flex items-center justify-center animate-pulse shadow-[0_4px_0_0_#6b21a8]">
          <BookOpen className="w-8 h-8 text-purple-400" />
        </div>
        <p className="mt-4 text-sm font-bold text-slate-300">Đang chuẩn bị kiến thức trọng tâm…</p>
      </div>
    );
  }

  if (error || !theory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70dvh] px-4 text-center">
        <p className="text-sm text-rose-300 font-bold mb-4">{error ?? 'Lỗi không xác định'}</p>
        <Button variant="primary" onClick={() => navigate(-1)}>
          QUAY LẠI
        </Button>
      </div>
    );
  }

  const cards = theory.cards;
  const hasQuickCheck = !!theory.quickCheck;
  const totalSlides = cards.length + (hasQuickCheck ? 1 : 0);

  const isQuickCheckSlide = hasQuickCheck && currentSlide === cards.length;
  const currentCard = !isQuickCheckSlide && currentSlide < cards.length ? cards[currentSlide] : null;

  const handleNext = () => {
    sound.playClick();
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    sound.playClick();
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || !theory.quickCheck) return;
    setIsChecked(true);

    const chosen = theory.quickCheck.options.find((o) => o.id === selectedOption);
    if (chosen?.correct) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }
  };

  const handleFinish = async () => {
    sound.playCompletion();
    setIsCompleted(true);
    if (lessonId && nodeId) {
      await completeTheoryNode(lessonId, nodeId, 10);
    }
  };

  const gradeNumber = lessonId?.match(/^g(\d)/)?.[1] ?? '9';

  return (
    <div className="max-w-xl mx-auto min-h-[88dvh] flex flex-col justify-between py-2 sm:py-4 px-3 sm:px-4 select-none">
      {/* 1. Header with Close Button & Story Segments Progress */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              sound.playClick();
              navigate(`/learn/${gradeNumber}`);
            }}
            className="p-2 text-slate-400 hover:text-white rounded-2xl hover:bg-[#20333d] transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Multi-segment Story Bar */}
          <div className="flex-1 flex gap-1.5 px-1">
            {Array.from({ length: totalSlides }).map((_, idx) => {
              const isPassed = idx < currentSlide;
              const isCurrent = idx === currentSlide;
              return (
                <div
                  key={idx}
                  className="h-2 flex-1 rounded-full bg-[#20333d] overflow-hidden relative"
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-400 rounded-full"
                    initial={false}
                    animate={{
                      width: isPassed ? '100%' : isCurrent ? '100%' : '0%',
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-1 bg-purple-500/15 border border-purple-500/30 px-2.5 py-1 rounded-xl text-[11px] font-black text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>+10 XP</span>
          </div>
        </div>
      </div>

      {/* 2. Main Content Card Area */}
      <div className="my-auto py-4">
        <AnimatePresence mode="wait">
          {isCompleted ? (
            /* Completion Celebration Screen */
            <motion.div
              key="completed"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-6 py-6"
            >
              <div className="flex justify-center">
                <Mascot state="cheering" size="xl" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-fuchsia-300 border border-purple-500/40 uppercase tracking-wide">
                  <Award className="w-4 h-4" /> Hoàn thành bài học
                </span>
                <h1 className="text-2xl font-black text-white">Xuất sắc!</h1>
                <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Bạn đã nắm vững lý thuyết trọng tâm của bài{' '}
                  <span className="text-purple-300 font-bold">{theory.title}</span>. Bây giờ hãy tự tin bước vào phần bài tập nhé!
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <div className="bg-[#18272f] border-2 border-purple-500/40 px-5 py-3 rounded-2xl shadow-[0_4px_0_0_#6b21a8] text-center">
                  <span className="text-xs text-slate-400 block font-bold">Kinh nghiệm</span>
                  <span className="text-xl font-black text-purple-300">+10 XP</span>
                </div>
                <div className="bg-[#18272f] border-2 border-[#58cc02]/40 px-5 py-3 rounded-2xl shadow-[0_4px_0_0_#2b590e] text-center">
                  <span className="text-xs text-slate-400 block font-bold">Luyện tập</span>
                  <span className="text-xl font-black text-emerald-300">Đã mở khóa</span>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400 text-white font-black shadow-[0_4px_0_0_#6b21a8]"
                  onClick={() => {
                    sound.playClick();
                    navigate(`/learn/${gradeNumber}`);
                  }}
                >
                  TIẾP TỤC HÀNH TRÌNH
                </Button>
              </div>
            </motion.div>
          ) : isQuickCheckSlide && theory.quickCheck ? (
            /* Quick Check Slide */
            <motion.div
              key="quick-check"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="bg-[#18272f] border-2 border-purple-500/50 p-5 rounded-3xl shadow-[0_6px_0_0_#6b21a8] space-y-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    <Sparkles className="w-3.5 h-3.5" /> Kiểm tra nhanh
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Không trừ tim</span>
                </div>

                <h2 className="text-base sm:text-lg font-black text-white leading-relaxed">
                  {renderFormulaText(theory.quickCheck.prompt)}
                </h2>

                <div className="space-y-2.5 pt-1">
                  {theory.quickCheck.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    let optionStyle =
                      'bg-[#20333d] border-[#2e4756] text-slate-200 hover:border-purple-400 shadow-[0_3px_0_0_#131f24]';

                    if (isChecked) {
                      if (opt.correct) {
                        optionStyle =
                          'bg-[#58cc02]/20 border-[#58cc02] text-emerald-200 shadow-[0_3px_0_0_#46a302]';
                      } else if (isSelected) {
                        optionStyle =
                          'bg-[#ff4b4b]/20 border-[#ff4b4b] text-rose-200 shadow-[0_3px_0_0_#ea2b2b]';
                      } else {
                        optionStyle = 'opacity-40 border-[#20333d] text-slate-500';
                      }
                    } else if (isSelected) {
                      optionStyle =
                        'bg-purple-500/20 border-purple-400 text-fuchsia-200 shadow-[0_3px_0_0_#7e22ce]';
                    }

                    return (
                      <button
                        key={opt.id}
                        disabled={isChecked}
                        onClick={() => {
                          sound.playClick();
                          setSelectedOption(opt.id);
                        }}
                        className={`w-full p-3.5 rounded-2xl border-2 text-left text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${optionStyle}`}
                      >
                        <span>{renderFormulaText(opt.text)}</span>
                        {isChecked && opt.correct && (
                          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                        )}
                        {isChecked && isSelected && !opt.correct && (
                          <X className="w-4 h-4 text-rose-400 stroke-[3]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isChecked && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200 leading-relaxed"
                  >
                    💡 {theory.quickCheck.explanation}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : currentCard ? (
            /* Theory Micro-Card */
            <motion.div
              key={currentCard.id}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-[#18272f] border-2 border-[#2e4756] p-5 sm:p-6 rounded-3xl shadow-[0_6px_0_0_#131f24] space-y-4"
            >
              {/* Badge & Step indicator */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
                    currentCard.badgeColor === 'emerald'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : currentCard.badgeColor === 'amber'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : currentCard.badgeColor === 'cyan'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  }`}
                >
                  {currentCard.badgeColor === 'amber' ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : currentCard.badgeColor === 'emerald' ? (
                    <FlaskConical className="w-3.5 h-3.5" />
                  ) : (
                    <Lightbulb className="w-3.5 h-3.5" />
                  )}
                  {currentCard.badge}
                </span>

                <span className="text-xs font-bold text-slate-400">
                  {currentSlide + 1} / {totalSlides}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                {currentCard.title}
              </h2>

              {/* Body Content */}
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {renderFormulaText(currentCard.content)}
              </p>

              {/* Formula Example (if present) */}
              {currentCard.formulaExample && (
                <div className="p-3.5 rounded-2xl bg-[#131f24] border-2 border-emerald-500/40 flex items-center justify-center text-center shadow-inner">
                  <Formula
                    code={currentCard.formulaExample}
                    className="text-emerald-300 font-black text-base sm:text-lg tracking-wide"
                  />
                </div>
              )}

              {/* Bullet Points */}
              {currentCard.bulletPoints && (
                <div className="space-y-2 pt-1">
                  {currentCard.bulletPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                      <span>{renderFormulaText(pt)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Highlight Callout Box */}
              {currentCard.callout && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/30 to-fuchsia-900/20 border border-purple-400/30 text-xs sm:text-sm font-bold text-fuchsia-200 whitespace-pre-line leading-relaxed shadow-sm">
                  {renderFormulaText(currentCard.callout)}
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* 3. Bottom Sticky Action Navigation */}
      {!isCompleted && (
        <div className="pt-2 border-t border-slate-800 flex items-center gap-3">
          {currentSlide > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrev}
              className="px-4 border-2 border-[#2e4756] text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}

          {isQuickCheckSlide ? (
            !isChecked ? (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={!selectedOption}
                onClick={handleCheckAnswer}
                className="bg-purple-600 hover:bg-purple-500 text-white font-black shadow-[0_4px_0_0_#581c87]"
              >
                KIỂM TRA
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleFinish}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-black shadow-[0_4px_0_0_#6b21a8]"
              >
                HOÀN THÀNH
              </Button>
            )
          ) : (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400 text-white font-black shadow-[0_4px_0_0_#6b21a8] flex items-center justify-center gap-2"
            >
              <span>{currentSlide === totalSlides - 1 ? 'HOÀN THÀNH' : 'TIẾP THEO'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
