import type { CarModel } from '../../types/catalog'

export const mazdaMx5Nd: CarModel = {
  id: 'mazda-mx5-nd',
  make: 'Mazda',
  model: 'MX-5 Miata',
  generation: 'ND',
  years: [2019, 2020, 2021, 2022, 2023, 2024],
  colours: [
    { id: 'soul-red', name: 'Soul Red Crystal', hex: '#8B1A1A' },
    { id: 'machine-grey', name: 'Machine Grey Metallic', hex: '#5C5F64' },
    { id: 'ceramic-metallic', name: 'Ceramic Metallic', hex: '#D6D2CB' },
    { id: 'deep-crystal-blue', name: 'Deep Crystal Blue Mica', hex: '#1A3A5C' },
    { id: 'jet-black', name: 'Jet Black Mica', hex: '#0E0E10' },
  ],
  basePrice: 29950,
  baseFigures: {
    hp: 181,
    torqueNm: 205,
    zeroToSixtySec: 5.7,
    weightKg: 1052,
    drivetrain: 'RWD',
    engineSizeL: 2.0,
    engineCode: 'SKYACTIV-G 2.0',
  },
  description: 'Lightweight RWD roadster — ND generation Club / soft-top baseline.',
  modTags: ['mazda', 'mx5', 'miata', 'nd', 'skylactiv', 'rwd', 'na'],
  specOptions: [
    {
      id: 'body',
      name: 'Body style',
      required: false,
      choices: [
        {
          id: 'soft-top',
          name: 'Soft top (standard)',
          price: 0,
          isDefault: true,
        },
        {
          id: 'rf',
          name: 'RF retractable hardtop',
          price: 3500,
          figuresDelta: { weightKg: 45, zeroToSixtySec: 0.1 },
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
          name: '6-speed automatic',
          price: 1600,
          figuresDelta: { weightKg: 20, zeroToSixtySec: 0.3 },
        },
      ],
    },
    {
      id: 'brembo-bbs',
      name: 'Brembo / BBS package',
      required: false,
      choices: [
        {
          id: 'none',
          name: 'None (base)',
          price: 0,
          isDefault: true,
        },
        {
          id: 'club-pack',
          name: 'Brembo brakes + BBS wheels',
          price: 2200,
          figuresDelta: { weightKg: -5 },
        },
      ],
    },
  ],
}
