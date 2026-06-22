import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { faqGroups } from '../data/faq'

export default function Faq() {
  return (
    <>
      <Nav />
      <main className="app-main">
        <div className="container">
          <div className="page-head">
            <div className="eyebrow">HÄUFIGE FRAGEN</div>
            <h1>
              Alles, was du vor dem ersten <em>Deal</em> wissen musst.
            </h1>
            <p>
              Software zu kaufen oder zu verkaufen ist Vertrauenssache. Hier beantworten wir die Fragen, die am
              häufigsten kommen — offen und ohne Kleingedrucktes.
            </p>
          </div>

          {faqGroups.map((g) => (
            <section className="dash-section" key={g.group}>
              <div className="dash-section-head">
                <h2>{g.group}</h2>
              </div>
              <div className="faq-list">
                {g.items.map((it) => (
                  <details className="faq-item" key={it.q} open={it.open}>
                    <summary>{it.q}</summary>
                    <div className="faq-a">{it.a}</div>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <div className="demo-cta" style={{ marginTop: 56 }}>
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
