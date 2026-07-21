import type { CarModel } from '../../types/catalog'
import { coloursM2CompetitionF87 } from './colourPresets'
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
 * F87 M2 Competition — BMW UK figures.
 * UK brochure paints: Alpine White, Black Sapphire, Long Beach Blue, Sunset Orange, Hockenheim Silver.
 */
export const bmwM2CompetitionF87: CarModel = {
  id: 'bmw-m2-competition-f87',
  make: 'BMW',
  series: '2 Series',
  model: 'M2 Competition',
  generation: 'F87',
  label: 'M2 Competition',
  years: [2018, 2019, 2020, 2021],
  colours: coloursM2CompetitionF87,
  basePrice: 51255,
  baseFigures: {
    hp: 410,
    torqueNm: 550,
    zeroToSixtySec: 4.2,
    weightKg: 1550,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'S55B30T0',
  },
  figuresSource: 'oem',
  description:
    'F87 M2 Competition — S55B30T0 (UK: 410 PS / 550 Nm). Adaptive dampers and carbon ceramics were not factory options (CS only).',
  tagline: 'M4 heart in an M2 suit.',
  image: '/cars/bmw-m2-competition-f87.jpg',
  modTags: ['bmw', 'm2', 'm2c', 'f87', 's55', 'rwd', 'turbo'],
  specOptions: [
    mDctTransmission(-0.2),
    f87FixedSuspension('M-specific Sport suspension (standard)'),
    f87Seats(true),
    f87Wheels(true),
    f87Brakes(),
    interiorTrim({ carbonStandard: true }),
    mDriversPackage(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
