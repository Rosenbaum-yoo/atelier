-- 0002_auth_orgs_deals.sql — Auth onboarding + Dealroom.
-- Idempotent: safe to run more than once in the Supabase SQL editor.
--
-- 1) Every new signup gets a personal org and an owner profile linked to it,
--    so a seller can publish immediately (listings RLS needs org_id).
-- 2) deals table powers the Dealroom (buyer offers, seller accept/decline),
--    multi-tenant via RLS from both buyer and seller perspectives.

-- ── 1) Auto-provision org + owner profile on signup ────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  new_org_id uuid;
  dname text := coalesce(
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    split_part(new.email, '@', 1)
  );
begin
  insert into public.orgs (name, slug)
  values (dname || ' · Atelier', 'org-' || replace(new.id::text, '-', ''))
  returning id into new_org_id;

  insert into public.profiles (id, org_id, role, display_name)
  values (new.id, new_org_id, 'owner', dname);

  return new;
end;
$$;

-- Backfill: any pre-existing profile without an org gets a personal one.
do $$
declare
  r record;
  oid uuid;
begin
  for r in select id, display_name from public.profiles where org_id is null loop
    insert into public.orgs (name, slug)
    values (
      coalesce(nullif(r.display_name, ''), 'Atelier') || ' · Atelier',
      'org-' || replace(r.id::text, '-', '')
    )
    on conflict (slug) do nothing
    returning id into oid;
    if oid is null then
      select id into oid from public.orgs where slug = 'org-' || replace(r.id::text, '-', '');
    end if;
    update public.profiles set org_id = oid, role = 'owner' where id = r.id;
  end loop;
end $$;

-- ── 2) Deals (the Dealroom) ────────────────────────────────────
create table if not exists public.deals (
  id            uuid primary key default gen_random_uuid(),
  listing_id    uuid not null references public.listings (id) on delete cascade,
  buyer_id      uuid not null references auth.users (id) on delete cascade,
  seller_org_id uuid not null references public.orgs (id) on delete cascade,
  status        text not null default 'open' check (status in ('open', 'accepted', 'declined', 'withdrawn')),
  offer_amount  integer,
  message       text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists deals_listing_idx on public.deals (listing_id);
create index if not exists deals_buyer_idx   on public.deals (buyer_id);
create index if not exists deals_org_idx     on public.deals (seller_org_id);

-- seller_org_id is always derived from the listing — never trusted from the client.
create or replace function public.set_deal_seller_org()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  select org_id into new.seller_org_id from public.listings where id = new.listing_id;
  return new;
end;
$$;
drop trigger if exists deals_set_seller_org on public.deals;
create trigger deals_set_seller_org
  before insert on public.deals
  for each row execute function public.set_deal_seller_org();

drop trigger if exists deals_touch_updated_at on public.deals;
create trigger deals_touch_updated_at
  before update on public.deals
  for each row execute function public.touch_updated_at();

-- ── RLS: buyer sees/acts on own offers; seller sees/acts on offers to their org ──
alter table public.deals enable row level security;

drop policy if exists "deals: buyer reads own"    on public.deals;
drop policy if exists "deals: seller reads org"   on public.deals;
drop policy if exists "deals: buyer inserts own"  on public.deals;
drop policy if exists "deals: buyer updates own"  on public.deals;
drop policy if exists "deals: seller updates org" on public.deals;

create policy "deals: buyer reads own" on public.deals
  for select using (buyer_id = auth.uid());
create policy "deals: seller reads org" on public.deals
  for select using (seller_org_id = public.current_org_id());
create policy "deals: buyer inserts own" on public.deals
  for insert with check (buyer_id = auth.uid());
create policy "deals: buyer updates own" on public.deals
  for update using (buyer_id = auth.uid());
create policy "deals: seller updates org" on public.deals
  for update using (seller_org_id = public.current_org_id());
