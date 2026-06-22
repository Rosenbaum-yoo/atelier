import { Link } from 'react-router-dom'
import type { CSSProperties, ReactNode } from 'react'

/* SPA-taugliche Anker-Navigation: navigiert auf die Startseite + Hash, ohne
   Full-Reload. ScrollToTop scrollt anschließend smooth zum Ziel-Element. */
export default function HashLink({
  hash,
  className,
  children,
  onClick,
  style,
}: {
  hash: string
  className?: string
  children: ReactNode
  onClick?: () => void
  style?: CSSProperties
}) {
  return (
    <Link to={{ pathname: '/', hash }} className={className} style={style} onClick={onClick}>
      {children}
    </Link>
  )
}
