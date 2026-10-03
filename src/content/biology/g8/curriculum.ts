import type { GradeCurriculum } from '../../curriculum/types';

export const GRADE_8_BIOLOGY_CURRICULUM: GradeCurriculum = {
  grade: 8,
  title: 'Sinh học lớp 8 (Khoa học tự nhiên 8 - Kết nối tri thức)',
  chapters: [
    {
      id: 'bio-g8-c01',
      chapterNumber: 1,
      title: 'Unit 1 — Khái quát cơ thể & Hệ vận động, Tiêu hóa, Tuần hoàn',
      description: 'Cấu tạo tế bào, mô, cơ quan; giải phẫu bộ xương và hệ cơ; quá trình tiêu hóa và hệ tuần hoàn máu (Chương 7 SGK - Phần 1)',
      lessons: [
        {
          id: 'bio-g8-b01',
          lessonNumber: 1,
          title: 'Khái quát về cơ thể người',
          subtitle: 'Bài 30 SGK: Các cấp độ tổ chức cơ thể, 4 loại mô cơ bản và sự phối hợp nhịp nhàng giữa các hệ cơ quan',
          ready: true,
          nodes: [
            {
              id: 'bio-g8-b01-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Khái quát về cơ thể người',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g8-b01-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Các cấp độ tổ chức & Mô cơ thể',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g8-b02',
          lessonNumber: 2,
          title: 'Hệ vận động ở người',
          subtitle: 'Bài 31 SGK: Cấu tạo bộ xương, các khớp xương, cơ chế co cơ, tật cong vẹo cột sống và sơ cứu gãy xương',
          ready: true,
          nodes: [
            {
              id: 'bio-g8-b02-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Hệ vận động ở người',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g8-b02-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Xương, Khớp & Cơ chế co cơ',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g8-b03',
          lessonNumber: 3,
          title: 'Dinh dưỡng và tiêu hóa ở người',
          subtitle: 'Bài 32 SGK: Chế độ dinh dưỡng hợp lí, cấu tạo ống & tuyến tiêu hóa, quá trình biến đổi thức ăn và phòng bệnh tiêu hóa',
          ready: true,
          nodes: [
            {
              id: 'bio-g8-b03-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Dinh dưỡng & Hệ tiêu hóa',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g8-b03-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Tiêu hóa cơ học & Biến đổi hóa học',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g8-b04',
          lessonNumber: 4,
          title: 'Máu và hệ tuần hoàn của cơ thể người',
          subtitle: 'Bài 33 SGK: Thành phần của máu, nhóm máu ABO, nguyên tắc truyền máu, cấu tạo tim và 2 vòng tuần hoàn',
          ready: true,
          nodes: [
            {
              id: 'bio-g8-b04-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Máu & Hệ tuần hoàn',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g8-b04-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Nhóm máu, Vòng tuần hoàn & Cầm máu',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. Vòng tuần hoàn lớn (nuôi dưỡng cơ thể):',
            text: 'Tâm thất trái → Động mạch chủ → Mao mạch các cơ quan (trao đổi chất & khí O2/CO2) → Tĩnh mạch chủ → Tâm nhĩ phải',
          },
          {
            label: '2. Vòng tuần hoàn nhỏ (trao đổi khí ở phổi):',
            text: 'Tâm thất phải → Động mạch phổi → Mao mạch phổi (thải CO2, nhận O2) → Tĩnh mạch phổi → Tâm nhĩ trái',
          },
          {
            label: '3. Nguyên tắc truyền máu ABO an toàn:',
            text: 'Không để kháng nguyên trên hồng cầu người cho bị ngưng kết bởi kháng thể trong huyết tương người nhận (O: chuyên cho; AB: chuyên nhận)',
          },
          {
            label: '4. Tỉ lệ thành phần máu chuẩn:',
            text: 'Huyết tương chiếm ~55% thể tích (90% nước, protein, dưỡng chất) + Tế bào máu chiếm ~45% (Hồng cầu, Bạch cầu, Tiểu cầu)',
          },
        ],
        traps: [
          'Nhầm lẫn máu trong động mạch phổi là máu đỏ tươi (Thực tế: Động mạch phổi dẫn máu đỏ thẫm nghèo O2 từ tâm thất phải lên phổi; Tĩnh mạch phổi mới dẫn máu đỏ tươi giàu O2 về tâm nhĩ trái).',
          'Nhầm lẫn tiêu hóa hóa học ở dạ dày (Dạ dày chỉ biến đổi hóa học protein thành chuỗi peptide ngắn nhờ enzym pepsin; tinh bột và lipid chưa được tiêu hóa hóa học tại dạ dày).',
          'Nhóm máu O là nhóm máu chuyên cho nhưng chỉ nhận được máu nhóm O (vì huyết tương nhóm O có cả kháng thể α và β, sẽ ngưng kết hồng cầu các nhóm A, B, AB).',
          'Khớp xương: Khớp sọ là khớp bất động; khớp các đốt sống là khớp bán động; khớp vai, khuỷu tay, đầu gối là khớp động hoàn toàn.',
        ],
      },
    },
    {
      id: 'bio-g8-c02',
      chapterNumber: 2,
      title: 'Unit 2 — Hô hấp, Bài tiết & Cân bằng môi trường trong cơ thể',
      description: 'Cơ chế thông khí và trao đổi khí ở phổi/tế bào; lọc máu tạo nước tiểu ở Nephron và cân bằng nội môi (Chương 7 SGK - Phần 2)',
      lessons: [
        {
          id: 'bio-g8-b05',
          lessonNumber: 5,
          title: 'Hệ hô hấp ở người',
          subtitle: 'Bài 34 SGK: Cấu tạo đường dẫn khí và phổi, cơ chế thông khí, trao đổi khí khuếch tán, tác hại khói thuốc và hô hấp nhân tạo',
          ready: true,
          nodes: [
            {
              id: 'bio-g8-b05-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Hệ hô hấp ở người',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g8-b05-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Cơ chế thông khí & Trao đổi khí',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g8-b06',
          lessonNumber: 6,
          title: 'Hệ bài tiết ở người',
          subtitle: 'Bài 35 SGK: Cấu tạo thận, đơn vị Nephron, 3 giai đoạn tạo nước tiểu, vệ sinh bài tiết và phòng tránh sỏi thận, suy thận',
          ready: true,
          nodes: [
            {
              id: 'bio-g8-b06-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Hệ bài tiết ở người',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g8-b06-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Cấu tạo Nephron & Quá trình tạo nước tiểu',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g8-b07',
          lessonNumber: 7,
          title: 'Điều hòa môi trường trong của cơ thể người',
          subtitle: 'Bài 36 SGK: Khái niệm môi trường trong, cân bằng nội môi, cơ chế điều hòa đường huyết của Insulin và Glucagon',
          ready: true,
          nodes: [
            {
              id: 'bio-g8-b07-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Môi trường trong & Cân bằng nội môi',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g8-b07-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Điều hòa đường huyết & Nội môi',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. Cơ chế thông khí ở phổi:',
            text: 'Cơ liên sườn co + Cơ hoành hạ xuống → Thể tích lồng ngực tăng → Áp suất khoang ngực giảm → Không khí từ ngoài tràn vào phế nang (Hít vào)',
          },
          {
            label: '2. Quá trình tạo nước tiểu tại Nephron:',
            text: 'Lọc máu (Cầu thận) tạo Nước tiểu đầu → Tái hấp thụ (Ống thận) thu hồi 99% nước & dưỡng chất → Bài tiết tiếp (Ống thận) tạo Nước tiểu chính thức',
          },
          {
            label: '3. Cơ chế điều hòa đường huyết của tuyến tụy:',
            text: 'Đường huyết tăng → Tiết Insulin chuyển Glucose thành Glycogen (hạ đường); Đường huyết giảm → Tiết Glucagon phân giải Glycogen thành Glucose (tăng đường)',
          },
          {
            label: '4. Thành phần môi trường trong cơ thể:',
            text: 'Môi trường trong = Máu (huyết tương) + Dịch mô (dịch kẽ bao quanh tế bào) + Bạch huyết (bạch huyết quản)',
          },
        ],
        traps: [
          'Nhầm lẫn giữa nước tiểu đầu và nước tiểu chính thức (Nước tiểu đầu chứa nhiều glucose, ion Na+, K+ và không có tế bào máu/protein lớn; nước tiểu chính thức không còn glucose, chứa ure đậm đặc).',
          'Thở bằng miệng làm mất cơ chế lọc bụi của lông mũi, làm ẩm và sưởi ấm không khí của niêm mạc mũi, khiến đường hô hấp dễ viêm nhiễm.',
          'Màng lọc cầu thận có tính thấm chọn lọc: các tế bào máu và protein lớn không thể qua màng lọc. Nếu nước tiểu có hồng cầu/protein là dấu hiệu tổn thương thận nghiêm trọng.',
          'Cân bằng nội môi không chỉ là nhiệt độ mà còn bao gồm cân bằng pH máu (7,35 - 7,45), áp suất thẩm thấu, nồng độ ion và lượng đường huyết ổn định quanh 0,1%.',
        ],
      },
    },
    {
      id: 'bio-g8-c03',
      chapterNumber: 3,
      title: 'Unit 3 — Điều hòa thần kinh, Thể dịch, Cảm giác & Sinh sản ở người',
      description: 'Hệ thần kinh, giác quan mắt/tai, hệ nội tiết điều hòa thể dịch, da điều hòa thân nhiệt và sinh sản (Chương 7 SGK - Phần 3)',
      lessons: [
        {
          id: 'bio-g8-b08',
          lessonNumber: 8,
          title: 'Hệ thần kinh và các giác quan ở người',
          subtitle: 'Bài 37 SGK: Cấu tạo nơron, não bộ và tủy sống, cơ chế điều tiết mắt, tật cận thị/viễn thị, cấu tạo tai và vệ sinh giấc ngủ',
          ready: true,
          nodes: [
            {
              id: 'bio-g8-b08-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Hệ thần kinh & Thị giác, Thính giác',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g8-b08-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Nơron, Não bộ, Mắt & Tai',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g8-b09',
          lessonNumber: 9,
          title: 'Hệ nội tiết ở người',
          subtitle: 'Bài 38 SGK: Phân biệt tuyến nội tiết vs ngoại tiết, chức năng tuyến yên, tuyến giáp, tuyến tụy, tuyến trên thận và tuyến sinh dục',
          ready: true,
          nodes: [
            {
              id: 'bio-g8-b09-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Hệ nội tiết & Các tuyến hormone',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g8-b09-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Hormone tuyến yên, Tuyến giáp & Tuyến tụy',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g8-b10',
          lessonNumber: 10,
          title: 'Da và điều hòa thân nhiệt ở người',
          subtitle: 'Bài 39 SGK: Cấu tạo 3 lớp của da, chức năng bảo vệ, cơ chế tỏa nhiệt - sinh nhiệt và biện pháp phòng chống cảm nắng, cảm lạnh',
          ready: true,
          nodes: [
            {
              id: 'bio-g8-b10-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Cấu tạo da & Cơ chế điều hòa thân nhiệt',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g8-b10-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Điều hòa thân nhiệt & Bảo vệ da',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g8-b11',
          lessonNumber: 11,
          title: 'Sinh sản ở người',
          subtitle: 'Bài 40 SGK: Cấu tạo cơ quan sinh dục nam & nữ, thụ tinh, thụ thai, các biện pháp tránh thai an toàn và phòng tránh bệnh STDs',
          ready: true,
          nodes: [
            {
              id: 'bio-g8-b11-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Cơ quan sinh sản, Thụ tinh & Tránh thai',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g8-b11-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Thụ tinh, Thụ thai & Sức khỏe sinh sản',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. Cung phản xạ 5 thành phần hoàn chỉnh:',
            text: 'Cơ quan thụ cảm → Nơron hướng tâm (cảm giác) → Trung ương thần kinh (não/tủy) → Nơron li tâm (vận động) → Cơ quan đáp ứng (cơ/tuyến)',
          },
          {
            label: '2. Sửa tật khúc xạ mắt:',
            text: 'Cận thị (ảnh nằm trước võng mạc, trục mắt dài) → Đeo thấu kính phân kì; Viễn thị (ảnh nằm sau võng mạc, trục mắt ngắn) → Đeo thấu kính hội tụ',
          },
          {
            label: '3. Cơ chế điều hòa thân nhiệt của da:',
            text: 'Trời nóng: dãn mao mạch dưới da + toát mồ hôi (tăng tỏa nhiệt); Trời lạnh: co mao mạch + co cơ dựng lông (nổi da gà) + run cơ (tăng sinh nhiệt)',
          },
          {
            label: '4. Vị trí thụ tinh & Thụ thai:',
            text: 'Thụ tinh diễn ra ở 1/3 phía ngoài ống dẫn trứng; Thụ thai khi phôi di chuyển về tử cung và làm tổ an toàn trong lớp niêm mạc tử cung dày xốp',
          },
        ],
        traps: [
          'Tuyến tụy là tuyến pha: phần ngoại tiết tiết dịch tụy đổ vào tá tràng để tiêu hóa, phần nội tiết (đảo tụy) tiết insulin và glucagon trực tiếp vào máu.',
          'Bệnh bướu cổ do thiếu iod: thiếu iod khiến tuyến giáp không tổng hợp đủ thyroxine, tuyến yên phản ứng bằng cách tiết TSH kích thích tuyến giáp phì đại tạo bướu.',
          'Phân biệt thụ tinh và thụ thai: Thụ tinh là tinh trùng kết hợp với tế bào trứng tạo hợp tử; Thụ thai là hợp tử phân chia thành phôi thai và bám vào làm tổ trong tử cung.',
          'Bao cao su là biện pháp tránh thai duy nhất vừa ngăn ngừa có thai ngoài ý muốn vừa phòng chống hiệu quả các bệnh lây truyền qua đường tình dục (HIV, giang mai, lậu).',
        ],
      },
    },
    {
      id: 'bio-g8-c04',
      chapterNumber: 4,
      title: 'Unit 4 — Môi trường sống, Quần thể & Quần xã sinh vật',
      description: 'Nhân tố sinh thái, giới hạn sinh thái, đặc trưng quần thể và cấu trúc quan hệ trong quần xã sinh vật (Chương 8 SGK - Phần 1)',
      lessons: [
        {
          id: 'bio-g8-b12',
          lessonNumber: 12,
          title: 'Môi trường và các nhân tố sinh thái',
          subtitle: 'Bài 41 SGK: 4 môi trường sống, nhân tố vô sinh & hữu sinh, giới hạn sinh thái, khoảng thuận lợi và điểm gây chết của sinh vật',
          ready: true,
          nodes: [
            {
              id: 'bio-g8-b12-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Môi trường & Nhân tố sinh thái',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g8-b12-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Phân loại nhân tố & Giới hạn sinh thái',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g8-b13',
          lessonNumber: 13,
          title: 'Quần thể sinh vật',
          subtitle: 'Bài 42 SGK: Khái niệm quần thể, tỉ lệ giới tính, tháp tuổi, mật độ cá thể, kích thước và biến động số lượng cá thể trong tự nhiên',
          ready: true,
          nodes: [
            {
              id: 'bio-g8-b13-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Đặc trưng của quần thể sinh vật',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g8-b13-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Mật độ, Tháp tuổi & Biến động số lượng',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g8-b14',
          lessonNumber: 14,
          title: 'Quần xã sinh vật',
          subtitle: 'Bài 43 SGK: Khái niệm quần xã, loài ưu thế vs loài đặc trưng, các mối quan hệ hỗ trợ & đối kháng, khống chế sinh học',
          ready: true,
          nodes: [
            {
              id: 'bio-g8-b14-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Quần xã sinh vật & Quan hệ sinh thái',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g8-b14-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Mối quan hệ sinh thái & Khống chế sinh học',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. Công thức mật độ cá thể quần thể:',
            text: 'D = N / S (số cá thể trên đơn vị diện tích m2, ha) hoặc D = N / V (số cá thể trên đơn vị thể tích m3, lít)',
          },
          {
            label: '2. Giới hạn sinh thái (Ecological tolerance):',
            text: 'Điểm giới hạn dưới < Khoảng chống chịu dưới < Khoảng thuận lợi (sinh trưởng tốt nhất) < Khoảng chống chịu trên < Điểm giới hạn trên',
          },
          {
            label: '3. Phân biệt quan hệ hỗ trợ trong quần xã:',
            text: 'Cộng sinh (hai bên bắt buộc cùng có lợi, rời nhau chết) ↔ Hội sinh (một bên có lợi, một bên không lợi không hại) ↔ Hợp tác (cùng lợi, không bắt buộc)',
          },
          {
            label: '4. Mối quan hệ đối kháng trong quần xã:',
            text: 'Cạnh tranh (tranh giành thức ăn, ánh sáng, nơi ở) ↔ Kí sinh (lấy dinh dưỡng từ vật chủ) ↔ Sinh vật ăn sinh vật khác (vật ăn thịt - con mồi)',
          },
        ],
        traps: [
          'Một tập hợp cá thể ngẫu nhiên không phải là quần thể (Ví dụ: các con cá trong ao gồm cá mè, cá trôi, cá chép là quần xã cá; đàn cá mè hoa trong ao mới là một quần thể).',
          'Loài ưu thế và loài đặc trưng: Loài ưu thế có số lượng lớn, sinh khối lớn và chi phối hoạt động quần xã (cây lúa trên ruộng lúa); Loài đặc trưng chỉ có ở một quần xã hoặc số lượng vượt trội đặc trưng riêng biệt (cá cóc Tam Đảo, tràm ở rừng U Minh).',
          'Địa y là ví dụ kinh điển của quan hệ Cộng sinh giữa nấm (cung cấp nước, muối khoáng) và tảo đơn bào hoặc vi khuẩn lam (quang hợp cung cấp chất hữu cơ).',
          'Cây phong lan sống bám trên thân cây gỗ là quan hệ Hội sinh, không phải kí sinh vì phong lan có diệp lục tự quang hợp, chỉ bám nhờ làm giá thể hứng ánh sáng.',
        ],
      },
    },
    {
      id: 'bio-g8-c05',
      chapterNumber: 5,
      title: 'Unit 5 — Hệ sinh thái, Sinh quyển & Bảo vệ môi trường',
      description: 'Cấu trúc hệ sinh thái, chuỗi/lưới thức ăn, các khu sinh học trên Trái Đất, cân bằng tự nhiên và bảo vệ môi trường (Chương 8 SGK - Phần 2)',
      lessons: [
        {
          id: 'bio-g8-b15',
          lessonNumber: 15,
          title: 'Hệ sinh thái',
          subtitle: 'Bài 44 SGK: Cấu trúc hệ sinh thái, sinh vật sản xuất, tiêu thụ, phân giải; chuỗi thức ăn, lưới thức ăn, bậc dinh dưỡng và tháp sinh thái',
          ready: true,
          nodes: [
            {
              id: 'bio-g8-b15-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Cấu trúc hệ sinh thái & Chuỗi thức ăn',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g8-b15-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Lưới thức ăn, Bậc dinh dưỡng & Tháp sinh thái',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g8-b16',
          lessonNumber: 16,
          title: 'Sinh quyển',
          subtitle: 'Bài 45 SGK: Khái niệm sinh quyển, các khu sinh học trên cạn (rừng mưa, taiga, thảo nguyên, đài nguyên) và dưới nước',
          ready: true,
          nodes: [
            {
              id: 'bio-g8-b16-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Sinh quyển & Các khu sinh học (Biomes)',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g8-b16-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Khu sinh học trên cạn & Dưới nước',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g8-b17',
          lessonNumber: 17,
          title: 'Cân bằng tự nhiên',
          subtitle: 'Bài 46 SGK: Trạng thái cân bằng tự nhiên, cơ chế tự điều chỉnh của hệ sinh thái, tác động của thiên tai và con người',
          ready: true,
          nodes: [
            {
              id: 'bio-g8-b17-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Trạng thái cân bằng tự nhiên',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g8-b17-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Cơ chế cân bằng & Mất cân bằng sinh thái',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g8-b18',
          lessonNumber: 18,
          title: 'Bảo vệ môi trường',
          subtitle: 'Bài 47 SGK: Các dạng ô nhiễm môi trường, biến đổi khí hậu, phát triển bền vững và các biện pháp hành động xanh bảo vệ sinh thái',
          ready: true,
          nodes: [
            {
              id: 'bio-g8-b18-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Ô nhiễm môi trường & Biện pháp bảo vệ',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g8-b18-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Kinh tế tuần hoàn 3R & Hành động xanh',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. Cấu trúc hệ sinh thái hoàn chỉnh:',
            text: 'Hệ sinh thái = Sinh cảnh (vô sinh: đất, nước, khí hậu) + Quần xã sinh vật (Sinh vật sản xuất + Sinh vật tiêu thụ + Sinh vật phân giải)',
          },
          {
            label: '2. Chuỗi thức ăn tiêu chuẩn:',
            text: 'Sinh vật sản xuất (cỏ, lúa) → SV tiêu thụ bậc 1 (cào cào, thỏ) → SV tiêu thụ bậc 2 (ếch, cáo) → SV tiêu thụ bậc 3 (rắn, hổ) → SV phân giải',
          },
          {
            label: '3. Quy luật hình tháp năng lượng 10%:',
            text: 'Năng lượng chuyển tiếp giữa 2 bậc dinh dưỡng liền kề chỉ đạt ~10% (E_{n+1} = E_n × 10%), 90% còn lại thất thoát qua nhiệt và chất thải',
          },
          {
            label: '4. Mô hình kinh tế tuần hoàn 3R:',
            text: 'Reduce (Giảm thiểu tiêu thụ & phát thải rác) - Reuse (Tái sử dụng đồ dùng) - Recycle (Tái chế nguyên liệu)',
          },
        ],
        traps: [
          'Chuỗi thức ăn bắt đầu từ sinh vật tự dưỡng (sinh vật sản xuất - cây xanh, tảo), không bắt đầu từ sinh vật tiêu thụ hay động vật ăn thực vật.',
          'Sinh vật phân giải (vi khuẩn hoại sinh, nấm hoại sinh) biến đổi xác hữu cơ thành chất vô cơ cho cây hấp thụ; động vật ăn xác thối (kền kền, giòi) là sinh vật tiêu thụ.',
          'Cân bằng tự nhiên là trạng thái cân bằng động (số lượng cá thể dao động nhịp nhàng quanh một giá trị cân bằng, không phải bất biến cố định).',
          'Du nhập sinh vật ngoại lai thiếu kiểm soát (ốc bươu vàng, rùa tai đỏ, cây mai dương) có thể phá vỡ cân bằng tự nhiên và đe dọa tuyệt chủng các loài bản địa.',
        ],
      },
    },
  ],
};
