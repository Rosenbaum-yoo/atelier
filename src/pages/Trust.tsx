import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { LEGAL_DOCS } from '../data/legalDocs'

export default function Trust() {
  return (
    <>
      <Nav />
      <main className="app-main">
        <div className="container">
          <div className="page-head">
            <div className="eyebrow">TRUST CENTER</div>
            <h1>Rechtliches & Vertrauen</h1>
            <p>
              Transparenz ist die Grundlage jeder Transaktion auf Atelier. Hier findest du
              alle rechtlichen Rahmenbedingungen — von der Anbieterkennzeichnung bis zum
              Widerrufsrecht.
            </p>
          </div>

          <div className="row-list legal-index">
            {LEGAL_DOCS.map((d) => (
              <Link key={d.slug} to={`/recht/${d.slug}`} className="row-card" style={{ textDecoration: 'none' }}>
                <div className="row-title">{d.title}</div>
                <div className="row-meta">{d.summary}</div>
                {d.draft && <span className="pill">Entwurf</span>}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
