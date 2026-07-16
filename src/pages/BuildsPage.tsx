import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { catalog } from '../data/catalog'
import { figuresSourceLabel } from '../lib/build'
import {
  emptySelection,
  hydrateBuildFromLocation,
  syncBuildToUrl,
  writeBuildToStorage,
  type BuildStage,
  type PersistedBuild,
} from '../lib/buildState'
import { downloadModList } from '../lib/exportMods'
import { accelLabel, MARKET } from '../lib/market'
import { unlockMilestone } from '../lib/milestones'
import { requireAccount } from '../lib/profile'
import {
  getSavedBuild,
  saveBuild,
  selectionLabel,
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
  const [editingName, setEditingName] = useState<string | null>(() =>
    savedIdParam ? getSavedBuild(savedIdParam)?.name ?? null : null,
  )
  const [saveNote, setSaveNote] = useState<string | null>(null)
  const [celebration, setCelebration] = useState<string | null>(null)

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
  const figures = useMemo(
    () => figuresFromSelection(selection, MARKET),
    [selection],
  )
  const accel = accelLabel()
  const sourceNote = car ? figuresSourceLabel(car.figuresSource) : undefined

  const unlocked: BuildStage[] = useMemo(() => {
    const list: BuildStage[] = ['brand']
    if (selection.make) list.push('model')
    if (selection.carId) list.push('year')
    if (selection.carId && selection.year != null) list.push('colour')
    if (selection.carId && selection.year != null && selection.colourId) {
      list.push('options', 'mods', 'checkout')
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
      const selected = !prev.modIds.includes(modId)
      return {
        ...prev,
        modIds: catalog.applyModSelection(prev.modIds, modId, selected),
      }
    })
  }

  function applyPreset(presetId: string) {
    const preset = catalog.stagePresets.find((p) => p.id === presetId)
    if (!preset) return
    setSelection((prev) => ({
      ...prev,
      modIds: catalog.applyPreset(prev.modIds, preset),
    }))
  }

  function handleStepClick(next: BuildStage) {
    if (!unlocked.includes(next)) return
    setStage(next)
  }

  function celebrate(label: string | null) {
    if (!label) return
    setCelebration(label)
    window.setTimeout(() => setCelebration(null), 2800)
  }

  function handleSave() {
    requireAccount(() => {
      if (!selection.carId || selection.year == null || !selection.colourId) {
        setSaveNote('Finish brand, model, year, and colour before saving.')
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

  function handleExportMods() {
    requireAccount(() => {
      const ok = downloadModList(selection, {
        filename: `${(editingName ?? selectionLabel(selection) ?? 'build')
          .replace(/\s+/g, '-')
          .toLowerCase()}-mods.csv`,
        format: 'csv',
      })
      setSaveNote(ok ? 'Mod list downloaded' : 'Add mods before exporting')
      window.setTimeout(() => setSaveNote(null), 2000)
    }, 'Create an account to export your mod list.')
  }

  function skipOptions() {
    if (car) {
      patchSelection({ specChoices: initSpecChoicesForCar(car.id) })
    }
    setStage('mods')
  }

  const models = selection.make ? catalog.getCarsByMake(selection.make) : []

  return (
    <div className="builds">
      <header className="builds__header">
        <div>
          <p className="builds__eyebrow">
            <Link to="/">Home</Link>
            {' · '}
            <Link to="/saved">Saved builds</Link>
          </p>
          <h1>{activeSavedId ? 'Edit build' : 'New build'}</h1>
          {editingName && (
            <p className="builds__editing">Editing “{editingName}”</p>
          )}
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
                <span className="choice-card__desc">
                  {item.tagline ?? item.description}
                </span>
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
                builtFigures={figures.final}
                onToggle={toggleMod}
                onApplyPreset={applyPreset}
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
                market={MARKET}
                accelLabel={accel}
                sourceNote={sourceNote}
                onRemoveMod={toggleMod}
                onAddMod={(modId) => {
                  setSelection((prev) => ({
                    ...prev,
                    modIds: catalog.applyModSelection(prev.modIds, modId, true),
                  }))
                }}
                onSave={handleSave}
                onExportMods={handleExportMods}
                celebration={celebration}
                onCheckout={() => {
                  celebrate(unlockMilestone('first-checkout'))
                  setStage('checkout')
                }}
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
              onSave={handleSave}
              onExportMods={handleExportMods}
            />
          </section>
        )}
    </div>
  )
}
