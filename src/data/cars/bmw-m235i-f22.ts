import type { CarModel } from '../../types/catalog'

/**
 * F22 M235i Coupe.
 * Factory: 322 hp (326 PS), 332 lb-ft (450 Nm). 0–60 ~4.8 s (manual/RWD).
 * US curb weight ~3,450 lb (~1,565 kg).
 */
export const bmwM235iF22: CarModel = {
  id: 'bmw-m235i-f22',
  make: 'BMW',
  model: 'M235i',
  generation: 'F22',
  label: 'M235i',
  years: [2014, 2015, 2016],
  colours: [
    { id: 'mineral-grey', name: 'Mineral Grey Metallic', hex: '#6B6E73' },
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'estoril-blue', name: 'Estoril Blue Metallic', hex: '#1E4D8C' },
    { id: 'valencia-orange', name: 'Valencia Orange Metallic', hex: '#C45A1A' },
  ],
  basePrice: 43200,
  baseFigures: {
    hp: 322,
    torqueNm: 450,
    zeroToSixtySec: 4.8,
    weightKg: 1565,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'N55B30',
  },
  description:
    'F22 M235i Coupe — N55B30 before the dedicated M2 arrived (2014–2016).',
  image: '/cars/bmw-m235i-f22.jpg',
  modTags: ['bmw', 'm235i', 'f22', 'n55', 'rwd', 'turbo'],
  specOptions: [
    {
      id: 'transmission',
      name: 'Transmission',
      required: false,
      choices: [
        { id: 'manual', name: '6-speed manual', price: 0, isDefault: true },
        {
          id: 'auto',
          name: '8-speed Steptronic',
          price: 0,
          figuresDelta: { weightKg: 35, zeroToSixtySec: -0.1 },
        },
      ],
    },
    {
      id: 'package',
      name: 'Package',
      required: false,
      choices: [
        { id: 'base', name: 'Base', price: 0, isDefault: true },
        { id: 'premium', name: 'Premium Package', price: 2500 },
        { id: 'tech', name: 'Technology Package', price: 2200 },
      ],
    },
  ],
}
