import { MobileNav } from "@/components/mobile-nav";
import { RealtimeRefresh } from "@/components/realtime-refresh";
import { Sidebar } from "@/components/sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <MobileNav />
        <RealtimeRefresh />
        <div className="mx-auto w-full max-w-7xl px-4 pb-[104px] pt-4 sm:p-8 sm:pb-10 md:pb-10">{children}</div>
      </main>
    </div>
  );
}
