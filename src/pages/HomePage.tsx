import { Link, useNavigate } from 'react-router-dom'
import {
  clearBuildStorage,
  emptySelection,
  writeBuildToStorage,
} from '../lib/buildState'
import { listSavedBuilds } from '../lib/savedBuilds'
import { useMemo } from 'react'
import './HomePage.css'

export function HomePage() {
  const navigate = useNavigate()
  const savedCount = useMemo(() => listSavedBuilds().length, [])

  function startNewBuild() {
    clearBuildStorage()
    writeBuildToStorage({
      v: 2,
      stage: 'series',
      selection: emptySelection(),
    })
    navigate('/builds?new=1')
  }

  return (
    <div className="start">
      <section className="start__hero">
        <p className="start__brand">CarPartPicker</p>
        <p className="start__tagline">
          Configure the car. Add the mods. See the numbers.
        </p>
        <button
          type="button"
          className="btn btn--primary btn--lg"
          onClick={startNewBuild}
        >
          Create new build
        </button>
        <div className="start__hero-links">
          <Link to="/saved" className="btn btn--ghost">
            Saved builds
            {savedCount > 0 ? ` (${savedCount})` : ''}
          </Link>
        </div>
      </section>
    </div>
  )
}
