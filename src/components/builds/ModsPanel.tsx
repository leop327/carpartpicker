import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { catalog } from '../../data/catalog'
import { formatMoney, applyDelta } from '../../lib/build'
import type { TunerBrand } from '../../data/mods/tunerStages'
import type { CarModel, Figures, Mod } from '../../types/catalog'
import './ModsPanel.css'

interface Props {
  car: CarModel
  selectedModIds: string[]
  stockFigures: Figures
  onToggle: (modId: string) => void
  onApplyPreset: (presetId: string) => void
  readOnly?: boolean
}

const TUNER_BRANDS = new Set(['MHD', 'bootmod3'])

function deltaLabel(delta: {
  hp?: number
  torqueNm?: number
  zeroToSixtySec?: number
  weightKg?: number
}) {
  const parts: string[] = []
  if (delta.hp) parts.push(`${delta.hp > 0 ? '+' : ''}${delta.hp} hp`)
  if (delta.torqueNm)
    parts.push(`${delta.torqueNm > 0 ? '+' : ''}${delta.torqueNm} Nm`)
  if (delta.zeroToSixtySec)
    parts.push(
      `${delta.zeroToSixtySec > 0 ? '+' : ''}${delta.zeroToSixtySec.toFixed(2)}s`,
    )
  if (delta.weightKg)
    parts.push(`${delta.weightKg > 0 ? '+' : ''}${delta.weightKg} kg`)
  return parts.length ? parts.join(' · ') : 'Supporting / no figure change'
}

function sharpClaim(mod: {
  claim?: string
  figuresDelta: { hp?: number; zeroToSixtySec?: number }
  description: string
}): string {
  if (mod.claim) return mod.claim
  if (mod.figuresDelta.hp && mod.figuresDelta.hp >= 40) {
    return `~${mod.figuresDelta.hp > 0 ? '+' : ''}${mod.figuresDelta.hp} hp when stacked right`
  }
  if (mod.figuresDelta.zeroToSixtySec && mod.figuresDelta.zeroToSixtySec < 0) {
    return `${mod.figuresDelta.zeroToSixtySec.toFixed(2)}s off the sprint`
  }
  const first = mod.description.split(/[.—]/)[0]?.trim()
  return first || mod.description
}

function isTunerMap(mod: Mod): boolean {
  return mod.category === 'ecu' && TUNER_BRANDS.has(mod.brand)
}

export function ModsPanel({
  car,
  selectedModIds,
  stockFigures,
  onToggle,
  onApplyPreset,
  readOnly,
}: Props) {
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all')
  const [tuner, setTuner] = useState<TunerBrand | null>(null)
  const [stageId, setStageId] = useState('')

  const available = useMemo(
    () => catalog.getModsForCar(car.modTags),
    [car.modTags],
  )
  const tuners = useMemo(
    () => catalog.getTunersForCar(car.modTags),
    [car.modTags],
  )
  const stages = useMemo(
    () => (tuner ? catalog.getStagesForTuner(car.modTags, tuner) : []),
    [car.modTags, tuner],
  )
  const showStageKits = tuners.length > 0 && !readOnly

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return available.filter((mod) => {
      // Stage kits replace individual MHD / bootmod3 map rows
      if (showStageKits && isTunerMap(mod)) return false
      if (categoryFilter !== 'all' && mod.category !== categoryFilter) {
        return false
      }
      if (!q) return true
      const hay =
        `${mod.brand} ${mod.name} ${mod.description} ${mod.category}`.toLowerCase()
      return hay.includes(q)
    })
  }, [available, query, categoryFilter, showStageKits])

  const byCategory = useMemo(() => {
    return catalog.modCategories
      .map((category) => ({
        category,
        mods: filtered.filter((m) => m.category === category.id),
      }))
      .filter((bucket) => {
        if (bucket.mods.length > 0) return true
        // Keep ECU section visible for stage kits even with no leftover maps
        return (
          showStageKits &&
          bucket.category.id === 'ecu' &&
          (categoryFilter === 'all' || categoryFilter === 'ecu')
        )
      })
  }, [filtered, showStageKits, categoryFilter])

  const categoriesWithMods = useMemo(() => {
    const ids = new Set(available.filter((m) => !isTunerMap(m)).map((m) => m.category))
    if (showStageKits) ids.add('ecu')
    return catalog.modCategories.filter((c) => ids.has(c.id))
  }, [available, showStageKits])

  function selectTuner(next: TunerBrand) {
    setTuner((prev) => (prev === next ? null : next))
    setStageId('')
  }

  function applyStage(kitId: string) {
    setStageId(kitId)
    onApplyPreset(kitId)
  }

  const stageCards = useMemo(() => {
    return stages.map((kit) => {
      const resolved = catalog.kitAsPreset(kit, car.modTags)
      let figures = { ...stockFigures }
      let price = 0
      const labels: string[] = []
      for (const id of resolved.modIds) {
        const mod = catalog.getModById(id)
        if (!mod) continue
        figures = applyDelta(figures, mod.figuresDelta)
        price += mod.price
        labels.push(`${mod.brand} ${mod.name}`)
      }
      const image = catalog.resolveKitImage(resolved.modIds)
      return { kit, figures, price, labels, image, modIds: resolved.modIds }
    })
  }, [stages, car.modTags, stockFigures])

  function renderStageKits() {
    return (
      <div className="mods-ecu-kits">
        <div className="mods-tuners" role="group" aria-label="Tuner">
          {tuners.map((t) => (
            <button
              key={t}
              type="button"
              className={
                tuner === t ? 'mods-tuner mods-tuner--active' : 'mods-tuner'
              }
              aria-expanded={tuner === t}
              onClick={() => selectTuner(t)}
            >
              {t}
            </button>
          ))}
        </div>
        {tuner && (
          <ul className="mods-stage-list" aria-label={`${tuner} stages`}>
            {stageCards.length === 0 ? (
              <li className="mods-empty">No stages for this chassis yet.</li>
            ) : (
              stageCards.map(({ kit, figures, price, labels, image }) => {
                const active = stageId === kit.id
                return (
                  <li key={kit.id}>
                    <button
                      type="button"
                      className={
                        active
                          ? 'mods-stage-card mods-stage-card--active'
                          : 'mods-stage-card'
                      }
                      onClick={() => applyStage(kit.id)}
                      aria-pressed={active}
                    >
                      <span className="mods-stage-card__media" aria-hidden>
                        {image ? (
                          <img src={image} alt="" loading="lazy" />
                        ) : (
                          <span className="mods-stage-card__ph" />
                        )}
                      </span>
                      <span className="mods-stage-card__main">
                        <span className="mods-stage-card__top">
                          <span className="mods-stage-card__brand">{tuner}</span>
                          <span className="mods-stage-card__badge">Kit</span>
                        </span>
                        <span className="mods-stage-card__name">{kit.label}</span>
                        <span className="mods-stage-card__parts">
                          {labels.join(' · ') || 'Map only'}
                        </span>
                        <span className="mods-stage-card__figures">
                          <span>
                            <em>Stock</em>
                            {stockFigures.hp} hp ·{' '}
                            {stockFigures.zeroToSixtySec.toFixed(2)}s
                          </span>
                          <span className="mods-stage-card__arrow" aria-hidden>
                            →
                          </span>
                          <span>
                            <em>After</em>
                            {figures.hp} hp ·{' '}
                            {figures.zeroToSixtySec.toFixed(2)}s
                          </span>
                        </span>
                      </span>
                      <span className="mods-stage-card__side">
                        <span className="mods-stage-card__price">
                          {formatMoney(price)}
                        </span>
                        <span className="mods-stage-card__toggle">
                          {active ? 'Applied' : 'Apply'}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        )}
      </div>
    )
  }

  return (
    <div className="mods-panel">
      {!readOnly && (
        <div className="mods-toolbar">
          <label className="mods-search">
            <span className="visually-hidden">Search mods</span>
            <input
              type="search"
              placeholder="Search brand, part, category…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="mods-filters" role="group" aria-label="Filter by category">
            <button
              type="button"
              className={
                categoryFilter === 'all'
                  ? 'mods-chip mods-chip--active'
                  : 'mods-chip'
              }
              onClick={() => setCategoryFilter('all')}
            >
              All
            </button>
            {categoriesWithMods.map((c) => (
              <button
                key={c.id}
                type="button"
                className={
                  categoryFilter === c.id
                    ? 'mods-chip mods-chip--active'
                    : 'mods-chip'
                }
                onClick={() =>
                  setCategoryFilter((prev) => (prev === c.id ? 'all' : c.id))
                }
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {byCategory.length === 0 ? (
        <p className="mods-empty">
          {readOnly ? 'No mods on this build.' : 'No mods match that search.'}
        </p>
      ) : (
        byCategory.map(({ category, mods }) => (
          <section
            key={category.id}
            className="mods-category"
            aria-labelledby={`mod-cat-${category.id}`}
          >
            <div className="mods-category__head">
              <h3 id={`mod-cat-${category.id}`}>{category.name}</h3>
              <p>
                {category.id === 'ecu' && showStageKits
                  ? 'Pick MHD or bootmod3, then apply a stage kit (map + bolt-ons).'
                  : category.description}
              </p>
            </div>

            {category.id === 'ecu' && showStageKits ? renderStageKits() : null}

            {mods.length > 0 && (
              <ul className="mods-list">
                {mods.map((mod) => {
                  const active = selectedModIds.includes(mod.id)
                  const source = mod.figuresSource ?? 'estimated'
                  const gaps = active
                    ? catalog.getModSupportGaps(selectedModIds, mod)
                    : []
                  const image = catalog.resolveProductImage(mod)
                  return (
                    <li key={mod.id} className="mod-item">
                      <div
                        className={[
                          'mod-row',
                          active ? 'mod-row--active' : '',
                          gaps.length ? 'mod-row--warn' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <span
                          className={
                            image
                              ? 'mod-row__media'
                              : 'mod-row__media mod-row__media--empty'
                          }
                          aria-hidden
                        >
                          {image ? (
                            <img src={image} alt="" loading="lazy" />
                          ) : null}
                        </span>
                        <button
                          type="button"
                          className="mod-row__main"
                          onClick={() => {
                            if (!readOnly) onToggle(mod.id)
                          }}
                          aria-pressed={active}
                          disabled={readOnly}
                        >
                          <span className="mod-row__top">
                            <span className="mod-row__brand">{mod.brand}</span>
                            <span
                              className={`mod-row__badge mod-row__badge--${source}`}
                            >
                              {source === 'oem'
                                ? 'OEM'
                                : source === 'tuner'
                                  ? 'Tuner'
                                  : 'Est.'}
                            </span>
                          </span>
                          <span className="mod-row__name">{mod.name}</span>
                          <span className="mod-row__claim">{sharpClaim(mod)}</span>
                          <span className="mod-row__delta">
                            {deltaLabel(mod.figuresDelta)}
                          </span>
                          {gaps.length > 0 ? (
                            <span className="mod-row__gaps">
                              {gaps.join(' · ')}
                            </span>
                          ) : null}
                        </button>
                        <span className="mod-row__side">
                          <span className="mod-row__price">
                            {formatMoney(mod.price)}
                          </span>
                          <Link
                            to={`/mods/${mod.id}`}
                            className="mod-row__profile"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Profile
                          </Link>
                          {!readOnly ? (
                            <button
                              type="button"
                              className="mod-row__toggle"
                              onClick={() => onToggle(mod.id)}
                            >
                              {active ? 'Added' : 'Add'}
                            </button>
                          ) : null}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        ))
      )}
    </div>
  )
}
