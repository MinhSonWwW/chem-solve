import type { GradeCurriculum } from '../../curriculum/types';

export const GRADE_7_BIOLOGY_CURRICULUM: GradeCurriculum = {
  grade: 7,
  title: 'Sinh học lớp 7 (Khoa học tự nhiên 7 - Kết nối tri thức)',
  chapters: [
    {
      id: 'bio-g7-c01',
      chapterNumber: 1,
      title: 'Unit 1 — Trao đổi chất, Quang hợp & Hô hấp tế bào',
      description: 'Khái quát trao đổi chất, cơ chế quang hợp và hô hấp tế bào ở thực vật (Chương 7 SGK - Phần 1)',
      lessons: [
        {
          id: 'bio-g7-b01',
          lessonNumber: 1,
          title: 'Khái quát về trao đổi chất và chuyển hóa năng lượng',
          subtitle: 'Bài 21 SGK: Khái niệm, vai trò và mối quan hệ giữa trao đổi chất và chuyển hóa năng lượng',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b01-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Trao đổi chất & Chuyển hóa năng lượng',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b01-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Trao đổi chất & Chuyển hóa năng lượng',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g7-b02',
          lessonNumber: 2,
          title: 'Quang hợp ở thực vật',
          subtitle: 'Bài 22 SGK: Khái niệm, phương trình chữ, vai trò của lục lạp và cấu tạo lá phù hợp quang hợp',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b02-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Quang hợp ở thực vật',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b02-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Cơ chế quang hợp & Cấu tạo lá',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g7-b03',
          lessonNumber: 3,
          title: 'Một số yếu tố ảnh hưởng đến quang hợp',
          subtitle: 'Bài 23 SGK: Ảnh hưởng của ánh sáng, nước, CO2, nhiệt độ và ứng dụng trong trồng trọt',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b03-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Các yếu tố ảnh hưởng quang hợp',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b03-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Các yếu tố & Ứng dụng trồng trọt',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g7-b04',
          lessonNumber: 4,
          title: 'Thực hành: Chứng minh quang hợp ở cây xanh',
          subtitle: 'Bài 24 SGK: Thí nghiệm chứng minh tinh bột và giải phóng khí oxygen trong quang hợp',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b04-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Thí nghiệm chứng minh quang hợp',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b04-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Quy trình & Hiện tượng thí nghiệm',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g7-b05',
          lessonNumber: 5,
          title: 'Hô hấp tế bào',
          subtitle: 'Bài 25 SGK: Khái niệm, phương trình chữ hô hấp tế bào, vai trò ty thể và quan hệ với quang hợp',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b05-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Hô hấp tế bào & Vai trò ty thể',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b05-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Phương trình hô hấp & So sánh quang hợp',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g7-b06',
          lessonNumber: 6,
          title: 'Một số yếu tố ảnh hưởng đến hô hấp tế bào',
          subtitle: 'Bài 26 SGK: Ảnh hưởng của nhiệt độ, nước, O2, CO2 và ứng dụng bảo quản nông sản',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b06-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Yếu tố ảnh hưởng hô hấp & Bảo quản',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b06-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Yếu tố môi trường & Kĩ thuật bảo quản',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g7-b07',
          lessonNumber: 7,
          title: 'Thực hành: Hô hấp ở thực vật',
          subtitle: 'Bài 27 SGK: Thí nghiệm chứng minh hô hấp hút oxygen, thải carbon dioxide và tỏa nhiệt',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b07-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Thí nghiệm hô hấp ở hạt nảy mầm',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b07-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Quy trình thí nghiệm & Giải thích hiện tượng',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. Phương trình chữ của Quang hợp:',
            text: 'Nước + Carbon dioxide —(Ánh sáng / Diệp lục)→ Glucose + Oxygen',
          },
          {
            label: '2. Phương trình chữ của Hô hấp tế bào:',
            text: 'Glucose + Oxygen → Carbon dioxide + Nước + Năng lượng (ATP + Nhiệt)',
          },
          {
            label: '3. Bào quan chuyển hóa năng lượng:',
            text: 'Lục lạp (Quang năng → Hóa năng hữu cơ) ↔ Ty thể (Hóa năng hữu cơ → ATP hoạt dụng)',
          },
          {
            label: '4. Thuốc thử tinh bột:',
            text: 'Dung dịch Iodine (màu vàng nâu) + Tinh bột → Màu xanh tím đặc trưng',
          },
        ],
        traps: [
          'Nhầm lẫn cho rằng "ban ngày cây chỉ quang hợp, ban đêm mới hô hấp" (Thực tế: Cây hô hấp liên tục suốt ngày đêm để duy trì sự sống).',
          'Quên tẩy sạch diệp lục trong cồn đun cách thủy trước khi thử Iodine (nếu không tẩy màu xanh lá, màu xanh tím của tinh bột sẽ bị che lấp).',
          'Nhầm que đóm tàn đỏ thử khí O2 (bùng cháy sáng) với que diêm đưa vào bình hạt nảy mầm hô hấp (bị dập tắt do cạn O2 và thừa CO2).',
          'Bảo quản nông sản: Phải ức chế hô hấp xuống mức tối thiểu (sấy khô hạt, hạ nhiệt độ mát rau quả), nhưng không để đóng băng làm vỡ tế bào.',
        ],
      },
    },
    {
      id: 'bio-g7-c02',
      chapterNumber: 2,
      title: 'Unit 2 — Trao đổi khí, Nước & Dinh dưỡng ở sinh vật',
      description: 'Trao đổi khí qua khí khổng/cơ quan hô hấp, hấp thụ vận chuyển nước và tiêu hóa (Chương 7 SGK - Phần 2)',
      lessons: [
        {
          id: 'bio-g7-b08',
          lessonNumber: 8,
          title: 'Trao đổi khí ở sinh vật',
          subtitle: 'Bài 28 SGK: Cơ chế khuếch tán khí, trao đổi khí qua khí khổng và 4 bề mặt hô hấp ở động vật',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b08-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Trao đổi khí ở thực vật & động vật',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b08-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Cơ chế khí khổng & Các bề mặt hô hấp',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g7-b09',
          lessonNumber: 9,
          title: 'Vai trò của nước và chất dinh dưỡng đối với sinh vật',
          subtitle: 'Bài 29 SGK: Tỉ lệ nước trong cơ thể (70-90%), vai trò dung môi, chuyển hóa và điều hòa nhiệt',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b09-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Vai trò của nước & Chất dinh dưỡng',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b09-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Nhu cầu nước & Các nhóm chất dinh dưỡng',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g7-b10',
          lessonNumber: 10,
          title: 'Trao đổi nước và chất dinh dưỡng ở thực vật',
          subtitle: 'Bài 30 SGK: Lông hút rễ, dòng mạch gỗ (xylem), dòng mạch rây (phloem) và thoát hơi nước',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b10-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Con đường nước & Khoáng trong cây',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b10-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Mạch gỗ, Mạch rây & Thoát hơi nước',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g7-b11',
          lessonNumber: 11,
          title: 'Trao đổi nước và chất dinh dưỡng ở động vật',
          subtitle: 'Bài 31 SGK: Con đường tiêu hóa, hệ tuần hoàn vận chuyển chất, bài tiết và cân bằng nước',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b11-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Tiêu hóa, Tuần hoàn & Bài tiết ở động vật',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b11-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Quá trình tiêu hóa & Vận chuyển máu',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g7-b12',
          lessonNumber: 12,
          title: 'Thực hành: Chứng minh thân vận chuyển nước và lá thoát hơi nước',
          subtitle: 'Bài 32 SGK: Thí nghiệm cắm cành hoa/cần tây vào nước mực đỏ và trùm túi nilon quanh chùm lá',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b12-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Thí nghiệm vận chuyển nước & Thoát hơi nước',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b12-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Hiện tượng mao dẫn & Hơi nước ngưng tụ',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. Động lực dòng Mạch gỗ (Xylem):',
            text: 'Áp suất đẩy của rễ (dưới) + Lực liên kết giữa các phân tử nước + Lực kéo của thoát hơi nước qua lá (trên)',
          },
          {
            label: '2. Chiều vận chuyển các dòng:',
            text: 'Mạch gỗ (1 chiều từ rễ lên thân lá: nước, khoáng) ↔ Mạch rây (từ lá quang hợp đến cơ quan dự trữ/tiêu thụ: chất hữu cơ)',
          },
          {
            label: '3. Cơ chế đóng mở khí khổng:',
            text: 'No nước → Thành mỏng tế bào hạt đậu cong phồng kéo thành dày → Lỗ khí mở; Mất nước → Tế bào duỗi thẳng → Lỗ khí đóng',
          },
          {
            label: '4. Nhu cầu nước ở người:',
            text: 'V (mL) = Khối lượng cơ thể (kg) × 40 mL (trung bình 1.5 – 2.5 lít/ngày)',
          },
        ],
        traps: [
          'Nhầm hướng đi giữa mạch gỗ và mạch rây (mạch gỗ đi từ rễ lên; mạch rây dẫn truyền sản phẩm hữu cơ từ lá đi khắp cơ thể).',
          'Khí khổng không bao giờ đóng kín hoàn toàn 100%, vẫn luôn có khe hở vi mô để duy trì hô hấp tối thiểu.',
          'Bề mặt trao đổi khí ở các lớp động vật: Giun đất/ếch (da ẩm ướt), Côn trùng (hệ thống ống khí), Cá (mang), Bò sát/Chim/Thú (phổi).',
          'Cắt ngang thân cây cần tây cắm mực đỏ: Chỉ có các chấm tròn đỏ của bó mạch gỗ bắt màu, vỏ và ruột mềm không dẫn mực đỏ.',
        ],
      },
    },
    {
      id: 'bio-g7-c03',
      chapterNumber: 3,
      title: 'Unit 3 — Cảm ứng ở sinh vật & Tập tính động vật',
      description: 'Tính hướng sáng, hướng đất, ứng động cụp lá và các tập tính bẩm sinh/học được (Chương 8 SGK)',
      lessons: [
        {
          id: 'bio-g7-b13',
          lessonNumber: 13,
          title: 'Cảm ứng ở sinh vật và tập tính ở động vật',
          subtitle: 'Bài 33 SGK: Khái niệm cảm ứng, các kiểu hướng động/ứng động và phân biệt tập tính bẩm sinh vs học được',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b13-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Cảm ứng & Phân loại tập tính',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b13-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Hướng động thực vật & Tập tính động vật',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g7-b14',
          lessonNumber: 14,
          title: 'Vận dụng hiện tượng cảm ứng ở sinh vật vào thực tiễn',
          subtitle: 'Bài 34 SGK: Kĩ thuật làm giàn leo, thắp đèn kích thích ra hoa, huấn luyện vật nuôi và thói quen tốt',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b14-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Ứng dụng cảm ứng & Tập tính trong đời sống',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b14-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Kĩ thuật nông nghiệp & Huấn luyện vật nuôi',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g7-b15',
          lessonNumber: 15,
          title: 'Thực hành: Cảm ứng ở sinh vật',
          subtitle: 'Bài 35 SGK: Thí nghiệm tính hướng sáng mầm đậu, tính hướng rễ và phản ứng cụp lá cây trinh nữ',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b15-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Thí nghiệm cảm ứng ở cây đậu & Cây trinh nữ',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b15-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Quan sát tính hướng sáng & Ứng động tiếp xúc',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. Tính hướng kích thích ở thực vật:',
            text: 'Hướng sáng (ngọn hướng dương, rễ hướng âm); Hướng trọng lực (rễ hướng đất dương, ngọn hướng đất âm); Hướng tiếp xúc (tua cuốn bám giàn)',
          },
          {
            label: '2. Tập tính bẩm sinh (Innate behavior):',
            text: 'Sinh ra đã có, do gen quy định, di truyền từ bố mẹ, mang tính đặc trưng cho loài (nhện giăng tơ, ong xây tổ, chim di cư)',
          },
          {
            label: '3. Tập tính học được (Learned behavior):',
            text: 'Hình thành trong đời sống nhờ học tập và trải nghiệm, dễ biến đổi, không di truyền (khỉ đi xe đạp, dừng xe đèn đỏ, rửa tay xà phòng)',
          },
        ],
        traps: [
          'Phân biệt hướng tiếp xúc (thân leo quấn giàn sinh trưởng dài ngày) với ứng động tiếp xúc (lá cây trinh nữ cụp ngay trong vài giây do thoát nước khớp gối).',
          'Tập tính bú mẹ ở trẻ sơ sinh là tập tính bẩm sinh; biết dùng đũa/thìa xúc cơm là tập tính học được.',
          'Ứng dụng thắp đèn ban đêm cho thanh long và cúc là để điều khiển chu kì quang cảm ứng kích thích cây ra hoa trái vụ.',
        ],
      },
    },
    {
      id: 'bio-g7-c04',
      chapterNumber: 4,
      title: 'Unit 4 — Sinh trưởng và phát triển ở sinh vật',
      description: 'Khái niệm sinh trưởng vs phát triển, mô phân sinh, các kiểu biến thái và vòng đời sinh vật (Chương 9 SGK)',
      lessons: [
        {
          id: 'bio-g7-b16',
          lessonNumber: 16,
          title: 'Khái quát về sinh trưởng và phát triển ở sinh vật',
          subtitle: 'Bài 36 SGK: Phân biệt sinh trưởng vs phát triển, mô phân sinh đỉnh/bên và các giai đoạn vòng đời',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b16-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Sinh trưởng, Phát triển & Mô phân sinh',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b16-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Phân biệt sinh trưởng vs phát triển',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g7-b17',
          lessonNumber: 17,
          title: 'Ứng dụng sinh trưởng và phát triển ở sinh vật vào thực tiễn',
          subtitle: 'Bài 37 SGK: Bấm ngọn, tỉa cành, điều khiển chiếu sáng, phòng trừ sâu bướm và lăng quăng',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b17-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Điều hòa sinh trưởng trong nông nghiệp',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b17-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Kĩ thuật bấm ngọn & Diệt trừ sâu bệnh',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g7-b18',
          lessonNumber: 18,
          title: 'Thực hành: Quan sát, mô tả sự sinh trưởng và phát triển ở một số sinh vật',
          subtitle: 'Bài 38 SGK: Đo chiều cao thân đậu, vẽ đồ thị sinh trưởng và phân tích vòng đời bướm, ếch đồng',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b18-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Thí nghiệm gieo đậu & Sơ đồ vòng đời',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b18-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Đọc biểu đồ sinh trưởng & Các pha biến thái',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. Sinh trưởng (Growth) vs Phát triển (Development):',
            text: 'Sinh trưởng: Tăng kích thước & khối lượng tế bào/cơ thể (định lượng) ↔ Phát triển: Biến đổi chất lượng, phân hóa mô/cơ quan mới (định tính)',
          },
          {
            label: '2. Các loại mô phân sinh ở thực vật:',
            text: 'Mô phân sinh đỉnh (chồi ngọn, chóp rễ) → Cây dài ra ↔ Mô phân sinh bên (tầng sinh vỏ, sinh trụ) → Cây to bề ngang',
          },
          {
            label: '3. Biến thái hoàn toàn (Bướm, ếch, muỗi):',
            text: 'Trứng → Ấu trùng (sâu non/nòng nọc) → Nhộng → Cá thể trưởng thành (con non khác biệt hoàn toàn con trưởng thành)',
          },
          {
            label: '4. Biến thái không hoàn toàn (Châu chấu, gián):',
            text: 'Trứng → Ấu trùng → Con trưởng thành (không qua giai đoạn nhộng, ấu trùng lột xác nhiều lần lớn dần)',
          },
        ],
        traps: [
          'Giai đoạn phá hoại cây trồng mạnh nhất ở bướm cải là giai đoạn sâu non (sâu ăn lá); bướm trưởng thành chỉ hút mật có ích cho thụ phấn.',
          'Để diệt muỗi truyền bệnh sốt xuất huyết hiệu quả nhất là diệt lăng quăng/bọ gậy ở các chum vại, vũng nước đọng.',
          'Bấm ngọn mướp, bầu, bí kích thích chồi nách phát triển ra nhiều nhánh mới mang hoa quả; tỉa bớt cành la, cành sâu bệnh để tập trung dinh dưỡng nuôi quả.',
        ],
      },
    },
    {
      id: 'bio-g7-c05',
      chapterNumber: 5,
      title: 'Unit 5 — Sinh sản ở sinh vật & Cơ thể thống nhất',
      description: 'Sinh sản vô tính, sinh sản hữu tính ở thực vật/động vật, điều khiển sinh sản và tính toàn vẹn (Chương 10 SGK)',
      lessons: [
        {
          id: 'bio-g7-b19',
          lessonNumber: 19,
          title: 'Sinh sản vô tính ở sinh vật',
          subtitle: 'Bài 39 SGK: Sinh sản sinh dưỡng tự nhiên (củ, rễ, thân, lá), nhân giống nhân tạo (giâm, chiết, ghép) và phân đôi, nảy chồi',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b19-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Sinh sản vô tính ở thực vật & Động vật',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b19-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Các hình thức sinh sản sinh dưỡng & Nhân giống',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g7-b20',
          lessonNumber: 20,
          title: 'Sinh sản hữu tính ở sinh vật',
          subtitle: 'Bài 40 SGK: Cấu tạo hoa, thụ phấn, thụ tinh tạo hợp tử/hạt/quả và thụ tinh trong vs thụ tinh ngoài',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b20-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Sinh sản hữu tính ở cây có hoa & Động vật',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b20-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Thụ phấn, Thụ tinh & Quá trình tạo hạt',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g7-b21',
          lessonNumber: 21,
          title: 'Một số yếu tố ảnh hưởng và điều hòa, điều khiển sinh sản ở sinh vật',
          subtitle: 'Bài 41 SGK: Thụ phấn nhân tạo, kích thích cá đẻ trứng nhân tạo, điều khiển nhiệt độ ấp trứng và hoóc môn',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b21-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Kĩ thuật điều khiển sinh sản ở cây trồng & Vật nuôi',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b21-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Ứng dụng thụ phấn nhân tạo & Điều hòa giới tính',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g7-b22',
          lessonNumber: 22,
          title: 'Cơ thể sinh vật là một thể thống nhất',
          subtitle: 'Bài 42 SGK: Mối quan hệ tương hỗ giữa rễ - thân - lá, tế bào - cơ quan - cơ thể và thích nghi môi trường',
          ready: true,
          nodes: [
            {
              id: 'bio-g7-b22-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Cơ thể sinh vật là một thể thống nhất',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g7-b22-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Phối hợp hoạt động sống & Thích nghi môi trường',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. Sinh sản vô tính (Asexual):',
            text: '1 cá thể mẹ tự sinh sản (nguyên phân) → Đàn con đồng nhất về mặt di truyền, giống hệt cá thể mẹ',
          },
          {
            label: '2. Sinh sản hữu tính (Sexual):',
            text: 'Giao tử đực (tinh trùng) + Giao tử cái (trứng) —(Thụ tinh)→ Hợp tử → Cơ thể mới (kết hợp vốn gen bố và mẹ, tăng biến dị tổ hợp thích nghi)',
          },
          {
            label: '3. Quá trình sau thụ tinh ở hoa:',
            text: 'Hạt phấn tiếp xúc đầu nhụy (Thụ phấn) → Ống phấn dẫn tinh tử thụ tinh noãn (Thụ tinh) → Noãn hóa thành Hạt, Bầu nhụy dày lên hóa thành Quả',
          },
          {
            label: '4. Thụ tinh ngoài vs Thụ tinh trong:',
            text: 'Thụ tinh ngoài: diễn ra trong môi trường nước (cá, ếch) ↔ Thụ tinh trong: diễn ra bên trong đường sinh dục con cái (bò sát, chim, thú)',
          },
        ],
        traps: [
          'Phân biệt Thụ phấn (chỉ là sự di chuyển hạt phấn từ nhị đến đầu nhụy) với Thụ tinh (sự kết hợp vật chất di truyền giữa tinh tử và noãn trong bầu nhụy).',
          'Khoai tây sinh sản bằng thân củ (có các mắt mầm mọc chồi); khoai lang sinh sản bằng rễ củ.',
          'Phân biệt giâm cành (cắt rời cành đem cắm vào đất ẩm) và chiết cành (bóc khoanh vỏ và bó bầu đất ngay trên cành đang sống ở cây mẹ cho ra rễ mới cắt).',
          'Ở một số loài bò sát như rùa và cá sấu, nhiệt độ ấp trứng quyết định giới tính của con non (rùa ấp ở nhiệt độ cao nở ra nhiều con cái, nhiệt độ thấp nở ra nhiều con đực).',
        ],
      },
    },
  ],
};
