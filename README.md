# lead-management-fe

Giao diện quản lý lead của iHouzz, dùng **Lark Base** làm backend.

- Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · font Manrope, màu chủ đạo `#0061FF`
- Dữ liệu: Base **Quản lý Lead** → bảng `Leads`
  (https://ihouzz-com.sg.larksuite.com/base/B4rDbJkjEa7HsrsX4GIlv1YZgKe)
- Gọi Lark Open API ở phía server (Route Handlers / Server Components); App Secret không bao giờ xuống trình duyệt.

## Chạy local

```bash
cp .env.example .env.local   # điền LARK_APP_ID / LARK_APP_SECRET
npm install
npm run dev                  # http://localhost:3000
```

Chưa có app Lark? Để trống `LARK_APP_ID`/`LARK_APP_SECRET` (hoặc `USE_MOCK_DATA=true`) → app chạy bằng dữ liệu mẫu.

## Kết nối Lark Base

1. Tạo **Custom App** trong Lark Developer Console, bật scope `bitable:app` (đọc/ghi Base).
2. Publish app, lấy App ID / App Secret điền vào `.env.local`.
3. Mở Base "Quản lý Lead" → **…** → **Add document app** (hoặc Share) → thêm app vừa tạo với quyền **Can edit**.

## Cấu trúc

```
src/
  app/
    leads/            # màn danh sách, chi tiết, thêm mới
    api/leads/        # REST: GET/POST /api/leads, GET/PATCH /api/leads/:id
  components/         # Sidebar, LeadForm, LeadFilters, StatusBadge
  lib/
    lark/client.ts    # tenant_access_token + Bitable records API
    lark/field-map.ts # ánh xạ Lead ↔ tên cột Lark (đổi tên cột chỉ sửa ở đây)
    leads/            # types, repository (Lark | mock), validate, mock-data
```

## Bảng `Leads` trên Lark

| Cột | Kiểu |
|---|---|
| Họ tên, Số điện thoại, Email, Dự án quan tâm, Phụ trách, Ghi chú | Text |
| Nguồn | Single select: Facebook, Zalo, Website, Hotline, Giới thiệu, Khác |
| Trạng thái | Single select: Mới, Đang liên hệ, Quan tâm, Hẹn xem, Đã chốt, Thất bại |
| Ngân sách (VNĐ) | Number |
| Ngày tạo | Date |

## Việc tiếp theo

- [ ] Đăng nhập bằng Lark SSO, gán "Phụ trách" theo user Lark
- [ ] Lọc/phân trang phía Lark (`records/search`) khi dữ liệu lớn
- [ ] Lịch sử chăm sóc (bảng con), nhắc việc
- [ ] Đồng bộ lead từ OneBox / form quảng cáo
