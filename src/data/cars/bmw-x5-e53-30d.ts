import type { CarModel } from '../../types/catalog'
import {
  interiorTrim,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/** E53 X5 3.0d — M57D30. */
export const bmwX5E5330d: CarModel = {
  id: 'bmw-x5-e53-30d',
  make: 'BMW',
  series: 'X5',
  model: 'X5',
  generation: 'E53',
  label: 'X5 3.0d',
  years: [2003, 2004, 2005, 2006],
  colours: [
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'jet-black', name: 'Jet Black', hex: '#0B0B0C' },
    { id: 'titanium-silver', name: 'Titanium Silver Metallic', hex: '#C5C7CA' },
    { id: 'orient-blue', name: 'Orient Blue Metallic', hex: '#1A3A5C' },
  ],
  basePrice: 40450,
  euBasePrice: 40450,
  baseFigures: {
    hp: 218,
    torqueNm: 500,
    zeroToSixtySec: 8.3,
    weightKg: 2150,
    drivetrain: 'AWD',
    engineSizeL: 3.0,
    engineCode: 'M57D30',
  },
  figuresSource: 'oem',
  description:
    'E53 X5 3.0d — M57 straight-six diesel (UK LCI: 218 PS / 500 Nm). Torque for days.',
  tagline: 'Diesel torque, SAV manners.',
  image: '/cars/bmw-e70-x5.jpg',
  modTags: ['bmw', 'e53', 'x5', 'm57', 'diesel', 'awd', 'xdrive'],
  specOptions: [
    {
      id: 'transmission',
      name: 'Transmission',
      required: true,
      choices: [
        {
          id: 'auto',
          name: '6-speed Steptronic',
          price: 0,
          isDefault: true,
        },
      ],
    },
    interiorTrim(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
