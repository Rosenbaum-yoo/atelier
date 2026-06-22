import { Link } from 'react-router-dom'
import HashLink from './HashLink'

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
              <li><HashLink hash="marketplace">Alle Listings</HashLink></li>
              <li><HashLink hash="marketplace">SaaS</HashLink></li>
              <li><HashLink hash="marketplace">Mobile Apps</HashLink></li>
              <li><HashLink hash="marketplace">Dev-Tools</HashLink></li>
              <li><HashLink hash="marketplace">KI-Projekte</HashLink></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Verkaufen</h4>
            <ul>
              <li><Link to="/demo">So funktioniert's</Link></li>
              <li><Link to="/sell">Projekt einstellen</Link></li>
              <li><HashLink hash="sellers">Bewertung</HashLink></li>
              <li><Link to="/preise">Gebühren</Link></li>
              <li><Link to="/faq">Verkäufer-FAQ</Link></li>
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
          <div>© 2026 Atelier · Kuratierter Marktplatz für Software</div>
          <div style={{ fontFamily: "'Geist Mono', monospace" }}>Mit Sorgfalt gebaut — für das Handwerk dahinter.</div>
        </div>
      </div>
    </footer>
  )
}
