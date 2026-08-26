import { createClient } from "@/lib/supabase/server";

interface OrderRow { id: string; status: string; total: number; created_at: string; customers: { full_name: string | null; phone: string | null } | null; }

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").select("id,status,total,created_at,customers(full_name,phone)").order("created_at", { ascending: false }).limit(50);
  const orders = (data ?? []) as unknown as OrderRow[];
  return <section><header className="mb-7"><p className="mb-2 text-sm text-[var(--gold)]">Operations</p><h1 className="text-3xl font-semibold tracking-tight">Orders</h1><p className="mt-2 text-sm text-[var(--muted)]">Recent order lifecycle from PostgreSQL.</p></header>{error?<p className="text-sm text-red-700">Could not load orders.</p>:<div className="grid gap-3">{orders.length===0?<div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-8 text-sm text-[var(--muted)]">No orders yet.</div>:orders.map(order=><article key={order.id} className="flex flex-col gap-3 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="font-medium">#{order.id.slice(0,8)}</div><div className="mt-1 text-xs text-[var(--muted)]">{order.customers?.full_name||order.customers?.phone||"Guest customer"} · {new Date(order.created_at).toLocaleString("ru-RU")}</div></div><div className="flex items-center gap-5 text-sm"><span className="rounded-full border border-[var(--line)] px-3 py-1.5 text-xs">{order.status}</span><span className="font-medium">{Number(order.total).toFixed(2)} TJS</span></div></article>)}</div>}</section>;
}