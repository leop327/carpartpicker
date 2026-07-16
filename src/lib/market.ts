import type { Market } from '../types/catalog'

const MARKET_KEY = 'carpartpicker:market'

export function getMarket(): Market {
  try {
    const raw = localStorage.getItem(MARKET_KEY)
    if (raw === 'eu' || raw === 'us') return raw
  } catch {
    // ignore
  }
  return 'us'
}

export function setMarket(market: Market): void {
  try {
    localStorage.setItem(MARKET_KEY, market)
  } catch {
    // ignore
  }
}

export function marketLabel(market: Market): string {
  return market === 'eu' ? 'EU' : 'US'
}

export function accelLabel(market: Market): string {
  return market === 'eu' ? '0–100 km/h' : '0–60 mph'
}
