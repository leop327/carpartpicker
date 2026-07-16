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
 * F80 M3 — BMW UK figures (standard S55, pre-Competition).
 * Spec options aligned to UK M3/M4 price lists (CFRP roof, Adaptive, Shadowline std).
 */
export const bmwM3F80: CarModel = {
  id: 'bmw-m3-f80',
  make: 'BMW',
  model: 'M3',
  generation: 'F80',
  label: 'M3',
  years: [2014, 2015, 2016, 2017, 2018],
  colours: [
    { id: 'yas-marina-blue', name: 'Yas Marina Blue Metallic', hex: '#1B4F72' },
    { id: 'sakhir-orange', name: 'Sakhir Orange Metallic', hex: '#C45A1A' },
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'mineral-grey', name: 'Mineral Grey Metallic', hex: '#6B6E73' },
    { id: 'silverstone', name: 'Silverstone Metallic', hex: '#A8ADB4' },
  ],
  basePrice: 56430,
  euBasePrice: 56430,
  baseFigures: {
    hp: 431,
    torqueNm: 550,
    zeroToSixtySec: 4.3,
    weightKg: 1560,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'S55B30T0',
  },
  figuresSource: 'oem',
  yearFigures: {
    2018: { weightKg: 5 },
  },
  description:
    'F80 M3 sedan — twin-turbo S55B30T0 (UK: 431 PS / 550 Nm), Active M Differential. CFRP roof and Adaptive M Suspension standard in the UK.',
  tagline: 'The four-door that still goes to war.',
  image: '/cars/bmw-m3-f80.jpg',
  modTags: ['bmw', 'm3', 'f80', 's55', 'rwd', 'turbo'],
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
