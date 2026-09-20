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
