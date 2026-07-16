import type { Market } from '../types/catalog'

/** App is UK-only for now. */
export const MARKET: Market = 'uk'

export function getMarket(): Market {
  return MARKET
}

export function marketLabel(_market: Market = MARKET): string {
  return 'UK'
}

/** BMW UK lists 0–62 mph (≈ 0–100 km/h). */
export function accelLabel(_market: Market = MARKET): string {
  return '0–62 mph'
}
