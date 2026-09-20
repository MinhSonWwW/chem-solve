# Quy tắc cho AI agent (Chem-Solve)

1. Đọc `PLAN.md` trước khi làm. Chỉ làm **milestone hiện tại**; xong thì báo cáo và **dừng** chờ duyệt.
2. **Không hard-code** nội dung bài tập/câu hỏi/đáp án trong component UI. Nội dung nằm ở `src/content/`, được Zod validate.
3. **Không đổi** danh sách chương/bài ở mục 2 của `PLAN.md`.
4. UI chỉ dùng **design tokens + component nền tảng**. Cấm CSS ad-hoc mỗi trang một kiểu; muốn variant mới → thêm vào design system.
5. **Asset:** dùng sprite sheet có sẵn. Không vẽ lại/đổi style. Asset mới phải bám `docs/design-bible.md`.
7. **Công thức hóa học** lưu dạng ASCII (`H2SO4`, `Fe^3+`), render qua `<Formula>` — không lưu ký tự subscript Unicode trong data.
8. Mọi thay đổi ở `chem/`, `engine/` phải có **unit test**. Checker mới phải kèm bảng ca biên.
9. Animation chỉ dùng `transform`/`opacity`; tôn trọng `prefers-reduced-motion`; không chạy animation liên tục khi không cần.
10. **Mobile-first:** kiểm tra ở 360×640 và 390×844 trước, rồi tablet/desktop. Không dùng `100vh` (dùng `100dvh`), không dựa vào hover.
11. Thêm dependency > ~30 KB gzip: cần ghi lý do vào `docs/decisions.md`.
12. Bài tập phải là **đề gốc/diễn đạt lại**, không chép nguyên văn SGK/SBT. Tên chất và thuật ngữ theo SGK Kết nối tri thức (acid, base, oxide…).
13. Commit nhỏ, theo Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`).
14. UI copy tiếng Việt, tập trung ở `src/copy/vi.ts`; giọng khích lệ, ngắn gọn, không chê học sinh.
15. Không sao chép mascot/logo/artwork/tên thành tựu của Duolingo hoặc app khác.
