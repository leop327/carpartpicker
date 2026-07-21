/**
 * Research UK BMW OEM colours + stock figures via Gemini.
 * Usage: node --env-file=.env.local scripts/researchOem.mjs
 *
 * No ChatGPT/OpenAI key in this project — Gemini is the available LLM.
 * Output: scripts/oem-research.json
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT = resolve(ROOT, 'scripts/oem-research.json')
const API_KEY = process.env.GEMINI_API_KEY
const MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-2.0-flash'

/** Curated cars — high-value accuracy first. */
const CARS = [
  {
    id: 'bmw-m2-f87',
    label: 'BMW M2 Coupe',
    generation: 'F87',
    years: '2016-2018',
    market: 'UK',
    engine: 'N55B30T0',
  },
  {
    id: 'bmw-m2-competition-f87',
    label: 'BMW M2 Competition',
    generation: 'F87',
    years: '2018-2021',
    market: 'UK',
    engine: 'S55B30T0',
  },
  {
    id: 'bmw-m2-g87',
    label: 'BMW M2',
    generation: 'G87',
    years: '2023-2026',
    market: 'UK',
    engine: 'S58B30T0',
  },
  {
    id: 'bmw-m3-f80',
    label: 'BMW M3 Saloon (standard, not Competition)',
    generation: 'F80',
    years: '2014-2018',
    market: 'UK',
    engine: 'S55B30T0',
  },
  {
    id: 'bmw-m4-f82',
    label: 'BMW M4 Coupe (standard, not Competition)',
    generation: 'F82',
    years: '2014-2018',
    market: 'UK',
    engine: 'S55B30T0',
  },
  {
    id: 'bmw-m4-competition-f82',
    label: 'BMW M4 Competition Coupe',
    generation: 'F82',
    years: '2016-2020',
    market: 'UK',
    engine: 'S55B30T0',
  },
  {
    id: 'bmw-m3-competition-g80',
    label: 'BMW M3 Competition Saloon (RWD)',
    generation: 'G80',
    years: '2021-2026',
    market: 'UK',
    engine: 'S58B30T0',
  },
  {
    id: 'bmw-m4-competition-g82',
    label: 'BMW M4 Competition Coupe (RWD)',
    generation: 'G82',
    years: '2021-2026',
    market: 'UK',
    engine: 'S58B30T0',
  },
  {
    id: 'bmw-m140i-f20',
    label: 'BMW M140i',
    generation: 'F20/F21',
    years: '2016-2019',
    market: 'UK',
    engine: 'B58B30',
  },
  {
    id: 'bmw-m235i-f22',
    label: 'BMW M235i Coupe',
    generation: 'F22',
    years: '2014-2016',
    market: 'UK',
    engine: 'N55B30',
  },
  {
    id: 'bmw-m240i-g42',
    label: 'BMW M240i Coupe',
    generation: 'G42',
    years: '2022-2026',
    market: 'UK',
    engine: 'B58B30',
  },
  {
    id: 'bmw-m340i-g20',
    label: 'BMW M340i xDrive',
    generation: 'G20',
    years: '2019-2026',
    market: 'UK',
    engine: 'B58B30',
  },
  {
    id: 'bmw-1m-e82',
    label: 'BMW 1 Series M Coupe',
    generation: 'E82',
    years: '2011-2012',
    market: 'UK',
    engine: 'N54B30',
  },
  {
    id: 'bmw-135i-e82-n54',
    label: 'BMW 135i Coupe N54',
    generation: 'E82',
    years: '2007-2010',
    market: 'UK',
    engine: 'N54B30',
  },
  {
    id: 'bmw-135i-e82-n55',
    label: 'BMW 135i Coupe N55',
    generation: 'E82',
    years: '2010-2013',
    market: 'UK',
    engine: 'N55B30',
  },
  {
    id: 'bmw-335i-e92-n54',
    label: 'BMW 335i Coupe N54',
    generation: 'E92',
    years: '2006-2010',
    market: 'UK',
    engine: 'N54B30',
  },
  {
    id: 'bmw-335i-e92-n55',
    label: 'BMW 335i Coupe N55',
    generation: 'E92',
    years: '2010-2013',
    market: 'UK',
    engine: 'N55B30',
  },
  {
    id: 'bmw-340i-f30',
    label: 'BMW 340i Saloon',
    generation: 'F30',
    years: '2015-2019',
    market: 'UK',
    engine: 'B58B30',
  },
  {
    id: 'bmw-435i-f32',
    label: 'BMW 435i Coupe',
    generation: 'F32',
    years: '2013-2016',
    market: 'UK',
    engine: 'N55B30',
  },
  {
    id: 'bmw-440i-f32',
    label: 'BMW 440i Coupe',
    generation: 'F32',
    years: '2016-2020',
    market: 'UK',
    engine: 'B58B30',
  },
  {
    id: 'bmw-m5-e39',
    label: 'BMW M5',
    generation: 'E39',
    years: '1998-2003',
    market: 'UK',
    engine: 'S62B50',
  },
  {
    id: 'bmw-z4-m40i-g29',
    label: 'BMW Z4 M40i',
    generation: 'G29',
    years: '2019-2026',
    market: 'UK',
    engine: 'B58B30',
  },
  {
    id: 'bmw-x3-m40i-g01',
    label: 'BMW X3 M40i',
    generation: 'G01',
    years: '2018-2024',
    market: 'UK',
    engine: 'B58B30',
  },
  {
    id: 'bmw-540i-g30',
    label: 'BMW 540i',
    generation: 'G30',
    years: '2017-2023',
    market: 'UK',
    engine: 'B58B30',
  },
  {
    id: 'bmw-535i-f10',
    label: 'BMW 535i',
    generation: 'F10',
    years: '2010-2017',
    market: 'UK',
    engine: 'N55B30',
  },
]

const HEX_HINTS = {
  'alpine-white': '#F4F4F2',
  'black-sapphire': '#0B0B0C',
  'mineral-grey': '#6B6E73',
  'long-beach-blue': '#1A4F8C',
  'yas-marina-blue': '#1B4F72',
  'sakhir-orange': '#C45A1A',
  'hockenheim-silver': '#A8ADB4',
  'sunset-orange': '#C45A1A',
  'toronto-red': '#A81C23',
  'portimao-blue': '#1B4F8C',
  'sao-paulo-yellow': '#E8C41A',
  'isle-of-man-green': '#1F4D3A',
  'brooklyn-grey': '#6B6E73',
  'skyscraper-grey': '#8A9099',
  'thawed-grey': '#9AA0A8',
  'frozen-brilliant-white': '#F0F0EC',
  'dravit-grey': '#4A4E52',
  'aventurine-red': '#5C1A1A',
  'marina-bay-blue': '#1A3A5C',
  'melbourne-red': '#A81C23',
  'estoril-blue': '#1E4D8C',
  'carbon-black': '#1A1A1C',
  'glacier-silver': '#C5C9CE',
  'space-grey': '#5C6168',
  'imperial-blue': '#1A2F5A',
  'jet-black': '#0D0D0F',
  'silverstone': '#A8ADB4',
  'austin-yellow': '#D4A017',
  'san-marino-blue': '#2A4A8C',
  'individual-frozen-black': '#1C1C1E',
}

function slug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function buildPrompt(car) {
  return `You are a BMW UK factory-data researcher. Return ONLY valid JSON (no markdown).

Research the ${car.market} market factory specification for:
${car.label} (${car.generation}), model years ${car.years}, engine ${car.engine}.

Rules:
- Prefer BMW UK press releases, UK price lists, and official brochures.
- PS (metric horsepower) and Nm for power/torque.
- 0–62 mph (0–100 km/h) in seconds — use DCT/auto figure if both exist, note manual in notes.
- Weight: EU unladen / DIN kg if possible.
- Colours: ONLY factory exterior paint names available for this exact model generation in UK (or EU if UK list unavailable). Exclude Individual one-offs unless they were on the official UK configurator as catalogue options. Exclude incorrect colours not offered on this chassis.
- Do not invent colours. If unsure, omit.
- Figures must be stock OEM, not tuned.

JSON schema:
{
  "id": "${car.id}",
  "confidence": "high" | "medium" | "low",
  "figures": {
    "hp": number,
    "torqueNm": number,
    "zeroToSixtySec": number,
    "weightKg": number,
    "drivetrain": "RWD" | "AWD" | "FWD",
    "engineCode": string
  },
  "colours": [
    { "name": "Official paint name", "code": "optional BMW paint code like C16" }
  ],
  "notes": "short sourcing notes",
  "sources": ["url or document name"]
}`
}

async function askGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    }),
  })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(json.error?.message || `HTTP ${res.status}`)
  }
  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? ''
  return JSON.parse(text)
}

function normaliseColours(colours) {
  return (colours || []).map((c) => {
    const id = slug(c.name.replace(/\s+metallic$/i, '').replace(/\s+non-metallic$/i, ''))
    return {
      id,
      name: c.name.includes('Metallic') || c.name.includes('metallic')
        ? c.name.replace(/\bmetallic\b/i, 'Metallic')
        : c.name,
      hex: HEX_HINTS[id] ?? '#6B6E73',
      code: c.code || undefined,
    }
  })
}

async function main() {
  if (!API_KEY) {
    console.error('Missing GEMINI_API_KEY')
    process.exit(1)
  }

  const existing = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {}
  const results = { ...existing, generatedAt: new Date().toISOString(), model: MODEL, cars: { ...(existing.cars || {}) } }

  for (const car of CARS) {
    if (results.cars[car.id]?.figures && process.env.FORCE !== '1') {
      console.log('skip', car.id)
      continue
    }
    process.stdout.write(`research ${car.id}… `)
    try {
      const raw = await askGemini(buildPrompt(car))
      results.cars[car.id] = {
        ...raw,
        colours: normaliseColours(raw.colours),
        researchedAt: new Date().toISOString(),
      }
      writeFileSync(OUT, JSON.stringify(results, null, 2))
      console.log(raw.confidence || 'ok', `${raw.colours?.length ?? 0} colours`)
    } catch (err) {
      console.log('FAIL', err.message)
      results.cars[car.id] = { error: String(err.message), researchedAt: new Date().toISOString() }
      writeFileSync(OUT, JSON.stringify(results, null, 2))
    }
    // gentle rate limit
    await new Promise((r) => setTimeout(r, 800))
  }

  console.log('wrote', OUT)
}

main()
