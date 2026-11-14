# Nhật ký quyết định kiến trúc (Architecture Decision Records - ADR)

File này ghi lại các quyết định kỹ thuật quan trọng của CHEM-SOLVE theo tinh thần ngắn gọn (1–3 dòng/quyết định).

---

## ADR 001: Khởi tạo Tech Stack
- **Quyết định**: Sử dụng Vite + React 19 + TypeScript strict mode, Tailwind CSS v4, Zustand cho state, Zod cho content validation.
- **Lý do**: Đạt hiệu năng cao nhất trên mobile web, tối ưu bundle size, không cần backend cho phiên bản v1, validation chặt chẽ bằng Zod.
- **Ngày**: 2026-09-20.

## ADR 002: Kiến trúc Thư mục Feature-Folder
- **Quyết định**: Áp dụng mô hình cấu trúc `bulletproof-react` kết hợp với sơ đồ module trong `PLAN.md` (phân chia `src/features/*`, `src/chem/`, `src/engine/`, `src/design-system/`).
- **Lý do**: Tách biệt hoàn toàn logic Hóa học thuần túy (`src/chem`) khỏi giao diện React UI, giúp dễ dàng unit test và mở rộng số lượng bài học mà không gây phình component.
- **Ngày**: 2026-09-20.

## ADR 003: Quản lý Animation & Motion
- **Quyết định**: Dùng `motion` (Framer Motion v12) và CSS variables/transform, tôn trọng `prefers-reduced-motion`.
- **Lý do**: Đảm bảo 60fps trên thiết bị di động, chỉ chạy hiệu ứng khi cần thiết, hỗ trợ đầy đủ accessibility.
- **Ngày**: 2026-09-20.

## ADR 004: Tích hợp KaTeX render công thức Toán - Lý - Hóa
- **Quyết định**: Cài đặt thư viện `katex` để render chính xác tất cả các ký hiệu, biểu thức toán học và vật lý định lượng ($W_đ = \frac{1}{2}mv^2$, định luật Ohm, máy biến thế, số mũ, phân số, chỉ số dưới).
- **Lý do**: Khắc phục triệt để lỗi hiển thị raw LaTeX dạng `$W_đ$`, `$\frac{1}{2}$`, đem lại giao diện công thức chuẩn sách giáo khoa, tải siêu nhanh và nhẹ hơn MathJax.
- **Ngày**: 2026-11-01.

## ADR 005: Backend cho Chế độ Giáo viên — Cloudflare Pages Functions + D1
- **Quyết định**: API lớp học chạy trên Cloudflare Pages Functions cùng project Pages, dữ liệu lưu ở Cloudflare D1 (SQLite). Không thêm dependency phía client (chỉ dùng `fetch`); phía server dùng lại `zod` có sẵn.
- **Lý do**: Web đã host trên Cloudflare Pages nên không cần server riêng; D1 có gói miễn phí đủ cho quy mô trường học; dữ liệu chỉ cần quan hệ đơn giản (lớp – học sinh – bài giao – kết quả).
- **Quyền riêng tư**: Học sinh không cần email hay tài khoản, chỉ nhập mã lớp + tên hiển thị; server chỉ lưu SHA-256 của token. Giáo viên xác thực bằng access token Google (kiểm tra `aud` khớp client id trong `GOOGLE_CLIENT_IDS`, email đã xác minh). Rời lớp/xóa học sinh/xóa lớp sẽ xóa luôn kết quả liên quan.
- **Offline**: Kết quả được xếp hàng trong `localStorage` và gửi lại khi có mạng; `report_id` duy nhất giúp gửi lặp không bị đếm trùng.
- **Ngày**: 2026-11-14.

## ADR 006: Bộ câu hỏi giáo viên tự soạn dùng chung cấu trúc bài tập của web
- **Quyết định**: Câu hỏi của thầy cô lưu dạng `{ đề, đáp án (AnswerSchema có sẵn), gợi ý, lời giải }` trong bảng D1 `exercise_sets`; khi học sinh làm, `questionToExercise` (src/content/schema/teacherSet.ts) đổi sang `Exercise` để dùng lại màn làm bài, bộ chấm điểm và gợi ý hiện có. Bài giao trỏ tới bộ câu hỏi bằng mã giả `set-<id>`.
- **Lý do**: Hỗ trợ đủ 11 dạng bài mà không viết thêm bộ chấm/giao diện làm bài; một schema zod dùng chung cho web và API (kiểm tra ngữ nghĩa bằng tiếng Việt: chưa chọn đáp án đúng, phương án trùng, thẻ không ghép được công thức…).
- **Tim**: Bài được giao không trừ tim (`noHeartLoss` trong phiên), nhưng vẫn ghi nhận số lần thử để giáo viên phân tích câu sai.
- **Ngày**: 2026-11-14.

## ADR 007: Ngân hàng luyện tập theo mục (practice banks)
- **Quyết định**: Mỗi bài có file `src/content/practice/gN/<lessonId>.json` (Zod: `PracticeBankSchema`) chia bài thành các mục luyện; mỗi mục gồm id câu cũ của bài + câu luyện tập dạng gọn (cùng cấu trúc câu hỏi tự soạn của giáo viên, chuyển thành `Exercise` bằng `buildExerciseFromQuestion`) + bộ sinh số liệu tuỳ chọn. Lượt luyện: `/play/<lessonId>/practice-<mục>?mode=practice`.
- **Lý do**: Luyện lại y nguyên 4–6 câu của một chặng gây chán; mục ngắn một nội dung giúp học sinh biết mình yếu chỗ nào. Không đổi danh sách chương/bài (PLAN mục 2); id câu luyện tập nằm trong bài nên báo cáo giáo viên, sổ tay câu sai vẫn hoạt động.
- **Hồi tim**: chỉ khi đúng ≥ 75 % và mỗi mục một lần/ngày, chống "cày" một lượt dễ.
- **Ngày**: 2026-11-14.

