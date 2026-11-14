import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Plus, Users, ChevronRight, LogOut, Loader2 } from 'lucide-react';
import { requestGoogleAccessToken } from '@/lib/googleAuth';
import {
  ApiError,
  clearTeacherSession,
  createClass,
  getTeacherMe,
  hasTeacherSession,
  listClasses,
  teacherLogin,
  teacherLogout,
  type ClassSummary,
} from './api';
import { sound } from '@/lib/audio';

/** /teacher — Google sign-in, list of the teacher's classes and a form to create one. */
export const TeacherPage: React.FC = () => {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<{ name: string; email: string } | null>(null);
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [loading, setLoading] = useState(hasTeacherSession());
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(8);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [me, list] = await Promise.all([getTeacherMe(), listClasses()]);
      setTeacher(me.teacher);
      setClasses(list.classes);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) clearTeacherSession();
      else setError(e instanceof Error ? e.message : 'Không tải được dữ liệu.');
      setTeacher(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasTeacherSession()) void load();
  }, [load]);

  const signIn = async () => {
    setError(null);
    try {
      const token = await requestGoogleAccessToken();
      setLoading(true);
      await teacherLogin(token);
      await load();
    } catch (e) {
      setLoading(false);
      setError(e instanceof Error ? e.message : 'Đăng nhập thất bại.');
    }
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const r = await createClass(name.trim(), grade);
      sound.playCorrect();
      setName('');
      navigate(`/teacher/${r.class.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tạo được lớp.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center text-[var(--text-secondary)]">
        <Loader2 className="w-6 h-6 animate-spin motion-reduce:animate-none" />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="max-w-md mx-auto space-y-4 py-4">
        <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-3">
          <GraduationCap className="w-8 h-8 text-[var(--subject-fg)]" />
          <h1 className="text-xl font-black text-[var(--text-primary)]">Dành cho giáo viên</h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Tạo lớp, đưa mã lớp cho học sinh, giao bài có hạn nộp và xem học sinh làm đúng sai ở đâu. Học sinh vào
            lớp chỉ cần mã lớp và tên, không cần email.
          </p>
          {error && <p className="text-xs font-bold text-[var(--err-fg)]">{error}</p>}
          <button
            onClick={signIn}
            className="w-full h-12 rounded-2xl bg-[var(--subject-fill)] text-white font-black shadow-[0_4px_0_0_var(--subject-edge)] cursor-pointer"
          >
            Đăng nhập bằng Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 py-2">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-black text-[var(--text-primary)]">Lớp của tôi</h1>
          <p className="text-xs text-[var(--text-tertiary)] truncate">{teacher.name} · {teacher.email}</p>
        </div>
        <button
          onClick={async () => {
            await teacherLogout().catch(() => undefined);
            setTeacher(null);
          }}
          className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-[var(--border)] text-xs font-black text-[var(--text-secondary)] cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Đăng xuất
        </button>
      </div>

      {error && <p className="text-xs font-bold text-[var(--err-fg)]">{error}</p>}

      <form onSubmit={create} className="p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-2.5">
        <h2 className="text-sm font-black text-[var(--text-primary)]">Tạo lớp mới</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên lớp, vd: 8A3 – KHTN"
            maxLength={60}
            required
            aria-label="Tên lớp"
            className="flex-1 h-11 px-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-sm text-[var(--text-primary)]"
          />
          <select
            value={grade}
            onChange={(e) => setGrade(Number(e.target.value))}
            aria-label="Khối lớp"
            className="h-11 px-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-sm text-[var(--text-primary)]"
          >
            {[6, 7, 8, 9].map((g) => (
              <option key={g} value={g}>
                Lớp {g}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={creating || !name.trim()}
            className="h-11 px-4 rounded-xl text-sm font-black bg-[var(--subject-fill)] text-white disabled:bg-[var(--bg-surface-2)] disabled:text-[var(--text-tertiary)] inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tạo lớp
          </button>
        </div>
      </form>

      {classes.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)] px-1">Chưa có lớp nào. Tạo lớp đầu tiên ở trên.</p>
      ) : (
        <ul className="space-y-2">
          {classes.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => navigate(`/teacher/${c.id}`)}
                className="w-full text-left p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--border-strong)] flex items-center gap-3 cursor-pointer"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-black text-[var(--text-primary)] truncate">{c.name}</span>
                  <span className="block text-xs text-[var(--text-tertiary)] mt-0.5">
                    Lớp {c.grade} · Mã <span className="font-black tracking-widest text-[var(--text-secondary)]">{c.code}</span>
                  </span>
                </span>
                <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-[var(--text-secondary)]">
                  <Users className="w-4 h-4" /> {c.studentCount}
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
