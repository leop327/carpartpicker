import { catalog } from '../data/catalog'
import { getDefaultSpecChoice } from './build'
import type { BuildSelection } from '../types/catalog'

export type BuildStage =
  | 'brand'
  | 'model'
  | 'year'
  | 'colour'
  | 'options'
  | 'mods'

export interface PersistedBuild {
  v: 2
  stage: BuildStage
  selection: BuildSelection
}

const STORAGE_KEY = 'carpartpicker:draft:v2'
export const BUILD_URL_PARAM = 'b'

const STAGES: BuildStage[] = [
  'brand',
  'model',
  'year',
  'colour',
  'options',
  'mods',
]

export function emptySelection(): BuildSelection {
  return {
    make: null,
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
  let next = { ...selection, specChoices: { ...selection.specChoices } }
  let nextStage: BuildStage = STAGES.includes(stage) ? stage : 'brand'

  if (next.make && !catalog.getMakes().includes(next.make)) {
    next = emptySelection()
    nextStage = 'brand'
  }

  if (next.carId) {
    const car = catalog.getCarById(next.carId)
    if (!car || (next.make && car.make !== next.make)) {
      next = {
        ...emptySelection(),
        make: next.make,
      }
      nextStage = next.make ? 'model' : 'brand'
    } else {
      next.make = car.make
      if (next.year && !car.years.includes(next.year)) {
        next.year = null
        next.colourId = null
        if (['colour', 'options', 'mods'].includes(nextStage)) nextStage = 'year'
      }
      if (next.colourId && !car.colours.some((c) => c.id === next.colourId)) {
        next.colourId = null
        if (['options', 'mods'].includes(nextStage)) nextStage = 'colour'
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
  } else if (['year', 'colour', 'options', 'mods'].includes(nextStage)) {
    nextStage = next.make ? 'model' : 'brand'
  }

  if (!next.make && nextStage !== 'brand') nextStage = 'brand'
  if (next.make && !next.carId && !['brand', 'model'].includes(nextStage)) {
    nextStage = 'model'
  }
  if (next.carId && !next.year && ['colour', 'options', 'mods'].includes(nextStage)) {
    nextStage = 'year'
  }
  if (
    next.carId &&
    next.year &&
    !next.colourId &&
    ['options', 'mods'].includes(nextStage)
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
    const parsed = JSON.parse(fromBase64Url(encoded)) as PersistedBuild
    if (parsed?.v !== 2 || !parsed.selection) return null
    const stage = STAGES.includes(parsed.stage) ? parsed.stage : 'brand'
    return sanitizeBuild(stage, parsed.selection)
  } catch {
    return null
  }
}

export function readBuildFromStorage(): PersistedBuild | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedBuild
    if (parsed?.v !== 2 || !parsed.selection) return null
    const stage = STAGES.includes(parsed.stage) ? parsed.stage : 'brand'
    return sanitizeBuild(stage, parsed.selection)
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

export function syncBuildToUrl(build: PersistedBuild): void {
  const url = new URL(window.location.href)
  if (
    !build.selection.make &&
    !build.selection.carId &&
    build.stage === 'brand'
  ) {
    url.searchParams.delete(BUILD_URL_PARAM)
  } else {
    url.searchParams.set(BUILD_URL_PARAM, encodeBuildParam(build))
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
