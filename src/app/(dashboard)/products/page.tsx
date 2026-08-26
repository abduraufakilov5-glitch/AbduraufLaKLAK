import { createClient } from "@/lib/supabase/server";
import { ProductCreate } from "@/components/product-create";

interface VariantRow { id: string; sku: string; color: string | null; material: string | null; size: string | null; selling_price: number; quantity: number; minimum_quantity: number; }
interface ProductRow { id: string; name: string; slug: string; active: boolean; categories: { name: string } | null; product_variants: VariantRow[]; }

export default async function ProductsPage() {
  const supabase = await createClient();
  const [{ data, error }, { data: categories }] = await Promise.all([
    supabase.from("products").select("id,name,slug,active,categories(name),product_variants(id,sku,color,material,size,selling_price,quantity,minimum_quantity)").order("created_at", { ascending: false }).limit(100),
    supabase.from("categories").select("id,name").order("name")
  ]);
  const products = (data ?? []) as unknown as ProductRow[];
  return <section><header className="mb-7"><p className="mb-2 text-sm text-[var(--gold)]">Catalog</p><h1 className="text-3xl font-semibold tracking-tight">Products</h1><p className="mt-2 text-sm text-[var(--muted)]">Real catalog data with SKU-level inventory.</p></header><div className="mb-6"><ProductCreate categories={(categories ?? []) as Array<{id:string;name:string}>}/></div>{error?<p className="text-sm text-red-700">Could not load products.</p>:<div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)]"><div className="divide-y divide-[var(--line)]">{products.length===0?<div className="p-8 text-sm text-[var(--muted)]">No products yet.</div>:products.map(product=>{const units=product.product_variants.reduce((sum,v)=>sum+v.quantity,0);const low=product.product_variants.filter(v=>v.quantity>0&&v.quantity<=v.minimum_quantity).length;return <article key={product.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="font-medium">{product.name}</div><div className="mt-1 text-xs text-[var(--muted)]">{product.categories?.name??"Uncategorized"} · {product.slug}</div></div><div className="flex gap-5 text-right text-xs"><div><div className="text-[var(--muted)]">SKUs</div><div className="mt-1 font-medium">{product.product_variants.length}</div></div><div><div className="text-[var(--muted)]">Units</div><div className="mt-1 font-medium">{units}</div></div><div><div className="text-[var(--muted)]">Low</div><div className="mt-1 font-medium">{low}</div></div><div><div className="text-[var(--muted)]">Status</div><div className="mt-1 font-medium">{product.active?"Active":"Draft"}</div></div></div></article>})}</div></div>}</section>;
}