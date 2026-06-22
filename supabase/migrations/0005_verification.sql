-- 0005_verification.sql — Trust & verification (seller identity / proof-of-revenue).
-- Idempotent: safe to re-run in the Supabase SQL editor.
--
-- ROOT SECURITY DECISION — verification truth NEVER lives on a client-writable
-- table. Postgres RLS is row-level, not column-level: the existing
-- "listings: update own org" policy (0001) and "profiles: update self" let an
-- owner UPDATE their own row, so ANY verified flag placed on listings/profiles
-- could be flipped to true in the very same PATCH that edits the row. Therefore:
--
--   * The verified flags live ONLY on public.org_entitlements — the proven
--     server-owned pattern (read-own-org SELECT, NO client write policy; written
--     solely by the platform via service_role / Edge Function, which bypasses RLS).
--   * The buyer-facing badge is DERIVED by joining org_entitlements in a view
--     (public.listings_public) — never a mirrored, forgeable column on listings.
--   * verification_requests lets a seller ASK to be verified; the OUTCOME
--     (status) is service_role-only. org_id / requester_id / status are bound
--     server-side by a BEFORE INSERT trigger — never trusted from the client.
--   * Reviewer authorization uses a dedicated platform_staff allowlist, NOT the
--     org-scoped profiles.role (every signup is 'owner' of its own org → useless
--     as a cross-org moderation gate).
--   * revenue_verified freezes the verified figure; a trigger invalidates it if
--     the seller later edits monthly_revenue / price_value (flag ≠ number drift).
--   * Every grant/revoke writes an immutable audit row (ISO 27001 / disputes).

-- ── 1) Verified state on the SERVER-OWNED row (org_entitlements) ────
-- org_entitlements already has: read-own-org SELECT policy + NO client write
-- policy (0003). Adding the flags here means the client has zero write path.
alter table public.org_entitlements
  add column if not exists seller_verified         boolean not null default false,
  add column if not exists revenue_verified        boolean not null default false,
  add column if not exists seller_verified_at      timestamptz,
  add column if not exists revenue_verified_at     timestamptz,
  add column if not exists seller_verified_by      uuid references auth.users (id) on delete set null,
  add column if not exists revenue_verified_by     uuid references auth.users (id) on delete set null,
  -- Frozen at the moment revenue is verified, in cents (server-side snapshot).
  -- If the seller later edits the underlying listing numbers, revenue_verified
  -- is reset to false (see trigger in §6) so flag and figure cannot decouple.
  add column if not exists revenue_verified_amount  integer,
  add column if not exists revenue_verified_listing uuid references public.listings (id) on delete set null;

-- ── 2) Platform-staff allowlist (cross-org reviewer authority) ─────
-- There is NO platform-staff concept in the schema today (profiles.role is
-- org-scoped). This table is the single source of staff identity. It is written
-- ONLY by service_role / the SQL editor — there is deliberately no client write
-- policy, so a seller can never enroll themselves as staff.
create table if not exists public.platform_staff (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  added_by   uuid references auth.users (id) on delete set null,
  note       text,
  created_at timestamptz not null default now()
);
alter table public.platform_staff enable row level security;
-- A staff member may confirm their OWN staff status (drives Staff-Center UI);
-- nobody can read the full roster and nobody can write through the API.
drop policy if exists "staff: read self" on public.platform_staff;
create policy "staff: read self" on public.platform_staff
  for select using (user_id = auth.uid());

-- is_platform_staff() — the ONLY reviewer gate. SECURITY DEFINER so it can read
-- platform_staff regardless of the caller's RLS; derives trust from auth.uid()
-- alone, never from any client-supplied column.
create or replace function public.is_platform_staff()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.platform_staff where user_id = auth.uid())
$$;

-- ── 3) Verification requests (seller → platform) ───────────────────
create table if not exists public.verification_requests (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references public.orgs (id)     on delete cascade,
  requester_id uuid not null references auth.users (id)      on delete cascade,
  listing_id   uuid          references public.listings (id) on delete cascade,
  kind         text not null check (kind in ('seller', 'revenue')),
  -- 'reviewing' lets staff claim a request without deciding it yet.
  status       text not null default 'pending'
               check (status in ('pending', 'reviewing', 'approved', 'rejected')),
  note         text,                 -- seller's note on submit
  review_note  text,                 -- staff's note on decision (rejection reason)
  reviewed_by  uuid references auth.users (id) on delete set null,
  reviewed_at  timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists verification_requests_org_idx     on public.verification_requests (org_id);
create index if not exists verification_requests_listing_idx on public.verification_requests (listing_id);
create index if not exists verification_requests_status_idx  on public.verification_requests (status);

-- Bind ownership SERVER-SIDE (mirrors set_deal_seller_org, 0002). org_id,
-- requester_id and the initial status are derived from auth state / forced —
-- never trusted from the client insert, so a seller cannot file 'as' another org
-- nor submit a row that is already 'approved'.
create or replace function public.set_verification_request_owner()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.requester_id := auth.uid();
  new.org_id       := public.current_org_id();
  new.status       := 'pending';
  new.review_note  := null;
  new.reviewed_by  := null;
  new.reviewed_at  := null;
  if new.org_id is null then
    raise exception 'no org context for verification request'
      using errcode = 'insufficient_privilege';
  end if;
  -- A listing reference, if given, must belong to the requester's own org.
  if new.listing_id is not null
     and not exists (
       select 1 from public.listings
       where id = new.listing_id and org_id = new.org_id
     ) then
    raise exception 'listing does not belong to your org'
      using errcode = 'insufficient_privilege';
  end if;
  return new;
end;
$$;
drop trigger if exists verification_requests_set_owner on public.verification_requests;
create trigger verification_requests_set_owner
  before insert on public.verification_requests
  for each row execute function public.set_verification_request_owner();

-- A seller must NEVER mutate a request after submit (status/reviewer are the
-- crown jewels). Even though no client UPDATE policy exists, this BEFORE UPDATE
-- guard is defence in depth: it rejects any non-service_role UPDATE outright, so
-- an accidental future policy GRANT cannot open a self-approval path.
create or replace function public.guard_verification_request_update()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if current_user <> 'service_role' then
    raise exception 'verification outcome is decided by the platform only'
      using errcode = 'insufficient_privilege';
  end if;
  return new;
end;
$$;
drop trigger if exists verification_requests_guard_update on public.verification_requests;
create trigger verification_requests_guard_update
  before update on public.verification_requests
  for each row execute function public.guard_verification_request_update();

-- ── 4) RLS: an org sees and creates ONLY its own requests ──────────
-- Enabled in the SAME migration the table is created (project rule).
alter table public.verification_requests enable row level security;

drop policy if exists "verification: read own org"   on public.verification_requests;
drop policy if exists "verification: read staff"     on public.verification_requests;
drop policy if exists "verification: insert own org" on public.verification_requests;

-- Read your own org's requests…
create policy "verification: read own org" on public.verification_requests
  for select using (org_id = public.current_org_id());
-- …and platform staff read across all orgs (Staff-Center review queue).
create policy "verification: read staff" on public.verification_requests
  for select using (public.is_platform_staff());

-- Insert is the ONLY client write. with_check re-asserts ownership belt-and-
-- braces (the trigger already forces these); the trigger wins on any mismatch.
create policy "verification: insert own org" on public.verification_requests
  for insert with check (
    org_id = public.current_org_id() and requester_id = auth.uid()
  );

-- NO client UPDATE and NO client DELETE policy, by design: deny-by-default means
-- a seller can never set status='approved' on their own request, change the
-- reviewer, or erase the audit trail. The platform (service_role) bypasses RLS
-- to approve/reject and to set the org_entitlements flags. status/decision are
-- the crown jewels and are unreachable from any client write path.

-- ── 5) Immutable audit of every verification state change ──────────
create table if not exists public.verification_audit (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.orgs (id) on delete cascade,
  kind        text not null check (kind in ('seller', 'revenue')),
  action      text not null check (action in ('granted', 'revoked')),
  actor_id    uuid references auth.users (id) on delete set null, -- the staff member
  request_id  uuid references public.verification_requests (id) on delete set null,
  reason      text,
  meta        jsonb not null default '{}'::jsonb,                 -- e.g. frozen amount
  created_at  timestamptz not null default now()
);
create index if not exists verification_audit_org_idx on public.verification_audit (org_id);
alter table public.verification_audit enable row level security;
-- An org may read its own audit trail; staff read all. No client write policy and
-- no UPDATE/DELETE for anyone → append-only from service_role.
drop policy if exists "verification audit: read own org" on public.verification_audit;
drop policy if exists "verification audit: read staff"   on public.verification_audit;
create policy "verification audit: read own org" on public.verification_audit
  for select using (org_id = public.current_org_id());
create policy "verification audit: read staff" on public.verification_audit
  for select using (public.is_platform_staff());

-- ── 6) Freeze the verified figure: flag ≠ number must not decouple ─
-- revenue_verified attests a CHECKED revenue number. If the seller edits the
-- underlying listing figures after verification, the attestation is stale → we
-- auto-revoke revenue_verified and write an audit row. SECURITY DEFINER reads
-- only server state (the entitlement row keyed off the listing's org), never a
-- client-supplied verified field.
create or replace function public.invalidate_revenue_on_edit()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (new.monthly_revenue is distinct from old.monthly_revenue
      or new.price_value   is distinct from old.price_value)
     and exists (
       select 1 from public.org_entitlements e
       where e.org_id = new.org_id and e.revenue_verified
         and (e.revenue_verified_listing is null
              or e.revenue_verified_listing = new.id)
     ) then
    update public.org_entitlements
       set revenue_verified         = false,
           revenue_verified_at      = null,
           revenue_verified_amount  = null,
           revenue_verified_listing = null
     where org_id = new.org_id;
    insert into public.verification_audit (org_id, kind, action, reason, meta)
    values (new.org_id, 'revenue', 'revoked',
            'auto: seller edited verified revenue figures',
            jsonb_build_object('listing_id', new.id,
                               'old_monthly_revenue', old.monthly_revenue,
                               'new_monthly_revenue', new.monthly_revenue));
  end if;
  return new;
end;
$$;
drop trigger if exists listings_invalidate_revenue on public.listings;
create trigger listings_invalidate_revenue
  before update on public.listings
  for each row execute function public.invalidate_revenue_on_edit();

-- ── 7) Buyer-facing badge: DERIVED, never a forgeable column ───────
-- listings_public exposes listings PLUS the verified flags joined from the
-- trusted org_entitlements row. The marketplace/detail read this view, so the
-- badge can only ever reflect server-owned truth — there is no verified column
-- on listings to PATCH. security_invoker=true → the view inherits the caller's
-- RLS on listings ("public read published OR own org"), so visibility is
-- unchanged; the joined booleans are non-PII display flags.
create or replace view public.listings_public
with (security_invoker = true) as
  select l.*,
         coalesce(e.seller_verified, false)  as seller_verified,
         coalesce(e.revenue_verified, false) as revenue_verified
  from public.listings l
  left join public.org_entitlements e on e.org_id = l.org_id;

-- SECURITY INVOKER means org_entitlements RLS ("read own org") would NULL the
-- join for other orgs' rows → an anonymous buyer would see seller_verified=false
-- on every foreign listing. A definer-scoped function resolves the two display
-- booleans for any org WITHOUT exposing any other entitlement column, so the
-- badge renders for everyone while the rest of the entitlement stays private.
create or replace function public.listing_verified_flags(p_org_id uuid)
returns table (seller_verified boolean, revenue_verified boolean)
language sql stable security definer set search_path = public as $$
  select coalesce(seller_verified, false), coalesce(revenue_verified, false)
  from public.org_entitlements where org_id = p_org_id
$$;

grant execute on function public.listing_verified_flags(uuid) to anon, authenticated;
grant select on public.listings_public to anon, authenticated;

-- ── 8) Sanitize self-awarded cosmetic badges in existing data ──────
-- Today 'Verifiziert' is just a client-controlled jsonb entry in listings.data
-- (badges[]). Strip any self-awarded verified badge so a fake cannot masquerade
-- as a real verification once the UI renders the trusted flag. (The UI also
-- stops honoring kind:'verified' from data.badges — see ListingCard/Detail.)
update public.listings
   set data = jsonb_set(
         data, '{badges}',
         coalesce(
           (select jsonb_agg(b)
              from jsonb_array_elements(data -> 'badges') b
             where b ->> 'kind' is distinct from 'verified'),
           '[]'::jsonb))
 where data ? 'badges'
   and exists (
     select 1 from jsonb_array_elements(data -> 'badges') b
     where b ->> 'kind' = 'verified');
-- ── 9) View-Fix: Verifiziert-Badge fuer ALLE Kaeufer rendern (nicht nur own-org) ──
-- §7 jointe org_entitlements direkt; unter security_invoker NULLt die
-- read-own-org-RLS diesen Join fuer anonyme/fremde Kaeufer -> Badge waere immer
-- false. Stattdessen die zwei Display-Flags ueber die SECURITY-DEFINER-Funktion
-- aufloesen (liest nur diese zwei Nicht-PII-Booleans); security_invoker bleibt,
-- damit die LISTINGS-RLS weiterhin steuert, welche Zeilen sichtbar sind.
create or replace view public.listings_public
with (security_invoker = true) as
  select l.*,
         coalesce(f.seller_verified, false)  as seller_verified,
         coalesce(f.revenue_verified, false) as revenue_verified
  from public.listings l
  left join lateral public.listing_verified_flags(l.org_id) as f on true;
grant select on public.listings_public to anon, authenticated;
-- ── 10) FIX (Security-Review): guard OHNE security definer ─────────
-- §3 deklarierte guard_verification_request_update als SECURITY DEFINER und prueft
-- `current_user`. In einer SECURITY-DEFINER-Funktion ist current_user der FUNKTIONS-
-- EIGENTUEMER (postgres), nicht die laufende Rolle → der Trigger haette JEDE Aenderung
-- geblockt (auch die legitime service_role-Edge-Function) = Approve kaputt. Fix: KEIN
-- security definer → current_user = effektive Rolle (service_role bei der Edge Function,
-- authenticated beim Client). (Nicht session_user: das ist bei Supabase immer
-- 'authenticator' und wuerde auch service_role blocken.)
create or replace function public.guard_verification_request_update()
returns trigger
language plpgsql as $$
begin
  if current_user <> 'service_role' then
    raise exception 'verification outcome is decided by the platform only'
      using errcode = 'insufficient_privilege';
  end if;
  return new;
end;
$$;