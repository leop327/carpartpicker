import { Link, useNavigate } from 'react-router-dom'
import { catalog } from '../data/catalog'
import {
  clearBuildStorage,
  emptySelection,
  writeBuildToStorage,
} from '../lib/buildState'
import {
  deleteSavedBuild,
  listSavedBuilds,
  selectionLabel,
} from '../lib/savedBuilds'
import { useMemo, useState } from 'react'
import './HomePage.css'

export function HomePage() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(() => listSavedBuilds())

  const savedRows = useMemo(() => saved, [saved])

  function startNewBuild() {
    clearBuildStorage()
    writeBuildToStorage({
      v: 2,
      stage: 'brand',
      selection: emptySelection(),
    })
    navigate('/builds?new=1')
  }

  function openSaved(id: string) {
    navigate(`/builds?saved=${id}`)
  }

  function removeSaved(id: string) {
    deleteSavedBuild(id)
    setSaved(listSavedBuilds())
  }

  return (
    <div className="start">
      <section className="start__hero">
        <p className="start__brand">CarPartPicker</p>
        <p className="start__tagline">Configure the car. Add the mods. See the numbers.</p>
        <button type="button" className="btn btn--primary btn--lg" onClick={startNewBuild}>
          Create new build
        </button>
      </section>

      <section className="start__saved" aria-labelledby="saved-heading">
        <div className="start__saved-head">
          <h2 id="saved-heading">Saved builds</h2>
          {savedRows.length === 0 && (
            <p className="start__muted">Nothing saved yet — create a build to see it here.</p>
          )}
        </div>

        {savedRows.length > 0 && (
          <ul className="start__list">
            {savedRows.map((item) => {
              const car = item.build.selection.carId
                ? catalog.getCarById(item.build.selection.carId)
                : undefined
              const colour = car?.colours.find(
                (c) => c.id === item.build.selection.colourId,
              )
              return (
                <li key={item.id} className="start__row">
                  <button
                    type="button"
                    className="start__row-main"
                    onClick={() => openSaved(item.id)}
                  >
                    <span className="start__row-title">{item.name}</span>
                    <span className="start__row-meta">
                      {selectionLabel(item.build.selection)}
                      {colour ? ` · ${colour.name}` : ''}
                      {item.build.selection.modIds.length
                        ? ` · ${item.build.selection.modIds.length} mods`
                        : ''}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="start__row-delete"
                    onClick={() => removeSaved(item.id)}
                  >
                    Delete
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <p className="start__footer-link">
        <Link to="/builds">Continue current draft</Link>
      </p>
    </div>
  )
}
