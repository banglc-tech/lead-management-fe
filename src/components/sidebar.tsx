import Link from "next/link";

const NAV = [{ href: "/leads", label: "Danh sách lead" }];

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white p-5 md:block">
      <div className="mb-8 text-lg font-extrabold text-brand">iHouzz · Lead</div>
      <nav className="space-y-1">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="block rounded-lg bg-brand-50 px-3 py-2 text-sm font-semibold text-brand">
            {n.label}
          </Link>
        ))}
      </nav>
      <p className="mt-8 text-xs text-slate-400">Dữ liệu đồng bộ từ Lark Base “Quản lý Lead”.</p>
    </aside>
  );
}
