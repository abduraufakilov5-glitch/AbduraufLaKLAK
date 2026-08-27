"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface InventoryMovementProps {
  variantId: string;
}

export function InventoryMovement({ variantId }: InventoryMovementProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"stock_in" | "sale">("stock_in");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

  async function submit() {
    const amount = Number(quantity);
    if (!Number.isInteger(amount) || amount <= 0) {
      alert("Введите положительное целое количество");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/inventory/movement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variant_id: variantId,
          type,
          quantity: amount,
          note: note.trim() || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось изменить остаток");
      setQuantity("");
      setNote("");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3">
      <div className="grid gap-2 sm:grid-cols-[1fr_100px_auto]">
        <select value={type} onChange={(event) => setType(event.target.value as typeof type)} className="rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm">
          <option value="stock_in">+ Приход</option>
          <option value="sale">− Продажа</option>
        </select>
        <input type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="Кол-во" className="rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm" />
        <button type="button" onClick={submit} disabled={loading} className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--background)] disabled:opacity-50">
          {loading ? "…" : "Изменить"}
        </button>
      </div>
      <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Например: пришло 5 шт. от поставщика" className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm" />
    </div>
  );
}
