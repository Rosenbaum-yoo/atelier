import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="auth-gate">
        <div className="spinner" aria-label="Wird geladen" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
