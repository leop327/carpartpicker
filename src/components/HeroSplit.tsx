import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { BMW_SERIES_QUICK } from '../lib/brands'
import {
  buildFromDvla,
  formatPlate,
  type DvlaLookupResult,
} from '../lib/dvlaMatch'
import { writeDvlaSession } from '../lib/dvlaSession'
import {
  clearBuildStorage,
  emptySelection,
  writeBuildToStorage,
} from '../lib/buildState'
import './HeroSplit.css'

type Panel = 'reg' | 'series' | null

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

      if (data.make && !/bmw/i.test(data.make)) {
        throw new Error(
          `${data.make} isn’t supported yet — CarPartPicker is BMW-only for launch.`,
        )
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

  function startSeries(series: string) {
    clearBuildStorage()
    writeBuildToStorage({
      v: 2,
      stage: 'chassis',
      selection: {
        ...emptySelection(),
        make: 'BMW',
        series,
      },
    })
    navigate('/builds')
  }

  function startBmwBrowse() {
    clearBuildStorage()
    writeBuildToStorage({
      v: 2,
      stage: 'series',
      selection: {
        ...emptySelection(),
        make: 'BMW',
      },
    })
    navigate('/builds')
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
          Auto-detect BMW engine family and jump into the builder via the UK
          Vehicle Enquiry Service.
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
            {loading ? 'Querying DVLA Database…' : 'Find my BMW'}
          </button>

          {error ? (
            <p className="hero-split__error" role="alert">
              {error}
            </p>
          ) : (
            <p className="hero-split__hint">
              Try <strong>B58DEMO</strong>, <strong>N55DEMO</strong>, or{' '}
              <strong>S58DEMO</strong> — BMW only for launch.
            </p>
          )}
        </form>
      </section>

      <section
        className="hero-split__panel hero-split__panel--brand"
        onMouseEnter={() => setExpanded('series')}
        aria-labelledby="hero-series-title"
      >
        <p className="hero-split__kicker">BMW platforms</p>
        <h2 id="hero-series-title" className="hero-split__title">
          Pick Your Series
        </h2>
        <p className="hero-split__copy">
          1–4 Series · N54 / N55 / B58 / S55 / S58 — jump straight to chassis
          selection.
        </p>

        <div className="hero-split__brands">
          {BMW_SERIES_QUICK.map((item) => (
            <button
              key={item.id}
              type="button"
              className="hero-split__brand"
              onClick={() => startSeries(item.series)}
            >
              <span className="hero-split__brand-name">{item.series}</span>
              <span className="hero-split__brand-meta">{item.hint}</span>
            </button>
          ))}
          <button
            type="button"
            className="hero-split__brand hero-split__brand--accent"
            onClick={startBmwBrowse}
          >
            <span className="hero-split__brand-name">Browse all BMW</span>
            <span className="hero-split__brand-meta">
              Full series picker · N54 · N55 · B58 · S55 · S58
            </span>
          </button>
        </div>
      </section>
    </div>
  )
}
