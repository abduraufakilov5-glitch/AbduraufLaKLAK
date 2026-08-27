import Link from "next/link";
import { ArrowRight, Boxes, Package, Sparkles, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

function money(value: number) { return `${value.toLocaleString("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} TJS`; }

const quickStart: Array<{ num: string; title: string; body: string; href: string; Icon: LucideIcon }> = [
  { num: "01", title: "Загрузить фото", body: "Начать новый товар", href: "/ai-studio", Icon: Sparkles },
  { num: "02", title: "Получить контент", body: "Instagram · Lak Lak · prompt", href: "/ai-studio", Icon: Package },
  { num: "03", title: "Обновить склад", body: "Приход или продажа", href: "/inventory", Icon: Boxes },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ count: products }, { data: variants }, { data: lowStock }, { count: generated }] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("product_variants").select("quantity,cost_price,selling_price"),
    supabase.from("product_variants").select("id,sku,quantity,minimum_quantity,products(name)").lte("quantity", 2).order("quantity").limit(4),
    supabase.from("ai_generations").select("id", { count: "exact", head: true }).eq("status", "completed"),
  ]);

  const rows = variants ?? [];
  const units = rows.reduce((sum, row) => sum + Number(row.quantity ?? 0), 0);
  const inventoryValue = rows.reduce((sum, row) => sum + Number(row.quantity ?? 0) * Number(row.cost_price ?? 0), 0);
  const potentialRevenue = rows.reduce((sum, row) => sum + Number(row.quantity ?? 0) * Number(row.selling_price ?? 0), 0);
  const lowCount = lowStock?.length ?? 0;

  return (
    <section className="dashboard-home animate-fade-in">
      <div className="dashboard-mobile-welcome">
        <div><p className="dashboard-eyebrow">Dilyas Shop</p><h1>Добрый день 👋</h1><p>Всё нужное для каталога — здесь.</p></div>
        <Link href="/notifications" className="dashboard-bell" aria-label="Уведомления"><TriangleAlert size={18}/>{lowCount > 0 && <span>{lowCount}</span>}</Link>
      </div>

      <div className="dashboard-hero-card">
        <div><p className="dashboard-eyebrow">AI-каталог</p><h2>Добавь новый товар<br/>за несколько шагов.</h2><p>Фото → параметры → готовый контент.</p></div>
        <Link href="/ai-studio" className="dashboard-hero-action"><span><Sparkles size={17}/> Создать товар</span><ArrowRight size={16}/></Link>
      </div>

      <div className="dashboard-metrics">
        <Link href="/products" className="dashboard-metric"><Package size={18}/><span>Товары</span><strong>{products ?? 0}</strong></Link>
        <Link href="/inventory" className="dashboard-metric"><Boxes size={18}/><span>На складе</span><strong>{units}</strong><small>шт.</small></Link>
        <Link href="/inventory" className="dashboard-metric"><span className="dashboard-currency">TJS</span><span>Вложено</span><strong>{inventoryValue.toLocaleString("ru-RU")}</strong></Link>
        <Link href="/ai-studio" className="dashboard-metric"><Sparkles size={18}/><span>AI создано</span><strong>{generated ?? 0}</strong></Link>
      </div>

      <div className="dashboard-section-head"><div><h2>Твой рабочий цикл</h2><p>То, что ты делаешь чаще всего.</p></div></div>
      <div className="dashboard-steps">
        {quickStart.map(({ num, title, body, href, Icon }) => <Link key={num} href={href} className="dashboard-step"><span className="dashboard-step-num">{num}</span><span className="dashboard-step-copy"><strong>{title}</strong><small>{body}</small></span><Icon size={18}/></Link>)}
      </div>

      <div className="dashboard-section-head dashboard-attention-head"><div><h2>Нужно внимания</h2><p>{lowCount ? `${lowCount} позиции с низким остатком` : "Склад в порядке"}</p></div><Link href="/inventory">Все <ArrowRight size={14}/></Link></div>
      {lowCount === 0 ? <div className="dashboard-empty-attention"><span>✓</span><div><strong>Ничего срочного</strong><p>Критических остатков сейчас нет.</p></div></div> : <div className="dashboard-low-list">{(lowStock ?? []).map(item => { const product = item.products as unknown as { name: string } | null; return <Link key={item.id} href="/inventory"><div><strong>{product?.name ?? "Товар"}</strong><small>{item.sku}</small></div><b>{item.quantity} шт.</b></Link>; })}</div>}

      <div className="dashboard-value-note"><span>Потенциальная выручка склада</span><strong>{money(potentialRevenue)}</strong></div>
    </section>
  );
}
