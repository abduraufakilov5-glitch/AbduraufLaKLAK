import Link from "next/link";
import { LayoutDashboard, Package, Boxes, ShoppingBag, BarChart3, Sparkles, Bell, Settings } from "lucide-react";

const items = [
  ["Обзор", "/dashboard", LayoutDashboard],
  ["Товары", "/products", Package],
  ["Остатки", "/inventory", Boxes],
  ["Заказы", "/orders", ShoppingBag],
  ["Аналитика", "/analytics", BarChart3],
  ["AI Studio", "/ai-studio", Sparkles],
  ["Уведомления", "/notifications", Bell],
  ["Настройки", "/settings", Settings],
] as const;

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-[var(--line)] bg-[var(--card)] md:flex md:flex-col">
      <div className="px-6 pb-6 pt-7">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl bg-[var(--foreground)] text-sm font-semibold text-[var(--card)]">L</div>
          <div>
            <div className="text-sm font-semibold tracking-tight">Lak Lak</div>
            <div className="text-[11px] text-[var(--muted)]">Управление магазином</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 pb-5">
        <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Рабочее пространство</div>
        <div className="space-y-1">
          {items.map(([label, href, Icon]) => (
            <Link key={href} href={href} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--muted)] transition-all hover:bg-black/[0.04] hover:text-[var(--foreground)]">
              <Icon size={17} strokeWidth={1.8} className="transition-transform group-hover:scale-105" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="border-t border-[var(--line)] px-6 py-4 text-[11px] text-[var(--muted)]">AI Store · Lak Lak</div>
    </aside>
  );
}
