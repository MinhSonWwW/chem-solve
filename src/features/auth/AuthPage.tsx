import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  FlaskConical,
  Atom,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { useReducedMotion } from '@/design-system';

// ── Types ──────────────────────────────────────────────────────────────

type AuthMode = 'login' | 'register';

interface FloatingMolecule {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

// ── Animated Background Molecules ─────────────────────────────────────

const MOLECULE_COUNT = 12;

function generateMolecules(): FloatingMolecule[] {
  return Array.from({ length: MOLECULE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 4 + Math.random() * 14,
    duration: 12 + Math.random() * 20,
    delay: Math.random() * -15,
    opacity: 0.04 + Math.random() * 0.08,
  }));
}

const FloatingBackground: React.FC = React.memo(() => {
  const prefersReduced = useReducedMotion();
  const molecules = useRef(generateMolecules()).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c1a22] via-[#131f24] to-[#0d2233]" />

      {/* Radial glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,205,156,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Floating molecular dots */}
      {molecules.map((m) => (
        <motion.div
          key={m.id}
          className="absolute rounded-full"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            width: m.size,
            height: m.size,
            backgroundColor:
              m.id % 3 === 0
                ? 'rgba(14,165,233,0.4)'
                : m.id % 3 === 1
                ? 'rgba(0,205,156,0.4)'
                : 'rgba(255,150,0,0.3)',
            opacity: m.opacity,
          }}
          animate={
            prefersReduced
              ? undefined
              : {
                  y: [0, -25, 10, -15, 0],
                  x: [0, 12, -8, 4, 0],
                  scale: [1, 1.15, 0.95, 1.05, 1],
                }
          }
          transition={{
            duration: m.duration,
            repeat: Infinity,
            delay: m.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Hexagon grid pattern (subtle) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.025]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="hex-grid" width="56" height="100" patternUnits="userSpaceOnUse">
            <path
              d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66Z"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="0.5"
            />
            <path
              d="M28 100L0 84L0 50L28 34L56 50L56 84L28 100Z"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-grid)" />
      </svg>
    </div>
  );
});

FloatingBackground.displayName = 'FloatingBackground';

// ── Social Icons (inline SVG) ──────────────────────────────────────────

const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.47h-2.796v8.385C19.612 22.954 24 17.99 24 12z" fill="#1877F2" />
  </svg>
);

const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

// ── Password Strength Indicator ──────────────────────────────────────

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Yếu', color: '#ff4b4b' };
  if (score <= 2) return { score: 2, label: 'Trung bình', color: '#ff9600' };
  if (score <= 3) return { score: 3, label: 'Khá', color: '#fde68a' };
  if (score <= 4) return { score: 4, label: 'Mạnh', color: '#58cc02' };
  return { score: 5, label: 'Rất mạnh', color: '#00cd9c' };
}

const PasswordStrengthBar: React.FC<{ password: string }> = ({ password }) => {
  if (!password) return null;
  const strength = getPasswordStrength(password);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2"
    >
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="h-1 flex-1 rounded-full"
            style={{
              backgroundColor: i <= strength.score ? strength.color : '#2e4756',
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
          />
        ))}
      </div>
      <p className="text-[11px] font-semibold" style={{ color: strength.color }}>
        {strength.label}
      </p>
    </motion.div>
  );
};

// ── Input Component ──────────────────────────────────────────────────

interface AuthInputProps {
  icon: React.ElementType;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  showPasswordToggle?: boolean;
}

const AuthInput: React.FC<AuthInputProps> = ({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  showPasswordToggle,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const actualType = showPasswordToggle && showPassword ? 'text' : type;

  return (
    <div className="relative">
      <motion.div
        className={`relative flex items-center rounded-2xl border-2 transition-colors ${
          error
            ? 'border-[#ff4b4b]/60 bg-[#ff4b4b]/5'
            : isFocused
            ? 'border-[#0ea5e9]/60 bg-[#0ea5e9]/5'
            : 'border-[#2e4756]/60 bg-[#18272f]/80'
        }`}
        animate={{
          scale: isFocused ? 1.01 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        <div className={`pl-3.5 sm:pl-4 pr-2 transition-colors shrink-0 ${
          error ? 'text-[#ff4b4b]' : isFocused ? 'text-[#0ea5e9]' : 'text-slate-500'
        }`}>
          <Icon size={18} />
        </div>
        <input
          type={actualType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoComplete={autoComplete}
          className="flex-1 bg-transparent py-3 sm:py-3.5 pr-3 sm:pr-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none font-semibold min-w-0"
        />
        {showPasswordToggle && value && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-3.5 sm:pr-4 pl-2 text-slate-500 hover:text-slate-300 transition-colors shrink-0"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-[11px] text-[#ff4b4b] mt-1.5 pl-1 flex items-center gap-1 font-semibold"
          >
            <AlertCircle size={12} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Social Login Button ──────────────────────────────────────────────

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, label, onClick, disabled }) => (
  <motion.button
    type="button"
    onClick={onClick}
    disabled={disabled}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.96, y: 2 }}
    className="flex items-center justify-center gap-1.5 sm:gap-2 w-full py-2.5 sm:py-3 px-2 sm:px-3 rounded-2xl border-2 border-[#2e4756]/60 bg-[#18272f]/80 hover:bg-[#20333d] hover:border-[#3d5a6c]/60 transition-all duration-200 text-xs sm:text-sm font-bold text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer shadow-[0_3px_0_0_#131f24] active:shadow-[0_0_0_0_transparent] active:translate-y-[3px]"
  >
    {icon}
    <span className="truncate">{label}</span>
  </motion.button>
);

// ── Divider ──────────────────────────────────────────────────────────

const AuthDivider: React.FC = () => (
  <div className="flex items-center gap-3 my-3 sm:my-4">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#2e4756] to-transparent" />
    <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">hoặc</span>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#2e4756] to-transparent" />
  </div>
);

// ── Logo Section ──────────────────────────────────────────────────────

const AuthLogo: React.FC = () => (
  <motion.div
    className="flex flex-col items-center mb-3 sm:mb-5"
    initial={{ opacity: 0, y: -16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    {/* Animated Flask Icon */}
    <motion.div
      className="relative w-14 h-14 sm:w-18 sm:h-18 mb-2 sm:mb-3"
      animate={{ rotate: [0, -3, 3, -1, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0ea5e9] to-[#00cd9c] flex items-center justify-center shadow-lg shadow-[#0ea5e9]/20">
        <FlaskConical className="w-7 h-7 sm:w-9 sm:h-9 text-white" strokeWidth={2.5} />
      </div>
      {/* Sparkle decorations */}
      <motion.div
        className="absolute -top-1 -right-1"
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Sparkles size={14} className="text-[#fde68a]" />
      </motion.div>
      <motion.div
        className="absolute -bottom-1 -left-1"
        animate={{ scale: [1, 0.7, 1], opacity: [0.7, 0.3, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      >
        <Atom size={12} className="text-[#0ea5e9]" />
      </motion.div>
    </motion.div>

    <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-[#0ea5e9] via-[#00cd9c] to-[#0ea5e9] bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_ease-in-out_infinite]">
      CHEM-SOLVE
    </h1>
    <p className="text-[11px] sm:text-xs text-slate-400 font-semibold mt-0.5 tracking-wide">
      Đấu Trường Khoa Học THCS
    </p>
  </motion.div>
);

// ── Main Auth Page ────────────────────────────────────────────────────

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const { loginWithEmail, registerWithEmail, loginWithSocial, isLoading, error, clearError } =
    useAuthStore();

  // Auto-redirect after successful login
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  // Clear errors on mode switch
  const switchMode = useCallback(
    (newMode: AuthMode) => {
      setMode(newMode);
      setFieldErrors({});
      clearError();
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    },
    [clearError]
  );

  // Validate fields
  const validate = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (mode === 'register' && !name.trim()) {
      errors.name = 'Hãy cho mình biết tên của bạn nhé!';
    }

    if (!email.trim()) {
      errors.email = 'Nhập email để tiếp tục nào!';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Email chưa đúng định dạng rồi!';
    }

    if (!password) {
      errors.password = 'Đừng quên mật khẩu nhé!';
    } else if (mode === 'register' && password.length < 6) {
      errors.password = 'Mật khẩu cần ít nhất 6 ký tự!';
    }

    if (mode === 'register' && password !== confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận chưa khớp!';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [mode, name, email, password, confirmPassword]);

  // Submit
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      clearError();
      if (!validate()) return;

      let success = false;
      if (mode === 'login') {
        success = await loginWithEmail(email, password);
      } else {
        success = await registerWithEmail(name, email, password);
      }

      if (success) {
        setShowSuccess(true);
      }
    },
    [mode, name, email, password, validate, loginWithEmail, registerWithEmail, clearError]
  );

  // Social login handlers
  const handleSocial = useCallback(
    async (provider: 'google' | 'facebook' | 'github') => {
      clearError();
      const success = await loginWithSocial(provider);
      if (success) setShowSuccess(true);
    },
    [loginWithSocial, clearError]
  );

  // ── Success Animation ──────────────────────────────────────

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#131f24] px-4 safe-pt safe-pb overflow-hidden">
        <FloatingBackground />
        <motion.div
          className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 py-8 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#58cc02] to-[#00cd9c] flex items-center justify-center mb-5 shadow-lg shadow-[#58cc02]/30"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Check size={40} className="text-white" strokeWidth={3} />
          </motion.div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            {mode === 'register' ? 'Chào mừng nhà khoa học mới!' : 'Chào mừng trở lại!'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mb-6">
            Phòng lab đã sẵn sàng, bắt đầu khám phá thôi! 🧪
          </p>
          <motion.div
            className="w-7 h-7 border-2 border-[#0ea5e9] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-[11px] text-slate-500 mt-3 font-semibold">Đang chuyển hướng...</p>
        </motion.div>
      </div>
    );
  }

  // ── Main Render ──────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 bg-[#131f24] overflow-y-auto overflow-x-hidden flex flex-col justify-between selection:bg-[#0ea5e9]/30">
      <FloatingBackground />

      {/* Add shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% center; }
          50% { background-position: 200% center; }
          100% { background-position: 0% center; }
        }
      `}</style>

      {/* Top Header Bar with Safe Top Area */}
      <header className="relative z-20 w-full max-w-[440px] mx-auto flex items-center justify-between px-4 pt-3 sm:pt-4 pb-1 shrink-0 safe-pt">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18272f]/90 hover:bg-[#20333d] border-2 border-[#2e4756] text-slate-300 hover:text-white text-xs font-bold transition-all shadow-[0_2px_0_0_#101a1f] active:translate-y-[2px] active:shadow-none cursor-pointer backdrop-blur-md"
          title="Quay về trang chính"
        >
          <ArrowLeft size={14} />
          <span>Về trang chủ</span>
        </button>

        <span className="text-[10px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-wider bg-[#18272f]/80 px-2.5 py-1 rounded-lg border border-[#2e4756]/40">
          {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
        </span>
      </header>

      {/* Main Content Area: uses my-auto on card so on short screens (360x640, landscape) it gracefully starts from top and scrolls down, while on tall screens it's vertically centered */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-2 sm:py-6 w-full relative z-10 safe-pb">
        <div className="w-full max-w-[420px] mx-auto my-auto py-1 sm:py-2">
          <AuthLogo />

          {/* Mode Toggle Tabs */}
          <div className="flex bg-[#18272f] rounded-2xl p-1 mb-3.5 sm:mb-5 border border-[#2e4756]/40">
            {(['login', 'register'] as AuthMode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 select-none cursor-pointer ${
                  mode === m
                    ? 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white shadow-lg shadow-[#0ea5e9]/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m === 'login' ? 'Đăng nhập' : 'Đăng ký'}
              </button>
            ))}
          </div>

          {/* Global Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-3 p-2.5 sm:p-3 rounded-xl bg-[#ff4b4b]/10 border border-[#ff4b4b]/30 flex items-center gap-2"
              >
                <AlertCircle size={15} className="text-[#ff4b4b] shrink-0" />
                <p className="text-xs text-[#ff4b4b] font-semibold">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Auth Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: mode === 'login' ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 16 : -16 }}
              transition={{ duration: 0.2 }}
              className="space-y-2.5 sm:space-y-3.5"
            >
              {/* Name field (register only) */}
              <AnimatePresence>
                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <AuthInput
                      icon={User}
                      type="text"
                      placeholder="Tên hiển thị (vd: Nhà Hóa Học Nhí)"
                      value={name}
                      onChange={(v) => {
                        setName(v);
                        if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      error={fieldErrors.name}
                      autoComplete="name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <AuthInput
                icon={Mail}
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(v) => {
                  setEmail(v);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                }}
                error={fieldErrors.email}
                autoComplete="email"
              />

              {/* Password */}
              <AuthInput
                icon={Lock}
                type="password"
                placeholder={mode === 'register' ? 'Tạo mật khẩu (≥ 6 ký tự)' : 'Mật khẩu'}
                value={password}
                onChange={(v) => {
                  setPassword(v);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                }}
                error={fieldErrors.password}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                showPasswordToggle
              />

              {/* Password Strength (register only) */}
              {mode === 'register' && <PasswordStrengthBar password={password} />}

              {/* Confirm Password (register only) */}
              <AnimatePresence>
                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <AuthInput
                      icon={Lock}
                      type="password"
                      placeholder="Xác nhận mật khẩu"
                      value={confirmPassword}
                      onChange={(v) => {
                        setConfirmPassword(v);
                        if (fieldErrors.confirmPassword)
                          setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
                      }}
                      error={fieldErrors.confirmPassword}
                      autoComplete="new-password"
                      showPasswordToggle
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Forgot Password (login only) */}
              {mode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-xs text-[#0ea5e9] font-bold hover:text-[#38bdf8] transition-colors cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={isLoading ? undefined : { scale: 1.01 }}
                whileTap={isLoading ? undefined : { scale: 0.98, y: 3 }}
                className="w-full py-3.5 sm:py-4 rounded-2xl font-black text-sm sm:text-base text-white bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] shadow-[0_4px_0_0_#065985] hover:from-[#38bdf8] hover:to-[#0ea5e9] transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed active:shadow-[0_0_0_0_transparent] active:translate-y-[4px] select-none cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <motion.span
                      className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          {/* Social Divider */}
          <AuthDivider />

          {/* Social Login Buttons - Responsive 3-column grid that works seamlessly on mobile and desktop */}
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            <SocialButton
              icon={<GoogleIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
              label="Google"
              onClick={() => handleSocial('google')}
              disabled={isLoading}
            />
            <SocialButton
              icon={<FacebookIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
              label="Facebook"
              onClick={() => handleSocial('facebook')}
              disabled={isLoading}
            />
            <SocialButton
              icon={<GithubIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />}
              label="GitHub"
              onClick={() => handleSocial('github')}
              disabled={isLoading}
            />
          </div>

          {/* Footer Terms */}
          <p className="text-center text-[10px] sm:text-[11px] text-slate-500 mt-4 sm:mt-5 leading-relaxed font-medium">
            Khi tiếp tục, bạn đồng ý với{' '}
            <button type="button" className="text-[#0ea5e9] hover:underline font-bold cursor-pointer">
              Điều khoản
            </button>{' '}
            và{' '}
            <button type="button" className="text-[#0ea5e9] hover:underline font-bold cursor-pointer">
              Bảo mật
            </button>{' '}
            của Chem-Solve.
          </p>
        </div>
      </main>
    </div>
  );
};
