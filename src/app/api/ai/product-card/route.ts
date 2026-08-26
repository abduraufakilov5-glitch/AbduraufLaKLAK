import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GeminiProvider } from "@/lib/ai/gemini";
import { productCardSchema } from "@/lib/ai/schema";
import { createClient } from "@/lib/supabase/server";

const MAX_REQUEST_BYTES = 10_000_000;
const inputSchema = z.object({ imageBase64: z.string().min(100).max(8_500_000), sourceImagePath: z.string().max(300).optional(), mimeType: z.enum(["image/jpeg","image/png","image/webp"]), category: z.string().min(1).max(100), material: z.string().max(100).optional(), color: z.string().max(100).optional(), size: z.string().max(100).optional(), price: z.number().nonnegative().optional() });

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["ADMIN","CONTENT_MANAGER"].includes(String(profile.role))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const allowed = await supabase.rpc("consume_ai_rate_limit", { p_limit: 5, p_window_seconds: 60 });
  if (allowed.error) return NextResponse.json({ error: "Rate limiter unavailable" }, { status: 503 });
  if (!allowed.data) return NextResponse.json({ error: "Too many AI requests" }, { status: 429, headers: { "Retry-After": "60" } });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  try {
    const generated = await new GeminiProvider().generateProductCard(parsed.data);
    const result = productCardSchema.safeParse(JSON.parse(String(generated)));
    if (!result.success) return NextResponse.json({ error: "AI output failed schema validation" }, { status: 502 });
    const { error } = await supabase.from("ai_generations").insert({ provider: "gemini", model: "gemini-3.7-flash", prompt_version: "product-card-v2", status: "completed", output: result.data, source_image_path: parsed.data.sourceImagePath ?? null, created_by: user.id });
    if (error) return NextResponse.json({ error: "Could not persist AI generation" }, { status: 500 });
    return NextResponse.json(result.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation failed";
    await supabase.from("ai_generations").insert({ provider: "gemini", model: "gemini-3.7-flash", prompt_version: "product-card-v2", status: "failed", error_message: message.slice(0,500), source_image_path: parsed.data.sourceImagePath ?? null, created_by: user.id });
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}