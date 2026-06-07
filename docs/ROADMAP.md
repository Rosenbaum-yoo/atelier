# Atelier — Enterprise-Roadmap

> Ziel: in ~4 Wochen marktreif für **echte zahlende Kunden** (Premium, Enterprise-Verträge).
> Bar: 100% Produktionsqualität, keine Demo/Spielerei. Immer die skalierbar-zukunftssicherste Option.
> Quelle: Owner-Vorgabe 2026-06-03. Dies ist die abzuarbeitende ToDo-Liste; jede erledigte Zeile wird `[x]`.

## Nordstern
Kuratierter Marktplatz für fertige Software / Firmen / Anteile, der **echtes Geld** sicher abwickelt,
mit produktionsreifer Auth, eigener Marke (Domain), Rechtssicherheit, **Provision-only**-Modell
(kein Abo) inkl. bespoke **„Individuell"**-Tarif sowie isoliertem **Staff Center** (Owner) und **Support Center**.

## Architektur-Entscheidungen (Owner-Fragen beantwortet)
- **Multi-Org / Mandantenfähigkeit:** ✅ nötig & vorhanden (`org_id` + RLS ab Migration #1). Beibehalten & ausbauen.
- **Multi-Standort:** ❌ nicht nötig — Standort-Konzept gehört zu Field-Service/Retail-SaaS, nicht zu einem Software-Marktplatz. Später nachrüstbar, falls ein Individuell-Kunde es verlangt.
- **SSO (SAML/OIDC):** ❌ nicht jetzt — nur relevant für Enterprise-Orgs mit Login-Zwang. Auth so bauen, dass Supabase-SSO später als Individuell-Feature zuschaltbar ist. Nicht vorab bauen.
- **Hetzner:** ❌ nicht ins Staff Center jetzt — Stack ist serverless (Cloudflare + Supabase), skaliert ohne VPS. Hetzner bleibt dokumentierter Self-Host-Schalter (`infra/`), nur bei echtem Bedarf (Kosten/Kontrolle bei großer Last).
- **Claude-/AI-Zugangspunkt im Staff Center:** ✅ aber spätere Phase — sicherer **server-seitiger** Admin-API-Endpunkt (Owner-only), optional KI-Assistent via Anthropic API. NIE `service_role`/Keys im Client. Erst Module, dann der AI-Hebel.
- **Plattform-Beteiligung an verkauften Projekten (Gesellschafterrechte):** ❌ nicht als Standard — bricht die neutrale Vermittler-Rolle + schwere Steuer/Governance/Notar-Last. Nur **bespoke über „Individuell"/Staff Center** mit Anwalt; Provision bleibt Kern.

## Phasen (Reihenfolge = Empfehlung)

### Phase A — Umsatz-Fundament (höchste Prio: ohne das zahlt niemand)
- [x] **ADR Zahlungen/Treuhand/Monetarisierung** → `docs/adr/0002` (Stripe Connect Express, separate charges&transfers, Provision-first, Hold-and-Release-Treuhand, Stripe Tax, Edge Functions; nahezu null Fixkosten)
- [x] Migration `0003` geschrieben: `plans` (Start/Individuell, **Provision-only — kein Abo**) + `org_entitlements` (Plan + Stripe-Connect-Linkage + Commission-Override) + Payment-Lifecycle auf `deals` (hold-and-release) + `individuell_requests`; alles RLS + idempotent → **Owner: im SQL-Editor ausführen**
- [ ] Supabase Edge Function `checkout` + Stripe-Webhook (server-seitig, Signaturprüfung, Idempotenz; Keys nur im Function-Env)
- [ ] Stripe Connect: Käuferzahlung → Plattform-Gebühr → Auszahlung an Verkäufer-Org (Onboarding Express)
- [ ] Treuhand/Meilenstein: Auszahlung erst nach buyer-bestätigtem Asset-Transfer; Hochpreis-Schwelle → Partner (später)
- [ ] **Equity-/Firmen-Deals als eigener Pfad:** GmbH-Anteilsübertragung notariell (§ 15 GmbHG) → Treuhand-Freigabe erst nach Notar-/Übertragungsnachweis, **nicht** per Klick (Asset/Software-Deals unverändert)
- [ ] Deal-Flow mit Zahlung verdrahten (Annahme/Checkout, Status spiegelt Zahlung)
- [x] Rechts-Pflicht DE vor erstem Kunden (Trust Center): Impressum, AGB, Datenschutz/DSGVO, Widerruf — **Entwürfe live** unter `/recht`; Anwalts-Freigabe + Firmendaten offen

### Phase B — Marke + Auth produktionsreif
- [ ] Eigene Domain besorgen (Owner: Kauf) + auf Cloudflare Pages + DNS (ich: Einrichtung)
- [ ] Resend als echter Mailversand auf der Domain (SPF/DKIM/DMARC verifiziert)
- [ ] Supabase: Confirm-Email AN, Site-URL + Redirect-URLs auf Domain, Custom SMTP = Resend
- [ ] Transaktionsmails: Bestätigung, „Angebot eingegangen", „Deal angenommen"
- [x] Code: `emailRedirectTo` auf aktuellen Origin (Bestätigungslink zeigt auf richtige Seite)

### Phase C — Preise + „Individuell"-Flow (Provision-only, kein Abo)
- [ ] Preis-Seite: **Kostenlos – Provision bei Erfolg** + Top-Tier **„Individuell"** (bewusst NICHT „Enterprise" → keine implizite Garantie); **keine Abo-Stufen**
- [ ] „Individuell"-Anfrageformular → landet im **Staff Center** → Owner aktiviert Tarif manuell
- [x] Tarif-/Entitlement-Modell in DB (Feature-Gates pro Org, RLS-sicher) — `plans` + `org_entitlements` in `0003`

### Phase D — Staff Center (Owner-Konsole, isoliert)
- [ ] Eigener Einstiegspunkt, **nicht** aus der Plattform verlinkt/erreichbar (eigene Subdomain, Owner-Rolle + server-seitige Prüfung, RLS, IP-Allowlist)
- [ ] Module: Individuell-Anfragen + Tarif-Aktivierung, Org-/User-Übersicht, Audit-Feed
- [ ] Steuerung/Status: Supabase & Cloudflare (read + kontrollierte Aktionen via server-seitige API)
- [ ] (später) AI-/Claude-Ops-Endpunkt, Owner-only

### Phase E — Support Center (isoliert, auslagerbar)
- [ ] Eigener Einstiegspunkt, getrennt vom Owner-Staff-Center; Support-Rolle mit eng begrenztem Zugriff (Tickets/Eskalationen)
- [ ] Nicht aus der Plattform erreichbar; an externes Team auslagerbar

### Phase F — Enterprise-Härtung + Go-to-Market
- [ ] SLA-Definition (Ziele/Messung/Alerting) als Individuell-Bestandteil
- [ ] Trust Center ausbauen: Security-Übersicht, Sub-Prozessoren, Status-Page
- [ ] Observability: Healthchecks, strukturierte Logs, Error-Tracking, Uptime-Monitoring
- [ ] Tests kritischer Pfade: Zahlung, Auth, **RLS-Mandanten-Isolation**
- [ ] Doku-Suite + Frontend-Politur (README, ARCHITECTURE, SCALING, RUNBOOK, SECURITY, ADRs)

## Offene Owner-Entscheidungen (blockieren bestimmte Phasen)
- **Domain-Name/Endung** (Tarif „Neue besorgen" gewählt) — Name festlegen → schaltet Phase B frei
- **Stripe-Konto:** Land/Rechtsform für Auszahlungen; Treuhand-Partner ja/nein → Phase A
- **Rechtstexte:** anwaltliche Freigabe von AGB/Datenschutz vor Go-Live (ich liefere Entwürfe + Struktur)

## Prinzip für die Doku
Bestehende Docs (ARCHITECTURE/SECURITY/SCALING/RUNBOOK) wachsen **mit jeder gelieferten Phase**,
nicht spekulativ vorab — gemäß Effizienz- & „keine spekulativen Features"-Regel. ADRs pro Architekturentscheidung.
