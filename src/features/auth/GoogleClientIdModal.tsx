import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, KeyRound, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/design-system';
import { sound } from '@/lib/audio';
import { getGoogleClientId, setGoogleClientId } from '@/lib/googleAuth';

interface GoogleClientIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (clientId: string) => void;
  onFallbackDemo: () => void;
}

export const GoogleClientIdModal: React.FC<GoogleClientIdModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onFallbackDemo,
}) => {
  const [clientIdInput, setClientIdInput] = useState(() => getGoogleClientId());
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveAndProceed = () => {
    sound.playClick();
    const trimmed = clientIdInput.trim();
    if (!trimmed) {
      setError('Vui lòng dán Google Client ID hoặc chọn dùng thử tài khoản Demo bên dưới.');
      return;
    }
    if (!trimmed.includes('.apps.googleusercontent.com') && trimmed.length < 20) {
      setError('Client ID của Google thường có đuôi dạng "...apps.googleusercontent.com". Hãy kiểm tra lại nhé.');
      return;
    }

    setGoogleClientId(trimmed);
    onSuccess(trimmed);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border)] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[var(--subject-tint)] border border-[var(--subject-edge)]/40 flex items-center justify-center text-[var(--subject-fg)]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[var(--text-primary)]">Đăng Nhập Google Thật</h3>
                <span className="text-[11px] font-bold text-[var(--text-tertiary)]">Google Identity Services (OAuth 2.0)</span>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-xl hover:bg-[var(--bg-surface-2)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Để mở popup đăng nhập chính thức của Google và lấy tên, email <b className="text-[var(--text-primary)]">@gmail.com</b> thật của bạn, Google yêu cầu một mã <b className="text-[var(--text-primary)]">Client ID</b> xác thực (hoàn toàn miễn phí).
          </p>

          {/* Steps */}
          <div className="p-3.5 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] space-y-2 text-xs">
            <div className="font-black text-[var(--text-primary)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--gold-fg)]" />
              <span>3 bước lấy Client ID miễn phí từ Google:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-[var(--text-secondary)] pl-1 text-[11px]">
              <li>
                Truy cập{' '}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[var(--subject-fg)] hover:underline inline-flex items-center gap-0.5"
                >
                  Google Cloud Console <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>Tạo <b>OAuth Client ID</b> (Loại: <i>Web application</i>).</li>
              <li>
                Thêm <b>Authorized JavaScript origin</b>:
                <code className="block mt-1 p-1 bg-[var(--bg-canvas)] rounded border border-[var(--border)] font-mono text-[10px] text-[var(--text-primary)]">
                  {typeof window !== 'undefined' ? window.location.origin : 'https://minhsonwww.github.io'}
                </code>
              </li>
            </ol>
          </div>

          {/* Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[var(--text-primary)] block">
              Dán Google Client ID vào đây:
            </label>
            <input
              type="text"
              value={clientIdInput}
              onChange={(e) => {
                setClientIdInput(e.target.value);
                if (error) setError(null);
              }}
              placeholder="ví dụ: 123456789-abcdef.apps.googleusercontent.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--subject-fill)] transition-colors font-mono"
            />
            {error && (
              <p className="text-[11px] text-[var(--err-fg)] font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleSaveAndProceed}
              className="flex items-center justify-center gap-2 font-black"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>LƯU & BẬT POPUP GOOGLE THẬT</span>
            </Button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onFallbackDemo();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] transition-colors cursor-pointer text-center"
            >
              Chưa có Client ID? Dùng tạm tài khoản Demo thử nghiệm
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

