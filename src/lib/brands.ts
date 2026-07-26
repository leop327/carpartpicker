/** BMW-only launch — other marques deferred. */
export const PLATFORM_BRANDS = [
  {
    id: 'bmw',
    name: 'BMW',
    slug: 'bmw',
    platforms: 'N54 · N55 · B58 · S55 · S58',
    available: true,
    accent: true,
    blurb:
      'UK BMW garage — 1–4 Series with N54 / N55 / B58 / S55 / S58 platforms, UK figures, and fitment-aware mods.',
  },
] as const

/** Quick-start series chips on the homepage (matches focus catalogue). */
export const BMW_SERIES_QUICK = [
  { id: '1', series: '1 Series', hint: 'E82 · F20 · M140i' },
  { id: '2', series: '2 Series', hint: 'F22 · F87 · G42 · G87' },
  { id: '3', series: '3 Series', hint: 'E92 · F30 · F80 · G20' },
  { id: '4', series: '4 Series', hint: 'F32 · F82 · G22' },
] as const

export type PlatformBrandId = (typeof PLATFORM_BRANDS)[number]['id']

export function getBrandBySlug(slug: string) {
  const key = slug.trim().toLowerCase()
  return PLATFORM_BRANDS.find((b) => b.slug === key || b.id === key)
}
