import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'

// Landing (Home) bleibt eager — erste SEO-/Erstkontakt-Route. Alles andere lazy
// → kleineres Initial-Bundle, schnellerer First Paint.
const ListingDetail = lazy(() => import('./pages/ListingDetail'))
const Login = lazy(() => import('./pages/Login'))
const Sell = lazy(() => import('./pages/Sell'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Dealroom = lazy(() => import('./pages/Dealroom'))
const StaffCenter = lazy(() => import('./pages/StaffCenter'))
const Demo = lazy(() => import('./pages/Demo'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Faq = lazy(() => import('./pages/Faq'))
const About = lazy(() => import('./pages/About'))
const Trust = lazy(() => import('./pages/Trust'))
const LegalPage = lazy(() => import('./components/LegalPage'))

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="auth-gate"><div className="spinner" /></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/preise" element={<Pricing />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/ueber-uns" element={<About />} />
          <Route path="/recht" element={<Trust />} />
          <Route path="/recht/:slug" element={<LegalPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <Sell />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dealroom"
            element={
              <ProtectedRoute>
                <Dealroom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute>
                <StaffCenter />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </>
  )
}
