import type { CarModel } from '../../types/catalog'
import {
  adaptiveMSportSuspension,
  mSportBrakesOption,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/** F10 535i — N55 executive express. */
export const bmw535iF10: CarModel = {
  id: 'bmw-535i-f10',
  make: 'BMW',
  series: '5 Series',
  model: '535i',
  generation: 'F10',
  label: '535i',
  years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017],
  colours: [
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'space-grey', name: 'Space Grey Metallic', hex: '#5C6168' },
    { id: 'imperial-blue', name: 'Imperial Blue Metallic', hex: '#1A3A5C' },
    { id: 'melbourne-red', name: 'Melbourne Red Metallic', hex: '#A81C23' },
  ],
  basePrice: 42990,
  euBasePrice: 42990,
  baseFigures: {
    hp: 306,
    torqueNm: 400,
    zeroToSixtySec: 5.7,
    weightKg: 1725,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'N55B30M0',
  },
  figuresSource: 'oem',
  description:
    'F10 535i — N55B30M0 (UK: 306 PS / 400 Nm). Big-body N55 that still responds hard to a Stage 2 map.',
  tagline: 'Executive with boost.',
  image: '/cars/bmw-535i-f10.jpg',
  modTags: ['bmw', '535i', 'f10', 'n55', 'rwd', 'turbo'],
  specOptions: [
    {
      id: 'transmission',
      name: 'Transmission',
      required: false,
      choices: [
        {
          id: 'auto',
          name: '8-speed Steptronic automatic',
          price: 0,
          isDefault: true,
          description: 'ZF 8HP — standard on most UK F10 535i.',
        },
        {
          id: 'manual',
          name: '6-speed manual',
          price: 0,
          figuresDelta: { weightKg: -30, zeroToSixtySec: 0.25 },
          description: 'Rare on UK cars.',
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
          figuresDelta: { weightKg: 80, zeroToSixtySec: -0.2, drivetrain: 'AWD' },
        },
      ],
    },
    adaptiveMSportSuspension(),
    mSportBrakesOption(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
