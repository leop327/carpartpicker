import type { CarModel } from '../../types/catalog'
import {
  e82MSportPackage,
  e82Suspension,
  e82Transmission,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/**
 * E82 LCI 135i N55 — BMW UK / EU DIN figures.
 * LCI could be ordered with 7-speed dual-clutch (DKG).
 */
export const bmw135iE82N55: CarModel = {
  id: 'bmw-135i-e82-n55',
  make: 'BMW',
  model: '135i',
  generation: 'E82',
  label: '135i N55',
  years: [2011, 2012, 2013],
  colours: [
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'mineral-grey', name: 'Mineral Grey Metallic', hex: '#6B6E73' },
    { id: 'le-mans-blue', name: 'Le Mans Blue Metallic', hex: '#1E4D8C' },
    { id: 'valencia-orange', name: 'Valencia Orange Metallic', hex: '#C45A1A' },
    { id: 'vermilion-red', name: 'Vermilion Red Metallic', hex: '#A81C23' },
  ],
  basePrice: 34450,
  baseFigures: {
    hp: 306,
    torqueNm: 400,
    zeroToSixtySec: 5.3,
    weightKg: 1540,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'N55B30',
  },
  figuresSource: 'oem',
  description:
    'E82 LCI 135i — single twin-scroll turbo N55B30 (UK DIN: 306 PS / 400 Nm). Optional 7-speed dual-clutch.',
  tagline: 'Single turbo, still a weapon.',
  image: '/cars/bmw-135i-e82.jpg',
  modTags: ['bmw', 'e82', '135i', 'n55', 'rwd', 'turbo'],
  specOptions: [
    e82Transmission(true),
    e82MSportPackage(),
    e82Suspension(),
    {
      id: 'seats',
      name: 'Seats',
      required: false,
      choices: [
        { id: 'standard', name: 'Standard seats', price: 0, isDefault: true },
        { id: 'sports', name: 'Sports seats', price: 0 },
      ],
    },
    {
      id: 'wheels',
      name: 'Wheels',
      required: false,
      choices: [
        { id: '17', name: '17" alloys (typical base)', price: 0, isDefault: true },
        {
          id: '18',
          name: '18" Style 261M / 313 (M Sport)',
          price: 0,
          figuresDelta: { weightKg: -2 },
        },
      ],
    },
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
