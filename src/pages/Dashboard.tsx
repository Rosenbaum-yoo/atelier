import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
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
import { fetchEntitlement, startConnectOnboarding, type Entitlement } from '../data/paymentsRepo'
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
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [params, setParams] = useSearchParams()

  const load = useCallback(async () => {
    if (!orgId) {
      setLoading(false)
      return
    }
    setError(null)
    try {
      const [rows, orgDeals, ent] = await Promise.all([
        fetchOrgListings(orgId),
        fetchOrgDeals(orgId),
        fetchEntitlement(orgId),
      ])
      setListings(rows)
      setDeals(orgDeals)
      setEntitlement(ent)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Daten konnten nicht geladen werden.')
    } finally {
      setLoading(false)
    }
  }, [orgId])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const s = params.get('stripe')
    if (s !== 'done' && s !== 'refresh') return
    const next = new URLSearchParams(params)
    next.delete('stripe')
    setParams(next, { replace: true })
    // Returning from Stripe onboarding: re-run the function so it refreshes
    // readiness live from Stripe, then reload the entitlement.
    startConnectOnboarding().catch(() => {}).finally(() => load())
  }, [params, setParams, load])

  async function connect() {
    setError(null)
    setConnecting(true)
    try {
      const res = await startConnectOnboarding()
      if (res.url) {
        window.location.href = res.url
        return
      }
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Stripe-Verbindung fehlgeschlagen.')
    } finally {
      setConnecting(false)
    }
  }

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
                  <h2>Auszahlungen</h2>
                </div>
                {entitlement?.stripe_account_ready ? (
                  <div className="alert alert-ok">
                    Dein Stripe-Konto ist verbunden. Erlöse aus Verkäufen werden automatisch an dich
                    überwiesen, sobald der Käufer den Erhalt bestätigt.
                  </div>
                ) : (
                  <div className="empty-block">
                    <p>
                      {entitlement?.stripe_account_id
                        ? 'Dein Stripe-Onboarding ist noch nicht abgeschlossen. Schließe es ab, um Auszahlungen zu erhalten.'
                        : 'Verbinde ein Stripe-Konto, damit du Erlöse aus Verkäufen erhalten kannst. Erst danach können Käufer dein Projekt sicher bezahlen.'}
                    </p>
                    <button type="button" className="btn btn-primary" disabled={connecting} onClick={connect}>
                      {connecting
                        ? 'Weiterleitung…'
                        : entitlement?.stripe_account_id
                          ? 'Onboarding fortsetzen'
                          : 'Stripe-Konto verbinden'}{' '}
                      <span>→</span>
                    </button>
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
