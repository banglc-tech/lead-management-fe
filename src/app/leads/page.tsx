import Link from "next/link";
import { Suspense } from "react";
import { LeadFilters } from "@/components/lead-filters";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatVnd } from "@/lib/format";
import { isMockMode, listLeads } from "@/lib/leads/repository";
import { LEAD_STATUSES, type LeadQuery } from "@/lib/leads/types";

export const dynamic = "force-dynamic";

export default async function LeadsPage({ searchParams }: { searchParams: Promise<LeadQuery> }) {
  const query = await searchParams;
  const [leads, all] = await Promise.all([listLeads(query), listLeads()]);
  const count = (s: string) => all.filter((l) => l.status === s).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Danh sách lead</h1>
          <p className="text-sm text-slate-500">
            {all.length} lead · nguồn dữ liệu: {isMockMode() ? "dữ liệu mẫu" : "Lark Base"}
          </p>
        </div>
        <Link href="/leads/new" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600">
          + Thêm lead
        </Link>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {LEAD_STATUSES.map((s) => (
          <Link key={s} href={`/leads?status=${encodeURIComponent(s)}`} className="rounded-xl border border-slate-200 bg-white p-4 hover:border-brand">
            <div className="text-xs text-slate-500">{s}</div>
            <div className="mt-1 text-2xl font-bold">{count(s)}</div>
          </Link>
        ))}
      </section>

      <Suspense>
        <LeadFilters />
      </Suspense>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              {["Khách hàng", "Nguồn", "Dự án", "Trạng thái", "Phụ trách", "Ngân sách", "Ngày tạo"].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/leads/${l.id}`} className="font-semibold hover:text-brand">{l.name}</Link>
                  <div className="text-xs text-slate-500">{l.phone}</div>
                </td>
                <td className="px-4 py-3">{l.source ?? "—"}</td>
                <td className="px-4 py-3">{l.project ?? "—"}</td>
                <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                <td className="px-4 py-3">{l.assignee ?? "—"}</td>
                <td className="px-4 py-3">{formatVnd(l.budget)}</td>
                <td className="px-4 py-3">{formatDate(l.createdAt)}</td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400">Không có lead phù hợp</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
