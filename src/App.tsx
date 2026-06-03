import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ListingDetail from './pages/ListingDetail'
import Login from './pages/Login'
import Sell from './pages/Sell'
import Dashboard from './pages/Dashboard'
import Dealroom from './pages/Dealroom'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
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
      </Routes>
    </>
  )
}
