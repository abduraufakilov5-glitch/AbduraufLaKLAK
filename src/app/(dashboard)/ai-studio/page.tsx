"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProductCard { instagram_text: string; marketplace_title: string; marketplace_description: string; image_prompt: string }

function makeSku() { return `DS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`; }

export default function AIStudioPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Платок");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [minimumQuantity, setMinimumQuantity] = useState("1");
  const [uploadedPath, setUploadedPath] = useState("");
  const [result, setResult] = useState<ProductCard | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!file) { setPreview(""); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function resetResult() { setResult(null); setUploadedPath(""); setSaved(false); setError(""); }

  async function uploadPhoto() {
    if (!file) throw new Error("Выбери фото товара");
    if (file.size > 5 * 1024 * 1024) throw new Error("Фото должно быть меньше 5 МБ");
    const form = new FormData(); form.append("file", file);
    const response = await fetch("/api/uploads/product-image", { method: "POST", body: form });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Не удалось загрузить фото");
    setUploadedPath(data.path);
    return data.path as string;
  }

  async function generate() {
    setLoading(true); setError(""); setSaved(false);
    try {
      const path = uploadedPath || await uploadPhoto();
      const imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
        reader.onerror = () => reject(new Error("Не удалось прочитать фото"));
        reader.readAsDataURL(file!);
      });
      const response = await fetch("/api/ai/product-card", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageBase64, sourceImagePath: path, mimeType: file!.type, name, category, material: material || undefined, color: color || undefined, size: size || undefined, sellingPrice: sellingPrice ? Number(sellingPrice) : undefined }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Не удалось создать контент");
      setResult(data as ProductCard);
    } catch (e) { setError(e instanceof Error ? e.message : "Ошибка генерации"); }
    finally { setLoading(false); }
  }

  async function saveProduct() {
    if (!result || !uploadedPath) return;
    setSaving(true); setError("");
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          category_name: category,
          image_path: uploadedPath,
          marketplace_title: result.marketplace_title,
          marketplace_description: result.marketplace_description,
          instagram_text: result.instagram_text,
          image_prompt: result.image_prompt,
          variant: { sku: makeSku(), color: color || undefined, material: material || undefined, size: size || undefined, cost_price: Number(costPrice || 0), selling_price: Number(sellingPrice || 0), quantity: Number(quantity || 0), minimum_quantity: Number(minimumQuantity || 0) },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Не удалось сохранить товар");
      setSaved(true); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Не удалось сохранить товар"); }
    finally { setSaving(false); }
  }

  const field = (label: string, value: string, setter: (value: string) => void, placeholder: string, type = "text") => <label className="block text-xs font-medium text-[var(--muted)]">{label}<input type={type} value={value} onChange={(event) => setter(event.target.value)} placeholder={placeholder} min={type === "number" ? "0" : undefined} className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--gold)]" /></label>;
  const copy = async (text: string) => { await navigator.clipboard.writeText(text); };

  return <section className="animate-fade-in space-y-6">
    <header><p className="mb-2 text-sm font-medium text-[var(--gold)]">AI Studio</p><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Создать товар</h1><p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">Фото + характеристики → готовый текст для Instagram, карточка для Lak Lak и промпт для отдельного генератора изображений.</p></header>
    <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-6">
        <div className="overflow-hidden rounded-2xl border border-dashed border-[var(--line)] bg-[color:var(--background)]">
          {preview ? <img src={preview} alt="Фото товара" className="aspect-square w-full object-cover" /> : <div className="grid aspect-square place-items-center p-8 text-center"><div><div className="text-4xl">📷</div><p className="mt-3 text-sm font-medium">Фото товара</p><p className="mt-1 text-xs text-[var(--muted)]">JPG, PNG или WebP · до 5 МБ</p></div></div>}
          <label className="block cursor-pointer border-t border-[var(--line)] px-4 py-3 text-center text-xs font-medium">{file ? "Заменить фото" : "Выбрать фото"}<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { setFile(event.target.files?.[0] ?? null); resetResult(); }} /></label>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">{field("Название", name, setName, "Шёлковый платок")}{field("Категория", category, setCategory, "Платок")}{field("Материал", material, setMaterial, "Шёлк")}{field("Цвет", color, setColor, "Молочный")}{field("Размер", size, setSize, "70×70 см")}{field("Себестоимость", costPrice, setCostPrice, "35", "number")}{field("Цена продажи", sellingPrice, setSellingPrice, "65", "number")}{field("Количество", quantity, setQuantity, "5", "number")}{field("Минимальный остаток", minimumQuantity, setMinimumQuantity, "1", "number")}</div>
        {error && <p role="alert" className="mt-4 rounded-xl bg-[color:var(--danger)]/10 px-3 py-2.5 text-xs text-[var(--danger)]">{error}</p>}
        <button disabled={!file || !name.trim() || loading || saving} onClick={() => void generate()} className="mt-5 w-full rounded-xl bg-[var(--foreground)] px-4 py-3 text-sm font-medium text-[var(--background)] transition hover:opacity-90 disabled:opacity-40">{loading ? "Gemini создаёт контент…" : "✨ Сгенерировать контент"}</button>
      </div>
      <div className="space-y-4">
        {!result ? <div className="flex min-h-[520px] items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[color:var(--background)] p-8 text-center"><div className="max-w-md"><div className="text-4xl">✦</div><h2 className="mt-4 font-semibold">Здесь появится результат Gemini</h2><p className="mt-2 text-sm text-[var(--muted)]">Сначала укажи название и параметры товара, потом сгенерируй четыре готовых блока.</p></div></div> : <>
          {[["Instagram", result.instagram_text], ["Lak Lak — заголовок", result.marketplace_title], ["Lak Lak — описание", result.marketplace_description], ["Промпт для генератора изображения", result.image_prompt]].map(([label, text]) => <div key={label} className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium">{label}</p><button type="button" onClick={() => void copy(text)} className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs font-medium">Копировать</button></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6">{text}</p></div>)}
          <div className="flex flex-col gap-2 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><p className="text-sm font-medium">Добавить в каталог</p><p className="mt-1 text-xs text-[var(--muted)]">Сохранит фото, остаток, себестоимость, цену и весь AI-контент.</p></div><button type="button" disabled={saving || saved} onClick={() => void saveProduct()} className="rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-[var(--background)] disabled:opacity-50">{saved ? "Сохранено ✓" : saving ? "Сохраняем…" : "Сохранить товар"}</button></div>
        </>}
      </div>
    </div>
  </section>;
}
