-- Separate tables preserve historical public.orders/public.order_items data.
-- This migration is forward-only: it never drops tables, columns, policies or data.
create table if not exists public.yanbal_orders (
  id text primary key,
  created_at timestamptz not null default now(),
  checkout_key text not null unique,
  access_hash text not null,
  status text not null default 'CREATED' check (status in ('CREATED','PAYMENT_PENDING','PAID','PROCESSING','ORDERED_FROM_YANBAL','SHIPPED','DELIVERED','CANCELLED','REFUNDED')),
  customer jsonb not null,
  items jsonb not null check (jsonb_array_length(items) between 1 and 50),
  subtotal bigint not null check (subtotal > 0),
  shipping bigint not null check (shipping >= 0),
  total bigint not null check (total = subtotal + shipping),
  attribution jsonb not null default '{}',
  preference_id text,
  payment_id text unique,
  payment_status text not null default 'created',
  purchase_claimed_at timestamptz
);

-- If a previous partial installation created the table, complete it incrementally.
alter table public.yanbal_orders
  add column if not exists id text,
  add column if not exists created_at timestamptz default now(),
  add column if not exists checkout_key text,
  add column if not exists access_hash text,
  add column if not exists status text default 'CREATED',
  add column if not exists customer jsonb,
  add column if not exists items jsonb,
  add column if not exists subtotal bigint,
  add column if not exists shipping bigint,
  add column if not exists total bigint,
  add column if not exists attribution jsonb default '{}',
  add column if not exists preference_id text,
  add column if not exists payment_id text,
  add column if not exists payment_status text default 'created',
  add column if not exists purchase_claimed_at timestamptz;

-- These indexes also provide the conflict targets used by the API. Creation fails
-- safely, without changing data, if an unexpected partial schema contains duplicates.
create unique index if not exists yanbal_orders_pkey on public.yanbal_orders(id);
create unique index if not exists yanbal_orders_checkout_key_key on public.yanbal_orders(checkout_key);
create unique index if not exists yanbal_orders_payment_id_key on public.yanbal_orders(payment_id);

create table if not exists public.yanbal_payment_events (
  payment_id text primary key,
  order_id text not null references public.yanbal_orders(id),
  status text not null,
  updated_at timestamptz not null
);
alter table public.yanbal_payment_events
  add column if not exists payment_id text,
  add column if not exists order_id text,
  add column if not exists status text,
  add column if not exists updated_at timestamptz;
create unique index if not exists yanbal_payment_events_pkey on public.yanbal_payment_events(payment_id);
create index if not exists yanbal_payment_events_order_idx on public.yanbal_payment_events(order_id);

alter table public.yanbal_orders alter column created_at set default now();
alter table public.yanbal_orders alter column status set default 'CREATED';
alter table public.yanbal_orders alter column attribution set default '{}';
alter table public.yanbal_orders alter column payment_status set default 'created';

do $$
begin
  if not exists (select 1 from pg_constraint where conname='yanbal_orders_required_check' and conrelid='public.yanbal_orders'::regclass) then
    alter table public.yanbal_orders add constraint yanbal_orders_required_check check (
      id is not null and created_at is not null and checkout_key is not null and
      access_hash is not null and status is not null and customer is not null and
      items is not null and subtotal is not null and shipping is not null and
      total is not null and attribution is not null and payment_status is not null
    ) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname='yanbal_orders_values_check' and conrelid='public.yanbal_orders'::regclass) then
    alter table public.yanbal_orders add constraint yanbal_orders_values_check check (
      status in ('CREATED','PAYMENT_PENDING','PAID','PROCESSING','ORDERED_FROM_YANBAL','SHIPPED','DELIVERED','CANCELLED','REFUNDED') and
      jsonb_typeof(items)='array' and jsonb_array_length(items) between 1 and 50 and
      subtotal > 0 and shipping >= 0 and total = subtotal + shipping
    ) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname='yanbal_payment_events_order_id_fkey' and conrelid='public.yanbal_payment_events'::regclass) then
    alter table public.yanbal_payment_events add constraint yanbal_payment_events_order_id_fkey
      foreign key (order_id) references public.yanbal_orders(id) not valid;
  end if;
end $$;
alter table public.yanbal_orders enable row level security;
alter table public.yanbal_payment_events enable row level security;
revoke all on public.yanbal_orders, public.yanbal_payment_events from public, anon, authenticated;
grant all on public.yanbal_orders, public.yanbal_payment_events to service_role;

create or replace function public.yanbal_create_order(p_order jsonb) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare inserted_id text;
begin
  insert into public.yanbal_orders(id,checkout_key,access_hash,customer,items,subtotal,shipping,total,attribution)
  values(p_order->>'id',p_order->>'checkout_key',p_order->>'access_hash',p_order->'customer',p_order->'items',(p_order->>'subtotal')::bigint,(p_order->>'shipping')::bigint,(p_order->>'total')::bigint,p_order->'attribution')
  on conflict(checkout_key) do nothing returning id into inserted_id;
  return jsonb_build_object('created',inserted_id is not null);
end $$;

create or replace function public.yanbal_apply_payment(p_order_id text,p_payment_id text,p_status text,p_updated timestamptz) returns void
language plpgsql security invoker set search_path = '' as $$
declare o public.yanbal_orders; prior public.yanbal_payment_events;
begin
  select * into o from public.yanbal_orders where id=p_order_id for update;
  if not found then raise exception 'Order missing'; end if;
  select * into prior from public.yanbal_payment_events where payment_id=p_payment_id;
  if found and (prior.order_id <> p_order_id or prior.updated_at >= p_updated) then return; end if;
  insert into public.yanbal_payment_events values(p_payment_id,p_order_id,p_status,p_updated)
  on conflict(payment_id) do update set status=excluded.status,updated_at=excluded.updated_at;
  -- A rejected second attempt must never undo an already approved payment.
  if o.payment_status in ('approved','refunded','charged_back') and o.payment_id <> p_payment_id then return; end if;
  if o.payment_status in ('refunded','charged_back') then return; end if;
  if o.payment_status='approved' and p_status not in ('approved','refunded','charged_back') then return; end if;
  update public.yanbal_orders set payment_id=p_payment_id,payment_status=p_status,
    status=case
      when p_status='approved' then case when o.status in ('PROCESSING','ORDERED_FROM_YANBAL','SHIPPED','DELIVERED') then o.status else 'PAID' end
      when p_status in ('refunded','charged_back') then 'REFUNDED'
      when p_status='cancelled' then 'CANCELLED'
      else 'PAYMENT_PENDING' end
  where id=p_order_id;
end $$;

create or replace function public.yanbal_claim_purchase(p_order_id text) returns boolean
language plpgsql security invoker set search_path = '' as $$
begin
  update public.yanbal_orders set purchase_claimed_at=now()
  where id=p_order_id and payment_status='approved' and purchase_claimed_at is null;
  return found;
end $$;
revoke all on function public.yanbal_create_order(jsonb) from public,anon,authenticated;
revoke all on function public.yanbal_apply_payment(text,text,text,timestamptz) from public,anon,authenticated;
revoke all on function public.yanbal_claim_purchase(text) from public,anon,authenticated;
grant execute on function public.yanbal_create_order(jsonb) to service_role;
grant execute on function public.yanbal_apply_payment(text,text,text,timestamptz) to service_role;
grant execute on function public.yanbal_claim_purchase(text) to service_role;
