import Link from "next/link";
import { ArrowRight, Boxes, Package, ShoppingBag, Sparkles, TriangleAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

function money(value: number) { return `${value.toLocaleString("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} TJS`; }

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ count: products }, { data: variants }, { count: orders }, { data: lowStock }] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("product_variants").select("quantity,cost_price"),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("product_variants").select("id,sku,quantity,minimum_quantity,products(name)").gt("quantity", 0).lte("quantity", 5).order("quantity").limit(5),
  ]);
  const rows = variants ?? [];
  const units = rows.reduce((sum, row) => sum + Number(row.quantity ?? 0), 0);
  const inventoryValue = rows.reduce((sum, row) => sum + Number(row.quantity ?? 0) * Number(row.cost_price ?? 0), 0);
  const cards = [
    { label: "Товары", value: products ?? 0, icon: Package, href: "/products" },
    { label: "Единицы", value: units, icon: Boxes, href: "/inventory" },
    { label: "Заказы", value: orders ?? 0, icon: ShoppingBag, href: "/orders" },
    { label: "Стоимость склада", value: money(inventoryValue), icon: Sparkles, href: "/analytics" },
  ];
  return <section className="animate-fade-in space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-sm font-medium text-[var(--gold)]">Панель магазина</p><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Добрый вечер 👋</h1><p className="mt-2 text-sm text-[var(--muted)]">Главное о магазине — в одном экране.</p></div><Link href="/ai-studio" className="inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-[var(--background)] transition hover:opacity-90"><Sparkles size={16}/> Создать карточку с AI</Link></header>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, icon: Icon, href })=><Link key={label} href={href} className="group rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-[0_8px_24px_rgba(31,26,20,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(31,26,20,0.08)]"><div className="flex items-start justify-between"><div className="grid size-9 place-items-center rounded-xl bg-[color:var(--background)]"><Icon size={17}/></div><ArrowRight size={16} className="text-[var(--muted)] opacity-60 transition group-hover:translate-x-0.5"/></div><div className="mt-6 text-sm text-[var(--muted)]">{label}</div><div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div></Link>)}</div>
    <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium">Быстрые действия</p><p className="mt-1 text-xs text-[var(--muted)]">Частые операции без лишних переходов.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><Link href="/products" className="rounded-xl border border-[var(--line)] p-4 transition hover:bg-black/[0.03]"><Package size={18}/><p className="mt-3 text-sm font-medium">Добавить товар</p><p className="mt-1 text-xs text-[var(--muted)]">Создать товар и SKU</p></Link><Link href="/inventory" className="rounded-xl border border-[var(--line)] p-4 transition hover:bg-black/[0.03]"><Boxes size={18}/><p className="mt-3 text-sm font-medium">Проверить остатки</p><p className="mt-1 text-xs text-[var(--muted)]">Найти дефицитные SKU</p></Link><Link href="/orders" className="rounded-xl border border-[var(--line)] p-4 transition hover:bg-black/[0.03]"><ShoppingBag size={18}/><p className="mt-3 text-sm font-medium">Открыть заказы</p><p className="mt-1 text-xs text-[var(--muted)]">Управлять статусами</p></Link></div></div>
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6"><div className="flex items-center gap-2"><TriangleAlert size={18}/><p className="text-sm font-medium">Низкий остаток</p></div>{(lowStock?.length ?? 0)===0?<div className="mt-8 rounded-xl bg-[color:var(--background)] p-5"><p className="text-sm font-medium">Всё спокойно</p><p className="mt-1 text-xs text-[var(--muted)]">SKU с критическим остатком не обнаружены.</p></div>:<div className="mt-4 divide-y divide-[var(--line)]">{(lowStock ?? []).map((item)=>{const product=item.products as unknown as {name:string}|null;return <div key={item.id} className="flex items-center justify-between gap-3 py-3"><div><p className="text-sm font-medium">{product?.name ?? "Товар"}</p><p className="mt-0.5 text-xs text-[var(--muted)]">{item.sku}</p></div><span className="rounded-full bg-[color:var(--background)] px-2.5 py-1 text-xs font-semibold">{item.quantity} шт.</span></div>})}</div>}</div>
    </div>
  </section>;
}
