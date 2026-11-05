import clsx from "clsx";
import type { LeadStatus } from "@/lib/leads/types";

const STYLES: Record<LeadStatus, string> = {
  "Mới": "bg-brand-50 text-brand",
  "Đang liên hệ": "bg-amber-50 text-amber-700",
  "Quan tâm": "bg-violet-50 text-violet-700",
  "Hẹn xem": "bg-cyan-50 text-cyan-700",
  "Đã chốt": "bg-emerald-50 text-emerald-700",
  "Thất bại": "bg-slate-100 text-slate-500",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={clsx("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", STYLES[status] ?? STYLES["Mới"])}>
      {status}
    </span>
  );
}
