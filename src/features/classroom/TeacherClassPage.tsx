import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Copy, Check, Trash2, Loader2, Plus, RefreshCw } from 'lucide-react';
import { findLesson, getCurriculum, type Grade } from '@/content/curriculum';
import { loadExercises } from '@/content/contentLoader';
import { SKILLS } from '@/content/skills';
import { MathText } from '@/design-system/components/MathText';
import {
  ApiError,
  createAssignment,
  deleteAssignment,
  deleteClass,
  getClassDetail,
  removeStudent,
  type ClassDetail,
} from './api';
import { assignmentProgress, dueState, formatDue, formatRelative, studentRows } from './analytics';

type Tab = 'students' | 'assignments' | 'mistakes';
const SUBJECTS = [
  { id: 'chem', label: 'Hóa học' },
  { id: 'physics', label: 'Vật lý' },
  { id: 'bio', label: 'Sinh học' },
] as const;

const pct = (x: number | null) => (x === null ? '–' : `${Math.round(x * 100)}%`);
const SKILL_NAMES = new Map(SKILLS.map((s) => [s.id, s.name]));

/** /teacher/:classId — roster & progress, assignments with deadlines, most-missed questions/skills. */
export const TeacherClassPage: React.FC = () => {
  const { classId = '' } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ClassDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('students');
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setDetail(await getClassDetail(classId));
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) navigate('/teacher', { replace: true });
      else setError(e instanceof Error ? e.message : 'Không tải được lớp.');
    }
  }, [classId, navigate]);

  useEffect(() => {
    void load();
  }, [load]);

  if (error) return <p className="py-10 text-center text-sm text-[var(--err-fg)]">{error}</p>;
  if (!detail) {
    return (
      <div className="py-16 flex justify-center text-[var(--text-secondary)]">
        <Loader2 className="w-6 h-6 animate-spin motion-reduce:animate-none" />
      </div>
    );
  }

  const joinLink = `${window.location.origin}${window.location.pathname}#/join?code=${detail.class.code}`;
  const copy = async (what: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(what === 'code' ? detail.class.code : joinLink);
      setCopied(what);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 py-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/teacher')}
          aria-label="Về danh sách lớp"
          className="shrink-0 w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-secondary)] cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-black text-[var(--text-primary)] truncate">{detail.class.name}</h1>
          <p className="text-xs text-[var(--text-tertiary)]">
            Lớp {detail.class.grade} · {detail.students.length} học sinh
          </p>
        </div>
        <button
          onClick={() => void load()}
          aria-label="Tải lại"
          className="shrink-0 w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-secondary)] cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Join code */}
      <div className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-[var(--text-secondary)]">Mã lớp cho học sinh</p>
          <p className="text-3xl font-black tracking-[0.25em] text-[var(--text-primary)]">{detail.class.code}</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">
            Học sinh vào Hồ sơ → Lớp học, nhập mã này. Hoặc gửi link vào lớp qua Zalo.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => copy('code')} className="flex-1 sm:flex-none justify-center h-10 px-3 rounded-xl border border-[var(--border)] text-xs font-black text-[var(--text-secondary)] inline-flex items-center gap-1.5 cursor-pointer">
            {copied === 'code' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Mã
          </button>
          <button onClick={() => copy('link')} className="flex-1 sm:flex-none justify-center h-10 px-3 rounded-xl bg-[var(--subject-fill)] text-white text-xs font-black inline-flex items-center gap-1.5 cursor-pointer">
            {copied === 'link' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Link vào lớp
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)]" role="tablist">
        {(
          [
            ['students', 'Học sinh'],
            ['assignments', 'Bài giao'],
            ['mistakes', 'Câu sai nhiều'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex-1 h-10 rounded-xl text-xs sm:text-sm font-black cursor-pointer ${
              tab === id ? 'bg-[var(--subject-fill)] text-white' : 'text-[var(--text-secondary)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'students' && <StudentsTab detail={detail} onChanged={load} />}
      {tab === 'assignments' && <AssignmentsTab detail={detail} onChanged={load} />}
      {tab === 'mistakes' && <MistakesTab detail={detail} />}

      <DangerZone
        onDelete={async () => {
          await deleteClass(detail.class.id);
          navigate('/teacher', { replace: true });
        }}
      />
    </div>
  );
};

const StudentsTab: React.FC<{ detail: ClassDetail; onChanged: () => void }> = ({ detail, onChanged }) => {
  const rows = useMemo(() => studentRows(detail).sort((a, b) => b.lastActive - a.lastActive), [detail]);
  const [confirm, setConfirm] = useState<string | null>(null);
  if (rows.length === 0) {
    return <p className="text-sm text-[var(--text-secondary)] px-1">Chưa có học sinh nào vào lớp. Gửi mã lớp ở trên cho các em.</p>;
  }
  return (
    <div className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] overflow-x-auto">
      <table className="w-full text-sm min-w-[560px]">
        <thead>
          <tr className="text-left text-xs text-[var(--text-tertiary)] border-b border-[var(--border)]">
            <th className="p-3 font-bold">Học sinh</th>
            <th className="p-3 font-bold">Chặng đã xong</th>
            <th className="p-3 font-bold">Đúng TB</th>
            <th className="p-3 font-bold">Bài giao xong</th>
            <th className="p-3 font-bold">Hoạt động</th>
            <th className="p-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-[var(--border)] last:border-0">
              <td className="p-3 font-black text-[var(--text-primary)]">{r.displayName}</td>
              <td className="p-3 text-[var(--text-secondary)]">{r.nodesDone}</td>
              <td className={`p-3 font-bold ${r.avgAccuracy !== null && r.avgAccuracy < 0.5 ? 'text-[var(--err-fg)]' : 'text-[var(--text-secondary)]'}`}>
                {pct(r.avgAccuracy)}
              </td>
              <td className="p-3 text-[var(--text-secondary)]">
                {r.assignmentsDone}/{detail.assignments.length}
              </td>
              <td className="p-3 text-[var(--text-tertiary)] whitespace-nowrap">{formatRelative(r.lastActive)}</td>
              <td className="p-3 text-right">
                {confirm === r.id ? (
                  <span className="inline-flex gap-1.5">
                    <button
                      onClick={async () => {
                        await removeStudent(detail.class.id, r.id);
                        setConfirm(null);
                        onChanged();
                      }}
                      className="px-2 py-1 rounded-lg bg-[var(--err-fill)] text-white text-xs font-black cursor-pointer"
                    >
                      Xóa
                    </button>
                    <button onClick={() => setConfirm(null)} className="px-2 py-1 rounded-lg border border-[var(--border)] text-xs cursor-pointer">
                      Hủy
                    </button>
                  </span>
                ) : (
                  <button onClick={() => setConfirm(r.id)} aria-label={`Xóa ${r.displayName} khỏi lớp`} className="p-1.5 rounded-lg text-[var(--text-tertiary)] cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AssignmentsTab: React.FC<{ detail: ClassDetail; onChanged: () => void }> = ({ detail, onChanged }) => {
  const [subject, setSubject] = useState<'chem' | 'physics' | 'bio'>('chem');
  const [lessonId, setLessonId] = useState('');
  const [due, setDue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chapters = useMemo(
    () =>
      getCurriculum(detail.class.grade as Grade, subject)
        .chapters.map((c) => ({ id: c.id, title: c.title, lessons: c.lessons.filter((l) => l.ready) }))
        .filter((c) => c.lessons.length > 0),
    [detail.class.grade, subject]
  );

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonId) return;
    setBusy(true);
    setError(null);
    try {
      await createAssignment(detail.class.id, lessonId, due ? new Date(due).getTime() : null);
      setLessonId('');
      setDue('');
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không giao được bài.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={add} className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-2.5">
        <h2 className="text-sm font-black text-[var(--text-primary)]">Giao bài mới</h2>
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-2">
          <select
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value as typeof subject);
              setLessonId('');
            }}
            aria-label="Môn"
            className="h-11 px-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-sm text-[var(--text-primary)]"
          >
            {SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} {detail.class.grade}
              </option>
            ))}
          </select>
          <select
            value={lessonId}
            onChange={(e) => setLessonId(e.target.value)}
            aria-label="Bài học"
            required
            className="h-11 px-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-sm text-[var(--text-primary)] min-w-0"
          >
            <option value="">Chọn bài học…</option>
            {chapters.map((c) => (
              <optgroup key={c.id} label={c.title}>
                {c.lessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <label className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
            Hạn nộp
            <input
              type="datetime-local"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              className="h-11 px-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-sm text-[var(--text-primary)]"
            />
          </label>
          <span className="text-xs text-[var(--text-tertiary)]">Bỏ trống nếu không cần hạn.</span>
          <button
            type="submit"
            disabled={busy || !lessonId}
            className="sm:ml-auto h-11 px-4 rounded-xl text-sm font-black bg-[var(--subject-fill)] text-white disabled:bg-[var(--bg-surface-2)] disabled:text-[var(--text-tertiary)] inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Giao bài
          </button>
        </div>
        {error && <p className="text-xs font-bold text-[var(--err-fg)]">{error}</p>}
      </form>

      {detail.assignments.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)] px-1">Chưa giao bài nào.</p>
      ) : (
        <ul className="space-y-2">
          {detail.assignments.map((a) => {
            const p = assignmentProgress(detail, a);
            const ds = dueState(a.dueAt);
            return (
              <li key={a.id} className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-2">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-[var(--text-primary)]">{findLesson(a.lessonId)?.title ?? a.lessonId}</p>
                    <p className={`text-xs ${ds === 'overdue' ? 'text-[var(--err-fg)] font-bold' : 'text-[var(--text-tertiary)]'}`}>
                      {ds === 'overdue' ? 'Đã quá hạn · ' : ''}
                      {formatDue(a.dueAt)}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      await deleteAssignment(detail.class.id, a.id);
                      onChanged();
                    }}
                    aria-label="Xóa bài giao"
                    className="p-1.5 rounded-lg text-[var(--text-tertiary)] cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-2 rounded-full bg-[var(--bg-surface-2)] overflow-hidden">
                  <div className="h-full bg-[var(--ok-fill)]" style={{ width: `${p.total ? (p.done / p.total) * 100 : 0}%` }} />
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  {p.done}/{p.total} em đã xong{p.inProgress ? ` · ${p.inProgress} em đang làm` : ''}
                </p>
                {p.notDone.length > 0 && p.total > 0 && (
                  <p className="text-xs text-[var(--text-tertiary)]">Chưa xong: {p.notDone.join(', ')}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const MistakesTab: React.FC<{ detail: ClassDetail }> = ({ detail }) => {
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const stats = detail.questionStats.filter((q) => q.wrong > 0).slice(0, 12);

  useEffect(() => {
    const lessonIds = [...new Set(stats.map((s) => s.lessonId))];
    let alive = true;
    Promise.all(lessonIds.map((id) => loadExercises(id).catch(() => [])))
      .then((lists) => {
        if (!alive) return;
        const map: Record<string, string> = {};
        lists.flat().forEach((e) => (map[e.id] = e.prompt));
        setPrompts(map);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [detail]);

  // Only skills with a Vietnamese name (not every lesson has named skills yet).
  const skills = detail.skillStats.filter((s) => s.wrong > 0 && SKILL_NAMES.has(s.skillId)).slice(0, 8);
  const lessons = useMemo(() => {
    const by = new Map<string, { wrong: number; attempts: number }>();
    for (const q of detail.questionStats) {
      const cur = by.get(q.lessonId) ?? { wrong: 0, attempts: 0 };
      by.set(q.lessonId, { wrong: cur.wrong + q.wrong, attempts: cur.attempts + q.attempts });
    }
    return [...by.entries()]
      .filter(([, v]) => v.wrong > 0)
      .map(([lessonId, v]) => ({ lessonId, ...v, rate: v.wrong / v.attempts }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 6);
  }, [detail]);
  if (stats.length === 0) {
    return (
      <p className="text-sm text-[var(--text-secondary)] px-1">
        Chưa có dữ liệu. Khi học sinh làm bài, các câu cả lớp hay sai lần đầu sẽ hiện ở đây.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      <div className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-2">
        <h2 className="text-sm font-black text-[var(--text-primary)]">Bài cần ôn lại</h2>
        <ul className="space-y-1.5">
          {lessons.map((l) => (
            <li key={l.lessonId} className="flex items-center gap-2 text-sm">
              <span className="min-w-0 flex-1 text-[var(--text-primary)] truncate">{findLesson(l.lessonId)?.title ?? l.lessonId}</span>
              <span className="text-xs font-black text-[var(--err-fg)]">{Math.round(l.rate * 100)}% sai lần đầu</span>
            </li>
          ))}
        </ul>
      </div>
      {skills.length > 0 && (
        <div className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-2">
          <h2 className="text-sm font-black text-[var(--text-primary)]">Kỹ năng cần ôn lại</h2>
          <ul className="space-y-1.5">
            {skills.map((s) => (
              <li key={s.skillId} className="flex items-center gap-2 text-sm">
                <span className="min-w-0 flex-1 text-[var(--text-primary)] truncate">{SKILL_NAMES.get(s.skillId)}</span>
                <span className="text-xs font-black text-[var(--err-fg)]">{Math.round((s.wrong / s.attempts) * 100)}% sai</span>
                <span className="text-xs text-[var(--text-tertiary)] w-16 text-right">{s.attempts} lượt</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-2">
        <h2 className="text-sm font-black text-[var(--text-primary)]">Câu sai lần đầu nhiều nhất</h2>
        <ol className="space-y-2.5">
          {stats.map((q) => (
            <li key={q.exerciseId} className="space-y-0.5">
              <p className="text-sm text-[var(--text-primary)] line-clamp-2">
                {prompts[q.exerciseId] ? <MathText text={prompts[q.exerciseId]} /> : q.exerciseId}
              </p>
              <p className="text-xs text-[var(--text-tertiary)]">
                {findLesson(q.lessonId)?.title ?? q.lessonId} ·{' '}
                <span className="font-black text-[var(--err-fg)]">
                  {q.wrong}/{q.attempts} lượt sai lần đầu
                </span>{' '}
                · {q.students} em đã làm
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

const DangerZone: React.FC<{ onDelete: () => Promise<void> }> = ({ onDelete }) => {
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="pt-2 flex justify-end">
      {confirm ? (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[var(--err-fg)] font-bold">Xóa lớp sẽ xóa luôn kết quả của mọi học sinh trong lớp.</span>
          <button onClick={() => void onDelete()} className="px-3 py-1.5 rounded-xl bg-[var(--err-fill)] text-white font-black cursor-pointer">
            Xóa lớp
          </button>
          <button onClick={() => setConfirm(false)} className="px-3 py-1.5 rounded-xl border border-[var(--border)] font-black text-[var(--text-secondary)] cursor-pointer">
            Hủy
          </button>
        </div>
      ) : (
        <button onClick={() => setConfirm(true)} className="text-xs font-bold text-[var(--text-tertiary)] underline cursor-pointer">
          Xóa lớp này
        </button>
      )}
    </div>
  );
};
