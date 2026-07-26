/** BMW-only launch — other marques deferred. */
export const PLATFORM_BRANDS = [
  {
    id: 'bmw',
    name: 'BMW',
    slug: 'bmw',
    platforms: 'UK BMW platforms',
    available: true,
    accent: true,
    blurb:
      'UK BMW garage — configure your chassis, stack fitment-aware mods, and watch the figures move.',
  },
] as const

/** Quick-start series chips on the homepage. */
export const BMW_SERIES_QUICK = [
  { id: '1', series: '1 Series', hint: 'Hot hatches & coupes' },
  { id: '2', series: '2 Series', hint: 'Coupes & M2' },
  { id: '3', series: '3 Series', hint: 'Saloon & M3' },
  { id: '4', series: '4 Series', hint: 'Coupe & M4' },
] as const

export type PlatformBrandId = (typeof PLATFORM_BRANDS)[number]['id']

export function getBrandBySlug(slug: string) {
  const key = slug.trim().toLowerCase()
  return PLATFORM_BRANDS.find((b) => b.slug === key || b.id === key)
}
