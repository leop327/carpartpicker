/**
 * Shared DVLA Vehicle Enquiry Service lookup + BMW engine-family inference.
 * Used by Vercel `/api/dvla` and the Vite dev middleware.
 */

const DVLA_URL =
  'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles'

/**
 * @param {string} vrm
 * @returns {string}
 */
export function sanitizeVrm(vrm) {
  return String(vrm || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
}

/**
 * Map DVLA make + engineCapacity (cc) + year + fuel to engine-family tags
 * used in our catalog (n54, n55, b58, s55, s58, …).
 *
 * Capacities (approx):
 * - N54 / N55 / S55 ≈ 2979 cc
 * - S58 ≈ 2993 cc
 * - B58 ≈ 2998 cc
 *
 * @param {{
 *   make?: string
 *   engineCapacity?: number
 *   cylinderCapacity?: number
 *   yearOfManufacture?: number
 *   fuelType?: string
 * }} vehicle
 */
export function inferEngineFamily(vehicle) {
  const make = String(vehicle.make || '').toUpperCase()
  const cc = Number(
    vehicle.engineCapacity ?? vehicle.cylinderCapacity ?? NaN,
  )
  const year = Number(vehicle.yearOfManufacture ?? NaN)
  const fuel = String(vehicle.fuelType || '').toUpperCase()

  if (!make.includes('BMW') || !Number.isFinite(cc)) {
    return {
      family: null,
      engineTags: [],
      confidence: 'none',
      note:
        make && !make.includes('BMW')
          ? `${vehicle.make} is not in the live catalogue yet (BMW-first).`
          : 'Could not infer engine family from DVLA data.',
    }
  }

  const diesel = fuel.includes('DIESEL')

  if (diesel) {
    if (cc >= 2900 && cc <= 3100) {
      const family = year >= 2015 ? 'B57' : 'N57'
      return {
        family,
        engineTags: [family.toLowerCase()],
        confidence: 'medium',
        note: `Inferred ${family} from ~${cc}cc diesel + ${year || 'unknown year'}.`,
      }
    }
    return {
      family: null,
      engineTags: [],
      confidence: 'low',
      note: `BMW diesel ${cc}cc — no focused catalogue match yet.`,
    }
  }

  // Petrol ~3.0L straight-six family
  if (cc >= 2920 && cc <= 3020) {
    // B58 — 2998 cc typically
    if (cc >= 2995 && cc <= 3005) {
      return {
        family: 'B58',
        engineTags: ['b58'],
        confidence: 'high',
        note: `Inferred B58 from ${cc}cc (${year || 'year n/a'}).`,
      }
    }

    // S58 — 2993 cc, 2021+
    if (cc >= 2988 && cc <= 2994 && year >= 2021) {
      return {
        family: 'S58',
        engineTags: ['s58'],
        confidence: 'high',
        note: `Inferred S58 from ${cc}cc + ${year}.`,
      }
    }

    // 2979-class: N54 / N55 / S55
    if (cc >= 2965 && cc <= 2988) {
      if (year >= 2014 && year <= 2020) {
        return {
          family: 'S55_or_N55',
          engineTags: ['s55', 'n55'],
          confidence: 'medium',
          note: `~${cc}cc ${year}: could be S55 (M) or N55 — pick the chassis in the builder.`,
        }
      }
      if (year >= 2009 && year <= 2013) {
        return {
          family: 'N55',
          engineTags: ['n55'],
          confidence: 'high',
          note: `Inferred N55 from ${cc}cc + ${year}.`,
        }
      }
      if (year >= 2006 && year <= 2010) {
        return {
          family: 'N54',
          engineTags: ['n54'],
          confidence: 'high',
          note: `Inferred N54 from ${cc}cc + ${year}.`,
        }
      }
      if (year >= 2011 && year <= 2016) {
        return {
          family: 'N55',
          engineTags: ['n55'],
          confidence: 'medium',
          note: `Inferred N55 from ${cc}cc + ${year}.`,
        }
      }
      if (year >= 2021) {
        return {
          family: 'S58',
          engineTags: ['s58'],
          confidence: 'low',
          note: `Late ${cc}cc petrol — treating as S58-class; confirm in builder.`,
        }
      }
    }

    if (year >= 2015) {
      return {
        family: 'B58',
        engineTags: ['b58'],
        confidence: 'low',
        note: `Fallback B58 for ~3.0L BMW petrol (${cc}cc, ${year}).`,
      }
    }
  }

  return {
    family: null,
    engineTags: [],
    confidence: 'none',
    note: `No engine-family map for BMW ${cc}cc ${fuel || ''} ${year || ''}.`.trim(),
  }
}

/**
 * @param {object} vehicle
 * @param {boolean} [demo]
 */
function withEngineInference(vehicle, demo = false) {
  const engine = inferEngineFamily(vehicle)
  return {
    ...vehicle,
    engineFamily: engine.family,
    engineTags: engine.engineTags,
    engineConfidence: engine.confidence,
    engineNote: demo
      ? `${engine.note} (demo — set DVLA_API_KEY for live VES).`
      : engine.note,
    demo: Boolean(demo),
  }
}

/**
 * Deterministic demo payloads so the reg → builder flow works without a key.
 * Tip plates: B58xxx, N55xxx, N54xxx, S55xxx, S58xxx.
 *
 * @param {string} vrm
 */
export function demoLookup(vrm) {
  const registrationNumber = sanitizeVrm(vrm)
  const u = registrationNumber

  /** @type {{ make: string, fuelType: string, engineCapacity: number, yearOfManufacture: number, co2Emissions: number, colour: string }} */
  let base = {
    make: 'BMW',
    fuelType: 'PETROL',
    engineCapacity: 2998,
    yearOfManufacture: 2018,
    co2Emissions: 179,
    colour: 'BLUE',
  }

  if (/S58|G80|G82|G87/.test(u)) {
    base = {
      make: 'BMW',
      fuelType: 'PETROL',
      engineCapacity: 2993,
      yearOfManufacture: 2023,
      co2Emissions: 234,
      colour: 'BLACK',
    }
  } else if (/S55|F80|F82|F87C/.test(u)) {
    base = {
      make: 'BMW',
      fuelType: 'PETROL',
      engineCapacity: 2979,
      yearOfManufacture: 2016,
      co2Emissions: 194,
      colour: 'YELLOW',
    }
  } else if (/N54|E82|E92/.test(u) && !/N55/.test(u)) {
    base = {
      make: 'BMW',
      fuelType: 'PETROL',
      engineCapacity: 2979,
      yearOfManufacture: 2008,
      co2Emissions: 225,
      colour: 'WHITE',
    }
  } else if (/N55|F20|F22|F30|F32/.test(u)) {
    base = {
      make: 'BMW',
      fuelType: 'PETROL',
      engineCapacity: 2979,
      yearOfManufacture: 2014,
      co2Emissions: 199,
      colour: 'GREY',
    }
  } else if (/B58|F30B|G20|G42|M140/.test(u)) {
    base = {
      make: 'BMW',
      fuelType: 'PETROL',
      engineCapacity: 2998,
      yearOfManufacture: 2018,
      co2Emissions: 179,
      colour: 'BLUE',
    }
  }

  return withEngineInference(
    {
      registrationNumber,
      ...base,
      cylinderCapacity: base.engineCapacity,
      motStatus: 'Valid',
      taxStatus: 'Taxed',
    },
    true,
  )
}

/**
 * @param {string} registrationNumber
 * @param {string} apiKey
 */
export async function lookupVehicle(registrationNumber, apiKey) {
  const vrm = sanitizeVrm(registrationNumber)
  if (!vrm || vrm.length < 2 || vrm.length > 8) {
    const err = new Error('Enter a valid UK registration (2–8 characters).')
    err.status = 400
    throw err
  }

  const res = await fetch(DVLA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({ registrationNumber: vrm }),
  })

  const text = await res.text()
  let body = null
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    body = null
  }

  if (!res.ok) {
    const message =
      body?.errors?.[0]?.detail ||
      body?.message ||
      (res.status === 404
        ? 'Vehicle not found for that registration.'
        : res.status === 400
          ? 'Invalid registration number.'
          : res.status === 429
            ? 'DVLA rate limit hit — try again shortly.'
            : 'DVLA lookup failed.')
    const err = new Error(message)
    err.status = res.status === 404 ? 404 : res.status >= 400 ? res.status : 502
    throw err
  }

  const engineCapacity = Number(
    body.engineCapacity ?? body.cylinderCapacity ?? NaN,
  )
  const yearOfManufacture = Number(body.yearOfManufacture ?? NaN)
  const vehicle = {
    registrationNumber: body.registrationNumber || vrm,
    make: body.make || null,
    fuelType: body.fuelType || null,
    engineCapacity: Number.isFinite(engineCapacity) ? engineCapacity : null,
    cylinderCapacity: Number.isFinite(engineCapacity) ? engineCapacity : null,
    yearOfManufacture: Number.isFinite(yearOfManufacture)
      ? yearOfManufacture
      : null,
    co2Emissions:
      body.co2Emissions != null ? Number(body.co2Emissions) : null,
    colour: body.colour || null,
    motStatus: body.motStatus || null,
    taxStatus: body.taxStatus || null,
  }

  return withEngineInference(vehicle, false)
}

/**
 * Live VES when `DVLA_API_KEY` is set; otherwise deterministic demo match.
 *
 * @param {string} registrationNumber
 * @param {string | undefined} apiKey
 */
export async function lookupVehicleOrDemo(registrationNumber, apiKey) {
  const vrm = sanitizeVrm(registrationNumber)
  if (!vrm || vrm.length < 2 || vrm.length > 8) {
    const err = new Error('Enter a valid UK registration (2–8 characters).')
    err.status = 400
    throw err
  }
  if (!apiKey) return demoLookup(vrm)
  return lookupVehicle(vrm, apiKey)
}
