import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useAuth } from '../state/AuthContext'
import {
  fetchOrgListings,
  setListingStatus,
  deleteListing,
  type OwnerListing,
} from '../data/listingsRepo'
import { fetchOrgDeals, type Deal } from '../data/dealsRepo'
import { kindLabels, type ListingKind } from '../data/listings'

const statusLabel: Record<string, string> = {
  draft: 'Entwurf',
  published: 'Veröffentlicht',
}

export default function Dashboard() {
  const { profile } = useAuth()
  const orgId = profile?.org_id ?? null

  const [listings, setListings] = useState<OwnerListing[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!orgId) {
      setLoading(false)
      return
    }
    setError(null)
    try {
      const [rows, orgDeals] = await Promise.all([
        fetchOrgListings(orgId),
        fetchOrgDeals(orgId),
      ])
      setListings(rows)
      setDeals(orgDeals)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Daten konnten nicht geladen werden.')
    } finally {
      setLoading(false)
    }
  }, [orgId])

  useEffect(() => {
    load()
  }, [load])

  async function togglePublish(l: OwnerListing) {
    const next = l.status === 'published' ? 'draft' : 'published'
    try {
      await setListingStatus(l.slug, next)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Aktion fehlgeschlagen.')
    }
  }

  async function remove(l: OwnerListing) {
    if (!window.confirm(`„${l.title}" wirklich löschen? Das lässt sich nicht rückgängig machen.`)) {
      return
    }
    try {
      await deleteListing(l.slug)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Löschen fehlgeschlagen.')
    }
  }

  const openOffers = deals.filter((d) => d.status === 'open').length

  return (
    <>
      <Nav />
      <main className="app-main">
        <div className="container">
          <div className="page-head">
            <div className="eyebrow">DASHBOARD</div>
            <h1>
              Willkommen, <em>{profile?.display_name || 'bei Atelier'}.</em>
            </h1>
            <p>Verwalte deine Projekte und behalte eingehende Angebote im Blick.</p>
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
                  <h2>Meine Projekte</h2>
                  <Link to="/sell" className="btn btn-primary btn-sm">
                    Neues Projekt <span>→</span>
                  </Link>
                </div>

                {listings.length === 0 ? (
                  <div className="empty-block">
                    <p>Du hast noch kein Projekt eingestellt.</p>
                    <Link to="/sell" className="btn btn-primary">
                      Erstes Projekt einstellen <span>→</span>
                    </Link>
                  </div>
                ) : (
                  <div className="row-list">
                    {listings.map((l) => (
                      <div className="row-card" key={l.slug}>
                        <div className="row-main">
                          <div className="row-title">{l.title}</div>
                          <div className="row-meta">
                            {kindLabels[l.kind as ListingKind] ?? l.kind} · {l.price_num}
                          </div>
                        </div>
                        <span className={`pill pill-${l.status}`}>
                          {statusLabel[l.status] ?? l.status}
                        </span>
                        <div className="row-actions">
                          {l.status === 'published' && (
                            <Link to={`/listing/${l.slug}`} className="btn btn-sm">
                              Ansehen
                            </Link>
                          )}
                          <button type="button" className="btn btn-sm" onClick={() => togglePublish(l)}>
                            {l.status === 'published' ? 'Zurückziehen' : 'Veröffentlichen'}
                          </button>
                          <button type="button" className="btn btn-sm" onClick={() => remove(l)}>
                            Löschen
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="dash-section">
                <div className="dash-section-head">
                  <h2>Eingehende Angebote</h2>
                  <Link to="/dealroom" className="btn btn-sm">
                    Zum Dealroom <span>→</span>
                  </Link>
                </div>

                {deals.length === 0 ? (
                  <div className="empty-block">
                    <p>Noch keine Angebote für deine Projekte.</p>
                  </div>
                ) : (
                  <>
                    {openOffers > 0 && (
                      <div className="alert alert-ok">
                        {openOffers === 1
                          ? '1 offenes Angebot wartet auf deine Antwort.'
                          : `${openOffers} offene Angebote warten auf deine Antwort.`}{' '}
                        <Link to="/dealroom" className="text-link">
                          Jetzt im Dealroom bearbeiten
                        </Link>
                      </div>
                    )}
                    <div className="row-list">
                      {deals.slice(0, 5).map((d) => (
                        <div className="row-card" key={d.id}>
                          <div className="row-main">
                            <div className="row-title">{d.listing?.title ?? 'Projekt'}</div>
                            <div className="row-meta">
                              {d.offer_amount ? '€' + d.offer_amount.toLocaleString('de-DE') : 'Zum Listenpreis'}
                            </div>
                          </div>
                          <span className={`pill pill-${d.status}`}>{dealStatusLabel(d.status)}</span>
                        </div>
                      ))}
                    </div>
                  </>
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

function dealStatusLabel(s: Deal['status']): string {
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
