import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Loader2 } from 'lucide-react';
import { requestGoogleAccessToken } from '@/lib/googleAuth';
import { hasTeacherSession, teacherLogin } from './api';

/** "Đăng nhập giáo viên" on the sign-in page: Google sign-in, then straight to class management. */
export const TeacherLoginButton: React.FC = () => {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    if (hasTeacherSession()) {
      navigate('/teacher');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await teacherLogin(await requestGoogleAccessToken());
      navigate('/teacher');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Đăng nhập thất bại.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-4 p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-2">
      <button
        type="button"
        onClick={signIn}
        disabled={busy}
        className="w-full h-11 rounded-xl border border-[var(--border-strong)] text-sm font-black text-[var(--text-primary)] inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" /> : <GraduationCap className="w-4 h-4" />}
        Đăng nhập giáo viên
      </button>
      <p className="text-[11px] text-center text-[var(--text-tertiary)]">
        Dành cho thầy cô: tạo lớp, soạn câu hỏi và giao bài. Học sinh không cần đăng nhập ở đây.
      </p>
      {error && <p className="text-xs text-center font-bold text-[var(--err-fg)]">{error}</p>}
    </div>
  );
};
