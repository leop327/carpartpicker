import type { CarModel } from '../../types/catalog'
import {
  f8xAdaptiveStandard,
  f8xBrakes,
  f8xCarbonRoofStandard,
  f8xSeats,
  f8xWheels,
  interiorTrim,
  mDctTransmission,
  mDriversPackage,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/**
 * F82 M4 Coupé — BMW UK figures (standard S55, pre-Competition).
 * Spec options aligned to UK M3/M4 price lists.
 */
export const bmwM4F82: CarModel = {
  id: 'bmw-m4-f82',
  make: 'BMW',
  series: '4 Series',
  model: 'M4',
  generation: 'F82',
  label: 'M4',
  years: [2014, 2015, 2016, 2017, 2018, 2019, 2020],
  colours: [
    { id: 'austin-yellow', name: 'Austin Yellow Metallic', hex: '#C5A000' },
    { id: 'sakhir-orange', name: 'Sakhir Orange Metallic', hex: '#C45A1A' },
    { id: 'yas-marina-blue', name: 'Yas Marina Blue Metallic', hex: '#1B4F72' },
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'mineral-grey', name: 'Mineral Grey Metallic', hex: '#6B6E73' },
  ],
  basePrice: 57430,
  euBasePrice: 57430,
  baseFigures: {
    hp: 431,
    torqueNm: 550,
    zeroToSixtySec: 4.3,
    weightKg: 1570,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'S55B30T0',
  },
  figuresSource: 'oem',
  yearFigures: {
    2017: { weightKg: 5 },
  },
  description:
    'F82 M4 Coupé — twin-turbo S55B30T0 (UK: 431 PS / 550 Nm). CFRP roof and Adaptive M Suspension standard in the UK.',
  tagline: 'The S55 icon in two-door form.',
  image: '/cars/bmw-m4-f82.jpg',
  modTags: ['bmw', 'm4', 'f82', 's55', 'rwd', 'turbo'],
  specOptions: [
    mDctTransmission(-0.2),
    f8xAdaptiveStandard(),
    f8xCarbonRoofStandard(),
    f8xSeats(),
    f8xWheels(),
    f8xBrakes(),
    interiorTrim({ merinoStandard: true }),
    mDriversPackage(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
