-- 0003_payments_plans_entitlements.sql — Monetization & payment rails (ADR 0002).
-- Idempotent: safe to re-run in the Supabase SQL editor.
--
-- Adds: (1) plans catalog (Start/Individuell — commission-only, no subscriptions),
-- (2) per-org entitlement +
-- Stripe linkage (Connect payout account, plan, commission override),
-- (3) payment lifecycle on deals (Stripe Connect, separate charges & transfers,
-- hold-and-release escrow), (4) individuell_requests (form → Staff Center).
-- Money moves server-side only (Edge Functions / service_role); every table here
-- carries RLS like any other business row. Monetary amounts are in the smallest
-- currency unit (cents) and are computed server-side, never trusted from the client.

-- ── 1) Plans (tier catalog; global, not tenant-scoped) ─────────
create table if not exists public.plans (
  id             text primary key,                 -- 'start' | 'individuell'
  name           text not null,
  commission_bps integer not null,                 -- platform fee, basis points (600 = 6%)
  is_public      boolean not null default true,    -- Individuell is never self-serve
  features       jsonb not null default '{}'::jsonb,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now()
);

-- Catalog defaults. Revenue is COMMISSION-ONLY (no subscriptions): Start is the
-- single public free tier (pay only on a successful sale); Individuell is never
-- self-serve — the owner activates it via the Staff Center with a negotiated rate
-- (set per-org through org_entitlements.commission_bps_override).
insert into public.plans (id, name, commission_bps, is_public, features, sort_order) values
  ('start',       'Start',       600, true,  '{"premium_placement": false, "lower_commission": false, "priority_support": false}'::jsonb, 1),
  ('individuell', 'Individuell', 400, false, '{"premium_placement": true,  "lower_commission": true,  "priority_support": true, "sla": true, "custom": true}'::jsonb, 2)
on conflict (id) do update set
  name           = excluded.name,
  commission_bps = excluded.commission_bps,
  is_public      = excluded.is_public,
  features       = excluded.features,
  sort_order     = excluded.sort_order;

-- ── 2) Per-org entitlement + Stripe linkage (1:1 with orgs) ────
create table if not exists public.org_entitlements (
  org_id                  uuid primary key references public.orgs (id) on delete cascade,
  plan_id                 text not null default 'start' references public.plans (id),
  plan_status             text not null default 'active' check (plan_status in ('active','past_due','canceled')),
  commission_bps_override integer,                      -- effective = coalesce(override, plan.commission_bps)
  stripe_account_id       text,                         -- Connect Express account (seller payouts)
  stripe_account_ready    boolean not null default false, -- charges_enabled && payouts_enabled
  features                jsonb not null default '{}'::jsonb, -- per-org gates on top of the plan
  updated_at              timestamptz not null default now()
);

drop trigger if exists org_entitlements_touch_updated_at on public.org_entitlements;
create trigger org_entitlements_touch_updated_at
  before update on public.org_entitlements
  for each row execute function public.touch_updated_at();

-- Auto-provision a default ('start') entitlement whenever an org is created.
create or replace function public.handle_new_org()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.org_entitlements (org_id) values (new.id)
  on conflict (org_id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_org_created on public.orgs;
create trigger on_org_created
  after insert on public.orgs
  for each row execute function public.handle_new_org();

-- Backfill existing orgs.
insert into public.org_entitlements (org_id)
select id from public.orgs
on conflict (org_id) do nothing;

-- ── 3) Payment lifecycle on deals (Stripe hold-and-release) ────
-- Overlays the existing deal status (open/accepted/…). Once a deal is accepted,
-- the buyer checks out → funds are captured and HELD on the platform balance →
-- on buyer-confirmed asset transfer the seller share (minus fee) is RELEASED.
alter table public.deals
  add column if not exists payment_status text not null default 'none'
    check (payment_status in ('none','pending','held','released','refunded','failed')),
  add column if not exists currency text not null default 'eur',
  add column if not exists amount_gross integer,            -- buyer pays (cents)
  add column if not exists fee_amount integer,              -- platform fee (cents)
  add column if not exists amount_net integer,              -- seller payout (cents)
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists stripe_transfer_id text,
  add column if not exists buyer_confirmed_at timestamptz,  -- milestone: asset received → release
  add column if not exists paid_at timestamptz,
  add column if not exists released_at timestamptz;

-- Webhooks arrive keyed by Stripe id → unique partial index for fast, safe lookup.
create unique index if not exists deals_payment_intent_idx
  on public.deals (stripe_payment_intent_id) where stripe_payment_intent_id is not null;
create unique index if not exists deals_checkout_session_idx
  on public.deals (stripe_checkout_session_id) where stripe_checkout_session_id is not null;

-- ── 4) Individuell requests (form → Staff Center → owner activates) ──
create table if not exists public.individuell_requests (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid references public.orgs (id) on delete set null,
  contact_name  text not null,
  contact_email text not null,
  company       text,
  message       text,
  status        text not null default 'new' check (status in ('new','reviewing','activated','declined')),
  handled_by    uuid references auth.users (id) on delete set null,
  handled_at    timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists individuell_requests_status_idx on public.individuell_requests (status);
create index if not exists individuell_requests_org_idx    on public.individuell_requests (org_id);

-- ── RLS ────────────────────────────────────────────────────────
alter table public.plans                enable row level security;
alter table public.org_entitlements     enable row level security;
alter table public.individuell_requests enable row level security;

-- Plans: public catalog (pricing page reads it). Writes are server-side only.
drop policy if exists "plans: public read" on public.plans;
create policy "plans: public read" on public.plans
  for select using (true);

-- Entitlements: an org reads only its own. Writes happen server-side (Edge
-- Function via service_role bypasses RLS) — no client write policy by design.
drop policy if exists "entitlements: read own org" on public.org_entitlements;
create policy "entitlements: read own org" on public.org_entitlements
  for select using (org_id = public.current_org_id());

-- Individuell: a member submits for their own org and reads their org's requests.
-- The Staff Center reads across all orgs server-side (service_role), not here.
drop policy if exists "individuell: insert own org" on public.individuell_requests;
drop policy if exists "individuell: read own org"   on public.individuell_requests;
create policy "individuell: insert own org" on public.individuell_requests
  for insert with check (org_id = public.current_org_id());
create policy "individuell: read own org" on public.individuell_requests
  for select using (org_id = public.current_org_id());
