import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MIME_EXTENSION: Record<string,string> = { "image/jpeg":"jpg", "image/png":"png", "image/webp":"webp" };

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["ADMIN","CONTENT_MANAGER"].includes(String(profile.role))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const form = await request.formData();
  const value = form.get("file");
  if (!(value instanceof File)) return NextResponse.json({ error: "Image file is required" }, { status: 400 });
  if (value.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Image exceeds 5 MB" }, { status: 413 });
  const extension = MIME_EXTENSION[value.type];
  if (!extension) return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  const path = `${user.id}/${randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("product-images").upload(path, value, { contentType: value.type, upsert: false });
  if (error) return NextResponse.json({ error: "Could not upload image" }, { status: 500 });
  return NextResponse.json({ path });
}