/**
 * Bộ ngôn ngữ tiếng Việt (Human Copy) cho Chem-Solve.
 * Phong cách: Ấm áp, vui tươi, giàu năng lượng, gần gũi với lứa tuổi THCS (Lớp 6 - 9).
 * Không dùng văn phong dịch máy, khích lệ người học tự tin khám phá khoa học.
 */

export const copyVi = {
  app: {
    title: 'CHEM-SOLVE',
    subtitle: 'Đấu Trường Khoa Học THCS — Học Tương Tác & Luyện Tập',
    welcome: 'Chào mừng bạn đến với Chem-Solve! Sẵn sàng thám hiểm thế giới khoa học kỳ thú chưa?',
    startLesson: 'Bắt đầu bài học',
    continue: 'Tiếp tục hành trình',
    checkAnswer: 'Kiểm tra câu trả lời',
    nextStep: 'Bước tiếp theo',
    tryAgain: 'Thử lại ngay',
    understood: 'Đã hiểu rõ',
  },

  auth: {
    login: 'Đăng nhập',
    register: 'Đăng ký',
    loginTitle: 'Chào mừng trở lại!',
    registerTitle: 'Chào mừng nhà khoa học mới!',
    namePlaceholder: 'Tên hiển thị (vd: Nhà Hóa Học Nhí)',
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
    successWelcome: 'Phòng lab đã sẵn sàng, bắt đầu khám phá thôi! 🧪',
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
      'CHÍNH XÁC TUYỆT ĐỐI!',
      'CHUẨN KHÔNG CẦN CHỈNH!',
      'QUÁ XUẤT SẮC LUÔN!',
      'ĐỈNH NÓC KỊCH TRẦN!',
      'TUYỆT VỜI ÔNG MẶT TRỜI!',
      'BẮT TRÚNG BẢN CHẤT RỒI!',
    ],
    correctSubtitles: [
      'Bạn đã làm chủ dạng bài này một cách xuất sắc! (+10 XP)',
      'Tư duy cực kỳ sắc bén, bỏ túi thêm kiến thức xịn sò! (+10 XP)',
      'Phản xạ tuyệt đỉnh! Cứ phong độ này thì thủ khoa trong tầm tay! (+10 XP)',
      'Bài toán khó cũng không làm khó được bạn! Nhận ngay +10 XP!',
      'Chính xác! Bạn đang tiến bộ rõ rệt từng ngày đấy! (+10 XP)',
    ],
    wrongHeadings: [
      'CHƯA CHÍNH XÁC RỒI!',
      'SUÝT NỮA LÀ ĐÚNG!',
      'CỐ LÊN NÀO!',
      'ĐỪNG NẢN LÒNG NHÉ!',
      'VẤP MỘT CHÚT THÔI!',
    ],
    wrongSubtitles: [
      'Không sao cả! Các nhà khoa học vĩ đại cũng phải thử nhiều lần mới thành công.',
      'Bình tĩnh nhé! Đọc kỹ gợi ý từng bước bên dưới là bạn sẽ ngộ ra ngay thôi.',
      'Sai sót là mẹ thành công! Xem lại bản chất phản ứng rồi chuẩn bị phục thù nhé.',
      'Chỉ nhầm lẫn một chi tiết nhỏ thôi, đọc giải thích là nhớ mãi không quên!',
    ],
    partialHeadings: [
      'GẦN ĐÚNG RỒI!',
      'ĐƯỢC MỘT NỬA RỒI ĐẤY!',
      'THIẾU CHÚT XÍU NỮA!',
    ],
    partialSubtitles: [
      'Bạn đã đi đúng hướng, chỉ cần để ý thêm điều kiện hoặc đơn vị một chút nữa thôi!',
      'Rất đáng khen! Hoàn thiện nốt phần còn lại là ghi trọn điểm số!',
    ],
    hint: 'Gợi ý giải bài',
    explanation: 'Giải thích bản chất',
    solution: 'Đáp án chuẩn',
    attemptsLeft: (count: number) => `Còn lại ${count} lượt thử sức!`,
  },

  streak: {
    title: 'Chuỗi Ngày Học Tập',
    keepFireAlive: 'Giữ ngọn lửa chăm chỉ bùng cháy mỗi ngày!',
    levels: {
      starter: 'Khởi đầu tuyệt vời! Ngọn lửa học tập đã chính thức bốc cháy!',
      building: (days: number) => `Chuỗi ${days} ngày kiên trì! Bạn đang xây thói quen của một học sinh xuất sắc!`,
      master: (days: number) => `Chuỗi ${days} ngày bất bại! Đỉnh cao của sự bền bỉ, cực kỳ đáng nể phục!`,
      legend: (days: number) => `Huyền thoại ${days} ngày! Bạn chính là nguồn cảm hứng sáng chói cho phòng lab!`,
    },
  },

  shop: {
    hero: {
      badge: 'Cửa Hàng Tiếp Tế Phòng Lab',
      title: 'Kho Trang Bị & Tiếp Sức',
      desc: 'Dùng Đá quý thu thập từ các bài tập để nạp đầy bình Tim, trang bị khiên băng bảo vệ và bứt tốc kinh nghiệm!',
    },
    items: {
      heartSingle: {
        title: 'Hồi 1 Bình Tim',
        desc: 'Tiếp sức ngay 1 tim năng lượng để bạn thoải mái giải tiếp các bài tập đang dang dở.',
      },
      heartFull: {
        title: 'Bơm Trọn Vẹn 5/5 Tim',
        desc: 'Nạp đầy 5 bình năng lượng tức thì, cày cuốc thâu đêm không lo gián đoạn!',
        badge: 'Gói Siêu Tiết Kiệm',
      },
      streakFreeze: {
        title: 'Khiên Băng Chuỗi Ngày',
        desc: 'Đóng băng ngọn lửa Streak an toàn khi bạn bận rộn không thể vào học suốt 1 ngày.',
      },
      xpBoost: {
        title: 'Bình Nhân Đôi XP (2X)',
        desc: 'Nhân đôi toàn bộ điểm kinh nghiệm nhận được trong tất cả bài tập suốt 15 phút rực lửa!',
      },
      chest: {
        title: 'Rương Kho Báu Bí Mật Phòng Lab',
        desc: 'Mở nắp kho báu vàng óng với cơ hội nhận tới +300 Đá quý, bình Tim đầy hoặc kho XP khổng lồ!',
      },
    },
    status: {
      fullHearts: 'ĐÃ ĐẦY TIM (5/5)',
      maxShield: 'ĐÃ TRANG BỊ TỐI ĐA (2/2)',
      activeBoost: (timeStr: string) => `Đang kích hoạt: ${timeStr}`,
      needMoreGems: (amount: number) => `Cần thêm ${amount} Đá quý`,
    },
  },

  sessionComplete: {
    practiceTitle: 'Hoàn Thành Thao Trường Luyện Tập!',
    learnTitle: 'Xuất Sắc Vượt Qua Chặng Học!',
    practiceBadge: 'Luyện tập xuất sắc',
    learnBadge: 'Chinh phục chặng thành công',
    perfectSub: 'Đỉnh cao phong độ! Bạn không phạm một lỗi sai nào trong suốt cả bài học!',
    goodSub: (correct: number, total: number) =>
      `Bạn đã xuất sắc trả lời đúng ${correct}/${total} câu hỏi, tiếp tục giữ vững đà tiến lên nhé!`,
    continueButton: 'TIẾP TỤC BÀI HỌC',
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
