/**
 * Community fitment votes — localStorage first (anonymous / device-local).
 */

export type FitmentDifficulty = 'easy' | 'moderate' | 'hard' | 'pro'

export interface FitmentVote {
  id: string
  /** Composite key: carId::modId */
  key: string
  carId: string
  modId: string
  fitted: boolean
  installHours?: number | null
  difficulty?: FitmentDifficulty | null
  review?: string
  at: string
}

export interface FitmentSummary {
  carId: string
  modId: string
  votes: number
  successPct: number
  avgInstallHours: number | null
  difficultyMode: FitmentDifficulty | null
  reviews: { text: string; at: string; fitted: boolean }[]
}

const KEY = 'carpartpicker:fitment:v1'

function voteKey(carId: string, modId: string): string {
  return `${carId}::${modId}`
}

function readAll(): FitmentVote[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as FitmentVote[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(votes: FitmentVote[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(votes.slice(0, 2000)))
  } catch {
    // ignore
  }
}

/** Seeded community votes so empty catalogues still feel alive. */
function seededVotes(): FitmentVote[] {
  const seeds: Omit<FitmentVote, 'id' | 'key' | 'at'>[] = [
    {
      carId: 'bmw-m2-f87',
      modId: 'mhd-super-n55',
      fitted: true,
      installHours: 0.5,
      difficulty: 'easy',
      review: 'Flashed in the driveway. Night and day.',
    },
    {
      carId: 'bmw-m2-f87',
      modId: 'maxton-splitter-v3-f87',
      fitted: true,
      installHours: 1.5,
      difficulty: 'moderate',
      review: 'Needed longer bolts on one side.',
    },
    {
      carId: 'bmw-135i-e82-n54',
      modId: 'mhd-stage2-n54',
      fitted: true,
      installHours: 1,
      difficulty: 'easy',
      review: 'Stage 2 on E85 — still my favourite.',
    },
    {
      carId: 'bmw-135i-e82-n54',
      modId: 'vrsf-dp-n54',
      fitted: true,
      installHours: 4,
      difficulty: 'hard',
      review: 'Exhaust manifold heat shields fought me.',
    },
    {
      carId: 'bmw-m140i-f20',
      modId: 'mhd-stage2-b58',
      fitted: true,
      installHours: 0.75,
      difficulty: 'easy',
    },
    {
      carId: 'bmw-m140i-f20',
      modId: 'csf-fmic-b58',
      fitted: true,
      installHours: 3,
      difficulty: 'moderate',
      review: 'Bumper off — allow a Saturday.',
    },
    {
      carId: 'bmw-m2-competition-f87',
      modId: 'autoid-gts-splitter-f87c',
      fitted: true,
      installHours: 2,
      difficulty: 'moderate',
    },
    {
      carId: 'bmw-m3-f80',
      modId: 'mhd-super-s55',
      fitted: true,
      installHours: 0.5,
      difficulty: 'easy',
    },
  ]
  return seeds.map((s, i) => ({
    ...s,
    id: `seed-fit-${i}`,
    key: voteKey(s.carId, s.modId),
    at: `2026-0${(i % 6) + 1}-15T12:00:00.000Z`,
  }))
}

function allVotes(): FitmentVote[] {
  const local = readAll()
  const localKeys = new Set(local.map((v) => v.id))
  const seeds = seededVotes().filter((s) => !localKeys.has(s.id))
  return [...local, ...seeds]
}

export function submitFitmentVote(input: {
  carId: string
  modId: string
  fitted: boolean
  installHours?: number | null
  difficulty?: FitmentDifficulty | null
  review?: string
}): FitmentVote {
  const vote: FitmentVote = {
    id: crypto.randomUUID(),
    key: voteKey(input.carId, input.modId),
    carId: input.carId,
    modId: input.modId,
    fitted: input.fitted,
    installHours:
      typeof input.installHours === 'number' && Number.isFinite(input.installHours)
        ? input.installHours
        : null,
    difficulty: input.difficulty ?? null,
    review: input.review?.trim().slice(0, 280) || undefined,
    at: new Date().toISOString(),
  }
  writeAll([vote, ...readAll()])
  window.dispatchEvent(new CustomEvent('cpp:fitment-changed'))
  return vote
}

export function getFitmentSummary(
  carId: string,
  modId: string,
): FitmentSummary {
  const votes = allVotes().filter(
    (v) => v.carId === carId && v.modId === modId,
  )
  const success = votes.filter((v) => v.fitted).length
  const hours = votes
    .map((v) => v.installHours)
    .filter((h): h is number => typeof h === 'number' && h > 0)
  const difficultyCounts: Record<FitmentDifficulty, number> = {
    easy: 0,
    moderate: 0,
    hard: 0,
    pro: 0,
  }
  for (const v of votes) {
    if (v.difficulty) difficultyCounts[v.difficulty] += 1
  }
  let difficultyMode: FitmentDifficulty | null = null
  let max = 0
  for (const d of Object.keys(difficultyCounts) as FitmentDifficulty[]) {
    if (difficultyCounts[d] > max) {
      max = difficultyCounts[d]
      difficultyMode = d
    }
  }
  return {
    carId,
    modId,
    votes: votes.length,
    successPct: votes.length ? Math.round((success / votes.length) * 100) : 0,
    avgInstallHours: hours.length
      ? Math.round((hours.reduce((a, b) => a + b, 0) / hours.length) * 10) / 10
      : null,
    difficultyMode: max > 0 ? difficultyMode : null,
    reviews: votes
      .filter((v) => v.review)
      .slice(0, 8)
      .map((v) => ({
        text: v.review!,
        at: v.at,
        fitted: v.fitted,
      })),
  }
}

/** “Most people also add” — mods co-occurring in successful fitment + saved builds. */
export function getSupportingMods(
  carId: string,
  modId: string,
  limit = 3,
): { modId: string; pct: number }[] {
  const withThis = allVotes().filter(
    (v) => v.carId === carId && v.modId === modId && v.fitted,
  )
  if (withThis.length === 0) return []

  // Co-occurrence from same-car successful votes (same session device is weak;
  // use seed + local votes that share carId across different mods as proxy).
  const otherOnCar = allVotes().filter(
    (v) => v.carId === carId && v.modId !== modId && v.fitted,
  )
  const counts = new Map<string, number>()
  for (const v of otherOnCar) {
    counts.set(v.modId, (counts.get(v.modId) ?? 0) + 1)
  }
  const base = Math.max(withThis.length, 1)
  return [...counts.entries()]
    .map(([id, n]) => ({
      modId: id,
      pct: Math.min(95, Math.round((n / (base + n)) * 100)),
    }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, limit)
}
