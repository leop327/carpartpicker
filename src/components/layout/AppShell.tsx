import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ProfileButton } from '../profile/ProfilePanel'
import { getTheme, toggleTheme, type Theme } from '../../lib/theme'
import './AppShell.css'
import '../profile/ProfilePanel.css'

const PRIMARY_NAV = [
  { to: '/', label: 'Garage', end: true },
  { to: '/saved', label: 'My builds' },
  { to: '/community', label: 'Community' },
  { to: '/vendors', label: 'Vendors' },
] as const

const MORE_NAV = [
  { to: '/account', label: 'Account' },
  { to: '/developments', label: 'Developments' },
  { to: '/donate', label: 'Donate' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

export function AppShell() {
  const [theme, setThemeState] = useState<Theme>(() => getTheme())
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isGarage = location.pathname === '/'
  const isBuilds = location.pathname.startsWith('/builds')

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

  const shellClass = [
    'shell',
    isGarage ? 'shell--garage' : '',
    isBuilds ? 'shell--builds' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={shellClass}>
      <header className="shell__header">
        <Link to="/" className="shell__brand">
          <span className="shell__brand-mark">CPP</span>
          <span className="shell__brand-name">CarPartPicker</span>
        </Link>
        <div className="shell__header-end">
          <nav className="shell__nav shell__nav--desktop" aria-label="Main">
            {PRIMARY_NAV.map((item) => (
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
              {theme === 'dark' ? 'Day' : 'Night'}
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
              <span
                className={menuOpen ? 'shell__burger shell__burger--open' : 'shell__burger'}
                aria-hidden
              >
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
          {[...PRIMARY_NAV, ...MORE_NAV].map((item) => (
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

      <footer className="shell__footer">
        <nav className="shell__footer-nav" aria-label="More">
          {MORE_NAV.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  )
}
