import { useState } from 'react'
import { catalog } from '../../data/catalog'
import { formatMoney, resolveSpecChoices } from '../../lib/build'
import { buildShareUrl, type BuildStage } from '../../lib/buildState'
import { formatBuildSummary } from '../../lib/build'
import type { BuildSelection, CarModel, Figures } from '../../types/catalog'
import { FiguresGrid } from './FiguresGrid'
import './StatsSidebar.css'

interface Props {
  car: CarModel
  year: number
  colourName: string
  configured: Figures
  final: Figures
  totalPrice: number
  selection: BuildSelection
  stage: BuildStage
  onRemoveMod: (modId: string) => void
  onSave?: () => void
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function StatsSidebar({
  car,
  year,
  colourName,
  configured,
  final,
  totalPrice,
  selection,
  stage,
  onRemoveMod,
  onSave,
}: Props) {
  const [copied, setCopied] = useState<'link' | 'summary' | null>(null)

  const selectedMods = selection.modIds
    .map((id) => catalog.getModById(id))
    .filter(Boolean)

  async function handleCopyLink() {
    const url = buildShareUrl({
      v: 2,
      stage,
      selection,
    })
    const ok = await copyText(url)
    if (ok) {
      setCopied('link')
      window.setTimeout(() => setCopied(null), 1600)
    }
  }

  async function handleCopySummary() {
    const options = resolveSpecChoices(car, selection.specChoices).map(
      (c) => c.name,
    )
    const text = formatBuildSummary({
      year,
      make: car.make,
      model: car.label,
      generation: car.generation,
      colourName,
      optionLabels: options,
      modLabels: selectedMods.map((m) =>
        m ? `${m.brand} ${m.name} (${formatMoney(m.price)})` : '',
      ),
      figures: final,
      totalPrice,
    })
    const ok = await copyText(text)
    if (ok) {
      setCopied('summary')
      window.setTimeout(() => setCopied(null), 1600)
    }
  }

  return (
    <aside className="stats-sidebar" aria-label="Build summary">
      <div className="stats-sidebar__sticky">
        <p className="stats-sidebar__eyebrow">Live figures</p>
        <h2>
          {year} {car.make} {car.label}
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

        <div className="stats-sidebar__actions">
          <button type="button" className="btn btn--ghost btn--small" onClick={handleCopyLink}>
            {copied === 'link' ? 'Link copied' : 'Copy link'}
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={handleCopySummary}
          >
            {copied === 'summary' ? 'Summary copied' : 'Copy summary'}
          </button>
          {onSave && (
            <button type="button" className="btn btn--ghost btn--small" onClick={onSave}>
              Save
            </button>
          )}
        </div>

        {selectedMods.length > 0 ? (
          <ul className="stats-sidebar__mods">
            {selectedMods.map(
              (mod) =>
                mod && (
                  <li key={mod.id}>
                    <span className="stats-sidebar__mod-name">
                      {mod.brand} {mod.name}
                    </span>
                    <span className="stats-sidebar__mod-meta">
                      <span>{formatMoney(mod.price)}</span>
                      <button
                        type="button"
                        className="stats-sidebar__remove"
                        onClick={() => onRemoveMod(mod.id)}
                        aria-label={`Remove ${mod.brand} ${mod.name}`}
                      >
                        Remove
                      </button>
                    </span>
                  </li>
                ),
            )}
          </ul>
        ) : (
          <p className="stats-sidebar__empty">
            Add mods to stack figures against your factory config.
          </p>
        )}
      </div>
    </aside>
  )
}
