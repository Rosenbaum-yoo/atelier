# Security

## Secrets
- **Never commit secrets.** `.env` is gitignored; only `.env.example` (placeholders)
  is tracked. Real keys live in `.env` locally and in the host's env-var settings
  (Cloudflare Pages / CI secrets).
- **anon key vs service_role key.** The `VITE_SUPABASE_ANON_KEY` is *public by design* —
  it is safe in the browser because RLS restricts what it can do. The `service_role`
  key bypasses RLS and must **never** appear in client code, the repo, or `.env.example`.
  Use it only in trusted server contexts (CI, Edge Functions).

## Data isolation (the core control)
All access rules live in the database as Row Level Security policies
(`supabase/migrations/0001_init.sql`). The frontend is *not* a security boundary —
even with the anon key, a user can only:
- read **published** listings (public marketplace), and
- read/write rows belonging to **their own org** (`org_id = current_org_id()`).

This is what keeps enterprise/white-label tenants isolated in a shared database.
Every new table MUST `enable row level security` and ship policies in the same migration.

## Auth
- Supabase Auth issues JWTs; the client attaches them automatically. RLS reads
  `auth.uid()` from the JWT — there is no way to spoof another user's identity client-side.
- A profile row is auto-created on signup (trigger `on_auth_user_created`).

## Transport & headers
- HTTPS everywhere (Cloudflare Pages / Supabase terminate TLS).
- Self-host nginx sets `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy` (`infra/nginx.conf`). Add a CSP before first production tenant.

## Input & OWASP
- Validate at boundaries: any user-supplied input that reaches a query/storage path.
- SQL injection is mitigated by Supabase's parameterized client + RLS; never build raw
  SQL from user strings.
- Keep dependencies patched; CI builds on every push surface breakages early.

## Pre-launch checklist
- [ ] `service_role` key never shipped to the client or committed
- [ ] RLS enabled + policies present on every table
- [ ] Supabase Auth email confirmation / rate limits configured
- [ ] Content Security Policy header added
- [ ] Backups/PITR verified by a test restore
