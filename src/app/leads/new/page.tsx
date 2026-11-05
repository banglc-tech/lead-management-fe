import Link from "next/link";
import { LeadForm } from "@/components/lead-form";

export default function NewLeadPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/leads" className="text-sm text-slate-500 hover:text-brand">← Danh sách lead</Link>
      <h1 className="text-2xl font-extrabold">Thêm lead</h1>
      <LeadForm />
    </div>
  );
}
