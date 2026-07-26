import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  clearBuildStorage,
  emptySelection,
  writeBuildToStorage,
} from '../lib/buildState'
import { BMW_SERIES_QUICK, getBrandBySlug } from '../lib/brands'
import './BrandPlatformPage.css'

export function BrandPlatformPage() {
  const { brand: brandSlug = '' } = useParams()
  const navigate = useNavigate()
  const brand = getBrandBySlug(brandSlug)

  if (!brand) {
    return <Navigate to="/cars/bmw" replace />
  }

  function startBmw() {
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

  return (
    <article className="brand-platform">
      <p className="brand-platform__eyebrow">
        <Link to="/">Garage</Link>
        {' · '}
        BMW
      </p>
      <h1>{brand.name}</h1>
      <p className="brand-platform__lead">{brand.blurb}</p>
      <p className="brand-platform__meta">{brand.platforms}</p>

      <div className="brand-platform__actions">
        <button type="button" className="btn btn--primary btn--lg" onClick={startBmw}>
          Open BMW builder
        </button>
        <Link to="/" className="btn btn--ghost">
          Back to reg lookup
        </Link>
      </div>

      <section className="brand-platform__grid" aria-label="BMW series">
        {BMW_SERIES_QUICK.map((item) => (
          <button
            key={item.id}
            type="button"
            className="brand-platform__chip"
            onClick={() => startSeries(item.series)}
          >
            <strong>{item.series}</strong>
            <span>{item.hint}</span>
          </button>
        ))}
      </section>
    </article>
  )
}
