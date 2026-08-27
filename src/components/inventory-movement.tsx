"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface InventoryMovementProps { variantId: string; }

export function InventoryMovement({ variantId }: InventoryMovementProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"stock_in" | "sale">("stock_in");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

  async function submit() {
    const amount = Number(quantity);
    if (!Number.isInteger(amount) || amount <= 0) { alert("Введите положительное целое количество"); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/inventory/movement", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ variant_id: variantId, type, quantity: amount, note: note.trim() || undefined }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось изменить остаток");
      setQuantity(""); setNote(""); router.refresh();
    } catch (error) { alert(error instanceof Error ? error.message : "Произошла ошибка"); }
    finally { setLoading(false); }
  }

  return (
    <div className="mt-1 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 sm:w-auto">
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-[var(--surface-muted)] p-1">
        <button type="button" onClick={() => setType("stock_in")} className={`min-h-10 rounded-md px-3 text-xs font-medium transition ${type === "stock_in" ? "bg-[var(--surface)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted)]"}`}>+ Приход</button>
        <button type="button" onClick={() => setType("sale")} className={`min-h-10 rounded-md px-3 text-xs font-medium transition ${type === "sale" ? "bg-[var(--surface)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted)]"}`}>− Продажа</button>
      </div>
      <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
        <input aria-label="Количество" type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="Количество" className="min-h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-[16px] outline-none focus:border-[var(--gold)]" />
        <button type="button" onClick={submit} disabled={loading} className="min-h-11 rounded-xl bg-[var(--foreground)] px-4 text-sm font-semibold text-[var(--background)] disabled:opacity-50">{loading ? "…" : "Сохранить"}</button>
      </div>
      <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Комментарий (необязательно)" className="mt-2 min-h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-[16px] outline-none focus:border-[var(--gold)]" />
    </div>
  );
}
