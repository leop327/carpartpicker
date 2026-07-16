import { useMemo, useState } from 'react'
import { catalog } from '../../data/catalog'
import { formatMoney } from '../../lib/build'
import type { CarModel } from '../../types/catalog'
import './ModsPanel.css'

interface Props {
  car: CarModel
  selectedModIds: string[]
  onToggle: (modId: string) => void
  onApplyPreset: (presetId: string) => void
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

export function ModsPanel({
  car,
  selectedModIds,
  onToggle,
  onApplyPreset,
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

  return (
    <div className="mods-panel">
      {presets.length > 0 && (
        <section className="mods-presets" aria-labelledby="presets-title">
          <div className="mods-presets__head">
            <h3 id="presets-title">Stage presets</h3>
            <p>One-click stacks for this platform. Conflicting tunes are swapped automatically.</p>
          </div>
          <div className="mods-presets__grid">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="mods-preset"
                onClick={() => onApplyPreset(preset.id)}
              >
                <strong>{preset.name}</strong>
                <span>{preset.description}</span>
              </button>
            ))}
          </div>
        </section>
      )}

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

      {byCategory.length === 0 ? (
        <p className="mods-empty">No mods match that search.</p>
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
                return (
                  <li key={mod.id}>
                    <button
                      type="button"
                      className={active ? 'mod-row mod-row--active' : 'mod-row'}
                      onClick={() => onToggle(mod.id)}
                      aria-pressed={active}
                    >
                      <span className="mod-row__main">
                        <span className="mod-row__brand">{mod.brand}</span>
                        <span className="mod-row__name">{mod.name}</span>
                        <span className="mod-row__desc">{mod.description}</span>
                        <span className="mod-row__delta">
                          {deltaLabel(mod.figuresDelta)}
                          {mod.figuresSource === 'tuner' ? ' · tuner claim' : ''}
                        </span>
                      </span>
                      <span className="mod-row__side">
                        <span className="mod-row__price">
                          {formatMoney(mod.price)}
                        </span>
                        <span className="mod-row__toggle">
                          {active ? 'Added' : 'Add'}
                        </span>
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
