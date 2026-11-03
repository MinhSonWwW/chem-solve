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
  Zap,
} from 'lucide-react';
import { loadTheory, type TheoryContent } from '@/content/contentLoader';
import { useUserStore } from '@/features/gamification/useUserStore';
import { Mascot, Button, MathText } from '@/design-system';
import { sound } from '@/lib/audio';
import { setActiveSubject, setActiveGrade, parseLessonSubjectAndGrade } from '@/content/subjects';

// Helper to render text with Math ($...$), Formula ([[...]]), and Bold (**)
function renderFormulaText(text: string): React.ReactNode {
  return <MathText text={text} />;
}

export const TheoryPage: React.FC = () => {
  const { lessonId = '', nodeId = '' } = useParams<{ lessonId: string; nodeId: string }>();
  const navigate = useNavigate();
  const completeTheoryNode = useUserStore((s) => s.completeTheoryNode);

  const { subject, grade } = parseLessonSubjectAndGrade(lessonId);
  const isPhysics = subject === 'physics';
  const gradeNumber = String(grade);

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
    setActiveSubject(subject);
    setActiveGrade(grade);

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
  }, [lessonId, subject, grade]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80dvh] px-4 select-none" data-subject={subject}>
        <div className="w-16 h-16 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center animate-pulse">
          <BookOpen className="w-8 h-8 text-[var(--subject-fg)]" />
        </div>
        <p className="mt-4 text-sm font-bold text-[var(--text-secondary)]">Đang chuẩn bị kiến thức trọng tâm…</p>
      </div>
    );
  }

  if (error || !theory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70dvh] px-4 text-center" data-subject={subject}>
        <p className="text-sm text-[var(--err-fg)] font-bold mb-4">{error ?? 'Lỗi không xác định'}</p>
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

  const handleExitOrFinish = () => {
    sound.playClick();
    setActiveSubject(subject);
    setActiveGrade(grade);
    navigate(`/learn/${gradeNumber}`);
  };

  return (
    <div data-subject={subject} className="max-w-xl mx-auto min-h-[88dvh] flex flex-col justify-between py-2 sm:py-4 px-3 sm:px-4 select-none">
      {/* 1. Header with Close Button & Story Segments Progress */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleExitOrFinish}
            className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded-2xl hover:bg-[var(--bg-surface-2)] transition-colors cursor-pointer"
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
                  className="h-2 flex-1 rounded-full bg-[var(--bg-surface-2)] overflow-hidden relative"
                >
                  <motion.div
                    className="h-full rounded-full bg-[var(--subject-fill)]"
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

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-black border border-[var(--gold-edge)]/30 bg-[var(--gold-tint)] text-[var(--gold-fg)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--gold-fg)]" />
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
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border border-[var(--subject-edge)]/40 bg-[var(--subject-tint)] text-[var(--subject-fg)]">
                  <Award className="w-4 h-4" /> Hoàn thành bài học
                </span>
                <h1 className="text-2xl font-black text-[var(--text-primary)]">Xuất sắc!</h1>
                <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
                  Bạn đã nắm vững lý thuyết trọng tâm của bài{' '}
                  <span className="font-bold text-[var(--subject-fg)]">{theory.title}</span>. Bây giờ hãy tự tin bước vào phần bài tập nhé!
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <div className="bg-[var(--bg-surface)] border border-[var(--border)] px-5 py-3 rounded-2xl text-center">
                  <span className="text-xs text-[var(--text-tertiary)] block font-bold">Kinh nghiệm</span>
                  <span className="text-xl font-black text-[var(--gold-fg)]">+10 XP</span>
                </div>
                <div className="bg-[var(--bg-surface)] border border-[var(--border)] px-5 py-3 rounded-2xl text-center">
                  <span className="text-xs text-[var(--text-tertiary)] block font-bold">Luyện tập</span>
                  <span className="text-xl font-black text-[var(--ok-fg)]">Đã mở khóa</span>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleExitOrFinish}
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
              <div className="bg-[var(--bg-surface)] border border-[var(--border)] p-5 rounded-3xl space-y-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black border border-[var(--subject-edge)]/40 bg-[var(--subject-tint)] text-[var(--subject-fg)]">
                    <Sparkles className="w-3.5 h-3.5" /> Kiểm tra nhanh
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)] font-medium">Không trừ tim</span>
                </div>

                <h2 className="text-base sm:text-lg font-black text-[var(--text-primary)] leading-relaxed">
                  {renderFormulaText(theory.quickCheck.prompt)}
                </h2>

                <div className="space-y-2.5 pt-1">
                  {theory.quickCheck.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    let optionStyle =
                      'bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--border-strong)]';

                    if (isChecked) {
                      if (opt.correct) {
                        optionStyle =
                          'bg-[var(--ok-tint)] border-2 border-[var(--ok-fill)] text-[var(--ok-fg)]';
                      } else if (isSelected) {
                        optionStyle =
                          'bg-[var(--err-tint)] border-2 border-[var(--err-fill)] text-[var(--err-fg)]';
                      } else {
                        optionStyle = 'opacity-40 border-[var(--border)] text-[var(--text-tertiary)] bg-[var(--bg-surface-2)]';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-[var(--subject-tint)] border-2 border-[var(--subject-fill)] text-[var(--text-primary)]';
                    }

                    return (
                      <button
                        key={opt.id}
                        disabled={isChecked}
                        onClick={() => {
                          sound.playClick();
                          setSelectedOption(opt.id);
                        }}
                        className={`w-full p-3.5 rounded-2xl text-left text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${optionStyle}`}
                      >
                        <span>{renderFormulaText(opt.text)}</span>
                        {isChecked && opt.correct && (
                          <Check className="w-4 h-4 text-[var(--ok-fg)] stroke-[3]" />
                        )}
                        {isChecked && isSelected && !opt.correct && (
                          <X className="w-4 h-4 text-[var(--err-fg)] stroke-[3]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isChecked && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface-2)] text-xs leading-relaxed text-[var(--text-secondary)]"
                  >
                    💡 {renderFormulaText(theory.quickCheck.explanation)}
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
              className="bg-[var(--bg-surface)] border border-[var(--border)] p-5 sm:p-6 rounded-3xl space-y-4"
            >
              {/* Badge & Step indicator */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
                    currentCard.badgeColor === 'amber'
                      ? 'bg-[var(--warn-tint)] text-[var(--warn-fg)] border-[var(--warn-edge)]/40'
                      : 'bg-[var(--subject-tint)] text-[var(--subject-fg)] border-[var(--subject-edge)]/40'
                  }`}
                >
                  {currentCard.badgeColor === 'amber' ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : currentCard.badgeColor === 'emerald' ? (
                    isPhysics ? <Zap className="w-3.5 h-3.5" /> : <FlaskConical className="w-3.5 h-3.5" />
                  ) : isPhysics ? (
                    <Zap className="w-3.5 h-3.5" />
                  ) : (
                    <Lightbulb className="w-3.5 h-3.5" />
                  )}
                  {currentCard.badge}
                </span>

                <span className="text-xs font-bold text-[var(--text-tertiary)]">
                  {currentSlide + 1} / {totalSlides}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] leading-tight">
                {renderFormulaText(currentCard.title)}
              </h2>

              {/* Body Content */}
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                {renderFormulaText(currentCard.content)}
              </p>

              {/* Formula Example (if present) */}
              {currentCard.formulaExample && (
                <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] flex items-center justify-center text-center">
                  <MathText
                    text={currentCard.formulaExample}
                    className="font-black text-base sm:text-lg tracking-wide text-[var(--subject-fg)]"
                  />
                </div>
              )}

              {/* Bullet Points */}
              {currentCard.bulletPoints && (
                <div className="space-y-2 pt-1">
                  {currentCard.bulletPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      <span className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[var(--subject-fill)]" />
                      <span>{renderFormulaText(pt)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Highlight Callout Box */}
              {currentCard.callout && (
                <div className="p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface-2)] text-xs sm:text-sm font-bold whitespace-pre-line leading-relaxed text-[var(--text-primary)]">
                  {renderFormulaText(currentCard.callout)}
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* 3. Bottom Sticky Action Navigation */}
      {!isCompleted && (
        <div className="pt-2 border-t border-[var(--border)] flex items-center gap-3">
          {currentSlide > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrev}
              className="px-4 text-[var(--text-secondary)]"
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
              >
                KIỂM TRA
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleFinish}
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
              className="font-black flex items-center justify-center gap-2"
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
