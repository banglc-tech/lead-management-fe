import type { Lead } from "./types";

/** Dữ liệu mẫu dùng khi chưa cấu hình Lark (USE_MOCK_DATA=true). Không phải dữ liệu khách hàng thật. */
const day = 86_400_000;
const now = Date.UTC(2026, 10, 5);

export const MOCK_LEADS: Lead[] = [
  { id: "mock-1", name: "[Mẫu] Nguyễn Văn An", phone: "0900000001", email: "an.mau@example.com", source: "Facebook", project: "Dự án A", status: "Mới", assignee: "Sale 1", budget: 3_500_000_000, note: "Dữ liệu mẫu", createdAt: now - day },
  { id: "mock-2", name: "[Mẫu] Trần Thị Bình", phone: "0900000002", email: "binh.mau@example.com", source: "Zalo", project: "Dự án B", status: "Đang liên hệ", assignee: "Sale 2", budget: 2_200_000_000, note: "Dữ liệu mẫu", createdAt: now },
  { id: "mock-3", name: "[Mẫu] Lê Minh Châu", phone: "0900000003", source: "Website", project: "Dự án A", status: "Hẹn xem", assignee: "Sale 1", budget: 5_000_000_000, note: "Dữ liệu mẫu", createdAt: now + day },
  { id: "mock-4", name: "[Mẫu] Phạm Quốc Dũng", phone: "0900000004", source: "Hotline", project: "Dự án C", status: "Đã chốt", assignee: "Sale 3", budget: 4_100_000_000, note: "Dữ liệu mẫu", createdAt: now - 2 * day },
  { id: "mock-5", name: "[Mẫu] Hoàng Thu Hà", phone: "0900000005", source: "Giới thiệu", project: "Dự án B", status: "Quan tâm", assignee: "Sale 2", createdAt: now - 3 * day },
  { id: "mock-6", name: "[Mẫu] Vũ Đức Khang", phone: "0900000006", source: "Facebook", project: "Dự án C", status: "Thất bại", assignee: "Sale 3", note: "Không đủ ngân sách", createdAt: now - 5 * day },
];
