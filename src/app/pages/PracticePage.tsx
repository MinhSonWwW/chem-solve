import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Sparkles,
  BookOpen,
  Zap,
  Calculator,
  Scale,
  Beaker,
  Flame,
  Lock,
  CheckCircle2,
  ArrowRight,
  Droplets,
  Layers,
} from 'lucide-react';
import { sound } from '@/lib/audio';
import { assetUrl } from '@/lib/utils';
import { getCurriculum, type Grade } from '@/content/curriculum';
import { useUserStore } from '@/features/gamification/useUserStore';
import { useActiveSubject } from '@/content/subjects';
import { Mascot, Button } from '@/design-system';

interface LockModalInfo {
  isOpen: boolean;
  title: string;
  badge: string;
  description: string;
  requiredLessonName?: string;
  targetGrade: number;
  actionLabel?: string;
}

const GENERATOR_TOPICS = [
  {
    id: 'gen-infinite',
    title: 'Đề tổng hợp toán hóa ngẫu nhiên',
    desc: 'Trộn đều 5 câu: Mol, Thể tích khí, Tỉ khối, Nồng độ & PTHH',
    icon: Zap,
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    badge: 'Vô hạn đề',
    requiredLessonId: 'g8-b06',
    requiredLessonName: 'Bài 6: Tính theo PTHH',
  },
  {
    id: 'gen-mol',
    title: 'Toán số Mol & Khối lượng',
    desc: 'Công thức n = m / M và m = n × M với các bẫy đảo mẫu số',
    icon: Calculator,
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
    badge: 'Cơ bản',
    requiredLessonId: 'g8-b03',
    requiredLessonName: 'Bài 3: Mol và tỉ khối chất khí',
  },
  {
    id: 'gen-gas',
    title: 'Thể tích khí ở ĐKC & Tỉ khối',
    desc: 'Áp dụng chuẩn mới 24,79 L/mol, tỉ khối d(A/B) và d(A/kk)',
    icon: Flame,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    badge: 'ĐKC 24,79L',
    requiredLessonId: 'g8-b03',
    requiredLessonName: 'Bài 3: Mol và tỉ khối chất khí',
  },
  {
    id: 'gen-solution',
    title: 'Dung dịch & Nồng độ (C%, CM)',
    desc: 'Nồng độ phần trăm, nồng độ mol và quy đổi thể tích dung dịch',
    icon: Beaker,
    color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
    badge: 'Dung dịch',
    requiredLessonId: 'g8-b04',
    requiredLessonName: 'Bài 4: Dung dịch và nồng độ',
  },
  {
    id: 'gen-stoich',
    title: 'Tính theo phương trình hóa học',
    desc: 'Kim loại tác dụng với axit: Zn, Fe + HCl, H2SO4 loãng',
    icon: Scale,
    color: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30',
    badge: 'Toán PTHH',
    requiredLessonId: 'g8-b06',
    requiredLessonName: 'Bài 6: Tính theo PTHH',
  },
];

const PHYSICS_GENERATOR_TOPICS = [
  {
    id: 'phy-gen-infinite',
    title: 'Đề tổng hợp Vật lý ngẫu nhiên',
    desc: 'Trộn đều 5 câu: Vận tốc, Khối lượng riêng, Áp suất, Cơ năng & Định luật Ôm',
    icon: Zap,
    color: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30',
    badge: 'Vô hạn đề',
    requiredLessonId: 'phy-g8-b13',
    requiredLessonName: 'Bài 13: Khối lượng riêng',
  },
  {
    id: 'phy-gen-speed',
    title: 'Toán Tốc độ & Chuyển động (v = s/t)',
    desc: 'Tính tốc độ v, quãng đường s, thời gian t và chuyển đổi đơn vị km/h ↔ m/s',
    icon: Flame,
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
    badge: 'Cơ học',
    requiredLessonId: 'phy-g7-b08',
    requiredLessonName: 'Bài 8: Tốc độ chuyển động',
  },
  {
    id: 'phy-gen-density',
    title: 'Toán Khối lượng riêng & Trọng lượng',
    desc: 'Công thức D = m / V và P = 10m với các chất: nhôm, sắt, đồng, nước',
    icon: Calculator,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    badge: 'KLR & Trọng lực',
    requiredLessonId: 'phy-g8-b13',
    requiredLessonName: 'Bài 13: Khối lượng riêng',
  },
  {
    id: 'phy-gen-pressure',
    title: 'Toán Áp suất & Lực đẩy Archimedes',
    desc: 'Công thức áp suất p = F / S và độ lớn lực đẩy chất lỏng F_A = d × V',
    icon: Scale,
    color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
    badge: 'Áp suất & Lực',
    requiredLessonId: 'phy-g8-b14',
    requiredLessonName: 'Bài 14: Áp suất',
  },
  {
    id: 'phy-gen-energy',
    title: 'Toán Công cơ học & Cơ năng',
    desc: 'Tính công kéo A = F × s, thế năng trọng trường W_t và động năng W_đ',
    icon: Sparkles,
    color: 'from-rose-500/20 to-orange-500/20 text-rose-400 border-rose-500/30',
    badge: 'Năng lượng',
    requiredLessonId: 'phy-g8-b17',
    requiredLessonName: 'Bài 17: Cơ năng',
  },
  {
    id: 'phy-gen-ohm',
    title: 'Toán Định luật Ôm & Điện trở (I = U/R)',
    desc: 'Tính cường độ I, hiệu điện thế U và điện trở tương đương mạch nối tiếp',
    icon: Zap,
    color: 'from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/30',
    badge: 'Điện học',
    requiredLessonId: 'phy-g9-b08',
    requiredLessonName: 'Bài 8: Đoạn mạch nối tiếp',
  },
];

const BIOLOGY_GENERATOR_TOPICS = [
  {
    id: 'bio-gen-infinite',
    title: 'Đề Sinh Học Tổng Hợp (Vô Hạn)',
    desc: 'Trộn ngẫu nhiên câu hỏi phân bào & NST, tái bản DNA, phép lai Mendel, calo, truyền máu & mật độ quần thể',
    icon: Sparkles,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    badge: 'Đề Trộn',
    requiredLessonId: 'bio-g6-b04',
    requiredLessonName: 'Bài 20: Tế bào lớn lên và phân chia',
  },
  {
    id: 'bio-gen-mendel',
    title: 'Toán Phép Lai Mendel & Bảng Punnett',
    desc: 'Tính số loại giao tử 2ⁿ, số loại kiểu gen, kiểu hình và tỉ lệ phân li độc lập (9:3:3:1)',
    icon: Calculator,
    color: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30',
    badge: 'Di truyền 9',
    requiredLessonId: 'bio-g9-b02',
    requiredLessonName: 'Bài 37: Các quy luật di truyền của Mendel',
  },
  {
    id: 'bio-gen-dna',
    title: 'Toán Phân Tử DNA & Tái Bản Nhân Đôi',
    desc: 'Tính số liên kết hydrogen (2A+3G), chiều dài L = (N/2)×3,4Å và nucleotide môi trường N(2^k - 1)',
    icon: Sparkles,
    color: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30',
    badge: 'Phân tử 9',
    requiredLessonId: 'bio-g9-b03',
    requiredLessonName: 'Bài 38: Nucleic acid và gene',
  },
  {
    id: 'bio-gen-chromosomes',
    title: 'Toán Nhiễm Sắc Thể, Nguyên Phân & Giao Tử',
    desc: 'Tính số NST môi trường 2n×a(2^k - 1), số tinh trùng (4x) và số trứng (1y) sau giảm phân',
    icon: Scale,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    badge: 'Nhiễm sắc thể 9',
    requiredLessonId: 'bio-g9-b08',
    requiredLessonName: 'Bài 43: Nguyên phân và giảm phân',
  },
  {
    id: 'bio-gen-calories',
    title: 'Toán Năng Lượng Khẩu Phần Ăn (Calo)',
    desc: 'Tính tổng năng lượng: E = 4×Protein + 4×Carbohydrate + 9×Lipid (kcal)',
    icon: Flame,
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    badge: 'Dinh dưỡng 8',
    requiredLessonId: 'bio-g8-b03',
    requiredLessonName: 'Bài 32: Dinh dưỡng và tiêu hóa ở người',
  },
  {
    id: 'bio-gen-blood',
    title: 'Toán Truyền Máu ABO & Kháng Thể',
    desc: 'Nguyên tắc truyền máu an toàn hệ ABO: không để hồng cầu người cho bị ngưng kết',
    icon: Calculator,
    color: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30',
    badge: 'Tuần hoàn 8',
    requiredLessonId: 'bio-g8-b04',
    requiredLessonName: 'Bài 33: Máu và hệ tuần hoàn của cơ thể người',
  },
  {
    id: 'bio-gen-density',
    title: 'Toán Mật Độ Cá Thể Quần Thể (D = N/S)',
    desc: 'Tính mật độ cá thể trên đơn vị diện tích (m², ha) hoặc thể tích (m³)',
    icon: Scale,
    color: 'from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30',
    badge: 'Sinh thái 8',
    requiredLessonId: 'bio-g8-b13',
    requiredLessonName: 'Bài 42: Quần thể sinh vật',
  },
  {
    id: 'bio-gen-water',
    title: 'Toán Nhu Cầu Nước Cơ Thể Mỗi Ngày',
    desc: 'Tính lượng nước cần thiết theo cân nặng: V = m × 40 mL (Lớp 7 KNTT)',
    icon: Beaker,
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
    badge: 'Dinh dưỡng 7',
    requiredLessonId: 'bio-g7-b09',
    requiredLessonName: 'Bài 29: Vai trò của nước và chất dinh dưỡng',
  },
  {
    id: 'bio-gen-division',
    title: 'Toán Phân Bào & Sinh Sản Tế Bào (N = N₀ × 2ⁿ)',
    desc: 'Tính số lượng tế bào con sau n lần nguyên phân liên tiếp từ tế bào ban đầu',
    icon: Calculator,
    color: 'from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30',
    badge: 'Tế bào học 6',
    requiredLessonId: 'bio-g6-b04',
    requiredLessonName: 'Bài 20: Tế bào lớn lên và phân chia',
  },
  {
    id: 'bio-gen-microscope',
    title: 'Toán Độ Phóng Đại Kính Hiển Vi Quang Học',
    desc: 'Tính độ phóng đại ảnh = Độ phóng đại thị kính × Độ phóng đại vật kính',
    icon: Scale,
    color: 'from-teal-500/20 to-cyan-500/20 text-teal-400 border-teal-500/30',
    badge: 'Kỹ thuật 6',
    requiredLessonId: 'bio-g6-b03',
    requiredLessonName: 'Bài 19: Cấu tạo và chức năng các thành phần của tế bào',
  },
];

const CHEMISTRY_MINIGAMES = [
  {
    id: 'equation-balance',
    title: 'Cân Bằng PTHH',
    desc: 'Cân bằng hệ số nguyên tử 25 phản ứng hóa học kinh điển!',
    icon: Scale,
    badge: 'Hóa 8 - 9',
    route: '/games/equation-balance',
    colorKey: 'emerald',
  },
  {
    id: 'formula-builder',
    title: 'Ghép Công Thức Hóa Học',
    desc: 'Lắp ghép cation kim loại với anion gốc acid theo quy tắc hóa trị!',
    icon: Beaker,
    badge: 'Hóa 8',
    route: '/games/formula-builder',
    colorKey: 'sky',
  },
  {
    id: 'reaction-builder',
    title: 'Ghép Chuỗi Phản Ứng',
    desc: 'Chọn đúng chất tham gia và sản phẩm phản ứng tạo chuỗi biến hóa!',
    icon: Flame,
    badge: 'Hóa 9',
    route: '/games/reaction-builder',
    colorKey: 'amber',
  },
  {
    id: 'match',
    title: 'Nối Thẻ Chất Hóa Học',
    desc: 'Nối công thức hóa học với tên gọi tiếng Việt và phân loại chất!',
    icon: Layers,
    badge: 'Tương tác',
    route: '/games/match',
    colorKey: 'purple',
  },
  {
    id: 'sort',
    title: 'Phân Loại Chất Hóa Học',
    desc: 'Rót chất vào đúng bình tam giác: Acid, Base, Oxide, Muối!',
    icon: Droplets,
    badge: 'Phễu lọc',
    route: '/games/sort',
    colorKey: 'rose',
  },
  {
    id: 'speed',
    title: 'Đố Vui Tốc Độ Hóa Học',
    desc: 'Thử thách phản xạ nhanh 15 câu trắc nghiệm kiến thức trong 60 giây!',
    icon: Zap,
    badge: '60 Giây',
    route: '/games/speed',
    colorKey: 'amber',
  },
  {
    id: 'true-false',
    title: 'Đúng Hay Sai Hóa Học',
    desc: 'Kiểm định nhanh độ chính xác nhận định và hiện tượng hóa học!',
    icon: CheckCircle2,
    badge: 'Nhận định',
    route: '/games/true-false',
    colorKey: 'emerald',
  },
  {
    id: 'review',
    title: 'Hộp Ghi Nhớ Leitner (5 Cấp)',
    desc: 'Ôn tập lặp lại ngắt quãng củng cố kiến thức hóa học dài hạn!',
    icon: Layers,
    badge: 'Spaced Repetition',
    route: '/games/review',
    colorKey: 'cyan',
  },
];

const PHYSICS_MINIGAMES = [
  {
    id: 'match',
    title: 'Nối Cặp Công Thức Vật Lý',
    desc: 'Nối công thức với đại lượng & đơn vị chuẩn: Cơ, Nhiệt, Điện, Quang!',
    icon: Layers,
    badge: 'Công thức',
    route: '/games/match',
    colorKey: 'amber',
  },
  {
    id: 'sort',
    title: 'Phân Loại Hiện Tượng Vật Lý',
    desc: 'Phân loại hiện tượng vào đúng 4 chuyên đề: Cơ - Nhiệt - Điện - Quang!',
    icon: Sparkles,
    badge: 'Hiện tượng',
    route: '/games/sort',
    colorKey: 'sky',
  },
  {
    id: 'speed',
    title: 'Đố Vui Tốc Độ Vật Lý',
    desc: 'Tính nhanh vận tốc, công suất, áp suất, điện trở trong 60 giây!',
    icon: Zap,
    badge: '60 Giây',
    route: '/games/speed',
    colorKey: 'rose',
  },
  {
    id: 'true-false',
    title: 'Đúng Hay Sai Vật Lý',
    desc: 'Kiểm định định luật chuyển động, nhiệt học, từ trường & quang học!',
    icon: CheckCircle2,
    badge: 'Định luật',
    route: '/games/true-false',
    colorKey: 'emerald',
  },
  {
    id: 'review',
    title: 'Hộp Ghi Nhớ Leitner (5 Cấp)',
    desc: 'Ôn tập lặp lại ngắt quãng củng cố công thức và định luật vật lý!',
    icon: Layers,
    badge: 'Spaced Repetition',
    route: '/games/review',
    colorKey: 'cyan',
  },
];

const BIOLOGY_MINIGAMES = [
  {
    id: 'blood-transfusion',
    title: 'Cấp Cứu Truyền Máu ABO',
    desc: 'Chọn túi máu tương thích an toàn cho bệnh nhân cấp cứu trong 50s!',
    icon: Droplets,
    badge: 'Sinh 8',
    route: '/games/blood-transfusion',
    colorKey: 'rose',
  },
  {
    id: 'match',
    title: 'Nối Thẻ Sinh Học Đối Ứng',
    desc: 'Nối bào quan - chức năng, hoocmôn - tuyến nội tiết, bằng chứng tiến hóa!',
    icon: Layers,
    badge: 'Bào quan & Gen',
    route: '/games/match',
    colorKey: 'emerald',
  },
  {
    id: 'sort',
    title: 'Phân Loại Sinh Học',
    desc: 'Phân loại vào 4 nhóm: Tế bào, Cơ thể người, Di truyền học & Sinh thái!',
    icon: Sparkles,
    badge: '4 Chuyên đề',
    route: '/games/sort',
    colorKey: 'teal',
  },
  {
    id: 'speed',
    title: 'Đố Vui Tốc Độ Sinh Học',
    desc: 'Thử thách phản xạ nhanh 15 câu trắc nghiệm di truyền, phân bào & sinh thái!',
    icon: Zap,
    badge: '60 Giây',
    route: '/games/speed',
    colorKey: 'amber',
  },
  {
    id: 'true-false',
    title: 'Đúng Hay Sai Sinh Học',
    desc: 'Kiểm định nhanh 87 nhận định chuẩn SGK Sinh học THCS từ lớp 6 đến 9!',
    icon: CheckCircle2,
    badge: '87 Nhận Định',
    route: '/games/true-false',
    colorKey: 'emerald',
  },
  {
    id: 'review',
    title: 'Hộp Ghi Nhớ Leitner (5 Cấp)',
    desc: 'Ôn tập lặp lại ngắt quãng củng cố kiến thức sinh học dài hạn chống quên!',
    icon: Layers,
    badge: 'Spaced Repetition',
    route: '/games/review',
    colorKey: 'cyan',
  },
];

const GAME_COLOR_MAP: Record<
  string,
  {
    iconBg: string;
    iconBorder: string;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    hoverBorder: string;
    hoverTitle: string;
    playBg: string;
    playBorder: string;
    playFill: string;
    playShadow: string;
  }
> = {
  emerald: {
    iconBg: 'bg-emerald-500/20',
    iconBorder: 'border-emerald-500/40',
    iconColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/40',
    hoverBorder: 'hover:border-emerald-400',
    hoverTitle: 'group-hover:text-emerald-300',
    playBg: 'bg-emerald-500/20',
    playBorder: 'border-emerald-500',
    playFill: 'fill-emerald-400 text-emerald-400',
    playShadow: 'shadow-[0_2px_0_0_#059669]',
  },
  rose: {
    iconBg: 'bg-rose-500/20',
    iconBorder: 'border-rose-500/40',
    iconColor: 'text-rose-400',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/40',
    hoverBorder: 'hover:border-rose-400',
    hoverTitle: 'group-hover:text-rose-300',
    playBg: 'bg-rose-500/20',
    playBorder: 'border-rose-500',
    playFill: 'fill-rose-400 text-rose-400',
    playShadow: 'shadow-[0_2px_0_0_#9f1239]',
  },
  sky: {
    iconBg: 'bg-sky-500/20',
    iconBorder: 'border-sky-500/40',
    iconColor: 'text-sky-400',
    badgeBg: 'bg-sky-500/20',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-500/40',
    hoverBorder: 'hover:border-sky-400',
    hoverTitle: 'group-hover:text-sky-300',
    playBg: 'bg-sky-500/20',
    playBorder: 'border-sky-500',
    playFill: 'fill-sky-400 text-sky-400',
    playShadow: 'shadow-[0_2px_0_0_#0284c7]',
  },
  amber: {
    iconBg: 'bg-amber-500/20',
    iconBorder: 'border-amber-500/40',
    iconColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/40',
    hoverBorder: 'hover:border-amber-400',
    hoverTitle: 'group-hover:text-amber-300',
    playBg: 'bg-amber-500/20',
    playBorder: 'border-amber-500',
    playFill: 'fill-amber-400 text-amber-400',
    playShadow: 'shadow-[0_2px_0_0_#ca8a04]',
  },
  cyan: {
    iconBg: 'bg-cyan-500/20',
    iconBorder: 'border-cyan-500/40',
    iconColor: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-500/40',
    hoverBorder: 'hover:border-cyan-400',
    hoverTitle: 'group-hover:text-cyan-300',
    playBg: 'bg-cyan-500/20',
    playBorder: 'border-cyan-500',
    playFill: 'fill-cyan-400 text-cyan-400',
    playShadow: 'shadow-[0_2px_0_0_#0891b2]',
  },
  purple: {
    iconBg: 'bg-purple-500/20',
    iconBorder: 'border-purple-500/40',
    iconColor: 'text-purple-400',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-500/40',
    hoverBorder: 'hover:border-purple-400',
    hoverTitle: 'group-hover:text-purple-300',
    playBg: 'bg-purple-500/20',
    playBorder: 'border-purple-500',
    playFill: 'fill-purple-400 text-purple-400',
    playShadow: 'shadow-[0_2px_0_0_#7e22ce]',
  },
  teal: {
    iconBg: 'bg-teal-500/20',
    iconBorder: 'border-teal-500/40',
    iconColor: 'text-teal-400',
    badgeBg: 'bg-teal-500/20',
    badgeText: 'text-teal-300',
    badgeBorder: 'border-teal-500/40',
    hoverBorder: 'hover:border-teal-400',
    hoverTitle: 'group-hover:text-teal-300',
    playBg: 'bg-teal-500/20',
    playBorder: 'border-teal-500',
    playFill: 'fill-teal-400 text-teal-400',
    playShadow: 'shadow-[0_2px_0_0_#0f766e]',
  },
};

export const PracticePage: React.FC = () => {
  const navigate = useNavigate();
  const { completedNodes, hearts } = useUserStore();
  const { subject: activeSubject } = useActiveSubject();
  const isPhysics = activeSubject === 'physics';
  const isBio = activeSubject === 'bio';
  const activeMinigames = isBio ? BIOLOGY_MINIGAMES : isPhysics ? PHYSICS_MINIGAMES : CHEMISTRY_MINIGAMES;

  const [selectedGrade, setSelectedGrade] = useState<Grade>(() => {
    const saved = localStorage.getItem('chem_active_grade');
    const parsed = saved ? (parseInt(saved, 10) as Grade) : null;
    if (parsed && (parsed === 6 || parsed === 7 || parsed === 8 || parsed === 9)) {
      return parsed;
    }
    return isBio ? 8 : isPhysics ? 6 : 8;
  });
  const [selectedDiff, setSelectedDiff] = useState<'all' | '1' | '2' | '3'>('all');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all');
  const [modalInfo, setModalInfo] = useState<LockModalInfo | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('chem_active_grade');
    const parsed = saved ? (parseInt(saved, 10) as Grade) : null;
    if (activeSubject === 'bio') {
      if (parsed === 6 || parsed === 7 || parsed === 8 || parsed === 9) {
        setSelectedGrade(parsed);
      } else {
        setSelectedGrade(8);
      }
    }
  }, [activeSubject]);

  const curriculum = useMemo(() => getCurriculum(selectedGrade, activeSubject), [selectedGrade, activeSubject]);
  const chapters = curriculum.chapters;

  // ── Sequential Unlock Check: Học đến đâu thì mở khóa luyện tập đến đấy ──
  const lessonUnlockStatus = useMemo(() => {
    const statusMap = new Map<
      string,
      { isUnlocked: boolean; isCompleted: boolean; requiredLessonTitle?: string }
    >();

    let canUnlockNextPlayable = true;
    let lastCompletedTitle = '';

    for (const ch of chapters) {
      for (const lesson of ch.lessons) {
        const nodes = lesson.nodes;
        const isAnyNodeCompleted = nodes.some((n) => !!completedNodes[`${lesson.id}:${n.id}`]);
        const isAllNodesCompleted =
          nodes.length > 0 && nodes.every((n) => !!completedNodes[`${lesson.id}:${n.id}`]);

        let isUnlocked = false;

        if (isAnyNodeCompleted || isAllNodesCompleted) {
          isUnlocked = true;
          if (lesson.ready) {
            lastCompletedTitle = lesson.title;
          }
        } else if (canUnlockNextPlayable && lesson.ready) {
          // Current active uncompleted lesson reached on the Learn path
          isUnlocked = true;
          canUnlockNextPlayable = false; // Only unlock up to the lesson currently reached!
        } else {
          isUnlocked = false;
        }

        statusMap.set(lesson.id, {
          isUnlocked,
          isCompleted: isAllNodesCompleted,
          requiredLessonTitle: isUnlocked ? undefined : lastCompletedTitle || 'bài học trước đó',
        });
      }
    }

    return statusMap;
  }, [chapters, completedNodes]);

  const lessons = useMemo(() => {
    if (selectedChapterId === 'all') {
      return chapters.flatMap((c) => c.lessons);
    }
    const found = chapters.find((c) => c.id === selectedChapterId);
    return found ? found.lessons : [];
  }, [chapters, selectedChapterId]);

  const handleStartPractice = (lessonId: string, nodeId: string) => {
    sound.playClick();
    navigate(`/play/${lessonId}/${nodeId}?mode=practice`);
  };

  // Helper to verify if a topic / lesson has been reached on the Learn path
  const isLessonReached = (targetLessonId?: string, targetGrade: Grade = 8) => {
    if (!targetLessonId) return true;
    const gradeCurriculum = getCurriculum(targetGrade, activeSubject);
    let canUnlockNext = true;
    for (const ch of gradeCurriculum.chapters) {
      for (const l of ch.lessons) {
        const isAnyDone = l.nodes.some((n) => !!completedNodes[`${l.id}:${n.id}`]);
        const isAllDone = l.nodes.length > 0 && l.nodes.every((n) => !!completedNodes[`${l.id}:${n.id}`]);
        const isReached = isAnyDone || isAllDone || (canUnlockNext && l.ready);
        if (l.id === targetLessonId) {
          return isReached;
        }
        if (isAllDone) {
          // continues
        } else if (l.ready) {
          canUnlockNext = false;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    setSelectedChapterId('all');
  }, [activeSubject, selectedGrade]);

  const unlockedLessonsCount = useMemo(() => {
    let count = 0;
    lessonUnlockStatus.forEach((val) => {
      if (val.isUnlocked) count++;
    });
    return count;
  }, [lessonUnlockStatus]);

  return (
    <div className="space-y-6 pb-12 select-none max-w-3xl mx-auto">
      {/* Header Banner */}
      <div>
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center p-2 shrink-0 ${
            isPhysics
              ? 'bg-[#291e07] border-amber-500/40 text-amber-400 shadow-[0_4px_0_0_#78350f]'
              : isBio
              ? 'bg-[#062c20] border-emerald-500/40 text-emerald-400 shadow-[0_4px_0_0_#064e3b]'
              : 'bg-[#18272f] border-[#2e4756] shadow-[0_4px_0_0_#131f24]'
          }`}>
            {isPhysics ? (
              <Zap className="w-7 h-7 text-amber-400" />
            ) : isBio ? (
              <span className="text-2xl select-none">🌿</span>
            ) : (
              <img
                src={assetUrl('/assets/icons/xp-potion.png')}
                alt="Practice"
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{isPhysics ? 'Luyện Tập Vật Lý' : isBio ? 'Luyện Tập Sinh Học' : 'Luyện Tập Hóa Học'}</span>
            </h1>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {isPhysics
                ? 'Luyện bài tập SGK Vật lý: học đến đâu mở khóa đến đấy, không trừ tim, kiếm thêm XP'
                : isBio
                ? 'Luyện bài tập SGK Sinh học: học đến đâu mở khóa đến đấy, không trừ tim, kiếm thêm XP'
                : 'Tích hợp luyện tập SGK & dạng toán: học đến đâu mở khóa đến đấy, không trừ tim, kiếm thêm XP & phục hồi Tim'}
            </p>
          </div>
        </div>
      </div>

      {/* Hearts Recovery Alert if user is low on hearts */}
      {hearts < 5 && (
        <div
          className={`p-3.5 rounded-3xl border-2 flex items-center justify-between gap-3 shadow-[0_4px_0_0_#131f24] ${
            hearts === 0
              ? 'bg-[#ff4b4b]/15 border-[#ff4b4b]/40 text-rose-200'
              : 'bg-[#ff9600]/15 border-[#ff9600]/40 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#18272f] border-2 border-[#2e4756] flex items-center justify-center p-1.5 shrink-0 shadow-inner">
              <img
                src={assetUrl('/assets/icons/heart-flask.png')}
                alt="Heart"
                className="w-full h-full object-contain animate-pulse"
              />
            </div>
            <div>
              <div className="text-xs font-black text-white">
                {hearts === 0 ? 'Bạn đã hết tim (0/5)!' : `Đang có ${hearts}/5 tim`}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                Hoàn thành 1 bài luyện tập sẽ nhận ngay <span className="font-bold text-[#58cc02]">+1 tim</span>!
              </div>
            </div>
          </div>
          <div className="shrink-0 text-xs font-black px-3 py-1.5 rounded-xl bg-[#18272f] border-2 border-[#2e4756] text-white flex items-center gap-1.5 shadow-sm">
            <img src={assetUrl('/assets/icons/heart-flask.png')} alt="Heart" className="w-3.5 h-3.5 object-contain" />
            <span>{hearts}/5</span>
          </div>
        </div>
      )}

      {/* Grade Selector (Lớp 6 | Lớp 7 | Lớp 8 | Lớp 9) */}
      <div className="space-y-1.5 bg-[#18272f] border-2 border-[#2e4756] p-2.5 rounded-3xl shadow-[0_4px_0_0_#131f24]">
        <div className="flex items-center justify-between px-1 mb-1">
          <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
            Chọn khối lớp học tập:
          </label>
          <span className={`text-[11px] font-bold ${isPhysics ? 'text-amber-400' : isBio ? 'text-emerald-400' : 'text-[#0ea5e9]'}`}>
            {unlockedLessonsCount} bài đã mở khóa
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {([6, 7, 8, 9] as Grade[]).map((g) => (
            <button
              key={g}
              onClick={() => {
                sound.playClick();
                setSelectedGrade(g);
                setSelectedChapterId('all');
              }}
              className={`py-2.5 text-xs font-black rounded-2xl transition-all cursor-pointer border-2 ${
                selectedGrade === g
                  ? isPhysics
                    ? 'bg-[#eab308] text-slate-950 border-amber-200 shadow-[0_4px_0_0_#ca8a04] scale-[1.02]'
                    : isBio
                    ? 'bg-[#10b981] text-slate-950 border-emerald-200 shadow-[0_4px_0_0_#059669] scale-[1.02]'
                    : 'bg-[#0ea5e9] text-white border-sky-200 shadow-[0_4px_0_0_#0284c7] scale-[1.02]'
                  : 'bg-[#20333d] border-[#2e4756] text-slate-400 hover:text-white hover:bg-[#283e4a]'
              }`}
            >
              Lớp {g}
            </button>
          ))}
        </div>
      </div>

      {/* ── SECTION 1: BÀI TẬP THEO TỪNG BÀI SGK LỚP X ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            {isPhysics ? (
              <Zap className="w-4 h-4 text-amber-400" />
            ) : isBio ? (
              <span className="text-sm">🌿</span>
            ) : (
              <BookOpen className="w-4 h-4 text-cyan-400" />
            )}
            <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider">
              Bài Tập Theo Từng Bài SGK {isPhysics ? 'Vật Lý' : isBio ? 'Sinh Học' : 'Hóa Học'} Lớp {selectedGrade} ({lessons.length} bài)
            </h2>
          </div>
          <span className={`text-[11px] font-semibold ${isPhysics ? 'text-amber-400' : isBio ? 'text-emerald-400' : 'text-cyan-400'}`}>
            Chỉ mở khóa các bài bạn đã học đến
          </span>
        </div>

        {/* Chapter Filter */}
        <div className="space-y-1.5">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedChapterId('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border-2 ${
                selectedChapterId === 'all'
                  ? isPhysics
                    ? 'bg-[#eab308]/20 text-[#facc15] border-[#eab308] shadow-[0_2px_0_0_#ca8a04]'
                    : isBio
                    ? 'bg-[#10b981]/20 text-[#34d399] border-[#10b981] shadow-[0_2px_0_0_#059669]'
                    : 'bg-[#0ea5e9]/20 text-[#38bdf8] border-[#0ea5e9] shadow-[0_2px_0_0_#0284c7]'
                  : 'bg-[#20333d] text-slate-300 border-[#2e4756] hover:text-white hover:bg-[#283e4a]'
              }`}
            >
              Tất cả chương ({chapters.length} chương)
            </button>
            {chapters.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedChapterId(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border-2 ${
                  selectedChapterId === c.id
                    ? isPhysics
                      ? 'bg-[#eab308]/20 text-[#facc15] border-[#eab308] shadow-[0_2px_0_0_#ca8a04]'
                      : isBio
                      ? 'bg-[#10b981]/20 text-[#34d399] border-[#10b981] shadow-[0_2px_0_0_#059669]'
                      : 'bg-[#0ea5e9]/20 text-[#38bdf8] border-[#0ea5e9] shadow-[0_2px_0_0_#0284c7]'
                    : 'bg-[#20333d] text-slate-300 border-[#2e4756] hover:text-white hover:bg-[#283e4a]'
                }`}
              >
                {c.title.startsWith('Unit') ? c.title : `Chương ${c.chapterNumber}: ${c.title}`}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'all', label: 'Tất cả độ khó' },
            { id: '1', label: 'Dễ (★)' },
            { id: '2', label: 'Vừa (★★)' },
            { id: '3', label: 'Khó (★★★)' },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => {
                sound.playClick();
                setSelectedDiff(d.id as 'all' | '1' | '2' | '3');
              }}
              className={`py-1.5 rounded-xl text-[11px] font-bold border-2 transition-all cursor-pointer ${
                selectedDiff === d.id
                  ? isPhysics
                    ? 'bg-[#eab308]/20 text-[#facc15] border-[#eab308] shadow-[0_2px_0_0_#ca8a04]'
                    : isBio
                    ? 'bg-[#10b981]/20 text-[#34d399] border-[#10b981] shadow-[0_2px_0_0_#059669]'
                    : 'bg-[#0ea5e9]/20 text-[#38bdf8] border-[#0ea5e9] shadow-[0_2px_0_0_#0284c7]'
                  : 'bg-[#20333d] border-[#2e4756] text-slate-400 hover:text-slate-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Lessons List */}
        <div className="space-y-2.5">
          {lessons.map((lesson) => {
            const status = lessonUnlockStatus.get(lesson.id) ?? {
              isUnlocked: false,
              isCompleted: false,
            };
            const isAvailable = lesson.ready && status.isUnlocked;

            return (
              <div
                key={lesson.id}
                className={`p-4 rounded-3xl border-2 transition-all ${
                  !lesson.ready
                    ? 'bg-[#131f24]/80 border-[#20333d] hover:border-[#2e4756] cursor-pointer opacity-75'
                    : isAvailable
                      ? isPhysics
                        ? 'bg-[#18272f] border-[#2e4756] hover:border-amber-400 shadow-[0_4px_0_0_#131f24] cursor-pointer hover:translate-y-[-2px]'
                        : isBio
                        ? 'bg-[#18272f] border-[#2e4756] hover:border-emerald-400 shadow-[0_4px_0_0_#131f24] cursor-pointer hover:translate-y-[-2px]'
                        : 'bg-[#18272f] border-[#2e4756] hover:border-[#0ea5e9] shadow-[0_4px_0_0_#131f24] cursor-pointer hover:translate-y-[-2px]'
                      : 'bg-[#131f24]/80 border-[#20333d] hover:border-amber-500/40 cursor-pointer opacity-75'
                }`}
                onClick={() => {
                  if (isAvailable && lesson.nodes[0]) {
                    handleStartPractice(lesson.id, lesson.nodes[0].id);
                  } else if (!lesson.ready) {
                    sound.playClick();
                    setModalInfo({
                      isOpen: true,
                      title: lesson.title,
                      badge: '🛠️ Sắp có (Đang biên soạn)',
                      description: `Nội dung của bài "${lesson.title}" đang được ban biên tập hoàn thiện theo SGK mới. Bạn hãy tập trung học và luyện tập các bài học đang có sẵn trên bản đồ trước nhé!`,
                      requiredLessonName: status.requiredLessonTitle || 'các bài học trước đó',
                      targetGrade: selectedGrade,
                      actionLabel: 'XEM BẢN ĐỒ HỌC',
                    });
                  } else if (!status.isUnlocked) {
                    sound.playClick();
                    setModalInfo({
                      isOpen: true,
                      title: lesson.title,
                      badge: '🔒 Chưa mở khóa',
                      description: `Bạn chưa học đến bài "${lesson.title}". Cần hoàn thành "${status.requiredLessonTitle}" trên Lộ trình học trước để mở khóa bài luyện tập này nhé!`,
                      requiredLessonName: status.requiredLessonTitle,
                      targetGrade: selectedGrade,
                      actionLabel: 'ĐẾN LỘ TRÌNH HỌC NGAY',
                    });
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5 pr-3 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-black ${
                          isAvailable ? 'text-white' : 'text-slate-400'
                        }`}
                      >
                        {lesson.title}
                      </span>
                      {!lesson.ready ? (
                        <span className="text-[10px] font-bold bg-[#20333d] text-slate-400 border border-[#2e4756] px-2 py-0.5 rounded-lg flex items-center gap-1">
                          🛠️ Sắp có
                        </span>
                      ) : status.isCompleted ? (
                        <span className="text-[10px] font-bold bg-[#58cc02]/15 text-emerald-300 border border-[#58cc02]/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#58cc02]" /> Đã học · Luyện tập
                        </span>
                      ) : isAvailable ? (
                        isPhysics ? (
                          <span className="text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-400" /> Đang học · Luyện tập
                          </span>
                        ) : isBio ? (
                          <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            🌿 Đang học · Luyện tập
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-[#0ea5e9]/15 text-[#38bdf8] border border-[#0ea5e9]/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#0ea5e9]" /> Đang học · Luyện tập
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] font-bold bg-[#20333d] text-amber-400/90 border border-amber-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-400" /> Chưa mở khóa
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                      {lesson.subtitle}
                    </p>

                    {!isAvailable && lesson.ready && status.requiredLessonTitle && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400/90 pt-0.5">
                        <span>🔒 Cần hoàn thành "{status.requiredLessonTitle}" trên lộ trình học</span>
                        <span className="text-[#38bdf8] underline flex items-center ml-1">
                          Đến học <ArrowRight className="w-3 h-3 ml-0.5 inline" />
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Action Icon */}
                  {isAvailable ? (
                    <div className={`w-9 h-9 rounded-2xl border-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${
                      isPhysics
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_2px_0_0_#ca8a04]'
                        : isBio
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_2px_0_0_#059669]'
                        : 'bg-[#0ea5e9]/20 border-[#0ea5e9] text-[#38bdf8] shadow-[0_2px_0_0_#0284c7]'
                    }`}>
                      <Play className={`w-4 h-4 ${
                        isPhysics
                          ? 'fill-amber-400 text-amber-400'
                          : isBio
                          ? 'fill-emerald-400 text-emerald-400'
                          : 'fill-[#0ea5e9] text-[#0ea5e9]'
                      }`} />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-2xl bg-[#18272f] border-2 border-[#20333d] flex items-center justify-center text-slate-500 shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 2: ĐỀ TÍNH TOÁN VẬT LÝ TỰ ĐỘNG (Dành cho Vật lý) ── */}
      {isPhysics && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider">
                Đề Tính Toán Vật Lý Tự Động (Generators Vô Hạn)
              </h2>
            </div>
            <span className="text-[11px] text-amber-300 font-bold">
              Tự sinh số liệu mới: Vận tốc, KLR, Áp suất, Cơ năng, Định luật Ôm
            </span>
          </div>

          <div className="space-y-2.5">
            {PHYSICS_GENERATOR_TOPICS.map((gen) => {
              const Icon = gen.icon;
              const targetGrade = (gen.requiredLessonId.includes('g7')
                ? 7
                : gen.requiredLessonId.includes('g9')
                ? 9
                : 8) as Grade;
              const isUnlocked = isLessonReached(gen.requiredLessonId, targetGrade);

              return (
                <div
                  key={gen.id}
                  onClick={() => {
                    sound.playClick();
                    if (isUnlocked) {
                      navigate(`/play/${gen.id}/dyn?mode=practice`);
                    } else {
                      setModalInfo({
                        isOpen: true,
                        title: gen.title,
                        badge: '🔒 Chưa mở khóa',
                        description: `Dạng bài tập "${gen.title}" yêu cầu vận dụng kiến thức của ${gen.requiredLessonName}. Bạn cần học và hoàn thành bài này trên lộ trình trước nhé!`,
                        requiredLessonName: gen.requiredLessonName,
                        targetGrade,
                        actionLabel: 'ĐẾN HỌC BÀI NÀY',
                      });
                    }
                  }}
                  className={`border-2 p-4 rounded-3xl transition-all shadow-[0_4px_0_0_#131f24] flex items-center justify-between group cursor-pointer ${
                    isUnlocked
                      ? 'bg-[#18272f] border-[#2e4756] hover:border-amber-400 hover:translate-y-[-2px]'
                      : 'bg-[#131f24]/80 border-[#20333d] hover:border-amber-500/40 opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <div
                      className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center shrink-0 ${
                        isUnlocked
                          ? 'bg-[#291e07] border-amber-500/40 text-amber-400'
                          : 'bg-[#18272f] border-[#20333d] text-slate-600'
                      }`}
                    >
                      {isUnlocked ? <Icon className="w-5 h-5 text-amber-400" /> : <Lock className="w-5 h-5 text-slate-500" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3
                          className={`text-xs font-black truncate transition-colors ${
                            isUnlocked ? 'text-white group-hover:text-amber-300' : 'text-slate-400'
                          }`}
                        >
                          {gen.title}
                        </h3>
                        {isUnlocked ? (
                          <span className="text-[10px] font-bold bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30 shrink-0">
                            {gen.badge}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-[#20333d] text-slate-400 px-2 py-0.5 rounded-full border border-[#2e4756] flex items-center gap-1 shrink-0">
                            <Lock className="w-2.5 h-2.5" /> Chưa mở khóa
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed truncate font-medium">
                        {gen.desc}
                      </p>
                      {!isUnlocked && gen.requiredLessonName && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400/90 pt-0.5">
                          <span>🔒 Mở khóa khi học đến: {gen.requiredLessonName}</span>
                          <span className="text-amber-400 underline flex items-center ml-1">
                            Đến học <ArrowRight className="w-3 h-3 ml-0.5 inline" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-transform ${
                      isUnlocked
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_2px_0_0_#ca8a04] group-hover:scale-105'
                        : 'bg-[#18272f] border-[#20333d] text-slate-600'
                    }`}
                  >
                    {isUnlocked ? <Play className="w-4 h-4 fill-amber-400" /> : <Lock className="w-4 h-4" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SECTION 2: ĐỀ SINH HỌC TỰ ĐỘNG (Dành cho Sinh học) ── */}
      {isBio && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-base">🌿</span>
              <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider">
                Đề Sinh Học Tự Động (Generators Vô Hạn)
              </h2>
            </div>
            <span className="text-[11px] text-emerald-300 font-bold">
              Tự sinh số liệu mới: Phép lai Mendel, DNA & Tái bản, Phân bào & NST, Calo, ABO
            </span>
          </div>

          <div className="space-y-2.5">
            {BIOLOGY_GENERATOR_TOPICS.map((gen) => {
              const Icon = gen.icon;
              const targetGrade = (gen.requiredLessonId.includes('g9')
                ? 9
                : gen.requiredLessonId.includes('g8')
                ? 8
                : gen.requiredLessonId.includes('g7')
                ? 7
                : 6) as Grade;
              const isUnlocked = isLessonReached(gen.requiredLessonId, targetGrade);

              return (
                <div
                  key={gen.id}
                  onClick={() => {
                    sound.playClick();
                    if (isUnlocked) {
                      navigate(`/play/${gen.id}/dyn?mode=practice`);
                    } else {
                      setModalInfo({
                        isOpen: true,
                        title: gen.title,
                        badge: '🔒 Chưa mở khóa',
                        description: `Dạng bài tập "${gen.title}" yêu cầu vận dụng kiến thức của ${gen.requiredLessonName}. Bạn cần học và hoàn thành bài này trên lộ trình trước nhé!`,
                        requiredLessonName: gen.requiredLessonName,
                        targetGrade,
                        actionLabel: 'ĐẾN HỌC BÀI NÀY',
                      });
                    }
                  }}
                  className={`border-2 p-4 rounded-3xl transition-all shadow-[0_4px_0_0_#131f24] flex items-center justify-between group cursor-pointer ${
                    isUnlocked
                      ? 'bg-[#18272f] border-[#2e4756] hover:border-emerald-400 hover:translate-y-[-2px]'
                      : 'bg-[#131f24]/80 border-[#20333d] hover:border-emerald-500/40 opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <div
                      className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center shrink-0 ${
                        isUnlocked
                          ? 'bg-[#062c20] border-emerald-500/40 text-emerald-400'
                          : 'bg-[#18272f] border-[#20333d] text-slate-600'
                      }`}
                    >
                      {isUnlocked ? <Icon className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-slate-500" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3
                          className={`text-xs font-black truncate transition-colors ${
                            isUnlocked ? 'text-white group-hover:text-emerald-300' : 'text-slate-400'
                          }`}
                        >
                          {gen.title}
                        </h3>
                        {isUnlocked ? (
                          <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                            {gen.badge}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-[#20333d] text-slate-400 px-2 py-0.5 rounded-full border border-[#2e4756] flex items-center gap-1 shrink-0">
                            <Lock className="w-2.5 h-2.5" /> Chưa mở khóa
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed truncate font-medium">
                        {gen.desc}
                      </p>
                      {!isUnlocked && gen.requiredLessonName && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400/90 pt-0.5">
                          <span>🔒 Mở khóa khi học đến: {gen.requiredLessonName}</span>
                          <span className="text-emerald-400 underline flex items-center ml-1">
                            Đến học <ArrowRight className="w-3 h-3 ml-0.5 inline" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-transform ${
                      isUnlocked
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_2px_0_0_#059669] group-hover:scale-105'
                        : 'bg-[#18272f] border-[#20333d] text-slate-600'
                    }`}
                  >
                    {isUnlocked ? <Play className="w-4 h-4 fill-emerald-400 text-emerald-400" /> : <Lock className="w-4 h-4" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}



      {/* ── SECTION 2: ĐỀ TOÁN HÓA SINH TỰ ĐỘNG (Dành cho Hóa học Lớp 8) ── */}
      {!isPhysics && !isBio && selectedGrade === 8 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider">
                Đề Toán Hóa Sinh Tự Động (Generators Vô Hạn)
              </h2>
            </div>
            <span className="text-[11px] text-amber-300 font-bold">
              Tự sinh đề & chất mới theo bài học
            </span>
          </div>

          <div className="space-y-2.5">
            {GENERATOR_TOPICS.map((gen) => {
              const Icon = gen.icon;
              const isUnlocked = isLessonReached(gen.requiredLessonId, 8);

              return (
                <div
                  key={gen.id}
                  onClick={() => {
                    sound.playClick();
                    if (isUnlocked) {
                      navigate(`/play/${gen.id}/dyn?mode=practice`);
                    } else {
                      setModalInfo({
                        isOpen: true,
                        title: gen.title,
                        badge: '🔒 Chưa mở khóa',
                        description: `Dạng bài tập "${gen.title}" yêu cầu vận dụng kiến thức của ${gen.requiredLessonName}. Bạn cần học và hoàn thành bài này trên lộ trình trước nhé!`,
                        requiredLessonName: gen.requiredLessonName,
                        targetGrade: 8,
                        actionLabel: 'ĐẾN HỌC BÀI NÀY',
                      });
                    }
                  }}
                  className={`border-2 p-4 rounded-3xl transition-all shadow-[0_4px_0_0_#131f24] flex items-center justify-between group cursor-pointer ${
                    isUnlocked
                      ? 'bg-[#18272f] border-[#2e4756] hover:border-[#ff9600] hover:translate-y-[-2px]'
                      : 'bg-[#131f24]/80 border-[#20333d] hover:border-amber-500/40 opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <div
                      className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center shrink-0 ${
                        isUnlocked
                          ? `bg-[#20333d] border-[#2e4756] text-[#ff9600]`
                          : 'bg-[#18272f] border-[#20333d] text-slate-600'
                      }`}
                    >
                      {isUnlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-5 h-5 text-slate-500" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3
                          className={`text-xs font-black truncate transition-colors ${
                            isUnlocked ? 'text-white group-hover:text-amber-300' : 'text-slate-400'
                          }`}
                        >
                          {gen.title}
                        </h3>
                        {isUnlocked ? (
                          <span className="text-[10px] font-bold bg-[#ff9600]/15 text-[#ff9600] px-2 py-0.5 rounded-full border border-[#ff9600]/30 shrink-0">
                            {gen.badge}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-[#20333d] text-slate-400 px-2 py-0.5 rounded-full border border-[#2e4756] flex items-center gap-1 shrink-0">
                            <Lock className="w-2.5 h-2.5" /> Chưa mở khóa
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed truncate font-medium">
                        {gen.desc}
                      </p>
                      {!isUnlocked && gen.requiredLessonName && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400/90 pt-0.5">
                          <span>🔒 Mở khóa khi học đến: {gen.requiredLessonName}</span>
                          <span className="text-[#38bdf8] underline flex items-center ml-1">
                            Đến học <ArrowRight className="w-3 h-3 ml-0.5 inline" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-transform ${
                      isUnlocked
                        ? 'bg-[#ff9600]/20 border-[#ff9600] text-[#ff9600] shadow-[0_2px_0_0_#c26f00] group-hover:scale-105'
                        : 'bg-[#18272f] border-[#20333d] text-slate-600'
                    }`}
                  >
                    {isUnlocked ? <Play className="w-4 h-4 fill-[#ff9600]" /> : <Lock className="w-4 h-4" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SECTION 3: ĐẤU TRƯỜNG MINIGAMES (Tương tác & Thử thách Đa Môn) ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-base">🎮</span>
            <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider">
              Đấu Trường Mini-Games {isPhysics ? 'Vật Lý' : isBio ? 'Sinh Học' : 'Hóa Học'}
            </h2>
          </div>
          <span className={`text-[11px] font-bold ${isPhysics ? 'text-amber-300' : isBio ? 'text-emerald-300' : 'text-[#38bdf8]'}`}>
            {activeMinigames.length} trò chơi tương tác & phản xạ
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activeMinigames.map((game) => {
            const Icon = game.icon;
            const theme = GAME_COLOR_MAP[game.colorKey] || GAME_COLOR_MAP.emerald;
            return (
              <div
                key={game.id}
                onClick={() => {
                  sound.playClick();
                  navigate(game.route);
                }}
                className={`p-4 rounded-3xl border-2 bg-[#18272f] border-[#2e4756] ${theme.hoverBorder} shadow-[0_4px_0_0_#131f24] hover:translate-y-[-2px] transition-all cursor-pointer flex items-center justify-between group`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className={`w-12 h-12 rounded-2xl ${theme.iconBg} border-2 ${theme.iconBorder} ${theme.iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className={`text-xs font-black text-white ${theme.hoverTitle} truncate`}>
                        {game.title}
                      </h3>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder} shrink-0`}>
                        {game.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                      {game.desc}
                    </p>
                  </div>
                </div>
                <div className={`w-9 h-9 rounded-2xl ${theme.playBg} border-2 ${theme.playBorder} ${theme.iconColor} flex items-center justify-center shrink-0 ${theme.playShadow}`}>
                  <Play className={`w-4 h-4 ${theme.playFill}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Guidance Modal for Locked & Coming Soon Items */}
      <AnimatePresence>
        {modalInfo?.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalInfo(null)}
              className="absolute inset-0 bg-[#0c1417]/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-sm rounded-3xl bg-[#18272f] border-2 border-[#2e4756] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.65)] text-center space-y-4 z-10"
            >
              {/* Mascot */}
              <div className="flex justify-center pt-1">
                <Mascot state="thinking" size="xl" />
              </div>

              <div className="space-y-2">
                <span className="inline-block text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-800/60">
                  {modalInfo.badge}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {modalInfo.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {modalInfo.description}
                </p>

                {modalInfo.requiredLessonName && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-300 text-xs font-bold text-left space-y-0.5">
                    <span className="text-[10px] uppercase text-amber-400/80 font-black block">
                      Điều kiện mở khóa:
                    </span>
                    <span>👉 Cần học xong: <strong>{modalInfo.requiredLessonName}</strong></span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="flex items-center justify-center gap-2 font-black"
                  onClick={() => {
                    sound.playClick();
                    const target = modalInfo.targetGrade;
                    setModalInfo(null);
                    navigate(`/learn/${target}`);
                  }}
                >
                  <span>{modalInfo.actionLabel || 'ĐẾN LỘ TRÌNH HỌC'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    sound.playClick();
                    setModalInfo(null);
                  }}
                >
                  ĐÃ HIỂU
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
