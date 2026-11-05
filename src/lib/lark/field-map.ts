import type { Lead } from "@/lib/leads/types";

/**
 * Ánh xạ thuộc tính Lead ↔ tên cột trong bảng "Leads" của Base "Quản lý Lead".
 * Đổi tên cột trên Lark thì chỉ cần sửa ở đây.
 */
export const LEAD_FIELD_MAP = {
  name: "Họ tên",
  phone: "Số điện thoại",
  email: "Email",
  source: "Nguồn",
  project: "Dự án quan tâm",
  status: "Trạng thái",
  assignee: "Phụ trách",
  budget: "Ngân sách (VNĐ)",
  note: "Ghi chú",
  createdAt: "Ngày tạo",
} as const satisfies Record<Exclude<keyof Lead, "id">, string>;

export type LarkFields = Record<string, unknown>;

/** Lark trả text dạng string hoặc mảng segment [{text, type}]. */
function toText(v: unknown): string | undefined {
  if (v == null) return undefined;
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) {
    return v
      .map((s) => (typeof s === "string" ? s : (s as { text?: string })?.text ?? ""))
      .join("");
  }
  if (typeof v === "object" && "text" in (v as object)) return (v as { text: string }).text;
  return undefined;
}

function toNumber(v: unknown): number | undefined {
  if (v == null || v === "") return undefined;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function fromLarkRecord(id: string, f: LarkFields): Lead {
  const m = LEAD_FIELD_MAP;
  return {
    id,
    name: toText(f[m.name]) ?? "(Chưa có tên)",
    phone: toText(f[m.phone]) ?? "",
    email: toText(f[m.email]),
    source: toText(f[m.source]) as Lead["source"],
    project: toText(f[m.project]),
    status: (toText(f[m.status]) as Lead["status"]) ?? "Mới",
    assignee: toText(f[m.assignee]),
    budget: toNumber(f[m.budget]),
    note: toText(f[m.note]),
    createdAt: toNumber(f[m.createdAt]),
  };
}

export function toLarkFields(input: Partial<Omit<Lead, "id">>): LarkFields {
  const out: LarkFields = {};
  for (const [key, col] of Object.entries(LEAD_FIELD_MAP)) {
    const v = input[key as keyof typeof LEAD_FIELD_MAP];
    if (v !== undefined) out[col] = v;
  }
  return out;
}
