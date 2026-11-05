import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/lead-form";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format";
import { getLead } from "@/lib/leads/repository";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const lead = await getLead((await params).id);
  if (!lead) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/leads" className="text-sm text-slate-500 hover:text-brand">← Danh sách lead</Link>
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold">{lead.name}</h1>
        <StatusBadge status={lead.status} />
        <span className="text-sm text-slate-500">Tạo ngày {formatDate(lead.createdAt)}</span>
      </header>
      <LeadForm lead={lead} />
    </div>
  );
}
