import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const principles = [
  {
    num: 'i.',
    title: 'Kuratiert, kein Flohmarkt',
    desc: 'Jedes Listing wird vor der Freigabe intern geprüft. Wir sitzen bewusst zwischen anonymen Kleinanzeigen und teurer M&A-Beratung.',
  },
  {
    num: 'ii.',
    title: 'Geld erst nach Übergabe',
    desc: 'Der Kaufpreis liegt in Treuhand. Ausgezahlt wird erst, wenn Code, Lizenzen und Accounts übergeben und bestätigt sind.',
  },
  {
    num: 'iii.',
    title: 'Ehrliche Rolle',
    desc: 'Wir vermitteln, wir beraten nicht zur Geldanlage. Keine garantierten Bewertungen, kein Crowdinvesting — nur ein sauberer, prüfbarer Übergabe-Ablauf.',
  },
  {
    num: 'iv.',
    title: 'Respekt fürs Handwerk',
    desc: 'Zwei-Wege-Bewertungen, verifizierte Identitäten, transparente Deal-Historie. Kein anonymes Drücken auf den Preis.',
  },
]

export default function About() {
  return (
    <>
      <Nav />
      <main className="app-main">
        <div className="container">
          <div className="page-head">
            <div className="eyebrow">WER WIR SIND</div>
            <h1>
              Wir behandeln Software wie das <em>Handwerk</em>, das sie ist.
            </h1>
            <p>
              Hinter jedem Repository stecken Nächte, Entscheidungen und Sorgfalt. Trotzdem endet gute Software zu oft
              in einem stillen Tab voller Schnäppchenjäger — oder gar nicht. Atelier ist als Gegenentwurf entstanden:
              eine kuratierte Börse, auf der fertige Software den Besitzer wechselt — geprüft, abgesichert und mit
              Respekt für die Arbeit dahinter.
            </p>
          </div>

          <div className="section-head" style={{ borderColor: 'var(--line)' }}>
            <div className="section-head-left">
              <div className="eyebrow">WOFÜR WIR STEHEN</div>
              <h2>
                Vier Prinzipien, <em>kompromisslos.</em>
              </h2>
            </div>
          </div>
          <div className="steps">
            {principles.map((p) => (
              <div className="step" key={p.num}>
                <div className="step-num">{p.num}</div>
                <h3 className="step-title">{p.title}</h3>
                <p className="step-desc">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="legal" style={{ marginTop: 56 }}>
            <div className="eyebrow">PILOTPHASE 2026</div>
            <h2>Wo wir gerade stehen</h2>
            <p>
              Atelier ist jung und ehrlich dabei. Wir starten mit einer kuratierten ersten Welle an Projekten und bauen
              die Plattform gemeinsam mit den ersten Verkäuferinnen, Verkäufern und Käufern aus. Wir erfinden keine
              Zahlen — was du hier siehst, ist echt im Aufbau.
            </p>
          </div>

          <div className="demo-cta" style={{ marginTop: 48 }}>
            <Link to="/login" className="btn btn-primary">
              Konto erstellen <span>→</span>
            </Link>
            <Link to="/demo" className="btn">
              Ablauf ansehen
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
