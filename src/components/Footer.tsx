import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="logo-mark"></span>Atelier
            </Link>
            <p className="footer-tag">Wo Software den Besitzer wechselt — kuratiert, abgesichert, mit Respekt.</p>
          </div>
          <div className="footer-col">
            <h4>Marktplatz</h4>
            <ul>
              <li><a href="/#marketplace">Alle Listings</a></li>
              <li><a href="/#marketplace">SaaS</a></li>
              <li><a href="/#marketplace">Mobile Apps</a></li>
              <li><a href="/#marketplace">Dev-Tools</a></li>
              <li><a href="/#marketplace">KI-Projekte</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Verkaufen</h4>
            <ul>
              <li><Link to="/demo">So funktioniert's</Link></li>
              <li><a href="/#sellers">Projekt einstellen</a></li>
              <li><a href="/#sellers">Bewertung</a></li>
              <li><a href="/#trust">Gebühren</a></li>
              <li><a href="/#how">Verkäufer-FAQ</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Rechtliches</h4>
            <ul>
              <li><Link to="/recht/agb">AGB</Link></li>
              <li><Link to="/recht/datenschutz">Datenschutz</Link></li>
              <li><Link to="/recht/widerruf">Widerruf</Link></li>
              <li><Link to="/recht/impressum">Impressum</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Über uns</h4>
            <ul>
              <li><Link to="/recht">Trust Center</Link></li>
              <li><Link to="/recht/impressum">Kontakt</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 Atelier · Düsseldorf, Berlin, Lissabon</div>
          <div style={{ fontFamily: "'Geist Mono', monospace" }}>v1.2.0 · Made with care for the craft</div>
        </div>
      </div>
    </footer>
  )
}
