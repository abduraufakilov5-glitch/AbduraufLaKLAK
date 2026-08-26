import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({ variant_id: z.string().uuid(), type: z.enum(["stock_in","sale","return","correction","damaged","reserved"]), quantity: z.number().int().positive(), reference_id: z.string().uuid().nullable().optional(), note: z.string().trim().max(500).optional() });

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["ADMIN","WAREHOUSE_MANAGER"].includes(String(profile.role))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid movement" }, { status: 400 });
  const { data, error } = await supabase.rpc("apply_inventory_movement", { p_variant_id: parsed.data.variant_id, p_type: parsed.data.type, p_quantity: parsed.data.quantity, p_reference_id: parsed.data.reference_id ?? null, p_note: parsed.data.note ?? null });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await supabase.from("audit_logs").insert({ actor_id: user.id, action: `inventory.${parsed.data.type}`, entity_type: "product_variants", entity_id: parsed.data.variant_id, after_data: data });
  return NextResponse.json(data);
}
