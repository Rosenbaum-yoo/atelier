-- 0004_listing_sold.sql — A listing is sold exactly once.
-- When a deal is paid (escrow held) the listing leaves the market and can never
-- be sold again. Additive + idempotent (safe to re-run in the SQL editor).

-- 1) Allow the 'sold' listing status.
alter table public.listings drop constraint if exists listings_status_check;
alter table public.listings
  add constraint listings_status_check
  check (status in ('draft', 'published', 'archived', 'sold'));

-- 2) Block new offers on a sold listing (defence in depth; the app also guards).
--    SECURITY DEFINER so it can read the listing even though 'sold' rows are not
--    publicly selectable under RLS.
create or replace function public.block_offer_on_sold()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select status from public.listings where id = new.listing_id) = 'sold' then
    raise exception 'listing is already sold' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;
drop trigger if exists deals_block_offer_on_sold on public.deals;
create trigger deals_block_offer_on_sold
  before insert on public.deals
  for each row execute function public.block_offer_on_sold();

-- 3) Never delete a listing that has a paid (held/released) deal — the cascade
--    would erase the payment record. Protects money/audit history.
create or replace function public.block_delete_paid_listing()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.deals
    where listing_id = old.id and payment_status in ('held', 'released')
  ) then
    raise exception 'cannot delete a listing with a paid deal' using errcode = 'check_violation';
  end if;
  return old;
end;
$$;
drop trigger if exists listings_block_delete_paid on public.listings;
create trigger listings_block_delete_paid
  before delete on public.listings
  for each row execute function public.block_delete_paid_listing();

-- 4) Backfill: any listing that already has a paid deal is sold (removes an
--    already-completed deal's listing from the market).
update public.listings l set status = 'sold'
where status = 'published'
  and exists (
    select 1 from public.deals d
    where d.listing_id = l.id and d.payment_status in ('held', 'released')
  );
