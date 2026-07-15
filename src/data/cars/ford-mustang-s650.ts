import type { CarModel } from '../../types/catalog'

export const fordMustangS650: CarModel = {
  id: 'ford-mustang-s650',
  make: 'Ford',
  model: 'Mustang GT',
  generation: 'S650',
  years: [2024, 2025, 2026],
  colours: [
    { id: 'grabber-blue', name: 'Grabber Blue Metallic', hex: '#1B6CA8' },
    { id: 'race-red', name: 'Race Red', hex: '#D40000' },
    { id: 'attack-yellow', name: 'Attack Yellow', hex: '#E6C200' },
    { id: 'carbonized-gray', name: 'Carbonized Gray', hex: '#55585D' },
    { id: 'shadow-black', name: 'Shadow Black', hex: '#0A0A0B' },
    { id: 'oxford-white', name: 'Oxford White', hex: '#F5F5F3' },
  ],
  basePrice: 45990,
  baseFigures: {
    hp: 480,
    torqueNm: 570,
    zeroToSixtySec: 4.2,
    weightKg: 1750,
    drivetrain: 'RWD',
    engineSizeL: 5.0,
    engineCode: 'Coyote 5.0',
  },
  description: 'S650 Mustang GT with the Coyote 5.0 V8 — RWD American muscle.',
  modTags: ['ford', 'mustang', 's650', 'coyote', 'v8', 'rwd', 'na'],
  specOptions: [
    {
      id: 'performance-pack',
      name: 'Performance Package',
      required: false,
      choices: [
        {
          id: 'none',
          name: 'None (base GT)',
          price: 0,
          isDefault: true,
        },
        {
          id: 'perf-pack',
          name: 'Performance Package',
          price: 4995,
          figuresDelta: { weightKg: 15, zeroToSixtySec: -0.1 },
        },
      ],
    },
    {
      id: 'transmission',
      name: 'Transmission',
      required: false,
      choices: [
        {
          id: 'manual',
          name: '6-speed manual (standard)',
          price: 0,
          isDefault: true,
        },
        {
          id: 'auto',
          name: '10-speed automatic',
          price: 1595,
          figuresDelta: { weightKg: 35, zeroToSixtySec: -0.15 },
        },
      ],
    },
    {
      id: 'exhaust',
      name: 'Factory exhaust',
      required: false,
      choices: [
        {
          id: 'standard',
          name: 'Dual exhaust (standard)',
          price: 0,
          isDefault: true,
        },
        {
          id: 'active-valve',
          name: 'Active Valve Performance Exhaust',
          price: 1295,
          figuresDelta: { hp: 5 },
        },
      ],
    },
  ],
}
