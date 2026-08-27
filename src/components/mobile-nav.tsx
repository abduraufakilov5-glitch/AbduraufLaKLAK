"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Bell, Boxes, LayoutDashboard, MoreHorizontal, Package, Settings, Sparkles } from "lucide-react";

const primary = [
  ["Главная", "/dashboard", LayoutDashboard],
  ["Товары", "/products", Package],
  ["Склад", "/inventory", Boxes],
  ["AI", "/ai-studio", Sparkles],
] as const;

const secondary = [
  ["Уведомления", "/notifications", Bell],
  ["Настройки", "/settings", Settings],
] as const;

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
      <header className="mobile-topbar">
        <Link href="/dashboard" prefetch className="mobile-brand">
          <span className="mobile-brand__mark">D</span>
          <span className="mobile-brand__text">Dilyas Shop</span>
        </Link>
        <Link href="/notifications" prefetch aria-label="Уведомления" className="mobile-icon-button">
          <Bell size={19} strokeWidth={1.9} />
        </Link>
      </header>
      <nav aria-label="Основная навигация" className="mobile-tabbar">
        <div className="mobile-tabbar__inner">
          {primary.map(([label, href, Icon]) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link key={href} href={href} prefetch className={`mobile-tab ${active ? "is-active" : ""}`}>
                <span className="mobile-tab__icon"><Icon size={20} strokeWidth={active ? 2.15 : 1.8} /></span>
                <span>{label}</span>
              </Link>
            );
          })}
          <details className="mobile-more">
            <summary className={`mobile-tab ${secondaryActive ? "is-active" : ""}`}>
              <span className="mobile-tab__icon"><MoreHorizontal size={20} strokeWidth={1.9} /></span>
              <span>Ещё</span>
            </summary>
            <div className="mobile-more__menu">
              {secondary.map(([label, href, Icon]) => (
                <Link key={href} href={href} prefetch className="mobile-more__item">
                  <Icon size={18} strokeWidth={1.9} />
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
