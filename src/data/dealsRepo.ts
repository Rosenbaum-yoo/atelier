import { getSupabase } from '../lib/supabase'

export type DealStatus = 'open' | 'accepted' | 'declined' | 'withdrawn'

export type Deal = {
  id: string
  listing_id: string
  buyer_id: string
  seller_org_id: string
  status: DealStatus
  offer_amount: number | null
  message: string | null
  created_at: string
  updated_at: string
  listing?: { title: string; slug: string } | null
}

const SELECT = '*, listing:listings(title, slug)'

export async function fetchListingIdBySlug(slug: string): Promise<string | null> {
  const { data } = await getSupabase()
    .from('listings')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()
  return (data as { id: string } | null)?.id ?? null
}

export async function createDeal(input: {
  listingId: string
  buyerId: string
  offerAmount: number | null
  message: string | null
}): Promise<void> {
  const { error } = await getSupabase().from('deals').insert({
    listing_id: input.listingId,
    buyer_id: input.buyerId,
    offer_amount: input.offerAmount,
    message: input.message,
  })
  if (error) throw error
}

export async function fetchBuyerDeals(buyerId: string): Promise<Deal[]> {
  const { data, error } = await getSupabase()
    .from('deals')
    .select(SELECT)
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as Deal[]) ?? []
}

export async function fetchOrgDeals(orgId: string): Promise<Deal[]> {
  const { data, error } = await getSupabase()
    .from('deals')
    .select(SELECT)
    .eq('seller_org_id', orgId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as Deal[]) ?? []
}

export async function updateDealStatus(id: string, status: DealStatus): Promise<void> {
  const { error } = await getSupabase().from('deals').update({ status }).eq('id', id)
  if (error) throw error
}
