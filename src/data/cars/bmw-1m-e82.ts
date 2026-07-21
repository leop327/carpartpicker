import type { CarModel } from '../../types/catalog'
import {
  e82Suspension,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/** E82 1M Coupe — limited N54 special. */
export const bmw1mE82: CarModel = {
  id: 'bmw-1m-e82',
  make: 'BMW',
  series: '1 Series',
  model: '1M',
  generation: 'E82',
  label: '1M Coupe',
  years: [2011, 2012],
  colours: [
    { id: 'valencia-orange', name: 'Valencia Orange', hex: '#C45A1A' },
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
  ],
  basePrice: 40020,
  euBasePrice: 40020,
  baseFigures: {
    hp: 340,
    torqueNm: 450,
    zeroToSixtySec: 4.9,
    weightKg: 1495,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'N54B30TO',
  },
  figuresSource: 'oem',
  description:
    'E82 1 Series M Coupe — N54 twin-turbo (UK: 340 PS / 450 Nm, overboost). Limited-run M car that punched above its weight.',
  tagline: 'The orange legend.',
  image: '/cars/bmw-1m-e82.jpg',
  modTags: ['bmw', '1m', 'e82', 'n54', 'rwd', 'turbo'],
  specOptions: [
    {
      id: 'transmission',
      name: 'Transmission',
      required: false,
      choices: [
        {
          id: 'manual',
          name: '6-speed manual',
          price: 0,
          isDefault: true,
          description: 'Only transmission offered on 1M.',
        },
      ],
    },
    e82Suspension(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
