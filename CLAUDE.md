# CLAUDE.md

- Ngôn ngữ UI: tiếng Việt. Màu chủ đạo `#0061FF` (`brand`), font Manrope.
- Mọi lời gọi Lark nằm trong `src/lib/lark/*` và chỉ chạy server (`import "server-only"`).
- Không đọc tên cột Lark trực tiếp ngoài `field-map.ts`.
- Màn hình mới: làm mockup với dữ liệu mẫu (`USE_MOCK_DATA=true`) để duyệt trước khi nối Lark.
- Trước khi commit: `npm run lint && npx tsc --noEmit && npm run build`.
