# ADR 0003 — Lizenz-Durchsetzung & IP-Schutz für den ConnectCore-Kern

Status: Vorgeschlagen (Design; Umsetzung gemeinsam mit dem Kern) · 2026-06-04

## Kontext
ConnectCore UG soll den Kern (Auth, Rollen, Listings, Billing …) an Plattformen wie Atelier **lizenzieren**; der Code bleibt geschützt. Ziel: geklaute / nicht-registrierte Kopien funktionieren nicht; Nutzung nur über eine Lizenz bei ConnectCore.

## Entscheidung
**Lizenz-Durchsetzung server-seitig + rechtlich — KEINE eingebauten Sicherheits-Schwachstellen.**

1. **Hosted-first (stärkster Schutz):** wo möglich, Kern als **Zugang unter Lizenz** (Cloud/managed). Der Code verlässt ConnectCore nie — man kann nicht stehlen, was man nie erhält.
2. **Server-seitiges Lizenz-Gate:** kritische Kern-Operationen laufen über ConnectCore-Backend/Edge Functions. Jede Instanz trägt einen **Lizenzschlüssel** (registriert in ConnectCore). Ein zentraler **`verify-license`**-Endpoint (ConnectCore-kontrolliert) validiert Schlüssel + Instanz-Registrierung; Cache mit kurzer TTL. Ohne gültige Lizenz: Kern verweigert **sauber** den Dienst (klarer „nicht lizenziert"-Zustand).
3. **Recht:** Lizenzvertrag + Copyright; Durchsetzung **offen im Vertrag** geregelt (Software benötigt gültige Lizenz zum Betrieb).
4. **Client-Checks nur als UX/Komfort**, nie als echtes Gate (ausgeliefertes JS ist entfernbar).

## Bewusst NICHT
- **Keine** echten Sicherheits-Schwachstellen/Backdoors — sie gefährden die **eigene** legitime Instanz + zahlende Kunden und brechen ISO 27001.
- **Keine** versteckten Logik-/Zeitbomben — rechtliche Haftung; jede Deaktivierung muss lizenzvertraglich offen geregelt sein.

## Konsequenzen
- Schutz steht und fällt mit dem **server-seitigen** Anteil → den Kern so schneiden, dass das Wertvolle (Geschäftslogik, Lizenzprüfung) server-seitig bleibt; das Frontend ist „dumm".
- Umsetzung gehört in den **ConnectCore-Kern** (existiert noch als Doku, kein importierbarer Code) — hier als Design verankert, gebaut wird es mit dem Kern.
- Verweist auf Produktvision (ConnectCore lizenziert Kern an Atelier) + Memory `feedback-license-protection`.
