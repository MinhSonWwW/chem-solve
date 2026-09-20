# CHEM-SOLVE — Design Bible (Tài liệu chuẩn Thiết kế & Visual DNA)

Tài liệu này xác định ngôn ngữ thiết kế, bảng màu tokens, typography, quy chuẩn component và triết lý Game Feel của **CHEM-SOLVE** (kết hợp tinh thần Duolingo và bản sắc Hóa học THCS).

---

## 1. Triết lý Thiết kế (Design Philosophy)

- **Concept**: *Digital Chemistry Lab + Playful Learning Game*.
- **DNA thị giác**: 
  - Bình Erlenmeyer, ống nghiệm, giá ống nghiệm, ống đong có vạch chia.
  - Tinh thể muối, liên kết phân tử, ngọn lửa đèn cồn.
  - Phản ứng hóa học: khí bay lên `↑`, kết tủa lắng xuống `↓`, đổi màu dung dịch chỉ thị.
- **Game Feel (chuẩn Duolingo)**:
  - **Nút bấm 3D Chunky Buttons**: Có độ dày đáy (solid bottom border), khi nhấn chuột hoặc chạm ngón tay (`:active`), nút lún xuống (`translate-y-1`) triệt tiêu bóng đáy, tạo cảm giác bấm cơ học (tactile) cực kỳ đã tay.
  - **Lộ trình học ziczac (Snake Path / Stepping Stones)**: Các node bài học hình tròn uốn lượn ziczac, có ngôi sao, trạng thái đang học (nhịp tim đập / pulse ring), rương kho báu và trạm ôn luyện.
  - **Feedback Sheet**: Khung thông báo trượt lên từ đáy màn hình với màu xanh lá rực rỡ (kèm +10 XP) khi đúng, và màu đỏ cam cảnh báo khi sai.

---

## 2. Bảng Màu & Design Tokens (Color Palette)

| Token | Giá trị Hex | Ứng dụng Hóa học |
|---|---|---|
| `--color-primary` | `#06b6d4` (Cyan-500) | Dung dịch CuSO₄, nước cất, màu nhận diện chính |
| `--color-primary-dark` | `#0891b2` (Cyan-600) | Bóng đáy 3D của nút Primary |
| `--color-success` | `#10b981` (Emerald-500) | Phản ứng thành công, đáp án đúng |
| `--color-success-dark` | `#059669` (Emerald-600) | Bóng đáy 3D của nút Success |
| `--color-danger` | `#ef4444` (Rose-500) | Acid đậm đặc, cảnh báo nguy hiểm, đáp án sai |
| `--color-danger-dark` | `#dc2626` (Rose-600) | Bóng đáy 3D của nút Danger |
| `--color-accent` | `#f59e0b` (Amber-500) | Ngọn lửa đèn cồn (Streak), vàng, khí NO₂ |
| `--color-accent-dark` | `#d97706` (Amber-600) | Bóng đáy 3D của nút Accent |
| `--color-secondary` | `#8b5cf6` (Violet-500) | Thuốc tím KMnO₄, quỳ tím chuyển màu base |
| `--color-background` | `#0f172a` (Slate-950) | Nền phòng Lab tối hiện đại |
| `--color-surface` | `#1e293b` (Slate-800) | Khay dụng cụ, thẻ câu hỏi Erlenmeyer |

---

## 3. Typography & Công thức Hóa học

- **Font chữ chính**: **Nunito** (Google Fonts) — bo góc thân thiện, dễ đọc trên màn hình điện thoại, hỗ trợ trọn vẹn tiếng Việt có dấu.
- **Quy tắc công thức**: Mọi công thức đều lưu dạng ASCII thuần (`H2SO4`, `Fe^3+`, `Al2(SO4)3`) và được component `<Formula />` phân tích thành `H<sub>2</sub>SO<sub>4</sub>`, `Fe<sup>3+</sup>`. Tuyệt đối không lưu ký tự unicode chỉ số dưới trong database.

---

## 4. Mascot đại diện: Flasky (Bình Tam Giác Vui Vẻ)

- **Hình dạng**: Bình Erlenmeyer thủy tinh chứa dung dịch đổi màu theo cảm xúc.
- **Trạng thái**:
  - `idle`: Nhấp nhô bọt khí nhẹ nhàng.
  - `happy`: Dung dịch màu xanh ngọc, mắt cười tít.
  - `thinking`: Dung dịch màu tím, mắt nhìn lên suy ngẫm.
  - `correct`: Bắn tia sáng lấp lánh, dung dịch màu xanh lá.
  - `wrong`: Dung dịch sủi bọt khói màu đỏ, vẻ mặt động viên "thử lại nhé!".
  - `celebrating`: Đội mũ tốt nghiệp hoặc tung hoa giấy confetti.
