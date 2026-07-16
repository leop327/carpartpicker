import { useMemo, useState } from 'react'
import { catalog } from '../../data/catalog'
import {
  figuresSourceLabel,
  formatBuildSummary,
  formatMoney,
  resolveSpecChoices,
} from '../../lib/build'
import { buildViewOnlyUrl, type BuildStage } from '../../lib/buildState'
import { resolveBuildTips } from '../../lib/buildTips'
import { unlockMilestone } from '../../lib/milestones'
import { requireAccount } from '../../lib/profile'
import { quarterMileFromFigures } from '../../lib/quarterMile'
import { openPrintableSummary } from '../../lib/selection'
import type { BuildSelection, CarModel, Figures, Market } from '../../types/catalog'
import { DragRace } from './DragRace'
import { FiguresGrid } from './FiguresGrid'
import './StatsSidebar.css'

interface Props {
  car: CarModel
  year: number
  colourName: string
  configured: Figures
  final: Figures
  stockFigures: Figures
  totalPrice: number
  selection: BuildSelection
  stage: BuildStage
  market: Market
  accelLabel: string
  sourceNote?: string
  onRemoveMod: (modId: string) => void
  onAddMod?: (modId: string) => void
  onSave?: () => void
  onCheckout?: () => void
  celebration?: string | null
  readOnly?: boolean
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
  stockFigures,
  totalPrice,
  selection,
  stage,
  market,
  accelLabel,
  sourceNote,
  onRemoveMod,
  onAddMod,
  onSave,
  onCheckout,
  celebration,
  readOnly,
}: Props) {
  const [copied, setCopied] = useState(false)

  const selectedMods = selection.modIds
    .map((id) => catalog.getModById(id))
    .filter(Boolean)

  const tips = useMemo(
    () => (readOnly ? [] : resolveBuildTips(selection.modIds, car.modTags)),
    [selection.modIds, car.modTags, readOnly],
  )

  const stockEt = quarterMileFromFigures(stockFigures)
  const builtEt = quarterMileFromFigures(final)

  function summaryText() {
    const options = resolveSpecChoices(car, selection.specChoices).map(
      (c) => c.name,
    )
    return formatBuildSummary({
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
      market,
      figuresSource: sourceNote ?? figuresSourceLabel(car.figuresSource),
    })
  }

  async function handleCopyLink() {
    const url = buildViewOnlyUrl({
      v: 2,
      stage,
      selection,
    })
    const ok = await copyText(url)
    if (ok) {
      unlockMilestone('first-share')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    }
  }

  function handleExport() {
    requireAccount(() => {
      openPrintableSummary(
        summaryText(),
        `${year} ${car.make} ${car.label}`,
      )
    }, 'Create an account to export your build.')
  }

  return (
    <aside className="stats-sidebar" aria-label="Build summary">
      <div className="stats-sidebar__sticky">
        {celebration && (
          <p className="stats-sidebar__celebrate" role="status">
            {celebration}
          </p>
        )}
        <p className="stats-sidebar__eyebrow">
          {readOnly ? 'View only' : 'Live figures'}
        </p>
        <h2>
          {year} {car.make} {car.label}
        </h2>
        <p className="stats-sidebar__colour">
          {colourName} · UK
        </p>
        {car.tagline && (
          <p className="stats-sidebar__tagline">{car.tagline}</p>
        )}

        {tips.length > 0 && (
          <div className="build-tips">
            <p className="build-tips__label">Recommended</p>
            <ul>
              {tips.map((tip) => (
                <li
                  key={tip.id}
                  className={`build-tips__item build-tips__item--${tip.tone}`}
                >
                  <span>{tip.message}</span>
                  {tip.suggestedModId && onAddMod && (
                    <button
                      type="button"
                      className="build-tips__add"
                      onClick={() => onAddMod(tip.suggestedModId!)}
                    >
                      Add {tip.suggestedLabel ?? 'mod'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <FiguresGrid
          title="With selected mods"
          figures={final}
          compareTo={configured}
          accelLabel={accelLabel}
          sourceNote={sourceNote}
          animate={!readOnly}
        />

        <div className="stats-sidebar__price">
          <span>Mods total</span>
          <strong>{formatMoney(totalPrice)}</strong>
        </div>

        <div className="stats-sidebar__et">
          <span>Est. 1/4-mile</span>
          <strong>{builtEt.toFixed(2)}s</strong>
        </div>

        {!readOnly ? (
          <div className="stats-sidebar__actions">
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={handleCopyLink}
            >
              {copied ? 'Link copied' : 'Copy link'}
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={handleExport}
            >
              Export build
            </button>
            {onSave ? (
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={onSave}
              >
                Save build
              </button>
            ) : null}
            {onCheckout ? (
              <button
                type="button"
                className="btn btn--primary btn--small"
                onClick={onCheckout}
              >
                Checkout
              </button>
            ) : null}
          </div>
        ) : (
          <div className="stats-sidebar__actions">
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={handleCopyLink}
            >
              {copied ? 'Link copied' : 'Copy link'}
            </button>
          </div>
        )}

        <DragRace
          compact
          title="Stock vs build · 1/4-mile"
          left={{
            id: 'stock',
            label: 'Stock',
            sublabel: `${stockFigures.hp} hp`,
            image: car.image,
            quarterMileSec: stockEt,
            accent: '#6b7280',
          }}
          right={{
            id: 'built',
            label: 'Your build',
            sublabel: `${final.hp} hp · ${selection.modIds.length} mods`,
            image: car.image,
            quarterMileSec: builtEt,
            accent: 'var(--signal)',
          }}
        />

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
                      {!readOnly ? (
                        <button
                          type="button"
                          className="stats-sidebar__remove"
                          onClick={() => onRemoveMod(mod.id)}
                          aria-label={`Remove ${mod.brand} ${mod.name}`}
                        >
                          Remove
                        </button>
                      ) : null}
                    </span>
                  </li>
                ),
            )}
          </ul>
        ) : (
          <p className="stats-sidebar__empty">
            {readOnly
              ? 'No mods on this shared build.'
              : 'Add mods to stack figures against your factory config.'}
          </p>
        )}
      </div>
    </aside>
  )
}
