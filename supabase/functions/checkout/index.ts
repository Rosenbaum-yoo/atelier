// Buyer checkout for an accepted deal.
// Captures the full amount to the PLATFORM balance (escrow hold) — the seller
// share is transferred later on buyer confirmation (separate charges & transfers,
// ADR 0002). Fee is computed server-side from the seller's entitlement.
import { corsHeaders, json } from '../_shared/http.ts'
import { stripe } from '../_shared/stripe.ts'
import { admin, getUser } from '../_shared/supabase.ts'

const APP_URL = Deno.env.get('APP_URL') ?? 'https://atelier-a9e.pages.dev'
const TAX_ENABLED = (Deno.env.get('STRIPE_TAX_ENABLED') ?? 'false') === 'true'

function one<T>(v: T | T[] | null | undefined): T | undefined {
  return Array.isArray(v) ? v[0] : (v ?? undefined)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const user = await getUser(req)
    if (!user) return json({ error: 'Nicht angemeldet.' }, 401)

    const { dealId } = await req.json().catch(() => ({}))
    if (!dealId) return json({ error: 'dealId fehlt.' }, 400)

    const db = admin()
    const { data: deal } = await db
      .from('deals')
      .select('id, buyer_id, seller_org_id, status, payment_status, offer_amount, currency, listing_id, listing:listings(title, status)')
      .eq('id', dealId)
      .maybeSingle()

    if (!deal) return json({ error: 'Deal nicht gefunden.' }, 404)
    if (deal.buyer_id !== user.id) return json({ error: 'Kein Zugriff.' }, 403)
    if (deal.status !== 'accepted') return json({ error: 'Deal ist nicht angenommen.' }, 409)
    if (deal.payment_status === 'held' || deal.payment_status === 'released')
      return json({ error: 'Dieser Deal ist bereits bezahlt.' }, 409)
    if (!deal.offer_amount || deal.offer_amount <= 0)
      return json({ error: 'Kein gültiger Betrag am Deal.' }, 409)

    // Idempotency: a listing sells only once. Refuse if it is already sold or
    // another deal on the same listing is paid/escrowed.
    if (one<{ status?: string }>(deal.listing)?.status === 'sold')
      return json({ error: 'Dieses Projekt ist bereits verkauft.' }, 409)
    const { data: rival } = await db
      .from('deals')
      .select('id')
      .eq('listing_id', deal.listing_id)
      .in('payment_status', ['held', 'released'])
      .neq('id', deal.id)
      .limit(1)
      .maybeSingle()
    if (rival) return json({ error: 'Dieses Projekt ist bereits verkauft.' }, 409)

    const { data: ent } = await db
      .from('org_entitlements')
      .select('commission_bps_override, stripe_account_id, stripe_account_ready, plan:plans(commission_bps)')
      .eq('org_id', deal.seller_org_id)
      .maybeSingle()
    if (!ent?.stripe_account_id)
      return json({ error: 'Der Verkäufer ist noch nicht für Auszahlungen freigeschaltet.' }, 409)
    let sellerReady = ent.stripe_account_ready
    if (!sellerReady) {
      const acct = await stripe.accounts.retrieve(ent.stripe_account_id)
      sellerReady = Boolean(acct.charges_enabled && acct.payouts_enabled)
      if (sellerReady)
        await db.from('org_entitlements').update({ stripe_account_ready: true }).eq('org_id', deal.seller_org_id)
    }
    if (!sellerReady)
      return json({ error: 'Der Verkäufer ist noch nicht für Auszahlungen freigeschaltet.' }, 409)

    const planBps = one<{ commission_bps?: number }>(ent.plan)?.commission_bps ?? 600
    const bps = ent.commission_bps_override ?? planBps
    const currency = deal.currency ?? 'eur'
    const amountGross = Math.round(deal.offer_amount * 100) // agreed euros → cents
    const feeAmount = Math.round((amountGross * bps) / 10000)
    const amountNet = amountGross - feeAmount
    const title = one<{ title?: string }>(deal.listing)?.title ?? 'Atelier Deal'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        quantity: 1,
        price_data: { currency, unit_amount: amountGross, product_data: { name: title } },
      }],
      payment_intent_data: {
        transfer_group: deal.id,
        metadata: { deal_id: deal.id },
      },
      automatic_tax: { enabled: TAX_ENABLED },
      billing_address_collection: TAX_ENABLED ? 'required' : 'auto',
      metadata: { deal_id: deal.id },
      success_url: `${APP_URL}/dealroom?paid=1`,
      cancel_url: `${APP_URL}/dealroom?canceled=1`,
    })

    await db.from('deals').update({
      stripe_checkout_session_id: session.id,
      payment_status: 'pending',
      amount_gross: amountGross,
      fee_amount: feeAmount,
      amount_net: amountNet,
      currency,
    }).eq('id', deal.id)

    return json({ url: session.url })
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }
})
