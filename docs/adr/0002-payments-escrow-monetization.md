# ADR 0002 — Payments, escrow & monetization

- **Status:** Accepted
- **Date:** 2026-06-03

## Context
Atelier must take **real money from paying customers** for high-value digital assets
(SaaS, apps, whole companies, equity). Revenue and trust both depend on the money flow:
buyers pay, funds are protected until the asset transfers, sellers get paid out, and the
platform earns a fee. The owner is non-technical; fixed cost must stay near zero until
revenue exists, and the build must avoid licensing/regulatory traps around holding third-
party funds.

## Decision

> **Update 2026-06-03 (Owner):** No subscription/Abo tiers. Revenue is **commission-only**
> (success fee per closed deal) plus the owner-activated **Individuell** rate. The `Pro` tier
> and the subscription fields (`monthly_price`, `stripe_customer_id`) were removed from
> migration `0003` before it was applied. Bullets 1–2 below reflect this.

> **Update 2026-06-03 (Owner) — deal types & equity:** Asset/software sales complete on buyer
> confirmation (current escrow release). **Equity / whole-company sales differ:** assigning
> GmbH shares transfers shareholder rights and requires **notarial deeding** (§ 15 GmbHG), so
> escrow releases only after proof of the notarized transfer — never on a click alone. Atelier
> **holding equity** in sold projects is **bespoke / Individuell-only** (with counsel), never
> the default — this keeps Atelier a neutral intermediary.

1. **Monetization = commission-only.** Listing is free (drives liquidity); Atelier earns a
   **platform fee per closed deal** (the 6% already shown in the UI). No paywall in the way
   of supply. The bespoke **"Individuell"** rate is *additive*, not a subscription.
2. **Tiers:** `Start` (free, public, commission-only) · **`Individuell`** (bespoke, non-public,
   negotiated rate — deliberately NOT called "Enterprise" so no implied SLA guarantee).
   Individuell is a **form → Staff Center → owner activates** manually; never self-serve.
3. **Payment rails = Stripe Connect** with **Express** connected accounts for sellers.
   Stripe is the regulated, PCI-compliant entity — we never touch card data and avoid our
   own payment/e-money licensing.
4. **Charge model = separate charges & transfers.** Platform collects the full amount, then
   **transfers the seller share minus fee** — this gives us the timing control needed for
   escrow.
5. **Escrow / Treuhand = milestone hold-and-release.** Funds stay in the platform balance
   after capture; the transfer to the seller is released only when the **buyer confirms
   asset transfer** (deal milestone). No separate escrow license for normal volumes — Stripe
   carries the regulated role.
6. **High-value cap:** above a configurable threshold, route to a **regulated escrow/Treuhand
   partner** (notary Anderkonto or a marketplace-PSP like Mangopay/Lemonway) instead of the
   Stripe hold — large held balances on a Connect platform are operationally and legally
   riskier. Threshold + partner deferred until such deals actually appear (no idle cost).
7. **Server-side only, never trust the client.** Amounts and fees are computed server-side
   in **Supabase Edge Functions**; Stripe **secret key + webhook signing secret** live in
   function env/Vault, never in the client. Webhook **signature verification** + **idempotency
   keys** mandatory. Payment tables get RLS like every other business table.
8. **Tax:** use **Stripe Tax** for VAT rather than building tax logic — cheaper and correct.

## Cost / economic optimization (startup-grade)
- **Near-zero fixed cost:** Stripe is pay-per-transaction (no monthly fee); Cloudflare Pages,
  Supabase, and Resend stay on **free tiers** until revenue. Edge Functions are pay-per-invoke.
- **No custom payment backend** to build/secure/scale — Stripe Checkout + Connect + webhooks.
- **Revenue from the first deal** (commission), so the platform funds its own scale-up.
- **Defer** Hetzner/self-host and the regulated-escrow partner until unit economics justify them.

## Options considered
- **PayPal / Braintree** — rejected: weaker marketplace/split-payout model, worse economics at scale.
- **Mangopay / Lemonway (regulated marketplace escrow)** — better for *true* escrow of large
  sums, but heavier and costlier to integrate. **Kept as the high-value path (decision 6).**
- **Build our own escrow/holding** — rejected: payment/e-money licensing, PCI scope, bank ops.
- **Subscription-first monetization** — rejected: taxes supply and slows liquidity on a
  marketplace; commission aligns revenue with actual transactions.

## Consequences
- Earns revenue on the first closed deal with almost no fixed cost.
- Requires owner inputs: **Stripe account** (country + legal form + payout bank) and, for the
  Trust Center, **company details** (Impressum). Needed regardless of build order.
- Escrow is Stripe hold-and-release initially; very large deals wait for the partner path.
- Adds an Edge Function + webhook surface — covered by tests on the critical payment path.
- Data layer (next): payment fields on `deals`, `plans` + per-org entitlements,
  `individuell_requests` — implemented in migration `0003` with RLS.
