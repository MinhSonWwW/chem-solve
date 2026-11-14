import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ExternalLink, Lightbulb, Loader2, WifiOff, X } from 'lucide-react';
import {
  getPhetSims,
  phetEmbedUrl,
  phetPageUrl,
  phetThumbnailUrl,
  type PhetSim,
} from '@/content/phet/phetSims';
import { useActiveGrade } from '@/content/subjects';
import { sound } from '@/lib/audio';

const ATTRIBUTION = 'Mô phỏng PhET · Đại học Colorado Boulder · giấy phép CC BY 4.0';

function useOnline() {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

/** Cards of PhET simulations for one subject + full-screen player (opened via `?sim=<id>`). */
export const PhetSimLibrary: React.FC<{ subject: PhetSim['subject'] }> = ({ subject }) => {
  const sims = useMemo(() => getPhetSims(subject), [subject]);
  const { grade: activeGrade } = useActiveGrade();
  const grades = useMemo(() => [...new Set(sims.map((s) => s.grade))], [sims]);
  const [gradeFilter, setGradeFilter] = useState<number | 'all'>(() =>
    grades.includes(activeGrade) ? activeGrade : 'all'
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const openId = searchParams.get('sim');
  const openSim = sims.find((s) => s.id === openId) ?? null;

  if (sims.length === 0) return null;
  const visible = gradeFilter === 'all' ? sims : sims.filter((s) => s.grade === gradeFilter);

  const open = (id: string) => {
    sound.playClick();
    const next = new URLSearchParams(searchParams);
    next.set('sim', id);
    setSearchParams(next); // push, so the phone's back button closes the player
  };

  return (
    <section className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-3">
      <div className="space-y-1">
        <h2 className="text-base font-black text-[var(--text-primary)]">Mô phỏng PhET</h2>
        <p className="text-xs text-[var(--text-secondary)]">
          Mô phỏng tương tác bằng tiếng Việt, chọn theo bài trong SGK. Cần kết nối mạng.
        </p>
      </div>

      {grades.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-0.5" role="tablist" aria-label="Lọc theo lớp">
          {(['all', ...grades] as const).map((g) => {
            const active = gradeFilter === g;
            return (
              <button
                key={g}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  sound.playClick();
                  setGradeFilter(g);
                }}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-black border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[var(--subject-fill)] border-[var(--subject-edge)] text-white'
                    : 'bg-[var(--bg-surface-2)] border-[var(--border)] text-[var(--text-secondary)]'
                }`}
              >
                {g === 'all' ? 'Tất cả' : `Lớp ${g}`}
              </button>
            );
          })}
        </div>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {visible.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => open(s.id)}
              className="w-full text-left p-2.5 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] hover:border-[var(--border-strong)] flex gap-3 items-center cursor-pointer transition-colors active:translate-y-[1px]"
            >
              <img
                src={phetThumbnailUrl(s.id)}
                alt=""
                loading="lazy"
                width={80}
                height={53}
                className="w-20 h-[53px] shrink-0 rounded-lg object-cover bg-[var(--bg-canvas)] border border-[var(--border)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.visibility = 'hidden';
                }}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-black text-[var(--text-primary)] leading-snug">{s.titleVi}</span>
                <span className="block text-xs text-[var(--text-tertiary)] mt-0.5">
                  Lớp {s.grade} · {s.lessonLabel}
                </span>
                <span className="block text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">{s.summary}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className="text-[11px] text-[var(--text-tertiary)]">
        {ATTRIBUTION} ·{' '}
        <a href="https://phet.colorado.edu" target="_blank" rel="noopener noreferrer" className="underline">
          phet.colorado.edu
        </a>
      </p>

      {openSim && <PhetPlayer sim={openSim} />}
    </section>
  );
};

/** Full-screen player. Closing goes back in history so the phone's back button behaves the same. */
const PhetPlayer: React.FC<{ sim: PhetSim }> = ({ sim }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const online = useOnline();
  const [loaded, setLoaded] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const openedAt = useRef(window.history.length);

  const close = () => {
    sound.playClick();
    if (window.history.length > 1 && openedAt.current > 1) {
      navigate(-1);
    } else {
      const next = new URLSearchParams(searchParams);
      next.delete('sim');
      setSearchParams(next, { replace: true });
    }
  };

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={sim.titleVi}
      className="fixed inset-0 z-50 flex flex-col h-[100dvh] bg-[var(--bg-canvas)]"
    >
      <header className="safe-pt flex items-center gap-2 px-3 pb-2 border-b border-[var(--border)] bg-[var(--bg-surface)]">
        <button
          onClick={close}
          aria-label="Đóng mô phỏng"
          className="shrink-0 w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--bg-surface-2)] flex items-center justify-center text-[var(--text-secondary)] cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-black text-[var(--text-primary)] truncate">{sim.titleVi}</h2>
          <p className="text-xs text-[var(--text-tertiary)] truncate">
            Lớp {sim.grade} · {sim.lessonLabel}
          </p>
        </div>
        <button
          onClick={() => setShowGuide((v) => !v)}
          aria-pressed={showGuide}
          className={`shrink-0 h-10 px-3 rounded-xl border text-xs font-black flex items-center gap-1.5 cursor-pointer ${
            showGuide
              ? 'bg-[var(--gold-tint)] border-[var(--gold-edge)] text-[var(--gold-fg)]'
              : 'bg-[var(--bg-surface-2)] border-[var(--border)] text-[var(--text-secondary)]'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span className="hidden sm:inline">Gợi ý</span>
        </button>
        <a
          href={phetPageUrl(sim.id)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Mở trên trang PhET"
          className="shrink-0 w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--bg-surface-2)] flex items-center justify-center text-[var(--text-secondary)]"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </header>

      {showGuide && (
        <div className="relative px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-surface)] max-h-[38dvh] overflow-y-auto">
          <button
            onClick={() => setShowGuide(false)}
            aria-label="Ẩn gợi ý"
            className="absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="text-xs font-black text-[var(--text-primary)] mb-1.5 pr-8">Thử làm</p>
          <ol className="list-decimal pl-5 space-y-1 text-xs text-[var(--text-secondary)] leading-relaxed">
            {sim.tryThis.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="relative flex-1 min-h-0 bg-white">
        {online ? (
          <>
            {!loaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[var(--bg-canvas)] text-[var(--text-secondary)]">
                <Loader2 className="w-7 h-7 animate-spin motion-reduce:animate-none text-[var(--subject-fg)]" />
                <span className="text-xs font-bold">Đang tải mô phỏng…</span>
              </div>
            )}
            <iframe
              key={sim.id}
              src={phetEmbedUrl(sim.id)}
              title={sim.titleVi}
              allowFullScreen
              referrerPolicy="no-referrer"
              onLoad={() => setLoaded(true)}
              className="w-full h-full border-0 block"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center bg-[var(--bg-canvas)]">
            <WifiOff className="w-8 h-8 text-[var(--text-tertiary)]" />
            <p className="text-sm font-black text-[var(--text-primary)]">Bạn đang không có mạng</p>
            <p className="text-xs text-[var(--text-secondary)] max-w-xs">
              Mô phỏng PhET được tải trực tiếp từ trang của PhET nên cần internet. Các bài học và thí
              nghiệm khác trong app vẫn dùng được khi mất mạng.
            </p>
          </div>
        )}
      </div>

      <p className="safe-pb px-3 pt-1.5 text-[11px] text-center text-[var(--text-tertiary)] bg-[var(--bg-surface)] border-t border-[var(--border)]">
        {ATTRIBUTION}
      </p>
    </div>
  );
};
