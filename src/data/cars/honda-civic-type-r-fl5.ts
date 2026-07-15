import type { CarModel } from '../../types/catalog'

export const hondaCivicTypeRFl5: CarModel = {
  id: 'honda-civic-type-r-fl5',
  make: 'Honda',
  model: 'Civic Type R',
  generation: 'FL5',
  years: [2023, 2024, 2025, 2026],
  colours: [
    { id: 'championship-white', name: 'Championship White', hex: '#F7F7F5' },
    { id: 'rallye-red', name: 'Rallye Red', hex: '#C8102E' },
    { id: 'sonic-grey', name: 'Sonic Grey Pearl', hex: '#8A8D91' },
    { id: 'crystal-black', name: 'Crystal Black Pearl', hex: '#111214' },
    { id: 'boost-blue', name: 'Boost Blue Pearl', hex: '#1E4D8C' },
  ],
  basePrice: 45800,
  baseFigures: {
    hp: 315,
    torqueNm: 420,
    zeroToSixtySec: 5.0,
    weightKg: 1429,
    drivetrain: 'FWD',
    engineSizeL: 2.0,
    engineCode: 'K20C1',
  },
  description: 'Front-drive hot hatch with the K20C1 turbo four — FL5 generation.',
  modTags: ['honda', 'civic', 'type-r', 'fl5', 'k20', 'fwd', 'turbo'],
  specOptions: [
    {
      id: 'wheels',
      name: 'Wheel finish',
      required: false,
      choices: [
        {
          id: 'matte-black',
          name: 'Matte black (standard)',
          price: 0,
          isDefault: true,
        },
        {
          id: 'machine-finished',
          name: 'Machine-finished alloy',
          price: 0,
        },
      ],
    },
    {
      id: 'interior-accent',
      name: 'Interior accent',
      required: false,
      choices: [
        {
          id: 'red',
          name: 'Red stitching / Type R trim (standard)',
          price: 0,
          isDefault: true,
        },
        {
          id: 'blackout',
          name: 'Blackout interior pack',
          price: 650,
        },
      ],
    },
  ],
}
