import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { BuildsPage } from './pages/BuildsPage'
import { HomePage } from './pages/HomePage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="builds" element={<BuildsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
