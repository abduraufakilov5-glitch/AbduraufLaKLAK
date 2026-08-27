"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BarChart3, Bell, Boxes, LayoutDashboard, MoreHorizontal, Package, Settings, ShoppingBag } from "lucide-react";

const primary = [
  ["Обзор", "/dashboard", LayoutDashboard],
  ["Товары", "/products", Package],
  ["Склад", "/inventory", Boxes],
  ["Заказы", "/orders", ShoppingBag],
] as const;

const secondary = [
  ["Аналитика", "/analytics", BarChart3],
  ["AI Studio", "/ai-studio", SparklesIcon],
  ["Уведомления", "/notifications", Bell],
  ["Настройки", "/settings", Settings],
] as const;

function SparklesIcon(props: { size?: number; strokeWidth?: number }) {
  return <span className="inline-flex" aria-hidden="true"><span style={{ fontSize: props.size ?? 20, lineHeight: 1 }}>✦</span></span>;
}

const routes = [...primary, ...secondary];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const secondaryActive = secondary.some(([, href]) => pathname === href || pathname.startsWith(`${href}/`));

  useEffect(() => {
    for (const [, href] of routes) router.prefetch(href);
  }, [router]);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color:var(--background)]/95 px-4 py-3 backdrop-blur-md md:hidden">
        <div className="flex min-h-9 items-center justify-between gap-3">
          <Link href="/dashboard" prefetch className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-[var(--rose-600)] text-sm font-semibold text-white">D</span>
            <span className="truncate text-[15px] font-medium tracking-tight">Dilyas Shop</span>
          </Link>
          <Link href="/notifications" prefetch aria-label="Уведомления" className="grid size-10 shrink-0 place-items-center rounded-[8px] border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] active:bg-[var(--surface-muted)]">
            <Bell size={20} strokeWidth={1.8} />
          </Link>
        </div>
      </header>
      <nav aria-label="Основная навигация" className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--surface)] px-2 pt-2 md:hidden" style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}>
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {primary.map(([label, href, Icon]) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return <Link key={href} href={href} prefetch className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-[8px] px-1 text-[11px] font-medium transition-colors active:bg-[var(--surface-muted)] ${active ? "text-[var(--rose-600)]" : "text-[var(--text-muted)]"}`}>
              <Icon size={23} strokeWidth={active ? 2.1 : 1.8} />
              <span>{label}</span>
            </Link>;
          })}
          <details className="relative">
            <summary className={`flex min-h-[48px] cursor-pointer list-none flex-col items-center justify-center gap-1 rounded-[8px] px-1 text-[11px] font-medium [&::-webkit-details-marker]:hidden ${secondaryActive ? "text-[var(--rose-600)]" : "text-[var(--text-muted)]"}`}>
              <MoreHorizontal size={23} strokeWidth={1.8} /><span>Ещё</span>
            </summary>
            <div className="absolute bottom-[56px] right-0 w-52 overflow-hidden rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-1">
              {secondary.map(([label, href, Icon]) => <Link key={href} href={href} prefetch className="flex min-h-12 items-center gap-3 rounded-[8px] px-3 py-3 text-[13px] text-[var(--text-secondary)] active:bg-[var(--surface-muted)]"><Icon size={19}/><span>{label}</span></Link>)}
            </div>
          </details>
        </div>
      </nav>
    </>
  );
}
