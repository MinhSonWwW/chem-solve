# CHEM-SOLVE — Project Plan (v2)

> Web luyện **bài tập Hóa học THCS lớp 7–9** theo tinh thần Duolingo: giải từng bước, phản hồi tức thì, minigame, XP/streak.
> File này là **nguồn tham chiếu chính** cho AI agent trong IDE (Antigravity). Agent phải đọc mục 0–3 trước khi viết code.
> Ưu tiên: **MUST** (bắt buộc) · **SHOULD** (nên có) · **COULD** (làm nếu còn thời gian).

---

## 0. Cách dùng với IDE

1. Tạo repo trống, đặt file này ở gốc với tên `PLAN.md`.
2. Đặt 3 sprite sheet gốc vào `art/source/` với tên `sheet1-cards-trays.png`, `sheet2-buttons-stats.png`, `sheet3-reactions.png`.
3. Copy **mục 3 (Quy tắc cho AI agent)** vào file rules/instructions của IDE (ví dụ `AGENTS.md`) để agent nạp ở mọi phiên.
4. Chạy **từng milestone một** (mục 19). Prompt mẫu:

```text
Đọc PLAN.md (mục 0–3 và milestone M0). Lập kế hoạch ngắn rồi thực hiện M0.
Xong thì chạy `npm run typecheck && npm run lint && npm test`, chụp screenshot viewport 390×844,
tóm tắt việc đã làm + giả định đã đặt ra, rồi DỪNG để tôi duyệt trước khi sang M1.
```

5. Khi phải chọn giữa nhiều hướng: ghi quyết định vào `docs/decisions.md` (1–3 dòng/quyết định) rồi tiếp tục, không dừng hỏi vụn vặt.

---

## 1. Tầm nhìn & phạm vi

> **“Biến việc giải bài Hóa học THCS thành một hành trình game tương tác, trong đó mỗi câu trả lời đều dạy người học cách suy nghĩ và mỗi tương tác đều mang DNA của Hóa học.”**

**Công thức:** Hóa THCS 7–9 + bài tập & cách giải + step-by-step + minigame + mascot + motion + sound + XP/streak/achievement + chemistry-lab UI + hiệu năng mobile.

**Learning loop:**

```text
Chọn lớp → chương/bài → chặng
   → Làm bài → phản hồi tức thì
        ├─ Đúng → XP + combo + mascot vui
        └─ Sai  → phân tích lỗi + gợi ý + thử lại
   → Hoàn thành chặng → minigame củng cố
   → XP / streak / achievement → mở khóa chặng tiếp theo
```

**Luồng giải bài chuẩn:** `Đề bài → Phân tích → Dữ kiện → Kiến thức → Bước giải → Kiểm tra → Kết luận`.
Lý thuyết chỉ xuất hiện đúng lúc (công thức cần nhớ, PTHH mẫu, mẹo nhận dạng, lỗi thường gặp). Đây **không** phải web đọc lý thuyết.

**Mỗi bài tập phải trả lời được:** Thuộc dạng nào? Dùng kiến thức/công thức nào? Giải từng bước ra sao?

**Không “đưa đáp án ngay”:** khi học sinh sai, ưu tiên phân tích lỗi + gợi ý trước khi hiện lời giải đầy đủ.

### Non-goals (v1)

- Hóa lớp 6.
- Tài khoản/đăng nhập, backend, đồng bộ đa thiết bị (lưu local, có export/import JSON).
- Bảng xếp hạng, social, thanh toán.
- 3D/WebGL.
- AI chấm bài / chat tự do (v1 chấm bằng checker deterministic).
- Sao chép mascot, logo, artwork, cách đặt tên thành tựu của Duolingo hay app khác — chỉ lấy cảm hứng từ nguyên tắc UX/game feel.

---

## 2. Phạm vi kiến thức (Kết nối tri thức)

**Không tự ý thêm/đổi/bỏ chương–bài.** Dữ liệu curriculum phải cho phép thêm bài mà không sửa code UI.
**Quy ước ID:** bài `g{lớp}-b{số bài 2 chữ số}` (vd `g8-b03`), chặng `g8-b03-n01`, bài tập `g8-b03-calc-001`.

### 2.1. Lớp 7 *(danh sách chưa đầy đủ — user sẽ bổ sung)*

- **Bài 1:** Phương pháp và kĩ năng học tập môn Khoa học tự nhiên
- **Chương 1: Nguyên tử. Sơ lược về bảng tuần hoàn các nguyên tố hóa học**
  - Bài 2: Nguyên tử
  - Bài 3: Nguyên tố hóa học
  - Bài 4: Sơ lược về bảng tuần hoàn các nguyên tố hóa học

### 2.2. Lớp 8

- **Chương 1: Phản ứng hóa học**
  - Bài 2: Phản ứng hóa học
  - Bài 3: Mol và tỉ khối chất khí
  - Bài 4: Dung dịch và nồng độ
  - Bài 5: Định luật bảo toàn khối lượng và phương trình hóa học
  - Bài 6: Tính theo phương trình hóa học
  - Bài 7: Tốc độ phản ứng và chất xúc tác
- **Chương 2: Một số hợp chất thông dụng**
  - Bài 8: Acid
  - Bài 9: Base. Thang pH
  - Bài 10: Oxide
  - Bài 11: Muối
  - Bài 12: Phân bón hóa học

### 2.3. Lớp 9

- **Chương 6: Kim loại. Sự khác nhau cơ bản giữa phi kim và kim loại**
  - Bài 18: Tính chất chung của kim loại
  - Bài 19: Dãy hoạt động hoá học
  - Bài 20: Tách kim loại và việc sử dụng hợp kim
  - Bài 21: Sự khác nhau cơ bản giữa phi kim và kim loại
- **Chương 7: Giới thiệu về chất hữu cơ. Hydrocarbon và nguồn nhiên liệu**
  - Bài 22: Giới thiệu về hợp chất hữu cơ
  - Bài 23: Alkane
  - Bài 24: Alkene
  - Bài 25: Nguồn nhiên liệu
- **Chương 8: Ethylic alcohol và Acetic acid**
  - Bài 26: Ethylic alcohol
  - Bài 27: Acetic acid
- **Chương 9: Lipid. Carbohydrate. Protein. Polymer**
  - Bài 28: Lipid
  - Bài 29: Carbohydrate. Glucose và saccharose
  - Bài 30: Tinh bột và cellulose
  - Bài 31: Protein
  - Bài 32: Polymer
- **Chương 10: Khai thác tài nguyên từ vỏ Trái Đất**
  - Bài 33: Sơ lược về hoá học vỏ Trái Đất và khai thác tài nguyên từ vỏ Trái Đất
  - Bài 34: Khai thác đá vôi. Công nghiệp silicate
  - Bài 35: Khai thác nhiên liệu hoá thạch. Nguồn carbon. Chu trình carbon và sự ấm lên toàn cầu

**Quy mô:** 4 bài (lớp 7, hiện có) + 11 (lớp 8) + 18 (lớp 9) = 33 bài. Mục tiêu MVP ≥ 12 bài tập/bài (~400 bài), dài hạn 20+.

---

## 3. Quy tắc cho AI agent  *(copy sang `AGENTS.md`)*

1. Đọc `PLAN.md` trước khi làm. Chỉ làm **milestone hiện tại**; xong thì báo cáo và **dừng** chờ duyệt.
2. **Không hard-code** nội dung bài tập/câu hỏi/đáp án trong component UI. Nội dung nằm ở `src/content/`, được Zod validate.
3. **Không đổi** danh sách chương/bài ở mục 2.
4. UI chỉ dùng **design tokens + component nền tảng**. Cấm CSS ad-hoc mỗi trang một kiểu; muốn variant mới → thêm vào design system.
5. **Asset:** dùng sprite sheet có sẵn (mục 15). Không vẽ lại/đổi style. Asset mới phải bám `docs/design-bible.md`.
7. **Công thức hóa học** lưu dạng ASCII (`H2SO4`, `Fe^3+`), render qua `<Formula>` — không lưu ký tự subscript Unicode trong data.
8. Mọi thay đổi ở `chem/`, `engine/` phải có **unit test**. Checker mới phải kèm bảng ca biên.
9. Animation chỉ dùng `transform`/`opacity`; tôn trọng `prefers-reduced-motion`; không chạy animation liên tục khi không cần.
10. **Mobile-first:** kiểm tra ở 360×640 và 390×844 trước, rồi tablet/desktop. Không dùng `100vh` (dùng `100dvh`), không dựa vào hover.
11. Thêm dependency > ~30 KB gzip: cần ghi lý do vào `docs/decisions.md`.
12. Bài tập phải là **đề gốc/diễn đạt lại**, không chép nguyên văn SGK/SBT. Tên chất và thuật ngữ theo SGK Kết nối tri thức (acid, base, oxide…).
13. Commit nhỏ, theo Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`).
14. UI copy tiếng Việt, tập trung ở `src/copy/vi.ts`; giọng khích lệ, ngắn gọn, không chê học sinh.
15. Không sao chép mascot/logo/artwork/tên thành tựu của Duolingo hoặc app khác.

---

## 4. Tech stack (quyết định mặc định — đổi được, nhưng phải ghi ADR)

| Hạng mục | Chọn | Lý do |
|---|---|---|
| Framework | **Vite + React + TypeScript (strict)** | SPA tĩnh, nhẹ, không cần SSR/backend |
| Routing | React Router | code-split theo route |
| State | Zustand (store tách: `session`, `progress`, `settings`) | đơn giản, ít boilerplate |
| Styling | Tailwind CSS + CSS variables (tokens) + `cva` cho variants | tokens là nguồn duy nhất cho màu/spacing/radius/shadow/motion |
| Motion | Motion (Framer Motion) + CSS animation | spring + layout transition; Rive/Lottie lazy-load |
| Kéo thả | `@dnd-kit` (pointer + touch + keyboard) **+ tap-to-place** | touch-friendly, a11y |
| Validation | Zod | schema = nguồn sự thật cho type + validate content |
| Lưu trữ | localStorage (settings/XP/streak) + IndexedDB (`idb-keyval`, lịch sử làm bài) qua `ProgressRepository` | dễ đổi sang cloud sau |
| Search | MiniSearch (hoặc Fuse.js) | client-side, lazy index |
| Audio | Howler.js hoặc Web Audio + **audio sprite** | ít request, iOS unlock |
| Font | Nunito (self-host, subset `vietnamese` + `latin`, `font-display: swap`) | hỗ trợ tiếng Việt đầy đủ |
| Test | Vitest + Testing Library; Playwright (viewport mobile) | |
| PWA | vite-plugin-pwa (M9) | offline, precache shell |
| Package manager | npm | |
| Hosting | static (Cloudflare Pages / Vercel / Netlify), SPA fallback | |

**Scripts chuẩn** (`package.json`):

```text
npm run dev               # dev server
npm run build             # production build
npm run typecheck         # tsc --noEmit
npm run lint              # eslint + prettier --check
npm test                  # vitest run
npm run test:e2e          # playwright (mobile viewport)
npm run validate:content  # Zod + kiểm tra hóa học toàn bộ src/content
npm run slice:sprites     # cắt sprite sheet → public/assets/sprites + manifest
```

---

## 5. Cấu trúc thư mục

```text
chem-solve/
├─ PLAN.md  AGENTS.md  .env.example
├─ docs/            decisions.md  design-bible.md
├─ art/
│  ├─ source/       3 sprite sheet gốc (KHÔNG serve trực tiếp)
│  └─ prompts/      prompt + tham số sinh ảnh đã dùng
├─ scripts/         slice-sprites.ts  validate-content.ts  generate-asset.ts
├─ public/assets/   sprites/  mascot/  audio/  fonts/
└─ src/
   ├─ app/          router, providers, layout
   ├─ config/       gamification.ts  review.ts  feature-flags.ts
   ├─ copy/         vi.ts
   ├─ design-system/  tokens.css  components/  motion/
   ├─ chem/         formula  equation  calc  periodic  rich-text   ← thuần TS, không phụ thuộc UI
   ├─ engine/
   │  ├─ exercise/  schema.ts  session-reducer.ts
   │  ├─ checkers/  numeric  formula  text  equation  choice  match  ordering
   │  ├─ solution/  hints.ts  steps.ts  mistakes.ts
   │  ├─ review/    leitner.ts  weak-topics.ts
   │  └─ gamification/  xp.ts  hearts.ts  streak.ts  achievements.ts
   ├─ content/
   │  ├─ curriculum.ts  skills.ts (taxonomy dạng bài)
   │  ├─ kb/        periodic-table.json  ions.json  substances.json  reactions.json  activity-series.json  knowledge.json
   │  ├─ exercises/ g7/  g8/  g9/   (mỗi bài một file JSON, lazy-load)
   │  └─ generators/  (sinh bài tính có đáp án tính bằng code)
   ├─ features/     home  learn  practice  exercise  minigames  daily  progress  profile  search  dev
   ├─ storage/      progress-repository.ts  migrations.ts
   ├─ audio/
   └─ test/         fixtures  e2e
```

---

## 6. Kiến trúc logic & data model

```text
CONTENT DATA (JSON + KB)  →  EXERCISE ENGINE  →  SOLUTION / HINT ENGINE  →  UI / GAME ENGINE  →  PROGRESS / GAMIFICATION
```

Mỗi tầng chỉ phụ thuộc tầng bên trái. `chem/` và `engine/` **không import React**.

### 6.1. Schema bài tập (Zod là nguồn sự thật; type suy ra từ Zod)

```ts
type Grade = 7 | 8 | 9;
type Difficulty = 1 | 2 | 3;                 // dễ | vừa | khó
type RichText = string;                       // markup ở 6.2

interface Exercise {
  id: string;                  // "g8-b03-calc-001"
  lessonId: string;            // "g8-b03"
  skillIds: string[];          // taxonomy dạng bài: "gas-volume-from-mol"
  difficulty: Difficulty;
  prompt: RichText;
  given?: { label: RichText; value: string; unit?: string }[];   // dữ kiện
  find?: { label: RichText; unit?: string };                     // đại lượng cần tìm
  knowledge: string[];         // id trong kb/knowledge.json
  answer: Answer;
  hints: { level: 1 | 2; text: RichText }[];    // 1: gợi mở · 2: nhắc công thức/quy tắc
  steps: SolutionStep[];
  finalSolution: RichText;
  commonMistakes: { id: string; message: RichText; trapAnswers?: string[] }[];
  related?: string[];          // exercise id
  minigameTags?: string[];
  visual?: { sprite: string }; // key trong sprite manifest (vd hiện tượng ↑/↓)
  verify?: { fn: string; args: Record<string, number | string> };  // SHOULD: validator tự tính lại đáp án
}

interface SolutionStep {
  kind: 'identify' | 'given' | 'knowledge' | 'equation' | 'compute' | 'answer' | 'pitfalls';
  title: string;
  body: RichText;
  interactive?: { prompt: string; options: RichText[]; correct: number[] };  // dùng cho chế độ guided
}

type Answer =
  | { kind: 'mcq-single'; options: Option[]; correctId: string }
  | { kind: 'mcq-multi'; options: Option[]; correctIds: string[] }
  | { kind: 'true-false'; statements: { id: string; text: RichText; correct: boolean }[] }
  | { kind: 'number'; value: number; unit?: string; decimals?: number; tolerance?: { abs?: number; rel?: number } }
  | { kind: 'formula'; accepted: string[] }                        // ASCII: "H2SO4", "Fe^3+"
  | { kind: 'text'; accepted: string[]; lenientDiacritics?: boolean }
  | { kind: 'equation'; mode: 'fill-coefficients' | 'build'; reactants: string[]; products: string[];
      coefficients: number[]; condition?: string }
  | { kind: 'match'; pairs: { left: string; right: string }[] }
  | { kind: 'sort'; buckets: { id: string; label: string }[]; items: { id: string; label: string; bucketId: string }[] }
  | { kind: 'ordering'; correctOrder: string[] }
  | { kind: 'formula-builder'; tiles: string[]; accepted: string[] };
```

**Bài mẫu chuẩn (golden sample — mọi bài khác theo khuôn này):**

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

`trapAnswers` = đáp án sai điển hình → tự động hiện đúng lời giải thích lỗi, không cần AI.

### 6.2. Rich text markup (trong mọi chuỗi hiển thị)

| Viết | Hiển thị | Ghi chú |
|---|---|---|
| `[[H2SO4]]` | H₂SO₄ | công thức (render bằng `<sub>`) |
| `[[Fe^3+]]`, `[[SO4^2-]]` | Fe³⁺, SO₄²⁻ | ion, điện tích đúng vị trí |
| `[[CuSO4.5H2O]]` | CuSO₄·5H₂O | muối ngậm nước |
| `[[->]]`, `[[->\|t°,xt]]` | →, → có điều kiện trên mũi tên | PTHH |
| `[[up]]`, `[[down]]` | ↑, ↓ | khí bay ra / kết tủa |
| `**đậm**` | **đậm** | |

Validator tự trích các công thức trong `[[...]]` để đánh index tìm kiếm (mục 13).

### 6.3. Knowledge base dùng chung (`src/content/kb/`)

| File | Nội dung |
|---|---|
| `periodic-table.json` | Z, kí hiệu, tên VN, **nguyên tử khối làm tròn theo SGK** (H=1, C=12, N=14, O=16, Na=23, Mg=24, Al=27, S=32, Cl=35,5, K=39, Ca=40, Fe=56, Cu=64, Zn=65, Ag=108, Ba=137…), nhóm/chu kì, kim loại/phi kim |
| `ions.json` | ion + điện tích + tên (cho Formula Builder) |
| `substances.json` | công thức, tên (VN + tên theo SGK), loại (acid/base/oxide/muối/kim loại/phi kim/hữu cơ), trạng thái, màu, aliases |
| `reactions.json` | PTHH chuẩn, điều kiện, hiện tượng (`↑`/`↓`/đổi màu), lớp/bài liên quan |
| `activity-series.json` | dãy hoạt động hóa học (lớp 9) |
| `knowledge.json` | công thức/quy tắc dùng ở bước “Kiến thức” (`n = m/M`, `V = n×24,79`, `C% = m_ct/m_dd×100%`, `d_A/B = M_A/M_B`…) |

> Hằng số như **24,79 L/mol (25 °C, 1 bar)** phải đối chiếu SGK Kết nối tri thức và nhờ giáo viên xác nhận trước khi chốt.

### 6.4. Quy tắc nội dung

- Đề gốc/diễn đạt lại; không chép nguyên văn SGK/SBT.
- Mỗi bài tập: ≥ 2 hints, ≥ 3 steps, ≥ 1 `commonMistakes` (hoặc ghi rõ lý do bỏ trống).
- Số lưu dạng number (dấu chấm); **hiển thị** dạng dấu phẩy, đơn vị rõ ràng, nhất quán toàn app.
- Mọi PTHH trong content phải **tự cân bằng** (validator kiểm).
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
  exerciseId: string; skillIds: string[]; ts: number; attempts: number;
  correctFirstTry: boolean; hintsUsed: 0 | 1 | 2; revealed: boolean; timeMs: number; mode: 'guided' | 'quick';
}
```

State lưu có `schemaVersion` + migration. Giới hạn lịch sử (vd 2000 attempt gần nhất) để không phình.

---

## 7. Chem core & hệ thống kiểm tra đáp án

### 7.1. `src/chem/` (thuần TS, có test riêng)

- `parseFormula(str)` → cấu trúc `{ element: count }` (hỗ trợ ngoặc `Ca(OH)2`, ion `^2+`, ngậm nước `.`).
- `normalize(str)`: NFKC (chuyển subscript/superscript Unicode về ASCII), bỏ khoảng trắng thừa, chuẩn hóa mũi tên (`→`, `->`, `=`, `⟶`). **Kí hiệu nguyên tố phân biệt hoa/thường** (`Co` ≠ `CO`) — không bao giờ `toLowerCase()` công thức.
- `molarMass(formula)` dùng `periodic-table.json`.
- `parseEquation(str)`, `checkBalance(eq)` → trả **chênh lệch từng nguyên tố** (“vế trái 2 O, vế phải 1 O”) để làm feedback.
- `simplestCoefficients(coefs)`; `renderFormula` / `<Formula>` (có `aria-label` đọc được).

### 7.2. Contract checker

```ts
type Verdict =
  | { status: 'correct' }
  | { status: 'partial'; reason: 'not-simplest' | 'noncanonical-formula' | 'missing-unit'; message: string }
  | { status: 'incorrect'; reason: string; mistakeId?: string; diagnosis?: string };

interface Checker<A extends Answer, I> { check(answer: A, input: I): Verdict }
```

`partial` = hiểu đúng nhưng trình bày chưa chuẩn → **không trừ tim, không tính lần sai**, cho sửa 1 lần.

### 7.3. Quy tắc từng checker

| Checker | Quy tắc |
|---|---|
| **numeric** | Chấp nhận `0,5` và `0.5`; bỏ khoảng trắng; tách số + đơn vị (`0,5 mol`). Sai số theo `decimals` (mặc định ±½ đơn vị chữ số cuối) hoặc `tolerance`. Sai đơn vị → `partial/missing-unit` hoặc `incorrect` kèm giải thích. Khớp `trapAnswers` → gắn `mistakeId`. |
| **formula** | So **cấu trúc** đã parse (không so chuỗi). Đúng thành phần nhưng sai quy ước viết (`OH2`, `ClNa`) → `partial/noncanonical-formula`. Sai chữ hoa/thường → nói rõ. `H2O2` ≠ `H2O`. |
| **text** | Không phân biệt hoa/thường, gộp khoảng trắng; `lenientDiacritics` cho tên tiếng Việt. Danh sách `accepted` gồm cả tên theo SGK lẫn cách gọi phổ biến. |
| **equation** | Parse hai vế; kiểm chất tham gia/sản phẩm (không phụ thuộc thứ tự trong cùng vế), cân bằng nguyên tử. Cân bằng đúng nhưng chưa tối giản → `partial/not-simplest`. Sai → chỉ ra nguyên tố lệch. |
| **choice** | Single/multi/true-false; multi chấm đúng-tuyệt-đối, có thể trả “thiếu 1 đáp án” khi feedback. |
| **match / sort** | Chấm theo cặp/bucket; trả danh sách mục sai để highlight. |
| **ordering** | Chấm theo thứ tự; cho phép hoán đổi các bước được đánh dấu tương đương. |

**Nguyên tắc chung:** không sai chỉ vì khác cách trình bày vô nghĩa; cũng không “đoán” dễ dãi. Mỗi checker có bảng test ≥ 20 ca biên (dấu phẩy/chấm, subscript Unicode, hoa/thường, khoảng trắng, hệ số chưa tối giản, thứ tự chất…).

---

## 8. Giải từng bước, gợi ý, phản hồi

### 8.1. Cấu trúc lời giải (7 bước)

| # | Bước | Nội dung |
|---|---|---|
| 1 | Nhận dạng dạng bài | “Có khối lượng chất, tính lượng chất khác sau phản ứng → tính theo PTHH” |
| 2 | Đọc dữ kiện | tách dữ kiện đã cho và đại lượng cần tìm |
| 3 | Kiến thức cần dùng | đúng công thức/quy tắc liên quan (từ `knowledge.json`) |
| 4 | Phương trình hóa học | viết + cân bằng PTHH nếu cần |
| 5 | Tính toán | từng phép biến đổi |
| 6 | Đáp án | kết quả + đơn vị + kết luận |
| 7 | Lỗi thường gặp | quên đổi đơn vị · sai khối lượng mol · cân bằng sai · sai tỉ lệ mol · nhầm điều kiện |

### 8.2. Hai chế độ làm bài

- **Guided:** học sinh tự làm từng bước nhỏ (chọn dạng bài → chọn dữ kiện → chọn công thức → nhập kết quả) qua `step.interactive`. Mặc định cho bài tính trong Learn path.
- **Quick:** chỉ nhập đáp án, có thang hỗ trợ. Mặc định cho Practice/Review/minigame.

### 8.3. Thang hỗ trợ

`Gợi ý 1` (gợi mở) → `Gợi ý 2` (nhắc công thức/quy tắc) → `Xem bước` (mở dần từng bước) → `Xem lời giải` (toàn bộ).

### 8.4. Luồng khi sai

1. Lần 1 sai: hiện **chẩn đoán lỗi** (khớp `trapAnswers` / diagnosis của checker) + gợi ý dùng hint → thử lại.
2. Tối đa **3 lần**; sau đó (hoặc bấm “Xem lời giải”) hiện lời giải đầy đủ, đánh dấu `revealed`, đưa vào hàng đợi ôn tập.
3. Phản hồi luôn nói **vì sao**, không chỉ “sai rồi”.

---

## 9. Kiểu bài tập & State machine

### 9.1. Catalog kiểu bài

| Nhóm | `answer.kind` | UI | Ghi chú |
|---|---|---|---|
| Trắc nghiệm | `mcq-single`, `mcq-multi`, `true-false` | thẻ chọn | |
| Điền đáp án | `number`, `formula`, `text` | ô nhập + `ChemKeyboard` | số / công thức / tên chất / kí hiệu / sản phẩm phản ứng |
| Kéo thả | `match`, `sort`, `formula-builder` | khay giá ống nghiệm, thẻ nguyên tố | luôn có **tap-to-place** cho touch |
| Phương trình | `equation` (`fill-coefficients` / `build`) | ô hệ số / xếp chất + mũi tên | |
| Thứ tự | `ordering` | danh sách kéo sắp xếp | vd sắp xếp bước giải |
| Bài toán tính | `number` (+ guided steps) | guided/quick | mol, khối lượng, thể tích khí, tỉ khối, nồng độ, tính theo PTHH, acid/base/oxide/muối/kim loại/hữu cơ |
| Nhận biết/hiện tượng | `mcq-*` + `visual` | sprite hiện tượng (màu, kết tủa `↓`, khí `↑`, chỉ thị/pH) | dùng Sheet 3 |

**`ChemKeyboard` (MUST):** bàn phím hóa học trên mobile — kí hiệu nguyên tố hay dùng, chữ số (tự hiện subscript khi gõ sau kí hiệu), `( )`, `+ −` (điện tích), `→ ↑ ↓`, xóa. Ô số dùng `inputMode="decimal"`, font ≥ 16px (tránh iOS tự zoom).

### 9.2. State machine mỗi câu (`sessionReducer` thuần, có test)

```text
UNANSWERED → ANSWERING → CHECKING → CORRECT | PARTIAL | WRONG → FEEDBACK
   WRONG (còn lượt) → ANSWERING        REVEALED → FEEDBACK
   FEEDBACK → NEXT_QUESTION → … → SESSION_COMPLETE
```

Guard bắt buộc:

- Không submit hai lần (khóa nút khi `CHECKING`/`FEEDBACK`).
- Không chuyển câu khi feedback đang chạy.
- Chỉ **một kênh animation** tại một thời điểm (hàng đợi), không chạy chồng.
- UI **suy ra** từ state dữ liệu (một nguồn sự thật); test chuyển trạng thái hợp lệ/không hợp lệ.

---

## 10. Gamification & tiến độ

Mọi con số nằm trong `src/config/gamification.ts` (một chỗ, dễ tinh chỉnh) — **không rải trong code**. Giá trị dưới đây là mặc định đề xuất.

| Cơ chế | Quy tắc mặc định |
|---|---|
| **XP câu hỏi** | đúng lần 1: +10 · lần 2: +6 · lần 3: +3 · xem lời giải: 0 |
| Trừ XP hỗ trợ | dùng Gợi ý 2 hoặc Xem bước: −2 (tối thiểu 3) |
| **Combo** | ≥ 3 đúng liên tiếp: +2 XP/câu · ≥ 5: +5 XP/câu |
| Hoàn thành chặng | +20 (+10 nếu không mất tim) |
| Minigame | theo điểm, tối đa +25 |
| Daily Challenge | +30 |
| **Mục tiêu ngày** | chọn 20 / 40 / 60 XP (mặc định 20) |
| **Hearts** | 5 tim; mất 1 tim mỗi lần check **sai** (không tính `partial`); hồi 1 tim / 20 phút hoặc +1 khi hoàn thành một bài ôn. **Hết tim → vào “Chế độ ôn luyện”** (không tính tim, XP giảm 50%) — không chặn việc học |
| **Streak** | +1 khi trong ngày hoàn thành ≥ 1 chặng **hoặc** Daily Challenge; ngày theo giờ thiết bị. Streak freeze: COULD |
| **Level** | `xpToReach(n) = 50 × n × (n − 1)` (L2=100, L3=300, L4=600…) |
| **Mở khóa** | Learn: chặng mở khi chặng trước đạt ≥ 70% đúng (không `revealed`) hoặc hoàn thành; chương sau mở khi xong bài cuối chương trước. **Practice không khóa** (có công tắc “khóa theo tiến độ”) |

### Achievement

Định nghĩa dạng dữ liệu (`achievements.ts`: id, tên, điều kiện trên thống kê, icon). Cần ≥ 8 thành tựu MVP, ví dụ:

- **Cân bằng bậc thầy** — cân bằng đúng lần 1 nhiều PTHH.
- **Chiến binh Mol** — nhiều bài mol/khối lượng/thể tích đúng.
- **Chuyên gia Acid–Base** — hoàn thành nhóm bài acid/base/pH.
- **Thợ săn phương trình** — hoàn thành nhiều bài Reaction/Equation.

Tên thành tựu phải **độc quyền của CHEM-SOLVE**, không mượn cách đặt tên của app khác.

### Visual mapping

| Cơ chế | Visual chính |
|---|---|
| Streak | ngọn lửa **đèn cồn** |
| Hearts | **ống nghiệm** nhỏ chứa dung dịch |
| XP | **tinh thể muối / lục giác** hóa học |
| Progress | **ống đong / pipet** có vạch chia và mức chất lỏng |
| Milestone | **flask** (Sheet 3) |

---

## 11. Minigame

Mỗi minigame **củng cố một kỹ năng Hóa cụ thể**, khai báo `skillIds`, lấy dữ liệu từ KB/exercises (không hard-code). Dùng chung `MinigameShell` (timer, điểm, XP, kết thúc vòng, tim tắt).

| Game | Kỹ năng | Tương tác | Dữ liệu |
|---|---|---|---|
| **Match** | nhận loại hợp chất/tính chất (HCl↔Acid, NaOH↔Base, CO₂↔Oxide, NaCl↔Muối) | ghép đôi | `substances.json` |
| **Formula Builder** | viết công thức đúng từ ion/kí hiệu | kéo ion vào khay | `ions.json` |
| **Equation Balance** | cân bằng PTHH | điền hệ số | `reactions.json` + balance checker |
| **Reaction Builder** | chất tham gia + sản phẩm + mũi tên + điều kiện | chọn/kéo thẻ | `reactions.json` |
| **Sort** | phân loại acid/base/oxide/muối/kim loại/phi kim/hữu cơ | kéo vào nhóm | `substances.json` |
| **True / False** | nhận định nhanh | vuốt/nhấn | exercises `true-false` |
| **Speed Challenge** | tốc độ + chính xác | 60 giây, câu ngắn | exercises ngắn |
| **Daily Challenge** | ôn tổng hợp | 5 câu/ngày, chọn theo seed ngày + chủ đề yếu, gắn streak | exercises |
| **Review Game** | ôn câu từng sai | lấy từ review queue (M7) | attempts |

---

## 12. Màn hình & routes

| Route | Màn hình | Nội dung chính |
|---|---|---|
| `/` | **Home** | học hôm nay, tiếp tục chặng dở, Daily Challenge, streak, XP, mục tiêu ngày |
| `/learn`, `/learn/:grade` | **Learn / Path** | lớp 7/8/9 → chương → bài → **chặng** (node, ~6–8 câu/chặng), khóa/mở theo tiến độ |
| `/practice` | **Practice** | chọn lớp → chương → dạng bài → độ khó → làm bài |
| `/play/:lessonId/:nodeId` | **Exercise** | màn hình tập trung một câu/bài + quá trình giải |
| `/games`, `/games/:gameId` | **Minigames** | kho minigame |
| `/daily` | **Daily Challenge** | chuỗi bài ngắn theo ngày |
| `/progress` | **Progress** | XP, streak, độ chính xác, số bài, dạng bài mạnh/yếu, chủ đề cần ôn |
| `/profile` | **Profile** | mascot/avatar, level, achievement, thống kê, cài đặt âm thanh/animation, export/import |
| `/search` | **Search** | mục 13 |
| `/dev/design-system` | Gallery (chỉ dev) | mọi component × state |

Mọi màn hình phải có **loading / empty / error state** (empty dùng mascot).

### Bố cục màn Exercise (mobile-first)

- **Top bar:** nút × (hỏi xác nhận khi thoát) · progress ống đong · số tim.
- **Vùng đề:** khung Erlenmeyer chứa đề; chip *Dữ kiện* / *Cần tìm*; `visual` nếu có.
- **Vùng trả lời:** theo `answer.kind`.
- **Thanh dưới (sticky, chừa safe-area):** `Gợi ý` · `KIỂM TRA` / `TIẾP TỤC`. Không bị bàn phím ảo che (dùng `visualViewport`).
- **Feedback sheet** trượt từ dưới: xanh = đúng · vàng = gần đúng · đỏ = sai; kèm mascot + giải thích + nút hành động.

---

## 13. Search & Review

### Tìm kiếm

- Tìm theo: tên chất, công thức, phương trình, dạng bài, chương, lớp.
- Chuẩn hóa: không phân biệt dấu/hoa thường cho tiếng Việt; công thức khớp không phân biệt hoa/thường ở bước tìm (`naoh` → `NaOH`).
- Index xây từ `substances`, `reactions`, `skills`, bài học, và các công thức trích tự động từ `[[...]]` trong exercises.
- `NaOH` trả về: bài tập có NaOH · phản ứng liên quan · dạng bài liên quan · minigame ôn tập. Kết quả nhóm theo loại.

### Review engine (`engine/review/`)

- **Leitner 5 hộp**, khoảng cách 1 · 2 · 4 · 7 · 14 ngày. Đúng lần 1 → lên hộp; sai hoặc `revealed` → về hộp 1.
- **Weak-topic:** `skillId` có ≥ 5 lần làm gần nhất và độ chính xác < 70%.
- **Bài tương tự:** cùng `skillIds`, độ khó ±1, chưa làm gần đây; ưu tiên sinh mới từ `generators/`.
- Ưu tiên đưa lại: câu sai · dạng bài độ chính xác thấp · kiến thức lâu chưa ôn · bài tương tự câu từng sai.
- Hàng đợi ôn hằng ngày giới hạn (mặc định 10 câu) để không gây quá tải.

---

## 14. Visual direction & Design System

**Concept:** *Digital Chemistry Lab + Playful Learning Game.* Nhìn vào phải nhận ra ngay là **Hóa học THCS**, không phải web học Tiếng Anh hay Toán.

**DNA thị giác:** bình Erlenmeyer · ống nghiệm · giá ống nghiệm · ống đong/pipet · nguyên tử · liên kết hóa học · hexagon/vòng phân tử · kết tủa · khí bay lên · chất chỉ thị pH · đèn cồn · tinh thể.

**Phong cách:** 2D vector · flat có chiều sâu vừa phải · chunky shapes · viền rõ · màu tươi, tương phản tốt · bo góc nhưng không biến mọi thứ thành capsule · vui, giáo dục, hiện đại. **Tránh:** 3D/nhựa giả, lạm dụng gradient/blur/glassmorphism, giao diện dashboard/admin generic.

**Typography:** Nunito (hoặc Quicksand) hỗ trợ tiếng Việt đầy đủ. Công thức luôn render qua `<Formula>` (`<sub>`/`<sup>`), không phụ thuộc glyph Unicode của font.

### Design tokens (`tokens.css`, **trích từ 3 sprite sheet — không tự bịa palette**)

colors (kèm cặp text/background đạt WCAG AA) · typography scale · spacing · radius · border · shadow (bao gồm “đáy dày” cho chunky) · motion duration · easing/spring presets · z-index · breakpoints.

### Component nền tảng (dùng lại, không biến thể ngẫu hứng)

Button · Card · Progress · XP · Heart/Life · Streak · Badge · Question · Answer · Hint · FeedbackSheet · Mascot · Modal · Toast · Formula · ChemKeyboard · Sprite.

Mọi component hiển thị đủ state trong `/dev/design-system`: default / hover / pressed / focus / disabled / loading / error.

---

## 15. Asset: sprite sheet, mascot, sinh ảnh

### 15.1. Ba sprite sheet đã có (asset chính thức của UI)

| Sheet | Gồm | Dùng cho |
|---|---|---|
| **1 — Thẻ bài tập & khay kéo thả** | khung câu hỏi Erlenmeyer · ô thẻ nguyên tố kiểu bảng tuần hoàn · khung lục giác phân tử · khay giá ống nghiệm · connector `+`, liên kết đơn, mũi tên phản ứng | đề bài, thẻ `H₂`/`O₂`/`Fe`/`Cu`, kéo thả, xây công thức, xây phương trình |
| **2 — Nút bấm & chỉ số game** | chunky push buttons · frame life ống nghiệm · streak đèn cồn · progress ống đong/pipet · XP tinh thể | `TIẾP TỤC`, `KIỂM TRA`, `TRỘN CHẤT`, health, streak, progress, XP/reward |
| **3 — Trạng thái chất & hiệu ứng phản ứng** | khí `↑` · kết tủa `↓` · giọt chỉ thị pH · puff/smoke · milestone flask · molecular connection nodes | hiện tượng, nhận biết chất, feedback phản ứng, animation, badge/milestone |

### 15.2. Pipeline tích hợp (M1)

1. Agent **xem trực tiếp** từng sheet, xác định vùng từng sprite. Nếu nền trong suốt → tách bằng phân tích alpha (connected components); nếu nền đặc → báo user (cần xuất lại nền trong suốt hoặc cung cấp lưới cắt).
2. `npm run slice:sprites` xuất từng sprite ra `public/assets/sprites/*.webp` (kèm `@2x` nếu cần) và `manifest.json`.
3. Component `<Sprite name="btn-primary" />` typed theo manifest; **giữ vùng an toàn** (padding) để không lem viền; giữ đúng tỉ lệ.
4. Mặc định dùng đúng sprite. Chỉ dựng lại bằng CSS/SVG khi phần tử phải co giãn (vd nút theo chiều rộng) và phải khớp sprite gốc.

```json
{
  "sheet": "sheet2-buttons-stats",
  "sprites": {
    "btn-primary": { "file": "btn-primary.webp", "w": 320, "h": 96, "src": [0, 0, 320, 96], "safe": 8 }
  }
}
```

**Yêu cầu:** không vẽ lại ngẫu hứng nếu đã có asset phù hợp; không đổi style giữa màn hình; asset mới phải bám art direction hiện có.

### 15.3. Mascot

Nhân vật **riêng** của CHEM-SOLVE (chưa có concept — xem mục 20).

- **Trạng thái:** idle · happy · thinking · correct · wrong · surprised · celebrating · level-up · encouraging.
- **Vai trò:** phản hồi đúng/sai · hướng dẫn · gợi ý · chúc mừng · empty state · hỗ trợ Daily Challenge · màn hình hoàn thành.
- **Triển khai theo lớp:** `<Mascot state="…" />` với interface cố định. M1 dùng ảnh tĩnh/SVG theo state; M8 nâng lên **Rive** (state machine) **khi đã có file `.riv`** do user/designer cung cấp (AI agent không tự tạo được `.riv`). Rive runtime chỉ lazy-load khi cần.

### 15.4. Sinh ảnh bằng Image API (COULD, có kiểm soát)

- Chạy bằng **script offline/server-side** (`scripts/generate-asset.ts`), key trong `.env`; **không** gọi từ frontend.
- Quy trình: đọc nội dung bài → xác định cần minh họa gì → tạo prompt bám `docs/design-bible.md` → gọi API → lưu vào `art/`/`public/assets` → **user duyệt** → mới gắn vào màn hình. Lưu prompt/tham số vào `art/prompts/` để tái lập.
- **Design Bible** (`docs/design-bible.md`, tạo ở M1) cố định: style vẽ · bảng màu · tỉ lệ nhân vật · nét viền · ánh sáng · biểu cảm · độ chi tiết · nền trong suốt · kích thước asset. Mục tiêu: 50–100 asset vẫn nhìn như một bộ.

---

## 16. Animation, game feel, sound

### 16.1. Công cụ

CSS animation cho hiệu ứng nhỏ · Motion (Framer Motion) cho UI transition/layout · Rive cho mascot khi cần tương tác sâu · Lottie/SVG cho reward nhẹ. Preset dùng chung ở `design-system/motion/presets.ts`:

```ts
export const spring = {
  soft:   { type: 'spring', stiffness: 400, damping: 32 },
  bouncy: { type: 'spring', stiffness: 500, damping: 18 },   // vừa phải, không lố
};
```

### 16.2. Chunky button

Mặt trên rõ · đáy dày (solid shadow) · hover nhẹ trên desktop · **pressed state trên mọi thiết bị** (`translateY` khi nhấn, dùng `:active` + class cho touch) · vùng bấm ≥ 44×44 px.

### 16.3. Micro-interactions

| Đúng | Sai |
|---|---|
| checkmark · bounce nhẹ · XP counter tăng · progress fill · particle nhỏ | shake nhẹ · visual lỗi rõ ràng · mascot đổi biểu cảm · gợi mở hint |

Không chỉ dựa vào màu: luôn kèm icon/chữ (đúng ✓ / sai ✗).

### 16.4. Hiệu ứng phản ứng hóa học (gắn với kiến thức, không trang trí)

| Nội dung | Animation |
|---|---|
| `↑` khí | bọt/khí bay lên (≤ 12 phần tử) |
| `↓` kết tủa | hạt lắng xuống đáy |
| Mức chất lỏng | ống đong tăng/giảm |
| Chỉ thị | giọt đổi màu (Sheet 3) |
| Nhẹ | bong bóng/khói khi thích hợp |

Effect chạy **một lần rồi dừng**, tạm dừng khi ngoài viewport; ≤ 12 phần tử animate đồng thời.

### 16.5. Sound

- Nhóm: click/select · drag/drop · correct · wrong · check/submit · XP/reward · streak · level-up · chemical bubbling · gas hiss · completion.
- Ngắn, phản hồi nhanh, volume mặc định ~50%, **có công tắc tắt**, không tự phát âm dài, không làm chậm thao tác.
- Gộp thành **một audio sprite**; preload chỉ click/correct/wrong, còn lại lazy. iOS: mở khóa audio ở lần chạm đầu tiên.

---

## 17. Responsive, accessibility, performance

### 17.1. Responsive & touch

Thiết kế từ đầu cho điện thoại, tablet, laptop, desktop. Vùng bấm đủ lớn; mọi kéo thả có **tap-to-place**; không dựa vào hover (tooltip chỉ là phần thêm); có pressed state trên mobile; chừa safe-area; dùng `dvh`.

### 17.2. Accessibility

- WCAG AA: contrast ≥ 4.5:1 cho text; focus ring rõ; điều hướng bàn phím (kể cả kéo thả qua keyboard sensor).
- `aria-live` cho feedback đúng/sai; công thức có `aria-label`; không truyền đạt chỉ bằng màu.
- `prefers-reduced-motion`: tắt spring/particle, giữ chuyển cảnh tối giản; có công tắc trong Profile.

### 17.3. Performance (ưu tiên: mượt trên điện thoại)

**Nguyên tắc:** animate `transform`/`opacity` · hạn chế paint/reflow lớn · lazy-load asset ngoài viewport · không mount hàng trăm animation · không WebGL/3D · sprite tối ưu (WebP) · âm thanh lazy/precache hợp lý · dữ liệu tải theo bài/route · không animation chạy nền vô ích. **Nếu hiệu ứng đẹp nhưng làm mobile lag → giảm hoặc bỏ.**

**Ngân sách (kiểm ở M9, theo dõi từ M3):**

| Chỉ số | Mục tiêu |
|---|---|
| JS route đầu tiên | ≤ 200 KB gzip |
| Ảnh/sprite tải ban đầu | ≤ 300 KB |
| JSON một bài | ≤ 60 KB (lazy) |
| Lighthouse mobile | Performance ≥ 90 · Accessibility ≥ 95 (Home, Exercise) |
| Phản hồi từ KIỂM TRA → feedback | < 100 ms cảm nhận được |
| Frame rate | ~60 fps khi CPU throttle 4× (giả lập Android tầm trung) |

---

## 18. Testing & Definition of Done

### 18.1. Tầng test

| Tầng | Công cụ | Phạm vi |
|---|---|---|
| Unit | Vitest | `chem/`, `checkers/`, `session-reducer`, `xp/hearts/streak`, `leitner`, generators — **coverage ≥ 90%** cho `chem/` + `checkers/` |
| Content | `npm run validate:content` | Zod schema · id duy nhất · đủ hints/steps/mistakes · PTHH tự cân bằng · `verify` khớp đáp án · KB tham chiếu tồn tại · công thức parse được |
| Component | Testing Library | component nền tảng + từng kiểu bài |
| E2E | Playwright (viewport 390×844) | luồng chính: chọn bài → làm → sai → gợi ý → đúng → hoàn thành chặng → XP/streak lưu |
| Thủ công | checklist mục 18.3 | cảm giác game, thiết bị thật |

### 18.2. Definition of Done — mỗi tính năng

- [ ] Hoạt động đúng, có test tương ứng; `typecheck`, `lint`, `test`, `validate:content` đều xanh.
- [ ] Responsive (360×640 → desktop), hỗ trợ touch, không phụ thuộc hover.
- [ ] Có loading/error/empty state khi cần.
- [ ] Có feedback tương tác; animation không lag (đã thử CPU throttle), tôn trọng reduced-motion.
- [ ] Dùng đúng Design System và asset/visual language; không CSS ngoài tokens.
- [ ] Không phá màn hình khác (smoke e2e xanh).
- [ ] Có dữ liệu mẫu để kiểm thử.
- [ ] Không vượt ngân sách performance mục 17.3.

### 18.3. Checklist QA nội dung (người review)

- [ ] Kiến thức đúng chương trình; số liệu/hằng số khớp SGK.
- [ ] Công thức, ion, điện tích, `↑`/`↓`, điều kiện phản ứng hiển thị đúng.
- [ ] Đáp án chấp nhận hợp lý (không quá chặt, không quá dễ dãi).
- [ ] Hint không lộ đáp án; lời giải đủ bước; lỗi thường gặp thực tế.
- [ ] Đề không chép nguyên văn SGK/SBT.

---

## 19. Milestones

> Mỗi milestone: làm → chạy đủ lệnh kiểm tra → screenshot mobile → **báo cáo + dừng chờ duyệt**. M6 (nội dung) có thể chạy song song với M4–M5 theo từng bài.

### M0 — Scaffold *(MUST)*

- [ ] Vite + React + TS strict, ESLint, Prettier, Vitest, Playwright, alias `@/`.
- [ ] Cấu trúc thư mục mục 5; scripts chuẩn mục 4.
- [ ] `AGENTS.md` (từ mục 3), `docs/decisions.md`, `.env.example`, `.gitignore` (có `.env`).
- [ ] Router skeleton cho mọi route mục 12 (trang placeholder).
- [ ] Font Nunito self-host; viewport meta; `100dvh`; safe-area.

**Nghiệm thu:** `npm run dev` chạy; `typecheck/lint/test/build` xanh; điều hướng mọi route được.

### M1 — Design System & Assets *(MUST)*

- [ ] `slice:sprites` → `public/assets/sprites` + `manifest.json` + `<Sprite/>` typed (mục 15.2).
- [ ] Trích tokens từ 3 sheet → `tokens.css` + Tailwind theme; viết `docs/design-bible.md`.
- [ ] Component: Button (chunky), Card, Progress (ống đong), Heart, Streak, XPBadge, Badge, Modal, Toast, Hint, FeedbackSheet, Mascot (tĩnh, 9 state), Formula, ChemKeyboard (khung).
- [ ] Motion presets + hook `useReducedMotion`.
- [ ] `/dev/design-system` gallery.

**Nghiệm thu:** gallery đủ component × state; không style ngoài tokens; pressed state hoạt động trên touch; contrast AA; sprite cắt đúng, không lem viền.

### M2 — Chem core & Exercise engine *(MUST)*

- [ ] `chem/`: `parseFormula`, `normalize`, `molarMass`, `parseEquation`, `checkBalance`, `<Formula>`.
- [ ] KB seed: `periodic-table` (nguyên tử khối SGK), `ions`, `substances` (≥ 60 chất lớp 8–9 phổ biến), `knowledge`.
- [ ] Zod schema `Exercise`/`Answer` + `validate-content`.
- [ ] Toàn bộ checker mục 7 + bảng test ca biên.
- [ ] `sessionReducer` (mục 9.2) + test; engine hint/steps/mistake (mục 8).

**Nghiệm thu:** coverage `chem/` + `checkers/` ≥ 90%; validator bắt được exercise sai (có test âm tính); `checkBalance` chỉ đúng nguyên tố lệch.

### M3 — Vertical slice: Lớp 8 · Bài 3 (Mol và tỉ khối chất khí) *(MUST)*

- [ ] ≥ 12 bài gốc, dùng ≥ 6 kiểu (mcq, true-false, number, formula, match, sort/ordering), trong đó ≥ 4 bài tính có chế độ guided.
- [ ] Màn Exercise hoàn chỉnh: guided/quick, thang hỗ trợ, feedback sheet, màn hoàn thành chặng.
- [ ] XP + hearts cơ bản; lưu tiến độ qua `ProgressRepository`.
- [ ] Touch: dnd-kit + tap-to-place; `ChemKeyboard` dùng được; loading/error/empty.

**Nghiệm thu:** Playwright (mobile) chơi hết một chặng — sai 1 câu → nhận chẩn đoán lỗi → thử lại → hoàn thành; reload vẫn giữ tiến độ. **Dừng để user duyệt “game feel” trước khi mở rộng.**

### M4 — Learning path & Gamification *(MUST)*

- [ ] `curriculum.ts` đủ 3 lớp theo mục 2 (chặng chưa có nội dung hiển thị “Sắp có”).
- [ ] Home, Learn path (node + khóa/mở), Practice selector.
- [ ] Streak (đèn cồn), combo, mục tiêu ngày, level, ≥ 8 achievement; Progress & Profile; export/import JSON.
- [ ] Toàn bộ số liệu ở `config/gamification.ts`.

**Nghiệm thu:** luồng Home → Learn → chặng → XP/streak cập nhật → mở khóa chặng kế; hết tim vào được Chế độ ôn luyện; export rồi import khôi phục đúng.

### M5 — Minigames *(MUST: Match, Formula Builder, Equation Balance, Sort, True/False · SHOULD: Reaction Builder, Speed, Daily)*

- [ ] `MinigameShell` + các game mục 11 (trừ Review Game).
- [ ] Mỗi game: dữ liệu từ KB, khai báo `skillIds`, unit test luật chấm/điểm.

**Nghiệm thu:** mỗi game chơi trọn vòng trên mobile; XP ghi nhận; không hard-code nội dung.

### M6 — Nội dung lớp 7–9 *(MUST, chạy song song)*

- [ ] Taxonomy `skills.ts` theo từng bài.
- [ ] Nội dung ≥ 12 bài tập/bài, trộn nhiều kiểu; `commonMistakes` thực tế.
- [ ] `generators/` cho dạng tính: mol, khối lượng, thể tích khí, tỉ khối, nồng độ (C%, CM), tính theo PTHH đơn giản.
- [ ] `reactions.json` đủ phản ứng theo chương; `activity-series.json`.
- [ ] QA nội dung theo mục 18.3.

**Nghiệm thu:** `validate-content` xanh; mọi PTHH cân bằng; báo cáo coverage số bài tập theo bài/kiểu/độ khó.

### M7 — Review & Personalization *(SHOULD)*

- [ ] Leitner, weak-topic detection, bài tương tự, daily review queue, Review Game.
- [ ] Search (mục 13) với chuẩn hóa dấu/công thức.

**Nghiệm thu:** câu sai xuất hiện lại đúng lịch; tìm `naoh` ra bài/phản ứng/dạng bài/minigame liên quan.

### M8 — Mascot, Motion & Sound *(SHOULD)*

- [ ] Mascot 9 state đầy đủ; nâng lên Rive nếu đã có `.riv`.
- [ ] Reward animation, hiệu ứng phản ứng (mục 16.4), micro-interactions.
- [ ] Audio sprite + công tắc âm thanh; mọi thứ tôn trọng reduced-motion.

**Nghiệm thu:** không tụt fps khi CPU throttle 4×; tắt được âm thanh/animation; không animation chạy nền.

### M9 — Polish & Release *(MUST)*

- [ ] Tối ưu mobile, asset, lazy-load; profiling animation.
- [ ] Audit a11y; QA toàn bộ flow trên thiết bị thật.
- [ ] PWA (offline shell, cache asset); deploy static.
- [ ] Đạt ngân sách mục 17.3.

**Nghiệm thu:** Lighthouse mobile đạt mục tiêu; e2e xanh; checklist DoD mục 18.2 cho toàn bộ tính năng.

---

## 20. Rủi ro & việc cần user cung cấp

| # | Vấn đề | Cách xử lý |
|---|---|---|
| 1 | **Độ chính xác hóa học** của nội dung do AI viết | validator tự động + generators + giáo viên review trước khi phát hành |
| 2 | **Bản quyền nội dung** (SGK/SBT) | viết đề gốc/diễn đạt lại; chỉ bám mục tiêu kiến thức |
| 3 | **Sprite sheet có thể chưa nền trong suốt / chưa có lưới cắt** | agent kiểm tra ở M1; nếu không tách được → user xuất lại hoặc đưa tọa độ |
| 4 | **Mascot chưa có concept** | user chọn ý tưởng (tên, hình dạng, tính cách) trước M1; agent chỉ đề xuất brief, không tự chốt |
| 5 | **Rive** cần file `.riv` | user/designer cung cấp; nếu không, giữ mascot dạng ảnh/SVG tĩnh |
| 6 | **Danh sách lớp 7 chưa đủ** | user bổ sung; cấu trúc dữ liệu mở rộng được |
| 7 | Cơ chế **hearts** có thể gây nản với học sinh yếu | mặc định có Chế độ ôn luyện; thử với người dùng thật rồi chỉnh `config/gamification.ts` |
| 8 | **Hằng số/quy ước** (24,79 L/mol, nguyên tử khối làm tròn, tên gọi acid/base…) | đối chiếu SGK Kết nối tri thức; ghi nguồn vào `knowledge.json` |
| 9 | Không có tài khoản → mất tiến độ khi xóa dữ liệu trình duyệt | export/import JSON (M4); cân nhắc cloud sync ở v2 qua `ProgressRepository` |

**User cung cấp trước khi bắt đầu:** (1) 3 sprite sheet gốc, (2) quyết định concept mascot, (3) danh sách lớp 7 còn lại (nếu có), (4) hosting/domain dự kiến, (5) người review nội dung Hóa (nếu có).
