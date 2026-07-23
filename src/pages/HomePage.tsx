import { Link, useNavigate } from 'react-router-dom'
import {
  clearBuildStorage,
  emptySelection,
  writeBuildToStorage,
} from '../lib/buildState'
import { getFeaturedBuilds } from '../lib/featuredBuilds'
import { formatMoney } from '../lib/build'
import { listSavedBuilds } from '../lib/savedBuilds'
import { useEffect, useMemo, useState } from 'react'
import './HomePage.css'

const HERO_CARS = [
  { src: '/cars/bmw-m2-f87.jpg', name: 'M2', gen: 'F87' },
  { src: '/cars/bmw-m3-f80.jpg', name: 'M3', gen: 'F80' },
  { src: '/cars/bmw-m4-f82.jpg', name: 'M4', gen: 'F82' },
  { src: '/cars/bmw-g87-m2.jpg', name: 'M2', gen: 'G87' },
  { src: '/cars/bmw-135i-e82.jpg', name: '135i', gen: 'E82' },
] as const

export function HomePage() {
  const navigate = useNavigate()
  const savedCount = useMemo(() => listSavedBuilds().length, [])
  const featured = useMemo(() => getFeaturedBuilds(6), [])
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_CARS.length)
    }, 5500)
    return () => window.clearInterval(id)
  }, [])

  function startNewBuild() {
    clearBuildStorage()
    writeBuildToStorage({
      v: 2,
      stage: 'series',
      selection: emptySelection(),
    })
    navigate('/builds?new=1')
  }

  const hero = HERO_CARS[heroIndex]

  return (
    <div className="garage-page">
      <div className="garage">
        <div className="garage__stage" aria-hidden>
          {HERO_CARS.map((car, i) => (
            <img
              key={car.src}
              className={
                i === heroIndex
                  ? 'garage__photo garage__photo--active'
                  : 'garage__photo'
              }
              src={car.src}
              alt=""
            />
          ))}
          <div className="garage__vignette" />
          <div className="garage__scan" />
        </div>

        <section className="garage__hero">
          <p className="garage__kicker hud-label">Enter the garage</p>
          <h1 className="garage__brand">CarPartPicker</h1>
          <p className="garage__tagline">
            Pick the chassis. Stack the mods. Watch the figures move.
          </p>
          <div className="garage__cta">
            <button
              type="button"
              className="btn btn--primary btn--lg"
              onClick={startNewBuild}
            >
              New build
            </button>
            <Link to="/saved" className="btn btn--ghost">
              My builds
              {savedCount > 0 ? ` · ${savedCount}` : ''}
            </Link>
          </div>
          <p className="garage__featured">
            <span className="hud-label">Now showing</span>
            <strong>
              {hero.gen} {hero.name}
            </strong>
          </p>
        </section>
      </div>

      {featured.length > 0 && (
        <section className="featured-strip" aria-labelledby="featured-heading">
          <div className="featured-strip__head">
            <h2 id="featured-heading">Featured builds</h2>
            <p>Community seeds from the N54 / N55 / B58 / S55 / S58 garage.</p>
            <Link to="/community" className="featured-strip__all">
              Browse community
            </Link>
          </div>
          <ul className="featured-strip__grid">
            {featured.map((build) => (
              <li key={build.id}>
                <Link
                  to={`/community?build=${encodeURIComponent(build.id)}`}
                  className="featured-card"
                >
                  <div className="featured-card__media">
                    {build.snapshot.image ? (
                      <img src={build.snapshot.image} alt="" />
                    ) : (
                      <div className="featured-card__placeholder" />
                    )}
                  </div>
                  <div className="featured-card__body">
                    <strong>{build.title}</strong>
                    <span className="featured-card__meta">
                      {build.authorName}
                      {build.snapshot.carLabel
                        ? ` · ${build.snapshot.carLabel}`
                        : ''}
                    </span>
                    <span className="featured-card__stats">
                      {build.snapshot.hp} hp ·{' '}
                      {formatMoney(build.snapshot.modsPrice)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
