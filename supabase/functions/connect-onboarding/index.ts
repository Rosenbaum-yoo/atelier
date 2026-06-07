// Stripe Connect Express onboarding for a seller org.
// Creates (once) a connected account and returns a hosted onboarding link.
// Readiness is refreshed live from Stripe on each call (see below), so the
// platform-scoped webhook does not need connected-account events.
import { corsHeaders, json } from '../_shared/http.ts'
import { stripe } from '../_shared/stripe.ts'
import { admin, getUser } from '../_shared/supabase.ts'

const APP_URL = Deno.env.get('APP_URL') ?? 'https://atelier-a9e.pages.dev'
const COUNTRY = Deno.env.get('STRIPE_CONNECT_COUNTRY') ?? 'DE'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const user = await getUser(req)
    if (!user) return json({ error: 'Nicht angemeldet.' }, 401)

    const db = admin()
    const { data: profile } = await db
      .from('profiles').select('org_id').eq('id', user.id).maybeSingle()
    const orgId = profile?.org_id
    if (!orgId) return json({ error: 'Keine Organisation gefunden.' }, 409)

    const { data: ent } = await db
      .from('org_entitlements').select('stripe_account_id, stripe_account_ready').eq('org_id', orgId).maybeSingle()
    let accountId = ent?.stripe_account_id ?? null

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: COUNTRY,
        email: user.email ?? undefined,
        capabilities: {
          transfers: { requested: true },
          card_payments: { requested: true },
        },
        metadata: { org_id: orgId },
      })
      accountId = account.id
      await db.from('org_entitlements').update({ stripe_account_id: accountId }).eq('org_id', orgId)
    }

    // Readiness is refreshed live from Stripe on every call: this single webhook
    // is platform-scoped and cannot also carry connected-account events, so we do
    // not rely on account.updated. The dashboard re-calls this on onboarding return.
    const acct = await stripe.accounts.retrieve(accountId)
    const ready = Boolean(acct.charges_enabled && acct.payouts_enabled)
    if (ready !== Boolean(ent?.stripe_account_ready))
      await db.from('org_entitlements').update({ stripe_account_ready: ready }).eq('org_id', orgId)

    if (ready) return json({ ready: true })

    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${APP_URL}/dashboard?stripe=refresh`,
      return_url: `${APP_URL}/dashboard?stripe=done`,
      type: 'account_onboarding',
    })
    return json({ ready: false, url: link.url })
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }
})
