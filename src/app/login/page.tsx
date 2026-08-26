"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!data.user) {
        setError("Не удалось подтвердить авторизацию. Попробуйте ещё раз.");
        return;
      }

      // Force a full navigation so the browser sends the newly written
      // Supabase SSR cookies to the Next.js proxy before protected routes load.
      window.location.assign("/dashboard");
    } catch {
      setError("Не удалось выполнить вход. Проверьте подключение и попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-[var(--line)] bg-[var(--card)] p-7 shadow-sm"
      >
        <div className="mb-6">
          <div className="grid size-10 place-items-center rounded-xl bg-[var(--foreground)] text-sm font-semibold text-[var(--card)]">
            D
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Dilyas Shop</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Вход в рабочее пространство магазина.</p>
        </div>

        <div className="space-y-4">
          <input
            aria-label="Email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
          />
          <input
            aria-label="Пароль"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Пароль"
            className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-[var(--danger)]">
            {error}
          </p>
        )}

        <button
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-[var(--foreground)] px-4 py-3 text-sm font-medium text-[var(--background)] disabled:opacity-50"
        >
          {loading ? "Входим…" : "Войти"}
        </button>
      </form>
    </main>
  );
}
