import { Link, useNavigate } from 'react-router-dom'
import {
  clearBuildStorage,
  emptySelection,
  writeBuildToStorage,
} from '../lib/buildState'
import { listSavedBuilds } from '../lib/savedBuilds'
import { useEffect, useMemo, useState } from 'react'
import './HomePage.css'

const HERO_CARS = [
  { src: '/cars/bmw-g82-m4.jpg', name: 'M4 Competition', gen: 'G82' },
  { src: '/cars/bmw-g87-m2.jpg', name: 'M2', gen: 'G87' },
  { src: '/cars/bmw-f90-m5.jpg', name: 'M5', gen: 'F90' },
  { src: '/cars/bmw-e46-m3.jpg', name: 'M3', gen: 'E46' },
  { src: '/cars/bmw-g80-m3.jpg', name: 'M3 Competition', gen: 'G80' },
] as const

export function HomePage() {
  const navigate = useNavigate()
  const savedCount = useMemo(() => listSavedBuilds().length, [])
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
          <span className="hud-label">Featured</span>
          <strong>
            {hero.gen} {hero.name}
          </strong>
        </p>
      </section>
    </div>
  )
}
