import { catalog } from '../data/catalog'
import {
  emptySelection,
  type BuildStage,
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

/**
 * Turn a DVLA + engine-inference payload into a draft build the wizard can open.
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
  const top = ranked.filter((c) => scoreCar(c, data) === bestScore && bestScore > 0)

  if (top.length === 1) {
    const car = top[0]
    const year =
      data.yearOfManufacture != null && car.years.includes(data.yearOfManufacture)
        ? data.yearOfManufacture
        : null
    const stage: BuildStage = year != null ? 'colour' : 'year'
    return {
      v: 2,
      stage,
      selection: {
        ...emptySelection(),
        make: car.make,
        series: car.series,
        chassis: car.generation,
        carId: car.id,
        year,
      },
    }
  }

  if (top.length > 1) {
    const series = [...new Set(top.map((c) => c.series))]
    const chassis = [...new Set(top.map((c) => c.generation))]
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
