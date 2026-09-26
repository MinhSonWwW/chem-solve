export type Grade = 6 | 7 | 8 | 9;

export interface NodeInfo {
  id: string; // e.g. "g8-b03-n01"
  nodeIndex: number;
  title: string;
  description: string;
  type: 'lesson' | 'theory' | 'checkpoint' | 'chest';
}

export interface Lesson {
  id: string; // e.g. "g8-b03"
  lessonNumber: number;
  title: string;
  subtitle: string;
  ready: boolean; // whether content JSON is available
  nodes: NodeInfo[];
}

export interface Chapter {
  id: string; // e.g. "g8-c01"
  chapterNumber: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface GradeCurriculum {
  grade: Grade;
  title: string;
  chapters: Chapter[];
}

export const CURRICULUM: Record<Grade, GradeCurriculum> = {
  6: {
    grade: 6,
    title: 'Hóa học lớp 6 (KHTN 6)',
    chapters: [
      {
        id: 'g6-c02',
        chapterNumber: 2,
        title: 'Chất quanh ta',
        description: 'Sự đa dạng của chất, các thể của chất và khí Oxygen - Không khí',
        lessons: [
          {
            id: 'g6-b09',
            lessonNumber: 9,
            title: 'Sự đa dạng của chất',
            subtitle: 'Vật thể, chất, tính chất vật lí và biến đổi hóa học',
            ready: true,
            nodes: [
              { id: 'g6-b09-theory', nodeIndex: 1, title: 'Lý thuyết: Sự đa dạng của chất', description: '2 phút ghi nhớ', type: 'theory' },
              { id: 'g6-b09-n01', nodeIndex: 2, title: 'Vật thể và chất', description: '6 câu hỏi', type: 'lesson' },
              { id: 'g6-b09-n02', nodeIndex: 3, title: 'Tính chất vật lí & hóa học', description: '6 câu hỏi', type: 'lesson' },
              { id: 'g6-b09-n03', nodeIndex: 4, title: 'Thực hành đun đường & muối', description: '6 câu hỏi', type: 'lesson' },
              { id: 'g6-b09-boss', nodeIndex: 5, title: 'Thử thách Sự đa dạng của chất', description: 'Thử thách lớn', type: 'checkpoint' },
            ],
          },
          {
            id: 'g6-b10',
            lessonNumber: 10,
            title: 'Các thể của chất và sự chuyển thể',
            subtitle: 'Rắn, lỏng, khí, mô hình hạt và các quá trình chuyển thể',
            ready: true,
            nodes: [
              { id: 'g6-b10-theory', nodeIndex: 1, title: 'Lý thuyết: Các thể của chất & Sự chuyển thể', description: '2 phút ghi nhớ', type: 'theory' },
              { id: 'g6-b10-n01', nodeIndex: 2, title: 'Ba thể của chất & Mô hình hạt', description: '6 câu hỏi', type: 'lesson' },
              { id: 'g6-b10-n02', nodeIndex: 3, title: 'Sự chuyển thể của chất', description: '6 câu hỏi', type: 'lesson' },
              { id: 'g6-b10-n03', nodeIndex: 4, title: 'Sự sôi & Các yếu tố bay hơi', description: '6 câu hỏi', type: 'lesson' },
              { id: 'g6-b10-boss', nodeIndex: 5, title: 'Thử thách Bậc thầy chuyển thể', description: 'Thử thách lớn', type: 'checkpoint' },
            ],
          },
          {
            id: 'g6-b11',
            lessonNumber: 11,
            title: 'Oxygen. Không khí',
            subtitle: 'Tính chất & vai trò của oxygen, thành phần không khí',
            ready: true,
            nodes: [
              { id: 'g6-b11-theory', nodeIndex: 1, title: 'Lý thuyết: Oxygen & Không khí', description: '2 phút ghi nhớ', type: 'theory' },
              { id: 'g6-b11-n01', nodeIndex: 2, title: 'Tính chất & vai trò của Oxygen', description: '6 câu hỏi', type: 'lesson' },
              { id: 'g6-b11-n02', nodeIndex: 3, title: 'Thành phần không khí & Thí nghiệm', description: '6 câu hỏi', type: 'lesson' },
              { id: 'g6-b11-n03', nodeIndex: 4, title: 'Ô nhiễm không khí & Hành động xanh', description: '6 câu hỏi', type: 'lesson' },
              { id: 'g6-b11-boss', nodeIndex: 5, title: 'Thử thách Người bảo vệ bầu trời', description: 'Thử thách lớn', type: 'checkpoint' },
              { id: 'g6-b11-chest', nodeIndex: 6, title: 'Rương kho báu Chất quanh ta', description: 'Phần thưởng hoàn thành', type: 'chest' },
            ],
          },
        ],
      },
    ],
  },
  7: {
    grade: 7,
    title: 'Hóa học lớp 7 (KHTN)',
    chapters: [
      {
        id: 'g7-c01',
        chapterNumber: 1,
        title: 'Nguyên tử & Bảng tuần hoàn',
        description: 'Sơ lược về hạt cấu tạo nguyên tử và bảng tuần hoàn các nguyên tố',
        lessons: [
          {
            id: 'g7-b01',
            lessonNumber: 1,
            title: 'Phương pháp & kĩ năng học tập KHTN',
            subtitle: 'Kĩ năng quan sát, thu thập dữ liệu và làm thí nghiệm',
            ready: true,
            nodes: [
              { id: 'g7-b01-theory', nodeIndex: 1, title: 'Lý thuyết: Kĩ năng học tập KHTN', description: '2 phút ghi nhớ', type: 'theory' },
              { id: 'g7-b01-n01', nodeIndex: 2, title: 'Kĩ năng quan sát thí nghiệm', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g7-b02',
            lessonNumber: 2,
            title: 'Nguyên tử',
            subtitle: 'Cấu tạo vỏ electron và hạt nhân proton, neutron',
            ready: true,
            nodes: [
              { id: 'g7-b02-theory', nodeIndex: 1, title: 'Lý thuyết: Cấu tạo nguyên tử', description: '2 phút ghi nhớ', type: 'theory' },
              { id: 'g7-b02-n01', nodeIndex: 2, title: 'Cấu tạo hạt nhân & electron', description: '6 câu hỏi', type: 'lesson' },
              { id: 'g7-b02-n02', nodeIndex: 3, title: 'Khối lượng nguyên tử (amu)', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g7-b03',
            lessonNumber: 3,
            title: 'Nguyên tố hóa học',
            subtitle: 'Kí hiệu hóa học và tên gọi quốc tế IUPAC',
            ready: true,
            nodes: [
              { id: 'g7-b03-theory', nodeIndex: 1, title: 'Lý thuyết: Nguyên tố hóa học & Kí hiệu IUPAC', description: '2 phút ghi nhớ', type: 'theory' },
              { id: 'g7-b03-n01', nodeIndex: 2, title: 'Kí hiệu hóa học nguyên tố', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g7-b04',
            lessonNumber: 4,
            title: 'Sơ lược về bảng tuần hoàn',
            subtitle: 'Ô nguyên tố, chu kì và nhóm trong bảng tuần hoàn',
            ready: true,
            nodes: [
              { id: 'g7-b04-theory', nodeIndex: 1, title: 'Lý thuyết: Bảng tuần hoàn các nguyên tố', description: '2 phút ghi nhớ', type: 'theory' },
              { id: 'g7-b04-n01', nodeIndex: 2, title: 'Cấu tạo bảng tuần hoàn', description: '6 câu hỏi', type: 'lesson' },
              { id: 'g7-b04-chest', nodeIndex: 3, title: 'Rương kiến thức Lớp 7', description: 'Phần thưởng', type: 'chest' },
            ],
          },
        ],
      },
    ],
  },
  8: {
    grade: 8,
    title: 'Hóa học lớp 8',
    chapters: [
      {
        id: 'g8-c01',
        chapterNumber: 1,
        title: 'Phản ứng hóa học & Tính toán Hóa học',
        description: 'Định luật bảo toàn khối lượng, Mol, Dung dịch và Phương trình hóa học',
        lessons: [
          {
            id: 'g8-b02',
            lessonNumber: 2,
            title: 'Phản ứng hóa học',
            subtitle: 'Hiện tượng phản ứng và sự biến đổi chất',
            ready: true,
            nodes: [
              { id: 'g8-b02-theory', nodeIndex: 1, title: 'Lý thuyết: Biến đổi chất & Dấu hiệu phản ứng', description: '2 phút ghi nhớ', type: 'theory' },
              { id: 'g8-b02-n01', nodeIndex: 2, title: 'Dấu hiệu có phản ứng xảy ra', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g8-b03',
            lessonNumber: 3,
            title: 'Mol và tỉ khối chất khí',
            subtitle: 'Khối lượng mol, thể tích khí ở ĐKC và tỉ khối khí',
            ready: true, // Content available!
            nodes: [
              { id: 'g8-b03-theory', nodeIndex: 1, title: 'Lý thuyết: Mol & Tỉ khối khí', description: '2 phút ghi nhớ', type: 'theory' },
              { id: 'g8-b03-n01', nodeIndex: 2, title: 'Mol & Thể tích khí ở ĐKC (24,79 L)', description: '6 câu hỏi cơ bản', type: 'lesson' },
              { id: 'g8-b03-n02', nodeIndex: 3, title: 'Tỉ khối của chất khí', description: '6 câu hỏi nâng cao', type: 'lesson' },
              { id: 'g8-b03-chest', nodeIndex: 4, title: 'Rương kho báu Mol', description: 'Phần thưởng XP', type: 'chest' },
            ],
          },
          {
            id: 'g8-b04',
            lessonNumber: 4,
            title: 'Dung dịch và nồng độ',
            subtitle: 'Độ tan, nồng độ phần trăm C% và nồng độ mol CM',
            ready: true,
            nodes: [
              { id: 'g8-b04-theory', nodeIndex: 1, title: 'Lý thuyết: Dung dịch, C% và CM', description: '2 phút ghi nhớ', type: 'theory' },
              { id: 'g8-b04-n01', nodeIndex: 2, title: 'Nồng độ phần trăm (C%)', description: '4 câu hỏi', type: 'lesson' },
              { id: 'g8-b04-n02', nodeIndex: 3, title: 'Nồng độ mol (CM)', description: '4 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g8-b05',
            lessonNumber: 5,
            title: 'ĐL Bảo toàn khối lượng & PTHH',
            subtitle: 'Viết và cân bằng phương trình phản ứng hóa học',
            ready: true,
            nodes: [
              { id: 'g8-b05-theory', nodeIndex: 1, title: 'Lý thuyết: ĐL Bảo toàn khối lượng & Cân bằng PTHH', description: '2 phút ghi nhớ', type: 'theory' },
              { id: 'g8-b05-n01', nodeIndex: 2, title: 'Định luật bảo toàn khối lượng', description: '5 câu hỏi', type: 'lesson' },
              { id: 'g8-b05-n02', nodeIndex: 3, title: 'Cân bằng PTHH', description: '5 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g8-b06',
            lessonNumber: 6,
            title: 'Tính theo phương trình hóa học',
            subtitle: 'Tính lượng chất phản ứng và sản phẩm theo tỉ lệ mol',
            ready: true,
            nodes: [
              { id: 'g8-b06-theory', nodeIndex: 1, title: 'Lý thuyết: 4 bước tính theo PTHH', description: '2 phút ghi nhớ', type: 'theory' },
              { id: 'g8-b06-n01', nodeIndex: 2, title: 'Tính theo PTHH cơ bản', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g8-b07',
            lessonNumber: 7,
            title: 'Tốc độ phản ứng và chất xúc tác',
            subtitle: 'Các yếu tố ảnh hưởng đến tốc độ phản ứng',
            ready: true,
            nodes: [
              { id: 'g8-b07-theory', nodeIndex: 1, title: 'Lý thuyết: Tốc độ phản ứng & Chất xúc tác', description: '2 phút ghi nhớ', type: 'theory' },
              { id: 'g8-b07-n01', nodeIndex: 2, title: 'Yếu tố ảnh hưởng tốc độ', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
        ],
      },
      {
        id: 'g8-c02',
        chapterNumber: 2,
        title: 'Một số hợp chất thông dụng',
        description: 'Acid, Base, Thang pH, Oxide, Muối và Phân bón hóa học',
        lessons: [
          {
            id: 'g8-b08',
            lessonNumber: 8,
            title: 'Acid',
            subtitle: 'Tính chất hóa học của Acid (HCl, H2SO4)',
            ready: true,
            nodes: [
              { id: 'g8-b08-theory', nodeIndex: 1, title: 'Lý thuyết: Acid & Tính chất hóa học', description: '2 phút ghi nhớ', type: 'theory' },
              { id: 'g8-b08-n01', nodeIndex: 2, title: 'Tính chất của Acid', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g8-b09',
            lessonNumber: 9,
            title: 'Base và Thang pH',
            subtitle: 'Base kiềm, base không tan và chỉ thị màu',
            ready: true,
            nodes: [
              { id: 'g8-b09-theory', nodeIndex: 1, title: 'Lý thuyết: Base & Thang pH', description: '2 phút ghi nhớ', type: 'theory' },
              { id: 'g8-b09-n01', nodeIndex: 2, title: 'Tính chất Base & pH', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g8-b10',
            lessonNumber: 10,
            title: 'Oxide',
            subtitle: 'Oxide acid, oxide base và oxide lưỡng tính',
            ready: true,
            nodes: [
              { id: 'g8-b10-theory', nodeIndex: 1, title: 'Lý thuyết: Phân loại & Tính chất Oxide', description: '2 phút ghi nhớ', type: 'theory' },
              { id: 'g8-b10-n01', nodeIndex: 2, title: 'Phân loại & Tính chất Oxide', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g8-b11',
            lessonNumber: 11,
            title: 'Muối',
            subtitle: 'Tính chất hóa học của muối và điều kiện kết tủa',
            ready: true,
            nodes: [
              { id: 'g8-b11-theory', nodeIndex: 1, title: 'Lý thuyết: Muối & Điều kiện kết tủa', description: '2 phút ghi nhớ', type: 'theory' },
              { id: 'g8-b11-n01', nodeIndex: 2, title: 'Tính chất của muối', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g8-b12',
            lessonNumber: 12,
            title: 'Phân bón hóa học',
            subtitle: 'Phân đạm (N), lân (P), kali (K) và NPK',
            ready: true,
            nodes: [
              { id: 'g8-b12-theory', nodeIndex: 1, title: 'Lý thuyết: Phân đạm, lân, kali & NPK', description: '2 phút ghi nhớ', type: 'theory' },
              { id: 'g8-b12-n01', nodeIndex: 2, title: 'Các loại phân bón phổ biến', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
        ],
      },
    ],
  },
  9: {
    grade: 9,
    title: 'Hóa học lớp 9',
    chapters: [
      {
        id: 'g9-c06',
        chapterNumber: 6,
        title: 'Kim loại & Phi kim',
        description: 'Tính chất chung của kim loại và dãy hoạt động hóa học',
        lessons: [
          {
            id: 'g9-b18',
            lessonNumber: 18,
            title: 'Tính chất chung của kim loại',
            subtitle: 'Tính dẫn điện, dẫn nhiệt và tính chất hóa học',
            ready: true,
            nodes: [
              { id: 'g9-b18-theory', nodeIndex: 1, title: 'Lý thuyết Dãy hoạt động kim loại', description: 'Quy tắc vàng & mẹo ghi nhớ', type: 'theory' },
              { id: 'g9-b18-n01', nodeIndex: 2, title: 'Tính chất vật lí & hóa học', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g9-b19',
            lessonNumber: 19,
            title: 'Dãy hoạt động hoá học',
            subtitle: 'K, Na, Ca, Mg, Al, Zn, Fe, Pb, H, Cu, Ag, Au',
            ready: true,
            nodes: [
              { id: 'g9-b19-theory', nodeIndex: 1, title: 'Lý thuyết Dãy hoạt động hóa học', description: '4 quy tắc vàng & mẹo nhớ', type: 'theory' },
              { id: 'g9-b19-n01', nodeIndex: 2, title: 'Ý nghĩa dãy hoạt động', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g9-b20',
            lessonNumber: 20,
            title: 'Tách kim loại & Hợp kim',
            subtitle: 'Luyện gang thép và phương pháp nhiệt luyện',
            ready: true,
            nodes: [
              { id: 'g9-b20-theory', nodeIndex: 1, title: 'Lý thuyết Tách kim loại & Hợp kim', description: 'Nhiệt luyện, thủy luyện, điện phân', type: 'theory' },
              { id: 'g9-b20-n01', nodeIndex: 2, title: 'Phương pháp tách kim loại', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g9-b21',
            lessonNumber: 21,
            title: 'Khác nhau giữa phi kim và kim loại',
            subtitle: 'So sánh cấu tạo, tính chất và ứng dụng',
            ready: true,
            nodes: [
              { id: 'g9-b21-theory', nodeIndex: 1, title: 'Lý thuyết So sánh Kim loại & Phi kim', description: 'Đặc trưng cấu tạo & tính chất', type: 'theory' },
              { id: 'g9-b21-n01', nodeIndex: 2, title: 'So sánh kim loại & phi kim', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
        ],
      },
      {
        id: 'g9-c07',
        chapterNumber: 7,
        title: 'Hợp chất hữu cơ & Hydrocarbon',
        description: 'Alkane, Alkene và nguồn nhiên liệu',
        lessons: [
          {
            id: 'g9-b22',
            lessonNumber: 22,
            title: 'Giới thiệu hợp chất hữu cơ',
            subtitle: 'Khái niệm, công thức cấu tạo phân tử',
            ready: true,
            nodes: [
              { id: 'g9-b22-theory', nodeIndex: 1, title: 'Lý thuyết Hợp chất hữu cơ', description: 'Khái niệm & liên kết hóa trị', type: 'theory' },
              { id: 'g9-b22-n01', nodeIndex: 2, title: 'Phân loại hợp chất hữu cơ', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g9-b23',
            lessonNumber: 23,
            title: 'Alkane (Methane)',
            subtitle: 'Cấu tạo và phản ứng cháy của CH4',
            ready: true,
            nodes: [
              { id: 'g9-b23-theory', nodeIndex: 1, title: 'Lý thuyết Alkane & Methane', description: 'Cấu tạo phân tử & phản ứng thế', type: 'theory' },
              { id: 'g9-b23-n01', nodeIndex: 2, title: 'Tính chất Methane', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g9-b24',
            lessonNumber: 24,
            title: 'Alkene (Ethylene)',
            subtitle: 'Liên kết đôi C=C và phản ứng trùng hợp',
            ready: true,
            nodes: [
              { id: 'g9-b24-theory', nodeIndex: 1, title: 'Lý thuyết Alkene & Ethylene', description: 'Liên kết đôi & phản ứng cộng', type: 'theory' },
              { id: 'g9-b24-n01', nodeIndex: 2, title: 'Tính chất Ethylene', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g9-b25',
            lessonNumber: 25,
            title: 'Nguồn nhiên liệu',
            subtitle: 'Dầu mỏ, khí thiên nhiên và than mỏ',
            ready: true,
            nodes: [
              { id: 'g9-b25-theory', nodeIndex: 1, title: 'Lý thuyết Nguồn nhiên liệu', description: 'Dầu mỏ, khí đốt & năng lượng sạch', type: 'theory' },
              { id: 'g9-b25-n01', nodeIndex: 2, title: 'Khai thác nhiên liệu', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
        ],
      },
      {
        id: 'g9-c08',
        chapterNumber: 8,
        title: 'Ethylic alcohol & Acetic acid',
        description: 'Rượu etylic và Axit axetic',
        lessons: [
          {
            id: 'g9-b26',
            lessonNumber: 26,
            title: 'Ethylic alcohol',
            subtitle: 'C2H5OH, độ rượu và phản ứng este hóa',
            ready: true,
            nodes: [
              { id: 'g9-b26-theory', nodeIndex: 1, title: 'Lý thuyết Ethylic alcohol', description: 'Cấu tạo nhóm -OH & độ rượu', type: 'theory' },
              { id: 'g9-b26-n01', nodeIndex: 2, title: 'Tính chất Rượu etylic', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g9-b27',
            lessonNumber: 27,
            title: 'Acetic acid',
            subtitle: 'CH3COOH, tính axit và phản ứng với kim loại',
            ready: true,
            nodes: [
              { id: 'g9-b27-theory', nodeIndex: 1, title: 'Lý thuyết Acetic acid', description: 'Nhóm -COOH & phản ứng ester hóa', type: 'theory' },
              { id: 'g9-b27-n01', nodeIndex: 2, title: 'Tính chất Axit axetic', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
        ],
      },
      {
        id: 'g9-c09',
        chapterNumber: 9,
        title: 'Hợp chất thiên nhiên & Polymer',
        description: 'Lipid, Carbohydrate, Protein và Polymer',
        lessons: [
          {
            id: 'g9-b28',
            lessonNumber: 28,
            title: 'Lipid (Chất béo)',
            subtitle: 'Thành phần và phản ứng xà phòng hóa',
            ready: true,
            nodes: [
              { id: 'g9-b28-theory', nodeIndex: 1, title: 'Lý thuyết Lipid & Chất béo', description: 'Ester của glycerol & xà phòng hóa', type: 'theory' },
              { id: 'g9-b28-n01', nodeIndex: 2, title: 'Cấu tạo & Tính chất chất béo', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g9-b29',
            lessonNumber: 29,
            title: 'Glucose & Saccharose',
            subtitle: 'Đường đơn và đường đôi',
            ready: true,
            nodes: [
              { id: 'g9-b29-theory', nodeIndex: 1, title: 'Lý thuyết Glucose & Saccharose', description: 'Đường đơn, đường đôi & tráng bạc', type: 'theory' },
              { id: 'g9-b29-n01', nodeIndex: 2, title: 'Nhận biết Glucose', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g9-b30',
            lessonNumber: 30,
            title: 'Tinh bột và Cellulose',
            subtitle: 'Quang hợp và phản ứng thủy phân',
            ready: true,
            nodes: [
              { id: 'g9-b30-theory', nodeIndex: 1, title: 'Lý thuyết Tinh bột & Cellulose', description: 'Polymer tự nhiên & nhận biết Iot', type: 'theory' },
              { id: 'g9-b30-n01', nodeIndex: 2, title: 'Tính chất tinh bột', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g9-b31',
            lessonNumber: 31,
            title: 'Protein',
            subtitle: 'Thành phần amino acid và sự đông tụ',
            ready: true,
            nodes: [
              { id: 'g9-b31-theory', nodeIndex: 1, title: 'Lý thuyết Protein', description: 'Liên kết peptide & sự đông tụ', type: 'theory' },
              { id: 'g9-b31-n01', nodeIndex: 2, title: 'Cấu trúc & vai trò protein', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g9-b32',
            lessonNumber: 32,
            title: 'Polymer',
            subtitle: 'Chất dẻo, tơ sợi và cao su',
            ready: true,
            nodes: [
              { id: 'g9-b32-theory', nodeIndex: 1, title: 'Lý thuyết Polymer', description: 'Chất dẻo, tơ sợi & cao su', type: 'theory' },
              { id: 'g9-b32-n01', nodeIndex: 2, title: 'Khái niệm & Ứng dụng polymer', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
        ],
      },
      {
        id: 'g9-c10',
        chapterNumber: 10,
        title: 'Tài nguyên từ vỏ Trái Đất',
        description: 'Khai thác đá vôi, công nghiệp silicate và chu trình carbon',
        lessons: [
          {
            id: 'g9-b33',
            lessonNumber: 33,
            title: 'Hóa học vỏ Trái Đất',
            subtitle: 'Thành phần khoáng vật và kim loại',
            ready: true,
            nodes: [
              { id: 'g9-b33-theory', nodeIndex: 1, title: 'Lý thuyết Vỏ Trái Đất', description: 'Khoáng sản & hàm lượng nguyên tố', type: 'theory' },
              { id: 'g9-b33-n01', nodeIndex: 2, title: 'Khoáng sản & Tài nguyên', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g9-b34',
            lessonNumber: 34,
            title: 'Khai thác đá vôi & Silicate',
            subtitle: 'Sản xuất vôi sống (CaO), xi măng, thủy tinh',
            ready: true,
            nodes: [
              { id: 'g9-b34-theory', nodeIndex: 1, title: 'Lý thuyết Khai thác đá vôi & Silicate', description: 'Nung vôi, tôi vôi, xi măng, thủy tinh', type: 'theory' },
              { id: 'g9-b34-n01', nodeIndex: 2, title: 'Nung vôi & Sản xuất xi măng', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
          {
            id: 'g9-b35',
            lessonNumber: 35,
            title: 'Chu trình Carbon & Môi trường',
            subtitle: 'Nhiên liệu hóa thạch và hiệu ứng nhà kính',
            ready: true,
            nodes: [
              { id: 'g9-b35-theory', nodeIndex: 1, title: 'Lý thuyết Chu trình Carbon & Môi trường', description: 'Hiệu ứng nhà kính & giải pháp xanh', type: 'theory' },
              { id: 'g9-b35-n01', nodeIndex: 2, title: 'Hiệu ứng nhà kính & bảo vệ môi trường', description: '6 câu hỏi', type: 'lesson' },
            ],
          },
        ],
      },
    ],
  },
};

/** Helpers */
export function getCurriculum(grade: Grade): GradeCurriculum {
  return CURRICULUM[grade] ?? CURRICULUM[8];
}

export function getAllLessons(grade?: Grade): Lesson[] {
  if (grade) {
    return CURRICULUM[grade].chapters.flatMap((c) => c.lessons);
  }
  return Object.values(CURRICULUM).flatMap((gc) =>
    gc.chapters.flatMap((c) => c.lessons)
  );
}

export function findLesson(lessonId: string): Lesson | undefined {
  return getAllLessons().find((l) => l.id === lessonId);
}
