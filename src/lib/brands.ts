export const PLATFORM_BRANDS = [
  {
    id: 'bmw',
    name: 'BMW',
    slug: 'bmw',
    platforms: 'B58 · S58 · N55 · N54 · S55',
    available: true,
    accent: true,
    blurb:
      '1–4 Series focus catalogue — N54 / N55 / B58 / S55 / S58 platforms with UK figures and fitment-aware mods.',
  },
  {
    id: 'audi',
    name: 'Audi',
    slug: 'audi',
    platforms: 'TFSI · EA888',
    available: false,
    accent: false,
    blurb: 'EA888 / TFSI platforms are on the roadmap after BMW coverage lands.',
  },
  {
    id: 'vw',
    name: 'VW',
    slug: 'vw',
    platforms: 'Golf R · GTI',
    available: false,
    accent: false,
    blurb: 'Golf R / GTI bolt-on catalogues planned once Audi TFSI is in.',
  },
  {
    id: 'mercedes',
    name: 'Mercedes-AMG',
    slug: 'mercedes',
    platforms: 'M139 · M177',
    available: false,
    accent: false,
    blurb: 'AMG hot hatches and V8s are queued after the VAG platforms.',
  },
  {
    id: 'porsche',
    name: 'Porsche',
    slug: 'porsche',
    platforms: '911 · Cayman',
    available: false,
    accent: false,
    blurb: '911 / Cayman platform builds are planned once AMG coverage starts.',
  },
] as const

export type PlatformBrandId = (typeof PLATFORM_BRANDS)[number]['id']

export function getBrandBySlug(slug: string) {
  const key = slug.trim().toLowerCase()
  return PLATFORM_BRANDS.find((b) => b.slug === key || b.id === key)
}
