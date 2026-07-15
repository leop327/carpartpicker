import type { CarModel } from '../../types/catalog'

/** Add another BMW by copying this file pattern and registering it in index.ts */
export const bmwM3G80: CarModel = {
  id: 'bmw-m3-g80',
  make: 'BMW',
  model: 'M3 Competition',
  generation: 'G80',
  years: [2021, 2022, 2023, 2024, 2025],
  colours: [
    { id: 'isle-of-man-green', name: 'Isle of Man Green', hex: '#1B4D3E' },
    { id: 'toronto-red', name: 'Toronto Red Metallic', hex: '#A81C23' },
    { id: 'brooklyn-grey', name: 'Brooklyn Grey Metallic', hex: '#6B6E73' },
    { id: 'sao-paulo-yellow', name: 'Sao Paulo Yellow', hex: '#F5C400' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
  ],
  basePrice: 78900,
  baseFigures: {
    hp: 503,
    torqueNm: 650,
    zeroToSixtySec: 3.4,
    weightKg: 1730,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'S58B30T0',
  },
  description:
    'Twin-turbo straight-six Competition package — the G80 generation M3.',
  modTags: ['bmw', 'm3', 'g80', 's58', 'rwd', 'turbo'],
  specOptions: [
    {
      id: 'drivetrain-pack',
      name: 'Drivetrain',
      description: 'Rear-wheel drive is standard; xDrive is optional.',
      required: false,
      choices: [
        {
          id: 'rwd',
          name: 'RWD (standard)',
          price: 0,
          isDefault: true,
        },
        {
          id: 'xdrive',
          name: 'M xDrive AWD',
          price: 2800,
          figuresDelta: {
            drivetrain: 'AWD',
            weightKg: 50,
            zeroToSixtySec: -0.2,
          },
        },
      ],
    },
    {
      id: 'carbon-pack',
      name: 'Carbon Pack',
      required: false,
      choices: [
        {
          id: 'none',
          name: 'None (base)',
          price: 0,
          isDefault: true,
        },
        {
          id: 'carbon-exterior',
          name: 'M Carbon Exterior Package',
          price: 4700,
          figuresDelta: { weightKg: -8 },
        },
      ],
    },
    {
      id: 'seats',
      name: 'Seats',
      required: false,
      choices: [
        {
          id: 'standard',
          name: 'Standard M Sport seats',
          price: 0,
          isDefault: true,
        },
        {
          id: 'carbon-buckets',
          name: 'M Carbon bucket seats',
          price: 3800,
          figuresDelta: { weightKg: -12 },
        },
      ],
    },
  ],
}
