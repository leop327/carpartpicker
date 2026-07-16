import type { CarModel } from '../../types/catalog'

/**
 * E82 135i N55 (US coupe, LCI).
 * Factory: 300 hp, 300 lb-ft (407 Nm). 0–60 ~5.0 s (manual).
 * DCT became available on later years.
 */
export const bmw135iE82N55: CarModel = {
  id: 'bmw-135i-e82-n55',
  make: 'BMW',
  model: '135i',
  generation: 'E82',
  label: '135i N55',
  years: [2011, 2012, 2013],
  colours: [
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'mineral-grey', name: 'Mineral Grey Metallic', hex: '#6B6E73' },
    { id: 'le-mans-blue', name: 'Le Mans Blue Metallic', hex: '#1E4D8C' },
    { id: 'valencia-orange', name: 'Valencia Orange Metallic', hex: '#C45A1A' },
    { id: 'vermilion-red', name: 'Vermilion Red Metallic', hex: '#A81C23' },
  ],
  basePrice: 39200,
  baseFigures: {
    hp: 300,
    torqueNm: 407,
    zeroToSixtySec: 5.0,
    weightKg: 1537,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'N55B30',
  },
  description:
    'E82 LCI 135i — single twin-scroll turbo N55B30 (2011–2013).',
  image: '/cars/bmw-135i-e82.jpg',
  modTags: ['bmw', 'e82', '135i', 'n55', 'rwd', 'turbo'],
  specOptions: [
    {
      id: 'transmission',
      name: 'Transmission',
      required: false,
      choices: [
        { id: 'manual', name: '6-speed manual', price: 0, isDefault: true },
        {
          id: 'dct',
          name: '7-speed dual-clutch (DCT)',
          price: 0,
          figuresDelta: { weightKg: 35, zeroToSixtySec: -0.2 },
        },
      ],
    },
    {
      id: 'package',
      name: 'Package',
      required: false,
      choices: [
        { id: 'base', name: 'Base', price: 0, isDefault: true },
        { id: 'premium', name: 'Premium Package', price: 2300 },
        { id: 'm-sport', name: 'M Sport Package', price: 2800 },
      ],
    },
  ],
}
