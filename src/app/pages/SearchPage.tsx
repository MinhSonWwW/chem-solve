import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  ArrowLeft,
  FlaskConical,
  BookOpen,
  ArrowRight,
  Flame,
  Sparkles,
} from 'lucide-react';
import { Formula } from '@/design-system';
import { searchChemicalData } from '@/features/search/searchEngine';
import { sound } from '@/lib/audio';
import { assetUrl } from '@/lib/utils';

const QUICK_SEARCH_CHIPS = ['Tế bào', 'Quang hợp', 'Hệ tuần hoàn', 'Quần thể', 'NaOH', 'H2SO4', 'Mol', 'Vận tốc', 'Acid'];

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const results = useMemo(() => searchChemicalData(query), [query]);

  const totalResults =
    results.substances.length +
    results.reactions.length +
    results.skills.length +
    results.lessons.length;

  return (
    <div className="space-y-4 pb-8">
      {/* Search Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            sound.playClick();
            navigate(-1);
          }}
          className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl text-[var(--fg-muted)] hover:text-[var(--fg-default)] transition-colors cursor-pointer active:translate-y-0.5"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 relative">
          <SearchIcon className="w-4 h-4 text-[var(--fg-subtle)] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo NaOH, acid, base, mol, PTHH, bài học..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl text-xs text-[var(--fg-default)] placeholder-[var(--fg-subtle)] focus:outline-none focus:border-[var(--chem)] transition-colors font-medium"
            autoFocus
          />
        </div>
      </div>

      {/* Quick Search Suggestion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-[var(--fg-subtle)] shrink-0 mr-1">Gợi ý:</span>
        {QUICK_SEARCH_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => {
              sound.playClick();
              setQuery(chip);
            }}
            className="px-2.5 py-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--chem)] text-[11px] font-semibold text-[var(--fg-muted)] hover:text-[var(--fg-default)] shrink-0 transition cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Search Results Display */}
      {query ? (
        <div className="space-y-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--fg-muted)] px-1 flex items-center justify-between">
            <span>Kết quả tìm kiếm cho "{query}"</span>
            <span className="text-[var(--chem-fg)] font-mono">({totalResults})</span>
          </div>

          {totalResults === 0 && (
            <div className="py-8 px-4 text-center space-y-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl">
              <img
                src={assetUrl('/assets/ui/empty-search.png')}
                alt="Không tìm thấy kết quả"
                className="w-28 h-28 object-contain mx-auto drop-shadow-md select-none pointer-events-none"
              />
              <p className="text-sm font-bold text-[var(--fg-default)]">Không tìm thấy kết quả phù hợp</p>
              <p className="text-xs text-[var(--fg-muted)] max-w-xs mx-auto">
                Thử tìm theo công thức (vd: naoh, h2so4), tên chất (acid, base, oxide) hoặc tên bài học
              </p>
            </div>
          )}

          {/* 1. Substances */}
          {results.substances.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-black text-[var(--chem-fg)] flex items-center gap-1.5 px-1">
                <FlaskConical className="w-3.5 h-3.5" /> Chất hóa học ({results.substances.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.substances.map((s) => (
                  <div
                    key={s.formula}
                    className="p-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl flex items-center justify-between"
                  >
                    <div>
                      <div className="text-base font-black text-[var(--fg-default)]">
                        <Formula formula={s.formula} />
                      </div>
                      <p className="text-xs text-[var(--fg-muted)] mt-0.5">{s.nameVi}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[var(--chem-subtle)] text-[var(--chem-fg)] border border-[var(--border)]">
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
              <h2 className="text-xs font-black text-[var(--phy-fg)] flex items-center gap-1.5 px-1">
                <Flame className="w-3.5 h-3.5" /> Phản ứng hóa học ({results.reactions.length})
              </h2>
              <div className="space-y-2">
                {results.reactions.map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl space-y-1.5"
                  >
                    <div className="text-sm font-black text-[var(--fg-default)] font-mono">
                      {r.equation}
                    </div>
                    {r.phenomenon && (
                      <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                        <span className="font-semibold text-[var(--fg-default)]">Hiện tượng: </span>
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
              <h2 className="text-xs font-black text-[var(--warn-fg)] flex items-center gap-1.5 px-1">
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
                    className="p-3 bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--warn)] rounded-2xl flex items-center justify-between cursor-pointer transition"
                  >
                    <div>
                      <h3 className="text-xs font-bold text-[var(--fg-default)]">{l.title}</h3>
                      <p className="text-[11px] text-[var(--fg-subtle)] mt-0.5">
                        Lớp {l.grade} · {l.chapterTitle}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--warn-fg)] shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Empty State / Discovery Guide */
        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-2">
            <h2 className="text-xs font-black text-[var(--fg-default)] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[var(--chem-fg)]" />
              Tra cứu hóa học tức thì
            </h2>
            <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
              Nhập bất kỳ công thức (<span className="text-[var(--chem-fg)] font-semibold">naoh</span>, <span className="text-[var(--chem-fg)] font-semibold">caco3</span>), tên chất không dấu (<span className="text-[var(--chem-fg)] font-semibold">axit</span>, <span className="text-[var(--chem-fg)] font-semibold">bazo</span>), hoặc dạng bài để tra cứu phương trình và bài học tương ứng.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
