import type { CarModel } from '../../types/catalog'

/**
 * F87 M2 (N55 high-output).
 * Factory: 365 hp, 465 Nm (343 lb-ft), overboost up to 500 Nm on DCT.
 * BMW: 0–60 4.2 s manual / 4.0 s DCT. DIN unladen ~1,495–1,550 kg range by market;
 * US curb ~3,450 lb (1,565 kg) used as representative for RWD coupe.
 */
export const bmwM2F87: CarModel = {
  id: 'bmw-m2-f87',
  make: 'BMW',
  model: 'M2',
  generation: 'F87',
  label: 'M2',
  years: [2016, 2017, 2018],
  colours: [
    { id: 'long-beach-blue', name: 'Long Beach Blue Metallic', hex: '#1A4F8C' },
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'mineral-grey', name: 'Mineral Grey Metallic', hex: '#6B6E73' },
    { id: 'antarctica-blue', name: 'Antigua Blue Metallic', hex: '#2C5278' },
  ],
  basePrice: 51700,
  baseFigures: {
    hp: 365,
    torqueNm: 465,
    zeroToSixtySec: 4.2,
    weightKg: 1565,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'N55B30T0',
  },
  figuresSource: 'oem',
  euFiguresDelta: { zeroToSixtySec: 0.15 },
  euBasePrice: 54000,
  yearFigures: {
    2018: { weightKg: 5 },
  },
  description:
    'F87 M2 — high-output N55B30T0, Active M Differential, first-gen M2.',
  image: '/cars/bmw-m2-f87.jpg',
  modTags: ['bmw', 'm2', 'f87', 'n55', 'rwd', 'turbo'],
  specOptions: [
    {
      id: 'transmission',
      name: 'Transmission',
      required: false,
      choices: [
        { id: 'manual', name: '6-speed manual', price: 0, isDefault: true },
        {
          id: 'dct',
          name: '7-speed M DCT',
          price: 2900,
          figuresDelta: { weightKg: 45, zeroToSixtySec: -0.2 },
        },
      ],
    },
    {
      id: 'executive',
      name: 'Executive Package',
      required: false,
      choices: [
        { id: 'none', name: 'None (base)', price: 0, isDefault: true },
        { id: 'executive', name: 'Executive Package', price: 3000 },
      ],
    },
  ],
}
