"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) setError(authError.message); else router.push("/dashboard");
    setLoading(false);
  }
  return <main className="flex min-h-screen items-center justify-center px-5"><form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-[var(--line)] bg-[var(--card)] p-7 shadow-sm"><h1 className="text-2xl font-semibold tracking-tight">AI Store</h1><p className="mt-2 text-sm text-[var(--muted)]">Sign in to your workspace.</p><div className="mt-7 space-y-4"><input aria-label="Email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"/><input aria-label="Password" type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"/></div>{error&&<p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}<button disabled={loading} className="mt-5 w-full rounded-xl bg-[#1f1a14] px-4 py-3 text-sm font-medium text-white disabled:opacity-50">{loading?"Signing in…":"Sign in"}</button></form></main>;
}