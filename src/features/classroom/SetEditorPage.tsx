import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Loader2, Plus, Trash2, ArrowUp, ArrowDown, Copy, Play } from 'lucide-react';
import { MathText } from '@/design-system/components/MathText';
import { ANSWER_KINDS, ANSWER_KIND_LABELS, ExerciseSetInputSchema, answerProblem, setLessonId, SET_NODE_ID, type TeacherQuestion } from '@/content/schema/teacherSet';
import { ApiError, createSet, deleteSet, getTeacherSet, updateSet } from './api';
import { AnswerEditor, inputCls } from './AnswerEditor';
import { cleanAnswer, cleanQuestion, newAnswer, newQuestion } from './setDraft';
import { sound } from '@/lib/audio';

type Subject = 'chem' | 'physics' | 'bio';

/** /teacher/sets/:setId ('new' to create) — write questions of any kind the app supports. */
export const SetEditorPage: React.FC = () => {
  const { setId = 'new' } = useParams();
  const isNew = setId === 'new';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!isNew);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<Subject>('chem');
  const [grade, setGrade] = useState(8);
  const [questions, setQuestions] = useState<TeacherQuestion[]>(() => [newQuestion([])]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getTeacherSet(setId)
      .then(({ set }) => {
        setTitle(set.title);
        setSubject(set.subject);
        setGrade(set.grade);
        setQuestions(set.questions);
      })
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) navigate('/teacher', { replace: true });
        else setError(e instanceof Error ? e.message : 'Không tải được bộ câu hỏi.');
      })
      .finally(() => setLoading(false));
  }, [isNew, setId, navigate]);

  const update = (i: number, q: TeacherQuestion) => {
    setSaved(false);
    setQuestions((qs) => qs.map((x, j) => (j === i ? q : x)));
  };
  const move = (i: number, d: -1 | 1) =>
    setQuestions((qs) => {
      const next = [...qs];
      [next[i], next[i + d]] = [next[i + d], next[i]];
      return next;
    });

  const save = async () => {
    setError(null);
    const input = { title: title.trim(), subject, grade, questions: questions.map(cleanQuestion) };
    const parsed = ExerciseSetInputSchema.safeParse(input);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const qIndex = issue.path[0] === 'questions' && typeof issue.path[1] === 'number' ? issue.path[1] : null;
      setError(qIndex !== null ? `Câu ${qIndex + 1}: ${issue.message}` : issue.message);
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        const r = await createSet(parsed.data);
        sound.playCorrect();
        navigate(`/teacher/sets/${r.set.id}`, { replace: true });
      } else {
        await updateSet(setId, parsed.data);
        sound.playCorrect();
      }
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không lưu được.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center text-[var(--text-secondary)]">
        <Loader2 className="w-6 h-6 animate-spin motion-reduce:animate-none" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 py-2 pb-28">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/teacher/sets')}
          aria-label="Về danh sách bộ câu hỏi"
          className="shrink-0 w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-secondary)] cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="min-w-0 flex-1 text-xl font-black text-[var(--text-primary)] truncate">
          {isNew ? 'Soạn bộ câu hỏi mới' : title || 'Bộ câu hỏi'}
        </h1>
        {!isNew && (
          <button
            onClick={() => navigate(`/play/${setLessonId(setId)}/${SET_NODE_ID}`)}
            className="shrink-0 h-10 px-3 rounded-xl border border-[var(--border)] text-xs font-black text-[var(--text-secondary)] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-4 h-4" /> Làm thử
          </button>
        )}
      </div>

      <div className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-2.5">
        <input
          className={inputCls}
          value={title}
          maxLength={80}
          placeholder="Tên bộ câu hỏi, ví dụ: Ôn tập Mol – 8A3"
          aria-label="Tên bộ câu hỏi"
          onChange={(e) => {
            setSaved(false);
            setTitle(e.target.value);
          }}
        />
        <div className="grid grid-cols-2 gap-2">
          <select className={inputCls} value={subject} aria-label="Môn" onChange={(e) => setSubject(e.target.value as Subject)}>
            <option value="chem">Hóa học</option>
            <option value="physics">Vật lý</option>
            <option value="bio">Sinh học</option>
          </select>
          <select className={inputCls} value={grade} aria-label="Khối lớp" onChange={(e) => setGrade(Number(e.target.value))}>
            {[6, 7, 8, 9].map((g) => (
              <option key={g} value={g}>
                Lớp {g}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-[var(--text-tertiary)]">
          Mẹo: viết công thức trong hai ngoặc vuông để hiện chỉ số dưới, ví dụ <code>[[H2SO4]]</code>. Dùng <code>**chữ đậm**</code> để
          nhấn mạnh.
        </p>
      </div>

      {questions.map((q, i) => (
        <QuestionCard
          key={q.id}
          index={i}
          total={questions.length}
          question={q}
          onChange={(nq) => update(i, nq)}
          onMove={(d) => move(i, d)}
          onDuplicate={() =>
            setQuestions((qs) => {
              const copy = { ...structuredClone(q), id: newQuestion(qs).id };
              return [...qs.slice(0, i + 1), copy, ...qs.slice(i + 1)];
            })
          }
          onDelete={() => setQuestions((qs) => qs.filter((_, j) => j !== i))}
        />
      ))}

      {questions.length < 40 && (
        <button
          type="button"
          onClick={() => setQuestions((qs) => [...qs, newQuestion(qs, qs[qs.length - 1]?.answer.kind)])}
          className="w-full h-12 rounded-2xl border-2 border-dashed border-[var(--border-strong)] text-sm font-black text-[var(--text-secondary)] inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Thêm câu hỏi
        </button>
      )}

      {!isNew && (
        <div className="flex justify-end">
          {confirmDelete ? (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[var(--err-fg)] font-bold">Xóa bộ câu hỏi sẽ gỡ luôn các bài đã giao từ bộ này.</span>
              <button
                onClick={async () => {
                  await deleteSet(setId);
                  navigate('/teacher/sets', { replace: true });
                }}
                className="px-3 py-1.5 rounded-xl bg-[var(--err-fill)] text-white font-black cursor-pointer"
              >
                Xóa
              </button>
              <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 rounded-xl border border-[var(--border)] font-black text-[var(--text-secondary)] cursor-pointer">
                Hủy
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="text-xs font-bold text-[var(--text-tertiary)] underline cursor-pointer">
              Xóa bộ câu hỏi này
            </button>
          )}
        </div>
      )}

      {/* Save bar, above the mobile bottom navigation */}
      <div className="fixed left-0 right-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] lg:bottom-4 z-20 px-4 pointer-events-none">
        <div className="max-w-3xl mx-auto p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-lg flex items-center gap-3 pointer-events-auto">
          <p className={`min-w-0 flex-1 text-xs font-bold ${error ? 'text-[var(--err-fg)]' : 'text-[var(--text-secondary)]'}`}>
            {error ?? (saved ? 'Đã lưu.' : `${questions.length} câu hỏi`)}
          </p>
          <button
            onClick={save}
            disabled={saving}
            className="shrink-0 h-11 px-5 rounded-xl bg-[var(--subject-fill)] text-white text-sm font-black inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />}
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

const QuestionCard: React.FC<{
  index: number;
  total: number;
  question: TeacherQuestion;
  onChange: (q: TeacherQuestion) => void;
  onMove: (d: -1 | 1) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}> = ({ index, total, question: q, onChange, onMove, onDuplicate, onDelete }) => {
  const [showExtra, setShowExtra] = useState(!!(q.hint || q.explanation));
  const problem = q.prompt.trim() ? answerProblem(cleanAnswer(q.answer)) : null;
  const iconBtn =
    'w-9 h-9 rounded-xl border border-[var(--border)] text-[var(--text-tertiary)] inline-flex items-center justify-center cursor-pointer disabled:opacity-40';
  return (
    <section className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-black text-[var(--text-primary)]">Câu {index + 1}</span>
        <div className="ml-auto flex gap-1.5">
          <button type="button" className={iconBtn} disabled={index === 0} onClick={() => onMove(-1)} aria-label="Đưa câu lên">
            <ArrowUp className="w-4 h-4" />
          </button>
          <button type="button" className={iconBtn} disabled={index === total - 1} onClick={() => onMove(1)} aria-label="Đưa câu xuống">
            <ArrowDown className="w-4 h-4" />
          </button>
          <button type="button" className={iconBtn} onClick={onDuplicate} aria-label="Nhân bản câu">
            <Copy className="w-4 h-4" />
          </button>
          <button type="button" className={iconBtn} disabled={total <= 1} onClick={onDelete} aria-label="Xóa câu">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-2">
        <select
          className={inputCls}
          value={q.answer.kind}
          aria-label="Dạng bài"
          onChange={(e) => onChange({ ...q, answer: newAnswer(e.target.value as TeacherQuestion['answer']['kind']) })}
        >
          {ANSWER_KINDS.map((k) => (
            <option key={k} value={k}>
              {ANSWER_KIND_LABELS[k]}
            </option>
          ))}
        </select>
        <select
          className={`${inputCls} w-auto`}
          value={q.difficulty}
          aria-label="Độ khó"
          onChange={(e) => onChange({ ...q, difficulty: Number(e.target.value) as 1 | 2 | 3 })}
        >
          <option value={1}>Dễ</option>
          <option value={2}>Vừa</option>
          <option value={3}>Khó</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <textarea
          className={`${inputCls} h-auto min-h-[5.5rem] py-2 leading-relaxed`}
          value={q.prompt}
          maxLength={2000}
          placeholder="Đề bài / câu hỏi"
          aria-label={`Đề bài câu ${index + 1}`}
          onChange={(e) => onChange({ ...q, prompt: e.target.value })}
        />
        {/\[\[|\*\*|\$/.test(q.prompt) && (
          <div className="px-3 py-2 rounded-xl bg-[var(--bg-surface-2)] text-sm text-[var(--text-primary)]">
            <span className="block text-[11px] font-bold text-[var(--text-tertiary)] mb-0.5">Học sinh sẽ thấy</span>
            <MathText text={q.prompt} />
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-black text-[var(--text-secondary)]">Đáp án</p>
        <AnswerEditor answer={q.answer} onChange={(answer) => onChange({ ...q, answer })} />
      </div>

      {showExtra ? (
        <div className="space-y-2">
          <input
            className={inputCls}
            value={q.hint ?? ''}
            maxLength={500}
            placeholder="Gợi ý khi học sinh làm sai (không bắt buộc)"
            onChange={(e) => onChange({ ...q, hint: e.target.value })}
          />
          <textarea
            className={`${inputCls} h-auto min-h-[4rem] py-2`}
            value={q.explanation ?? ''}
            maxLength={2000}
            placeholder="Lời giải / giải thích hiện sau khi làm (không bắt buộc)"
            onChange={(e) => onChange({ ...q, explanation: e.target.value })}
          />
        </div>
      ) : (
        <button type="button" onClick={() => setShowExtra(true)} className="text-xs font-bold text-[var(--subject-fg)] cursor-pointer">
          + Thêm gợi ý và lời giải
        </button>
      )}

      {problem && <p className="text-xs font-bold text-[var(--warn-fg)]">Chưa xong: {problem}</p>}
    </section>
  );
};
