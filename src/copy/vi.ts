/**
 * Bộ ngôn ngữ tiếng Việt (Human Copy) cho Sci-Solve.
 * Giọng: như một thầy/cô gần gũi — ngắn, cụ thể, khích lệ, không phóng đại.
 * Tránh: cường điệu ("đỉnh nóc", "huyền thoại"), emoji, hứa hẹn XP không đúng thực tế.
 */

import {
  CHEM_CORRECT_PRAISE_LINES,
  BIO_CORRECT_PRAISE_LINES,
  PHYSICS_CORRECT_PRAISE_LINES,
  ALL_CORRECT_PRAISE_LINES,
} from './voiceScripts';

export * from './voiceScripts';

export const copyVi = {
  app: {
    title: 'Sci-Solve',
    subtitle: 'Luyện Khoa học tự nhiên lớp 6–9',
    welcome: 'Chào bạn! Hôm nay mình học bài nào?',
    startLesson: 'Bắt đầu bài học',
    continue: 'Học tiếp',
    checkAnswer: 'Kiểm tra câu trả lời',
    nextStep: 'Bước tiếp theo',
    tryAgain: 'Thử lại',
    understood: 'Đã hiểu',
  },

  auth: {
    login: 'Đăng nhập',
    register: 'Đăng ký',
    loginTitle: 'Chào mừng trở lại!',
    registerTitle: 'Tạo tài khoản',
    namePlaceholder: 'Tên hiển thị',
    emailPlaceholder: 'Email của bạn',
    passwordPlaceholder: 'Mật khẩu',
    createPasswordPlaceholder: 'Tạo mật khẩu (≥ 6 ký tự)',
    confirmPasswordPlaceholder: 'Xác nhận mật khẩu',
    forgotPassword: 'Quên mật khẩu?',
    loginButton: 'Đăng nhập',
    registerButton: 'Tạo tài khoản',
    processing: 'Đang xử lý...',
    or: 'hoặc',
    continueWithGoogle: 'Tiếp tục với Google',
    continueWithFacebook: 'Tiếp tục với Facebook',
    continueWithGithub: 'Tiếp tục với GitHub',
    terms: 'Điều khoản sử dụng',
    privacy: 'Chính sách bảo mật',
    termsNote: 'Khi tiếp tục, bạn đồng ý với',
    and: 'và',
    ofUs: 'của chúng mình.',
    successWelcome: 'Xong rồi, mình bắt đầu học nhé.',
    redirecting: 'Đang chuyển hướng...',
    logout: 'Đăng xuất',
    passwordStrength: {
      weak: 'Yếu',
      medium: 'Trung bình',
      fair: 'Khá',
      strong: 'Mạnh',
      veryStrong: 'Rất mạnh',
    },
    errors: {
      nameRequired: 'Hãy cho mình biết tên của bạn nhé!',
      emailRequired: 'Nhập email để tiếp tục nào!',
      emailInvalid: 'Email chưa đúng định dạng rồi!',
      passwordRequired: 'Đừng quên mật khẩu nhé!',
      passwordTooShort: 'Mật khẩu cần ít nhất 6 ký tự!',
      confirmPasswordMismatch: 'Mật khẩu xác nhận chưa khớp!',
      emailNotFound: 'Không tìm thấy tài khoản với email này.',
      wrongPassword: 'Mật khẩu không chính xác. Vui lòng thử lại.',
      emailExists: 'Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.',
    },
  },

  exercise: {
    correctHeadings: [
      'Đúng rồi!',
      'Chính xác!',
      'Làm tốt lắm!',
      'Chuẩn!',
    ],
    correctSubtitles: [
      'Bạn nắm được dạng bài này rồi.',
      'Lập luận rất gọn.',
      'Giữ nhịp này nhé.',
      'Bài này khó mà bạn vẫn làm đúng.',
    ],
    wrongHeadings: [
      'Chưa đúng',
      'Gần được rồi',
      'Thử lại nhé',
    ],
    wrongSubtitles: [
      'Đọc gợi ý bên dưới rồi làm lại.',
      'Xem lại từng bước, chỗ sai thường nằm ở một chi tiết nhỏ.',
      'Sai một lần giúp nhớ lâu hơn. Xem lời giải nhé.',
    ],
    partialHeadings: [
      'Gần đúng rồi!',
      'Được một nửa rồi',
    ],
    partialSubtitles: [
      'Hướng đi đúng, kiểm tra lại điều kiện hoặc đơn vị.',
      'Còn một phần nữa thôi.',
    ],
    hint: 'Gợi ý',
    explanation: 'Giải thích',
    solution: 'Đáp án',
    attemptsLeft: (count: number) => `Còn ${count} lượt thử`,
  },
  streak: {
    title: 'Chuỗi ngày học',
    keepFireAlive: 'Mỗi ngày làm ít nhất 1 bài để giữ chuỗi.',
    levels: {
      starter: 'Khởi đầu tốt. Mai quay lại nhé.',
      building: (days: number) => `${days} ngày liên tiếp. Thói quen đang hình thành.`,
      master: (days: number) => `${days} ngày liên tiếp, rất đều đặn.`,
      legend: (days: number) => `${days} ngày liên tiếp. Ít ai giữ được lâu như vậy.`,
    },
  },
  shop: {
    hero: {
      badge: 'Cửa hàng',
      title: 'Đổi đá quý',
      desc: 'Dùng đá quý kiếm được khi học để mua tim, khiên giữ chuỗi hoặc nhân đôi XP.',
    },
    items: {
      heartSingle: {
        title: '1 tim',
        desc: 'Thêm 1 tim để làm tiếp bài đang dở.',
      },
      heartFull: {
        title: 'Đầy 10 tim',
        desc: 'Nạp đầy tim một lần.',
        badge: 'Tiết kiệm hơn',
      },
      streakFreeze: {
        title: 'Khiên giữ chuỗi',
        desc: 'Giữ chuỗi ngày học nếu bạn nghỉ 1 ngày.',
      },
      xpBoost: {
        title: 'Nhân đôi XP',
        desc: 'Mọi bài làm trong 15 phút được gấp đôi XP.',
      },
      chest: {
        title: 'Rương ngẫu nhiên',
        desc: 'Có thể ra đá quý (tối đa 300), đầy tim hoặc XP.',
      },
    },
    status: {
      fullHearts: 'Đã đầy tim (10/10)',
      maxShield: 'Đã có tối đa (2/2)',
      activeBoost: (timeStr: string) => `Đang bật: còn ${timeStr}`,
      needMoreGems: (amount: number) => `Cần thêm ${amount} đá quý`,
    },
  },
  sessionComplete: {
    practiceTitle: 'Xong buổi luyện tập',
    learnTitle: 'Xong bài học',
    practiceBadge: 'Luyện tập',
    learnBadge: 'Hoàn thành',
    perfectSub: 'Không sai câu nào.',
    goodSub: (correct: number, total: number) =>
      `Bạn làm đúng ${correct}/${total} câu.`,
    continueButton: 'Học tiếp',
  },
  voice: {
    chem: CHEM_CORRECT_PRAISE_LINES,
    bio: BIO_CORRECT_PRAISE_LINES,
    physics: PHYSICS_CORRECT_PRAISE_LINES,
    allCorrect: ALL_CORRECT_PRAISE_LINES,
  },
};

/** Lấy ngẫu nhiên câu chúc mừng khi làm đúng */
export function getRandomCorrectPraise(): { heading: string; subtitle: string } {
  const headings = copyVi.exercise.correctHeadings;
  const subs = copyVi.exercise.correctSubtitles;
  return {
    heading: headings[Math.floor(Math.random() * headings.length)],
    subtitle: subs[Math.floor(Math.random() * subs.length)],
  };
}

/** Lấy ngẫu nhiên lời khuyên nhủ ân cần khi làm sai */
export function getRandomWrongCheer(): { heading: string; subtitle: string } {
  const headings = copyVi.exercise.wrongHeadings;
  const subs = copyVi.exercise.wrongSubtitles;
  return {
    heading: headings[Math.floor(Math.random() * headings.length)],
    subtitle: subs[Math.floor(Math.random() * subs.length)],
  };
}

/** Lấy lời khen ngợi chuỗi ngày theo số ngày streak */
export function getStreakPraise(streakDays: number): string {
  if (streakDays <= 2) return copyVi.streak.levels.starter;
  if (streakDays <= 6) return copyVi.streak.levels.building(streakDays);
  if (streakDays <= 29) return copyVi.streak.levels.master(streakDays);
  return copyVi.streak.levels.legend(streakDays);
}
