import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Target } from 'lucide-react';
import { MinigameShell, Button, Formula, MathText } from '@/design-system';
import { sound } from '@/lib/audio';
import { haptic } from '@/lib/haptic';
import { useUserStore } from '@/features/gamification/useUserStore';

interface EcoMission {
  id: string;
  title: string;
  pollutionType: 'Khí thải độc' | 'Nước thải acid' | 'Kim loại nặng' | 'Hiệu ứng nhà kính' | 'Rác thải nhựa' | 'Khí độc ngạt';
  pollutantName: string;
  pollutantFormula: string;
  situation: string;
  targetPhOrPpm?: string;
  targetStatus: string;
  reactionEquation?: string;
  options: {
    id: string;
    label: string;
    formula?: string;
    desc: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

const ECO_MISSIONS: EcoMission[] = [
  {
    id: 'eco-1',
    title: 'Xử lý khói thải nhiệt điện ([[SO2]])',
    pollutionType: 'Khí thải độc',
    pollutantName: 'Khí sulfur dioxide ([[SO2]])',
    pollutantFormula: 'SO2',
    situation: 'Ống khói nhà máy nhiệt điện đang xả khí [[SO2]] đậm đặc gây mưa acid và bệnh hô hấp. Hãy chọn dung dịch hấp thụ để làm sạch ống khói!',
    targetStatus: 'Khử 98% SO2, khói xám thành hơi nước trong lành',
    reactionEquation: 'SO2 + Ca(OH)2 → CaSO3↓ + H2O',
    options: [
      {
        id: 'opt-1a',
        label: 'Sục qua dung dịch Nước vôi trong',
        formula: 'Ca(OH)2',
        desc: 'Base rẻ tiền tác dụng oxide acid tạo kết tủa calcium sulfite không độc',
        isCorrect: true,
        feedback: 'Chính xác! [[SO2 + Ca(OH)2 → CaSO3↓ + H2O]]. Khói độc bị giữ lại hoàn toàn!',
      },
      {
        id: 'opt-1b',
        label: 'Sục qua hydrochloric acid',
        formula: 'HCl',
        desc: 'Acid mạnh',
        isCorrect: false,
        feedback: 'Sai! Cả hai đều có tính acid nên không phản ứng với nhau.',
      },
      {
        id: 'opt-1c',
        label: 'Phun Nước cất thông thường',
        formula: 'H2O',
        desc: 'Nước lọc',
        isCorrect: false,
        feedback: 'Sai! Nước hấp thụ [[SO2]] kém và sẽ tạo thêm acid [[H2SO3]] gây ăn mòn thiết bị.',
      },
      {
        id: 'opt-1d',
        label: 'Sục qua dung dịch Muối ăn',
        formula: 'NaCl',
        desc: 'Muối trung tính',
        isCorrect: false,
        feedback: 'Sai! [[NaCl]] là muối trung tính, không phản ứng với [[SO2]].',
      },
    ],
  },
  {
    id: 'eco-2',
    title: 'Giải cứu dòng sông nhiễm acid ($pH = 2.0$)',
    pollutionType: 'Nước thải acid',
    pollutantName: 'Sulfuric acid rò rỉ ([[H2SO4]])',
    pollutantFormula: 'H2SO4',
    situation: 'Nước thải mỏ quặng làm nước sông biến vàng cam, độ chua cực đại ($pH = 2.0$), cá tôm chết hàng loạt. Hãy trung hòa nước sông về ngưỡng an toàn ($pH \\approx 7.0$)!',
    targetPhOrPpm: 'pH 2.0 -> pH 7.0',
    targetStatus: 'Đưa pH về mức an toàn sinh thái 7.0',
    reactionEquation: 'H2SO4 + Ca(OH)2 → CaSO4 + 2H2O',
    options: [
      {
        id: 'opt-2a',
        label: 'Rải Vôi tôi / Vôi bột',
        formula: 'Ca(OH)2',
        desc: 'Chất kiềm hóa học an toàn, chi phí thấp, trung hòa triệt để acid',
        isCorrect: true,
        feedback: 'Rất chuẩn! Phản ứng trung hòa [[H2SO4 + Ca(OH)2 → CaSO4 + 2H2O]] nâng pH về 7.0, dòng sông hồi sinh!',
      },
      {
        id: 'opt-2b',
        label: 'Đổ Giấm ăn vào sông',
        formula: 'CH3COOH',
        desc: 'Acid hữu cơ',
        isCorrect: false,
        feedback: 'Sai! Giấm ăn là acid, sẽ làm nước sông càng thêm chua và ô nhiễm nặng hơn.',
      },
      {
        id: 'opt-2c',
        label: 'Rải Cát xây dựng',
        formula: 'SiO2',
        desc: 'Oxit phi kim trơ',
        isCorrect: false,
        feedback: 'Sai! Cát ([[SiO2]]) hoàn toàn trơ với acid loãng ở nhiệt độ thường.',
      },
      {
        id: 'opt-2d',
        label: 'Thêm Phân bón đạm Urê',
        formula: '(NH2)2CO',
        desc: 'Hợp chất dinh dưỡng',
        isCorrect: false,
        feedback: 'Sai! Urê làm phú dưỡng nguồn nước, gây tảo nở hoa bóp nghẹt oxy của cá.',
      },
    ],
  },
  {
    id: 'eco-3',
    title: 'Khử kim loại nặng độc hại ([[Cu^2+]], [[Pb^2+]])',
    pollutionType: 'Kim loại nặng',
    pollutantName: 'Ion kim loại Chì & Đồng ([[Pb^2+]], [[Cu^2+]])',
    pollutantFormula: 'Pb2+, Cu2+',
    situation: 'Nước thải xưởng mạ kim loại chứa hàm lượng ion đồng và chì vượt ngưỡng cho phép 20 lần. Cần kết tủa lắng đọng và lọc sạch trước khi xả ra môi trường!',
    targetStatus: 'Kết tủa 100% ion kim loại nặng',
    reactionEquation: 'Cu^2+ + 2OH^- → Cu(OH)2↓ (kết tủa xanh lam)',
    options: [
      {
        id: 'opt-3a',
        label: 'Bơm dung dịch Kiềm tạo kết tủa Hydroxide',
        formula: 'NaOH / Ca(OH)2',
        desc: 'Tạo kết tủa không tan Cu(OH)2, Pb(OH)2 rồi lọc tách',
        isCorrect: true,
        feedback: 'Tuyệt vời! Các ion kim loại chuyển thành kết tủa không tan [[Cu(OH)2↓]], [[Pb(OH)2↓]], dễ dàng lọc qua màng than hoạt tính!',
      },
      {
        id: 'opt-3b',
        label: 'Thêm sulfuric acid đặc',
        formula: 'H2SO4',
        desc: 'Acid mạnh',
        isCorrect: false,
        feedback: 'Sai! Acid mạnh hòa tan ion kim loại và làm tăng tính độc hại của nước.',
      },
      {
        id: 'opt-3c',
        label: 'Sục khí Oxy sủi bọt',
        formula: 'O2',
        desc: 'Khí oxy',
        isCorrect: false,
        feedback: 'Sai! Khí Oxy không thể tự kết tủa hoặc loại bỏ ion [[Cu^2+]] ra khỏi dung dịch.',
      },
      {
        id: 'opt-3d',
        label: 'Đổ Cồn y tế Ethanol',
        formula: 'C2H5OH',
        desc: 'Dung môi hữu cơ',
        isCorrect: false,
        feedback: 'Sai! Cồn không phản ứng kết tủa ion kim loại nặng trong nước.',
      },
    ],
  },
  {
    id: 'eco-4',
    title: 'Hấp thụ khí nhà kính & tái sinh rừng ([[CO2]])',
    pollutionType: 'Hiệu ứng nhà kính',
    pollutantName: 'Khí carbon dioxide ([[CO2]])',
    pollutantFormula: 'CO2',
    situation: 'Nồng độ [[CO2]] tăng cao vượt 420 ppm gây hiệu ứng nhà kính và biến đổi khí hậu toàn cầu. Đâu là giải pháp tự nhiên bền vững nhất để thu giữ [[CO2]] và trả lại [[O2]]?',
    targetStatus: 'Hấp thụ CO2 và giải phóng O2 tự nhiên',
    reactionEquation: '6CO2 + 6H2O → C6H12O6 + 6O2 (quang hợp)',
    options: [
      {
        id: 'opt-4a',
        label: 'Phủ xanh rừng cây & Kích hoạt Quang hợp',
        formula: 'Quang hợp',
        desc: 'Lục lạp dùng năng lượng mặt trời chuyển 6CO2 + 6H2O thành C6H12O6 + 6O2',
        isCorrect: true,
        feedback: 'Chính xác! Chu trình quang hợp của cây xanh là "cỗ máy lọc khí quyển" vĩ đại nhất của Trái Đất!',
      },
      {
        id: 'opt-4b',
        label: 'Đốt rừng lấy đất nông nghiệp',
        formula: 'Đốt cháy',
        desc: 'Phá hủy rừng',
        isCorrect: false,
        feedback: 'Rất nguy hiểm! Đốt rừng thải ra hàng triệu tấn [[CO2]] và làm mất lá phổi xanh.',
      },
      {
        id: 'opt-4c',
        label: 'Xả khí Metan vào tầng đối lưu',
        formula: 'CH4',
        desc: 'Khí thiên nhiên',
        isCorrect: false,
        feedback: 'Sai lầm nghiêm trọng! Metan giữ nhiệt gấp 28 lần [[CO2]], làm Trái Đất nóng nhanh hơn.',
      },
      {
        id: 'opt-4d',
        label: 'Bơm nước ngầm lên bề mặt',
        formula: 'H2O',
        desc: 'Khai thác nước',
        isCorrect: false,
        feedback: 'Sai! Khai thác nước ngầm quá mức gây sụt lún và không làm giảm [[CO2]] khí quyển.',
      },
    ],
  },
  {
    id: 'eco-5',
    title: 'Phân loại & tái chế polyme rác thải',
    pollutionType: 'Rác thải nhựa',
    pollutantName: 'Rác thải nhựa Polyme khó phân hủy',
    pollutantFormula: 'PE, PP, PET',
    situation: 'Hàng ngàn tấn rác nhựa trôi nổi đang đe dọa sinh vật biển. Đâu là biện pháp xử lý rác thải nhựa polyme chuẩn khoa học môi trường?',
    targetStatus: 'Tái chế tuần hoàn, giảm phát thải vi nhựa',
    options: [
      {
        id: 'opt-5a',
        label: 'Phân loại tại nguồn & Tái chế cơ học tuần hoàn',
        formula: 'Tái chế',
        desc: 'Tách riêng PET, PE, PP để rửa sạch, nấu chảy ép hạt nhựa tái sinh',
        isCorrect: true,
        feedback: 'Tuyệt vời! Phân loại tại nguồn giúp tái chế 90% nhựa và ngăn rác thải đổ ra đại dương!',
      },
      {
        id: 'opt-5b',
        label: 'Đốt rác nhựa ngoài bãi hở',
        formula: 'Đốt hở',
        desc: 'Đốt cháy tự do',
        isCorrect: false,
        feedback: 'Cực kỳ độc hại! Đốt nhựa hở sinh ra Dioxin và Furan - các chất độc gây ung thư cực mạnh.',
      },
      {
        id: 'opt-5c',
        label: 'Chôn lấp xuống lòng đất ruộng',
        formula: 'Chôn lấp',
        desc: 'Chôn trực tiếp',
        isCorrect: false,
        feedback: 'Sai! Nhựa mất 400-500 năm mới phân hủy, sẽ rã thành hạt vi nhựa đầu độc đất và chuỗi thức ăn.',
      },
      {
        id: 'opt-5d',
        label: 'Đổ rác ra biển sâu xa bờ',
        formula: 'Xả biển',
        desc: 'Thải ra đại dương',
        isCorrect: false,
        feedback: 'Rất tàn phá! Rác nhựa giết chết rùa biển, chim hải âu và san hô.',
      },
    ],
  },
];

export const EcoRescueLabGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { addXp, addGems } = useUserStore();

  const [missionIndex, setMissionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [ecoHealth, setEcoHealth] = useState(25); // 25% -> 100%
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  // Xáo trộn ngẫu nhiên các phương án lựa chọn để đáp án đúng không bị cố định ở câu đầu (A)
  const [shuffledMissions, setShuffledMissions] = useState(() =>
    ECO_MISSIONS.map((m) => ({
      ...m,
      options: [...m.options].sort(() => 0.5 - Math.random()),
    }))
  );

  const currentMission = shuffledMissions[missionIndex] || shuffledMissions[0];

  const handleSelectOption = (option: EcoMission['options'][0]) => {
    if (isAnswered) return;

    setSelectedOptionId(option.id);
    setIsAnswered(true);

    if (option.isCorrect) {
      sound.playCorrect();
      haptic.correct();
      // Điểm arcade: 20 điểm/nhiệm vụ + combo bonus, tổng điểm ~100-140 điểm
      const missionScore = 20 + combo * 5;
      setScore((s) => s + missionScore);
      setCombo((c) => c + 1);
      setEcoHealth((prev) => Math.min(100, prev + 15));
    } else {
      sound.playWrong();
      haptic.wrong();
      setCombo(0);
    }
  };

  const handleNextMission = () => {
    sound.playClick();
    setSelectedOptionId(null);
    setIsAnswered(false);

    if (missionIndex + 1 < ECO_MISSIONS.length) {
      setMissionIndex((i) => i + 1);
    } else {
      // Completed all environmental missions!
      setIsGameOver(true);
      // Chuẩn hóa XP: Hoàn thành 5 nhiệm vụ giải cứu nhận 20-25 XP và 5 Đá quý
      const totalXp = Math.min(25, Math.max(10, Math.round(score / 5)));
      setEarnedXp(totalXp);
      addXp(totalXp);
      addGems(5);
      sound.playLevelUp();
      haptic.completion();
    }
  };

  const handleRestart = () => {
    setShuffledMissions(
      ECO_MISSIONS.map((m) => ({
        ...m,
        options: [...m.options].sort(() => 0.5 - Math.random()),
      }))
    );
    setMissionIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setEcoHealth(25);
    setScore(0);
    setCombo(0);
    setIsGameOver(false);
    setEarnedXp(0);
  };

  const selectedOpt = currentMission.options.find((o) => o.id === selectedOptionId);

  return (
    <MinigameShell
      title="Chiến dịch giải cứu môi trường xanh"
      description="Ứng dụng phản ứng hóa học xử lý khói độc, trung hòa nước thải và bảo vệ hành tinh xanh!"
      icon={<Leaf className="w-5 h-5 text-[var(--bio-fg)]" />}
      score={score}
      combo={combo}
      isGameOver={isGameOver}
      earnedXp={earnedXp}
      onExit={onExit}
      onRestart={handleRestart}
    >
      <div className="space-y-4">
        {/* ─── 1. Planet Eco-Health Progress Bar ─── */}
        <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-[var(--bio-fg)]">
              <Leaf className="w-4 h-4 text-[var(--bio-fill)]" />
              Chỉ số hành tinh xanh (Eco-Health):
            </span>
            <span className="font-mono text-sm font-black text-[var(--bio-fg)]">
              {ecoHealth}%
            </span>
          </div>
          <div className="w-full bg-[var(--bg-surface-2)] h-3 rounded-full overflow-hidden border border-[var(--border)]">
            <motion.div
              animate={{ width: `${ecoHealth}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full rounded-full shadow-sm bg-emerald-500"
            />
          </div>
        </div>

        {/* ─── 2. Environmental Scenario Visual Card ─── */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border)] shadow-sm space-y-3 relative overflow-hidden">
          {/* Badge & Stage */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black px-2.5 py-1 rounded-xl bg-[var(--bio-tint)] text-[var(--bio-fg)] border border-[var(--bio-edge)] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              NHIỆM VỤ {missionIndex + 1}/{ECO_MISSIONS.length}: {currentMission.pollutionType}
            </span>
            <span className="text-xs font-mono font-bold text-[var(--text-tertiary)]">
              Chất độc: <Formula formula={currentMission.pollutantFormula} />
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-black text-[var(--text-primary)] leading-snug">
            <MathText text={currentMission.title} />
          </h2>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            <MathText text={currentMission.situation} />
          </p>

          {/* Goal Tag */}
          <div className="p-2.5 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)] flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
            <Target className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
            <span className="text-[var(--text-secondary)]">Mục tiêu xử lý:</span>
            <span className="text-[var(--ok-fg)]"><MathText text={currentMission.targetStatus} /></span>
          </div>
        </div>

        {/* ─── 3. Solution Choices ─── */}
        <div className="space-y-2.5">
          <div className="text-xs font-black text-[var(--text-tertiary)] px-1">
            Chọn hóa chất & phương án xử lý môi trường:
          </div>

          {currentMission.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            let btnClass = 'bg-[var(--bg-surface)] border-2 border-[var(--border-strong)] text-[var(--text-primary)] shadow-[0_3px_0_0_var(--edge-neutral)] hover:bg-[var(--bg-surface-2)]';

            if (isAnswered) {
              if (option.isCorrect) {
                btnClass = 'bg-[var(--ok-tint)] border-2 border-[var(--ok-fill)] text-[var(--ok-fg)] shadow-[0_3px_0_0_var(--ok-edge)]';
              } else if (isSelected && !option.isCorrect) {
                btnClass = 'bg-[var(--err-tint)] border-2 border-[var(--err-fill)] text-[var(--err-fg)] shadow-[0_3px_0_0_var(--err-edge)]';
              } else {
                btnClass = 'bg-[var(--bg-surface-2)] border border-[var(--border)] text-[var(--text-tertiary)] opacity-50';
              }
            }

            return (
              <button
                key={option.id}
                disabled={isAnswered}
                onClick={() => handleSelectOption(option)}
                className={`w-full p-3.5 sm:p-4 rounded-2xl text-left transition-all cursor-pointer flex flex-col gap-1 active:translate-y-[2px] active:shadow-none ${btnClass}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-black">
                    <MathText text={option.label} />
                  </span>
                  {option.formula && (
                    <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-md bg-[var(--bg-surface-2)] border border-[var(--border)]">
                      <Formula formula={option.formula} />
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  <MathText text={option.desc} />
                </p>
              </button>
            );
          })}
        </div>

        {/* ─── 4. Feedback & Chemical Equation Explanation ─── */}
        <AnimatePresence>
          {isAnswered && selectedOpt && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-2xl border-2 space-y-2 ${
                selectedOpt.isCorrect
                  ? 'bg-[var(--ok-tint)] border-[var(--ok-fill)] text-[var(--ok-fg)]'
                  : 'bg-[var(--err-tint)] border-[var(--err-fill)] text-[var(--err-fg)]'
              }`}
            >
              <div className="flex items-center gap-2 font-black text-sm">
                {selectedOpt.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[var(--ok-fill)]" />
                    <span>Xử lý thành công!</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-[var(--err-fill)]" />
                    <span>Chưa đúng quy chuẩn môi trường!</span>
                  </>
                )}
              </div>

              <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                <MathText text={selectedOpt.feedback} />
              </p>

              {currentMission.reactionEquation && (
                <div className="mt-1 p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-xs font-mono font-bold text-[var(--subject-fg)]">
                  PTHH: <Formula formula={currentMission.reactionEquation} />
                </div>
              )}

              <div className="pt-2">
                <Button
                  variant={selectedOpt.isCorrect ? 'ok' : 'primary'}
                  size="md"
                  fullWidth
                  onClick={handleNextMission}
                  className="flex items-center justify-center gap-2"
                >
                  <span>{missionIndex + 1 < ECO_MISSIONS.length ? 'Tiếp tục sự cố tiếp theo' : 'Hoàn thành chiến dịch'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MinigameShell>
  );
};

