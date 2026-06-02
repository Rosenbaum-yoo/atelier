# Scaling

## Principle: build for scale, deploy lean, flip the switch at customer #1
Every architectural choice assumes tens of thousands of users. But we do **not** pay
for or operate idle infrastructure on day 1. The expensive pieces exist as code and
config, ready to enable the moment real load (or an enterprise tenant) demands them.

## What already scales to tens of thousands — with zero ops from us
- **Frontend → Cloudflare Pages.** Static bundle on a global edge CDN. Unlimited
  bandwidth, automatic HTTPS, built-in DDoS/WAF. There is no server to scale.
- **Data → Supabase Cloud.** Managed Postgres with connection pooling, read replicas
  (paid tiers), automatic backups + Point-in-Time Recovery. Vertical scale = a dropdown;
  no migration, no downtime planning on our side.
- **Multi-tenant from migration #1.** `org_id` + RLS means tenant #1 and tenant #10,000
  share one database safely. Onboarding a new enterprise tenant is data, not a deploy.

## The "flip the switch" levers (already in the repo, off by default)
| Lever | When to enable | How |
|---|---|---|
| Self-host the frontend | Enterprise tenant requires on-prem / isolated hosting | `infra/docker-compose.yml` → `docker compose up -d --scale web=2` (Traefik load-balances) |
| Horizontal web replicas | Self-hosting under heavy load | Increase `--scale web=N` |
| Postgres read replicas / bigger instance | DB CPU/IO pressure | Supabase dashboard (no code change) |
| CDN caching rules / WAF tuning | Traffic spikes, abuse | Cloudflare dashboard |

## Statelessness
The web tier serves static files only — it holds no session state, so 1 → N replicas
is pure configuration. All state lives in Supabase (managed, HA).

## When to revisit
- Sustained DB load near instance limits → enable read replicas, add indexes.
- A tenant contractually requires data residency/isolation → dedicated Supabase project
  per tenant, same migrations, routed by tenant config.
- Custom server-side logic → Supabase Edge Function before any always-on server.
