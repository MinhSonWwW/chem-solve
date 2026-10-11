# STEM-SOLVE (CHEM-SOLVE) — Master Project Plan (v3.0)

> Nền tảng web luyện **bài tập Khoa học Tự nhiên THCS lớp 6–9 (Hóa học, Sinh học, Vật lý)** theo tinh thần Duolingo: giải từng bước (scaffolding 7 bước), phản hồi tức thì (zero-AI deterministic feedback), minigame, XP/streak/gems, bộ 3 mascot (Atom, Leafy, Proton), cúp vinh danh 3D và giao diện phòng lab xúc giác (tactile game feel).
> File này là **nguồn tham chiếu kỹ thuật và kiến trúc tối cao** cho toàn bộ lập trình viên và AI agent trong IDE (Antigravity). Agent phải đọc kỹ mục 0–3 trước khi viết code.
> Thứ tự ưu tiên: **MUST** (bắt buộc) · **SHOULD** (nên có) · **COULD** (làm nếu còn thời gian).

---

## 0. Cách dùng với IDE & Agent

1. File này đặt tại gốc repository với tên `plan.md` (hoặc `PLAN.md`).
2. Mọi quy tắc cốt lõi được đồng bộ với [`AGENTS.md`](AGENTS.md) và tài liệu onboarding [`PROJECT_GUIDE.md`](PROJECT_GUIDE.md).
3. Đặt các sprite sheet gốc và tài nguyên đồ họa vào `art/source/` hoặc `public/assets/`.
4. Khi triển khai từng tính năng hoặc mở rộng nội dung:
   - Đọc kỹ đặc tả kỹ thuật, Zod schema ở mục 6 và ma trận ca biên ở mục 7.
   - Tuân thủ quy chuẩn Design System ở mục 14, 15 và `docs/design-bible.md`.
   - Chạy kiểm tra chất lượng bắt buộc trước khi kết thúc turn:
     ```bash
     npx tsc --noEmit
     npm test
     ```
5. Khi phải chọn giữa nhiều hướng: ghi quyết định vào `docs/decisions.md` (1–3 dòng/quyết định) rồi tiếp tục, không dừng hỏi vụn vặt.

**Prompt mẫu cho Agent khi nhận task mới:**
```text
Đọc plan.md (mục 0–3 và milestone/feature mục tiêu). Lập kế hoạch ngắn rồi thực hiện.
Xong thì chạy `npx tsc --noEmit && npm test`, kiểm tra mobile viewport 390×844,
tóm tắt việc đã làm + giả định đã đặt ra, rồi báo cáo kết quả nghiệm thu.
```

---

## 1. Tầm nhìn & phạm vi

> **“Biến việc học và giải bài tập Khoa học Tự nhiên THCS thành một hành trình game tương tác lôi cuốn, trong đó mỗi câu trả lời đều dạy người học cách suy nghĩ từng bước và mỗi tương tác đều mang DNA của Khoa học.”**

**Công thức cốt lõi:** KHTN THCS 6–9 + bài tập phân dạng & cách giải + step-by-step (scaffolding) + minigame + bộ 3 mascot + motion + sound + XP/streak/gems/achievement + science-lab UI + hiệu năng mobile mượt mà.

**Learning loop:**

```text
Chọn môn (Hóa / Sinh / Lý) → Chọn Lớp (6, 7, 8, 9) → Bản đồ Ziczac (SnakePath)
   → Nốt bài học / Nốt lý thuyết / Trạm rương / Minigame
        ├─ Khởi động: Đọc lý thuyết súc tích 2 phút (Micro-learning Flashcards)
        ├─ Làm bài: Bàn phím chuyên dụng + Giải từng bước (Scaffolding 7 bước)
        ├─ Đúng: +10 XP + Combo Streak + Mascot vui mừng + Âm thanh level-up
        └─ Sai: Trừ 1 Tim + Thang hỗ trợ 2 cấp (HintLadder) + Chẩn đoán bẫy sai (Trap Diagnosis)
   → Hoàn thành chặng: Vinh danh Mascot + Cúp vàng 3D đặc trưng của từng môn
   → Tích lũy: Tim, Đá quý, Chuỗi ngày (Streak), Mở khóa nốt tiếp theo
```

**Luồng giải bài chuẩn (7 bước sư phạm):** `Đề bài → Nhận dạng → Dữ kiện → Kiến thức/Công thức → PTHH/Biến đổi → Tính toán → Kết luận & Bẫy sai`.
Lý thuyết chỉ xuất hiện đúng lúc (công thức cần nhớ, PTHH mẫu, mẹo nhận dạng, lỗi thường gặp, flashcard tóm tắt). Đây **không** phải web đọc lý thuyết thụ động.

**Mỗi bài tập phải trả lời được:** Thuộc dạng nào? Dùng kiến thức/công thức nào? Giải từng bước ra sao?

**Không “đưa đáp án ngay”:** khi học sinh sai, ưu tiên phân tích lỗi + gợi ý nấc thang trước khi hiện lời giải đầy đủ.

### Non-goals (Giai đoạn hiện tại)

- Không bắt buộc tạo tài khoản/đăng nhập (toàn bộ lưu trữ cục bộ qua IndexedDB + LocalStorage, hỗ trợ xuất/nhập JSON dự phòng).
- Không nhúng 3D/WebGL nặng nề gây tụt khung hình điện thoại tầm trung (dùng CSS 3D, SVG vector tối ưu, spritesheet).
- Không dùng AI sinh chữ tự do ở Runtime để chấm bài (chấm điểm 100% bằng **Deterministic Checkers** để đảm bảo chính xác tuyệt đối, loại trừ ảo giác AI).
- Không sao chép mascot, logo, artwork, cách đặt tên thành tựu của Duolingo hay app khác — thiết kế độc quyền mang bản sắc riêng của STEM-Solve.

---

## 2. Phạm vi kiến thức (SGK Kết nối tri thức)

Dữ liệu curriculum được thiết kế linh hoạt cho phép mở rộng môn và bài học mà không cần sửa code UI.
**Quy ước ID chuẩn:**
* Môn Hóa học: Bài `g{lớp}-b{số bài 2 chữ số}` (vd `g8-b03`), chặng `g8-b03-n01`, bài tập `g8-b03-calc-001`.
* Môn Sinh học: Bài `bio-g{lớp}-b{số bài}` (vd `bio-g7-b02`), bài tập `bio-g7-b02-q01`.
* Môn Vật lý: Bài `phy-g{lớp}-b{số bài}` (vd `phy-g6-b05`), bài tập `phy-g6-b05-q01`.

### 2.1. 🧪 Môn Hóa học (`chem`)

- **Lớp 7:**
  - **Bài 1:** Phương pháp và kĩ năng học tập môn Khoa học tự nhiên
  - **Chương 1: Nguyên tử. Sơ lược về bảng tuần hoàn các nguyên tố hóa học**
    - Bài 2: Nguyên tử (hạt proton, neutron, electron, khối lượng nguyên tử amu)
    - Bài 3: Nguyên tố hóa học (ký hiệu hóa học, tên gọi IUPAC)
    - Bài 4: Sơ lược về bảng tuần hoàn các nguyên tố hóa học (ô, chu kì, nhóm)
  - **Chương 2: Phân tử. Đơn chất. Hợp chất**
    - Bài 5: Phân tử. Đơn chất. Hợp chất
    - Bài 6: Hóa trị và công thức hóa học
- **Lớp 8:**
  - **Chương 1: Phản ứng hóa học**
    - Bài 2: Phản ứng hóa học & Hiện tượng biến đổi
    - Bài 3: Mol và tỉ khối chất khí ($V = 24,79 \cdot n$, $d_{A/B} = M_A / M_B$)
    - Bài 4: Dung dịch và nồng độ ($C\% = \frac{m_{ct}}{m_{dd}} \cdot 100\%$, $C_M = \frac{n}{V}$)
    - Bài 5: Định luật bảo toàn khối lượng và phương trình hóa học
    - Bài 6: Tính theo phương trình hóa học (bài toán chất dư, chất hết)
    - Bài 7: Tốc độ phản ứng và chất xúc tác
  - **Chương 2: Một số hợp chất thông dụng**
    - Bài 8: Acid ($HCl, H_2SO_4$, tính chất làm đỏ quỳ tím, tác dụng kim loại)
    - Bài 9: Base. Thang pH ($NaOH, Ca(OH)_2$, quỳ tím hóa xanh, phenolphthalein hóa hồng)
    - Bài 10: Oxide (Oxide acid, Oxide base, Oxide lưỡng tính, Oxide trung tính)
    - Bài 11: Muối (Phản ứng trao đổi trong dung dịch)
    - Bài 12: Phân bón hóa học (Phân đạm N, Phân lân P, Phân kali K)
- **Lớp 9:**
  - **Chương 6: Kim loại. Sự khác nhau cơ bản giữa phi kim và kim loại**
    - Bài 18: Tính chất chung của kim loại
    - Bài 19: Dãy hoạt động hoá học của kim loại
    - Bài 20: Tách kim loại và việc sử dụng hợp kim
    - Bài 21: Sự khác nhau cơ bản giữa phi kim và kim loại
  - **Chương 7: Giới thiệu về chất hữu cơ. Hydrocarbon và nguồn nhiên liệu**
    - Bài 22: Giới thiệu về hợp chất hữu cơ
    - Bài 23: Alkane ($CH_4$, phản ứng cháy, phản ứng thế clo)
    - Bài 24: Alkene ($C_2H_4$, liên kết đôi, phản ứng cộng dung dịch Brom)
    - Bài 25: Nguồn nhiên liệu
  - **Chương 8: Ethylic alcohol và Acetic acid**
    - Bài 26: Ethylic alcohol ($C_2H_5OH$, độ rượu, phản ứng với Na, phản ứng cháy)
    - Bài 27: Acetic acid ($CH_3COOH$, phản ứng este hóa)
  - **Chương 9: Lipid. Carbohydrate. Protein. Polymer**
    - Bài 28: Lipid và chất béo
    - Bài 29: Carbohydrate. Glucose và saccharose
    - Bài 30: Tinh bột và cellulose
    - Bài 31: Protein
    - Bài 32: Polymer và vật liệu nhân tạo
  - **Chương 10: Khai thác tài nguyên từ vỏ Trái Đất**
    - Bài 33: Sơ lược về hoá học vỏ Trái Đất và khai thác tài nguyên từ vỏ Trái Đất
    - Bài 34: Khai thác đá vôi. Công nghiệp silicate
    - Bài 35: Khai thác nhiên liệu hoá thạch. Nguồn carbon. Chu trình carbon và sự ấm lên toàn cầu

### 2.2. 🌿 Môn Sinh học (`bio`) — Trọn bộ 64+ bài học

- **Lớp 6:**
  - *Unit 1 (Tế bào - Đơn vị cơ sở của sự sống):* Khái niệm tế bào; Kích thước và hình dạng tế bào; Tế bào nhân sơ & nhân thực; Sự phân chia và lớn lên của tế bào.
  - *Unit 2 (Từ tế bào đến cơ thể):* Cơ thể đơn bào và cơ thể đa bào; Các cấp độ tổ chức trong cơ thể đa bào (Mô, Cơ quan, Hệ cơ quan, Cơ thể).
  - *Unit 3 (Đa dạng thế giới sống):* Khóa lưỡng phân; Virus và vi khuẩn; Giới Nấm và ứng dụng; Giới Thực vật (Rêu, Dương xỉ, Hạt trần, Hạt kín); Động vật không xương sống và Động vật có xương sống.
  - *Unit 4 (Bảo tồn sinh học):* Khái niệm đa dạng sinh học; Vai trò của đa dạng sinh học; Bảo vệ thiên nhiên và môi trường sống.
- **Lớp 7:**
  - *Unit 1 (Trao đổi chất & Chuyển hóa năng lượng):* Khái quát trao đổi chất; Quang hợp ở thực vật (phương trình chữ, bào quan lục lạp, các yếu tố ảnh hưởng); Hô hấp tế bào (ti thể, phân giải glucose giải phóng ATP).
  - *Unit 2 (Trao đổi khí, nước & dinh dưỡng):* Cấu tạo khí khổng ở lá; Trao đổi khí ở động vật (qua bề mặt da, mang, hệ thống ống khí, phổi); Vận chuyển nước và muối khoáng qua mạch gỗ & mạch rây; Tiêu hóa và dinh dưỡng ở người.
  - *Unit 3 (Cảm ứng ở sinh vật):* Hướng động và ứng động ở thực vật; Tập tính ở động vật (bẩm sinh và học được).
  - *Unit 4 (Sinh trưởng & Phát triển):* Các giai đoạn sinh trưởng; Biến thái hoàn toàn & không hoàn toàn ở động vật.
  - *Unit 5 (Sinh sản):* Sinh sản vô tính (sinh dưỡng, nảy chồi); Sinh sản hữu tính (thụ phấn, thụ tinh, hoa và quả).
- **Lớp 8:**
  - *Unit 1 (Cơ thể người - Vận động, Tiêu hóa, Tuần hoàn):* Bộ xương và hệ cơ; Tiêu hóa ở khoang miệng, dạ dày, ruột non; Thành phần của máu, hệ tuần hoàn, tim; Nhóm máu ABO và nguyên tắc truyền máu an toàn.
  - *Unit 2 (Hô hấp, Bài tiết, Cân bằng nội môi):* Cấu tạo đường hô hấp và sự trao đổi khí ở phế nang; Cấu tạo thận và quá trình tạo thành nước tiểu; Cân bằng nội môi.
  - *Unit 3 (Thần kinh, Nội tiết, Da & Sinh sản):* Cấu tạo neuron, cung phản xạ, tủy sống & não bộ; Các tuyến nội tiết (tuyến yên, tuyến giáp, tuyến tụy, tuyến trên thận); Cấu tạo da & điều hòa thân nhiệt; Hệ sinh sản nam/nữ.
  - *Unit 4 (Môi trường & Quần thể, Quần xã):* Các nhân tố sinh thái; Đặc trưng cơ bản của quần thể; Các mối quan hệ trong quần xã sinh vật.
  - *Unit 5 (Hệ sinh thái & Sinh quyển):* Chuỗi và lưới thức ăn; Tháp sinh thái; Tác động của con người và bảo vệ môi trường.
- **Lớp 9:**
  - *Unit 1 (Di truyền Mendel & Cơ sở phân tử):* Các thí nghiệm lai của Mendel; Cấu trúc phân tử DNA (nguyên tắc bổ sung A-T, G-C) & RNA.
  - *Unit 2 (Cơ chế phân tử & Đột biến gen):* Quá trình nhân đôi DNA; Quá trình phiên mã & dịch mã; Đột biến gen (mất, thêm, thay thế nuclêôtit).
  - *Unit 3 (Nhiễm sắc thể & Phân bào):* Cấu trúc hiển vi của NST; Nguyên phân (tạo 2 tế bào con $2n$); Giảm phân (tạo 4 giao tử $n$).
  - *Unit 4 (Di truyền liên kết & Di truyền người):* Thí nghiệm di truyền liên kết của Morgan; Di truyền liên kết với giới tính; Bệnh và tật di truyền ở người.
  - *Unit 5 (Công nghệ gen & Tiến hóa):* Ứng dụng công nghệ sinh học và chọn giống; Bằng chứng tiến hóa & Thuyết chọn lọc tự nhiên của Darwin.

### 2.3. ⚡ Môn Vật lý (`physics`) — Trọn bộ 4 khối lớp

- **Lớp 6:**
  - *Unit 0 (Đo lường cơ bản):* Đo chiều dài, thể tích, khối lượng, nhiệt độ, thời gian.
  - *Unit 1 (Lực):* Lực và biểu diễn lực; Lực tiếp xúc & không tiếp xúc; Biến dạng lò xo, lực kế; Trọng lực $P = 10m$; Lực ma sát (trượt, nghỉ, lăn); Lực cản của nước và không khí.
  - *Unit 2 (Năng lượng):* Năng lượng và các dạng năng lượng; Sự truyền năng lượng; Định luật bảo toàn năng lượng; Năng lượng hao phí & năng lượng tái tạo.
  - *Unit 3 (Trái Đất & Bầu trời):* Chuyển động nhìn thấy của Mặt Trời, Mặt Trăng; Hệ Mặt Trời & Ngân Hà.
- **Lớp 7:**
  - *Unit 1 (Tốc độ):* Tốc độ chuyển động $v = s / t$; Đồ thị quãng đường - thời gian; Đo tốc độ.
  - *Unit 2 (Âm thanh):* Nguồn âm; Sóng âm; Độ cao và tần số dao động; Độ to và biên độ sóng; Sự truyền âm trong các môi trường.
  - *Unit 3 (Ánh sáng):* Năng lượng ánh sáng, tia sáng, chùm sáng; Định luật phản xạ ánh sáng; Tính chất ảnh của vật qua gương phẳng.
  - *Unit 4 (Từ):* Nam châm, từ cực; Từ trường, từ phổ, đường sức từ; Chế tạo nam châm điện.
- **Lớp 8:**
  - *Unit 1 (Khối lượng riêng & Áp suất):* Khối lượng riêng $D = m / V$; Áp lực và áp suất $p = F / S$; Áp suất chất lỏng $p = d \cdot h$; Áp suất khí quyển; Lực đẩy Archimedes $F_A = d \cdot V$.
  - *Unit 2 (Tác dụng làm quay):* Đòn bẩy; Mômen lực.
  - *Unit 3 (Điện):* Dòng điện, nguồn điện; Mạch điện đơn giản; Tác dụng nhiệt, phát sáng, từ, hóa học, sinh lý của dòng điện.
  - *Unit 4 (Nhiệt):* Nhiệt năng; Các hình thức truyền nhiệt: dẫn nhiệt, đối lưu, bức xạ nhiệt.
- **Lớp 9:**
  - *Unit 1 (Năng lượng cơ học):* Động năng, thế năng trọng trường; Cơ năng và sự chuyển hóa cơ năng.
  - *Unit 2 (Ánh sáng):* Hiện tượng khúc xạ ánh sáng; Phản xạ toàn phần; Thấu kính hội tụ; Thấu kính phân kì; Mắt và kính lúp.
  - *Unit 3 (Điện):* Điện trở, định luật Ohm $I = U / R$; Đoạn mạch nối tiếp & song song; Năng lượng điện và công suất điện $P = U \cdot I$.
  - *Unit 4 (Điện từ):* Hiện tượng cảm ứng điện từ; Dòng điện xoay chiều; Máy biến áp.
  - *Unit 5 (Năng lượng cuộc sống):* Năng lượng hóa thạch và năng lượng tái tạo; Biến đổi khí hậu.

---

## 3. Quy tắc cho AI agent (copy sang `AGENTS.md`)

1. Đọc `plan.md` trước khi làm. Chỉ làm **milestone/task hiện tại**; xong thì báo cáo và **dừng** chờ duyệt.
2. **Không hard-code** nội dung bài tập/câu hỏi/đáp án trong component UI. Nội dung nằm ở `src/content/`, được Zod validate.
3. **Không đổi** danh sách chương/bài ở mục 2.
4. UI chỉ dùng **design tokens + component nền tảng**. Cấm CSS ad-hoc mỗi trang một kiểu; muốn variant mới → thêm vào design system (`tokens.css`).
5. **Asset:** dùng sprite sheet và bộ ảnh có sẵn trong `public/assets/`. Không vẽ lại/đổi style. Asset mới phải bám `docs/design-bible.md` và khử viền trắng thành RGBA trong suốt.
6. **Công thức hóa học** lưu dạng ASCII (`H2SO4`, `Fe^3+`), render qua `<Formula>` — không lưu ký tự subscript/superscript Unicode trong data.
7. **Đồng bộ hóa Phím tắt & Trật tự phương án:** Khi xáo trộn đáp án trắc nghiệm (MCQ Shuffle), phím tắt `1, 2, 3, 4` và `A, B, C, D` phải map chính xác 100% với chữ cái hiển thị trên giao diện.
8. Mọi thay đổi ở `chem/`, `engine/` phải có **unit test**. Checker mới phải kèm bảng ca biên.
9. Animation chỉ dùng `transform`/`opacity`; tôn trọng `prefers-reduced-motion`; không chạy animation liên tục khi không cần hoặc khi ngoài viewport.
10. **Mobile-first:** kiểm tra ở 360×640 và 390×844 trước, rồi tablet/desktop. Không dùng `100vh` (dùng `100dvh`), không dựa vào hover.
11. Thêm dependency > ~30 KB gzip: cần ghi lý do vào `docs/decisions.md`.
12. Bài tập phải là **đề gốc/diễn đạt lại**, không chép nguyên văn SGK/SBT. Tên chất và thuật ngữ theo SGK Kết nối tri thức (acid, base, oxide, hydrocarbon, alkane...).
13. Commit nhỏ, theo Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `style:`).
14. UI copy tiếng Việt, tập trung ở `src/copy/vi.ts`; giọng khích lệ, ngắn gọn, không chê học sinh.
15. Không sao chép mascot/logo/artwork/tên thành tựu của Duolingo hoặc app khác.

---

## 4. Tech stack (quyết định mặc định — đổi được, nhưng phải ghi ADR)

| Hạng mục | Chọn | Phiên bản | Lý do kỹ thuật |
|---|---|---|---|
| Framework | **Vite + React + TypeScript (strict)** | React `^19.0.0`, Vite `^6.x` | SPA tĩnh, siêu nhẹ, không cần SSR/backend, HMR tức thì |
| Routing | React Router | `^7.2.0` | Quản lý điều hướng SPA, code-split theo route |
| State | Zustand | `^5.x` | Quản lý `useUserStore` (tim, đá quý, streak, XP, settings) không boilerplate |
| Styling | Tailwind CSS + CSS variables (tokens) | `^3.x` | Tokens là nguồn duy nhất cho màu/spacing/radius/shadow/motion |
| Motion | Motion (Framer Motion) + CSS animation | `^12.x` | Chuyển cảnh lò xo vật lý (spring), modal trượt, hiệu ứng nảy 3D |
| Kéo thả | `@dnd-kit` (pointer + touch + keyboard) **+ tap-to-place** | `^6.x` | Thân thiện thiết bị cảm ứng di động, hỗ trợ accessibility |
| Validation | Zod | `^3.x` | Single source of truth cho type + validate toàn bộ content |
| Lưu trữ | localStorage + IndexedDB (`idb-keyval`) qua `ProgressRepository` | `^6.x` | Lưu trữ tiến độ bài học, lịch sử câu làm, hoạt động 100% offline |
| Search | MiniSearch | `^7.1.2` | Client-side full text search, lazy index, tìm kiếm không dấu |
| Audio | Howler.js | `^2.2.4` | Tải và phát âm thanh tương tác theo audio sprite, mở khóa iOS audio |
| Font | Nunito (self-host, subset `vietnamese` + `latin`, `font-display: swap`) | Google Font | Hỗ trợ tiếng Việt đầy đủ, nét tròn trịa thân thiện học sinh |
| Test | Vitest + Testing Library; Playwright (mobile viewport) | Vitest `^3.x` | Chạy 199 unit tests trong < 2 giây; test checkers, session reducer |
| PWA | vite-plugin-pwa (M9) | `^1.x` | Cung cấp offline shell, cache asset cho vùng xa |
| Package manager | npm | `^10.x` | Quản lý gói dependencies chuẩn |
| Hosting | static (Cloudflare Pages / Vercel / Netlify), SPA fallback | | Deploy siêu tốc, zero-cost hosting |

**Scripts chuẩn** (`package.json`):

```text
npm run dev               # Khởi chạy dev server Vite ở cổng 5173
npm run build             # Build production bundle và kiểm tra TypeScript
npm run preview           # Xem trước bản build production tại local
npm run typecheck         # tsc --noEmit kiểm tra toàn bộ kiểu dữ liệu
npm run lint              # eslint + prettier --check
npm test                  # vitest run kiểm tra toàn bộ unit tests
npm run test:watch        # vitest chạy ở chế độ watch
npm run validate:content  # Zod + kiểm tra hóa học/khoa học toàn bộ src/content
npm run slice:sprites     # cắt sprite sheet → public/assets/sprites + manifest
```

---

## 5. Cấu trúc thư mục

```text
chem-solve/
├─ plan.md  AGENTS.md  PROJECT_GUIDE.md  .env.example
├─ docs/            decisions.md  design-bible.md
├─ art/
│  ├─ source/       sprite sheet gốc & assets nguyên bản
│  └─ prompts/      prompt + tham số sinh ảnh đã dùng
├─ scripts/         slice-sprites.ts  validate-content.ts  generate-asset.ts  balance_mcq.py  remove_background.py
├─ public/assets/
│  ├─ animations/   video hiệu ứng nhỏ (medal, confetti, star...)
│  ├─ icons/        huy hiệu thành tựu, đá quý, tim, ngọn lửa streak
│  ├─ mascot/       bộ ảnh mascot 9 trạng thái (atom-*, bio-*, physics-*)
│  ├─ roadmap/      nốt lộ trình, rương báu, cúp vinh danh
│  ├─ ui/           trạng thái rỗng (empty), badge check/cross
│  └─ vfx/          hiệu ứng ngọn lửa, quỳ tím, kết tủa, sinh khí
└─ src/
   ├─ app/          router, providers, layout
   │  ├─ pages/     HomePage, LearnPage, ExercisePage, TheoryPage, PracticePage, ShopPage, ProfilePage...
   │  └─ routes.tsx
   ├─ config/       gamification.ts  review.ts  feature-flags.ts
   ├─ copy/         vi.ts (tập trung 100% UI copy tiếng Việt)
   ├─ design-system/
   │  ├─ tokens.css         biến màu sắc, khoảng cách, bóng đổ chunky 3D
   │  ├─ components/        Button, Mascot, SnakePath, SubjectTrophy, FeedbackSheet, ChemKeyboard, PhysicsKeyboard...
   │  │  └─ answers/        McqPanel, TrueFalsePanel, NumberPanel, FormulaPanel, EquationPanel, MatchPanel, SortPanel...
   │  └─ motion/            presets.ts, useReducedMotion.ts
   ├─ chem/         formula, parseFormula, molarMass, equation, checkBalance, normalize  ← thuần TS
   ├─ engine/
   │  ├─ checkers/  choice, number, formula, equation, match, sort, ordering, true-false, text
   │  ├─ session/   sessionReducer.ts, types.ts
   │  ├─ solution/  hints.ts, steps.ts, mistakes.ts
   │  ├─ review/    leitner.ts, weak-topics.ts
   │  └─ gamification/  xp.ts, hearts.ts, streak.ts, achievements.ts
   ├─ content/
   │  ├─ curriculum.ts      cấu trúc chương, bài, khối lớp 6–9
   │  ├─ contentLoader.ts   trình nạp động (Dynamic import), phân đoạn chặng học
   │  ├─ subjects.ts        quản lý 3 môn học: chem, bio, physics
   │  ├─ skills.ts          taxonomy dạng bài chi tiết
   │  ├─ schema/            Zod schemas (exercise.ts, theory.ts)
   │  ├─ kb/                periodic-table.json, ions.json, substances.json, reactions.json, activity-series.json, knowledge.json
   │  ├─ exercises/         g7/, g8/, g9/ (file JSON bài tập Hóa học)
   │  ├─ biology/           g6/, g7/, g8/, g9/ (file JSON bài tập Sinh học)
   │  ├─ physics/           g6/, g7/, g8/, g9/ (file JSON bài tập Vật lý)
   │  ├─ theories/          lý thuyết vi mô dạng flashcards
   │  └─ generators/        thuật toán sinh bài toán vô tận (mol, nồng độ, cơ năng, vận tốc...)
   ├─ features/     gamification/, minigames/
   ├─ lib/          audio.ts, utils.ts, storage.ts
   └─ test/         checkers/, chem/, session/, e2e/
```

---

## 6. Kiến trúc logic & data model

```text
CONTENT DATA (JSON + KB)  →  EXERCISE ENGINE  →  SOLUTION / HINT ENGINE  →  UI / GAME ENGINE  →  PROGRESS / GAMIFICATION
```

Mỗi tầng chỉ phụ thuộc tầng bên trái. `chem/` và `engine/` **không import React**.

### 6.1. Schema bài tập (Zod là nguồn sự thật; type suy ra từ Zod)

```ts
type Grade = 6 | 7 | 8 | 9;
type Difficulty = 1 | 2 | 3;                 // 1: dễ | 2: vừa | 3: khó
type RichText = string;                       // markup ở mục 6.2

interface Exercise {
  id: string;                  // "g8-b03-calc-001" | "bio-g7-b02-q01"
  lessonId: string;            // "g8-b03" | "bio-g7-b02"
  skillIds: string[];          // taxonomy dạng bài: "gas-volume-from-mol"
  difficulty: Difficulty;
  prompt: RichText;
  given?: { label: RichText; value: string; unit?: string }[];   // dữ kiện đã cho
  find?: { label: RichText; unit?: string };                     // đại lượng cần tìm
  knowledge: string[];         // id trong kb/knowledge.json
  answer: Answer;
  hints: { level: 1 | 2; text: RichText }[];    // 1: gợi mở · 2: nhắc công thức/quy tắc
  steps: SolutionStep[];
  finalSolution: RichText;
  commonMistakes: { id: string; message: RichText; trapAnswers?: (string | number)[] }[];
  related?: string[];          // exercise id liên quan
  minigameTags?: string[];
  visual?: { sprite: string }; // key trong sprite manifest (vd hiện tượng ↑/↓, đổi màu)
  verify?: { fn: string; args: Record<string, number | string> };  // validator tự tính lại đáp án
}

interface SolutionStep {
  kind: 'identify' | 'given' | 'knowledge' | 'equation' | 'transform' | 'compute' | 'answer' | 'pitfalls';
  title: string;
  body: RichText;
  interactive?: { prompt: string; options: RichText[]; correct: number[] };  // dùng cho chế độ guided
}

type Answer =
  | { kind: 'mcq-single'; options: Option[]; correctId: string }
  | { kind: 'mcq-multi'; options: Option[]; correctIds: string[] }
  | { kind: 'true-false'; statements: { id: string; text: RichText; correct: boolean }[] }
  | { kind: 'number'; value: number; unit?: string; decimals?: number; tolerance?: { abs?: number; rel?: number }; strictUnit?: boolean }
  | { kind: 'formula'; accepted: string[] }                        // ASCII: "H2SO4", "Fe^3+"
  | { kind: 'text'; accepted: string[]; lenientDiacritics?: boolean }
  | { kind: 'equation'; mode: 'fill-coefficients' | 'build'; reactants: string[]; products: string[];
      coefficients: number[]; condition?: string }
  | { kind: 'match'; pairs: { left: string; right: string }[] }
  | { kind: 'sort'; buckets: { id: string; label: string }[]; items: { id: string; label: string; bucketId: string }[] }
  | { kind: 'ordering'; correctOrder: string[] }
  | { kind: 'formula-builder'; tiles: string[]; accepted: string[] };
```

**Bài mẫu chuẩn Hóa học (golden sample — mọi bài khác theo khuôn này):**

```json
{
  "id": "g8-b03-calc-001",
  "lessonId": "g8-b03",
  "skillIds": ["gas-volume-from-mol"],
  "difficulty": 1,
  "prompt": "Tính thể tích của 0,2 mol khí [[H2]] ở điều kiện chuẩn (25 °C, 1 bar).",
  "given": [{ "label": "Số mol [[H2]]", "value": "0,2", "unit": "mol" }],
  "find": { "label": "Thể tích khí", "unit": "L" },
  "knowledge": ["formula.V=n*24.79"],
  "answer": { "kind": "number", "value": 4.958, "unit": "L", "decimals": 2 },
  "hints": [
    { "level": 1, "text": "Đề cho số mol, hỏi thể tích khí. Hai đại lượng này liên hệ với nhau thế nào?" },
    { "level": 2, "text": "Ở điều kiện chuẩn, 1 mol khí bất kì chiếm 24,79 L: V = n × 24,79." }
  ],
  "steps": [
    { "kind": "identify",  "title": "Nhận dạng",  "body": "Cho số mol khí, tìm thể tích → dạng chuyển đổi mol ↔ thể tích khí." },
    { "kind": "given",     "title": "Dữ kiện",    "body": "n([[H2]]) = 0,2 mol; cần tìm V." },
    { "kind": "knowledge", "title": "Kiến thức",  "body": "V = n × 24,79 (L, điều kiện chuẩn)." },
    { "kind": "compute",   "title": "Tính toán",  "body": "V = 0,2 × 24,79 = 4,958 ≈ 4,96 L." },
    { "kind": "answer",    "title": "Đáp án",     "body": "Thể tích của 0,2 mol [[H2]] là **4,96 L**." },
    { "kind": "pitfalls",  "title": "Lỗi thường gặp", "body": "Dùng nhầm 22,4 L/mol (0 °C, 1 atm) cho bài ở điều kiện chuẩn 25 °C, 1 bar." }
  ],
  "finalSolution": "V = 0,2 × 24,79 ≈ **4,96 L**.",
  "commonMistakes": [
    { "id": "used-22.4", "message": "Bạn đã dùng 22,4 L/mol. Bài này ở điều kiện chuẩn (25 °C, 1 bar) nên dùng 24,79 L/mol.", "trapAnswers": ["4.48", "4,48"] }
  ],
  "verify": { "fn": "gasVolumeFromMol", "args": { "n": 0.2 } }
}
```

`trapAnswers` = đáp án sai điển hình → tự động hiện đúng lời giải thích lỗi, hoàn toàn deterministic không cần AI.

### 6.2. Rich text markup (trong mọi chuỗi hiển thị)

| Viết | Hiển thị | Ghi chú |
|---|---|---|
| `[[H2SO4]]` | H₂SO₄ | công thức (render bằng `<sub>`) |
| `[[Fe^3+]]`, `[[SO4^2-]]` | Fe³⁺, SO₄²⁻ | ion, điện tích đúng vị trí bằng `<sup>` |
| `[[CuSO4.5H2O]]` | CuSO₄·5H₂O | muối ngậm nước (dấu chấm giữa) |
| `[[->]]`, `[[->\|t°,xt]]` | →, → có điều kiện trên mũi tên | PTHH |
| `[[up]]`, `[[down]]` | ↑, ↓ | khí bay ra / kết tủa lắng xuống |
| `**đậm**` | **đậm** | làm nổi bật từ khóa quan trọng |
| `$C_M = n / V$`, `$F_A = d \cdot V$` | Biểu thức toán / lý | công thức hiển thị cân đối |

Validator tự trích các công thức trong `[[...]]` để đánh index tìm kiếm (mục 13).

### 6.3. Knowledge base dùng chung (`src/content/kb/`)

| File | Nội dung |
|---|---|
| `periodic-table.json` | Z, kí hiệu, tên Latinh/VN, **nguyên tử khối làm tròn theo SGK** (H=1, C=12, N=14, O=16, Na=23, Mg=24, Al=27, S=32, Cl=35,5, K=39, Ca=40, Fe=56, Cu=64, Zn=65, Ag=108, Ba=137…), nhóm/chu kì, kim loại/phi kim |
| `ions.json` | ion + điện tích + tên (cho Formula Builder) |
| `substances.json` | công thức, tên (VN + tên IUPAC theo SGK), loại (acid/base/oxide/muối/kim loại/phi kim/hữu cơ), trạng thái, màu sắc, aliases tra cứu |
| `reactions.json` | PTHH chuẩn, điều kiện ($t^\circ$, xt), hiện tượng (`↑`/`↓`/đổi màu), lớp/bài liên quan |
| `activity-series.json` | dãy hoạt động hóa học kim loại: K, Na, Ca, Mg, Al, Zn, Fe, Pb, (H), Cu, Ag, Au |
| `knowledge.json` | công thức/quy tắc dùng ở bước “Kiến thức” (`n = m/M`, `V = n×24,79`, `C% = m_ct/m_dd×100%`, `d_A/B = M_A/M_B`, $P = 10m$, $v = s/t$…) |
| `biology/` | Bào quan tế bào, enzyme tiêu hóa, kháng nguyên/kháng thể nhóm máu ABO, quy tắc phân bào $2n \to 2n$ |
| `physics/` | Bảng hằng số vật lý, quy tắc chuyển đổi đơn vị ($km/h \leftrightarrow m/s$, $g/cm^3 \leftrightarrow kg/m^3$) |

> Hằng số như **24,79 L/mol (25 °C, 1 bar)** phải đối chiếu SGK Kết nối tri thức 2018 và ghi nguồn rõ ràng vào `knowledge.json`.

### 6.4. Quy tắc nội dung

- Đề gốc/diễn đạt lại; không chép nguyên văn SGK/SBT.
- Mỗi bài tập: ≥ 2 hints, ≥ 3 steps, ≥ 1 `commonMistakes` (hoặc ghi rõ lý do bỏ trống).
- Số lưu dạng number (dấu chấm); **hiển thị** dạng dấu phẩy theo chuẩn Việt Nam, đơn vị rõ ràng, nhất quán toàn app.
- Mọi PTHH trong content phải **tự cân bằng** (validator kiểm tra).
- Bài tính: khai báo `verify` hoặc dùng `generators/` để đáp án do code tính.

### 6.5. Lưu trữ tiến độ

```ts
interface ProgressRepository {
  load(): Promise<ProgressState>;
  saveAttempt(a: Attempt): Promise<void>;
  updateProfile(patch: Partial<Profile>): Promise<void>;
  exportAll(): Promise<string>;           // JSON backup
  importAll(json: string): Promise<void>;
}

interface Attempt {
  exerciseId: string;
  skillIds: string[];
  ts: number;
  attempts: number;
  correctFirstTry: boolean;
  hintsUsed: 0 | 1 | 2;
  revealed: boolean;
  timeMs: number;
  mode: 'guided' | 'quick';
}
```

State lưu có `schemaVersion` + migration. Giới hạn lịch sử (vd 2000 attempt gần nhất) để không phình bộ nhớ.

---

## 7. Chem core & hệ thống kiểm tra đáp án

### 7.1. `src/chem/` (thuần TS, có unit test riêng)

- `parseFormula(str)` → cấu trúc `{ element: count }` (hỗ trợ ngoặc `Ca(OH)2`, ion `^2+`, ngậm nước `.5H2O`).
- `normalize(str)`: NFKC (chuyển subscript/superscript Unicode về ASCII), bỏ khoảng trắng thừa, chuẩn hóa mũi tên (`→`, `->`, `=`, `⟶`). **Kí hiệu nguyên tố phân biệt hoa/thường** (`Co` ≠ `CO`) — tuyệt đối không bao giờ `toLowerCase()` công thức hóa học.
- `molarMass(formula)` tính khối lượng mol dựa trên `periodic-table.json`.
- `parseEquation(str)`, `checkBalance(eq)` → trả **chênh lệch từng nguyên tố** (“vế trái 2 O, vế phải 1 O”) để làm feedback hướng dẫn học sinh.
- `simplestCoefficients(coefs)`: tìm ước chung lớn nhất (GCD) để kiểm tra tính tối giản.
- `renderFormula` / `<Formula>`: render đẹp mắt với thẻ `<sub>`/`<sup>` và `aria-label` đọc được cho screen reader.

### 7.2. Contract checker

```ts
type Verdict =
  | { status: 'correct' }
  | { status: 'partial'; reason: 'not-simplest' | 'noncanonical-formula' | 'missing-unit' | 'missing-options'; message: string }
  | { status: 'incorrect'; reason: string; mistakeId?: string; diagnosis?: string };

interface Checker<A extends Answer, I> {
  check(answer: A, input: I): Verdict;
}
```

`partial` = học sinh hiểu đúng bản chất nhưng cách trình bày chưa tối ưu → **không trừ tim, không tính lần sai**, cho học sinh sửa lại 1 lần.

### 7.3. Quy tắc từng checker

| Checker | Quy tắc kiểm tra | Ca biên xử lý |
|---|---|---|
| **numeric** | Chấp nhận cả `0,5` và `0.5`; bỏ khoảng trắng thừa; tách số + đơn vị (`0,5 mol`). Sai số theo `decimals` (±½ đơn vị số cuối) hoặc `tolerance.abs` / `tolerance.rel`. Sai đơn vị → `partial/missing-unit`. Khớp `trapAnswers` → gắn `mistakeId`. | Dấu phẩy vs chấm; số âm; số mũ; dung sai sai số; đơn vị viết hoa/thường (`l` vs `L`, `g`, `mol`, `j`, `N`). |
| **formula** | So sánh **cấu trúc phân tử** đã parse `{ element: count }` (không so khớp chuỗi thô). Đúng thành phần nhưng sai quy ước (`OH2`, `ClNa`) → `partial/noncanonical-formula`. Sai chữ hoa/thường → giải thích rõ. `H2O2` ≠ `H2O`. | Phân tử có nhóm ngoặc `Al2(SO4)3`; ion có điện tích `Fe^3+`; tinh thể ngậm nước. |
| **text** | Không phân biệt hoa/thường, gộp khoảng trắng; `lenientDiacritics` cho tên tiếng Việt. Danh sách `accepted` gồm cả tên theo SGK lẫn cách gọi phổ biến. | Bỏ qua dấu cách đầu/cuối; ký tự tiếng Việt có dấu và không dấu; chữ hoa chữ thường. |
| **equation** | Parse hai vế; kiểm chất tham gia/sản phẩm (không phụ thuộc thứ tự trong cùng vế), cân bằng bảo toàn nguyên tử. Cân bằng đúng nhưng hệ số chưa tối giản (vd: 2:4:2 thay vì 1:2:1) → `partial/not-simplest`. Sai → chỉ ra cụ thể nguyên tố bị lệch. | Phương trình có chất giống nhau ở 2 vế; hệ số 1 (không cần gõ hoặc gõ 1); thứ tự chất đổi chỗ $A + B \leftrightarrow B + A$. |
| **choice** | Single/multi/true-false; single xáo trộn ngẫu nhiên; multi kiểm tra tập hợp `Set(input) === Set(correctIds)`. Multi chọn thiếu → `partial/missing-options`. | Trật tự lựa chọn xáo trộn runtime; phím tắt 1-4 và A-D map đúng; true-false kiểm tra từng khẳng định. |
| **match / sort** | Chấm theo cặp/bucket; trả danh sách mục sai để highlight viền đỏ. Hỗ trợ tap-to-place cho màn hình cảm ứng di động. | Đảo ngược cặp trái/phải; kéo thả nhầm giỏ; hoàn tác vị trí khi bỏ chọn. |
| **ordering** | Chấm theo thứ tự mảng; cho phép hoán đổi các bước được đánh dấu là tương đương độc lập. | Đổi chỗ 2 phần tử liên tiếp; danh sách cuộn dọc trên mobile. |

**Nguyên tắc chung:** không phạt sai chỉ vì khác biệt cách trình bày vô nghĩa; cũng không “đoán bừa” dễ dãi. Toàn bộ 10 checkers đều có bộ test suite ca biên với coverage $\ge 90\%$.

---

## 8. Giải từng bước, gợi ý, phản hồi

### 8.1. Cấu trúc lời giải (7 bước sư phạm)

| # | Bước | Nội dung giải thích | Ví dụ minh họa |
|---|---|---|---|
| 1 | **Nhận dạng** | Xác định dạng bài tập và hiện tượng | “Cho khối lượng kim loại tác dụng với acid → tính theo PTHH” |
| 2 | **Dữ kiện** | Tách dữ kiện đã cho và đại lượng cần tìm | $m(Fe) = 5,6\text{ g}$; cần tìm thể tích khí $V(H_2)$ ở đkc |
| 3 | **Kiến thức** | Nhắc lại công thức/định luật liên quan | $n = m / M$; $V = n \times 24,79$ (điều kiện chuẩn) |
| 4 | **PTHH / Biến đổi** | Viết và cân bằng PTHH hoặc biến đổi biểu thức | $Fe + 2HCl \to FeCl_2 + H_2 \uparrow$ |
| 5 | **Tính toán** | Từng bước thế số và tính toán trung gian | $n(Fe) = 5,6 / 56 = 0,1\text{ mol} \to n(H_2) = 0,1\text{ mol}$ |
| 6 | **Đáp án** | Kết quả cuối cùng kèm đơn vị đo chuẩn | $V(H_2) = 0,1 \times 24,79 = 2,479\text{ L}$ |
| 7 | **Lỗi thường gặp** | Cảnh báo các bẫy sai kinh điển | Quên cân bằng hệ số acid 2; dùng nhầm 22,4 thay vì 24,79 |

### 8.2. Hai chế độ làm bài

- **Guided (Hướng dẫn từng bước):** học sinh tự làm từng bước nhỏ (chọn dạng bài → tách dữ kiện → chọn công thức → tính toán) qua `step.interactive`. Mặc định áp dụng cho các bài toán tính phức tạp trong Learn path.
- **Quick (Giải nhanh):** học sinh nhập trực tiếp đáp án, có sẵn thang hỗ trợ khi gặp khó. Mặc định cho Practice / Review / Minigames.

### 8.3. Thang hỗ trợ (Hint Ladder)

`Gợi ý Cấp 1` (gợi mở định hướng, không lộ số) → `Gợi ý Cấp 2` (nhắc công thức mấu chốt) → `Xem bước giải` (mở dần từng bước) → `Xem toàn bộ lời giải` (mở khóa đáp án đầy đủ).

### 8.4. Luồng khi sai

1. **Lần 1 sai:** trừ 1 tim, hiển thị **chẩn đoán bẫy sai** (khớp `trapAnswers` hoặc diagnosis của checker) + khuyến khích dùng Gợi ý Cấp 1 → cho thử lại.
2. **Lần 2 sai:** trừ 1 tim, mở khóa Gợi ý Cấp 2 → cho thử lại lần cuối.
3. **Lần 3 sai (hoặc bấm Xem lời giải):** hiện lời giải đầy đủ 7 bước, đánh dấu câu là `revealed`, đưa câu hỏi vào hàng đợi ôn tập ngắt quãng (Leitner).
4. Phản hồi luôn giải thích **nguyên nhân vì sao sai**, tuyệt đối không chỉ thông báo cụt lủn “sai rồi”.

---

## 9. Kiểu bài tập & State machine

### 9.1. Catalog kiểu bài

| Nhóm | `answer.kind` | Giao diện UI | Đặc tả & Ghi chú |
|---|---|---|---|
| **Trắc nghiệm** | `mcq-single`, `mcq-multi`, `true-false` | Thẻ chọn chunky nổi khối | Tự động xáo trộn ngẫu nhiên trật tự đáp án runtime (chống học vẹt); phím tắt 1-4, A-D đồng bộ |
| **Điền đáp án** | `number`, `formula`, `text` | Ô nhập liệu + Bàn phím ảo chuyên dụng | Ô số dùng `inputMode="decimal"`, font $\ge 16\text{px}$ tránh iOS tự zoom; công thức có `ChemKeyboard` |
| **Kéo thả** | `match`, `sort`, `formula-builder` | Khay giá ống nghiệm, giỏ phân loại | Luôn hỗ trợ cơ chế **tap-to-place** (chạm 2 lần) song song với kéo thả chuột |
| **Phương trình** | `equation` (`fill-coefficients` / `build`) | Ô nhập hệ số / Xếp thẻ chất | Kiểm tra bảo toàn số nguyên tử và tính tối giản của tỉ lệ hệ số |
| **Thứ tự** | `ordering` | Danh sách thẻ cuộn kéo sắp xếp | Sắp xếp trình tự thí nghiệm hoặc các bước giải bài toán |
| **Bài toán tính** | `number` (+ guided steps) | Guided mode / Quick mode | Bài toán mol, thể tích khí, nồng độ dung dịch, định luật bảo toàn, tốc độ, áp suất, cơ năng |
| **Hiện tượng / Nhận biết**| `mcq-*` + `visual` | Sprite trực quan (màu, kết tủa `↓`, khí `↑`) | Minh họa hiện tượng hóa học và phản ứng sinh động |

**`ChemKeyboard` & `PhysicsKeyboard` (MUST):** bàn phím ảo chuyên dụng trên mobile:
* Hóa học: các ký hiệu nguyên tố thường dùng ($H, C, N, O, Na, Fe, Cu...$), chữ số (tự động chuyển thành chỉ số dưới subscript khi gõ sau chữ cái), dấu ngoặc `()`, điện tích `+ -`, mũi tên phản ứng `→`, khí bay lên `↑`, kết tủa `↓`, nút xóa Backspace.
* Vật lý: các đại lượng ($v, s, t, P, m, F, A, d...$), đơn vị ($m/s, km/h, N, J, W, kg, Pa$), số thập phân và phép tính.

### 9.2. State machine mỗi câu (`sessionReducer` thuần, có unit test)

```text
[UNANSWERED] ──(nhập dữ liệu)──> [ANSWERING] ──(bấm Kiểm tra)──> [CHECKING]
                                                                      │
              ┌──────────────────────────────────────────────────────┴───────────────┐
              ▼                                                                      ▼
          [CORRECT]                                                              [WRONG]
              │                                                                      │
              ▼                                                       ┌──────────────┴──────────────┐
       (+XP, +Combo)                                                  ▼                             ▼
              │                                                (attempts < 3)                 (attempts >= 3)
              ▼                                                       │                             │
       [NEXT_QUESTION]                                                ▼                             ▼
              │                                                (Trừ tim, Gợi ý)               [REVEALED]
              ▼                                                       │                       (Hiện lời giải)
      [SESSION_COMPLETE]                                              ▼                             │
                                                               [DISMISS_FEEDBACK]                   ▼
                                                                      │                      [NEXT_QUESTION]
                                                                      ▼
                                                                 [UNANSWERED]
```

**Guard bắt buộc:**
- Không submit hai lần (khóa nút bấm khi đang ở trạng thái `CHECKING` hoặc `FEEDBACK`).
- Không chuyển câu khi feedback animation đang chạy.
- Chỉ **một kênh animation** tại một thời điểm (hàng đợi xử lý tuần tự), không chạy đè chồng chéo.
- UI hoàn toàn **suy ra** từ state dữ liệu (single source of truth); có unit test kiểm tra chuyển trạng thái hợp lệ và từ chối trạng thái không hợp lệ.

---

## 10. Gamification & tiến độ

Mọi con số cân bằng được định nghĩa tập trung tại `src/config/gamification.ts` — **không rải rác trong code**:

| Cơ chế | Giá trị mặc định | Diễn giải chi tiết |
|---|---|---|
| **XP câu hỏi** | Đúng lần 1: **+10 XP** · Lần 2: **+6 XP** · Lần 3: **+3 XP** · Xem lời giải: **0 XP** | Thưởng cao nhất cho nỗ lực tự giải đúng ngay lần đầu |
| **Trừ XP hỗ trợ** | Dùng Gợi ý Cấp 2 hoặc Xem bước giải: **−2 XP** | Vẫn đảm bảo nhận tối thiểu 3 XP nếu tự làm đúng |
| **Combo Streak** | Đúng liên tiếp $\ge 3$ câu: **+2 XP/câu** · $\ge 5$ câu: **+5 XP/câu** | Khích lệ sự tập trung cao độ |
| **Hoàn thành chặng** | **+20 XP** thưởng kết thúc chặng | Tặng thêm **+10 XP** nếu hoàn thành chặng hoàn hảo không mất tim |
| **Minigame** | Tính theo điểm số đạt được, tối đa **+25 XP** | Giúp củng cố kỹ năng qua trò chơi |
| **Daily Challenge**| **+30 XP** và duy trì chuỗi Streak ngày | Thử thách 5 câu hỏi nhanh tổng hợp mỗi ngày |
| **Mục tiêu ngày** | Tùy chọn 20 / 40 / 60 XP (mặc định: 20 XP) | Học sinh tự đặt cam kết học tập mỗi ngày |
| **Hearts (Tim)** | Tối đa 5 tim; trừ 1 tim mỗi lần check **sai** (không trừ ở `partial`); hồi 1 tim / 20 phút | Hết tim → vào “Chế độ ôn luyện” (`/practice`) không trừ tim, hồi phục tim miễn phí |
| **Streak** | +1 ngày khi hoàn thành $\ge 1$ chặng hoặc Daily Challenge | Tính theo múi giờ thiết bị; có thể mua khiên Streak Freeze trong Shop |
| **Level** | $\text{xpToReach}(n) = 100 \times n^{1.4}$ | L1: 0 · L2: 100 · L3: 260 · L4: 480 · L5: 750... |
| **Kinh tế Đá quý (Gems)**| Chặng: +10 gems · Chặng hoàn hảo: +15 gems · Rương: +50~100 gems | Mua 1 Tim: 20 gems · Hồi 5 Tim: 80 gems · Streak Freeze: 150 gems |
| **Mở khóa chặng** | Chặng sau mở khi chặng trước đạt $\ge 70\%$ số câu đúng | Trang Luyện tập (`/practice`) mở tự do toàn bộ |

### Hệ thống Thành tựu (Achievements)

Khai báo trong `achievements.ts`: id, tên, điều kiện thống kê, icon huy hiệu. Thành tựu mang bản sắc riêng của STEM-Solve:
- **Cân bằng bậc thầy:** Cân bằng đúng ngay lần đầu $\ge 20$ phương trình hóa học.
- **Chiến binh Mol:** Giải đúng xuất sắc $\ge 30$ bài toán biến đổi mol, khối lượng và thể tích.
- **Bác sĩ Nhóm máu:** Hoàn thành xuất sắc 5 ca cấp cứu trong minigame truyền máu ABO.
- **Thợ săn Động năng:** Tính toán chính xác $\ge 15$ bài toán cơ năng và động năng.
- **Chuyên gia Acid – Base:** Hoàn thành trọn vẹn nhóm bài học về pH và phản ứng trung hòa.
- **Nhà Thực vật học:** Nhận diện chính xác 100% các bào quan và phương trình quang hợp.

### Visual mapping biểu tượng game

| Cơ chế | Biểu tượng Visual chính |
|---|---|
| **Streak** | Ngọn lửa **đèn cồn** cháy bập bùng rực rỡ |
| **Hearts** | **Ống nghiệm** nhỏ chứa dung dịch phát sáng |
| **XP** | **Tinh thể muối / Lục giác phân tử** hoàng kim |
| **Gems** | **Viên ngọc lục bảo / Kim cương** đa giác 3D |
| **Progress** | **Ống đong / Pipet** có vạch chia và mức chất lỏng dâng cao |
| **Milestone / Chặng** | **Bình Erlenmeyer / Cúp vinh danh 3D** đặc trưng từng môn |

---

## 11. Minigames tương tác chuyên sâu

Mỗi minigame **củng cố một kỹ năng khoa học cụ thể**, khai báo `skillIds`, nạp dữ liệu động từ KB (không hard-code). Dùng chung `MinigameShell` (bộ đếm giờ, tính điểm, thưởng XP, không trừ tim):

| Minigame | Kỹ năng rèn luyện | Cơ chế tương tác | Nguồn dữ liệu |
|---|---|---|---|
| **Cấp cứu truyền máu ABO** | Quy tắc truyền máu an toàn, kháng nguyên hồng cầu và kháng thể huyết tương | Kéo túi máu tương thích truyền cho bệnh nhân | `kb/biology/blood.json` |
| **Cân bằng phản ứng (Equation Balance)**| Cân bằng số nguyên tử 2 vế PTHH | Bấm nút chunky tăng/giảm hệ số từng chất | `reactions.json` + `checkBalance` |
| **Ghép công thức (Formula Builder)** | Hóa trị, liên kết ion, công thức phân tử đúng | Kéo các mảnh thẻ ion/nguyên tử vào khay phản ứng | `ions.json` + `substances.json` |
| **Xây dựng chuỗi phản ứng (Reaction Builder)**| Dự đoán chất tham gia, sản phẩm, điều kiện | Chọn và nối các thẻ chất qua mũi tên phản ứng | `reactions.json` |
| **Nối cặp khoa học (Match Game)** | Nhận diện chất - ứng dụng, định luật - công thức, bào quan - chức năng | Chạm nối 2 thẻ tương ứng (hỗ trợ tap-to-place) | `substances.json`, `biology/`, `physics/` |
| **Phân loại vào giỏ (Sort Game)** | Phân biệt Acid/Base/Oxide/Muối; Kim loại/Phi kim; Đơn bào/Đa bào | Kéo thả vật thể vào đúng giỏ quy định | `substances.json`, taxonomy skills |
| **Hỏi xoáy đáp nhanh (Speed Challenge)**| Phản xạ nhanh ký hiệu, hằng số, hiện tượng | Trả lời 10 câu trắc nghiệm ngắn trong 45 giây | Ngân hàng câu hỏi trắc nghiệm nhanh |
| **Thử thách ngày (Daily Challenge)** | Ôn tập tổng hợp kiến thức liên môn | 5 câu hỏi/ngày chọn theo seed ngày + chủ đề yếu | Exercises + Spaced repetition |
| **Đấu trường Ôn tập (Review Game)** | Xóa tan các câu hỏi từng làm sai | Nạp tự động từ hàng đợi ôn tập ngắt quãng Leitner | Lịch sử attempt người dùng |

---

## 12. Danh sách màn hình & URL Routes

| Route | Tên màn hình | Nội dung & Chức năng chính |
|---|---|---|
| `/` | **Home** | Bảng điều khiển học tập hôm nay, tiếp tục chặng đang dở, Daily Challenge, streak, XP, mục tiêu ngày |
| `/learn`, `/learn/:grade` | **Learn / Path** | Bản đồ ziczac SnakePath theo từng khối lớp (6, 7, 8, 9), chọn môn học, các nốt bài học, rương kho báu |
| `/exercise/:lessonId/:nodeId` | **Exercise** | Phòng lab làm bài tập tập trung: đề bài, bàn phím ảo, thang gợi ý, feedback sheet |
| `/theory/:lessonId` | **Theory** | Thư viện lý thuyết vi mô flashcards đọc nhanh 2 phút trước khi làm bài tập |
| `/practice` | **Practice** | Đấu trường sinh đề bài vô tận (Generators), luyện tập theo chuyên đề, hồi tim miễn phí |
| `/shop` | **Shop** | Cửa hàng đổi đá quý lấy tim, khiên bảo vệ streak, rương bí ẩn |
| `/profile` | **Profile** | Hồ sơ học sinh, linh vật đại diện, bảng huy hiệu thành tựu, thống kê streak, cài đặt âm thanh |
| `/progress` | **Progress** | Biểu đồ tiến độ, cây kỹ năng khoa học, phát hiện chủ đề còn yếu cần củng cố |
| `/search` | **Search** | Tra cứu nhanh công thức, chất hóa học, phương trình phản ứng, bài học (MiniSearch) |
| `/games`, `/games/:gameId` | **Minigames** | Trung tâm tổng hợp các trò chơi khoa học tương tác |
| `/dev/design-system` | **Design System Gallery** | (Chỉ dành cho Dev) Trưng bày toàn bộ components, biến thể màu, trạng thái nút, animations |

### Bố cục màn Exercise (mobile-first)

- **Thanh điều hướng đỉnh (Top bar):** Nút Thoát $\times$ (hiển thị popup xác nhận nếu đang làm dở) · Thanh tiến độ ống đong chia vạch · Chỉ số Tim còn lại.
- **Khung đề bài:** Khung Erlenmeyer cách điệu nổi 3D chứa đề bài; các chip dữ kiện *Đã cho* / *Cần tìm*; ảnh/sprite hiện tượng thực tế nếu có.
- **Vùng trả lời:** Tự động hiển thị component phù hợp theo `answer.kind` (McqPanel, NumberPanel, FormulaPanel, EquationPanel...).
- **Thanh tương tác đáy (Sticky Bottom Bar, chừa safe-area):** Nút `Gợi ý` · Nút chunky 3D `KIỂM TRA` / `TIẾP TỤC`. Sử dụng `visualViewport` để không bị bàn phím ảo điện thoại che khuất.
- **Feedback Sheet:** Bảng trượt lò xo êm ái từ đáy màn hình: Xanh lá = Đúng · Vàng hổ phách = Gần đúng (partial) · Đỏ tươi = Sai; kèm hình ảnh linh vật biểu cảm tương ứng + lời giải thích sư phạm + nút hành động.

---

## 13. Search & Review Engine

### Tìm kiếm (MiniSearch Client-side)

- Hỗ trợ tìm kiếm theo: tên chất, công thức hóa học, phương trình phản ứng, dạng bài, bài học, khối lớp.
- Chuẩn hóa: loại bỏ dấu tiếng Việt, không phân biệt hoa/thường (`axit sunfuric` $\to$ `H2SO4`; `naoh` $\to$ `NaOH`).
- Index tự động tổng hợp từ `substances.json`, `reactions.json`, `skills.ts`, danh mục bài học và toàn bộ công thức trích xuất từ ký hiệu `[[...]]` trong các bài tập.
- Kết quả tìm kiếm hiển thị phân nhóm rõ ràng: Bài học liên quan · Phương trình hóa học · Bài tập mẫu · Minigame tương ứng.

### Review engine (`engine/review/`)

- **Thuật toán lặp lại ngắt quãng Leitner 5 hộp:**
  - Khoảng cách ôn tập: Hộp 1 (1 ngày) · Hộp 2 (2 ngày) · Hộp 3 (4 ngày) · Hộp 4 (7 ngày) · Hộp 5 (14 ngày).
  - Trả lời đúng ngay lần 1 $\to$ thăng cấp hộp kế tiếp.
  - Trả lời sai hoặc bấm xem lời giải (`revealed`) $\to$ hạ ngay về Hộp 1.
- **Phát hiện chủ đề yếu (Weak-topic Detection):** Kỹ năng `skillId` có $\ge 5$ lần làm gần nhất và tỷ lệ chính xác $< 70\%$.
- **Bài tương tự (Similar Exercises):** Tự động sinh đề bài mới từ `generators/` có cùng `skillIds` và độ khó tương đương để học sinh củng cố.
- Giới hạn hàng đợi ôn tập hằng ngày tối đa 10 câu để tránh gây áp lực học tập quá tải cho học sinh.

---

## 14. Visual direction & Design System

**Concept chủ đạo:** *Digital Science Laboratory + Playful Tactile Learning Game.* Nhìn vào nhận ra ngay không gian phòng thí nghiệm Khoa học Tự nhiên sinh động, không bị nhầm lẫn với web học ngoại ngữ hay toán học thông thường.

**DNA thị giác khoa học:** Bình Erlenmeyer · ống nghiệm · giá ống nghiệm gỗ · ống đong/pipet · hạt nguyên tử quay quanh hạt nhân · liên kết hóa học · lục giác phân tử · kết tủa lắng đọng · bọt khí sủi tăm · dải đo pH quỳ tím · ngọn lửa đèn cồn · tinh thể muối.

**Phong cách mỹ thuật:** 2D Vector có chiều sâu xúc giác (Tactile 3D Flat) · các khối bo góc dày dặn (chunky shapes) · viền nổi đậm nét · màu sắc khoa học tươi sáng, tương phản cao đạt chuẩn WCAG AA. **Tránh:** đổ bóng mờ nhạt generic, lạm dụng hiệu ứng kính mờ (glassmorphism) gây lag máy cũ.

**Typography:** Font chữ Nunito (subset Latinh và Tiếng Việt đầy đủ). Toàn bộ công thức khoa học render qua `<Formula>` với thẻ `<sub>`/`<sup>`, không dựa vào glyph unicode của font.

### Design tokens chuẩn (`tokens.css`)

| Token CSS | Mã màu Hex | Ý nghĩa & Ứng dụng khoa học |
|---|---|---|
| `--color-primary` | `#0ea5e9` (Sky-500) | Nhận diện Hóa học, dung dịch CuSO₄, nước cất |
| `--color-primary-dark` | `#0284c7` (Sky-600) | Bóng đáy 3D của nút Hóa học |
| `--color-bio` | `#10b981` (Emerald-500) | Nhận diện Sinh học, sắc tố diệp lục, sự sống |
| `--color-bio-dark` | `#047857` (Emerald-700) | Bóng đáy 3D của nút Sinh học |
| `--color-physics` | `#eab308` (Yellow-500) | Nhận diện Vật lý, năng lượng, tia điện |
| `--color-physics-dark` | `#ca8a04` (Yellow-600) | Bóng đáy 3D của nút Vật lý |
| `--color-success` | `#22c55e` (Green-500) | Trả lời chính xác, hoàn thành chặng học |
| `--color-danger` | `#ef4444` (Rose-500) | Báo lỗi, acid đậm đặc, trừ tim |
| `--color-background` | `#0f172a` (Slate-950) | Nền phòng Lab tối hiện đại, bảo vệ mắt |
| `--color-surface` | `#18272f` (Deep Slate) | Khay thẻ câu hỏi, bề mặt nổi 3D |

### Thư viện component nền tảng

`Button` (chunky 3D) · `Card` · `Progress` (ống đong) · `XPBadge` · `Heart` (ống nghiệm) · `Streak` (đèn cồn) · `Badge` · `Modal` · `Toast` · `HintLadder` · `FeedbackSheet` · `Mascot` · `Formula` · `ChemKeyboard` · `PhysicsKeyboard` · `SnakePath` · `SubjectTrophy`.

---

## 15. Assets: Sprite sheet, Mascot & Đồ họa

### 15.1. Sprite sheets & Tài nguyên đồ họa

| Tên tài nguyên | Thành phần chi tiết | Ứng dụng trong giao diện |
|---|---|---|
| **Sheet 1 — Thẻ & Khay** | Khung câu hỏi Erlenmeyer, ô thẻ nguyên tố bảng tuần hoàn, lục giác phân tử, giá ống nghiệm, dấu `+`, mũi tên phản ứng | Đề bài, thẻ nguyên tố `H, O, Fe, Cu`, khay kéo thả, ghép công thức |
| **Sheet 2 — Nút bấm & Chỉ số** | Nút bấm chunky push buttons, ống nghiệm tim, đèn cồn streak, ống đong tiến độ, tinh thể muối XP | Nút `KIỂM TRA`, `TIẾP TỤC`, thanh trạng thái, phần thưởng kết thúc |
| **Sheet 3 — Hiện tượng & Phản ứng** | Bọt khí `↑`, kết tủa `↓`, quỳ tím đổi màu đỏ/xanh, khói puff, bình tam giác milestone | Minh họa hiện tượng phản ứng, animation feedback, huy hiệu nốt |

### 15.2. Pipeline xử lý tài nguyên

1. Toàn bộ hình ảnh trong `public/assets/` được xử lý bóc tách phông nền trắng thành **PNG RGBA trong suốt** qua thuật toán flood-fill (`scripts/remove_background.py`), khử sạch viền răng cưa (edge feathering).
2. Hình ảnh hiển thị qua `<Sprite name="..." />` hoặc component chuyên dụng, giữ nguyên tỉ lệ khung hình (aspect ratio) và vùng an toàn (safe-padding) tránh lem viền.
3. Đồng bộ giao diện tối hoàn hảo trên nền `#0f172a` mà không xuất hiện bất kỳ viền trắng thừa nào.

### 15.3. Bộ 3 Mascot độc quyền (9 trạng thái cảm xúc)

* **Atom (Hóa học):** Bé phân tử nước xanh thông thái đeo kính mắt thí nghiệm.
* **Leafy (Sinh học):** Chú ếch xanh mặc áo blouse bác sĩ năng động, yêu thiên nhiên.
* **Proton (Vật lý):** Mèo cam kỹ sư đeo kính bảo hộ cầm kính lúp năng lượng điện trường.
* *9 trạng thái biểu cảm:* `idle` (nghỉ), `happy` (vui vẻ), `thinking` (suy nghĩ), `correct` (chúc mừng), `wrong` (tiếc nuối), `surprised` (ngạc nhiên), `cheering` (cổ vũ), `celebrating` (ăn mừng đỉnh điểm), `out-of-hearts` (hết tim).

### 15.4. Cúp vinh danh 3D độc quyền (`SubjectTrophy.tsx`)

* **Hóa học:** Bình Chưng Cất Alembic Hoàng Kim sóng sánh bọt khí vàng hổ phách.
* **Sinh học:** Cúp Mầm Cây & Chuỗi Xoắn ADN Hoàng Kim với mầm lá xanh ngọc lục bảo vươn cao.
* **Vật lý:** Cúp Lõi Năng Lượng & Quỹ Đạo Nguyên Tử Hoàng Kim với các vành electron phát sáng xoay tròn.

---

## 16. Animation, game feel, sound

### 16.1. Công cụ & Cấu hình lò xo

Sử dụng CSS Animation cho các hiệu ứng hạt nhỏ và Motion (Framer Motion) cho chuyển cảnh giao diện. Preset chuyển động dùng chung tại `src/design-system/motion/presets.ts`:

```ts
export const spring = {
  soft:   { type: 'spring', stiffness: 400, damping: 32 },
  bouncy: { type: 'spring', stiffness: 500, damping: 18 },   // nảy vừa phải, tự nhiên
  snappy: { type: 'spring', stiffness: 600, damping: 25 },   // phản hồi tức thì
};
```

### 16.2. Nút bấm cơ học (Chunky Buttons)

Mặt trên sáng màu rõ nét · Đáy dày 3D (solid shadow $4\text{px} - 6\text{px}$) · Hover nhẹ trên máy tính · **Pressed state chân thực trên mọi thiết bị:** Khi nhấn chuột hoặc chạm tay cảm ứng (`:active`), toàn bộ bề mặt nút dịch chuyển xuống `translate-y-1` hoặc `translate-y-1.5`, triệt tiêu hoàn toàn bóng đáy, mô phỏng cảm giác bấm phím cơ học cực kỳ đã tay.

### 16.3. Micro-interactions

| Tình huống | Phản hồi tương tác ĐÚNG (✓) | Phản hồi tương tác SAI (✗) |
|---|---|---|
| **Hiệu ứng thị giác** | Checkmark xanh bật sáng · Mascot nhảy múa chúc mừng · Số XP nảy số tăng dần · Hạt confetti bùng nổ | Lắc nhẹ màn hình (shake) · Viền chuyển đỏ · Mascot gãi đầu tiếc nuối · Hộp gợi ý từ từ trượt lên |
| **Nguyên tắc thiết kế** | Không chỉ dùng màu sắc đơn thuần: luôn kèm biểu tượng rõ ràng và âm thanh tương ứng |

### 16.4. Hiệu ứng khoa học chân thực (Gắn liền bản chất, không trang trí thừa)

| Hiện tượng | Animation tương ứng | Giới hạn kỹ thuật |
|---|---|---|
| Khí sinh ra `↑` | Bọt khí tròn li ti sủi bọt bay dần lên trên | Tối đa 12 phần tử, chạy 1 lần rồi dừng |
| Kết tủa `↓` | Các hạt tinh thể màu lắng dần xuống đáy ống nghiệm | Dừng animation khi ra khỏi màn hình |
| Mức chất lỏng | Cột dung dịch trong ống đong từ từ dâng lên theo vạch chia | Chuyển động mượt bằng CSS transform |
| Đổi màu chỉ thị | Giọt quỳ tím loang màu từ từ trong dung dịch | Shader gradient chuyển màu êm ái |

### 16.5. Hệ thống Âm thanh (Howler Audio Sprite)

- Các nhóm âm thanh tương tác: `click` (lách cách chọn phương án), `correct` (hợp âm tươi sáng), `wrong` (tiếng gõ trầm nhẹ), `levelup` (chuông keng rộn rã), `complete` (pháo hoa chúc mừng chặng).
- Âm thanh ngắn, phát tức thì không có độ trễ, âm lượng mặc định $50\%$.
- Luôn có **nút bật/tắt âm thanh** tiện lợi trên thanh trạng thái và trang Cài đặt.
- Tự động mở khóa Web Audio trên thiết bị iOS ngay lần chạm đầu tiên của người dùng.

---

## 17. Responsive, accessibility, performance

### 17.1. Responsive & Touch-friendly

- Thiết kế Mobile-First: Kiểm thử nghiêm ngặt tại kích thước 360×640 và 390×844 trước khi tối ưu cho tablet và desktop.
- Vùng chạm ngón tay (touch target) tối thiểu đạt $44 \times 44\text{ px}$.
- Sử dụng đơn vị `100dvh` (Dynamic Viewport Height) để giao diện luôn khớp vặn vẹo mọi kích thước màn hình điện thoại mà không bị thanh địa chỉ trình duyệt che khuất.
- Cơ chế **tap-to-place** (chạm 2 lần) được hỗ trợ trên 100% các bài tập kéo thả để người dùng không bắt buộc phải kéo ngón tay mỏi mệt.

### 17.2. Accessibility (a11y)

- Độ tương phản chữ và nền đạt chuẩn **WCAG AA** ($\ge 4.5:1$).
- Toàn bộ câu hỏi trắc nghiệm hỗ trợ phím tắt bàn phím: Phím `1, 2, 3, 4` và `A, B, C, D` để chọn đáp án; phím `Enter` để kiểm tra hoặc chuyển câu tiếp theo.
- Tự động phát thông báo qua vùng `aria-live` khi trả lời đúng hoặc sai cho các thiết bị hỗ trợ khiếm thị.
- Tôn trọng thuộc tính hệ thống `prefers-reduced-motion`: Tự động tắt hiệu ứng nảy hạt và chuyển cảnh phức tạp khi người dùng kích hoạt chế độ giảm chuyển động.

### 17.3. Performance Budget (Ngân sách hiệu năng)

| Chỉ số hiệu năng | Mục tiêu ngân sách | Hiện trạng đạt được |
|---|---|---|
| **JS bundle nạp ban đầu** | $\le 200\text{ KB}$ gzip | Đạt chuẩn nhờ code-splitting React lazy |
| **Tài nguyên ảnh/sprite ban đầu** | $\le 300\text{ KB}$ | Đạt chuẩn nhờ định dạng WebP/PNG tối ưu |
| **Dung lượng file JSON mỗi bài** | $\le 60\text{ KB}$ | Nạp lười (lazy load) chỉ khi học sinh mở bài |
| **Điểm số Lighthouse Mobile** | Performance $\ge 90$ · A11y $\ge 95$ | Đạt chuẩn trên Google Chrome Mobile Audit |
| **Độ trễ phản hồi (Check $\to$ Feedback)**| $< 100\text{ ms}$ cảm nhận được | **$< 30\text{ ms}$** nhờ checkers thuần TypeScript |
| **Khung hình chuyển động (FPS)** | $60\text{ fps}$ ổn định | Mượt mà trên cả thiết bị Android cấu hình yếu |

---

## 18. Testing & Definition of Done

### 18.1. Các tầng kiểm thử tự động

| Tầng kiểm thử | Công cụ | Phạm vi kiểm tra & Mục tiêu chất lượng |
|---|---|---|
| **Unit Test** | Vitest | `src/chem/`, `src/engine/checkers/`, `sessionReducer`, tính toán XP/tim/streak, generators — **Đạt 199/199 tests pass xanh** |
| **Content Validation**| `npm run validate:content` | Xác thực Zod schema toàn bộ file JSON bài tập; kiểm tra ID duy nhất; phương trình tự cân bằng; hằng số khoa học chuẩn xác |
| **Component Test** | Testing Library | Kiểm tra hiển thị đủ các trạng thái của nút bấm, thẻ bài, bàn phím ảo |
| **E2E Test** | Playwright | Kiểm thử luồng học hoàn chỉnh trên viewport mobile 390×844: Chọn bài $\to$ Làm bài $\to$ Nhận gợi ý $\to$ Hoàn thành $\to$ Lưu tiến độ |
| **QA Thủ công** | Checklist mục 18.3 | Kiểm tra cảm giác game thực tế trên thiết bị di động thật |

### 18.2. Definition of Done (DoD) cho mỗi tính năng

- [x] Code chạy đúng nghiệp vụ khoa học; có unit test bao phủ ca biên; `npx tsc --noEmit` đạt 0 lỗi; `npm test` pass 100%.
- [x] Giao diện thích ứng hoàn hảo từ mobile 360px đến desktop; hỗ trợ cảm ứng mượt mà.
- [x] Có đầy đủ trạng thái: loading, error, empty (sử dụng mascot biểu cảm).
- [x] Có phản hồi tương tác xúc giác (pressed state) và âm thanh Howler rõ ràng; tôn trọng reduced-motion.
- [x] Tuyệt đối không hard-code nội dung bài tập trong UI; schema Zod xác thực 100% dữ liệu.
- [x] Sử dụng đúng design tokens trong `tokens.css`; không viết CSS ad-hoc phá vỡ hệ thống.
- [x] Không làm ảnh hưởng hay phá vỡ các tính năng khác trong dự án.
- [x] Đáp ứng đầy đủ ngân sách hiệu năng mục 17.3.

### 18.3. Checklist QA nội dung khoa học (dành cho người review)

- [ ] Kiến thức chính xác tuyệt đối theo chương trình SGK Kết nối tri thức 2018; số liệu hằng số khớp chuẩn ($24,79\text{ L/mol}$, nguyên tử khối theo SGK).
- [ ] Ký hiệu hóa học, công thức, ion, điện tích, mũi tên khí bay lên `↑` và kết tủa `↓` hiển thị chính xác.
- [ ] Ma trận đáp án chấp nhận hợp lý (hỗ trợ cả dấu phẩy và chấm thập phân, không quá khắt khe cách trình bày nhưng không dễ dãi sai bản chất).
- [ ] Gợi ý có tính sư phạm định hướng, không làm lộ đáp án; các bước giải mạch lạc; chẩn đoán bẫy sai thực tế.
- [ ] Đề bài là đề gốc hoặc được diễn đạt lại sáng tạo, không chép nguyên văn SGK/SBT.

---

## 19. Milestones: Báo cáo Tiến độ & Lộ trình Phát triển

### ✅ CÁC MILESTONES ĐÃ HOÀN THÀNH 100% (M0 ➔ M9)

#### M0 — Scaffold *(HOÀN THÀNH)*
- [x] Khởi tạo Vite + React 19 + TypeScript strict, ESLint, Prettier, Vitest, alias `@/`.
- [x] Cấu trúc thư mục chuẩn mục 5; scripts chuẩn package.json mục 4.
- [x] `AGENTS.md`, `PROJECT_GUIDE.md`, `docs/decisions.md`.
- [x] React Router skeleton cho toàn bộ các route mục 12.
- [x] Font Nunito self-host; viewport meta; `100dvh`; safe-area mobile.
* **Nghiệm thu:** `npm run dev` khởi chạy mượt mà; `tsc --noEmit` 0 lỗi; điều hướng trơn tru mọi trang.

#### M1 — Design System & Assets *(HOÀN THÀNH)*
- [x] Xử lý bộ ảnh asset trong suốt RGBA (`scripts/remove_background.py`).
- [x] Hệ thống design tokens tập trung tại `tokens.css`.
- [x] Bộ components nền tảng: Button chunky 3D, Card, Progress ống đong, Heart, Streak đèn cồn, XPBadge, Mascot, Formula, ChemKeyboard, PhysicsKeyboard.
- [x] Cấu hình lò xo `spring` và hook `useReducedMotion`.
- [x] Phòng trưng bày `/dev/design-system` gallery hiển thị đủ trạng thái.
* **Nghiệm thu:** Toàn bộ components đồng bộ chuẩn tokens; pressed state nảy cơ học trên cảm ứng; tương phản WCAG AA.

#### M2 — Chem Core & Exercise Engine *(HOÀN THÀNH)*
- [x] `src/chem/`: `parseFormula`, `normalize`, `molarMass`, `parseEquation`, `checkBalance`, `<Formula>`.
- [x] Knowledge base: `periodic-table.json`, `ions.json`, `substances.json`, `reactions.json`, `activity-series.json`, `knowledge.json`.
- [x] Zod schema `ExerciseSchema`, `AnswerSchema` với 10 kiểu bài.
- [x] Toàn bộ 10 checkers mục 7 độc lập và có unit test ca biên.
- [x] `sessionReducer` thuần chức năng và bộ engine gợi ý, bước giải, bẫy sai.
* **Nghiệm thu:** Unit test checkers và chem core đạt coverage $\ge 90\%$; `checkBalance` chỉ ra chính xác nguyên tố bị lệch.

#### M3 — Vertical Slice: Hóa 8 Bài 3 (Mol và tỉ khối khí) *(HOÀN THÀNH)*
- [x] Trọn bộ $\ge 12$ bài tập gốc phân loại 6 kiểu bài tập; có chế độ Guided 7 bước.
- [x] Màn hình Exercise hoàn chỉnh: Bàn phím ảo, thang gợi ý HintLadder, FeedbackSheet, màn hình hoàn thành.
- [x] Tích hợp XP và tim; lưu trữ tiến độ qua `ProgressRepository`.
- [x] Thao tác cảm ứng mượt mà với dnd-kit và tap-to-place.
* **Nghiệm thu:** Chơi trọn vẹn chặng học trên mobile 390×844; sai nhận chẩn đoán bẫy; reload trang giữ nguyên dữ liệu.

#### M4 — Learning Path & Gamification *(HOÀN THÀNH)*
- [x] `curriculum.ts` phân cấp Lớp $\to$ Chương $\to$ Bài $\to$ Nốt học tập.
- [x] Bản đồ học tập ziczac SnakePath, trạm rương kho báu, nốt khóa/mở theo tiến độ.
- [x] Đèn cồn Streak, chuỗi combo, mục tiêu ngày, cấp độ Level, hệ thống thành tựu.
- [x] Quản lý trạng thái toàn cục `useUserStore` (tim, đá quý, streak, XP).
- [x] Xuất và nhập dữ liệu dự phòng JSON.
* **Nghiệm thu:** Luồng Bản đồ $\to$ Làm bài $\to$ Cập nhật XP/Gems/Streak $\to$ Mở khóa nốt kế tiếp trơn tru.

#### M5 — Minigames Suite *(HOÀN THÀNH)*
- [x] Xây dựng khung `MinigameShell` tích hợp tính điểm và đếm giờ.
- [x] Minigame Cấp cứu truyền máu ABO (Sinh học).
- [x] Minigame Cân bằng phản ứng hóa học (Hóa học).
- [x] Minigame Ghép thẻ công thức (Formula Builder).
- [x] Minigame Nối cặp thuật ngữ & Phân loại vào giỏ.
* **Nghiệm thu:** Toàn bộ minigames chơi trọn vẹn vòng trên mobile; thưởng XP chính xác; nạp dữ liệu động từ KB.

#### M6 — Kho Nội dung Đa môn KHTN Toàn diện (Lớp 6–9) *(HOÀN THÀNH)*
- [x] Phân loại taxonomy `skills.ts` chi tiết cho cả 3 môn.
- [x] Hóa học trọn bộ Lớp 7, 8, 9.
- [x] Sinh học trọn bộ 64+ bài Lớp 6, 7, 8, 9.
- [x] Vật lý trọn bộ Lớp 6, 7, 8, 9.
- [x] Bộ thuật toán `generators/` sinh đề bài tính toán vô tận (mol, nồng độ, cơ năng...).
- [x] Chạy kiểm định tự động `npm run validate:content` đạt 100% chuẩn xác.
* **Nghiệm thu:** Hệ thống sở hữu kho bài tập đa môn đồ sộ; phân bổ độ khó cân đối; bẫy sai thực tế.

#### M7 — Review & Tra cứu Cá nhân hóa *(HOÀN THÀNH)*
- [x] Thuật toán Spaced Repetition Leitner 5 hộp.
- [x] Tự động phát hiện chủ đề yếu (Weak-topic detection) và đề xuất bài tương tự.
- [x] Engine tìm kiếm MiniSearch hỗ trợ tra cứu không dấu tiếng Việt.
* **Nghiệm thu:** Tìm kiếm `naoh` hoặc `quang hop` trả về đầy đủ bài học, chất và câu hỏi liên quan tức thì.

#### M8 — Bộ 3 Linh vật & Âm thanh Tương tác *(HOÀN THÀNH)*
- [x] Tích hợp bộ 3 linh vật độc quyền: Atom (Hóa), Leafy (Sinh), Proton (Lý) với 9 trạng thái cảm xúc.
- [x] Khử sạch viền trắng phông nền thành RGBA trong suốt, hòa hợp hoàn hảo trên nền tối `#0f172a`.
- [x] Hệ thống âm thanh Howler với bộ hiệu ứng: click, correct, wrong, levelup, cheer; có nút bật/tắt tiện lợi.
* **Nghiệm thu:** Âm thanh phát mượt mà không trễ; linh vật biểu cảm chính xác theo kết quả bài làm.

#### M9 — Polish & Mỹ thuật Đa môn Xúc giác *(HOÀN THÀNH)*
- [x] Cân bằng phân bố đáp án trắc nghiệm (~25% mỗi lựa chọn A, B, C, D qua `balance_mcq.py`).
- [x] Tích hợp thuật toán Fisher-Yates tự động xáo trộn vị trí đáp án trắc nghiệm ở Runtime (MCQ Shuffle chống học vẹt).
- [x] Đồng bộ phím tắt bàn phím 1-4 và A-D tương ứng chuẩn xác với nhãn hiển thị.
- [x] Thiết kế cúp vinh danh 3D riêng biệt theo từng môn (`SubjectTrophy.tsx`): Bình Alembic Hoàng Kim (Hóa), Cúp Mầm Cây ADN (Sinh), Cúp Quỹ Đạo Nguyên Tử (Lý).
- [x] **Toàn bộ 199/199 unit tests pass xanh rực rỡ; TypeScript check 0 lỗi.**
* **Nghiệm thu:** Ứng dụng hoàn thiện xuất sắc, game feel chân thực và thẩm mỹ đạt tiêu chuẩn cao nhất.

---

### 🚀 LỘ TRÌNH PHÁT TRIỂN TIẾP THEO (V3+ ROADMAP)

#### M10 — Phòng Thí nghiệm Ảo Tương tác (Interactive Virtual Lab) *(HOÀN THÀNH)*
- [x] **Môi trường thí nghiệm Hóa học ảo:** Học sinh tự kéo ống nhỏ giọt HCl vào quỳ tím hoặc thanh kim loại Zn; thấy bọt khí $H_2$ sủi tăm và quỳ chuyển màu đỏ thời gian thực bằng Canvas/SVG.
- [x] **Bàn lắp ráp mạch điện Vật lý ảo:** Lắp ghép pin, công tắc, bóng đèn, điện trở, đồng hồ vạn năng đo Vôn/Ampe; bóng đèn sáng hoặc đứt cầu chì nếu đoản mạch.
- [x] **Kính hiển vi quang học ảo (Sinh học):** Kéo tiêu bản tế bào hành tây hoặc tế bào niêm mạc miệng; xoay ốc vi cấp điều chỉnh độ nét ở các độ phóng đại 10x, 40x, 100x.
* **Nghiệm thu:** 3 mô phỏng hoạt động trơn tru trên mobile (360x640, 390x844 không tràn ngang); trực quan hóa bài học thực hành SGK; unit tests 14/14 engine pass.

#### M11 — AI Trợ lý Sư phạm Thông minh (AI Smart Step Hint) *(HOÀN THÀNH)*
- [x] Phân tích cú pháp câu trả lời sai cụ thể của học sinh để chẩn đoán chính xác nguyên nhân lỗi sai (quên nhân hệ số, nhầm hằng số 22.4 vs 24.79, quên đổi đơn vị đo, đảo ngược phép chia, quên bình phương, nhầm phân bào $2^n$).
- [x] Đưa ra câu nhắc nhở định hướng trúng ngay mấu chốt vấn đề mà không làm lộ đáp án cuối cùng.
- [x] Tích hợp thẻ Feedback UI trực quan gradient tím neon, khích lệ học sinh tự sửa sai.
* **Nghiệm thu:** Trợ lý phản hồi client-side < 1ms (vượt chuẩn < 500ms); zero-AI runtime hallucination; 18/18 unit tests pass 100%.

#### M12 — Đấu trường Đối kháng 1v1 Thời gian thực (Live Science Battle) *(COULD)*
- [ ] Tích hợp WebSocket/Realtime cho phép 2 học sinh cùng giải nhanh 5 câu hỏi KHTN trong 60 giây.
- [ ] Điểm số và tốc độ trả lời sẽ đẩy thanh năng lượng mascot áp đảo đối thủ để giành Cúp xếp hạng tuần.
* **Nghiệm thu:** Kết nối phòng chơi ổn định; độ trễ mạng thấp; xếp hạng Elo công bằng.

#### M13 — Ứng dụng Di động PWA & Offline Store *(SHOULD)*
- [ ] Cấu hình Service Worker cache đệm toàn bộ bài học để học sinh vùng xa học không cần internet.
- [ ] Đóng gói Capacitor xuất bản lên Google Play Store và Apple App Store.
* **Nghiệm thu:** Ứng dụng cài đặt được lên màn hình chính điện thoại; mở học bài bình thường khi ngắt mạng.

#### M14 — Lồng tiếng Biểu cảm Mascot & Rung Haptic Xúc giác *(HOÀN THÀNH)*
- [x] Lồng tiếng các câu khích lệ ngắn tiếng Việt dí dỏm ("Chuẩn không cần chỉnh!", "Bừng sáng năng lượng!", "Tuyệt vời quá!") theo 3 tính cách riêng biệt cho Atom (Hóa), Leafy (Sinh) và Proton (Lý).
- [x] Hệ thống rung phản hồi xúc giác Haptic Vibration đa tầng trên mobile/PWA: click nhẹ (12ms), trả lời đúng (2 nhịp nảy), trả lời sai (2 nhịp cảnh báo), hoàn thành bài (chuỗi nhịp fanfare).
- [x] Tích hợp bộ điều khiển bật/tắt và nghe thử giọng cả 3 linh vật trong trang Cá nhân (`ProfilePage`).
* **Nghiệm thu:** Giọng nói trong trẻo, tự nhiên, tùy biến theo từng môn học; tăng cường tactile game feel sống động; unit test bao phủ toàn bộ cơ chế.

---

## 20. Ma trận rủi ro & Phương án kiểm soát

| # | Rủi ro tiềm ẩn | Mức độ | Phương án kiểm soát & Giải pháp thực thi |
|---|---|---|---|
| 1 | **Sai lệch số liệu kiến thức khoa học** | Nghiêm trọng | Zod schema tự động xác thực; bảng nguyên tử khối và hằng số ($24,79\text{ L/mol}$) khóa chặt trong `knowledge.json`; đối chiếu SGK Kết nối tri thức 2018; giáo viên duyệt nội dung. |
| 2 | **Học sinh học vẹt nhớ vị trí đáp án A/B/C/D** | Trung bình | Tích hợp thuật toán Fisher-Yates tự động xáo trộn vị trí đáp án ở Runtime; cân bằng tỷ lệ 25% mỗi lựa chọn qua script `balance_mcq.py`. |
| 3 | **Cơ chế Hearts (Tim) gây nản lòng học sinh yếu** | Cao | Cung cấp chế độ Luyện tập vô tận (`/practice`) không trừ tim; cho phép học sinh ôn bài để hồi tim hoàn toàn miễn phí mà không chặn việc học. |
| 4 | **Hiệu ứng đồ họa gây giật lag trên mobile tầm trung** | Trung bình | Tuyệt đối không dùng thư viện 3D/WebGL nặng nề; chỉ animate thuộc tính `transform` và `opacity`; tự động tắt hiệu ứng khi thiết bị bật `prefers-reduced-motion`. |
| 5 | **Mất dữ liệu tiến độ khi xóa cache trình duyệt** | Thấp | Cung cấp tính năng Xuất và Nhập dữ liệu dự phòng dưới dạng file JSON ngay trong trang Cá nhân (`ProfilePage`). |
| 6 | **Tài nguyên ảnh lem viền trắng trên nền tối** | Trung bình | Tự động hóa bóc tách phông nền trắng thành PNG RGBA trong suốt bằng thuật toán flood-fill (`scripts/remove_background.py`) kèm kỹ thuật khử viền (edge feathering). |
| 7 | **Bàn phím ảo mobile che khuất nút hành động** | Trung bình | Áp dụng API `window.visualViewport` để đẩy thanh công cụ đáy lên trên bàn phím ảo, tránh tình trạng bị che khuất nút Kiểm tra. |
| 8 | **Âm thanh bị chặn phát tự động trên trình duyệt di động** | Thấp | Sử dụng Howler.js và tự động kích hoạt AudioContext ngay ở sự kiện chạm ngón tay đầu tiên của người dùng (iOS user gesture unlock). |
| 9 | **Bản quyền nội dung câu hỏi** | Nghiêm trọng | Toàn bộ câu hỏi là đề gốc tự biên soạn hoặc diễn đạt lại theo mục tiêu cần đạt của khung chương trình, không sao chép nguyên văn SGK/SBT. |

**Bàn giao & Yêu cầu:**  
Dự án đã hoàn thành xuất sắc toàn bộ nền tảng M0–M9 với 199 unit tests xanh, sẵn sàng phục vụ học sinh học tập và mở rộng các phân hệ mô phỏng thí nghiệm M10 theo lộ trình.
