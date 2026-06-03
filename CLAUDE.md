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
Listings IMMER aus `src/data/listings.ts` (bis Backend-Anbindung). Karten via `<ListingCard listing={…}/>`.

## Status
- [x] Scaffold Vite+React+TS · CSS extrahiert · Landing componentisiert · Listing-Detail
- [x] Enterprise-Fundament: `.gitignore`/`.env.example` · Supabase-Schema+RLS (0001) · Docker/Traefik · CI · Doku-Suite · `src/lib/supabase.ts`
- [x] Git: lokales Repo + privates GitHub-Repo + Push → https://github.com/Rosenbaum-yoo/atelier (gh 2.93.0). CI läuft bei Push.
- [ ] Supabase Cloud Projekt anlegen + `db push` (Owner-Schritt) · Listings aus DB laden
- [x] **Cloudflare Pages live** → https://atelier-a9e.pages.dev · Auto-Deploy bei jedem Push auf `main` · SPA-Fallback via `public/_redirects`
- [x] Marktplatz funktional: Filter (Kategorie/Modell/Verkaufsoption/Tech) + Sort, Counts aus echten Daten, Empty-State · **Anteile/Invest first-class** (`saleType`, neue GmbH-Beteiligung `lumen-analytics`)
- [ ] Dealroom · Verkäufer-Flow + Dashboard · Auth · Preis-Range-Slider funktional

## Self-Learning Log
- 2026-06-02: Init. CSS via Shell aus atelier.html extrahiert (0 Output-Token). Landing datengetrieben.
- 2026-06-02: Enterprise-Fundament gelegt (Supabase+RLS, Docker/Traefik, CI, Doku, ADR 0001). Entscheidung: **kein Monorepo** jetzt (Single-App im Root, `supabase/`+`infra/`+`docs/` daneben) — Churn ohne Nutzen. Hosting-Empfehlung: **Cloudflare Pages + Supabase Cloud**, Docker als Schalter. gh-CLI nicht installiert → Push ist Owner-Schritt.
- 2026-06-03: gh 2.93.0 via winget installiert; Owner per GitHub Device-Flow eingeloggt (Account `Rosenbaum-yoo`). `gh repo create atelier --private --source=. --push` → privates Repo live, `main` getrackt, CI aktiv. Offene Owner-Schritte für Go-Live: Supabase-Projekt anlegen + `db push`, Cloudflare Pages verbinden.
- 2026-06-03: **Go-Live.** Owner hat Cloudflare Pages mit dem GitHub-Repo verbunden (Framework-Preset „React (Vite)" auto-erkannt, Build `npm run build`, Output `dist`, Branch `main`). Seite live unter https://atelier-a9e.pages.dev, Auto-Deploy bei Push. Danach Prod-spezifischen Bug gefixt: BrowserRouter-Deep-Links (`/listing/:id`) lieferten auf Pages 404 → `public/_redirects` mit `/* /index.html 200` (Vite kopiert nach `dist/`). Verifiziert: `dist/_redirects` wird gebaut.
- 2026-06-03: Marktplatz funktional gemacht. Strukturierte Felder in `listings.ts` (`kind`/`revenueModel`/`saleType`/`monthlyRevenue`/`priceValue`/`listedAt`/`equity?`) + Label-Maps. Neue `Marketplace.tsx` (Filter/Sort/Empty-State, Counts **aus echten Daten** statt Fake-Zahlen, a11y via role=button+tabIndex). `Home.tsx` nutzt `<Marketplace/>`, Inline-Sektion entfernt. **Invest first-class**: neue GmbH-Beteiligung `lumen-analytics` (20% Anteile, €240k). Design 1:1 gehalten (nur bestehende Klassen). Bug gefixt: `typecheck`-Script war `tsc -b --noEmit` (TS6310 mit Composite-Ref) → `tsc -b`. Browser-Smoke-Test (Preview): Filter „Anteile/Sponsoring“ → 7→2 Listings, Design intakt.
