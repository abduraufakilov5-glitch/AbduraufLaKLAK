import Link from "next/link";
import { LayoutDashboard, Package, Boxes, ShoppingBag, BarChart3, Sparkles, Bell, Settings } from "lucide-react";

const items = [
  ["Dashboard","/dashboard",LayoutDashboard], ["Products","/products",Package], ["Inventory","/inventory",Boxes], ["Orders","/orders",ShoppingBag], ["Analytics","/analytics",BarChart3], ["AI Studio","/ai-studio",Sparkles], ["Notifications","/notifications",Bell], ["Settings","/settings",Settings],
] as const;

export function Sidebar() {
  return <aside className="hidden w-64 shrink-0 border-r border-[var(--line)] bg-[var(--card)] px-4 py-6 md:block"><div className="px-3 pb-7 text-lg font-semibold tracking-tight">AI Store</div><nav className="space-y-1">{items.map(([label, href, Icon]) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--muted)] transition hover:bg-black/5 hover:text-[var(--foreground)]"><Icon size={17} strokeWidth={1.8}/>{label}</Link>)}</nav></aside>;
}