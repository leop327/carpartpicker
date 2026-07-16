import { useMemo, useState } from 'react'
import { catalog } from '../../data/catalog'
import {
  figuresSourceLabel,
  formatBuildSummary,
  formatMoney,
  resolveSpecChoices,
} from '../../lib/build'
import { buildShareUrl, type BuildStage } from '../../lib/buildState'
import { resolveBuildTips } from '../../lib/buildTips'
import { unlockMilestone } from '../../lib/milestones'
import { requireAccount } from '../../lib/profile'
import { renderShareCard } from '../../lib/shareCard'
import { openPrintableSummary } from '../../lib/selection'
import type { BuildSelection, CarModel, Figures, Market } from '../../types/catalog'
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
  market: Market
  accelLabel: string
  sourceNote?: string
  onRemoveMod: (modId: string) => void
  onAddMod?: (modId: string) => void
  onSave?: () => void
  onExportMods?: () => void
  onCheckout?: () => void
  celebration?: string | null
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
  market,
  accelLabel,
  sourceNote,
  onRemoveMod,
  onAddMod,
  onSave,
  onExportMods,
  onCheckout,
  celebration,
}: Props) {
  const [copied, setCopied] = useState<'link' | 'summary' | 'card' | null>(null)

  const selectedMods = selection.modIds
    .map((id) => catalog.getModById(id))
    .filter(Boolean)

  const tips = useMemo(
    () => resolveBuildTips(selection.modIds, car.modTags),
    [selection.modIds, car.modTags],
  )

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
    const url = buildShareUrl({
      v: 2,
      stage,
      selection,
    })
    const ok = await copyText(url)
    if (ok) {
      unlockMilestone('first-share')
      setCopied('link')
      window.setTimeout(() => setCopied(null), 1600)
    }
  }

  async function handleCopySummary() {
    const ok = await copyText(summaryText())
    if (ok) {
      unlockMilestone('first-share')
      setCopied('summary')
      window.setTimeout(() => setCopied(null), 1600)
    }
  }

  async function handleShareCard() {
    const blob = await renderShareCard({
      title: `${year} ${car.make} ${car.label}`,
      subtitle: `${colourName} · ${selection.modIds.length} mods`,
      figures: final,
      modsTotal: totalPrice,
      levelLabel: `${final.hp} hp build`,
      accelLabel,
    })
    if (!blob) return
    unlockMilestone('first-share')
    const file = new File([blob], 'carpartpicker-build.png', {
      type: 'image/png',
    })
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `${year} ${car.label} build`,
        })
        setCopied('card')
        window.setTimeout(() => setCopied(null), 1600)
        return
      } catch {
        // fall through to download
      }
    }
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = href
    a.download = 'carpartpicker-build.png'
    a.click()
    URL.revokeObjectURL(href)
    setCopied('card')
    window.setTimeout(() => setCopied(null), 1600)
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
        <p className="stats-sidebar__eyebrow">Live figures</p>
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
          animate
        />

        <div className="stats-sidebar__price">
          <span>Mods total</span>
          <strong>{formatMoney(totalPrice)}</strong>
        </div>

        <div className="stats-sidebar__actions">
          <button type="button" className="btn btn--ghost btn--small" onClick={handleCopyLink}>
            {copied === 'link' ? 'Link copied' : 'Copy link'}
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={handleShareCard}
          >
            {copied === 'card' ? 'Card ready' : 'Share card'}
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={handleCopySummary}
          >
            {copied === 'summary' ? 'Summary copied' : 'Copy summary'}
          </button>
          <button type="button" className="btn btn--ghost btn--small" onClick={handleExport}>
            Export / print
          </button>
          {onCheckout && (
            <button
              type="button"
              className="btn btn--primary btn--small"
              onClick={onCheckout}
            >
              Checkout
            </button>
          )}
          {onSave && (
            <button type="button" className="btn btn--ghost btn--small" onClick={onSave}>
              Save
            </button>
          )}
          {onExportMods && (
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={onExportMods}
            >
              Export mods
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
