import { createClient } from "@/lib/supabase/server";
import { ProductCreate } from "@/components/product-create";

interface VariantRow { id: string; sku: string; color: string | null; material: string | null; size: string | null; cost_price: number; selling_price: number; quantity: number; minimum_quantity: number; }
interface ProductRow { id: string; name: string; slug: string; active: boolean; instagram_text: string | null; marketplace_title: string | null; marketplace_description: string | null; image_prompt: string | null; categories: { name: string } | null; product_variants: VariantRow[]; product_images: { storage_path: string; kind: string }[]; }

export default async function ProductsPage() {
  const supabase = await createClient();
  const [{ data, error }, { data: categories }] = await Promise.all([
    supabase.from("products").select("id,name,slug,active,instagram_text,marketplace_title,marketplace_description,image_prompt,categories(name),product_variants(id,sku,color,material,size,cost_price,selling_price,quantity,minimum_quantity),product_images(storage_path,kind)").order("created_at", { ascending: false }).limit(100),
    supabase.from("categories").select("id,name").order("name"),
  ]);
  const products = (data ?? []) as unknown as ProductRow[];
  const withPreview = await Promise.all(products.map(async (product) => {
    const original = product.product_images.find((image) => image.kind === "original");
    if (!original) return { ...product, imageUrl: null };
    const { data: signed } = await supabase.storage.from("product-images").createSignedUrl(original.storage_path, 60 * 60);
    return { ...product, imageUrl: signed?.signedUrl ?? null };
  }));

  return <section className="animate-fade-in space-y-5 sm:space-y-6">
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-1.5 text-sm font-medium text-[var(--gold)]">Каталог</p><h1 className="text-[30px] font-semibold tracking-tight sm:text-4xl">Товары</h1><p className="mt-2 max-w-2xl text-sm leading-5 text-[var(--muted)]">Каждый платок — отдельная карточка с фото, ценой и актуальным остатком.</p></div><div className="w-fit rounded-full border border-[var(--line)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--muted)]">{products.length} товаров</div></header>
    <ProductCreate categories={(categories ?? []) as Array<{ id: string; name: string }>}/>
    {error ? <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 text-sm text-[var(--danger)]">Не удалось загрузить каталог.</div> : products.length === 0 ? <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--card)] p-10 text-center"><div className="text-4xl">🧣</div><h2 className="mt-4 font-semibold">Каталог пока пуст</h2><p className="mt-2 text-sm text-[var(--muted)]">Загрузи первый товар через AI Studio или добавь его вручную.</p></div> : <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{withPreview.map((product) => {
      const units = product.product_variants.reduce((sum, variant) => sum + Number(variant.quantity), 0);
      const cost = product.product_variants.length ? Math.min(...product.product_variants.map((variant) => Number(variant.cost_price))) : 0;
      const sell = product.product_variants.length ? Math.min(...product.product_variants.map((variant) => Number(variant.selling_price))) : 0;
      const low = product.product_variants.some((variant) => variant.quantity <= variant.minimum_quantity);
      return <article key={product.id} className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] shadow-[0_8px_24px_rgba(31,26,20,0.035)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(31,26,20,0.06)]">
        <div className="aspect-[4/3] bg-[color:var(--background)]">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-4xl">🧣</div>}</div>
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="truncate font-medium">{product.name}</h2><p className="mt-1 truncate text-xs text-[var(--muted)]">{product.categories?.name ?? "Без категории"}</p></div><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${low ? "bg-[color:var(--danger)]/10 text-[var(--danger)]" : "bg-[color:var(--background)]"}`}>{units} шт.</span></div>
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[var(--line)] pt-4 text-xs"><div><div className="text-[var(--muted)]">Себестоимость</div><div className="mt-1 font-medium">{cost.toLocaleString("ru-RU")} TJS</div></div><div><div className="text-[var(--muted)]">Продажа от</div><div className="mt-1 font-medium">{sell.toLocaleString("ru-RU")} TJS</div></div><div><div className="text-[var(--muted)]">SKU</div><div className="mt-1 font-medium">{product.product_variants.length}</div></div></div>
          <div className="mt-3 flex gap-2 text-xs"><span className="rounded-lg border border-[var(--line)] px-2.5 py-1.5">{product.marketplace_title ? "AI-контент готов" : "Контент не создан"}</span><span className="rounded-lg border border-[var(--line)] px-2.5 py-1.5">{product.active ? "Активен" : "Черновик"}</span></div>
        </div>
      </article>;
    })}</div>}
  </section>;
}
