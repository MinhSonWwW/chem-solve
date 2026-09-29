# STEM-Solve — Vật lý lớp 6 (Kết nối tri thức): Kế hoạch triển khai nội dung Unit 0–3

> Tài liệu này là **bổ sung** cho `planvatly.md` (kiến trúc tổng thể v2.5). Toàn bộ quy tắc engine (state machine, hearts, XP, gamification, ID naming, Zod schema, quy trình xác thực coverage...) áp dụng nguyên vẹn từ `planvatly.md`. File này chỉ định nghĩa **nội dung curriculum Vật lý lớp 6** để Antigravity triển khai theo từng bước.

---

## 1. Mục tiêu

Triển khai đầy đủ nội dung Vật lý lớp 6 (Kết nối tri thức) gồm **20 bài, chia thành 4 Unit**, theo đúng chương trình SGK, không được tự bịa thêm hoặc bớt nội dung so với danh sách xác nhận dưới đây.

## 2. Nguồn nội dung & yêu cầu chính xác

- Nguồn xác nhận: mục lục "Vật Lí lớp 6 Kết nối tri thức" (vietjack.com), đối chiếu chéo với mục lục "Khoa học tự nhiên 6 Kết nối tri thức" đầy đủ.
- **Bắt buộc**: mọi tên bài, tên chương phải giữ nguyên văn như bảng ở mục 3. Không đổi tên, không viết tắt sai lệch.
- Khi soạn nội dung lý thuyết (theory.json) và câu hỏi (exercises), Antigravity **phải tra cứu lại đúng nội dung SGK Kết nối tri thức của từng bài** (qua vietjack.com hoặc nguồn SGK chính thức) trước khi viết — **không được tự suy đoán số liệu, đơn vị, công thức, hoặc ví dụ** nếu không chắc chắn khớp với nội dung sách. Nếu không chắc, để trống và đánh dấu `// TODO: cần xác minh nguồn` thay vì bịa.
- Vật lý lớp 6 (KNTT) ở mức THCS đầu cấp, nội dung chủ yếu là **định tính + kỹ năng đo lường**, hầu như chưa có công thức tính toán phức tạp (khác với Vật lý 8, 9). Cần tránh việc tự chế công thức không có trong SGK lớp 6.

## 3. Danh sách 20 bài (đã chốt)

| Unit | ID nội bộ | Bài SGK | Tên bài |
|---|---|---|---|
| **Unit 0 — Đo lường** | `phy-g6-b01` | Bài 5 | Đo chiều dài |
| | `phy-g6-b02` | Bài 6 | Đo khối lượng |
| | `phy-g6-b03` | Bài 7 | Đo thời gian |
| | `phy-g6-b04` | Bài 8 | Đo nhiệt độ |
| **Unit 1 — Lực trong đời sống** | `phy-g6-b05` | Bài 40 | Lực là gì? |
| | `phy-g6-b06` | Bài 41 | Biểu diễn lực |
| | `phy-g6-b07` | Bài 42 | Biến dạng của lò xo |
| | `phy-g6-b08` | Bài 43 | Trọng lực, lực hấp dẫn |
| | `phy-g6-b09` | Bài 44 | Lực ma sát |
| | `phy-g6-b10` | Bài 45 | Lực cản của nước |
| **Unit 2 — Năng lượng** | `phy-g6-b11` | Bài 46 | Năng lượng và sự truyền năng lượng |
| | `phy-g6-b12` | Bài 47 | Một số dạng năng lượng |
| | `phy-g6-b13` | Bài 48 | Sự chuyển hóa năng lượng |
| | `phy-g6-b14` | Bài 49 | Năng lượng hao phí |
| | `phy-g6-b15` | Bài 50 | Năng lượng tái tạo |
| | `phy-g6-b16` | Bài 51 | Tiết kiệm năng lượng |
| **Unit 3 — Trái Đất và bầu trời** | `phy-g6-b17` | Bài 52 | Chuyển động nhìn thấy của Mặt Trời. Thiên thể |
| | `phy-g6-b18` | Bài 53 | Mặt Trăng |
| | `phy-g6-b19` | Bài 54 | Hệ Mặt Trời |
| | `phy-g6-b20` | Bài 55 | Ngân hà |

Mỗi lesson JSON phải lưu **cả hai số**: `id` (nội bộ, `phy-g6-bXX`) và `sgkBaiSo` (số bài gốc SGK, ví dụ `5` hoặc `40`) để tránh nhầm lẫn khi đối chiếu ngược với sách hoặc khi học sinh/giáo viên hỏi.

## 4. Cấu trúc thư mục cần tạo

```
src/
├── content/
│   └── physics/
│       └── g6/
│           ├── curriculum.ts        # Đăng ký 20 bài, đúng thứ tự Unit 0→3
│           ├── unit-0-do-luong/
│           │   ├── phy-g6-b01.theory.json
│           │   ├── phy-g6-b01.exercises.json
│           │   ├── phy-g6-b02.theory.json
│           │   ├── phy-g6-b02.exercises.json
│           │   ├── phy-g6-b03.theory.json
│           │   ├── phy-g6-b03.exercises.json
│           │   ├── phy-g6-b04.theory.json
│           │   └── phy-g6-b04.exercises.json
│           ├── unit-1-luc/
│           │   └── ... (phy-g6-b05 → b10, mỗi bài 2 file theory + exercises)
│           ├── unit-2-nang-luong/
│           │   └── ... (phy-g6-b11 → b16)
│           └── unit-3-trai-dat-bau-troi/
│               └── ... (phy-g6-b17 → b20)
├── kb/
│   └── physics/
│       └── g6/
│           └── constants.json       # Đơn vị đo chuẩn SI, bảng đổi đơn vị (chỉ khi cần cho Unit 0)
```

## 5. Chuẩn cấu trúc nội dung mỗi bài

Dùng lại đúng Zod schema đã định nghĩa trong `planvatly.md` cho `theory.json` và `exercises.json` (đầy đủ hints, 7 steps, pitfalls, verify — xem mục 9 `planvatly.md`). Không tạo schema mới trùng lặp.

Mỗi bài cần tối thiểu:
- `theory.json`: tóm tắt lý thuyết bài học, bám sát đúng nội dung SGK bài đó (không thêm kiến thức ngoài chương trình lớp 6).
- `exercises.json`: tối thiểu 5–8 câu hỏi/bài, độ khó tăng dần, đúng dạng câu hỏi phù hợp (xem mục 6).

## 6. Loại câu hỏi phù hợp theo từng Unit

Vì Vật lý 6 chủ yếu định tính, các loại checker hiện có (`formulaChecker` cho Hóa, `choiceChecker` cho mcq/multi-select) có thể **chưa đủ**. Đề xuất các dạng câu hỏi cần thêm, Antigravity cần đánh giá có nên mở rộng engine checker hay không trước khi code nội dung:

- **Unit 0 (Đo lường):** câu hỏi đọc số đo trên dụng cụ (thước, cân, đồng hồ, nhiệt kế) — cần checker cho phép **sai số dung sai** (numeric tolerance), không chỉ đúng/sai tuyệt đối; câu hỏi đổi đơn vị đo (mm↔cm↔m↔km, mg↔g↔kg, giây↔phút↔giờ, °C) — dùng `choiceChecker` (mcq) là đủ, không cần checker mới nếu ra dạng trắc nghiệm thay vì tự nhập số.
- **Unit 1 (Lực):** câu hỏi khái niệm (mcq/multi-select) dùng `choiceChecker` được. Riêng bài 41 "Biểu diễn lực" (vẽ mũi tên lực: gốc, phương, chiều, độ lớn) là dạng **tương tác đồ họa** (kéo-thả hướng mũi tên hoặc chọn hướng đúng trong các lựa chọn hình vẽ dựng sẵn) — cần Antigravity thiết kế UI riêng hoặc rút gọn thành mcq chọn hình đúng nếu chưa kịp làm interactive.
- **Unit 2 (Năng lượng):** mcq/multi-select là đủ cho phần lớn câu hỏi (nhận biết dạng năng lượng, ví dụ chuyển hóa). Câu hỏi "phân loại năng lượng tái tạo/không tái tạo" có thể dùng dạng kéo-thả 2 cột (đã có `@dnd-kit` trong stack) thay vì mcq đơn thuần để sinh động hơn.
- **Unit 3 (Trái Đất và bầu trời):** mcq/multi-select cho phần lớn; câu hỏi "sắp xếp thứ tự" (ví dụ thứ tự các hành tinh) cần checker `orderingChecker` (chưa có trong engine hiện tại — cần bổ sung nếu muốn dùng dạng này, hoặc thay bằng mcq "chọn thứ tự đúng" nếu chưa kịp code checker mới).

**Ghi chú:** Antigravity cần xác nhận với người dùng trước khi tự ý thêm checker mới vào engine (đúng tinh thần mục 10 `planvatly.md`: coverage ≥90%, mọi checker mới phải có unit test).

## 7. Quy tắc kiểm tra chất lượng nội dung (bắt buộc)

1. Trước khi viết `theory.json` hoặc `exercises.json` cho một bài, tra cứu đúng nội dung SGK Kết nối tri thức bài đó (nguồn: vietjack.com hoặc sách giáo khoa gốc).
2. Không tự chế số liệu, đơn vị, hình ảnh minh họa, hoặc ví dụ không có trong SGK.
3. Với các câu hỏi liên quan tới an toàn (ví dụ: an toàn khi dùng nhiệt kế, cân) — chỉ đưa thông tin đúng chuẩn, không suy diễn.
4. Sau khi soạn xong mỗi bài, chạy `validate-content.ts` (đã có trong pipeline `planvatly.md` mục 9) để xác thực cấu trúc JSON qua Zod trước khi coi là hoàn thành.

## 8. Quy trình triển khai (từng bước, làm tuần tự Unit 0 → Unit 3)

```
[BƯỚC 1] Đăng ký 20 bài vào curriculum.ts theo đúng thứ tự Unit 0→3 (mục 3).
[BƯỚC 2] Với MỖI bài (theo thứ tự phy-g6-b01 → b20):
   a. Tra cứu đúng nội dung SGK bài đó.
   b. Viết theory.json (tóm tắt lý thuyết, đúng schema planvatly.md).
   c. Viết exercises.json (5–8 câu, đúng schema, đúng dạng checker theo mục 6).
   d. Chạy validate-content.ts, sửa lỗi nếu có.
[BƯỚC 3] Sau khi xong toàn bộ Unit 0: dừng lại, báo cáo lại để người dùng review trước khi
   sang Unit 1 (tránh làm sai hàng loạt nếu cấu trúc/định dạng chưa đúng ý).
[BƯỚC 4] Lặp lại cho Unit 1 → Unit 2 → Unit 3, mỗi Unit xong đều dừng báo cáo.
[BƯỚC 5] Sau khi cả 20 bài hoàn thành: chạy lại toàn bộ test coverage (mục 10 planvatly.md)
   để đảm bảo không có checker nào bị giảm coverage do nội dung mới.
```

## 9. Checklist hoàn thành cho mỗi bài

- [ ] `id` và `sgkBaiSo` đều đúng và khớp bảng mục 3
- [ ] `theory.json` đúng schema, nội dung bám sát SGK, không bịa
- [ ] `exercises.json` có 5–8 câu, độ khó tăng dần, dùng đúng checker phù hợp (mục 6)
- [ ] Đã chạy `validate-content.ts` không lỗi
- [ ] Không có kiến thức vượt chương trình lớp 6 (không đưa công thức lớp 8/9 vào)
