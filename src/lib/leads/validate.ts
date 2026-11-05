import { LEAD_SOURCES, LEAD_STATUSES, type LeadInput } from "./types";

/** Kiểm tra body từ client, chỉ giữ các trường hợp lệ. */
export function parseLeadInput(body: unknown, partial = false): { data?: Partial<LeadInput>; error?: string } {
  if (!body || typeof body !== "object") return { error: "Body không hợp lệ" };
  const b = body as Record<string, unknown>;
  const data: Partial<LeadInput> = {};
  const str = (k: keyof LeadInput) => {
    if (b[k] !== undefined) data[k] = String(b[k]).trim() as never;
  };
  (["name", "phone", "email", "project", "assignee", "note"] as const).forEach(str);
  if (b.status !== undefined) {
    if (!LEAD_STATUSES.includes(b.status as never)) return { error: "Trạng thái không hợp lệ" };
    data.status = b.status as LeadInput["status"];
  }
  if (b.source !== undefined && b.source !== "") {
    if (!LEAD_SOURCES.includes(b.source as never)) return { error: "Nguồn không hợp lệ" };
    data.source = b.source as LeadInput["source"];
  }
  if (b.budget !== undefined && b.budget !== "") {
    const n = Number(b.budget);
    if (!Number.isFinite(n) || n < 0) return { error: "Ngân sách không hợp lệ" };
    data.budget = n;
  }
  if (!partial) {
    if (!data.name) return { error: "Thiếu họ tên" };
    if (!data.phone) return { error: "Thiếu số điện thoại" };
    data.status ??= "Mới";
  }
  return { data };
}
