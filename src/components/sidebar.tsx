import Link from "next/link";
import { BarChart3, Bell, Boxes, LayoutDashboard, Package, Settings, ShoppingBag, Sparkles } from "lucide-react";

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
    <aside className="hidden w-56 shrink-0 border-r border-[var(--line)] bg-[var(--surface-muted)] md:flex md:flex-col">
      <div className="px-5 pb-5 pt-6">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-[10px] bg-[var(--rose-600)] text-sm font-semibold text-white">D</span>
          <span>
            <span className="block text-sm font-medium tracking-tight">Dilyas Shop</span>
            <span className="mt-0.5 block text-[11px] text-[var(--muted)]">Управление магазином</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 px-3 pb-4" aria-label="Основная навигация">
        <div className="mb-2 px-3 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">Рабочее пространство</div>
        <div className="space-y-0.5">
          {items.map(([label, href, Icon]) => (
            <Link key={href} href={href} prefetch className="group flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-[13px] text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--foreground)]">
              <Icon size={17} strokeWidth={1.8} className="shrink-0" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="border-t border-[var(--line)] px-5 py-4 text-[11px] text-[var(--text-muted)]">Dilyas Shop · магазин</div>
    </aside>
  );
}
