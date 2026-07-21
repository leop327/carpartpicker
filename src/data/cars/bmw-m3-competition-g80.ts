import type { CarModel } from '../../types/catalog'
import {
  interiorTrim,
  mDriversPackage,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/**
 * G80 M3 Competition — UK figures (S58).
 * Standard G80 M3 was 480 PS; Competition 510 PS is the common UK spec.
 */
export const bmwM3CompetitionG80: CarModel = {
  id: 'bmw-m3-competition-g80',
  make: 'BMW',
  series: '3 Series',
  model: 'M3 Competition',
  generation: 'G80',
  label: 'M3 Competition',
  years: [2021, 2022, 2023, 2024, 2025],
  colours: [
    { id: 'isle-of-man-green', name: 'Isle of Man Green Metallic', hex: '#1A4A3A' },
    { id: 'sao-paulo-yellow', name: 'Sao Paulo Yellow', hex: '#E8C41A' },
    { id: 'toronto-red', name: 'Toronto Red Metallic', hex: '#A81C23' },
    { id: 'brooklyn-grey', name: 'Brooklyn Grey Metallic', hex: '#6B6E73' },
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
  ],
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
  description:
    'G80 M3 Competition — twin-turbo S58 (UK: 510 PS / 650 Nm), 8-speed M Steptronic. RWD 0–62 3.9s; M xDrive 3.5s.',
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
