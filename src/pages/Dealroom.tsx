import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useAuth } from '../state/AuthContext'
import {
  fetchBuyerDeals,
  fetchOrgDeals,
  updateDealStatus,
  type Deal,
  type DealStatus,
  type PaymentStatus,
} from '../data/dealsRepo'
import { startCheckout, confirmRelease } from '../data/paymentsRepo'

const fmt = (n: number | null) => (n ? '€' + n.toLocaleString('de-DE') : 'Zum Listenpreis')
const fmtCents = (c: number | null) => (c ? '€' + Math.round(c / 100).toLocaleString('de-DE') : '—')

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

const paymentPill: Record<PaymentStatus, { cls: string; label: string } | null> = {
  none: null,
  pending: { cls: 'pill-open', label: 'Zahlung offen' },
  held: { cls: 'pill-accepted', label: 'Bezahlt · in Treuhand' },
  released: { cls: 'pill-published', label: 'Ausgezahlt' },
  refunded: { cls: 'pill-withdrawn', label: 'Erstattet' },
  failed: { cls: 'pill-declined', label: 'Zahlung fehlgeschlagen' },
}

export default function Dealroom() {
  const { user, profile } = useAuth()
  const userId = user?.id ?? null
  const orgId = profile?.org_id ?? null

  const [buyerDeals, setBuyerDeals] = useState<Deal[]>([])
  const [sellerDeals, setSellerDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [params, setParams] = useSearchParams()

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

  useEffect(() => {
    if (params.get('paid') === '1') {
      setNotice('Zahlung erfolgreich. Der Betrag liegt jetzt sicher in der Treuhand, bis du den Erhalt bestätigst.')
      const next = new URLSearchParams(params)
      next.delete('paid')
      setParams(next, { replace: true })
      const t = setTimeout(() => load(), 2500)
      return () => clearTimeout(t)
    }
    if (params.get('canceled') === '1') {
      setNotice('Zahlung abgebrochen. Du kannst es jederzeit erneut versuchen.')
      const next = new URLSearchParams(params)
      next.delete('canceled')
      setParams(next, { replace: true })
    }
  }, [params, setParams, load])

  async function act(id: string, status: DealStatus) {
    setError(null)
    try {
      await updateDealStatus(id, status)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Aktion fehlgeschlagen.')
    }
  }

  async function pay(id: string) {
    setError(null)
    setBusy(id)
    try {
      window.location.href = await startCheckout(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Zahlung konnte nicht gestartet werden.')
      setBusy(null)
    }
  }

  async function release(id: string) {
    if (!window.confirm('Bestätigst du, dass du das Projekt vollständig erhalten hast? Danach wird der Betrag an den Verkäufer ausgezahlt — das lässt sich nicht rückgängig machen.')) return
    setError(null)
    setBusy(id)
    try {
      await confirmRelease(id)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Freigabe fehlgeschlagen.')
    } finally {
      setBusy(null)
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

          {notice && <div className="alert alert-ok">{notice}</div>}
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
                        {d.status === 'accepted' && paymentPill[d.payment_status] && (
                          <span className={`pill ${paymentPill[d.payment_status]!.cls}`}>
                            {paymentPill[d.payment_status]!.label}
                          </span>
                        )}
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
                          {d.status === 'accepted' &&
                            (d.payment_status === 'none' ||
                              d.payment_status === 'pending' ||
                              d.payment_status === 'failed') && (
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                disabled={busy === d.id}
                                onClick={() => pay(d.id)}
                              >
                                {busy === d.id ? 'Weiterleitung…' : 'Jetzt sicher bezahlen'}
                              </button>
                            )}
                          {d.status === 'accepted' && d.payment_status === 'held' && (
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              disabled={busy === d.id}
                              onClick={() => release(d.id)}
                            >
                              {busy === d.id ? 'Wird freigegeben…' : 'Erhalt bestätigen & freigeben'}
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
                        {d.status === 'accepted' && paymentPill[d.payment_status] && (
                          <span className={`pill ${paymentPill[d.payment_status]!.cls}`}>
                            {paymentPill[d.payment_status]!.label}
                          </span>
                        )}
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
                          {d.status === 'accepted' && d.payment_status === 'held' && (
                            <span className="row-meta">Auszahlung {fmtCents(d.amount_net)} nach Käufer-Bestätigung</span>
                          )}
                          {d.status === 'accepted' && d.payment_status === 'released' && (
                            <span className="row-meta">Ausgezahlt: {fmtCents(d.amount_net)}</span>
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
