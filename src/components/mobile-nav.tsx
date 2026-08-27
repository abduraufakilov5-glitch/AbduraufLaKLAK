"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bell, Boxes, LayoutDashboard, MoreHorizontal, Package, Settings, ShoppingBag, Sparkles } from "lucide-react";

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
  const secondaryActive = secondary.some(([, href]) => pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color:var(--background)]/94 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="flex min-h-9 items-center justify-between gap-3">
          <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-[var(--foreground)] text-sm font-semibold text-[var(--background)]">D</span>
            <span className="truncate text-[15px] font-semibold tracking-tight">Dilyas Shop</span>
          </Link>
          <Link href="/notifications" aria-label="Уведомления" className="grid size-10 shrink-0 place-items-center rounded-xl border border-[var(--line)] bg-[var(--card)] text-[var(--muted)] transition active:scale-95">
            <Bell size={20} strokeWidth={1.9} />
          </Link>
        </div>
      </header>

      <nav aria-label="Основная навигация" className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[color:var(--card)]/97 px-2 pt-2 shadow-[0_-8px_30px_rgba(31,26,20,0.08)] backdrop-blur-xl md:hidden" style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom))" }}>
        <div className="mx-auto grid max-w-lg grid-cols-6 gap-1">
          {primary.map(([label, href, Icon]) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`flex min-h-[60px] flex-col items-center justify-center gap-1.5 rounded-xl px-1 text-[10px] font-medium transition active:scale-95 ${active ? "bg-[color:var(--background)] text-[var(--foreground)]" : "text-[var(--muted)]"}`}
              >
                <Icon size={22} strokeWidth={active ? 2.2 : 1.9} />
                <span>{label}</span>
              </Link>
            );
          })}
          <details className="relative">
            <summary className={`flex min-h-[60px] cursor-pointer list-none flex-col items-center justify-center gap-1.5 rounded-xl px-1 text-[10px] font-medium transition active:scale-95 ${secondaryActive ? "bg-[color:var(--background)] text-[var(--foreground)]" : "text-[var(--muted)]"} [&::-webkit-details-marker]:hidden`}>
              <MoreHorizontal size={23} strokeWidth={1.9} />
              <span>Ещё</span>
            </summary>
            <div className="absolute bottom-[68px] right-0 w-52 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] p-1.5 shadow-2xl">
              {secondary.map(([label, href, Icon]) => (
                <Link key={href} href={href} className="flex min-h-12 items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--muted)] active:bg-[color:var(--background)]">
                  <Icon size={19} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </details>
        </div>
      </nav>
    </>
  );
}
