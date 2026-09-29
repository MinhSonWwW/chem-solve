# STEM-Solve — Vật lý lớp 9 (Kết nối tri thức): Kế hoạch triển khai nội dung Unit 1–5

> Tài liệu này là **bổ sung** cho `planvatlynew.md` (kiến trúc tổng thể v2.5), cùng cấu trúc chuẩn mực với `planvatly-lop7.md` và `planvatly-lop8.md`. Toàn bộ quy tắc engine (state machine, hearts, XP, gamification, ID naming, Zod schema, quy trình xác thực, coverage) áp dụng nguyên vẹn từ `planvatlynew.md`. File này định nghĩa **nội dung curriculum môn Vật lý lớp 9 (Khoa học tự nhiên 9 — Kết nối tri thức với cuộc sống)**.

---

## 1. Mục tiêu

Triển khai đầy đủ nội dung phân môn Vật lý lớp 9 (SGK Khoa học tự nhiên 9 — Kết nối tri thức với cuộc sống) gồm **16 bài học, chia thành 5 Unit**, theo đúng chuẩn chương trình SGK, tuyệt đối không bịa đặt, không thêm bớt sai lệch so với mục lục Bộ Giáo dục & Đào tạo.

## 2. Nguồn nội dung & Yêu cầu chính xác

- **Nguồn thẩm định:** Mục lục SGK Khoa học tự nhiên 9 (Kết nối tri thức với cuộc sống) đối chiếu đồng bộ với mục lục "Vật Lí 9 Kết nối tri thức" trên vietjack.com.
- **Ranh giới phân môn trong KHTN 9 (51 bài trong 14 chương):**
  - **Bài 1 (Mở đầu):** "Nhận biết một số dụng cụ, hóa chất. Thuyết trình một vấn đề khoa học" là bài kĩ năng phòng thí nghiệm chung, **ngoài phạm vi** phân môn Vật lý.
  - **Phần Vật lý (Chương 1 – 5, Bài 2 – 17):** Gồm 16 bài học, tập trung vào Cơ học, Quang học, Điện học, Điện từ học và Năng lượng. **Đây là toàn bộ phạm vi của kế hoạch này.**
  - **Phần Hóa học (Chương 6 – 10, Bài 18 – 35):** Kim loại, Phi kim, Hợp chất hữu cơ, Nhiên liệu, Khai thác tài nguyên Trái Đất thuộc phân môn Hóa học (ngoài phạm vi).
  - **Phần Sinh học (Chương 11 – 14, Bài 36 – 51):** Di truyền học, Nhiễm sắc thể, Tiến hóa thuộc phân môn Sinh học (ngoài phạm vi).
- **Quy tắc biên soạn:**
  - Bắt buộc tên bài, tên chương giữ nguyên văn như bảng mục 3.
  - Mỗi bài trước khi viết `theory.json` và `exercises.json` **phải tra cứu đúng nội dung SGK Kết nối tri thức của từng bài** (vietjack.com hoặc SGK gốc).
  - Tuyệt đối không tự suy đoán số liệu, đơn vị, công thức, ví dụ nếu không chắc chắn. Nếu chưa rõ: để `// TODO: cần xác minh nguồn` và hỏi người dùng.
  - Không đưa kiến thức Vật lý THPT (lớp 10, 11, 12) vào (ví dụ: không dùng đạo hàm, tích phân, lượng giác phức tạp ngoài chương trình lớp 9).

---

## 3. Danh sách 16 bài Vật lý lớp 9 (Đã chốt chuẩn SGK)

| Unit | ID nội bộ | Bài SGK | Tên bài học | Nội dung trọng tâm |
|---|---|---|---|---|
| **Unit 1 — Năng lượng cơ học** (Chương 1) | `phy-g9-b01` | Bài 2 | Động năng. Thế năng | Biểu thức $W_đ = \frac{1}{2}mv^2$, thế năng trọng trường $W_t = P \cdot h$, các yếu tố ảnh hưởng |
| | `phy-g9-b02` | Bài 3 | Cơ năng | Định nghĩa cơ năng $W = W_đ + W_t$, định luật bảo toàn cơ năng trong chuyển động của vật |
| | `phy-g9-b03` | Bài 4 | Công và công suất | Công cơ học $A = F \cdot s$, công suất $P = \frac{A}{t}$, đơn vị Oát (W), Jun (J) |
| **Unit 2 — Ánh sáng** (Chương 2) | `phy-g9-b04` | Bài 5 | Khúc xạ ánh sáng | Hiện tượng khúc xạ, tia tới, tia khúc xạ, góc tới $i$, góc khúc xạ $r$, chiết suất |
| | `phy-g9-b05` | Bài 6 | Phản xạ toàn phần | Điều kiện phản xạ toàn phần, góc khúc xạ giới hạn $i_{gh}$, ứng dụng cáp quang |
| | `phy-g9-b06` | Bài 7 | Lăng kính | Cấu tạo lăng kính, đường truyền tia sáng qua lăng kính, tán sắc ánh sáng trắng |
| | `phy-g9-b07` | Bài 8 | Thấu kính | Thấu kính hội tụ, thấu kính phân kì, quang tâm O, tiêu điểm F, tiêu cự f, ảnh của vật |
| | `phy-g9-b08` | Bài 9 | Thực hành đo tiêu cự của thấu kính hội tụ | Phương pháp đo tiêu cự (phương pháp Silbermann), quy trình thí nghiệm, đo khoảng cách |
| | `phy-g9-b09` | Bài 10 | Kính lúp | Cấu tạo kính lúp, số bội giác $G = 25/f$, sự tạo ảnh ảo qua kính lúp, quan sát vật nhỏ |
| **Unit 3 — Điện** (Chương 3) | `phy-g9-b10` | Bài 11 | Điện trở. Định luật Ohm | Định luật Ohm $I = \frac{U}{R}$, điện trở dây dẫn $R = \rho \frac{l}{S}$, đơn vị Ôm ($\Omega$) |
| | `phy-g9-b11` | Bài 12 | Đoạn mạch nối tiếp, song song | Đoạn mạch nối tiếp ($I, U, R_{tđ} = R_1 + R_2$), song song ($U, I, \frac{1}{R_{tđ}} = \frac{1}{R_1} + \frac{1}{R_2}$) |
| | `phy-g9-b12` | Bài 13 | Năng lượng của dòng điện và công suất điện | Công suất điện $P = U \cdot I$, điện năng tiêu thụ $A = P \cdot t = U \cdot I \cdot t$, số đếm công tơ điện |
| **Unit 4 — Điện từ** (Chương 4) | `phy-g9-b13` | Bài 14 | Cảm ứng điện từ. Nguyên tắc tạo ra dòng điện xoay chiều | Điều kiện xuất hiện dòng điện cảm ứng, hiện tượng cảm ứng điện từ, máy phát điện xoay chiều |
| | `phy-g9-b14` | Bài 15 | Tác dụng của dòng điện xoay chiều | Tác dụng nhiệt, quang, từ của dòng xoay chiều, truyền tải điện năng đi xa, máy biến thế $\frac{U_1}{U_2} = \frac{N_1}{N_2}$ |
| **Unit 5 — Năng lượng với cuộc sống** (Chương 5) | `phy-g9-b15` | Bài 16 | Vòng năng lượng trên Trái Đất. Năng lượng hóa thạch | Nguồn gốc năng lượng Trái Đất (Mặt Trời), nhiên liệu hóa thạch (than, dầu, khí), tác động môi trường |
| | `phy-g9-b16` | Bài 17 | Một số dạng năng lượng tái tạo | Năng lượng mặt trời, gió, thủy điện, sinh khối, địa nhiệt; xu thế chuyển dịch năng lượng xanh |

> **Quy ước định danh ID:**
> - Mỗi bài có mã ID nội bộ: `phy-g9-b01` đến `phy-g9-b16`.
> - Trường `sgkBaiSo` lưu số bài gốc SGK KNTT (từ `2` đến `17`).

---

## 4. Cấu trúc thư mục triển khai

```
src/
├── content/
│   └── physics/
│       └── g9/
│           ├── curriculum.ts                           # Đăng ký 16 bài, 5 Unit
│           ├── unit-1-nang-luong-co-hoc/               # phy-g9-b01 → b03
│           ├── unit-2-anh-sang/                        # phy-g9-b04 → b09
│           ├── unit-3-dien/                            # phy-g9-b10 → b12
│           ├── unit-4-dien-tu/                         # phy-g9-b13 → b14
│           └── unit-5-nang-luong-cuoc-song/            # phy-g9-b15 → b16
│               (mỗi bài gồm: <id>.theory.json + <id>.exercises.json)
└── content/
    └── kb/
        └── physics/
            └── g9/
                └── constants.json                      # Hằng số, điện trở suất ρ, công thức chuẩn SGK lớp 9
```

---

## 5. Chuẩn cấu trúc nội dung mỗi bài học

Tuân thủ nghiêm ngặt Zod schema trong `src/content/schema/theory.ts` và `src/content/schema/exercise.ts`:

- **`theory.json`:**
  - 3 thẻ lý thuyết (`c1`, `c2`, `c3`) chuẩn micro-learning: mỗi thẻ có `badge`, `badgeColor` (`cyan`, `amber`, `emerald`), `title`, `content`, `bulletPoints` và `callout`.
  - 1 câu hỏi tương tác nhanh `quickCheck` kèm giải thích sư phạm khuyến khích.
- **`exercises.json`:**
  - Tối thiểu 8 câu hỏi, độ khó tăng dần từ 1 đến 3.
  - Tối thiểu 2 gợi ý hướng dẫn (`level: 1`, `level: 2`).
  - Tối thiểu 3 bước giải chi tiết (`steps`).
  - Phân tích lỗi sai thường gặp (`commonMistakes`).
  - **Bài Thực hành (Bài 9 - `phy-g9-b08`):** Thực hành đo tiêu cự thấu kính hội tụ; áp dụng `orderingChecker` cho quy trình dịch chuyển vật và màn để thu ảnh rõ nét bằng vật và tính $f = \frac{d + d'}{4}$, không mô phỏng ảo, không bịa số đo phi thực tế.

---

## 6. Phân loại Checker & Đề xuất công nghệ theo từng Unit

Tái sử dụng các Checker đã hoàn thiện và kiểm thử đạt độ tin cậy cao:
- **`numericChecker` (Đã có sẵn):** Nhập số kèm đơn vị, dung sai làm tròn, nhận biết sai đơn vị để hiện pitfall. Áp dụng cho:
  - Unit 1: Tính động năng, thế năng, công $A = F \cdot s$ và công suất $P = A / t$.
  - Unit 2: Tính tiêu cự $f$, khoảng cách $d, d'$, số bội giác kính lúp $G = 25/f$.
  - Unit 3: Tính định luật Ohm $I = U/R$, điện trở tương đương nối tiếp/song song, điện năng $A$ và công suất $P$.
  - Unit 4: Tính tỉ số máy biến thế $\frac{U_1}{U_2} = \frac{N_1}{N_2}$.
- **`orderingChecker` (Đã có sẵn):** Sắp xếp thứ tự các bước thao tác thực nghiệm khoa học. Áp dụng cho:
  - Bài 9 (`phy-g9-b08`): Quy trình đo tiêu cự thấu kính hội tụ.
- **Widget tương tác (Đã có trong `PhysicsVisualizer.tsx`):**
  - Mạch điện (`circuit-diagram`): Tái sử dụng cho Unit 3 (Điện trở, định luật Ohm, đoạn mạch nối tiếp & song song).
  - Đề xuất bổ sung (nếu người dùng duyệt): Widget tia sáng qua thấu kính hội tụ/phân kì (`optics-lens`).

---

## 7. Quy tắc kiểm tra chất lượng (Bắt buộc)

1. Tra cứu đúng nội dung SGK từng bài trước khi viết.
2. Không tự chế số liệu, đơn vị, công thức, bảng số liệu không có trong SGK KNTT.
3. Bài tính toán: **Bắt buộc tự kiểm tra lại đáp án bằng code** trước khi đưa vào JSON.
4. Mọi số liệu giả định trong đề phải hợp lý thực tế.
5. Sau mỗi bài viết xong, chạy:
   - `npm run validate:content`
   - `npm run typecheck`
6. **Tuyệt đối KHÔNG chạy tự tiện lệnh `vitest` hay `npm test`**.

---

## 8. Quy trình triển khai (Tuần tự Unit 1 → Unit 5)

```
[BƯỚC 1] Đăng ký 16 bài vào src/content/physics/g9/curriculum.ts và src/content/curriculum/physics.ts.
         Tạo file tri thức hằng số src/content/kb/physics/g9/constants.json.
[BƯỚC 2] Báo cáo đề xuất thành phần tương tác Quang học (nếu cần), CHỜ người dùng duyệt.
[BƯỚC 3] Triển khai tuần tự từng Unit (Unit 1 → Unit 5):
         - Unit 1: Năng lượng cơ học (phy-g9-b01 → b03)
         - Unit 2: Ánh sáng (phy-g9-b04 → b09)
         - Unit 3: Điện (phy-g9-b10 → b12)
         - Unit 4: Điện từ (phy-g9-b13 → b14)
         - Unit 5: Năng lượng với cuộc sống (phy-g9-b15 → b16)
         Với mỗi bài:
         a. Tra cứu SGK KNTT bài đó.
         b. Viết <id>.theory.json.
         c. Viết <id>.exercises.json.
         d. Chạy validate:content và typecheck.
[BƯỚC 4] Xong MỖI Unit: DỪNG lại, báo cáo để người dùng nghiệm thu trước khi sang Unit tiếp theo.
[BƯỚC 5] Hoàn thành toàn bộ 16 bài: Rà soát tổng thể (math, logic, schema) và báo cáo nghiệm thu lớp 9.
```

---

## 9. Checklist nghiệm thu cho từng bài học

- [ ] `id` chuẩn `phy-g9-bXX` và `sgkBaiSo` khớp đúng số bài SGK (từ `2` đến `17`).
- [ ] `theory.json` đúng Zod schema, bám sát SGK KNTT 9, không đưa kiến thức ngoài.
- [ ] `exercises.json` tối thiểu 8 câu, độ khó tăng dần (1, 2, 3), đúng Checker.
- [ ] Bài tính toán: đáp án đã được đối soát chính xác bằng code.
- [ ] Bài Thực hành (Bài 9): đúng quy trình đo tiêu cự, dùng `orderingChecker`, không bịa số đo.
- [ ] Chạy `npm run validate:content` và `npm run typecheck` đạt 100% không lỗi.
- [ ] Cập nhật composite checkpoint loader tại `src/content/contentLoader.ts`.
