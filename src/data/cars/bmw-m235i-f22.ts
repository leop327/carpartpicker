import type { CarModel } from '../../types/catalog'
import {
  adaptiveMSportSuspension,
  mSportBrakesOption,
  parkingAndCameras,
  stepTronicTransmission,
  sunProtectionGlass,
} from './specHelpers'

/**
 * F22 M235i — BMW UK figures.
 * Manual or 8-speed Steptronic; Adaptive M Sport suspension optional.
 * xDrive existed in some markets — uncommon in UK retail so omitted for UK accuracy.
 */
export const bmwM235iF22: CarModel = {
  id: 'bmw-m235i-f22',
  make: 'BMW',
  series: '2 Series',
  model: 'M235i',
  generation: 'F22',
  label: 'M235i',
  years: [2014, 2015, 2016],
  colours: [
    { id: 'mineral-grey', name: 'Mineral Grey Metallic', hex: '#6B6E73' },
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'estoril-blue', name: 'Estoril Blue Metallic', hex: '#1E4D8C' },
    { id: 'valencia-orange', name: 'Valencia Orange Metallic', hex: '#C45A1A' },
  ],
  basePrice: 34250,
  baseFigures: {
    hp: 326,
    torqueNm: 450,
    zeroToSixtySec: 4.8,
    weightKg: 1525,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'N55B30',
  },
  figuresSource: 'oem',
  description:
    'F22 M235i Coupe — N55B30 (UK: 326 PS / 450 Nm) before the dedicated M2.',
  tagline: 'The baby M that punched above its badge.',
  image: '/cars/bmw-m235i-f22.jpg',
  modTags: ['bmw', 'm235i', 'f22', 'n55', 'rwd', 'turbo'],
  specOptions: [
    stepTronicTransmission({
      autoDefault: true,
      manualWeightDelta: -20,
      manualZeroToSixtyDelta: 0.2,
    }),
    adaptiveMSportSuspension(),
    mSportBrakesOption(),
    {
      id: 'seats',
      name: 'Seats',
      required: false,
      choices: [
        { id: 'sport', name: 'Sport seats (standard)', price: 0, isDefault: true },
        {
          id: 'electric',
          name: 'Electric front seats with driver memory',
          price: 0,
        },
      ],
    },
    {
      id: 'wheels',
      name: 'Wheels',
      required: false,
      choices: [
        {
          id: '18',
          name: '18" M Sport alloys (standard)',
          price: 0,
          isDefault: true,
        },
        {
          id: '19',
          name: '19" Style 436M',
          price: 0,
          figuresDelta: { weightKg: -2 },
        },
      ],
    },
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
