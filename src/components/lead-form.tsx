"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LEAD_SOURCES, LEAD_STATUSES, type Lead } from "@/lib/leads/types";

export function LeadForm({ lead }: { lead?: Lead }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    const body = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch(lead ? `/api/leads/${lead.id}` : "/api/leads", {
      method: lead ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) return setError(json.error ?? "Có lỗi xảy ra");
    if (lead) {
      setSaved(true);
      router.refresh();
    } else router.push(`/leads/${json.data.id}`);
  }

  const field = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand";
  const label = "mb-1 block text-xs font-semibold text-slate-500";

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
      <div><label className={label}>Họ tên *</label><input name="name" required defaultValue={lead?.name} className={field} /></div>
      <div><label className={label}>Số điện thoại *</label><input name="phone" required defaultValue={lead?.phone} className={field} /></div>
      <div><label className={label}>Email</label><input name="email" type="email" defaultValue={lead?.email} className={field} /></div>
      <div><label className={label}>Dự án quan tâm</label><input name="project" defaultValue={lead?.project} className={field} /></div>
      <div>
        <label className={label}>Trạng thái</label>
        <select name="status" defaultValue={lead?.status ?? "Mới"} className={field}>
          {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className={label}>Nguồn</label>
        <select name="source" defaultValue={lead?.source ?? ""} className={field}>
          <option value="">—</option>
          {LEAD_SOURCES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div><label className={label}>Phụ trách</label><input name="assignee" defaultValue={lead?.assignee} className={field} /></div>
      <div><label className={label}>Ngân sách (VNĐ)</label><input name="budget" type="number" min={0} defaultValue={lead?.budget} className={field} /></div>
      <div className="sm:col-span-2"><label className={label}>Ghi chú</label><textarea name="note" rows={3} defaultValue={lead?.note} className={field} /></div>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button disabled={saving} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
          {saving ? "Đang lưu…" : lead ? "Lưu thay đổi" : "Tạo lead"}
        </button>
        {error && <span className="text-sm text-red-600">{error}</span>}
        {saved && <span className="text-sm text-emerald-600">Đã lưu</span>}
      </div>
    </form>
  );
}
