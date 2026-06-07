import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

type Stage = {
  pillLabel: string
  pillClass: string
  note: string
  showMoney?: boolean
  released?: boolean
}

type Step = {
  phase: string
  title: string
  body: string
  stage: Stage
}

const DEMO_STEPS: Step[] = [
  {
    phase: 'Schritt 1 · Verkäufer',
    title: 'Angebot erstellen',
    body: 'Der Verkäufer beschreibt sein Projekt — Kennzahlen, Tech-Stack und Verkaufsoption. Noch ist alles ein privater Entwurf, sichtbar nur für ihn.',
    stage: { pillLabel: 'Entwurf', pillClass: 'pill-draft', note: 'Sichtbar nur für den Verkäufer' },
  },
  {
    phase: 'Schritt 2 · Verkäufer',
    title: 'Veröffentlichen',
    body: 'Mit einem Klick geht das Listing live in den kuratierten Marktplatz. Interessierte Käufer können es jetzt entdecken.',
    stage: { pillLabel: 'Veröffentlicht', pillClass: 'pill-published', note: 'Live im Marktplatz' },
  },
  {
    phase: 'Schritt 3 · Käufer',
    title: 'Angebot erhalten',
    body: 'Ein interessierter Käufer macht ein verbindliches Angebot. Es landet direkt im Dealroom des Verkäufers.',
    stage: { pillLabel: 'Angebot offen', pillClass: 'pill-open', note: 'Käufer bietet €24.000' },
  },
  {
    phase: 'Schritt 4 · Verkäufer',
    title: 'Angebot annehmen',
    body: 'Der Verkäufer nimmt das Angebot im Dealroom an. Der Deal ist geschlossen — jetzt folgt die abgesicherte Abwicklung.',
    stage: { pillLabel: 'Angenommen', pillClass: 'pill-accepted', note: 'Deal geschlossen — bereit zur Zahlung' },
  },
  {
    phase: 'Schritt 5 · Treuhand',
    title: 'Sichere Zahlung im Treuhand',
    body: 'Der Käufer zahlt über Stripe. Das Geld wird treuhänderisch gehalten — der Verkäufer sieht die Zahlung, erhält sie aber erst nach der Übergabe.',
    stage: {
      pillLabel: 'Im Treuhand',
      pillClass: 'pill-open',
      note: 'Zahlung eingegangen — treuhänderisch gehalten',
      showMoney: true,
    },
  },
  {
    phase: 'Schritt 6 · Abschluss',
    title: 'Übergabe & Auszahlung',
    body: 'Sobald der Käufer den Erhalt bestätigt, gibt Atelier die Auszahlung frei. Der Verkäufer erhält seinen Anteil, die Plattform behält 6% Provision.',
    stage: {
      pillLabel: 'Ausgezahlt',
      pillClass: 'pill-accepted',
      note: 'Übergabe bestätigt — Verkäufer ausgezahlt',
      showMoney: true,
      released: true,
    },
  },
]

const ADVANCE_MS = 4200

export default function Demo() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setActive((i) => (i + 1) % DEMO_STEPS.length), ADVANCE_MS)
    return () => clearInterval(t)
  }, [playing])

  const step = DEMO_STEPS[active]

  function go(i: number) {
    setPlaying(false)
    setActive((i + DEMO_STEPS.length) % DEMO_STEPS.length)
  }

  return (
    <>
      <Nav />
      <main className="app-main">
        <div className="container">
          <div className="page-head">
            <div className="eyebrow">Geführter Durchlauf</div>
            <h1>So verkauft man auf <em>Atelier</em></h1>
            <p>
              Vom ersten Entwurf bis zur Auszahlung — ein Beispiel-Deal Schritt für Schritt.
              Alle Daten sind erfunden und dienen nur der Veranschaulichung.
            </p>
          </div>

          <div className="demo-grid">
            <div className="demo-narration">
              <div className="demo-step-no">{String(active + 1).padStart(2, '0')}</div>
              <div className="eyebrow">{step.phase}</div>
              <h2 className="demo-step-title">{step.title}</h2>
              <p className="demo-step-body">{step.body}</p>
            </div>

            <div className="demo-stage">
              <div className="demo-stage-tag">Beispiel</div>
              <div className="demo-stage-card">
                <div className="demo-stage-head">
                  <div className="row-main">
                    <div className="row-title">PixelCraft Studio</div>
                    <div className="row-meta">SaaS · Design-Tool · €24.000</div>
                  </div>
                  <span className={`pill ${step.stage.pillClass}`}>{step.stage.pillLabel}</span>
                </div>
                <div className="demo-stage-note">{step.stage.note}</div>
                {step.stage.showMoney && (
                  <div className="demo-money">
                    <div className="demo-money-row"><span>Käufer zahlt</span><span>€24.000</span></div>
                    <div className="demo-money-row"><span>Plattform-Provision · 6%</span><span>− €1.440</span></div>
                    <div className={`demo-money-row demo-money-total${step.stage.released ? ' is-paid' : ''}`}>
                      <span>{step.stage.released ? 'Ausgezahlt an Verkäufer' : 'Auszahlung an Verkäufer'}</span>
                      <span>€22.560</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="demo-controls">
            <div className="demo-dots">
              {DEMO_STEPS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`demo-dot${i === active ? ' is-active' : ''}`}
                  aria-label={`Schritt ${i + 1}`}
                  onClick={() => go(i)}
                />
              ))}
            </div>
            <div className="demo-buttons">
              <button type="button" className="btn btn-sm" onClick={() => go(active - 1)}>← Zurück</button>
              <button type="button" className="btn btn-sm btn-primary" onClick={() => setPlaying((p) => !p)}>
                {playing ? 'Pause' : 'Abspielen'}
              </button>
              <button type="button" className="btn btn-sm" onClick={() => go(active + 1)}>Weiter →</button>
            </div>
            <div className="demo-counter">{active + 1} / {DEMO_STEPS.length}</div>
          </div>

          <div className="demo-cta">
            <Link to="/sell" className="btn btn-primary">Eigenes Projekt einstellen <span>↗</span></Link>
            <Link to="/" className="btn">Zum Marktplatz</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
