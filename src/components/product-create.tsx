"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Category { id: string; name: string }

export function ProductCreate({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({ name: "", category_id: "", sku: "", color: "", material: "", size: "", cost_price: "", selling_price: "", quantity: "0", minimum_quantity: "0", description: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) { setPreview(""); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const set = (key: keyof typeof form, value: string) => setForm((valueState) => ({ ...valueState, [key]: value }));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) { setError("Добавь фото товара"); return; }
    setBusy(true); setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const upload = await fetch("/api/uploads/product-image", { method: "POST", body: formData });
      const uploaded = await upload.json();
      if (!upload.ok) throw new Error(uploaded.error ?? "Не удалось загрузить фото");

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          category_id: form.category_id || null,
          description: form.description || undefined,
          image_path: uploaded.path,
          variant: {
            sku: form.sku,
            color: form.color || undefined,
            material: form.material || undefined,
            size: form.size || undefined,
            cost_price: Number(form.cost_price),
            selling_price: Number(form.selling_price),
            quantity: Number(form.quantity),
            minimum_quantity: Number(form.minimum_quantity),
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Не удалось создать товар");
      setForm({ name: "", category_id: "", sku: "", color: "", material: "", size: "", cost_price: "", selling_price: "", quantity: "0", minimum_quantity: "0", description: "" });
      setFile(null); setOpen(false); router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось создать товар");
    } finally { setBusy(false); }
  }

  const input = (label: string, key: keyof typeof form, type = "text", required = false) => (
    <label className="block text-xs font-medium text-[var(--muted)]">
      {label}{required && <span className="ml-1 text-[var(--gold)]">*</span>}
      <input required={required} type={type} min={type === "number" ? "0" : undefined} inputMode={type === "number" ? "decimal" : undefined} value={form[key]} onChange={(e) => set(key, e.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-3.5 py-3 text-[15px] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/10" />
    </label>
  );

  return <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] shadow-[0_8px_24px_rgba(31,26,20,0.035)]">
    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex min-h-[64px] w-full items-center justify-between gap-4 p-4 text-left sm:p-5">
      <div><h2 className="font-medium">Добавить товар</h2><p className="mt-1 text-xs leading-4 text-[var(--muted)]">Фото, характеристики, себестоимость и остаток.</p></div>
      <span className="shrink-0 rounded-xl bg-[var(--foreground)] px-3 py-2.5 text-xs font-medium text-[var(--background)]">{open ? "Закрыть" : "Добавить"}</span>
    </button>
    {open && <form onSubmit={submit} className="border-t border-[var(--line)] p-4 sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
        <div>
          <label className="block text-xs font-medium text-[var(--muted)]">Фото товара *</label>
          <div className="mt-1.5 overflow-hidden rounded-2xl border border-dashed border-[var(--line)] bg-[color:var(--background)]">
            {preview ? <img src={preview} alt="Предпросмотр товара" className="aspect-square w-full object-cover" /> : <div className="grid aspect-square place-items-center p-4 text-center text-xs text-[var(--muted)]">Мини-фото товара</div>}
            <label className="block cursor-pointer border-t border-[var(--line)] px-3 py-2.5 text-center text-xs font-medium">Выбрать фото<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {input("Название", "name", "text", true)}
          <label className="block text-xs font-medium text-[var(--muted)]">Категория<select value={form.category_id} onChange={(e) => set("category_id", e.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-3.5 py-3 text-[15px] outline-none"><option value="">Без категории</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          {input("SKU", "sku", "text", true)}
          {input("Цвет", "color")}
          {input("Материал", "material")}
          {input("Размер", "size")}
          {input("Себестоимость", "cost_price", "number", true)}
          {input("Цена продажи", "selling_price", "number", true)}
          {input("Количество", "quantity", "number", true)}
          {input("Минимальный остаток", "minimum_quantity", "number", true)}
        </div>
      </div>
      <label className="mt-4 block text-xs font-medium text-[var(--muted)]">Заметка / описание<textarea value={form.description} onChange={(e) => set("description", e.target.value)} className="mt-1.5 min-h-24 w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-3.5 py-3 text-[15px] outline-none focus:border-[var(--gold)]" placeholder="Можно оставить пустым — основной текст позже создаст AI." /></label>
      {error && <p role="alert" className="mt-3 rounded-xl bg-[color:var(--danger)]/10 px-3 py-2.5 text-sm text-[var(--danger)]">{error}</p>}
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setOpen(false)} className="min-h-11 rounded-xl border border-[var(--line)] px-4 py-2.5 text-sm">Отмена</button><button disabled={busy} className="min-h-11 rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-[var(--background)] disabled:opacity-50">{busy ? "Сохраняем…" : "Сохранить товар"}</button></div>
    </form>}
  </div>;
}
