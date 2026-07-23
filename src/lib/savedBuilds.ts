import type { BuildSelection } from '../types/catalog'
import {
  defaultNameForSelection,
  sanitizeBuild,
  type BuildStage,
  type PersistedBuild,
} from './buildState'

export type BuildOwnership = 'build' | 'owned'

export interface MaintenanceLogEntry {
  id: string
  /** Optional odometer reading (miles). */
  mileage?: number | null
  /** Optional service date (YYYY-MM-DD). */
  date?: string | null
  notes?: string
  createdAt: string
}

export interface OwnedVehicleInfo {
  /** UK registration — required for owned status. */
  registration: string
  nickname?: string
  purchaseDate?: string
  purchaseMileage?: number | null
  vin?: string
  colourNotes?: string
}

export type BuildVisibility = 'private' | 'public'

export interface SavedBuild {
  id: string
  name: string
  updatedAt: string
  build: PersistedBuild
  ownership: BuildOwnership
  ownedInfo?: OwnedVehicleInfo
  notes: string
  maintenanceLogs: MaintenanceLogEntry[]
  /** Profile visibility — private by default. */
  visibility: BuildVisibility
  /** Linked auth user when signed in. */
  ownerUserId?: string
  ownerUsername?: string
}

const SAVED_KEY = 'carpartpicker:saved:v2'

function normalizeReg(reg: string): string {
  return reg.replace(/\s+/g, '').toUpperCase()
}

export function formatRegistration(reg: string): string {
  const clean = normalizeReg(reg)
  if (clean.length <= 4) return clean
  // UK-style split: AB12 CDE → AB12 CDE
  if (/^[A-Z]{2}\d{2}[A-Z]{3}$/.test(clean)) {
    return `${clean.slice(0, 4)} ${clean.slice(4)}`
  }
  if (clean.length > 3) {
    return `${clean.slice(0, clean.length - 3)} ${clean.slice(-3)}`
  }
  return clean
}

function normalizeEntry(raw: Partial<SavedBuild> & { build: PersistedBuild }): SavedBuild {
  const cleaned = sanitizeBuild(raw.build.stage, raw.build.selection)
  const ownership: BuildOwnership =
    raw.ownership === 'owned' && raw.ownedInfo?.registration?.trim()
      ? 'owned'
      : 'build'
  return {
    id: raw.id || crypto.randomUUID(),
    name: raw.name?.trim() || defaultNameForSelection(cleaned.selection),
    updatedAt: raw.updatedAt || new Date().toISOString(),
    build: cleaned,
    ownership,
    ownedInfo:
      ownership === 'owned' && raw.ownedInfo?.registration
        ? {
            registration: normalizeReg(raw.ownedInfo.registration),
            nickname: raw.ownedInfo.nickname?.trim() || undefined,
            purchaseDate: raw.ownedInfo.purchaseDate || undefined,
            purchaseMileage:
              typeof raw.ownedInfo.purchaseMileage === 'number'
                ? raw.ownedInfo.purchaseMileage
                : null,
            vin: raw.ownedInfo.vin?.trim() || undefined,
            colourNotes: raw.ownedInfo.colourNotes?.trim() || undefined,
          }
        : ownership === 'owned'
          ? raw.ownedInfo
          : raw.ownedInfo?.registration
            ? {
                ...raw.ownedInfo,
                registration: normalizeReg(raw.ownedInfo.registration),
              }
            : undefined,
    notes: typeof raw.notes === 'string' ? raw.notes : '',
    maintenanceLogs: Array.isArray(raw.maintenanceLogs)
      ? raw.maintenanceLogs.map((log) => ({
          id: log.id || crypto.randomUUID(),
          mileage:
            typeof log.mileage === 'number' && Number.isFinite(log.mileage)
              ? log.mileage
              : null,
          date: log.date || null,
          notes: typeof log.notes === 'string' ? log.notes : '',
          createdAt: log.createdAt || new Date().toISOString(),
        }))
      : [],
    visibility: raw.visibility === 'public' ? 'public' : 'private',
    ownerUserId:
      typeof raw.ownerUserId === 'string' ? raw.ownerUserId : undefined,
    ownerUsername:
      typeof raw.ownerUsername === 'string' ? raw.ownerUsername : undefined,
  }
}

function readAll(): SavedBuild[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Partial<SavedBuild>[]
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((item) => item?.build?.selection?.carId)
      .map((item) =>
        normalizeEntry(item as Partial<SavedBuild> & { build: PersistedBuild }),
      )
  } catch {
    return []
  }
}

function writeAll(items: SavedBuild[]): void {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

function touch(entry: SavedBuild): SavedBuild {
  return { ...entry, updatedAt: new Date().toISOString() }
}

function updateById(
  id: string,
  map: (entry: SavedBuild) => SavedBuild,
): SavedBuild | null {
  const items = readAll()
  const existing = items.find((b) => b.id === id)
  if (!existing) return null
  const entry = touch(map(existing))
  writeAll(items.map((b) => (b.id === id ? entry : b)))
  return entry
}

export function listSavedBuilds(): SavedBuild[] {
  return readAll().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
}

export function getSavedBuild(id: string): SavedBuild | undefined {
  return readAll().find((b) => b.id === id)
}

export function saveBuild(
  build: PersistedBuild,
  opts?: { id?: string; name?: string },
): SavedBuild {
  const items = readAll()
  const id = opts?.id ?? crypto.randomUUID()
  const existing = items.find((b) => b.id === id)
  const name =
    opts?.name?.trim() ||
    existing?.name ||
    defaultNameForSelection(build.selection)

  const entry = normalizeEntry({
    id,
    name,
    updatedAt: new Date().toISOString(),
    build: sanitizeBuild(build.stage, build.selection),
    ownership: existing?.ownership ?? 'build',
    ownedInfo: existing?.ownedInfo,
    notes: existing?.notes ?? '',
    maintenanceLogs: existing?.maintenanceLogs ?? [],
    visibility: existing?.visibility ?? 'private',
    ownerUserId: existing?.ownerUserId,
    ownerUsername: existing?.ownerUsername,
  })

  const next = existing
    ? items.map((b) => (b.id === id ? entry : b))
    : [entry, ...items]

  writeAll(next)
  return entry
}

export function deleteSavedBuild(id: string): void {
  writeAll(readAll().filter((b) => b.id !== id))
}

export function renameSavedBuild(id: string, name: string): SavedBuild | null {
  const trimmed = name.trim()
  if (!trimmed) return null
  return updateById(id, (entry) => ({ ...entry, name: trimmed }))
}

export function updateSavedBuildNotes(
  id: string,
  notes: string,
): SavedBuild | null {
  return updateById(id, (entry) => ({ ...entry, notes }))
}

/**
 * Mark as owned. Requires a non-empty registration.
 * Returns null if reg is missing (caller should keep toggle on "build").
 */
export function markSavedBuildOwned(
  id: string,
  registration: string,
  extra?: Partial<Omit<OwnedVehicleInfo, 'registration'>>,
): SavedBuild | null {
  const reg = normalizeReg(registration)
  if (!reg) return null
  return updateById(id, (entry) => ({
    ...entry,
    ownership: 'owned',
    ownedInfo: {
      registration: reg,
      nickname: extra?.nickname?.trim() || entry.ownedInfo?.nickname,
      purchaseDate: extra?.purchaseDate || entry.ownedInfo?.purchaseDate,
      purchaseMileage:
        extra?.purchaseMileage ?? entry.ownedInfo?.purchaseMileage ?? null,
      vin: extra?.vin?.trim() || entry.ownedInfo?.vin,
      colourNotes: extra?.colourNotes?.trim() || entry.ownedInfo?.colourNotes,
    },
  }))
}

export function markSavedBuildAsBuild(id: string): SavedBuild | null {
  return updateById(id, (entry) => ({
    ...entry,
    ownership: 'build',
  }))
}

export function updateOwnedVehicleInfo(
  id: string,
  patch: Partial<OwnedVehicleInfo>,
): SavedBuild | null {
  return updateById(id, (entry) => {
    if (entry.ownership !== 'owned' || !entry.ownedInfo) return entry
    const nextReg = patch.registration
      ? normalizeReg(patch.registration)
      : entry.ownedInfo.registration
    if (!nextReg) return entry
    return {
      ...entry,
      ownedInfo: {
        registration: nextReg,
        nickname:
          patch.nickname !== undefined
            ? patch.nickname.trim() || undefined
            : entry.ownedInfo.nickname,
        purchaseDate:
          patch.purchaseDate !== undefined
            ? patch.purchaseDate || undefined
            : entry.ownedInfo.purchaseDate,
        purchaseMileage:
          patch.purchaseMileage !== undefined
            ? patch.purchaseMileage
            : entry.ownedInfo.purchaseMileage,
        vin:
          patch.vin !== undefined
            ? patch.vin.trim() || undefined
            : entry.ownedInfo.vin,
        colourNotes:
          patch.colourNotes !== undefined
            ? patch.colourNotes.trim() || undefined
            : entry.ownedInfo.colourNotes,
      },
    }
  })
}

export function addMaintenanceLog(
  id: string,
  input: { mileage?: number | null; date?: string | null; notes?: string },
): SavedBuild | null {
  const entryLog: MaintenanceLogEntry = {
    id: crypto.randomUUID(),
    mileage:
      typeof input.mileage === 'number' && Number.isFinite(input.mileage)
        ? input.mileage
        : null,
    date: input.date?.trim() || null,
    notes: input.notes?.trim() || '',
    createdAt: new Date().toISOString(),
  }
  return updateById(id, (entry) => ({
    ...entry,
    maintenanceLogs: [entryLog, ...entry.maintenanceLogs],
  }))
}

export function updateMaintenanceLog(
  buildId: string,
  logId: string,
  patch: { mileage?: number | null; date?: string | null; notes?: string },
): SavedBuild | null {
  return updateById(buildId, (entry) => ({
    ...entry,
    maintenanceLogs: entry.maintenanceLogs.map((log) =>
      log.id === logId
        ? {
            ...log,
            mileage:
              patch.mileage !== undefined ? patch.mileage : log.mileage,
            date: patch.date !== undefined ? patch.date : log.date,
            notes: patch.notes !== undefined ? patch.notes : log.notes,
          }
        : log,
    ),
  }))
}

export function deleteMaintenanceLog(
  buildId: string,
  logId: string,
): SavedBuild | null {
  return updateById(buildId, (entry) => ({
    ...entry,
    maintenanceLogs: entry.maintenanceLogs.filter((log) => log.id !== logId),
  }))
}

export function selectionLabel(selection: BuildSelection): string {
  return defaultNameForSelection(selection)
}

export function stageAfterColour(): BuildStage {
  return 'options'
}

export function setBuildVisibility(
  id: string,
  visibility: BuildVisibility,
  owner?: { userId: string; username: string },
): SavedBuild | null {
  return updateById(id, (entry) => ({
    ...entry,
    visibility,
    ownerUserId: owner?.userId ?? entry.ownerUserId,
    ownerUsername: owner?.username ?? entry.ownerUsername,
  }))
}

export function listPublicBuilds(): SavedBuild[] {
  return listSavedBuilds().filter((b) => b.visibility === 'public')
}
