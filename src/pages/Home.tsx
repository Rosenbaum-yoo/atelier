import type { ReactNode } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import Marketplace from '../components/Marketplace'
import HashLink from '../components/HashLink'

const steps = [
  {
    num: 'i.',
    title: 'Projekt einreichen',
    desc: 'Du beschreibst dein Produkt: Tech-Stack, Umsätze, Kundenbasis, Dokumentation. Wir geben dir ein internes Review innerhalb von 48 Stunden.',
  },
  {
    num: 'ii.',
    title: 'Verifizierung',
    desc: 'Stripe-, App-Store- und GitHub-Daten werden anonymisiert validiert. Unser Tech-Team schaut sich Code-Qualität und Architektur an.',
  },
  {
    num: 'iii.',
    title: 'Verhandlung & NDA',
    desc: 'Interessierte Käufer fragen über die Plattform an. Digitale NDAs, Verträge und Due-Diligence-Material werden über uns abgewickelt.',
  },
  {
    num: 'iv.',
    title: 'Treuhand & Transfer',
    desc: 'Kaufpreis liegt sicher in unserer Treuhand. Erst nach erfolgreichem Transfer von Code, Lizenzen & Accounts wird ausgezahlt.',
  },
]

const features: { svg: ReactNode; title: string; desc: string }[] = [
  {
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /><path d="M12 2L2 7v6c0 5 3.5 9.5 10 11 6.5-1.5 10-6 10-11V7l-10-5z" /></svg>
    ),
    title: 'Treuhand-Service',
    desc: 'Der Kaufbetrag liegt bei einem regulierten Treuhandpartner. Auszahlung erst, wenn beide Seiten den Transfer bestätigt haben.',
  },
  {
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
    ),
    title: 'Technische Tiefe',
    desc: 'Wir veröffentlichen Code-Qualitäts-Reports, Architektur-Diagramme und Test-Coverage. Käufer wissen, was sie bekommen.',
  },
  {
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
    ),
    title: 'Verträge & NDA',
    desc: 'Standardisierte Asset-Purchase-Agreements, NDAs und Lizenz-Übertragungen — anwaltlich geprüft, digital signiert, sofort einsatzbereit.',
  },
  {
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    ),
    title: 'Umsatz-Verifikation',
    desc: 'Stripe-, Paddle- und App-Store-Connect-Daten werden automatisch ausgelesen und über 12 Monate retrospektiv geprüft.',
  },
  {
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
    ),
    title: 'Reputation & Vertrauen',
    desc: 'Zwei-Wege-Bewertungen für Käufer & Verkäufer. Verifizierte Identitäten, transparente Deal-Historie, keine anonymen Schnäppchenjäger.',
  },
  {
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20" /></svg>
    ),
    title: 'Flexible Deal-Strukturen',
    desc: 'Komplettverkauf, Earn-Out, Anteilsverkauf, Sponsoring-Modelle — du musst nicht dein ganzes Baby abgeben.',
  },
]

const trustSignals = [
  'Treuhand-gesichert — Geld fließt erst nach Transfer',
  'Kuratiert — jedes Listing wird geprüft',
  'Verifizierte Umsätze (Stripe · Paddle · App Store)',
  'NDA & Verträge anwaltlich vorbereitet',
  'DSGVO-konform · Hosting in der EU',
  '6% — und nur bei erfolgreichem Deal',
]

const bleedSection = {
  background: 'var(--bg-warm)',
  margin: '0 -100vw',
  paddingLeft: 'calc(100vw - 50%)',
  paddingRight: 'calc(100vw - 50%)',
  borderTop: '1px solid var(--line)',
  borderBottom: '1px solid var(--line)',
} as const

export default function Home() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="eyebrow">PILOTPHASE 2026 · KURATIERTER MARKTPLATZ FÜR SOFTWARE</div>
              <h1>
                Wo Software<br />
                den Besitzer <em>wechselt.</em>
              </h1>
              <p className="hero-lede">
                Atelier ist die kuratierte Börse für fertige Apps, SaaS-Produkte und ganze Software-Firmen. Verifizierte Umsätze, geprüfter Code, sicherer Transfer — ohne dass du dich um Verträge, Treuhand oder Lizenzfragen kümmern musst.
              </p>
              <div className="hero-actions">
                <HashLink hash="marketplace" className="btn btn-primary">Marktplatz erkunden <span>→</span></HashLink>
                <Link to="/sell" className="btn">Projekt verkaufen</Link>
              </div>
            </div>
            <aside className="hero-feature">
              <div className="feature-meta">
                <span>SaaS · B2B</span>
                <span>● Beispiel</span>
              </div>
              <div className="feature-title">TaskFlow Pro</div>
              <div className="feature-sub">Projektmanagement für Agenturen</div>
              <div className="feature-stats">
                <div>
                  <div className="stat-label">MRR</div>
                  <div className="stat-value">€3.240</div>
                </div>
                <div>
                  <div className="stat-label">Kunden</div>
                  <div className="stat-value">142</div>
                </div>
                <div>
                  <div className="stat-label">Stack</div>
                  <div className="stat-value" style={{ fontSize: 14 }}>Next · Postgres</div>
                </div>
                <div>
                  <div className="stat-label">Alter</div>
                  <div className="stat-value">2,4 J.</div>
                </div>
              </div>
              <div className="feature-price">
                <div>
                  <div className="price-big">€48.500</div>
                  <div className="price-meta">≈ 15× MRR</div>
                </div>
                <HashLink hash="marketplace" className="btn btn-primary" style={{ fontSize: 12, padding: '8px 14px' }}>Ansehen →</HashLink>
              </div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: 'var(--ink-mute)', marginTop: 14, textAlign: 'center' }}>Beispielhafte Darstellung eines Listings</div>
            </aside>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">0<sup>€</sup></div>
              <div className="hero-stat-label">Risiko für den Käufer —<br />Geld bleibt in Treuhand</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">6<sup>%</sup></div>
              <div className="hero-stat-label">Provision — und nur,<br />wenn der Deal schließt</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">48<sup>h</sup></div>
              <div className="hero-stat-label">bis zum internen<br />Code- &amp; Umsatz-Review</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">100<sup>%</sup></div>
              <div className="hero-stat-label">kuratiert — jedes Listing<br />wird vor Freigabe geprüft</div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="trustbar-wrap">
        <div className="container">
          <div className="trustbar-status">● Pilotphase — wir starten mit einer kuratierten ersten Welle an Projekten.</div>
          <div className="trustbar">
            {trustSignals.map((t) => (
              <div className="trustbar-item" key={t}>{t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKETPLACE */}
      <Marketplace />

      {/* HOW IT WORKS */}
      <section id="how" className="how-section">
        <div className="how-inner">
          <div className="section-head" style={{ borderColor: 'var(--line)' }}>
            <div className="section-head-left">
              <div className="eyebrow">DER ABLAUF</div>
              <h2>In vier Schritten <em>vom Code zum Closing.</em></h2>
              <p className="section-sub">
                Wir begleiten beide Seiten — von der ersten Anfrage bis zur sauberen Übergabe von Repository, Lizenzen und Accounts.
              </p>
            </div>
          </div>

          <div className="steps">
            {steps.map((s) => (
              <div className="step" key={s.num}>
                <div className="step-num">{s.num}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST / FEATURES */}
      <section id="trust">
        <div className="container">
          <div className="section-head">
            <div className="section-head-left">
              <div className="eyebrow">WAS UNS ANDERS MACHT</div>
              <h2>Mehr als nur eine <em>Anzeigenbörse.</em></h2>
              <p className="section-sub">
                Wir behandeln Software wie das Handwerk, das sie ist. Jedes Listing wird kuratiert, jeder Deal abgesichert.
              </p>
            </div>
          </div>

          <div className="features-grid">
            {features.map((f) => (
              <div className="feature" key={f.title}>
                <div className="feature-icon">{f.svg}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEAL FLOW / ESCROW */}
      <section style={bleedSection}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 40px' }}>
          <div className="deal-flow">
            <div>
              <div className="eyebrow">TREUHAND IM DETAIL</div>
              <h2 style={{ marginBottom: 24 }}>Geld fließt erst, wenn <em>der Code übergeben ist.</em></h2>
              <p style={{ color: 'var(--ink-soft)', fontSize: 17, lineHeight: 1.6, marginBottom: 32, maxWidth: 480 }}>
                Wir arbeiten mit einem regulierten Treuhandpartner. Der Käufer überweist den Kaufpreis an die Treuhand. Erst wenn der Verkäufer alle vereinbarten Assets übergeben hat und beide Seiten bestätigen, wird das Geld freigegeben — abzüglich unserer Gebühr von 6%.
              </p>
              <div style={{ display: 'flex', gap: 16 }}>
                <HashLink hash="trust" className="btn btn-primary">Treuhand-Details ansehen <span>→</span></HashLink>
                <Link to="/faq" className="btn">Häufige Fragen</Link>
              </div>
            </div>

            <div className="deal-visual">
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Illustration · kein realer Deal</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Deal #ATL-2026-0814</div>
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: 'var(--success)' }}>● AKTIV</div>
              </div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, letterSpacing: '-0.02em', marginBottom: 4 }}>DocuMind AI</div>
              <div style={{ color: 'var(--ink-mute)', fontSize: 13, marginBottom: 20 }}>Käufer: Helix Capital · Verkäufer: Aydan K.</div>

              <div className="deal-step done">
                <div className="deal-step-icon">✓</div>
                <div className="deal-step-content">
                  <div className="deal-step-name">NDA signiert</div>
                  <div className="deal-step-meta">14.05.2026 · 09:24</div>
                </div>
              </div>
              <div className="deal-step done">
                <div className="deal-step-icon">✓</div>
                <div className="deal-step-content">
                  <div className="deal-step-name">Due Diligence abgeschlossen</div>
                  <div className="deal-step-meta">17.05.2026 · 16:48</div>
                </div>
              </div>
              <div className="deal-step done">
                <div className="deal-step-icon">✓</div>
                <div className="deal-step-content">
                  <div className="deal-step-name">Kaufvertrag signiert</div>
                  <div className="deal-step-meta">19.05.2026 · 11:02</div>
                </div>
              </div>
              <div className="deal-step active">
                <div className="deal-step-icon">●</div>
                <div className="deal-step-content">
                  <div className="deal-step-name">Asset-Transfer läuft</div>
                  <div className="deal-step-meta">GitHub · AWS · Stripe · Domain</div>
                </div>
              </div>
              <div className="deal-step">
                <div className="deal-step-icon">04</div>
                <div className="deal-step-content">
                  <div className="deal-step-name">Treuhand-Freigabe</div>
                  <div className="deal-step-meta">Beide Parteien müssen bestätigen</div>
                </div>
              </div>

              <div className="escrow-card">
                <div>
                  <div className="escrow-label">In Treuhand</div>
                  <div className="escrow-amount">€164.000</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="escrow-label">Atelier-Gebühr</div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13, color: 'var(--ink-soft)' }}>6,0% · €9.840</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section id="sellers">
        <div className="container">
          <div className="audience-split">
            <div className="audience-card">
              <div className="audience-tag">Für Entwickler</div>
              <h3>Du hast etwas gebaut.<br /><em>Verkauf es richtig.</em></h3>
              <p>Dein Side-Project hat Traction, aber dir fehlt die Zeit oder der Wille, es weiter auszubauen? Übergib es an jemanden, der es weiterführt — zum fairen Preis, ohne juristisches Chaos.</p>
              <ul className="audience-list">
                <li>Kostenlose Bewertung deines Projekts</li>
                <li>Anonyme Listings möglich</li>
                <li>6% Gebühr nur bei Erfolg</li>
                <li>Earn-Out & Anteils-Optionen</li>
              </ul>
              <Link to="/sell" className="btn btn-light">Projekt einstellen <span>→</span></Link>
            </div>

            <div className="audience-card alt">
              <div className="audience-tag">Für Käufer</div>
              <h3>Bau nicht neu.<br /><em>Kauf etwas Fertiges.</em></h3>
              <p>Du suchst ein Produkt, ein Team oder eine Tech-Basis? Auf Atelier findest du fertige, geprüfte Software-Projekte mit echten Nutzern und nachweisbaren Umsätzen.</p>
              <ul className="audience-list">
                <li>Vollständige Due-Diligence-Reports</li>
                <li>Verifizierte Umsätze & Metriken</li>
                <li>Treuhand-gesicherter Kaufprozess</li>
                <li>Optional: 90 Tage Handover-Support</li>
              </ul>
              <HashLink hash="marketplace" className="btn btn-light">Marktplatz ansehen <span>→</span></HashLink>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 0 120px' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>EINE KURATIERTE BÖRSE FÜR SOFTWARE</div>
          <h2 style={{ fontSize: 'clamp(48px, 6vw, 80px)', marginBottom: 28 }}>
            Wenn Code seinen <em>nächsten Ort</em> sucht.
          </h2>
          <p style={{ fontSize: 18, color: 'var(--ink-soft)', maxWidth: 560, margin: '0 auto 40px' }}>
            Atelier ist die Plattform, auf der Entwickler*innen und Käufer*innen einander finden — ohne Schnäppchenjäger, ohne juristisches Risiko, mit echtem Respekt für die Arbeit.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <Link to="/login" className="btn btn-primary">Jetzt kostenlos starten <span>→</span></Link>
            <Link to="/demo" className="btn">Demo ansehen</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
