import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { AboutPage } from './pages/AboutPage'
import { BuildsPage } from './pages/BuildsPage'
import { CommunityPage } from './pages/CommunityPage'
import { ComparePage } from './pages/ComparePage'
import { ContactPage } from './pages/ContactPage'
import { DevelopmentsPage } from './pages/DevelopmentsPage'
import { DonatePage } from './pages/DonatePage'
import { HomePage } from './pages/HomePage'
import { SavedBuildDetailPage } from './pages/SavedBuildDetailPage'
import { SavedBuildsPage } from './pages/SavedBuildsPage'
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
          <Route path="developments" element={<DevelopmentsPage />} />
          <Route path="donate" element={<DonatePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
