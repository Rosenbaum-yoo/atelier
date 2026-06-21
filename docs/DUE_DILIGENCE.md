# Atelier — Due-Diligence / Reifegrad (lebendes Dokument)

> Wiederkehrend ~alle 30 Tage (Dauerauftrag). Investor-grade, ehrlich bewertet. Dimensionen: Reifegrad · Marktrelevanz · Feature-Notwendigkeit · Marktwert · Investor-Potenzial. **Harte Go-Live-Sperre: kein Markt unter 95 % Enterprise / keine offene Frage.** Datenbasis: `docs/FEATURES.md`, `docs/COMPLIANCE_ISO27001.md`, Code.

---

## Baseline — 2026-06 (Stand 1)

### Executive Summary
Atelier ist eine **technisch erstaunlich weit de-riskte** kuratierte SaaS-/Firmen-Börse: das schwerste Stück — **Treuhand-Zahlung über Stripe Connect (separate charges & transfers, hold-and-release)** — läuft End-to-End im Test, inkl. RLS-Mandantentrennung, „verkauft-sich-nur-einmal"-Idempotenz, Mobile + installierbarer PWA. **Das ist überdurchschnittlich für Pre-Launch.** Die offenen Punkte sind nicht technischer Natur, sondern **Recht/Compliance, Trust-Tiefe (Verifizierung/Due-Diligence-Module), i18n und das gegründete Unternehmen**. **Gesamtreife: ~62 % Enterprise** → **noch nicht am 95 %-Gate.**

### 1. Reifegrad / Maturity
| Bereich | Reife | Kommentar |
|---|---|---|
| Zahlungen/Treuhand | ~85 % (Test) | Live = Key-Tausch + UG; größtes Risiko de-riskt |
| Sicherheit (RLS/Auth/Secrets) | ~85 % | stark; Audit-Log/Alerting + CSP offen |
| Datenmodell/Multi-Tenant | ~90 % | sauber, additive Migrationen |
| Marktplatz/Listing/Deal-Flow | ~80 % | solide; Dealroom-Tiefe (Akte/Chat/Docs) fehlt |
| Mobile + PWA | ~85 % | installierbar, responsive, verifiziert |
| Recht/Trust Center | ~50 % | **Entwürfe**, Anwalt + Firmendaten fehlen |
| Verifizierung/DD-Module | ~5 % | Kern-USP noch nicht gebaut |
| i18n/Mehrwährung | 0 % | trotz „weltweit ab Start"-Direktive nicht begonnen |
| Ops/Observability | ~30 % | Logs ja, Monitoring/Alerting/Backup-Test nein |
| Tests/CI | ~35 % | CI typecheck+build; kaum automatisierte Tests |
| **Gesamt** | **~62 %** | technisch top, Compliance/Trust/Tests die Lücken |

### 2. Marktrelevanz
**Markt existiert und zahlt:** Flippa, Acquire.com (ex-MicroAcquire), Empire Flippers bedienen genau SaaS/Micro-Acquisition. **Lücke:** zwischen Kleinanzeige und teurer M&A-Beratung — strukturierte **Prüfung + Übergabe** in einem Ablauf. Genau Ateliers USP. **DACH-fokussierter, kuratierter, treuhand-nativer** Ansatz ist differenzierend (die großen sind US/EN, oft ohne integrierte Treuhand). **Risiko:** Netzwerkeffekt-Markt (Henne-Ei: Käufer ↔ Verkäufer) — Liquidität ist das eigentliche Go-to-Market-Problem, nicht die Technik.

### 3. Feature-Notwendigkeit (must / nice / cut)
- **Must vor Launch:** finale Rechtstexte + Anwalt · Verkäufer-/Käufer-**Verifizierung** + **Proof-of-Revenue** (Vertrauen = Produkt) · Dealroom-Akte (Verlauf/Docs) · E-Mail-Bestätigung (Resend) · Basis-Monitoring/Backup-Test.
- **Nice (Differenzierung):** KI-Listing-Beschreibungen · Due-Diligence-Checklisten · MRR→Bewertungs-Assistent · Blind Listings.
- **Später/cut für MVP:** Equity-/Notar-Pfad · Mehr-Jurisdiktions-i18n · Staff Center (intern, parallel).

### 4. Marktwert (ehrlich, mit Caveats)
**Pre-Revenue, Pre-Launch** → kein DCF, Bewertung = Asset + Opportunität.
- **Heute (Codebase/IP, kein Umsatz, kein Live-Kunde, solo gebaut):** als reines Asset niedrig — der Wert liegt im **de-riskten Treuhand-Stack + Nischen-Klarheit + ConnectCore-Synergie**, nicht in Traktion.
- **Kategorie-Potenzial:** vergleichbare Plattformen zeigen, dass der Markt **siebenstellige Jahresumsätze** trägt (Provision + Premium-Zugänge + Services; Doc-Schätzung ~1,9–3,8 Mio €/Jahr bei Skalierung — **Potenzial, keine Zusage**).
- **Werthebel (in Reihenfolge):** (1) erste **echte abgeschlossene Deals** (Provision-Proof) · (2) Recht/Trust live · (3) Liquidität (Listings × Käufer) · (4) wiederkehrender Umsatz (Premium-Zugänge).

### 5. Investor-Potenzial / Raise-Readiness
**Was ein Investor zuerst prüft — und was er findet:**
- ✅ **Tech-Risiko de-riskt** (Treuhand E2E, RLS, sauberes Schema) — starker Pluspunkt, selten so früh.
- ✅ **Klare, große Nische** + Synergie (ConnectCore/LEX/IT/Freelancer) + self-dokumentierendes Engineering (SKILL/FEATURES/COMPLIANCE).
- 🚩 **Red Flags:** kein Umsatz/keine Live-Deals · Rechtstexte nur Entwurf, keine UG · Kern-USP (Verifizierung/DD) noch nicht gebaut · kaum Tests · i18n=0 trotz Weltmarkt-Anspruch · Liquiditäts-/GTM-Plan unbewiesen.
- **Verdikt:** **Pre-Seed-fähig** auf Basis Tech + Vision + Gründer-Velocity — aber **nicht** Seed/raise-ready, bis erste Deals + Recht + Verifizierung stehen.

### Gate-Check (95 %?)
**Nein — ~62 %.** Blocker bis 95 %: (1) Recht final + Anwalt + UG · (2) Verifizierung + Proof-of-Revenue · (3) Dealroom-Akte · (4) Tests/Monitoring/Backup-Test · (5) i18n-Fundament · (6) erster echter Deal.

### Top-Prioritäten bis 95 % (Reihenfolge)
1. **Recht/Trust live** (Firmendaten + Anwalt + Resend-Confirm) — Launch-Blocker #1.
2. **Verifizierung + Proof-of-Revenue** — der eigentliche USP & Vertrauensanker.
3. **KI-Listings** (schnell, Differenzierung, hebt Inserat-Qualität) → *nächster Bau-Schritt*.
4. **Dealroom-Akte** (Verlauf/Docs/Chat).
5. **Tests + Monitoring + Backup-Restore-Test** (Enterprise-Härte).
6. **i18n-Fundament** (Weltmarkt-Direktive).
7. **UG + Live-Stripe** → erster echter Deal (Provision-Proof).

> **Nächste DD:** ~2026-07-04. **Nächster Bau:** KI-Listings (#3).
