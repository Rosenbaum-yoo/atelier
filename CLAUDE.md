# Atelier — CLAUDE.md (Self-Learning · Strict Efficiency)

> Auto-geladen bei Session-Start. **Pflicht:** JEDE Änderung aktualisiert hier `Status` + `Self-Learning Log`.
> Globale Standards gelten zusätzlich via `@AGENTS.md` (Heimverzeichnis). Bei Konflikt gewinnt diese Datei.

## Projekt
**Atelier** = kuratierter Premium-Marktplatz für fertige Software (SaaS, Apps, ganze Firmen, Anteile).
Enterprise-Ziel: HA, mandantenfähig, in kurzer Zeit marktreif für echte Kunden.
Stack: **Vite + React 18 + TS** · **Supabase Cloud** (Postgres+Auth+Storage+RLS) · **Cloudflare Pages** (Hosting) · Docker/Traefik als Self-Host-Schalter.
Design ist **GESPERRT**, 1:1 aus `atelier.html`.

## DESIGN-LOCK (nicht verhandelbar)
- Single source of truth: `src/styles/atelier.css` — **verbatim** aus `atelier.html`, nie umgeschrieben.
- Tokens: `--bg`#F5F0E8 · `--bg-warm`#EFE7D6 · `--bg-card`#FAF7F0 · `--ink`#1B1916 · `--ink-soft`#4A463F · `--ink-mute`#8B8478 · `--line`#DDD3BF · `--line-soft`#E8DFC9 · `--accent`#CC785C · `--accent-deep`#A85A40 · `--accent-soft`#E8B8A6 · `--success`#5F7A4F · `--gold`#B89968.
- Fonts: **Fraunces** (Serif-Headlines, `em`=italic) · **Geist** (Body) · **Geist Mono** (Labels/Meta).
- Radius: Buttons `999px`, Cards `4–6px`. Papierkorn via `body::before`. NIE Farben/Fonts/Radii erfinden — nur Tokens. Neue Komponenten MÜSSEN bestehende Klassen wiederverwenden.

## HARTE EFFIZIENZREGELN (Pflicht)
1. **NIE große Dateien neu tippen** — per Shell extrahieren/transformieren, nicht im Output reproduzieren.
2. **Wiederholtes Markup → datengetrieben:** 1 Komponente + `map()`. Nie 6× dasselbe JSX.
3. **Bündeln & parallelisieren:** unabhängige Tool-Calls in einem Block. Lange Installs/Builds im Hintergrund, Logs nicht dumpen.
4. **Edit > Write** für bestehende Dateien. `Write` nur neu / Vollersatz.
5. Bereits im Kontext bekannte Dateien **nicht erneut lesen**.
6. **Output terse:** keine Narration, kein Code-Wiederholen.
7. Keine spekulativen Abstraktionen/Features/Fallbacks/Kommentare (außer nicht-offensichtliches WARUM).
8. Verifizieren über **Typecheck/Build**, nicht Re-Reading.
9. Im Zweifel: höchster **sichtbarer Output pro Token** gewinnt.

## Enterprise-Regeln
- **Skalierbar by default, schlank deployen, am 1. Kunden umlegen.** Teure Infra liegt als Code bereit (`infra/`), läuft aber nicht idle. Siehe `docs/SCALING.md`.
- **Mandantenfähig ab Migration #1:** `org_id` auf jeder Business-Zeile, **RLS** erzwingt Isolation. Jede neue Tabelle: `enable row level security` + Policies in derselben Migration.
- **React ≠ Sicherheit:** die DB (RLS) sichert ALLES ab. anon-Key ist öffentlich (sicher via RLS); `service_role`-Key NIE im Client/Repo.
- **Keine Secrets in Git:** `.env` (gitignored), nur `.env.example` getrackt.
- **Kein Fake-Data in echten Flows:** statische `src/data/*` ist MVP-Platzhalter; sobald Backend live, aus Supabase laden (`src/lib/supabase.ts`).
- **Doku ab Tag 1 Pflicht:** README, ARCHITECTURE, SCALING, RUNBOOK, SECURITY, ADRs. Architekturentscheidungen als ADR.

## Architektur
```
src/
  styles/atelier.css   ← Design (gesperrt, 1:1)
  data/listings.ts     ← zentrale Listing-Daten (MVP single source)
  lib/supabase.ts      ← lazy Supabase-Client (crasht nicht ohne .env)
  components/          ← Nav, Footer, ListingCard, ...
  pages/               ← Home, ListingDetail, (Marketplace, Dealroom, Sell, Dashboard, Auth)
  main.tsx · App.tsx (Router)
supabase/migrations/   ← 0001_init.sql (orgs, profiles, listings + RLS)
infra/                 ← nginx.conf, docker-compose.yml (Traefik LB)
Dockerfile             ← multi-stage → nginx
docs/                  ← ARCHITECTURE · SCALING · RUNBOOK · SECURITY · adr/
.github/workflows/     ← ci.yml (typecheck + build)
```
Listings via `src/data/listingsRepo.ts` → `fetchListings()` aus Supabase, **Fallback** auf `src/data/listings.ts` (statisch = Seed-Quelle + Sicherheitsnetz, wenn DB leer/unkonfiguriert/Fehler). Karten via `<ListingCard listing={…}/>`. Seed aus `listings.ts` generieren: `node scripts/gen-seed.mjs`.

## Status
- [x] Scaffold Vite+React+TS · CSS extrahiert · Landing componentisiert · Listing-Detail
- [x] Enterprise-Fundament: `.gitignore`/`.env.example` · Supabase-Schema+RLS (0001) · Docker/Traefik · CI · Doku-Suite · `src/lib/supabase.ts`
- [x] Git: lokales Repo + privates GitHub-Repo + Push → https://github.com/Rosenbaum-yoo/atelier (gh 2.93.0). CI läuft bei Push.
- [x] **Supabase Cloud live**: Projekt `DeEnProjekt` (ref `pqyvphzpajcwwerqbknx`, Frankfurt/eu-central-1) · `.env` mit anon-Key (gitignored) · Schema `0001` (erweitert) + Seed im SQL-Editor ausgeführt · App lädt via `src/data/listingsRepo.ts` aus Supabase **mit Fallback** auf statische Daten · Browser verifiziert: 7 Listings aus DB. Cloudflare-Env-Vars (`VITE_SUPABASE_URL`/`_ANON_KEY`) gesetzt + Redeploy.
- [x] **Cloudflare Pages live** → https://atelier-a9e.pages.dev · Auto-Deploy bei jedem Push auf `main` · SPA-Fallback via `public/_redirects`
- [x] Marktplatz funktional: Filter (Kategorie/Modell/Verkaufsoption/Tech) + Sort, Counts aus echten Daten, Empty-State · **Anteile/Invest first-class** (`saleType`, neue GmbH-Beteiligung `lumen-analytics`)
- [x] **Auth + Verkäufer-Flow + Dashboard + Dealroom** gebaut (`AuthContext`, `ProtectedRoute`, `/login` `/sell` `/dashboard` `/dealroom`, `dealsRepo.ts`, token-only `styles/app.css`). Typecheck+Build grün, Login/Marktplatz im Browser verifiziert (Tokens 1:1).
- [x] Migration `0002_auth_orgs_deals.sql` im SQL-Editor ausgeführt (Org-Auto-Provisioning + `deals` + RLS) → Seller-Publish & Dealroom live. Seed neu generiert (self-healing `on conflict do update`) → DB-Mojibake bereinigt.
- [x] **Detail-Seite lädt aus DB** (`fetchListingBySlug` + Fallback, Loading-/404-States, related aus `fetchListings`) → 404-Bug bei selbst angelegten/DB-only Listings behoben. Browser verifiziert: `tempconnect-gkfo` (user-created) **und** `pixelcraft-studio` (seed) rendern sauber.
- [ ] Preis-Range-Slider funktional · E-Mail-Bestätigung-Flow testen · Make-Offer→Dealroom End-to-End durchklicken

## Self-Learning Log
- 2026-06-02: Init. CSS via Shell aus atelier.html extrahiert (0 Output-Token). Landing datengetrieben.
- 2026-06-02: Enterprise-Fundament gelegt (Supabase+RLS, Docker/Traefik, CI, Doku, ADR 0001). Entscheidung: **kein Monorepo** jetzt (Single-App im Root, `supabase/`+`infra/`+`docs/` daneben) — Churn ohne Nutzen. Hosting-Empfehlung: **Cloudflare Pages + Supabase Cloud**, Docker als Schalter. gh-CLI nicht installiert → Push ist Owner-Schritt.
- 2026-06-03: gh 2.93.0 via winget installiert; Owner per GitHub Device-Flow eingeloggt (Account `Rosenbaum-yoo`). `gh repo create atelier --private --source=. --push` → privates Repo live, `main` getrackt, CI aktiv. Offene Owner-Schritte für Go-Live: Supabase-Projekt anlegen + `db push`, Cloudflare Pages verbinden.
- 2026-06-03: **Go-Live.** Owner hat Cloudflare Pages mit dem GitHub-Repo verbunden (Framework-Preset „React (Vite)" auto-erkannt, Build `npm run build`, Output `dist`, Branch `main`). Seite live unter https://atelier-a9e.pages.dev, Auto-Deploy bei Push. Danach Prod-spezifischen Bug gefixt: BrowserRouter-Deep-Links (`/listing/:id`) lieferten auf Pages 404 → `public/_redirects` mit `/* /index.html 200` (Vite kopiert nach `dist/`). Verifiziert: `dist/_redirects` wird gebaut.
- 2026-06-03: **Supabase verdrahtet.** Projekt `DeEnProjekt` (Frankfurt) angelegt; `.env` mit anon-Key (gitignored, anon ist public-safe via RLS). Schema `0001` erweitert um Filter-/Sort-Spalten (kind/revenue_model/sale_type/monthly_revenue/price_value/listed_at) + `equity`/`icon`/`model`/`about` + Indizes & CHECKs. Seed **nicht von Hand** getippt: `scripts/gen-seed.mjs` strippt TS-Typen via esbuild `transform`, importiert `listings.ts` als data:-URL und emittiert `supabase/seed.sql` (idempotent, `on conflict do nothing`). Neuer `listingsRepo.ts`: lädt published Listings aus Supabase, **fällt auf statische Daten zurück** bei leer/Fehler/unkonfiguriert → Seite nie leer. `Marketplace.tsx` lädt via `useEffect`, statische Liste als Initial-State (sofortiger Render). Browser-Preview: 7 Listings, Counts korrekt, 0 Konsolen-Fehler, Design 1:1 (DB noch nicht migriert → Fallback griff sauber). Combined `supabase/setup.sql` (Schema+Seed, gitignored) für 1-Klick-Paste im SQL-Editor + in Zwischenablage gelegt. Offen (Owner): setup.sql im SQL-Editor ausführen + Env-Vars in Cloudflare Pages.
- 2026-06-03: Marktplatz funktional gemacht. Strukturierte Felder in `listings.ts` (`kind`/`revenueModel`/`saleType`/`monthlyRevenue`/`priceValue`/`listedAt`/`equity?`) + Label-Maps. Neue `Marketplace.tsx` (Filter/Sort/Empty-State, Counts **aus echten Daten** statt Fake-Zahlen, a11y via role=button+tabIndex). `Home.tsx` nutzt `<Marketplace/>`, Inline-Sektion entfernt. **Invest first-class**: neue GmbH-Beteiligung `lumen-analytics` (20% Anteile, €240k). Design 1:1 gehalten (nur bestehende Klassen). Bug gefixt: `typecheck`-Script war `tsc -b --noEmit` (TS6310 mit Composite-Ref) → `tsc -b`. Browser-Smoke-Test (Preview): Filter „Anteile/Sponsoring“ → 7→2 Listings, Design intakt.
- 2026-06-03: **Auth + Verkäufer-Flow + Dashboard + Dealroom** (3 Features in logischer Reihenfolge). Migration `0002` geschrieben: `handle_new_user()` legt jetzt pro Signup eine **persönliche Org** an (nötig, weil listings-RLS `org_id=current_org_id()` verlangt) + Backfill; neue `deals`-Tabelle mit RLS für Käufer- UND Verkäufer-Sicht + `set_deal_seller_org()`-Trigger (leitet `seller_org_id` serverseitig aus dem Listing ab — **nie vom Client vertraut**). `AuthContext` abonniert `supabase.auth` (session/user/profile/loading/signOut/refreshProfile), `ProtectedRoute` leitet auf `/login`. Neue Seiten: `/login` (Sign-in+Sign-up kombiniert, dt. Fehlertexte), `/sell` (Listing → DB, Draft/Published, slugify), `/dashboard` (eigene Listings publish/zurückziehen/löschen + eingehende Angebote), `/dealroom` (Käufer: zurückziehen · Verkäufer: annehmen/ablehnen). Angebot-Aktion in `ListingDetail` (tote `href="#"` ersetzt; löst Listing-UUID per Slug auf → `deals`-Insert). **Design-Lock gewahrt**: keine neuen Tokens — neue `styles/app.css` nutzt nur bestehende `--`-Farben + die 3 Schriftarten (verifiziert: `.auth-card`=`--bg-card`, `.btn-primary`=`--ink`/`--bg`). Typecheck+Build grün (93 Module). **Preview-Quirk:** `preview_screenshot` läuft in Timeout (wartet auf network-idle, das der Supabase-Auth-Client offenhält) → stattdessen via `preview_eval`/`preview_inspect` verifiziert (zuverlässiger lt. Tool-Doku). Offen (Owner): `0002` im SQL-Editor ausführen.
- 2026-06-03: **0002 angewandt + 2 Encoding-Bugs + 404-Bug gefixt.** (1) Owner hat `0002` ausgeführt — erst Mojibake (`Â· Atelier`) durch PowerShell-Clipboard, das UTF-8 als ANSI dekodiert; Fix: **immer `Get-Content -Raw -Encoding UTF8 | Set-Clipboard`**. (2) Seed-Daten in DB waren mojibake (`Ã¼`/`â‚¬`/`â˜…`) aus früherem Paste; `gen-seed.mjs` self-healing gemacht (`on conflict (slug) do update set <alle cols>`), neu generiert, mit `-Encoding UTF8` kopiert → Marktplatz sauber. (3) **404-Bug:** `ListingDetail` las statisch `getListing(id)` → selbst angelegte/DB-only Listings = 404. Fix: neue `fetchListingBySlug(slug)` in `listingsRepo` (Supabase by slug, Fallback auf statische, null nur wenn beides leer); `ListingDetail` lädt jetzt async via `useEffect`+`Promise.all([fetchListingBySlug, fetchListings])`, Loading-Spinner, 404 erst nach Load, related aus DB. Typecheck grün, Browser verifiziert (user-created + seed rendern). **Lektion:** sobald DB Truth ist, MÜSSEN alle Detail-/Listen-Reads aus der DB lesen (mit Fallback) — keine statischen `getX(id)`-Reste.
