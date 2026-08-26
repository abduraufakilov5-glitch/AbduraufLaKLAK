import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GeminiProvider } from "@/lib/ai/gemini";
import { productCardSchema } from "@/lib/ai/schema";
import { createClient } from "@/lib/supabase/server";

const inputSchema = z.object({ imageBase64: z.string().min(100).max(12_000_000), mimeType: z.enum(["image/jpeg","image/png","image/webp"]), category: z.string().min(1).max(100), material: z.string().max(100).optional(), color: z.string().max(100).optional(), size: z.string().max(100).optional(), price: z.number().nonnegative().optional() });

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["ADMIN","CONTENT_MANAGER"].includes(String(profile.role))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = inputSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  try {
    const provider = new GeminiProvider();
    const raw = await provider.generateProductCard(parsed.data);
    const json = typeof raw === "string" ? JSON.parse(raw) : raw;
    const result = productCardSchema.safeParse(json);
    if (!result.success) return NextResponse.json({ error: "AI output failed schema validation" }, { status: 502 });
    await supabase.from("ai_generations").insert({ provider: "gemini", model: "gemini-3.7-flash", prompt_version: "product-card-v1", status: "completed", output: result.data, created_by: user.id });
    return NextResponse.json(result.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation failed";
    await supabase.from("ai_generations").insert({ provider: "gemini", model: "gemini-3.7-flash", prompt_version: "product-card-v1", status: "failed", error_message: message.slice(0,500), created_by: user.id });
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}