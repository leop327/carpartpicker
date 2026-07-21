/** Client-side paint colourize — works offline when Gemini quota is unavailable. */

function parseHex(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '').trim()
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h.padEnd(6, '0').slice(0, 6)
  const n = Number.parseInt(full, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function rgbToHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return { h, s, l }
}

function hslToRgb(
  h: number,
  s: number,
  l: number,
): { r: number; g: number; b: number } {
  if (s === 0) {
    const v = Math.round(l * 255)
    return { r: v, g: v, b: v }
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load car image'))
    img.src = src
  })
}

/**
 * Recolor a stock photo toward a paint hex.
 * Keeps each pixel's lightness from the photo; shifts hue/sat toward the paint,
 * then blends back with the original so asphalt/sky don't go fully monochrome.
 */
export async function tintCarImage(
  src: string,
  paintHex: string,
  maxWidth = 960,
): Promise<string> {
  const img = await loadImage(src)
  const scale = Math.min(1, maxWidth / Math.max(img.naturalWidth, 1))
  const w = Math.max(1, Math.round(img.naturalWidth * scale))
  const h = Math.max(1, Math.round(img.naturalHeight * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Canvas unsupported')

  ctx.drawImage(img, 0, 0, w, h)
  const imageData = ctx.getImageData(0, 0, w, h)
  const { data } = imageData
  const paint = parseHex(paintHex)
  const paintHsl = rgbToHsl(paint.r, paint.g, paint.b)

  // Near-white / near-black paints need less saturation pull
  const targetSat =
    paintHsl.l > 0.82
      ? Math.min(paintHsl.s, 0.1)
      : Math.max(paintHsl.s, paintHsl.l < 0.35 ? 0.35 : paintHsl.s)

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]!
    const g = data[i + 1]!
    const b = data[i + 2]!
    const a = data[i + 3]!
    if (a < 8) continue

    const srcHsl = rgbToHsl(r, g, b)
    // Mid-tones (body panels) get the strongest recolor
    const mid = 1 - Math.abs(srcHsl.l - 0.42) * 1.5
    const strength = Math.min(
      0.94,
      Math.max(0.72, 0.78 + Math.max(0, mid) * 0.16),
    )

    const shifted = hslToRgb(paintHsl.h, targetSat, srcHsl.l)

    data[i] = Math.round(r * (1 - strength) + shifted.r * strength)
    data[i + 1] = Math.round(g * (1 - strength) + shifted.g * strength)
    data[i + 2] = Math.round(b * (1 - strength) + shifted.b * strength)
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL('image/jpeg', 0.88)
}
