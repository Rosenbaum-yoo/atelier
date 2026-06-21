import { getSupabase } from '../lib/supabase'

export type GeneratedListing = {
  subtitle: string
  description: string
  about: string
  highlights: string[]
}

export type GenerateInput = {
  title: string
  category?: string
  kind?: string
  saleType?: string
  revenueModel?: string
  monthlyRevenue?: number
  priceValue?: number
  tech?: string
  notes?: string
}

// Client→Edge-Function-Brücke für KI-Listing-Texte. JWT hängt supabase-js automatisch an
// (erfüllt verify_jwt=true). Fehler-Body wird wie in paymentsRepo aus error.context gelesen.
export async function generateListing(input: GenerateInput): Promise<GeneratedListing> {
  const { data, error } = await getSupabase().functions.invoke('generate-listing', { body: input })
  if (error) {
    let msg = error.message
    const ctx = (error as { context?: Response }).context
    if (ctx && typeof ctx.json === 'function') {
      const parsed = await ctx.json().catch(() => null)
      if (parsed && typeof parsed === 'object' && 'error' in parsed && parsed.error)
        msg = String((parsed as { error: unknown }).error)
    }
    throw new Error(msg)
  }
  return data as GeneratedListing
}
