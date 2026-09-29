# STEM-Solve — Vật lý lớp 7 (Kết nối tri thức): Kế hoạch triển khai nội dung Unit 1–4

> Tài liệu này là **bổ sung** cho `planvatlynew.md` (kiến trúc tổng thể v2.5) và cùng cấu trúc với `planvatly-lop6.md`. Toàn bộ quy tắc engine (state machine, hearts, XP, gamification, ID naming, Zod schema, quy trình xác thực, coverage) áp dụng nguyên vẹn từ `planvatlynew.md`. File này chỉ định nghĩa **nội dung curriculum Vật lý lớp 7**.

---

## 1. Mục tiêu

Triển khai đầy đủ nội dung Vật lý lớp 7 (Kết nối tri thức) gồm **13 bài, chia thành 4 Unit**, theo đúng chương trình SGK, không tự bịa thêm hoặc bớt nội dung so với danh sách xác nhận dưới đây.

## 2. Nguồn nội dung & yêu cầu chính xác

- Nguồn xác nhận: mục lục "Vật Lí 7 Kết nối tri thức" của vietjack.com (Chương 3–6, Bài 8–20), đối chiếu với mục lục chung "Khoa học tự nhiên 7 Kết nối tri thức".
- **Bắt buộc**: tên bài, tên chương giữ nguyên văn như bảng mục 3.
- **Lưu ý tên Bài 17:** hai trang VietJack ghi lệch nhau ("Ảnh của vật qua gương phẳng" ở mục lục chung, "Ảnh hưởng của vật qua gương phẳng" ở trang Vật Lí 7). Dùng bản **"Ảnh của vật qua gương phẳng"**, và ghi chú `// TODO: đối chiếu SGK giấy` trong metadata bài này cho tới khi người dùng xác nhận.
- **Bài 1 (Phương pháp và kĩ năng học tập môn KHTN) KHÔNG thuộc phạm vi** — chỉ là phương pháp học chung, không có nội dung Vật lý, và không nằm trong mục lục Vật Lí 7.
- Trước khi viết `theory.json` và `exercises.json`, **phải tra cứu đúng nội dung SGK Kết nối tri thức của từng bài** (vietjack.com hoặc SGK gốc). **Không tự suy đoán số liệu, đơn vị, công thức, ví dụ** nếu không chắc khớp sách. Nếu không chắc: để `// TODO: cần xác minh nguồn` thay vì bịa.
- Không đưa kiến thức của lớp 8, 9 vào (ví dụ: không dùng công thức hay khái niệm chưa học ở lớp 7).

## 3. Danh sách 13 bài (đã chốt)

| Unit | ID nội bộ | Bài SGK | Tên bài |
|---|---|---|---|
| **Unit 1 — Tốc độ** (Chương 3) | `phy-g7-b01` | Bài 8 | Tốc độ chuyển động |
| | `phy-g7-b02` | Bài 9 | Đo tốc độ |
| | `phy-g7-b03` | Bài 10 | Đồ thị quãng đường - thời gian |
| | `phy-g7-b04` | Bài 11 | Thảo luận về ảnh hưởng của tốc độ trong an toàn giao thông |
| **Unit 2 — Âm thanh** (Chương 4) | `phy-g7-b05` | Bài 12 | Sóng âm |
| | `phy-g7-b06` | Bài 13 | Độ to và độ cao của âm |
| | `phy-g7-b07` | Bài 14 | Phản xạ âm, chống ô nhiễm tiếng ồn |
| **Unit 3 — Ánh sáng** (Chương 5) | `phy-g7-b08` | Bài 15 | Năng lượng ánh sáng. Tia sáng, vùng tối |
| | `phy-g7-b09` | Bài 16 | Sự phản xạ ánh sáng |
| | `phy-g7-b10` | Bài 17 | Ảnh của vật qua gương phẳng |
| **Unit 4 — Từ** (Chương 6) | `phy-g7-b11` | Bài 18 | Nam châm |
| | `phy-g7-b12` | Bài 19 | Từ trường |
| | `phy-g7-b13` | Bài 20 | Chế tạo nam châm điện đơn giản |

Mỗi lesson JSON lưu **cả hai số**: `id` (nội bộ `phy-g7-bXX`) và `sgkBaiSo` (số bài gốc SGK, từ `8` đến `20`) để tránh nhầm khi đối chiếu với sách.

**ID prefix:** `phy-g7-` tuân theo quy tắc bắt buộc prefix ở mục 4.1 `planvatlynew.md`. Không đặt ID không prefix.

## 4. Cấu trúc thư mục cần tạo

```
src/
├── content/
│   └── physics/
│       └── g7/
│           ├── curriculum.ts          # Đăng ký 13 bài, đúng thứ tự Unit 1→4
│           ├── unit-1-toc-do/         # phy-g7-b01 → b04
│           ├── unit-2-am-thanh/       # phy-g7-b05 → b07
│           ├── unit-3-anh-sang/       # phy-g7-b08 → b10
│           └── unit-4-tu/             # phy-g7-b11 → b13
│               (mỗi bài gồm 2 file: <id>.theory.json + <id>.exercises.json)
├── kb/
│   └── physics/
│       └── g7/
│           └── constants.json         # Bảng đổi đơn vị tốc độ và các hằng số CÓ TRONG SGK lớp 7 (nếu cần)
```

## 5. Chuẩn cấu trúc nội dung mỗi bài

Dùng lại đúng Zod schema trong `planvatlynew.md` cho `theory.json` và `exercises.json` (hints, 7 steps, pitfalls, verify). Không tạo schema mới trùng lặp.

Mỗi bài tối thiểu:
- `theory.json`: tóm tắt lý thuyết bám sát SGK bài đó, không thêm kiến thức ngoài chương trình lớp 7.
- `exercises.json`: tối thiểu 6–10 câu, độ khó tăng dần; các bài có tính toán (Unit 1) nên có thêm bài toán nhiều bước.

## 6. Loại câu hỏi phù hợp theo từng Unit

Khác lớp 6 (chủ yếu định tính), Vật lý 7 có **tính toán và đồ thị**, nên engine hiện tại (chỉ `formulaChecker` cho Hóa + `choiceChecker`) **không đủ**. Antigravity phải đề xuất và **hỏi người dùng trước khi thêm checker mới** vào engine.

- **Unit 1 (Tốc độ):**
  - Bài toán tính tốc độ / quãng đường / thời gian, đổi đơn vị tốc độ: cần **`numericChecker`** (nhập số kèm đơn vị, có dung sai làm tròn hợp lý, nhận dạng sai đơn vị là lỗi riêng để hiện `pitfalls` phù hợp). Đây là checker mới, chưa có trong engine.
  - Bài 10 (đồ thị quãng đường - thời gian): câu hỏi đọc đồ thị. Đề xuất render đồ thị bằng SVG/Canvas từ dữ liệu JSON và dùng mcq hoặc `numericChecker` cho câu trả lời. Không dùng ảnh đồ thị tĩnh vì phải bám dữ liệu JSON (đúng nguyên tắc "không hardcode trong component").
  - Bài 11 (an toàn giao thông): chủ yếu mcq/multi-select tình huống, kết hợp vài bài tính đơn giản.
- **Unit 2 (Âm thanh):** phần lớn mcq/multi-select. Câu về độ to/độ cao có thể dùng dạng ghép cặp (matching) hoặc kéo-thả (`@dnd-kit` đã có trong stack). Bài tính (nếu SGK có, ví dụ liên quan phản xạ âm) phải tra đúng SGK trước khi ra đề.
- **Unit 3 (Ánh sáng):** mcq/multi-select cho khái niệm. Bài 16, 17 (phản xạ, ảnh qua gương phẳng) cần **dạng tương tác hình học** (chọn/kéo tia phản xạ, xác định vị trí ảnh). Đề xuất: bắt đầu bằng mcq chọn hình đúng (hình dựng sẵn từ JSON), chỉ làm tương tác kéo tia nếu người dùng đồng ý mở rộng engine.
- **Unit 4 (Từ):** mcq/multi-select cho nam châm, từ trường. Câu hỏi về đường sức từ hoặc cực nam châm có thể dùng chọn hình đúng hoặc kéo-thả nhãn. Bài 20 (chế tạo nam châm điện) dùng dạng **sắp xếp các bước** (`orderingChecker`, chưa có trong engine, xem lưu ý dưới).

**Checker mới có thể cần (tất cả phải hỏi người dùng trước khi code):** `numericChecker`, `orderingChecker`, và tùy chọn `hotspot/geometryChecker` cho bài ánh sáng. Mọi checker mới phải có unit test, giữ coverage ≥ 90% (mục 10 `planvatlynew.md`).

## 7. Quy tắc kiểm tra chất lượng nội dung (bắt buộc)

1. Tra cứu đúng nội dung SGK từng bài trước khi viết.
2. Không tự chế số liệu, đơn vị, công thức, hình minh họa không có trong SGK.
3. Với bài tính toán: **tự kiểm tra lại đáp án bằng code** (script nhỏ hoặc unit test) trước khi đưa vào `exercises.json`, tránh đáp án sai làm học sinh hiểu nhầm.
4. Mọi số liệu giả định trong đề (ví dụ tốc độ xe, quãng đường) phải hợp lý thực tế, không đặt số vô lý.
5. Chạy `validate-content.ts` (Zod) sau mỗi bài.

## 8. Quy trình triển khai (tuần tự Unit 1 → Unit 4)

```
[BƯỚC 1] Đăng ký 13 bài vào curriculum.ts theo thứ tự Unit 1→4 (mục 3).
[BƯỚC 2] Trước khi viết nội dung: đọc mục 6, liệt kê checker mới cần thiết
   cho Unit 1, báo cáo và CHỜ người dùng đồng ý trước khi code checker.
[BƯỚC 3] Với MỖI bài (phy-g7-b01 → b13):
   a. Tra cứu đúng nội dung SGK bài đó.
   b. Viết theory.json (đúng schema planvatlynew.md).
   c. Viết exercises.json (6–10 câu, đúng checker).
   d. Bài có tính toán: kiểm tra đáp án bằng code.
   e. Chạy validate-content.ts, sửa lỗi nếu có.
[BƯỚC 4] Xong mỗi Unit: DỪNG, báo cáo để người dùng review trước khi sang Unit kế.
[BƯỚC 5] Xong cả 13 bài: chạy toàn bộ test + coverage (mục 10 planvatlynew.md).
```

## 9. Checklist hoàn thành cho mỗi bài

- [ ] `id` và `sgkBaiSo` đúng, khớp bảng mục 3
- [ ] `theory.json` đúng schema, bám sát SGK, không bịa
- [ ] `exercises.json` 6–10 câu, độ khó tăng dần, đúng checker (mục 6)
- [ ] Bài tính toán: đáp án đã kiểm tra bằng code
- [ ] `validate-content.ts` không lỗi
- [ ] Không có kiến thức vượt chương trình lớp 7

---

## 10. Prompt chuẩn dán vào Antigravity

```
Đọc kỹ 3 file sau trong project trước khi làm bất kỳ việc gì:
1. planvatlynew.md — kiến trúc tổng thể STEM-Solve (state machine, hearts, XP, ID naming, Zod schema, quy trình xác thực)
2. planvatly-lop6.md — tham khảo cách tổ chức nội dung Vật lý lớp 6 đã làm
3. planvatly-lop7.md — kế hoạch nội dung Vật lý lớp 7 (13 bài, 4 unit)

Yêu cầu bắt buộc:
- Làm đúng quy trình 5 bước ở mục 8 của planvatly-lop7.md, từng Unit một, KHÔNG làm hết 13 bài cùng lúc. Sau mỗi Unit, DỪNG và báo cáo để tôi review.
- Với mỗi bài, PHẢI tra cứu đúng nội dung SGK Kết nối tri thức của bài đó trước khi viết. Không tự bịa số liệu, đơn vị, công thức. Nếu không chắc, để TODO và hỏi lại tôi.
- Unit 1 có bài tính toán: cần checker mới (numericChecker). Trước khi code, hãy báo cáo đề xuất thiết kế checker (input, dung sai, cách xử lý sai đơn vị) và CHỜ tôi đồng ý. Tương tự cho orderingChecker và checker hình học nếu cần.
- Bài tính toán: kiểm tra lại đáp án bằng code trước khi đưa vào exercises.json.
- Sau mỗi bài chạy validate-content.ts. Đối chiếu checklist mục 9 trước khi báo cáo hoàn thành.

Bắt đầu bằng BƯỚC 1 và BƯỚC 2 (đăng ký curriculum + đề xuất checker cho Unit 1). Chưa viết nội dung bài nào cho tới khi tôi duyệt.
```
