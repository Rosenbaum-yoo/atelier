import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const inclusions = [
  'Listing erstellen — kostenlos',
  'Internes Code- & Umsatz-Review',
  'Treuhand-gesicherte Abwicklung',
  'Verträge, NDA & Lizenz-Transfer',
  'Provision nur bei erfolgreichem Verkauf',
]

const bespoke = [
  'Für Firmenanteile & Unternehmensnachfolge',
  'Notarielle Übertragung begleitet (§ 15 GmbHG)',
  'Persönlicher Deal-Manager',
  'Maßgeschneiderte Due-Diligence-Tiefe',
  'Verhandelte Provision je nach Volumen',
]

const feeSteps = [
  {
    num: 'i.',
    title: 'Einstellen kostet nichts',
    desc: 'Du listest dein Projekt, lässt es prüfen und führst Gespräche — vollständig kostenlos.',
  },
  {
    num: 'ii.',
    title: 'Treuhand sichert den Deal',
    desc: 'Schließt ein Käufer ab, fließt der Kaufpreis in die Treuhand. Dein Geld ist sicher, bevor du etwas übergibst.',
  },
  {
    num: 'iii.',
    title: '6 % erst bei Auszahlung',
    desc: 'Nach bestätigtem Transfer wird ausgezahlt — abzüglich 6 %. Kein Deal, keine Gebühr.',
  },
]

export default function Pricing() {
  return (
    <>
      <Nav />
      <main className="app-main">
        <div className="container">
          <div className="page-head">
            <div className="eyebrow">PREISE & GEBÜHREN</div>
            <h1>
              Ein Preis. Erst bei <em>Erfolg.</em>
            </h1>
            <p>
              Keine Grundgebühr, keine Listing-Kosten, kein Abo. Atelier verdient nur, wenn dein Projekt erfolgreich
              den Besitzer wechselt — über eine transparente Erfolgsprovision.
            </p>
          </div>

          <div className="audience-split">
            <div className="audience-card">
              <div className="audience-tag">Für jeden Verkauf</div>
              <div className="pricing-amount">6 %</div>
              <div className="pricing-sub">Erfolgsprovision pro Deal</div>
              <ul className="audience-list">
                {inclusions.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <Link to="/sell" className="btn btn-light">
                Projekt einstellen <span>→</span>
              </Link>
            </div>

            <div className="audience-card alt">
              <div className="audience-tag">Für größere Deals &amp; Firmen</div>
              <div className="pricing-amount">Individuell</div>
              <div className="pricing-sub">verhandelter Satz</div>
              <ul className="audience-list">
                {bespoke.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <Link to="/recht/impressum" className="btn btn-light">
                Gespräch anfragen <span>→</span>
              </Link>
            </div>
          </div>

          <p className="pricing-micro">
            Keine versteckten Kosten. Keine Bindung. Die Gebühr fällt ausschließlich bei einem erfolgreichen Abschluss an.
          </p>

          <div className="section-head" style={{ marginTop: 64, borderColor: 'var(--line)' }}>
            <div className="section-head-left">
              <div className="eyebrow">WANN FÄLLT DIE GEBÜHR AN?</div>
              <h2>
                Transparent, <em>Schritt für Schritt.</em>
              </h2>
            </div>
          </div>
          <div className="steps">
            {feeSteps.map((s) => (
              <div className="step" key={s.num}>
                <div className="step-num">{s.num}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="demo-cta" style={{ marginTop: 48 }}>
            <Link to="/sell" className="btn btn-primary">
              Projekt einstellen <span>→</span>
            </Link>
            <Link to="/faq" className="btn">
              Häufige Fragen
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
