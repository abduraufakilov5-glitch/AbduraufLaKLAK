"use client";

import { useState } from "react";

interface InventoryMovementProps {
  variantId: string;
}

export function InventoryMovement({ variantId }: InventoryMovementProps) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("stock_in");
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variantId,
          type,
          quantity: amount,
          note: note.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось изменить остаток");
      }

      setQuantity("");
      setNote("");
      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 rounded-2xl border border-black/10 bg-white p-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
        >
          <option value="stock_in">Приход</option>
          <option value="correction">Коррекция</option>
          <option value="damaged">Брак</option>
          <option value="return">Возврат</option>
        </select>

        <input
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          placeholder="Количество"
          className="rounded-xl border border-black/10 px-3 py-2 text-sm"
        />

        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Сохранение…" : "Изменить"}
        </button>
      </div>

      <input
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Комментарий (необязательно)"
        className="mt-3 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
      />
    </div>
  );
}
