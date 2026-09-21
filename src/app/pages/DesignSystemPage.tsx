import React, { useState } from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Mascot,
  type MascotState,
  Progress,
  Heart,
  Streak,
  XPBadge,
  FeedbackSheet,
  ReactionVisualizer,
  type ReactionEffectType,
} from '@/design-system';
import { sound } from '@/lib/audio';

export const DesignSystemPage: React.FC = () => {
  const navigate = useNavigate();
  const [mascotState, setMascotState] = useState<MascotState>('happy');
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Reaction Visualizer preview state
  const [effectType, setEffectType] = useState<ReactionEffectType>('gas');
  const [effectColor, setEffectColor] = useState<string>('#38bdf8');
  const [effectLabel, setEffectLabel] = useState<string>('↑ Khí H2 bay lên');
  const [effectKey, setEffectKey] = useState<number>(0);

  const triggerEffect = (type: ReactionEffectType, color: string, label: string) => {
    setEffectType(type);
    setEffectColor(color);
    setEffectLabel(label);
    setEffectKey((k) => k + 1);
  };

  const allMascotStates: MascotState[] = [
    'idle',
    'happy',
    'thinking',
    'correct',
    'wrong',
    'celebrating',
    'surprised',
    'sleeping',
    'cheering',
    'out_of_hearts',
  ];

  return (
    <div className="p-4 max-w-md mx-auto space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-100">Design System & Sound</h1>
          <p className="text-xs text-slate-400">Mascot 9 States, Audio FX & Chemical Reactions</p>
        </div>
      </div>

      {/* 1. Mascot Showcase (9 States) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black text-cyan-400 uppercase tracking-wider">
            1. Mascot Flasky (9 Biểu Cảm)
          </h2>
          <span className="text-[10px] text-slate-500 font-bold">Chạm vào bình để sủi bọt</span>
        </div>
        <Card className="flex flex-col items-center gap-4">
          <Mascot state={mascotState} size="lg" />
          <div className="flex flex-wrap gap-1.5 justify-center">
            {allMascotStates.map((st) => (
              <button
                key={st}
                onClick={() => setMascotState(st)}
                className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl border capitalize transition-all cursor-pointer ${
                  mascotState === st
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* 2. Chemical Reaction Effects (PLAN 16.4) */}
      <div className="space-y-3">
        <h2 className="text-xs font-black text-cyan-400 uppercase tracking-wider">
          2. Hiệu ứng phản ứng hóa học (Kiến thức trực quan)
        </h2>
        <Card className="space-y-3">
          <ReactionVisualizer
            key={effectKey}
            type={effectType}
            color={effectColor}
            label={effectLabel}
          />

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => triggerEffect('gas', '#38bdf8', '↑ Thoát khí H2 sủi bọt')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-left flex items-center gap-1.5 cursor-pointer"
            >
              <span>💨</span> Khí bay lên (↑)
            </button>
            <button
              onClick={() => triggerEffect('precipitate', '#ffffff', '↓ Kết tủa BaSO4 trắng')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-left flex items-center gap-1.5 cursor-pointer"
            >
              <span>⚪</span> Kết tủa trắng (↓)
            </button>
            <button
              onClick={() => triggerEffect('precipitate', '#38bdf8', '↓ Kết tủa Cu(OH)2 xanh lam')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-left flex items-center gap-1.5 cursor-pointer"
            >
              <span>🔵</span> Kết tủa xanh Cu(OH)2
            </button>
            <button
              onClick={() => triggerEffect('indicator', '#f43f5e', 'Chỉ thị: Quỳ tím hóa đỏ (Axit)')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-left flex items-center gap-1.5 cursor-pointer"
            >
              <span>🔴</span> Đổi màu chỉ thị
            </button>
          </div>
        </Card>
      </div>

      {/* 3. Audio Soundboard */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" /> 3. Sound FX Synthesizer (0 KB download)
          </h2>
          <button
            onClick={() => {
              const nextMute = !sound.isSoundMuted();
              sound.setMuted(nextMute);
              // force re-render
              setEffectKey((k) => k + 1);
            }}
            className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
          >
            {sound.isSoundMuted() ? '🔇 Đang tắt âm' : '🔊 Đang bật âm'}
          </button>
        </div>
        <Card className="grid grid-cols-3 gap-2">
          <button
            onClick={() => sound.playClick()}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 cursor-pointer"
          >
            Click/Nút
          </button>
          <button
            onClick={() => sound.playCorrect()}
            className="p-2 rounded-xl bg-emerald-950/40 text-emerald-300 border border-emerald-700/50 text-xs font-bold cursor-pointer"
          >
            Đúng ✓
          </button>
          <button
            onClick={() => sound.playWrong()}
            className="p-2 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-700/50 text-xs font-bold cursor-pointer"
          >
            Sai ✗
          </button>
          <button
            onClick={() => sound.playBubbling()}
            className="p-2 rounded-xl bg-cyan-950/40 text-cyan-300 border border-cyan-700/50 text-xs font-bold cursor-pointer"
          >
            Bọt sủi tăm
          </button>
          <button
            onClick={() => sound.playGasHiss()}
            className="p-2 rounded-xl bg-amber-950/40 text-amber-300 border border-amber-700/50 text-xs font-bold cursor-pointer"
          >
            Khí xì
          </button>
          <button
            onClick={() => sound.playStreak()}
            className="p-2 rounded-xl bg-amber-950/40 text-amber-300 border border-amber-700/50 text-xs font-bold cursor-pointer"
          >
            Streak Arpeggio
          </button>
          <button
            onClick={() => sound.playDragDrop()}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 cursor-pointer"
          >
            Kéo thả haptic
          </button>
          <button
            onClick={() => sound.playSubmit()}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 cursor-pointer"
          >
            Submit/Check
          </button>
          <button
            onClick={() => sound.playLevelUp()}
            className="p-2 rounded-xl bg-purple-950/40 text-purple-300 border border-purple-700/50 text-xs font-bold cursor-pointer"
          >
            Thăng cấp 🎺
          </button>
        </Card>
      </div>

      {/* 4. 3D Chunky Buttons */}
      <div className="space-y-3">
        <h2 className="text-xs font-black text-cyan-400 uppercase tracking-wider">
          4. 3D Chunky Buttons (Tactile Feedback)
        </h2>
        <div className="space-y-2">
          <Button variant="primary" fullWidth size="lg">
            NÚT CHUNKY PRIMARY
          </Button>
          <Button variant="success" fullWidth size="lg">
            NÚT CHUNKY SUCCESS
          </Button>
        </div>
      </div>

      {/* 5. Gamification Badges */}
      <div className="space-y-3">
        <h2 className="text-xs font-black text-cyan-400 uppercase tracking-wider">
          5. Gamification & Tiến trình
        </h2>
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Streak days={12} />
            <XPBadge amount={150} />
            <Heart count={4} max={5} />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-300">Tiến trình ống đong (65%):</span>
            <Progress value={65} />
          </div>
        </Card>
      </div>

      {/* 6. Feedback Sheet Trigger Test */}
      <div className="space-y-3">
        <h2 className="text-xs font-black text-cyan-400 uppercase tracking-wider">
          6. Feedback Sheet Trượt Đáy (Duolingo Style)
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="success" size="md" onClick={() => setFeedbackState('correct')}>
            Thử sheet ĐÚNG
          </Button>
          <Button variant="danger" size="md" onClick={() => setFeedbackState('wrong')}>
            Thử sheet SAI
          </Button>
        </div>
      </div>

      {/* Interactive Sheet component */}
      <FeedbackSheet
        status={feedbackState}
        solutionText={
          feedbackState === 'correct'
            ? 'Lời giải: V = 0,2 × 24,79 = 4,96 L.'
            : 'Đáp án đúng là: 4,96 L'
        }
        explanation={
          feedbackState === 'correct'
            ? 'Rất tốt! Bạn nhớ chính xác hằng số 24,79 L/mol ở điều kiện chuẩn.'
            : 'Ở điều kiện chuẩn (25 °C, 1 bar), 1 mol khí chiếm 24,79 L, không phải 22,4 L.'
        }
        onContinue={() => setFeedbackState('idle')}
      />
    </div>
  );
};
