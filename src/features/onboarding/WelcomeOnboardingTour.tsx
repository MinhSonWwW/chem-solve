import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Flame,
  Gem,
  BookOpen,
  Award,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Mascot } from '@/design-system/components/Mascot';
import { Button } from '@/design-system/components/Button';
import { SubjectIcon } from '@/design-system/components/SubjectIcon';
import { sound } from '@/lib/audio';
import { haptic } from '@/lib/haptic';
import { useUserStore } from '@/features/gamification/useUserStore';
import { useActiveSubject, useActiveGrade, setActiveGrade, setActiveSubject, SUBJECTS, SubjectId } from '@/content/subjects';
import type { Grade } from '@/content/curriculum';

interface WelcomeOnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeOnboardingTour: React.FC<WelcomeOnboardingTourProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const { addGems } = useUserStore();
  const { subject: activeSubject, setSubject: setActiveSubjectState } = useActiveSubject();
  const { grade: activeGrade, setGrade: setActiveGradeState } = useActiveGrade();

  // Local state to reliably hold student's selection in the modal
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(() => activeSubject || 'chem');
  const [selectedGrade, setSelectedGrade] = useState<Grade>(() => activeGrade || 8);

  if (!isOpen) return null;

  const totalSteps = 5;

  const handleSelectSubject = (sId: SubjectId) => {
    setSelectedSubject(sId);
    setActiveSubjectState(sId);
    setActiveSubject(sId);
  };

  const handleSelectGrade = (g: Grade) => {
    setSelectedGrade(g);
    setActiveGradeState(g);
    setActiveGrade(g);
    navigate(`/learn/${g}`, { replace: true });
  };

  const handleNext = () => {
    sound.playClick();
    haptic.tap();
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    sound.playClick();
    haptic.tap();
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    sound.playLevelUp();
    haptic.completion();
    // Reward welcome bonus: +50 Gems!
    addGems(50);
    setActiveGrade(selectedGrade);
    setActiveSubject(selectedSubject);
    navigate(`/learn/${selectedGrade}`, { replace: true });
    onClose();
  };

  const handleSkip = () => {
    sound.playClick();
    haptic.tap();
    setActiveGrade(selectedGrade);
    setActiveSubject(selectedSubject);
    navigate(`/learn/${selectedGrade}`, { replace: true });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border)] shadow-[var(--shadow-modal)] rounded-3xl overflow-hidden flex flex-col max-h-[90dvh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-[var(--border)] shrink-0">
            {/* Step Indicators */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === step
                      ? 'w-6 bg-[var(--subject-fill)]'
                      : idx < step
                      ? 'w-2 bg-[var(--ok-fill)]'
                      : 'w-2 bg-[var(--bg-surface-2)]'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleSkip}
              className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-surface-2)] transition-colors cursor-pointer"
              title="Bỏ qua hướng dẫn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content - Scrollable if small screen */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
            {/* STEP 1: Welcome & Subject/Grade Selection */}
            {step === 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3.5">
                  <Mascot state="celebrating" size="md" subject={selectedSubject} />
                  <div>
                    <span className="text-xs font-black text-[var(--subject-fg)]">
                      Chào bạn
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)] leading-tight">
                      Bạn học môn nào, lớp mấy?
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Chọn môn và lớp để Sci-Solve xếp bài đúng theo SGK Kết nối tri thức. Bạn đổi lại được bất cứ lúc nào.
                </p>

                {/* Subject Selector Quick Picker */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-black text-[var(--text-tertiary)]">
                    Môn học
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {SUBJECTS.map((s) => {
                      const isSelected = selectedSubject === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            haptic.tap();
                            sound.playClick();
                            handleSelectSubject(s.id as SubjectId);
                          }}
                          className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 active:translate-y-0.5 ${
                            isSelected
                              ? 'bg-[var(--subject-tint)] border-[var(--subject-fill)] shadow-[0_3px_0_0_var(--subject-edge)]'
                              : 'bg-[var(--bg-surface-2)] border-[var(--border)] hover:border-[var(--border-strong)]'
                          }`}
                        >
                          <SubjectIcon subject={s.id} className="w-5 h-5 text-[var(--subject-fg)]" />
                          <span className={`text-xs font-black ${isSelected ? 'text-[var(--subject-fg)]' : 'text-[var(--text-primary)]'}`}>
                            {s.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Grade Selector Quick Picker */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-black text-[var(--text-tertiary)]">
                    Lớp
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {([6, 7, 8, 9] as Grade[]).map((g) => {
                      const isSelected = selectedGrade === g;
                      return (
                        <button
                          key={g}
                          onClick={() => {
                            haptic.tap();
                            sound.playClick();
                            handleSelectGrade(g);
                          }}
                          className={`py-2 rounded-xl border font-black text-xs transition-all cursor-pointer active:translate-y-0.5 ${
                            isSelected
                              ? 'bg-[var(--subject-fill)] text-white border-[var(--subject-edge)] shadow-[0_3px_0_0_var(--subject-edge)]'
                              : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--bg-canvas)]'
                          }`}
                        >
                          Lớp {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: SnakePath & Learning Nodes */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3.5">
                  <Mascot state="thinking" size="md" subject={selectedSubject} />
                  <div>
                    <span className="text-xs font-black text-[var(--warn-fg)]">
                      Lộ trình
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)] leading-tight">
                      Học lần lượt từng bài
                    </h3>
                  </div>
                </div>

                <div className="space-y-2.5 bg-[var(--bg-surface-2)] p-3.5 rounded-2xl border border-[var(--border)]">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[var(--warn-tint)] border border-[var(--warn-edge)] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-[var(--warn-fg)]" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[var(--warn-fg)]">Bài đang học</div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        Làm xong bài này thì bài kế tiếp sẽ mở.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[var(--subject-tint)] border border-[var(--subject-edge)] flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-[var(--subject-fg)]" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[var(--subject-fg)]">Lý thuyết</div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        Tóm tắt ngắn, đọc khoảng 2 phút trước khi làm bài.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[var(--gold-tint)] border border-[var(--gold-edge)] flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 text-[var(--gold-fg)]" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[var(--gold-fg)]">Rương và cúp</div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        Rương cho 50–100 đá quý. Học xong một chương thì bạn nhận một chiếc cúp.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Hearts System & Practice Regeneration */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3.5">
                  <Mascot state="cheering" size="md" subject={selectedSubject} />
                  <div>
                    <span className="text-xs font-black text-[var(--err-fg)]">
                      Tim
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)] leading-tight">
                      Hết tim thì làm sao?
                    </h3>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--err-tint)] border border-[var(--err-edge)] text-xs text-[var(--err-fg)] leading-relaxed">
                  Bạn có <strong>5 tim</strong>. Mỗi câu trả lời sai mất 1 tim.
                </div>

                <div className="space-y-2 bg-[var(--bg-surface-2)] p-3.5 rounded-2xl border border-[var(--border)]">
                  <div className="text-xs font-black text-[var(--text-primary)] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[var(--ok-fg)]" />
                    Có 3 cách lấy lại tim:
                  </div>

                  <div className="text-xs text-[var(--text-secondary)] space-y-1.5 pl-5 pt-1">
                    <p><strong>Luyện tập:</strong> làm đúng 1 bài trong tab Luyện tập được +1 tim. Ở đó làm sai không bị trừ tim.
                    </p>
                    <p><strong>Cửa hàng:</strong> đổi đá quý lấy tim.
                    </p>
                    <p>
                      <strong>Chờ:</strong> cứ 20 phút tim tự hồi 1.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Gems, Streak & Shop */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3.5">
                  <Mascot state="happy" size="md" subject={selectedSubject} />
                  <div>
                    <span className="text-xs font-black text-[var(--ok-fg)]">
                      Đá quý và chuỗi ngày
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)] leading-tight">
                      Học đều mỗi ngày
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black text-[var(--warn-fg)]">
                      <Flame className="w-4 h-4 text-[var(--warn-fg)] fill-[var(--warn-fill)]" />
                      Chuỗi ngày
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-snug">
                      Mỗi ngày làm ít nhất 1 bài để giữ chuỗi.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black text-[var(--gem-fg)]">
                      <Gem className="w-4 h-4 text-[var(--gem-fg)] fill-[var(--gem-tint)]" />
                      Đá quý
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-snug">
                      Nhận khi xong bài, đạt combo hoặc mở rương.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] space-y-1">
                  <div className="text-xs font-black text-[var(--subject-fg)] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[var(--subject-fg)]" />
                    Cửa hàng
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Dùng đá quý mua tim, hoặc mua khiên giữ chuỗi cho những ngày bận ôn thi.
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Virtual Lab & Welcome Gift */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4 text-center"
              >
                <div className="inline-block p-3.5 rounded-3xl bg-[var(--bg-surface-2)] border border-[var(--border)]">
                  <Mascot state="celebrating" size="lg" subject={selectedSubject} />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-black text-[var(--gold-fg)]">
                    Xong rồi
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
                    Bắt đầu thôi
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm mx-auto">
                  Lúc rảnh, thử vào <strong>Phòng thí nghiệm ảo</strong> trong tab Luyện tập: nhỏ hóa chất, soi kính hiển vi, lắp mạch điện.
                </p>

                {/* Welcome Bonus Box */}
                <div className="p-4 rounded-2xl bg-[var(--gold-tint)] border border-[var(--gold-edge)] space-y-1.5">
                  <div className="text-xs font-black text-[var(--gold-fg)] flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[var(--gold-fg)] fill-[var(--gold-fill)]" />
                    Quà mở đầu
                  </div>
                  <div className="text-2xl font-black text-[var(--gold-fg)] flex items-center justify-center gap-2">
                    <Gem className="w-6 h-6 fill-[var(--gold-fill)] text-[var(--gold-fg)]" />
                    <span>+50 đá quý</span>
                  </div>
                  <div className="text-xs text-[var(--gold-fg)] font-medium">
                    Được cộng khi bạn bấm Bắt đầu học.
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Navigation Buttons */}
          <div className="p-4 sm:p-5 border-t border-[var(--border)] bg-[var(--bg-surface)] shrink-0 flex items-center justify-between gap-3">
            {step > 0 ? (
              <Button
                variant="surface"
                size="md"
                onClick={handlePrev}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </Button>
            ) : (
              <div />
            )}

            <Button
              variant={step === totalSteps - 1 ? 'ok' : 'primary'}
              size="md"
              onClick={handleNext}
            >
              <span>{step === totalSteps - 1 ? 'Bắt đầu học' : 'Tiếp tục'}</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
