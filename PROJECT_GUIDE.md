# 🧭 HƯỚNG DẪN DỰ ÁN & ONBOARDING CHO CỘNG TÁC VIÊN (PROJECT GUIDE)

> **Tên dự án:** **Chem-Solve** — Nền tảng Học tập & Luyện thi Khoa học Tự nhiên Tương tác 3D (Hóa học, Vật lý, Sinh học THCS GDPT 2018)  
> **Ngôn ngữ & Nền tảng:** React 19, TypeScript, Vite, TailwindCSS (Token-based), Zustand, Motion, Vitest.  
> **Tài liệu tham chiếu kèm theo:** [AGENTS.md](file:///d:/dow/d%E1%BB%B1%20%C3%A1n%20h%C3%B3a%20h%E1%BB%8Dc%20web/AGENTS.md), [PLAN.md](file:///d:/dow/d%E1%BB%B1%20%C3%A1n%20h%C3%B3a%20h%E1%BB%8Dc%20web/plan.md), [docs/design-bible.md](file:///d:/dow/d%E1%BB%B1%20%C3%A1n%20h%C3%B3a%20h%E1%BB%8Dc%20web/docs/design-bible.md).

---

## 📌 MỤC LỤC
1. [Bối cảnh, Quy mô & Tầm nhìn dự án](#1-bối-cảnh-quy-mô--tầm-nhìn-dự-án)
2. [Cấu trúc Thư mục & Luồng Dữ liệu (Architecture)](#2-cấu-trúc-thư-mục--luồng-dữ-liệu-architecture)
3. [Dự án được xây dựng như thế nào? (How It Works)](#3-dự-án-được-xây-dựng-như-thế-nào-how-it-works)
4. [Chức năng chi tiết từng Module & Màn hình](#4-chức-năng-chi-tiết-từng-module--màn-hình)
5. [Quy chuẩn & Nguyên tắc Bất biến khi Tham gia Code](#5-quy-chuẩn--nguyên-tắc-bất-biến-khi-tham-gia-code)
6. [Quy trình thêm Bài học / Bài tập / Minigame mới](#6-quy-trình-thêm-bài-học--bài-tập--minigame-mới)
7. [Gợi ý Đột phá & Định hướng Phát triển Tiếp theo](#7-gợi-ý-đột-phá--định-hướng-phát-triển-tiếp-theo)

---

## 1. BỐI CẢNH, QUY MÔ & TẦM NHÌN DỰ ÁN

### 1.1. Bối cảnh ra đời
Dự án được phát triển nhằm giải quyết nỗi sợ học các môn Khoa học Tự nhiên (KHTN: Hóa học, Vật lý, Sinh học) của học sinh cấp 2 (Lớp 6, 7, 8, 9) theo bộ sách giáo khoa mới **"Kết nối tri thức với cuộc sống"** (Chương trình GDPT 2018).

Thay vì đọc sách giáo khoa dày đặc chữ và làm bài tập trắc nghiệm nhàm chán, **Chem-Solve** biến quá trình học thành một trò chơi điện tử sinh động (theo chuẩn **Game Feel của Duolingo**):
* Bản đồ học tập ziczac uốn lượn (Snake Path) từng bước chinh phục.
* Nút bấm cơ học 3D dày cộp, âm thanh phản hồi vui nhộn.
* Bộ 3 Linh vật Mascot đại diện cho từng môn (Atom, Leafy, Proton) cổ vũ, biểu cảm 9 sắc thái.
* Phòng thí nghiệm ảo, phân tử, chuỗi ADN, tia sét quang học và các tương tác chạm vuốt thực tế.

### 1.2. Quy mô hiện tại của dự án
* **Đa môn KHTN:** 
  * 🧪 **Hóa học (`chem`):** Trọn bộ Lớp 7, 8, 9 (Chất, Nguyên tử, Phản ứng hóa học, Tính toán Mol, Nồng độ dung dịch, Axit - Bazo - Muối, Hợp chất hữu cơ).
  * 🌿 **Sinh học (`bio`):** 64+ bài học (Tế bào, Đa dạng thế giới sống, Cơ thể người, Trao đổi chất, Di truyền học Mendel, Đột biến gen, Hệ sinh thái).
  * ⚡ **Vật lý (`physics`):** Trọn bộ cơ học, nhiệt học, điện học, quang học, từ học (Lớp 6 đến Lớp 9).
* **Nội dung:** Gần 1,000 bài tập JSON được chuẩn hóa Zod schema + Hệ thống sinh bài tập vô tận (Dynamic Algorithmic Generators).
* **Độ ổn định:** 17 file kiểm thử tự động, **199/199 Unit tests luôn pass 100%**, TypeScript strict-mode không lỗi.

---

## 2. CẤU TRÚC THƯ MỤC & LUỒNG DỮ LIỆU (ARCHITECTURE)

```
dự án hóa học web/
├── public/assets/          # Tài nguyên tĩnh (Sprite, video MP4, PNG trong suốt RGBA)
│   ├── animations/         # Video hiệu ứng nhỏ (medal, confetti, star...)
│   ├── icons/              # Huy hiệu thành tựu, đá quý, tim, lửa streak
│   ├── mascot/             # Bộ ảnh mascot 9 trạng thái (atom-*, bio-*, physics-*)
│   └── roadmap/            # Nốt lộ trình, rương báu, cúp vinh danh
├── scripts/                # Công cụ tự động hóa nội bộ (Python & TS scripts)
│   ├── balance_mcq.py      # Thuật toán cân bằng tỷ lệ đáp án A/B/C/D
│   ├── remove_background.py# Thuật toán flood-fill bóc tách phông nền trắng thành RGBA
│   └── validate-content.ts # Tool kiểm tra tính hợp lệ của toàn bộ file JSON
├── src/
│   ├── chem/               # Thư viện tính toán hóa học thuần (Pure Domain Logic)
│   │   ├── formula.ts      # Xử lý chuỗi công thức ASCII -> HTML/LaTeX
│   │   ├── molarMass.ts    # Bảng nguyên tử khối, tính phân tử khối tự động
│   │   ├── equation.ts     # Phân tích phương trình hóa học
│   │   └── checkBalance.ts # Thuật toán kiểm tra cân bằng PTHH
│   ├── content/            # "KHO DỮ LIỆU NỘI DUNG" (Zero UI code here)
│   │   ├── curriculum.ts   # Cấu trúc môn, khối lớp, chương, mục tiêu đầu ra
│   │   ├── contentLoader.ts# Trình nạp động (Dynamic import), phân đoạn chặng học
│   │   ├── subjects.ts     # Quản lý môn đang chọn (chem, bio, physics)
│   │   ├── exercises/      # File JSON bài tập Hóa học (g6, g7, g8, g9)
│   │   ├── biology/        # File JSON bài tập Sinh học (g6, g7, g8, g9)
│   │   ├── physics/        # File JSON bài tập Vật lý (g6, g7, g8, g9)
│   │   ├── theories/       # Lý thuyết vi mô dạng flashcard trượt
│   │   ├── generators/     # Thuật toán sinh đề vô tận bằng toán học
│   │   ├── kb/             # Knowledge base tra cứu nhanh (hằng số, câu hỏi tốc độ)
│   │   └── schema/         # Zod Schemas (ExerciseSchema, TheorySchema)
│   ├── engine/             # "BỘ NÃO" ĐIỀU KHIỂN & CHẤM ĐIỂM
│   │   ├── checkers/       # Bộ chấm bài độc lập (MCQ, điền số, công thức, ghép cặp...)
│   │   ├── session/        # Session State Machine (Hearts, XP, Streak, Combo, Lời giải)
│   │   └── review/         # Spaced Repetition & Tìm bài tập tương đồng khi sai
│   ├── design-system/      # THƯ VIỆN GIAO DIỆN CHUẨN (Design Tokens & Tactile UI)
│   │   ├── components/     # Button 3D, Mascot, SnakePath, SubjectTrophy, Keyboard...
│   │   └── motion/         # Cấu hình chuyển động Framer Motion tối ưu hiệu năng
│   ├── features/           # TÍNH NĂNG NGƯỜI DÙNG & GAME HÓA
│   │   ├── gamification/   # useUserStore (Zustand: tim, đá quý, XP, streak, cấp độ)
│   │   └── minigames/      # Minigame truyền máu ABO, cân bằng PTHH, ghép thẻ
│   └── app/                # ĐỊNH TUYẾN & CÁC MÀN HÌNH CHÍNH
│       ├── pages/          # Home, Learn, Exercise, Practice, Theory, Shop, Profile...
│       └── routes.tsx      # React Router cấu hình đường dẫn
└── docs/                   # Tài liệu thiết kế & quyết định kiến trúc
    ├── design-bible.md     # Bảng mã màu, font chữ, quy chuẩn cảm giác game
    └── decisions.md        # Nhật ký các quyết định công nghệ quan trọng
```

---

## 3. DỰ ÁN ĐƯỢC XÂY DỰNG NHƯ THẾ NÀO? (HOW IT WORKS)

Nếu bạn là người mới vào xem dự án, bạn sẽ tự hỏi: *"Làm thế nào để hệ thống chạy mượt mà, bài tập đa dạng và giao diện đẹp mắt như vậy?"* Dưới đây là 5 trụ cột kiến trúc:

### 3.1. Trụ cột 1: Triết lý "Zero Hard-code Content"
* Không một dòng code UI nào chứa trực tiếp câu hỏi hay đáp án.
* Mọi bài tập đều nằm ở các file `.exercises.json` trong `src/content/`.
* Khi build hoặc chạy runtime, **Zod Schema** (`src/content/schema/exercise.ts`) sẽ kiểm tra nghiêm ngặt kiểu dữ liệu. Nếu file JSON nào sai chính tả, thiếu gợi ý hoặc sai định dạng đáp án, hệ thống sẽ báo lỗi ngay lập tức trong test suite.

### 3.2. Trụ cột 2: Engine Chấm bài Linh hoạt (Pluggable Checkers)
Mỗi câu hỏi có thuộc tính `answer.kind`. Thư mục `src/engine/checkers/` phân loại từng cơ chế chấm bài riêng biệt:
1. `mcq-single` / `mcq-multi`: Kiểm tra phương án trắc nghiệm, tự động hỗ trợ xáo trộn (shuffle).
2. `number`: Chấm bài toán định lượng, hỗ trợ dung sai tuyệt đối/tương đối (`tolerance`), kiểm tra đơn vị đo (`unit`).
3. `formula`: Chấm công thức hóa học, so sánh tương đương phân tử (ví dụ: `H2O` tương đương `OH2`).
4. `equation`: Chấm cân bằng phương trình hóa học với ma trận hệ số tối giản.
5. `true-false`: Chấm các khẳng định đúng/sai nhiều ý.
6. `match` / `sort` / `ordering`: Chấm ghép cặp thẻ, phân loại vào giỏ, sắp xếp chuỗi quy trình.
7. `formula-builder`: Chấm lắp ghép ô phân tử / chuỗi polynucleotide.

### 3.3. Trụ cột 3: Xáo trộn đáp án Runtime thông minh (MCQ Shuffle)
* Để học sinh không thể "đoán mò đáp án A", khi tải bài vào `ExercisePage.tsx`, thuật toán Fisher-Yates sẽ đảo ngẫu nhiên vị trí các phương án.
* Đồng thời, hệ thống đồng bộ hóa 100% giữa giao diện nút bấm và phím tắt bàn phím (`1, 2, 3, 4` và `A, B, C, D`).

### 3.4. Trụ cột 4: State Machine của Phiên học (`sessionReducer`)
* Trạng thái bài tập được quản lý theo mô hình Reducer chuẩn mực (`src/engine/session/sessionReducer.ts`):
  * `unanswered` ➔ `answering` ➔ `checking` ➔ `correct` / `wrong` / `partial`.
* Lần 1 trả lời đúng: **+10 XP**. Lần 2 đúng: **+6 XP**. Lần 3 đúng: **+3 XP**.
* Làm sai: Trừ 1 Tim (`hearts`), tăng chuỗi sai để kích hoạt gợi ý Level 1 hoặc Level 2 (`HintLadder`).

### 3.5. Trụ cột 5: Game Feel & Thiết kế Riêng biệt theo 3 Môn
* **Hóa học (`chem`):** 
  * Tone màu Cyan / Sky (`#0ea5e9`).
  * Mascot: Giọt nước **Atom**.
  * Cúp vinh danh: Bình chưng cất Alembic vàng.
* **Sinh học (`bio`):** 
  * Tone màu Emerald / Mint (`#10b981`).
  * Mascot: Chú ếch bác sĩ **Leafy**.
  * Cúp vinh danh: Cúp Mầm Cây & Chuỗi xoắn ADN Hoàng Kim (`SubjectTrophy`).
* **Vật lý (`physics`):** 
  * Tone màu Amber / Vàng điện (`#eab308`).
  * Mascot: Mèo kỹ sư **Proton**.
  * Cúp vinh danh: Cúp Hạt Nhân & Quỹ đạo Electron Hoàng Kim (`SubjectTrophy`).

---

## 4. CHỨC NĂNG CHI TIẾT TỪNG MODULE & MÀN HÌNH

### 4.1. Trang Lộ trình Học tập (`LearnPage.tsx` & `SnakePath.tsx`)
* Hiển thị các nốt bài học uốn lượn ziczac từ đầu đến cuối chương.
* Mỗi nốt biểu thị rõ: Đã xong (sao vàng), Đang học (vòng tròn hào quang nhấp nháy), Chưa mở khóa (ổ khóa xám).
* Nốt rương báu (Chest node) ở cuối mỗi chặng: Mở khóa thưởng 50~100 Đá quý.
* Drawer xem trước bài học (`NodePreviewDrawer.tsx`): Xem tóm tắt nội dung và phần thưởng trước khi bắt đầu.

### 4.2. Màn hình Giải bài tập & Thí nghiệm (`ExercisePage.tsx`)
* Màn hình chính nơi học sinh thao tác giải bài.
* Tích hợp thanh máu tim (`Heart.tsx`), điểm XP tích lũy trong phiên, chuỗi Combo Streak nhân đôi điểm số.
* Bàn phím hóa học ảo (`ChemKeyboard.tsx`) & Bàn phím vật lý (`PhysicsKeyboard.tsx`) hỗ trợ gõ nhanh số mũ, chỉ số dưới, mũi tên phản ứng trên điện thoại.
* Khung phản hồi đáy màn hình (`FeedbackSheet.tsx`): Bật lên tức thì khi bấm Kiểm tra với giải thích từng bước (Step-by-step).

### 4.3. Đấu trường Luyện tập & Đề Vô Tận (`PracticePage.tsx`)
* Chế độ **Không giới hạn (Infinite Mode)**: Sinh đề bài ngẫu nhiên bằng công thức toán học (`src/content/generators/`).
* Chế độ **Hồi phục Tim (Heart Recovery)**: Học sinh hết tim có thể vào luyện tập để hồi lại tim miễn phí mà không cần tiêu đá quý.

### 4.4. Thư viện Lý thuyết Cốt lõi (`TheoryPage.tsx`)
* Trình bày lý thuyết theo phong cách Micro-learning (thẻ bài vuốt ngang như Instagram Stories).
* Đọc súc tích trong 2-3 phút, có hình minh họa và câu hỏi mini củng cố kiến thức trước khi làm bài tập.

### 4.5. Cửa hàng Kho báu (`ShopPage.tsx`)
* Tiêu dùng Đá quý (`Gems`) kiếm được từ bài học để:
  * Mua Bình hồi phục tim ngay lập tức.
  * Mua Khiên bảo vệ chuỗi ngày học liên tục (Streak Freeze).
  * Mở Rương bí ẩn (Mystery Chest) nhận quà ngẫu nhiên.

### 4.6. Hồ sơ Cá nhân & Tiến độ (`ProfilePage.tsx`, `ProgressPage.tsx`)
* Thống kê tổng số ngày học liên tục (Streak), tổng XP, độ chính xác trung bình.
* Tủ huy hiệu thành tựu (Achievement Badges): Thợ săn phương trình, Chiến binh Mol, Bậc thầy Combo, v.v.

---

## 5. QUY CHUẨN & NGUYÊN TẮC BẤT BIẾN KHI THAM GIA CODE

Để giữ cho dự án luôn sạch sẽ, dễ bảo trì và không bị phá vỡ kiến trúc, mọi cộng tác viên **BẮT BUỘC** tuân thủ các quy tắc sau:

1. **Không can thiệp CSS bừa bãi (No Ad-hoc CSS):**  
   Chỉ sử dụng design tokens có sẵn trong `index.css` và `docs/design-bible.md`. Không tự ý tạo class CSS cục bộ mỗi trang một kiểu. Muốn tạo style mới, thảo luận để bổ sung vào component dùng chung.
2. **Mobile-First là số 1:**  
   Giao diện phải được thiết kế và kiểm thử trên mobile trước tiên (kích thước 360×640 và 390×844). Tuyệt đối **không dùng `100vh`** (phải dùng `100dvh`), không thiết kế tương tác phụ thuộc vào rê chuột (`:hover`).
3. **Công thức Hóa học bắt buộc lưu dạng ASCII:**  
   Lưu `H2SO4`, `Fe^3+`, `Al2(SO4)3`. Luôn cho render qua component `<Formula text="..." />`. Tuyệt đối không paste ký tự unicode chỉ số dưới (`H₂SO₄`) vào database vì sẽ làm hỏng parser và checker.
4. **Viết Unit Test cho mọi hàm tính toán mới:**  
   Nếu bạn chỉnh sửa hoặc viết thêm logic ở `src/chem/` hoặc `src/engine/`, bạn phải viết/cập nhật test trong file `.test.ts` tương ứng.
5. **Giữ nguyên Quy chuẩn thuật ngữ SGK:**  
   Sử dụng danh pháp chuẩn SGK KNTT: *acid, base, oxide, muối, hydrocarbon, glucose, adenine, thymine...*
6. **Kiểm tra chất lượng trước khi nộp code:**  
   Trước khi tạo commit / pull request, hãy chạy 2 lệnh sau ở terminal:
   ```bash
   npx tsc --noEmit   # Kiểm tra lỗi type (phải ra 0 lỗi)
   npm test           # Chạy toàn bộ 199 tests (phải PASS 100%)
   ```

---

## 6. QUY TRÌNH THÊM BÀI HỌC / BÀI TẬP / MINIGAME MỚI

### 6.1. Cách thêm câu hỏi vào bài học có sẵn
1. Mở file JSON của bài tương ứng (ví dụ: `src/content/biology/g8/unit-1-.../bio-g8-b02.exercises.json`).
2. Thêm một đối tượng câu hỏi với cấu trúc chuẩn:
   ```json
   {
     "id": "bio-g8-b02-q09",
     "lessonId": "bio-g8-b02",
     "skillIds": ["co-the-nguoi", "tieu-hoa"],
     "difficulty": 2,
     "prompt": "Enzyme amylase trong nước bọt có vai trò biến đổi chất nào sau đây?",
     "answer": {
       "kind": "mcq-single",
       "options": [
         { "id": "opt-a", "label": "Biến đổi tinh bột chín thành đường maltose" },
         { "id": "opt-b", "label": "Phân giải protein thành các acid amin" },
         { "id": "opt-c", "label": "Nhũ tương hóa chất béo (lipid)" },
         { "id": "opt-d", "label": "Chuyển hóa cellulose thành glucose" }
       ],
       "correctId": "opt-a"
     },
     "hints": [
       { "level": 1, "text": "Hãy nhớ lại cảm giác nhai kĩ cơm trắng một lúc trong miệng, bạn sẽ thấy vị ngọt." },
       { "level": 2, "text": "Amylase chuyên xúc tác thủy phân liên kết trong carbohydrate/tinh bột." }
     ],
     "steps": [
       {
         "kind": "knowledge",
         "title": "Kiến thức trọng tâm",
         "body": "Nước bọt chứa enzyme amylase giúp tiêu hóa một phần tinh bột chín thành đường đôi maltose."
       },
       {
         "kind": "answer",
         "title": "Kết luận",
         "body": "Phương án chính xác là biến đổi tinh bột chín thành đường maltose."
       }
     ],
     "finalSolution": "Enzyme **amylase** tiêu hóa một phần tinh bột chín thành đường maltose ở khoang miệng."
   }
   ```
3. Chạy `npm test` để kiểm chứng Zod schema tự động xác thực bài viết của bạn.

---

## 7. GỢI Ý ĐỘT PHÁ & ĐỊNH HƯỚNG PHÁT TRIỂN TIẾP THEO

Dành cho các bạn cộng tác viên muốn đóng góp những tính năng lớn mang lại giá trị cao cho dự án:

### 💡 1. Phòng Thí nghiệm Ảo Tương tác (Interactive Virtual Lab - PhET Style)
* **Ý tưởng:** Xây dựng một màn hình cho phép học sinh tự nhấp chuột nhỏ giọt axit HCl vào ống nghiệm chứa mẩu kẽm Zn để thấy bọt khí H₂ sủi lên theo thời gian thực (dùng Canvas/SVG).
* **Vị trí tích hợp:** Thêm vào nốt đặc biệt trên lộ trình SnakePath (`type: 'lab'`).

### 💡 2. Trợ lý Sư phạm Thông minh (AI Smart Step Hint)
* **Ý tưởng:** Khi học sinh làm sai 2 lần liên tiếp, thay vì chỉ hiện gợi ý chung, hệ thống phân tích câu trả lời sai của học sinh (ví dụ quên nhân đôi hệ số, quên tính oxi trong nước) để đưa ra câu nhắc nhở đúng ngay "tim đen" của lỗi sai đó.

### 💡 3. Chế độ Thi đấu Đối kháng Thời gian thực (1v1 Live Science Battle)
* **Ý tưởng:** Sử dụng WebSockets hoặc Supabase Realtime, ghép cặp 2 bạn học sinh cùng giải 5 câu đố KHTN trong 60 giây. Bạn nào vừa nhanh vừa chính xác sẽ đẩy lùi linh vật của đối thủ và giành Cúp xếp hạng tuần.

### 💡 4. Đóng gói Ứng dụng Di động & Offline PWA (Mobile & Offline Mode)
* **Ý tưởng:** Cấu hình Service Worker và IndexedDB lưu trữ toàn bộ dữ liệu bài học để học sinh vùng khó khăn không có mạng internet vẫn mở điện thoại lên làm bài tập bình thường. Có thể đóng gói qua Capacitor để phát hành lên Google Play Store.

### 💡 5. Hiệu ứng Âm thanh & Lồng tiếng Mascot (Voice Acting Clips)
* **Ý tưởng:** Thu âm các đoạn lồng tiếng ngắn, hài hước, dễ thương cho 3 linh vật Atom, Leafy, Proton ("Quá đỉnh!", "Cố lên bạn ơi, chỉ một chút nữa thôi!") để tăng cường kết nối cảm xúc với học sinh nhỏ tuổi.

---

> **Lời kết:**  
> Dự án này chứa đựng rất nhiều tâm huyết về sư phạm và công nghệ. Bất kỳ sự đóng góp nào của bạn — từ sửa một lỗi chính tả nhỏ trong đề bài đến viết một tính năng mô phỏng phức tạp — đều góp phần giúp hàng triệu học sinh Việt Nam yêu thích môn Khoa học hơn mỗi ngày.  
> **Chào mừng bạn gia nhập đội ngũ phát triển Chem-Solve! 🚀**
