import type { CarModel } from '../../types/catalog'
import {
  interiorTrim,
  mDriversPackage,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/**
 * G87 M2 — UK figures (S58).
 * Official model is simply “M2” (no Competition badge like F87).
 */
export const bmwM2G87: CarModel = {
  id: 'bmw-m2-g87',
  make: 'BMW',
  series: '2 Series',
  model: 'M2',
  generation: 'G87',
  label: 'M2',
  years: [2023, 2024, 2025, 2026],
  colours: [
    { id: 'zane-grey', name: 'Zane Grey Metallic', hex: '#6B6E73' },
    { id: 'toronto-red', name: 'Toronto Red Metallic', hex: '#A81C23' },
    { id: 'portimao-blue', name: 'Portimao Blue Metallic', hex: '#1B4F8C' },
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'sao-paulo-yellow', name: 'Sao Paulo Yellow', hex: '#E8C41A' },
  ],
  basePrice: 64890,
  euBasePrice: 64890,
  baseFigures: {
    hp: 460,
    torqueNm: 550,
    zeroToSixtySec: 4.1,
    weightKg: 1775,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'S58B30T0',
  },
  figuresSource: 'oem',
  description:
    'G87 M2 — twin-turbo S58 (UK: 460 PS / 550 Nm). 0–62 is 4.1s with 8-speed, 4.3s manual. Active M Differential standard.',
  tagline: 'Compact M, modern S58.',
  image: '/cars/bmw-g87-m2.jpg',
  modTags: ['bmw', 'm2', 'g87', 's58', 'rwd', 'turbo', 'petrol'],
  specOptions: [
    {
      id: 'transmission',
      name: 'Transmission',
      required: true,
      choices: [
        {
          id: 'auto',
          name: '8-speed M Steptronic',
          price: 0,
          isDefault: true,
        },
        {
          id: 'manual',
          name: '6-speed manual',
          price: 0,
          figuresDelta: { zeroToSixtySec: 0.2 },
        },
      ],
    },
    interiorTrim({ merinoStandard: true }),
    mDriversPackage(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
