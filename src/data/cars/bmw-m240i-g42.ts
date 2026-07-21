import type { CarModel } from '../../types/catalog'
import {
  adaptiveMSportSuspension,
  mSportBrakesOption,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/** G42 M240i — B58 coupe successor to M235i. */
export const bmwM240iG42: CarModel = {
  id: 'bmw-m240i-g42',
  make: 'BMW',
  series: '2 Series',
  model: 'M240i',
  generation: 'G42',
  label: 'M240i',
  years: [2022, 2023, 2024, 2025],
  colours: [
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'portimao-blue', name: 'Portimao Blue Metallic', hex: '#1B4F8C' },
    { id: 'toronto-red', name: 'Toronto Red Metallic', hex: '#A81C23' },
    { id: 'brooklyn-grey', name: 'Brooklyn Grey Metallic', hex: '#6B6E73' },
  ],
  basePrice: 44905,
  euBasePrice: 44905,
  baseFigures: {
    hp: 374,
    torqueNm: 500,
    zeroToSixtySec: 4.3,
    weightKg: 1690,
    drivetrain: 'AWD',
    engineSizeL: 3.0,
    engineCode: 'B58B30O1',
  },
  figuresSource: 'oem',
  description:
    'G42 M240i xDrive — B58TU (UK: 374 PS / 500 Nm). Modern 2 Series coupe with serious Stage 1 headroom.',
  tagline: 'The new hot coupe.',
  image: '/cars/bmw-m240i-g42.jpg',
  modTags: ['bmw', 'm240i', 'g42', 'b58', 'awd', 'turbo', 'xdrive'],
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
          description: 'ZF 8HP — standard on UK M240i.',
        },
      ],
    },
    adaptiveMSportSuspension(),
    mSportBrakesOption(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
