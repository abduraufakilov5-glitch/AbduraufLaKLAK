"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export function RealtimeRefresh() {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel("ai-store-live").on("postgres_changes", { event: "*", schema: "public", table: "product_variants" }, () => router.refresh()).on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => router.refresh()).on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => router.refresh()).subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [router]);
  return null;
}