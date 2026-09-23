import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  ArrowLeft,
  FlaskConical,
  BookOpen,
  ArrowRight,
  Flame,
  Gamepad2,
  Sparkles,
} from 'lucide-react';
import { Formula } from '@/design-system';
import { searchChemicalData } from '@/features/search/searchEngine';
import { sound } from '@/lib/audio';

const QUICK_SEARCH_CHIPS = ['NaOH', 'H2SO4', 'Mol', 'CO2', 'Acid', 'Kim loại', 'Al2O3', 'Alkane'];

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const results = useMemo(() => searchChemicalData(query), [query]);

  const totalResults =
    results.substances.length +
    results.reactions.length +
    results.skills.length +
    results.lessons.length +
    results.minigames.length;

  return (
    <div className="space-y-4 pb-8">
      {/* Search Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            sound.playClick();
            navigate(-1);
          }}
          className="p-2.5 bg-[#18272f] border-2 border-[#2e4756] rounded-2xl text-slate-400 hover:text-slate-100 transition-colors shadow-[0_2px_0_0_#131f24] cursor-pointer"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 relative">
          <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo naoh, axit, mol, pthh, bài học..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#18272f] border-2 border-[#2e4756] rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors shadow-[0_2px_0_0_#131f24] font-medium"
            autoFocus
          />
        </div>
      </div>

      {/* Quick Search Suggestion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-500 shrink-0 mr-1">Gợi ý:</span>
        {QUICK_SEARCH_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => {
              sound.playClick();
              setQuery(chip);
            }}
            className="px-2.5 py-1 rounded-xl bg-[#18272f] border-2 border-[#2e4756] hover:border-[#38bdf8] text-[11px] font-semibold text-slate-300 shrink-0 transition shadow-[0_2px_0_0_#131f24] cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Search Results Display */}
      {query ? (
        <div className="space-y-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
            <span>Kết quả tìm kiếm cho "{query}"</span>
            <span className="text-[#38bdf8] font-mono">({totalResults})</span>
          </div>

          {totalResults === 0 && (
            <div className="py-12 text-center space-y-2 bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24] rounded-3xl">
              <FlaskConical className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">Không tìm thấy kết quả phù hợp</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Thử tìm theo tên chất không dấu (vd: axit, bazo), công thức (vd: naoh, h2so4) hoặc dạng bài
              </p>
            </div>
          )}

          {/* 1. Substances */}
          {results.substances.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-black text-[#38bdf8] flex items-center gap-1.5 px-1">
                <FlaskConical className="w-3.5 h-3.5" /> Chất hóa học ({results.substances.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.substances.map((s) => (
                  <div
                    key={s.formula}
                    className="p-3 bg-[#18272f] border-2 border-[#2e4756] shadow-[0_2px_0_0_#131f24] rounded-2xl flex items-center justify-between"
                  >
                    <div>
                      <div className="text-base font-black text-slate-100">
                        <Formula formula={s.formula} />
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{s.nameVi}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#131f24] text-[#38bdf8] border border-[#2e4756]">
                      {s.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Chemical Reactions */}
          {results.reactions.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-black text-[#ce82ff] flex items-center gap-1.5 px-1">
                <Flame className="w-3.5 h-3.5" /> Phản ứng hóa học ({results.reactions.length})
              </h2>
              <div className="space-y-2">
                {results.reactions.map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 bg-[#18272f] border-2 border-[#2e4756] shadow-[0_2px_0_0_#131f24] rounded-2xl space-y-1.5"
                  >
                    <div className="text-sm font-black text-slate-100 font-mono">
                      {r.equation}
                    </div>
                    {r.phenomenon && (
                      <p className="text-xs text-slate-400 leading-relaxed">
                        <span className="font-semibold text-slate-300">Hiện tượng: </span>
                        {r.phenomenon.replace(/\[\[.*?\]\]/g, '')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Lessons */}
          {results.lessons.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-black text-[#ff9600] flex items-center gap-1.5 px-1">
                <BookOpen className="w-3.5 h-3.5" /> Bài học & Chương ({results.lessons.length})
              </h2>
              <div className="space-y-2">
                {results.lessons.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => {
                      sound.playClick();
                      navigate(`/learn/${l.grade}`);
                    }}
                    className="p-3 bg-[#18272f] border-2 border-[#2e4756] hover:border-[#ff9600] shadow-[0_2px_0_0_#131f24] rounded-2xl flex items-center justify-between cursor-pointer transition"
                  >
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">{l.title}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Lớp {l.grade} · {l.chapterTitle}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#ff9600] shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Minigames */}
          {results.minigames.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-black text-[#00cd9c] flex items-center gap-1.5 px-1">
                <Gamepad2 className="w-3.5 h-3.5" /> Minigame liên quan ({results.minigames.length})
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {results.minigames.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => {
                      sound.playClick();
                      navigate(`/games/${g.id}`);
                    }}
                    className="p-3 bg-[#18272f] border-2 border-[#2e4756] hover:border-[#00cd9c] shadow-[0_2px_0_0_#131f24] rounded-2xl flex items-center justify-between cursor-pointer transition"
                  >
                    <div>
                      <h3 className="text-xs font-bold text-slate-100">{g.name}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{g.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#00cd9c] shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State / Discovery Guide */
        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-3xl bg-[#18272f] border-2 border-[#2e4756] shadow-[0_4px_0_0_#131f24] space-y-2">
            <h2 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#38bdf8]" />
              Tra cứu hóa học tức thì
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nhập bất kỳ công thức (<span className="text-[#38bdf8]">naoh</span>, <span className="text-[#38bdf8]">caco3</span>), tên chất không dấu (<span className="text-[#38bdf8]">axit</span>, <span className="text-[#38bdf8]">bazo</span>), hoặc dạng bài để tra cứu phương trình và bài học tương ứng.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
