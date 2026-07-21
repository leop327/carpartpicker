import type { CarModel } from '../../types/catalog'
import {
  adaptiveMSportSuspension,
  mSportBrakesOption,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/** G29 Z4 M40i — B58 roadster. */
export const bmwZ4M40iG29: CarModel = {
  id: 'bmw-z4-m40i-g29',
  make: 'BMW',
  series: 'Z4',
  model: 'Z4 M40i',
  generation: 'G29',
  label: 'Z4 M40i',
  years: [2019, 2020, 2021, 2022, 2023, 2024],
  colours: [
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'san-francisco-red', name: 'San Francisco Red Metallic', hex: '#A81C23' },
    { id: 'misano-blue', name: 'Misano Blue Metallic', hex: '#1E4D8C' },
    { id: 'skyscraper-grey', name: 'Skyscraper Grey Metallic', hex: '#6B6E73' },
  ],
  basePrice: 54905,
  euBasePrice: 54905,
  baseFigures: {
    hp: 340,
    torqueNm: 500,
    zeroToSixtySec: 4.5,
    weightKg: 1535,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'B58B30O1',
  },
  figuresSource: 'oem',
  description:
    'G29 Z4 M40i — B58TU (UK: 340 PS / 500 Nm). Soft-top B58 with Toyota Supra DNA.',
  tagline: 'Open-air B58.',
  image: '/cars/bmw-z4-m40i-g29.jpg',
  modTags: ['bmw', 'z4', 'm40i', 'g29', 'b58', 'rwd', 'turbo'],
  specOptions: [
    {
      id: 'transmission',
      name: 'Transmission',
      required: false,
      choices: [
        {
          id: 'auto',
          name: '8-speed Steptronic Sport automatic',
          price: 0,
          isDefault: true,
          description: 'ZF 8HP — standard on UK M40i.',
        },
      ],
    },
    adaptiveMSportSuspension(),
    mSportBrakesOption(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
