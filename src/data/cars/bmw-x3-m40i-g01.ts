import type { CarModel } from '../../types/catalog'
import {
  adaptiveMSportSuspension,
  mSportBrakesOption,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/** G01 X3 M40i — B58 SUV sleeper. */
export const bmwX3M40iG01: CarModel = {
  id: 'bmw-x3-m40i-g01',
  make: 'BMW',
  series: 'X3',
  model: 'X3 M40i',
  generation: 'G01',
  label: 'X3 M40i',
  years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
  colours: [
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'phytonic-blue', name: 'Phytonic Blue Metallic', hex: '#1B4F8C' },
    { id: 'toronto-red', name: 'Toronto Red Metallic', hex: '#A81C23' },
    { id: 'brooklyn-grey', name: 'Brooklyn Grey Metallic', hex: '#6B6E73' },
  ],
  basePrice: 55905,
  euBasePrice: 55905,
  baseFigures: {
    hp: 360,
    torqueNm: 500,
    zeroToSixtySec: 4.8,
    weightKg: 1895,
    drivetrain: 'AWD',
    engineSizeL: 3.0,
    engineCode: 'B58B30O1',
  },
  figuresSource: 'oem',
  description:
    'G01 X3 M40i — B58 (UK: typically 360 PS / 500 Nm) with xDrive. Family SUV that runs mid-12s when built.',
  tagline: 'The family sleeper.',
  image: '/cars/bmw-x3-m40i-g01.jpg',
  modTags: ['bmw', 'x3', 'm40i', 'g01', 'b58', 'awd', 'turbo', 'xdrive'],
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
          description: 'ZF 8HP — standard.',
        },
      ],
    },
    adaptiveMSportSuspension(),
    mSportBrakesOption(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
