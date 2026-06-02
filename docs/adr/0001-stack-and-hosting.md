# ADR 0001 — Stack, hosting, and tenancy

- **Status:** Accepted
- **Date:** 2026-06-02

## Context
Atelier must reach enterprise-grade market launch quickly, scale to tens of thousands
of users, support multi-tenant "enterprise contracts under individual names", and stay
manageable by a non-developer owner. The existing design (`atelier.html`) is locked and
must be reproduced exactly.

## Decision
1. **Frontend:** Vite + React 18 + TypeScript (strict). Design system extracted verbatim
   into `src/styles/atelier.css`; no new tokens.
2. **Backend:** Supabase Cloud (managed Postgres, Auth, Storage, Realtime). No custom
   always-on API server — the DB enforces access via RLS; Edge Functions cover future
   server-side logic.
3. **Multi-tenancy:** `org_id` on every business row + Row Level Security from migration #1.
4. **Hosting (primary):** Cloudflare Pages — global edge CDN, unlimited bandwidth,
   automatic HTTPS, built-in DDoS/WAF, Git-driven deploys with PR previews.
5. **Self-host path:** Docker (multi-stage → nginx) + Traefik load balancer with N web
   replicas, kept in `infra/` but **off by default** — enabled only for a tenant that
   requires on-prem/isolated hosting.
6. **Repo shape:** single web app at the repo root (not a monorepo) — `supabase/`,
   `infra/`, `docs/` sit alongside. Workspaces can be introduced later if a second
   package appears; doing it now would be churn without benefit.

## Options considered
- **Self-hosted 2 VMs + load balancer from day 1** — rejected: real cost and ops burden
  before a single paying customer. Kept as the flip-the-switch path instead.
- **Custom Node/Express API + own Postgres** — rejected: infrastructure to scale, secure,
  and back up ourselves; Supabase provides this managed.
- **Vercel instead of Cloudflare Pages** — viable and equally fast to ship; Cloudflare
  chosen for included WAF/DDoS and no bandwidth metering at scale.
- **Monorepo (apps/web + packages) now** — deferred until a second deployable exists.

## Consequences
- Enterprise-grade, highly-available launch in hours, with near-zero ops.
- Scaling is mostly configuration (Supabase instance size, replicas; CDN rules).
- Security centralizes in RLS — every new table must ship policies in its migration.
- The self-host option requires Docker know-how only if/when a tenant demands isolation.
