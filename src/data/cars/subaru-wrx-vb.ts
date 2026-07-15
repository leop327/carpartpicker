import type { CarModel } from '../../types/catalog'

export const subaruWrxVb: CarModel = {
  id: 'subaru-wrx-vb',
  make: 'Subaru',
  model: 'WRX',
  generation: 'VB',
  years: [2022, 2023, 2024, 2025],
  colours: [
    { id: 'world-rally-blue', name: 'World Rally Blue Pearl', hex: '#0057B8' },
    { id: 'ignition-red', name: 'Ignition Red', hex: '#C41230' },
    { id: 'ceramic-white', name: 'Ceramic White', hex: '#F0EDE8' },
    { id: 'magnetite-grey', name: 'Magnetite Grey Metallic', hex: '#4A4D52' },
    { id: 'crystal-black', name: 'Crystal Black Silica', hex: '#121314' },
  ],
  basePrice: 33415,
  baseFigures: {
    hp: 271,
    torqueNm: 350,
    zeroToSixtySec: 5.4,
    weightKg: 1495,
    drivetrain: 'AWD',
    engineSizeL: 2.4,
    engineCode: 'FA24F',
  },
  description: 'Symmetrical AWD turbo sedan — VB generation with the FA24F boxer.',
  modTags: ['subaru', 'wrx', 'vb', 'fa24', 'awd', 'turbo', 'boxer'],
  specOptions: [
    {
      id: 'trim',
      name: 'Trim',
      required: false,
      choices: [
        {
          id: 'base',
          name: 'WRX (base)',
          price: 0,
          isDefault: true,
        },
        {
          id: 'premium',
          name: 'Premium',
          price: 2800,
        },
        {
          id: 'limited',
          name: 'Limited',
          price: 5200,
          figuresDelta: { weightKg: 25 },
        },
        {
          id: 'gt',
          name: 'GT',
          price: 9800,
          figuresDelta: { weightKg: 40 },
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
          id: 'cvt',
          name: 'CVT Sport Lineartronic',
          price: 2400,
          figuresDelta: { weightKg: 30, zeroToSixtySec: 0.4 },
        },
      ],
    },
  ],
}
