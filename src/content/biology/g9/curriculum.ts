import type { GradeCurriculum } from '../../curriculum/types';

export const GRADE_9_BIOLOGY_CURRICULUM: GradeCurriculum = {
  grade: 9,
  title: 'Sinh học lớp 9 (Khoa học tự nhiên 9 - Kết nối tri thức)',
  chapters: [
    {
      id: 'bio-g9-c01',
      chapterNumber: 1,
      title: 'Unit 1 — Di truyền học Mendel & Cấu trúc phân tử di truyền',
      description: 'Khái niệm di truyền, các quy luật di truyền của Mendel, cấu trúc phân tử DNA, RNA và gene (Chương 11 SGK - Phần 1)',
      lessons: [
        {
          id: 'bio-g9-b01',
          lessonNumber: 1,
          sgkBaiSo: 36,
          title: 'Khái quát về di truyền học',
          subtitle: 'Bài 36 SGK: Khái niệm di truyền, biến dị, các thuật ngữ di truyền cơ bản và phương pháp nghiên cứu của Mendel',
          ready: true,
          nodes: [
            {
              id: 'bio-g9-b01-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Khái quát về di truyền học',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g9-b01-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Thuật ngữ & Phương pháp lai Mendel',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g9-b02',
          lessonNumber: 2,
          sgkBaiSo: 37,
          title: 'Các quy luật di truyền của Mendel',
          subtitle: 'Bài 37 SGK: Quy luật phân li, phép lai phân tích, quy luật phân li độc lập và ý nghĩa của biến dị tổ hợp',
          ready: true,
          nodes: [
            {
              id: 'bio-g9-b02-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Các quy luật di truyền của Mendel',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g9-b02-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Quy luật phân li & Phân li độc lập',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g9-b03',
          lessonNumber: 3,
          sgkBaiSo: 38,
          title: 'Nucleic acid và gene',
          subtitle: 'Bài 38 SGK: Cấu trúc hóa học và không gian của DNA, nguyên tắc bổ sung, các loại RNA và khái niệm gene',
          ready: true,
          nodes: [
            {
              id: 'bio-g9-b03-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Nucleic acid và gene',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g9-b03-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Cấu trúc DNA, RNA & Nguyên tắc bổ sung',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. Quy luật phân li một cặp tính trạng (P thuần chủng tương phản):',
            text: 'P: AA × aa → F1: 100% Aa (đồng tính trội) → F2: 1 AA : 2 Aa : 1 aa (3 trội : 1 lặn)',
          },
          {
            label: '2. Phép lai phân tích (Lai cá thể trội với cá thể lặn aa):',
            text: 'Nếu con lai 100% trội → Cá thể mang kiểu gen đồng hợp (AA); Nếu con lai phân tính 1 trội : 1 lặn → Cá thể mang kiểu gen dị hợp (Aa)',
          },
          {
            label: '3. Quy luật phân li độc lập hai cặp tính trạng:',
            text: 'F2 có tỉ lệ kiểu hình: (3 trội : 1 lặn)(3 trội : 1 lặn) = 9 vàng, trơn : 3 vàng, nhăn : 3 xanh, trơn : 1 xanh, nhăn (16 tổ hợp)',
          },
          {
            label: '4. Nguyên tắc bổ sung (NTBS) trong phân tử DNA:',
            text: 'A liên kết với T bằng 2 liên kết hydrogen (A = T); G liên kết với C bằng 3 liên kết hydrogen (G ≡ C) ⇒ A + G = T + C = N/2 (50%)',
          },
          {
            label: '5. Các công thức toán phân tử DNA cơ bản:',
            text: 'Chiều dài: L = (N / 2) × 3,4 Å; Khối lượng: M = N × 300 đvC; Liên kết hydrogen: H = 2A + 3G',
          },
        ],
        traps: [
          'Cặp tính trạng tương phản là hai trạng thái biểu hiện trái ngược nhau của cùng một loại tính trạng (ví dụ: hạt vàng và hạt xanh; không so sánh hạt vàng với vỏ nhăn).',
          'Tỉ lệ kiểu gen khác hoàn toàn tỉ lệ kiểu hình: ở F2 lai một cặp tính trạng, tỉ lệ kiểu gen là 1 : 2 : 1 nhưng tỉ lệ kiểu hình là 3 : 1.',
          'Phân biệt liên kết hydrogen (nối 2 mạch đơn, dễ bị đứt khi nhân đôi) với liên kết phosphodiester (liên kết cộng hóa trị bền vững nối các nucleotide trên cùng 1 mạch).',
          'Đơn phân cấu tạo RNA là 4 loại nucleotide A, U, G, C (thay thế thymine T bằng uracil U); RNA có cấu trúc mạch đơn.',
        ],
      },
    },
    {
      id: 'bio-g9-c02',
      chapterNumber: 2,
      title: 'Unit 2 — Cơ chế di truyền phân tử & Đột biến gene',
      description: 'Quá trình tái bản DNA, phiên mã, dịch mã chuỗi polypeptide, cơ chế từ gene đến tính trạng và đột biến gene (Chương 11 SGK - Phần 2)',
      lessons: [
        {
          id: 'bio-g9-b04',
          lessonNumber: 4,
          sgkBaiSo: 39,
          title: 'Tái bản DNA và phiên mã tạo RNA',
          subtitle: 'Bài 39 SGK: Quá trình nhân đôi DNA theo nguyên tắc bổ sung và bán bảo tồn; cơ chế phiên mã tổng hợp mRNA, tRNA, rRNA',
          ready: true,
          nodes: [
            {
              id: 'bio-g9-b04-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Tái bản DNA và phiên mã',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g9-b04-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Cơ chế nhân đôi DNA & Phiên mã RNA',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g9-b05',
          lessonNumber: 5,
          sgkBaiSo: 40,
          title: 'Dịch mã và mối quan hệ từ gene đến tính trạng',
          subtitle: 'Bài 40 SGK: Mã di truyền, quá trình dịch mã tổng hợp chuỗi polypeptide và sơ đồ Central Dogma: Gene → mRNA → Protein → Tính trạng',
          ready: true,
          nodes: [
            {
              id: 'bio-g9-b05-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Dịch mã & Mối quan hệ Gene - Tính trạng',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g9-b05-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Mã di truyền & Cơ chế dịch mã',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g9-b06',
          lessonNumber: 6,
          sgkBaiSo: 41,
          title: 'Đột biến gene',
          subtitle: 'Bài 41 SGK: Khái niệm đột biến gene, các dạng đột biến điểm (thay thế, thêm, mất cặp nu), nguyên nhân, hậu quả và ý nghĩa',
          ready: true,
          nodes: [
            {
              id: 'bio-g9-b06-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Đột biến gene',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g9-b06-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Các dạng đột biến điểm & Tác động sinh học',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. Nguyên tắc bán bảo tồn trong tái bản DNA:',
            text: 'Từ 1 phân tử DNA mẹ ban đầu qua k lần nhân đôi tạo ra 2^k phân tử DNA con, trong đó luôn chỉ có đúng 2 phân tử DNA con chứa 1 mạch cũ của mẹ',
          },
          {
            label: '2. Nguyên tắc bổ sung trong phiên mã tổng hợp mRNA:',
            text: 'Mạch gốc DNA (3\' → 5\') làm khuôn: A_gốc - U_m, T_gốc - A_m, G_gốc - C_m, C_gốc - G_m → Tạo mRNA (5\' → 3\')',
          },
          {
            label: '3. Mã bộ ba (Codon trên mRNA):',
            text: 'Codon khởi đầu 5\'AUG3\' mã hóa Methionine; 3 codon kết thúc (UAA, UAG, UGA) làm tín hiệu dừng dịch mã, không mã hóa amino acid',
          },
          {
            label: '4. Sơ đồ cơ chế truyền đạt thông tin di truyền trung tâm:',
            text: 'Gene (DNA trong nhân) --Phiên mã--> mRNA --Dịch mã tại ribosome--> Chuỗi Polypeptide (Protein) --> Biểu hiện thành Tính trạng',
          },
        ],
        traps: [
          'Chỉ có mạch gốc (3\' → 5\') của gene mới được dùng làm khuôn để phiên mã tổng hợp mRNA; enzyme RNA polymerase di chuyển theo chiều 3\' → 5\' trên mạch gốc.',
          'Phân biệt: Triplet là bộ ba trên mạch gốc DNA, Codon là bộ ba trên mRNA, Anticodon là bộ ba đối mã trên tRNA.',
          'Đột biến thay thế 1 cặp nucleotide chỉ làm thay đổi tối đa 1 amino acid (hoặc không đổi do tính thoái hóa của mã di truyền); trong khi đột biến thêm hoặc mất 1 cặp nucleotide gây dịch khung đọc mã, làm thay đổi toàn bộ trình tự amino acid từ vị trí đột biến về sau.',
        ],
      },
    },
    {
      id: 'bio-g9-c03',
      chapterNumber: 3,
      title: 'Unit 3 — Nhiễm sắc thể & Các cơ chế phân bào',
      description: 'Cấu tạo nhiễm sắc thể, chu kì tế bào, nguyên phân, giảm phân, NST giới tính và cơ chế xác định giới tính (Chương 12 SGK - Phần 1)',
      lessons: [
        {
          id: 'bio-g9-b07',
          lessonNumber: 7,
          sgkBaiSo: 42,
          title: 'Nhiễm sắc thể và bộ nhiễm sắc thể',
          subtitle: 'Bài 42 SGK: Cấu trúc hiển vi và siêu hiển vi của NST, bộ NST lưỡng bội (2n), đơn bội (n) và tính đặc trưng theo loài',
          ready: true,
          nodes: [
            {
              id: 'bio-g9-b07-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Nhiễm sắc thể và bộ nhiễm sắc thể',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g9-b07-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Cấu trúc NST & Bộ NST đặc trưng',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g9-b08',
          lessonNumber: 8,
          sgkBaiSo: 43,
          title: 'Nguyên phân và giảm phân',
          subtitle: 'Bài 43 SGK: Diễn biến NST qua các kì nguyên phân (tạo 2 tế bào con 2n) và giảm phân (tạo 4 giao tử n); ý nghĩa sinh học',
          ready: true,
          nodes: [
            {
              id: 'bio-g9-b08-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Nguyên phân và giảm phân',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g9-b08-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Phân biệt các kì Nguyên phân & Giảm phân',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g9-b09',
          lessonNumber: 9,
          sgkBaiSo: 44,
          title: 'Nhiễm sắc thể giới tính và cơ chế xác định giới tính',
          subtitle: 'Bài 44 SGK: Cặp NST giới tính XX và XY, cơ chế thụ tinh xác định giới tính tỉ lệ 1 : 1 và các yếu tố môi trường ảnh hưởng',
          ready: true,
          nodes: [
            {
              id: 'bio-g9-b09-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: NST giới tính & Xác định giới tính',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g9-b09-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Cơ chế thụ tinh XX/XY & Giới tính ở sinh vật',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. Số tế bào con và số NST tạo thành sau k lần nguyên phân:',
            text: 'Số tế bào con = 2^k; Số NST môi trường nội bào cung cấp = 2n × (2^k - 1)',
          },
          {
            label: '2. Tế bào sinh dục chín giảm phân tạo giao tử:',
            text: '1 tế bào sinh tinh (2n) → 4 tinh trùng (n); 1 tế bào sinh trứng (2n) → 1 trứng (n) + 3 thể cực (tiêu biến)',
          },
          {
            label: '3. Cơ chế xác định giới tính ở người (Tỉ lệ 1 nam : 1 nữ):',
            text: 'P: 44A + XY (bố) × 44A + XX (mẹ) → G: (22A + X, 22A + Y) × (22A + X) → F1: 1 (44A + XX, nữ) : 1 (44A + XY, nam)',
          },
        ],
        traps: [
          'Bẫy sắp xếp NST ở kì giữa: Kì giữa Nguyên phân các NST kép xếp thành 1 hàng trên mặt phẳng xích đạo; Kì giữa Giảm phân I các cặp NST kép tương đồng xếp thành 2 hàng song song.',
          'Số chromatid ở kì sau: Ở kì sau nguyên phân và kì sau giảm phân II, tâm động đã chẻ đôi tách rời 2 chromatid thành 2 NST đơn nên số chromatid = 0.',
          'Số lượng NST không phản ánh mức độ tiến hóa của loài (Người có 2n = 46, trong khi gà có 2n = 78, tinh tinh có 2n = 48).',
          'Ở chim, bướm, bò sát: con đực mang cặp NST giới tính XX, con cái mang cặp NST giới tính XY (ngược lại với người và ruồi giấm).',
        ],
      },
    },
    {
      id: 'bio-g9-c04',
      chapterNumber: 4,
      title: 'Unit 4 — Di truyền liên kết, Đột biến NST & Di truyền người',
      description: 'Quy luật di truyền liên kết của Morgan, đột biến cấu trúc và số lượng NST, di truyền y học người và nghiên cứu phả hệ (Chương 12 Phần 2 & Chương 13 Phần 1)',
      lessons: [
        {
          id: 'bio-g9-b10',
          lessonNumber: 10,
          sgkBaiSo: 45,
          title: 'Di truyền liên kết',
          subtitle: 'Bài 45 SGK: Thí nghiệm ruồi giấm của Morgan, hiện tượng các gene nằm trên cùng 1 NST di truyền cùng nhau và nhóm gene liên kết',
          ready: true,
          nodes: [
            {
              id: 'bio-g9-b10-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Di truyền liên kết',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g9-b10-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Thí nghiệm Morgan & Nhóm gen liên kết',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g9-b11',
          lessonNumber: 11,
          sgkBaiSo: 46,
          title: 'Đột biến nhiễm sắc thể',
          subtitle: 'Bài 46 SGK: Đột biến cấu trúc NST (mất, lặp, đảo, chuyển đoạn) và đột biến số lượng NST (lệch bội 2n±1, đa bội 3n, 4n); ứng dụng tạo giống',
          ready: true,
          nodes: [
            {
              id: 'bio-g9-b11-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Đột biến nhiễm sắc thể',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g9-b11-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Đột biến cấu trúc & Số lượng NST',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g9-b12',
          lessonNumber: 12,
          sgkBaiSo: 47,
          title: 'Di truyền học với con người',
          subtitle: 'Bài 47 SGK: Phương pháp nghiên cứu phả hệ, hội chứng Đao (3 NST 21), Turner (XO), Klinefelter (XXY), bệnh máu khó đông và mù màu',
          ready: true,
          nodes: [
            {
              id: 'bio-g9-b12-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Di truyền học với con người',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g9-b12-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Phả hệ di truyền & Bệnh tật di truyền người',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. Số nhóm gene liên kết của một loài:',
            text: 'Số nhóm gene liên kết = Số nhiễm sắc thể trong bộ đơn bội (n) của loài đó (Ví dụ: Ruồi giấm 2n = 8 ⇒ n = 4 nhóm gen liên kết; Người 2n = 46 ⇒ n = 23)',
          },
          {
            label: '2. Thể lệch bội (Dị bội) ở một cặp NST tương đồng:',
            text: 'Thể một: 2n - 1 (thiếu 1 NST); Thể ba: 2n + 1 (thừa 1 NST, ví dụ Hội chứng Đao thừa 1 NST ở cặp số 21 có 47 chiếc)',
          },
          {
            label: '3. Thể đa bội (Toàn bộ bộ NST tăng theo bội số nguyên của n):',
            text: 'Tam bội: 3n; Tứ bội: 4n (cơ quan sinh dưỡng to, chống chịu khỏe, quả tam bội thường không hạt như chuối, dưa hấu 3n)',
          },
          {
            label: '4. Bệnh di truyền liên kết giới tính do gene lặn trên NST X:',
            text: 'Nam giới dị giao tử XY chỉ cần mang 1 alen lặn X^aY đã biểu hiện bệnh; Nữ giới đồng giao tử XX cần mang cả 2 alen lặn X^aX^a mới biểu hiện',
          },
        ],
        traps: [
          'Tỉ lệ lai phân tích di truyền liên kết: Lai phân tích ruồi đực F1 (BV/bv × bv/bv) cho tỉ lệ kiểu hình 1 : 1 (chỉ có 2 loại kiểu hình giống bố mẹ), không phân li độc lập 1 : 1 : 1 : 1.',
          'Phân biệt đột biến thể ba (2n + 1 = 47) với đột biến tam bội (3n = 69): Thể ba chỉ thừa 1 chiếc ở 1 cặp duy nhất; Tam bội là toàn bộ tất cả các cặp đều có 3 chiếc.',
          'Hội chứng Đao là đột biến số lượng NST (thể ba cặp số 21), không phải đột biến gene.',
          'Đồng sinh cùng trứng có cùng kiểu gen và bắt buộc cùng giới tính; đồng sinh khác trứng có kiểu gen khác nhau và có thể cùng hoặc khác giới tính.',
        ],
      },
    },
    {
      id: 'bio-g9-c05',
      chapterNumber: 5,
      title: 'Unit 5 — Công nghệ di truyền, Học thuyết tiến hóa & Nguồn gốc sự sống',
      description: 'Công nghệ tế bào và công nghệ gene GMO, các bằng chứng và cơ chế tiến hóa theo thuyết hiện đại, sự phát sinh sự sống qua 5 đại địa chất (Chương 13 Phần 2 & Chương 14 SGK)',
      lessons: [
        {
          id: 'bio-g9-b13',
          lessonNumber: 13,
          sgkBaiSo: 48,
          title: 'Ứng dụng công nghệ di truyền vào đời sống',
          subtitle: 'Bài 48 SGK: Kĩ thuật nuôi cấy mô tế bào thực vật, nhân bản vô tính động vật và quy trình chuyển gene tạo sinh vật biến đổi gene (GMO)',
          ready: true,
          nodes: [
            {
              id: 'bio-g9-b13-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Công nghệ tế bào & Công nghệ gene',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g9-b13-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Quy trình chuyển gen & Sinh vật GMO',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g9-b14',
          lessonNumber: 14,
          sgkBaiSo: 49,
          title: 'Khái niệm tiến hoá và các hình thức chọn lọc',
          subtitle: 'Bài 49 SGK: Khái niệm tiến hóa, bằng chứng giải phẫu so sánh (cơ quan tương đồng, thoái hóa), hóa thạch, chọn lọc nhân tạo và tự nhiên',
          ready: true,
          nodes: [
            {
              id: 'bio-g9-b14-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Tiến hóa & Các hình thức chọn lọc',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g9-b14-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Bằng chứng tiến hóa & Chọn lọc tự nhiên',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g9-b15',
          lessonNumber: 15,
          sgkBaiSo: 50,
          title: 'Cơ chế tiến hoá',
          subtitle: 'Bài 50 SGK: Thuyết tiến hóa tổng hợp hiện đại, các nhân tố tiến hóa (đột biến, giao phối, chọn lọc tự nhiên) và cơ chế hình thành loài mới',
          ready: true,
          nodes: [
            {
              id: 'bio-g9-b15-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Thuyết tiến hóa tổng hợp hiện đại',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g9-b15-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Nhân tố tiến hóa & Cơ chế hình thành loài',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
        {
          id: 'bio-g9-b16',
          lessonNumber: 16,
          sgkBaiSo: 51,
          title: 'Sự phát sinh và phát triển sự sống trên Trái Đất',
          subtitle: 'Bài 51 SGK: 3 giai đoạn tiến hóa hóa học, tiền sinh học, sinh học và lịch sử sinh giới qua 5 đại địa chất: Thái cổ đến Tân sinh',
          ready: true,
          nodes: [
            {
              id: 'bio-g9-b16-theory',
              nodeIndex: 1,
              title: 'Lý thuyết: Nguồn gốc sự sống & 5 đại địa chất',
              description: '2 phút ghi nhớ',
              type: 'theory',
            },
            {
              id: 'bio-g9-b16-n01',
              nodeIndex: 2,
              title: 'Luyện tập: Lịch sử phát triển sự sống trên Trái Đất',
              description: '8 câu hỏi thực hành',
              type: 'lesson',
            },
          ],
        },
      ],
      guidebook: {
        formulas: [
          {
            label: '1. Quy trình tạo ADN tái tổ hợp trong công nghệ gen:',
            text: 'Tách ADN plasmid & ADN chứa gen cần chuyển → Cắt bằng enzyme cắt giới hạn (restrictase) → Nối bằng enzyme ligase → Chuyển vào tế bào nhận',
          },
          {
            label: '2. Cơ quan tương đồng (Cùng nguồn gốc phát sinh):',
            text: 'Tay người, chi trước của mèo, vây cá voi, cánh của dơi đều có cấu trúc xương chi trước tương đồng, phản ánh sự tiến hóa phân li',
          },
          {
            label: '3. Cơ chế hình thành loài mới:',
            text: 'Loài ban đầu → Phân li tính trạng do đột biến & giao phối → Cách li địa lí / sinh thái → Tích lũy sai khác di truyền → Cách li sinh sản (loài mới)',
          },
          {
            label: '4. Chuỗi 5 đại địa chất theo dòng thời gian lịch sử Trái Đất:',
            text: 'Đại Thái cổ (sinh vật nhân sơ) → Đại Nguyên sinh (tảo, ĐV không xương sống) → Đại Cổ sinh (thực vật lên cạn, cá, lưỡng cư) → Đại Trung sinh (khủng long, hạt trần) → Đại Tân sinh (thú, chim, hạt kín, loài người)',
          },
        ],
        traps: [
          'Phân biệt cơ quan tương đồng (cùng nguồn gốc, khác chức năng: cánh dơi và tay người) với cơ quan tương tự (khác nguồn gốc, cùng chức năng: cánh dơi và cánh bướm).',
          'Chọn lọc tự nhiên không tạo ra các biến dị mới thích nghi; đột biến và giao phối mới là nhân tố phát sinh biến dị, CLTN chỉ làm nhiệm vụ sàng lọc và định hướng.',
          'Trong khí quyển nguyên thủy của Trái Đất thuở sơ khai không có khí oxy (O2); khí oxy chỉ xuất hiện sau khi vi khuẩn lam quang hợp giải phóng ra.',
          'Loài người xuất hiện ở Đại Tân sinh (Kỉ Đệ Tứ - kỉ gần đây nhất), không xuất hiện ở các đại trước.',
        ],
      },
    },
  ],
};
