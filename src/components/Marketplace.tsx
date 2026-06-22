import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import ListingCard from './ListingCard'
import {
  listings,
  kindLabels,
  revenueModelLabels,
  saleTypeLabels,
  type Listing,
  type ListingKind,
  type RevenueModel,
  type SaleType,
} from '../data/listings'
import { fetchListings } from '../data/listingsRepo'

type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'mrr'

const kindOrder: ListingKind[] = ['saas', 'ios', 'android', 'web', 'devtool', 'game', 'ai']
const modelOrder: RevenueModel[] = ['mrr', 'onetime', 'iap', 'ads']
const saleOrder: SaleType[] = ['full', 'shares', 'license']

const techGroups: { label: string; match: string[] }[] = [
  { label: 'React / Next.js', match: ['React', 'Next.js'] },
  { label: 'Swift / iOS', match: ['Swift'] },
  { label: 'Vue / Nuxt', match: ['Vue', 'Nuxt'] },
  { label: 'Python / Django', match: ['Python', 'Django'] },
  { label: 'Flutter', match: ['Flutter'] },
]

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Empfohlen' },
  { key: 'newest', label: 'Neueste' },
  { key: 'price-asc', label: 'Preis ↑' },
  { key: 'price-desc', label: 'Preis ↓' },
  { key: 'mrr', label: 'MRR' },
]

function techMatch(l: Listing, group: string[]) {
  return l.tech.some((t) => group.some((g) => t.toLowerCase().includes(g.toLowerCase())))
}

function activate(fn: () => void) {
  return {
    role: 'button' as const,
    tabIndex: 0,
    onClick: fn,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        fn()
      }
    },
  }
}

const fmtPrice = (n: number) => '€' + n.toLocaleString('de-DE')

export default function Marketplace() {
  const [data, setData] = useState<Listing[]>(listings)
  const [kind, setKind] = useState<ListingKind | 'all'>('all')
  const [model, setModel] = useState<RevenueModel | null>(null)
  const [sale, setSale] = useState<SaleType | null>(null)
  const [tech, setTech] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('featured')
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null)

  useEffect(() => {
    let alive = true
    fetchListings().then((rows) => {
      if (alive) setData(rows)
    })
    return () => {
      alive = false
    }
  }, [])

  const filtered = useMemo(() => {
    const out = data.filter((l) => {
      if (kind !== 'all' && l.kind !== kind) return false
      if (model && l.revenueModel !== model) return false
      if (sale && l.saleType !== sale) return false
      if (priceRange && (l.priceValue < priceRange[0] || l.priceValue > priceRange[1])) return false
      if (tech) {
        const grp = techGroups.find((g) => g.label === tech)
        if (grp && !techMatch(l, grp.match)) return false
      }
      return true
    })
    return [...out].sort((a, b) => {
      switch (sort) {
        case 'newest':
          return b.listedAt.localeCompare(a.listedAt)
        case 'price-asc':
          return a.priceValue - b.priceValue
        case 'price-desc':
          return b.priceValue - a.priceValue
        case 'mrr':
          return b.monthlyRevenue - a.monthlyRevenue
        default:
          return 0
      }
    })
  }, [data, kind, model, sale, tech, sort, priceRange])

  const kindCount = (k: ListingKind) => data.filter((l) => l.kind === k).length
  const modelCount = (m: RevenueModel) => data.filter((l) => l.revenueModel === m).length
  const saleCount = (s: SaleType) => data.filter((l) => l.saleType === s).length
  const techCount = (g: { match: string[] }) => data.filter((l) => techMatch(l, g.match)).length

  const prices = data.map((l) => l.priceValue)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const lo = priceRange ? priceRange[0] : minPrice
  const hi = priceRange ? priceRange[1] : maxPrice

  const resetFilters = () => {
    setKind('all')
    setModel(null)
    setSale(null)
    setTech(null)
    setPriceRange(null)
  }

  return (
    <section id="marketplace">
      <div className="container">
        <div className="section-head">
          <div className="section-head-left">
            <div className="eyebrow">DER MARKTPLATZ</div>
            <h2>Vollendete Werke, <em>sofort verfügbar.</em></h2>
            <p className="section-sub">
              Jedes Listing wird technisch geprüft. Wir validieren Umsätze, dokumentieren den Tech-Stack und schauen uns den Code an, bevor wir ein Projekt freigeben.
            </p>
          </div>
          <a href="#marketplace" className="btn" {...activate(resetFilters)}>Alle ansehen <span>→</span></a>
        </div>

        <div className="marketplace-grid">
          <aside className="filter-panel">
            <div className="filter-group">
              <div className="filter-title">Kategorie</div>
              <div
                className={`filter-option${kind === 'all' ? ' active' : ''}`}
                {...activate(() => setKind('all'))}
              >
                <span>Alle</span>
                <span className="count">{data.length}</span>
              </div>
              {kindOrder.map((k) => (
                <div
                  key={k}
                  className={`filter-option${kind === k ? ' active' : ''}`}
                  {...activate(() => setKind(k))}
                >
                  <span>{kindLabels[k]}</span>
                  <span className="count">{kindCount(k)}</span>
                </div>
              ))}
            </div>

            <div className="filter-group">
              <div className="filter-title">Preisspanne</div>
              <div className="range-inputs">
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={lo}
                  aria-label="Mindestpreis"
                  onChange={(e) => setPriceRange([Math.min(Number(e.target.value), hi), hi])}
                />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={hi}
                  aria-label="Höchstpreis"
                  onChange={(e) => setPriceRange([lo, Math.max(Number(e.target.value), lo)])}
                />
              </div>
              <div className="range-vals"><span>{fmtPrice(lo)}</span><span>{fmtPrice(hi)}</span></div>
            </div>

            <div className="filter-group">
              <div className="filter-title">Geschäftsmodell</div>
              {modelOrder.map((m) => (
                <div
                  key={m}
                  className={`filter-option${model === m ? ' active' : ''}`}
                  {...activate(() => setModel(model === m ? null : m))}
                >
                  <span>{revenueModelLabels[m]}</span>
                  <span className="count">{modelCount(m)}</span>
                </div>
              ))}
            </div>

            <div className="filter-group">
              <div className="filter-title">Verkaufsoption</div>
              {saleOrder.map((s) => (
                <div
                  key={s}
                  className={`filter-option${sale === s ? ' active' : ''}`}
                  {...activate(() => setSale(sale === s ? null : s))}
                >
                  <span>{saleTypeLabels[s]}</span>
                  <span className="count">{saleCount(s)}</span>
                </div>
              ))}
            </div>

            <div className="filter-group">
              <div className="filter-title">Tech-Stack</div>
              {techGroups.map((g) => (
                <div
                  key={g.label}
                  className={`filter-option${tech === g.label ? ' active' : ''}`}
                  {...activate(() => setTech(tech === g.label ? null : g.label))}
                >
                  <span>{g.label}</span>
                  <span className="count">{techCount(g)}</span>
                </div>
              ))}
            </div>
          </aside>

          <div>
            <div className="listings-toolbar">
              <div className="listings-count">{filtered.length.toLocaleString('de-DE')} PROJEKTE · GEPRÜFT</div>
              <div className="listings-sort">
                {sortOptions.map((o) => (
                  <span
                    key={o.key}
                    className={sort === o.key ? 'active' : undefined}
                    {...activate(() => setSort(o.key))}
                  >
                    {o.label}
                  </span>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div
                style={{
                  padding: '64px 24px',
                  textAlign: 'center',
                  color: 'var(--ink-mute)',
                  border: '1px solid var(--line-soft)',
                  borderRadius: 6,
                  background: 'var(--bg-card)',
                }}
              >
                <p style={{ marginBottom: 16 }}>Keine Projekte für diese Auswahl.</p>
                <button className="btn" {...activate(resetFilters)}>Filter zurücksetzen</button>
              </div>
            ) : (
              <div className="listings">
                {filtered.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
