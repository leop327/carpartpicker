import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ProfileButton } from '../profile/ProfilePanel'
import { getTheme, toggleTheme, type Theme } from '../../lib/theme'
import './AppShell.css'
import '../profile/ProfilePanel.css'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/saved', label: 'Saved builds' },
  { to: '/community', label: 'Community' },
  { to: '/developments', label: 'Developments' },
  { to: '/donate', label: 'Donate' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

export function AppShell() {
  const [theme, setThemeState] = useState<Theme>(() => getTheme())
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  function handleThemeToggle() {
    setThemeState(toggleTheme())
  }

  return (
    <div className="shell">
      <header className="shell__header">
        <Link to="/" className="shell__brand">
          CarPartPicker
        </Link>
        <div className="shell__header-end">
          <nav className="shell__nav shell__nav--desktop" aria-label="Main">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={'end' in item ? item.end : false}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="shell__tools">
            <button
              type="button"
              className="shell__theme"
              onClick={handleThemeToggle}
              aria-label={
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
              }
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <ProfileButton />
            <button
              type="button"
              className="shell__menu-btn"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="visually-hidden">
                {menuOpen ? 'Close menu' : 'Open menu'}
              </span>
              <span className={menuOpen ? 'shell__burger shell__burger--open' : 'shell__burger'} aria-hidden>
                <i />
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={menuOpen ? 'shell__drawer is-open' : 'shell__drawer'}
        id="mobile-nav"
      >
        <button
          type="button"
          className="shell__drawer-backdrop"
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
        />
        <nav className="shell__drawer-panel" aria-label="Mobile">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={'end' in item ? item.end : false}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <main className="shell__main">
        <Outlet />
      </main>
    </div>
  )
}
