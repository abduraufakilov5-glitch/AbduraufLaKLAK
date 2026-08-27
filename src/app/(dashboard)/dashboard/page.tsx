import Link from "next/link";
import { ArrowRight, Boxes, Package, Sparkles, TriangleAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

function money(value: number) {
  return `${value.toLocaleString("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} TJS`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ count: products }, { data: variants }, { data: lowStock }, { count: generated }] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("product_variants").select("quantity,cost_price,selling_price"),
    supabase.from("product_variants").select("id,sku,quantity,minimum_quantity,products(name)").lte("quantity", 2).order("quantity").limit(5),
    supabase.from("ai_generations").select("id", { count: "exact", head: true }).eq("status", "completed"),
  ]);
  const rows = variants ?? [];
  const units = rows.reduce((sum, row) => sum + Number(row.quantity ?? 0), 0);
  const inventoryValue = rows.reduce((sum, row) => sum + Number(row.quantity ?? 0) * Number(row.cost_price ?? 0), 0);
  const potentialRevenue = rows.reduce((sum, row) => sum + Number(row.quantity ?? 0) * Number(row.selling_price ?? 0), 0);
  const cards = [
    { label: "Товары", value: products ?? 0, icon: Package, href: "/products" },
    { label: "На складе", value: `${units} шт.`, icon: Boxes, href: "/inventory" },
    { label: "Себестоимость остатков", value: money(inventoryValue), icon: Package, href: "/inventory" },
    { label: "AI-контент", value: generated ?? 0, icon: Sparkles, href: "/ai-studio" },
  ];

  return <section className="animate-fade-in space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-sm font-medium text-[var(--gold)]">Dilyas Shop</p><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Каталог под контролем 👋</h1><p className="mt-2 text-sm text-[var(--muted)]">Фото, контент, цены и остатки — без лишнего учёта заказов.</p></div><Link href="/ai-studio" className="inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-[var(--background)] transition hover:opacity-90"><Sparkles size={16}/> Создать товар с AI</Link></header>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, icon: Icon, href }) => <Link key={label} href={href} className="group rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-[0_8px_24px_rgba(31,26,20,0.04)] transition hover:-translate-y-0.5"><div className="flex items-start justify-between"><div className="grid size-9 place-items-center rounded-xl bg-[color:var(--background)]"><Icon size={17}/></div><ArrowRight size={16} className="text-[var(--muted)] opacity-60 transition group-hover:translate-x-0.5"/></div><div className="mt-6 text-sm text-[var(--muted)]">{label}</div><div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div></Link>)}</div>
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6"><p className="text-sm font-medium">Что делать дальше</p><p className="mt-1 text-xs text-[var(--muted)]">Основной сценарий приложения.</p><div className="mt-5 grid gap-3 sm:grid-cols-3"><Link href="/ai-studio" className="rounded-xl border border-[var(--line)] p-4 transition hover:bg-black/[0.03]"><Sparkles size={18}/><p className="mt-3 text-sm font-medium">1. Добавить фото</p><p className="mt-1 text-xs text-[var(--muted)]">Укажи параметры товара.</p></Link><Link href="/ai-studio" className="rounded-xl border border-[var(--line)] p-4 transition hover:bg-black/[0.03]"><Package size={18}/><p className="mt-3 text-sm font-medium">2. Получить контент</p><p className="mt-1 text-xs text-[var(--muted)]">Instagram + Lak Lak + промпт.</p></Link><Link href="/inventory" className="rounded-xl border border-[var(--line)] p-4 transition hover:bg-black/[0.03]"><Boxes size={18}/><p className="mt-3 text-sm font-medium">3. Обновлять остаток</p><p className="mt-1 text-xs text-[var(--muted)]">Приход или продажа за секунды.</p></Link></div></div>
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6"><div className="flex items-center gap-2"><TriangleAlert size={18}/><p className="text-sm font-medium">Мало товара</p></div>{(lowStock?.length ?? 0) === 0 ? <div className="mt-6 rounded-xl bg-[color:var(--background)] p-5"><p className="text-sm font-medium">Всё спокойно</p><p className="mt-1 text-xs text-[var(--muted)]">Критических остатков не найдено.</p></div> : <div className="mt-4 divide-y divide-[var(--line)]">{(lowStock ?? []).map((item) => { const product = item.products as unknown as { name: string } | null; return <div key={item.id} className="flex items-center justify-between gap-3 py-3"><div><p className="text-sm font-medium">{product?.name ?? "Товар"}</p><p className="mt-0.5 text-xs text-[var(--muted)]">{item.sku}</p></div><span className="rounded-full bg-[color:var(--background)] px-2.5 py-1 text-xs font-semibold">{item.quantity} шт.</span></div>; })}</div>}
      </div>
    </div>
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 text-sm text-[var(--muted)]">Потенциальная выручка текущих остатков: <span className="font-medium text-[var(--foreground)]">{money(potentialRevenue)}</span>. Это расчёт по текущим ценам, а не фактические продажи.</div>
  </section>;
}
