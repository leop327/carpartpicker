import { catalog } from '../../data/catalog'
import { formatMoney } from '../../lib/build'
import type { CarModel, Figures } from '../../types/catalog'
import { FiguresGrid } from './FiguresGrid'
import './StatsSidebar.css'

interface Props {
  car: CarModel
  year: number
  colourName: string
  configured: Figures
  final: Figures
  totalPrice: number
  modIds: string[]
}

export function StatsSidebar({
  car,
  year,
  colourName,
  configured,
  final,
  totalPrice,
  modIds,
}: Props) {
  const selectedMods = modIds
    .map((id) => catalog.getModById(id))
    .filter(Boolean)

  return (
    <aside className="stats-sidebar" aria-label="Build summary">
      <div className="stats-sidebar__sticky">
        <p className="stats-sidebar__eyebrow">Live figures</p>
        <h2>
          {year} {car.make} {car.model}
        </h2>
        <p className="stats-sidebar__colour">{colourName}</p>

        <FiguresGrid
          title="With selected mods"
          figures={final}
          compareTo={configured}
        />

        <div className="stats-sidebar__price">
          <span>Estimated total</span>
          <strong>{formatMoney(totalPrice)}</strong>
        </div>

        {selectedMods.length > 0 ? (
          <ul className="stats-sidebar__mods">
            {selectedMods.map(
              (mod) =>
                mod && (
                  <li key={mod.id}>
                    <span>
                      {mod.brand} {mod.name}
                    </span>
                    <span>{formatMoney(mod.price)}</span>
                  </li>
                ),
            )}
          </ul>
        ) : (
          <p className="stats-sidebar__empty">
            Add mods to see figures stack against your factory config.
          </p>
        )}
      </div>
    </aside>
  )
}
