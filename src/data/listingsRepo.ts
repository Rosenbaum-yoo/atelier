import { getSupabase, isSupabaseConfigured } from '../lib/supabase'
import { listings as staticListings, type Listing } from './listings'

const COLUMNS =
  'slug,icon,icon_class,title,category,subtitle,description,model,about,' +
  'price_num,price_type,price_multiple,kind,revenue_model,sale_type,' +
  'monthly_revenue,price_value,listed_at,data'

function rowToListing(r: Record<string, any>): Listing {
  const d = r.data ?? {}
  return {
    id: r.slug,
    icon: r.icon ?? '',
    iconClass: r.icon_class ?? '',
    title: r.title,
    category: r.category,
    subtitle: r.subtitle ?? '',
    desc: r.description ?? '',
    model: r.model ?? '',
    about: r.about ?? '',
    price: { num: r.price_num ?? '', type: r.price_type ?? '', multiple: r.price_multiple ?? '' },
    kind: r.kind,
    revenueModel: r.revenue_model,
    saleType: r.sale_type,
    monthlyRevenue: r.monthly_revenue ?? 0,
    priceValue: r.price_value ?? 0,
    listedAt: r.listed_at ?? '',
    tech: d.tech ?? [],
    metrics: d.metrics ?? [],
    highlights: d.highlights ?? [],
    financials: d.financials ?? [],
    seller: d.seller ?? { name: '', avatar: '', rating: '' },
    badges: d.badges ?? [],
    equity: d.equity,
  }
}

// Loads published listings from Supabase. Falls back to the curated static
// list whenever Supabase is unconfigured, errors, or returns nothing — so the
// marketplace is never empty regardless of backend state.
export async function fetchListings(): Promise<Listing[]> {
  if (!isSupabaseConfigured) return staticListings
  try {
    const { data, error } = await getSupabase()
      .from('listings')
      .select(COLUMNS)
      .eq('status', 'published')
    if (error || !data || data.length === 0) return staticListings
    return data.map(rowToListing)
  } catch {
    return staticListings
  }
}

// Single listing for the detail page. Tries Supabase by slug, falls back to the
// static entry so deep-links keep working offline / pre-seed. Returns null only
// when the slug exists in neither (genuine 404).
export async function fetchListingBySlug(slug: string): Promise<Listing | null> {
  const fallback = () => staticListings.find((l) => l.id === slug) ?? null
  if (!isSupabaseConfigured) return fallback()
  try {
    const { data, error } = await getSupabase()
      .from('listings')
      .select(COLUMNS)
      .eq('slug', slug)
      .maybeSingle()
    if (error || !data) return fallback()
    return rowToListing(data)
  } catch {
    return fallback()
  }
}

export type OwnerListing = {
  slug: string
  title: string
  status: 'draft' | 'published'
  price_num: string
  kind: string
  listed_at: string
}

// Owner view: every listing of one org, any status (RLS lets an org read its own
// unpublished rows). Used by the dashboard, never falls back to static data.
export async function fetchOrgListings(orgId: string): Promise<OwnerListing[]> {
  const { data, error } = await getSupabase()
    .from('listings')
    .select('slug, title, status, price_num, kind, listed_at')
    .eq('org_id', orgId)
    .order('listed_at', { ascending: false })
  if (error) throw error
  return (data as OwnerListing[]) ?? []
}

export async function setListingStatus(
  slug: string,
  status: 'draft' | 'published',
): Promise<void> {
  const { error } = await getSupabase().from('listings').update({ status }).eq('slug', slug)
  if (error) throw error
}

export async function deleteListing(slug: string): Promise<void> {
  const { error } = await getSupabase().from('listings').delete().eq('slug', slug)
  if (error) throw error
}
