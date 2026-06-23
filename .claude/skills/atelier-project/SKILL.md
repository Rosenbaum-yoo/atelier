---
name: atelier-project
description: >
  Persistenter Projekt-Kontext fuer Atelier - ein kuratierter Premium-Marktplatz +
  Dealroom fuer fertige Software (SaaS, Apps, ganze Firmen, Anteile). Nutze diesen
  Skill bei jeder Arbeit im atelier-Projektverzeichnis. Definiert Architektur,
  Datenmodell, Zahlungs-/Treuhand-Flow, Patterns, Regeln und aktuellen Stand.
---

# Atelier - Projekt-Kontext (Stand: Juni 2026)

## Rolle
Du arbeitest seit Tag 1 an Atelier und kennst Zielbild, Architektur und Produktlogik vollstaendig. Arbeite inkrementell, production-ready, auf Enterprise-Niveau. Pruefe IMMER zuerst bestehende Strukturen (Repos, Komponenten, Migrationen, CSS-Klassen), bevor du Neues baust. Der gesamte Stack (Frontend + DB + RLS + Edge Functions + Recht) ist dein Territory. Der Owner ist **nicht-technisch** -> folgenreiche Schritte in Klartext ankuendigen und auf ausdrueckliches OK warten (siehe Regeln).

## Was ist Atelier
Kuratierte Boerse **+ Dealroom** fuer SaaS/Micro-SaaS, Apps, digitale Assets, kleine Firmen, Nachfolge, Beteiligungen. **USP:** ein Projekt nicht nur inserieren, sondern **pruefbar, vergleichbar, uebergabefaehig** machen — "Ein Projekt. Kaeufer, Pruefung & Uebergabe in einem Ablauf." Kuratiert, kein Flohmarkt; sitzt zwischen Kleinanzeigen und klassischer M&A-Beratung. **Nordstern:** schnellstmoeglich weltklasse Premium-Plattform am Markt, **von Anfang an produktionsreif fuer den weltweiten Markt** (i18n, Mehrwaehrung, intl. Zahlung/Steuer, DSGVO + intl. Recht, weltweite Performance) — keine Wegwerf-Zwischenstufen, kein "spaeter haerten". Trade-off ehrlich: "weltweit ab Start" dehnt v.a. Recht-/i18n-Scope.

## Produktvision & Scope
- **Marktseiten & Rollen (RBAC, geplant):** Verkaeufer · Kaeufer · **Experte** (Anwalt/Notar/Steuer/IT-Audit/M&A) · Admin. Experten-Synergie zu LEXConnect / ITDienstleistungenConnect / FreelancerConnect.
- **Spezialmodule (geplant):** Dealroom · NDA-Workflow · Proof-of-Revenue · Asset-/Tech-Stack-/MRR-Felder · Kaeuferfreigabe · Due-Diligence-Checkliste · Uebergabeplan · Blind Listings · Kaeufer-/Verkaeufer-Verifizierung.
- **Regulatorik (haargenau):** bewusst als **Inserats-/Kontakt-/Dealroom-Plattform** starten — **keine** Anlage-/Investmentvermittlung, kein Crowdinvesting, keine garantierte Bewertung. Plattform **vermittelt**, beraet/fuehrt nicht aus. NDA + Disclaimer durchgaengig. Erfolgsgebuehr "rechtlich vorsichtig" (Beteiligungen ggf. erlaubnispflichtig — pruefen).
- **Eigentuemer-Struktur (spaeter):** ConnectCore UG haelt Core-Tech und **lizenziert** sie an Atelier UG/GmbH -> fundiert das Lizenz/Zugang-Modell (Code bleibt geschuetzt; Cloud/VM-Hosting als spaetere Premium-Stufe).
- **Tech-Constraints (verbindlich):** React + Supabase + Cloudflare, **OHNE Hetzner**; **mobile Version** neben Web; **Staff Center = Prioritaet 1**; Design-Lock 1:1 aus der HTML.
- Volle Owner-Vision: `11_Atelier/projektbeschriebung.md`. Plan + Architektur: `docs/ROADMAP.md`.

## Architektur
- **Stack:** Vite + **React 18** + TypeScript (SPA, `react-router-dom` v6, BrowserRouter)
- **Backend:** **Supabase Cloud** (Postgres + Auth + Storage + **RLS**) — Projekt `DeEnProjekt`, ref `pqyvphzpajcwwerqbknx`, Frankfurt/eu-central-1
- **Hosting:** **Cloudflare Pages** -> https://atelier-a9e.pages.dev · Auto-Deploy bei jedem Push auf `main` · SPA-Fallback via `public/_redirects` (`/* /index.html 200`)
- **Zahlungen:** **Supabase Edge Functions** (Deno, `npm:stripe@^17`) — Server-seitige Stripe-Connect-Logik, einzige Geld-Schicht
- **Self-Host-Schalter:** `Dockerfile` (multi-stage -> nginx) + `infra/` (nginx.conf, docker-compose mit Traefik LB) liegen als Code bereit, laufen aber **nicht idle**. **Kein Hetzner.**
- **CI:** `.github/workflows/ci.yml` (typecheck + build)
- **Repo:** privat, https://github.com/Rosenbaum-yoo/atelier
- **Deps schlank:** nur `@supabase/supabase-js`, `react`, `react-dom`, `react-router-dom` (kein State-Lib, kein UI-Kit)

### Verzeichnisbaum
```
src/
  styles/atelier.css      <- Design (GESPERRT, 1:1 aus atelier.html, verbatim)
  styles/app.css          <- App-UI, token-only (Auth/Dashboard/Dealroom/Sell)
  styles/responsive.css   <- Mobile-Schicht (Nav-Menue + Phone-Feinschliff), token-only
  data/listings.ts        <- statische Listing-Daten (Seed-Quelle + Fallback)
  data/listingsRepo.ts    <- fetchListings/fetchListingBySlug/fetchOrgListings (Supabase + Fallback)
  data/dealsRepo.ts       <- Deal-Typ + createDeal/fetchBuyerDeals/fetchOrgDeals/updateDealStatus
  data/paymentsRepo.ts    <- einzige Client->Edge-Function-Bruecke (invoke)
  data/legalDocs.ts       <- strukturierte Rechts-Drafts (Impressum/AGB/Datenschutz/Widerruf)
  lib/supabase.ts         <- lazy Client (crasht nicht ohne .env), isSupabaseConfigured
  state/AuthContext.tsx   <- session/user/profile/loading/signOut/refreshProfile
  components/             <- Nav, Footer, ListingCard, Marketplace, LegalPage, ProtectedRoute, ScrollToTop
  pages/                  <- Home, ListingDetail, Login, Sell, Dashboard, Dealroom, Demo, Trust
  main.tsx · App.tsx      <- BrowserRouter + Routes
supabase/migrations/      <- 0001 init · 0002 orgs/deals · 0003 payments/plans/entitlements · 0004 listing-sold
supabase/functions/       <- connect-onboarding · checkout · stripe-webhook · confirm-release · _shared/
supabase/config.toml      <- verify_jwt je Funktion (webhook=false), project_id
scripts/gen-seed.mjs      <- strippt TS-Typen, emittiert idempotentes supabase/seed.sql
docs/                     <- ARCHITECTURE · SCALING · RUNBOOK · SECURITY · ROADMAP · adr/{0001,0002}
infra/ · Dockerfile       <- Self-Host-Schalter (nicht aktiv)
.github/workflows/ci.yml  <- typecheck + build
```

### Routen (App.tsx)
`/` Home (eager) · `/listing/:id` Detail · `/preise` Preise · `/faq` FAQ · `/ueber-uns` About/Vision · `/demo` Walkthrough · `/recht` Trust-Hub · `/recht/:slug` Rechtsdokument · `/login` · **geschuetzt** (`ProtectedRoute`): `/sell` `/dashboard` `/dealroom` `/staff` (Staff Center / Verifizierungs-Queue). Alle Nicht-Landing-Routen **lazy** (`React.lazy`+`Suspense`, kleineres Initial-Bundle). Anker-Navigation via `HashLink` (SPA, kein Full-Reload) + hash-aware `ScrollToTop`. **SEO/Social:** statisches Meta + OpenGraph/Twitter + JSON-LD in `index.html`; `public/robots.txt` + `sitemap.xml` + `og-cover.png` (1200x630, via sharp aus `og-cover.svg`).

## DESIGN-LOCK (nicht verhandelbar)
- Single source of truth: `src/styles/atelier.css` — **verbatim aus `atelier.html`**, nie umgeschrieben. Neue App-CSS lebt in `app.css`/`responsive.css` und nutzt **ausschliesslich bestehende Tokens + Klassen**.
- **Tokens:** `--bg`#F5F0E8 · `--bg-warm`#EFE7D6 · `--bg-card`#FAF7F0 · `--ink`#1B1916 · `--ink-soft`#4A463F · `--ink-mute`#8B8478 · `--line`#DDD3BF · `--line-soft`#E8DFC9 · `--accent`#CC785C · `--accent-deep`#A85A40 · `--accent-soft`#E8B8A6 · `--success`#5F7A4F · `--gold`#B89968.
- **Fonts:** **Fraunces** (Serif-Headlines, `em` = italic) · **Geist** (Body) · **Geist Mono** (Labels/Meta).
- **Radius:** Buttons `999px`, Cards `4-6px`. Papierkorn via `body::before`.
- **Etablierte Klassen** (vor Neubau per Grep pruefen): `eyebrow` (nicht page-eyebrow), `.page-head p` (nicht page-sub), `.pill-*` (open/accepted/declined/withdrawn/published), `.btn`/`.btn-sm`/`.btn-primary`, `.alert-ok`/`.alert-warn`, `.empty-block`, `.dash-section`, `.row-*`, `.auth-card`, `.legal`.
- NIE Farben/Fonts/Radii erfinden. Neue Komponenten MUESSEN bestehende Klassen wiederverwenden.

## Datenmodell + RLS (mandantenfaehig ab Migration #1)
**Multitenancy:** `org_id` auf jeder Business-Zeile; **RLS erzwingt Isolation** (deny-by-default). Helper `current_org_id()` (SECURITY DEFINER) = Org des Callers via `profiles`.

| Tabelle | Zweck / Schluesselfelder | RLS-Kern |
|---|---|---|
| `orgs` | Mandant; `name`, `slug` | liest nur eigene Org |
| `profiles` | 1:1 zu `auth.users`; `org_id`, `role` (owner/admin/member), `display_name` | liest self + Org-Mates, updated nur self |
| `listings` | Marktplatz; `slug`, `title`, `category`, **`status`** (draft/published/archived/**sold**), `kind` (saas/ios/android/web/devtool/game/ai), `revenue_model` (mrr/onetime/iap/ads), `sale_type` (full/**shares**/license), `monthly_revenue`, `price_value`, `listed_at`, **`data` jsonb** (tech/metrics/highlights/financials/seller/badges/equity) | **public read** nur `published`; eigene Org liest/schreibt alle eigenen |
| `deals` | Dealroom; `listing_id`, `buyer_id`, **`seller_org_id`** (server-abgeleitet), `status` (open/accepted/declined/withdrawn), `offer_amount`, + **Payment-Lifecycle** (s.u.) | Kaeufer sieht eigene; Verkaeufer sieht Deals seiner Org; beide-seitig insert/update gated |
| `plans` | Tarif-Katalog (global, nicht tenant-scoped); `id` (`start`/`individuell`), `commission_bps`, `is_public`, `features` | **public read**, Writes server-side |
| `org_entitlements` | 1:1 zu `orgs`; `plan_id`, `commission_bps_override`, **`stripe_account_id`** (Connect-Payout), **`stripe_account_ready`** | Org liest nur eigene; **keine** Client-Write-Policy (nur service_role) |
| `individuell_requests` | Formular -> Staff Center; `contact_*`, `status` (new/reviewing/activated/declined) | Org insert/read eigene; Staff liest global server-side |

### Geldfelder auf `deals` (alle in **CENT**, server-seitig berechnet)
`payment_status` (none -> pending -> held -> released; + refunded/failed) · `currency` (default eur) · `amount_gross` (Kaeufer zahlt) · `fee_amount` (Plattform) · `amount_net` (Verkaeufer-Payout) · `stripe_checkout_session_id` · `stripe_payment_intent_id` · `stripe_transfer_id` · `buyer_confirmed_at` · `paid_at` · `released_at`. **Unique-partial-Indizes** auf Stripe-IDs fuer schnellen, sicheren Webhook-Lookup.

### Trigger / Server-Wahrheit (nie dem Client vertrauen)
- `handle_new_user()` (0002): legt pro Signup **persoenliche Org + owner-Profil** an (noetig, weil listings-RLS `org_id = current_org_id()` verlangt) + Backfill.
- `set_deal_seller_org()` (0002): leitet `seller_org_id` **server-seitig aus dem Listing** ab.
- `handle_new_org()` (0003): auto-provisioniert default `start`-Entitlement je neuer Org + Backfill.
- `block_offer_on_sold()` / `block_delete_paid_listing()` (0004, SECURITY DEFINER): kein Angebot auf `sold`-Listing; kein Loeschen eines Listings mit `held`/`released`-Deal (schuetzt Geld-/Audit-History gegen FK-Cascade).
- `touch_updated_at()`: haelt `updated_at` ehrlich.

### Migrationen (additiv + idempotent, RLS in derselben Migration)
- **0001** init: orgs/profiles/listings + RLS + `current_org_id()`.
- **0002** auth/orgs/deals: Org-Auto-Provisioning + `deals` + RLS (beide Marktseiten).
- **0003** payments/plans/entitlements: `plans` (provision-only), `org_entitlements`, Payment-Lifecycle auf `deals`, `individuell_requests` — alles RLS.
- **0004** listing-sold: `sold`-Status + Idempotenz-Trigger + Backfill.
- **0005** verification: Verifizierungs-Flags auf `org_entitlements` (**server-owned**, kein Client-Write) + Badge via View `listings_public` / `listing_verified_flags()` (SECURITY DEFINER) + `verification_requests` + `platform_staff`-Allowlist + `verification_audit` (append-only) + Revenue-Freeze-Trigger — alles RLS.

## Zahlungen / Treuhand (Stripe Connect — das groesste de-riskte Risiko)
**Modell (ADR 0002):** Stripe Connect **Express** (Verkaeufer-Payout-Accounts) · **separate charges & transfers** · **hold-and-release-Treuhand**. Stripe ist die regulierte/PCI-Entitaet — wir beruehren nie Kartendaten und vermeiden eigene Zahlungs-/E-Geld-Lizenz.

**Geldfluss:** Verkaeufer-Onboarding -> Kaeufer-Checkout (voller Betrag auf **Plattform-Balance = Treuhand-Hold**) -> Webhook setzt `held` + Listing `sold` -> Kaeufer bestaetigt Asset-Erhalt -> Transfer `amount_net` an Connected Account -> `released`.

### 4 Edge Functions (`supabase/functions/`, Deno)
| Function | verify_jwt | Aufgabe |
|---|---|---|
| `connect-onboarding` | true | Express-Account **einmalig** anlegen + Hosted-Onboarding-Link; **Readiness live via `accounts.retrieve`** (`charges_enabled && payouts_enabled`) auf jedem Call — der plattform-scopte Webhook traegt keine Connected-Account-Events. |
| `checkout` | true | Checkout-Session; **Fee server-seitig** = `commission_bps_override ?? plan.commission_bps ?? 600`; `amount_gross = offer_amount*100`; Capture = Hold. **Idempotenz-Guard**: refuse wenn Listing `sold` oder Rival-Deal `held`/`released`. Stripe-Tax env-gated (`STRIPE_TAX_ENABLED`). |
| `stripe-webhook` | **false** | Single source of truth fuer State; Signatur via `constructEventAsync`, idempotent: `checkout.session.completed`->`held`+Listing `sold`; `payment_intent.payment_failed`->`failed`; `charge.refunded`->`refunded`+Listing zurueck `published`; `account.updated`->`stripe_account_ready`. |
| `confirm-release` | true | Buyer-Freigabe -> `transfers.create(amount_net)`; **`source_transaction = latest_charge`** (zieht aus genau dieser Charge auch vor Settlement/pending balance — sonst "insufficient available funds"); `idempotencyKey = release-{dealId}-{charge}` gegen Doppelauszahlung. |
- `_shared/`: `supabase.ts` (`admin()` = service_role bypass RLS; `getUser(req)` aus JWT) · `stripe.ts` (fetch-HTTP-Client + SubtleCrypto fuer async Signatur) · `http.ts` (CORS/json).
- **Deploy:** `supabase.exe functions deploy <name> --project-ref pqyvphzpajcwwerqbknx` (kein `link`/DB-Passwort noetig). `SUPABASE_URL/ANON_KEY/SERVICE_ROLE_KEY` werden auto-injiziert. Secrets (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `APP_URL`, `STRIPE_CONNECT_COUNTRY`) nur in Function-Env, nie im Repo.

### "Ein Listing verkauft sich nur einmal" (mehrschichtig, server-seitig)
(1) Migration 0004 `sold`-Status + Trigger; (2) Webhook setzt bei `held` Listing `sold` (faellt aus Markt, da `fetchListings`/RLS nur `published` liefern); (3) checkout-Rival-Guard; (4) Frontend zeigt "Verkauft" + deaktivierten Button. **Bekannte Restluecke:** quasi-gleichzeitiger Doppelkauf (beide Checkouts vor erstem `held`) -> Follow-up = Webhook prueft beim `held`-Uebergang auf bereits bezahlten Deal + Auto-Refund des Verlierers.

## Patterns (IMMER verwenden)
- **Repo-Schicht:** alle DB-Reads/Writes ueber `*Repo.ts`, nie direkt aus Komponenten. `listingsRepo`/`fetchListingBySlug` lesen **immer aus Supabase mit statischem Fallback** (`src/data/listings.ts`), wenn unkonfiguriert/leer/Fehler — Seite nie leer. **Sobald DB = Truth, MUESSEN alle Detail-/Listen-Reads aus der DB lesen** (kein statisches `getX(id)`).
- **Owner-Views** (`fetchOrgListings`/`fetchOrgDeals`) fallen **nicht** auf static zurueck (RLS liefert org-eigene Zeilen).
- **paymentsRepo = einzige Client->Edge-Function-Bruecke:** `supabase.functions.invoke` (JWT wird automatisch angehaengt -> erfuellt `verify_jwt=true`). Fehler-Helper liest JSON-`error`-Body aus `error.context` (Functions liefern auch im Fehlerfall JSON).
- **Geld immer server-seitig in Cent**, nie vom Client; Betraege/Fees in Edge Functions berechnet.
- **Server leitet Vertrauenswerte ab** (`seller_org_id`, Fee) — Client-Werte nie als Wahrheit nehmen.
- **Lazy Supabase-Client** (`getSupabase()` wirft erst bei erster Nutzung); `isSupabaseConfigured` gated jeden datenabhaengigen Pfad.
- **Datengetrieben statt wiederholtem JSX:** 1 Komponente + `map()` (z.B. `Marketplace`, `LegalPage`+`Trust`, `Demo` `DEMO_STEPS`, Nav `NAV_ITEMS`).
- **Auth:** `useAuth()` (Context); geschuetzte Seiten via `<ProtectedRoute>` (Redirect `/login`).
- **React != Sicherheit:** die DB (RLS) + Edge Functions sichern ALLES ab; Frontend spiegelt nur.

## Regeln
- **Keine Secrets in Git:** `.env` (gitignored), nur `.env.example` getrackt. **anon-Key ist public-safe** (sicher via RLS); **`service_role`-Key NIE im Client/Repo** (nur Edge-Function-Env).
- **SQL-Aenderungen IMMER als neue Migration** unter `supabase/migrations/`, **additiv + idempotent**, mit `enable row level security` + Policies in derselben Migration. Jede neue Tabelle traegt `org_id` + RLS.
- **KEIN Commit/Deploy/Go-Live ohne ausdrueckliche Aufforderung.** Folgenreiche Schritte (Deploy, Kosten, Account/Infra, Irreversibles) vorab in Klartext ankuendigen + erst auf OK ausfuehren; reversible lokale Arbeit bleibt decide-and-act. Owner ist nicht-technisch -> turnkey + Schritt-fuer-Schritt-Handoff fuer Account-Aktionen.
- **Design-Lock** (s.o.): `atelier.css` verbatim, nur Tokens/Klassen.
- **Kein Fake-Data in echten Flows:** statische `src/data/*` ist Seed/Fallback; Demo-Deal ist hart kodiert + sichtbar als "Beispiel" deklariert, ruehrt nie an echte DB.
- **Effizienz (Pflicht):** grosse Dateien per Shell extrahieren/transformieren (nie neu tippen); unabhaengige Tool-Calls parallel; Edit > Write; bekannte Dateien nicht erneut lesen; verifizieren ueber **Typecheck/Build** (`npm run build` = `tsc -b && vite build`), nicht Re-Reading; Output terse.
- **Production-only + weltweit ab Start:** immer fuer echte zahlende Kunden bauen, kein Demo-/Test-Grade-Stopgap; i18n/Mehrwaehrung/intl. Recht ab Tag 1 mitdenken (Trade-off offen benennen).
- **PAT-Deploy-Muster (Windows):** `supabase login` (Keyring) bruecke **nicht** zu automatisierten Prozessen. PAT in `%USERPROFILE%\.atelier-supabase-token` (gitignored, nie im Chat), pro Befehl in `SUPABASE_ACCESS_TOKEN` laden (`(Get-Content … -Raw).Trim()`), nie ausgeben; nach Deploy loeschen. CLI = offizielle GitHub-Release-Binary (`%USERPROFILE%\supabase-cli\supabase.exe`), nicht npm.
- **UTF-8 beim Clipboard:** `Get-Content -Raw -Encoding UTF8 | Set-Clipboard` (sonst Mojibake im SQL-Editor).
- **Doku ab Tag 1:** README/ARCHITECTURE/SCALING/RUNBOOK/SECURITY/ADRs; Architekturentscheidungen als ADR. **CLAUDE.md `Status` + `Self-Learning Log` bei JEDER Aenderung pflegen.**
- **Co-Author bei Commits:** `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`. Commit ohne globales git-config-Update (`-c user.name=…`).

## Monetarisierung
- **AKTIV: provision-only** — Umsatz ausschliesslich ueber **Erfolgsprovision je Verkauf** (Default **6 %**, `start`-Tarif) + owner-aktivierter **`individuell`**-Satz (`commission_bps_override`). **Kein Abo** zum Launch (kein Stripe-Subscriptions/Billing-Portal noetig -> schnellster Weg zum 1. Euro).
- `plans`: `start` (600 bps, public, gratis) · `individuell` (non-public, **Formular -> Staff Center -> Owner aktiviert manuell**; bewusst NICHT "Enterprise" = keine implizite SLA-Garantie). `plans`-Tabelle koennte Abo spaeter tragen, bleibt bewusst leer.
- **Abos sind eine dokumentierte Option** (Owner-Projektbeschreibung listet Listing-/Dealroom-Abos) — **offener Konflikt** zur Provision-only-Entscheidung, Owner-Klaerung ausstehend.
- **High-Value-Cap (geplant):** ueber konfigurierbarer Schwelle -> regulierter Escrow/Treuhand-Partner (Notar-Anderkonto / Mangopay / Lemonway) statt Stripe-Hold; deferred bis solche Deals auftauchen (no idle cost).

## Aktueller Stand (Juni 2026)
- **LIVE:** Cloudflare Pages + Supabase Cloud; Marktplatz mit Filter/Sort/Empty-State (Counts aus echten Daten, Anteile/Invest first-class via `sale_type=shares`); Detail-Seite laedt aus DB (Fallback, Loading/404-States).
- **Auth + Verkaeufer-Flow + Dashboard + Dealroom live** (Migrationen 0001-0004 vom Owner im SQL-Editor ausgefuehrt). Seller-Publish, eingehende Angebote, Kaeufer/Verkaeufer-Aktionen.
- **Stripe-Treuhand END-TO-END im TEST bestanden ✓** (Karte 4242, localhost): Onboarding -> Kaeufer zahlt -> Treuhand `held` -> Freigabe (`source_transaction`-Fix) -> `released`/Payout. **Live = identischer Code**, nur `sk_test_`->`sk_live_` + neues `whsec_` + `APP_URL`=Domain + Connect-Re-Onboarding.
- **Trust Center** (`/recht`): Impressum/AGB/Datenschutz/Widerruf als strukturierte **Drafts** (`draft:true`, Owner-Angaben in `[Klammern]`, Draft-Banner) — vor Go-Live: Firmendaten + Anwalts-Freigabe.
- **Demo-Walkthrough** (`/demo`): selbstlaufender 6-Schritt-Lifecycle, datengetrieben, klar als Beispiel markiert.
- **sold-Fix** (0004) verifiziert (verkauftes Test-Listing aus Markt).
- **Mobile + PWA fertig:** Hamburger-Nav (`Nav.tsx`/`nav-mobile`) + `responsive.css` (token-only); `vite-plugin-pwa` + Manifest + Brand-Icons (`scripts/gen-icons.mjs`); Supabase/Stripe = NetworkOnly (Auth/Geld nie gecacht).
- **Verifizierung/Trust-Foundation** (0005): Badges „✓ Verkaeufer verifiziert"/„✓ Umsatz geprueft" (server-owned, View-abgeleitet), Edge Function `verification-review` (Staff-Gate via `platform_staff`), Staff Center `/staff` (Bestaetigen/Ablehnen-Queue), Dashboard „Verifizierung anfordern".
- **KI-Listings:** Edge Function `generate-listing` (Claude `claude-sonnet-4-6` via rohem fetch), `Sell.tsx` „✨ Beschreibung mit KI generieren". **Gate:** `ANTHROPIC_API_KEY`-Secret + Deploy.
- **Landing/Launch-Reife (2026-06-22, gegen TempConnect/TerminPuls-Benchmark):** erfundene Hero-Kennzahlen RAUS → ehrliche Pre-Launch-Claims + Beispiel-Kennzeichnung; ehrliche **Trust-Bar**; **Preise-Seite** `/preise` (6% + Individuell); **FAQ** `/faq` (natives `<details>`, echte Einwaende); tote CTAs/Anker verdrahtet; **funktionaler Preis-Slider**; Footer bereinigt. Build 107 Module gruen.

## Gates bis echte zahlende Kunden (ehrlich)
1. **UG gegruendet** -> **neues** Stripe-Business-Konto (kein "Umschalten" des Privatkontos; fremdes Geld auf Privatkonto = persoenliche Haftung). 2. **Rechtstexte final** + Anwalts-Freigabe + Firmendaten. 3. **Eigene Domain** + Resend-Confirm-Mail (Phase B). 4. **Equity-/Firmen-Deals** brauchen Notar-Pfad (**§ 15 GmbHG**, notarielle Beurkundung) vor Freigabe — aktueller Klick->Transfer gilt nur fuer Asset/Software-Deals; Plattform-Equity nur bespoke/"Individuell".

## Roadmap-Phasen (`docs/ROADMAP.md`)
A Umsatz-Fundament (Stripe + Treuhand + Trust Center) — **weitgehend erledigt** · B Marke + Auth produktionsreif (Domain + Resend SPF/DKIM/DMARC + Confirm-Email) · C Preise + "Individuell"-Flow · **D Staff Center** (Owner-Konsole, isoliert, eigene Subdomain, spaeter server-seitiger AI-Ops-Endpunkt — **Prio 1**, Muster TempConnect) · E Support Center (isoliert, auslagerbar) · F Enterprise-Haertung + GTM.

## Offene Owner-Entscheidungen
- **Monetarisierung:** Abos (Projektbeschreibung) vs. **Provision-only** (aktive Entscheidung) — Konflikt, Klaerung noetig.
- **Mobile:** responsive **PWA** vs. React Native — Tendenz PWA-zuerst (responsive.css/Nav in Arbeit), offen.
- **Staff Center = Prio 1** (noch nicht gebaut).
- **ConnectCore-"Kern":** existiert bisher nur als Doku (`_CONNECTCORE/`), **kein importierbarer Code** — i18n/RBAC/Module kommen sauber mit dem Kern, nicht als Wegwerf-Vorabloesung.
- **Domain-Name/Endung** festlegen -> schaltet Phase B frei.

## Praezisierungen (Review-verifiziert, 2026-06-04)
- **Kanonischer Ordner:** `C:/Users/DennisStegemann/Desktop/11_Atelier(D)/atelier` (mit `(D)`), lokal, raus aus OneDrive. Es gibt mehrere divergierende Kopien (OneDrive\Desktop\atelier, SESSIONS/11_Atelier/atelier) — NUR die `(D)`-Kopie ist Wahrheit.
- **APP_URL:** Code-Default in `checkout` + `connect-onboarding` ist hartkodiert `https://atelier-a9e.pages.dev` (`Deno.env.get('APP_URL') ?? '...'`); der Test-Wert `http://localhost:5173` existiert nur als gesetzte Function-Env, nicht im Code.
- **connect-onboarding:** `accounts.create` fordert capabilities `transfers` UND `card_payments` (beide requested) — card_payments noetig, damit `charges_enabled` true wird.
- **checkout:** setzt `transfer_group=deal.id` + `metadata.deal_id` bereits am PaymentIntent; `confirm-release` nutzt denselben transfer_group + `source_transaction=latest_charge`.
- **confirm-release:** schreibt beim Release `payment_status=released`, `released_at`, `buyer_confirmed_at` UND `stripe_transfer_id` in einem Update (buyer_confirmed_at also erst beim Release).
- **listingsRepo** exportiert zusaetzlich `setListingStatus(slug,status)` + `deleteListing(slug)`; **dealsRepo** zusaetzlich `fetchListingIdBySlug`.
- **AuthContext** liegt unter `src/state/AuthContext.tsx`; `useAuth()` im selben Modul — KEINE `src/hooks/`- oder `src/contexts/`-Verzeichnisse.
- **ScrollToTop** wird in `App.tsx` GLOBAL vor `<Routes>` gerendert.
- **i18n-Realitaet (ehrlich):** Trotz Direktive "weltweit ab Tag 1" ist i18n real NOCH NICHT begonnen — weder Frontend noch Edge Functions; alle 4 Functions geben hartkodiert DEUTSCHE Fehlertexte zurueck. Offene Luecke.
- **Mobile/PWA-Stand:** responsive.css mit Nav-Menue + 29-Gap-Audit (verifiziert); PWA via vite-plugin-pwa (manifest + Brand-Icons + Supabase/Stripe NetworkOnly) in Umsetzung.
## Betrieb (lokal + Deploy)
- **Dev-Server:** `npm run dev` -> **http://localhost:5411** (fester Port, strictPort; Schema 5400+Projektnr). **Nur npm**, kein pnpm (Mischen korrumpiert node_modules + bricht den Cloudflare-Build).
- **Deploy:** `git push origin main` -> Cloudflare Pages baut mit npm -> https://atelier-a9e.pages.dev. Nach jedem Push **verifizieren** (Live-URL auf neuen Marker pollen, z.B. /manifest.webmanifest). Bei Haengern: Cloudflare-Wartungsbanner pruefen.
- **Stale-Config-Falle:** `tsc -b` emittiert evtl. `vite.config.js` (gitignored); ueberschreibt die .ts beim Dev-Start -> bei falschem Port `vite.config.js`/`.d.ts` loeschen.