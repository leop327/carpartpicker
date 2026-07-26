const fs = require('fs')

const src = fs.readFileSync('src/data/mods/productUrls.ts', 'utf8')
const start = src.indexOf('export const productUrls')
const end = src.indexOf('export function resolveProductUrl')
const block = src.slice(start, end)
const map = {}
const re = /'([^']+)':\s*'([^']+)'/g
let m
while ((m = re.exec(block))) {
  if (m[2].startsWith('http')) map[m[1]] = m[2]
}

let existing = {}
try {
  existing = JSON.parse(
    fs.readFileSync('/tmp/cpp-product-images.json', 'utf8'),
  ).modImages || {}
} catch {
  /* ignore */
}

const needed = []
const seen = new Set()
for (const [id, url] of Object.entries(map)) {
  if (existing[id]) continue
  if (!/\/products\//i.test(url)) continue
  if (seen.has(url)) continue
  seen.add(url)
  needed.push(url)
}
console.log('Need images for', needed.length, 'linked product pages')

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function handleFromUrl(url) {
  const match = url.match(/\/products\/([^/?#]+)/i)
  return match ? decodeURIComponent(match[1]) : null
}

function storeFromUrl(url) {
  try {
    return new URL(url).origin
  } catch {
    return null
  }
}

async function imgForUrl(url) {
  const origin = storeFromUrl(url)
  const handle = handleFromUrl(url)
  if (!origin || !handle) return null

  for (let a = 0; a < 5; a++) {
    try {
      const r = await fetch(`${origin}/products/${handle}.json`, {
        headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
        signal: AbortSignal.timeout(20000),
      })
      if (r.status === 429) {
        await sleep(5000 * (a + 1))
        continue
      }
      if (!r.ok) break
      const d = await r.json()
      const src = d?.product?.images?.[0]?.src || d?.product?.image?.src
      if (src) return src.startsWith('http://') ? `https://${src.slice(7)}` : src
      break
    } catch {
      await sleep(2000)
    }
  }

  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(20000),
    })
    if (!r.ok) return null
    const html = await r.text()
    const og =
      html.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i)
    if (!og) return null
    let img = og[1].replace(/&amp;/g, '&')
    if (/logo|no-image|favicon/i.test(img)) return null
    return img.startsWith('http://') ? `https://${img.slice(7)}` : img
  } catch {
    return null
  }
}

function writeTs(modImages) {
  const lines = [
    '/**',
    " * Product images from each mod's productUrl (Shopify product JSON / og:image).",
    ' */',
    '',
    'const productImages: Record<string, string> = {',
  ]
  for (const id of Object.keys(modImages).sort()) {
    lines.push(`  '${id}': '${modImages[id].replace(/'/g, "\\'")}',`)
  }
  lines.push('}')
  lines.push('')
  lines.push('const brandFallback: Record<string, string> = {')
  lines.push(
    "  MHD: 'https://cdn.shopify.com/s/files/1/2199/6357/files/MHD_Flasher.png?v=1732628553',",
  )
  lines.push(
    "  bootmod3: 'https://ctsturbo.com/wp-content/uploads/2021/06/Bootmod.png',",
  )
  lines.push('}')
  lines.push('')
  lines.push('export function resolveProductImage(mod: {')
  lines.push('  id: string')
  lines.push('  brand: string')
  lines.push('}): string | undefined {')
  lines.push('  return productImages[mod.id] ?? brandFallback[mod.brand]')
  lines.push('}')
  lines.push('')
  lines.push(
    'export function resolveKitImage(modIds: string[]): string | undefined {',
  )
  lines.push('  for (const id of modIds) {')
  lines.push('    const img = productImages[id]')
  lines.push('    if (img) return img')
  lines.push('  }')
  lines.push(
    "  if (modIds.some((id) => id.startsWith('mhd-'))) return brandFallback.MHD",
  )
  lines.push(
    "  if (modIds.some((id) => id.startsWith('bootmod3-'))) return brandFallback.bootmod3",
  )
  lines.push('  return undefined')
  lines.push('}')
  lines.push('')
  fs.writeFileSync('src/data/mods/productImages.ts', lines.join('\n'))
}

;(async () => {
  let ok = 0
  let miss = 0
  for (let i = 0; i < needed.length; i++) {
    const url = needed[i]
    const img = await imgForUrl(url)
    const mods = Object.entries(map)
      .filter(([, u]) => u === url)
      .map(([id]) => id)
    if (img) {
      for (const id of mods) existing[id] = img
      ok++
      if (ok % 10 === 0) console.log('ok', ok, 'miss', miss)
    } else {
      miss++
    }
    // checkpoint
    if ((i + 1) % 15 === 0) {
      fs.writeFileSync(
        '/tmp/cpp-product-images.json',
        JSON.stringify({ modImages: existing }, null, 2),
      )
      writeTs(existing)
      console.log('checkpoint', i + 1, '/', needed.length, 'total', Object.keys(existing).length)
    }
    await sleep(2500)
  }
  console.log('Finished ok', ok, 'miss', miss, 'total', Object.keys(existing).length)
  fs.writeFileSync(
    '/tmp/cpp-product-images.json',
    JSON.stringify({ modImages: existing }, null, 2),
  )
  writeTs(existing)
  console.log('Wrote productImages.ts')
})()
