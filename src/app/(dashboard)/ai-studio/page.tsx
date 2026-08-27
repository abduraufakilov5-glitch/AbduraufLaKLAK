"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ChevronRight, Copy, ImagePlus, Sparkles } from "lucide-react";

interface ProductCard { instagram_text: string; marketplace_title: string; marketplace_description: string; image_prompt: string }

type Step = 1 | 2 | 3 | 4;
function makeSku() { return `DS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`; }

export default function AIStudioPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Платок");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [minimumQuantity, setMinimumQuantity] = useState("1");
  const [uploadedPath, setUploadedPath] = useState("");
  const [result, setResult] = useState<ProductCard | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (!file) { setPreview(""); return; }
    const url = URL.createObjectURL(file); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function resetFromPhoto() { setUploadedPath(""); setResult(null); setSaved(false); setError(""); setStep(1); }

  async function uploadPhoto() {
    if (!file) throw new Error("Добавь фото товара");
    if (file.size > 5 * 1024 * 1024) throw new Error("Фото должно быть меньше 5 МБ");
    const form = new FormData(); form.append("file", file);
    const response = await fetch("/api/uploads/product-image", { method: "POST", body: form });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Не удалось загрузить фото");
    setUploadedPath(data.path); return data.path as string;
  }

  async function generate() {
    setLoading(true); setError("");
    try {
      const path = uploadedPath || await uploadPhoto();
      const imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(",")[1] ?? ""); reader.onerror = () => reject(new Error("Не удалось прочитать фото")); reader.readAsDataURL(file!);
      });
      const response = await fetch("/api/ai/product-card", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageBase64, sourceImagePath: path, mimeType: file!.type, name, category, material: material || undefined, color: color || undefined, size: size || undefined, sellingPrice: sellingPrice ? Number(sellingPrice) : undefined }),
      });
      const data = await response.json(); if (!response.ok) throw new Error(data.error ?? "Не удалось создать контент");
      setResult(data as ProductCard); setStep(4);
    } catch (e) { setError(e instanceof Error ? e.message : "Ошибка генерации"); }
    finally { setLoading(false); }
  }

  async function saveProduct() {
    if (!result || !uploadedPath) return;
    setSaving(true); setError("");
    try {
      const response = await fetch("/api/products", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, category_name: category, image_path: uploadedPath, marketplace_title: result.marketplace_title, marketplace_description: result.marketplace_description, instagram_text: result.instagram_text, image_prompt: result.image_prompt, variant: { sku: makeSku(), color: color || undefined, material: material || undefined, size: size || undefined, cost_price: Number(costPrice || 0), selling_price: Number(sellingPrice || 0), quantity: Number(quantity || 0), minimum_quantity: Number(minimumQuantity || 0) } }),
      });
      const data = await response.json(); if (!response.ok) throw new Error(data.error ?? "Не удалось сохранить товар");
      setSaved(true); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Не удалось сохранить товар"); }
    finally { setSaving(false); }
  }

  async function copyText(label: string, text: string) {
    try { await navigator.clipboard.writeText(text); setCopied(label); window.setTimeout(() => setCopied(""), 1400); } catch { setCopied(""); }
  }

  const input = (label: string, value: string, setter: (value: string) => void, placeholder: string, type = "text") => (
    <label className="block"><span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">{label}</span><input type={type} inputMode={type === "number" ? "decimal" : undefined} value={value} onChange={event => setter(event.target.value)} placeholder={placeholder} min={type === "number" ? "0" : undefined} className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3.5 py-3 text-[16px] leading-5 outline-none transition focus:border-[var(--rose-400)] focus:ring-0" /></label>
  );

  const stepLabel = step === 1 ? "Фото" : step === 2 ? "Данные" : step === 3 ? "Цена" : "Результат";

  return (
    <section className="mobile-create-page animate-fade-in">
      <header className="mobile-create-header">
        <button type="button" onClick={() => step > 1 ? setStep((step - 1) as Step) : router.push("/dashboard")} className="mobile-back-button" aria-label="Назад"><ArrowLeft size={20}/></button>
        <div className="min-w-0"><p className="text-[11px] font-medium text-[var(--rose-600)]">Новый товар</p><h1 className="truncate text-[20px] font650 tracking-tight">{stepLabel}</h1></div>
        <span className="mobile-step-counter">{step}/4</span>
      </header>

      <div className="mobile-stepper" aria-label="Прогресс создания товара">
        {[1,2,3,4].map(value => <span key={value} className={`mobile-step-dot ${value <= step ? "is-done" : ""} ${value === step ? "is-current" : ""}`}/>) }
      </div>

      {step === 1 && (
        <div className="mobile-create-flow">
          <div className="mobile-hero-copy"><p className="text-[13px] font-medium text-[var(--muted)]">Шаг 1</p><h2 className="mt-1 text-[28px] font-bold tracking-[-.04em]">Сфотографируй товар</h2><p className="mt-2 text-[14px] leading-5 text-[var(--muted)]">Одно хорошее фото — и Gemini подготовит всё остальное.</p></div>
          <label className="mobile-photo-picker">
            {preview ? <img src={preview} alt="Фото товара" className="mobile-photo-picker__image"/> : <div className="mobile-photo-picker__empty"><span className="mobile-photo-picker__icon"><ImagePlus size={28}/></span><strong>Добавить фото</strong><span>Камера или медиатека</span></div>}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={event => { setFile(event.target.files?.[0] ?? null); resetFromPhoto(); }}/>
          </label>
          {preview && <label className="mobile-photo-change">Заменить фото<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={event => { setFile(event.target.files?.[0] ?? null); resetFromPhoto(); }}/></label>}
          {error && <p className="mobile-error">{error}</p>}
          <button type="button" disabled={!file} onClick={() => setStep(2)} className="mobile-primary-button">Продолжить <ChevronRight size={18}/></button>
        </div>
      )}

      {step === 2 && (
        <div className="mobile-create-flow">
          <div className="mobile-hero-copy"><p className="text-[13px] font-medium text-[var(--muted)]">Шаг 2</p><h2 className="mt-1 text-[27px] font-bold tracking-[-.04em]">Что это за товар?</h2><p className="mt-2 text-[14px] leading-5 text-[var(--muted)]">Введи только то, что знаешь. Неизвестное Gemini не будет выдумывать.</p></div>
          <div className="mobile-form-card">
            {input("Название", name, setName, "Шёлковый платок")}
            {input("Категория", category, setCategory, "Платок")}
            {input("Материал", material, setMaterial, "Шёлк")}
            {input("Цвет", color, setColor, "Молочный")}
            {input("Размер", size, setSize, "70×70 см")}
          </div>
          {error && <p className="mobile-error">{error}</p>}
          <button type="button" disabled={!name.trim()} onClick={() => setStep(3)} className="mobile-primary-button">Дальше <ChevronRight size={18}/></button>
        </div>
      )}

      {step === 3 && (
        <div className="mobile-create-flow">
          <div className="mobile-hero-copy"><p className="text-[13px] font-medium text-[var(--muted)]">Шаг 3</p><h2 className="mt-1 text-[27px] font-bold tracking-[-.04em]">Цена и остаток</h2><p className="mt-2 text-[14px] leading-5 text-[var(--muted)]">Эти данные сохранятся вместе с товаром и помогут следить за прибылью.</p></div>
          <div className="mobile-form-card">
            {input("Себестоимость, TJS", costPrice, setCostPrice, "35", "number")}
            {input("Цена продажи, TJS", sellingPrice, setSellingPrice, "65", "number")}
            {input("Количество, шт.", quantity, setQuantity, "5", "number")}
            {input("Минимальный остаток", minimumQuantity, setMinimumQuantity, "1", "number")}
            <div className="mobile-profit-preview"><span>Прибыль с единицы</span><strong>{Math.max(0, Number(sellingPrice || 0) - Number(costPrice || 0)).toLocaleString("ru-RU")} TJS</strong></div>
          </div>
          {error && <p className="mobile-error">{error}</p>}
          <button type="button" disabled={!sellingPrice || loading} onClick={() => void generate()} className="mobile-primary-button">{loading ? <><span className="mobile-spinner"/> Gemini создаёт…</> : <><Sparkles size={18}/> Создать контент</>}</button>
        </div>
      )}

      {step === 4 && result && (
        <div className="mobile-create-flow mobile-result-flow">
          <div className="mobile-result-hero"><span className="mobile-success-icon"><Check size={19}/></span><div><p className="text-[13px] font-semibold">Готово</p><p className="mt-0.5 text-xs text-[var(--muted)]">Gemini подготовил контент для товара</p></div></div>
          {[ ["Instagram", result.instagram_text], ["Lak Lak — заголовок", result.marketplace_title], ["Lak Lak — описание", result.marketplace_description], ["Промпт для изображения", result.image_prompt] ].map(([label, text]) => <article key={label} className="mobile-result-card"><div className="flex items-center justify-between gap-3"><h3>{label}</h3><button type="button" onClick={() => void copyText(label, text)} className="mobile-copy-button">{copied === label ? <><Check size={14}/> Скопировано</> : <><Copy size={14}/> Копировать</>}</button></div><p>{text}</p></article>)}
          {error && <p className="mobile-error">{error}</p>}
          <div className="mobile-save-bar"><div><p className="text-sm font-semibold">Добавить в каталог</p><p className="mt-0.5 text-xs text-[var(--muted)]">Фото, цена, остаток и AI-контент</p></div><button type="button" disabled={saving || saved} onClick={() => void saveProduct()}>{saved ? "Сохранено ✓" : saving ? "Сохраняю…" : "Сохранить"}</button></div>
        </div>
      )}
    </section>
  );
}
