// generate-listing — KI-gestützte Premium-Listing-Texte aus den Verkäufer-Feldern.
// Claude (Anthropic Messages API via rohem fetch, kein SDK-Versions-Risiko) erzeugt
// Untertitel/Beschreibungen/Highlights. WICHTIG: erfindet KEINE Kennzahlen — nutzt nur
// die übergebenen Fakten. Ton: premium, vertrauensbildend, ehrlich (Käufer prüfen den Kauf).
import { corsHeaders, json } from '../_shared/http.ts'
import { getUser } from '../_shared/supabase.ts'

const MODEL = 'claude-sonnet-4-6'
const KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? ''

const SYSTEM = [
  'Du bist Senior-Marktplatz-Texter für „Atelier", eine kuratierte Premium-Börse für SaaS, Apps und kleine Firmen.',
  'Schreibe auf Deutsch: premium, prägnant, konkret, vertrauensbildend — niemals marktschreierisch.',
  'HARTE REGEL: Erfinde KEINE Fakten, Kennzahlen, Nutzerzahlen oder Eigenschaften. Nutze ausschließlich die gegebenen Angaben; ist etwas unbekannt, lass es weg statt zu raten.',
  'Nutze subtile, ehrliche Vertrauensanker (Struktur, Klarheit, prüfbare Fakten) statt Übertreibung.',
  'Antworte mit GENAU EINEM JSON-Objekt, ohne Markdown/Codeblock, ohne Text drumherum, Schlüssel:',
  '{"subtitle": string (max ~90 Zeichen), "description": string (2-4 Sätze Kurzbeschreibung), "about": string (3-6 Sätze, übergabe-tauglich), "highlights": string[] (3-5 Stichpunkte, je max ~60 Zeichen)}',
].join('\n')

function extractJson(s: string): Record<string, unknown> | null {
  try { return JSON.parse(s) } catch { /* try slice */ }
  const a = s.indexOf('{'), b = s.lastIndexOf('}')
  if (a >= 0 && b > a) { try { return JSON.parse(s.slice(a, b + 1)) } catch { /* noop */ } }
  return null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const user = await getUser(req)
    if (!user) return json({ error: 'Nicht angemeldet.' }, 401)
    if (!KEY) return json({ error: 'KI-Dienst ist nicht konfiguriert.' }, 503)

    const input = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const title = typeof input.title === 'string' ? input.title.trim() : ''
    if (!title) return json({ error: 'Titel fehlt.' }, 400)

    const num = (v: unknown) => (Number(v) > 0 ? Math.round(Number(v)) : 0)
    const facts = [
      `Titel: ${title}`,
      input.category ? `Kategorie: ${input.category}` : '',
      input.kind ? `Typ: ${input.kind}` : '',
      input.saleType ? `Verkaufsoption: ${input.saleType}` : '',
      input.revenueModel ? `Erlösmodell: ${input.revenueModel}` : '',
      num(input.monthlyRevenue) ? `Monatlicher Umsatz (MRR): ${num(input.monthlyRevenue)} EUR` : '',
      num(input.priceValue) ? `Preisvorstellung: ${num(input.priceValue)} EUR` : '',
      input.tech ? `Tech-Stack: ${input.tech}` : '',
      input.notes ? `Notizen des Verkäufers: ${input.notes}` : '',
    ].filter(Boolean).join('\n')

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM,
        messages: [{ role: 'user', content: `Erzeuge die Listing-Texte aus diesen Angaben:\n\n${facts}` }],
      }),
    })
    if (!res.ok) {
      await res.text().catch(() => '')
      return json({ error: `KI-Dienst nicht erreichbar (${res.status}).` }, 502)
    }
    const body = (await res.json()) as { content?: Array<{ type: string; text?: string }> }
    const raw = body.content?.find((b) => b.type === 'text')?.text ?? ''
    const parsed = extractJson(raw)
    if (!parsed) return json({ error: 'KI-Antwort konnte nicht gelesen werden.' }, 502)

    return json({
      subtitle: String(parsed.subtitle ?? '').slice(0, 140),
      description: String(parsed.description ?? ''),
      about: String(parsed.about ?? ''),
      highlights: Array.isArray(parsed.highlights)
        ? parsed.highlights.map((h) => String(h)).filter(Boolean).slice(0, 6)
        : [],
    })
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }
})
