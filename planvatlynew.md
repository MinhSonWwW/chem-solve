# TÀI LIỆU KIẾN TRÚC, LOGIC & ĐẶC TẢ KỸ THUẬT TOÀN DIỆN DỰ ÁN KHTN (HÓA HỌC & VẬT LÝ)

> **Dự án:** STEM-Solve (Tiền thân: Chem-Solve)  
> **Phiên bản kiến trúc:** v2.5 (Hỗ trợ đa môn học: Hóa học & Vật lý THCS Lớp 6 - 9)  
> **Mục tiêu:** Nền tảng web game hóa (gamified interactive learning) mô phỏng trải nghiệm học tập đỉnh cao theo tinh thần Duolingo: giải bài từng bước (scaffolding 7 bước), phản hồi tức thì, bắt lỗi sai kinh điển (deterministic trap detection), minigame tương tác, và hệ sinh thái gamification (XP, Streak đèn cồn, Tim ống nghiệm, Huy hiệu, Level).

---

## 1. TỔNG QUAN KIẾN TRÚC HỆ THỐNG & TẦM NHÌN CỐT LÕI

### 1.1. Triết lý thiết kế (Design Philosophy)
- **Interactive Scaffolding:** Không bao giờ quăng bài giải dài dòng cho học sinh đọc thụ động. Mỗi bài toán là một chuỗi tương tác có định hướng: `Nhận dạng → Dữ kiện → Kiến thức/Công thức → Biến đổi/Phương trình → Tính toán → Kết luận → Phân tích bẫy sai`.
- **Zero-AI Deterministic Feedback:** Mọi phản hồi, chấm điểm, chẩn đoán lỗi sai (`trapAnswers`) đều dựa trên logic toán học, quy tắc hóa lý chặt chẽ và bộ kiểm tra hình thức (Deterministic Checkers) có kiểm soát 100%, không phụ thuộc vào AI sinh chữ tự do, loại bỏ hoàn toàn hiện tượng ảo giác (hallucination).
- **Separation of Concerns:** 
  - Tầng dữ liệu bài tập (`src/content/`) hoàn toàn độc lập với UI.
  - Tầng tính toán hóa - lý cốt lõi (`src/chem/`, `src/engine/`) là **thuần TypeScript**, không phụ thuộc React, có thể chạy trên browser, node hoặc worker.
  - Tầng giao diện (`src/app/`, `src/design-system/`) chỉ làm nhiệm vụ render trạng thái dựa trên State Machine.
- **Mobile-First & Touch-Native:** 100% chức năng thiết kế ưu tiên màn hình điện thoại (360×640 và 390×844), sử dụng đơn vị `100dvh`, chừa `safe-area`, bàn phím ảo chuyên dụng (`ChemKeyboard`, `PhysicsKeyboard`), cơ chế kéo thả luôn đi kèm **chạm để chọn (tap-to-place)**.

---

## 2. NGÔN NGỮ LẬP TRÌNH & STACK CÔNG NGHỆ (TECH STACK)

| Phân hệ | Công nghệ lựa chọn | Phiên bản | Lý do & Vai trò kỹ thuật |
|---|---|---|---|
| **Ngôn ngữ nền tảng** | **TypeScript (Strict Mode)** | `^5.x` | Ép kiểu chặt chẽ toàn hệ thống (`strict: true`, `noImplicitAny: true`), ngăn ngừa lỗi runtime ở các tầng chấm điểm và xử lý công thức. |
| **Giao diện (Frontend)** | **React** | `^19.0.0` | Thư viện UI reactive, tối ưu hóa component rendering qua hooks (`useMemo`, `useCallback`), hỗ trợ Server Components/Transitions. |
| **Công cụ đóng gói** | **Vite** | `^6.x` | Build tool thế hệ mới với HMR (Hot Module Replacement) siêu tốc, phân tách bundle theo dynamic import per lesson JSON. |
| **Điều hướng (Routing)** | **React Router** | `^7.2.0` | Quản lý route SPA (`/learn/:grade`, `/play/:lessonId/:nodeId`, `/theory/:lessonId`, `/practice`, `/profile`...). |
| **Quản lý trạng thái** | **Zustand** | `^5.x` | Store nhẹ, không boilerplate, quản lý Gamification State (`useUserStore`), tiến độ học tập, tim, kim cương, streak. |
| **Validation Schema** | **Zod** | `^3.x` | Nguồn chân lý duy nhất (Single Source of Truth) định nghĩa cấu trúc câu hỏi, lời giải, lý thuyết; tự động sinh Type definitions. |
| **Hiệu ứng chuyển động** | **Motion (Framer Motion)** | `^12.x` | Layout animations, Spring transitions, Sheet trượt đáy, Banner combo, rung lắc khi sai, nảy khi đúng. |
| **Kéo thả tương tác** | **@dnd-kit** | `^6.x` / `^10.x` | Kéo thả thẻ bài tập, ghép đôi, phân loại (Sort/Match), hỗ trợ đồng thời Touch, Mouse và Keyboard sensor a11y. |
| **Xử lý âm thanh** | **Howler.js** | `^2.2.4` | Tải và phát âm thanh tương tác theo audio sprite, tự động unlock âm thanh trên iOS Safari ở lần chạm đầu tiên. |
| **Styling & Design Tokens** | **Tailwind CSS + Vanilla CSS** | `^3.x` | Hệ thống tokens thiết kế chuẩn hóa tại `tokens.css`, bảng màu chunky game-lab, shadow đáy dày 3D. |
| **Biểu tượng (Icons)** | **Lucide React** | `^0.475.0` | Bộ icon SVG tối ưu, sắc nét, đồng bộ phong cách. |
| **Tìm kiếm nội bộ** | **MiniSearch** | `^7.1.2` | Engine tìm kiếm full-text tĩnh trên client, đánh chỉ mục tên chất, công thức, dạng bài, định luật vật lý. |
| **Lưu trữ dữ liệu** | **IndexedDB (`idb-keyval`) + LocalStorage** | `^6.x` | Lưu trữ lịch sử hàng nghìn lần làm bài (attempts), đồng bộ cài đặt cá nhân, hoạt động 100% offline. |
| **Kiểm thử tự động** | **Vitest + Playwright** | `^3.x` | Unit test cho Core/Checkers (coverage yêu cầu ≥ 90%) và E2E test cho luồng học tập chính trên mobile viewport. |

---

## 3. CẤU TRÚC THƯ MỤC TOÀN BỘ DỰ ÁN (PROJECT DIRECTORY TREE)

```text
chem-solve/
├── index.html                       # Entry HTML chính, cấu hình viewport mobile 100dvh, font Nunito
├── package.json                     # Quản lý dependencies, scripts chuẩn (dev, build, test, validate:content)
├── tsconfig.json                    # Cấu hình TypeScript compiler (Strict, Path Aliases @/*)
├── vite.config.ts                   # Cấu hình Vite, alias, tối ưu hóa chunk JSON lazy loading
├── PLAN.md                          # Master Plan gốc của dự án Hóa học
├── planvatly.md                     # Tài liệu kiến trúc & đặc tả toàn diện (file này)
├── AGENTS.md                        # Quy tắc bắt buộc cho AI Agent
│
├── art/                             # Asset đồ họa gốc
│   ├── source/                      # Sprite sheets gốc (Sheet 1: Cards/Trays, Sheet 2: Buttons/Stats, Sheet 3: VFX)
│   └── prompts/                     # Prompt tạo ảnh và tư liệu thiết kế
│
├── scripts/                         # Automation & Validation scripts
│   ├── validate-content.ts          # Quét và kiểm tra 100% tính toàn vẹn của JSON bài tập và lý thuyết qua Zod
│   ├── slice-sprites.ts             # Tự động cắt sprite sheet thành các file webp độc lập
│   └── generate-asset.ts            # Script sinh asset đồng bộ
│
├── public/
│   └── assets/                      # Asset tĩnh phục vụ client
│       ├── audio/                   # Sprite audio: click, correct, wrong, level-up, streak, reward
│       ├── fonts/                   # Font Nunito tiếng Việt self-hosted
│       ├── mascot/                  # Hình ảnh mascot ở 9 trạng thái cảm xúc
│       └── sprites/                 # Các sprite webp đã cắt kèm manifest.json
│
└── src/                             # TOÀN BỘ MÃ NGUỒN CHÍNH
    ├── main.tsx                     # Entry code, render React Root vào DOM
    │
    ├── app/                         # TẦNG ỨNG DỤNG, TRANG & BỐ CỤC (PAGES & LAYOUTS)
    │   ├── App.tsx                  # Root component chứa Router, ErrorBoundary, Audio Unlocker
    │   ├── layout/                  # Bố cục giao diện
    │   │   ├── AppLayout.tsx        # Shell chính: Sidebar (desktop), TopBar, Mobile BottomNav
    │   │   ├── Navbar.tsx           # Header hiển thị Cờ môn học, Lớp, Tim, Streak, Kim cương
    │   │   ├── Sidebar.tsx          # Thanh điều hướng trái màn hình desktop
    │   │   └── MobileNav.tsx        # Thanh tab bar cố định đáy màn hình điện thoại
    │   └── pages/                   # Các màn hình chính của ứng dụng
    │       ├── HomePage.tsx         # Trang chủ: Mục tiêu ngày, tiếp tục chặng, bảng tin
    │       ├── LearnPage.tsx        # Bản đồ lộ trình SnakePath (cột sống của app, chọn lớp, chọn môn)
    │       ├── ExercisePage.tsx     # Màn hình giải bài tập tương tác (Runner làm bài)
    │       ├── TheoryPage.tsx       # Màn hình sổ tay lý thuyết tóm tắt 2 phút
    │       ├── PracticePage.tsx     # Luyện tập tự do không tính tim theo từng chủ đề
    │       ├── ProgressPage.tsx     # Thống kê cá nhân: Biểu đồ kỹ năng, điểm mạnh/yếu
    │       ├── ProfilePage.tsx      # Hồ sơ, huy hiệu thành tựu, đổi avatar mascot, cài đặt
    │       ├── DailyPage.tsx        # Thử thách hàng ngày duy trì chuỗi Streak
    │       ├── GamesPage.tsx        # Kho Minigames tương tác củng cố kiến thức
    │       ├── ShopPage.tsx         # Cửa hàng vật phẩm: Mua tim, đóng băng streak, trang phục mascot
    │       └── DesignSystemPage.tsx # Thư viện dev xem trước tất cả UI components và trạng thái
    │
    ├── content/                     # TẦNG DỮ LIỆU & NỘI DUNG (CONTENT & KNOWLEDGE BASE)
    │   ├── subjects.ts              # Quản lý danh mục môn (Hóa, Lý, Sinh), màu sắc, icon, activeSubject
    │   ├── contentLoader.ts         # Module nạp động (Dynamic Loader) tải bài tập JSON khi vào chặng
    │   ├── curriculum.ts            # Unified Registry: getCurriculum(grade, subject), findLesson
    │   ├── curriculum/              # Phân phối chương trình chi tiết
    │   │   ├── types.ts             # Grade, NodeInfo, Lesson, Chapter, GradeCurriculum
    │   │   ├── chem.ts              # Cây bài học Hóa học Lớp 6 - 9 (Kết nối tri thức)
    │   │   └── physics.ts           # Khung chương trình Vật lý Lớp 6 - 9 (Cơ, Nhiệt, Điện, Quang)
    │   ├── schema/                  # Zod Schemas xác thực cấu trúc
    │   │   ├── exercise.ts          # Schema bài tập: Given, Find, Knowledge, Answer, Hints, Steps, Pitfalls
    │   │   └── theory.ts            # Schema sổ tay lý thuyết: Tóm tắt, công thức, ví dụ mẫu
    │   ├── kb/                      # Kho tri thức chuẩn hóa (Knowledge Base)
    │   │   ├── chem/                # periodic-table.json, ions.json, substances.json, reactions.json...
    │   │   └── physics/             # constants.json (g, c, D_nuoc), formulas.json, units.json
    │   ├── exercises/               # Ngân hàng câu hỏi lưu theo JSON từng bài
    │   │   ├── g6/ ... g9/          # Bài tập Hóa học (VD: g8-b03.json, g9-b26.json)
    │   │   └── physics/             # Bài tập Vật lý (phy-g6-b01.json, phy-g8-b01.json...)
    │   ├── theories/                # Tóm tắt lý thuyết theo từng bài
    │   │   ├── g6/ ... g9/          # Lý thuyết Hóa học
    │   │   └── physics/             # Lý thuyết Vật lý
    │   └── generators/              # Trình sinh bài toán tự động bằng thuật toán (Mol, Thể tích, Nồng độ...)
    │
    ├── chem/                        # TẦNG CORE TÍNH TOÁN HÓA HỌC (THUẦN TS - KHÔNG IMPORT REACT)
    │   ├── parseFormula.ts          # Parser phân tích công thức hóa học: Ca(OH)2 -> { Ca: 1, O: 2, H: 2 }
    │   ├── molarMass.ts             # Tính nguyên tử khối, phân tử khối theo periodic-table
    │   ├── equation.ts              # Cân bằng và kiểm tra phản ứng hóa học, tính toán chênh lệch nguyên tử
    │   ├── normalize.ts             # Chuẩn hóa Unicode subscript/superscript về ASCII chuẩn
    │   └── rich-text.ts             # Trình xử lý chuỗi markup: [[H2SO4]], [[Fe^3+]], [[->]], [[up]]...
    │
    ├── engine/                      # ĐỘNG CƠ XỬ LÝ GAME & BÀI TẬP (GAME ENGINE)
    │   ├── session/                 # State Machine của phiên làm bài
    │   │   ├── sessionReducer.ts    # Reducer xử lý chuyển trạng thái câu hỏi, tính điểm, khóa nút
    │   │   └── types.ts             # Trạng thái: UNANSWERED, ANSWERING, CHECKING, CORRECT, WRONG...
    │   ├── checkers/                # Hệ thống chấm điểm hình thức (Deterministic Checkers)
    │   │   ├── types.ts             # Verdict: 'correct' | 'partial' | 'incorrect'
    │   │   ├── numericChecker.ts    # Chấm bài toán số học, chấp nhận dấu chấm/phẩy, kiểm tra đơn vị, sai số
    │   │   ├── formulaChecker.ts    # Chấm công thức cấu trúc (H2O == OH2 về chất nhưng báo canonical)
    │   │   ├── equationChecker.ts   # Chấm cân bằng phương trình phản ứng
    │   │   ├── choiceChecker.ts     # Chấm trắc nghiệm 1 đáp án, nhiều đáp án, đúng/sai
    │   │   ├── matchChecker.ts      # Chấm ghép đôi thẻ bài
    │   │   ├── sortChecker.ts       # Chấm phân loại theo nhóm/thùng chứa
    │   │   └── orderingChecker.ts   # Chấm sắp xếp các bước theo thứ tự
    │   ├── progress/                # Quản lý tiến trình và lưu trữ
    │   │   ├── storage.ts           # Giao tiếp IndexedDB & LocalStorage
    │   │   └── types.ts             # Interface Attempt, UserStats, ProgressData
    │   └── review/                  # Thuật toán ôn tập ngắt quãng (Spaced Repetition)
    │       ├── leitner.ts           # Hệ thống hộp Leitner 5 cấp độ (1, 2, 4, 7, 14 ngày)
    │       └── weak-topics.ts       # Tự động phát hiện chủ đề/kỹ năng yếu cần ôn tập
    │
    ├── design-system/               # HỆ THỐNG GIAO DIỆN & COMPONENT NỀN TẢNG (CHUNKY LAB UI)
    │   ├── tokens.css               # Biến CSS tokens: Màu sắc, bán kính góc, shadow 3D đáy dày, spacing
    │   ├── index.ts                 # Export tập trung các component
    │   ├── components/              # Các UI components tái sử dụng
    │   │   ├── Button.tsx           # Nút bấm chunky 3D có hiệu ứng nhấn xuống (active:translate-y-1)
    │   │   ├── Card.tsx             # Khung thẻ nội dung, viền bo dày
    │   │   ├── Progress.tsx         # Thanh tiến trình ống đong hóa nghiệm
    │   │   ├── Heart.tsx            # Chỉ số tim (ống nghiệm chứa chất lỏng đỏ)
    │   │   ├── Streak.tsx           # Chỉ số ngọn lửa đèn cồn bền bỉ
    │   │   ├── XPBadge.tsx          # Huy hiệu điểm kinh nghiệm tinh thể muối
    │   │   ├── GemBadge.tsx         # Huy hiệu kim cương xanh
    │   │   ├── Formula.tsx          # Render công thức toán - lý - hóa đẹp mắt có thẻ sub/sup
    │   │   ├── FeedbackSheet.tsx    # Bảng trượt đáy báo Đúng (Xanh)/Sai (Đỏ)/Gần đúng (Vàng)
    │   │   ├── Mascot.tsx           # Nhân vật đại diện tương tác ở 9 biểu cảm
    │   │   ├── SnakePath.tsx        # Bản đồ chặng học uốn lượn phong cách Duolingo
    │   │   ├── ChemKeyboard.tsx     # Bàn phím hóa học: Nguyên tố, số dưới, mũi tên phản ứng
    │   │   ├── PhysicsKeyboard.tsx  # Bàn phím vật lý: Đơn vị (Ω, V, A, W, J, N), số mũ, delta, căn
    │   │   ├── HintLadder.tsx       # Thang hỗ trợ 3 nấc: Gợi ý 1 -> Gợi ý 2 -> Xem lời giải
    │   │   ├── answers/             # Các bảng nhập liệu tương ứng từng loại câu hỏi
    │   │   │   ├── McqPanel.tsx     # Trắc nghiệm chọn đáp án
    │   │   │   ├── TrueFalsePanel.tsx # Chọn Đúng / Sai
    │   │   │   ├── NumberInput.tsx  # Ô nhập số kèm đơn vị vật lý/hóa học
    │   │   │   ├── FormulaInput.tsx # Ô nhập công thức
    │   │   │   ├── MatchGrid.tsx    # Lưới ghép nối cặp tương ứng
    │   │   │   ├── OrderingList.tsx # Danh sách kéo sắp xếp thứ tự
    │   │   │   ├── SortPanel.tsx    # Bảng phân loại thả vào các thùng
    │   │   │   └── EquationInput.tsx # Ô điền hệ số cân bằng phương trình
    │   │   └── modals/              # Các cửa sổ tương tác
    │   │       ├── QuitModal.tsx    # Hộp thoại cảnh báo mất tiến trình khi bỏ dở bài
    │   │       ├── OutOfHeartsModal.tsx # Hộp thoại thông báo hết tim & chuyển chế độ ôn luyện
    │   │       ├── HeartRefillModal.tsx # Hộp thoại hồi tim bằng kim cương
    │   │       ├── ChapterGuideModal.tsx # Hướng dẫn mục tiêu của chương học
    │   │       └── SubjectSelectorModal.tsx # Hộp thoại chọn chuyển đổi môn học (Hóa/Lý/Sinh)
    │   └── motion/                  # Cấu hình Spring & Animations
    │       ├── presets.ts           # Thông số Spring chuẩn: bouncy, gentle, snappy
    │       └── useReducedMotion.ts  # Tôn trọng thiết lập giảm chuyển động trên thiết bị
    │
    ├── features/                    # CÁC TÍNH NĂNG MỞ RỘNG (FEATURES)
    │   ├── gamification/            # Logic điểm thưởng, streak, cấp độ
    │   │   └── useUserStore.ts      # Zustand Store quản lý trạng thái tài khoản người dùng
    │   ├── minigames/               # Các trò chơi mini củng cố phản xạ
    │   │   ├── BalanceGame.tsx      # Minigame cân bằng phương trình tốc độ cao
    │   │   ├── MatchSubstanceGame.tsx # Minigame ghép nối chất và tính chất
    │   │   └── FormulaBuilderGame.tsx # Minigame lắp ráp công thức từ các ion
    │   └── search/                  # Tìm kiếm thông minh
    │       └── searchEngine.ts      # Tìm kiếm đa thuộc tính (tên chất, công thức, định luật)
    │
    ├── copy/                        # TOÀN BỘ VĂN BẢN TRÊN GIAO DIỆN (I18N)
    │   └── vi.ts                    # Copy tiếng Việt chuẩn hóa, văn phong khích lệ, tích cực
    └── lib/                         # THƯ VIỆN TIỆN ÍCH DÙNG CHUNG
        └── audio.ts                 # Trình điều khiển âm thanh toàn ứng dụng (Sound Manager)
```

---

## 4. MÔ HÌNH DỮ LIỆU & SCHEMA CHI TIẾT (DATA MODELS & SCHEMAS)

Hệ thống dùng **Zod** làm nguồn sự thật (Single Source of Truth). Mọi bài tập viết ra đều phải validate qua schema này mới được nạp vào ứng dụng.

### 4.1. Quy ước đặt mã định danh (ID Naming Convention)
Nhằm phục vụ kiến trúc đa môn, quy tắc ID được định nghĩa chặt chẽ để **không bao giờ xảy ra va chạm dữ liệu**:
- **Môn học (Subject):** `chem` | `physics` | `bio` *(lưu ý: `bio` mới chỉ là placeholder trong enum để dành chỗ, chưa có thư mục `content/`, `kb/`, `exercises/`, `theories/` nào được triển khai — không tự tạo scaffold cho Sinh học khi chưa có yêu cầu cụ thể)*.
- **Mã bài học (Lesson ID):**
  - Môn Hóa học: `g{lớp}-b{số bài 2 chữ số}` (Ví dụ: `g8-b03`, `g9-b26`) — **giữ nguyên không đổi** vì đã có bài thật đang dùng quy ước này.
  - Môn Vật lý: `phy-g{lớp}-b{số bài 2 chữ số}` (Ví dụ: `phy-g6-b01`, `phy-g8-b05`)
  - **QUY TẮC BẮT BUỘC cho mọi môn học thêm sau này (kể cả Sinh học):** phải có prefix riêng biệt (như `phy-`, ví dụ Sinh sẽ là `bio-g8-b01`). Hóa học là ngoại lệ lịch sử duy nhất được phép không-prefix; **không được tạo thêm môn nào khác không-prefix**, để đảm bảo tính "không va chạm" thực sự đúng như cam kết, chứ không chỉ đúng tình cờ.
- **Mã chặng/nút học (Node ID):**
  - Lý thuyết: `{lessonId}-theory` (Ví dụ: `g8-b03-theory`, `phy-g8-b05-theory`)
  - Chặng luyện tập: `{lessonId}-n{số chặng 2 chữ số}` (Ví dụ: `g8-b03-n01`, `phy-g8-b05-n02`)
  - Thử thách Boss chương: `{lessonId}-boss`
  - Rương kho báu: `{lessonId}-chest`
- **Mã câu hỏi (Exercise ID):**
  - `{lessonId}-{loại câu}-{số thứ tự 3 chữ số}` (Ví dụ: `g8-b03-calc-001`, `phy-g8-b05-mcq-002`)

---

### 4.2. Schema Bài Tập Chuẩn (`src/content/schema/exercise.ts`)

Mỗi bài tập gồm đầy đủ thông số cho cả chế độ giải nhanh (Quick Mode) và chế độ hướng dẫn từng bước (Guided Mode):

```typescript
export interface Exercise {
  id: string;                         // "phy-g8-b05-calc-001"
  lessonId: string;                   // "phy-g8-b05"
  skillIds: string[];                 // Taxonomy kỹ năng: ["ohm-law", "calc-resistance"]
  difficulty: 1 | 2 | 3;              // 1: Dễ (Nhận biết) | 2: Trung bình (Thông hiểu) | 3: Nâng cao (Vận dụng)
  prompt: string;                     // Đề bài (hỗ trợ RichText [[...]])
  
  // Dữ kiện đã cho và đại lượng cần tìm (dùng cho thanh tóm tắt đề)
  given?: { label: string; value: string; unit?: string }[];
  find?: { label: string; unit?: string };
  
  // Liên kết đến Knowledge Base
  knowledge: string[];                // ["formula.I=U/R", "constant.g_earth"]
  
  // Kiểu đáp án và nội dung chấm
  answer: Answer;
  
  // Thang gợi ý 2 cấp độ
  hints: [
    { level: 1; text: string },       // Gợi mở hướng tư duy
    { level: 2; text: string }        // Nhắc lại chính xác công thức / định luật
  ];
  
  // Lời giải từng bước chuẩn 7 bước
  steps: SolutionStep[];
  finalSolution: string;              // Lời giải tóm tắt nhanh đóng khung
  
  // Bộ chẩn đoán lỗi sai kinh điển (Trap Detection - Cốt lõi của app)
  commonMistakes: {
    id: string;                       // "forgot-unit-convert"
    message: string;                  // "Bạn quên đổi km/h sang m/s trước khi tính!"
    trapAnswers?: string[];           // ["54", "54 m/s"] -> Học sinh nhập trúng số này sẽ kích hoạt thông báo trên
  }[];
  
  visual?: {
    type: 'image' | 'diagram' | 'circuit' | 'sprite';
    src: string;
  };
}

export interface SolutionStep {
  kind: 'identify' | 'given' | 'knowledge' | 'equation' | 'compute' | 'answer' | 'pitfalls';
  title: string;                      // "Bước 1: Tóm tắt dữ kiện"
  body: string;                       // Nội dung phân tích
  interactive?: {                     // Dùng cho chế độ Guided Step-by-Step
    prompt: string;
    options: string[];
    correctIndex: number;
  };
}
```

---

### 4.3. Các Kiểu Trả Lời Được Hỗ Trợ (`Answer` Types)

```typescript
export type Answer =
  // 1. Trắc nghiệm 1 đáp án
  | { kind: 'mcq-single'; options: { id: string; text: string }[]; correctId: string }
  // 2. Trắc nghiệm nhiều đáp án
  | { kind: 'mcq-multi'; options: { id: string; text: string }[]; correctIds: string[] }
  // 3. Nhận định Đúng / Sai
  | { kind: 'true-false'; statements: { id: string; text: string; correct: boolean }[] }
  // 4. Bài toán số đo (Toán Lý / Bài tập Mol Hóa)
  | { kind: 'number'; value: number; unit?: string; decimals?: number; tolerance?: { abs?: number; rel?: number } }
  // 5. Điền công thức (Hóa học / Vật lý)
  | { kind: 'formula'; accepted: string[] }
  // 6. Nhập văn bản / Tên gọi
  | { kind: 'text'; accepted: string[]; lenientDiacritics?: boolean }
  // 7. Cân bằng phương trình hóa học
  | { kind: 'equation'; mode: 'fill-coefficients' | 'build'; reactants: string[]; products: string[]; coefficients: number[] }
  // 8. Ghép đôi cặp thẻ (Match)
  | { kind: 'match'; pairs: { left: string; right: string }[] }
  // 9. Phân loại vào các nhóm (Sort)
  | { kind: 'sort'; buckets: { id: string; label: string }[]; items: { id: string; label: string; bucketId: string }[] }
  // 10. Sắp xếp thứ tự các bước (Ordering)
  | { kind: 'ordering'; correctOrder: string[] };
```

---

## 5. CORE ENGINE & LOGIC VẬN HÀNH (EXECUTION LOGIC)

### 5.1. Cỗ máy trạng thái của phiên làm bài (Session State Machine)

Mỗi buổi học một chặng (Node Session) được điều khiển bởi một `sessionReducer` thuần túy, đảm bảo chuyển trạng thái hợp lệ, chống gian lận và chống bấm đúp:

```text
 ┌────────────────────────────────────────────────────────┐
 │                    [UNANSWERED]                        │ ◄── Bắt đầu câu hỏi mới
 └──────────────────────────┬─────────────────────────────┘
                            │ (Người dùng bắt đầu chọn / nhập)
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │                    [ANSWERING]                         │
 └──────────────────────────┬─────────────────────────────┘
                            │ Bấm nút "KIỂM TRA" (Check)
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │                    [CHECKING]                          │ ◄── Khóa toàn bộ input & nút bấm
 └──────────┬───────────────────────┬───────────────────┬─┘
            │ Đúng                  │ Gần đúng          │ Sai
            ▼                       ▼                   ▼
 ┌─────────────────────┐  ┌──────────────────┐  ┌─────────────────────┐
 │     [CORRECT]       │  │    [PARTIAL]     │  │       [WRONG]       │
 └──────────┬──────────┘  └─────────┬────────┘  └──────────┬──────────┘
            │                       │                      │
            ▼                       ▼                      ▼
 ┌────────────────────────────────────────────────────────────────────┐
 │                          [FEEDBACK]                                │ ◄── Hiện Bottom Feedback Sheet
 │            (Âm thanh, Mascot cảm xúc, XP nảy — luôn hiện            │     cho CẢ 3 verdict, không chỉ CORRECT
 │             dù đúng/gần đúng/sai, nội dung khác nhau theo verdict)  │
 └───────────┬───────────────────────┬───────────────────┬────────────┘
             │ (từ CORRECT)          │ (từ PARTIAL,       │ (từ WRONG)
             │                       │  còn lượt sửa*)     │
             ▼                       ▼                     ▼
   ┌──────────────────┐   ┌──────────────────────┐   Còn lượt (<3) & còn tim?
   │ Sang câu tiếp /   │   │ Quay lại [ANSWERING] │        ├─ Có ──► Quay lại [ANSWERING]
   │ SESSION_COMPLETE  │   │ (chỉ 1 lần sửa miễn  │        │        (kèm phân tích trapAnswers)
   └──────────────────┘   │  phí* cho PARTIAL,    │        └─ Không (hết 3 lượt hoặc bấm
                          │  lần sau tính WRONG)   │           "Xem lời giải") ──► [REVEALED]
                          └──────────────────────┘                                    │
                                                                                       ▼
                                                                         Sang câu tiếp / SESSION_COMPLETE

 * Quy tắc trừ tim: chỉ trừ 1 tim tại LẦN SAI ĐẦU TIÊN của mỗi câu. Các lượt thử lại
   tiếp theo trong cùng câu đó (lượt 2, lượt 3) KHÔNG trừ thêm tim — chỉ giảm dần XP
   thưởng theo bảng 7.1 (+10 → +6 → +3). Điều này tránh việc một câu khó "ăn" tới
   3 tim (60% máu) chỉ trong một câu, đồng thời PARTIAL chỉ được sửa miễn phí 1 lần
   để tránh học sinh cố tình trả lời thiếu nhằm né hệ thống trừ tim.
```

---

### 5.2. Nguyên tắc hoạt động của các bộ chấm điểm (Checkers)

1. **`numericChecker` (Dùng cho cả Hóa tính toán & Vật lý tính toán):**
   - Hỗ trợ cả dấu phẩy thập phân kiểu Việt Nam (`12,5`) lẫn dấu chấm quốc tế (`12.5`).
   - Tự động tách phần số và phần đơn vị: nếu đề yêu cầu đơn vị `m/s` mà học sinh gõ `12.5m/s` hay `12.5 m/s` đều được bóc tách xử lý chuẩn xác.
   - Dung sai (`tolerance`): Mặc định kiểm tra theo số chữ số thập phân (`decimals`). Nếu học sinh làm tròn hợp lý trong khoảng sai số cho phép, hệ thống vẫn chấp nhận đúng.
   - Bắt bẫy sai kinh điển: So khớp câu trả lời của học sinh với mảng `trapAnswers` trong `commonMistakes`. Nếu trùng, trả về mã lỗi cụ thể để UI hiển thị chính xác lý do học sinh đã nhầm lẫn ở đâu (ví dụ: *"Bạn đã dùng 22,4 L thay vì 24,79 L ở điều kiện chuẩn"*).
2. **`formulaChecker` (Hóa học):**
   - So sánh dựa trên cây **số lượng nguyên tử** đã parse từ `src/chem/parseFormula.ts` (ví dụ `Ca(OH)2` → `{Ca:1, O:2, H:2}`), không so sánh chuỗi thô.
   - **Phạm vi có chủ đích (quan trọng):** vì `parseFormula.ts` chỉ đếm nguyên tử chứ không giữ thông tin liên kết, checker này **chỉ kiểm chứng đúng công thức phân tử/ion** (ví dụ nhập đúng thành phần nhưng sai thứ tự quy ước như `OH2` thay vì `H2O` → trả về `partial` kèm nhắc nhở, không trừ điểm oan). Checker **không** và **không được quảng cáo là** phân biệt đồng phân cấu tạo (structural isomer) — ví dụ `CH3COOH` (acid acetic) và `HCOOCH3` (methyl formate) có cùng công thức phân tử `C2H4O2` nhưng là hai chất khác nhau; ở mức phân tử này checker sẽ không phân biệt được. Với chương trình THCS, các bài tập liên quan tới đồng phân cấu tạo (nếu có) cần dùng dạng câu hỏi khác (mcq/text) thay vì `formula`, chứ không giao cho `formulaChecker` xử lý.
3. **`choiceChecker` (Trắc nghiệm):**
   - Hỗ trợ phản hồi từng phần: Đối với câu chọn nhiều đáp án, nếu học sinh chọn đúng 2/3 đáp án, hệ thống sẽ gợi ý *"Bạn còn thiếu 1 đáp án nữa"* thay vì đánh sai toàn bộ câu.

---

## 6. HỆ THỐNG ĐA MÔN HỌC (MULTI-SUBJECT SYSTEM: HÓA HỌC & VẬT LÝ)

Kiến trúc đã được nâng cấp hoàn toàn từ đơn môn sang đa môn (Multi-Subject Architecture), chia tách rõ ràng giữa **Core Platform** và **Subject Packs**:

```text
                               ┌────────────────────────────────┐
                               │   CORE ENGINE & UI PLATFORM    │
                               │  - SnakePath Renderer          │
                               │  - Session Reducer             │
                               │  - Gamification (XP, Hearts)   │
                               │  - Sound & Mascot Engine       │
                               └───────────────┬────────────────┘
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       ▼                                               ▼
       ┌────────────────────────────────┐              ┌────────────────────────────────┐
       │     MÔN HÓA HỌC (chem)         │              │      MÔN VẬT LÝ (physics)      │
       ├────────────────────────────────┤              ├────────────────────────────────┤
       │ • Mã môn: 'chem'               │              │ • Mã môn: 'physics'            │
       │ • Màu chủ đạo: Sky Cyan        │              │ • Màu chủ đạo: Amber/Gold      │
       │   (#0ea5e9 / #0284c7)          │              │   (#eab308 / #ca8a04)          │
       │ • Biểu tượng: 🧪 Bình tam giác │              │ • Biểu tượng: ⚡ Tia sét/Mạch  │
       │ • Bàn phím: ChemKeyboard       │              │ • Bàn phím: PhysicsKeyboard    │
       │ • Kiến thức KB:                │              │ • Kiến thức KB:                │
       │   - periodic-table.json        │              │   - constants.json (g, c, D)   │
       │   - substances.json            │              │   - formulas.json (Ohm, V...)  │
       │   - reactions.json             │              │   - units.json (kW.h, m/s...)  │
       │ • Phân phối: Lớp 6 - 9         │              │ • Phân phối: Lớp 6 - 9         │
       │ • ID bắt đầu: g7-, g8-, g9-    │              │ • ID bắt đầu: phy-g6-, phy-g8- │
       └────────────────────────────────┘              └────────────────────────────────┘
```

### 6.1. Quản lý trạng thái môn học hoạt động (`useActiveSubject`)
- Quản lý qua `localStorage.getItem('chem_active_subject')` và bắn sự kiện `CustomEvent('chem_subject_changed')`.
- Toàn bộ giao diện (Màu sắc accent, biểu tượng môn học trên Navbar, cây bài học SnakePath) sẽ tự động đồng bộ theo thời gian thực mà không cần tải lại trang.

### 6.2. Cơ chế độc lập dữ liệu & tiến độ
- **Tiến độ học tập:** Khóa lưu trữ tiến độ được gắn kèm mã bài (Node Key: `${lesson.id}:${node.id}`). Vì mã bài của Hóa học có dạng `g8-b03` còn Vật lý có dạng `phy-g8-b01`, hai môn học hoàn toàn độc lập, học sinh có thể vừa học Hóa vừa học Lý mà không bao giờ bị trùng lặp tiến độ.
- **Điểm kinh nghiệm & Chuỗi ngày học:** Tổng XP, Level tài khoản và Streak đèn cồn được **tích lũy chung**. Học sinh làm bài tập môn Hóa hay môn Lý đều được cộng dồn điểm thành tích vào tài khoản cá nhân.

---

## 7. CƠ CHẾ GAMIFICATION & TÂM LÝ HỌC HỌC TẬP (LEARNING LOOPS)

Dự án áp dụng chặt chẽ các nguyên lý thiết kế game (Game Feel & Behavioral Psychology) để tạo động lực học tập bền bỉ cho học sinh THCS:

### 7.1. Bảng thông số cân bằng Game (`src/config/gamification.ts`)

| Cơ chế | Giá trị mặc định | Quy tắc vận hành |
|---|---|---|
| **XP Câu hỏi** | Lần 1: **+10 XP**<br>Lần 2: **+6 XP**<br>Lần 3: **+3 XP** | Khích lệ học sinh tư duy kỹ trước khi trả lời; trả lời đúng ngay lần đầu nhận tối đa điểm. Xem lời giải nhận 0 XP. |
| **Trừ XP hỗ trợ** | **-2 XP** (tối thiểu còn 3 XP) | Khi học sinh dùng Gợi ý nấc 2 hoặc bấm Mở từng bước giải. |
| **Combo thưởng** | ≥ 3 câu đúng liên tiếp: **+2 XP**<br>≥ 5 câu đúng liên tiếp: **+5 XP** | Tạo cảm xúc thăng hoa (flow state) khi duy trì chuỗi làm bài chuẩn xác. |
| **Hoàn thành chặng** | **+20 XP** (+10 XP nếu giữ trọn 5 tim) | Phần thưởng khi chinh phục xong 1 nút trên bản đồ SnakePath. |
| **Hệ thống Tim (Hearts)** | **5 Tim** tối đa | Mỗi câu chỉ trừ **1 tim duy nhất**, tại lần trả lời SAI đầu tiên (các lượt thử lại sau đó trong cùng câu không trừ thêm tim, xem 5.1). Không trừ tim ở trạng thái `partial` (được sửa miễn phí 1 lần duy nhất, xem 5.1). Tự động hồi 1 tim mỗi 20 phút. |
| **Chế độ Ôn Luyện (Hết tim)** | **Không chặn học** | Khi hết tim, học sinh được chuyển sang "Chế độ ôn luyện" để tiếp tục làm bài ôn kiến thức cũ (nhận 50% XP) cho đến khi hồi tim. |
| **Ngọn lửa Streak** | **+1 Ngày** | Đạt được khi hoàn thành tối thiểu 1 chặng học hoặc 1 Thử thách ngày (Daily Challenge). |
| **Công thức Cấp độ (Level)** | `XP(n) = 50 * n * (n - 1)` | Level 2: 100 XP, Level 3: 300 XP, Level 4: 600 XP, Level 5: 1000 XP... |

---

### 7.2. Nhân vật đại diện (Mascot Engine)
Mascot là linh hồn tương tác của app, xuất hiện tại mọi điểm chạm cảm xúc với 9 trạng thái:
1. `idle`: Đứng quan sát, chớp mắt nhẹ nhàng khi học sinh đang đọc đề.
2. `thinking`: Chống cằm suy nghĩ khi học sinh bấm mở Gợi ý.
3. `happy`: Mỉm cười tán thưởng khi học sinh chọn đúng đáp án.
4. `correct`: Nhảy cẫng ăn mừng, tung hoa giấy (confetti) khi hoàn thành câu xuất sắc.
5. `wrong`: Hơi buồn một chút nhưng giơ tay khích lệ học sinh thử lại.
6. `surprised`: Trầm trồ khi học sinh đạt chuỗi Combo 5 câu liên tiếp.
7. `celebrating`: Đội mũ cử nhân ăn mừng khi học sinh vượt qua chặng Boss cuối chương.
8. `level-up`: Phát sáng rực rỡ khi học sinh thăng cấp.
9. `encouraging`: Cầm bảng cổ vũ khi học sinh bị hết tim hoặc gặp câu khó.

---

## 8. THIẾT KẾ GIAO DIỆN & DESIGN SYSTEM (CHUNKY LAB UI)

### 8.1. DNA Thị giác (Visual Identity)
- **Concept:** *Digital Science Laboratory + Playful Chunky Arcade.*
- Nhìn vào giao diện phải nhận ra ngay đây là **Phòng thí nghiệm KHTN sống động**, hoàn toàn khác biệt với các ứng dụng học văn hóa hay học từ vựng tiếng Anh chung chung.
- **Phong cách Chunky 3D:** Mọi nút bấm, thẻ bài, ô nhập đều có phần đáy dày dặn (`shadow-[0_4px_0_0_#...]`), khi nhấn xuống nút sẽ di chuyển thật sự (`active:translate-y-1 active:shadow-none`), tạo phản hồi xúc giác (tactile feedback) tuyệt vời trên màn hình cảm ứng điện thoại.

### 8.2. Hệ màu sắc chuẩn hóa (Color Palette)
- **Background nền phòng Lab:** Tối hiện đại, sâu thẳm, chống mỏi mắt (`bg-[#0b1317]`, card `bg-[#131f24]`, viền border `border-[#2e4756]`).
- **Màu chuyên đề Hóa học (Chem Accent):** Xanh biển sáng Cyan (`#0ea5e9`), viền đáy `#0284c7`.
- **Màu chuyên đề Vật lý (Physics Accent):** Vàng hổ phách / Cam tia chớp (`#eab308`), viền đáy `#ca8a04`.
- **Màu phản hồi Đúng (Success):** Xanh lá ngọc (`#22c55e`), viền đáy `#15803d`.
- **Màu phản hồi Sai (Error):** Đỏ san hô (`#ef4444`), viền đáy `#b91c1c`.
- **Màu chú ý / Gần đúng (Warning):** Vàng chanh (`#f59e0b`), viền đáy `#d97706`.

### 8.3. Bàn phím ảo chuyên dụng trên thiết bị di động
Để học sinh không bị bàn phím mặc định của điện thoại che mất màn hình hoặc không gõ được ký tự khoa học, app tích hợp sẵn:
1. **`ChemKeyboard`:** Nhập nhanh các nguyên tố thông dụng (H, O, C, N, Na, Ca, Fe, Al...), tự động chuyển thành chỉ số dưới khi gõ số sau ký hiệu nguyên tố, có nút mũi tên phản ứng `→`, khí bay lên `↑`, kết tủa `↓`.
2. **`PhysicsKeyboard`:** Nhập các đơn vị đo lường phổ biến ($\Omega, V, A, W, J, N, Pa, m/s, km/h, kg/m^3, ^\circ C$), các ký hiệu tính toán ($\Delta, \cdot, /, \sqrt{}, ^2, ^3$, hệ số $10^x$).

---

## 9. QUY TRÌNH PHÁT TRIỂN & TIẾP NHẬN NỘI DUNG (CONTENT EXPANSION WORKFLOW)

Khi người dùng cung cấp danh sách bài học và nội dung cho môn Vật lý (hoặc thêm các bài mới cho môn Hóa), quy trình đưa dữ liệu vào hệ thống được thực hiện qua 3 bước:

```text
  [BƯỚC 1: KHUNG CHƯƠNG TRÌNH]
  Nhận danh sách Chương & Tên bài từ người dùng
  ──► Cập nhật vào src/content/curriculum/physics.ts
  
  [BƯỚC 2: BIÊN SOẠN BÀI TẬP & LÝ THUYẾT]
  Cấu trúc file JSON theo chuẩn Zod Schema:
  - Lý thuyết: src/content/theories/physics/phy-g{lớp}-b{bài}.json
  - Bài tập:   src/content/exercises/physics/phy-g{lớp}-b{bài}.json
  (Chia đều các nút: n01 cơ bản, n02 nâng cao, n03 thực hành, boss thử thách)
  
  [BƯỚC 3: XÁC THỰC & KÍCH HOẠT]
  Xác thực cấu trúc JSON (đầy đủ hints, 7 steps, pitfalls, verify)
  ──► Bản đồ SnakePath tự động render các chặng học tương tác!

  [BƯỚC 4: KIỂM TRA COVERAGE (nếu bài mới cần logic checker mới)]
  Nếu nội dung mới đòi hỏi thêm case xử lý trong bất kỳ file nào ở
  src/engine/checkers/ (vd: đơn vị mới, dạng bẫy sai mới) ──►
  bắt buộc viết thêm unit test tương ứng và chạy `vitest --coverage`,
  đảm bảo coverage của thư mục checkers/ vẫn ≥ 90% như yêu cầu ở
  mục 2, tránh coverage tụt dần theo thời gian khi mở rộng nội dung.
```

---

## 10. BẢNG CHECK CA BIÊN & QUY TẮC BẢO TRÌ BẮT BUỘC (CRITICAL RULES)

1. **Quy tắc kiểm thử:** Không tự ý chạy các lệnh test tốn thời gian trừ khi người dùng yêu cầu trực tiếp.
2. **Quy tắc dữ liệu:** Tuyệt đối không hardcode câu hỏi hay đáp án trực tiếp vào trong component UI của React. Tất cả phải nằm ở thư mục `src/content/` dưới dạng file JSON hoặc Generator.
3. **Quy tắc công thức:** Lưu trữ công thức dưới dạng ASCII thuần (`H2SO4`, `Fe^3+`, `v = s / t`), hiển thị thông qua `<Formula>` component. Tuyệt đối không lưu các ký tự Unicode subscript/superscript trong database/JSON vì sẽ gây lỗi khi tìm kiếm và so sánh.
4. **Quy tắc thiết bị:** Kiểm tra tương thích giao diện trên viewport điện thoại di động (390×844) đầu tiên trước khi kiểm tra trên máy tính. Dùng `100dvh`, không dùng `100vh` để tránh bị thanh điều hướng trình duyệt di động che khuất.
5. **Văn phong ứng dụng:** 100% tiếng Việt chuẩn mực, thuật ngữ KHTN theo sách giáo khoa mới (Kết nối tri thức / Cánh diều: acid, base, oxide, hydrocarbon, alkane...), ngôn từ khích lệ, tạo cảm hứng, thân thiện với học sinh.

---

*(Tài liệu này là cẩm nang kiến trúc kỹ thuật toàn diện, làm kim chỉ nam phát triển cho toàn bộ dự án STEM-Solve).*
