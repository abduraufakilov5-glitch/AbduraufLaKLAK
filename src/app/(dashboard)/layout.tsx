import { Sidebar } from "@/components/sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <div className="flex min-h-screen"><Sidebar/><main className="min-w-0 flex-1"><div className="mx-auto max-w-7xl p-5 sm:p-8">{children}</div></main></div>;
}