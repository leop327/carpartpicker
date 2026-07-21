import type { CarModel } from '../../types/catalog'
import { coloursG8xCompetition } from './colourPresets'
import {
  interiorTrim,
  mDriversPackage,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/**
 * G80 M3 Competition — UK figures (S58).
 * Launch 510 PS; later LCI Competition often listed at 530 PS.
 */
export const bmwM3CompetitionG80: CarModel = {
  id: 'bmw-m3-competition-g80',
  make: 'BMW',
  series: '3 Series',
  model: 'M3 Competition',
  generation: 'G80',
  label: 'M3 Competition',
  years: [2021, 2022, 2023, 2024, 2025, 2026],
  colours: coloursG8xCompetition,
  basePrice: 75660,
  euBasePrice: 75660,
  baseFigures: {
    hp: 510,
    torqueNm: 650,
    zeroToSixtySec: 3.9,
    weightKg: 1805,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'S58B30T0',
  },
  figuresSource: 'oem',
  yearFigures: {
    2024: { hp: 20 },
    2025: { hp: 20 },
    2026: { hp: 20 },
  },
  description:
    'G80 M3 Competition — twin-turbo S58 (UK launch: 510 PS / 650 Nm; later 530 PS). 8-speed M Steptronic. RWD 0–62 ~3.9s; M xDrive ~3.5s.',
  tagline: 'The new-school M3 that still goes sideways.',
  image: '/cars/bmw-g80-m3.jpg',
  modTags: ['bmw', 'm3', 'g80', 's58', 'rwd', 'turbo', 'petrol'],
  specOptions: [
    {
      id: 'transmission',
      name: 'Transmission',
      required: true,
      choices: [
        {
          id: 'auto',
          name: '8-speed M Steptronic',
          price: 0,
          isDefault: true,
        },
      ],
    },
    {
      id: 'drivetrain',
      name: 'Drivetrain',
      required: true,
      choices: [
        { id: 'rwd', name: 'Rear-wheel drive', price: 0, isDefault: true },
        {
          id: 'xdrive',
          name: 'M xDrive',
          price: 0,
          figuresDelta: {
            zeroToSixtySec: -0.4,
            weightKg: 50,
            drivetrain: 'AWD',
          },
          description: 'Competition xDrive — 3.5s 0–62 (UK).',
        },
      ],
    },
    interiorTrim({ merinoStandard: true }),
    mDriversPackage(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
