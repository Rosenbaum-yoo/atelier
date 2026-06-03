import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

export default function Nav() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()

  async function onSignOut() {
    await signOut()
    navigate('/')
  }

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
          {session ? (
            <>
              <Link to="/dashboard" className="btn">Dashboard</Link>
              <button type="button" className="btn" onClick={onSignOut}>Abmelden</button>
              <Link to="/sell" className="btn btn-primary">Projekt einstellen <span>↗</span></Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">Anmelden</Link>
              <Link to="/sell" className="btn btn-primary">Projekt einstellen <span>↗</span></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
