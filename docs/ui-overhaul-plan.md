# KẾ HOẠCH NÂNG CẤP TOÀN DIỆN GIAO DIỆN (UI/UX OVERHAUL PLAN)
## Dự án: CHEM-SOLVE — Digital Chemistry Lab

> **Mục tiêu:** Chuyển hóa toàn bộ giao diện từ trạng thái **"Mẫu giao diện do AI sinh" (AI Template / Dark Cyberpunk Slop)** thành một sản phẩm **"Làm tay chuyên nghiệp, có linh hồn và đạt chuẩn Game-Feel EdTech hàng đầu" (như Duolingo, Brilliant, Quizlet)**.

---

## I. ĐÁNH GIÁ THỰC TẾ: TẠI SAO GIAO DIỆN HIỆN TẠI "ĐẬM MÙI AI"?

Sau khi rà soát toàn bộ source code (`tokens.css`, `SnakePath.tsx`, `LearnPage.tsx`, `PracticePage.tsx`, các Minigames, `Header.tsx`), sự thật khách quan là: **Giao diện hiện tại mang 80% dấu ấn đặc trưng của code do AI sinh tự động**, chưa toát lên được đẳng cấp của một UI làm tay (handcrafted) tỉ mỉ.

### 5 Dấu hiệu nhận biết giao diện bị "AI hóa":

1. **"Hội chứng Dark Mode Hacker / Cyberpunk của AI":**
   - AI luôn mặc định chọn nền đen thui `bg-slate-950` / `bg-slate-900` kết hợp viền neon xanh ngọc `border-cyan-500/40` và chữ tím `text-violet-400`.
   - Kiểu phối màu này rất hợp với Dashboard phân tích Crypto, máy chủ Cloud hoặc terminal lập trình viên, nhưng **HOÀN TOÀN LỆCH TÔNG với học sinh THCS (lớp 6–9, lứa tuổi 11–15)**. Học sinh cần sự tươi tắn, kích thích thị giác, ấm áp và vui tươi của một phòng thí nghiệm kỳ diệu.

2. **"Lạm dụng Lucide Line Icons khắp mọi nơi":**
   - Bất cứ chỗ nào cần hình ảnh, AI đều tiện tay nhét icon vector dạng nét mỏng (`BookOpen`, `Sparkles`, `Trophy`, `Zap`, `Check`, `X`).
   - Kết quả: Giao diện phẳng lì, khô khan, thiếu chiều sâu. Trong khi đó, người dùng đã chuẩn bị sẵn **kho ảnh 3D/isometric cực đẹp** trong thư mục `ảnh chi tiết/` (icon chỉ số 3D, cúp vàng, rương báu, bộ hiệu ứng phản ứng hóa học, mascot Atom), nhưng code chưa tận dụng triệt để.

3. **Nút bấm 3D chắp vá, thiếu đồng bộ (Inconsistent Chunky Buttons):**
   - Dù `tokens.css` có lớp `.btn-chunky-primary`, nhưng ở từng trang con (như `ReviewGame`, `TrueFalseGame`, `PracticePage`, `ShopPage`), AI lại viết CSS Tailwind inline tùy tiện: chỗ thì viền mảnh mờ ảo `border-2 border-emerald-500/50`, chỗ lại đổ bóng gradient phẳng.
   - Chuẩn game Duolingo đòi hỏi **100% nút bấm phải có độ dày 3D cơ học thật (4px solid bottom-border)**, khi bấm lún xuống nảy tanh tách kèm âm thanh xúc giác.

4. **Bố cục "Hộp lồng Hộp" (Card-in-Card Syndrome) đơn điệu:**
   - Mọi trang đều là những chiếc thẻ chữ nhật bo góc màu xám xịt xếp chồng lên nhau (`p-4 rounded-2xl bg-slate-900 border border-slate-800`).
   - Nhìn toàn trang bị đều đều, không có điểm nhấn chính – phụ, không có khoảng thở thị giác (rhythm & negative space).

5. **Mascot và Đồ họa tương tác bị "đóng băng":**
   - Các biểu cảm của mascot Atom (`atom-cheering`, `atom-celebrating`, `atom-out-of-hearts`, `atom-thinking`) chưa được xuất hiện sống động bên cạnh bài làm để cổ vũ học sinh như chú cú xanh của Duolingo.

---

## II. ĐỊNH HƯỚNG BẢN SẮC MỚI (VISUAL DNA: "PLAYFUL TACTILE LAB")

Chúng ta sẽ nâng cấp toàn bộ thẩm mỹ theo triết lý: **Phòng thí nghiệm Hóa học 3D nổi khối (Tactile Chemistry Lab)**, kết hợp tinh thần thể thao điện tử học tập của Duolingo.

### 1. Bảng màu Semantic có linh hồn (Curated Palette)

| Vai trò | Màu sắc | Hex Code | Ứng dụng cụ thể |
|---|---|---|---|
| **Brand Primary** | Lab Royal Blue / Teal | `#0ea5e9` (bóng `#0284c7`) | Nút bắt đầu bài học, thanh tiến trình chính, dung dịch đồng sunfat CuSO₄ |
| **Success / Correct** | Apple Energy Green | `#58cc02` (bóng `#46a302`) | Nút đáp án đúng, feedback sheet chúc mừng, vạch lộ trình đã hoàn thành |
| **Danger / Wrong** | Crimson Coral | `#ff4b4b` (bóng `#ea2b2b`) | Nút đáp án sai, cảnh báo hết tim, axit mạnh |
| **Currency: Heart** | Ruby Glow | `#ff4b4b` (bóng `#d92525`) | Trái tim sinh mệnh 3D |
| **Currency: Gem** | Cyan Diamond | `#00cd9c` (bóng `#00a880`) | Kim cương tích lũy đổi quà |
| **Streak / XP** | Solar Amber Gold | `#ff9600` (bóng `#e07a00`) | Ngọn lửa streak, điểm kinh nghiệm, cúp danh hiệu |
| **Minigames / Special** | Cosmic Amethyst | `#ce82ff` (bóng `#a545ee`) | Các trạm minigame, rương kho báu, bài tập thử thách |
| **Background (Dark Mode)** | Deep Obsidian / Lab Ink | `#131f24` (mặt sàn `#18272f`) | Màu tối kiểu Duolingo Super Dark: Dịu mắt, không đen sì, không viền neon chói |
| **Background (Light Mode)** | Clean Milk & Mint | `#ffffff` (mặt sàn `#f0f7f6`) | Tùy chọn giao diện sáng trắng tinh khôi, trong trẻo như phòng lab sạch |

### 2. Nguyên tắc thiết kế 3D Chunky (Tactile Buttons & Cards)
- **Tất cả nút bấm:** Đều có gờ 3D dày 4px hoặc 6px ở cạnh đáy (`box-shadow: 0 4px 0 0 var(--color-dark)`).
- **Trạng thái Active:** Khi chạm ngón tay hoặc click chuột, nút di chuyển xuống 4px (`transform: translateY(4px)`), triệt tiêu bóng đáy, tạo cảm giác cơ học như phím đàn piano thực thụ.
- **Bo góc chuẩn:** Thống nhất 1 hệ số bo góc: Thẻ to `rounded-3xl` (24px), nút và thẻ con `rounded-2xl` (16px), tag/badge `rounded-xl` (12px).

---

## III. KẾ HOẠCH TRIỂN KHAI 5 GIAI ĐOẠN CHI TIẾT

### 🚀 Giai đoạn 1: Chuẩn hóa Design System & Component Nền tảng (Foundation)
*Mục tiêu: Xóa bỏ CSS viết tay tự do, đưa mọi trang về dùng chung 1 hệ thống Design Tokens.*

1. **Cập nhật `tokens.css`:**
   - Định nghĩa lại toàn bộ biến màu thương hiệu, màu ngữ nghĩa (Semantic colors), độ sâu bóng 3D (`--shadow-chunky-primary`, `--shadow-chunky-success`, `--shadow-chunky-danger`...).
   - Hỗ trợ biến màu thích ứng mượt mà giữa Dark Mode cao cấp và Light Mode trong trẻo.
2. **Xây dựng bộ Component 3D cốt lõi tại `src/design-system/components/`:**
   - `<Button3D variant="primary | success | danger | accent | secondary | surface" size="sm | md | lg">`: Nút bấm có hiệu ứng lún 3D chuẩn xác.
   - `<Card3D>`: Thẻ chứa nội dung có gờ đáy 3D nổi bật, tách bạch hoàn toàn với nền trang.
   - `<Badge3D>`: Huy hiệu đếm câu, hiển thị lớp, hiển thị dạng bài.

---

### 🎨 Giai đoạn 2: Tích hợp Kho Asset Đồ Họa Thực Tế từ `ảnh chi tiết/`
*Mục tiêu: Thay thế toàn bộ "icon Lucide xám xịt" bằng đồ họa 3D đã vẽ sẵn.*

1. **Header & Thanh chỉ số (Stats Bar):**
   - Thay icon trái tim SVG bằng **Ảnh Trái tim 3D đỏ bóng** từ `Bộ Icon chỉ số Game`.
   - Thay icon gem SVG bằng **Viên Kim Cương 3D phát sáng**.
   - Thay icon lửa SVG bằng **Ngọn lửa Streak 3D rực rỡ**.
2. **Tích hợp Mascot Atom vào trải nghiệm làm bài:**
   - **Đang suy nghĩ:** Hiển thị `atom-thinking.png` góc dưới màn hình.
   - **Trả lời đúng:** `atom-cheering.png` hoặc `atom-celebrating.png` nhảy múa với hiệu ứng hoa giấy confetti.
   - **Làm sai:** `atom-surprised.png` làm nét mặt khích lệ "Cố lên, xem gợi ý nào!".
   - **Hết tim:** `atom-out-of-hearts.png` mếu máo dẫn học sinh vào Shop hoặc phần Luyện tập hồi tim.
3. **Hiệu ứng Micro-animations:**
   - Tích hợp các video hoạt họa nhẹ (`doodle-color-confetti.mp4`, `star-hover-rotation.mp4`, `medal-first-place.mp4`) vào màn hình Chiến thắng khi qua chặng.

---

### 🗺️ Giai đoạn 3: Thiết kế lại Lộ trình học (Snake Path) & Khung bài tập
*Mục tiêu: Biến trang chủ thành một bản đồ phiêu lưu sống động như đảo học tập.*

1. **Nút mốc lộ trình (Roadmap Milestone Nodes):**
   - Ứng dụng đồ họa từ file `Các nút mốc trên Lộ trình học.jpeg`.
   - Node đang học (`active`): Nút tròn 3D to bản, viền sao vàng, có vòng xung nhịp (pulse ring) thu hút ngón tay chạm vào.
   - Node đã qua (`completed`): Nút màu xanh lá rực rỡ với 3 ngôi sao vàng kim lấp lánh phía trên.
   - Node rương báu (`chest`): Hình rương kho báu chứa ngọc và tim, mở ra nhận quà khi học xong bài.
   - Node trạm kiểm tra / cúp (`trophy`): Tượng cúp vàng cuối chương.
2. **Đường mòn liên kết (Stepping Path):**
   - Thiết kế đường nối ziczac mềm mại, có đổ bóng đất và vân đá nhỏ, tạo cảm giác như con đường thực thụ dẫn qua các vùng kiến thức hóa học.
3. **Banner Chương học (Chapter Header):**
   - Đổi banner phẳng thành dạng "Biển chỉ dẫn phòng Lab", có hình ảnh ống nghiệm, bình tam giác và mô tả ngắn gọn, dễ hiểu.

---

### 📝 Giai đoạn 4: Thiết kế lại Màn hình Làm bài & Bảng phản hồi (Question & Feedback)
*Mục tiêu: Cảm giác làm bài như đang thực hành trong phòng thí nghiệm ảo.*

1. **Khung bảng câu hỏi:**
   - Ứng dụng phong cách từ `bảng câu hỏi 1.jpeg` và `bảng câu hỏi 2.png`.
   - Đề bài được đóng khung trong khay đựng dụng cụ thủy tinh sạch sẽ, font chữ to rõ (18–20px), công thức hóa học render nổi bật.
2. **Bộ nút trả lời (Mcq, True/False, Match, Ordering):**
   - Các nút trắc nghiệm trở thành các "Khối gạch 3D" (3D Tiles).
   - Khi chưa chọn: Thẻ màu trắng/xám có bóng đáy 4px.
   - Khi được bấm chọn: Thẻ lún xuống, viền chuyển màu xanh ngọc, bóng đổ đậm.
   - Khi nộp bài sai: Thẻ chọn hóa đỏ, hiển thị icon gạch chéo, **không** làm lộ đáp án đúng (theo quy tắc sư phạm).
3. **Feedback Sheet trượt từ đáy màn hình:**
   - Mô phỏng chính xác mẫu `Khung Thông báo Đúng Sai trượt từ đáy màn hình.jpeg`:
     + Đúng: Băng rôn xanh lá cây tràn viền (`#58cc02`), Mascot giơ tay ăn mừng, cộng âm thanh tinh tinh nảy số `+15 XP`.
     + Sai: Băng rôn đỏ ấm (`#ff4b4b`), Mascot động viên, hiển thị nút "💡 Xem gợi ý cốt lõi" để học sinh suy ngẫm và làm lại.

---

### 🧪 Giai đoạn 5: Tái cấu trúc Trang Luyện tập & Minigames Hub
*Mục tiêu: Đưa tất cả bài tập và game vào một "Học viện Thí nghiệm" đẳng cấp.*

1. **Thẻ trò chơi (Game Cards):**
   - Bỏ các khối xám viền neon mỏng dính hiện tại.
   - Mỗi Minigame (Cân bằng PTHH, Phân loại chất, Ghép đôi, Đúng/Sai, Thử thách tốc độ, Ôn tập Leitner) được thiết kế thành một **"Bàn Thí Nghiệm Đồ Chơi"** với hình minh họa đặc trưng:
     + Cân bằng: Chiếc cân tiểu ly 3D.
     + Phân loại chất: 4 lọ hóa chất 4 màu sắc sặc sỡ.
     + Ghép đôi: Cặp bình phản ứng hút nhau.
     + Tốc độ: Đồng hồ bấm giờ bốc khói nhiệt lượng.
2. **Cửa hàng (Shop Page):**
   - Biến thành "Tiệm Tạp Hóa Hóa Học": Kệ hàng bằng gỗ/kim loại cao cấp bày bán Tim hồi sinh, Đóng băng Streak, Rương bí ẩn, kèm âm thanh leng keng của tiền xu khi đổi gems.

---

## IV. TIÊU CHÍ ĐÁNH GIÁ KẾT QUẢ (DEFINITION OF DONE)

Một giao diện được xem là hoàn thành xuất sắc khi vượt qua bảng kiểm định sau:
- [ ] **Thẩm mỹ:** Đặt cạnh Duolingo hoặc Brilliant, người dùng không phân biệt được đâu là app triệu USD, đâu là app học tập cá nhân.
- [ ] **Triệt tiêu AI Vibe:** Không còn một màn hình nào dùng nền đen sì với viền neon Cyan/Violet đơn điệu.
- [ ] **Game Feel:** 100% nút bấm tương tác phản hồi cơ học 3D có độ lún thật khi nhấn.
- [ ] **Đồ họa sống động:** Mascot Atom và bộ icon 3D xuất hiện tự nhiên, truyền cảm hứng cho người học.
- [ ] **Responsive hoàn hảo:** Hiển thị xuất sắc trên màn hình nhỏ di động (360×640, 390×844) cũng như máy tính bảng/máy tính để bàn.

---

*Tài liệu này được tạo để người dùng duyệt định hướng kiến trúc UI. Chỉ tiến hành code các giai đoạn sau khi nhận được sự phê duyệt chính thức từ người dùng.*
