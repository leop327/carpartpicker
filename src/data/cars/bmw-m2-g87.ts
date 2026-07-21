import type { CarModel } from '../../types/catalog'
import { C } from './colourPresets'
import {
  interiorTrim,
  mDriversPackage,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/**
 * G87 M2 — UK figures (S58).
 * Pre-LCI ~460 PS; MY2025 LCI 480 PS (UK press).
 */
export const bmwM2G87: CarModel = {
  id: 'bmw-m2-g87',
  make: 'BMW',
  series: '2 Series',
  model: 'M2',
  generation: 'G87',
  label: 'M2',
  years: [2023, 2024, 2025, 2026],
  colours: [
    C.zaneGrey,
    C.torontoRed,
    C.portimaoBlue,
    C.alpineWhite,
    C.blackSapphire,
    C.saoPauloYellow,
    C.fireRed,
    C.skyscraperGrey,
    C.brooklynGrey,
  ],
  basePrice: 64890,
  euBasePrice: 64890,
  baseFigures: {
    hp: 460,
    torqueNm: 550,
    zeroToSixtySec: 4.1,
    weightKg: 1775,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'S58B30T0',
  },
  figuresSource: 'oem',
  yearFigures: {
    // MY2025 LCI — 480 PS / 600 Nm (auto)
    2025: { hp: 20, torqueNm: 50, zeroToSixtySec: -0.1 },
    2026: { hp: 20, torqueNm: 50, zeroToSixtySec: -0.1 },
  },
  description:
    'G87 M2 — twin-turbo S58. Pre-LCI UK: 460 PS / 550 Nm (4.1s auto). MY2025 LCI: 480 PS / 600 Nm auto.',
  tagline: 'Compact M, modern S58.',
  image: '/cars/bmw-g87-m2.jpg',
  modTags: ['bmw', 'm2', 'g87', 's58', 'rwd', 'turbo', 'petrol'],
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
        {
          id: 'manual',
          name: '6-speed manual',
          price: 0,
          figuresDelta: { zeroToSixtySec: 0.2 },
        },
      ],
    },
    interiorTrim({ merinoStandard: true }),
    mDriversPackage(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
