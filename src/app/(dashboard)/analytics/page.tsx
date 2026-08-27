import {
  BarChart3,
  Boxes,
  DollarSign,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

interface ProfitRow {
  product_id: string;
  name: string;
  units_sold: number;
  revenue: number;
  cost: number;
  profit: number;
}

interface StockRow {
  variant_id: string;
  inventory_value: number;
  quantity: number;
  minimum_quantity: number;
}

interface Metric {
  label: string;
  value: string;
  Icon: LucideIcon;
}

function money(value: number) {
  return `${value.toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} TJS`;
}

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const [{ data: summary }, { data: products, error }] = await Promise.all([
    supabase
      .from("inventory_summary")
      .select("variant_id,inventory_value,quantity,minimum_quantity")
      .limit(1000),
    supabase
      .from("product_profitability")
      .select("product_id,name,units_sold,revenue,cost,profit")
      .order("profit", { ascending: false })
      .limit(10),
  ]);

  const stock = (summary ?? []) as StockRow[];
  const rows = (products ?? []) as unknown as ProfitRow[];

  const revenue = rows.reduce((sum, row) => sum + Number(row.revenue), 0);
  const cost = rows.reduce((sum, row) => sum + Number(row.cost), 0);
  const profit = rows.reduce((sum, row) => sum + Number(row.profit), 0);
  const units = stock.reduce((sum, row) => sum + Number(row.quantity), 0);
  const inventory = stock.reduce(
    (sum, row) => sum + Number(row.inventory_value),
    0,
  );

  const metrics: Metric[] = [
    {
      label: "Выручка",
      value: money(revenue),
      Icon: DollarSign,
    },
    {
      label: "Себестоимость",
      value: money(cost),
      Icon: Boxes,
    },
    {
      label: "Прибыль",
      value: money(profit),
      Icon: TrendingUp,
    },
    {
      label: "На складе",
      value: `${units} шт.`,
      Icon: BarChart3,
    },
  ];

  return (
    <section className="animate-fade-in space-y-6">
      <header>
        <p className="mb-2 text-sm font-medium text-[var(--gold)]">
          Показатели
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Аналитика
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Ключевые показатели магазина и самые прибыльные товары.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5"
          >
            <div className="grid size-9 place-items-center rounded-xl bg-[color:var(--background)]">
              <Icon size={17} />
            </div>

            <p className="mt-5 text-sm text-[var(--muted)]">{label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.4fr]">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Самые прибыльные</h2>
              <p className="mt-1 text-xs text-[var(--muted)]">
                По заказам, записанным в системе.
              </p>
            </div>
          </div>

          {error ? (
            <p className="mt-5 text-sm text-[var(--danger)]">
              Не удалось загрузить данные.
            </p>
          ) : rows.length === 0 ? (
            <div className="mt-6 rounded-xl bg-[color:var(--background)] p-6 text-center text-sm text-[var(--muted)]">
              Пока нет продаж — таблица заполнится после первых заказов.
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="border-b border-[var(--line)] text-xs text-[var(--muted)]">
                  <tr>
                    <th className="p-3 font-medium">Товар</th>
                    <th className="p-3 text-right font-medium">Продано</th>
                    <th className="p-3 text-right font-medium">Выручка</th>
                    <th className="p-3 text-right font-medium">Прибыль</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--line)]">
                  {rows.map((row) => (
                    <tr key={row.product_id}>
                      <td className="p-3 font-medium">{row.name}</td>
                      <td className="p-3 text-right">{row.units_sold}</td>
                      <td className="p-3 text-right">
                        {money(Number(row.revenue))}
                      </td>
                      <td className="p-3 text-right font-medium">
                        {money(Number(row.profit))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 sm:p-6">
          <p className="text-sm font-medium">Склад</p>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs text-[var(--muted)]">
                Стоимость остатков
              </p>
              <p className="mt-1 text-xl font-semibold">
                {money(inventory)}
              </p>
            </div>

            <div>
              <p className="text-xs text-[var(--muted)]">SKU</p>
              <p className="mt-1 text-xl font-semibold">{stock.length}</p>
            </div>

            <div>
              <p className="text-xs text-[var(--muted)]">
                Нуждаются в пополнении
              </p>
              <p className="mt-1 text-xl font-semibold">
                {
                  stock.filter(
                    (variant) =>
                      variant.quantity <= variant.minimum_quantity,
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
