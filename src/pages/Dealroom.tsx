import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useAuth } from '../state/AuthContext'
import {
  fetchBuyerDeals,
  fetchOrgDeals,
  updateDealStatus,
  type Deal,
  type DealStatus,
} from '../data/dealsRepo'

const fmt = (n: number | null) => (n ? '€' + n.toLocaleString('de-DE') : 'Zum Listenpreis')

function statusLabel(s: DealStatus): string {
  switch (s) {
    case 'open':
      return 'Offen'
    case 'accepted':
      return 'Angenommen'
    case 'declined':
      return 'Abgelehnt'
    case 'withdrawn':
      return 'Zurückgezogen'
  }
}

export default function Dealroom() {
  const { user, profile } = useAuth()
  const userId = user?.id ?? null
  const orgId = profile?.org_id ?? null

  const [buyerDeals, setBuyerDeals] = useState<Deal[]>([])
  const [sellerDeals, setSellerDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const [mine, incoming] = await Promise.all([
        userId ? fetchBuyerDeals(userId) : Promise.resolve([]),
        orgId ? fetchOrgDeals(orgId) : Promise.resolve([]),
      ])
      setBuyerDeals(mine)
      setSellerDeals(incoming)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Angebote konnten nicht geladen werden.')
    } finally {
      setLoading(false)
    }
  }, [userId, orgId])

  useEffect(() => {
    load()
  }, [load])

  async function act(id: string, status: DealStatus) {
    setError(null)
    try {
      await updateDealStatus(id, status)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Aktion fehlgeschlagen.')
    }
  }

  return (
    <>
      <Nav />
      <main className="app-main">
        <div className="container">
          <div className="page-head">
            <div className="eyebrow">DEALROOM</div>
            <h1>
              Wo aus Interesse <em>ein Deal wird.</em>
            </h1>
            <p>Deine gesendeten Angebote und die Angebote, die für deine Projekte eingehen — an einem Ort.</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="auth-gate">
              <div className="spinner" />
            </div>
          ) : (
            <>
              <section className="dash-section">
                <div className="dash-section-head">
                  <h2>Meine Angebote</h2>
                </div>
                {buyerDeals.length === 0 ? (
                  <div className="empty-block">
                    <p>Du hast noch kein Angebot gesendet.</p>
                    <Link to="/" className="btn btn-primary">
                      Marktplatz erkunden <span>→</span>
                    </Link>
                  </div>
                ) : (
                  <div className="row-list">
                    {buyerDeals.map((d) => (
                      <div className="row-card" key={d.id}>
                        <div className="row-main">
                          <div className="row-title">
                            {d.listing ? (
                              <Link
                                to={`/listing/${d.listing.slug}`}
                                style={{ color: 'inherit', textDecoration: 'none' }}
                              >
                                {d.listing.title}
                              </Link>
                            ) : (
                              'Projekt'
                            )}
                          </div>
                          <div className="row-meta">{fmt(d.offer_amount)}</div>
                        </div>
                        <span className={`pill pill-${d.status}`}>{statusLabel(d.status)}</span>
                        <div className="row-actions">
                          {d.status === 'open' && (
                            <button
                              type="button"
                              className="btn btn-sm"
                              onClick={() => act(d.id, 'withdrawn')}
                            >
                              Zurückziehen
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="dash-section">
                <div className="dash-section-head">
                  <h2>Angebote an meine Projekte</h2>
                </div>
                {sellerDeals.length === 0 ? (
                  <div className="empty-block">
                    <p>Noch keine Angebote für deine Projekte.</p>
                  </div>
                ) : (
                  <div className="row-list">
                    {sellerDeals.map((d) => (
                      <div className="row-card" key={d.id}>
                        <div className="row-main">
                          <div className="row-title">{d.listing?.title ?? 'Projekt'}</div>
                          <div className="row-meta">{fmt(d.offer_amount)}</div>
                          {d.message && (
                            <div className="row-meta" style={{ marginTop: 6, fontFamily: "'Geist', sans-serif", color: 'var(--ink-soft)' }}>
                              „{d.message}"
                            </div>
                          )}
                        </div>
                        <span className={`pill pill-${d.status}`}>{statusLabel(d.status)}</span>
                        <div className="row-actions">
                          {d.status === 'open' && (
                            <>
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => act(d.id, 'accepted')}
                              >
                                Annehmen
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm"
                                onClick={() => act(d.id, 'declined')}
                              >
                                Ablehnen
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
