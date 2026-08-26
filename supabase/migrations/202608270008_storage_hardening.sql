drop policy if exists product_images_write on storage.objects;
create policy product_images_write on storage.objects for insert with check(bucket_id='product-images' and public.current_role() in('ADMIN','CONTENT_MANAGER') and name like (auth.uid()::text || '/%'));
drop policy if exists ai_images_write on storage.objects;
create policy ai_images_write on storage.objects for insert with check(bucket_id='ai-generated' and public.current_role() in('ADMIN','CONTENT_MANAGER') and name like (auth.uid()::text || '/%'));
