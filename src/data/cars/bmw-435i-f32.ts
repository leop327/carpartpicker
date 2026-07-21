import type { CarModel } from '../../types/catalog'
import {
  adaptiveMSportSuspension,
  mSportBrakesOption,
  parkingAndCameras,
  stepTronicTransmission,
  sunProtectionGlass,
} from './specHelpers'

/** F32 435i — N55 coupe. */
export const bmw435iF32: CarModel = {
  id: 'bmw-435i-f32',
  make: 'BMW',
  series: '4 Series',
  model: '435i',
  generation: 'F32',
  label: '435i',
  years: [2013, 2014, 2015, 2016],
  colours: [
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'mineral-grey', name: 'Mineral Grey Metallic', hex: '#6B6E73' },
    { id: 'estoril-blue', name: 'Estoril Blue Metallic', hex: '#1E4D8C' },
    { id: 'melbourne-red', name: 'Melbourne Red Metallic', hex: '#A81C23' },
  ],
  basePrice: 39990,
  euBasePrice: 39990,
  baseFigures: {
    hp: 306,
    torqueNm: 400,
    zeroToSixtySec: 5.1,
    weightKg: 1585,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'N55B30M0',
  },
  figuresSource: 'oem',
  description:
    'F32 435i Coupé — N55B30M0 (UK: 306 PS / 400 Nm). Pre-B58 six-cylinder coupe with a huge aftermarket.',
  tagline: 'N55 coupe classic.',
  image: '/cars/bmw-435i-f32.jpg',
  modTags: ['bmw', '435i', 'f32', 'n55', 'rwd', 'turbo'],
  specOptions: [
    stepTronicTransmission({
      autoDefault: true,
      manualWeightDelta: -25,
      manualZeroToSixtyDelta: 0.2,
    }),
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
          figuresDelta: { weightKg: 70, zeroToSixtySec: -0.15, drivetrain: 'AWD' },
        },
      ],
    },
    adaptiveMSportSuspension(),
    mSportBrakesOption(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
