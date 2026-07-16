import type { CarModel } from '../../types/catalog'

/**
 * F87 M2 Competition (S55).
 * US: 405 hp, 406 lb-ft (550 Nm). 0–60 4.2 s manual / 4.0 s DCT (BMW USA).
 * DIN unladen 1,550 kg manual / 1,575 kg DCT.
 */
export const bmwM2CompetitionF87: CarModel = {
  id: 'bmw-m2-competition-f87',
  make: 'BMW',
  model: 'M2 Competition',
  generation: 'F87',
  label: 'M2 Competition',
  years: [2019, 2020, 2021],
  colours: [
    { id: 'hockenheim-silver', name: 'Hockenheim Silver Metallic', hex: '#A8ADB4' },
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'long-beach-blue', name: 'Long Beach Blue Metallic', hex: '#1A4F8C' },
    { id: 'sunset-orange', name: 'Sunset Orange Metallic', hex: '#C45A1A' },
  ],
  basePrice: 58900,
  baseFigures: {
    hp: 405,
    torqueNm: 550,
    zeroToSixtySec: 4.2,
    weightKg: 1550,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'S55B30T0',
  },
  figuresSource: 'oem',
  /** EU press kits often quote 410 PS; 0–100 km/h ~0.1–0.2 s slower than US 0–60 claims. */
  euFiguresDelta: { hp: 5, zeroToSixtySec: 0.15 },
  euBasePrice: 62000,
  description:
    'F87 M2 Competition — S55B30T0 twin-turbo from the F8x M3/M4 family.',
  image: '/cars/bmw-m2-competition-f87.jpg',
  modTags: ['bmw', 'm2', 'm2c', 'f87', 's55', 'rwd', 'turbo'],
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
          figuresDelta: { weightKg: 25, zeroToSixtySec: -0.2 },
        },
      ],
    },
    {
      id: 'carbon',
      name: 'Carbon / seats',
      required: false,
      choices: [
        { id: 'none', name: 'None (base)', price: 0, isDefault: true },
        {
          id: 'carbon-buckets',
          name: 'Carbon fibre bucket seats',
          price: 4800,
          figuresDelta: { weightKg: -12 },
        },
      ],
    },
  ],
}
