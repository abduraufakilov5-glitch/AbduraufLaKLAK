export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6" aria-label="Загрузка">
      <div className="space-y-3">
        <div className="h-3 w-20 rounded-full bg-[color:var(--line)]" />
        <div className="h-9 w-44 rounded-xl bg-[color:var(--line)]" />
        <div className="h-4 w-72 max-w-full rounded-lg bg-[color:var(--line)]" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
            <div className="size-9 rounded-xl bg-[color:var(--line)]" />
            <div className="mt-5 h-3 w-20 rounded-full bg-[color:var(--line)]" />
            <div className="mt-2 h-7 w-28 rounded-lg bg-[color:var(--line)]" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.4fr]">
        <div className="h-80 rounded-2xl border border-[var(--line)] bg-[var(--card)]" />
        <div className="h-80 rounded-2xl border border-[var(--line)] bg-[var(--card)]" />
      </div>
    </div>
  );
}
