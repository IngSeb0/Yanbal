-- Supporting indexes for foreign keys used by order joins and cascades.
-- This migration is additive and safe for existing storefront data.
create index if not exists order_items_order_id_idx
  on public.order_items (order_id);

create index if not exists order_items_product_id_idx
  on public.order_items (product_id);

