import { catalog } from '../data/catalog'
import {
  emptySelection,
  type PersistedBuild,
} from './buildState'
import type { CarModel } from '../types/catalog'

export interface DvlaLookupResult {
  registrationNumber: string
  make: string | null
  fuelType: string | null
  engineCapacity: number | null
  cylinderCapacity: number | null
  yearOfManufacture: number | null
  co2Emissions: number | null
  colour: string | null
  engineFamily: string | null
  engineTags: string[]
  engineConfidence: string
  engineNote: string
  demo?: boolean
}

function yearFits(car: CarModel, year: number | null): boolean {
  if (year == null) return true
  if (car.years.includes(year)) return true
  return car.years.some((y) => Math.abs(y - year) <= 1)
}

function capacityFits(car: CarModel, cc: number | null): boolean {
  if (cc == null) return true
  const litres = cc / 1000
  return Math.abs(car.baseFigures.engineSizeL - litres) <= 0.2
}

/** Snap DVLA year onto the nearest catalogue year so colour step is unlocked. */
function resolveYear(car: CarModel, year: number | null): number {
  if (car.years.length === 0) return year ?? new Date().getFullYear()
  if (year != null && car.years.includes(year)) return year
  if (year != null) {
    return car.years.reduce((best, y) =>
      Math.abs(y - year) < Math.abs(best - year) ? y : best,
    )
  }
  return car.years[Math.floor(car.years.length / 2)] ?? car.years[0]
}

function matchColourId(car: CarModel, colourName: string | null): string | null {
  if (!colourName) return null
  const needle = colourName.trim().toLowerCase()
  if (!needle) return null
  const exact = car.colours.find((c) => c.name.toLowerCase() === needle)
  if (exact) return exact.id
  const partial = car.colours.find(
    (c) =>
      c.name.toLowerCase().includes(needle) ||
      needle.includes(c.name.toLowerCase().split(/\s+/)[0] ?? ''),
  )
  return partial?.id ?? null
}

function scoreCar(car: CarModel, data: DvlaLookupResult): number {
  let score = 0
  const year = data.yearOfManufacture
  if (year != null && car.years.includes(year)) score += 5
  else if (yearFits(car, year)) score += 2

  if (data.engineTags.length) {
    const hits = data.engineTags.filter((t) => car.modTags.includes(t)).length
    score += hits * 4
  }

  if (capacityFits(car, data.engineCapacity)) score += 2

  const code = car.baseFigures.engineCode.toUpperCase()
  if (data.engineFamily && code.startsWith(data.engineFamily.toUpperCase())) {
    score += 3
  }

  return score
}

function draftForCar(car: CarModel, data: DvlaLookupResult): PersistedBuild {
  const year = resolveYear(car, data.yearOfManufacture)
  return {
    v: 2,
    stage: 'colour',
    selection: {
      ...emptySelection(),
      make: car.make,
      series: car.series,
      chassis: car.generation,
      carId: car.id,
      year,
      colourId: matchColourId(car, data.colour),
    },
  }
}

/**
 * Turn a DVLA + engine-inference payload into a draft build the wizard can open.
 * When a car is identified, jump straight to the colour step.
 */
export function buildFromDvla(data: DvlaLookupResult): PersistedBuild {
  const makeRaw = (data.make || '').trim()
  const isBmw = /bmw/i.test(makeRaw)

  if (!isBmw) {
    return {
      v: 2,
      stage: 'series',
      selection: emptySelection(),
    }
  }

  const tagged = catalog.cars.filter((car) => {
    if (car.make.toUpperCase() !== 'BMW') return false
    if (!yearFits(car, data.yearOfManufacture)) return false
    if (!capacityFits(car, data.engineCapacity)) return false
    if (data.engineTags.length === 0) return true
    return data.engineTags.some((t) => car.modTags.includes(t))
  })

  const ranked = [...tagged].sort(
    (a, b) => scoreCar(b, data) - scoreCar(a, data),
  )
  const bestScore = ranked[0] ? scoreCar(ranked[0], data) : 0

  // Best catalogue match → colour (year snapped so the step is valid).
  if (ranked[0] && bestScore > 0) {
    const tied = ranked.filter((c) => scoreCar(c, data) === bestScore)
    // Unique winner, or clear engine-family hit — treat as "known car".
    if (
      tied.length === 1 ||
      data.engineConfidence === 'high' ||
      data.engineConfidence === 'medium'
    ) {
      return draftForCar(ranked[0], data)
    }
  }

  if (ranked.length > 1 && bestScore > 0) {
    const series = [...new Set(ranked.map((c) => c.series))]
    const chassis = [...new Set(ranked.map((c) => c.generation))]
    if (series.length === 1 && chassis.length === 1) {
      return {
        v: 2,
        stage: 'model',
        selection: {
          ...emptySelection(),
          make: 'BMW',
          series: series[0],
          chassis: chassis[0],
        },
      }
    }
    if (series.length === 1) {
      return {
        v: 2,
        stage: 'chassis',
        selection: {
          ...emptySelection(),
          make: 'BMW',
          series: series[0],
        },
      }
    }
  }

  return {
    v: 2,
    stage: 'series',
    selection: {
      ...emptySelection(),
      make: 'BMW',
    },
  }
}

export function formatPlate(vrm: string): string {
  const clean = vrm.toUpperCase().replace(/[^A-Z0-9]/g, '')
  // Current-style plates: AA00AAA → AA00 AAA
  if (/^[A-Z]{2}\d{2}[A-Z]{3}$/.test(clean)) {
    return `${clean.slice(0, 4)} ${clean.slice(4)}`
  }
  return clean
}
