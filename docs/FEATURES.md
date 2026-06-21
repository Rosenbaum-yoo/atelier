# Atelier — Feature-Katalog

> **Lebendes Dokument** · fester Bestandteil von `docs/`. Wird bei **jeder** Feature-Änderung automatisch aktualisiert. Beschreibt pro Feature: **was** es ist, **wie es umgesetzt ist** und **wie es weiter umgesetzt wird**. Dient zugleich als Reifegrad-/Due-Diligence-Grundlage (siehe 30-Tage-DD).
>
> **Status-Legende:** ✅ live · 🟡 in Arbeit / Teilumsetzung · 📋 geplant
> **Zahlungsmodus:** Stripe **Test-Modus** (echte Integration, kein Mock). Live = Key-Tausch `sk_test_`→`sk_live_` + UG + Anwaltsfreigabe.

## Überblick (Reifegrad)
| # | Feature | Status | Reife |
|---|---|---|---|
| 1 | Auth & Org-Onboarding | ✅ | ~90 % |
| 2 | Marktplatz (Filter/Sort) | ✅ | ~85 % |
| 3 | Listing-Detail | ✅ | ~85 % |
| 4 | Verkäufer-Flow (Inserieren) | ✅ | ~80 % |
| 5 | Dashboard | ✅ | ~80 % |
| 6 | Dealroom (Angebote) | ✅ | ~75 % |
| 7 | Zahlungen + Treuhand (Escrow) | ✅ Test | ~85 % |
| 8 | „Verkauft sich nur einmal" | ✅ | ~90 % |
| 9 | Mehrmandanten + RLS | ✅ | ~90 % |
| 10 | Trust Center / Recht | 🟡 | ~50 % (Entwürfe) |
| 11 | Demo-Walkthrough | ✅ | 100 % |
| 12 | Mobile-Responsive | ✅ | ~85 % |
| 13 | PWA (installierbar) | ✅ | ~80 % |
| 14 | KI-Listing-Beschreibungen | 🟡 | ~70 % (Deploy+Key offen) |
| 15 | RBAC (Experte/Admin-Rollen) | 📋 | ~20 % |
| 16 | Spezialmodule (NDA, DD, Übergabe …) | 📋 | 0 % |
| 17 | i18n + Mehrwährung | 📋 | 0 % |
| 18 | Staff Center (Prio 1) | 📋 | 0 % |
| 19 | Equity-/Firmen-Deal-Pfad (Notar) | 📋 | 0 % |

---

## 1. Auth & Org-Onboarding ✅
**Was:** Registrierung/Login; jeder Nutzer erhält automatisch eine persönliche Organisation (Mandant).
**Wie umgesetzt:** Supabase Auth · `src/state/AuthContext.tsx` (session/user/profile/signOut) · `ProtectedRoute` → `/login` · `src/pages/Login.tsx` (Sign-in + Sign-up kombiniert, dt. Fehlertexte, `emailRedirectTo`). Migration `0002`: Trigger `handle_new_user()` legt Org + Profil bei Signup an.
**Wie weiter:** E-Mail-Bestätigung produktiv (Resend SMTP, Phase B) · Passwort-Reset · Profil-/Verifizierungs-Status · SSO nur falls je nötig.

## 2. Marktplatz (Filter & Sortierung) ✅
**Was:** Kuratierte Listing-Übersicht mit Filtern (Kategorie/Geschäftsmodell/Verkaufsoption/Tech) + Sortierung, Counts aus echten Daten, Empty-State.
**Wie umgesetzt:** `src/components/Marketplace.tsx` + `src/data/listingsRepo.ts` (`fetchListings` aus Supabase, **Fallback** auf statische `listings.ts`). Strukturierte Felder (kind/revenue_model/sale_type/monthly_revenue/price_value). „Anteile/Invest" first-class.
**Wie weiter:** Preis-Range-Slider funktional · Voll­textsuche · Server-seitige Filter/Pagination ab Volumen · gespeicherte Suchen/Alerts.

## 3. Listing-Detail ✅
**Was:** Detailseite je Projekt mit verwandten Listings, Lade-/404-States.
**Wie umgesetzt:** `src/pages/ListingDetail.tsx` lädt async via `fetchListingBySlug` (Supabase by slug, Fallback), `fetchListings` für „verwandt". Angebot-Aktion löst Listing-UUID per Slug auf → `deals`-Insert. „● Verkauft"-Zustand.
**Wie weiter:** Bildergalerie/echte Medien (statt Icon-Glyph) · Proof-of-Revenue-Anzeige · Verifizierungs-Badges · mobile Galerie-Höhe (Inline-Style → Klasse).

## 4. Verkäufer-Flow / Inserieren ✅
**Was:** Projekt anlegen → Entwurf/Veröffentlicht.
**Wie umgesetzt:** `src/pages/Sell.tsx` (Formular → `listings`-Insert, slugify, Status draft/published). RLS: `org_id = current_org_id()`.
**Wie weiter:** **KI-Beschreibungsgenerator** (#14) · Pflichtfeld-Validierung (Zod) · Bild-/Doku-Upload (Supabase Storage) · MRR/Tech-Stack-Felder strukturiert · Listing-Verifizierung.

## 5. Dashboard ✅
**Was:** Eigene Projekte verwalten (veröffentlichen/zurückziehen/löschen), eingehende Angebote, Auszahlungs-Status.
**Wie umgesetzt:** `src/pages/Dashboard.tsx` · `fetchOrgListings`/`setListingStatus`/`deleteListing` · Sektion „Auszahlungen" (Stripe-Connect-Onboarding-Status via `fetchEntitlement`). „Verkauft"-Pille.
**Wie weiter:** Kennzahlen/KPIs · Benachrichtigungen · Aktivitäts-Timeline.

## 6. Dealroom ✅
**Was:** Käufer- und Verkäufer-Sicht auf Angebote an einem Ort; annehmen/ablehnen/zurückziehen, bezahlen, freigeben.
**Wie umgesetzt:** `src/pages/Dealroom.tsx` · `dealsRepo.ts` (`fetchBuyerDeals`/`fetchOrgDeals`/`updateDealStatus`) · Zahlungs-Pills je `payment_status`. Trigger `set_deal_seller_org()` leitet `seller_org_id` server-seitig aus dem Listing ab (nie Client-vertraut).
**Wie weiter:** **Detail-/Akten-Ansicht je Deal** (Verlauf, Nachrichten, Dokumente, Fortschritt) · Chat/Verhandlung · NDA-Gate · Übergabeplan.

## 7. Zahlungen + Treuhand (Stripe Connect Escrow) ✅ (Test)
**Was:** Käufer zahlt in Treuhand → Verkäufer wird nach Käufer-Freigabe ausgezahlt; Plattform behält Provision (6 %).
**Wie umgesetzt:** 4 Edge Functions (`supabase/functions/`, Deno + `npm:stripe@17`): `connect-onboarding` (Express-Account, capabilities transfers+card_payments) · `checkout` (Session, Gebühr server-seitig `override ?? plan ?? 600`, Capture = Treuhand-Hold, `transfer_group`) · `stripe-webhook` (signatur-verifiziert, idempotent: held/paid/failed/refunded) · `confirm-release` (Transfer `amount_net` mit **`source_transaction=latest_charge`**, idempotency-key). Geld **in Cent**, nur server-seitig. Migration `0003`. **End-to-End im Test bestanden** (Onboarding→Zahlung→Treuhand→Auszahlung).
**Wie weiter:** Live mit UG + neuem Business-Konto · Stripe Tax · Mehrwährung · Auto-Refund bei Gleichzeitig-Doppelkauf · Equity-Pfad (#19).

## 8. „Ein Listing verkauft sich nur einmal" (Idempotenz) ✅
**Was:** Verkauftes Listing fällt aus dem Markt und ist nicht erneut verkaufbar.
**Wie umgesetzt:** Migration `0004` (`sold`-Status, Trigger `block_offer_on_sold` + `block_delete_paid_listing`, Backfill) · `stripe-webhook` setzt bei `held` → `sold`, bei Erstattung → `published` · `checkout`-Guard gegen Zweitverkauf · UI „Verkauft" in Detail/Dashboard.
**Wie weiter:** Webhook-seitiger **Auto-Refund** des Verlierers bei seltenem Gleichzeitig-Doppelkauf.

## 9. Mehrmandanten + RLS ✅
**Was:** Jede Geschäftszeile gehört zu einer Org; harte Datenisolation in der DB.
**Wie umgesetzt:** `org_id` auf jeder Business-Tabelle · **RLS deny-by-default** · Helper `current_org_id()`. Migrationen 0001-0004 erstellen RLS in derselben Migration.
**Wie weiter:** Isolationstest als CI-Gate · Audit-Log-Namespace.

## 10. Trust Center / Recht 🟡
**Was:** Impressum/AGB/Datenschutz/Widerruf strukturiert.
**Wie umgesetzt:** `src/data/legalDocs.ts` (Drafts, `draft:true`, `[Klammern]`) · Renderer `LegalPage.tsx` · Hub `/recht`. Footer real verlinkt.
**Wie weiter:** **Firmendaten + anwaltliche Freigabe** (blockiert Go-Live) · internationale Rechtstexte (i18n/Mehr-Jurisdiktion) · NDA-Dokumente.

## 11. Demo-Walkthrough ✅
**Was:** Selbstlaufender 6-Schritt-Ablauf (Entwurf→…→Auszahlung) als Plattform-Einleitung.
**Wie umgesetzt:** `src/pages/Demo.tsx`, datengetrieben (`DEMO_STEPS`), Auto-Play/Pause/Prev/Next, klar als „Beispiel" markiert (kein Fake in echten Flows).
**Wie weiter:** optional an echte (anonymisierte) Erfolge koppeln, sobald vorhanden.

## 12. Mobile-Responsive ✅
**Was:** Volle Bedienbarkeit auf dem Handy bei 1:1-Desktop-Design.
**Wie umgesetzt:** `src/styles/responsive.css` (token-only): Nav-Hamburger-Menü (`Nav.tsx`) + 29-Gap-Audit (Container-Polster, Toolbar/Sortierung, row-actions, Section-Köpfe, Demo, Footer, Textumbruch). Live verifiziert.
**Wie weiter:** 2-3 Inline-Style-Feinheiten (Detail-Galerie, Escrow-Karte) · Geräte-QA auf echten Phones.

## 13. PWA (installierbar) ✅
**Was:** Atelier als installierbare App (Home-Screen, Offline-Shell).
**Wie umgesetzt:** `vite-plugin-pwa` (autoUpdate) · Manifest (Brand-Farben, 4 Icons inkl. maskable) · Brand-Icons aus **einer** SVG (`scripts/gen-icons.mjs`, sharp, gesperrte Tokens) · `index.html`-Meta. **Sicherheitskern:** Supabase/Stripe = `NetworkOnly` (Auth/Geld nie gecacht).
**Wie weiter:** echte Install-/Lighthouse-Prüfung auf https/Prod · Offline-Hinweis-UI.

## 14. KI-Listing-Beschreibungen 🟡
**Was:** Verkäufer füllt die Fakten-Felder → KI erzeugt premium Untertitel + Kurz-/Langbeschreibung + Highlights (wie eBay Kleinanzeigen, besser). Alles editierbar.
**Wie umgesetzt:** Edge Function `generate-listing` (Deno, Claude `claude-sonnet-4-6` via **rohem fetch** = kein SDK-Versions-Risiko; System-Prompt erfindet **keine** Kennzahlen — nur übergebene Fakten; striktes JSON + defensives `extractJson`) · `verify_jwt=true` (`config.toml`) · Client-Brücke `src/data/aiRepo.ts` · Button „✨ Beschreibung mit KI generieren" + Highlights-Chips in `Sell.tsx` (→ `data.highlights`). Build grün (100 Module).
**Wie weiter (Owner-Gate):** `ANTHROPIC_API_KEY` als Supabase-Secret + Function deployen → live. Danach: Auto-Bewertung (MRR→Preisspanne), Blind-Listing-Texte, Käufer-Matching.

## 15. RBAC — Rollen Verkäufer/Käufer/Experte/Admin 📋
**Was:** Echte Rollen + Berechtigungen; Experten (Anwalt/Notar/Steuer/IT-Audit/M&A).
**Stand:** `profiles.role` (owner/admin/member) existiert; volle RBAC + Experten-Rolle offen.
**Wie geplant:** Rollen-Tabelle/Permissions, server-seitig erzwungen; kommt sauber mit dem ConnectCore-Kern (aktuell nur Doku, kein importierbarer Code).

## 16. Spezialmodule 📋
**Was:** NDA-Workflow · Proof-of-Revenue · Due-Diligence-Checkliste · Übergabeplan · Käufer-/Verkäufer-Verifizierung · Blind Listings.
**Wie geplant:** additive Migrationen (+RLS) + Komponenten; teils Experten-Andockung (LEXConnect/IT/Freelancer). Priorisierung über 30-Tage-DD.

## 17. i18n + Mehrwährung 📋
**Was:** Mehrsprachigkeit + internationale Zahlung/Steuer (Owner-Direktive „weltweit ab Start").
**Stand (ehrlich):** **noch nicht begonnen** — Frontend deutsch hartkodiert, Edge-Function-Fehlertexte deutsch.
**Wie geplant:** i18n-Framework + Sprachdateien, Stripe Mehrwährung/Tax, internationale Rechtstexte — sauber mit dem Kern, keine Wegwerf-Vorablösung.

## 18. Staff Center (Priorität 1) 📋
**Was:** Isolierte Owner-/Team-Konsole (Muster TempConnect) für Verifizierung/Eskalation/Ops.
**Wie geplant:** eigener Bereich/Subdomain, eigene Session + Audit-Namespace, Allowlist; Andockung an `_STAFF_CENTER` des Imperiums.

## 19. Equity-/Firmen-Deal-Pfad 📋
**Was:** Verkauf von GmbH-Anteilen/Firmen — notarielle Übertragung (§ 15 GmbHG) vor Treuhand-Freigabe.
**Wie geplant:** eigener Abschlusspfad; `confirm-release` (Klick→Transfer) gilt nur für Asset/Software-Deals; Plattform-Equity nur bespoke/„Individuell" mit Anwalt.
