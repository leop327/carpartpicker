import type { Figures } from '../types/catalog'

/**
 * Estimate 1/4-mile ET (seconds) from power, weight, and 0–62.
 * Tuned for street-car ballpark times — not a dyno sheet.
 */
export function estimateQuarterMileSec(input: {
  hp: number
  weightKg: number
  zeroToSixtySec: number
}): number {
  const weightLbs = Math.max(input.weightKg, 500) * 2.20462
  const hp = Math.max(input.hp, 50)
  // Classic power/weight ET approximation
  let et = 5.825 * Math.pow(weightLbs / hp, 1 / 3)
  // Pull ET with 0–62 so sprint mods still matter
  const expectedSixty = 0.28 * Math.pow(weightLbs / hp, 0.78) + 1.35
  et += (input.zeroToSixtySec - expectedSixty) * 0.52
  return Number(Math.max(9.4, Math.min(18.5, et)).toFixed(2))
}

export function quarterMileFromFigures(figures: Figures): number {
  return estimateQuarterMileSec(figures)
}
