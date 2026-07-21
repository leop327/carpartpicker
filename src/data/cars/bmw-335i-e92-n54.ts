import type { CarModel } from '../../types/catalog'
import {
  adaptiveMSportSuspension,
  mSportBrakesOption,
  parkingAndCameras,
  stepTronicTransmission,
  sunProtectionGlass,
} from './specHelpers'

/** E92 335i N54 — twin-turbo classic. */
export const bmw335iE92N54: CarModel = {
  id: 'bmw-335i-e92-n54',
  make: 'BMW',
  series: '3 Series',
  model: '335i',
  generation: 'E92',
  label: '335i N54',
  years: [2007, 2008, 2009, 2010],
  colours: [
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'jet-black', name: 'Jet Black', hex: '#0B0B0C' },
    { id: 'space-grey', name: 'Space Grey Metallic', hex: '#5C6168' },
    { id: 'montego-blue', name: 'Montego Blue Metallic', hex: '#1A3A5C' },
    { id: 'melbourne-red', name: 'Melbourne Red Metallic', hex: '#A81C23' },
    { id: 'titanium-silver', name: 'Titanium Silver Metallic', hex: '#C5C7CA' },
  ],
  basePrice: 34500,
  euBasePrice: 34500,
  baseFigures: {
    hp: 306,
    torqueNm: 400,
    zeroToSixtySec: 5.5,
    weightKg: 1610,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'N54B30',
  },
  figuresSource: 'oem',
  description:
    'E92 335i Coupé — N54B30 twin-turbo (UK: 306 PS / 400 Nm). The platform that defined the modern BMW tuning scene.',
  tagline: 'Twin-turbo pioneer.',
  image: '/cars/bmw-335i-e92.jpg',
  modTags: ['bmw', '335i', 'e92', 'n54', 'rwd', 'turbo'],
  specOptions: [
    stepTronicTransmission({
      autoDefault: false,
      manualWeightDelta: -20,
      manualZeroToSixtyDelta: 0.15,
    }),
    adaptiveMSportSuspension(),
    mSportBrakesOption(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
