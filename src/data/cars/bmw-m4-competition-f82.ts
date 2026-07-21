import type { CarModel } from '../../types/catalog'
import { coloursF8xM } from './colourPresets'
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

/** F82 M4 Competition — S55 with Competition Package. */
export const bmwM4CompetitionF82: CarModel = {
  id: 'bmw-m4-competition-f82',
  make: 'BMW',
  series: '4 Series',
  model: 'M4',
  generation: 'F82',
  label: 'M4 Competition',
  years: [2016, 2017, 2018, 2019, 2020],
  colours: coloursF8xM,
  basePrice: 67430,
  euBasePrice: 67430,
  baseFigures: {
    hp: 450,
    torqueNm: 550,
    zeroToSixtySec: 4.0,
    weightKg: 1585,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'S55B30T0',
  },
  figuresSource: 'oem',
  description:
    'F82 M4 Competition Package — S55 (UK: 450 PS / 550 Nm). Sharper chassis mapping and more power than the standard M4.',
  tagline: 'F82 with claws out.',
  image: '/cars/bmw-m4-competition-f82.jpg',
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
