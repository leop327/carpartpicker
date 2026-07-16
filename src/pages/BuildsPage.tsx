import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { catalog } from '../data/catalog'
import { formatMoney } from '../lib/build'
import {
  clearBuildStorage,
  emptySelection,
  hydrateBuildFromLocation,
  syncBuildToUrl,
  writeBuildToStorage,
  type BuildStage,
  type PersistedBuild,
} from '../lib/buildState'
import { getSavedBuild, saveBuild } from '../lib/savedBuilds'
import { figuresFromSelection, initSpecChoicesForCar } from '../lib/selection'
import type { BuildSelection } from '../types/catalog'
import { CarPreview } from '../components/builds/CarPreview'
import { ColourSwatches } from '../components/builds/ColourSwatches'
import { FiguresGrid } from '../components/builds/FiguresGrid'
import { ModsPanel } from '../components/builds/ModsPanel'
import { SpecOptions } from '../components/builds/SpecOptions'
import { StatsSidebar } from '../components/builds/StatsSidebar'
import { StepIndicator } from '../components/builds/StepIndicator'
import './BuildsPage.css'

function bootState(
  search: string,
  isNew: boolean,
  savedId: string | null,
): PersistedBuild {
  if (isNew) {
    return { v: 2, stage: 'brand', selection: emptySelection() }
  }
  if (savedId) {
    const saved = getSavedBuild(savedId)
    if (saved) return saved.build
  }
  return (
    hydrateBuildFromLocation(search) ?? {
      v: 2,
      stage: 'brand',
      selection: emptySelection(),
    }
  )
}

export function BuildsPage() {
  const [params, setParams] = useSearchParams()
  const isNew = params.get('new') === '1'
  const savedIdParam = params.get('saved')

  const initial = useMemo(
    () => bootState(window.location.search, isNew, savedIdParam),
    // intentional first-load only
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const [stage, setStage] = useState<BuildStage>(initial.stage)
  const [selection, setSelection] = useState<BuildSelection>(initial.selection)
  const [activeSavedId, setActiveSavedId] = useState<string | null>(savedIdParam)
  const [saveNote, setSaveNote] = useState<string | null>(null)

  useEffect(() => {
    if (isNew || savedIdParam) {
      const next = new URLSearchParams(params)
      next.delete('new')
      next.delete('saved')
      setParams(next, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const build: PersistedBuild = { v: 2, stage, selection }
    writeBuildToStorage(build)
    syncBuildToUrl(build)
  }, [stage, selection])

  const car = selection.carId
    ? catalog.getCarById(selection.carId)
    : undefined
  const colour =
    car && selection.colourId
      ? car.colours.find((c) => c.id === selection.colourId)
      : undefined
  const figures = useMemo(() => figuresFromSelection(selection), [selection])

  const unlocked: BuildStage[] = useMemo(() => {
    const list: BuildStage[] = ['brand']
    if (selection.make) list.push('model')
    if (selection.carId) list.push('year')
    if (selection.carId && selection.year != null) list.push('colour')
    if (selection.carId && selection.year != null && selection.colourId) {
      list.push('options', 'mods')
    }
    return list
  }, [selection])

  function patchSelection(patch: Partial<BuildSelection>) {
    setSelection((prev) => ({ ...prev, ...patch }))
  }

  function pickBrand(make: string) {
    setSelection({
      ...emptySelection(),
      make,
    })
    setStage('model')
  }

  function pickModel(carId: string) {
    const next = catalog.getCarById(carId)
    if (!next) return
    setSelection({
      make: next.make,
      carId,
      year: null,
      colourId: null,
      specChoices: initSpecChoicesForCar(carId),
      modIds: [],
    })
    setStage('year')
  }

  function pickYear(year: number) {
    patchSelection({ year, colourId: null })
    setStage('colour')
  }

  function pickColour(colourId: string) {
    patchSelection({ colourId })
    setStage('options')
  }

  function toggleMod(modId: string) {
    setSelection((prev) => {
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

  function handleStepClick(next: BuildStage) {
    if (!unlocked.includes(next)) return
    setStage(next)
  }

  function resetDraft() {
    clearBuildStorage()
    setSelection(emptySelection())
    setStage('brand')
    setActiveSavedId(null)
    setSaveNote(null)
  }

  function handleSave() {
    if (!selection.carId || selection.year == null || !selection.colourId) {
      setSaveNote('Finish brand, model, year, and colour before saving.')
      return
    }
    const entry = saveBuild(
      { v: 2, stage, selection },
      { id: activeSavedId ?? undefined },
    )
    setActiveSavedId(entry.id)
    setSaveNote(`Saved “${entry.name}”`)
    window.setTimeout(() => setSaveNote(null), 2000)
  }

  const models = selection.make ? catalog.getCarsByMake(selection.make) : []

  return (
    <div className="builds">
      <header className="builds__header">
        <div>
          <p className="builds__eyebrow">
            <Link to="/">Home</Link>
          </p>
          <h1>New build</h1>
        </div>
        <div className="builds__header-actions">
          <button type="button" className="btn btn--ghost btn--small" onClick={handleSave}>
            Save build
          </button>
          <button type="button" className="btn btn--ghost btn--small" onClick={resetDraft}>
            Reset
          </button>
        </div>
      </header>

      {saveNote && (
        <p className="builds__notice" role="status">
          {saveNote}
        </p>
      )}

      <StepIndicator
        stage={stage}
        onStepClick={handleStepClick}
        unlocked={unlocked}
      />

      {stage === 'brand' && (
        <section className="wizard" aria-labelledby="brand-title">
          <h2 id="brand-title" className="wizard__title">
            Choose a brand
          </h2>
          <div className="choice-grid">
            {catalog.getMakes().map((make) => (
              <button
                key={make}
                type="button"
                className="choice-card"
                onClick={() => pickBrand(make)}
              >
                <span className="choice-card__title">{make}</span>
                <span className="choice-card__meta">
                  {catalog.getCarsByMake(make).length} models
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {stage === 'model' && selection.make && (
        <section className="wizard" aria-labelledby="model-title">
          <h2 id="model-title" className="wizard__title">
            {selection.make} — choose a model
          </h2>
          <div className="choice-grid">
            {models.map((item) => (
              <button
                key={item.id}
                type="button"
                className="choice-card choice-card--photo"
                onClick={() => pickModel(item.id)}
              >
                <img
                  className="choice-card__photo"
                  src={item.image}
                  alt=""
                  loading="lazy"
                />
                <span className="choice-card__kicker">{item.generation}</span>
                <span className="choice-card__title">{item.label}</span>
                <span className="choice-card__meta">
                  {item.baseFigures.hp} hp · {item.baseFigures.engineCode} ·{' '}
                  {item.baseFigures.drivetrain}
                </span>
                <span className="choice-card__desc">{item.description}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {stage === 'year' && car && (
        <section className="wizard" aria-labelledby="year-title">
          <h2 id="year-title" className="wizard__title">
            {car.label} — choose a year
          </h2>
          <div className="choice-grid choice-grid--years">
            {[...car.years].reverse().map((year) => (
              <button
                key={year}
                type="button"
                className="choice-card choice-card--compact"
                onClick={() => pickYear(year)}
              >
                <span className="choice-card__title">{year}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {stage === 'colour' && car && selection.year != null && (
        <section className="wizard" aria-labelledby="colour-title">
          <h2 id="colour-title" className="wizard__title">
            {selection.year} {car.label} — colour
          </h2>
          <div className="builds__config-grid">
            <CarPreview
              car={car}
              colour={colour ?? car.colours[0]}
              year={selection.year}
            />
            <div className="colour-stage">
              <ColourSwatches
                colours={car.colours}
                selectedId={selection.colourId}
                onSelect={pickColour}
              />
              <FiguresGrid title="Factory figures" figures={car.baseFigures} />
              <p className="builds__base-price">
                From {formatMoney(car.basePrice)}
                <span> MSRP when new (approx.)</span>
              </p>
            </div>
          </div>
        </section>
      )}

      {stage === 'options' &&
        car &&
        colour &&
        selection.year != null &&
        figures && (
          <section className="wizard" aria-labelledby="options-title">
            <h2 id="options-title" className="wizard__title">
              Factory options
            </h2>
            <div className="builds__config-grid">
              <CarPreview car={car} colour={colour} year={selection.year} />
              <div>
                <FiguresGrid
                  title="Configured figures"
                  figures={figures.configured}
                  compareTo={figures.base}
                />
                <p className="builds__base-price">
                  {formatMoney(figures.configuredPrice)}
                  <span> car + options</span>
                </p>
              </div>
            </div>
            <SpecOptions
              groups={car.specOptions}
              selected={selection.specChoices}
              onChange={(groupId, choiceId) =>
                patchSelection({
                  specChoices: {
                    ...selection.specChoices,
                    [groupId]: choiceId,
                  },
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

      {stage === 'mods' &&
        car &&
        colour &&
        selection.year != null &&
        figures && (
          <section className="builds__mods-stage" aria-labelledby="mods-heading">
            <button
              type="button"
              className="builds__compact"
              onClick={() => setStage('options')}
            >
              <CarPreview
                car={car}
                colour={colour}
                year={selection.year}
                compact
              />
              <div className="builds__compact-meta">
                <strong>
                  {selection.year} {car.make} {car.label}
                </strong>
                <span>{colour.name}</span>
                <span className="builds__compact-hint">Edit options</span>
              </div>
            </button>

            <h2 id="mods-heading" className="wizard__title">
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
                selection={selection}
                stage={stage}
                onRemoveMod={toggleMod}
                onSave={handleSave}
              />
            </div>

            <div className="builds__mobile-bar" aria-label="Build totals">
              <div className="builds__mobile-bar-stats">
                <strong>{formatMoney(figures.totalPrice)}</strong>
                <span>
                  {figures.final.hp} hp ·{' '}
                  {figures.final.zeroToSixtySec.toFixed(2)}s 0–60
                </span>
              </div>
            </div>
          </section>
        )}
    </div>
  )
}
