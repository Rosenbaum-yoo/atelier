import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'

type Mode = 'signin' | 'signup'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  const [mode, setMode] = useState<Mode>('signin')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const isSignup = mode === 'signup'

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)

    if (!isSupabaseConfigured) {
      setError('Backend ist nicht verbunden. Bitte später erneut versuchen.')
      return
    }
    if (password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen haben.')
      return
    }

    setBusy(true)
    try {
      const supabase = getSupabase()
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName.trim() } },
        })
        if (error) throw error
        if (data.session) {
          navigate(from, { replace: true })
        } else {
          setNotice(
            'Fast geschafft — wir haben dir eine Bestätigungs-E-Mail geschickt. ' +
              'Bestätige sie und melde dich anschließend an.',
          )
          setMode('signin')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate(from, { replace: true })
      }
    } catch (err) {
      setError(translateAuthError(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Nav />
      <main className="app-main">
        <div className="container">
          <div className="auth-wrap">
            <div className="auth-card">
              <div className="auth-head">
                <div className="eyebrow">{isSignup ? 'KONTO ERSTELLEN' : 'WILLKOMMEN ZURÜCK'}</div>
                <h1>
                  {isSignup ? (
                    <>
                      Werde Teil von <em>Atelier.</em>
                    </>
                  ) : (
                    <>
                      Bei <em>Atelier</em> anmelden.
                    </>
                  )}
                </h1>
                <p>
                  {isSignup
                    ? 'Ein Konto genügt — zum Kaufen, Verkaufen und für den Dealroom.'
                    : 'Melde dich an, um Projekte einzustellen und Angebote zu verwalten.'}
                </p>
              </div>

              {error && <div className="alert alert-error">{error}</div>}
              {notice && <div className="alert alert-ok">{notice}</div>}

              <form onSubmit={onSubmit} noValidate>
                {isSignup && (
                  <div className="field">
                    <label htmlFor="displayName">Anzeigename</label>
                    <input
                      id="displayName"
                      className="input"
                      type="text"
                      autoComplete="name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Wie sollen wir dich nennen?"
                      required
                    />
                  </div>
                )}

                <div className="field">
                  <label htmlFor="email">E-Mail</label>
                  <input
                    id="email"
                    className="input"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="du@beispiel.de"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="password">Passwort</label>
                  <input
                    id="password"
                    className="input"
                    type="password"
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mindestens 8 Zeichen"
                    required
                  />
                  {isSignup && (
                    <span className="field-hint">Mindestens 8 Zeichen.</span>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={busy}>
                    {busy ? (
                      <span className="spinner" />
                    ) : isSignup ? (
                      <>Konto erstellen <span>→</span></>
                    ) : (
                      <>Anmelden <span>→</span></>
                    )}
                  </button>
                  <Link to="/" className="text-link">
                    Zurück zum Marktplatz
                  </Link>
                </div>
              </form>

              <div className="auth-switch">
                {isSignup ? (
                  <>
                    Schon ein Konto?{' '}
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => {
                        setMode('signin')
                        setError(null)
                      }}
                    >
                      Anmelden
                    </button>
                  </>
                ) : (
                  <>
                    Noch kein Konto?{' '}
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => {
                        setMode('signup')
                        setError(null)
                      }}
                    >
                      Jetzt registrieren
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function translateAuthError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err)
  if (/invalid login credentials/i.test(msg)) return 'E-Mail oder Passwort ist falsch.'
  if (/user already registered/i.test(msg)) return 'Für diese E-Mail existiert bereits ein Konto.'
  if (/email not confirmed/i.test(msg)) return 'Bitte bestätige zuerst deine E-Mail.'
  if (/password/i.test(msg) && /least/i.test(msg)) return 'Das Passwort ist zu kurz.'
  return msg || 'Etwas ist schiefgelaufen. Bitte versuche es erneut.'
}
