import type { CarModel } from '../../types/catalog'
import {
  adaptiveMSportSuspension,
  mSportBrakesOption,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/**
 * G20 M340i — UK cars are typically xDrive.
 * B58TU / B58B30O1 depending on year.
 */
export const bmwM340iG20: CarModel = {
  id: 'bmw-m340i-g20',
  make: 'BMW',
  series: '3 Series',
  model: 'M340i',
  generation: 'G20',
  label: 'M340i',
  years: [2019, 2020, 2021, 2022, 2023, 2024],
  colours: [
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'brooklyn-grey', name: 'Brooklyn Grey Metallic', hex: '#6B6E73' },
    { id: 'portimao-blue', name: 'Portimao Blue Metallic', hex: '#1B4F8C' },
    { id: 'toronto-red', name: 'Toronto Red Metallic', hex: '#A81C23' },
  ],
  basePrice: 48905,
  euBasePrice: 48905,
  baseFigures: {
    hp: 374,
    torqueNm: 500,
    zeroToSixtySec: 4.4,
    weightKg: 1745,
    drivetrain: 'AWD',
    engineSizeL: 3.0,
    engineCode: 'B58B30O1',
  },
  figuresSource: 'oem',
  yearFigures: {
    2023: { hp: 0, weightKg: 5 },
  },
  description:
    'G20 M340i xDrive — B58TU (UK: 374 PS / 500 Nm). Factory M Sport kit and serious Stage 1 potential.',
  tagline: 'The modern sleeper.',
  image: '/cars/bmw-m340i-g20.jpg',
  modTags: ['bmw', 'm340i', 'g20', 'b58', 'awd', 'turbo', 'xdrive'],
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
          description: 'ZF 8HP — standard on UK M340i.',
        },
      ],
    },
    adaptiveMSportSuspension(),
    mSportBrakesOption(),
    {
      id: 'wheels',
      name: 'Wheels',
      required: false,
      choices: [
        {
          id: '18',
          name: '18" M light-alloy (typical)',
          price: 0,
          isDefault: true,
        },
        {
          id: '19',
          name: '19" M double-spoke',
          price: 0,
          figuresDelta: { weightKg: 4 },
        },
      ],
    },
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
