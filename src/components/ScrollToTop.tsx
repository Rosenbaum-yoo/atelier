import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        // kleiner Tick, falls die Zielseite gerade erst gemountet wird
        const t = setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
        return () => clearTimeout(t)
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}
