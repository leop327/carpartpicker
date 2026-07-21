import type { CarModel } from '../../types/catalog'
import {
  adaptiveMSportSuspension,
  mSportBrakesOption,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/** G30 540i — B58 five-series. */
export const bmw540iG30: CarModel = {
  id: 'bmw-540i-g30',
  make: 'BMW',
  series: '5 Series',
  model: '540i',
  generation: 'G30',
  label: '540i',
  years: [2017, 2018, 2019, 2020, 2021, 2022, 2023],
  colours: [
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'bluestone', name: 'Bluestone Metallic', hex: '#5C6B7A' },
    { id: 'carbon-black', name: 'Carbon Black Metallic', hex: '#1A1A1C' },
    { id: 'mediterranean-blue', name: 'Mediterranean Blue Metallic', hex: '#1B4F8C' },
  ],
  basePrice: 49905,
  euBasePrice: 49905,
  baseFigures: {
    hp: 340,
    torqueNm: 450,
    zeroToSixtySec: 5.1,
    weightKg: 1700,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'B58B30M1',
  },
  figuresSource: 'oem',
  description:
    'G30 540i — B58 (UK: typically 340 PS / 450 Nm). Quietly one of the best all-round B58 platforms.',
  tagline: 'B58 in a business suit.',
  image: '/cars/bmw-540i-g30.jpg',
  modTags: ['bmw', '540i', 'g30', 'b58', 'rwd', 'turbo'],
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
          description: 'ZF 8HP — standard on UK 540i.',
        },
      ],
    },
    {
      id: 'drivetrain',
      name: 'Drivetrain',
      required: false,
      choices: [
        { id: 'rwd', name: 'Rear-wheel drive', price: 0, isDefault: true },
        {
          id: 'xdrive',
          name: 'xDrive all-wheel drive',
          price: 0,
          figuresDelta: { weightKg: 75, zeroToSixtySec: -0.2, drivetrain: 'AWD' },
        },
      ],
    },
    adaptiveMSportSuspension(),
    mSportBrakesOption(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
