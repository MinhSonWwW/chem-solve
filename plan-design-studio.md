# STEM-Solve — Kế hoạch Đại Phẫu Mỹ Thuật: Chuyển Hóa Từ "Giao Diện AI" Thành "Studio Game Vẽ Tay Chuyên Nghiệp"

> **Tài liệu tham chiếu:** [`PLAN.md`](PLAN.md) · [`docs/design-bible.md`](docs/design-bible.md) · [`AGENTS.md`](AGENTS.md)  
> **Tuyên ngôn cốt lõi:** **XÓA BỎ 100% CẢM GIÁC AI-GENERATED (AI-SLOP)**. Đưa dự án đạt tiêu chuẩn thẩm mỹ của một **Game Design Studio quốc tế hàng đầu** (như Duolingo, Headspace, Kurzgesagt, Brilliant) với linh hồn nghệ thuật vẽ tay (hand-drawn chunky line-art), vật lý xúc giác chân thực (game juice) và lời thoại ấm áp, hóm hỉnh mang đậm dấu ấn con người.

---

## 1. Bản Cáo Trạng: Tại Sao Ứng Dụng Bị Nhận Xét Là "Giống AI Làm"?

Trước khi sửa, cần chỉ ra chính xác các "dấu vết AI" (AI hallmarks) đang tồn tại trong giao diện:

| Dấu vết "AI-Generated" kinh điển | Biểu hiện cụ thể trong mã nguồn | Cảm xúc tiêu cực của người dùng |
|---|---|---|
| **Công thức "Hộp bo tròn + Lucide Icon màu mè"** | Hàng loạt card sử dụng lặp lại: `<div className="w-12 h-12 rounded-2xl bg-xxx-500/20 border-xxx-500/40 text-xxx-400"><Icon /></div>`. | Nhìn giống mọi template SaaS/Dashboard đại trà sinh ra từ ChatGPT từ năm 2023. Thiếu hẳn bản sắc riêng. |
| **Lạm dụng Emoji hệ điều hành trong tiêu đề** | Tiêu đề chứa emoji trôi nổi: `🎮 Đấu trường`, `🌿 Sinh học`, `⚡ Luyện tập`, `❤️ Tim`. | Emoji trên Windows, iOS, Android hiển thị khác nhau hoàn toàn, tạo cảm giác chắp vá, rẻ tiền, thiếu chuyên nghiệp. |
| **Màu sắc phân mảnh, "bốc màu tùy tiện"** | Trong cùng một màn hình: nút màu tím đục, viền card màu cam rực, badge màu xanh cyan, icon màu xanh lá. | Không có hệ thống Design Tokens chặt chẽ, tạo cảm giác rối rắm, "bạ đâu gán màu đấy". |
| **Văn phong máy móc, sáo rỗng (AI Copywriting)** | Những câu dài dòng, thiếu cá tính: *"Hồi phục toàn bộ 5 bình năng lượng và nhận thêm năng suất tối đa"*, *"Đột phá kiến thức phòng lab"*. | Giọng điệu của một con bot dịch máy, không có năng lượng của một người thầy / bạn học đồng hành. |
| **Thiếu chuyển động vật lý & độ nảy (Game Juice)** | Chỉ có `hover:scale-105 transition-all` mờ nhạt; các nút bấm phẳng lì không có cảm giác bấm cơ học. | Giao diện tĩnh lặng, thiếu sự sống, không kích thích xúc giác khi nhấn phím hay chạm màn hình. |

---

## 2. Tuyên Ngôn Thị Giác: Bộ Quy Chuẩn Nghệ Thuật "Bespoke Hand-Crafted Studio"

Một sản phẩm được làm bởi con người và đội ngũ họa sĩ studio sở hữu các quy chuẩn sau:

### 2.1. Phong cách "Chunky Cartoon / Bold Line-Art" (Vẽ tay Hoạt hình Nét Viền Mực)
1. **Nét mực viền đen/tối (Ink Outline):**
   - Mọi hình vẽ minh họa, icon độc quyền, nút bấm và mascot đều có viền mực tối (`stroke-[#131f24]` hoặc `border-[#2e4756]`) dày `2.5px - 3px`.
   - Nét viền tạo cảm giác hình ảnh được vẽ tay bằng cọ mực trên giấy, có độ tương phản tuyệt đối trên nền tối.
2. **Đổ bóng khối phẳng 3D (Solid Extruded Drop Shadow):**
   - Tuyệt đối **không** dùng bóng mờ nhòe (blurry drop-shadow `rgba(0,0,0,0.15)`) kiểu web tài chính.
   - Dùng bóng khối cứng cáp: `shadow-[0_4px_0_0_#0284c7]` cho nút bấm, `shadow-[0_4px_0_0_#131f24]` cho thẻ bài. Khi nhấn (`:active`), toàn bộ khối lún xuống `translate-y-[4px]` triệt tiêu bóng đáy — tạo cảm giác bấm phím cơ học (tactile press).
3. **Nét vẽ nguệch ngoạc có chủ đích (Hand-Drawn Doodles):**
   - **Mũi tên uốn lượn vẽ tay** (Hand-drawn squiggle arrows) chỉ dẫn học sinh bấm vào bài học tiếp theo.
   - **Tia sao lấp lánh 4 cánh (`✦`, `★`)** với nét vẽ dày mỏng không hoàn hảo tự nhiên.
   - **Vạch gạch chân lượn sóng (wavy underline)** màu vàng phấn dưới các thuật ngữ đắt giá.

### 2.2. Bảng Màu Thương Hiệu Khoa Học Nghiêm Ngặt (Strict 5-Color System)
Không sử dụng màu ngẫu nhiên. Mọi sắc độ đều đại diện cho chất liệu khoa học:
- **Lab Cyan (`#0ea5e9` / `#38bdf8`)**: Màu dung dịch đồng sunfat $CuSO_4$, nước cất, tinh thể muối — màu nhận diện thương hiệu chính.
- **Success Green (`#58cc02` / `#68d810`)**: Xanh táo tràn đầy năng lượng — câu trả lời đúng, năng lượng sinh học diệp lục, hoàn thành bài học.
- **Danger Rose (`#ff4b4b` / `#ff6161`)**: Đỏ ruby axit, bình tim năng lượng, cảnh báo nguy hiểm, đáp án sai.
- **Streak Gold (`#ff9600` / `#fbbf24`)**: Ngọn lửa đèn cồn bập bùng, đá quý tinh thể, rương kho báu, thành tựu danh giá.
- **Deep Slate Canvas (`#0f171c` nền chính & `#18272f` khay thẻ viền `#2e4756`)**: Nền phòng thí nghiệm tối sang trọng, làm nổi bật dung dịch và phản ứng hóa sinh.

### 2.3. Linh Vật Flasky Có Linh Hồn & Cảm Xúc Sống Động
Linh vật bình tam giác **Flasky** không phải là ảnh tĩnh gắn cho có, mà có biểu cảm và hành động tương tác:
- **Trạng thái suy nghĩ (`thinking`)**: Bình nghiêng 15 độ, mắt liếc lên, dung dịch chuyển màu tím quỳ tím, bọt khí nổi lăn tăn.
- **Trạng thái làm đúng (`correct`)**: Cười tít mắt, bắn tia sáng 4 cánh, dung dịch màu xanh lá sóng sánh dâng cao.
- **Trạng thái làm sai (`wrong`)**: Hơi xém khói đen nhẹ trên miệng bình, gãi đầu ngại ngùng động viên *"Lần sau chắc chắn đúng nè!"*.
- **Trạng thái hết tim (`exhausted`)**: Nằm mệt thở phù phù, có bong bóng khí ngủ `Zzz`.
- **Trạng thái kỷ niệm (`celebration`)**: Đội mũ tốt nghiệp hoặc đeo kính bảo hộ phát sáng.

### 2.4. Ngôn Ngữ Micro-Copy Tự Nhiên & Ấm Áp (Human Tone of Voice)
- Không nói như robot: Đổi *"Hồi phục toàn bộ 5 bình năng lượng"* $\to$ *"Bơm đầy 5 tim, quẩy bài tập tiếp nào!"*.
- Không chê trách học sinh: Khi sai, khích lệ *"Ối suýt nữa là đúng rồi, cùng xem lại bẫy này nhé!"*.
- Tên các gói đồ trong Shop dí dỏm: *"Khiên cứu chuỗi khi ngủ quên"*, *"Tăng tốc não bộ 15 phút"*.

---

## 3. Lộ Trình 5 Milestone Triển Khai Chi Tiết (M1 $\to$ M5)

### 🚀 Milestone 1: Khởi Tạo Thư Viện Đồ Họa Vẽ Tay (Hand-Crafted Asset Library)
- [ ] **Mục tiêu:** Xây dựng bộ SVG icons độc quyền nét viền mực dày 2.5px và bộ doodle vẽ tay thay thế toàn bộ Lucide icons đại trà trong các vị trí trọng tâm.
- [ ] **Công việc chi tiết:**
  1. Tạo component `<HandDrawnIcon />` tại `src/design-system/components/HandDrawnIcon.tsx` chứa các vector đồ họa vẽ tay chuẩn studio:
     - `flask`: Bình Erlenmeyer viền mực có vạch chia và bọt khí.
     - `test-tube`: Ống nghiệm nghiêng có giọt dung dịch đang rơi.
     - `atom`: Mô hình nguyên tử Bo hạt nhân tròn viền mực hoạt hình.
     - `dna`: Chuỗi xoắn kép DNA dạng cartoon chunky lines.
     - `heart-flask`: Bình tim năng lượng dạng thủy tinh đổ bóng đặc.
     - `ice-shield`: Khiên băng pha lê có bông tuyết vẽ tay.
     - `xp-potion`: Bình thuốc phát sáng có nút bần gỗ.
     - `treasure-chest`: Rương kho báu mở nắp có tia sáng tỏa ra.
     - `microscope`: Kính hiển vi quang học cách điệu.
     - `flame`: Ngọn lửa đèn cồn streak 3 lớp màu.
  2. Tạo component `<DoodleOrnament />` tại `src/design-system/components/DoodleOrnament.tsx`:
     - Mũi tên tay chỉ đường (`arrow-curved`, `arrow-bounce`).
     - Tia sáng 4 cánh (`sparkle-star`, `glint`).
     - Vạch gạch chân lượn sóng (`wavy-underline`, `double-underline`).
     - Bụi sao và bọt khí phòng lab bay lơ lửng.
  3. Cập nhật `src/design-system/index.ts` xuất khẩu các component mới.
  4. Viết unit test xác thực render chuẩn SVG trong `src/design-system/components/HandDrawn.test.tsx`.
- [ ] **Nghiệm thu M1:** 100% icons vẽ tay hiển thị sắc nét, viền mực đậm 2.5px, không phụ thuộc font/emoji hệ thống.

---

### 🚀 Milestone 2: Tinh Chỉnh Thanh Điều Hướng & Banner Đầu Trang (Navigation & Hero Hub)
- [ ] **Mục tiêu:** Xóa sạch emoji khỏi thanh tiêu đề, biến TopHeader, BottomNav và DesktopSidebar thành giao diện game studio sang trọng.
- [ ] **Công việc chi tiết:**
  1. **TopHeader (`src/app/layout/TopHeader.tsx`):**
     - Thay thế badge điểm Streak, Tim, Gems bằng component `<CurrencyIcon />` có hiệu ứng nảy (spring physics).
     - Bộ chọn khối lớp và môn học được thiết kế dạng nút bấm chunky 3D có độ nảy rõ ràng.
  2. **BottomNav (`src/app/layout/BottomNav.tsx`) & DesktopSidebar (`src/app/layout/DesktopSidebar.tsx`):**
     - Đổi icon các tab học tập từ Lucide tiêu chuẩn sang phiên bản chunky icon có nét viền và bóng đáy 3D.
     - Tab đang chọn (`active`) có vệt sáng đáy màu sắc riêng của môn học (Xanh Cyan cho Hóa, Vàng Hổ Phách cho Lý, Xanh Lá cho Sinh).
  3. **Bộ chọn môn học (`SubjectSelector`):**
     - Thay thế các emoji `🧪`, `⚡`, `🌿` bằng biểu tượng vẽ tay độc quyền: Bình tam giác Hóa học, Tia sét nguyên tử Vật lý, Mầm cây xoắn DNA Sinh học.
- [ ] **Nghiệm thu M2:** Giao diện điều hướng đồng nhất, không có emoji trôi nổi, bấm vào các tab có phản hồi xúc giác cơ học.

---

### 🚀 Milestone 3: Lột Xác Lộ Trình Học Ziczac (SnakePath & Learn Page)
- [ ] **Mục tiêu:** Biến bản đồ học tập ziczac từ những chấm tròn đơn điệu thành một "chặng thám hiểm khoa học kỳ thú".
- [ ] **Công việc chi tiết:**
  1. **Đường nối bài học (Stepping Path Connector):**
     - Thay đường kẻ đơn giản bằng đường nét đứt vẽ tay uốn lượn tự nhiên có độ dày `4px`.
     - Thêm các đốm bọt khí và tinh thể nhỏ rơi rải rác trên đường đi.
  2. **Nốt bài học (Lesson Nodes):**
     - Nốt chưa học: Nút khối tròn 3D màu xám đá `#20333d` viền `#2e4756`, bóng đáy dày `6px`.
     - Nốt đang học: Vòng hào quang nhịp tim đập (pulse aura) rực rỡ, trên đầu có linh vật Flasky mini nhún nhảy vẫy tay gọi học sinh.
     - Nốt đã hoàn thành: Huy hiệu sao vàng đúc nổi viền mực đen, phát ra hiệu ứng tia sáng khi di chuột.
  3. **Trạm kiểm tra chương & Rương phần thưởng:**
     - Thiết kế trạm rương mở nắp vàng óng ở cuối mỗi chương với animation bập bùng, có mũi tên vẽ tay chỉ vào *"Chinh phục để mở rương!"*.
  4. **Header chặng học (Unit Header Card):**
     - Thay khung card cứng nhắc bằng thẻ "Sổ tay phòng thí nghiệm" (Laboratory Notebook) với góc gấp nhẹ và nhãn dán dán chéo viền mực.
- [ ] **Nghiệm thu M3:** Trang học tập nhìn như một tấm bản đồ phiêu lưu trong game hoạt hình, kích thích học sinh kéo xuống khám phá các nốt tiếp theo.

---

### 🚀 Milestone 4: Tái Thiết Kế Đấu Trường Luyện Tập (PracticePage & Generators Hub)
- [ ] **Mục tiêu:** Xóa bỏ hoàn toàn bố cục "card hộp màu kẹp icon" đại trà trên trang Luyện tập, chuyển sang phong cách Studio Thao Trường.
- [ ] **Công việc chi tiết:**
  1. **Thẻ Đấu Trường Mini-Games:**
     - Thay thế toàn bộ icon hộp vuông màu mè bằng thẻ minh họa chuyên biệt:
       - Cấp cứu ABO: Túi máu truyền dịch hoạt hình có kim tiêm chibi.
       - Cân bằng PTHH: Chiếc cân tiểu ly phòng thí nghiệm có hai đĩa cân chuyển động bập bênh.
       - Ghép công thức: Các khối xếp hình nguyên tử lắp ghép có nam châm hút nhau.
       - Phân loại chất: 4 chiếc bình tam giác thủy tinh chứa chất lỏng màu sắc khác nhau.
       - Đố vui tốc độ: Đồng hồ bấm giờ kim giật tíc tắc với ngọn lửa năng lượng.
       - Hộp Leitner: Chồng thẻ bài flashcard 5 ngăn xếp lớp kiểu 3D isometric.
  2. **Thẻ Đề Tính Toán Generators Tự Động:**
     - Sử dụng hình ảnh "Máy tạo đề tự động phòng lab" với bánh răng hoạt họa và cần gạt.
     - Thay icon Lucide nhỏ bằng nhãn bài toán có công thức cách điệu dạng hand-drawn.
- [ ] **Nghiệm thu M4:** Trang Luyện tập có tính đồ họa phong phú, mỗi mini-game và dạng toán là một tác phẩm minh họa rõ nét, không còn bất kỳ card nào trông giống template AI.

---

### 🚀 Milestone 5: Nâng Cấp Xúc Giác Cửa Hàng (ShopPage) & Đại Phẫu Lời Thoại (Human Copy)
- [ ] **Mục tiêu:** Hoàn thiện trải nghiệm mua sắm vật phẩm đỉnh cao và rà soát viết lại toàn bộ ngôn từ trong ứng dụng.
- [ ] **Công việc chi tiết:**
  1. **Nâng cấp mỹ thuật ShopPage:**
     - Thẻ Rương kho báu: Thêm vệt sáng vàng quét qua (shimmer shine) trên thân rương.
     - Thẻ Khiên băng: Thêm hiệu ứng sương khói lạnh tuyết trắng bay nhẹ quanh icon.
     - Thẻ Bình Tim: Thêm hoạt ảnh bọt khí tim nổi lên từ đáy bình.
  2. **Đại phẫu bộ từ vựng & lời thoại người học (`src/copy/vi.ts`):**
     - Rà soát toàn bộ các câu chúc mừng, thông báo lỗi, gợi ý lời giải.
     - Loại bỏ văn phong dịch máy, thay bằng câu từ giàu năng lượng, gần gũi với lứa tuổi học sinh THCS (lớp 6, 7, 8, 9).
     - Thêm các câu khích lệ hóm hỉnh khi giải được bài khó hoặc duy trì chuỗi streak dài ngày.
  3. **Tích hợp Spring Physics cho toàn bộ nút bấm trong app:**
     - Cấu hình chuẩn Framer Motion lò xo (`stiffness: 400, damping: 25`) cho mọi tương tác nhấn chuột.
- [ ] **Nghiệm thu M5:** Ứng dụng toát lên vẻ ấm áp, vui tươi, tràn đầy sức sống của một sản phẩm giáo dục được đầu tư tâm huyết bởi đội ngũ con người.

---

## 4. Checklist Thẩm Định "Zero AI Vibes" (Bộ Tiêu Chí Đánh Giá Bắt Buộc)

Mỗi khi hoàn thành một màn hình, phải kiểm tra đối chiếu danh sách sau:

- [ ] **Không còn Emoji hệ điều hành (0 Unicode Emojis in Headings):** Không có 🎮, 🌿, ⚡, ❤️ trong tiêu đề; tất cả dùng SVG icon vẽ tay hoặc badge vector đồng bộ.
- [ ] **Không còn icon Lucide trong hộp vuông màu mè:** Các card chính đều có hình vẽ đồ họa vector riêng biệt mang ý nghĩa câu chuyện cụ thể.
- [ ] **Không có nút bấm màu tím đục:** Mọi nút bấm đều có trạng thái rõ ràng (trạng thái đầy: Slate tối thanh lịch; trạng thái hoạt động: 3D chunky button có màu nhận diện chuẩn).
- [ ] **Không có chữ bị đè (No Text Overlap):** Tất cả các nhãn ưu đãi, badge số lượng đều nằm ở layout flexbox độc lập, khoảng cách thoáng đãng.
- [ ] **Hiệu ứng bấm nút lún khối 3D xúc giác:** Nút bấm có bóng đặc `4px`, khi active lún xuống `4px` triệt tiêu bóng.
- [ ] **Văn phong ấm áp, ngắn gọn:** Lời thoại người dùng không dài dòng, không sáo rỗng, mang tinh thần khích lệ học tập vui vẻ.
- [ ] **Chạy kiểm thử kỹ thuật:** `npx tsc -b --noEmit` đạt 0 lỗi, `npm test` 100% PASS.

---

## 5. Hướng Dẫn Kích Hoạt Thực Hiện Cho Từng Phiên Làm Việc

Khi bắt đầu triển khai, người dùng hoặc agent chỉ cần gọi:
```text
Thực hiện Milestone 1 (M1) trong file plan-design-studio.md: Xây dựng bộ SVG HandDrawnIcon và DoodleOrnament. Xong thì kiểm thử typecheck và dừng chờ duyệt.
```
Agent sẽ thực hiện đúng milestone đó, đối chiếu checklist và báo cáo nghiệm thu trước khi bước sang milestone tiếp theo!
