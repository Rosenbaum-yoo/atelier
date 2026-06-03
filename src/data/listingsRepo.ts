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
