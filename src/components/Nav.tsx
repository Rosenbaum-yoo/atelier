import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <nav>
      <div className="container nav-inner">
        <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="logo-mark"></span>
          Atelier
        </Link>
        <ul className="nav-links">
          <li><a href="/#marketplace">Marktplatz</a></li>
          <li><a href="/#how">Ablauf</a></li>
          <li><a href="/#sellers">Verkaufen</a></li>
          <li><a href="/#trust">Treuhand</a></li>
          <li><a href="/#about">Über uns</a></li>
        </ul>
        <div className="nav-cta">
          <a href="#" className="btn">Anmelden</a>
          <a href="/#sellers" className="btn btn-primary">Projekt einstellen <span>↗</span></a>
        </div>
      </div>
    </nav>
  )
}
