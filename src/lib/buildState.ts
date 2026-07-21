import { catalog } from '../data/catalog'
import { getDefaultSpecChoice } from './build'
import type { BuildSelection } from '../types/catalog'

export type BuildStage =
  | 'series'
  | 'chassis'
  | 'model'
  | 'year'
  | 'colour'
  | 'options'
  | 'mods'
  | 'checkout'

export interface PersistedBuild {
  v: 2
  stage: BuildStage
  selection: BuildSelection
}

const STORAGE_KEY = 'carpartpicker:draft:v2'
export const BUILD_URL_PARAM = 'b'
/** Present on shared links — recipient can view but not edit. */
export const VIEW_URL_PARAM = 'view'

const STAGES: BuildStage[] = [
  'series',
  'chassis',
  'model',
  'year',
  'colour',
  'options',
  'mods',
  'checkout',
]

/** Older drafts used `brand` instead of `series`. */
function normalizeStage(stage: string | undefined): BuildStage {
  if (stage === 'brand') return 'series'
  if (stage && STAGES.includes(stage as BuildStage)) return stage as BuildStage
  return 'series'
}

function hydrateSeriesChassis(selection: BuildSelection): BuildSelection {
  const next = {
    ...selection,
    series: selection.series ?? null,
    chassis: selection.chassis ?? null,
  }
  if (next.carId) {
    const car = catalog.getCarById(next.carId)
    if (car) {
      next.make = car.make
      next.series = car.series
      next.chassis = car.generation
    }
  }
  return next
}

export function emptySelection(): BuildSelection {
  return {
    make: null,
    series: null,
    chassis: null,
    carId: null,
    year: null,
    colourId: null,
    specChoices: {},
    modIds: [],
  }
}

function toBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(encoded: string): string {
  const padded = encoded.replace(/-/g, '+').replace(/_/g, '/')
  const pad =
    padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
  const binary = atob(padded + pad)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function sanitizeBuild(
  stage: BuildStage,
  selection: BuildSelection,
): PersistedBuild {
  let next = hydrateSeriesChassis({
    ...selection,
    specChoices: { ...selection.specChoices },
    modIds: [...(selection.modIds ?? [])],
  })
  let nextStage: BuildStage = normalizeStage(stage)

  if (next.series && !catalog.getSeriesList().includes(next.series)) {
    next = emptySelection()
    nextStage = 'series'
  }

  if (
    next.series &&
    next.chassis &&
    !catalog.getChassisBySeries(next.series).includes(next.chassis)
  ) {
    next = {
      ...emptySelection(),
      make: next.make,
      series: next.series,
    }
    nextStage = 'chassis'
  }

  if (next.carId) {
    const car = catalog.getCarById(next.carId)
    if (
      !car ||
      (next.series && car.series !== next.series) ||
      (next.chassis && car.generation !== next.chassis)
    ) {
      next = {
        ...emptySelection(),
        make: next.make,
        series: next.series,
        chassis: next.chassis,
      }
      nextStage = next.chassis ? 'model' : next.series ? 'chassis' : 'series'
    } else {
      next.make = car.make
      next.series = car.series
      next.chassis = car.generation
      if (next.year && !car.years.includes(next.year)) {
        next.year = null
        next.colourId = null
        if (['colour', 'options', 'mods', 'checkout'].includes(nextStage)) {
          nextStage = 'year'
        }
      }
      if (next.colourId && !car.colours.some((c) => c.id === next.colourId)) {
        next.colourId = null
        if (['options', 'mods', 'checkout'].includes(nextStage)) {
          nextStage = 'colour'
        }
      }

      const specChoices: Record<string, string> = {}
      for (const group of car.specOptions) {
        const chosen = next.specChoices[group.id]
        const valid = group.choices.some((c) => c.id === chosen)
        specChoices[group.id] = valid
          ? chosen
          : getDefaultSpecChoice(group).id
      }
      next.specChoices = specChoices

      const available = new Set(
        catalog.getModsForCar(car.modTags).map((m) => m.id),
      )
      next.modIds = next.modIds.filter((id) => available.has(id))
    }
  } else if (
    ['year', 'colour', 'options', 'mods', 'checkout'].includes(nextStage)
  ) {
    nextStage = next.chassis ? 'model' : next.series ? 'chassis' : 'series'
  }

  if (!next.series && nextStage !== 'series') nextStage = 'series'
  if (
    next.series &&
    !next.chassis &&
    !['series', 'chassis'].includes(nextStage)
  ) {
    nextStage = 'chassis'
  }
  if (
    next.series &&
    next.chassis &&
    !next.carId &&
    !['series', 'chassis', 'model'].includes(nextStage)
  ) {
    nextStage = 'model'
  }
  if (
    next.carId &&
    !next.year &&
    ['colour', 'options', 'mods', 'checkout'].includes(nextStage)
  ) {
    nextStage = 'year'
  }
  if (
    next.carId &&
    next.year &&
    !next.colourId &&
    ['options', 'mods', 'checkout'].includes(nextStage)
  ) {
    nextStage = 'colour'
  }

  return { v: 2, stage: nextStage, selection: next }
}

export function encodeBuildParam(build: PersistedBuild): string {
  return toBase64Url(JSON.stringify(build))
}

export function decodeBuildParam(encoded: string): PersistedBuild | null {
  try {
    const parsed = JSON.parse(fromBase64Url(encoded)) as PersistedBuild & {
      stage?: string
    }
    if (parsed?.v !== 2 || !parsed.selection) return null
    return sanitizeBuild(normalizeStage(parsed.stage), parsed.selection)
  } catch {
    return null
  }
}

export function readBuildFromStorage(): PersistedBuild | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedBuild & { stage?: string }
    if (parsed?.v !== 2 || !parsed.selection) return null
    return sanitizeBuild(normalizeStage(parsed.stage), parsed.selection)
  } catch {
    return null
  }
}

export function writeBuildToStorage(build: PersistedBuild): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(build))
  } catch {
    // ignore
  }
}

export function clearBuildStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function hydrateBuildFromLocation(
  search: string,
): PersistedBuild | null {
  const params = new URLSearchParams(search)
  const fromUrl = params.get(BUILD_URL_PARAM)
  if (fromUrl) {
    const decoded = decodeBuildParam(fromUrl)
    if (decoded) return decoded
  }
  return readBuildFromStorage()
}

export function buildShareUrl(
  build: PersistedBuild,
  origin = window.location.origin,
): string {
  const url = new URL('/builds', origin)
  url.searchParams.set(BUILD_URL_PARAM, encodeBuildParam(build))
  return url.toString()
}

/** View-only share link — opens the build without editing or overwriting drafts. */
export function buildViewOnlyUrl(
  build: PersistedBuild,
  origin = window.location.origin,
): string {
  const url = new URL('/builds', origin)
  url.searchParams.set(BUILD_URL_PARAM, encodeBuildParam(build))
  url.searchParams.set(VIEW_URL_PARAM, '1')
  return url.toString()
}

export function isViewOnlySearch(search: string): boolean {
  return new URLSearchParams(search).get(VIEW_URL_PARAM) === '1'
}

export function syncBuildToUrl(
  build: PersistedBuild,
  opts?: { viewOnly?: boolean },
): void {
  const url = new URL(window.location.href)
  if (
    !build.selection.series &&
    !build.selection.carId &&
    build.stage === 'series'
  ) {
    url.searchParams.delete(BUILD_URL_PARAM)
    url.searchParams.delete(VIEW_URL_PARAM)
  } else {
    url.searchParams.set(BUILD_URL_PARAM, encodeBuildParam(build))
    if (opts?.viewOnly) url.searchParams.set(VIEW_URL_PARAM, '1')
    else url.searchParams.delete(VIEW_URL_PARAM)
  }
  window.history.replaceState(
    null,
    '',
    `${url.pathname}${url.search}${url.hash}`,
  )
}

export function isBuildCompleteEnough(selection: BuildSelection): boolean {
  return Boolean(selection.carId && selection.year && selection.colourId)
}

export function defaultNameForSelection(selection: BuildSelection): string {
  const car = selection.carId ? catalog.getCarById(selection.carId) : undefined
  if (!car || !selection.year) return 'Untitled build'
  return `${selection.year} ${car.make} ${car.label}`
}
