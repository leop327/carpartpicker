import { catalog } from '../data/catalog'
import {
  computeBuildFigures,
  formatBuildSummary,
  formatMoney,
  formatTorque,
  getDefaultSpecChoice,
  resolveSpecChoices,
} from './build'
import type { BuildSelection, Figures } from '../types/catalog'

export function figuresFromSelection(selection: BuildSelection): {
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
  return computeBuildFigures(car, selection.specChoices, selection.modIds)
}

export function buildSummaryText(selection: BuildSelection): string | null {
  const car = selection.carId ? catalog.getCarById(selection.carId) : undefined
  if (!car || selection.year == null || !selection.colourId) return null
  const colour =
    car.colours.find((c) => c.id === selection.colourId)?.name ?? '—'
  const figures = computeBuildFigures(
    car,
    selection.specChoices,
    selection.modIds,
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

export { formatMoney, formatTorque }
