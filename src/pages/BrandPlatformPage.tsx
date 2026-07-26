import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  clearBuildStorage,
  emptySelection,
  writeBuildToStorage,
} from '../lib/buildState'
import { getBrandBySlug, PLATFORM_BRANDS } from '../lib/brands'
import './BrandPlatformPage.css'

export function BrandPlatformPage() {
  const { brand: brandSlug = '' } = useParams()
  const navigate = useNavigate()
  const brand = getBrandBySlug(brandSlug)

  if (!brand) {
    return <Navigate to="/" replace />
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

  return (
    <article className="brand-platform">
      <p className="brand-platform__eyebrow">
        <Link to="/">Garage</Link>
        {' · '}
        Platforms
      </p>
      <h1>{brand.name}</h1>
      <p className="brand-platform__lead">{brand.blurb}</p>
      <p className="brand-platform__meta">{brand.platforms}</p>

      {brand.available ? (
        <div className="brand-platform__actions">
          <button type="button" className="btn btn--primary btn--lg" onClick={startBmw}>
            Open {brand.name} builder
          </button>
          <Link to="/" className="btn btn--ghost">
            Back to reg lookup
          </Link>
        </div>
      ) : (
        <div className="brand-platform__actions">
          <Link to="/developments" className="btn btn--primary">
            See roadmap
          </Link>
          <button type="button" className="btn btn--ghost" onClick={startBmw}>
            Build a BMW instead
          </button>
        </div>
      )}

      <section className="brand-platform__grid" aria-label="All platforms">
        {PLATFORM_BRANDS.map((item) => (
          <Link
            key={item.id}
            to={`/cars/${item.slug}`}
            className={
              item.id === brand.id
                ? 'brand-platform__chip brand-platform__chip--active'
                : 'brand-platform__chip'
            }
          >
            <strong>{item.name}</strong>
            <span>{item.available ? item.platforms : `${item.platforms} · soon`}</span>
          </Link>
        ))}
      </section>
    </article>
  )
}
