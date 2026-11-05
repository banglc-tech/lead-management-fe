"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { LEAD_SOURCES, LEAD_STATUSES } from "@/lib/leads/types";

export function LeadFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(sp);
    if (value) next.set(key, value);
    else next.delete(key);
    start(() => router.replace(`${pathname}?${next}`));
  };

  const input = "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand";
  return (
    <div className={`flex flex-wrap gap-2 ${pending ? "opacity-60" : ""}`}>
      <input
        defaultValue={sp.get("q") ?? ""}
        onChange={(e) => set("q", e.target.value)}
        placeholder="Tìm tên, SĐT, email, dự án…"
        className={`${input} w-full sm:w-72`}
      />
      <select defaultValue={sp.get("status") ?? ""} onChange={(e) => set("status", e.target.value)} className={input}>
        <option value="">Tất cả trạng thái</option>
        {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
      </select>
      <select defaultValue={sp.get("source") ?? ""} onChange={(e) => set("source", e.target.value)} className={input}>
        <option value="">Tất cả nguồn</option>
        {LEAD_SOURCES.map((s) => <option key={s}>{s}</option>)}
      </select>
    </div>
  );
}
