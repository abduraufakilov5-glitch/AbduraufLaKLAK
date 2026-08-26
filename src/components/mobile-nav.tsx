"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, LayoutDashboard, Package, Settings, ShoppingBag, Sparkles, Bell, MoreHorizontal } from "lucide-react";

const primary = [
  ["Обзор", "/dashboard", LayoutDashboard],
  ["Товары", "/products", Package],
  ["Склад", "/inventory", Boxes],
  ["Заказы", "/orders", ShoppingBag],
  ["AI", "/ai-studio", Sparkles],
] as const;

const secondary = [
  ["Аналитика", "/analytics", BarChart3],
  ["Уведомления", "/notifications", Bell],
  ["Настройки", "/settings", Settings],
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const activeSecondary = secondary.find(([, href]) => pathname === href || pathname.startsWith(`${href}/`));
  const ActiveSecondaryIcon = activeSecondary?.[2];

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color:var(--background)]/92 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-[10px] bg-[var(--foreground)] text-xs font-semibold text-[var(--background)]">D</span>
            <span className="text-sm font-semibold tracking-tight">Dilyas Shop</span>
          </Link>
          {activeSecondary && ActiveSecondaryIcon ? (
            <Link href={activeSecondary[1]} className="grid size-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--card)] text-[var(--muted)]">
              <ActiveSecondaryIcon size={17} />
            </Link>
          ) : (
            <Link href="/notifications" aria-label="Уведомления" className="grid size-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--card)] text-[var(--muted)]">
              <Bell size={17} />
            </Link>
          )}
        </div>
      </header>

      <nav aria-label="Основная навигация" className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--line)] bg-[color:var(--card)]/96 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-6 gap-1">
          {primary.map(([label, href, Icon]) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return <Link key={href} href={href} className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition ${active ? "bg-[color:var(--background)] text-[var(--foreground)]" : "text-[var(--muted)]"}`}><Icon size={18} strokeWidth={active ? 2.2 : 1.8} /><span>{label}</span></Link>;
          })}
          <details className="relative">
            <summary className="flex min-h-12 cursor-pointer list-none flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium text-[var(--muted)] [&::-webkit-details-marker]:hidden"><MoreHorizontal size={19} /><span>Ещё</span></summary>
            <div className="absolute bottom-14 right-0 w-48 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] p-1 shadow-2xl">
              {secondary.map(([label, href, Icon]) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--muted)] hover:bg-[color:var(--background)] hover:text-[var(--foreground)]"><Icon size={17} />{label}</Link>)}
            </div>
          </details>
        </div>
      </nav>
    </>
  );
}
