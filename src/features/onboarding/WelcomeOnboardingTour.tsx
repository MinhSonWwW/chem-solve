import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  Heart,
  Flame,
  Gem,
  FlaskConical,
  Dna,
  Zap,
  BookOpen,
  Award,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Mascot } from '@/design-system/components/Mascot';
import { Button } from '@/design-system/components/Button';
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
          className="w-full max-w-lg bg-[#18272f] border-2 border-[#2e4756] shadow-[0_12px_40px_rgba(0,0,0,0.85)] rounded-3xl overflow-hidden flex flex-col max-h-[90dvh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-[#2e4756]/60 shrink-0">
            {/* Step Indicators */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === step
                      ? 'w-6 bg-cyan-400'
                      : idx < step
                      ? 'w-2 bg-[#00cd9c]'
                      : 'w-2 bg-[#2e4756]'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleSkip}
              className="p-1.5 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
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
                    <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">
                      Chào mừng bạn gia nhập!
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-100 leading-tight">
                      Khám phá Khoa Học Tự Nhiên THCS 🚀
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  STEM-Solve là nền tảng luyện tập KHTN theo tinh thần Duolingo: giải từng bước, có gợi ý thông minh, thí nghiệm ảo và cúp vàng vinh danh!
                </p>

                {/* Subject Selector Quick Picker */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    1. Chọn môn học bạn muốn khám phá:
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
                          className={`p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1 active:translate-y-0.5 ${
                            isSelected
                              ? 'bg-[#18272f] border-cyan-400 shadow-[0_4px_0_0_#0284c7]'
                              : 'bg-[#131f24] border-[#2e4756] hover:border-slate-500 shadow-[0_3px_0_0_#101a1f]'
                          }`}
                        >
                          <span className="text-xl">{s.icon}</span>
                          <span className={`text-xs font-black ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                            {s.name}
                          </span>
                          <span className="text-[10px] text-slate-400">Linh vật {s.mascotName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Grade Selector Quick Picker */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    2. Chọn khối lớp của bạn:
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
                          className={`py-2 rounded-xl border-2 font-black text-xs transition-all cursor-pointer active:translate-y-0.5 ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_3px_0_0_#0284c7]'
                              : 'bg-[#131f24] text-slate-300 border-[#2e4756] hover:bg-slate-800'
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
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                      Bản đồ học tập ziczac
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-100 leading-tight">
                      Chinh phục từng nốt bài học 🗺️
                    </h3>
                  </div>
                </div>

                <div className="space-y-2.5 bg-[#131f24] p-3.5 rounded-2xl border border-[#2e4756]">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-amber-300">Nốt sáng nhấp nháy</div>
                      <div className="text-[11px] text-slate-300">
                        Bài học hiện tại của bạn. Hoàn thành bài này sẽ mở khóa nốt tiếp theo trên đường ziczac!
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-sky-300">Nốt Sổ tay Lý thuyết</div>
                      <div className="text-[11px] text-slate-300">
                        Đọc nhanh lý thuyết tóm tắt 2 phút dạng flashcard trước khi vào làm bài tập.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-purple-300">Rương kho báu & Cúp vàng 3D</div>
                      <div className="text-[11px] text-slate-300">
                        Mở rương nhận 50–100 Đá quý. Kết thúc mỗi chương sẽ nhận được Cúp vinh danh 3D độc quyền!
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
                    <span className="text-[11px] font-black uppercase tracking-wider text-rose-400">
                      Cơ chế Trái Tim ❤️
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-100 leading-tight">
                      Hết tim thì hồi phục thế nào?
                    </h3>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-xs text-rose-200 leading-relaxed">
                  ❤️ Bạn bắt đầu với <strong>5 Trái Tim</strong>. Mỗi lần trả lời chưa đúng sẽ bị trừ 1 tim.
                </div>

                <div className="space-y-2 bg-[#131f24] p-3.5 rounded-2xl border border-[#2e4756]">
                  <div className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    3 cách hồi tim siêu tốc cho bạn:
                  </div>

                  <div className="text-xs text-slate-300 space-y-1.5 pl-5 pt-1">
                    <p>
                      🌿 <strong>Cách 1 (Tuyệt nhất):</strong> Vào tab <strong>Luyện tập</strong> (menu dưới đáy). Tại đây bài tập mở tự do, <strong>không bao giờ trừ tim</strong>, cứ làm đúng 1 bài là được <strong>+1 Tim hồi phục miễn phí!</strong>
                    </p>
                    <p>
                      🛒 <strong>Cách 2:</strong> Vào <strong>Cửa hàng</strong> dùng Đá quý để mua đầy bình 5 Tim.
                    </p>
                    <p>
                      ⏳ <strong>Cách 3:</strong> Nghỉ ngơi thư giãn — hệ thống tự hồi 1 tim mỗi 20 phút.
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
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                      Kinh tế trò chơi
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-100 leading-tight">
                      Đá quý 💎 & Chuỗi ngày 🔥
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-[#131f24] border border-[#2e4756] space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-400">
                      <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                      Chuỗi ngày Streak
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Hoàn thành ít nhất 1 bài mỗi ngày để giữ ngọn lửa đèn cồn rực cháy!
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#131f24] border border-[#2e4756] space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400">
                      <Gem className="w-4 h-4 text-emerald-400 fill-emerald-400/40" />
                      Đá quý (Gems)
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Tích lũy khi hoàn thành bài học, chuỗi combo và mở rương kho báu.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#131f24] border border-[#2e4756] space-y-1">
                  <div className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    Cửa hàng vật phẩm (`/shop`):
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Dùng Đá quý để mua <strong>Khiên bảo vệ Streak</strong> (tránh đứt chuỗi khi bận thi cử), mua Tim hồi phục và các bình thuốc tăng tốc độ học tập!
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
                <div className="inline-block p-3.5 rounded-3xl bg-[#131f24] border-2 border-[#2e4756] shadow-[0_6px_0_0_#101a1f]">
                  <Mascot state="celebrating" size="lg" subject={selectedSubject} />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                    Phần thưởng tân thủ
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-100">
                    Bạn đã sẵn sàng chinh phục! 🎉
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
                  Đừng quên ghé thăm <strong>Phòng Lab Ảo</strong> (`/lab`) để tự tay nhỏ giọt hóa chất, soi kính hiển vi và lắp ráp mạch điện sáng đèn nhé!
                </p>

                {/* Welcome Bonus Box */}
                <div className="p-4 rounded-2xl bg-[#131f24] border-2 border-[#f59e0b] shadow-[0_4px_0_0_#b45309] space-y-1.5">
                  <div className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                    QUÀ TẶNG KHỞI NGHIỆP DÀNH CHO BẠN
                  </div>
                  <div className="text-2xl font-black text-amber-300 flex items-center justify-center gap-2">
                    <Gem className="w-6 h-6 fill-amber-400 text-amber-400" />
                    <span>+50 ĐÁ QUÝ (GEMS)</span>
                  </div>
                  <div className="text-xs text-amber-200/90 font-medium">
                    Đã tự động cộng vào tài khoản để bạn tự tin xuất phát!
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Navigation Buttons */}
          <div className="p-4 sm:p-5 border-t border-[#2e4756] bg-[#131f24] shrink-0 flex items-center justify-between gap-3">
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
              variant="primary"
              size="md"
              className={step === totalSteps - 1 ? 'bg-[#00cd9c] hover:bg-[#00e6aa] text-[#131f24] font-black border-b-4 border-[#009b76] active:translate-y-1 active:border-b-0' : ''}
              onClick={handleNext}
            >
              <span>{step === totalSteps - 1 ? 'BẮT ĐẦU CHINH PHỤC NGAY!' : 'TIẾP TỤC'}</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
