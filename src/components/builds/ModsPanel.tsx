import { useMemo } from 'react'
import { catalog } from '../../data/catalog'
import { formatMoney } from '../../lib/build'
import type { CarModel } from '../../types/catalog'
import './ModsPanel.css'

interface Props {
  car: CarModel
  selectedModIds: string[]
  onToggle: (modId: string) => void
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
      `${delta.zeroToSixtySec > 0 ? '+' : ''}${delta.zeroToSixtySec.toFixed(2)}s 0–60`,
    )
  if (delta.weightKg)
    parts.push(`${delta.weightKg > 0 ? '+' : ''}${delta.weightKg} kg`)
  return parts.length ? parts.join(' · ') : 'No figure change'
}

export function ModsPanel({ car, selectedModIds, onToggle }: Props) {
  const available = useMemo(
    () => catalog.getModsForCar(car.modTags),
    [car.modTags],
  )

  const byCategory = useMemo(() => {
    return catalog.modCategories
      .map((category) => ({
        category,
        mods: available.filter((m) => m.category === category.id),
      }))
      .filter((bucket) => bucket.mods.length > 0)
  }, [available])

  return (
    <div className="mods-panel">
      {byCategory.map(({ category, mods }) => (
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
      ))}
    </div>
  )
}
