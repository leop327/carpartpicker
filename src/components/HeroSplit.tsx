import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { PLATFORM_BRANDS } from '../lib/brands'
import { buildFromDvla, formatPlate, type DvlaLookupResult } from '../lib/dvlaMatch'
import { writeDvlaSession } from '../lib/dvlaSession'
import { writeBuildToStorage } from '../lib/buildState'
import './HeroSplit.css'

type Panel = 'reg' | 'brand' | null

export function HeroSplit() {
  const navigate = useNavigate()
  const [vrm, setVrm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<Panel>(null)

  function sanitizeInput(value: string) {
    return value.toUpperCase().replace(/\s+/g, '').replace(/[^A-Z0-9]/g, '')
  }

  async function handleRegSearch(e: FormEvent) {
    e.preventDefault()
    const clean = sanitizeInput(vrm)
    if (!clean) {
      setError('Enter a UK registration.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/dvla?vrm=${encodeURIComponent(clean)}`)
      const data = (await res.json()) as DvlaLookupResult & { error?: string }

      if (!res.ok) {
        throw new Error(data.error || 'Vehicle not found')
      }

      const draft = buildFromDvla(data)
      writeBuildToStorage(draft)
      writeDvlaSession({
        ...data,
        matchedStage: draft.stage,
        matchedCarId: draft.selection.carId,
      })

      navigate('/builds')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lookup failed')
    } finally {
      setLoading(false)
    }
  }

  function pickBrand(slug: string) {
    navigate(`/cars/${slug}`)
  }

  const plateDisplay = vrm ? formatPlate(vrm) : ''

  return (
    <div
      className={`hero-split${expanded ? ` hero-split--${expanded}` : ''}`}
      onMouseLeave={() => setExpanded(null)}
    >
      <section
        className="hero-split__panel hero-split__panel--reg"
        onMouseEnter={() => setExpanded('reg')}
        aria-labelledby="hero-reg-title"
      >
        <p className="hero-split__kicker">DVLA lookup</p>
        <h2 id="hero-reg-title" className="hero-split__title">
          Instant Reg Lookup
        </h2>
        <p className="hero-split__copy">
          Auto-detect engine family, chassis candidates &amp; fitment from the
          UK Vehicle Enquiry Service.
        </p>

        <form className="hero-split__form" onSubmit={handleRegSearch}>
          <label className="hero-split__plate" htmlFor="hero-vrm">
            <span className="hero-split__gb" aria-hidden>
              <span className="hero-split__gb-stars">★★★</span>
              <span>GB</span>
            </span>
            <input
              id="hero-vrm"
              type="text"
              name="vrm"
              value={plateDisplay}
              onChange={(e) => setVrm(sanitizeInput(e.target.value))}
              placeholder="AB12 CDE"
              maxLength={9}
              autoComplete="off"
              spellCheck={false}
              inputMode="text"
              aria-label="UK registration"
            />
          </label>

          <button
            type="submit"
            className="hero-split__submit"
            disabled={loading}
          >
            {loading ? 'Querying DVLA Database…' : 'Find my car'}
          </button>

          {error ? (
            <p className="hero-split__error" role="alert">
              {error}
            </p>
          ) : (
            <p className="hero-split__hint">
              Try <strong>B58DEMO</strong>, <strong>N55DEMO</strong>, or{' '}
              <strong>S58DEMO</strong> without an API key — or any plate once{' '}
              <code>DVLA_API_KEY</code> is set.
            </p>
          )}
        </form>
      </section>

      <section
        className="hero-split__panel hero-split__panel--brand"
        onMouseEnter={() => setExpanded('brand')}
        aria-labelledby="hero-brand-title"
      >
        <p className="hero-split__kicker">Manual pick</p>
        <h2 id="hero-brand-title" className="hero-split__title">
          Or Select Your Platform
        </h2>
        <p className="hero-split__copy">
          Jump to the platform page — BMW opens the series / chassis wizard.
        </p>

        <div className="hero-split__brands">
          {PLATFORM_BRANDS.map((brand) => (
            <button
              key={brand.id}
              type="button"
              className={
                brand.accent
                  ? 'hero-split__brand hero-split__brand--accent'
                  : 'hero-split__brand'
              }
              onClick={() => pickBrand(brand.slug)}
            >
              <span className="hero-split__brand-name">{brand.name}</span>
              <span className="hero-split__brand-meta">
                {brand.available ? brand.platforms : `${brand.platforms} · soon`}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
