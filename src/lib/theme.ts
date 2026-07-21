const THEME_KEY = 'carpartpicker:theme'

export type Theme = 'light' | 'dark'

export function getTheme(): Theme {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    if (raw === 'dark' || raw === 'light') return raw
  } catch {
    // ignore
  }
  // Garage default — Forza night look unless user prefers light
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark'
  }
  return 'dark'
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}

export function setTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // ignore
  }
  applyTheme(theme)
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === 'dark' ? 'light' : 'dark'
  setTheme(next)
  return next
}
