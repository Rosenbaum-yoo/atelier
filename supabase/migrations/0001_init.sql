-- 0001_init.sql — Atelier core schema.
-- Multi-tenant (org_id on every business row) with Row Level Security enforced
-- from migration #1. Apply via `supabase db push` or the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- ── Tenants ────────────────────────────────────────────────────
create table public.orgs (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

-- ── Profiles (1:1 with auth.users) ─────────────────────────────
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  org_id       uuid references public.orgs (id) on delete set null,
  role         text not null default 'member' check (role in ('owner', 'admin', 'member')),
  display_name text,
  created_at   timestamptz not null default now()
);

-- ── Listings (the marketplace) ─────────────────────────────────
create table public.listings (
  id             uuid primary key default gen_random_uuid(),
  org_id         uuid not null references public.orgs (id) on delete cascade,
  slug           text not null unique,
  title          text not null,
  category       text not null,
  status         text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  subtitle       text,
  description    text,
  model          text,
  about          text,
  icon           text,
  icon_class     text,
  price_num      text,
  price_type     text,
  price_multiple text,
  kind            text not null default 'saas' check (kind in ('saas','ios','android','web','devtool','game','ai')),
  revenue_model   text not null default 'mrr'  check (revenue_model in ('mrr','onetime','iap','ads')),
  sale_type       text not null default 'full' check (sale_type in ('full','shares','license')),
  monthly_revenue integer not null default 0,
  price_value     integer not null default 0,
  listed_at       date not null default current_date,
  data           jsonb not null default '{}'::jsonb,  -- tech[], metrics[], highlights[], financials[], seller{}, badges[], equity?
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index listings_org_id_idx    on public.listings (org_id);
create index listings_status_idx    on public.listings (status);
create index listings_kind_idx      on public.listings (kind);
create index listings_sale_type_idx on public.listings (sale_type);
create index listings_listed_at_idx on public.listings (listed_at desc);

-- ── Helper: the calling user's org (null for anonymous visitors) ──
create or replace function public.current_org_id()
returns uuid
language sql stable security definer set search_path = public as $$
  select org_id from public.profiles where id = auth.uid()
$$;

-- ── Row Level Security ─────────────────────────────────────────
alter table public.orgs     enable row level security;
alter table public.profiles enable row level security;
alter table public.listings enable row level security;

-- Tenants see only their own org.
create policy "orgs: read own" on public.orgs
  for select using (id = public.current_org_id());

-- A user reads their own profile and org-mates; updates only themselves.
create policy "profiles: read self or org" on public.profiles
  for select using (id = auth.uid() or org_id = public.current_org_id());
create policy "profiles: update self" on public.profiles
  for update using (id = auth.uid());

-- Marketplace: anyone may read PUBLISHED listings; an org manages its own.
create policy "listings: public read published" on public.listings
  for select using (status = 'published' or org_id = public.current_org_id());
create policy "listings: insert own org" on public.listings
  for insert with check (org_id = public.current_org_id());
create policy "listings: update own org" on public.listings
  for update using (org_id = public.current_org_id());
create policy "listings: delete own org" on public.listings
  for delete using (org_id = public.current_org_id());

-- ── Auto-provision a profile when a user signs up ──────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Keep updated_at honest ─────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger listings_touch_updated_at
  before update on public.listings
  for each row execute function public.touch_updated_at();
