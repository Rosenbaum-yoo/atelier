# Atelier

A curated, premium marketplace for finished software — SaaS products, apps, whole
companies, and equity stakes. Buyers browse vetted listings; sellers run a guided
deal flow with NDA, due diligence, and escrow (Treuhand).

## Stack
- **Frontend:** Vite + React 18 + TypeScript, React Router
- **Backend:** Supabase Cloud — Postgres, Auth, Storage, Realtime — with Row Level Security
- **Hosting:** Cloudflare Pages (primary) · Docker + Traefik self-host path in `infra/`
- **Design:** locked design system in `src/styles/atelier.css`, extracted verbatim from `atelier.html`

## Quickstart
```bash
npm install
copy .env.example .env   # Windows (or: cp on macOS/Linux) — fill Supabase keys when ready
npm run dev              # http://localhost:5173
```
The app runs without Supabase keys (listings come from `src/data/listings.ts`);
keys are only needed once auth/data features go live.

## Scripts
| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Types only, no emit |

## Structure
```
src/         React app — components, pages, data, styles, lib (Supabase client)
supabase/    SQL migrations: multi-tenant schema + Row Level Security
infra/       nginx config + docker-compose (Traefik load balancer)
Dockerfile   Multi-stage build → nginx static serve
docs/        ARCHITECTURE · SCALING · RUNBOOK · SECURITY · ADRs
.github/     CI (typecheck + build on every push/PR)
```

## Documentation
- [Architecture](docs/ARCHITECTURE.md) — how the pieces fit
- [Scaling](docs/SCALING.md) — build for scale, deploy lean
- [Runbook](docs/RUNBOOK.md) — deploy, migrate, roll back, restore
- [Security](docs/SECURITY.md) — secrets, RLS, auth
- [ADRs](docs/adr/) — architecture decisions
