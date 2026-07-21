import { useMemo, useState } from 'react'
import { catalog } from '../../data/catalog'
import { formatMoney, applyDelta } from '../../lib/build'
import type { CarModel, Figures } from '../../types/catalog'
import './ModsPanel.css'

interface Props {
  car: CarModel
  selectedModIds: string[]
  stockFigures: Figures
  onToggle: (modId: string) => void
  onApplyPreset: (presetId: string) => void
  readOnly?: boolean
}

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

  const available = useMemo(
    () => catalog.getModsForCar(car.modTags),
    [car.modTags],
  )
  const presets = useMemo(
    () => catalog.getPresetsForCar(car.modTags),
    [car.modTags],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return available.filter((mod) => {
      if (categoryFilter !== 'all' && mod.category !== categoryFilter) {
        return false
      }
      if (!q) return true
      const hay =
        `${mod.brand} ${mod.name} ${mod.description} ${mod.category}`.toLowerCase()
      return hay.includes(q)
    })
  }, [available, query, categoryFilter])

  const byCategory = useMemo(() => {
    return catalog.modCategories
      .map((category) => ({
        category,
        mods: filtered.filter((m) => m.category === category.id),
      }))
      .filter((bucket) => bucket.mods.length > 0)
  }, [filtered])

  const categoriesWithMods = useMemo(() => {
    const ids = new Set(available.map((m) => m.category))
    return catalog.modCategories.filter((c) => ids.has(c.id))
  }, [available])

  function presetPreview(modIds: string[]) {
    let next = { ...stockFigures }
    for (const id of modIds) {
      const mod = catalog.getModById(id)
      if (mod) next = applyDelta(next, mod.figuresDelta)
    }
    return next
  }

  function handlePreset(id: string) {
    onApplyPreset(id)
  }

  return (
    <div className="mods-panel">
      {presets.length > 0 && !readOnly && (
        <section className="mods-presets" aria-labelledby="presets-title">
          <div className="mods-presets__head">
            <h3 id="presets-title">Stage presets</h3>
            <p>Stock → staged in one click. Conflicting tunes swap automatically.</p>
          </div>
          <div className="mods-presets__grid">
            {presets.map((preset) => {
              const after = presetPreview(preset.modIds)
              return (
                <button
                  key={preset.id}
                  type="button"
                  className="mods-preset"
                  onClick={() => handlePreset(preset.id)}
                >
                  <strong>{preset.name}</strong>
                  <span>{preset.description}</span>
                  <span className="mods-preset__compare" aria-label="Before and after">
                    <span>
                      <em>Stock</em>
                      {stockFigures.hp} hp · {stockFigures.zeroToSixtySec.toFixed(2)}s
                    </span>
                    <span className="mods-preset__arrow" aria-hidden>
                      →
                    </span>
                    <span>
                      <em>After</em>
                      {after.hp} hp · {after.zeroToSixtySec.toFixed(2)}s
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      )}

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
              <p>{category.description}</p>
            </div>
            <ul className="mods-list">
              {mods.map((mod) => {
                const active = selectedModIds.includes(mod.id)
                const source = mod.figuresSource ?? 'estimated'
                const gaps = active
                  ? catalog.getModSupportGaps(selectedModIds, mod)
                  : []
                return (
                  <li key={mod.id}>
                    <button
                      type="button"
                      className={[
                        'mod-row',
                        active ? 'mod-row--active' : '',
                        gaps.length ? 'mod-row--warn' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => {
                        if (!readOnly) onToggle(mod.id)
                      }}
                      aria-pressed={active}
                      disabled={readOnly}
                    >
                      <span className="mod-row__main">
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
                      </span>
                      <span className="mod-row__side">
                        <span className="mod-row__price">
                          {formatMoney(mod.price)}
                        </span>
                        {!readOnly ? (
                          <span className="mod-row__toggle">
                            {active ? 'Added' : 'Add'}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
