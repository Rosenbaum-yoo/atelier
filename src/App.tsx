import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ListingDetail from './pages/ListingDetail'
import Login from './pages/Login'
import Sell from './pages/Sell'
import Dashboard from './pages/Dashboard'
import Dealroom from './pages/Dealroom'
import StaffCenter from './pages/StaffCenter'
import Demo from './pages/Demo'
import Pricing from './pages/Pricing'
import Faq from './pages/Faq'
import Trust from './pages/Trust'
import LegalPage from './components/LegalPage'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/preise" element={<Pricing />} />
        <Route path="/faq" element={<Faq />} />
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
    </>
  )
}
