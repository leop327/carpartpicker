import { Link, useNavigate } from 'react-router-dom'
import {
  clearBuildStorage,
  emptySelection,
  writeBuildToStorage,
} from '../lib/buildState'
import { listSavedBuilds } from '../lib/savedBuilds'
import { listMilestones } from '../lib/milestones'
import { useMemo } from 'react'
import './HomePage.css'

export function HomePage() {
  const navigate = useNavigate()
  const saved = useMemo(() => listSavedBuilds(), [])
  const milestones = useMemo(() => listMilestones(), [])
  const beatTarget = saved[0]

  function startNewBuild() {
    clearBuildStorage()
    writeBuildToStorage({
      v: 2,
      stage: 'brand',
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
            {saved.length > 0 ? ` (${saved.length})` : ''}
          </Link>
          {beatTarget && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={startNewBuild}
            >
              Beat “{beatTarget.name}”?
            </button>
          )}
        </div>
      </section>

      <section className="start__milestones" aria-label="Milestones">
        <ul>
          {milestones.map((m) => (
            <li key={m.id} className={m.done ? 'is-done' : ''}>
              {m.label}
            </li>
          ))}
        </ul>
      </section>

      <p className="start__footer-link">
        <Link to="/builds">Continue current draft</Link>
      </p>
    </div>
  )
}
