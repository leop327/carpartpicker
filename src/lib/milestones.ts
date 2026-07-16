const KEY = 'carpartpicker:milestones'

export type MilestoneId =
  | 'first-build'
  | 'first-compare'
  | 'first-checkout'
  | 'first-share'

const LABELS: Record<MilestoneId, string> = {
  'first-build': 'First build saved',
  'first-compare': 'First compare',
  'first-checkout': 'First checkout',
  'first-share': 'First share',
}

function read(): Set<MilestoneId> {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as MilestoneId[])
  } catch {
    return new Set()
  }
}

function write(set: Set<MilestoneId>): void {
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]))
  } catch {
    // ignore
  }
}

export function hasMilestone(id: MilestoneId): boolean {
  return read().has(id)
}

/** Returns a celebration label the first time a milestone is unlocked. */
export function unlockMilestone(id: MilestoneId): string | null {
  const set = read()
  if (set.has(id)) return null
  set.add(id)
  write(set)
  return LABELS[id]
}

export function listMilestones(): { id: MilestoneId; label: string; done: boolean }[] {
  const set = read()
  return (Object.keys(LABELS) as MilestoneId[]).map((id) => ({
    id,
    label: LABELS[id],
    done: set.has(id),
  }))
}
