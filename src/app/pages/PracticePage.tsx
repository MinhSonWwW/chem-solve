import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Sparkles,
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
  Atom,
  Eye,
  Activity,
  Dna,
  Thermometer,
  Pipette,
  Search,
  Gauge,
  Sliders,
} from 'lucide-react';
import { sound } from '@/lib/audio';
import { getCurriculum, type Grade } from '@/content/curriculum';
import { useUserStore } from '@/features/gamification/useUserStore';
import { useActiveSubject } from '@/content/subjects';
import {
  Mascot,
  Button,
  HandDrawnIcon,
  DoodleOrnament,
  MinigameIllustration,
  GeneratorBadge,
  MathText,
} from '@/design-system';

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
    badge: 'Vô hạn đề',
    requiredLessonId: 'g8-b06',
    requiredLessonName: 'Bài 6: Tính theo PTHH',
  },
  {
    id: 'gen-mol',
    title: 'Toán số Mol & Khối lượng',
    desc: 'Công thức n = m / M và m = n × M với các bẫy đảo mẫu số',
    icon: Calculator,
    badge: 'Cơ bản',
    requiredLessonId: 'g8-b03',
    requiredLessonName: 'Bài 3: Mol và tỉ khối chất khí',
  },
  {
    id: 'gen-gas',
    title: 'Thể tích khí ở ĐKC & Tỉ khối',
    desc: 'Áp dụng chuẩn mới 24,79 L/mol, tỉ khối d(A/B) và d(A/kk)',
    icon: Flame,
    badge: 'ĐKC 24,79L',
    requiredLessonId: 'g8-b03',
    requiredLessonName: 'Bài 3: Mol và tỉ khối chất khí',
  },
  {
    id: 'gen-solution',
    title: 'Dung dịch & Nồng độ (C%, CM)',
    desc: 'Nồng độ phần trăm, nồng độ mol và quy đổi thể tích dung dịch',
    icon: Beaker,
    badge: 'Dung dịch',
    requiredLessonId: 'g8-b04',
    requiredLessonName: 'Bài 4: Dung dịch và nồng độ',
  },
  {
    id: 'gen-stoich',
    title: 'Tính theo phương trình hóa học',
    desc: 'Kim loại tác dụng với axit: Zn, Fe + HCl, H2SO4 loãng',
    icon: Scale,
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
    badge: 'Vô hạn đề',
    requiredLessonId: 'phy-g8-b13',
    requiredLessonName: 'Bài 13: Khối lượng riêng',
  },
  {
    id: 'phy-gen-speed',
    title: 'Toán Tốc độ & Chuyển động (v = s/t)',
    desc: 'Tính tốc độ v, quãng đường s, thời gian t và chuyển đổi đơn vị km/h ↔ m/s',
    icon: Flame,
    badge: 'Cơ học',
    requiredLessonId: 'phy-g7-b08',
    requiredLessonName: 'Bài 8: Tốc độ chuyển động',
  },
  {
    id: 'phy-gen-density',
    title: 'Toán Khối lượng riêng & Trọng lượng',
    desc: 'Công thức D = m / V và P = 10m với các chất: nhôm, sắt, đồng, nước',
    icon: Calculator,
    badge: 'KLR & Trọng lực',
    requiredLessonId: 'phy-g8-b13',
    requiredLessonName: 'Bài 13: Khối lượng riêng',
  },
  {
    id: 'phy-gen-pressure',
    title: 'Toán Áp suất & Lực đẩy Archimedes',
    desc: 'Công thức áp suất p = F / S và độ lớn lực đẩy chất lỏng F_A = d × V',
    icon: Scale,
    badge: 'Áp suất & Lực',
    requiredLessonId: 'phy-g8-b14',
    requiredLessonName: 'Bài 14: Áp suất',
  },
  {
    id: 'phy-gen-energy',
    title: 'Toán Công cơ học & Cơ năng',
    desc: 'Tính công kéo A = F × s, thế năng trọng trường W_t và động năng W_đ',
    icon: Sparkles,
    badge: 'Năng lượng',
    requiredLessonId: 'phy-g8-b17',
    requiredLessonName: 'Bài 17: Cơ năng',
  },
  {
    id: 'phy-gen-ohm',
    title: 'Toán Định luật Ôm & Điện trở (I = U/R)',
    desc: 'Tính cường độ I, hiệu điện thế U và điện trở tương đương mạch nối tiếp',
    icon: Zap,
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
    badge: 'Đề Trộn',
    requiredLessonId: 'bio-g6-b04',
    requiredLessonName: 'Bài 20: Tế bào lớn lên và phân chia',
  },
  {
    id: 'bio-gen-mendel',
    title: 'Toán Phép Lai Mendel & Bảng Punnett',
    desc: 'Tính số loại giao tử 2ⁿ, số loại kiểu gen, kiểu hình và tỉ lệ phân li độc lập (9:3:3:1)',
    icon: Calculator,
    badge: 'Di truyền 9',
    requiredLessonId: 'bio-g9-b02',
    requiredLessonName: 'Bài 37: Các quy luật di truyền của Mendel',
  },
  {
    id: 'bio-gen-dna',
    title: 'Toán Phân Tử DNA & Tái Bản Nhân Đôi',
    desc: 'Tính số liên kết hydrogen (2A+3G), chiều dài L = (N/2)×3,4Å và nucleotide môi trường N(2^k - 1)',
    icon: Sparkles,
    badge: 'Phân tử 9',
    requiredLessonId: 'bio-g9-b03',
    requiredLessonName: 'Bài 38: Nucleic acid và gene',
  },
  {
    id: 'bio-gen-chromosomes',
    title: 'Toán Nhiễm Sắc Thể, Nguyên Phân & Giao Tử',
    desc: 'Tính số NST môi trường 2n×a(2^k - 1), số tinh trùng (4x) và số trứng (1y) sau giảm phân',
    icon: Scale,
    badge: 'Nhiễm sắc thể 9',
    requiredLessonId: 'bio-g9-b08',
    requiredLessonName: 'Bài 43: Nguyên phân và giảm phân',
  },
  {
    id: 'bio-gen-calories',
    title: 'Toán Năng Lượng Khẩu Phần Ăn (Calo)',
    desc: 'Tính tổng năng lượng: E = 4×Protein + 4×Carbohydrate + 9×Lipid (kcal)',
    icon: Flame,
    badge: 'Dinh dưỡng 8',
    requiredLessonId: 'bio-g8-b03',
    requiredLessonName: 'Bài 32: Dinh dưỡng và tiêu hóa ở người',
  },
  {
    id: 'bio-gen-blood',
    title: 'Toán Truyền Máu ABO & Kháng Thể',
    desc: 'Nguyên tắc truyền máu an toàn hệ ABO: không để hồng cầu người cho bị ngưng kết',
    icon: Calculator,
    badge: 'Tuần hoàn 8',
    requiredLessonId: 'bio-g8-b04',
    requiredLessonName: 'Bài 33: Máu và hệ tuần hoàn của cơ thể người',
  },
  {
    id: 'bio-gen-density',
    title: 'Toán Mật Độ Cá Thể Quần Thể (D = N/S)',
    desc: 'Tính mật độ cá thể trên đơn vị diện tích (m², ha) hoặc thể tích (m³)',
    icon: Scale,
    badge: 'Sinh thái 8',
    requiredLessonId: 'bio-g8-b13',
    requiredLessonName: 'Bài 42: Quần thể sinh vật',
  },
  {
    id: 'bio-gen-water',
    title: 'Toán Nhu Cầu Nước Cơ Thể Mỗi Ngày',
    desc: 'Tính lượng nước cần thiết theo cân nặng: V = m × 40 mL (Lớp 7 KNTT)',
    icon: Beaker,
    badge: 'Dinh dưỡng 7',
    requiredLessonId: 'bio-g7-b09',
    requiredLessonName: 'Bài 29: Vai trò của nước và chất dinh dưỡng',
  },
  {
    id: 'bio-gen-division',
    title: 'Toán Phân Bào & Sinh Sản Tế Bào (N = N₀ × 2ⁿ)',
    desc: 'Tính số lượng tế bào con sau n lần nguyên phân liên tiếp từ tế bào ban đầu',
    icon: Calculator,
    badge: 'Tế bào học 6',
    requiredLessonId: 'bio-g6-b04',
    requiredLessonName: 'Bài 20: Tế bào lớn lên và phân chia',
  },
  {
    id: 'bio-gen-microscope',
    title: 'Toán Độ Phóng Đại Kính Hiển Vi Quang Học',
    desc: 'Tính độ phóng đại ảnh = Độ phóng đại thị kính × Độ phóng đại vật kính',
    icon: Scale,
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
  {
    id: 'periodic-guess',
    title: 'Đoán Ô Nguyên Tố Hóa Học',
    desc: 'Đoán tên và ký hiệu nguyên tố qua số hiệu nguyên tử Z, chu kì & tính chất!',
    icon: Atom,
    badge: 'Bảng Tuần Hoàn',
    route: '/games/periodic-guess',
    colorKey: 'sky',
  },
  {
    id: 'indicator-lab',
    title: 'Phòng Thử Chỉ Thị Màu pH',
    desc: 'Nhỏ chất chỉ thị quỳ tím & phenolphthalein nhận diện acid, base và muối!',
    icon: Beaker,
    badge: 'Thang pH',
    route: '/games/indicator-lab',
    colorKey: 'purple',
  },
  {
    id: 'precipitate-catcher',
    title: 'Bắt Kết Tủa Hóa Học',
    desc: 'Nhận biết màu sắc và bản chất hóa học của các kết tủa vô cơ kinh điển!',
    icon: Droplets,
    badge: 'Kết Tủa Vô Cơ',
    route: '/games/precipitate-catcher',
    colorKey: 'emerald',
  },
  {
    id: 'metal-race',
    title: 'Đua Dãy Hoạt Động Kim Loại',
    desc: 'Quyết định nhanh phản ứng kim loại đẩy muối và tác dụng với acid!',
    icon: Flame,
    badge: 'Dãy Hoạt Động',
    route: '/games/metal-race',
    colorKey: 'amber',
  },
  {
    id: 'hydrocarbon-sorter',
    title: 'Phân Loại Hydrocarbon Hữu Cơ',
    desc: 'Phân loại nhanh Alkane, Alkene, Alkyne và Rượu theo cấu tạo phân tử!',
    icon: Layers,
    badge: 'Hóa Hữu Cơ',
    route: '/games/hydrocarbon-sorter',
    colorKey: 'rose',
  },
  {
    id: 'flame-test',
    title: 'Bí Ẩn Màu Ngọn Lửa Kim Loại',
    desc: 'Nhận diện kim loại qua màu sắc đặc trưng khi đốt trên ngọn lửa đèn khí!',
    icon: Flame,
    badge: 'Quang Phổ Lửa',
    route: '/games/flame-test',
    colorKey: 'amber',
  },
  {
    id: 'gas-collector',
    title: 'Bậc Thầy Thu Khí Lab',
    desc: 'Chọn chuẩn phương pháp thu khí: Đẩy nước hay đẩy không khí (ngửa hay úp)!',
    icon: Droplets,
    badge: 'Kỹ Năng Lab',
    route: '/games/gas-collector',
    colorKey: 'teal',
  },
  {
    id: 'titration-lab',
    title: 'Thí Nghiệm Chuẩn Độ Acid - Base',
    desc: 'Thao tác van buret nhỏ từng giọt NaOH vào bình tam giác, căn điểm tương đương!',
    icon: Pipette,
    badge: 'Thực Hành Lab',
    route: '/games/titration-lab',
    colorKey: 'emerald',
  },
  {
    id: 'electrolyte-tester',
    title: 'Thử Tính Dẫn Điện Dung Dịch',
    desc: 'Nhúng hai điện cực vào dung dịch để kiểm tra bóng đèn sáng, mờ hay không sáng!',
    icon: Zap,
    badge: 'Chất Điện Ly',
    route: '/games/electrolyte-tester',
    colorKey: 'amber',
  },
  {
    id: 'separation-lab',
    title: 'Tách Chiết & Tinh Chế Hỗn Hợp',
    desc: 'Chọn phương pháp tách chất thông minh: lọc, cô cạn, chiết hay chưng cất!',
    icon: Beaker,
    badge: 'Kỹ Thuật Lab',
    route: '/games/separation-lab',
    colorKey: 'cyan',
  },
  {
    id: 'metal-corrosion',
    title: 'Chống Ăn Mòn Kim Loại & Gỉ Sắt',
    desc: 'Bảo vệ vỏ tàu biển, cầu sắt và máy móc trước sự phá hủy của môi trường!',
    icon: Flame,
    badge: 'Ăn Mòn Kim Loại',
    route: '/games/metal-corrosion',
    colorKey: 'rose',
  },
  {
    id: 'polymer-factory',
    title: 'Nhà Máy Hợp Chất Polymer',
    desc: 'Lắp ráp monome thành polyme: Nhựa PE, PVC, Cao su, Tơ tằm và Tinh bột!',
    icon: Layers,
    badge: 'Hóa Hữu Cơ',
    route: '/games/polymer-factory',
    colorKey: 'purple',
  },
  {
    id: 'energy-reaction',
    title: 'Năng Lượng Phản Ứng Enthalpy',
    desc: 'Phân loại phản ứng tỏa nhiệt (giải phóng năng lượng) và thu nhiệt!',
    icon: Sparkles,
    badge: 'Nhiệt Hóa Học',
    route: '/games/energy-reaction',
    colorKey: 'emerald',
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
  {
    id: 'circuit-builder',
    title: 'Thợ Nối Mạch Điện Thông Minh',
    desc: 'Phán đoán mạch kín, mạch hở, đoản mạch và an toàn mạng điện!',
    icon: Zap,
    badge: 'Mạch Điện',
    route: '/games/circuit-builder',
    colorKey: 'amber',
  },
  {
    id: 'optics-target',
    title: 'Bắn Tia Sáng Khúc Xạ & Phản Xạ',
    desc: 'Làm chủ góc tới i, góc khúc xạ r và định luật phản xạ toàn phần!',
    icon: Eye,
    badge: 'Quang Học',
    route: '/games/optics-target',
    colorKey: 'cyan',
  },
  {
    id: 'density-scale',
    title: 'Cân Khối Lượng Riêng & Lực Đẩy',
    desc: 'Tính khối lượng riêng D = m/V và phân biệt chìm nổi trong chất lỏng!',
    icon: Scale,
    badge: 'Chất Lưu',
    route: '/games/density-scale',
    colorKey: 'emerald',
  },
  {
    id: 'speed-radar',
    title: 'Bắn Tốc Độ Chuyển Động',
    desc: 'Tính tốc độ v = s/t và quy đổi siêu tốc km/h ↔ m/s!',
    icon: Zap,
    badge: 'Tốc Độ',
    route: '/games/speed-radar',
    colorKey: 'rose',
  },
  {
    id: 'lever-balance',
    title: 'Cân Bằng Đòn Bẩy Thần Tốc',
    desc: 'Vận dụng quy tắc đòn bẩy F1.d1 = F2.d2 để bập bênh thăng bằng!',
    icon: Scale,
    badge: 'Cơ Học Máy',
    route: '/games/lever-balance',
    colorKey: 'purple',
  },
  {
    id: 'heat-transfer',
    title: 'Đua Hình Thức Truyền Nhiệt',
    desc: 'Phân loại nhanh Dẫn nhiệt (chất rắn), Đối lưu & Bức xạ nhiệt!',
    icon: Thermometer,
    badge: 'Nhiệt Học',
    route: '/games/heat-transfer',
    colorKey: 'rose',
  },
  {
    id: 'lens-quiz',
    title: 'Thấu Kính Hội Tụ & Tiêu Cự',
    desc: 'Xác định nhanh tính chất ảnh thật hay ảo, cùng chiều hay ngược chiều!',
    icon: Eye,
    badge: 'Quang Hình',
    route: '/games/lens-quiz',
    colorKey: 'sky',
  },
  {
    id: 'circuit-master',
    title: 'Thợ Lắp Mạch Điện Thực Hành',
    desc: 'Đóng khóa K, kéo con chạy biến trở và đo dòng điện chạy qua đèn theo định luật Ohm!',
    icon: Sliders,
    badge: 'Thực Hành Lab',
    route: '/games/circuit-master',
    colorKey: 'amber',
  },
  {
    id: 'optics-bench',
    title: 'Bàn Quang Học Thấu Kính Hội Tụ',
    desc: 'Kéo màn hứng ảnh lấy nét trên trục chính và xác định tính chất quang học!',
    icon: Eye,
    badge: 'Thực Hành Lab',
    route: '/games/optics-bench',
    colorKey: 'cyan',
  },
  {
    id: 'ohm-resistor',
    title: 'Bậc Thầy Ghép Điện Trở Mạch Điện',
    desc: 'Tính toán điện trở tương đương nối tiếp & song song trong tích tắc!',
    icon: Zap,
    badge: 'Định Luật Ohm',
    route: '/games/ohm-resistor',
    colorKey: 'amber',
  },
  {
    id: 'transformer-grid',
    title: 'Máy Biến Áp & Lưới Điện Cao Thế',
    desc: 'Tăng áp giảm hao phí đường dây truyền tải điện đi xa hàng trăm km!',
    icon: Zap,
    badge: 'Truyền Tải Điện',
    route: '/games/transformer-grid',
    colorKey: 'sky',
  },
  {
    id: 'echo-sonar',
    title: 'Sóng Siêu Âm Đo Độ Sâu Đáy Biển',
    desc: 'Phát sóng âm xuống đáy biển và hứng tiếng vang dội lại để vẽ bản đồ đáy đại dương!',
    icon: Gauge,
    badge: 'Âm Học',
    route: '/games/echo-sonar',
    colorKey: 'teal',
  },
  {
    id: 'pressure-diver',
    title: 'Áp Suất Khí Quyển & Áp Suất Lỏng',
    desc: 'Lặn xuống đáy biển sâu & leo lên đỉnh núi Everest đo áp suất Torricelli!',
    icon: Scale,
    badge: 'Chất Lưu',
    route: '/games/pressure-diver',
    colorKey: 'cyan',
  },
  {
    id: 'work-power',
    title: 'Đua Công Suất & Hiệu Suất Động Cơ',
    desc: 'Tính công cơ học A = F.s và công suất P = A/t của các cỗ máy siêu tốc!',
    icon: Zap,
    badge: 'Năng Lượng Cơ',
    route: '/games/work-power',
    colorKey: 'purple',
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
  {
    id: 'dna-pairing',
    title: 'Bắt Cặp Nucleotide DNA Thần Tốc',
    desc: 'Bắt cặp đúng nguyên tắc bổ sung A-T, G-C và tính toán liên kết hydro DNA!',
    icon: Dna,
    badge: 'Di truyền 9',
    route: '/games/dna-pairing',
    colorKey: 'emerald',
  },
  {
    id: 'mitosis-rush',
    title: 'Đua Kỳ Nguyên Phân & Phân Bào',
    desc: 'Nhận diện chớp nhoáng 4 kì: Đầu, Giữa, Sau, Cuối và số lượng NST!',
    icon: Activity,
    badge: 'Tế bào 9',
    route: '/games/mitosis-rush',
    colorKey: 'purple',
  },
  {
    id: 'organelle-quest',
    title: 'Đại Chiến Bào Quan Tế Bào',
    desc: 'Khám phá Ti thể, Lục lạp, Ribosome, Lưới nội chất và Bộ máy Golgi!',
    icon: Sparkles,
    badge: 'Bào quan 6-9',
    route: '/games/organelle-quest',
    colorKey: 'cyan',
  },
  {
    id: 'punnett-challenge',
    title: 'Thử Thách Bảng Lai Punnett',
    desc: 'Dự đoán tỉ lệ phân li kiểu gen & kiểu hình các phép lai Mendel!',
    icon: Calculator,
    badge: 'Lai giống 9',
    route: '/games/punnett-challenge',
    colorKey: 'teal',
  },
  {
    id: 'food-chain',
    title: 'Chuỗi Thức Ăn & Sinh Thái Học',
    desc: 'Xếp đúng bậc dinh dưỡng: Sinh vật sản xuất -> Tiêu thụ bậc 1 -> Phân giải!',
    icon: Layers,
    badge: 'Sinh thái 9',
    route: '/games/food-chain',
    colorKey: 'emerald',
  },
  {
    id: 'chromosome-doctor',
    title: 'Bác Sĩ Di Truyền Học NST',
    desc: 'Chẩn đoán các hội chứng di truyền: Down (3 NST 21), Turner (XO), Klinefelter (XXY)!',
    icon: Activity,
    badge: 'Bệnh học 9',
    route: '/games/chromosome-doctor',
    colorKey: 'rose',
  },
  {
    id: 'blood-flow',
    title: 'Bác Sĩ Tim Mạch & Hệ Tuần Hoàn',
    desc: 'Lần theo vòng tuần hoàn lớn & nhỏ: Tâm thất trái -> Động mạch chủ -> Tĩnh mạch!',
    icon: Droplets,
    badge: 'Cơ thể 8',
    route: '/games/blood-flow',
    colorKey: 'rose',
  },
  {
    id: 'microscope-focus',
    title: 'Kính Hiển Vi Thao Tác Soi Tế Bào',
    desc: 'Vặn ốc sơ cấp, vi cấp lấy nét tiêu bản và giải phẫu các bào quan tế bào!',
    icon: Search,
    badge: 'Thực Hành Lab',
    route: '/games/microscope-focus',
    colorKey: 'emerald',
  },
  {
    id: 'blood-pressure',
    title: 'Bác Sĩ Đo Huyết Áp & Vận Tốc Máu',
    desc: 'Đọc chỉ số máy đo huyết áp 120/80 mmHg và giải mã áp lực dòng máu!',
    icon: Activity,
    badge: 'Sinh Lý Người',
    route: '/games/blood-pressure',
    colorKey: 'rose',
  },
  {
    id: 'photosynthesis-lab',
    title: 'Thí Nghiệm Quang Hợp Ở Thực Vật',
    desc: 'Chiếu sáng cành rong đuôi chó trong ống nghiệm hứng bọt khí oxygen!',
    icon: Sparkles,
    badge: 'Quang Hợp',
    route: '/games/photosynthesis-lab',
    colorKey: 'emerald',
  },
  {
    id: 'pedigree-detective',
    title: 'Thám Tử Phả Hệ Di Truyền Gia Đình',
    desc: 'Giải mã sơ đồ phả hệ: Bệnh mù màu, Máu khó đông & Bạch tạng di truyền!',
    icon: Dna,
    badge: 'Di Truyền Học',
    route: '/games/pedigree-detective',
    colorKey: 'purple',
  },
  {
    id: 'reflex-arc',
    title: 'Cung Phản Xạ Thần Kinh Thần Tốc',
    desc: 'Theo dấu xung thần kinh truyền đi khi tay chạm vào vật nóng!',
    icon: Zap,
    badge: 'Hệ Thần Kinh',
    route: '/games/reflex-arc',
    colorKey: 'teal',
  },
  {
    id: 'immune-defense',
    title: 'Đại Chiến Miễn Dịch & Kháng Thể',
    desc: 'Bạch cầu thực bào, Lympho B tiết kháng thể hình chữ Y tiêu diệt virus vi khuẩn!',
    icon: Droplets,
    badge: 'Miễn Dịch Học',
    route: '/games/immune-defense',
    colorKey: 'rose',
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
    iconBg: 'bg-[var(--ok-tint)]',
    iconBorder: 'border-[var(--ok-edge)]/40',
    iconColor: 'text-[var(--ok-fg)]',
    badgeBg: 'bg-[var(--ok-tint)]',
    badgeText: 'text-[var(--ok-fg)]',
    badgeBorder: 'border-[var(--ok-edge)]/40',
    hoverBorder: 'hover:border-[var(--ok-fill)]',
    hoverTitle: 'group-hover:text-[var(--ok-fg)]',
    playBg: 'bg-[var(--ok-fill)]',
    playBorder: 'border-[var(--ok-edge)]',
    playFill: 'fill-white text-white',
    playShadow: 'shadow-[0_2px_0_0_var(--ok-edge)]',
  },
  rose: {
    iconBg: 'bg-[var(--gem-tint)]',
    iconBorder: 'border-[var(--gem-edge)]/40',
    iconColor: 'text-[var(--gem-fg)]',
    badgeBg: 'bg-[var(--gem-tint)]',
    badgeText: 'text-[var(--gem-fg)]',
    badgeBorder: 'border-[var(--gem-edge)]/40',
    hoverBorder: 'hover:border-[var(--gem-fill)]',
    hoverTitle: 'group-hover:text-[var(--gem-fg)]',
    playBg: 'bg-[var(--gem-fill)]',
    playBorder: 'border-[var(--gem-edge)]',
    playFill: 'fill-white text-white',
    playShadow: 'shadow-[0_2px_0_0_var(--gem-edge)]',
  },
  sky: {
    iconBg: 'bg-[var(--chem-tint)]',
    iconBorder: 'border-[var(--chem-edge)]/40',
    iconColor: 'text-[var(--chem-fg)]',
    badgeBg: 'bg-[var(--chem-tint)]',
    badgeText: 'text-[var(--chem-fg)]',
    badgeBorder: 'border-[var(--chem-edge)]/40',
    hoverBorder: 'hover:border-[var(--chem-fill)]',
    hoverTitle: 'group-hover:text-[var(--chem-fg)]',
    playBg: 'bg-[var(--chem-fill)]',
    playBorder: 'border-[var(--chem-edge)]',
    playFill: 'fill-white text-white',
    playShadow: 'shadow-[0_2px_0_0_var(--chem-edge)]',
  },
  amber: {
    iconBg: 'bg-[var(--gold-tint)]',
    iconBorder: 'border-[var(--gold-edge)]/40',
    iconColor: 'text-[var(--gold-fg)]',
    badgeBg: 'bg-[var(--gold-tint)]',
    badgeText: 'text-[var(--gold-fg)]',
    badgeBorder: 'border-[var(--gold-edge)]/40',
    hoverBorder: 'hover:border-[var(--gold-fill)]',
    hoverTitle: 'group-hover:text-[var(--gold-fg)]',
    playBg: 'bg-[var(--gold-fill)]',
    playBorder: 'border-[var(--gold-edge)]',
    playFill: 'fill-[var(--on-ink)] text-[var(--on-ink)]',
    playShadow: 'shadow-[0_2px_0_0_var(--gold-edge)]',
  },
  cyan: {
    iconBg: 'bg-[var(--slate-tint)]',
    iconBorder: 'border-[var(--slate-edge)]/40',
    iconColor: 'text-[var(--slate-fg)]',
    badgeBg: 'bg-[var(--slate-tint)]',
    badgeText: 'text-[var(--slate-fg)]',
    badgeBorder: 'border-[var(--slate-edge)]/40',
    hoverBorder: 'hover:border-[var(--slate-fill)]',
    hoverTitle: 'group-hover:text-[var(--slate-fg)]',
    playBg: 'bg-[var(--slate-fill)]',
    playBorder: 'border-[var(--slate-edge)]',
    playFill: 'fill-white text-white',
    playShadow: 'shadow-[0_2px_0_0_var(--slate-edge)]',
  },
  purple: {
    iconBg: 'bg-[var(--phy-tint)]',
    iconBorder: 'border-[var(--phy-edge)]/40',
    iconColor: 'text-[var(--phy-fg)]',
    badgeBg: 'bg-[var(--phy-tint)]',
    badgeText: 'text-[var(--phy-fg)]',
    badgeBorder: 'border-[var(--phy-edge)]/40',
    hoverBorder: 'hover:border-[var(--phy-fill)]',
    hoverTitle: 'group-hover:text-[var(--phy-fg)]',
    playBg: 'bg-[var(--phy-fill)]',
    playBorder: 'border-[var(--phy-edge)]',
    playFill: 'fill-white text-white',
    playShadow: 'shadow-[0_2px_0_0_var(--phy-edge)]',
  },
  teal: {
    iconBg: 'bg-[var(--bio-tint)]',
    iconBorder: 'border-[var(--bio-edge)]/40',
    iconColor: 'text-[var(--bio-fg)]',
    badgeBg: 'bg-[var(--bio-tint)]',
    badgeText: 'text-[var(--bio-fg)]',
    badgeBorder: 'border-[var(--bio-edge)]/40',
    hoverBorder: 'hover:border-[var(--bio-fill)]',
    hoverTitle: 'group-hover:text-[var(--bio-fg)]',
    playBg: 'bg-[var(--bio-fill)]',
    playBorder: 'border-[var(--bio-edge)]',
    playFill: 'fill-white text-white',
    playShadow: 'shadow-[0_2px_0_0_var(--bio-edge)]',
  },
};

export const PracticePage: React.FC = () => {
  const navigate = useNavigate();
  const { completedNodes, practiceCompletedLessons, hearts } = useUserStore();
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

    let previousLessonsCompleted = true;
    let lastCompletedTitle = '';

    for (const ch of chapters) {
      for (const lesson of ch.lessons) {
        const requiredNodes = lesson.nodes.filter((n) => n.type !== 'chest');
        const isAllNodesCompletedOnLearn =
          requiredNodes.length > 0 &&
          requiredNodes.every((n) => !!completedNodes[`${lesson.id}:${n.id}`]);
        const isAnyNodeCompletedOnLearn =
          requiredNodes.some((n) => !!completedNodes[`${lesson.id}:${n.id}`]);
        const isPracticeCompleted = !!practiceCompletedLessons?.[lesson.id];

        // Lesson is considered "completed" if all nodes done in Learn OR practice session completed
        const isCompleted = isAllNodesCompletedOnLearn || isPracticeCompleted;

        // Lesson is unlocked in Practice ONLY IF previous lessons were completed, or if student already reached this lesson
        const isUnlocked = previousLessonsCompleted || isAnyNodeCompletedOnLearn || isAllNodesCompletedOnLearn;

        statusMap.set(lesson.id, {
          isUnlocked,
          isCompleted,
          requiredLessonTitle: isUnlocked ? undefined : lastCompletedTitle || 'bài học trước đó',
        });

        if (lesson.ready) {
          if (isAllNodesCompletedOnLearn) {
            lastCompletedTitle = lesson.title;
            // previousLessonsCompleted stays true to unlock the next lesson
          } else {
            // Lesson has not been fully finished on the Learn path! Stop cascading unlock!
            previousLessonsCompleted = false;
          }
        }
      }
    }

    return statusMap;
  }, [chapters, completedNodes, practiceCompletedLessons]);

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
  const isLessonReached = (targetLessonId?: string, targetGrade: Grade = selectedGrade) => {
    if (!targetLessonId) return true;
    const gradeCurriculum = getCurriculum(targetGrade, activeSubject);
    let canUnlockNext = true;
    for (const ch of gradeCurriculum.chapters) {
      for (const l of ch.lessons) {
        const requiredNodes = l.nodes.filter((n) => n.type !== 'chest');
        const isAllDone =
          requiredNodes.length > 0 &&
          requiredNodes.every((n) => !!completedNodes[`${l.id}:${n.id}`]);
        const isAnyDone = requiredNodes.some((n) => !!completedNodes[`${l.id}:${n.id}`]);
        const isReached = isAnyDone || isAllDone || canUnlockNext;
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
    <div data-subject={activeSubject} className="space-y-6 pb-12 select-none max-w-3xl mx-auto">
      {/* Header Banner — Phong cách Studio Thao Trường */}
      <div className="relative rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] p-5 overflow-hidden">
        {/* Góc gấp sổ tay thí nghiệm */}
        <div
          className="absolute top-0 right-0 w-8 h-8 pointer-events-none bg-[var(--subject-fill)]/20"
          style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
        />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface-2)] flex items-center justify-center p-2 shrink-0">
            <HandDrawnIcon
              name={isPhysics ? 'atom' : isBio ? 'dna' : 'xp-potion'}
              size={36}
            />
          </div>
          <div className="space-y-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
              <span>{isPhysics ? 'Thao Trường Vật Lý' : isBio ? 'Thao Trường Sinh Học' : 'Thao Trường Hóa Học'}</span>
            </h1>
            <DoodleOrnament
              name="wavy-underline"
              color={isPhysics ? 'var(--phy-fill)' : isBio ? 'var(--bio-fill)' : 'var(--chem-fill)'}
            />
            <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed pt-0.5">
              {isPhysics
                ? 'Luyện bài tập SGK Vật lý: học đến đâu mở khóa đến đấy, không trừ tim, kiếm thêm XP'
                : isBio
                ? 'Luyện bài tập SGK Sinh học: học đến đâu mở khóa đến đấy, không trừ tim, kiếm thêm XP'
                : 'Tích hợp luyện tập SGK & dạng toán: học đến đâu mở khóa đến đấy, không trừ tim, kiếm thêm XP & phục hồi Tim'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Virtual Lab Banner Card */}
      <div
        onClick={() => {
          sound.playClick();
          navigate(`/lab?tab=${isPhysics ? 'physics' : isBio ? 'bio' : 'chem'}`);
        }}
        className="p-3.5 sm:p-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--chem-fill)] transition-all cursor-pointer group flex items-center justify-between gap-3 active:translate-y-[2px]"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[var(--chem-tint)] border border-[var(--chem-fill)]/40 flex items-center justify-center shrink-0 text-xl sm:text-2xl group-hover:scale-105 transition-transform">
            {isPhysics ? '⚡' : isBio ? '🔬' : '🧪'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-[var(--text-primary)] group-hover:text-[var(--chem-fg)] transition-colors">
                Phòng Thí Nghiệm Ảo Tương Tác
              </span>
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[var(--chem-tint)] text-[var(--chem-fg)] border border-[var(--chem-fill)]/40">
                M10 LAB
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-tertiary)] font-medium line-clamp-1 mt-0.5">
              {isPhysics
                ? 'Lắp mạch điện, bóng đèn, điện trở & kiểm chứng Định luật Ôm I = U/R'
                : isBio
                ? 'Soi kính hiển vi 4 tiêu bản tế bào, chỉnh ốc vi cấp & đổi vật kính'
                : 'Thực hành nhỏ giọt hóa chất vào ống nghiệm: quỳ tím, kim loại, kết tủa'}
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1 text-xs font-black text-[var(--chem-fg)] group-hover:translate-x-1 transition-transform">
          <span className="hidden sm:inline">Vào Lab</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Hearts Recovery Alert if user is low on hearts */}
      {hearts < 5 && (
        <div
          className={`p-3.5 rounded-3xl border border-[var(--border)] flex items-center justify-between gap-3 ${
            hearts === 0
              ? 'bg-[var(--err-tint)] border-[var(--err-edge)]/40 text-[var(--err-fg)]'
              : 'bg-[var(--warn-tint)] border-[var(--warn-edge)]/40 text-[var(--warn-fg)]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center p-1.5 shrink-0 shadow-inner">
              <HandDrawnIcon name="heart-flask" size={26} className="animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-black text-[var(--text-primary)]">
                {hearts === 0 ? 'Bạn đã hết tim (0/5)!' : `Đang có ${hearts}/5 tim`}
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] font-medium">
                Hoàn thành 1 bài luyện tập sẽ nhận ngay <span className="font-bold text-[var(--ok-fg)]">+1 tim</span>!
              </div>
            </div>
          </div>
          <div className="shrink-0 text-xs font-black px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] flex items-center gap-1.5 shadow-sm">
            <HandDrawnIcon name="heart-flask" size={16} />
            <span>{hearts}/5</span>
          </div>
        </div>
      )}

      {/* Grade Selector (Lớp 6 | Lớp 7 | Lớp 8 | Lớp 9) */}
      <div className="space-y-1.5 bg-[var(--bg-surface)] border border-[var(--border)] p-2.5 rounded-3xl">
        <div className="flex items-center justify-between px-1 mb-1">
          <label className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider">
            Chọn khối lớp học tập:
          </label>
          <span className="text-[11px] font-bold text-[var(--subject-fg)]">
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
              className={`py-2.5 text-xs font-black rounded-2xl transition-all cursor-pointer border ${
                selectedGrade === g
                  ? 'bg-[var(--subject-fill)] text-white shadow-[0_4px_0_0_var(--subject-edge)] border-[var(--subject-edge)] scale-[1.02]'
                  : 'bg-[var(--bg-surface-2)] border-[var(--border)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
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
            <HandDrawnIcon name={isPhysics ? 'atom' : isBio ? 'dna' : 'flask'} size={20} />
            <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">
              Bài Tập Theo Từng Bài SGK {isPhysics ? 'Vật Lý' : isBio ? 'Sinh Học' : 'Hóa Học'} Lớp {selectedGrade} ({lessons.length} bài)
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-[var(--subject-fg)]">
            Chỉ mở khóa các bài bạn đã học đến
          </span>
        </div>

        {/* Chapter Filter */}
        <div className="space-y-1.5">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedChapterId('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                selectedChapterId === 'all'
                  ? 'bg-[var(--subject-tint)] text-[var(--subject-fg)] border-[var(--subject-fill)]'
                  : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]'
              }`}
            >
              Tất cả chương ({chapters.length} chương)
            </button>
            {chapters.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedChapterId(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedChapterId === c.id
                    ? 'bg-[var(--subject-tint)] text-[var(--subject-fg)] border-[var(--subject-fill)]'
                    : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]'
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
              className={`py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                selectedDiff === d.id
                  ? 'bg-[var(--subject-tint)] text-[var(--subject-fg)] border-[var(--subject-fill)]'
                  : 'bg-[var(--bg-surface-2)] border-[var(--border)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
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
                className={`p-4 rounded-3xl border transition-all ${
                  !lesson.ready
                    ? 'bg-[var(--bg-canvas)] border-[var(--border)] cursor-pointer opacity-75'
                    : isAvailable
                    ? 'bg-[var(--bg-surface)] border-[var(--border)] hover:border-[var(--subject-fill)] cursor-pointer hover:translate-y-[-1px]'
                    : 'bg-[var(--bg-canvas)] border-[var(--border)] cursor-pointer opacity-75'
                }`}
                onClick={() => {
                  if (isAvailable) {
                    const exerciseNode =
                      lesson.nodes.find((n) => n.type === 'lesson') ?? lesson.nodes[0];
                    if (exerciseNode) {
                      handleStartPractice(lesson.id, exerciseNode.id);
                    }
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
                          isAvailable ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
                        }`}
                      >
                        <MathText text={lesson.title} />
                      </span>
                      {!lesson.ready ? (
                        <span className="text-[10px] font-bold bg-[var(--bg-surface-2)] text-[var(--text-tertiary)] border border-[var(--border)] px-2 py-0.5 rounded-lg flex items-center gap-1">
                          🛠️ Sắp có
                        </span>
                      ) : status.isCompleted ? (
                        <span className="text-[10px] font-bold bg-[var(--ok-tint)] text-[var(--ok-fg)] border border-[var(--ok-edge)]/40 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[var(--ok-fg)]" /> Đã học · Luyện tập
                        </span>
                      ) : isAvailable ? (
                        <span className="text-[10px] font-bold bg-[var(--subject-tint)] text-[var(--subject-fg)] border border-[var(--subject-edge)]/40 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[var(--subject-fg)]" /> Đang học · Luyện tập
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-[var(--bg-surface-2)] text-[var(--warn-fg)] border border-[var(--warn-edge)]/40 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Lock className="w-3 h-3 text-[var(--warn-fg)]" /> Chưa mở khóa
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-medium">
                      <MathText text={lesson.subtitle} />
                    </p>

                    {!isAvailable && lesson.ready && status.requiredLessonTitle && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--warn-fg)] pt-0.5">
                        <Lock className="w-3 h-3 text-[var(--warn-fg)] inline shrink-0" />
                        <span>Cần hoàn thành "{status.requiredLessonTitle}" trên lộ trình học</span>
                        <span className="text-[var(--subject-fg)] underline flex items-center ml-1">
                          Đến học <ArrowRight className="w-3 h-3 ml-0.5 inline" />
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Action Icon */}
                  {isAvailable ? (
                    <div className="w-9 h-9 rounded-2xl bg-[var(--subject-fill)] text-white shadow-[0_2px_0_0_var(--subject-edge)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Play className="w-4 h-4 fill-white text-white" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-tertiary)] shrink-0">
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
          {/* Lab Machine Hub Banner */}
          <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[var(--phy-tint)] border border-[var(--phy-fill)]/40 flex items-center justify-center text-[var(--phy-fg)]">
                <HandDrawnIcon name="atom" size={22} />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-black text-[var(--phy-fg)] uppercase tracking-wider">
                  Máy Tạo Đề Tự Động Phòng Lab (Vật Lý)
                </h2>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Tự động sinh ngẫu nhiên số liệu bài toán: Vận tốc, KLR, Áp suất, Cơ năng, Định luật Ôm
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-[var(--phy-tint)] text-[var(--phy-fg)] border border-[var(--phy-fill)]/40 shrink-0">
              VÔ HẠN ĐỀ
            </span>
          </div>

          <div className="space-y-2.5">
            {PHYSICS_GENERATOR_TOPICS.map((gen) => {
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
                        badge: 'Chưa mở khóa',
                        description: `Dạng bài tập "${gen.title}" yêu cầu vận dụng kiến thức của ${gen.requiredLessonName}. Bạn cần học và hoàn thành bài này trên lộ trình trước nhé!`,
                        requiredLessonName: gen.requiredLessonName,
                        targetGrade,
                        actionLabel: 'ĐẾN HỌC BÀI NÀY',
                      });
                    }
                  }}
                  className={`border p-3.5 sm:p-4 rounded-3xl transition-all flex items-center justify-between group cursor-pointer ${
                    isUnlocked
                      ? 'bg-[var(--bg-surface)] border-[var(--border)] hover:border-[var(--phy-fill)] hover:translate-y-[-1px]'
                      : 'bg-[var(--bg-canvas)] border-[var(--border)] opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <div className="shrink-0 group-hover:scale-105 transition-transform">
                      <GeneratorBadge id={gen.id} size={48} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3
                          className={`text-xs sm:text-sm font-black truncate transition-colors ${
                            isUnlocked ? 'text-[var(--text-primary)] group-hover:text-[var(--phy-fg)]' : 'text-[var(--text-tertiary)]'
                          }`}
                        >
                          {gen.title}
                        </h3>
                        {isUnlocked ? (
                          <span className="text-[10px] font-bold bg-[var(--phy-tint)] text-[var(--phy-fg)] px-2 py-0.5 rounded-full border border-[var(--phy-fill)]/40 shrink-0">
                            {gen.badge}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-[var(--bg-surface-2)] text-[var(--text-tertiary)] px-2 py-0.5 rounded-full border border-[var(--border)] flex items-center gap-1 shrink-0">
                            <Lock className="w-2.5 h-2.5 text-[var(--warn-fg)]" /> Chưa mở khóa
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed truncate font-medium">
                        {gen.desc}
                      </p>
                      {!isUnlocked && gen.requiredLessonName && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--warn-fg)] pt-0.5">
                          <Lock className="w-3 h-3 text-[var(--warn-fg)] inline" />
                          <span>Mở khóa khi học đến: {gen.requiredLessonName}</span>
                          <span className="text-[var(--phy-fg)] underline flex items-center ml-1">
                            Đến học <ArrowRight className="w-3 h-3 ml-0.5 inline" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-2xl border flex items-center justify-center shrink-0 transition-transform ${
                      isUnlocked
                        ? 'bg-[var(--phy-fill)] text-white shadow-[0_2px_0_0_var(--phy-edge)] group-hover:scale-105'
                        : 'bg-[var(--bg-surface-2)] border-[var(--border)] text-[var(--text-tertiary)]'
                    }`}
                  >
                    {isUnlocked ? <Play className="w-4 h-4 fill-white" /> : <Lock className="w-4 h-4" />}
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
          {/* Lab Machine Hub Banner */}
          <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[var(--bio-tint)] border border-[var(--bio-fill)]/40 flex items-center justify-center text-[var(--bio-fg)]">
                <HandDrawnIcon name="dna" size={22} />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-black text-[var(--bio-fg)] uppercase tracking-wider">
                  Máy Tạo Đề Tự Động Phòng Lab (Sinh Học)
                </h2>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Tự động sinh ngẫu nhiên số liệu bài toán: Phép lai Mendel, DNA & Tái bản, Phân bào & NST, Calo, ABO
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-[var(--bio-tint)] text-[var(--bio-fg)] border border-[var(--bio-fill)]/40 shrink-0">
              VÔ HẠN ĐỀ
            </span>
          </div>

          <div className="space-y-2.5">
            {BIOLOGY_GENERATOR_TOPICS.map((gen) => {
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
                        badge: 'Chưa mở khóa',
                        description: `Dạng bài tập "${gen.title}" yêu cầu vận dụng kiến thức của ${gen.requiredLessonName}. Bạn cần học và hoàn thành bài này trên lộ trình trước nhé!`,
                        requiredLessonName: gen.requiredLessonName,
                        targetGrade,
                        actionLabel: 'ĐẾN HỌC BÀI NÀY',
                      });
                    }
                  }}
                  className={`border p-3.5 sm:p-4 rounded-3xl transition-all flex items-center justify-between group cursor-pointer ${
                    isUnlocked
                      ? 'bg-[var(--bg-surface)] border-[var(--border)] hover:border-[var(--bio-fill)] hover:translate-y-[-1px]'
                      : 'bg-[var(--bg-canvas)] border-[var(--border)] opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <div className="shrink-0 group-hover:scale-105 transition-transform">
                      <GeneratorBadge id={gen.id} size={48} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3
                          className={`text-xs sm:text-sm font-black truncate transition-colors ${
                            isUnlocked ? 'text-[var(--text-primary)] group-hover:text-[var(--bio-fg)]' : 'text-[var(--text-tertiary)]'
                          }`}
                        >
                          {gen.title}
                        </h3>
                        {isUnlocked ? (
                          <span className="text-[10px] font-bold bg-[var(--bio-tint)] text-[var(--bio-fg)] px-2 py-0.5 rounded-full border border-[var(--bio-fill)]/40 shrink-0">
                            {gen.badge}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-[var(--bg-surface-2)] text-[var(--text-tertiary)] px-2 py-0.5 rounded-full border border-[var(--border)] flex items-center gap-1 shrink-0">
                            <Lock className="w-2.5 h-2.5 text-[var(--warn-fg)]" /> Chưa mở khóa
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed truncate font-medium">
                        {gen.desc}
                      </p>
                      {!isUnlocked && gen.requiredLessonName && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--warn-fg)] pt-0.5">
                          <Lock className="w-3 h-3 text-[var(--warn-fg)] inline" />
                          <span>Mở khóa khi học đến: {gen.requiredLessonName}</span>
                          <span className="text-[var(--bio-fg)] underline flex items-center ml-1">
                            Đến học <ArrowRight className="w-3 h-3 ml-0.5 inline" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-2xl border flex items-center justify-center shrink-0 transition-transform ${
                      isUnlocked
                        ? 'bg-[var(--bio-fill)] text-white shadow-[0_2px_0_0_var(--bio-edge)] group-hover:scale-105'
                        : 'bg-[var(--bg-surface-2)] border-[var(--border)] text-[var(--text-tertiary)]'
                    }`}
                  >
                    {isUnlocked ? <Play className="w-4 h-4 fill-white" /> : <Lock className="w-4 h-4" />}
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
          {/* Lab Machine Hub Banner */}
          <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[var(--chem-tint)] border border-[var(--chem-fill)]/40 flex items-center justify-center text-[var(--chem-fg)]">
                <HandDrawnIcon name="flask" size={22} />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-black text-[var(--chem-fg)] uppercase tracking-wider">
                  Máy Tạo Đề Tự Động Phòng Lab (Hóa Học)
                </h2>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Tự động sinh ngẫu nhiên số liệu bài toán: Mol, Khí ĐKC 24,79L, Dung dịch & Nồng độ, PTHH
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-[var(--chem-tint)] text-[var(--chem-fg)] border border-[var(--chem-fill)]/40 shrink-0">
              VÔ HẠN ĐỀ
            </span>
          </div>

          <div className="space-y-2.5">
            {GENERATOR_TOPICS.map((gen) => {
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
                        badge: 'Chưa mở khóa',
                        description: `Dạng bài tập "${gen.title}" yêu cầu vận dụng kiến thức của ${gen.requiredLessonName}. Bạn cần học và hoàn thành bài này trên lộ trình trước nhé!`,
                        requiredLessonName: gen.requiredLessonName,
                        targetGrade: 8,
                        actionLabel: 'ĐẾN HỌC BÀI NÀY',
                      });
                    }
                  }}
                  className={`border p-3.5 sm:p-4 rounded-3xl transition-all flex items-center justify-between group cursor-pointer ${
                    isUnlocked
                      ? 'bg-[var(--bg-surface)] border-[var(--border)] hover:border-[var(--chem-fill)] hover:translate-y-[-1px]'
                      : 'bg-[var(--bg-canvas)] border-[var(--border)] opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <div className="shrink-0 group-hover:scale-105 transition-transform">
                      <GeneratorBadge id={gen.id} size={48} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3
                          className={`text-xs sm:text-sm font-black truncate transition-colors ${
                            isUnlocked ? 'text-[var(--text-primary)] group-hover:text-[var(--chem-fg)]' : 'text-[var(--text-tertiary)]'
                          }`}
                        >
                          {gen.title}
                        </h3>
                        {isUnlocked ? (
                          <span className="text-[10px] font-bold bg-[var(--chem-tint)] text-[var(--chem-fg)] px-2 py-0.5 rounded-full border border-[var(--chem-fill)]/40 shrink-0">
                            {gen.badge}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-[var(--bg-surface-2)] text-[var(--text-tertiary)] px-2 py-0.5 rounded-full border border-[var(--border)] flex items-center gap-1 shrink-0">
                            <Lock className="w-2.5 h-2.5 text-[var(--warn-fg)]" /> Chưa mở khóa
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed truncate font-medium">
                        {gen.desc}
                      </p>
                      {!isUnlocked && gen.requiredLessonName && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--warn-fg)] pt-0.5">
                          <Lock className="w-3 h-3 text-[var(--warn-fg)] inline" />
                          <span>Mở khóa khi học đến: {gen.requiredLessonName}</span>
                          <span className="text-[var(--chem-fg)] underline flex items-center ml-1">
                            Đến học <ArrowRight className="w-3 h-3 ml-0.5 inline" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-2xl border flex items-center justify-center shrink-0 transition-transform ${
                      isUnlocked
                        ? 'bg-[var(--chem-fill)] text-white shadow-[0_2px_0_0_var(--chem-edge)] group-hover:scale-105'
                        : 'bg-[var(--bg-surface-2)] border-[var(--border)] text-[var(--text-tertiary)]'
                    }`}
                  >
                    {isUnlocked ? <Play className="w-4 h-4 fill-white" /> : <Lock className="w-4 h-4" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SECTION 3: ĐẤU TRƯỜNG MINIGAMES (Tương tác & Thử thách Đa Môn) ── */}
      <div className="space-y-3 pt-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <HandDrawnIcon name="flame" size={22} />
            <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">
              Đấu Trường Mini-Games {isPhysics ? 'Vật Lý' : isBio ? 'Sinh Học' : 'Hóa Học'}
            </h2>
          </div>
          <span className="text-[11px] font-bold text-[var(--subject-fg)]">
            {activeMinigames.length} trò chơi thử thách studio
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {activeMinigames.map((game) => {
            const theme = GAME_COLOR_MAP[game.colorKey] || GAME_COLOR_MAP.emerald;
            return (
              <div
                key={game.id}
                onClick={() => {
                  sound.playClick();
                  navigate(game.route);
                }}
                className={`p-4 rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] ${theme.hoverBorder} hover:translate-y-[-1px] transition-all cursor-pointer flex items-center justify-between group`}
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border)] flex items-center justify-center shrink-0 p-1 group-hover:scale-105 transition-transform">
                    <MinigameIllustration id={game.id} size={50} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className={`text-xs sm:text-sm font-black text-[var(--text-primary)] ${theme.hoverTitle} truncate`}>
                        {game.title}
                      </h3>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder} shrink-0`}>
                        {game.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-snug line-clamp-2">
                      {game.desc}
                    </p>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-2xl ${theme.playBg} border border-[var(--border)] flex items-center justify-center shrink-0 ${theme.playShadow} group-hover:scale-105 transition-transform`}>
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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-sm rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] p-6 shadow-[var(--shadow-modal)] text-center space-y-4 z-10"
            >
              {/* Mascot */}
              <div className="flex justify-center pt-1">
                <Mascot state="thinking" size="xl" />
              </div>

              <div className="space-y-2">
                <span className="inline-block text-[11px] font-black uppercase tracking-wider text-[var(--warn-fg)] bg-[var(--warn-tint)] px-3 py-1 rounded-xl border border-[var(--warn-edge)]/40">
                  {modalInfo.badge}
                </span>
                <h3 className="text-base sm:text-lg font-black text-[var(--text-primary)]">
                  {modalInfo.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                  {modalInfo.description}
                </p>

                {modalInfo.requiredLessonName && (
                  <div className="p-3 rounded-2xl bg-[var(--warn-tint)] border border-[var(--warn-edge)]/40 text-[var(--warn-fg)] text-xs font-bold text-left space-y-0.5">
                    <span className="text-[10px] uppercase opacity-80 font-black block">
                      Điều kiện mở khóa:
                    </span>
                    <span className="flex items-center gap-1.5 pt-0.5">
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--warn-fg)] inline shrink-0" />
                      <span>Cần học xong: <strong>{modalInfo.requiredLessonName}</strong></span>
                    </span>
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
