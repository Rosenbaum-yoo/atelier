import { Link, useParams } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import { getLegalDoc } from '../data/legalDocs'

export default function LegalPage() {
  const { slug } = useParams()
  const doc = slug ? getLegalDoc(slug) : undefined

  if (!doc) {
    return (
      <>
        <Nav />
        <main className="app-main">
          <div className="container">
            <div className="page-head">
              <div className="eyebrow">RECHTLICHES</div>
              <h1>Dokument nicht gefunden</h1>
            </div>
            <p className="empty-block">Dieses Rechtsdokument existiert nicht.</p>
            <Link to="/recht" className="text-link">← Zurück zum Trust Center</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="app-main">
        <div className="container">
          <div className="page-head">
            <div className="eyebrow">{doc.eyebrow}</div>
            <h1>{doc.title}</h1>
            <div className="legal-updated">{doc.updated}</div>
          </div>

          {doc.draft && (
            <div className="alert alert-warn">
              Entwurf — noch nicht anwaltlich geprüft. Inhalte in [Klammern] werden vor
              dem Go-Live durch die echten Angaben ersetzt und rechtlich freigegeben.
            </div>
          )}

          <article className="legal">
            <p>{doc.intro}</p>
            {doc.sections.map((s, i) => (
              <section key={i}>
                <h2>{s.heading}</h2>
                {s.paras?.map((p, j) => <p key={j}>{p}</p>)}
                {s.bullets && (
                  <ul>{s.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
                )}
              </section>
            ))}
          </article>

          <div className="legal-index">
            <Link to="/recht" className="text-link">← Alle Rechtsdokumente</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
