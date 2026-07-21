import type { CarModel, Colour } from '../types/catalog'

const CACHE_PREFIX = 'cpp-paint-v1:'
const memory = new Map<string, string>()

/** After a hard quota failure, skip Gemini for a few minutes. */
let skipGeminiUntil = 0

export type PaintImageRequest = {
  car: CarModel
  colour: Colour
  year: number
}

function cacheKey(req: PaintImageRequest): string {
  return `${CACHE_PREFIX}${req.car.id}:${req.colour.id}:${req.year}`
}

function readSession(key: string): string | null {
  try {
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function writeSession(key: string, dataUrl: string): void {
  try {
    sessionStorage.setItem(key, dataUrl)
  } catch {
    // quota — ignore
  }
}

export function getCachedPaintImage(req: PaintImageRequest): string | null {
  const key = cacheKey(req)
  return memory.get(key) ?? readSession(key)
}

export function isGeminiPaintPaused(): boolean {
  return Date.now() < skipGeminiUntil
}

export async function requestPaintedCarImage(
  req: PaintImageRequest,
  signal?: AbortSignal,
): Promise<string> {
  const key = cacheKey(req)
  const cached = getCachedPaintImage(req)
  if (cached) return cached

  if (isGeminiPaintPaused()) {
    throw new Error('Gemini paint paused (quota). Using local colour preview.')
  }

  const fuel = req.car.modTags.includes('diesel')
    ? 'diesel'
    : req.car.modTags.includes('petrol')
      ? 'petrol'
      : undefined

  const res = await fetch('/api/generate-car-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      imageUrl: req.car.image,
      year: req.year,
      make: req.car.make,
      label: req.car.label,
      generation: req.car.generation,
      colourName: req.colour.name,
      colourHex: req.colour.hex,
      fuel,
      engineCode: req.car.baseFigures.engineCode,
    }),
  })

  const json = (await res.json()) as { dataUrl?: string; error?: string }
  if (!res.ok || !json.dataUrl) {
    if (res.status === 429 || /quota|rate limit|billing/i.test(json.error || '')) {
      skipGeminiUntil = Date.now() + 10 * 60 * 1000
    }
    throw new Error(json.error || `Paint generation failed (${res.status})`)
  }

  memory.set(key, json.dataUrl)
  writeSession(key, json.dataUrl)
  return json.dataUrl
}
