import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ count: products }, { data: variants }, { count: orders }] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("product_variants").select("quantity,cost_price"),
    supabase.from("orders").select("id", { count: "exact", head: true }),
  ]);
  const totalUnits = (variants ?? []).reduce((sum, v) => sum + Number(v.quantity ?? 0), 0);
  const inventoryValue = (variants ?? []).reduce((sum, v) => sum + Number(v.quantity ?? 0) * Number(v.cost_price ?? 0), 0);
  const cards = [["Products", products ?? 0], ["Units", totalUnits], ["Orders", orders ?? 0], ["Inventory value", `${inventoryValue.toFixed(2)} TJS`]];
  return <section><header className="mb-8"><p className="mb-2 text-sm text-[var(--gold)]">Overview</p><h1 className="text-3xl font-semibold tracking-tight">Good evening.</h1><p className="mt-2 text-sm text-[var(--muted)]">Your store at a glance.</p></header><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label,value])=><div key={String(label)} className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-sm"><div className="text-sm text-[var(--muted)]">{label}</div><div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div></div>)}</div><div className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6"><h2 className="font-medium">Operations</h2><p className="mt-2 text-sm text-[var(--muted)]">Inventory movements, orders and AI-generated product cards are designed around server-side authorization and database constraints.</p></div></section>;
}