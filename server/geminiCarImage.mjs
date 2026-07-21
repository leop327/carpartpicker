/**
 * Shared Gemini car-paint image generation (Node).
 * Tries flash image models first (cheaper / more likely to have quota),
 * then Pro / Nano Banana.
 */

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta'

const DEFAULT_MODELS = [
  process.env.GEMINI_IMAGE_MODEL,
  'gemini-3.1-flash-image',
  'gemini-2.5-flash-image',
  'gemini-3-pro-image',
].filter(Boolean)

/**
 * @param {{
 *   year: number
 *   make: string
 *   label: string
 *   generation: string
 *   colourName: string
 *   colourHex: string
 *   fuel?: string
 *   engineCode?: string
 * }} car
 */
export function buildPaintPrompt(car) {
  const fuel = car.fuel ? `, ${car.fuel}` : ''
  const engine = car.engineCode ? `, ${car.engineCode}` : ''
  return [
    `Edit this real photograph of a ${car.year} ${car.make} ${car.label} (${car.generation}${fuel}${engine}).`,
    `Repaint ONLY the exterior body panels to authentic BMW factory colour "${car.colourName}" (${car.colourHex}).`,
    'Match real OEM paint behaviour: correct metallic/pearl flake, clearcoat reflections, and colour in shade and highlight.',
    'Do NOT change body shape, wheels, glass, lights, badges, stance, camera angle, crop, background, or weather.',
    'Keep photorealistic automotive brochure quality — sharp, natural lens look, no CGI sheen, no text, no watermarks, no logos overlaid.',
    'Windows and chrome stay unchanged; only paintwork updates.',
  ].join(' ')
}

/**
 * @param {string} imageUrl absolute or site-relative URL to stock photo
 * @param {string} origin base origin for resolving relative paths
 */
export async function fetchImageAsBase64(imageUrl, origin) {
  const url = imageUrl.startsWith('http')
    ? imageUrl
    : new URL(imageUrl, origin).toString()
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch reference image (${res.status})`)
  }
  const mime = res.headers.get('content-type')?.split(';')[0] || 'image/jpeg'
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.byteLength > 4_500_000) {
    throw new Error('Reference image too large')
  }
  return { mime, data: buf.toString('base64') }
}

/**
 * @param {{
 *   apiKey: string
 *   prompt: string
 *   mime: string
 *   data: string
 * }} input
 * @returns {Promise<{ mimeType: string, data: string, model: string }>}
 */
export async function generatePaintedCarImage(input) {
  const { apiKey, prompt, mime, data } = input
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY')

  const models = [...new Set(DEFAULT_MODELS)]
  /** @type {string[]} */
  const errors = []

  for (const model of models) {
    try {
      const img = await generateWithModel(apiKey, model, prompt, mime, data)
      if (img) return { ...img, model }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      errors.push(`${model}: ${message}`)
      // Hard quota / billing — no point cycling every model
      if (/limit:\s*0|billing|PERMISSION_DENIED|API_KEY_INVALID/i.test(message)) {
        const e = new Error(friendlyQuotaMessage(message))
        e.status = 429
        throw e
      }
    }
  }

  const e = new Error(
    friendlyQuotaMessage(errors.join(' | ')) ||
      'Gemini returned no image. Check GEMINI_API_KEY and image model access.',
  )
  e.status = 502
  throw e
}

/**
 * @param {string} apiKey
 * @param {string} model
 * @param {string} prompt
 * @param {string} mime
 * @param {string} data
 */
async function generateWithModel(apiKey, model, prompt, mime, data) {
  const res = await fetch(
    `${API_BASE}/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mime, data } },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      }),
    },
  )

  const raw = await res.text()
  if (!res.ok) {
    throw new Error(`${res.status}: ${raw.slice(0, 400)}`)
  }

  let json
  try {
    json = JSON.parse(raw)
  } catch {
    throw new Error('Invalid JSON from Gemini')
  }

  const img = extractGenerateContentImage(json)
  if (!img) throw new Error('no image in response')
  return img
}

function friendlyQuotaMessage(raw) {
  if (/limit:\s*0|free_tier/i.test(raw)) {
    return (
      'Gemini image quota is 0 on this API key (free tier). ' +
      'In Google AI Studio, enable billing / raise image limits, ' +
      'or the app will keep using the local colour preview.'
    )
  }
  if (/429|too_many_requests|RESOURCE_EXHAUSTED/i.test(raw)) {
    return 'Gemini rate limit hit — using local colour preview for now.'
  }
  return raw.slice(0, 500)
}

function extractGenerateContentImage(json) {
  const parts = json?.candidates?.[0]?.content?.parts || []
  for (const p of parts) {
    const inline = p.inlineData || p.inline_data
    if (inline?.data) {
      return {
        mimeType: inline.mimeType || inline.mime_type || 'image/png',
        data: inline.data,
      }
    }
  }
  return null
}

/**
 * @param {any} body
 * @param {string} origin
 * @param {string} apiKey
 */
export async function handleGenerateRequest(body, origin, apiKey) {
  const {
    imageUrl,
    year,
    make,
    label,
    generation,
    colourName,
    colourHex,
    fuel,
    engineCode,
  } = body || {}

  if (!imageUrl || !colourName || !colourHex || !label) {
    const err = new Error(
      'imageUrl, colourName, colourHex, and label are required',
    )
    err.status = 400
    throw err
  }

  const prompt = buildPaintPrompt({
    year: year ?? new Date().getFullYear(),
    make: make || 'BMW',
    label,
    generation: generation || '',
    colourName,
    colourHex,
    fuel,
    engineCode,
  })

  const ref = await fetchImageAsBase64(String(imageUrl), origin)
  const image = await generatePaintedCarImage({
    apiKey,
    prompt,
    mime: ref.mime,
    data: ref.data,
  })

  return {
    mimeType: image.mimeType,
    dataUrl: `data:${image.mimeType};base64,${image.data}`,
    model: image.model,
  }
}
