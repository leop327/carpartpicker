import type { CarModel } from '../../types/catalog'
import { coloursM2F87 } from './colourPresets'
import {
  f87Brakes,
  f87FixedSuspension,
  f87Seats,
  f87Wheels,
  interiorTrim,
  mDctTransmission,
  mDriversPackage,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/**
 * F87 M2 — BMW UK figures.
 * Factory colours (UK press): Alpine White, Black Sapphire, Mineral Grey, Long Beach Blue only.
 * No factory Adaptive suspension or carbon ceramics (those arrived with M2 CS only).
 */
export const bmwM2F87: CarModel = {
  id: 'bmw-m2-f87',
  make: 'BMW',
  series: '2 Series',
  model: 'M2',
  generation: 'F87',
  label: 'M2',
  years: [2016, 2017, 2018],
  colours: coloursM2F87,
  basePrice: 44525,
  baseFigures: {
    hp: 370,
    torqueNm: 465,
    zeroToSixtySec: 4.3,
    weightKg: 1495,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'N55B30T0',
  },
  figuresSource: 'oem',
  yearFigures: {
    2018: { weightKg: 5 },
  },
  description:
    'F87 M2 — high-output N55B30T0 (UK: 370 PS / 465 Nm), Active M Differential. Fixed M Sport suspension from the factory. Four factory paints only.',
  tagline: 'Compact, angry, and properly M.',
  image: '/cars/paint/bmw-m2-f87--long-beach-blue.jpg',
  modTags: ['bmw', 'm2', 'f87', 'n55', 'rwd', 'turbo'],
  specOptions: [
    mDctTransmission(-0.2),
    f87FixedSuspension('M Sport suspension (standard)'),
    f87Seats(false),
    f87Wheels(false),
    f87Brakes(),
    interiorTrim({}),
    mDriversPackage(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
