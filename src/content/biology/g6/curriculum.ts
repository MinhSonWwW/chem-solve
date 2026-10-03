import type { GradeCurriculum } from '../../curriculum/types';

export const GRADE_6_BIOLOGY_CURRICULUM: GradeCurriculum = {
  grade: 6,
  title: 'Sinh học lớp 6 (Khoa học tự nhiên 6 - Kết nối tri thức)',
  chapters: [
    {
      id: 'bio-g6-c00',
      chapterNumber: 0,
      title: 'Unit 0 — Kỹ năng quan sát sinh học',
      description: 'Phương tiện quang học quan sát vi mô: Kính lúp và Kính hiển vi quang học (Chương 1 SGK)',
      lessons: [
        {
          id: 'bio-g6-b01',
          lessonNumber: 1,
          title: 'Sử dụng kính lúp',
          subtitle: 'Bài 3 SGK: Cấu tạo kính lúp cầm tay, quy tắc quan sát gân lá, râu và vảy côn trùng',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b01-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Sử dụng kính lúp',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b01-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Sử dụng kính lúp',
              description: '6 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g6-b02',
          lessonNumber: 2,
          title: 'Sử dụng kính hiển vi quang học',
          subtitle: 'Bài 4 SGK: Cấu tạo hệ thống phóng đại, ốc to/nhỏ và các bước lấy nét tiêu bản',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b02-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Kính hiển vi quang học',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b02-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Kính hiển vi quang học',
              description: '6 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. Kính lúp:',
            text: 'Phóng đại 3x – 20x. Mặt kính là thấu kính hội tụ bẻ cong ánh sáng.'
          },
          {
            label: '2. Độ phóng đại kính hiển vi:',
            text: 'Độ phóng đại tổng = Độ phóng đại thị kính × Độ phóng đại vật kính'
          },
          {
            label: '3. Ví dụ tính:',
            text: 'Thị kính 10x × Vật kính 40x = 400 lần'
          },
          {
            label: '4. Hệ thống điều chỉnh:',
            text: 'Ốc to (chỉnh thô di chuyển nhanh) → Ốc nhỏ (chỉnh tinh vi cấp lấy nét sắc)'
          }
        ],
        traps: [
          'Nhầm lẫn giữa phạm vi của kính lúp (gân lá, côn trùng, vân tay) và kính hiển vi (tế bào, vi khuẩn).',
          'Khi nâng bàn kính bằng ốc to, mắt PHẢI nhìn ngang bên ngoài để tránh vật kính đè vỡ lam kính tiêu bản.',
          'Lau thấu kính bằng vải thô hoặc giấy vệ sinh làm xước mặt kính (phải dùng giấy lau thấu kính chuyên dụng).',
          'Tính độ phóng đại kính hiển vi làm phép cộng thay vì phép nhân (10 + 40 = 50 lần là sai, phải là 10 × 40 = 400 lần).'
        ]
      },
    },
    {
      id: 'bio-g6-c01',
      chapterNumber: 1,
      title: 'Unit 1 — Tế bào: Đơn vị cơ bản của sự sống',
      description: 'Hình dạng, kích thước, cấu tạo, chức năng và sự lớn lên, phân chia tế bào (Chương 5 SGK)',
      lessons: [
        {
          id: 'bio-g6-b03',
          lessonNumber: 3,
          title: 'Tế bào – Đơn vị cơ bản của sự sống',
          subtitle: 'Bài 18 SGK: Khái niệm tế bào, thang kích thước hiển vi vs vĩ mô và hình dạng tế bào',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b03-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Tế bào – Đơn vị sự sống',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b03-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Tế bào – Đơn vị sự sống',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g6-b04',
          lessonNumber: 4,
          title: 'Cấu tạo và chức năng các thành phần của tế bào',
          subtitle: 'Bài 19 SGK: Màng tế bào, chất tế bào, nhân; nhân sơ vs nhân thực; TB thực vật vs động vật',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b04-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Cấu tạo tế bào',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b04-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Cấu tạo tế bào',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g6-b05',
          lessonNumber: 5,
          title: 'Sự lớn lên và sinh sản của tế bào',
          subtitle: 'Bài 20 SGK: Quá trình phân chia 1 thành 2, công thức 2^n và ý nghĩa với sinh trưởng cơ thể',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b05-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Sự lớn lên & sinh sản tế bào',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b05-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Lớn lên & phân chia tế bào',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g6-b06',
          lessonNumber: 6,
          title: 'Thực hành: Quan sát và phân biệt một số loại tế bào',
          subtitle: 'Bài 21 SGK: Kỹ thuật làm tiêu bản tế bào biểu bì vảy hành và tế bào thịt quả cà chua chín',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b06-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Thực hành quan sát tế bào',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b06-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Tiêu bản vảy hành & cà chua',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. 3 thành phần chính:',
            text: 'Màng sinh chất (kiểm soát ra vào) — Chất tế bào (trao đổi chất) — Nhân/Vùng nhân (chứa DNA điều khiển)'
          },
          {
            label: '2. Nhân sơ vs Nhân thực:',
            text: 'Nhân sơ: chưa có màng nhân (vi khuẩn); Nhân thực: đã có màng nhân hoàn chỉnh (thực vật, động vật, nấm)'
          },
          {
            label: '3. Tế bào thực vật có thêm:',
            text: 'Thành tế bào (cellulose bảo vệ), Lục lạp (quang hợp), Không bào trung tâm lớn'
          },
          {
            label: '4. Công thức phân chia tế bào:',
            text: 'Từ 1 tế bào sau n lần phân chia: N = 2^n (tổng quát: N = a × 2^n)'
          }
        ],
        traps: [
          'Tế bào nhân sơ vẫn có màng sinh chất và DNA (chỉ thiếu màng bao bọc nhân).',
          'Tế bào động vật KHÔNG có thành tế bào cellulose và KHÔNG có lục lạp.',
          'Khi phân chia: Nhân tế bào phân chia trước, chất tế bào phân chia sau.',
          'Tế bào non bắt buộc phải lớn lên đạt kích thước tối đa mới tiến hành phân chia.',
          'Khi đậy lamen phải hạ nghiêng 45° từ từ để không bị bọt khí viền đen che khuất tế bào.'
        ]
      },
    },
    {
      id: 'bio-g6-c02',
      chapterNumber: 2,
      title: 'Unit 2 — Từ tế bào đến cơ thể',
      description: 'Sinh vật đơn bào, đa bào và các cấp độ tổ chức sống: Tế bào → Mô → Cơ quan → Hệ cơ quan (Chương 6 SGK)',
      lessons: [
        {
          id: 'bio-g6-b07',
          lessonNumber: 7,
          title: 'Cơ thể sinh vật',
          subtitle: 'Bài 22 SGK: Các dấu hiệu của sự sống; Phân biệt sinh vật đơn bào và sinh vật đa bào',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b07-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Cơ thể sinh vật',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b07-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Cơ thể sinh vật',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g6-b08',
          lessonNumber: 8,
          title: 'Tổ chức cơ thể đa bào',
          subtitle: 'Bài 23 SGK: 5 cấp độ tổ chức sống; Các loại mô, cơ quan và hệ cơ quan ở động vật và thực vật',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b08-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Tổ chức cơ thể đa bào',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b08-n01',
              nodeIndex: 2,
              title: 'Luyện tập: 5 cấp độ tổ chức sống',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g6-b09',
          lessonNumber: 9,
          title: 'Thực hành: Quan sát và mô tả cơ thể đơn bào, cơ thể đa bào',
          subtitle: 'Bài 24 SGK: Quan sát trùng roi/trùng giày trong nước ao hồ và mô hình các hệ cơ quan',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b09-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Thực hành đơn bào & đa bào',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b09-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Quan sát cơ thể đơn bào',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. 6 quá trình sống:',
            text: 'Cảm ứng, Dinh dưỡng, Hô hấp, Bài tiết, Sinh trưởng & phát triển, Sinh sản'
          },
          {
            label: '2. 5 cấp độ tổ chức sống:',
            text: 'Tế bào → Mô → Cơ quan → Hệ cơ quan → Cơ thể'
          },
          {
            label: '3. Cơ quan thực vật:',
            text: 'Cơ quan sinh dưỡng (Rễ, Thân, Lá) & Cơ quan sinh sản (Hoa, Quả, Hạt)'
          },
          {
            label: '4. Sinh vật đơn bào tiêu biểu:',
            text: 'Trùng roi xanh (roi bơi, mắt đỏ), Trùng giày (lông bơi), Vi khuẩn E. coli, Tảo lục'
          }
        ],
        traps: [
          'Tế bào hồng cầu không phải là sinh vật đơn bào (nó là tế bào chuyên hóa thuộc mô máu).',
          'Thứ tự tổ chức: Mô nhỏ hơn Cơ quan (nhiều tế bào tạo mô, nhiều mô tạo cơ quan).',
          'Quả và hoa là cơ quan sinh sản của thực vật (rễ, thân, lá mới là cơ quan sinh dưỡng).',
          'Khi quan sát trùng giày trong nước rơm, đặt vài sợi bông gòn để hãm tốc độ bơi của chúng.'
        ]
      },
    },
    {
      id: 'bio-g6-c03',
      chapterNumber: 3,
      title: 'Unit 3 — Đa dạng thế giới sống: Vi sinh vật & Nấm',
      description: 'Phân loại học, Khóa lưỡng phân, Vi khuẩn, Virus, Nguyên sinh vật và Giới Nấm (Chương 7 SGK - Nhánh 1)',
      lessons: [
        {
          id: 'bio-g6-b10',
          lessonNumber: 10,
          title: 'Hệ thống phân loại sinh vật',
          subtitle: 'Bài 25 SGK: 7 bậc phân loại, hệ thống 5 giới (Whittaker) và cách gọi tên khoa học của loài',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b10-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Hệ thống phân loại sinh vật',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b10-n01',
              nodeIndex: 2,
              title: 'Luyện tập: 7 bậc phân loại & 5 giới',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g6-b11',
          lessonNumber: 11,
          title: 'Khóa lưỡng phân',
          subtitle: 'Bài 26 SGK: Nguyên tắc xây dựng khóa lưỡng phân dựa trên cặp đặc điểm đối lập',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b11-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Khóa lưỡng phân',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b11-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Xây dựng khóa lưỡng phân',
              description: '6 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g6-b12',
          lessonNumber: 12,
          title: 'Vi khuẩn',
          subtitle: 'Bài 27 SGK: Cấu tạo nhân sơ, hình thái, vai trò có ích (lên men, phân giải) và phòng chống bệnh',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b12-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Vi khuẩn',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b12-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Vi khuẩn',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g6-b13',
          lessonNumber: 13,
          title: 'Thực hành: Làm sữa chua và quan sát vi khuẩn',
          subtitle: 'Bài 28 SGK: Quy trình lên men lactic, điều kiện nhiệt độ ủ ấm và quan sát vi khuẩn lactic',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b13-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Thực hành làm sữa chua',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b13-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Lên men sữa chua',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g6-b14',
          lessonNumber: 14,
          title: 'Virus',
          subtitle: 'Bài 29 SGK: Kích thước siêu vi, chưa có cấu tạo tế bào, ký sinh nội bào bắt buộc và tiêm phòng vaccine',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b14-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Virus',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b14-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Virus',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g6-b15',
          lessonNumber: 15,
          title: 'Nguyên sinh vật',
          subtitle: 'Bài 30 SGK: Trùng roi, trùng giày, trùng biến hình; Trùng sốt rét và trùng kiết lị gây bệnh',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b15-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Nguyên sinh vật',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b15-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Nguyên sinh vật',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g6-b16',
          lessonNumber: 16,
          title: 'Thực hành: Quan sát nguyên sinh vật',
          subtitle: 'Bài 31 SGK: Tiêu bản giọt nước ao hồ, rơm rạ mục và nhận diện chuyển động của trùng giày, trùng roi',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b16-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Quan sát nguyên sinh vật',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b16-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Tiêu bản nước ao hồ',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g6-b17',
          lessonNumber: 17,
          title: 'Nấm',
          subtitle: 'Bài 32 SGK: Cấu tạo nấm sợi, nấm lớn; Nấm ăn được, nấm độc và các bệnh nấm da ở người',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b17-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Giới Nấm',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b17-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Giới Nấm',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g6-b18',
          lessonNumber: 18,
          title: 'Thực hành: Quan sát các loại nấm',
          subtitle: 'Bài 33 SGK: Mốc bánh mì, cấu tạo nấm rơm (mũ, phiến, cuống, bao gốc) và nhận biết nấm độc',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b18-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Thực hành quan sát nấm',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b18-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Cấu tạo nấm rơm & mốc',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. 7 bậc phân loại:',
            text: 'Loài → Chi (giống) → Họ → Bộ → Lớp → Ngành → Giới'
          },
          {
            label: '2. Hệ thống 5 giới (Whittaker):',
            text: 'Khởi sinh (vi khuẩn) · Nguyên sinh (trùng roi, tảo) · Nấm · Thực vật · Động vật'
          },
          {
            label: '3. Tên khoa học của loài:',
            text: 'Tên Chi (viết hoa) + Tên Loài (viết thường), in nghiêng (ví dụ: Homo sapiens)'
          },
          {
            label: '4. Cấu tạo nấm thể quả:',
            text: 'Mũ nấm → Phiến nấm (chứa bào tử) → Vòng cuống → Cuống nấm → Bao gốc nấm'
          }
        ],
        traps: [
          'Virus chưa có cấu tạo tế bào (chỉ gồm vỏ protein và lõi DNA/RNA) và kháng sinh KHÔNG diệt được virus.',
          'Nấm không phải thực vật: Nấm dị dưỡng hoàn toàn, không có diệp lục và không quang hợp được.',
          'Muỗi cái Anopheles truyền trùng sốt rét, còn muỗi vằn Aedes truyền virus sốt xuất huyết.',
          'Nấm rừng cực độc thường có cả vòng cuống ở thân và bao gốc phình to hình chén.'
        ]
      },
    },
    {
      id: 'bio-g6-c04',
      chapterNumber: 4,
      title: 'Unit 4 — Đa dạng thế giới sống: Thực vật, Động vật & Bảo tồn',
      description: '4 ngành thực vật, Động vật không xương sống, Động vật có xương sống và Bảo tồn đa dạng sinh học (Chương 7 SGK - Nhánh 2)',
      lessons: [
        {
          id: 'bio-g6-b19',
          lessonNumber: 19,
          title: 'Thực vật',
          subtitle: 'Bài 34 SGK: 4 nhóm thực vật (Rêu, Dương xỉ, Hạt trần, Hạt kín), mạch dẫn, hoa, quả và vai trò',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b19-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Giới Thực vật',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b19-n01',
              nodeIndex: 2,
              title: 'Luyện tập: 4 nhóm thực vật',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g6-b20',
          lessonNumber: 20,
          title: 'Thực hành: Quan sát và phân biệt một số nhóm thực vật',
          subtitle: 'Bài 35 SGK: Quan sát cây rêu, cây dương xỉ, nón thông hạt trần và cây có hoa hạt kín',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b20-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Thực hành phân biệt thực vật',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b20-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Nhận biết rêu, dương xỉ, thông',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g6-b21',
          lessonNumber: 21,
          title: 'Động vật',
          subtitle: 'Bài 36 SGK: Động vật không xương sống (ruột khoang, giun, thân mềm, chân khớp) & Động vật có xương sống (cá, lưỡng cư, bò sát, chim, thú)',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b21-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Giới Động vật',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b21-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Giới Động vật',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g6-b22',
          lessonNumber: 22,
          title: 'Thực hành: Quan sát và nhận biết một số nhóm động vật ngoài thiên nhiên',
          subtitle: 'Bài 37 SGK: Nhận biết môi trường sống, đặc điểm nhận dạng động vật quanh vườn trường',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b22-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Thực hành nhận biết động vật',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b22-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Động vật ngoài thiên nhiên',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g6-b23',
          lessonNumber: 23,
          title: 'Đa dạng sinh học',
          subtitle: 'Bài 38 SGK: Vai trò đa dạng sinh học, nguyên nhân suy giảm và các biện pháp bảo vệ Sách Đỏ',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b23-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Đa dạng sinh học',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b23-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Bảo vệ đa dạng sinh học',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g6-b24',
          lessonNumber: 24,
          title: 'Tìm hiểu sinh vật ngoài thiên nhiên',
          subtitle: 'Bài 39 SGK: Kỹ năng điều tra thực địa, lập danh lục sinh vật và báo cáo thu hoạch',
          ready: true,
          nodes: [
            {
              id: 'bio-g6-b24-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Tìm hiểu sinh vật thực địa',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g6-b24-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Báo cáo tìm hiểu thiên nhiên',
              description: '6 câu hỏi kiểm tra',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. 4 ngành thực vật tiến hóa:',
            text: 'Rêu (chưa mạch) → Dương xỉ (có mạch, bào tử) → Hạt trần (nón hở) → Hạt kín (hoa, quả)'
          },
          {
            label: '2. 5 lớp động vật có xương sống:',
            text: 'Lớp Cá → Lớp Lưỡng cư → Lớp Bò sát → Lớp Chim → Lớp Thú'
          },
          {
            label: '3. Thân nhiệt động vật:',
            text: 'Biến nhiệt: Cá, Lưỡng cư, Bò sát · Đẳng nhiệt: Chim, Thú'
          },
          {
            label: '4. Khẩu hiệu thực địa:',
            text: '"Không lấy gì ngoài những bức ảnh, không để lại gì ngoài những dấu chân"'
          }
        ],
        traps: [
          'Cây thông là Hạt trần: Hạt nằm lộ trên lá noãn hở của nón cái, thông KHÔNG có hoa và quả thật sự.',
          'Cá voi, cá heo thuộc Lớp Thú (đẻ con, nuôi con bằng sữa mẹ, thở bằng phổi), KHÔNG phải Lớp Cá.',
          'Chân khớp là nhóm động vật đông đúc nhất sinh giới (chiếm hơn 2/3 tổng số loài động vật).',
          'Sách Đỏ nhằm mục đích cảnh báo và bảo vệ các loài quý hiếm có nguy cơ tuyệt chủng.'
        ]
      },
    },
  ],
};
