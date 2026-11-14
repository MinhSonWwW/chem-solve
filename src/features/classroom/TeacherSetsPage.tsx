import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2, Plus, FileQuestion } from 'lucide-react';
import { ApiError, listSets, type SetSummary } from './api';
import { formatRelative } from './analytics';

const SUBJECT_LABEL = { chem: 'Hóa học', physics: 'Vật lý', bio: 'Sinh học' } as const;

/** /teacher/sets — the teacher's own question sets. */
export const TeacherSetsPage: React.FC = () => {
  const navigate = useNavigate();
  const [sets, setSets] = useState<SetSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listSets()
      .then((r) => setSets(r.sets))
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) navigate('/teacher', { replace: true });
        else setError(e instanceof Error ? e.message : 'Không tải được danh sách.');
      });
  }, [navigate]);

  return (
    <div className="max-w-2xl mx-auto space-y-4 py-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/teacher')}
          aria-label="Về trang giáo viên"
          className="shrink-0 w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-secondary)] cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-black text-[var(--text-primary)]">Bộ câu hỏi của tôi</h1>
          <p className="text-xs text-[var(--text-tertiary)]">Tự soạn câu hỏi rồi giao cho lớp như một bài học.</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/teacher/sets/new')}
        className="w-full h-12 rounded-2xl bg-[var(--subject-fill)] text-white font-black shadow-[0_4px_0_0_var(--subject-edge)] inline-flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus className="w-5 h-5" /> Soạn bộ câu hỏi mới
      </button>

      {error && <p className="text-xs font-bold text-[var(--err-fg)]">{error}</p>}
      {!sets && !error && (
        <div className="py-10 flex justify-center text-[var(--text-secondary)]">
          <Loader2 className="w-6 h-6 animate-spin motion-reduce:animate-none" />
        </div>
      )}
      {sets && sets.length === 0 && (
        <p className="text-sm text-[var(--text-secondary)] px-1">Chưa có bộ câu hỏi nào. Bấm nút ở trên để soạn bộ đầu tiên.</p>
      )}
      {sets && sets.length > 0 && (
        <ul className="space-y-2">
          {sets.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => navigate(`/teacher/sets/${s.id}`)}
                className="w-full text-left p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center gap-3 cursor-pointer"
              >
                <FileQuestion className="w-5 h-5 shrink-0 text-[var(--subject-fg)]" />
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-black text-[var(--text-primary)] truncate">{s.title}</span>
                  <span className="block text-xs text-[var(--text-tertiary)] mt-0.5">
                    {SUBJECT_LABEL[s.subject]} {s.grade} · {s.questionCount} câu · sửa {formatRelative(s.updatedAt).toLowerCase()}
                  </span>
                </span>
                <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
