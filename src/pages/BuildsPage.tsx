import { useMemo, useState } from 'react'
import { catalog } from '../data/catalog'
import {
  computeBuildFigures,
  formatMoney,
  getDefaultSpecChoice,
} from '../lib/build'
import type { BuildSelection } from '../types/catalog'
import { CarPreview } from '../components/builds/CarPreview'
import { CarSelector } from '../components/builds/CarSelector'
import { FiguresGrid } from '../components/builds/FiguresGrid'
import { ModsPanel } from '../components/builds/ModsPanel'
import { SpecOptions } from '../components/builds/SpecOptions'
import { StatsSidebar } from '../components/builds/StatsSidebar'
import './BuildsPage.css'

type Stage = 'select' | 'configure' | 'mods'

export function BuildsPage() {
  const [stage, setStage] = useState<Stage>('select')
  const [selection, setSelection] = useState<BuildSelection | null>(null)

  const car = selection ? catalog.getCarById(selection.carId) : undefined

  const colour = useMemo(() => {
    if (!car || !selection) return undefined
    return car.colours.find((c) => c.id === selection.colourId) ?? car.colours[0]
  }, [car, selection])

  const figures = useMemo(() => {
    if (!car || !selection) return null
    return computeBuildFigures(car, selection.specChoices, selection.modIds)
  }, [car, selection])

  function pickCar(carId: string) {
    const next = catalog.getCarById(carId)
    if (!next) return
    const defaults: Record<string, string> = {}
    for (const group of next.specOptions) {
      defaults[group.id] = getDefaultSpecChoice(group).id
    }
    setSelection({
      carId,
      year: next.years[next.years.length - 1],
      colourId: next.colours[0].id,
      specChoices: defaults,
      modIds: [],
    })
    setStage('configure')
  }

  function updateSelection(patch: Partial<BuildSelection>) {
    setSelection((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  function toggleMod(modId: string) {
    setSelection((prev) => {
      if (!prev) return prev
      const mod = catalog.getModById(modId)
      if (!mod) return prev

      const already = prev.modIds.includes(modId)
      if (already) {
        return { ...prev, modIds: prev.modIds.filter((id) => id !== modId) }
      }

      const conflicts = new Set(mod.conflictsWith ?? [])
      const withoutConflicts = prev.modIds.filter((id) => {
        const other = catalog.getModById(id)
        if (!other) return true
        if (conflicts.has(id)) return false
        if (other.conflictsWith?.includes(modId)) return false
        return true
      })

      return { ...prev, modIds: [...withoutConflicts, modId] }
    })
  }

  function resetBuild() {
    setSelection(null)
    setStage('select')
  }

  return (
    <div className="builds">
      <header className="builds__header">
        <div>
          <p className="builds__eyebrow">Builds</p>
          <h1>Configure your car</h1>
        </div>
        {selection && (
          <button type="button" className="btn btn--ghost" onClick={resetBuild}>
            Start over
          </button>
        )}
      </header>

      {stage === 'select' && (
        <section aria-labelledby="pick-car">
          <h2 id="pick-car" className="builds__section-title">
            Choose a car
          </h2>
          <CarSelector cars={catalog.cars} onSelect={pickCar} />
        </section>
      )}

      {car && selection && colour && figures && stage === 'configure' && (
        <section className="builds__configure" aria-labelledby="configure-car">
          <h2 id="configure-car" className="visually-hidden">
            Configure {car.make} {car.model}
          </h2>

          <div className="builds__config-grid">
            <CarPreview car={car} colour={colour} year={selection.year} />

            <div className="builds__config-controls">
              <label className="field">
                <span>Year</span>
                <select
                  value={selection.year}
                  onChange={(e) =>
                    updateSelection({ year: Number(e.target.value) })
                  }
                >
                  {[...car.years].reverse().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>

              <fieldset className="colour-field">
                <legend>Colour</legend>
                <div className="colour-field__swatches" role="list">
                  {car.colours.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      role="listitem"
                      className={
                        c.id === selection.colourId
                          ? 'swatch swatch--active'
                          : 'swatch'
                      }
                      style={{ background: c.hex }}
                      title={c.name}
                      aria-label={c.name}
                      aria-pressed={c.id === selection.colourId}
                      onClick={() => updateSelection({ colourId: c.id })}
                    />
                  ))}
                </div>
                <p className="colour-field__name">{colour.name}</p>
              </fieldset>

              <FiguresGrid
                title="Factory figures"
                figures={figures.configured}
                compareTo={figures.base}
              />

              <p className="builds__base-price">
                {formatMoney(figures.configuredPrice)}
                <span> base car + options</span>
              </p>
            </div>
          </div>

          <SpecOptions
            groups={car.specOptions}
            selected={selection.specChoices}
            onChange={(groupId, choiceId) =>
              updateSelection({
                specChoices: { ...selection.specChoices, [groupId]: choiceId },
              })
            }
          />

          <div className="builds__continue">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setStage('mods')}
            >
              Continue to mods
            </button>
          </div>
        </section>
      )}

      {car && selection && colour && figures && stage === 'mods' && (
        <section className="builds__mods-stage" aria-labelledby="mods-heading">
          <button
            type="button"
            className="builds__compact"
            onClick={() => setStage('configure')}
          >
            <CarPreview
              car={car}
              colour={colour}
              year={selection.year}
              compact
            />
            <div className="builds__compact-meta">
              <strong>
                {selection.year} {car.make} {car.model}
              </strong>
              <span>{colour.name}</span>
              <span className="builds__compact-hint">Edit car & options</span>
            </div>
          </button>

          <h2 id="mods-heading" className="builds__section-title">
            Mods
          </h2>

          <div className="builds__mods-layout">
            <ModsPanel
              car={car}
              selectedModIds={selection.modIds}
              onToggle={toggleMod}
            />
            <StatsSidebar
              car={car}
              colourName={colour.name}
              year={selection.year}
              configured={figures.configured}
              final={figures.final}
              totalPrice={figures.totalPrice}
              modIds={selection.modIds}
            />
          </div>
        </section>
      )}
    </div>
  )
}
