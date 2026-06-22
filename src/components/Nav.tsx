import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HashLink from './HashLink'
import { useAuth } from '../state/AuthContext'

const NAV_ITEMS: { label: string; hash?: string; to?: string }[] = [
  { label: 'Marktplatz', hash: 'marketplace' },
  { label: 'Ablauf', hash: 'how' },
  { label: 'Preise', to: '/preise' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Treuhand', hash: 'trust' },
]

export default function Nav() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  async function onSignOut() {
    close()
    await signOut()
    navigate('/')
  }

  const authActions = (onClick?: () => void) =>
    session ? (
      <>
        <Link to="/dashboard" className="btn" onClick={onClick}>Dashboard</Link>
        <button type="button" className="btn" onClick={onSignOut}>Abmelden</button>
        <Link to="/sell" className="btn btn-primary" onClick={onClick}>Projekt einstellen <span>↗</span></Link>
      </>
    ) : (
      <>
        <Link to="/login" className="btn" onClick={onClick}>Anmelden</Link>
        <Link to="/sell" className="btn btn-primary" onClick={onClick}>Projekt einstellen <span>↗</span></Link>
      </>
    )

  return (
    <nav>
      <div className="container nav-inner">
        <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }} onClick={close}>
          <span className="logo-mark"></span>
          Atelier
        </Link>
        <ul className="nav-links">
          {NAV_ITEMS.map((i) => (
            <li key={i.label}>
              {i.to ? <Link to={i.to}>{i.label}</Link> : <HashLink hash={i.hash!}>{i.label}</HashLink>}
            </li>
          ))}
        </ul>
        <div className="nav-cta">{authActions()}</div>
        <button
          type="button"
          className="nav-toggle"
          aria-label="Menü"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
      {open && (
        <div className="container nav-mobile">
          {NAV_ITEMS.map((i) =>
            i.to ? (
              <Link key={i.label} to={i.to} onClick={close}>{i.label}</Link>
            ) : (
              <HashLink key={i.label} hash={i.hash!} onClick={close}>{i.label}</HashLink>
            )
          )}
          <div className="nav-mobile-cta">{authActions(close)}</div>
        </div>
      )}
    </nav>
  )
}
