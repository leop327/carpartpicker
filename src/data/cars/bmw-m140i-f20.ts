import type { CarModel } from '../../types/catalog'
import {
  adaptiveMSportSuspension,
  mSportBrakesOption,
  parkingAndCameras,
  stepTronicTransmission,
  sunProtectionGlass,
} from './specHelpers'

/**
 * F20/F21 M140i — BMW UK figures.
 * UK market was RWD only — xDrive was not officially sold here.
 */
export const bmwM140iF20: CarModel = {
  id: 'bmw-m140i-f20',
  make: 'BMW',
  model: 'M140i',
  generation: 'F20',
  label: 'M140i',
  years: [2016, 2017, 2018, 2019],
  colours: [
    { id: 'estoril-blue', name: 'Estoril Blue Metallic', hex: '#1E4D8C' },
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'mineral-grey', name: 'Mineral Grey Metallic', hex: '#6B6E73' },
    { id: 'melbourne-red', name: 'Melbourne Red Metallic', hex: '#A81C23' },
  ],
  basePrice: 35570,
  euBasePrice: 35570,
  baseFigures: {
    hp: 340,
    torqueNm: 500,
    zeroToSixtySec: 4.6,
    weightKg: 1510,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'B58B30M0',
  },
  figuresSource: 'oem',
  yearFigures: {
    2019: { weightKg: 10 },
  },
  description:
    'F20/F21 M140i — B58B30M0 (UK: 340 PS / 500 Nm). UK cars were RWD only; Adaptive M Sport suspension was optional.',
  tagline: 'The last great hot hatch straight-six.',
  image: '/cars/bmw-m140i-f20.jpg',
  modTags: ['bmw', 'm140i', 'f20', 'b58', 'rwd', 'turbo'],
  specOptions: [
    stepTronicTransmission({
      autoDefault: true,
      manualWeightDelta: -25,
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
        {
          id: 'heated',
          name: 'Heated front seats',
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
          name: '19" M Style alloys',
          price: 0,
          figuresDelta: { weightKg: -2 },
        },
      ],
    },
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
