import { useState, useEffect, type FormEvent } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ListingCard from '../components/ListingCard'
import type { Listing } from '../data/listings'
import { fetchListingBySlug, fetchListings } from '../data/listingsRepo'
import { useAuth } from '../state/AuthContext'
import { createDeal, fetchListingIdBySlug } from '../data/dealsRepo'

const card = {
  background: 'var(--bg-card)',
  border: '1px solid var(--line)',
  borderRadius: 6,
  padding: 24,
} as const

const sideLabel = {
  fontFamily: "'Geist Mono', monospace",
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  color: 'var(--ink-mute)',
  marginBottom: 16,
} as const

const blockLabel = {
  fontFamily: "'Geist Mono', monospace",
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  color: 'var(--ink-mute)',
  marginBottom: 14,
} as const

const blockTitle = {
  fontFamily: "'Fraunces', serif",
  fontWeight: 400,
  fontSize: 26,
  letterSpacing: '-0.02em',
  marginBottom: 16,
} as const

const bars = [40, 44, 42, 50, 54, 58, 55, 64, 70, 76, 84, 100]

const thumbs = ['Dashboard', 'Workflow', 'Mobile']

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { session } = useAuth()

  const [l, setL] = useState<Listing | null>(null)
  const [related, setRelated] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  const [offerOpen, setOfferOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    Promise.all([fetchListingBySlug(id ?? ''), fetchListings()])
      .then(([listing, all]) => {
        if (!alive) return
        setL(listing)
        setRelated(all.filter((x) => x.id !== id).slice(0, 3))
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [id])

  function startOffer() {
    if (!session) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    setError(null)
    setOfferOpen((v) => !v)
  }

  async function submitOffer(e: FormEvent) {
    e.preventDefault()
    if (!session || !l) return
    setError(null)
    setBusy(true)
    try {
      const listingId = await fetchListingIdBySlug(l.id)
      if (!listingId) {
        setError('Angebote sind erst verfügbar, sobald dieses Projekt live in der Datenbank ist.')
        return
      }
      const offerAmount = amount.trim() ? Math.max(0, Math.round(Number(amount))) : null
      await createDeal({
        listingId,
        buyerId: session.user.id,
        offerAmount,
        message: message.trim() || null,
      })
      navigate('/dealroom')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Angebot konnte nicht gesendet werden.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <>
        <Nav />
        <div className="auth-gate">
          <div className="spinner" aria-label="Wird geladen" />
        </div>
        <Footer />
      </>
    )
  }

  if (!l) {
    return (
      <>
        <Nav />
        <section style={{ paddingTop: 80, paddingBottom: 120 }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>404</div>
            <h2>Dieses Projekt <em>existiert nicht</em> (mehr).</h2>
            <p className="section-sub" style={{ margin: '16px auto 32px' }}>
              Vielleicht wurde es bereits verkauft. Schau dir die übrigen kuratierten Projekte an.
            </p>
            <Link to="/" className="btn btn-primary">Zurück zum Marktplatz <span>→</span></Link>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  // Due-Diligence-Status aus ECHTEN Verifizierungs-Flags (kein Fake mehr). Unbelegte
  // Prüfungen erscheinen ehrlich als „auf Anfrage"/„im Dealroom", nie als „bestanden".
  const dueDiligence = [
    l.revenueVerified
      ? { s: 'done', icon: '✓', name: 'Umsatznachweise verifiziert', meta: 'Vom Atelier-Team geprüft' }
      : { s: '', icon: '–', name: 'Umsatznachweise', meta: 'Noch nicht eingereicht' },
    l.sellerVerified
      ? { s: 'done', icon: '✓', name: 'Verkäufer-Identität verifiziert', meta: 'Vom Atelier-Team geprüft' }
      : { s: '', icon: '–', name: 'Verkäufer-Identität', meta: 'Noch nicht verifiziert' },
    { s: 'active', icon: '●', name: 'Code-Audit auf Anfrage', meta: 'Über ITDienstleistungenConnect' },
    { s: 'active', icon: '●', name: 'Verträge & Lizenzen', meta: 'Im Dealroom nach NDA' },
    { s: '', icon: '05', name: 'Kundenliste (vertraulich)', meta: 'Im Dealroom nach Freigabe' },
  ]

  return (
    <>
      <Nav />

      <section style={{ paddingTop: 44, paddingBottom: 72 }}>
        <div className="container">
          {/* breadcrumb */}
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: 'var(--ink-mute)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 32 }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Marktplatz</Link>
            <span style={{ margin: '0 10px' }}>›</span>
            <span>{l.category.split('·')[0].trim()}</span>
            <span style={{ margin: '0 10px' }}>›</span>
            <span style={{ color: 'var(--ink-soft)' }}>{l.title}</span>
          </div>

          <div className="hero-grid" style={{ alignItems: 'start', gap: 56 }}>
            {/* LEFT */}
            <div>
              <div className="listing-badges" style={{ justifyContent: 'flex-start', marginBottom: 18 }}>
                {l.badges
                  .filter((b) => b.kind !== 'verified')
                  .map((b, i) => (
                    <span key={i} className={b.kind === 'plain' ? 'badge' : `badge ${b.kind}`}>{b.label}</span>
                  ))}
                <span className="badge">{l.model}</span>
                {l.sellerVerified && <span className="badge verified">✓ Verkäufer verifiziert</span>}
                {l.revenueVerified && <span className="badge verified">✓ Umsatz geprüft</span>}
              </div>
              <h1 style={{ fontSize: 'clamp(40px, 5vw, 66px)', lineHeight: 1, marginBottom: 12 }}>{l.title}</h1>
              <div className="listing-cat" style={{ fontSize: 12, marginBottom: 8 }}>{l.category}</div>
              <p style={{ color: 'var(--ink-soft)', fontSize: 19, maxWidth: 540 }}>{l.subtitle}</p>

              {/* gallery */}
              <div style={{ position: 'relative', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--line)', margin: '32px 0 12px', boxShadow: '0 20px 40px -28px rgba(40,30,20,0.25)' }}>
                <div className={`listing-icon ${l.iconClass}`} style={{ width: '100%', height: 360, borderRadius: 0, fontSize: 180, fontWeight: 500, alignItems: 'flex-end', justifyContent: 'flex-start', padding: '0 36px 4px' }}>{l.icon}</div>
                <div style={{ position: 'absolute', top: 16, left: 16, fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff', background: 'rgba(27,25,22,0.45)', padding: '5px 10px', borderRadius: 3, backdropFilter: 'blur(4px)' }}>Live-Vorschau</div>
                <div style={{ position: 'absolute', top: 16, right: 16, fontFamily: "'Geist Mono', monospace", fontSize: 11, color: '#fff' }}>● Live</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 44 }}>
                {thumbs.map((c, i) => (
                  <div key={c}>
                    <div className={`listing-icon icon-${((i + 2) % 6) + 1}`} style={{ width: '100%', height: 92, borderRadius: 4, fontSize: 0 }} />
                    <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 8 }}>{c}</div>
                  </div>
                ))}
              </div>

              {/* about */}
              <div style={{ marginBottom: 44 }}>
                <div style={blockLabel}>Über das Projekt</div>
                <h3 style={blockTitle}>Ein fertiges Werk, bereit zur Übergabe.</h3>
                <p style={{ color: 'var(--ink-soft)', fontSize: 16, lineHeight: 1.65 }}>{l.about}</p>
              </div>

              {/* highlights */}
              <div style={{ marginBottom: 44 }}>
                <div style={blockLabel}>Highlights</div>
                <ul style={{ listStyle: 'none' }}>
                  {l.highlights.map((h) => (
                    <li key={h} style={{ padding: '12px 0', borderBottom: '1px solid var(--line-soft)', display: 'flex', gap: 14, fontSize: 15, color: 'var(--ink-soft)' }}>
                      <span style={{ color: 'var(--accent)', fontFamily: "'Geist Mono', monospace" }}>→</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* tech */}
              <div style={{ marginBottom: 44 }}>
                <div style={blockLabel}>Tech-Stack</div>
                <div className="tech-stack" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
                  {l.tech.map((t) => (
                    <span key={t} className="tech-tag" style={{ fontSize: 12, padding: '6px 11px' }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* revenue chart */}
              <div style={{ marginBottom: 44 }}>
                <div style={blockLabel}>Umsatz · letzte 12 Monate</div>
                <div style={{ ...card, padding: '28px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120 }}>
                    {bars.map((h, i) => (
                      <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--accent)', opacity: 0.3 + (i / (bars.length - 1)) * 0.7, borderRadius: '3px 3px 0 0' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontFamily: "'Geist Mono', monospace", fontSize: 10, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    <span>Jun '25</span>
                    <span>Stetiges Wachstum</span>
                    <span>Mai '26</span>
                  </div>
                </div>
              </div>

              {/* due diligence */}
              <div>
                <div style={blockLabel}>Due-Diligence-Status</div>
                <div style={{ ...card }}>
                  {dueDiligence.map((d, i) => (
                    <div key={i} className={d.s ? `deal-step ${d.s}` : 'deal-step'}>
                      <div className="deal-step-icon">{d.icon}</div>
                      <div className="deal-step-content">
                        <div className="deal-step-name">{d.name}</div>
                        <div className="deal-step-meta">{d.meta}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — sticky sidebar */}
            <aside style={{ position: 'sticky', top: 110, alignSelf: 'start' }}>
              <div style={{ ...card, padding: 28, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Geist Mono', monospace", fontSize: 11, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
                  <span>{l.price.type}</span>
                  <span>{l.status === 'sold' ? '● Verkauft' : '● Verfügbar'}</span>
                </div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 44, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1 }}>{l.price.num}</div>
                <div style={{ color: 'var(--ink-mute)', fontSize: 13, marginTop: 6 }}>{l.price.multiple}</div>

                {l.status === 'sold' ? (
                  <button
                    type="button"
                    className="btn"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 22 }}
                    disabled
                  >
                    Bereits verkauft
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 22 }}
                    onClick={startOffer}
                  >
                    {offerOpen ? 'Abbrechen' : <>Angebot machen <span>→</span></>}
                  </button>
                )}
                <Link to="/dealroom" className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>Zum Dealroom</Link>

                {l.status !== 'sold' && offerOpen && (
                  <form onSubmit={submitOffer} style={{ marginTop: 18, paddingTop: 18, borderTop: '1px dashed var(--line)' }} noValidate>
                    {error && <div className="alert alert-error">{error}</div>}
                    <div className="field">
                      <label htmlFor="offer-amount">Dein Angebot (€)</label>
                      <input
                        id="offer-amount"
                        className="input"
                        type="number"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={l.price.num}
                      />
                      <span className="field-hint">Leer lassen = zum genannten Preis.</span>
                    </div>
                    <div className="field">
                      <label htmlFor="offer-message">Nachricht</label>
                      <textarea
                        id="offer-message"
                        className="textarea"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Stell dich kurz vor — warum passt du zu diesem Projekt?"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={busy}>
                      {busy ? <span className="spinner" /> : <>Angebot senden <span>→</span></>}
                    </button>
                  </form>
                )}

                <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px dashed var(--line)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }}><path d="M9 12l2 2 4-4" /><path d="M12 2L2 7v6c0 5 3.5 9.5 10 11 6.5-1.5 10-6 10-11V7l-10-5z" /></svg>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                    Kaufpreis treuhand-gesichert. Auszahlung erst nach bestätigtem Asset-Transfer — Atelier-Gebühr 6%.
                  </div>
                </div>
              </div>

              <div style={{ ...card, marginBottom: 20 }}>
                <div style={sideLabel}>Kennzahlen</div>
                <div className="feature-stats" style={{ borderTop: 'none', paddingTop: 0 }}>
                  {l.financials.map((m, i) => (
                    <div key={i}>
                      <div className="stat-label">{m.label}</div>
                      <div className="stat-value">
                        {m.val}
                        {m.small ? <small style={{ fontFamily: "'Geist', sans-serif", fontSize: 12, color: 'var(--ink-mute)' }}> {m.small}</small> : null}
                        {m.trend ? <span className="metric-trend"> {m.trend}</span> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ ...card }}>
                <div style={sideLabel}>Verkäufer</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="seller-avatar" style={{ width: 44, height: 44, fontSize: 18 }}>{l.seller.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 15 }}>{l.seller.name}</div>
                    <div className="seller-rating">{l.seller.rating}</div>
                  </div>
                </div>
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {l.sellerVerified && <span className="badge verified">✓ Identität verifiziert</span>}
                  <span className="badge">Mitglied seit 2024</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* related */}
      <section style={{ borderTop: '1px solid var(--line)', paddingTop: 80, paddingBottom: 100 }}>
        <div className="container">
          <div className="section-head">
            <div className="section-head-left">
              <div className="eyebrow">WEITERE PROJEKTE</div>
              <h2>Vielleicht auch <em>interessant.</em></h2>
            </div>
            <Link to="/" className="btn">Alle ansehen <span>→</span></Link>
          </div>
          <div className="listings">
            {related.map((x) => (
              <ListingCard key={x.id} listing={x} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
