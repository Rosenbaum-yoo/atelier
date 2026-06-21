# Atelier — ISO/IEC 27001 Readiness (Controls-Map)

> **Lebendes Dokument**, automatisch gepflegt. Ziel: Atelier **von Anfang an ISO/IEC 27001-konform** bauen (Security- & Compliance-by-Design), damit eine Zertifizierung jederzeit **audit-ready** ist.
>
> **Ehrlich & wichtig:** Ein ISO-27001-**Zertifikat** wird **nur von einer akkreditierten Zertifizierungsstelle** nach einem externen Audit ausgestellt — es lässt sich nicht „generieren". Automatisch passiert hier: die **technischen + dokumentierten Kontrollen** (Annex A) werden umgesetzt und nachgewiesen, sodass der Audit-Pfad offensteht. Das **ISMS** (Managementsystem, Richtlinien, Risikomanagement, internes Audit) ist ein **Unternehmens-/Owner-Schritt** (braucht UG/GmbH + Prozesse + Menschen).
>
> **Status:** ✅ umgesetzt · 🟡 teilweise · 📋 offen (Unternehmens-/Prozess-Schritt)
> Ergänzt `docs/SECURITY.md`. Norm: **ISO/IEC 27001:2022** (93 Controls, 4 Themen A.5–A.8). Control-Nummern illustrativ; finale Zuordnung mit dem Auditor.

## Kurzfazit
- **Technologische Controls (A.8):** starkes Fundament (RLS, TLS, Secrets-Hygiene, sichere Entwicklung) — größtenteils ✅/🟡.
- **Organisatorische / People / Physical Controls (A.5/A.6/A.7):** überwiegend 📋 — erfordern das gegründete Unternehmen (ISMS, Richtlinien, Rollen, Lieferantenverträge/DPAs). Kein Code.
- **Weg zum Zertifikat:** ISMS aufsetzen → internes Audit → externe Zertifizierungsstelle (Stage 1/2). Sinnvoll **parallel zur UG-Gründung**.

## A.8 — Technologische Controls (Kern unseres Codes)
| Control-Bereich | Atelier-Umsetzung | Status |
|---|---|---|
| Zugriffskontrolle | Supabase Auth + **RLS deny-by-default**, `org_id`-Mandantentrennung, `current_org_id()` | ✅ |
| Privilegierte Zugriffe | `service_role`-Key nur server-seitig (Edge Functions), nie im Client | ✅ |
| Kryptographie / Transport | TLS durchgehend (Cloudflare/Supabase/Stripe); Daten verschlüsselt at-rest (Supabase) | ✅ |
| Secrets-Management | `.env` gitignored, nur `.env.example` getrackt; Stripe/Webhook-Keys nur in Function-Env; PAT in Home-Datei | ✅ |
| Sichere Entwicklung | TypeScript strict, Code-Review-Standard, keine Secrets in Git, server-seitige Beträge in Cent, idempotente Geld-Operationen | 🟡 |
| Logging & Monitoring | Supabase/Cloudflare-Logs vorhanden; **zentrales Audit-Log + Alerting** offen | 🟡 |
| Schwachstellen-Management | CI (typecheck+build); **Dependabot/`npm audit`-Prozess** offen | 🟡 |
| Backup & Wiederherstellung | Supabase Managed Backups (PITR je Plan); **Restore-Test dokumentieren** | 🟡 |
| Netzwerk-/Web-Sicherheit | Cloudflare-Edge/WAF; **Security-Header/CSP härten** | 🟡 |
| Löschung / Maskierung | DSGVO-Löschpfade + Test-Daten-Maskierung | 📋 |

## A.5 — Organisatorische Controls (Unternehmens-ISMS)
| Bereich | Status | Hinweis |
|---|---|---|
| Informationssicherheits-Richtlinien | 📋 | Policy-Set (ich liefere Vorlagen) |
| Rollen & Verantwortlichkeiten | 📋 | mit UG + Team |
| Lieferanten-/Cloud-Sicherheit | 🟡 | **DPAs** mit Supabase/Stripe/Cloudflare/Resend abschließen + auflisten (deren ISO/SOC2-Zertifikate nutzen) |
| Incident-Management | 📋 | Runbook + Meldewege (DSGVO-72h-Frist) |
| Compliance & Recht | 🟡 | Trust Center (Entwürfe) + Anwalt; Datenschutz |
| Risikobewertung (Klausel 6) | 📋 | Risk-Register anlegen (ich liefere Vorlage) |
| Asset-Inventar | 🟡 | `docs/FEATURES.md` + Source-of-Truth als Basis |

## A.6 People · A.7 Physical
| Bereich | Status | Hinweis |
|---|---|---|
| Screening / Onboarding / Awareness (A.6) | 📋 | mit Team/HR |
| Physische Sicherheit (A.7) | 🟡 | an Cloud delegiert — Supabase/Cloudflare-Rechenzentren sind selbst ISO 27001/SOC 2-zertifiziert; deren Nachweise als Beleg führen |

## Was ich automatisch tue
- Jede neue Funktion **ISO-konform** bauen (Zugriff/RLS, Secrets, Logging, Validierung) und hier mit Status/Evidenz eintragen.
- Diese Map bei **jeder** sicherheitsrelevanten Änderung aktualisieren (Dauerauftrag).
- Auf Zuruf **Vorlagen** liefern: Sicherheitsrichtlinien, Risk-Register, DPA-Liste, Incident-Runbook, SoA (Statement of Applicability).

## Was nur das Unternehmen kann (Owner-Schritte)
- ISMS formal aufsetzen, Management-Commitment, internes Audit, SoA finalisieren.
- Akkreditierte **Zertifizierungsstelle** beauftragen (Stage-1/Stage-2-Audit) → Zertifikat.
- Verträge/DPAs unterschreiben, HR-/physische Controls organisieren.
- **Empfehlung:** parallel zur UG-Gründung starten — Atelier ist technisch dann bereits weit audit-ready.
