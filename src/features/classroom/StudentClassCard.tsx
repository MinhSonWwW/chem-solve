import React, { useEffect, useState } from 'react';
import { School, LogOut, Loader2 } from 'lucide-react';
import { getStudentMembership, hasTeacherSession, joinClass, leaveClass, type StudentMembership } from './api';
import { pendingReportCount } from './outbox';
import { sound } from '@/lib/audio';

export function useStudentMembership(): StudentMembership | null {
  const [m, setM] = useState(getStudentMembership);
  useEffect(() => {
    const on = () => setM(getStudentMembership());
    window.addEventListener('classroom-changed', on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener('classroom-changed', on);
      window.removeEventListener('storage', on);
    };
  }, []);
  return m;
}

/** True while a teacher session is stored on this device (updates on sign-in/out). */
export function useTeacherSignedIn(): boolean {
  const [t, setT] = useState(hasTeacherSession);
  useEffect(() => {
    const on = () => setT(hasTeacherSession());
    window.addEventListener('classroom-changed', on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener('classroom-changed', on);
      window.removeEventListener('storage', on);
    };
  }, []);
  return t;
}

/** Join a class with the teacher's code, or show the current class with a leave button. */
export const StudentClassCard: React.FC<{ initialCode?: string; className?: string }> = ({ initialCode = '', className = '' }) => {
  const membership = useStudentMembership();
  const [code, setCode] = useState(initialCode);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const join = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await joinClass(code, name);
      sound.playCorrect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không vào được lớp.');
    } finally {
      setBusy(false);
    }
  };

  const leave = async () => {
    setBusy(true);
    try {
      await leaveClass();
    } finally {
      setBusy(false);
      setConfirmLeave(false);
    }
  };

  return (
    <section className={`p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <School className="w-5 h-5 text-[var(--subject-fg)]" />
        <h2 className="text-sm font-black text-[var(--text-primary)]">Lớp học</h2>
      </div>

      {membership ? (
        <div className="space-y-2">
          <p className="text-sm text-[var(--text-primary)]">
            Em đang ở lớp <strong className="font-black">{membership.class.name}</strong> (lớp {membership.class.grade}) với tên{' '}
            <strong className="font-black">{membership.student.displayName}</strong>.
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            Kết quả các bài em làm sẽ được gửi cho thầy/cô.
            {pendingReportCount() > 0 && ` Còn ${pendingReportCount()} kết quả chờ gửi khi có mạng.`}
          </p>
          {confirmLeave ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[var(--err-fg)] font-bold">Rời lớp sẽ xóa kết quả của em trong lớp này.</span>
              <button onClick={leave} disabled={busy} className="px-3 py-1.5 rounded-xl text-xs font-black bg-[var(--err-fill)] text-white cursor-pointer">
                Rời lớp
              </button>
              <button onClick={() => setConfirmLeave(false)} className="px-3 py-1.5 rounded-xl text-xs font-black border border-[var(--border)] text-[var(--text-secondary)] cursor-pointer">
                Hủy
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmLeave(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border border-[var(--border)] text-[var(--text-secondary)] cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Rời lớp
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={join} className="space-y-2.5">
          <p className="text-xs text-[var(--text-secondary)]">
            Nhập mã lớp thầy/cô đưa và tên của em. Không cần email hay tài khoản.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Mã lớp (6 kí tự)"
              maxLength={12}
              autoCapitalize="characters"
              className="h-11 px-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-sm font-black tracking-[0.2em] text-[var(--text-primary)] placeholder:tracking-normal placeholder:font-normal"
              aria-label="Mã lớp"
              required
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên của em, vd: Minh 7A"
              maxLength={40}
              className="h-11 px-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-sm text-[var(--text-primary)]"
              aria-label="Tên hiển thị"
              required
            />
          </div>
          {error && <p className="text-xs font-bold text-[var(--err-fg)]">{error}</p>}
          <button
            type="submit"
            disabled={busy || code.trim().length < 4 || !name.trim()}
            className="h-11 px-4 rounded-xl text-sm font-black bg-[var(--subject-fill)] text-white shadow-[0_3px_0_0_var(--subject-edge)] disabled:bg-[var(--bg-surface-2)] disabled:text-[var(--text-tertiary)] disabled:shadow-none cursor-pointer inline-flex items-center gap-2"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />}
            Vào lớp
          </button>
        </form>
      )}
    </section>
  );
};
