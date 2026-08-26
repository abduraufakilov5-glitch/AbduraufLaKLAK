import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: { getAll: () => request.cookies.getAll(), setAll: (cookiesToSet) => { cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } },
  });
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  if (path.startsWith("/dashboard") || path.startsWith("/products") || path.startsWith("/inventory") || path.startsWith("/orders") || path.startsWith("/analytics") || path.startsWith("/ai-studio") || path.startsWith("/notifications") || path.startsWith("/settings")) {
    if (!user) return NextResponse.redirect(new URL("/login", request.url));
  }
  if (path === "/login" && user) return NextResponse.redirect(new URL("/dashboard", request.url));
  return response;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };