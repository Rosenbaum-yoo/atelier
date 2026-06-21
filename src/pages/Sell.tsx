import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useAuth } from '../state/AuthContext'
import { getSupabase } from '../lib/supabase'
import {
  kindLabels,
  saleTypeLabels,
  type ListingKind,
  type RevenueModel,
  type SaleType,
} from '../data/listings'
import { generateListing } from '../data/aiRepo'

const kinds: ListingKind[] = ['saas', 'ios', 'android', 'web', 'devtool', 'game', 'ai']
const models: RevenueModel[] = ['mrr', 'onetime', 'iap', 'ads']
const sales: SaleType[] = ['full', 'shares', 'license']

const eur = (n: number) => '€' + n.toLocaleString('de-DE')

function slugify(s: string) {
  const base = s
    .toLowerCase()
    .normalize('NFKD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base || 'projekt'}-${suffix}`
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'A'
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
}

export default function Sell() {
  const navigate = useNavigate()
  const { profile, refreshProfile } = useAuth()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [kind, setKind] = useState<ListingKind>('saas')
  const [revenueModel, setRevenueModel] = useState<RevenueModel>('mrr')
  const [saleType, setSaleType] = useState<SaleType>('full')
  const [priceValue, setPriceValue] = useState('')
  const [monthlyRevenue, setMonthlyRevenue] = useState('')
  const [tech, setTech] = useState('')
  const [description, setDescription] = useState('')
  const [about, setAbout] = useState('')
  const [highlights, setHighlights] = useState<string[]>([])

  const [busy, setBusy] = useState(false)
  const [aiBusy, setAiBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    setError(null)
    if (!title.trim()) {
      setError('Bitte gib zuerst einen Titel an, dann legt die KI los.')
      return
    }
    setAiBusy(true)
    try {
      const g = await generateListing({
        title: title.trim(),
        category: category.trim() || undefined,
        kind,
        saleType,
        revenueModel,
        monthlyRevenue: Math.max(0, Math.round(Number(monthlyRevenue) || 0)),
        priceValue: Math.max(0, Math.round(Number(priceValue) || 0)),
        tech: tech.trim() || undefined,
      })
      if (g.subtitle) setSubtitle(g.subtitle)
      if (g.description) setDescription(g.description)
      if (g.about) setAbout(g.about)
      if (g.highlights?.length) setHighlights(g.highlights)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'KI-Generierung fehlgeschlagen.')
    } finally {
      setAiBusy(false)
    }
  }

  async function save(status: 'draft' | 'published') {
    setError(null)

    if (!profile?.org_id) {
      await refreshProfile()
      if (!profile?.org_id) {
        setError('Dein Konto wird noch eingerichtet. Bitte lade die Seite in einem Moment neu.')
        return
      }
    }
    const price = Math.max(0, Math.round(Number(priceValue) || 0))
    const mrr = Math.max(0, Math.round(Number(monthlyRevenue) || 0))
    if (!title.trim()) {
      setError('Bitte gib einen Titel an.')
      return
    }
    if (price <= 0) {
      setError('Bitte gib einen Preis größer als 0 an.')
      return
    }

    const techList = tech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const metrics = [
      ...(mrr > 0 ? [{ label: 'MRR', val: eur(mrr) }] : []),
      { label: 'Preis', val: eur(price) },
    ]

    const sellerName = profile?.display_name || 'Verkäufer'
    const data = {
      tech: techList,
      metrics,
      highlights,
      financials: [] as { label: string; val: string }[],
      seller: { name: sellerName, avatar: initials(sellerName), rating: 'Neu bei Atelier' },
      badges: [{ kind: 'plain', label: kindLabels[kind] }],
    }

    setBusy(true)
    try {
      const { error } = await getSupabase()
        .from('listings')
        .insert({
          org_id: profile!.org_id,
          slug: slugify(title),
          status,
          title: title.trim(),
          category: category.trim() || kindLabels[kind],
          subtitle: subtitle.trim(),
          description: description.trim(),
          about: about.trim(),
          model: saleTypeLabels[saleType],
          icon: title.trim().charAt(0).toUpperCase() || 'A',
          icon_class: '',
          price_num: eur(price),
          price_type: saleTypeLabels[saleType],
          price_multiple: '',
          kind,
          revenue_model: revenueModel,
          sale_type: saleType,
          monthly_revenue: mrr,
          price_value: price,
          data,
        })
      if (error) throw error
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Speichern fehlgeschlagen.')
    } finally {
      setBusy(false)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    save('published')
  }

  return (
    <>
      <Nav />
      <main className="app-main">
        <div className="container">
          <div className="page-narrow">
            <div className="page-head">
              <div className="eyebrow">PROJEKT EINSTELLEN</div>
              <h1>
                Dein Werk, <em>marktreif gemacht.</em>
              </h1>
              <p>
                Beschreibe dein Projekt. Du kannst es als Entwurf speichern und später veröffentlichen —
                erst veröffentlichte Projekte erscheinen im Marktplatz.
              </p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={onSubmit} noValidate>
              <div className="field">
                <label htmlFor="title">Titel</label>
                <input
                  id="title"
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="z. B. TaskFlow Pro"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="category">Kategorie-Label</label>
                <input
                  id="category"
                  className="input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="z. B. SaaS · B2B"
                />
              </div>

              <div className="field">
                <label htmlFor="subtitle">Untertitel</label>
                <input
                  id="subtitle"
                  className="input"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Ein Satz, der das Produkt beschreibt"
                />
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="kind">Typ</label>
                  <select
                    id="kind"
                    className="select"
                    value={kind}
                    onChange={(e) => setKind(e.target.value as ListingKind)}
                  >
                    {kinds.map((k) => (
                      <option key={k} value={k}>
                        {kindLabels[k]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="saleType">Verkaufsoption</label>
                  <select
                    id="saleType"
                    className="select"
                    value={saleType}
                    onChange={(e) => setSaleType(e.target.value as SaleType)}
                  >
                    {sales.map((s) => (
                      <option key={s} value={s}>
                        {saleTypeLabels[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="revenueModel">Erlösmodell</label>
                  <select
                    id="revenueModel"
                    className="select"
                    value={revenueModel}
                    onChange={(e) => setRevenueModel(e.target.value as RevenueModel)}
                  >
                    {models.map((m) => (
                      <option key={m} value={m}>
                        {m.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="mrr">Monatl. Umsatz (€)</label>
                  <input
                    id="mrr"
                    className="input"
                    type="number"
                    min="0"
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="price">Preis (€)</label>
                <input
                  id="price"
                  className="input"
                  type="number"
                  min="0"
                  value={priceValue}
                  onChange={(e) => setPriceValue(e.target.value)}
                  placeholder="z. B. 48500"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="tech">Tech-Stack</label>
                <input
                  id="tech"
                  className="input"
                  value={tech}
                  onChange={(e) => setTech(e.target.value)}
                  placeholder="React, Next.js, Postgres (Komma-getrennt)"
                />
                <span className="field-hint">Mit Komma trennen.</span>
              </div>

              <div className="field">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={aiBusy}
                  onClick={generate}
                >
                  {aiBusy ? <span className="spinner" /> : <>✨ Beschreibung mit KI generieren</>}
                </button>
                <span className="field-hint">
                  Erzeugt Untertitel, Kurz- und Langbeschreibung aus deinen Angaben (Titel, Typ, Tech …). Alles bleibt editierbar.
                </span>
              </div>

              {highlights.length > 0 && (
                <div className="field">
                  <label>Highlights</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {highlights.map((h, i) => (
                      <span key={i} className="pill pill-draft">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="field">
                <label htmlFor="description">Kurzbeschreibung</label>
                <textarea
                  id="description"
                  className="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Worum geht es? Was macht das Projekt besonders?"
                />
              </div>

              <div className="field">
                <label htmlFor="about">Ausführliche Beschreibung</label>
                <textarea
                  id="about"
                  className="textarea"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Optional: Hintergrund, Historie, Übergabe-Details …"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  {busy ? <span className="spinner" /> : <>Veröffentlichen <span>→</span></>}
                </button>
                <button
                  type="button"
                  className="btn"
                  disabled={busy}
                  onClick={() => save('draft')}
                >
                  Als Entwurf speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
