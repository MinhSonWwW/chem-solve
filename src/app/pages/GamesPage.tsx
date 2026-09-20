import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Gamepad2,
  Layers,
  CheckSquare,
  Split,
  ArrowUpDown,
  Flame,
  Play,
  Trophy,
  FlaskConical,
} from 'lucide-react';
import {
  MatchGame,
  FormulaBuilderGame,
  EquationBalanceGame,
  SortGame,
  TrueFalseGame,
  SpeedChallengeGame,
  ReviewGame,
  ReactionBuilderGame,
} from '@/features/minigames';
import { RotateCcw } from 'lucide-react';
import { sound } from '@/lib/audio';

interface GameDef {
  id: string;
  name: string;
  desc: string;
  skill: string;
  icon: React.ElementType;
  color: string;
  borderAccent: string;
}

const MINIGAMES: GameDef[] = [
  {
    id: 'match',
    name: 'Ghép đôi chất & loại',
    desc: 'HCl ↔ Acid, NaOH ↔ Base, CO2 ↔ Oxide...',
    skill: 'Nhận diện chất & loại hợp chất',
    icon: Layers,
    color: 'from-blue-500/20 to-cyan-500/20 text-cyan-400',
    borderAccent: 'hover:border-cyan-500/50',
  },
  {
    id: 'formula-builder',
    name: 'Ghép công thức (Formula Builder)',
    desc: 'Cân bằng điện tích ∑q = 0 để tạo công thức ion',
    skill: 'Hóa trị, điện tích & công thức',
    icon: Split,
    color: 'from-violet-500/20 to-purple-500/20 text-violet-400',
    borderAccent: 'hover:border-violet-500/50',
  },
  {
    id: 'equation-balance',
    name: 'Cân bằng PTHH',
    desc: 'Điền hệ số cân bằng phản ứng hóa học nhanh',
    skill: 'Bảo toàn nguyên tố & PTHH',
    icon: ArrowUpDown,
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400',
    borderAccent: 'hover:border-amber-500/50',
  },
  {
    id: 'sort',
    name: 'Phân loại hợp chất',
    desc: 'Kéo/chọn chất vào 4 nhóm Axit, Bazơ, Oxide, Muối',
    skill: 'Phân loại hóa học vô cơ',
    icon: Gamepad2,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400',
    borderAccent: 'hover:border-emerald-500/50',
  },
  {
    id: 'true-false',
    name: 'Đúng hay Sai',
    desc: 'Phản xạ nhanh với nhận định Hóa học then chốt',
    skill: 'Kiến thức lý thuyết & hiện tượng',
    icon: CheckSquare,
    color: 'from-rose-500/20 to-pink-500/20 text-rose-400',
    borderAccent: 'hover:border-rose-500/50',
  },
  {
    id: 'speed',
    name: 'Thử thách tốc độ (60s)',
    desc: 'Trả lời tối đa câu hỏi trắc nghiệm trong 60 giây',
    skill: 'Tốc độ phản xạ & tính toán',
    icon: Flame,
    color: 'from-yellow-500/20 to-red-500/20 text-yellow-400',
    borderAccent: 'hover:border-yellow-500/50',
  },
  {
    id: 'reaction-builder',
    name: 'Ráp phản ứng (Reaction Builder)',
    desc: 'Chọn chất tham gia và dự đoán sản phẩm phản ứng chính xác',
    skill: 'Phản ứng hóa học & Hiện tượng',
    icon: FlaskConical,
    color: 'from-pink-500/20 to-rose-500/20 text-pink-400',
    borderAccent: 'hover:border-pink-500/50',
  },
  {
    id: 'review',
    name: 'Review Game (Ôn tập Leitner)',
    desc: 'Ôn các câu hỏi từng làm sai theo chu kỳ lặp lại ngắt quãng',
    skill: 'Ghi nhớ dài hạn Leitner',
    icon: RotateCcw,
    color: 'from-indigo-500/20 to-blue-500/20 text-indigo-400',
    borderAccent: 'hover:border-indigo-500/50',
  },
];

export const GamesPage: React.FC = () => {
  const { gameId } = useParams<{ gameId?: string }>();
  const navigate = useNavigate();

  const [highScores, setHighScores] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('chem_minigame_scores');
      if (saved) {
        setHighScores(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, [gameId]);

  const handleExitGame = () => {
    navigate('/games');
  };

  // Render active minigame if gameId matches
  if (gameId === 'match') {
    return <MatchGame onExit={handleExitGame} />;
  }
  if (gameId === 'formula-builder') {
    return <FormulaBuilderGame onExit={handleExitGame} />;
  }
  if (gameId === 'equation-balance') {
    return <EquationBalanceGame onExit={handleExitGame} />;
  }
  if (gameId === 'reaction-builder') {
    return <ReactionBuilderGame onExit={handleExitGame} />;
  }
  if (gameId === 'sort') {
    return <SortGame onExit={handleExitGame} />;
  }
  if (gameId === 'true-false') {
    return <TrueFalseGame onExit={handleExitGame} />;
  }
  if (gameId === 'speed') {
    return <SpeedChallengeGame onExit={handleExitGame} />;
  }
  if (gameId === 'review') {
    return <ReviewGame onExit={handleExitGame} />;
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-black text-slate-100">Kho Minigames</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Luyện phản xạ, củng cố kỹ năng Hóa học và thu thập tới +25 XP mỗi lượt chơi
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {MINIGAMES.map((game) => {
          const Icon = game.icon;
          const bestScore = highScores[game.id] || 0;

          return (
            <motion.div
              key={game.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sound.playClick();
                navigate(`/games/${game.id}`);
              }}
              className={`p-4 bg-slate-900 border border-slate-800 ${game.borderAccent} rounded-2xl flex items-center justify-between cursor-pointer transition-all shadow-md group`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${game.color} border border-slate-700/60 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {game.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">{game.desc}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                      {game.skill}
                    </span>
                    {bestScore > 0 && (
                      <span className="flex items-center gap-1 text-[10px] font-black text-amber-400">
                        <Trophy className="w-3 h-3" /> {bestScore} điểm
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center shrink-0 ml-2 group-hover:bg-cyan-500 group-hover:border-cyan-400 transition-colors">
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400 group-hover:text-slate-950 group-hover:fill-slate-950 transition-colors" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
