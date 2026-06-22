import { useCallback, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useAuth } from '../state/AuthContext'
import {
  fetchIsStaff,
  fetchPendingVerifications,
  reviewVerification,
  type PendingVerification,
} from '../data/staffRepo'

const kindLabel: Record<string, string> = {
  seller: 'Verkäufer-Identität',
  revenue: 'Umsatz-Nachweis',
}

export default function StaffCenter() {
  const { user } = useAuth()
  const [isStaff, setIsStaff] = useState<boolean | null>(null)
  const [queue, setQueue] = useState<PendingVerification[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const staff = await fetchIsStaff()
      setIsStaff(staff)
      if (staff) setQueue(await fetchPendingVerifications())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Laden fehlgeschlagen.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load, user?.id])

  async function decide(id: string, decision: 'approved' | 'rejected') {
    let note: string | null = null
    if (decision === 'rejected') {
      note = window.prompt('Grund der Ablehnung (wird dem Verkäufer angezeigt):')
      if (note === null) return
    } else if (!window.confirm('Diese Anfrage bestätigen? Das setzt das Verifiziert-Abzeichen.')) {
      return
    }
    setError(null)
    setBusy(id)
    try {
      await reviewVerification(id, decision, note ?? undefined)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Aktion fehlgeschlagen.')
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
            <div className="eyebrow">STAFF CENTER</div>
            <h1>
              Verifizierungen <em>prüfen.</em>
            </h1>
            <p>Offene Verkäufer- und Umsatz-Verifizierungen über alle Organisationen.</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="auth-gate">
              <div className="spinner" />
            </div>
          ) : !isStaff ? (
            <div className="empty-block">
              <p>Kein Zugriff. Dieser Bereich ist dem Plattform-Team vorbehalten.</p>
            </div>
          ) : (
            <section className="dash-section">
              <div className="dash-section-head">
                <h2>Offene Anfragen</h2>
              </div>
              {queue.length === 0 ? (
                <div className="empty-block">
                  <p>Keine offenen Verifizierungs-Anfragen.</p>
                </div>
              ) : (
                <div className="row-list">
                  {queue.map((v) => (
                    <div className="row-card" key={v.id}>
                      <div className="row-main">
                        <div className="row-title">{kindLabel[v.kind] ?? v.kind}</div>
                        <div className="row-meta">
                          Org {v.org_id.slice(0, 8)}… · {new Date(v.created_at).toLocaleDateString('de-DE')}
                          {v.note ? ` · „${v.note}"` : ''}
                        </div>
                      </div>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          disabled={busy === v.id}
                          onClick={() => decide(v.id, 'approved')}
                        >
                          {busy === v.id ? '…' : 'Bestätigen'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm"
                          disabled={busy === v.id}
                          onClick={() => decide(v.id, 'rejected')}
                        >
                          Ablehnen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
