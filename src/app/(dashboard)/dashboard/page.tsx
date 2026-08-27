import Link from "next/link";
import { ArrowRight, Boxes, Package, Sparkles, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

function money(value: number) {
  return `${value.toLocaleString("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} TJS`;
}

const quickStart: Array<{ num: string; title: string; body: string; href: string; Icon: LucideIcon }> = [
  { num: "01", title: "Загрузи фото", body: "AI Studio", href: "/ai-studio", Icon: Sparkles },
  { num: "02", title: "Получи контент", body: "Instagram + Lak Lak + prompt", href: "/ai-studio", Icon: Package },
  { num: "03", title: "Сохрани товар", body: "Фото, цены и остаток", href: "/products", Icon: Boxes },
];

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
  const lowCount = lowStock?.length ?? 0;

  return (
    <section className="animate-fade-in space-y-4 sm:space-y-6">
      <header className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 sm:border-0 sm:bg-transparent sm:p-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-medium text-[var(--gold)]">Dilyas Shop</p>
            <h1 className="text-[27px] font-semibold leading-[1.12] tracking-tight sm:text-4xl">Магазин под контролем</h1>
            <p className="mt-2 max-w-xl text-sm leading-5 text-[var(--muted)]">Добавляй товары через AI, следи за остатками и быстро обновляй склад.</p>
          </div>
          <div className="hidden shrink-0 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--muted)] sm:block">Lak Lak</div>
        </div>
        <Link href="/ai-studio" className="mt-4 flex min-h-12 w-full items-center justify-between rounded-xl bg-[var(--foreground)] px-4 text-sm font-medium text-[var(--background)] shadow-sm transition active:scale-[.99] sm:inline-flex sm:w-auto sm:gap-2 sm:px-4">
          <span className="flex items-center gap-2"><Sparkles size={17}/> Создать товар с AI</span><ArrowRight className="sm:hidden" size={16}/>
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
        <Link href="/products" className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 shadow-[0_6px_20px_rgba(31,26,20,.035)]">
          <Package size={17}/><p className="mt-5 text-xs text-[var(--muted)]">Товары</p><p className="mt-1 text-[25px] font-semibold tracking-tight">{products ?? 0}</p>
        </Link>
        <Link href="/inventory" className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 shadow-[0_6px_20px_rgba(31,26,20,.035)]">
          <Boxes size={17}/><p className="mt-5 text-xs text-[var(--muted)]">На складе</p><p className="mt-1 text-[25px] font-semibold tracking-tight">{units}</p><p className="text-[11px] text-[var(--muted)]">шт.</p>
        </Link>
        <Link href="/inventory" className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 shadow-[0_6px_20px_rgba(31,26,20,.035)]">
          <span className="text-sm font-medium">TJS</span><p className="mt-5 text-xs text-[var(--muted)]">Вложено</p><p className="mt-1 text-[21px] font-semibold tracking-tight">{money(inventoryValue).replace(" TJS","")}</p>
        </Link>
        <Link href="/ai-studio" className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 shadow-[0_6px_20px_rgba(31,26,20,.035)]">
          <Sparkles size={17}/><p className="mt-5 text-xs text-[var(--muted)]">AI-контент</p><p className="mt-1 text-[25px] font-semibold tracking-tight">{generated ?? 0}</p>
        </Link>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 sm:p-6">
          <div className="flex items-center justify-between"><div><h2 className="text-sm font-semibold">Быстрый старт</h2><p className="mt-1 text-xs text-[var(--muted)]">Твой основной рабочий цикл.</p></div></div>
          <div className="mt-4 space-y-2">
            {quickStart.map(({ num, title, body, href, Icon }) => <Link key={num} href={href} className="flex items-center gap-3 rounded-xl border border-[var(--line)] p-3.5 transition active:bg-[var(--surface-muted)]"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--surface-muted)] text-[11px] font-semibold text-[var(--muted)]">{num}</span><span className="min-w-0 flex-1"><span className="block text-sm font-medium">{title}</span><span className="mt-0.5 block truncate text-xs text-[var(--muted)]">{body}</span></span><Icon size={16} className="shrink-0 text-[var(--muted)]"/></Link>)}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><TriangleAlert size={17}/><h2 className="text-sm font-semibold">Нужно внимания</h2></div><span className="text-xs text-[var(--muted)]">{lowCount}</span></div>
          {lowCount === 0 ? <div className="mt-4 rounded-xl bg-[var(--surface-muted)] p-4"><p className="text-sm font-medium">Склад в порядке</p><p className="mt-1 text-xs leading-5 text-[var(--muted)]">Товаров с критическим остатком сейчас нет.</p></div> : <div className="mt-3 divide-y divide-[var(--line)]">{(lowStock ?? []).map((item) => { const product = item.products as unknown as { name: string } | null; return <Link href="/inventory" key={item.id} className="flex items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{product?.name ?? "Товар"}</p><p className="mt-0.5 truncate text-[11px] text-[var(--muted)]">{item.sku}</p></div><span className="shrink-0 rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-semibold">{item.quantity} шт.</span></Link>; })}</div>}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3.5 text-xs leading-5 text-[var(--muted)] sm:p-5">
        Потенциальная выручка текущего склада: <span className="font-semibold text-[var(--foreground)]">{money(potentialRevenue)}</span>. Это стоимость всех текущих остатков по ценам продажи.
      </div>
    </section>
  );
}
