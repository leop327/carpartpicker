import type { CarModel } from '../../types/catalog'
import { bmw135iE82N54 } from './bmw-135i-e82-n54'
import { bmw135iE82N55 } from './bmw-135i-e82-n55'
import { bmw1mE82 } from './bmw-1m-e82'
import { bmw335iE92N54 } from './bmw-335i-e92-n54'
import { bmw335iE92N55 } from './bmw-335i-e92-n55'
import { bmw340iF30 } from './bmw-340i-f30'
import { bmw435iF32 } from './bmw-435i-f32'
import { bmw440iF32 } from './bmw-440i-f32'
import { bmw530iE39 } from './bmw-530i-e39'
import { bmw535iF10 } from './bmw-535i-f10'
import { bmw540iG30 } from './bmw-540i-g30'
import { fleetCars } from './bmwFleet'
import { fleetDieselCars } from './bmwFleetDiesel'
import { fleetExtraCars } from './bmwFleetExtra'
import { fleetMoreCars } from './bmwFleetMore'
import { bmwM140iF20 } from './bmw-m140i-f20'
import { bmwM235iF22 } from './bmw-m235i-f22'
import { bmwM240iG42 } from './bmw-m240i-g42'
import { bmwM2CompetitionF87 } from './bmw-m2-competition-f87'
import { bmwM2F87 } from './bmw-m2-f87'
import { bmwM2G87 } from './bmw-m2-g87'
import { bmwM340iG20 } from './bmw-m340i-g20'
import { bmwM3CompetitionG80 } from './bmw-m3-competition-g80'
import { bmwM3F80 } from './bmw-m3-f80'
import { bmwM4CompetitionF82 } from './bmw-m4-competition-f82'
import { bmwM4CompetitionG82 } from './bmw-m4-competition-g82'
import { bmwM4F82 } from './bmw-m4-f82'
import { bmwM5E39 } from './bmw-m5-e39'
import { bmwX3M40iG01 } from './bmw-x3-m40i-g01'
import { bmwX5E5330d } from './bmw-x5-e53-30d'
import { bmwX5E5330i } from './bmw-x5-e53-30i'
import { bmwZ4M40iG29 } from './bmw-z4-m40i-g29'

/** Preferred display order for series chips / cards. */
const SERIES_ORDER = [
  '1 Series',
  '2 Series',
  '3 Series',
  '4 Series',
  '5 Series',
  '6 Series',
  '7 Series',
  '8 Series',
  'Z3',
  'Z4',
  'Z8',
  'X1',
  'X3',
  'X4',
  'X5',
  'X6',
  'X7',
  'XM',
]

/**
 * Hand-tuned cars first (richer specs / figures), then fleet fillers.
 * Duplicate ids are dropped — hand-tuned wins.
 */
const curated: CarModel[] = [
  bmw1mE82,
  bmw135iE82N54,
  bmw135iE82N55,
  bmw335iE92N54,
  bmw335iE92N55,
  bmwM2F87,
  bmwM2CompetitionF87,
  bmwM2G87,
  bmwM3F80,
  bmwM3CompetitionG80,
  bmwM4F82,
  bmwM4CompetitionF82,
  bmwM4CompetitionG82,
  bmwM5E39,
  bmw530iE39,
  bmwM140iF20,
  bmwM235iF22,
  bmwM240iG42,
  bmw340iF30,
  bmw435iF32,
  bmw440iF32,
  bmwM340iG20,
  bmw535iF10,
  bmw540iG30,
  bmwZ4M40iG29,
  bmwX3M40iG01,
  bmwX5E5330i,
  bmwX5E5330d,
]

function mergeCars(primary: CarModel[], extra: CarModel[]): CarModel[] {
  const seen = new Set(primary.map((c) => c.id))
  const merged = [...primary]
  for (const car of extra) {
    if (seen.has(car.id)) continue
    if (car.baseFigures.engineSizeL < 3.0) continue
    seen.add(car.id)
    merged.push(car)
  }
  return merged
}

/**
 * Register new cars here only.
 * UI reads from this list — no page changes needed for new models.
 * Catalog rule: 3.0L+ petrol and diesel only.
 */
const allCars: CarModel[] = [
  mergeCars(curated, fleetCars),
  fleetMoreCars,
  fleetDieselCars,
  fleetExtraCars,
]
  .reduce((acc, list) => mergeCars(acc, list), [] as CarModel[])
  .filter((c) => c.baseFigures.engineSizeL >= 3.0)

/**
 * Temporary focus catalogue — flip to `false` to restore the full fleet.
 * Keeps 1–4 Series with N54 / N55 / B58 / S55 / S58 only.
 */
const CATALOG_FOCUS_ENABLED = true
const CATALOG_FOCUS_SERIES = new Set([
  '1 Series',
  '2 Series',
  '3 Series',
  '4 Series',
])
const CATALOG_FOCUS_ENGINES = new Set([
  'n54',
  'n55',
  'b58',
  's55',
  's58',
])

function matchesCatalogFocus(car: CarModel): boolean {
  if (!CATALOG_FOCUS_SERIES.has(car.series)) return false
  return car.modTags.some((tag) => CATALOG_FOCUS_ENGINES.has(tag))
}

export const cars: CarModel[] = CATALOG_FOCUS_ENABLED
  ? allCars.filter(matchesCatalogFocus)
  : allCars

export function getCarById(id: string): CarModel | undefined {
  return cars.find((car) => car.id === id)
}

export function getMakes(): string[] {
  return [...new Set(cars.map((c) => c.make))].sort()
}

export function getCarsByMake(make: string): CarModel[] {
  return cars.filter((c) => c.make === make)
}

export function getSeriesList(): string[] {
  const present = new Set(cars.map((c) => c.series))
  const ordered = SERIES_ORDER.filter((s) => present.has(s))
  const extras = [...present].filter((s) => !SERIES_ORDER.includes(s)).sort()
  return [...ordered, ...extras]
}

export function getCarsBySeries(series: string): CarModel[] {
  return cars.filter((c) => c.series === series)
}

export function getChassisBySeries(series: string): string[] {
  const gens = [...new Set(getCarsBySeries(series).map((c) => c.generation))]
  return gens.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

export function getCarsBySeriesAndChassis(
  series: string,
  chassis: string,
): CarModel[] {
  return getCarsBySeries(series)
    .filter((c) => c.generation === chassis)
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }))
}

export function seriesMeta(series: string): {
  series: string
  count: number
  image: string
  chassisCount: number
} {
  const list = getCarsBySeries(series)
  return {
    series,
    count: list.length,
    image: list[0]?.image ?? '',
    chassisCount: getChassisBySeries(series).length,
  }
}

export function chassisMeta(
  series: string,
  chassis: string,
): {
  chassis: string
  count: number
  image: string
  yearsLabel: string
} {
  const list = getCarsBySeriesAndChassis(series, chassis)
  const years = list.flatMap((c) => c.years)
  const min = years.length ? Math.min(...years) : 0
  const max = years.length ? Math.max(...years) : 0
  return {
    chassis,
    count: list.length,
    image: list[0]?.image ?? '',
    yearsLabel: years.length ? `${min}–${max}` : '',
  }
}
