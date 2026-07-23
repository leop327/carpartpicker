/**
 * Vendor SaaS scaffold — company profiles, listings, dashboard, retainer status.
 * LocalStorage demo until real DB + Stripe.
 */

export interface VendorCompany {
  id: string
  slug: string
  name: string
  about: string
  logoUrl: string
  regions: string[]
  website?: string
  retainerStatus: 'none' | 'trial' | 'active' | 'past_due'
  retainerTier: 'starter' | 'growth' | 'featured' | null
  createdAt: string
}

export interface VendorListing {
  id: string
  vendorId: string
  name: string
  brand: string
  price: number
  currency: 'GBP'
  productUrl: string
  compatibleTags: string[]
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface VendorStats {
  impressions: number
  clicks: number
  addToBuild: number
  conversions: number
}

const COMPANIES_KEY = 'carpartpicker:vendors:v1'
const LISTINGS_KEY = 'carpartpicker:vendor-listings:v1'
const STATS_KEY = 'carpartpicker:vendor-stats:v1'

const SEED_COMPANIES: VendorCompany[] = [
  {
    id: 'vendor-mhd',
    slug: 'mhd',
    name: 'MHD Tuning',
    about: 'Flash licenses and tuning for N54, N55, B58, S55, S58.',
    logoUrl: '',
    regions: ['UK', 'EU', 'US'],
    website: 'https://mhdtuning.com',
    retainerStatus: 'active',
    retainerTier: 'featured',
    createdAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'vendor-maxton',
    slug: 'maxton-design',
    name: 'Maxton Design',
    about: 'Aero and styling kits for BMW 1–4 Series and M cars.',
    logoUrl: '',
    regions: ['UK', 'EU'],
    website: 'https://maxtondesign.co.uk',
    retainerStatus: 'active',
    retainerTier: 'growth',
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 'vendor-autoid',
    slug: 'autoid',
    name: 'AutoID',
    about: 'Carbon and aero for F87 / G87 M2.',
    logoUrl: '',
    regions: ['UK', 'EU'],
    website: 'https://www.auto-id.co.uk',
    retainerStatus: 'trial',
    retainerTier: 'starter',
    createdAt: '2026-03-15T00:00:00.000Z',
  },
]

const SEED_LISTINGS: VendorListing[] = [
  {
    id: 'listing-mhd-super-n55',
    vendorId: 'vendor-mhd',
    name: 'MHD Super License (N55)',
    brand: 'MHD',
    price: 449,
    currency: 'GBP',
    productUrl: 'https://mhdtuning.com',
    compatibleTags: ['n55', 'f87-m2'],
    description: 'Full Super map suite for N55.',
    active: true,
    createdAt: '2026-01-12T00:00:00.000Z',
    updatedAt: '2026-01-12T00:00:00.000Z',
  },
  {
    id: 'listing-maxton-v3',
    vendorId: 'vendor-maxton',
    name: 'Front Splitter V.3 (F87)',
    brand: 'Maxton Design',
    price: 249,
    currency: 'GBP',
    productUrl: 'https://maxtondesign.co.uk',
    compatibleTags: ['f87-m2', 'f87-m2c'],
    description: 'V.3 front lip for F87 M2 / Comp.',
    active: true,
    createdAt: '2026-02-05T00:00:00.000Z',
    updatedAt: '2026-02-05T00:00:00.000Z',
  },
]

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

export function listVendors(): VendorCompany[] {
  const local = readJson<VendorCompany[]>(COMPANIES_KEY, [])
  const ids = new Set(local.map((v) => v.id))
  return [...local, ...SEED_COMPANIES.filter((s) => !ids.has(s.id))]
}

export function getVendorBySlug(slug: string): VendorCompany | undefined {
  return listVendors().find((v) => v.slug === slug)
}

export function getVendorById(id: string): VendorCompany | undefined {
  return listVendors().find((v) => v.id === id)
}

export function upsertVendor(
  input: Omit<VendorCompany, 'createdAt'> & { createdAt?: string },
): VendorCompany {
  const all = readJson<VendorCompany[]>(COMPANIES_KEY, [])
  const next: VendorCompany = {
    ...input,
    createdAt: input.createdAt ?? new Date().toISOString(),
  }
  const idx = all.findIndex((v) => v.id === next.id)
  if (idx >= 0) all[idx] = next
  else all.push(next)
  writeJson(COMPANIES_KEY, all)
  return next
}

export function listListings(vendorId?: string): VendorListing[] {
  const local = readJson<VendorListing[]>(LISTINGS_KEY, [])
  const ids = new Set(local.map((l) => l.id))
  const merged = [...local, ...SEED_LISTINGS.filter((s) => !ids.has(s.id))]
  return vendorId ? merged.filter((l) => l.vendorId === vendorId) : merged
}

export function saveListing(
  listing: Omit<VendorListing, 'createdAt' | 'updatedAt'> & {
    createdAt?: string
  },
): VendorListing {
  const all = readJson<VendorListing[]>(LISTINGS_KEY, [])
  const now = new Date().toISOString()
  const existing = all.find((l) => l.id === listing.id)
  const next: VendorListing = {
    ...listing,
    createdAt: listing.createdAt ?? existing?.createdAt ?? now,
    updatedAt: now,
  }
  const idx = all.findIndex((l) => l.id === next.id)
  if (idx >= 0) all[idx] = next
  else all.push(next)
  writeJson(LISTINGS_KEY, all)
  return next
}

export function deleteListing(id: string): void {
  writeJson(
    LISTINGS_KEY,
    readJson<VendorListing[]>(LISTINGS_KEY, []).filter((l) => l.id !== id),
  )
}

export function getVendorStats(vendorId: string): VendorStats {
  const all = readJson<Record<string, VendorStats>>(STATS_KEY, {})
  return (
    all[vendorId] ?? {
      impressions: 1200 + Math.floor(Math.random() * 800),
      clicks: 80 + Math.floor(Math.random() * 120),
      addToBuild: 20 + Math.floor(Math.random() * 40),
      conversions: 5 + Math.floor(Math.random() * 15),
    }
  )
}

export function recordVendorImpression(vendorId: string): void {
  const all = readJson<Record<string, VendorStats>>(STATS_KEY, {})
  const cur = getVendorStats(vendorId)
  all[vendorId] = { ...cur, impressions: cur.impressions + 1 }
  writeJson(STATS_KEY, all)
}

export function recordVendorClick(vendorId: string): void {
  const all = readJson<Record<string, VendorStats>>(STATS_KEY, {})
  const cur = getVendorStats(vendorId)
  all[vendorId] = { ...cur, clicks: cur.clicks + 1 }
  writeJson(STATS_KEY, all)
}

/** Demo Stripe retainer — toggles local status (no real charge). */
export function startRetainerDemo(
  vendorId: string,
  tier: NonNullable<VendorCompany['retainerTier']>,
): VendorCompany | null {
  const vendor = getVendorById(vendorId)
  if (!vendor) return null
  return upsertVendor({
    ...vendor,
    retainerStatus: 'active',
    retainerTier: tier,
  })
}

export const RETAINER_TIERS = [
  {
    id: 'starter' as const,
    name: 'Starter',
    priceMonthly: 49,
    perks: ['Up to 25 SKUs', 'Company profile', 'Click stats'],
  },
  {
    id: 'growth' as const,
    name: 'Growth',
    priceMonthly: 149,
    perks: ['Unlimited SKUs', 'Fitment tags', 'Add-to-build stats'],
  },
  {
    id: 'featured' as const,
    name: 'Featured',
    priceMonthly: 399,
    perks: ['Homepage placement', 'Priority in checkout', 'Conversion postbacks'],
  },
]
