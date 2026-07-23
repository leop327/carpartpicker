/**
 * Owner counts + popular mods per chassis — seeded + local owned builds.
 */

import { catalog } from '../data/catalog'
import { listSavedBuilds } from './savedBuilds'

const OWNED_CLAIM_KEY = 'carpartpicker:owned-claims:v1'

/** Seeded owner counts so empty garages still show social proof. */
const SEED_OWNERS: Record<string, number> = {
  'bmw-135i-e82-n54': 128,
  'bmw-135i-e82-n55': 94,
  'bmw-m140i-f20': 210,
  'bmw-m2-f87': 176,
  'bmw-m2-competition-f87': 142,
  'bmw-m2-g87': 88,
  'bmw-m3-f80': 156,
  'bmw-m4-f82': 134,
  'bmw-m235i-f22': 67,
  'bmw-340i-f30': 73,
}

const SEED_POPULAR: Record<string, { modId: string; count: number }[]> = {
  'bmw-m2-f87': [
    { modId: 'mhd-super-n55', count: 98 },
    { modId: 'maxton-splitter-v3-f87', count: 64 },
  ],
  'bmw-m2-competition-f87': [
    { modId: 'mhd-super-s55', count: 81 },
    { modId: 'autoid-gts-splitter-f87c', count: 52 },
  ],
  'bmw-m2-g87': [
    { modId: 'mhd-super-s58', count: 61 },
    { modId: 'maxton-splitter-v1-g87', count: 44 },
  ],
  'bmw-135i-e82-n54': [
    { modId: 'mhd-stage2-n54', count: 72 },
    { modId: 'vrsf-dp-n54', count: 58 },
  ],
  'bmw-m140i-f20': [
    { modId: 'mhd-stage2-b58', count: 120 },
    { modId: 'csf-fmic-b58', count: 88 },
  ],
  'bmw-m3-f80': [{ modId: 'mhd-super-s55', count: 90 }],
}

function readClaims(): string[] {
  try {
    const raw = localStorage.getItem(OWNED_CLAIM_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as string[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeClaims(ids: string[]): void {
  try {
    localStorage.setItem(OWNED_CLAIM_KEY, JSON.stringify([...new Set(ids)]))
  } catch {
    // ignore
  }
}

/** Lightweight “I have this car” without full owned registration flow. */
export function claimOwnership(carId: string): void {
  writeClaims([...readClaims(), carId])
  window.dispatchEvent(new CustomEvent('cpp:owners-changed'))
}

export function unclaimOwnership(carId: string): void {
  writeClaims(readClaims().filter((id) => id !== carId))
  window.dispatchEvent(new CustomEvent('cpp:owners-changed'))
}

export function hasClaimedCar(carId: string): boolean {
  return readClaims().includes(carId)
}

export function getOwnerCount(carId: string): number {
  const seed = SEED_OWNERS[carId] ?? 12
  const claims = readClaims().filter((id) => id === carId).length
  const ownedBuilds = listSavedBuilds().filter(
    (b) => b.ownership === 'owned' && b.build.selection.carId === carId,
  ).length
  return seed + claims + ownedBuilds
}

export function getPopularModsForCar(
  carId: string,
  limit = 5,
): { modId: string; count: number; label: string }[] {
  const counts = new Map<string, number>()
  for (const row of SEED_POPULAR[carId] ?? []) {
    counts.set(row.modId, (counts.get(row.modId) ?? 0) + row.count)
  }
  for (const build of listSavedBuilds()) {
    if (build.build.selection.carId !== carId) continue
    for (const modId of build.build.selection.modIds) {
      counts.set(modId, (counts.get(modId) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([modId, count]) => {
      const mod = catalog.getModById(modId)
      return {
        modId,
        count,
        label: mod ? `${mod.brand} ${mod.name}` : modId,
      }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}
