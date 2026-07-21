import type { CarModel } from '../../types/catalog'
import { coloursG8xCompetition } from './colourPresets'
import {
  interiorTrim,
  mDriversPackage,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/** G82 M4 Competition — UK figures (S58). */
export const bmwM4CompetitionG82: CarModel = {
  id: 'bmw-m4-competition-g82',
  make: 'BMW',
  series: '4 Series',
  model: 'M4 Competition',
  generation: 'G82',
  label: 'M4 Competition',
  years: [2021, 2022, 2023, 2024, 2025, 2026],
  colours: coloursG8xCompetition,
  basePrice: 80905,
  euBasePrice: 80905,
  baseFigures: {
    hp: 510,
    torqueNm: 650,
    zeroToSixtySec: 3.9,
    weightKg: 1800,
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
    'G82 M4 Competition — twin-turbo S58 (UK launch: 510 PS / 650 Nm; later 530 PS). Coupe counterpart to G80 Competition; xDrive ~3.5s.',
  tagline: 'Competition coupe, S58 heart.',
  image: '/cars/bmw-g82-m4.jpg',
  modTags: ['bmw', 'm4', 'g82', 's58', 'rwd', 'turbo', 'petrol'],
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
        },
      ],
    },
    interiorTrim({ merinoStandard: true }),
    mDriversPackage(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
