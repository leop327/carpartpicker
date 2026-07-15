import type {
  CarModel,
  Figures,
  FiguresDelta,
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
      return group.choices.find((c) => c.id === selectedId) ?? getDefaultSpecChoice(group)
    }
    return getDefaultSpecChoice(group)
  })
}

function applyDelta(figures: Figures, delta?: FiguresDelta): Figures {
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

export function computeBuildFigures(
  car: CarModel,
  specChoices: Record<string, string>,
  modIds: string[],
): {
  base: Figures
  configured: Figures
  final: Figures
  configuredPrice: number
  modsPrice: number
  totalPrice: number
} {
  const base = { ...car.baseFigures }
  const resolved = resolveSpecChoices(car, specChoices)

  let configured = { ...base }
  let configuredPrice = car.basePrice

  for (const choice of resolved) {
    configured = applyDelta(configured, choice.figuresDelta)
    configuredPrice += choice.price
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
    configuredPrice,
    modsPrice,
    totalPrice: configuredPrice + modsPrice,
  }
}

export function formatMoney(usd: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(usd)
}

export function formatTorque(nm: number): string {
  const lbft = Math.round(nm * 0.73756)
  return `${nm} Nm / ${lbft} lb-ft`
}
