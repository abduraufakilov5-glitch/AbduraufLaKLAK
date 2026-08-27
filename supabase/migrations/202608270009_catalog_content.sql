alter table public.products
  add column if not exists instagram_text text,
  add column if not exists marketplace_title text,
  add column if not exists marketplace_description text,
  add column if not exists image_prompt text;
