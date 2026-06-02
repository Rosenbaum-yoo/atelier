# Runbook

Operational steps for Atelier. Commands assume the repo root unless noted.

## Local development
```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # verify a production build before pushing
```

## Deploy the frontend (Cloudflare Pages — primary)
One-time setup in the Cloudflare dashboard:
1. **Workers & Pages → Create → Pages → Connect to Git**, pick this repo.
2. Build command: `npm run build` · Output directory: `dist` · Node version: `22`.
3. Add environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

After that, every push to `main` auto-builds and deploys. Pull requests get preview URLs.
**Rollback:** Cloudflare Pages → Deployments → pick a previous deployment → *Rollback*.

## Database (Supabase Cloud)
One-time:
1. Create a project at supabase.com, copy the **Project URL** and **anon key** into `.env`.
2. Install the CLI: `npm i -g supabase`, then `supabase login`.
3. Link + push migrations:
   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push          # applies supabase/migrations/*.sql
   ```
Day-to-day: add a new file `supabase/migrations/0002_*.sql`, then `supabase db push`.
Never edit an already-applied migration — always add a new one.

**Backups / restore:** Supabase takes automatic daily backups; paid tiers add
Point-in-Time Recovery. Restore from Dashboard → Database → Backups.

## Self-host path (Docker + Traefik) — only when a tenant requires it
```bash
cd infra
# pass Supabase values so they bake into the static build:
VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... docker compose up -d --build --scale web=2
```
Traefik listens on :80 and round-robins across the `web` replicas.
**Healthcheck:** each container serves `GET /healthz` → `200 ok`.
**Stop:** `docker compose down`. **Scale:** re-run with a different `--scale web=N`.

## CI
`.github/workflows/ci.yml` runs `typecheck` + `build` on every push/PR. A red check
means do not deploy — fix the build first.

## Common incidents
| Symptom | First check |
|---|---|
| Site loads, data missing | Supabase env vars set in the host? RLS policy blocking? |
| Build fails in CI | Run `npm run build` locally to reproduce |
| "Supabase is not configured" error | `.env` missing/invalid keys |
| Self-host 502 via Traefik | `docker compose ps` — are `web` replicas healthy? |
