import type { CarModel } from '../../types/catalog'
import {
  adaptiveMSportSuspension,
  mSportBrakesOption,
  parkingAndCameras,
  stepTronicTransmission,
  sunProtectionGlass,
} from './specHelpers'

/** E92 335i N55 — single turbo successor. */
export const bmw335iE92N55: CarModel = {
  id: 'bmw-335i-e92-n55',
  make: 'BMW',
  series: '3 Series',
  model: '335i',
  generation: 'E92',
  label: '335i N55',
  years: [2011, 2012, 2013],
  colours: [
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'mineral-grey', name: 'Mineral Grey Metallic', hex: '#6B6E73' },
    { id: 'estoril-blue', name: 'Estoril Blue Metallic', hex: '#1E4D8C' },
    { id: 'melbourne-red', name: 'Melbourne Red Metallic', hex: '#A81C23' },
  ],
  basePrice: 36500,
  euBasePrice: 36500,
  baseFigures: {
    hp: 306,
    torqueNm: 400,
    zeroToSixtySec: 5.4,
    weightKg: 1605,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'N55B30',
  },
  figuresSource: 'oem',
  description:
    'E92 LCI 335i — N55B30 single twin-scroll turbo (UK: 306 PS / 400 Nm). Cleaner emissions, still very tunable.',
  tagline: 'Same badge, single turbo.',
  image: '/cars/bmw-335i-e92.jpg',
  modTags: ['bmw', '335i', 'e92', 'n55', 'rwd', 'turbo'],
  specOptions: [
    stepTronicTransmission({
      autoDefault: true,
      manualWeightDelta: -20,
      manualZeroToSixtyDelta: 0.2,
    }),
    adaptiveMSportSuspension(),
    mSportBrakesOption(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
