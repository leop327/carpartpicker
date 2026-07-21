import type { CarModel } from '../../types/catalog'
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
  years: [2021, 2022, 2023, 2024, 2025],
  colours: [
    { id: 'isle-of-man-green', name: 'Isle of Man Green Metallic', hex: '#1A4A3A' },
    { id: 'sao-paulo-yellow', name: 'Sao Paulo Yellow', hex: '#E8C41A' },
    { id: 'toronto-red', name: 'Toronto Red Metallic', hex: '#A81C23' },
    { id: 'brooklyn-grey', name: 'Brooklyn Grey Metallic', hex: '#6B6E73' },
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
  ],
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
  description:
    'G82 M4 Competition — twin-turbo S58 (UK: 510 PS / 650 Nm). Coupe counterpart to G80 Competition; xDrive option 3.5s.',
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
