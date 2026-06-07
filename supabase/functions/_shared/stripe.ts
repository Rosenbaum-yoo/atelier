import Stripe from 'npm:stripe@^17'

// Deno runtime → use the fetch-based HTTP client + SubtleCrypto provider
// (needed for async webhook signature verification).
export const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  httpClient: Stripe.createFetchHttpClient(),
})
