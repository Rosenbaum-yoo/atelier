# Architecture

## Overview
Atelier is a single-page React app served as static files, backed by Supabase Cloud
for data, auth, and storage. There is no custom backend server to operate — the
database enforces all access rules via Row Level Security (RLS), so the browser can
talk to Supabase directly and safely.

```
Browser (React SPA)  ──HTTPS──►  Supabase Cloud
   │                                 ├─ Postgres (+ RLS)
   │                                 ├─ Auth (JWT)
   │                                 ├─ Storage (assets/docs)
   └─ static hosting                 └─ Realtime
      (Cloudflare Pages)
```

## Frontend
- **Vite + React 18 + TypeScript (strict).** Routing via React Router.
- **Design is locked.** `src/styles/atelier.css` is extracted verbatim from
  `atelier.html`. New UI reuses existing classes/tokens — no new colors/fonts/radii.
- **Data-driven.** Listings live in `src/data/listings.ts` (single source today).
  When the backend is live, the same shapes load from Supabase via `src/lib/supabase.ts`.
- **Supabase client** is lazy (`getSupabase()`): a missing `.env` never crashes the
  static site, so the marketplace renders before auth/data are wired.

## Multi-tenancy (built in from day 1)
Every business row carries an `org_id`. RLS policies (see `supabase/migrations/0001_init.sql`)
guarantee a tenant only ever reads/writes its own rows — except published listings,
which are world-readable so the marketplace can be browsed by anyone. This is how
"enterprise contracts under individual names" (white-label tenants) stay isolated in a
single database without code forks.

## Data model (initial)
| Table | Purpose |
|---|---|
| `orgs` | Tenants (sellers, enterprise customers) |
| `profiles` | One per auth user; links a user to an org + role |
| `listings` | Marketplace items; `status` gates public visibility; `data` jsonb holds flexible card/detail fields |

## Why no separate API server
Supabase exposes an auto-generated, RLS-protected REST + Realtime API. Adding a
Node/API tier now would be infrastructure we'd have to scale and secure for no benefit.
If a future feature needs server-side secrets or custom logic, it goes into a Supabase
Edge Function — not a new always-on server. See [ADR 0001](adr/0001-stack-and-hosting.md).
