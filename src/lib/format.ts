export function formatVnd(n?: number): string {
  if (n == null) return "—";
  const fmt = (v: number) => v.toLocaleString("vi-VN", { maximumFractionDigits: 1 });
  if (n >= 1e9) return `${fmt(n / 1e9)} tỷ`;
  if (n >= 1e6) return `${fmt(n / 1e6)} triệu`;
  return `${n.toLocaleString("vi-VN")} đ`;
}

export const formatDate = (ms?: number) =>
  ms == null ? "—" : new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Saigon" }).format(new Date(ms));
