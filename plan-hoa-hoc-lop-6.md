# PROJECT: Module Hóa học lớp 6 — KHTN 6 Kết nối tri thức (Chương 2: Chất quanh ta)

> File này dùng để đưa cho Antigravity. Đọc hết file rồi làm theo mục **12. Kế hoạch thực hiện (giao việc cho agent)**.
> Module được thiết kế để gắn vào web luyện Hóa THCS **CHEM-SOLVE** (kiểu Duolingo). Nếu làm riêng thì vẫn chạy độc lập được.

---

## 1. Mục tiêu

Làm phần học + luyện tập Hóa học lớp 6 cho học sinh THCS, bám sách **Khoa học tự nhiên 6 – Kết nối tri thức với cuộc sống**, gồm 3 bài:

| Bài | Tên | Ghi chú |
|---|---|---|
| 9 | Sự đa dạng của chất | Vật thể, chất, tính chất vật lí/hóa học, biến đổi vật lí/hóa học |
| 10 | Các thể của chất và sự chuyển thể | Rắn/lỏng/khí, mô hình hạt, nóng chảy, đông đặc, bay hơi, ngưng tụ, sôi |
| 11 | Oxygen. Không khí | Tính chất & vai trò oxygen, thành phần không khí, ô nhiễm không khí |

Nguồn đối chiếu (chỉ để tham khảo, **không sao chép nguyên văn**, VietJack ghi rõ bản quyền):
- Chương 2: https://vietjack.com/khoa-hoc-tu-nhien-6-kn/chuong-2-chat-quanh-ta.jsp
- Bài 9: https://vietjack.com/khoa-hoc-tu-nhien-6-kn/bai-9-su-da-dang-cua-chat.jsp
- Bài 10: https://vietjack.com/khoa-hoc-tu-nhien-6-kn/bai-10-cac-the-cua-chat-va-su-chuyen-the.jsp
- Bài 11: https://vietjack.com/khoa-hoc-tu-nhien-6-kn/bai-11-oxygen-khong-khi.jsp

**Nguyên tắc nội dung:** viết lại bằng lời riêng, ngắn, dễ hiểu cho học sinh lớp 6; ví dụ gần đời sống; tiếng Việt, dùng tên gọi theo sách (oxygen, nitrogen, carbon dioxide).

**Chưa làm ở giai đoạn này:** tài khoản/đăng nhập, server, thanh toán, bảng xếp hạng online.

---

## 2. Stack & quy ước (khớp CHEM-SOLVE)

- Frontend: **TypeScript** + Vite + React. Mobile-first, ưu tiên hiệu năng trên điện thoại yếu.
- Animation: **Framer Motion**. Mascot: Rive (tùy chọn, có thể để placeholder).
- Font: **Nunito** (chính) / Quicksand (phụ).
- Lưu tiến độ: **localStorage / IndexedDB** trước, chưa cần backend.
- Asset UI: dùng lại sprite sheet đã có của CHEM-SOLVE (thẻ bài tập & khay kéo thả; nút & chỉ số game; hiệu ứng trạng thái phản ứng). Nếu chưa có thì dùng CSS thuần làm placeholder, đặt tên asset theo mục 4.
- Chủ đề giao diện: phòng thí nghiệm hóa học (ống nghiệm, bình tam giác, đèn cồn), màu sáng, bo tròn, nút to dễ bấm.
- Toàn bộ nội dung bài học và câu hỏi nằm trong **file JSON/TS dữ liệu**, không hard-code trong component.

---

## 3. Cấu trúc thư mục đề xuất

```
src/
  data/grade6/
    index.ts              // export tất cả
    units.ts              // Unit 1..3 + boss chương
    lessons/
      b09-su-da-dang-cua-chat.ts
      b10-cac-the-cua-chat.ts
      b11-oxygen-khong-khi.ts
    questions/
      b09.ts
      b10.ts
      b11.ts
      boss-chuong-2.ts
    glossary.ts           // từ điển thuật ngữ
  components/grade6/
    SkillTree.tsx
    LessonCard.tsx        // thẻ kiến thức
    QuestionRenderer.tsx  // render theo type
    ParticleSim.tsx       // mô phỏng hạt (minigame)
    CandleExperiment.tsx  // thí nghiệm đốt nến ảo
  games/grade6/
    ...                   // các minigame mục 8
  store/progress.ts       // XP, streak, hearts, mastery
```

---

## 4. Mô hình dữ liệu (TypeScript)

```ts
export type QuestionType =
  | "mcq"          // 1 đáp án đúng
  | "multi"        // nhiều đáp án đúng
  | "truefalse"
  | "match"        // ghép cặp
  | "classify"     // kéo thả vào nhóm
  | "fill"         // điền khuyết (chọn từ trong ngân hàng từ)
  | "order"        // sắp xếp thứ tự
  | "graph";       // đọc đồ thị / mô phỏng

export interface Question {
  id: string;                 // vd "b09-003"
  lessonId: string;           // vd "b09-l2"
  type: QuestionType;
  difficulty: 1 | 2 | 3;
  prompt: string;
  image?: string;             // tên asset, không bắt buộc
  options?: string[];         // mcq/multi/fill(word bank)
  pairs?: [string, string][]; // match
  groups?: { name: string; items: string[] }[]; // classify (đáp án đúng)
  answer: number | number[] | boolean | string[] ; // tùy type
  explanation: string;        // hiện sau khi trả lời, 1–2 câu
  hint?: string;
  tags: string[];             // vd ["tinh-chat-vat-li","phan-biet"]
  misconception?: string;     // lỗi hay gặp, để gợi ý ôn lại
}

export interface Lesson {
  id: string;                 // "b09-l1"
  unitId: string;
  title: string;
  objectives: string[];       // "Sau bài này em biết..."
  cards: KnowledgeCard[];     // 3–6 thẻ, mỗi thẻ 1 ý
  glossary: string[];         // id thuật ngữ
  questionIds: string[];
  minigameId?: string;
}

export interface KnowledgeCard {
  title: string;
  body: string;               // ≤ 60 từ
  example?: string;
  image?: string;
  warning?: string;           // "Chú ý / dễ nhầm"
}
```

Ví dụ 3 câu (mẫu định dạng dữ liệu):

```json
[
  {
    "id": "b09-001", "lessonId": "b09-l1", "type": "mcq", "difficulty": 1,
    "prompt": "Vật nào sau đây là vật thể nhân tạo?",
    "options": ["Cây bàng", "Con sông", "Chiếc bàn gỗ", "Đám mây"],
    "answer": 2,
    "explanation": "Chiếc bàn gỗ do con người làm ra nên là vật thể nhân tạo. Cây, sông, mây có sẵn trong tự nhiên.",
    "tags": ["vat-the"]
  },
  {
    "id": "b10-004", "lessonId": "b10-l3", "type": "match", "difficulty": 1,
    "prompt": "Ghép tên quá trình với sự chuyển thể tương ứng.",
    "pairs": [["Nóng chảy","Rắn → Lỏng"],["Đông đặc","Lỏng → Rắn"],["Bay hơi","Lỏng → Khí"],["Ngưng tụ","Khí → Lỏng"]],
    "answer": ["0-0","1-1","2-2","3-3"],
    "explanation": "Nhớ mũi tên: nóng chảy đi lên, đông đặc đi xuống, bay hơi đi lên nữa, ngưng tụ quay về lỏng.",
    "tags": ["chuyen-the"]
  },
  {
    "id": "b11-004", "lessonId": "b11-l2", "type": "truefalse", "difficulty": 2,
    "prompt": "Oxygen là chất có thể cháy được.",
    "answer": false,
    "explanation": "Oxygen không tự cháy mà duy trì sự cháy: có oxygen thì các chất khác mới cháy được.",
    "misconception": "nham-duy-tri-su-chay-voi-tu-chay",
    "tags": ["oxygen","su-chay"]
  }
]
```

---

## 5. Cây kỹ năng (skill tree)

Mỗi bài chia thành 4 nút (lesson) + 1 boss. Mỗi nút = 1–2 thẻ kiến thức → 6–8 câu hỏi (trộn dạng) → kết quả.

```
UNIT 1 — Bài 9: Sự đa dạng của chất
  9.1 Vật thể và chất
  9.2 Tính chất vật lí của chất
  9.3 Tính chất hóa học & sự biến đổi của chất
  9.4 Thực hành: đường và muối ăn
  ★ Boss Bài 9

UNIT 2 — Bài 10: Các thể của chất và sự chuyển thể
  10.1 Ba thể của chất
  10.2 Mô hình hạt của rắn – lỏng – khí
  10.3 Sự chuyển thể (nóng chảy, đông đặc, bay hơi, ngưng tụ)
  10.4 Sự sôi và các yếu tố ảnh hưởng sự bay hơi
  ★ Boss Bài 10

UNIT 3 — Bài 11: Oxygen. Không khí
  11.1 Tính chất của oxygen
  11.2 Vai trò của oxygen: sự cháy & sự hô hấp
  11.3 Thành phần không khí
  11.4 Ô nhiễm không khí & bảo vệ
  ★ Boss Bài 11

🏆 BOSS CHƯƠNG 2 (mở khóa khi qua 3 boss): 15 câu trộn, có 1 câu đọc đồ thị và 1 câu thí nghiệm nến
```

Quy tắc mở khóa: qua nút trước (≥ 70% đúng) mới mở nút sau; boss cần hoàn thành 4 nút của bài. Cho phép "kiểm tra nhanh để nhảy cóc" ở mỗi Unit (5 câu khó).

---

## 6. Nội dung bài học

### BÀI 9 — SỰ ĐA DẠNG CỦA CHẤT

**Mục tiêu:** phân biệt vật thể và chất; nêu được tính chất vật lí, hóa học; phân biệt biến đổi vật lí và hóa học.

#### 9.1 Vật thể và chất
- **Vật thể** là những gì ta nhìn thấy, sờ được: cái bàn, con cá, hòn đá. **Chất** là "nguyên liệu" tạo nên vật thể: gỗ, nước, nhôm, nhựa...
- Phân loại vật thể: **tự nhiên** (có sẵn: cây, núi, sông) và **nhân tạo** (con người làm ra: xe, điện thoại, ghế). Cũng có thể chia thành **vật sống** (cây, cá, người) và **vật không sống** (đá, bút, xe).
- Một vật thể có thể do **một hoặc nhiều chất** tạo nên; một chất có thể có trong **nhiều vật thể** (vd. nhôm có trong ấm, nồi, khung cửa). Cơ thể người, cây cối chứa nhiều chất như nước, chất đạm...
- Dễ nhầm: "Nước" là chất, còn "cốc nước" là vật thể (gồm thủy tinh + nước).

#### 9.2 Tính chất vật lí
- Là những đặc điểm nhận biết chất mà **chưa làm chất bị đổi thành chất khác**: thể (rắn/lỏng/khí), màu sắc, mùi, vị, hình dạng, khối lượng riêng, tính tan trong nước, nhiệt độ nóng chảy, nhiệt độ sôi, tính dẫn điện, dẫn nhiệt.
- Ví dụ: nước là chất lỏng, không màu, sôi ở 100 °C; đồng dẫn điện tốt; đường và muối tan trong nước.
- Dùng tính chất vật lí để **phân biệt chất** (vd. nhìn màu, thử tan trong nước).
- An toàn: không tự nếm hay ngửi trực tiếp hóa chất lạ trong phòng thực hành.

#### 9.3 Tính chất hóa học và sự biến đổi
- **Tính chất hóa học** là khả năng chất **biến đổi thành chất khác**: bị cháy, bị gỉ, bị phân hủy khi đun nóng, tác dụng với chất khác...
- **Biến đổi vật lí:** chỉ đổi trạng thái/hình dạng, **không tạo chất mới** (nước đá tan, hòa tan muối, cắt giấy, nến chảy lỏng).
- **Biến đổi hóa học:** **có chất mới tạo thành** (đốt giấy, sắt bị gỉ, đường bị cháy thành than, thức ăn bị ôi thiu).
- Mẹo nhận biết: có thứ gì **không quay về như cũ** được, đổi màu/mùi lạ, tỏa nhiệt/phát sáng, sủi bọt, tạo chất kết tủa → nghi là biến đổi hóa học.
- Ví dụ sắt: có màu xám, cứng, dẫn điện (vật lí); **bị gỉ** trong không khí ẩm (hóa học).

#### 9.4 Thực hành: đường và muối ăn (làm thành mô phỏng)
- Quan sát: cả hai đều là chất rắn màu trắng, dạng hạt, đều tan trong nước.
- Đun nóng một lượng nhỏ trên thìa kim loại: **đường** chảy, ngả vàng rồi đen và có mùi khét (biến đổi hóa học); **muối ăn** không đổi màu như vậy ở nhiệt độ này.
- Kết luận: hai chất có điểm giống nhau nhưng khác nhau ở tính chất hóa học → phải thử nhiều tính chất mới phân biệt được.

**Thuật ngữ:** vật thể, chất, vật thể tự nhiên/nhân tạo, vật sống/không sống, tính chất vật lí, tính chất hóa học, biến đổi vật lí, biến đổi hóa học, chất tinh khiết (nhắc nhẹ, học kĩ ở Bài 16).

---

### BÀI 10 — CÁC THỂ CỦA CHẤT VÀ SỰ CHUYỂN THỂ

**Mục tiêu:** nêu đặc điểm ba thể; mô tả sự chuyển thể; giải thích hiện tượng thường gặp.

#### 10.1 Ba thể của chất
| Thể | Hình dạng | Thể tích | Nén được? |
|---|---|---|---|
| Rắn | Xác định | Xác định | Rất khó |
| Lỏng | Theo bình chứa, chảy được | Xác định | Khó |
| Khí | Theo bình chứa, lan ra mọi hướng | Chiếm hết bình | Dễ |

Cùng một chất (vd. nước) có thể ở cả ba thể tùy nhiệt độ.

#### 10.2 Mô hình hạt
- **Rắn:** hạt xếp sát nhau, có trật tự, chỉ dao động tại chỗ.
- **Lỏng:** hạt gần nhau nhưng không cố định, trượt qua nhau.
- **Khí:** hạt ở xa nhau, chuyển động tự do, nhanh.
- Nhiệt độ tăng → hạt chuyển động nhanh hơn.

#### 10.3 Sự chuyển thể
- **Nóng chảy:** rắn → lỏng. **Đông đặc:** lỏng → rắn.
- **Bay hơi:** lỏng → khí. **Ngưng tụ:** khí (hơi) → lỏng.
- Nước: nóng chảy/đông đặc ở **0 °C**, sôi ở **100 °C** (điều kiện thường). Trong lúc đang nóng chảy hoặc đang sôi, **nhiệt độ giữ nguyên** dù vẫn đun.
- *(Mở rộng, không bắt buộc)* Thăng hoa: rắn → khí, vd. băng phiến, đá khô.
- Ví dụ đời sống: nước đá tan (nóng chảy), sương đọng trên lá (ngưng tụ), nước trong ngăn đá thành đá (đông đặc), quần áo khô (bay hơi), nước đọng ngoài cốc nước lạnh (hơi nước trong không khí ngưng tụ).

#### 10.4 Sự sôi và bay hơi
- **Bay hơi** xảy ra ở bề mặt chất lỏng, ở mọi nhiệt độ. **Sôi** là bay hơi mạnh, xảy ra cả trong lòng chất lỏng, ở nhiệt độ xác định (nhiệt độ sôi).
- Bay hơi nhanh hơn khi: **nhiệt độ cao hơn**, **có gió**, **diện tích mặt thoáng lớn hơn**.
- Đọc đồ thị: đoạn **nằm ngang** trên đồ thị nhiệt độ – thời gian là lúc chất đang chuyển thể.

**Thuật ngữ:** thể rắn/lỏng/khí, hạt, nóng chảy, đông đặc, bay hơi, ngưng tụ, sôi, nhiệt độ nóng chảy, nhiệt độ sôi, mặt thoáng.

---

### BÀI 11 — OXYGEN. KHÔNG KHÍ

**Mục tiêu:** nêu tính chất và vai trò oxygen; biết thành phần không khí; hiểu nguyên nhân, tác hại, cách giảm ô nhiễm không khí.

#### 11.1 Tính chất của oxygen
- Là chất **khí, không màu, không mùi, không vị**, **ít tan trong nước**, nặng hơn không khí một chút.
- Hóa lỏng ở khoảng **−183 °C**.
- Có trong không khí, nước, đất và cơ thể sinh vật.
- Tính chất hóa học quan trọng: **duy trì sự cháy và sự sống**.

#### 11.2 Vai trò: sự cháy & hô hấp
- **Sự cháy:** chất tác dụng với oxygen, **tỏa nhiệt và thường phát sáng**. Cháy trong oxygen tinh khiết mạnh hơn cháy trong không khí.
- **Hô hấp:** người, động vật, thực vật cần oxygen để lấy năng lượng từ thức ăn. Vì vậy bệnh nhân khó thở dùng bình oxygen, thợ lặn mang bình khí.
- Dễ nhầm: oxygen **không tự cháy**, nó giúp chất khác cháy.

#### 11.3 Thành phần không khí
- Không khí là **hỗn hợp** nhiều khí, không màu, không mùi, không vị.
- Theo thể tích: **khoảng 78 % nitrogen, 21 % oxygen, 1 % các khí khác** (carbon dioxide, hơi nước, khí hiếm...).
- Thí nghiệm kinh điển: đốt nến trong bình úp trên chậu nước; nến tắt khi hết oxygen, nước dâng vào chiếm khoảng **1/5** thể tích bình → oxygen ≈ 1/5 không khí.

#### 11.4 Ô nhiễm không khí
- **Nguyên nhân:** khói bụi từ nhà máy và xe cộ, đốt rơm rạ/rác, cháy rừng, núi lửa, bụi công trình.
- **Tác hại:** bệnh hô hấp, ảnh hưởng sức khỏe, gây biến đổi khí hậu, hại cây trồng.
- **Biện pháp:** trồng nhiều cây xanh, xử lý khí thải, dùng phương tiện công cộng/năng lượng sạch, không đốt rác bừa bãi, đeo khẩu trang khi ô nhiễm nặng.

**Thuật ngữ:** oxygen, nitrogen, carbon dioxide, không khí, hỗn hợp, sự cháy, sự hô hấp, ô nhiễm không khí.

---

## 7. Ngân hàng câu hỏi (seed data — agent chuyển sang JSON theo mục 4)

Ký hiệu: **A** = đáp án, **G** = giải thích. Mỗi bài viết **thêm** tối thiểu 30 câu (mở rộng từ các mẫu dưới) để đủ ngân hàng cho luyện tập lặp lại.

### Bài 9

| ID | Dạng | Câu hỏi | A | G |
|---|---|---|---|---|
| b09-001 | mcq | Vật nào là vật thể nhân tạo? (Cây bàng / Con sông / Chiếc bàn gỗ / Đám mây) | Chiếc bàn gỗ | Do con người làm ra. |
| b09-002 | mcq | Vật nào sau đây là vật sống? (Cái bút / Con cá / Hòn đá / Chiếc xe) | Con cá | Có các hoạt động sống: lớn lên, sinh sản. |
| b09-003 | classify | Xếp vào **Tự nhiên / Nhân tạo**: núi, ghế, con mèo, nồi nhôm, biển, điện thoại | Tự nhiên: núi, con mèo, biển. Nhân tạo: ghế, nồi nhôm, điện thoại | Nhân tạo = do người làm. |
| b09-004 | match | Ghép vật thể – chất: ấm nhôm/nhôm; cốc thủy tinh/thủy tinh; lõi dây điện/đồng; chai nước ngọt thông dụng/nhựa | theo cặp | Tên chất là vật liệu cấu tạo nên vật thể. |
| b09-005 | truefalse | Mỗi vật thể chỉ do một chất tạo nên. | Sai | Nhiều vật thể (cây, cơ thể người) gồm nhiều chất. |
| b09-006 | classify | Xếp **Vật lí / Hóa học**: sắt màu xám; sắt bị gỉ; đường tan trong nước; khí gas cháy được; nước sôi ở 100 °C | VL: xám, tan, sôi 100 °C. HH: bị gỉ, cháy được | Hóa học = khả năng biến thành chất khác. |
| b09-007 | mcq | Hiện tượng nào là biến đổi hóa học? (Hòa tan muối / Nước đá tan / Đốt cháy giấy / Cắt nhỏ giấy) | Đốt cháy giấy | Tạo ra chất mới (tro, khói). |
| b09-008 | multi | Chọn các hiện tượng **vật lí**: tuyết tan; sắt gỉ; đường hòa tan trong nước; sữa để lâu bị chua | Tuyết tan; đường hòa tan | Không tạo chất mới. |
| b09-009 | fill | Sự biến đổi ___ chất mới gọi là biến đổi hóa học. (tạo ra / không tạo ra) | tạo ra | |
| b09-010 | mcq | Nhận xét nào nói về **tính chất hóa học** của sắt? (Sắt dẫn điện / Sắt bị gỉ trong không khí ẩm / Sắt có màu xám / Sắt bị nam châm hút) | Sắt bị gỉ trong không khí ẩm | Gỉ là chất mới. |
| b09-011 | order | Sắp xếp diễn biến khi đun đường: đường rắn → đường chảy → chuyển vàng/nâu → đen, mùi khét | như trên | Chảy là vật lí, cháy đen là hóa học. |
| b09-012 | mcq | Khi đun nóng, chất nào bị đen và khét? (Muối ăn / Đường) | Đường | Đường bị phân hủy thành than. |

### Bài 10

| ID | Dạng | Câu hỏi | A | G |
|---|---|---|---|---|
| b10-001 | match | Ghép thể – đặc điểm: Rắn/hình dạng xác định; Lỏng/chảy được, theo hình bình; Khí/dễ nén, chiếm hết bình | theo cặp | |
| b10-002 | mcq | Chất nào dễ bị nén nhất? (Rắn / Lỏng / Khí) | Khí | Hạt ở xa nhau. |
| b10-003 | fill | Chất ở thể rắn có hình dạng ___ . (xác định / không xác định) | xác định | |
| b10-004 | match | Nóng chảy – Rắn→Lỏng; Đông đặc – Lỏng→Rắn; Bay hơi – Lỏng→Khí; Ngưng tụ – Khí→Lỏng | theo cặp | |
| b10-005 | classify | Xếp hiện tượng vào **nóng chảy / đông đặc / bay hơi / ngưng tụ**: nước đá tan; nước trong ngăn đá thành đá; quần áo phơi khô; sương đọng trên lá; nến chảy; hơi nước đọng ngoài cốc nước lạnh | NC: nước đá tan, nến chảy. ĐĐ: nước→đá. BH: quần áo khô. NT: sương, nước đọng ngoài cốc | |
| b10-006 | mcq | Nước sôi ở bao nhiêu °C (điều kiện thường)? (0 / 50 / 100 / 150) | 100 | |
| b10-007 | truefalse | Khi nước đang sôi, tiếp tục đun thì nhiệt độ tiếp tục tăng. | Sai | Nhiệt độ giữ nguyên khi đang sôi. |
| b10-008 | multi | Cách làm quần áo khô nhanh hơn: phơi chỗ nắng; phơi chỗ gió; gấp gọn vào tủ; trải rộng quần áo | Nắng; gió; trải rộng | Nhiệt độ, gió, diện tích mặt thoáng. |
| b10-009 | mcq | Mô hình nào ứng với thể khí? (Hạt sát nhau, xếp trật tự / Hạt gần nhau, trượt / Hạt xa nhau, chuyển động tự do) | Hạt xa nhau, chuyển động tự do | |
| b10-010 | order | Đun nước đá đến khi sôi, thứ tự: nước đá → nóng chảy → nước lỏng → bay hơi/sôi → hơi nước | như trên | |
| b10-011 | graph | Đồ thị nhiệt độ – thời gian khi đun nước đá. Đoạn nằm ngang ở 0 °C là quá trình gì? | Nóng chảy | Nhiệt độ không đổi khi chuyển thể. |
| b10-012 | mcq | Vì sao ngoài cốc nước đá có giọt nước? (Nước thấm qua thủy tinh / Hơi nước trong không khí ngưng tụ) | Hơi nước ngưng tụ | |

### Bài 11

| ID | Dạng | Câu hỏi | A | G |
|---|---|---|---|---|
| b11-001 | mcq | Oxygen chiếm khoảng bao nhiêu % thể tích không khí? (1 / 21 / 50 / 78) | 21 | |
| b11-002 | mcq | Khí nào chiếm nhiều nhất trong không khí? (Oxygen / Nitrogen / Carbon dioxide) | Nitrogen (~78 %) | |
| b11-003 | fill | Oxygen là chất khí không màu, không mùi, không vị, ___ tan trong nước. (ít / rất dễ) | ít | |
| b11-004 | truefalse | Oxygen là chất có thể cháy được. | Sai | Oxygen duy trì sự cháy, không tự cháy. |
| b11-005 | mcq | Úp cốc lên ngọn nến đang cháy, nến tắt vì sao? (Hết oxygen trong cốc / Cốc lạnh / Cốc nặng) | Hết oxygen | |
| b11-006 | graph | Mô phỏng thí nghiệm nến: nước dâng vào bình khoảng bao nhiêu thể tích? | ~1/5 | Bằng lượng oxygen đã cháy hết. |
| b11-007 | match | Ứng dụng – vai trò: bình thở cho bệnh nhân/hô hấp; đốt nhiên liệu/sự cháy; thợ lặn/hô hấp | theo cặp | |
| b11-008 | multi | Nguyên nhân gây ô nhiễm không khí: khói xe; đốt rơm rạ; trồng cây xanh; khí thải nhà máy | Khói xe; đốt rơm rạ; khí thải nhà máy | |
| b11-009 | match | Biện pháp – lợi ích: trồng cây/lọc bụi, tăng oxygen; xử lý khí thải/giảm khói độc; đi xe buýt/giảm khí thải | theo cặp | |
| b11-010 | order | Sắp xếp theo thành phần giảm dần: nitrogen > oxygen > các khí khác | như trên | |
| b11-011 | mcq | Không khí là chất tinh khiết hay hỗn hợp? | Hỗn hợp | Gồm nhiều khí trộn lẫn. |
| b11-012 | mcq | Vì sao nên trồng nhiều cây xanh? (Nhiều lí do; chọn đáp án đúng nhất) | Cây giúp lọc bụi và cung cấp oxygen | |

### Boss chương 2 (15 câu)
Trộn 5 câu từ mỗi bài, độ khó 2–3, gồm ít nhất: 1 `classify`, 1 `graph`, 1 thí nghiệm nến, 1 `order`.

---

## 8. Minigame (mỗi Unit chọn ≥ 1, làm sau khi lõi hoạt động)

1. **Phân loại nhanh (Bài 9):** thẻ tính chất/hiện tượng bay ra, vuốt trái = vật lí, phải = hóa học. Đúng liên tiếp tăng combo.
2. **Đun đường (Bài 9):** mô phỏng đun đường vs muối trên thìa; người chơi dự đoán rồi quan sát.
3. **Hạt chuyển động (Bài 10):** thanh trượt nhiệt độ, các hạt rung/trượt/bay theo thể; đánh dấu điểm nóng chảy và sôi. Dùng `<canvas>`, giới hạn ~60 hạt cho máy yếu.
4. **Vòng chuyển thể (Bài 10):** kéo mũi tên nối bốn quá trình với hai thể.
5. **Thí nghiệm đốt nến (Bài 11):** chọn cỡ bình, đốt nến, xem nước dâng ~1/5 (bình lớn hơn thì nến cháy lâu hơn nhưng tỉ lệ vẫn thế).
6. **Cứu bầu trời (Bài 11):** thành phố hiện nguồn ô nhiễm, người chơi chọn biện pháp để đưa chỉ số không khí về xanh.

---

## 9. Game hóa (theo phong cách CHEM-SOLVE)

- **XP:** +10/câu đúng, +5 bonus nếu không dùng gợi ý, +20 khi qua nút, +50 khi qua boss.
- **Hearts:** 5 tim, sai 1 câu mất 1 tim; hồi 1 tim mỗi 20 phút hoặc bằng cách ôn thẻ kiến thức.
- **Streak:** tính theo ngày có hoàn thành ≥ 1 nút; lưu local.
- **Mastery từng tag** (vd. `tinh-chat-vat-li`): 0–100 %; tag < 60 % thì gợi ý ôn lại.
- **Ôn tập thông minh:** câu sai được đưa lại sau 1 → 3 → 7 ngày (lặp lại ngắt quãng đơn giản, lưu `nextReview` trong local).
- **Huy hiệu:** "Nhà thám hiểm chất", "Bậc thầy chuyển thể", "Người bảo vệ bầu trời", "Hoàn thành Chương 2".
- Giải thích ngắn hiện sau mỗi câu; sai lỗi hay gặp (`misconception`) thì hiện cảnh báo riêng.

---

## 10. UI/UX

- Mobile-first, chạm to ≥ 44 px, đáp án cách nhau đủ xa; hoạt động tốt khi cầm một tay.
- Mỗi màn chỉ 1 câu; thanh tiến độ trên cùng; nút **Kiểm tra** cố định dưới.
- Thẻ kiến thức có thể lật/vuốt; có nút "nghe đọc" (Web Speech API, tùy chọn).
- Từ điển thuật ngữ: chạm vào từ gạch chân để xem nghĩa.
- Trợ năng: đủ tương phản, không dùng màu là dấu hiệu duy nhất (đúng/sai kèm icon), hỗ trợ giảm chuyển động (`prefers-reduced-motion`).
- Hiệu năng: lazy-load minigame, tối ưu sprite, tránh re-render toàn cây khi trả lời.

---

## 11. Tiêu chí hoàn thành (Definition of Done)

- [ ] 3 bài với đủ 12 nút + 3 boss + boss chương, đọc dữ liệu từ `src/data/grade6`.
- [ ] Đủ 8 dạng câu hỏi trong `QuestionRenderer`, có đúng/sai, giải thích, gợi ý.
- [ ] Tối thiểu 90 câu hỏi (30/bài) + 15 câu boss chương.
- [ ] Lưu tiến độ, XP, tim, streak, mastery vào local; tải lại trang không mất.
- [ ] ≥ 3 minigame chạy mượt trên điện thoại tầm trung (≥ 50 FPS).
- [ ] Không lỗi TypeScript (`tsc --noEmit` sạch), lint sạch.
- [ ] Nội dung tự viết, không chép nguyên văn từ SGK/VietJack.
- [ ] Đối chiếu kiến thức với SGK KNTT lớp 6 trước khi phát hành.

---

## 12. Kế hoạch thực hiện (giao việc cho agent)

**Giai đoạn 1 — Nền tảng dữ liệu**
1. Tạo cấu trúc thư mục ở mục 3 và các kiểu TypeScript ở mục 4.
2. Chuyển nội dung mục 6 thành `lessons/*.ts` (mỗi thẻ ≤ 60 từ).
3. Chuyển bảng mục 7 thành `questions/*.ts`, sau đó tự viết thêm cho đủ 30 câu/bài (cân bằng dạng và độ khó).

**Giai đoạn 2 — Lõi học tập**
4. `SkillTree` + mở khóa nút.
5. `LessonCard` + `QuestionRenderer` (8 dạng) + màn kết quả.
6. `store/progress.ts` (XP, hearts, streak, mastery, review queue) lưu local.

**Giai đoạn 3 — Minigame & hoàn thiện**
7. Làm lần lượt: Phân loại nhanh → Hạt chuyển động → Thí nghiệm đốt nến → còn lại.
8. Áp sprite sheet/asset CHEM-SOLVE, thêm animation Framer Motion, kiểm tra hiệu năng mobile.
9. Kiểm thử thủ công toàn bộ luồng, chạy `tsc` + lint, rà soát chính tả tiếng Việt.

**Quy tắc làm việc:** làm từng giai đoạn, cuối mỗi giai đoạn dừng để tôi kiểm tra; không thêm thư viện nặng nếu không cần; hỏi lại khi kiến thức khoa học có chỗ chưa chắc chắn thay vì tự đoán.
