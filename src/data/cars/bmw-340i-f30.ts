import type { CarModel } from '../../types/catalog'
import {
  adaptiveMSportSuspension,
  mSportBrakesOption,
  parkingAndCameras,
  stepTronicTransmission,
  sunProtectionGlass,
} from './specHelpers'

/** F30 340i — B58. */
export const bmw340iF30: CarModel = {
  id: 'bmw-340i-f30',
  make: 'BMW',
  series: '3 Series',
  model: '340i',
  generation: 'F30',
  label: '340i',
  years: [2015, 2016, 2017, 2018, 2019],
  colours: [
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'mineral-grey', name: 'Mineral Grey Metallic', hex: '#6B6E73' },
    { id: 'mediterranean-blue', name: 'Mediterranean Blue Metallic', hex: '#1B4F8C' },
    { id: 'melbourne-red', name: 'Melbourne Red Metallic', hex: '#A81C23' },
  ],
  basePrice: 39990,
  euBasePrice: 39990,
  baseFigures: {
    hp: 326,
    torqueNm: 450,
    zeroToSixtySec: 5.1,
    weightKg: 1620,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'B58B30M0',
  },
  figuresSource: 'oem',
  description:
    'F30/F31 340i — B58B30M0 (UK: 326 PS / 450 Nm). The sleeper saloon that loves Stage 2.',
  tagline: 'B58 in a four-door suit.',
  image: '/cars/bmw-340i-f30.jpg',
  modTags: ['bmw', '340i', 'f30', 'b58', 'rwd', 'turbo'],
  specOptions: [
    stepTronicTransmission({
      autoDefault: true,
      manualWeightDelta: -25,
      manualZeroToSixtyDelta: 0.25,
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
