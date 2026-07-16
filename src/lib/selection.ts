import { catalog } from '../data/catalog'
import {
  computeBuildFigures,
  formatBuildSummary,
  formatMoney,
  formatTorque,
  figuresSourceLabel,
  getDefaultSpecChoice,
  resolveSpecChoices,
} from './build'
import { getMarket } from './market'
import type { BuildSelection, Figures, Market } from '../types/catalog'

export function figuresFromSelection(
  selection: BuildSelection,
  market: Market = getMarket(),
): {
  base: Figures
  configured: Figures
  final: Figures
  configuredPrice: number
  modsPrice: number
  totalPrice: number
} | null {
  if (!selection.carId) return null
  const car = catalog.getCarById(selection.carId)
  if (!car) return null
  return computeBuildFigures(car, selection.specChoices, selection.modIds, {
    year: selection.year,
    market,
  })
}

export function buildSummaryText(
  selection: BuildSelection,
  market: Market = getMarket(),
): string | null {
  const car = selection.carId ? catalog.getCarById(selection.carId) : undefined
  if (!car || selection.year == null || !selection.colourId) return null
  const colour =
    car.colours.find((c) => c.id === selection.colourId)?.name ?? '—'
  const figures = computeBuildFigures(
    car,
    selection.specChoices,
    selection.modIds,
    { year: selection.year, market },
  )
  const options = resolveSpecChoices(car, selection.specChoices).map(
    (c) => c.name,
  )
  const modLabels = selection.modIds.map((id) => {
    const mod = catalog.getModById(id)
    return mod ? `${mod.brand} ${mod.name} (${formatMoney(mod.price)})` : id
  })
  return formatBuildSummary({
    year: selection.year,
    make: car.make,
    model: car.label,
    generation: car.generation,
    colourName: colour,
    optionLabels: options,
    modLabels,
    figures: figures.final,
    totalPrice: figures.totalPrice,
    market,
    figuresSource: figuresSourceLabel(car.figuresSource),
  })
}

export function initSpecChoicesForCar(carId: string): Record<string, string> {
  const car = catalog.getCarById(carId)
  if (!car) return {}
  const defaults: Record<string, string> = {}
  for (const group of car.specOptions) {
    defaults[group.id] = getDefaultSpecChoice(group).id
  }
  return defaults
}

export function openPrintableSummary(text: string, title: string): void {
  const w = window.open('', '_blank', 'noopener,noreferrer,width=720,height=900')
  if (!w) return
  w.document.write(`<!doctype html><html><head><title>${title}</title>
    <style>
      body { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; padding: 2rem; line-height: 1.5; color: #111; }
      pre { white-space: pre-wrap; }
      @media print { button { display: none; } }
    </style></head><body>
    <button onclick="window.print()">Print / Save as PDF</button>
    <pre>${text.replace(/</g, '&lt;')}</pre>
    </body></html>`)
  w.document.close()
}

export { formatMoney, formatTorque, figuresSourceLabel }
