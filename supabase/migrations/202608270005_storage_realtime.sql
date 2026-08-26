insert into storage.buckets(id,name,public) values('product-images','product-images',false),('ai-generated','ai-generated',false) on conflict(id) do nothing;
create policy product_images_read on storage.objects for select using(bucket_id='product-images' and auth.uid() is not null);
create policy product_images_write on storage.objects for insert with check(bucket_id='product-images' and public.current_role() in('ADMIN','CONTENT_MANAGER'));
create policy ai_images_read on storage.objects for select using(bucket_id='ai-generated' and auth.uid() is not null);
create policy ai_images_write on storage.objects for insert with check(bucket_id='ai-generated' and public.current_role() in('ADMIN','CONTENT_MANAGER'));

alter publication supabase_realtime add table public.product_variants;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.orders;