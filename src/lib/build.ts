import type {
  CarModel,
  Figures,
  FiguresDelta,
  Market,
  SpecChoice,
  SpecOptionGroup,
} from '../types/catalog'
import { catalog } from '../data/catalog'

export function getDefaultSpecChoice(group: SpecOptionGroup): SpecChoice {
  return group.choices.find((c) => c.isDefault) ?? group.choices[0]
}

/** Resolve each group to a choice — unpicked groups use base/default. */
export function resolveSpecChoices(
  car: CarModel,
  specChoices: Record<string, string>,
): SpecChoice[] {
  return car.specOptions.map((group) => {
    const selectedId = specChoices[group.id]
    if (selectedId) {
      return (
        group.choices.find((c) => c.id === selectedId) ??
        getDefaultSpecChoice(group)
      )
    }
    return getDefaultSpecChoice(group)
  })
}

export function applyDelta(figures: Figures, delta?: FiguresDelta): Figures {
  if (!delta) return figures
  return {
    ...figures,
    hp: figures.hp + (delta.hp ?? 0),
    torqueNm: figures.torqueNm + (delta.torqueNm ?? 0),
    zeroToSixtySec: Math.max(
      1.5,
      Number((figures.zeroToSixtySec + (delta.zeroToSixtySec ?? 0)).toFixed(2)),
    ),
    weightKg: Math.max(500, figures.weightKg + (delta.weightKg ?? 0)),
    drivetrain: delta.drivetrain ?? figures.drivetrain,
    engineSizeL: delta.engineSizeL ?? figures.engineSizeL,
    engineCode: delta.engineCode ?? figures.engineCode,
  }
}

/** Base factory figures for a car/year/market before options & mods. */
export function resolveBaseFigures(
  car: CarModel,
  year: number | null | undefined,
  market: Market = 'uk',
): Figures {
  let figures = { ...car.baseFigures }
  if (year != null && car.yearFigures?.[year]) {
    figures = applyDelta(figures, car.yearFigures[year])
  }
  if (market === 'uk' && car.euFiguresDelta) {
    figures = applyDelta(figures, car.euFiguresDelta)
  }
  return figures
}

export function resolveBasePrice(car: CarModel, market: Market = 'uk'): number {
  if (market === 'uk' && car.euBasePrice != null) return car.euBasePrice
  return car.basePrice
}

export function computeBuildFigures(
  car: CarModel,
  specChoices: Record<string, string>,
  modIds: string[],
  opts?: { year?: number | null; market?: Market },
): {
  base: Figures
  configured: Figures
  final: Figures
  configuredPrice: number
  modsPrice: number
  totalPrice: number
} {
  const market = opts?.market ?? 'uk'
  const base = resolveBaseFigures(car, opts?.year, market)
  const resolved = resolveSpecChoices(car, specChoices)

  let configured = { ...base }
  for (const choice of resolved) {
    configured = applyDelta(configured, choice.figuresDelta)
  }

  let final = { ...configured }
  let modsPrice = 0
  for (const modId of modIds) {
    const mod = catalog.getModById(modId)
    if (!mod) continue
    final = applyDelta(final, mod.figuresDelta)
    modsPrice += mod.price
  }

  return {
    base,
    configured,
    final,
    configuredPrice: 0,
    modsPrice,
    totalPrice: modsPrice,
  }
}

export function formatMoney(gbp: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(gbp)
}

export function formatTorque(nm: number): string {
  const lbft = Math.round(nm * 0.73756)
  return `${nm} Nm / ${lbft} lb-ft`
}

export function figuresSourceLabel(
  source: 'oem' | 'estimated' | 'tuner' | undefined,
): string {
  switch (source) {
    case 'oem':
      return 'OEM'
    case 'tuner':
      return 'Tuner claim'
    case 'estimated':
      return 'Estimated'
    default:
      return 'Estimated'
  }
}

export function formatBuildSummary(input: {
  year: number
  make: string
  model: string
  generation: string
  colourName: string
  optionLabels: string[]
  modLabels: string[]
  figures: Figures
  totalPrice: number
  market?: Market
  figuresSource?: string
}): string {
  const accel = '0–62 mph'
  const lines = [
    `CarPartPicker build`,
    `${input.year} ${input.make} ${input.model} (${input.generation})`,
    `Colour: ${input.colourName}`,
    `Market: UK`,
    input.figuresSource ? `Figures: ${input.figuresSource}` : '',
    '',
    'Factory options:',
    ...(input.optionLabels.length
      ? input.optionLabels.map((l) => `  - ${l}`)
      : ['  - Base spec']),
    '',
    'Mods:',
    ...(input.modLabels.length
      ? input.modLabels.map((l) => `  - ${l}`)
      : ['  - None']),
    '',
    'Figures:',
    `  Power: ${input.figures.hp} hp`,
    `  Torque: ${formatTorque(input.figures.torqueNm)}`,
    `  ${accel}: ${input.figures.zeroToSixtySec.toFixed(2)} s`,
    `  Weight: ${input.figures.weightKg} kg`,
    `  Drivetrain: ${input.figures.drivetrain}`,
    `  Engine: ${input.figures.engineSizeL.toFixed(1)} L · ${input.figures.engineCode}`,
    '',
    `Mods total: ${formatMoney(input.totalPrice)}`,
  ]
  return lines.filter((l) => l !== undefined).join('\n')
}
