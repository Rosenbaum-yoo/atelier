import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ListingDetail from './pages/ListingDetail'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
      </Routes>
    </>
  )
}
