// verification-review — Plattform-Staff entscheidet eine Verifizierungs-Anfrage.
// Läuft mit service_role (umgeht RLS) — DESHALB ist der ERSTE Schritt die harte
// Prüfung, dass der CALLER in platform_staff steht; ohne diese Prüfung könnte jeder
// eingeloggte Nutzer ein Verified-Flag setzen. Bei Approve wird das SERVER-OWNED
// Flag auf org_entitlements gesetzt + eine unveränderliche Audit-Zeile geschrieben.
// Identität kommt NUR aus dem verifizierten JWT (getUser), nie aus dem Body.
import { corsHeaders, json } from '../_shared/http.ts'
import { admin, getUser } from '../_shared/supabase.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const user = await getUser(req)
    if (!user) return json({ error: 'Nicht angemeldet.' }, 401)

    const db = admin()

    // ── CRITICAL GATE: caller must be platform staff. Trust derives ONLY from
    // the verified JWT's user id, checked against the server-owned allowlist.
    const { data: staff } = await db
      .from('platform_staff').select('user_id').eq('user_id', user.id).maybeSingle()
    if (!staff) return json({ error: 'Kein Zugriff.' }, 403)

    const { requestId, decision, reviewNote } = await req.json().catch(() => ({}))
    if (!requestId || (decision !== 'approved' && decision !== 'rejected'))
      return json({ error: 'Ungültige Eingabe.' }, 400)

    const { data: vr } = await db
      .from('verification_requests')
      .select('id, org_id, kind, status, listing_id')
      .eq('id', requestId)
      .maybeSingle()
    if (!vr) return json({ error: 'Anfrage nicht gefunden.' }, 404)
    if (vr.status === 'approved' || vr.status === 'rejected')
      return json({ error: 'Diese Anfrage ist bereits entschieden.' }, 409)
    if (vr.kind === 'revenue' && decision === 'approved' && !vr.listing_id)
      return json({ error: 'Umsatz-Verifizierung braucht ein Listing.' }, 409)

    const now = new Date().toISOString()
    // Order: mark the request → set the flag → audit. Each write is checked so a
    // failure surfaces (no silent ok). The guard_verification_request_update
    // trigger only permits service_role to mutate the request; admin() satisfies it.
    const updReq = await db.from('verification_requests').update({
      status: decision,
      reviewed_by: user.id,
      reviewed_at: now,
      review_note: reviewNote ?? null,
    }).eq('id', vr.id)
    if (updReq.error) throw updReq.error

    if (decision === 'approved') {
      if (vr.kind === 'seller') {
        const e = await db.from('org_entitlements').update({
          seller_verified: true, seller_verified_at: now, seller_verified_by: user.id,
        }).eq('org_id', vr.org_id)
        if (e.error) throw e.error
      } else if (vr.kind === 'revenue') {
        // Freeze the checked figure so the flag and the number cannot decouple
        // (a later edit of the listing's revenue auto-revokes the flag, 0005 §6).
        const { data: lst } = await db
          .from('listings').select('monthly_revenue').eq('id', vr.listing_id).maybeSingle()
        const e = await db.from('org_entitlements').update({
          revenue_verified: true, revenue_verified_at: now, revenue_verified_by: user.id,
          revenue_verified_amount: lst?.monthly_revenue ?? null, revenue_verified_listing: vr.listing_id,
        }).eq('org_id', vr.org_id)
        if (e.error) throw e.error
      }
      const aud = await db.from('verification_audit').insert({
        org_id: vr.org_id, kind: vr.kind, action: 'granted',
        actor_id: user.id, request_id: vr.id, reason: reviewNote ?? null,
      })
      if (aud.error) throw aud.error
    }

    return json({ ok: true })
  } catch (e) {
    // Don't leak schema/trigger internals to the client; log server-side.
    console.error('verification-review error:', (e as Error).message)
    return json({ error: 'Verifizierung fehlgeschlagen.' }, 500)
  }
})
