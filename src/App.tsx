import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { AboutPage } from './pages/AboutPage'
import { AccountPage } from './pages/AccountPage'
import { BuildsPage } from './pages/BuildsPage'
import { CommunityPage } from './pages/CommunityPage'
import { ComparePage } from './pages/ComparePage'
import { ContactPage } from './pages/ContactPage'
import { DevelopmentsPage } from './pages/DevelopmentsPage'
import { DonatePage } from './pages/DonatePage'
import { HomePage } from './pages/HomePage'
import { PublicProfilePage } from './pages/PublicProfilePage'
import { SavedBuildDetailPage } from './pages/SavedBuildDetailPage'
import { SavedBuildsPage } from './pages/SavedBuildsPage'
import { VendorDashboardPage } from './pages/VendorDashboardPage'
import { VendorDetailPage } from './pages/VendorDetailPage'
import { VendorsPage } from './pages/VendorsPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="builds" element={<BuildsPage />} />
          <Route path="saved" element={<SavedBuildsPage />} />
          <Route path="saved/:id" element={<SavedBuildDetailPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="u/:username" element={<PublicProfilePage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="vendors" element={<VendorsPage />} />
          <Route path="vendors/:slug" element={<VendorDetailPage />} />
          <Route path="vendor/dashboard" element={<VendorDashboardPage />} />
          <Route path="developments" element={<DevelopmentsPage />} />
          <Route path="donate" element={<DonatePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
