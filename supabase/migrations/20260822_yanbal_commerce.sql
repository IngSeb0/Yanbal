alter table public.products
  add column if not exists brand text not null default 'Yumega',
  add column if not exists campaign_code text,
  add column if not exists slug text,
  add column if not exists benefits jsonb not null default '[]'::jsonb,
  add column if not exists search_keywords text not null default '',
  add column if not exists sort_order integer not null default 0;

alter table public.orders
  add column if not exists channel text not null default 'web',
  add column if not exists whatsapp_url text,
  add column if not exists mercado_pago_preference_id text,
  add column if not exists mercado_pago_payment_id text,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

alter table public.order_items
  add column if not exists image text,
  add column if not exists category text;

create table if not exists public.campaigns (
  id text primary key,
  name text not null,
  campaign_code text not null,
  starts_at date,
  ends_at date,
  status text not null default 'draft',
  catalog_url text,
  thumbnail_url text,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.catalog_uploads (
  id uuid primary key default gen_random_uuid(),
  campaign_id text references public.campaigns(id) on delete cascade,
  title text not null,
  file_name text not null,
  file_path text not null,
  public_url text not null,
  mime_type text not null,
  size_bytes integer not null default 0,
  page_count integer,
  status text not null default 'active',
  notes text not null default '',
  uploaded_at timestamptz not null default now()
);

create index if not exists products_brand_campaign_idx
  on public.products (brand, campaign_code, published, sort_order);

create index if not exists catalog_uploads_campaign_idx
  on public.catalog_uploads (campaign_id, status, uploaded_at desc);

insert into public.campaigns (id, name, campaign_code, starts_at, ends_at, status, notes)
values (
  'yanbal-c9-2026',
  'Yanbal Campaña 9 Colombia',
  'C9-2026',
  '2026-08-22',
  '2026-08-28',
  'active',
  'Campaña Yanbal C9 para Cúcuta y Bogotá con catálogo visible, ofertas semanales y carrito.'
)
on conflict (id) do update set
  name = excluded.name,
  campaign_code = excluded.campaign_code,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  status = excluded.status,
  notes = excluded.notes,
  updated_at = now();

insert into public.products (
  id, sku, name, category, price, inventory, sizes, colors, description,
  featured, published, promotion, promo_price, image, brand, campaign_code,
  slug, benefits, search_keywords, sort_order
)
values
  (
    'gaia-eternal',
    'YAN-C9-GAIA-ETERNAL',
    'GAIA Eternal',
    'Perfumes y colonias',
    121000,
    20,
    '[]',
    '[]',
    'Perfume femenino Yanbal con aroma luminoso y elegante para diario, oficina o regalo en Cúcuta y Bogotá.',
    true,
    true,
    true,
    121000,
    '/promos/gaia-eternal.webp',
    'Yanbal',
    'C9-2026',
    'gaia-eternal',
    '["Fragancia femenina", "Aroma elegante", "Buena opcion para regalo"]'::jsonb,
    'perfume yanbal femenino gaia eternal cucuta bogota regalo amor amistad',
    10
  ),
  (
    'gaia-parfum',
    'YAN-C9-GAIA-PARFUM',
    'GAIA',
    'Perfumes y colonias',
    121000,
    20,
    '[]',
    '[]',
    'Fragancia femenina sofisticada de Yanbal para uso personal o regalo especial en Bogotá y Cúcuta.',
    true,
    true,
    true,
    121000,
    '/promos/gaia-parfum.webp',
    'Yanbal',
    'C9-2026',
    'gaia-parfum',
    '["Toque sofisticado", "Perfume femenino", "Pedido rapido por WhatsApp"]'::jsonb,
    'perfume yanbal gaia parfum femenino sofisticado cucuta bogota',
    20
  ),
  (
    'bb-cream',
    'YAN-C9-BB-CREAM',
    'BB Cream',
    'Maquillaje',
    55000,
    20,
    '[]',
    '["Luz media"]',
    'BB Cream Yanbal para unificar tono, hidratar y matificar en un solo paso con efecto buena cara.',
    true,
    true,
    true,
    55000,
    '/promos/bb-cream.webp',
    'Yanbal',
    'C9-2026',
    'bb-cream',
    '["Hidrata y matifica", "SPF 25", "Efecto buena cara"]'::jsonb,
    'bb cream yanbal maquillaje piel grasa hidratante matificante cucuta bogota',
    30
  ),
  (
    'dulce-amor',
    'YAN-C9-DULCE-AMOR',
    'Dulce Amor',
    'Perfumes y colonias',
    78000,
    20,
    '[]',
    '[]',
    'Eau de Parfum Yanbal de edición limitada para regalar en Amor y Amistad.',
    true,
    true,
    true,
    78000,
    '/promos/dulce-amor.webp',
    'Yanbal',
    'C9-2026',
    'dulce-amor',
    '["Edicion limitada", "Ideal para regalar", "Eau de Parfum"]'::jsonb,
    'dulce amor yanbal perfume regalo amor amistad cucuta bogota',
    40
  ),
  (
    '43n-paralel',
    'YAN-C9-43N-PARALEL',
    '43N Paralel',
    'Mundo hombre',
    143000,
    20,
    '[]',
    '[]',
    'Perfume masculino Yanbal con carácter y presencia para regalo o uso personal.',
    true,
    true,
    true,
    143000,
    '/promos/43n-paralel.webp',
    'Yanbal',
    'C9-2026',
    '43n-paralel',
    '["Perfume masculino", "Aroma con caracter", "Buena duracion percibida"]'::jsonb,
    '43n paralel yanbal perfume masculino regalo hombre cucuta bogota',
    50
  ),
  (
    'dendur',
    'YAN-C9-DENDUR',
    'Dendur',
    'Mundo hombre',
    115000,
    20,
    '[]',
    '[]',
    'Eau de Parfum masculino intenso e impactante para ocasiones especiales.',
    true,
    true,
    true,
    115000,
    '/promos/dendur.webp',
    'Yanbal',
    'C9-2026',
    'dendur',
    '["Aroma intenso", "Eau de Parfum", "Para ocasiones especiales"]'::jsonb,
    'dendur yanbal perfume masculino intenso regalo hombre cucuta bogota',
    60
  ),
  (
    'total-block-sport-plus',
    'YAN-C9-TOTAL-BLOCK-SPORT-PLUS',
    'Total Block Sport Plus',
    'Protección solar',
    80000,
    20,
    '[]',
    '[]',
    'Protector solar Yanbal SPF 100 resistente al agua y al sudor, con textura ligera para deporte y clima cálido.',
    true,
    true,
    true,
    80000,
    '/promos/total-block-sport-plus.webp',
    'Yanbal',
    'C9-2026',
    'total-block-sport-plus',
    '["UVA, UVB, IR y luz azul", "Textura ligera", "No irrita los ojos"]'::jsonb,
    'protector solar yanbal spf 100 sport agua sudor cucuta bogota',
    70
  )
on conflict (id) do update set
  sku = excluded.sku,
  name = excluded.name,
  category = excluded.category,
  price = excluded.price,
  inventory = excluded.inventory,
  sizes = excluded.sizes,
  colors = excluded.colors,
  description = excluded.description,
  featured = excluded.featured,
  published = excluded.published,
  promotion = excluded.promotion,
  promo_price = excluded.promo_price,
  image = excluded.image,
  brand = excluded.brand,
  campaign_code = excluded.campaign_code,
  slug = excluded.slug,
  benefits = excluded.benefits,
  search_keywords = excluded.search_keywords,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'yanbal-catalogs',
  'yanbal-catalogs',
  true,
  52428800,
  array['application/pdf', 'image/webp', 'image/png', 'image/jpeg']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types,
  updated_at = now();

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.campaigns enable row level security;
alter table public.catalog_uploads enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.products, public.campaigns, public.catalog_uploads to anon, authenticated;
grant insert on public.orders, public.order_items to anon, authenticated;
grant usage, select on sequence public.order_items_id_seq to anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'products'
      and policyname = 'Public can view published Yanbal products'
  ) then
    create policy "Public can view published Yanbal products"
      on public.products
      for select
      to anon, authenticated
      using (published = true and brand = 'Yanbal');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'campaigns'
      and policyname = 'Public can view active Yanbal campaigns'
  ) then
    create policy "Public can view active Yanbal campaigns"
      on public.campaigns
      for select
      to anon, authenticated
      using (status = 'active');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'catalog_uploads'
      and policyname = 'Public can view active catalog uploads'
  ) then
    create policy "Public can view active catalog uploads"
      on public.catalog_uploads
      for select
      to anon, authenticated
      using (status = 'active');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'orders'
      and policyname = 'Public can create storefront orders'
  ) then
    create policy "Public can create storefront orders"
      on public.orders
      for insert
      to anon, authenticated
      with check (channel in ('web', 'whatsapp', 'mercadopago'));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'order_items'
      and policyname = 'Public can create storefront order items'
  ) then
    create policy "Public can create storefront order items"
      on public.order_items
      for insert
      to anon, authenticated
      with check (quantity > 0 and price >= 0);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'Public can read Yanbal catalog uploads'
  ) then
    create policy "Public can read Yanbal catalog uploads"
      on storage.objects
      for select
      to anon, authenticated
      using (bucket_id = 'yanbal-catalogs');
  end if;
end
$$;
