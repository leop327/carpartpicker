import type { CarModel } from '../../types/catalog'
import {
  e82MSportPackage,
  e82Suspension,
  e82Transmission,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/**
 * E82 135i N54 — BMW UK / EU DIN figures.
 */
export const bmw135iE82N54: CarModel = {
  id: 'bmw-135i-e82-n54',
  make: 'BMW',
  model: '135i',
  generation: 'E82',
  label: '135i N54',
  years: [2008, 2009, 2010],
  colours: [
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'jet-black', name: 'Jet Black', hex: '#0B0B0C' },
    { id: 'space-grey', name: 'Space Grey Metallic', hex: '#5C6168' },
    { id: 'montego-blue', name: 'Montego Blue Metallic', hex: '#1A3A5C' },
    { id: 'crimson-red', name: 'Crimson Red', hex: '#8B1A1A' },
    { id: 'titanium-silver', name: 'Titanium Silver Metallic', hex: '#C5C7CA' },
  ],
  basePrice: 32950,
  baseFigures: {
    hp: 306,
    torqueNm: 400,
    zeroToSixtySec: 5.3,
    weightKg: 1530,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'N54B30',
  },
  figuresSource: 'oem',
  description:
    'E82 1 Series Coupe 135i — twin-turbo N54B30 (UK DIN: 306 PS / 400 Nm).',
  tagline: 'The twin-turbo that started the internet.',
  image: '/cars/bmw-135i-e82.jpg',
  modTags: ['bmw', 'e82', '135i', 'n54', 'rwd', 'turbo'],
  specOptions: [
    e82Transmission(false),
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
