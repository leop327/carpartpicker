import { Link, NavLink, Outlet } from 'react-router-dom'
import './AppShell.css'

export function AppShell() {
  return (
    <div className="shell">
      <header className="shell__header">
        <Link to="/" className="shell__brand">
          CarPartPicker
        </Link>
        <nav className="shell__nav" aria-label="Main">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/builds">Build</NavLink>
        </nav>
      </header>
      <main className="shell__main">
        <Outlet />
      </main>
    </div>
  )
}
