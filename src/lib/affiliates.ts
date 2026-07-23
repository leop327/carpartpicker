/**
 * Affiliate link wrapping + local click tracking.
 * Networks (Awin/Impact) can be wired via VITE_AFFILIATE_* env vars later.
 */

const CLICKS_KEY = 'carpartpicker:affiliate-clicks:v1'

/** Optional publisher IDs — empty means pass-through URLs with tracking only. */
const AFFILIATE = {
  awin: import.meta.env.VITE_AWIN_PUBLISHER_ID as string | undefined,
  impact: import.meta.env.VITE_IMPACT_CAMPAIGN_ID as string | undefined,
}

export interface AffiliateClick {
  modId: string
  brand: string
  url: string
  at: string
  source: string
}

function readClicks(): AffiliateClick[] {
  try {
    const raw = localStorage.getItem(CLICKS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as AffiliateClick[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeClicks(clicks: AffiliateClick[]): void {
  try {
    localStorage.setItem(CLICKS_KEY, JSON.stringify(clicks.slice(0, 500)))
  } catch {
    // ignore quota
  }
}

/**
 * Append affiliate params when configured; otherwise return the supplier URL unchanged.
 */
export function wrapAffiliateUrl(
  url: string,
  meta?: { modId?: string; brand?: string },
): string {
  try {
    const u = new URL(url)
    if (AFFILIATE.awin) {
      u.searchParams.set('awc', AFFILIATE.awin)
    }
    if (AFFILIATE.impact) {
      u.searchParams.set('irclickid', AFFILIATE.impact)
    }
    if (meta?.modId) {
      u.searchParams.set('cpp_mod', meta.modId)
    }
    u.searchParams.set('ref', 'carpartpicker')
    return u.toString()
  } catch {
    return url
  }
}

export function trackAffiliateClick(input: {
  modId: string
  brand: string
  url: string
  source?: string
}): void {
  const entry: AffiliateClick = {
    modId: input.modId,
    brand: input.brand,
    url: input.url,
    at: new Date().toISOString(),
    source: input.source ?? 'checkout',
  }
  writeClicks([entry, ...readClicks()])
  window.dispatchEvent(
    new CustomEvent('cpp:affiliate-click', { detail: entry }),
  )
}

export function listAffiliateClicks(): AffiliateClick[] {
  return readClicks()
}

export function affiliateClickStats(): {
  total: number
  byBrand: Record<string, number>
  byMod: Record<string, number>
} {
  const clicks = readClicks()
  const byBrand: Record<string, number> = {}
  const byMod: Record<string, number> = {}
  for (const c of clicks) {
    byBrand[c.brand] = (byBrand[c.brand] ?? 0) + 1
    byMod[c.modId] = (byMod[c.modId] ?? 0) + 1
  }
  return { total: clicks.length, byBrand, byMod }
}

/** Resolve + wrap + track in one step for checkout buy links. */
export function openAffiliateProduct(input: {
  modId: string
  brand: string
  url: string
  source?: string
}): string {
  const wrapped = wrapAffiliateUrl(input.url, {
    modId: input.modId,
    brand: input.brand,
  })
  trackAffiliateClick({
    modId: input.modId,
    brand: input.brand,
    url: wrapped,
    source: input.source,
  })
  return wrapped
}
