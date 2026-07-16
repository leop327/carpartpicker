import type { BuildSelection } from '../types/catalog'
import {
  defaultNameForSelection,
  sanitizeBuild,
  type BuildStage,
  type PersistedBuild,
} from './buildState'

export interface SavedBuild {
  id: string
  name: string
  updatedAt: string
  build: PersistedBuild
}

const SAVED_KEY = 'carpartpicker:saved:v2'

function readAll(): SavedBuild[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavedBuild[]
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((item) => {
        const cleaned = sanitizeBuild(item.build.stage, item.build.selection)
        return {
          ...item,
          build: cleaned,
        }
      })
      .filter((item) => item.build.selection.carId)
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

  const entry: SavedBuild = {
    id,
    name,
    updatedAt: new Date().toISOString(),
    build: sanitizeBuild(build.stage, build.selection),
  }

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
  const items = readAll()
  const existing = items.find((b) => b.id === id)
  if (!existing) return null
  const entry: SavedBuild = {
    ...existing,
    name: trimmed,
    updatedAt: new Date().toISOString(),
  }
  writeAll(items.map((b) => (b.id === id ? entry : b)))
  return entry
}

export function selectionLabel(selection: BuildSelection): string {
  return defaultNameForSelection(selection)
}

export function stageAfterColour(): BuildStage {
  return 'options'
}
