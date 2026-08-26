import Link from "next/link";
import { LayoutDashboard, Package, Boxes, ShoppingBag, BarChart3, Sparkles, Bell, Settings } from "lucide-react";

const items = [
  ["Обзор", "/dashboard", LayoutDashboard], ["Товары", "/products", Package], ["Остатки", "/inventory", Boxes], ["Заказы", "/orders", ShoppingBag], ["Аналитика", "/analytics", BarChart3], ["AI", "/ai-studio", Sparkles], ["Уведомления", "/notifications", Bell], ["Настройки", "/settings", Settings],
] as const;

export function MobileNav() {
  return <nav aria-label="Основная навигация" className="sticky top-0 z-20 overflow-x-auto border-b border-[var(--line)] bg-[color:var(--background)]/95 px-2 py-2 backdrop-blur md:hidden"><div className="flex min-w-max gap-1">{items.map(([label, href, Icon]) => <Link key={href} href={href} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-[var(--muted)] transition hover:bg-black/5 hover:text-[var(--foreground)]"><Icon size={15}/>{label}</Link>)}</div></nav>;
}
