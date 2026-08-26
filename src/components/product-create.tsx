"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ProductCreate() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", slug: "", category_id: "", sku: "", color: "", material: "", size: "", cost_price: "", selling_price: "", quantity: "0", minimum_quantity: "0", description: "" });
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  function set(key: keyof typeof form, value: string) { setForm(v => ({ ...v, [key]: value })); }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const res = await fetch("/api/products", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: form.name, slug: form.slug, category_id: form.category_id || null, description: form.description || undefined, variant: { sku: form.sku, color: form.color || undefined, material: form.material || undefined, size: form.size || undefined, cost_price: Number(form.cost_price), selling_price: Number(form.selling_price), quantity: Number(form.quantity), minimum_quantity: Number(form.minimum_quantity) } }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error ?? "Could not create product");
      setForm({ name:"",slug:"",category_id:"",sku:"",color:"",material:"",size:"",cost_price:"",selling_price:"",quantity:"0",minimum_quantity:"0",description:"" });
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not create product"); } finally { setBusy(false); }
  }
  const field = (label:string,key:keyof typeof form,type="text",placeholder="") => <label className="block text-xs font-medium text-[var(--muted)]">{label}<input required={!['color','material','size','description','category_id'].includes(key)} type={type} value={form[key]} onChange={e=>set(key,e.target.value)} placeholder={placeholder} className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-black/10" /></label>;
  return <form onSubmit={submit} className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{field("Product name","name", "text", "Silk scarf")}{field("Slug","slug", "text", "silk-scarf")}{field("Category ID","category_id", "text", "Optional UUID")}{field("SKU","sku","text","SCF-001")}{field("Color","color","text","Black")}{field("Material","material","text","Silk")}{field("Size","size","text","90×90")}{field("Cost price","cost_price","number","0.00")}{field("Selling price","selling_price","number","0.00")}{field("Quantity","quantity","number","0")}{field("Minimum quantity","minimum_quantity","number","0")}</div><label className="mt-3 block text-xs font-medium text-[var(--muted)]">Description<textarea value={form.description} onChange={e=>set("description",e.target.value)} className="mt-1.5 min-h-24 w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10" /></label>{error&&<p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}<button disabled={busy} className="mt-4 rounded-xl bg-[#1f1a14] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">{busy?"Creating…":"Add product"}</button></form>;
}
