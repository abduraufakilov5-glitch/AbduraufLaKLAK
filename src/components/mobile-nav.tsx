"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Boxes, Home, MoreHorizontal, Package, Plus, Settings } from "lucide-react";
import { useEffect, useState } from "react";

const tabs = [
  ["Главная", "/dashboard", Home],
  ["Товары", "/products", Package],
  ["Склад", "/inventory", Boxes],
] as const;

const secondary = [
  ["Уведомления", "/notifications", Bell],
  ["Настройки", "/settings", Settings],
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);
  const aiActive = pathname === "/ai-studio" || pathname.startsWith("/ai-studio/");
  const secondaryActive = secondary.some(([, href]) => pathname === href || pathname.startsWith(`${href}/`));

  useEffect(() => {
    for (const [, href] of [...tabs, ["AI", "/ai-studio", Plus] as const, ...secondary]) router.prefetch(href);
  }, [router]);

  useEffect(() => setMoreOpen(false), [pathname]);

  const tab = (label: string, href: string, Icon: typeof Home) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link href={href} className={`mobile-tab ${active ? "is-active" : ""}`}>
        <span className="mobile-tab__icon"><Icon size={20} strokeWidth={active ? 2.1 : 1.8} /></span>
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      <header className="mobile-topbar md:hidden">
        <Link href="/dashboard" className="mobile-brand">
          <span className="mobile-brand__mark">D</span>
          <span className="mobile-brand__text-wrap"><span className="mobile-brand__text">Dilyas Shop</span><span className="mobile-brand__subtext">AI-каталог</span></span>
        </Link>
        <Link href="/notifications" aria-label="Уведомления" className="mobile-icon-button"><Bell size={19} strokeWidth={1.9} /></Link>
      </header>

      <nav aria-label="Основная навигация" className="mobile-tabbar md:hidden" style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}>
        <div className="mobile-tabbar__inner">
          {tab("Главная", "/dashboard", Home)}
          {tab("Товары", "/products", Package)}
          <Link href="/ai-studio" aria-label="Добавить товар" className={`mobile-add-tab ${aiActive ? "is-active" : ""}`}>
            <span className="mobile-add-tab__circle"><Plus size={23} strokeWidth={2.2} /></span>
            <span>Добавить</span>
          </Link>
          {tab("Склад", "/inventory", Boxes)}
          <div className="relative flex-1">
            <button type="button" onClick={() => setMoreOpen(value => !value)} aria-expanded={moreOpen} className={`mobile-tab w-full ${secondaryActive ? "is-active" : ""}`}>
              <span className="mobile-tab__icon"><MoreHorizontal size={20} strokeWidth={1.9} /></span><span>Ещё</span>
            </button>
            {moreOpen && <div className="mobile-more__menu mobile-more__menu--app"><Link href="/notifications" className="mobile-more__item"><Bell size={18}/><span>Уведомления</span></Link><Link href="/settings" className="mobile-more__item"><Settings size={18}/><span>Настройки</span></Link></div>}
          </div>
        </div>
      </nav>
    </>
  );
}
