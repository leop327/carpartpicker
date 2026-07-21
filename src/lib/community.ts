import { catalog } from '../data/catalog'
import type { BuildSelection } from '../types/catalog'
import { figuresFromSelection } from './selection'
import { MARKET } from './market'
import { estimateQuarterMileSec } from './quarterMile'
import type { SavedBuild } from './savedBuilds'
import { selectionLabel } from './savedBuilds'

export interface CommunityBuildSnapshot {
  carId: string
  carLabel: string
  year: number
  colourName: string
  colourHex: string
  image: string
  hp: number
  zeroToSixtySec: number
  quarterMileSec: number
  torqueNm: number
  weightKg: number
  modsPrice: number
  modCount: number
  modLabels: string[]
}

export interface CommunityBuild {
  id: string
  /** Local saved-build id when published from this browser. */
  sourceSavedId?: string
  authorName: string
  title: string
  caption?: string
  publishedAt: string
  selection: BuildSelection
  snapshot: CommunityBuildSnapshot
  seeded?: boolean
}

const COMMUNITY_KEY = 'carpartpicker:community:v1'

function snapshotFromSelection(
  selection: BuildSelection,
): CommunityBuildSnapshot | null {
  if (!selection.carId || selection.year == null || !selection.colourId) {
    return null
  }
  const car = catalog.getCarById(selection.carId)
  if (!car) return null
  const colour = car.colours.find((c) => c.id === selection.colourId)
  const figures = figuresFromSelection(selection, MARKET)
  if (!figures || !colour) return null
  const modLabels = selection.modIds
    .map((id) => {
      const mod = catalog.getModById(id)
      return mod ? `${mod.brand} ${mod.name}` : null
    })
    .filter((x): x is string => Boolean(x))

  return {
    carId: car.id,
    carLabel: `${car.make} ${car.label}`,
    year: selection.year,
    colourName: colour.name,
    colourHex: colour.hex,
    image: car.image,
    hp: figures.final.hp,
    zeroToSixtySec: figures.final.zeroToSixtySec,
    quarterMileSec: estimateQuarterMileSec(figures.final),
    torqueNm: figures.final.torqueNm,
    weightKg: figures.final.weightKg,
    modsPrice: figures.modsPrice,
    modCount: selection.modIds.length,
    modLabels,
  }
}

function seedSelection(
  carId: string,
  year: number,
  colourId: string,
  modIds: string[],
): BuildSelection {
  const car = catalog.getCarById(carId)
  return {
    make: car?.make ?? 'BMW',
    series: car?.series ?? null,
    chassis: car?.generation ?? null,
    carId,
    year,
    colourId,
    specChoices: {},
    modIds,
  }
}

function makeSeed(
  id: string,
  authorName: string,
  title: string,
  caption: string,
  selection: BuildSelection,
  publishedAt: string,
): CommunityBuild | null {
  const snapshot = snapshotFromSelection(selection)
  if (!snapshot) return null
  return {
    id,
    authorName,
    title,
    caption,
    publishedAt,
    selection,
    snapshot,
    seeded: true,
  }
}

export function getSeededCommunityBuilds(): CommunityBuild[] {
  const seeds = [
    makeSeed(
      'seed-m2c-stage2',
      'Jess · Manchester',
      'Weekend M2 Comp',
      'Stage 2 street setup — still dailyable.',
      seedSelection('bmw-m2-competition-f87', 2019, 'black-sapphire', [
        'vrsf-catted-dp-s55',
        'eventuri-s55',
        'vrsf-chargepipe-s55',
        'bootmod3-stage2-s55',
        'csf-ic-s55',
      ]),
      '2026-03-12T10:00:00.000Z',
    ),
    makeSeed(
      'seed-n54-stage2',
      'Omar · London',
      'E82 N54 Stage 2',
      'Classic twin-turbo chaos. E85 when I can get it.',
      seedSelection('bmw-135i-e82-n54', 2011, 'crimson-red', [
        'vrsf-dp-n54',
        'afe-momentum-n54',
        'vrsf-chargepipe-n54',
        'mhd-stage2-n54',
        'autotech-hpfp-n54',
      ]),
      '2026-04-02T14:30:00.000Z',
    ),
    makeSeed(
      'seed-m140i-stage2',
      'Priya · Birmingham',
      'F20 M140i wake-up',
      'B58 Stage 2 + FMIC. Quiet cabin, loud numbers.',
      seedSelection('bmw-m140i-f20', 2018, 'estoril-blue', [
        'vrsf-dp-b58',
        'mst-intake-b58',
        'vrsf-chargepipe-b58',
        'bootmod3-stage2-b58',
        'vrsf-fmic-b58',
      ]),
      '2026-05-18T09:15:00.000Z',
    ),
    makeSeed(
      'seed-m3-stage1',
      'Tom · Bristol',
      'F80 M3 Stage 1',
      'Eventuri + Stage 1 — OEM+ for the ring days.',
      seedSelection('bmw-m3-f80', 2017, 'yas-marina-blue', [
        'eventuri-s55',
        'bootmod3-stage1-s55',
      ]),
      '2026-06-01T16:45:00.000Z',
    ),
    makeSeed(
      'seed-m4-stage2',
      'Alex · Leeds',
      'F82 M4 Stage 2',
      'Full Stage 2 stack. Drag strip nights only.',
      seedSelection('bmw-m4-f82', 2016, 'sakhir-orange', [
        'vrsf-catted-dp-s55',
        'eventuri-s55',
        'vrsf-chargepipe-s55',
        'bootmod3-stage2-s55',
        'csf-ic-s55',
      ]),
      '2026-06-22T11:20:00.000Z',
    ),
  ]
  return seeds.filter((s): s is CommunityBuild => Boolean(s))
}

function readLocal(): CommunityBuild[] {
  try {
    const raw = localStorage.getItem(COMMUNITY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CommunityBuild[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter((b) => b?.id && b?.snapshot && b?.selection)
  } catch {
    return []
  }
}

function writeLocal(builds: CommunityBuild[]) {
  localStorage.setItem(COMMUNITY_KEY, JSON.stringify(builds))
}

export function listCommunityBuilds(): CommunityBuild[] {
  const seeds = getSeededCommunityBuilds()
  const local = readLocal()
  const seedIds = new Set(seeds.map((s) => s.id))
  const merged = [...local.filter((b) => !seedIds.has(b.id)), ...seeds]
  return merged.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

export function getCommunityBuild(id: string): CommunityBuild | undefined {
  return listCommunityBuilds().find((b) => b.id === id)
}

export function findCommunityBySavedId(
  savedId: string,
): CommunityBuild | undefined {
  return readLocal().find((b) => b.sourceSavedId === savedId)
}

export function publishOwnedBuild(
  saved: SavedBuild,
  opts: { authorName: string; caption?: string },
): CommunityBuild | null {
  if (saved.ownership !== 'owned') return null
  const snapshot = snapshotFromSelection(saved.build.selection)
  if (!snapshot) return null

  const authorName = opts.authorName.trim() || 'Anonymous'
  const caption = opts.caption?.trim() || undefined
  const existing = findCommunityBySavedId(saved.id)
  const entry: CommunityBuild = {
    id: existing?.id ?? crypto.randomUUID(),
    sourceSavedId: saved.id,
    authorName,
    title: saved.name.trim() || selectionLabel(saved.build.selection),
    caption,
    publishedAt: new Date().toISOString(),
    selection: structuredClone(saved.build.selection),
    snapshot,
  }

  const rest = readLocal().filter(
    (b) => b.id !== entry.id && b.sourceSavedId !== saved.id,
  )
  writeLocal([entry, ...rest])
  return entry
}

export function unpublishBySavedId(savedId: string): boolean {
  const before = readLocal()
  const next = before.filter((b) => b.sourceSavedId !== savedId)
  if (next.length === before.length) return false
  writeLocal(next)
  return true
}
