// Stripe webhook — the single source of truth for payment state transitions.
// Signature-verified; state updates are idempotent (safe on event redelivery).
import { stripe } from '../_shared/stripe.ts'
import { admin } from '../_shared/supabase.ts'

const WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''

Deno.serve(async (req) => {
  const sig = req.headers.get('stripe-signature')
  if (!sig) return new Response('missing signature', { status: 400 })

  const body = await req.text()
  let event
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, WEBHOOK_SECRET)
  } catch (e) {
    return new Response(`signature verification failed: ${(e as Error).message}`, { status: 400 })
  }

  const db = admin()
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object as Record<string, any>
        if (s.payment_status === 'paid') {
          const pi = typeof s.payment_intent === 'string' ? s.payment_intent : s.payment_intent?.id
          await db.from('deals').update({
            payment_status: 'held',
            paid_at: new Date().toISOString(),
            stripe_payment_intent_id: pi,
          }).eq('stripe_checkout_session_id', s.id)
        }
        break
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Record<string, any>
        await db.from('deals').update({ payment_status: 'failed' })
          .eq('stripe_payment_intent_id', pi.id)
        break
      }
      case 'charge.refunded': {
        const ch = event.data.object as Record<string, any>
        await db.from('deals').update({ payment_status: 'refunded' })
          .eq('stripe_payment_intent_id', ch.payment_intent)
        break
      }
      case 'account.updated': {
        const acc = event.data.object as Record<string, any>
        await db.from('org_entitlements').update({
          stripe_account_ready: !!(acc.charges_enabled && acc.payouts_enabled),
        }).eq('stripe_account_id', acc.id)
        break
      }
    }
    return new Response('ok', { status: 200 })
  } catch (e) {
    return new Response((e as Error).message, { status: 500 })
  }
})
