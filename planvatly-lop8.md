# STEM-Solve — Vật lý lớp 8 (Kết nối tri thức): Kế hoạch triển khai nội dung Unit 1–4

> Tài liệu này là **bổ sung** cho `planvatlynew.md` (kiến trúc tổng thể v2.5), cùng cấu trúc với `planvatly-lop7.md`. Toàn bộ quy tắc engine (state machine, hearts, XP, gamification, ID naming, Zod schema, quy trình xác thực, coverage) áp dụng nguyên vẹn từ `planvatlynew.md`. File này chỉ định nghĩa **nội dung curriculum Vật lý lớp 8**.

---

## 1. Mục tiêu

Triển khai đầy đủ nội dung Vật lý lớp 8 (Kết nối tri thức) gồm **17 bài, chia thành 4 Unit**, theo đúng chương trình SGK, không tự bịa thêm hoặc bớt nội dung so với danh sách xác nhận dưới đây.

## 2. Nguồn nội dung & yêu cầu chính xác

- Nguồn xác nhận: mục lục "Vật Lí 8 Kết nối tri thức" của vietjack.com (Chương 3–6, Bài 13–29), đối chiếu khớp với mục lục chung "Khoa học tự nhiên 8 Kết nối tri thức".
- **Bắt buộc**: tên bài, tên chương giữ nguyên văn như bảng mục 3.
- **Ngoài phạm vi:** Bài 1 (Sử dụng một số hóa chất, thiết bị cơ bản trong phòng thí nghiệm) không thuộc mục lục Vật Lí 8; Chương 1, 2 (Hóa học) và Chương 7, 8 (Sinh học) thuộc phân môn khác.
- Trước khi viết `theory.json` và `exercises.json`, **phải tra cứu đúng nội dung SGK Kết nối tri thức của từng bài** (vietjack.com hoặc SGK gốc). **Không tự suy đoán số liệu, đơn vị, công thức, ví dụ, bảng số liệu** nếu không chắc khớp sách. Nếu không chắc: để `// TODO: cần xác minh nguồn` thay vì bịa.
- Không đưa kiến thức lớp 9 vào (ví dụ: không dùng khái niệm, công thức chưa học ở lớp 8).

## 3. Danh sách 17 bài (đã chốt)

| Unit | ID nội bộ | Bài SGK | Tên bài |
|---|---|---|---|
| **Unit 1 — Khối lượng riêng và áp suất** (Chương 3) | `phy-g8-b01` | Bài 13 | Khối lượng riêng |
| | `phy-g8-b02` | Bài 14 | Thực hành xác định khối lượng riêng |
| | `phy-g8-b03` | Bài 15 | Áp suất trên một bề mặt |
| | `phy-g8-b04` | Bài 16 | Áp suất chất lỏng. Áp suất khí quyển |
| | `phy-g8-b05` | Bài 17 | Lực đẩy Archimedes |
| **Unit 2 — Tác dụng làm quay của lực** (Chương 4) | `phy-g8-b06` | Bài 18 | Tác dụng làm quay của lực. Moment lực |
| | `phy-g8-b07` | Bài 19 | Đòn bẩy và ứng dụng |
| **Unit 3 — Điện** (Chương 5) | `phy-g8-b08` | Bài 20 | Hiện tượng nhiễm điện do cọ xát |
| | `phy-g8-b09` | Bài 21 | Dòng điện, nguồn điện |
| | `phy-g8-b10` | Bài 22 | Mạch điện đơn giản |
| | `phy-g8-b11` | Bài 23 | Tác dụng của dòng điện |
| | `phy-g8-b12` | Bài 24 | Cường độ dòng điện và hiệu điện thế |
| | `phy-g8-b13` | Bài 25 | Thực hành đo cường độ dòng điện và hiệu điện thế |
| **Unit 4 — Nhiệt** (Chương 6) | `phy-g8-b14` | Bài 26 | Năng lượng nhiệt và nội năng |
| | `phy-g8-b15` | Bài 27 | Thực hành đo năng lượng nhiệt bằng joulemeter |
| | `phy-g8-b16` | Bài 28 | Sự truyền nhiệt |
| | `phy-g8-b17` | Bài 29 | Sự nở vì nhiệt |

Mỗi lesson JSON lưu **cả hai số**: `id` (nội bộ `phy-g8-bXX`) và `sgkBaiSo` (số bài gốc SGK, từ `13` đến `29`).

**Lưu ý ID:** Hóa học lớp 8 dùng dạng `g8-bXX` (không prefix, quy ước lịch sử), Vật lý dùng `phy-g8-bXX`. Hai bên **không được** trộn lẫn. Tuân theo mục 4.1 `planvatlynew.md`.

## 4. Cấu trúc thư mục cần tạo

```
src/
├── content/
│   └── physics/
│       └── g8/
│           ├── curriculum.ts                 # Đăng ký 17 bài, đúng thứ tự Unit 1→4
│           ├── unit-1-khoi-luong-rieng-ap-suat/   # phy-g8-b01 → b05
│           ├── unit-2-tac-dung-lam-quay/          # phy-g8-b06 → b07
│           ├── unit-3-dien/                       # phy-g8-b08 → b13
│           └── unit-4-nhiet/                      # phy-g8-b14 → b17
│               (mỗi bài gồm 2 file: <id>.theory.json + <id>.exercises.json)
├── kb/
│   └── physics/
│       └── g8/
│           └── constants.json    # Chỉ số liệu CÓ TRONG SGK lớp 8 (ví dụ bảng khối lượng riêng), phải tra SGK
```

## 5. Chuẩn cấu trúc nội dung mỗi bài

Dùng lại đúng Zod schema trong `planvatlynew.md` cho `theory.json` và `exercises.json` (hints, 7 steps, pitfalls, verify). Không tạo schema mới trùng lặp.

Mỗi bài tối thiểu:
- `theory.json`: tóm tắt lý thuyết bám sát SGK bài đó, không thêm kiến thức ngoài chương trình lớp 8.
- `exercises.json`: tối thiểu 6–10 câu, độ khó tăng dần. Các bài có tính toán (Unit 1, 2, Bài 24) nên có thêm bài toán nhiều bước.
- **Bài Thực hành (Bài 14, 25, 27):** đây là bài thí nghiệm, không phải bài lý thuyết thuần. Câu hỏi tập trung vào quy trình, dụng cụ, thứ tự các bước, đọc và xử lý số liệu đo, nhận xét nguyên nhân sai số. **Không mô phỏng thí nghiệm thật** và không bịa số liệu đo; số liệu trong đề phải là số liệu giả định hợp lý, ghi rõ là ví dụ.

## 6. Loại câu hỏi phù hợp theo từng Unit

Lớp 8 có nhiều tính toán và hình vẽ hơn lớp 7. **Nếu `numericChecker` / `orderingChecker` đã được duyệt và xây ở lớp 7 thì TÁI SỬ DỤNG, không viết lại.** Checker/component mới nào ngoài danh sách đã có đều phải **báo cáo thiết kế và chờ người dùng duyệt** trước khi code.

- **Unit 1 (Khối lượng riêng và áp suất):** bài toán tính nhiều bước và đổi đơn vị → `numericChecker` (số kèm đơn vị, dung sai, nhận dạng lỗi sai đơn vị/quên đổi đơn vị để hiện `pitfalls`). Câu khái niệm (vật nổi/chìm, áp suất chất lỏng, áp suất khí quyển) → mcq/multi-select. Bài 14 theo hướng dẫn ở mục 5.
- **Unit 2 (Tác dụng làm quay của lực):** cần **hình đòn bẩy / moment lực** render từ dữ liệu JSON (điểm tựa, lực, cánh tay đòn), không dùng ảnh tĩnh. Bài tính → `numericChecker`; câu nhận biết loại đòn bẩy, ứng dụng → mcq/kéo-thả.
- **Unit 3 (Điện):** cần **thành phần vẽ sơ đồ mạch điện từ JSON** (ký hiệu nguồn, công tắc, bóng đèn, dụng cụ đo...). Đề xuất: bắt đầu bằng mcq "chọn sơ đồ đúng" (sơ đồ dựng từ JSON), chỉ làm dạng tự ráp mạch bằng kéo-thả nếu người dùng đồng ý mở rộng engine. Bài 24 (cường độ dòng điện, hiệu điện thế) có tính toán/đọc số → `numericChecker`. Bài 20 (nhiễm điện do cọ xát) chủ yếu mcq/multi-select.
- **Unit 4 (Nhiệt):** phần lớn mcq/multi-select và matching cho khái niệm, hình thức truyền nhiệt, sự nở vì nhiệt. Bài tính (nếu SGK có) → `numericChecker`, phải tra đúng SGK trước khi ra đề. Bài 27 theo hướng dẫn ở mục 5.

**Checker/component có thể cần (tất cả phải hỏi người dùng trước khi code nếu chưa có):** `numericChecker`, `orderingChecker`, bộ render hình đòn bẩy, bộ render sơ đồ mạch điện. Mọi checker mới phải có unit test, giữ coverage ≥ 90% (mục 10 `planvatlynew.md`).

## 7. Quy tắc kiểm tra chất lượng nội dung (bắt buộc)

1. Tra cứu đúng nội dung SGK từng bài trước khi viết.
2. Không tự chế số liệu, đơn vị, công thức, bảng số liệu, hình minh họa không có trong SGK.
3. Bài tính toán: **tự kiểm tra lại đáp án bằng code** (script nhỏ hoặc unit test) trước khi đưa vào `exercises.json`.
4. Số liệu giả định trong đề (khối lượng, thể tích, lực, hiệu điện thế...) phải hợp lý thực tế, không đặt số vô lý.
5. Câu hỏi liên quan an toàn điện: chỉ đưa thông tin đúng chuẩn, không suy diễn.
6. Chạy `validate-content.ts` (Zod) sau mỗi bài.

## 8. Quy trình triển khai (tuần tự Unit 1 → Unit 4)

```
[BƯỚC 1] Đăng ký 17 bài vào curriculum.ts theo thứ tự Unit 1→4 (mục 3).
[BƯỚC 2] Kiểm tra engine hiện có (numericChecker, orderingChecker từ lớp 7).
   Liệt kê checker/component còn thiếu cho Unit 1–3 (mục 6), báo cáo và CHỜ
   người dùng đồng ý trước khi code bất kỳ thứ gì mới.
[BƯỚC 3] Với MỖI bài (phy-g8-b01 → b17):
   a. Tra cứu đúng nội dung SGK bài đó.
   b. Viết theory.json (đúng schema planvatlynew.md).
   c. Viết exercises.json (6–10 câu, đúng checker; bài Thực hành theo mục 5).
   d. Bài có tính toán: kiểm tra đáp án bằng code.
   e. Chạy validate-content.ts, sửa lỗi nếu có.
[BƯỚC 4] Xong mỗi Unit: DỪNG, báo cáo để người dùng review trước khi sang Unit kế.
[BƯỚC 5] Xong cả 17 bài: chạy toàn bộ test + coverage (mục 10 planvatlynew.md).
```

## 9. Checklist hoàn thành cho mỗi bài

- [ ] `id` và `sgkBaiSo` đúng, khớp bảng mục 3
- [ ] `theory.json` đúng schema, bám sát SGK, không bịa
- [ ] `exercises.json` 6–10 câu, độ khó tăng dần, đúng checker (mục 6)
- [ ] Bài tính toán: đáp án đã kiểm tra bằng code
- [ ] Bài Thực hành: đúng hướng dẫn mục 5, không bịa số liệu đo
- [ ] `validate-content.ts` không lỗi
- [ ] Không có kiến thức vượt chương trình lớp 8

---

## 10. Prompt chuẩn dán vào Antigravity

```
Đọc planvatlynew.md (kiến trúc, Zod schema, quy tắc) và planvatly-lop8.md (kế hoạch Vật lý lớp 8, 17 bài) rồi làm theo mục 8 của planvatly-lop8.md.

Bắt buộc:
- Làm từng Unit, xong mỗi Unit DỪNG và báo cáo để tôi duyệt.
- Mỗi bài phải tra đúng SGK Kết nối tri thức trước khi viết, không bịa số liệu/công thức/bảng số liệu; không chắc thì để TODO và hỏi tôi.
- Tái sử dụng checker đã có từ lớp 7 (numericChecker, orderingChecker). Checker/component mới (render hình đòn bẩy, sơ đồ mạch điện...): báo cáo thiết kế và CHỜ tôi duyệt trước khi code.
- Bài tính toán: kiểm tra đáp án bằng code. Chạy validate-content.ts sau mỗi bài.
- Bài Thực hành (Bài 14, 25, 27): làm theo hướng dẫn mục 5, không mô phỏng thí nghiệm thật, không bịa số liệu đo.

Bắt đầu bằng BƯỚC 1–2 (đăng ký curriculum + báo cáo checker/component còn thiếu). Chưa viết nội dung bài nào cho tới khi tôi duyệt.
```
