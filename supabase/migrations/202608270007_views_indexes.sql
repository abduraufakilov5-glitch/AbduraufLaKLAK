alter view public.product_profitability set (security_invoker=true);
alter view public.inventory_summary set (security_invoker=true);
create index if not exists order_items_variant_idx on public.order_items(variant_id);
create index if not exists financial_transactions_created_idx on public.financial_transactions(created_at desc);
create index if not exists products_category_active_idx on public.products(category_id,active);
create index if not exists product_images_variant_idx on public.product_images(variant_id,sort_order);