export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'progress' | 'mastery' | 'streak';
  maxProgress: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-lesson',
    title: 'Người mở đường',
    description: 'Hoàn thành chặng bài tập Hóa học đầu tiên',
    icon: '🚀',
    category: 'progress',
    maxProgress: 1,
  },
  {
    id: 'perfect-run',
    title: 'Nhà hóa học xuất sắc',
    description: 'Chinh phục trọn vẹn 1 chặng mà không mất tim nào',
    icon: '💎',
    category: 'mastery',
    maxProgress: 1,
  },
  {
    id: 'mol-warrior',
    title: 'Chiến binh Mol',
    description: 'Hoàn thành 10 bài tính toán Mol, khối lượng và thể tích khí',
    icon: '⚖️',
    category: 'mastery',
    maxProgress: 10,
  },
  {
    id: 'combo-master',
    title: 'Siêu bốc hỏa',
    description: 'Đạt chuỗi trả lời đúng 5 câu liên tiếp trong một bài học',
    icon: '🔥',
    category: 'mastery',
    maxProgress: 5,
  },
  {
    id: 'streak-3',
    title: 'Ngọn lửa bền bỉ',
    description: 'Giữ chuỗi học tập đèn cồn liên tục trong 3 ngày',
    icon: '🕯️',
    category: 'streak',
    maxProgress: 3,
  },
  {
    id: 'equation-hunter',
    title: 'Thợ săn phương trình',
    description: 'Viết và cân bằng chính xác 10 phương trình hóa học',
    icon: '🎯',
    category: 'mastery',
    maxProgress: 10,
  },
  {
    id: 'acid-base-expert',
    title: 'Chuyên gia Acid–Base',
    description: 'Chinh phục bài học về Acid, Base và thang đo pH',
    icon: '🧪',
    category: 'mastery',
    maxProgress: 1,
  },
  {
    id: 'level-5',
    title: 'Bậc thầy Hóa học',
    description: 'Tích lũy kinh nghiệm và đạt cấp độ Level 5',
    icon: '👑',
    category: 'progress',
    maxProgress: 5,
  },
];
