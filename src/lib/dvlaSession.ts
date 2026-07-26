export const DVLA_SESSION_KEY = 'carpartpicker:dvla:last'

export interface DvlaSessionMatch {
  registrationNumber?: string
  make?: string | null
  fuelType?: string | null
  engineCapacity?: number | null
  yearOfManufacture?: number | null
  co2Emissions?: number | null
  engineFamily?: string | null
  engineTags?: string[]
  engineNote?: string
  demo?: boolean
  matchedStage?: string
  matchedCarId?: string | null
}

export function readDvlaSession(): DvlaSessionMatch | null {
  try {
    const raw = sessionStorage.getItem(DVLA_SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as DvlaSessionMatch
  } catch {
    return null
  }
}

export function clearDvlaSession(): void {
  try {
    sessionStorage.removeItem(DVLA_SESSION_KEY)
  } catch {
    // ignore
  }
}

export function writeDvlaSession(data: DvlaSessionMatch): void {
  try {
    sessionStorage.setItem(DVLA_SESSION_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}
