import type { CarModel } from '../../types/catalog'
import {
  adaptiveMSportSuspension,
  mSportBrakesOption,
  parkingAndCameras,
  stepTronicTransmission,
  sunProtectionGlass,
} from './specHelpers'

/** F32 440i — B58 coupe. */
export const bmw440iF32: CarModel = {
  id: 'bmw-440i-f32',
  make: 'BMW',
  series: '4 Series',
  model: '440i',
  generation: 'F32',
  label: '440i',
  years: [2016, 2017, 2018, 2019, 2020],
  colours: [
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'mineral-grey', name: 'Mineral Grey Metallic', hex: '#6B6E73' },
    { id: 'estoril-blue', name: 'Estoril Blue Metallic', hex: '#1E4D8C' },
    { id: 'sunset-orange', name: 'Sunset Orange Metallic', hex: '#C45A1A' },
  ],
  basePrice: 42990,
  euBasePrice: 42990,
  baseFigures: {
    hp: 326,
    torqueNm: 450,
    zeroToSixtySec: 5.0,
    weightKg: 1590,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'B58B30M0',
  },
  figuresSource: 'oem',
  description:
    'F32 440i Coupé — B58B30M0 (UK: 326 PS / 450 Nm). Same heart as the 340i, better shape.',
  tagline: 'The B58 coupe.',
  image: '/cars/bmw-440i-f32.jpg',
  modTags: ['bmw', '440i', 'f32', 'b58', 'rwd', 'turbo'],
  specOptions: [
    stepTronicTransmission({
      autoDefault: true,
      manualWeightDelta: -25,
      manualZeroToSixtyDelta: 0.2,
    }),
    adaptiveMSportSuspension(),
    mSportBrakesOption(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
