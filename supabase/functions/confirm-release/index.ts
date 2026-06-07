// Milestone release: the buyer confirms the asset was transferred → the platform
// transfers the seller share (amount_net) to the connected account. Idempotency
// key prevents a double payout on retries/double-clicks (ADR 0002 escrow release).
import { corsHeaders, json } from '../_shared/http.ts'
import { stripe } from '../_shared/stripe.ts'
import { admin, getUser } from '../_shared/supabase.ts'

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
      .select('id, buyer_id, seller_org_id, payment_status, amount_net, currency, stripe_payment_intent_id')
      .eq('id', dealId)
      .maybeSingle()

    if (!deal) return json({ error: 'Deal nicht gefunden.' }, 404)
    if (deal.buyer_id !== user.id) return json({ error: 'Kein Zugriff.' }, 403)
    if (deal.payment_status === 'released') return json({ ok: true }) // already done
    if (deal.payment_status !== 'held')
      return json({ error: 'Die Zahlung ist nicht im Treuhand-Status.' }, 409)
    if (!deal.amount_net || deal.amount_net <= 0)
      return json({ error: 'Kein gültiger Auszahlungsbetrag.' }, 409)

    const { data: ent } = await db
      .from('org_entitlements')
      .select('stripe_account_id, stripe_account_ready')
      .eq('org_id', deal.seller_org_id)
      .maybeSingle()
    if (!ent?.stripe_account_id || !ent.stripe_account_ready)
      return json({ error: 'Das Verkäuferkonto ist nicht auszahlungsbereit.' }, 409)

    if (!deal.stripe_payment_intent_id)
      return json({ error: 'Keine Zahlung zu diesem Deal gefunden.' }, 409)

    // Tie the payout to the originating charge so Stripe draws from exactly those
    // funds even while the charge is still settling (pending balance). Without
    // source_transaction the transfer fails "insufficient available funds".
    const pi = await stripe.paymentIntents.retrieve(deal.stripe_payment_intent_id)
    const charge = typeof pi.latest_charge === 'string' ? pi.latest_charge : pi.latest_charge?.id
    if (!charge) return json({ error: 'Zur Zahlung wurde keine Buchung gefunden.' }, 409)

    const transfer = await stripe.transfers.create({
      amount: deal.amount_net,
      currency: deal.currency ?? 'eur',
      destination: ent.stripe_account_id,
      source_transaction: charge,
      transfer_group: deal.id,
      metadata: { deal_id: deal.id },
    }, { idempotencyKey: `release-${deal.id}-${charge}` })

    await db.from('deals').update({
      payment_status: 'released',
      released_at: new Date().toISOString(),
      buyer_confirmed_at: new Date().toISOString(),
      stripe_transfer_id: transfer.id,
    }).eq('id', deal.id)

    return json({ ok: true })
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }
})
