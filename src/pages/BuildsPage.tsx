import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { catalog } from '../data/catalog'
import { figuresSourceLabel } from '../lib/build'
import {
  emptySelection,
  hydrateBuildFromLocation,
  isViewOnlySearch,
  syncBuildToUrl,
  writeBuildToStorage,
  type BuildStage,
  type PersistedBuild,
} from '../lib/buildState'
import { accelLabel, MARKET } from '../lib/market'
import { unlockMilestone } from '../lib/milestones'
import { requireAccount } from '../lib/profile'
import {
  getSavedBuild,
  saveBuild,
} from '../lib/savedBuilds'
import { figuresFromSelection, initSpecChoicesForCar } from '../lib/selection'
import type { BuildSelection } from '../types/catalog'
import { CarPreview } from '../components/builds/CarPreview'
import { CheckoutPanel } from '../components/builds/CheckoutPanel'
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
    return { v: 2, stage: 'series', selection: emptySelection() }
  }
  if (savedId) {
    const saved = getSavedBuild(savedId)
    if (saved) return saved.build
  }
  return (
    hydrateBuildFromLocation(search) ?? {
      v: 2,
      stage: 'series',
      selection: emptySelection(),
    }
  )
}

export function BuildsPage() {
  const [params, setParams] = useSearchParams()
  const isNew = params.get('new') === '1'
  const savedIdParam = params.get('saved')
  const [viewOnly] = useState(() => isViewOnlySearch(window.location.search))

  const initial = useMemo(
    () => bootState(window.location.search, isNew, savedIdParam),
    // intentional first-load only
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const [stage, setStage] = useState<BuildStage>(() =>
    viewOnly &&
    initial.selection.carId &&
    initial.selection.year != null &&
    initial.selection.colourId
      ? 'mods'
      : initial.stage,
  )
  const [selection, setSelection] = useState<BuildSelection>(initial.selection)
  const [activeSavedId, setActiveSavedId] = useState<string | null>(
    viewOnly ? null : savedIdParam,
  )
  const [editingName, setEditingName] = useState<string | null>(() =>
    !viewOnly && savedIdParam
      ? getSavedBuild(savedIdParam)?.name ?? null
      : null,
  )
  const [saveNote, setSaveNote] = useState<string | null>(null)
  const [celebration, setCelebration] = useState<string | null>(null)
  const [carSearch, setCarSearch] = useState('')

  useEffect(() => {
    if (viewOnly) return
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
    if (viewOnly) {
      syncBuildToUrl(build, { viewOnly: true })
      return
    }
    writeBuildToStorage(build)
    syncBuildToUrl(build)
  }, [stage, selection, viewOnly])

  const car = selection.carId
    ? catalog.getCarById(selection.carId)
    : undefined
  const colour =
    car && selection.colourId
      ? car.colours.find((c) => c.id === selection.colourId)
      : undefined
  const figures = useMemo(
    () => figuresFromSelection(selection, MARKET),
    [selection],
  )
  const accel = accelLabel()
  const sourceNote = car ? figuresSourceLabel(car.figuresSource) : undefined

  const unlocked: BuildStage[] = useMemo(() => {
    const list: BuildStage[] = ['series']
    if (selection.series) list.push('chassis')
    if (selection.series && selection.chassis) list.push('model')
    if (selection.carId) list.push('year')
    if (selection.carId && selection.year != null) list.push('colour')
    if (selection.carId && selection.year != null && selection.colourId) {
      list.push('options', 'mods', 'checkout')
    }
    return list
  }, [selection])

  function patchSelection(patch: Partial<BuildSelection>) {
    if (viewOnly) return
    setSelection((prev) => ({ ...prev, ...patch }))
  }

  function pickSeries(series: string) {
    if (viewOnly) return
    setCarSearch('')
    const sample = catalog.getCarsBySeries(series)[0]
    const chassisList = catalog.getChassisBySeries(series)
    setSelection({
      ...emptySelection(),
      make: sample?.make ?? 'BMW',
      series,
    })
    if (chassisList.length === 1) {
      setSelection({
        ...emptySelection(),
        make: sample?.make ?? 'BMW',
        series,
        chassis: chassisList[0],
      })
      setStage('model')
      return
    }
    setStage('chassis')
  }

  function pickChassis(chassis: string) {
    if (viewOnly || !selection.series) return
    setCarSearch('')
    const variants = catalog.getCarsBySeriesAndChassis(
      selection.series,
      chassis,
    )
    const base = {
      ...emptySelection(),
      make: selection.make,
      series: selection.series,
      chassis,
    }
    if (variants.length === 1) {
      const only = variants[0]
      setSelection({
        ...base,
        make: only.make,
        series: only.series,
        chassis: only.generation,
        carId: only.id,
        specChoices: initSpecChoicesForCar(only.id),
      })
      setStage('year')
      return
    }
    setSelection(base)
    setStage('model')
  }

  function pickModel(carId: string) {
    if (viewOnly) return
    const next = catalog.getCarById(carId)
    if (!next) return
    setCarSearch('')
    setSelection({
      make: next.make,
      series: next.series,
      chassis: next.generation,
      carId,
      year: null,
      colourId: null,
      specChoices: initSpecChoicesForCar(carId),
      modIds: [],
    })
    setStage('year')
  }

  function pickYear(year: number) {
    if (viewOnly) return
    const firstColour = car?.colours[0]?.id ?? null
    patchSelection({ year, colourId: firstColour })
    setStage('colour')
  }

  function pickColour(colourId: string) {
    if (viewOnly) return
    patchSelection({ colourId })
  }

  function confirmColour() {
    if (viewOnly || !selection.colourId) return
    setStage('options')
  }

  function toggleMod(modId: string) {
    if (viewOnly) return
    setSelection((prev) => {
      const selected = !prev.modIds.includes(modId)
      return {
        ...prev,
        modIds: catalog.applyModSelection(prev.modIds, modId, selected),
      }
    })
  }

  function applyPreset(presetId: string) {
    if (viewOnly) return
    const preset = catalog.stagePresets.find((p) => p.id === presetId)
    if (!preset) return
    setSelection((prev) => ({
      ...prev,
      modIds: catalog.applyPreset(prev.modIds, preset),
    }))
  }

  function handleStepClick(next: BuildStage) {
    if (viewOnly) return
    if (!unlocked.includes(next)) return
    setStage(next)
  }

  function celebrate(label: string | null) {
    if (!label) return
    setCelebration(label)
    window.setTimeout(() => setCelebration(null), 2800)
  }

  function handleSave() {
    if (viewOnly) return
    requireAccount(() => {
      if (!selection.carId || selection.year == null || !selection.colourId) {
        setSaveNote('Finish series, model, year, and colour before saving.')
        window.setTimeout(() => setSaveNote(null), 2000)
        return
      }
      const entry = saveBuild(
        { v: 2, stage, selection },
        { id: activeSavedId ?? undefined, name: editingName ?? undefined },
      )
      setActiveSavedId(entry.id)
      setEditingName(entry.name)
      setSaveNote(`Saved “${entry.name}”`)
      celebrate(unlockMilestone('first-build'))
      window.setTimeout(() => setSaveNote(null), 2000)
    }, 'Create an account to save builds.')
  }

  function skipOptions() {
    if (viewOnly) return
    if (car) {
      patchSelection({ specChoices: initSpecChoicesForCar(car.id) })
    }
    setStage('mods')
  }

  const variants =
    selection.series && selection.chassis
      ? catalog.getCarsBySeriesAndChassis(selection.series, selection.chassis)
      : []
  const modelQuery = carSearch.trim().toLowerCase()
  const filteredVariants = modelQuery
    ? variants.filter((item) => {
        const haystack = [
          item.model,
          item.label,
          item.baseFigures.engineCode,
          item.baseFigures.drivetrain,
          item.tagline ?? '',
          String(item.baseFigures.hp),
          item.modTags.includes('diesel') ? 'diesel' : 'petrol',
          ...item.modTags,
        ]
          .join(' ')
          .toLowerCase()
        return haystack.includes(modelQuery)
      })
    : variants

  return (
    <div className="builds">
      <header className="builds__header">
        <div>
          <p className="builds__eyebrow">
            <Link to="/">Home</Link>
            {' · '}
            <Link to="/saved">Saved builds</Link>
          </p>
          <h1>
            {viewOnly
              ? 'Shared build'
              : activeSavedId
                ? 'Edit build'
                : 'New build'}
          </h1>
          {viewOnly ? (
            <p className="builds__editing">View only — copy the link to share.</p>
          ) : editingName ? (
            <p className="builds__editing">Editing “{editingName}”</p>
          ) : null}
        </div>
      </header>

      {viewOnly ? (
        <p className="builds__notice" role="status">
          This is a view-only link. Start a new build from Home to configure your
          own car.
        </p>
      ) : null}

      {saveNote && (
        <p className="builds__notice" role="status">
          {saveNote}
        </p>
      )}

      {viewOnly ? null : (
        <StepIndicator
          stage={stage}
          onStepClick={handleStepClick}
          unlocked={unlocked}
        />
      )}

      {stage === 'series' && (
        <section className="wizard" aria-labelledby="series-title">
          <h2 id="series-title" className="wizard__title">
            Choose a series
          </h2>
          <div className="choice-grid choice-grid--cars">
            {catalog.getSeriesList().map((series) => {
              const meta = catalog.seriesMeta(series)
              return (
                <button
                  key={series}
                  type="button"
                  className="choice-card choice-card--car"
                  onClick={() => pickSeries(series)}
                >
                  {meta.image ? (
                    <img
                      className="choice-card__photo"
                      src={meta.image}
                      alt=""
                      loading="lazy"
                    />
                  ) : null}
                  <span className="choice-card__body">
                    <span className="choice-card__title">{series}</span>
                    <span className="choice-card__meta">
                      {meta.chassisCount} chassis · {meta.count} models
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {stage === 'chassis' && selection.series && (
        <section className="wizard" aria-labelledby="chassis-title">
          <h2 id="chassis-title" className="wizard__title">
            {selection.series} — chassis
          </h2>
          <div className="choice-grid choice-grid--cars">
            {catalog.getChassisBySeries(selection.series).map((chassis) => {
              const meta = catalog.chassisMeta(selection.series!, chassis)
              return (
                <button
                  key={chassis}
                  type="button"
                  className="choice-card choice-card--car"
                  onClick={() => pickChassis(chassis)}
                >
                  {meta.image ? (
                    <img
                      className="choice-card__photo"
                      src={meta.image}
                      alt=""
                      loading="lazy"
                    />
                  ) : null}
                  <span className="choice-card__body">
                    <span className="choice-card__kicker">
                      {meta.yearsLabel}
                    </span>
                    <span className="choice-card__title">{chassis}</span>
                    <span className="choice-card__meta">
                      {meta.count} {meta.count === 1 ? 'model' : 'models'}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {stage === 'model' && selection.series && selection.chassis && (
        <section className="wizard" aria-labelledby="model-title">
          <div className="wizard__head">
            <h2 id="model-title" className="wizard__title">
              {selection.chassis} — model
            </h2>
            <p className="wizard__count">
              {filteredVariants.length} of {variants.length}
            </p>
          </div>
          {variants.length > 4 ? (
            <label className="car-search">
              <span className="visually-hidden">Search models</span>
              <input
                type="search"
                className="car-search__input"
                placeholder="Search 135i, 1M, N54…"
                value={carSearch}
                onChange={(e) => setCarSearch(e.target.value)}
                autoComplete="off"
              />
            </label>
          ) : null}
          {filteredVariants.length === 0 ? (
            <p className="wizard__empty">No models match.</p>
          ) : (
            <div className="choice-grid choice-grid--cars">
              {filteredVariants.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="choice-card choice-card--car"
                  onClick={() => pickModel(item.id)}
                >
                  <img
                    className="choice-card__photo"
                    src={item.image}
                    alt=""
                    loading="lazy"
                  />
                  <span className="choice-card__body">
                    <span className="choice-card__kicker">
                      {item.baseFigures.engineCode}
                    </span>
                    <span className="choice-card__title">{item.label}</span>
                    <span className="choice-card__meta">
                      {item.baseFigures.engineSizeL.toFixed(1)}L{' '}
                      {item.modTags.includes('diesel') ? 'diesel' : 'petrol'} ·{' '}
                      {item.baseFigures.hp} hp · {item.baseFigures.drivetrain}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
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
              {!viewOnly && (
                <button
                  type="button"
                  className="btn btn--primary"
                  disabled={!selection.colourId}
                  onClick={confirmColour}
                >
                  Continue with {colour?.name ?? 'colour'}
                </button>
              )}
              <FiguresGrid
                title="Factory figures"
                figures={figures?.base ?? car.baseFigures}
                accelLabel={accel}
                sourceNote={sourceNote}
              />
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
            <div className="builds__options-top">
              <h2 id="options-title" className="wizard__title">
                Factory options
              </h2>
              <button
                type="button"
                className="btn btn--primary btn--lg builds__skip"
                onClick={skipOptions}
              >
                Skip options
              </button>
            </div>
            <div className="builds__config-grid">
              <CarPreview car={car} colour={colour} year={selection.year} />
              <div>
                <FiguresGrid
                  title="Configured figures"
                  figures={figures.configured}
                  compareTo={figures.base}
                  accelLabel={accel}
                  sourceNote={sourceNote}
                />
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
                stockFigures={figures.base}
                onToggle={toggleMod}
                onApplyPreset={applyPreset}
                readOnly={viewOnly}
              />
              <StatsSidebar
                car={car}
                colourName={colour.name}
                year={selection.year}
                configured={figures.configured}
                final={figures.final}
                stockFigures={figures.base}
                totalPrice={figures.totalPrice}
                selection={selection}
                stage={stage}
                market={MARKET}
                accelLabel={accel}
                sourceNote={sourceNote}
                onRemoveMod={toggleMod}
                onAddMod={
                  viewOnly
                    ? undefined
                    : (modId) => {
                        setSelection((prev) => ({
                          ...prev,
                          modIds: catalog.applyModSelection(
                            prev.modIds,
                            modId,
                            true,
                          ),
                        }))
                      }
                }
                onSave={viewOnly ? undefined : handleSave}
                onCheckout={
                  viewOnly
                    ? undefined
                    : () => {
                        celebrate(unlockMilestone('first-checkout'))
                        setStage('checkout')
                      }
                }
                celebration={celebration}
                readOnly={viewOnly}
              />
            </div>
          </section>
        )}

      {stage === 'checkout' &&
        car &&
        colour &&
        selection.year != null &&
        figures && (
          <section className="wizard" aria-labelledby="checkout-title">
            <button
              type="button"
              className="builds__compact"
              onClick={() => setStage('mods')}
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
                <span>
                  {figures.final.hp} hp · {figures.final.zeroToSixtySec.toFixed(2)}s{' '}
                  {accel}
                </span>
                <span className="builds__compact-hint">Edit mods</span>
              </div>
            </button>
            <CheckoutPanel
              modIds={selection.modIds}
              modsTotal={figures.totalPrice}
              onRemoveMod={toggleMod}
              onBackToMods={() => setStage('mods')}
            />
          </section>
        )}
    </div>
  )
}
